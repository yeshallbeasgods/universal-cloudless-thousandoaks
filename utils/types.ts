// Shapes of the OpenWeather "current weather" response, trimmed to the fields these tests use.
// These are compile-time descriptions only: nothing checks that a real response matches them.
// The response-shape tests do that check at runtime.

export interface Coordinates {
	lon: number
	lat: number
}

export interface WeatherCondition {
	id: number
	main: string
	description: string
	icon: string
}

export interface MainMetrics {
	temp: number
	feels_like: number
	temp_min: number
	temp_max: number
	pressure: number
	humidity: number
}

export interface CurrentWeather {
	coord: Coordinates
	weather: WeatherCondition[]
	main: MainMetrics
	name: string
	sys: { country: string }
	cod: number
}

export interface OpenWeatherError {
	// Success bodies use a number here. Error bodies are not consistent, so allow both.
	cod: number | string
	message: string
}

export interface ApiResult<T> {
	status: number
	body: T
}
