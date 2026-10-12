import type { Locator, Page } from '@playwright/test'
import { parseCurrency } from '../utils/currency'

export class InventoryPage {
	readonly page: Page
	readonly items: Locator
	readonly itemNames: Locator
	readonly itemPrices: Locator
	readonly cartLink: Locator
	readonly cartBadge: Locator

	constructor(page: Page) {
		this.page = page
		this.items = page.getByTestId('inventory-item')
		this.itemNames = page.getByTestId('inventory-item-name')
		this.itemPrices = page.getByTestId('inventory-item-price')
		this.cartLink = page.getByTestId('shopping-cart-link')
		this.cartBadge = page.getByTestId('shopping-cart-badge')
	}

	async addToCart(itemName: string): Promise<void> {
		// Find the product card and click the add to cart button.
		const item = this.items.filter({ has: this.itemNames.filter({ hasText: itemName }) })
		await item.getByRole('button', { name: 'Add to cart' }).click()
	}

	async getCartBadgeCount(): Promise<number> {
		if ((await this.cartBadge.count()) === 0) {
			return 0
		}
		return Number(await this.cartBadge.innerText())
	}

	async getItemNames(): Promise<string[]> {
		await this.items.first().waitFor() // allInnerTexts() doesn't wait for the list to render
		return this.itemNames.allInnerTexts()
	}

	async getItemPrices(): Promise<number[]> {
		await this.items.first().waitFor()
		const prices = await this.itemPrices.allInnerTexts()
		return prices.map(parseCurrency)
	}

	async getItemImageSources(): Promise<string[]> {
		await this.items.first().waitFor()
		return this.items
			.getByRole('img')
			.evaluateAll((images) => images.map((image) => image.getAttribute('src') ?? ''))
	}

	async openCart(): Promise<void> {
		await this.cartLink.click()
	}
}
