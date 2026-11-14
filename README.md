![Podyard Banner](banner.jpg)

# Millisecond sandboxes for agents. Full VMs only when needed.

**Sandboxes for AI agents that start in under 5 ms on V8 isolates. When a command needs real Linux, the session moves to a Firecracker microVM, so you only pay VM costs when you have to. Snapshot, fork and replay any session. Network access is off by default.** 

This repository contains the **hosted platform** (the code in this repo). The **sandbox
engine** itself is a separate project:
[github.com/frontal-labs/sandbox](https://github.com/frontal-labs/sandbox).

## Repository layout

This is a [Turborepo](https://turborepo.com) monorepo. The platform is split into
`apps/` (deployable Next.js applications and tools) and `packages/` (shared libraries).

### `apps/`

| App          | What it is                                                             | Port   |
| ------------ | ---------------------------------------------------------------------- | ------ |
| `web`        | Marketing website and public docs landing (`/pricing`, `/contact`)     | 3001   |
| `app`        | User dashboard (auth, organization pages, webhooks)                    | 3000   |
| `api`        | HTTP API and Stripe webhooks (consumed by the CLI and SDKs)            | 3002   |
| `docs`       | [fumadocs](https://fumadocs.vercel.app)-based documentation            | 3004   |
| `cli`        | The `podyard` command-line interface (commander-based)                 | —      |
| `studio`     | Development-only Drizzle Studio wrapper                                 | —      |
| `storybook`  | Storybook for the shared design system                                  | —      |
| `worker`     | Cloudflare Worker (`wrangler`), sandbox proxy + health endpoint         | —      |

### `packages/`

Shared libraries consumed by the apps:

- `@podyard/analytics` — event tracking (PostHog / GA)
- `@podyard/auth` — Better Auth-based authentication
- `@podyard/database` — Drizzle schema and client
- `@podyard/design-system` — shared React/UI components (shadcn-based)
- `@podyard/email` — transactional email via Resend
- `@podyard/feature-flags` — feature flag client
- `@podyard/internationalization` — i18n helpers (used by `web`)
- `@podyard/next-config` — shared Next.js configuration
- `@podyard/observability` — Sentry + Better Stack wiring
- `@podyard/payments` — Stripe integration (subscriptions, metering)
- `@podyard/rate-limit` — request rate limiting
- `@podyard/sdk` — Podyard SDK (client, errors, types; `tsup` build)
- `@podyard/security` — Arcjet + shared security helpers
- `@podyard/seo` — metadata / sitemap helpers
- `@podyard/typescript-config` — shared `tsconfig` presets
- `@podyard/webhooks` — Svix-based webhook delivery

### Top-level

- `e2e/` — [Playwright](https://playwright.dev/) end-to-end tests
- `tests/` — repository-level tests (run against the monorepo itself)
- `tools/` — internal dev tooling
- `turbo/` — Turborepo configuration and generators
- `deploy/` and `infrastructure/` — deployment and infrastructure definitions
- `skills/` — agent skill definitions for working on this codebase

Maintenance scripts (e.g. `bump-deps`) live in the root `package.json` rather
than a dedicated `scripts/` directory.

## Getting started

### Requirements

- [Bun](https://bun.sh)
- [Node.js](https://nodejs.org) (for tooling that expects a Node runtime)

### Install and run

```bash
bun install
bun dev
```

This starts the dashboard (`:3000`), marketing site (`:3001`), and API (`:3002`).
The docs app (`:3004`) is started separately with `bun run dev --filter=docs`.

### Environment variables

Each app ships with an `.env.example` listing the secrets it needs (Clerk,
Resend, Stripe, Sentry, Better Stack, Arcjet, Svix, and the
`NEXT_PUBLIC_*` URLs that point between apps). Copy `.env.example` to `.env`
inside each app and fill in the values before running locally.

### Useful commands

| Command                | What it does                                          |
| ---------------------- | ----------------------------------------------------- |
| `bun dev`              | Run all apps in watch mode                            |
| `bun run build`        | Build all apps and packages                           |
| `bun test`             | Run all tests (Vitest)                                |
| `bun run check`        | Lint and format check (Ultracite / Biome)             |
| `bun run fix`          | Auto-fix lint and formatting issues                   |
| `bun run typecheck`    | Type-check all packages (per-app script)              |
| `bun run migrate`      | Generate and run a Drizzle migration                  |
| `bun run migrate:deploy` | Run a Drizzle production migration                 |
| `bun run db:push`      | Push the Drizzle schema to the database (no migration)|

## Documentation

The docs live in [`apps/docs`](apps/docs), built on
[fumadocs](https://fumadocs.vercel.app). Run `bun run dev --filter=docs` to develop
them locally on port 3004.

## Status

This repository is the **hosted platform** for the Podyard sandbox engine. The engine
itself (sandbox creation, exec, filesystem, snapshot, fork, destroy) is implemented in
[frontal-labs/sandbox](https://github.com/frontal-labs/sandbox). The platform is
largely implemented; the remaining development-only pieces are:

- `apps/studio` — a development-only Drizzle Studio wrapper, not part of the shipped
  product.
- `apps/worker` — a Cloudflare Worker that proxies sandbox requests; wire up
  `PODYARD_API_KEY` / `PODYARD_BASE_URL` before deploying.

See [NOTICE.md](NOTICE.md) for the attribution of the engine and its license.

## License

Podyard is licensed under the [MIT License](LICENSE.md).

The sandbox engine it builds on is licensed under the [Apache License 2.0](https://github.com/frontal-labs/sandbox)
— see [NOTICE.md](NOTICE.md) for the full third-party attribution.
