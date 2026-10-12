export interface InvalidLoginCase {
	name: string
	username: string
	password: string
	expectedError: string
}

export const invalidLoginCases: InvalidLoginCase[] = [
	{
		name: 'wrong password',
		username: 'standard_user',
		password: 'not_the_password',
		expectedError: 'Username and password do not match any user in this service',
	},
	{
		name: 'unknown username',
		username: 'no_such_user',
		password: 'not_the_password',
		expectedError: 'Username and password do not match any user in this service',
	},
	{
		name: 'missing username',
		username: '',
		password: 'not_the_password',
		expectedError: 'Username is required',
	},
	{
		name: 'missing password',
		username: 'standard_user',
		password: '',
		expectedError: 'Password is required',
	},
]
