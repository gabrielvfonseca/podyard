![Podyard Banner](banner.jpg)

# Podyard

Sandboxes for AI agents. Hosted platform monorepo.

Engine: [frontal-labs/sandbox](https://github.com/frontal-labs/sandbox).

## Repository layout

### Apps
- `apps/app`, `apps/web`, `apps/api`, `apps/docs` — Next.js apps (Vercel)
- `apps/worker` — Cloudflare Worker
- `apps/cli` — `@podyard/cli` (published)
- `apps/storybook`, `apps/studio` — internal tools

### Packages
- `packages/sdk` — `@podyard/sdk` (published), DX-focused client built around `@frontal-labs/sandbox-sdk`
- `packages/*` — internal shared platform packages (`@podyard/*`, private)

### Infrastructure & tooling
- `deploy/` — infrastructure and deployment scripts (not a TS package): `vercel/`, `cloudflare/`, `fly/`
- `infrastructure/` — reference infra assets (docker, GitHub workflow templates)
- `.changeset/`, `.husky/` — release and git hooks

## Public npm packages

Only these packages are public/published:
- `@podyard/sdk` (`packages/sdk`)
- `@podyard/cli` (`apps/cli`)

## Development

```bash
bun install
bun run dev
```

Useful commands:

| Command | Description |
| --- | --- |
| `bun run build` | Build workspaces (Turbo) |
| `bun run test` | Run tests |
| `bun run typecheck` | Typecheck workspaces |
| `bun run check` | Lint/format checks |
| `bun run changeset` | Create a changeset |
| `bun run version-packages` | Version public packages |
| `bun run release` | Publish public packages |

## Deployment

- Vercel: `deploy/vercel/deploy.ts` or GitHub integration
- Cloudflare: `apps/worker` (`wrangler`)
- Fly.io: `deploy/fly/fly.toml` with `infrastructure/docker/Dockerfile`

See `deploy/README.md` and `infrastructure/README.md`.

## License

MIT. See [LICENSE.md](LICENSE.md) and [NOTICE.md](NOTICE.md).
