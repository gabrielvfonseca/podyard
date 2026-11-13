import { PostHog } from "posthog-node";
import { keys } from "./keys";

const { POSTHOG_KEY, POSTHOG_HOST } = keys();

export const analytics =
  POSTHOG_KEY && POSTHOG_HOST
    ? new PostHog(POSTHOG_KEY, {
        host: POSTHOG_HOST,

        // Don't batch events and flush immediately - we're running in a serverless environment
        flushAt: 1,
        flushInterval: 0,
      })
    : undefined;
