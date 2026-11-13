import { initializeAnalytics } from "@podyard/analytics/instrumentation-client";
import { initializeSentry } from "@podyard/observability/client";

initializeSentry();
initializeAnalytics();

export { onRouterTransitionStart } from "@podyard/observability/client";
