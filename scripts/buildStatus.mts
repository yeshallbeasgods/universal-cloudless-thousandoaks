// Writes the status.json that the landing page (site/) reads. Run by CI after the report is built:
//   node scripts/buildStatus.mts publish/status.json
// Job results arrive as LINT_RESULT / UI_RESULT / API_RESULT (the values of `needs.<job>.result`).
import fs from 'node:fs'
import path from 'node:path'

const env = process.env
const outputFile = process.argv[2]
if (!outputFile) {
	throw new Error('Usage: node scripts/buildStatus.mts <output-file>')
}

// Counts come from Allure's own result files, so they match the report the page links to.
// Every retry attempt is a separate result file with the same historyId, so each test is counted once,
// by its last attempt. A test that failed and then passed on retry is counted as passed and as flaky.
interface AllureResult {
	historyId?: string
	status?: string
	stop?: number
}

const resultsDir = env.ALLURE_RESULTS_DIR ?? 'allure-results'
const tests = { total: 0, passed: 0, failed: 0, broken: 0, skipped: 0, flaky: 0 }
const finalStatus = new Map<string, { status: string; stop: number }>()
const hadFailedAttempt = new Set<string>()

if (fs.existsSync(resultsDir)) {
	for (const file of fs.readdirSync(resultsDir).filter((name) => name.endsWith('-result.json'))) {
		const result = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8')) as AllureResult
		const id = result.historyId ?? file
		const status = result.status ?? 'unknown'
		const stop = result.stop ?? 0
		if (status === 'failed' || status === 'broken') {
			hadFailedAttempt.add(id)
		}
		const previous = finalStatus.get(id)
		if (!previous || stop >= previous.stop) {
			finalStatus.set(id, { status, stop })
		}
	}
}

for (const [id, { status }] of finalStatus) {
	tests.total++
	if (status === 'passed' || status === 'failed' || status === 'broken' || status === 'skipped') {
		tests[status]++
	}
	if (status === 'passed' && hadFailedAttempt.has(id)) {
		tests.flaky++
	}
}

const layers = {
	lint: env.LINT_RESULT ?? 'unknown',
	ui: env.UI_RESULT ?? 'unknown',
	api: env.API_RESULT ?? 'unknown',
}
const overall = Object.values(layers).every((result) => result === 'success') ? 'passed' : 'failed'

const repoUrl = `${env.GITHUB_SERVER_URL ?? 'https://github.com'}/${env.GITHUB_REPOSITORY ?? ''}`
const sha = env.GITHUB_SHA ?? ''

const status = {
	schema: 1,
	project: env.GITHUB_REPOSITORY?.split('/')[1] ?? 'unknown',
	overall,
	generatedAt: new Date().toISOString(),
	trigger: env.GITHUB_EVENT_NAME ?? 'unknown',
	branch: env.GITHUB_REF_NAME ?? 'unknown',
	commit: { sha, short: sha.slice(0, 7), url: `${repoUrl}/commit/${sha}` },
	run: { id: env.GITHUB_RUN_ID ?? '', url: `${repoUrl}/actions/runs/${env.GITHUB_RUN_ID ?? ''}` },
	layers,
	tests,
	// report: the full report. trends: charts across runs (optional; omit it if a repo has no such page).
	links: { report: 'report/awesome/', trends: 'report/dashboard/', testHealth: null },
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, JSON.stringify(status, null, 2) + '\n')
