import { test, expect } from '../../fixtures'
import { products } from '../../test-data/products'

test(
	'can add a single item to the cart',
	{ tag: '@smoke' },
	async ({ loggedInPage: _loggedInPage, inventoryPage, cartPage }) => {
		await inventoryPage.addToCart(products.backpack)
		await expect(inventoryPage.cartBadge).toHaveText('1')

		await inventoryPage.openCart()
		await expect(cartPage.items).toHaveCount(1)
		// assert with an array that retries until it matches. Less flakey than expected vs actual.
		await expect(cartPage.itemNames).toHaveText([products.backpack])
	},
)

test(
	'can add multiple items to the cart',
	{ tag: '@smoke' },
	async ({ loggedInPage: _loggedInPage, inventoryPage, cartPage }) => {
		await inventoryPage.addToCart(products.backpack)
		await inventoryPage.addToCart(products.bikeLight)
		await inventoryPage.addToCart(products.boltTShirt)
		await expect(inventoryPage.cartBadge).toHaveText('3')

		await inventoryPage.openCart()
		await expect(cartPage.items).toHaveCount(3)
		await expect(cartPage.itemNames).toHaveText([products.backpack, products.bikeLight, products.boltTShirt])
	},
)

test(
	'removing one item leaves the others in the cart',
	{ tag: '@smoke' },
	async ({ loggedInPage: _loggedInPage, inventoryPage, cartPage }) => {
		// test.step groups actions under a label that shows up in the HTML report and trace.
		await test.step('Add two items and open the cart', async () => {
			await inventoryPage.addToCart(products.backpack)
			await inventoryPage.addToCart(products.bikeLight)
			await inventoryPage.openCart()
			await expect(cartPage.items).toHaveCount(2)
		})

		await test.step('Remove the backpack', async () => {
			await cartPage.removeItem(products.backpack)
		})

		await test.step('Only the bike light remains', async () => {
			await expect(cartPage.items).toHaveCount(1)
			await expect(cartPage.itemNames).toHaveText([products.bikeLight])
			await expect(inventoryPage.cartBadge).toHaveText('1')
		})
	},
)

test(
	'removing the last item empties the cart',
	{ tag: '@smoke' },
	async ({ loggedInPage: _loggedInPage, inventoryPage, cartPage }) => {
		await test.step('Add one item and open the cart', async () => {
			await inventoryPage.addToCart(products.backpack)
			await inventoryPage.openCart()
		})

		await test.step('Remove it', async () => {
			await cartPage.removeItem(products.backpack)
		})

		await test.step('The cart is empty and the badge is gone', async () => {
			await expect(cartPage.items).toHaveCount(0)
			await expect(inventoryPage.cartBadge).toBeHidden()
		})
	},
)
