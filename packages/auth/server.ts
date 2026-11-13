import { prismaAdapter } from "@better-auth/prisma-adapter";
import { database } from "@repo/database";
import { betterAuth } from "better-auth";
import { env } from "./env";

export const auth = betterAuth({
  database: prismaAdapter(database, { provider: "postgresql" }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 30 * 60,
    },
  },
  user: {
    additionalFields: {
      stripeCustomerId: {
        type: "string",
        required: false,
        input: false,
      },
      role: {
        type: "string",
        required: false,
        input: false,
      },
    },
  },
  trustedOrigins: [env.BETTER_AUTH_URL],
});

// Inferred session/user types for consumers.
export type Session = typeof auth.$Infer.Session;
export type User = NonNullable<Session["user"]>;

/**
 * Resolve the current session from an incoming request's headers.
 * Works in both Next.js (cookies) and Hono (raw fetch headers).
 */
export const getSession = async (headers: Headers): Promise<Session | null> => {
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
