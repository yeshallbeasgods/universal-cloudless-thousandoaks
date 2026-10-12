export interface CustomerInfo {
	first: string
	last: string
	zip: string
}

export const validCustomer: CustomerInfo = { first: 'Jane', last: 'Doe', zip: '60601' }

export interface RequiredFieldCase extends CustomerInfo {
	missing: string
	error: string
}

export const requiredFieldCases: RequiredFieldCase[] = [
	{ missing: 'first name', first: '', last: 'Doe', zip: '60601', error: 'First Name is required' },
	{ missing: 'last name', first: 'Jane', last: '', zip: '60601', error: 'Last Name is required' },
	{ missing: 'zip', first: 'Jane', last: 'Doe', zip: '', error: 'Postal Code is required' },
]
