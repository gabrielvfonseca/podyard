import { serve } from "@hono/node-server";
import { app } from "./app";

const port = Number(process.env.PORT ?? 3002);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API server running on http://localhost:${info.port}`);
});
