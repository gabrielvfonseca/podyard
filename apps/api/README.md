# `apps/api`

Hono-based API service for Podyard (runs on Bun).

## Overview

- Entry: `src/index.ts`
- App/routes: `src/app.ts`, `src/routes/*`
- Auth: Better Auth handler mounted at `/api/auth/*`
- Webhooks: Stripe and auth webhook endpoints

## Scripts

```bash
bun run dev        # Hono dev server + Stripe listener
bun run build      # Bundle to dist/
bun run start      # Run dist/index.js
bun run test       # Vitest
bun run typecheck  # tsc --noEmit
```

## Environment

Copy `.env.example` to `.env` and set required values (database, `BETTER_AUTH_*`, Stripe, observability, etc.).
