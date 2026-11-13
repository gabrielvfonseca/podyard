# `@podyard/design-system`

Shared UI/design system for Podyard applications.

## Overview

- Source: `src/`
- Includes UI components, hooks, providers, styles, and utilities (shadcn/radix-based stack)
- Consumed by apps via workspace dependency

## Scripts

```bash
bun run typecheck  # tsc --noEmit
bun run clean      # remove caches/build artifacts
```

Internal workspace package (`private: true`).
