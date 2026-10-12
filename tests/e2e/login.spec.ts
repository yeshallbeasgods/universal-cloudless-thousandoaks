import { test, expect } from '../../fixtures'
import { requireEnv } from '../../utils/env'

const user = requireEnv('STANDARD_USER')
const pass = requireEnv('PASSWORD')

test('standard user can log in', { tag: '@smoke' }, async ({ page, loginPage }) => {
	await loginPage.goto()
	await loginPage.login(user, pass)
	await expect(page).toHaveURL(/inventory/)
})

test('locked out user is prevented from logging in', { tag: '@regression' }, async ({ loginPage }) => {
		await loginPage.goto()
		await loginPage.login('locked_out_user', pass)
		await expect(loginPage.errorBanner).toContainText('Sorry, this user has been locked out.')
	},
)

// TEMP: tries out the loggedInPage fixture; delete once real specs use it (ticket 3)
test(
	'temp: loggedInPage starts on the inventory page',
	{ tag: '@smoke' },
	async ({ loggedInPage, inventoryPage }) => {
		await expect(loggedInPage).toHaveURL(/inventory/)
		expect(await inventoryPage.getCartBadgeCount()).toBe(0)
		await inventoryPage.addToCart('Sauce Labs Backpack')
		await expect(inventoryPage.cartBadge).toHaveText('1')
	},
)
