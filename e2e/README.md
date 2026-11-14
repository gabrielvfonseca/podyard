# E2E

Playwright end-to-end suite for podyard.

## Layout

```
e2e/
├── package.json
├── playwright.config.ts   # chromium project, globalSetup/globalTeardown, HTML reporter
├── global-setup.ts        # orchestrates boot via start-apps.cjs, waits for readiness
├── global-teardown.ts     # kills the helper + apps, surfaces any mid-run crashes
├── shared-state.ts        # PID-file bridge between setup and teardown
├── start-apps.cjs         # plain-CJS boot helper (spawns app/web/api, emits JSON events)
├── start.ts               # standalone app booter (manual use / CI parity)
└── tests/
    ├── smoke.spec.ts      # homepage, 404, /health
    └── health.spec.ts     # cross-app liveness + page-error check
```

## One-command run

The suite boots the apps itself via Playwright `globalSetup`, so a single
command is enough:

```bash
cd e2e
bun install
bunx playwright install chromium    # first time only
bun run test                        # boot apps → run headless → tear down
```

> Use `bun run test` (or `bunx playwright test`), **not** bare `bun test` —
> the latter is bun's native runner, not Playwright.

## Boot architecture

`global-setup.ts` delegates app spawning to `start-apps.cjs`, a plain-CJS
helper run via `spawnSync`.

**Why a helper?** In Playwright's globalSetup context (Node 22, loaded
in-process through `nodeModule.registerHooks`), async `spawn` fails with
ENOENT for *every* binary — even `/bin/sh` with an absolute path — while
`spawnSync` works reliably. The helper performs the actual async spawns from
a plain Node context where they succeed.

The helper:

- spawns the three apps (app, web, api) with per-app args:
  - **app** / **web** (Next.js): `bun --bun next start`
  - **api** (Hono, compiled): `bun dist/index.js`
- emits line-delimited JSON events on stdout (`ready`, `exit`, `spawn-error`)
- persists its own PID so `global-teardown` can stop it and the apps

**Important:** `SKIP_ENV_VALIDATION` must **not** be set in the helper's
environment. Setting it causes `@t3-oss/env-nextjs` (used by app/web with
`runtimeEnv: {}`) to return an empty object at runtime, making all
`NEXT_PUBLIC_*` vars undefined and breaking sign-in (500). Without it,
`.env.local` loads correctly and validation passes.

## Options

- `bun run test:headed` — watch the browser.
- `bun run test:report` — open the HTML report.
- `E2E_NO_BOOT=1` — skip booting; assume the apps are already running
  (useful with the docker parity stack or `bun start.ts`).
- `E2E_PORT_APP` / `E2E_PORT_WEB` / `E2E_PORT_API` — override the ports
  (defaults 3000 / 3001 / 3002).
- `E2E_BUN_PATH` — absolute path to the `bun` binary (the helper resolves
  bun via `which bun` or falls back to `bun` on `PATH`).

## Manual boot (parity / docker)

If you prefer to start the servers yourself:

```bash
bun build                 # from repo root
bun e2e/start.ts          # from repo root (or: cd e2e && bun run start)
# then, with the apps up:
E2E_NO_BOOT=1 bun run test
```

Or the docker parity stack:

```bash
docker compose -f infrastructure/docker/docker-compose.yml up --build
E2E_NO_BOOT=1 bun run test
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
