import { auth } from "@podyard/auth/server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { cron } from "./routes/cron";
import { health } from "./routes/health";
import { webhooks } from "./routes/webhooks";

const app = new Hono().use(logger()).use(
  cors({
    origin: (origin) => {
      const allowedOrigins = ["http://localhost:3001", "http://localhost:3002"];
      return allowedOrigins.includes(origin) ? origin : "*";
    },
    credentials: true,
  })
);

// Better Auth API routes
app.all("/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/health", health);
app.get("/cron/keep-alive", cron);
app.post("/webhooks/payments", webhooks.payments);
app.post("/webhooks/auth", webhooks.auth);

export { app };
