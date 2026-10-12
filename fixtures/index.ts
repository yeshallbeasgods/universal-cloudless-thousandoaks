import { test as base, expect, Page } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'
import { CartPage } from '../pages/CartPage'
import { CheckoutPage } from '../pages/CheckoutPage'
import { requireEnv } from '../utils/env'

export type Fixtures = {
	loginPage: LoginPage
	inventoryPage: InventoryPage
	cartPage: CartPage
	checkoutPage: CheckoutPage
	loggedInPage: Page
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
})

export { expect }
