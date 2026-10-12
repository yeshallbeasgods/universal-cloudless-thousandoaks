import { test, expect } from '../../fixtures'
import { requiredFieldCases, validCustomer } from '../../test-data/checkoutCases'
import { products } from '../../test-data/products'

const customer = validCustomer

// beforeEach runs before every test in its describe block, so shared setup is written once.
// Each describe below needs a different starting point, so each has its own beforeEach.

test.describe('checkout with a single item', () => {
	test.beforeEach(async ({ loggedInPage: _loggedInPage, inventoryPage, cartPage }) => {
		await inventoryPage.addToCart(products.backpack)
		await inventoryPage.openCart()
		await cartPage.checkout() // now on "Checkout: Your Information"
	})

	test('can complete a checkout', { tag: '@smoke' }, async ({ checkoutPage }) => {
		await checkoutPage.fillCustomerInfo(customer.first, customer.last, customer.zip)
		await checkoutPage.continueToOverview()
		await checkoutPage.finish()
		await expect(checkoutPage.confirmationHeader).toHaveText('Thank you for your order!')
	})

	// One generated test per entry in test-data/checkoutCases.ts
	for (const { missing, first, last, zip, error } of requiredFieldCases) {
		test(`requires ${missing}`, { tag: '@regression' }, async ({ page, checkoutPage }) => {
			await checkoutPage.fillCustomerInfo(first, last, zip)
			await checkoutPage.continueToOverview()
			await expect(checkoutPage.errorBanner).toContainText(error)
			await expect(page).toHaveURL(/checkout-step-one/)
		})
	}

	test(
		'cancel returns to the cart with items preserved',
		{ tag: '@regression' },
		async ({ page, checkoutPage, cartPage }) => {
			await checkoutPage.cancel()
			await expect(page).toHaveURL(/cart/)
			await expect(cartPage.itemNames).toHaveText([products.backpack])
		},
	)
})

test.describe('checkout totals with several items', () => {
	test.beforeEach(async ({ loggedInPage: _loggedInPage, inventoryPage, cartPage, checkoutPage, page }) => {
		await inventoryPage.addToCart(products.backpack)
		await inventoryPage.addToCart(products.bikeLight)
		await inventoryPage.addToCart(products.boltTShirt)
		await inventoryPage.openCart()
		await cartPage.checkout()
		await checkoutPage.fillCustomerInfo(customer.first, customer.last, customer.zip)
		await checkoutPage.continueToOverview()
		await expect(page).toHaveURL(/checkout-step-two/) // now on "Checkout: Overview"
	})

	// Money is compared as numbers. toBeCloseTo(x, 2) passes when the difference is under
	// half a cent, which absorbs floating-point noise like 29.99 + 2.4 !== 32.39 exactly.
	test('item total equals the sum of the item prices', { tag: '@regression' }, async ({ checkoutPage }) => {
		const prices = await checkoutPage.getItemPrices()
		const sum = prices.reduce((total, price) => total + price, 0)
		expect(prices).toHaveLength(3)
		expect(await checkoutPage.getItemTotal()).toBeCloseTo(sum, 2)
	})

	test('total equals item total plus tax', { tag: '@regression' }, async ({ checkoutPage }) => {
		const itemTotal = await checkoutPage.getItemTotal()
		const tax = await checkoutPage.getTax()
		expect(await checkoutPage.getTotal()).toBeCloseTo(itemTotal + tax, 2)
	})
})
