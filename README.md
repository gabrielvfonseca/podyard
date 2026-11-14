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
| `docs`       | [Mintlify](https://mintlify.com)-based documentation                   | 3004   |
| `cli`        | The `podyard` command-line interface (stub — not yet implemented)       | —      |
| `studio`     | Development-only studio app (stub)                                      | —      |
| `storybook`  | Storybook for the shared design system                                  | —      |

### `packages/`

Shared libraries consumed by the apps:

- `@podyard/analytics` — event tracking (PostHog / GA)
- `@podyard/auth` — Clerk-based authentication
- `@podyard/database` — Prisma schema and client
- `@podyard/design-system` — shared React/UI components (shadcn-based)
- `@podyard/email` — transactional email via Resend
- `@podyard/feature-flags` — feature flag client
- `@podyard/internationalization` — i18n helpers (used by `web`)
- `@podyard/next-config` — shared Next.js configuration
- `@podyard/observability` — Sentry + Better Stack wiring
- `@podyard/payments` — Stripe integration (subscriptions, metering)
- `@podyard/rate-limit` — request rate limiting
- `@podyard/sdk` — Podyard SDK (stub — not yet implemented)
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
- `scripts/` — root-level maintenance scripts (e.g. dependency updates)

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
| `bun run migrate`      | Run a Prisma dev migration                            |
| `bun run migrate:deploy` | Run a Prisma production migration                  |
| `bun run db:push`      | Push the Prisma schema to the database (no migration) |

## Documentation

The Mintlify docs live in [`apps/docs`](apps/docs). To develop them locally, follow
the [Mintlify development guide](https://mintlify.com/docs/development).

## Status

This repository is the **hosted platform** for the Podyard sandbox engine. The engine
itself (sandbox creation, exec, filesystem, snapshot, fork, destroy) is implemented in
[frontal-labs/sandbox](https://github.com/frontal-labs/sandbox). Several parts of this
platform are still in progress:

- `apps/cli` — the `podyard` CLI is a stub and is not yet implemented.
- `packages/sdk` — the Podyard SDK is a stub and is not yet implemented.
- `apps/studio` — a development-only studio app, not part of the shipped product.

See [NOTICE.md](NOTICE.md) for the attribution of the engine and its license.

## License

Podyard is licensed under the [MIT License](LICENSE.md).

The sandbox engine it builds on is licensed under the [Apache License 2.0](https://github.com/frontal-labs/sandbox)
— see [NOTICE.md](NOTICE.md) for the full third-party attribution.
