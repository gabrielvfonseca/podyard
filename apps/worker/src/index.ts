import { FrontalError, isFrontalError } from "@frontal-labs/error";
import { type ErrorResponse, errorResponse } from "@frontal-labs/error/server";
import { Podyard } from "@podyard/sdk";

export interface Env {
  PODYARD_API_KEY?: string;
  PODYARD_BASE_URL?: string;
}

const WORKER_SCOPE = "worker";

/**
 * Build a `Response` from an `ErrorResponse` produced by `errorResponse`.
 */
const toResponse = (result: ErrorResponse): Response =>
  new Response(result.body, {
    status: result.status,
    headers: result.headers,
  });

/**
 * Wrap a handler in a catch-all that converts any thrown value into a
 * standardized error `Response` via `@frontal-labs/error/server`.
 */
const withErrorHandling =
  (handler: (request: Request) => Promise<Response>) =>
  async (request: Request): Promise<Response> => {
    try {
      return await handler(request);
    } catch (error) {
      // Narrow to a recognized FrontalError; fall back to a generic 500
      // for untagged errors so we never leak developer details.
      if (isFrontalError(error)) {
        return toResponse(errorResponse(error));
      }

      return toResponse({
        status: 500,
        body: JSON.stringify({ error: { message: "An error occurred" } }),
        headers: { "content-type": "application/json" },
      });
    }
  };

export default {
  fetch: withErrorHandling(async (request: Request) => {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        service: "podyard-worker",
      });
    }

    if (url.pathname === "/sandboxes") {
      const env = request.cf as Env | undefined;

      if (!env?.PODYARD_API_KEY) {
        throw new FrontalError("PODYARD_API_KEY is not configured", {
          scope: WORKER_SCOPE,
          code: "missing_api_key",
          statusCode: 500,
          public: { message: "Worker is misconfigured." },
        });
      }

      const client = new Podyard({
        apiKey: env.PODYARD_API_KEY,
        baseUrl: env.PODYARD_BASE_URL,
      });

      const sandboxes = await client.sandboxes.list();
      return Response.json({ sandboxes });
    }

    return new Response("Not found", { status: 404 });
  }),
};
