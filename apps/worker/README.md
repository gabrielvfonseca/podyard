# `apps/worker`

Cloudflare Worker for Podyard.

## Overview

- Entry: `src/index.ts`
- Config: `wrangler.toml`
- Uses `@podyard/sdk` and `@frontal-labs/error`
- Example routes: `/health`, `/sandboxes` (requires `PODYARD_API_KEY`)

## Scripts

```bash
bun run dev        # wrangler dev
bun run deploy     # wrangler deploy
bun run typecheck  # tsc --noEmit
```

## Deployment

See `deploy/cloudflare/README.md` and set secrets with `wrangler secret put`.
