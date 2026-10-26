# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/special-users.spec.ts >> problem user sees a distinct image for each product
- Location: tests/e2e/special-users.spec.ts:63:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 6
Received: 1
```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]:
    - banner [ref=e5]:
      - generic [ref=e6]:
        - generic:
          - generic:
            - generic [ref=e7]:
              - button "Open Menu" [ref=e8] [cursor=pointer]
              - img "Open Menu" [ref=e9]
            - generic [aria-hidden] [ref=e10]:
              - navigation [ref=e12]:
                - button [ref=e13] [cursor=pointer]: All Items
                - button [ref=e14] [cursor=pointer]: Dynamic Catalog
                - link [ref=e16] [cursor=pointer]:
                  - /url: https://saucelabs.com/error/404
                  - text: About
                - button [ref=e17] [cursor=pointer]: Logout
                - button [ref=e18] [cursor=pointer]: Reset App State
              - button [ref=e20] [cursor=pointer]: Close Menu
        - generic [ref=e22]: Swag Labs
        - button "Cart, empty" [ref=e25]
      - generic [ref=e26]:
        - generic [ref=e27]: Products
        - generic [ref=e29] [cursor=pointer]:
          - generic [ref=e30]: Name (A to Z)
          - combobox "Sort products" [ref=e31]:
            - option "Name (A to Z)" [selected]
            - option "Name (Z to A)"
            - option "Price (low to high)"
            - option "Price (high to low)"
    - main [ref=e32]:
      - generic [ref=e35]:
        - generic [ref=e36]:
          - button "View details for Sauce Labs Backpack" [ref=e38] [cursor=pointer]:
            - img "Sauce Labs Backpack"
          - generic [ref=e39]:
            - generic [ref=e40]:
              - button "View details for Sauce Labs Backpack" [ref=e41] [cursor=pointer]:
                - generic [ref=e42]: Sauce Labs Backpack
              - generic [ref=e43]: carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.
            - generic [ref=e44]:
              - generic [ref=e45]: $29.99
              - button "Add to cart" [ref=e46] [cursor=pointer]
        - generic [ref=e47]:
          - button "View details for Sauce Labs Bike Light" [ref=e49] [cursor=pointer]:
            - img "Sauce Labs Bike Light"
          - generic [ref=e50]:
            - generic [ref=e51]:
              - button "View details for Sauce Labs Bike Light" [ref=e52] [cursor=pointer]:
                - generic [ref=e53]: Sauce Labs Bike Light
              - generic [ref=e54]: A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.
            - generic [ref=e55]:
              - generic [ref=e56]: $9.99
              - button "Add to cart" [ref=e57] [cursor=pointer]
        - generic [ref=e58]:
          - button "View details for Sauce Labs Bolt T-Shirt" [ref=e60] [cursor=pointer]:
            - img "Sauce Labs Bolt T-Shirt"
          - generic [ref=e61]:
            - generic [ref=e62]:
              - button "View details for Sauce Labs Bolt T-Shirt" [ref=e63] [cursor=pointer]:
                - generic [ref=e64]: Sauce Labs Bolt T-Shirt
              - generic [ref=e65]: Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.
            - generic [ref=e66]:
              - generic [ref=e67]: $15.99
              - button "Add to cart" [ref=e68] [cursor=pointer]
        - generic [ref=e69]:
          - button "View details for Sauce Labs Fleece Jacket" [ref=e71] [cursor=pointer]:
            - img "Sauce Labs Fleece Jacket"
          - generic [ref=e72]:
            - generic [ref=e73]:
              - button "View details for Sauce Labs Fleece Jacket" [ref=e74] [cursor=pointer]:
                - generic [ref=e75]: Sauce Labs Fleece Jacket
              - generic [ref=e76]: It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.
            - generic [ref=e77]:
              - generic [ref=e78]: $49.99
              - button "Add to cart" [ref=e79] [cursor=pointer]
        - generic [ref=e80]:
          - button "View details for Sauce Labs Onesie" [ref=e82] [cursor=pointer]:
            - img "Sauce Labs Onesie"
          - generic [ref=e83]:
            - generic [ref=e84]:
              - button "View details for Sauce Labs Onesie" [ref=e85] [cursor=pointer]:
                - generic [ref=e86]: Sauce Labs Onesie
              - generic [ref=e87]: Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.
            - generic [ref=e88]:
              - generic [ref=e89]: $7.99
              - button "Add to cart" [ref=e90] [cursor=pointer]
        - generic [ref=e91]:
          - button "View details for Test.allTheThings() T-Shirt (Red)" [ref=e93] [cursor=pointer]:
            - img "Test.allTheThings() T-Shirt (Red)"
          - generic [ref=e94]:
            - generic [ref=e95]:
              - button "View details for Test.allTheThings() T-Shirt (Red)" [ref=e96] [cursor=pointer]:
                - generic [ref=e97]: Test.allTheThings() T-Shirt (Red)
              - generic [ref=e98]: This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.
            - generic [ref=e99]:
              - generic [ref=e100]: $15.99
              - button "Add to cart" [ref=e101] [cursor=pointer]
  - contentinfo [ref=e102]:
    - list [ref=e103]:
      - listitem [ref=e104]:
        - link "X" [ref=e105] [cursor=pointer]:
          - /url: https://x.com/saucelabs
      - listitem [ref=e106]:
        - link "Facebook" [ref=e107] [cursor=pointer]:
          - /url: https://www.facebook.com/saucelabs
      - listitem [ref=e108]:
        - link "LinkedIn" [ref=e109] [cursor=pointer]:
          - /url: https://www.linkedin.com/company/sauce-labs/
    - generic [ref=e110]: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
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
  57 | 				await expect(checkoutPage.lastNameField).toHaveValue(validCustomer.last)
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
> 72 | 		expect(new Set(sources).size).toBe(sources.length)
     |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  73 | 	},
  74 | )
  75 | 
```