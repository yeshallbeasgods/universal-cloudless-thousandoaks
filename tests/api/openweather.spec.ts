import { test, expect } from '../../fixtures'

test.describe('can receive OpenWeather current weather', () => {
	test('can read current weather', { tag: '@api' }, async ({ openWeather }) => {
		const { status, body } = await openWeather.getCurrentWeather('Chicago')
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
			cod: expect(status).toBe(200),
		})
	})
})
