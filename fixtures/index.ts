import { test as base, expect, Page } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { optionalEnv, requireEnv } from '../utils/env'
import { OpenWeatherClient } from '../utils/openWeatherClient'

export type Fixtures = {
	loginPage: LoginPage
	inventoryPage: InventoryPage
	cartPage: CartPage
	checkoutPage: CheckoutPage
	loggedInPage: Page
	openWeather: OpenWeatherClient
}

export const test = base.extend<Fixtures>({
	loginPage: async ({ page }, use) => await use(new LoginPage(page)),
	inventoryPage: async ({ page }, use) => await use(new InventoryPage(page)),
	cartPage: async ({ page }, use) => await use(new CartPage(page)),
	checkoutPage: async ({ page }, use) => await use(new CheckoutPage(page)),

	loggedInPage: async ({ page, loginPage }, use) => {
		const user = requireEnv('STANDARD_USER')
		const pass = requireEnv('PASSWORD')
		await loginPage.goto()
		await loginPage.login(user, pass)
		await expect(page).toHaveURL(/inventory/)
		await use(page)
	},

	// Unlike the UI credentials, a missing API key skips the test instead of failing it,
	// so the suite stays green on machines (or CI forks) that have no key.
	openWeather: async ({ request }, use) => {
		const apiKey = optionalEnv('OPENWEATHER_API_KEY') ?? ''
		// eslint-disable-next-line playwright/no-skipped-test -- deliberate: no key means no API tests
		test.skip(apiKey === '', 'OPENWEATHER_API_KEY is not set')
		await use(new OpenWeatherClient(request, apiKey))
	},
})

export { expect }
