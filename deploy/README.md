# Deploy

Programmatic Vercel deploy tooling for podyard.

The **default** deploy path is Vercel's GitHub integration (push to `main` →
auto-deploy). This directory provides a CLI wrapper for CI jobs that want to
trigger deploys explicitly, and documentation of the project map.

## Usage

```bash
# From the repo root, after `bun install`:
VERCEL_TOKEN=... bun deploy.ts web --prod
VERCEL_TOKEN=... bun deploy.ts app          # preview deployment
```

Supported projects: `app`, `web`, `api`, `docs`.

The script shells out to `bunx vercel deploy` with the project's root dir as
`--cwd`, so no additional configuration is needed.

## Project map

| Project | Root dir   | Dev port |
| ------- | ---------- | -------- |
| app     | `apps/app` | 3000     |
| web     | `apps/web` | 3001     |
| api     | `apps/api` | 3002     |
| docs    | `apps/docs`| 3003     |

## Environment variables

| Variable | Required | Purpose |
| -------- | -------- | ------- |
| `VERCEL_TOKEN` | yes | Auth for the Vercel CLI |
| `VERCEL_ORG_ID` | no | Scopes the deploy to an org (auto-detected otherwise) |

## CI

`infrastructure/github/deploy.yml` runs this script on `workflow_dispatch`
with a `project` + `target` (production / preview) input.
