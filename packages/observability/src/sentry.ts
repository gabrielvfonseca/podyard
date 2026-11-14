import { isFrontalError } from "@frontal-labs/error";
import type { ErrorEvent, EventHint } from "@sentry/nextjs";

/**
 * Sentry `beforeSend` hook that enriches events raised from `FrontalError`
 * instances with stable `scope`, `code`, and `requestId` tags so events group
 * by code rather than by message text.
 *
 * Non-`FrontalError` events pass through unchanged — this filter enriches,
 * it does not drop.
 */
export const beforeSend = (
  event: ErrorEvent,
  hint: EventHint
): ErrorEvent | null => {
  const original = hint.originalException;

  if (original && isFrontalError(original)) {
    if (original.scope) {
      event.tags = { ...event.tags, "error.scope": original.scope };
    }
    if (original.code) {
      event.tags = { ...event.tags, "error.code": original.code };
      // Use the code as the Sentry title so groups are stable.
      event.message = `podyard/${original.code}`;
    }
    if (original.requestId) {
      event.tags = { ...event.tags, "request.id": original.requestId };
    }
  }

  return event;
};
