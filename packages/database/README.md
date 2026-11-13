# `@podyard/database`

Drizzle ORM database package for Podyard.

## Overview

- Source: `src/` (schema, client, and env keys)
- Drizzle schema: `src/schema.ts`
- Drizzle config: `drizzle.config.ts`
- Generated SQL migrations: `drizzle/`

## Scripts

```bash
bun run db:generate  # generate SQL migrations from the schema
bun run db:migrate   # apply pending migrations
bun run db:push      # push the schema directly ( prototyping )
bun run db:studio    # open Drizzle Studio
bun run typecheck    # tsc --noEmit
```

Migrations and DB workflows are also available from the repository root
(`bun run migrate`, `bun run db:push`, etc.).