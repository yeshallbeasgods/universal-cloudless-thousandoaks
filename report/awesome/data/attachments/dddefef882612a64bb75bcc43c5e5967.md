# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/special-users.spec.ts >> error_user >> last name field keeps what is typed
- Location: tests/e2e/special-users.spec.ts:48:7

# Error details

```
Error: expect(locator).toHaveValue(expected) failed

Locator:  getByTestId('lastName')
Expected: "Doe"
Received: ""
Timeout:  5000ms

Call log:
  - Expect "toHaveValue" getByTestId('lastName') with timeout 5000ms
  - waiting for getByTestId('lastName')
    14 × locator resolved to <input value="" type="text" id="last-name" name="lastName" autocorrect="off" data-test="lastName" autocapitalize="none" aria-label="Last Name" placeholder="Last Name" class="input_error form_input"/>
       - unexpected value ""

```

```yaml
- textbox "Last Name"
```

# Test source

```ts
  1  | import { test, expect } from '../../fixtures'
  2  | import { validCustomer } from '../../test-data/checkoutCases'
  3  | import { allProducts, products } from '../../test-data/products'
  4  | import { users } from '../../test-data/users'
  5  | import { requireEnv } from '../../utils/env'
  6  | 
  7  | const pass = requireEnv('PASSWORD')
  8  | 
  9  | // Sauce Demo ships users that behave badly on purpose.
  10 | //   Performance_glitch_user: login is slow, so the check below allows more time.
  11 | //   Problem_user and error_user surface defects. Those tests assert the CORRECT behavior and are
  12 | //   marked test.fail(); Playwright reports them as passing while the defect exists, and starts
  13 | //   failing them the day it is fixed, which is the signal to remove the marker.
  14 | 
  15 | //   Visual_user only differs in layout, so it belongs with the visual tests (TICKET-07). (remove this note then)
  16 | 
  17 | test(
  18 | 	'performance glitch user can log in despite the slow response',
  19 | 	{
  20 | 		tag: '@regression',
  21 | 	},
  22 | 	async ({ page, loginPage }) => {
  23 | 		await loginPage.goto()
  24 | 		await loginPage.login(users.performanceGlitch, pass)
  25 | 		// The login takes about 5 seconds, which is longer than the default expected timeout.
  26 | 		await expect(page).toHaveURL(/inventory/, { timeout: 15_000 })
  27 | 	},
  28 | )
  29 | 
  30 | const brokenUsers = [users.problem, users.error]
  31 | 
  32 | for (const username of brokenUsers) {
  33 | 	test.describe(username, () => {
  34 | 		test.beforeEach(async ({ loginPage, inventoryPage }) => {
  35 | 			await loginPage.goto()
  36 | 			await loginPage.login(username, pass)
  37 | 			await inventoryPage.items.first().waitFor()
  38 | 		})
  39 | 
  40 | 		test('can add every product to the cart', { tag: '@regression' }, async ({ inventoryPage }) => {
  41 | 			test.fail(true, 'Known Sauce Demo defect: some products cannot be added to the cart')
  42 | 			for (const product of allProducts) {
  43 | 				await inventoryPage.addToCart(product)
  44 | 			}
  45 | 			await expect(inventoryPage.cartBadge).toHaveText(String(allProducts.length))
  46 | 		})
  47 | 
  48 | 		test(
  49 | 			'last name field keeps what is typed',
  50 | 			{ tag: '@regression' },
  51 | 			async ({ inventoryPage, cartPage, checkoutPage }) => {
  52 | 				test.fail(true, 'Known Sauce Demo defect: the last name field does not keep its value')
  53 | 				await inventoryPage.addToCart(products.backpack)
  54 | 				await inventoryPage.openCart()
  55 | 				await cartPage.checkout()
  56 | 				await checkoutPage.fillCustomerInfo(validCustomer.first, validCustomer.last, validCustomer.zip)
> 57 | 				await expect(checkoutPage.lastNameField).toHaveValue(validCustomer.last)
     |                                              ^ Error: expect(locator).toHaveValue(expected) failed
  58 | 			},
  59 | 		)
  60 | 	})
  61 | }
  62 | 
  63 | test(
  64 | 	'problem user sees a distinct image for each product',
  65 | 	{ tag: '@regression' },
  66 | 	async ({ loginPage, inventoryPage }) => {
  67 | 		test.fail(true, 'Known Sauce Demo defect: every product shows the same image')
  68 | 		await loginPage.goto()
  69 | 		await loginPage.login(users.problem, pass)
  70 | 		const sources = await inventoryPage.getItemImageSources()
  71 | 		expect(sources).toHaveLength(allProducts.length)
  72 | 		expect(new Set(sources).size).toBe(sources.length)
  73 | 	},
  74 | )
  75 | 
```