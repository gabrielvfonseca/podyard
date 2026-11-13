# `apps/studio`

Prisma Studio wrapper for local database inspection.

## Overview

- Uses the schema/config from `packages/database` (`../../packages/database/prisma.config.ts`)
- Runs Prisma Studio on port `3005`

## Scripts

```bash
bun run dev        # prisma studio --port 3005
bun run typecheck  # prisma validate
```

Ensure database environment/config is available for `packages/database`.
