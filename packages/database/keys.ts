import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      DATABASE_URL: z.url().optional(),
    },
    clientPrefix: "PUBLIC_",
    client: {},
    runtimeEnv: {
      DATABASE_URL: process.env.DATABASE_URL,
    },
  });
