import { defineConfig, devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(__dirname, '.env'), quiet: true })

export default defineConfig({
	testDir: './tests',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: process.env.BASE_URL,
		// Sauce Demo marks elements with data-test, so getByTestId targets that attribute.
		testIdAttribute: 'data-test',
		trace: 'on-first-retry',
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
