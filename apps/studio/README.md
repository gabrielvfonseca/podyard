# `apps/studio`

Drizzle Studio wrapper for local database inspection.

## Overview

- Uses the schema/config from `packages/database` (`../../packages/database/drizzle.config.ts`)
- Runs Drizzle Studio on port `3005`

## Scripts

```bash
bun run dev        # drizzle-kit studio --port 3005
bun run typecheck  # drizzle-kit check
```

Ensure database environment/config is available for `packages/database`.