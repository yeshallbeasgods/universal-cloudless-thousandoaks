import { test, expect } from '../../fixtures'
import { apiKeyCases } from '../../test-data/apiKeyCases'
import { cities } from '../../test-data/cities'
import type { OpenWeatherError } from '../../utils/types'

// Each test makes one call. The free tier allows 60 a minute, so keep the number of tests small.

test.describe('OpenWeather current weather', () => {
	test('returns 200 for a valid city', { tag: '@api' }, async ({ openWeather }) => {
		const { status } = await openWeather.getCurrentWeather('Chicago')
		expect(status).toBe(200)
	})

	test('response has the required fields', { tag: '@api' }, async ({ openWeather }) => {
		const { body } = await openWeather.getCurrentWeather('Chicago')
		expect(body).toMatchObject({
			name: expect.any(String),
			main: { temp: expect.any(Number) },
			coord: {
				lon: expect.any(Number),
				lat: expect.any(Number),
			},
			weather: expect.arrayContaining([
				expect.objectContaining({
					description: expect.any(String),
				}),
			]),
			cod: 200,
		})
	})

	test('temperature and humidity are plausible', { tag: '@api' }, async ({ openWeather }) => {
		const { body } = await openWeather.getCurrentWeather('Chicago')
		// The second argument to expect() is the message shown if the check fails.
		expect(Number.isFinite(body.main.temp), 'main.temp should be a finite number').toBe(true)
		expect(body.main.humidity).toBeGreaterThanOrEqual(0)
		expect(body.main.humidity).toBeLessThanOrEqual(100)
	})

	test('coordinates are within valid ranges', { tag: '@api' }, async ({ openWeather }) => {
		const { body } = await openWeather.getCurrentWeather('Chicago')
		expect(body.coord.lat).toBeGreaterThanOrEqual(-90)
		expect(body.coord.lat).toBeLessThanOrEqual(90)
		expect(body.coord.lon).toBeGreaterThanOrEqual(-180)
		expect(body.coord.lon).toBeLessThanOrEqual(180)
	})

	// One generated test per entry in test-data/cities.ts
	for (const { city, country } of cities) {
		test(`reports the right city and country for ${city}`, { tag: '@api' }, async ({ openWeather }) => {
			const { status, body } = await openWeather.getCurrentWeather(city)
			expect(status).toBe(200)
			expect(body).toMatchObject({ name: city, sys: { country } })
		})
	}
})

test.describe('OpenWeather errors', () => {
	test('an unknown city returns 404 with an error message', { tag: '@api' }, async ({ openWeather }) => {
		const { status, body } = await openWeather.getCurrentWeather<OpenWeatherError>('Nowhereville-xyz')
		expect(status).toBe(404)
		// OpenWeather sends cod as the string "404" here but as a number elsewhere, so compare as text.
		expect(String(body.cod)).toBe('404')
		expect(body.message).toMatch(/not found/i)
	})

	// One generated test per entry in test-data/apiKeyCases.ts
	for (const { name, apiKey } of apiKeyCases) {
		test(`returns 401 for ${name}`, { tag: '@api' }, async ({ openWeather }) => {
			const { status, body } = await openWeather.getCurrentWeather<OpenWeatherError>('Chicago', { apiKey })
			expect(status).toBe(401)
			expect(body.message).toContain('Invalid API key')
		})
	}
})
