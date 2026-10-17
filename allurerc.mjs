import { defineConfig } from 'allure'

export default defineConfig({
	name: 'Playwright + TypeScript: Sauce Demo and OpenWeather',
	output: './allure-report',
	// Trend charts need earlier runs. CI copies the last published history file to this path before
	// generating, and publishes the updated file afterwards. Locally it just builds up in this folder.
	historyPath: './allure-history/history.jsonl',
	appendHistory: true,
	historyLimit: 30,
	// Two views of the same results, each in its own folder under allure-report/:
	// awesome = the full report (suites, steps, attachments), dashboard = charts and trends across runs.
	plugins: {
		awesome: { options: {} },
		dashboard: { options: {} },
	},
})
