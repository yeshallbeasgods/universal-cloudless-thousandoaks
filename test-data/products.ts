export const products = {
	backpack: 'Sauce Labs Backpack',
	bikeLight: 'Sauce Labs Bike Light',
	boltTShirt: 'Sauce Labs Bolt T-Shirt',
	fleeceJacket: 'Sauce Labs Fleece Jacket',
	onesie: 'Sauce Labs Onesie',
	redTShirt: 'Test.allTheThings() T-Shirt (Red)',
} as const

export const allProducts: string[] = Object.values(products)
