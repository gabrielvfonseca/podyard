import "server-only";

import { isFrontalError } from "@frontal-labs/error";
import {
  type ErrorResponse,
  type ErrorResponseInput,
  errorResponse,
} from "@frontal-labs/error/server";

const GENERIC_500: ErrorResponse = {
  status: 500,
  body: JSON.stringify({ error: { message: "An error occurred" } }),
  headers: { "content-type": "application/json" },
};

/**
 * Build a `Response` from an unknown error using the `@frontal-labs/error`
 * server helpers.
 *
 * - `FrontalError` instances: public text, scope, code, and `statusCode` are
 *   used. Without a `statusCode`, defaults to 500.
 * - Plain objects with a `message`: treated as an untagged input, which
 *   requires a `public` field. If absent, a generic 500 is returned.
 * - Anything else: a generic 500.
 *
 * `request` selects ANSI format when the caller opts in via headers; omit it
 * for pure JSON responses.
 */
export const toPublicResponse = (
  error: unknown,
  request?: Request
): Response => {
  let result: ErrorResponse;

  if (isFrontalError(error)) {
    try {
      result = errorResponse(error, { request });
    } catch {
      result = GENERIC_500;
    }
  } else {
    // Not a recognized FrontalError. Try to pass it through as explicit
    // input when it carries a `public` field; otherwise fall back.
    const input = error as ErrorResponseInput | undefined;
    if (input && typeof input === "object" && "public" in input) {
      try {
        result = errorResponse(input, { request });
      } catch {
        result = GENERIC_500;
      }
    } else {
      result = GENERIC_500;
    }
  }

  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  });
};
