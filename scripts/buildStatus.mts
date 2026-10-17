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
const resultsDir = env.ALLURE_RESULTS_DIR ?? 'allure-results'
const tests = { total: 0, passed: 0, failed: 0, broken: 0, skipped: 0 }
if (fs.existsSync(resultsDir)) {
	for (const file of fs.readdirSync(resultsDir).filter((name) => name.endsWith('-result.json'))) {
		const { status } = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8')) as { status?: string }
		tests.total++
		if (status === 'passed' || status === 'failed' || status === 'broken' || status === 'skipped') {
			tests[status]++
		}
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
	links: { report: 'report/', testHealth: null },
}

fs.mkdirSync(path.dirname(outputFile), { recursive: true })
fs.writeFileSync(outputFile, JSON.stringify(status, null, 2) + '\n')
