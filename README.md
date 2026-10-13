# Playwright + TypeScript Test Automation
UI tests (Sauce Demo), API tests (OpenWeather), and GitHub Actions CI. Work in progress.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Playwright + TypeScript test automation framework targeting the [Sauce Demo](https://www.saucedemo.com) application and the OpenWeather API. Built to demonstrate professional QA engineering practices: page objects delivered through custom fixtures, web-first assertions, strict typing with type-aware linting, tagged test runs, and API testing in the same runner as the UI tests.

## Tech Stack

- Node.js (version pinned in `.nvmrc`)
- Playwright Test
- TypeScript (strict)
- dotenv
- ESLint (typescript-eslint, eslint-plugin-playwright)
- Prettier

## Project Structure

```
universal-cloudless-thousandoaks/
├── .github/
│   └── dependabot.yml              # Weekly npm dependency updates
├── docs/
│   └── qa/                         # Manual QA artifacts
├── fixtures/
│   └── index.ts                    # Custom test: page objects and loggedInPage
├── pages/
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   ├── InventoryPage.ts
│   └── LoginPage.ts
├── test-data/                      # Typed data arrays that drive generated tests
│   ├── cities.ts                   # Cities for the OpenWeather tests
│   ├── checkoutCases.ts            # Valid customer and required-field cases
│   ├── loginCases.ts               # Invalid-login cases, one generated test each
│   ├── products.ts                 # Product names shared by specs
│   └── users.ts                    # Sauce Demo's special users
├── tests/
│   ├── api/
│   │   └── openweather.spec.ts
│   ├── e2e/
│   │   ├── cart.spec.ts
│   │   ├── checkout.spec.ts
│   │   ├── login.spec.ts
│   │   └── special-users.spec.ts
│   └── visual/
├── utils/
│   ├── currency.ts                 # "$29.99" -> 29.99
│   ├── env.ts                      # requireEnv / optionalEnv: environment variables
│   ├── openWeatherClient.ts        # Typed API client that redacts the key from errors
│   └── types.ts                    # Interfaces for OpenWeather responses
├── playwright.config.ts            # baseURL, reporters, trace, projects
├── tsconfig.json
├── eslint.config.mjs
├── package.json
├── .nvmrc                          # Node version
├── .env                            # Local environment variables (not committed)
├── .env.example                    # Environment variable template
├── AGENTS.md                       # Conventions and working agreement for AI agents
└── CLAUDE.md                       # Imports AGENTS.md
```

## Setup

### Prerequisites

- [nvm](https://github.com/nvm-sh/nvm), or any Node install matching `.nvmrc`

### Installation

Clone the repository:

```bash
git clone https://github.com/yeshallbeasgods/universal-cloudless-thousandoaks.git
cd universal-cloudless-thousandoaks
```

Use the pinned Node version and install dependencies from the lockfile:

```bash
nvm use
npm ci
```

Download the browser (Chromium only):

```bash
npx playwright install --with-deps chromium
```

Set up environment variables:

```bash
cp .env.example .env
```

Then add your `OPENWEATHER_API_KEY` to `.env`. `.env` is gitignored. Never commit real credentials or API keys.

## Running Tests

Tests run headless by default. Add `--headed` to watch the browser.

### Run all tests

```bash
npm test
```

### Run by tag

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @api
```

### Run one project, file or test

```bash
npx playwright test --project=chromium   # UI tests
npx playwright test --project=api        # API tests, no browser (needs OPENWEATHER_API_KEY)
npx playwright test tests/e2e/login.spec.ts
npx playwright test tests/e2e/login.spec.ts:9 --headed
```

### Debug

```bash
npx playwright test --ui          # UI mode: timeline, DOM snapshots, time-travel
npx playwright test --debug       # Playwright inspector
npx playwright show-trace <trace.zip>
```

### View the HTML report

The HTML report is generated after every run:

```bash
npx playwright show-report
```

### Checks

```bash
npm run lint
npm run typecheck
```

## Test Tags

| Tag           | Description                        |
| ------------- | ---------------------------------- |
| `@smoke`      | Core user journey smoke tests      |
| `@regression` | Broader and negative-path coverage |
| `@api`        | OpenWeather API tests              |

## Key Features

- **Fixture-delivered page objects.** Specs ask for `loginPage`, `inventoryPage` and the rest by name. No base class or page manager is needed.
- **Lazy locators with auto-waiting.** Locators resolve when an action runs, and actions wait for the element, so specs contain no sleeps.
- **Web-first assertions** that retry until they pass or time out.
- **`loggedInPage` fixture** so tests that are not about login skip the login UI.
- **Strict TypeScript and type-aware linting**, including `no-floating-promises` to catch missing `await`.
- **Environment validation.** `requireEnv` fails with a clear message when a required variable is missing.
- **Tagged runs** by `@smoke`, `@regression` and `@api`.
- **Data-driven tests.** Typed arrays in `test-data/` generate one named test per case.
- **Numeric checks on money.** Totals are parsed to numbers and compared with `toBeCloseTo(x, 2)`, which absorbs floating-point noise.
- **Known defects documented as tests.** Sauce Demo's `problem_user` and `error_user` have real bugs. Those tests assert the correct behavior and use `test.fail()`, so they pass while the bug exists and start failing the day it is fixed.

## Working with AI agents

[AGENTS.md](AGENTS.md) holds the conventions and the working agreement for AI coding agents: the owner stays in the loop, work happens in small reviewed steps, and agents plan before editing.

## License

MIT — see [LICENSE](LICENSE) for details.

## Roadmap

**Complete**

- [x] Project scaffold — Playwright config, strict TypeScript, ESLint and Prettier, Dependabot
- [x] Page objects for login, inventory, cart and checkout
- [x] Custom fixtures delivering the page objects, including `loggedInPage`
- [x] Login and cart smoke suite
- [x] Checkout specs, including numeric checks of the totals
- [x] Special-user coverage (`performance_glitch_user`, `problem_user`, `error_user`)

**In progress**

- [ ] OpenWeather API tests

**Upcoming**

- [ ] API tests — OpenWeather current weather endpoint in the same runner
- [ ] Mocking with network interception
- [ ] CI workflow and reporting
- [ ] Test-health tracking and manual QA artifacts in `docs/qa/`
