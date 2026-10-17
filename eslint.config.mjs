import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'
import prettier from 'eslint-config-prettier'

export default defineConfig(
	{
		ignores: [
			'node_modules/',
			'test-results/',
			'playwright-report/',
			'blob-report/',
			'allure-results/',
			'allure-report/',
			'allure-history/',
			'publish/',
			'eslint.config.mjs',
			'allurerc.mjs',
			'site/', // static landing page: plain browser JavaScript, not part of the TypeScript project
		],
	},
	eslint.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			'@typescript-eslint/no-floating-promises': 'error',
			'@typescript-eslint/no-explicit-any': 'error',
			// Fixtures requested only for their side effect (e.g. loggedInPage) are named with a `_` prefix.
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		},
	},
	playwright.configs['flat/recommended'],
	prettier,
)
