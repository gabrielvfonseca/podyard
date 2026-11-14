import { getMessage, isFrontalError } from "@frontal-labs/error";
// biome-ignore lint/performance/noNamespaceImport: Sentry SDK convention
import * as Sentry from "@sentry/nextjs";
import { log } from "./log";

/**
 * Extract a public-safe message from an unknown value and report it to Sentry.
 *
 * - `FrontalError` instances: returns `public.message` when present, otherwise
 *   the developer-facing `message`.
 * - Anything else: falls back to `getMessage`, then a generic message.
 *
 * Reporting failures are logged, never thrown — error handling must not
 * produce a secondary failure.
 */
export const parseError = (error: unknown): string => {
  const message = publicMessage(error);

  try {
    Sentry.captureException(error);
    log.error(`Parsed error: ${message}`);
  } catch (reportError) {
    console.error("Failed to report error to Sentry:", reportError);
  }

  return message;
};

/**
 * Get the message that is safe to show to a user.
 */
export const publicMessage = (error: unknown): string => {
  if (isFrontalError(error)) {
    return error.public?.message ?? error.message ?? "An error occurred";
  }

  return getMessage(error, "An error occurred") ?? "An error occurred";
};

/**
 * Get the developer-facing message for logging and Sentry breadcrumbs.
 */
export const developerMessage = (error: unknown): string => {
  if (isFrontalError(error)) {
    return error.message;
  }

  return getMessage(error, "An error occurred") ?? "An error occurred";
};

/**
 * Extract the root cause of an unknown value by following `cause` chains.
 */
