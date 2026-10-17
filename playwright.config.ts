import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import os from 'node:os'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true })

// Shown on the Allure report's overview page. Only add values that are safe to publish: never keys.
const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env
const environmentInfo: Record<string, string> = {
	browser: 'Chromium (Desktop Chrome)',
	base_url: process.env.BASE_URL ?? 'not set',
	api_base_url: 'https://api.openweathermap.org',
	node_version: process.version,
	os: `${os.platform()} ${os.release()}`,
}
if (GITHUB_SERVER_URL && GITHUB_REPOSITORY && GITHUB_RUN_ID) {
	environmentInfo.ci_run = `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`
}

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		// Terminal output: failures first, with file:line:col and EXPECTED/RECEIVED labels.
		['./reporters/clearFailureReporter.ts'],
		// open: 'never' stops a failing run from starting a report server that blocks the terminal.
		['html', { open: 'never' }],
		// Structured results for agents and scripts.
		['json', { outputFile: 'test-results/results.json' }],
		// Allure results (build the report with `npm run report:generate`). It prints nothing to the terminal.
		['allure-playwright', { resultsDir: 'allure-results', environmentInfo }],
	],
	use: {
		baseURL: process.env.BASE_URL,
		// Sauce Demo marks elements with data-test, so getByTestId targets that attribute.
		testIdAttribute: 'data-test',
		// Failures keep a screenshot and a trace, which both reports attach. (Retries are 0 locally,
		// so 'on-first-retry' would never record a trace here.)
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
	},
	projects: [
		{
			name: 'chromium',
			testIgnore: '**/api/**',
			use: { ...devices['Desktop Chrome'] },
		},
		{
			// No browser: these tests only use the built-in `request` fixture.
			name: 'api',
			testDir: './tests/api',
			use: {
				baseURL: 'https://api.openweathermap.org',
				// Traces record every request URL, and OpenWeather puts the API key in the URL;
				// prevents key from appearing in logs or be exposed to agent.
				trace: 'off',
			},
		},
	],
})
