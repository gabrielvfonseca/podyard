import { getMessage } from "@frontal-labs/error";
import { Podyard } from "@podyard/sdk";

export interface Env {
  PODYARD_API_KEY?: string;
  PODYARD_BASE_URL?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return Response.json({
        ok: true,
        service: "podyard-worker",
      });
    }

    if (url.pathname === "/sandboxes") {
      if (!env.PODYARD_API_KEY) {
        return Response.json(
          { error: "PODYARD_API_KEY not configured" },
          { status: 500 }
        );
      }

      try {
        const client = new Podyard({
          apiKey: env.PODYARD_API_KEY,
          baseUrl: env.PODYARD_BASE_URL,
        });

        const sandboxes = await client.sandboxes.list();
        return Response.json({ sandboxes });
      } catch (err) {
        return Response.json(
          { error: getMessage(err) ?? "Internal error" },
          { status: 500 }
        );
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
