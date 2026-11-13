import type { Context } from "hono";
import { log } from "@repo/observability/log";
import { analytics } from "@repo/analytics/server";

/**
 * Auth webhook handler.
 * With Better Auth, most auth events are handled via Better Auth's event system
 * (see packages/auth/server.ts). This endpoint is kept for backwards compatibility
 * or if you need to receive auth events from an external provider.
 */
export const auth = async (c: Context) => {
  const body = await c.req.json();
  const eventType = body?.type;

  log.info("Auth webhook received", { eventType });

  switch (eventType) {
    case "user.created": {
      analytics?.capture({
        event: "User Created",
        distinctId: body.id,
      });
      return c.text("User created", 201);
    }
    case "user.updated": {
      analytics?.capture({
        event: "User Updated",
        distinctId: body.id,
      });
      return c.text("User updated", 201);
    }
    case "user.deleted": {
      analytics?.capture({
        event: "User Deleted",
        distinctId: body.id,
      });
      return c.text("User deleted", 201);
    }
    default: {
      return c.text("Unknown event", 400);
    }
  }
};
