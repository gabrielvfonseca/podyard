import { keys as email } from "@podyard/email/keys";
import { keys as flags } from "@podyard/feature-flags/keys";
import { keys as core } from "@podyard/next-config/keys";
import { keys as observability } from "@podyard/observability/keys";
import { keys as rateLimit } from "@podyard/rate-limit/keys";
import { keys as security } from "@podyard/security/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  extends: [
    core(),
    email(),
    observability(),
    flags(),
    security(),
    rateLimit(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
