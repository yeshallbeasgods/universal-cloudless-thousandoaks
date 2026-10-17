import path from 'node:path'
import type { TestInfo } from '@playwright/test'
import * as allure from 'allure-js-commons'

// Allure groups tests by epic > feature > story. Instead of labelling every test by hand,
// they are derived from where the spec lives: the folder under tests/ is the epic and the
// spec file is the feature. The story is the test title.

const epics: Record<string, string> = {
	e2e: 'Web UI',
	api: 'API',
	visual: 'Visual',
}

const features: Record<string, string> = {
	'login.spec.ts': 'Login',
	'cart.spec.ts': 'Cart',
	'checkout.spec.ts': 'Checkout',
	'special-users.spec.ts': 'Special users',
	'openweather.spec.ts': 'Current weather',
}

export function labelsFor(file: string): { epic: string; feature: string } {
	// Specs live at tests/<folder>/<name>.spec.ts. (Not relative to a project's testDir: the
	// `api` project's testDir is already tests/api.)
	const parts = file.split(path.sep)
	const folder = parts[parts.lastIndexOf('tests') + 1] ?? ''
	const name = path.basename(file)
	return {
		epic: epics[folder] ?? 'Other',
		// An unmapped spec still gets a readable feature name, e.g. "wishlist.spec.ts" -> "wishlist"
		feature: features[name] ?? name.replace(/\.spec\.ts$/, ''),
	}
}

export async function applyAllureLabels(testInfo: TestInfo): Promise<void> {
	const { epic, feature } = labelsFor(testInfo.file)
	await allure.epic(epic)
	await allure.feature(feature)
	await allure.story(testInfo.title)
}
