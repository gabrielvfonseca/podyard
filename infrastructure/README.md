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
│   └── deploy.yml         # Manual `vercel deploy` (workflow_dispatch)
└── docker/
    ├── Dockerfile         # Multi-app Next.js build image (ARG APP_DIR)
    └── docker-compose.yml # Local parity stack (app, web, api + Postgres)
```

## Vercel (primary target)

All Next.js apps deploy directly to Vercel:

| Project   | Source      | Framework | Port (dev) |
| --------- | ----------- | --------- | ---------- |
| `app`     | `apps/app`  | Next.js   | 3000       |
| `web`     | `apps/web`  | Next.js   | 3001       |
| `api`     | `apps/api`  | Next.js   | 3002       |
| `docs`    | `apps/docs` | Next.js   | 3003       |
| `studio`  | (n/a)       | Prisma Studio (CLI) | 3005 |

Each app carries its own `vercel.json` (bun runtime, cron jobs, `[skip ci]`
ignore command). Cross-project env vars are managed in the Vercel dashboard;
see `vercel/README.md` for the full matrix.

## GitHub Actions

See `github/README.md` for the CI pipeline:

- **CI** (`ci.yml`) — install, typecheck, lint, unit tests, build
- **E2E** (`e2e.yml`) — Playwright suite in `e2e/` on pull requests
- **Deploy** — Vercel's GitHub integration handles deploys; a `deploy.yml`
  template is provided for teams that prefer `vercel deploy` via CLI

## Docker

`docker/` contains a Dockerfile and compose file that mirror the Vercel build
so the apps can run in any container runtime (local, E2E workers, air-gapped
environments). The Vercel platform remains the source of truth for production.
