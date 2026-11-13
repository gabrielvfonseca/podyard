# Infrastructure

Deployment configuration and infrastructure-as-code for podyard.

## Layout

```
infrastructure/
├── vercel/
│   └── README.md          # Vercel project map + environment variable matrix
├── github/
│   ├── README.md          # GitHub Actions docs
│   ├── ci.yml             # Install · typecheck · lint · test · build
│   ├── e2e.yml            # Playwright suite (e2e/) against live apps
│   └── deploy.yml         # Manual deploy workflow (workflow_dispatch)
└── docker/
    ├── Dockerfile         # Multi-app build image (ARG APP_DIR)
    └── docker-compose.yml # Local parity stack
```

## Deployment targets

- **Vercel**: `apps/app`, `apps/web`, `apps/api`, `apps/docs` (see `deploy/vercel/`)
- **Cloudflare**: `apps/worker` (see `deploy/cloudflare/`, `wrangler.toml` in app)
- **Fly.io**: containerized workloads via `deploy/fly/fly.toml` and `infrastructure/docker/Dockerfile`

`deploy/` contains the executable deployment scripts/helpers (not a TS package).

## GitHub Actions

- **CI** (`ci.yml`) — install, typecheck, lint, tests, build
- **E2E** (`e2e.yml`) — Playwright suite in `e2e/`
- **Deploy** (`deploy.yml`) — manual Vercel deploy via `deploy/vercel/deploy.ts`

## Docker

`docker/` mirrors a container build for local/E2E/Fly usage. Vercel remains the source of truth for hosted Next.js production deploys.
