import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const keys = () =>
  createEnv({
    skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
    server: {
      POSTHOG_KEY: z.string().optional(),
      POSTHOG_HOST: z.string().url().optional(),
      GA_MEASUREMENT_ID: z.string().optional(),
    },
    clientPrefix: "NEXT_PUBLIC_",
    client: {
      NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
      NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
      NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
    },
    runtimeEnv: {
      POSTHOG_KEY: process.env.POSTHOG_KEY,
      POSTHOG_HOST: process.env.POSTHOG_HOST,
      GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
      NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
      NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      NEXT_PUBLIC_GA_MEASUREMENT_ID:
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    },
  });
