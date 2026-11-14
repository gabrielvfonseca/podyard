# `@podyard/observability`

Observability, logging, and error reporting utilities for Podyard.

## Overview

- Source: `src/`
- Client/edge/server instrumentation, logging, error helpers, status components, and Next.js/Sentry integrations
- Shared across apps for consistent telemetry

## Error handling

All error helpers are built on [`@frontal-labs/error`](https://www.npmjs.com/package/@frontal-labs/error).

### Helpers

| Export | Purpose |
|---|---|
| `publicMessage(error)` | Returns `error.public.message` for `FrontalError` instances, `error.message` for other errors, or `"An error occurred"` otherwise. |
| `developerMessage(error)` | Returns the root-cause `message` (follows the `cause` chain). Safe for logs and Sentry. |
| `parseError(error)` | Returns a `{ public, developer, scope, code, requestId, cause }` shape for use in handlers. |
| `toPublicResponse(error, request?)` | Builds a `Response` from an error using `errorResponse` from `@frontal-labs/error/server`. Untagged errors fall back to a generic 500. |

### Request IDs

```ts
import { newRequestId, getRequestId, REQUEST_ID_HEADER } from "@podyard/observability";

// Generate a new ID (32-char uppercase hex, derived from crypto.randomUUID)
const id = newRequestId();

// Reuse the ID from an incoming request, or generate one if absent
const id = getRequestId(request); // reads `x-podyard-id`
```

Attach the ID to responses:

```ts
response.headers.set(REQUEST_ID_HEADER, id);
```

### Sentry `beforeSend`

```ts
import { beforeSend } from "@podyard/observability";

Sentry.init({
  dsn: "...",
  beforeSend,
});
```

The hook enriches events raised from `FrontalError` instances with:

- `tags["error.scope"]` — the error's scope
- `tags["error.code"]` — the error's stable code
- `tags["request.id"]` — the request ID, when present
- `event.message` — set to `podyard/<code>` so Sentry groups by code, not message text

Non-`FrontalError` events pass through unchanged. The hook never drops events.

### Building responses

```ts
import { toPublicResponse } from "@podyard/observability";

// In a Next.js error handler, middleware, or API route:
return toPublicResponse(error, request);
```

- `FrontalError` instances use their `statusCode` (or 500), `public` text, `scope`, and `code`.
- Untagged errors without a `public` field produce a generic 500: `{"error":{"message":"An error occurred"}}`.
- Developer messages are never included in the response body.

## Scripts

```bash
bun run typecheck  # tsc --noEmit
bun run test       # vitest
```

Internal workspace package (`private: true`).
