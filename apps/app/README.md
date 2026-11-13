# `apps/app`

Main authenticated Podyard web application (Next.js).

## Overview

- App Router source: `src/app/`
- Auth: Better Auth session checks/proxy in `src/proxy.ts` and layouts
- Shared integrations: analytics, database, design system, feature flags, observability, security, SEO, webhooks

## Scripts

```bash
bun run dev        # Next.js dev server (port 3000)
bun run build      # Production build
bun run start      # Start production server
bun run test       # Vitest
bun run analyze    # Bundle analysis build
bun run typecheck  # tsc --noEmit
```

## Environment

Copy `.env.example` to `.env` and configure `BETTER_AUTH_*`, database, Stripe, and public app URLs.
