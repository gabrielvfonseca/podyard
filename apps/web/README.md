# `apps/web`

Public/marketing web application for Podyard (Next.js).

## Overview

- App Router source: `src/app/`
- Includes i18n, SEO, analytics, observability, security, rate limiting, and email integrations
- Port: `3001` (dev)

## Scripts

```bash
bun run dev        # Next.js dev server (port 3001)
bun run build      # Production build
bun run start      # Start production server
bun run analyze    # Bundle analysis build
bun run typecheck  # tsc --noEmit
```

## Environment

Copy `.env.example` to `.env` and configure required public URLs and service keys.
