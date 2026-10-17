# AGENTS.md

Playwright + TypeScript test suite for Sauce Demo (UI) and the OpenWeather API. Portfolio repo: correctness and readability matter more than volume.

## Commands

```bash
nvm use                                     # Node version from .nvmrc
npm ci                                      # install
npx playwright install --with-deps chromium # browser (first run / CI); Chromium only
npm test                                    # everything
npx playwright test --grep @smoke           # by tag: @smoke, @api, @regression
npx playwright test --project=chromium      # UI tests only
npx playwright test --project=api           # API tests only (no browser; needs OPENWEATHER_API_KEY)
npx playwright test path/to/file.spec.ts:42 --headed   # one test, visible
npx playwright test --ui                    # UI mode (time-travel debugging)
npx playwright test --debug                 # inspector
npx playwright show-report                  # HTML report
npx playwright show-trace <trace.zip>       # open a trace
npm run report:generate                     # build the Allure report from allure-results/
npm run report:open                         # serve the generated report
npm run lint && npm run typecheck           # must pass before any commit
```

Scripts arrive with their tickets. If a command here doesn't exist yet, say so instead of inventing it.

## Conventions (what the code won't tell you)

- Import `test` and `expect` from `fixtures/`, never from `@playwright/test` directly in specs.
- Specs contain no selectors. Locators live in page objects under `pages/`. Prefer `getByTestId` (the config maps it to `data-test`), then role/label/text. Avoid CSS and XPath.
- Web-first assertions only (`await expect(locator)...`). No `waitForTimeout`, no manual sleeps, no committed `test.only`.
- Strict TypeScript, no `any`. Type API responses with interfaces.
- Tag every test: `@smoke`, `@regression`, or `@api`.
- Data-driven cases come from typed arrays in `test-data/`, one generated test per entry. Don't copy-paste tests.
- Secrets: `OPENWEATHER_API_KEY` comes from the environment (`.env` locally, a GitHub Secret in CI). Never hardcode it, log it, or attach it to reports. Never read or print `.env`. OpenWeather takes the key in the URL, and Playwright prints URLs in errors and traces, so API calls go through `OpenWeatherClient` (`utils/`), which redacts the key. In API specs never use `toBeOK()`, never log URLs or full responses, and keep `trace: 'off'` on the `api` project. Attachments are published in the Allure report, so attach request/response data only through redacted summaries (see `OpenWeatherClient`). Allure epic/feature/story labels are set automatically from the spec path (`utils/allureLabels.ts`); add new spec files to its `features` table.
- A known app defect gets a test that asserts the correct behavior, marked `test.fail(true, '<reason>')`. Never assert the buggy behavior. Remove the marker when the defect is fixed.
- Compare money as parsed numbers with `toBeCloseTo(expected, 2)`, never as strings or with `toBe` on a sum.
- Read environment variables through `requireEnv` (`utils/env.ts`), not raw `process.env`. Turn price text like `$29.99` into numbers with `parseCurrency` (`utils/currency.ts`).
- Style and formatting belong to ESLint/Prettier, not this file. Run them.

## Writing page objects and specs

- Never guess locators. Inspect the running app first (a browser tool, `npx playwright codegen`, or a scratch script) and use the `data-test` IDs it actually exposes. A typo inside a string compiles fine and only fails at runtime.
- Sauce Demo is a single-page app: the URL changes before the new page renders. When probing, wait for an element unique to the target page, not the URL. Raw reads (`count()`, `allInnerTexts()`, `$$eval`) do not auto-wait; actions and `expect(locator)` do.
- Check each new page object against the live site with a scratch spec, then delete it. Never commit probes or scratch files.
- Register new page objects in `fixtures/index.ts`; specs ask for them by name in the test signature.

## Working agreement

The owner is learning Playwright through this repo, so pace matters more than speed.

1. One ticket at a time. Stay inside the ticket's Scope; Out of Scope is a hard line.
2. Plan first. For a ticket or any multi-file change, propose a short plan (files and steps) and wait for approval before editing.
3. Work in small steps. Do one step, show it, stop for review. Don't scaffold things the ticket hasn't asked for yet.
4. Explain briefly. The first time a Playwright idea appears (fixtures, auto-waiting, routing), give two or three sentences on why, plus one alternative considered.
5. Don't fill in `TODO(human)` markers or any piece the owner said they will write. Offer a review instead.
6. Ask before adding a dependency, editing `playwright.config.ts`, or touching anything under `.github/`.
7. If a ticket is ambiguous, ask one question instead of guessing.
8. Before saying "done", run lint, typecheck, and the tests that cover the change. Report what you ran and the real result. If something couldn't be run, say so.

## Debugging loop

Local: run the single failing test headed or with `--debug`, read `test-results/` (trace, screenshot), open the trace with `show-trace`, fix, re-run. The terminal prints each failure as a block with `file:line:col`, a reason, and EXPECTED/RECEIVED labels; the same results are machine-readable in `test-results/results.json`.

CI: `gh run list --limit 5`, `gh run view <id> --log`, `gh run download <id>`, then open the trace artifact locally. CI has three jobs (`lint`, `ui`, `api`) that upload `allure-results-*`, `playwright-report-*` and, on failure, `test-results-*`. Fix, push, and confirm CI is green. Never commit debug code. Never print secrets in workflow steps; the API key is set on the API test step only.

## Where to look

- Project board tickets hold scope and acceptance criteria. Read the ticket first.
- `README.md`: setup, how to run, migration notes. Update it when commands or behavior change.
- `docs/qa/`: manual QA artifacts. Keep the coverage matrix honest.
