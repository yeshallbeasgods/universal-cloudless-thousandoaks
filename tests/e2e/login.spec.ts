import { test, expect } from '../../fixtures'
import { invalidLoginCases } from '../../test-data/loginCases'
import { users } from '../../test-data/users'
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
	await loginPage.login(users.lockedOut, pass)
	await expect(loginPage.errorBanner).toContainText('Sorry, this user has been locked out.')
})

// One generated test per entry in test-data/loginCases.ts
for (const { name, username, password, expectedError } of invalidLoginCases) {
	test(`invalid credentials: ${name}`, { tag: '@regression' }, async ({ page, loginPage }) => {
		await loginPage.goto()
		await loginPage.login(username, password)
		await expect(loginPage.errorBanner).toContainText(expectedError)
		await expect(page).not.toHaveURL(/inventory/)
	})
}
