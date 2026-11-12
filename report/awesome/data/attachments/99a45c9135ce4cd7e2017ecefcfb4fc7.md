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
            - img "Sauce Labs Backpack" [ref=e39]
          - generic [ref=e40]:
            - generic [ref=e41]:
              - button "View details for Sauce Labs Backpack" [ref=e42] [cursor=pointer]:
                - generic [ref=e43]: Sauce Labs Backpack
              - generic [ref=e44]: carry.allTheThings() with the sleek, streamlined Sly Pack that melds uncompromising style with unequaled laptop and tablet protection.
            - generic [ref=e45]:
              - generic [ref=e46]: $29.99
              - button "Add to cart" [ref=e47] [cursor=pointer]
        - generic [ref=e48]:
          - button "View details for Sauce Labs Bike Light" [ref=e50] [cursor=pointer]:
            - img "Sauce Labs Bike Light" [ref=e51]
          - generic [ref=e52]:
            - generic [ref=e53]:
              - button "View details for Sauce Labs Bike Light" [ref=e54] [cursor=pointer]:
                - generic [ref=e55]: Sauce Labs Bike Light
              - generic [ref=e56]: A red light isn't the desired state in testing but it sure helps when riding your bike at night. Water-resistant with 3 lighting modes, 1 AAA battery included.
            - generic [ref=e57]:
              - generic [ref=e58]: $9.99
              - button "Add to cart" [ref=e59] [cursor=pointer]
        - generic [ref=e60]:
          - button "View details for Sauce Labs Bolt T-Shirt" [ref=e62] [cursor=pointer]:
            - img "Sauce Labs Bolt T-Shirt" [ref=e63]
          - generic [ref=e64]:
            - generic [ref=e65]:
              - button "View details for Sauce Labs Bolt T-Shirt" [ref=e66] [cursor=pointer]:
                - generic [ref=e67]: Sauce Labs Bolt T-Shirt
              - generic [ref=e68]: Get your testing superhero on with the Sauce Labs bolt T-shirt. From American Apparel, 100% ringspun combed cotton, heather gray with red bolt.
            - generic [ref=e69]:
              - generic [ref=e70]: $15.99
              - button "Add to cart" [ref=e71] [cursor=pointer]
        - generic [ref=e72]:
          - button "View details for Sauce Labs Fleece Jacket" [ref=e74] [cursor=pointer]:
            - img "Sauce Labs Fleece Jacket" [ref=e75]
          - generic [ref=e76]:
            - generic [ref=e77]:
              - button "View details for Sauce Labs Fleece Jacket" [ref=e78] [cursor=pointer]:
                - generic [ref=e79]: Sauce Labs Fleece Jacket
              - generic [ref=e80]: It's not every day that you come across a midweight quarter-zip fleece jacket capable of handling everything from a relaxing day outdoors to a busy day at the office.
            - generic [ref=e81]:
              - generic [ref=e82]: $49.99
              - button "Add to cart" [ref=e83] [cursor=pointer]
        - generic [ref=e84]:
          - button "View details for Sauce Labs Onesie" [ref=e86] [cursor=pointer]:
            - img "Sauce Labs Onesie" [ref=e87]
          - generic [ref=e88]:
            - generic [ref=e89]:
              - button "View details for Sauce Labs Onesie" [ref=e90] [cursor=pointer]:
                - generic [ref=e91]: Sauce Labs Onesie
              - generic [ref=e92]: Rib snap infant onesie for the junior automation engineer in development. Reinforced 3-snap bottom closure, two-needle hemmed sleeved and bottom won't unravel.
            - generic [ref=e93]:
              - generic [ref=e94]: $7.99
              - button "Add to cart" [ref=e95] [cursor=pointer]
        - generic [ref=e96]:
          - button "View details for Test.allTheThings() T-Shirt (Red)" [ref=e98] [cursor=pointer]:
            - img "Test.allTheThings() T-Shirt (Red)" [ref=e99]
          - generic [ref=e100]:
            - generic [ref=e101]:
              - button "View details for Test.allTheThings() T-Shirt (Red)" [ref=e102] [cursor=pointer]:
                - generic [ref=e103]: Test.allTheThings() T-Shirt (Red)
              - generic [ref=e104]: This classic Sauce Labs t-shirt is perfect to wear when cozying up to your keyboard to automate a few tests. Super-soft and comfy ringspun combed cotton.
            - generic [ref=e105]:
              - generic [ref=e106]: $15.99
              - button "Add to cart" [ref=e107] [cursor=pointer]
  - contentinfo [ref=e108]:
    - list [ref=e109]:
      - listitem [ref=e110]:
        - link "X" [ref=e111] [cursor=pointer]:
          - /url: https://x.com/saucelabs
      - listitem [ref=e112]:
        - link "Facebook" [ref=e113] [cursor=pointer]:
          - /url: https://www.facebook.com/saucelabs
      - listitem [ref=e114]:
        - link "LinkedIn" [ref=e115] [cursor=pointer]:
          - /url: https://www.linkedin.com/company/sauce-labs/
    - generic [ref=e116]: © 2026 Sauce Labs. All Rights Reserved. Terms of Service | Privacy Policy
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