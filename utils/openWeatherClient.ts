import { test } from '@playwright/test'
import type { APIRequestContext, APIResponse } from '@playwright/test'
import type { ApiResult, CurrentWeather } from './types'

export interface WeatherOptions {
	// undefined: use the client's key. null: send no key at all. A string: send that key instead.
	apiKey?: string | null
	units?: 'metric' | 'imperial' | 'standard'
}

export class OpenWeatherClient {
	readonly request: APIRequestContext
	private readonly apiKey: string

	constructor(request: APIRequestContext, apiKey: string) {
		this.request = request
		this.apiKey = apiKey
	}

	// T says what shape the caller expects the body to have. It is a promise, not a check.
	// Use CurrentWeather for success and OpenWeatherError for failures.
	async getCurrentWeather<T = CurrentWeather>(city: string, options: WeatherOptions = {}): Promise<ApiResult<T>> {
		const key = options.apiKey === undefined ? this.apiKey : options.apiKey
		const params: Record<string, string> = { q: city, units: options.units ?? 'imperial' }
		if (key !== null) {
			params.appid = key
		}

		let response: APIResponse
		try {
			response = await this.request.get('/data/2.5/weather', { params })
		} catch (error) {
			// Playwright's network errors print the full URL, and the key is in it. Redact before rethrowing.
			// eslint-disable-next-line preserve-caught-error -- a `cause` would carry the unredacted message
			throw new Error(redactApiKey(error instanceof Error ? error.message : String(error)))
		}

		const status = response.status()
		const body = (await response.json()) as T
		await attachSummary(params, status, body)

		// Return only what tests need. Never hand back the response: response.url() contains the key.
		return { status, body }
	}
}

// Adds the request and response to the test's reports (Allure, HTML, JSON). The key is replaced
// with *** before anything is attached, and the final text goes through redactApiKey as well.
async function attachSummary(params: Record<string, string>, status: number, body: unknown): Promise<void> {
	const { appid, ...visibleParams } = params
	const summary = {
		request: {
			method: 'GET',
			path: '/data/2.5/weather',
			params: { ...visibleParams, appid: appid === undefined ? '(not sent)' : '***' },
		},
		response: { status, body },
	}
	await test.info().attach('OpenWeather request and response', {
		body: redactApiKey(JSON.stringify(summary, null, 2)),
		contentType: 'application/json',
	})
}

export function redactApiKey(text: string): string {
	return text.replace(/appid=[\w-]*/g, 'appid=***')
}
