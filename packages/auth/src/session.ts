import { auth, type Session, type User } from "./auth";

/**
 * Resolve the current session from an incoming request's headers.
 * Works in both Next.js (cookies) and Hono (raw fetch headers).
 */
export const getSession = (headers: Headers): Promise<Session | null> => {
  return auth.api.getSession({ headers });
};

/**
 * Resolve the current user from an incoming request's headers.
 */
export const getCurrentUser = async (
  headers: Headers
): Promise<User | null> => {
  const session = await auth.api.getSession({ headers });
  return session?.user ?? null;
};
