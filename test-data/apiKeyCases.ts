export interface ApiKeyCase {
	name: string
	// A string is sent as the key. null sends no key at all.
	apiKey: string | null
}

export const apiKeyCases: ApiKeyCase[] = [
	{ name: 'an invalid key', apiKey: 'not-a-real-key' },
	{ name: 'no key', apiKey: null },
]
