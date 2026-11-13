# GitHub Actions

CI pipelines for podyard. The workflow files in this directory (`ci.yml`,
`e2e.yml`, `deploy.yml`) are the source of truth — copy them into
`.github/workflows/` to activate them. This file documents intent and the
matrix.

## Workflows

### `ci.yml` — Continuous Integration (every push & PR)

```
install ──> typecheck ──> lint (ultracite) ──> test ──> build
   bun install    turbo typecheck   turbo check      turbo test    turbo build
```

- Caches `node_modules` keyed on `bun.lock`
- `typecheck` runs `tsc --noEmit` per workspace via `turbo run typecheck`
- `lint` runs the ultracite (Biome) config at the repo root
- `test` runs all `vitest` suites (`turbo test`)
- `build` produces full Next.js builds (`turbo build`), which also surfaces
  prerender failures early

### `e2e.yml` — End-to-end (pull requests, `main`)

```
install ──> build ──> [ app:3000, web:3001, api:3002 ] ──> playwright test
```

- Builds all apps, then serves them with `next start` behind a single
  Postgres container (service) so API routes can reach the database
- Runs the Playwright suite defined in `e2e/` (see `e2e/README.md`)
- Uploads `e2e/playwright-report` + `e2e/test-results` as artifacts on failure
- Tags: PRs run `@smoke`; `main` runs the full suite

### `deploy.yml` — Manual Vercel deploy (optional)

Vercel's GitHub integration is the default deploy path. This template exists
for teams that want `vercel deploy` from CI (e.g. deploys from protected
branches without the Vercel integration):

```yaml
- run: npx vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
  working-directory: apps/<project>
```

## Required GitHub Secrets

| Secret | Used by | Purpose |
| ------ | ------- | ------- |
| `VERCEL_TOKEN` | `deploy.yml` | `vercel deploy` CLI auth |
| `VERCEL_ORG_ID` | `deploy.yml` | Vercel org |
| `VERCEL_PROJECT_ID` | `deploy.yml` (×4, or per job) | Target project |

CI and E2E need no secrets beyond `GITHUB_TOKEN` (for artifact uploads and
the existing release flow).

## Environments

Define two GitHub Environments to gate the deploy workflow:

- `staging` — preview deploys
- `production` — requires a reviewer; maps to `VERCEL_PROJECT_ID` for prod
