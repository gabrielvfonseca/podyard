# E2E

Playwright end-to-end suite for podyard.

## Layout

```
e2e/
├── package.json
├── playwright.config.ts   # chromium project, HTML + GitHub Actions reporters
├── start.ts               # boots app(3000) + web(3001) + api(3002) concurrently
└── tests/
    └── smoke.spec.ts      # homepage, 404, /health
```

## Prerequisites

The suite runs against **already-running** Next.js servers. Either:

```bash
# Option A: build + start via the orchestration script
bun build                 # from repo root
bun e2e/start.ts          # from repo root (or: cd e2e && bun start)

# Option B: docker parity stack
docker compose -f infrastructure/docker/docker-compose.yml up --build
```

## Run

```bash
cd e2e
bun install
bunx playwright install --with-deps   # first time only
bun test                              # headless
bun test:headed                       # watch the browser
bun test:report                       # open the HTML report
```

## Conventions

- One spec file per app area (`app.spec.ts`, `web.spec.ts`, `api.spec.ts`).
- Base URLs are fixed to the local ports (3000/3001/3002); override with
  `E2E_BASE_URL` for the app project.
- Failures attach `test-results/` (traces, screenshots, videos) — uploaded
  as CI artifacts by `infrastructure/github/e2e.yml`.
- `forbidOnly` is enabled in CI so stray `.only` fails the pipeline.

## Tags

- `@smoke` — fast, runs on every PR (CI default)
- untagged — full suite, runs on `main`

Playwright's `--grep @smoke` / `--grep-invert @smoke` select between the two.
