# Deployment infrastructure

Infrastructure and deployment scripts (not a TypeScript package).

## Targets

- **Vercel**: Next.js apps in `apps/app`, `apps/web`, `apps/api`, `apps/docs`
- **Cloudflare**: Worker in `apps/worker` (`deploy/cloudflare`)
- **Fly.io**: container workloads (`deploy/fly`)

## Layout

```
deploy/
  vercel/        # Vercel project/deploy scripts and env notes
  cloudflare/    # Cloudflare deployment helpers/notes
  fly/           # Fly.io deployment helpers/notes
```

## Usage

Vercel deploy (CI/manual):

```bash
VERCEL_TOKEN=... bun deploy/vercel/deploy.ts web --prod
```

Cloudflare worker:

```bash
cd apps/worker && bun run deploy
```

Fly.io:

```bash
fly deploy -c deploy/fly/fly.toml
```
