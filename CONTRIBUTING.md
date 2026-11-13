# Contributing to Podyard

Podyard is the hosted control plane and developer platform for the open-source
[Frontal Sandbox engine](https://github.com/frontal-labs/sandbox).

## Before you start

- **Read the codebase layout.** This is a Turborepo monorepo. See the
  [README](README.md) for what lives in `apps/` and `packages/`.
- **Know which repo you are in.** The sandbox *engine* (sandbox creation, exec,
  filesystem, snapshot, fork, destroy) lives in
  [frontal-labs/sandbox](https://github.com/frontal-labs/sandbox). Changes to
  sandbox runtime behavior belong there, not here. This repo is the hosted
  product on top of it.

## Getting the repo

```bash
git clone <your fork of gabrielvfonseca/podyard>
cd podyard
bun install
```

## Making changes

1. Branch off `main`.
2. Run the checks locally before pushing:

   ```bash
   bun run check    # lint + format
   bun test         # vitest
   bun run build    # full build
   ```

3. If your change touches `packages/database`, run `bun run migrate` so the
   Prisma schema, generated client, and migrations stay in sync.

## Conventions

- **Language:** TypeScript everywhere. The repo uses a shared `tsconfig`
  preset in `packages/typescript-config`.
- **Linting/formatting:** managed by Ultracite on top of Biome
  (`biome.jsonc`). Run `bun run fix` to auto-fix.
- **Monorepo discipline:** shared code belongs in `packages/*` and is
  referenced via `workspace:*`. Do not duplicate code across apps.
- **Per-app config:** environment variables are validated with
  `@t3-oss/env-nextjs` in each app's `env.ts`. Keep `.env.example` in sync
  with `env.ts` when you add a variable.
- **Honesty in user-facing copy:** the product must not advertise features
  that are not implemented. Anything unfinished is labeled "Coming soon."
  Do not describe stubs (CLI, SDK, studio) as working.

## Submitting a pull request

- Fill in the [pull request template](.github/pull_request_template.md).
- Reference any issue the PR resolves.
- Keep the diff focused; if it touches multiple packages, say why.

## Reporting issues

Use the [issue templates](.github/ISSUE_TEMPLATE) for bug reports and
feature requests. For security concerns, do not open a public issue —
follow the instructions in [SECURITY.md](.github/SECURITY.md).

## License

By contributing, you agree that your contributions will be licensed under the
[MIT License](LICENSE.md). See [NOTICE.md](NOTICE.md) for the attribution of
the Apache-2.0 sandbox engine this project builds on.
