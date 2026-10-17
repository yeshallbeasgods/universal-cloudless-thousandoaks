import { defineConfig } from 'allure'

export default defineConfig({
	name: 'Playwright + TypeScript: Sauce Demo and OpenWeather',
	output: './allure-report',
	// Trend charts need earlier runs. CI copies the last published history file to this path before
	// generating, and publishes the updated file afterwards. Locally it just builds up in this folder.
	historyPath: './allure-history/history.jsonl',
	appendHistory: true,
	historyLimit: 30,
})
