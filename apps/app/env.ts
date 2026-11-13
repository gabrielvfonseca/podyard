import { keys as analytics } from "@podyard/analytics/keys";
import { keys as auth } from "@podyard/auth/keys";
import { keys as database } from "@podyard/database/keys";
import { keys as email } from "@podyard/email/keys";
import { keys as flags } from "@podyard/feature-flags/keys";
import { keys as core } from "@podyard/next-config/keys";
import { keys as observability } from "@podyard/observability/keys";
import { keys as security } from "@podyard/security/keys";
import { keys as webhooks } from "@podyard/webhooks/keys";
import { createEnv } from "@t3-oss/env-nextjs";

export const env = createEnv({
  skipValidation: process.env.SKIP_ENV_VALIDATION === "true",
  extends: [
    auth(),
    analytics(),
    core(),
    database(),
    email(),
    flags(),
    observability(),
    security(),
    webhooks(),
  ],
  server: {},
  client: {},
  runtimeEnv: {},
});
