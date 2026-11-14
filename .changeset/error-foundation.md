---
"@podyard/sdk": minor
"@podyard/observability": minor
"web": patch
"cli": patch
"worker": patch
---

Adopt `@frontal-labs/error` as the monorepo error foundation.

- **SDK**: `PodyardError` now extends `FrontalError` with a stable `podyard` scope and per-failure codes (`missing_api_key`, `network_failure`, `api_error`, `invalid_json`, `auth_failed`, `rate_limited`, `not_found`, `sandbox_not_found`, `sandbox_unavailable`). Every error carries approved `public` text separate from the developer-facing message.
- **Observability**: new `parseError` / `publicMessage` / `developerMessage` helpers built on `isFrontalError`; `toPublicResponse` wraps `errorResponse` from `@frontal-labs/error/server` with a generic 500 fallback for untagged errors; request IDs via ULID in the `x-podyard-id` header; Sentry `beforeSend` hook enriches events with `error.scope`, `error.code`, and `request.id` tags without dropping any event.
- **Web**: proxy middleware uses `toPublicResponse` and attaches the request ID header; the contact form raises `FrontalError` with a local `contact` scope and stable codes; a route-level `error.tsx` boundary renders the public message.
- **CLI**: output uses `formatError` from `@frontal-labs/error/format` instead of raw `getMessage`.
- **Worker**: error handling replaced with `errorResponse` + `FrontalError` behind a `withErrorHandling` wrapper that converts any thrown value to a standardized `Response`.
- **Root**: `engines.node` bumped from `>=18` to `>=22` to match the dependency.
