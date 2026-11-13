import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { database, schema } from "@podyard/database";
import { betterAuth } from "better-auth";
import { env } from "./env";

export const auth = betterAuth({
  database: drizzleAdapter(database, {
    provider: "pg",
    schema,
    camelCase: true,
  }),
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

export type Session = typeof auth.$Infer.Session;
export type User = NonNullable<Session["user"]>;
