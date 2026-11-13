import { serve } from "@hono/node-server";
import { app } from "./app";
import { env } from "./env";

const port = Number(env.PORT ?? 3002);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API server running on http://localhost:${info.port}`);
});
