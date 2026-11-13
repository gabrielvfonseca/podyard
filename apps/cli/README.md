# `@podyard/cli`

Public Podyard command-line interface.

## Overview

- Package: `@podyard/cli` (published)
- Binary: `podyard` (`dist/index.js`)
- Source: `src/index.ts`
- Built with Commander and integrates with `@podyard/sdk`

## Scripts

```bash
bun run build      # Build with tsup
bun run dev        # Watch build
bun run typecheck  # tsc --noEmit
```

## Usage

```bash
podyard --help
podyard init --name my-app
podyard sandboxes
```

`sandboxes` requires `PODYARD_API_KEY` (and optional `PODYARD_BASE_URL`).
