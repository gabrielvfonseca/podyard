# Tests

Shared integration test suite for podyard.

Per-app unit tests live inside each app (`apps/*/__tests__`) and run via
`turbo test`. This directory is for tests that span multiple workspaces —
integration tests, cross-package contract tests, and repo-level sanity
checks.

## Layout

```
tests/
├── package.json
├── vitest.config.mts   # node environment, @podyard/* → packages/*
├── tsconfig.json
├── repo.test.ts        # sanity: top-level directories exist
└── *.test.ts           # add integration suites here
```

## Run

```bash
cd tests
bun install
bun test            # one-shot (vitest run)
bun test:watch      # watch mode
bun typecheck
```

Or from the repo root: `bun test` (turbo picks up the `test` script).

## Conventions

- One file per concern (`auth.test.ts`, `billing.test.ts`, `api-contract.test.ts`).
- Use the `@podyard/*` alias to import from `packages/*` without relative paths.
- Keep DB-dependent tests behind a real Postgres (see the `postgres` service
  in `infrastructure/github/ci.yml`) — do not mock the database at this level.
