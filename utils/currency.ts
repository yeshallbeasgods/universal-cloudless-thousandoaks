/** Converts display text like "$29.99" or "Tax: $2.40" into a number. */
export function parseCurrency(text: string): number {
	const value = Number(text.replace(/[^0-9.-]/g, ''))
	if (Number.isNaN(value)) {
		throw new Error(`Could not parse a currency amount from "${text}"`)
	}
	return value
}
