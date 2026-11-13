# `@podyard/database`

Prisma database package for Podyard.

## Overview

- Source: `src/` (client exports and env keys)
- Prisma schema: `prisma/schema.prisma`
- Prisma config: `prisma.config.ts`
- Generated client output: `generated/`

## Scripts

```bash
bun run build      # prisma generate
bun run analyze    # prisma generate
bun run typecheck  # tsc --noEmit
```

Migrations and DB workflows are typically run via root scripts (`bun run migrate`, `bun run db:push`, etc.).
