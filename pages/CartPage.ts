import type { Locator, Page } from '@playwright/test'

export class CartPage {
	readonly page: Page
	readonly cartList: Locator
	readonly items: Locator
	readonly itemNames: Locator
	readonly checkoutButton: Locator

	constructor(page: Page) {
		this.page = page
		this.cartList = page.getByTestId('cart-list')
		this.items = page.getByTestId('inventory-item')
		this.itemNames = page.getByTestId('inventory-item-name')
		this.checkoutButton = page.getByTestId('checkout')
	}

	async getCartItemNames(): Promise<string[]> {
		// The list container renders even for an empty cart, so wait for it, not for an item.
		await this.cartList.waitFor()
		return this.itemNames.allInnerTexts()
	}

	async removeItem(itemName: string): Promise<void> {
		const item = this.items.filter({ has: this.itemNames.filter({ hasText: itemName }) })
		await item.getByRole('button', { name: 'Remove' }).click()
	}

	async checkout(): Promise<void> {
		await this.checkoutButton.click()
	}
}
