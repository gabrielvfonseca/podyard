import type { Context, Next } from "hono";
import type { Session, User } from "./server";
import { getSession } from "./server";

type AuthVariables = {
  user: User;
  session: Session;
};

declare module "hono" {
  interface ContextVariableMap extends AuthVariables {}
}

/**
 * Hono middleware that requires a valid better-auth session.
 * 401s when no session is present.
 */
export const authMiddleware = async (c: Context, next: Next) => {
  const session = await getSession(c.req.raw.headers);

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session);
  await next();
};

/**
 * Hono middleware that sets the user in context when a session exists,
 * but allows unauthenticated access to continue.
 */
export const optionalAuthMiddleware = async (c: Context, next: Next) => {
  const session = await getSession(c.req.raw.headers);

  if (session) {
    c.set("user", session.user);
    c.set("session", session);
  }

  await next();
};
