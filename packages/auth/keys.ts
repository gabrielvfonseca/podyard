import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Reusable env schema for Better Auth, meant to be extended by other
 * packages/apps via `extends`. Exposes the raw schema so callers can
 * `createEnv({ extends: [auth()] })`.
 */
export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
      BETTER_AUTH_URL: z.string().url(),
    },
    clientPrefix: "NEXT_PUBLIC_",
    client: {},
    runtimeEnv: {
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
      BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    },
  });
