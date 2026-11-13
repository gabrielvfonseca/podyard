# `@podyard/auth`

Better Auth integration for Podyard.

## Overview

- Source: `src/`
- Server auth instance (Prisma adapter), browser client, React auth provider/components, env keys, and Hono/Next auth helpers
- Uses Better Auth (not Clerk)

## Key modules

- `server.ts` — Better Auth setup and session/user helpers
- `client.ts` — browser auth client/actions
- `provider.tsx` — React auth context/provider
- `components/*` — sign-in/up and user UI components

## Notes

Internal workspace package. Requires `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` and database configuration.
