import path from 'node:path'
import { stripVTControlCharacters } from 'node:util'
import type { FullResult, Reporter, Suite, TestCase, TestError, TestResult } from '@playwright/test/reporter'

// A terminal reporter that puts failures first and says plainly what went wrong:
// where (file:line:col, clickable in VS Code), why, and EXPECTED vs RECEIVED instead of -/+.

// It works from the text Playwright puts in error.message, so a Playwright upgrade may necessitate
// changes to the reporter (run a failing test and check the output still looks right).
// Every parsing step falls back to the raw message, so a failure is never hidden.

const useColor = Boolean(process.stdout.isTTY) && !process.env.NO_COLOR
const paint = (code: number, text: string): string => (useColor ? `\u001b[${code}m${text}\u001b[0m` : text)
const red = (text: string): string => paint(31, text)
const green = (text: string): string => paint(32, text)
const yellow = (text: string): string => paint(33, text)
const dim = (text: string): string => paint(2, text)
const bold = (text: string): string => paint(1, text)

const RULE = '─'.repeat(78)

export default class ClearFailureReporter implements Reporter {
	private suite: Suite | undefined
	private startedAt = Date.now()
	private finishedTests = 0

	printsToStdio(): boolean {
		return true
	}

	onBegin(_config: unknown, suite: Suite): void {
		this.suite = suite
		this.startedAt = Date.now()
		console.log(`Running ${suite.allTests().length} tests\n`)
	}

	onTestEnd(test: TestCase, result: TestResult): void {
		this.finishedTests++
		console.log(progressLine(test, result))
	}

	onError(error: TestError): void {
		console.log(`\n${red(bold('✘ ERROR'))} ${rawMessage(error)}\n`)
	}

	onEnd(result: FullResult): void {
		const tests = this.suite?.allTests() ?? []
		if (tests.length > 0 && this.finishedTests === 0 && result.status === 'passed') {
			// `--list` never runs anything, so show what was selected instead of a results summary.
			tests.forEach((test) => console.log(`  ${shortTitle(test)}  ${dim(test.tags.join(' '))}`))
			console.log(`\n${tests.length} tests selected (not run)`)
			return
		}
		const failed = tests.filter((test) => test.outcome() === 'unexpected')
		const flaky = tests.filter((test) => test.outcome() === 'flaky')
		const skipped = tests.filter((test) => test.outcome() === 'skipped')
		const passed = tests.length - failed.length - flaky.length - skipped.length

		for (const test of failed) {
			console.log(renderFailure(test))
		}

		const seconds = ((Date.now() - this.startedAt) / 1000).toFixed(1)
		const counts = [
			green(`${passed} passed`),
			failed.length > 0 ? red(bold(`${failed.length} failed`)) : `${failed.length} failed`,
			flaky.length > 0 ? yellow(`${flaky.length} flaky`) : `${flaky.length} flaky`,
			`${skipped.length} skipped`,
		]
		console.log(`\n${counts.join(dim(' · '))}  ${dim(`(${seconds}s, run ${result.status})`)}`)
		if (failed.length > 0 || flaky.length > 0) {
			console.log(dim('HTML report: npx playwright show-report   |   For agents: test-results/results.json'))
		}
	}
}

function shortTitle(test: TestCase): string {
	// titlePath() is ['', project, file, ...describe blocks, title]
	const [, project, , ...titles] = test.titlePath()
	return `[${project ?? ''}] ${titles.join(' › ')}`
}

function progressLine(test: TestCase, result: TestResult): string {
	const name = shortTitle(test)
	const retry = result.retry > 0 ? dim(` (retry ${result.retry})`) : ''
	const time = dim(` ${result.duration} ms`)
	if (result.status === 'skipped') {
		return `${dim('○ SKIP ')} ${name}`
	}
	if (result.status === test.expectedStatus) {
		// test.fail() tests are expected to fail, so "failing as expected" counts as a pass.
		const label = test.expectedStatus === 'failed' ? yellow('✓ XFAIL') : green('✓ PASS ')
		return `${label} ${name}${retry}${time}`
	}
	return `${red(bold('✘ FAIL '))} ${name}${retry}${time}`
}

function relativeLocation(error: TestError, test: TestCase): string {
	const location = error.location ?? test.location
	return `${path.relative(process.cwd(), location.file)}:${location.line}:${location.column}`
}

function rawMessage(error: TestError): string {
	return stripVTControlCharacters(error.message ?? error.stack ?? error.value ?? 'Unknown error')
}

function renderFailure(test: TestCase): string {
	const result = test.results.at(-1)
	const errors = result?.errors ?? []
	const tags = test.tags.length > 0 ? `  ${dim(test.tags.join(' '))}` : ''
	const project = test.titlePath()[1] ?? ''
	const rerun = `npx playwright test ${path.relative(process.cwd(), test.location.file)}:${test.location.line} --project=${project}`

	const lines = ['', RULE, `${red(bold('✘ FAILED'))}  ${bold(shortTitle(test))}${tags}`, RULE]
	errors.forEach((error, index) => {
		if (errors.length > 1) {
			lines.push(dim(`Failure ${index + 1} of ${errors.length}`))
		}
		lines.push(...renderError(error, test), '')
	})
	lines.push(`${dim('Re-run:')}  ${rerun}`)
	return lines.join('\n')
}

function renderError(error: TestError, test: TestCase): string[] {
	try {
		const message = rawMessage(error)
		const [first = '', ...rest] = message.split('\n')
		const why = first.replace(/^Error:\s*/, '')
		const body = relabelDiff(rest).join('\n').trim()
		const out = [`${bold('Where')}  ${relativeLocation(error, test)}`, `${bold('Why')}    ${why}`]
		if (body) {
			out.push('', ...body.split('\n'))
		}
		if (error.snippet) {
			out.push('', dim('Code'), ...stripVTControlCharacters(error.snippet).split('\n'))
		}
		return out
	} catch {
		// Never let a formatting problem hide a failure: print the original text.
		return [`${bold('Where')}  ${test.location.file}:${test.location.line}`, '', rawMessage(error)]
	}
}

// Playwright prints diffs as "- Expected - N" / "+ Received + N", then lines that start with
// "-" (expected only), "+" (received only) or two spaces (shared). Relabel them so nobody has to
// remember which sign means what. If the header is not found, the lines are returned untouched.
function relabelDiff(lines: string[]): string[] {
	const out: string[] = []
	let inDiff = false
	let seenBody = false
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i] ?? ''
		if (/^- Expected\b/.test(line) && /^\+ Received\b/.test(lines[i + 1] ?? '')) {
			out.push(bold('Differences') + dim('  (EXPECTED = what the test asked for, RECEIVED = what came back)'))
			i++
			inDiff = true
			seenBody = false
			continue
		}
		// A blank line separates the header from the body, and a second one ends the diff.
		if (inDiff && line.trim() === '') {
			if (seenBody) {
				inDiff = false
			} else {
				out.push(line)
				continue
			}
		} else if (inDiff) {
			seenBody = true
		}
		if (inDiff && line.startsWith('-')) {
			out.push(red('EXPECTED') + line.slice(1))
		} else if (inDiff && line.startsWith('+')) {
			out.push(green('RECEIVED') + line.slice(1))
		} else if (inDiff) {
			out.push('        ' + line.slice(1))
		} else {
			out.push(line)
		}
	}
	return out
}
