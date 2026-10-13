export interface CityCase {
	city: string
	country: string // ISO country code, OpenWeather reports in sys.country
}

// Keep this list short as each entry is one call against the free tier.
export const cities: CityCase[] = [
	{ city: 'Chicago', country: 'US' },
	{ city: 'London', country: 'GB' },
	{ city: 'Tokyo', country: 'JP' },
	{ city: 'Sydney', country: 'AU' },
]
