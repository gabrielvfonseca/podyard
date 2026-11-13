# Cloudflare

Cloudflare Workers are deployed from `apps/worker`.

```bash
cd apps/worker
bun install
bun run dev      # wrangler dev
bun run deploy   # wrangler deploy
```

Secrets are managed via `wrangler secret put <NAME>`.
