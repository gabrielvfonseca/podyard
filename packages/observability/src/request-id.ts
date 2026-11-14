import { randomUUID } from "node:crypto";

// A request ID is a Crockford-base32-style token that is time-ordered and
// unique per request. We derive it from `randomUUID` (v4) with the dashes
// stripped and upper-cased — the standard, dependency-free idiom. The
// `@ulid/ulid` package's default export depends on a bound `Crypto` global
// that is unavailable in some worker runtimes (vitest, edge), so we avoid it.
const newId = (): string => randomUUID().replace(/-/g, "").toUpperCase();

/**
 * Header name used to correlate a request across Podyard services.
 *
 * When reconstructing errors from a `Response` with
 * `@frontal-labs/error/client`, pass `{ requestIdHeader: REQUEST_ID_HEADER }`
 * so the client picks up the app-owned correlation ID.
 */
export const REQUEST_ID_HEADER = "x-podyard-id";

/**
 * Generate a new request ID. A 32-character, time-ordered, unique token
 * suitable for log sorting and Sentry grouping.
 */
export const newRequestId = (): string => newId();

/**
 * Read a request ID from a request, creating a new one when absent. The
 * returned ID is safe to attach to every error raised during the request.
 */
export const getRequestId = (request: Request | undefined): string => {
  const existing = request?.headers.get(REQUEST_ID_HEADER);
  return existing && existing.length > 0 ? existing : newRequestId();
};
