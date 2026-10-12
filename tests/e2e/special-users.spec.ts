import { test, expect } from '../../fixtures'
import { validCustomer } from '../../test-data/checkoutCases'
import { allProducts, products } from '../../test-data/products'
import { users } from '../../test-data/users'
import { requireEnv } from '../../utils/env'

const pass = requireEnv('PASSWORD')

// Sauce Demo ships users that behave badly on purpose.
//   Performance_glitch_user: login is slow, so the check below allows more time.
//   Problem_user and error_user surface defects. Those tests assert the CORRECT behavior and are
//   marked test.fail(); Playwright reports them as passing while the defect exists, and starts
//   failing them the day it is fixed, which is the signal to remove the marker.

//   Visual_user only differs in layout, so it belongs with the visual tests (TICKET-07). (remove this note then)

test(
	'performance glitch user can log in despite the slow response',
	{
		tag: '@regression',
	},
	async ({ page, loginPage }) => {
		await loginPage.goto()
		await loginPage.login(users.performanceGlitch, pass)
		// The login takes about 5 seconds, which is longer than the default expected timeout.
		await expect(page).toHaveURL(/inventory/, { timeout: 15_000 })
	},
)

const brokenUsers = [users.problem, users.error]

for (const username of brokenUsers) {
	test.describe(username, () => {
		test.beforeEach(async ({ loginPage, inventoryPage }) => {
			await loginPage.goto()
			await loginPage.login(username, pass)
			await inventoryPage.items.first().waitFor()
		})

		test('can add every product to the cart', { tag: '@regression' }, async ({ inventoryPage }) => {
			test.fail(true, 'Known Sauce Demo defect: some products cannot be added to the cart')
			for (const product of allProducts) {
				await inventoryPage.addToCart(product)
			}
			await expect(inventoryPage.cartBadge).toHaveText(String(allProducts.length))
		})

		test(
			'last name field keeps what is typed',
			{ tag: '@regression' },
			async ({ inventoryPage, cartPage, checkoutPage }) => {
				test.fail(true, 'Known Sauce Demo defect: the last name field does not keep its value')
				await inventoryPage.addToCart(products.backpack)
				await inventoryPage.openCart()
				await cartPage.checkout()
				await checkoutPage.fillCustomerInfo(validCustomer.first, validCustomer.last, validCustomer.zip)
				await expect(checkoutPage.lastNameField).toHaveValue(validCustomer.last)
			},
		)
	})
}

test(
	'problem user sees a distinct image for each product',
	{ tag: '@regression' },
	async ({ loginPage, inventoryPage }) => {
		test.fail(true, 'Known Sauce Demo defect: every product shows the same image')
		await loginPage.goto()
		await loginPage.login(users.problem, pass)
		const sources = await inventoryPage.getItemImageSources()
		expect(sources).toHaveLength(allProducts.length)
		expect(new Set(sources).size).toBe(sources.length)
	},
)
