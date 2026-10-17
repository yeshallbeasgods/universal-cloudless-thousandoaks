# Playwright + TypeScript Test Automation

UI tests (Sauce Demo), API tests (OpenWeather), and GitHub Actions CI. Work in progress.

[![Playwright Tests](https://github.com/yeshallbeasgods/universal-cloudless-thousandoaks/actions/workflows/playwright.yml/badge.svg)](https://github.com/yeshallbeasgods/universal-cloudless-thousandoaks/actions/workflows/playwright.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A Playwright + TypeScript test automation framework targeting the [Sauce Demo](https://www.saucedemo.com) application and the OpenWeather API. Built to demonstrate professional QA engineering practices: page objects delivered through custom fixtures, web-first assertions, strict typing with type-aware linting, tagged test runs, and API testing in the same runner as the UI tests.

Secrets are treated as a first-class concern. The OpenWeather key lives only in `.env` or a GitHub Secret. It is redacted from error messages and report attachments, kept out of traces, and scoped to the single CI step that needs it. CI also fails loudly when the key is missing instead of letting tests skip silently.

## Tech Stack

- Node.js (version pinned in `.nvmrc`)
- Playwright Test
- TypeScript (strict)
- dotenv
- ESLint (typescript-eslint, eslint-plugin-playwright)
- Prettier
- Allure 3 (`allure-playwright` reporter, `allure` CLI)

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
├── reporters/
│   └── clearFailureReporter.ts     # Terminal reporter: failures first, EXPECTED/RECEIVED labels
├── scripts/
│   └── buildStatus.mts             # Writes status.json for the landing page (run by CI)
├── site/                           # Landing page published to GitHub Pages (index.html, style.css, app.js)
├── test-data/                      # Typed data arrays that drive generated tests
│   ├── apiKeyCases.ts              # Invalid and missing API key cases
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
│   ├── allureLabels.ts             # Sets Allure epic / feature / story from the spec's path
│   ├── env.ts                      # requireEnv / optionalEnv: environment variables
│   ├── openWeatherClient.ts        # Typed API client that redacts the key from errors
│   └── types.ts                    # Interfaces for OpenWeather responses
├── allurerc.mjs                    # Allure 3 config: report name, history file
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

### Reading failures

Four reports are written on every run:

- **Terminal:** a custom reporter (`reporters/clearFailureReporter.ts`) prints each failure as a block with the
  location (`file:line:col`, clickable in VS Code), the reason, the code frame, `EXPECTED` and `RECEIVED` labels
  instead of Playwright's `-`/`+` diff, and the command to re-run just that test.
- **HTML:** `npx playwright show-report`.
- **JSON:** `test-results/results.json`, structured results for scripts and AI agents.
- **Allure:** raw results go to `allure-results/` on every run (and are cleared at the start of `npm test`). Build and
  open the report with:

    ```bash
    npm test
    npm run report:generate   # writes allure-report/
    npm run report:open       # serves it in your browser
    ```

    Tests are grouped by epic (`Web UI` or `API`), feature (the spec file) and story (the test title), set
    automatically from the file's location by an `auto` fixture. Failed UI tests carry a screenshot and a trace, and
    API tests carry a request/response summary with the API key replaced by `***`.

#### What a failure looks like

Real output from the terminal reporter for a deliberately failing check (code frame trimmed). The location is
clickable in VS Code, and `EXPECTED` / `RECEIVED` replace Playwright's `-` / `+` markers:

```text
──────────────────────────────────────────────────────────────────────────────
✘ FAILED  [chromium] demo: toMatchObject mismatch  @api
──────────────────────────────────────────────────────────────────────────────
Where  tests/e2e/zz-reporter-demo.spec.ts:7:15
Why    expect(received).toMatchObject(expected)

Differences  (EXPECTED = what the test asked for, RECEIVED = what came back)

         Object {
           "cod": 200,
           "main": Object {
             "humidity": 66,
EXPECTED     "temp": Any<String>,
RECEIVED     "temp": 55.1,
           },
EXPECTED   "name": "Chicago ",
RECEIVED   "name": "Chicago",
         }

Code
>  7 | 	expect(body).toMatchObject({ name: 'Chicago ', main: { temp: expect.any(String), ... } })
     | 	             ^

Re-run:  npx playwright test tests/e2e/zz-reporter-demo.spec.ts:6 --project=chromium
```

The same failure also lands in the HTML report, the Allure report and `test-results/results.json`.

The terminal reporter works from the text of Playwright's error messages, so a Playwright upgrade can change what it
sees. It falls back to the raw message whenever it does not recognize a format, so a failure is never hidden. After
bumping `@playwright/test`, run a failing test and check that the output still reads correctly.

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
- **Readable failures.** A custom terminal reporter shows where, why and EXPECTED vs RECEIVED for every failure (see [What a failure looks like](#what-a-failure-looks-like)).
- **Known defects documented as tests.** Sauce Demo's `problem_user` and `error_user` have real bugs. Those tests assert the correct behavior and use `test.fail()`, so they pass while the bug exists and start failing the day it is fixed.

## CI

`.github/workflows/playwright.yml` runs on every push and pull request to `main`, nightly at 11:17 UTC (early morning US Central time, to catch drift in
Sauce Demo and the OpenWeather API), and on demand from the Actions tab.

- **Lint** runs first (`npm run lint` and `npm run typecheck`).
- **UI tests** and **API tests** then run in parallel as separate jobs, so a failure shows which layer broke. Only the UI
  job installs a browser.
- `OPENWEATHER_API_KEY` is a repository secret, available to the API test step only. Fork PRs do not receive secrets, so
  their API tests skip. The API job fails if the key is missing on any other run, so a skipped suite cannot pass silently.
  Dependabot PRs read **Dependabot secrets**, so the key is stored there as well.
- Every run uploads `allure-results-*` and `playwright-report-*`. Failed runs also upload `test-results-*` (traces and
  screenshots). Download them from the run's summary page and open a trace with `npx playwright show-trace`.
- **Report** builds the Allure report from both test jobs' results, even when a test job failed. It also builds the
  landing page in `site/` and a `status.json` (per-layer results, test counts, commit, run link) with
  `scripts/buildStatus.mts`. This job is read-only.
- **Publish to GitHub Pages** pushes the result to the `gh-pages` branch. It is the only job with write access, it runs
  none of the project's code, and it only runs for `main` and the nightly schedule, never for pull requests. Pages
  serves `gh-pages` at <https://yeshallbeasgods.github.io/universal-cloudless-thousandoaks/>: the landing page at the
  root, the latest Allure report under `report/`, and the trend history under `history/`.
- Allure's trend charts use a history file (`allurerc.mjs` sets the path). CI copies the last published file in before
  generating and publishes the updated one, so trends carry from run to run.

One-time setup: Pages must be pointed at the branch once, under Settings, Pages, "Deploy from a branch", `gh-pages`,
`/ (root)`. The branch does not exist until the first publish.

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
- [x] OpenWeather API tests — schema, data quality, negative cases, one test per city, key redaction
- [x] Custom terminal reporter and JSON results
- [x] Allure reporting — labels, failure screenshots and traces, redacted API attachments, environment info

**In progress**

- [ ] CI and GitHub Pages publishing

**Upcoming**

- [ ] Mocking with network interception
- [ ] CI workflow and reporting
- [ ] Test-health tracking and manual QA artifacts in `docs/qa/`
