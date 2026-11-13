# Tools

Developer utilities for podyard.

This directory holds cross-cutting dev scripts that don't belong in any single
app or package. Root-level `scripts/` (initialize, update, index) remains the
home for repo bootstrap/upgrade tooling; `tools/` is for day-to-day developer
workflows.

## Available tools

### `dev.ts` — parallel dev servers

Launches one or more Next.js apps concurrently:

```bash
bun dev.ts              # app + web + api (all defaults)
bun dev.ts app web      # subset
bun dev.ts api          # single app
```

| App | Dir        | Port |
| --- | ---------- | ---- |
| app | `apps/app` | 3000 |
| web | `apps/web` | 3001 |
| api | `apps/api` | 3002 |

Tear down with `Ctrl-C` (SIGINT forwards SIGTERM to all children).

## Conventions

- One file per tool, kebab-case or short-camel (`dev.ts`, `check-env.ts`).
- Tools are plain `bun` scripts — no build step, no dependencies unless the
  tool genuinely needs them.
- Add a `bun <file>` script to `package.json` for every tool so they show up
  in `bun run --help`.
