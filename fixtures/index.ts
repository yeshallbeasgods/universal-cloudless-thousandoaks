import { test as base, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'

export type Fixtures = { 
    loginPage: LoginPage 
}

export const test = base.extend<Fixtures>({
	loginPage: async ({ page }, use) => await use(new LoginPage(page)),
})

export { expect }
