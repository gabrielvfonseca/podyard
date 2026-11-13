import { initializeSentry } from "@podyard/observability/instrumentation";

export const register = initializeSentry;
export { onRequestError } from "@podyard/observability/instrumentation";
