# Vercel Project Map

podyard deploys four Next.js applications to Vercel. Each app folder contains
its own `vercel.json`; the rest of this file documents the project wiring and
the environment variable matrix.

## Projects

| Vercel project | Root dir   | Dev URL convention | Notes |
| -------------- | ---------- | ------------------ | ----- |
| `podyard-app`  | `apps/app` | `*.podyard.app`    | Authenticated product; Liveblocks (removed) |
| `podyard-web`  | `apps/web` | `*.podyard.com`    | Marketing site; CMS (removed); arcjet |
| `podyard-api`  | `apps/api` | `api.podyard.com`  | API routes, Stripe webhooks, cron keep-alive |
| `podyard-docs` | `apps/docs`| `docs.podyard.com` | fumadocs |

### Cron

`apps/api/vercel.json` schedules a daily keep-alive:

```json
{ "path": "/cron/keep-alive", "schedule": "0 1 * * *" }
```

Keep this route warm; the database connection pool depends on it in dev
environments.

## Environment Variables

Values are managed in **Vercel → Project → Settings → Environment Variables**.
The table below is the canonical list (sourced from each app's `env.ts` and
`packages/*/keys.ts`). Scope each var to the projects that need it.

### Shared (all projects)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `NEXT_PUBLIC_APP_URL` | app, web | Public URL of the app |
| `NEXT_PUBLIC_WEB_URL` | web, api | Public URL of the marketing site |
| `NEXT_PUBLIC_DOCS_URL` | web | Public URL of the docs site |
| `SENTRY_AUTH_TOKEN` | all | Sentry source token (build-time) |
| `SENTRY_DSN` | all | Sentry ingest DSN (runtime) |

### `app` (apps/app)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `DATABASE_URL` | yes | Neon/Postgres connection string |
| `BETTER_AUTH_SECRET` | yes | Better Auth secret |
| `BETTER_AUTH_URL` | yes | Better Auth base URL |
| `ARCJET_KEY` | no | Arcjet keybot detection (enables `secure()`) |
| `UPSTASH_REDIS_REST_URL` | no | Rate limiting / flags |
| `UPSTASH_REDIS_REST_TOKEN` | no | Rate limiting / flags |

### `web` (apps/web)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `ARCJET_KEY` | no | Arcjet keybot detection |
| `UPSTASH_REDIS_REST_URL` | no | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | no | Rate limiting |
| `STRIPE_SECRET_KEY` | no | Payment links (if enabled) |
| `STRIPE_WEBHOOK_SECRET` | no | Webhook verification (if enabled) |

### `api` (apps/api)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `DATABASE_URL` | yes | Neon/Postgres connection string |
| `BETTER_AUTH_SECRET` | yes | Better Auth secret |
| `BETTER_AUTH_URL` | yes | Better Auth base URL |
| `STRIPE_SECRET_KEY` | yes | Stripe API key |
| `STRIPE_WEBHOOK_SECRET` | yes | `whsec_...` from Stripe dashboard |
| `UPSTASH_REDIS_REST_URL` | no | Rate limiting / feature flags |
| `UPSTASH_REDIS_REST_TOKEN` | no | Rate limiting / feature flags |

### `docs` (apps/docs)

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `NEXT_PUBLIC_DOCS_URL` | yes | Public URL (canonical links) |

## Build Commands

Vercel infers these automatically from `package.json` scripts, documented here
for reference:

```bash
# app
bun --bun next build
# web
bun --bun next build
# api
bun --bun next build
# docs
bun --bun next build
```

`ignoreCommand: node scripts/skip-ci.js` in each `vercel.json` skips the
deploy when the commit message contains `[skip ci]`.

## Local Parity

`infrastructure/docker/docker-compose.yml` brings up the same three Next.js
apps with a shared Postgres for environments where Vercel isn't available
(local E2E, offline development, air-gapped CI).
