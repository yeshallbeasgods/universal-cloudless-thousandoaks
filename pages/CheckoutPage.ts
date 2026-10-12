import type { Locator, Page } from '@playwright/test'
import { parseCurrency } from '../utils/currency'

export class CheckoutPage {
	readonly page: Page
	readonly firstNameField: Locator
	readonly lastNameField: Locator
	readonly postalCodeField: Locator
	readonly continueButton: Locator
	readonly errorBanner: Locator
	readonly subtotalLabel: Locator
	readonly taxLabel: Locator
	readonly totalLabel: Locator
	readonly finishButton: Locator
	readonly confirmationHeader: Locator

	constructor(page: Page) {
		this.page = page
		this.firstNameField = page.getByTestId('firstName')
		this.lastNameField = page.getByTestId('lastName')
		this.postalCodeField = page.getByTestId('postalCode')
		this.continueButton = page.getByTestId('continue')
		this.errorBanner = page.getByTestId('error')
		this.subtotalLabel = page.getByTestId('subtotal-label')
		this.taxLabel = page.getByTestId('tax-label')
		this.totalLabel = page.getByTestId('total-label')
		this.finishButton = page.getByTestId('finish')
		this.confirmationHeader = page.getByTestId('complete-header')
	}

	async fillCustomerInfo(first: string, last: string, zip: string): Promise<void> {
		await this.firstNameField.fill(first)
		await this.lastNameField.fill(last)
		await this.postalCodeField.fill(zip)
	}

	async continueToOverview(): Promise<void> {
		await this.continueButton.click()
	}

	async getItemTotal(): Promise<number> {
		return parseCurrency(await this.subtotalLabel.innerText())
	}

	async getTax(): Promise<number> {
		return parseCurrency(await this.taxLabel.innerText())
	}

	async getTotal(): Promise<number> {
		return parseCurrency(await this.totalLabel.innerText())
	}

	async finish(): Promise<void> {
		await this.finishButton.click()
	}

	async getConfirmationMessage(): Promise<string> {
		return this.confirmationHeader.innerText()
	}
}
