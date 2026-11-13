# Changelog

All notable changes to Podyard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-01-01

### Added

- Initial Podyard platform: a Turborepo monorepo containing the marketing
  website (`apps/web`), user dashboard (`apps/app`), HTTP API (`apps/api`),
  Mintlify docs (`apps/docs`), and the shared `packages/*` libraries.
- Authentication via Clerk, Prisma database, Stripe payments, Svix webhooks,
  Arcjet security, Sentry + Better Stack observability, and PostHog/GA analytics.
- Built on top of the open-source
  [Frontal Sandbox engine](https://github.com/frontal-labs/sandbox) (Apache-2.0).

> This repository was forked from the Vercel [next-forge](https://github.com/vercel/next-forge)
> Turborepo template and rebranded as Podyard. The next-forge release history
> (v6.0.2 and earlier) is preserved in the git history; Podyard's own changelog
> starts here.

## Unreleased

### Planned / In progress

- `apps/cli` — the `podyard` command-line interface (stub).
- `packages/sdk` — the Podyard SDK (stub).
- `apps/studio` — development-only studio app (stub).
