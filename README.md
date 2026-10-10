# Playwright-Typescript-Robust
A demo repo to showcase heavier regression testing against sauce demo as well as showcase API testing and how utilities can work across languages

## Setup

Requires [nvm](https://github.com/nvm-sh/nvm) (or any Node install matching `.nvmrc`).

```bash
nvm use                                      # Node version from .nvmrc
npm ci                                       # install dependencies from the lockfile
npx playwright install --with-deps chromium  # download the browser
cp .env.example .env                         # then fill in PASSWORD and OPENWEATHER_API_KEY
```

`.env` is gitignored. Never commit real credentials or API keys.

## Running tests

```bash
npm test                                     # everything
npx playwright test --grep @smoke            # by tag: @smoke, @api, @regression
npx playwright test --project=chromium       # one project
npx playwright test path/to/file.spec.ts:42 --headed   # one test, visible browser
npx playwright test --ui                     # UI mode (time-travel debugging)
npx playwright show-report                   # open the HTML report
```

## Checks

```bash
npm run lint
npm run typecheck
```
