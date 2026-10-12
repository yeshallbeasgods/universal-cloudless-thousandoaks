import type { Locator, Page } from '@playwright/test'

export class LoginPage {
	readonly page: Page
	readonly usernameField: Locator
	readonly passwordField: Locator
	readonly loginButton: Locator
	readonly errorBanner: Locator

	constructor(page: Page) {
		this.page = page
		this.usernameField = page.getByTestId('username')
		this.passwordField = page.getByTestId('password')
		this.loginButton = page.getByTestId('login-button')
		this.errorBanner = page.getByTestId('error')
	}

	async goto(): Promise<void> {
		await this.page.goto('/')
	}

	async login(user: string, pass: string): Promise<void> {
		await this.usernameField.fill(user)
		await this.passwordField.fill(pass)
		await this.loginButton.click()
	}

	async getErrorMessage(): Promise<string> {
		return await this.errorBanner.innerText()
	}
}
