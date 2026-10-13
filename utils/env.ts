export function requireEnv(name: string): string {
	const value = process.env[name]
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}. Check your .env file.`)
	}
	return value
}

// For values a test can run without. Returns undefined when the variable is missing or empty.
export function optionalEnv(name: string): string | undefined {
	return process.env[name] || undefined
}
