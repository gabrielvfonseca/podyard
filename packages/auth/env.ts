import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Auth-specific env. Required at runtime when the server boots; the
 * client (Next.js) only needs NEXT_PUBLIC_* keys, which are handled by
 * the consumer app's own env.
 */
export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  server: {
    BETTER_AUTH_SECRET: z
      .string()
      .min(1, "BETTER_AUTH_SECRET is required")
      .default("dev-secret-change-me"),
    BETTER_AUTH_URL: z.string().url().default("http://localhost:3000"),
  },
  clientPrefix: "NEXT_PUBLIC_",
  client: {},
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  },
});
