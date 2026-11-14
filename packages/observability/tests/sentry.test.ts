import { FrontalError } from "@frontal-labs/error";
import type { ErrorEvent, EventHint } from "@sentry/nextjs";
import { describe, expect, it } from "vitest";
import { beforeSend } from "../src/sentry";

const baseEvent = (): ErrorEvent => ({
  message: "original message",
  tags: { existing: "tag" },
});

describe("beforeSend", () => {
  it("adds scope, code, and request.id tags for a FrontalError", () => {
    const original = new FrontalError("Internal: db down", {
      scope: "app",
      code: "db_down",
      statusCode: 500,
      requestId: "01J9X7Z0000000000000000000",
    });
    const event = baseEvent();
    const hint: EventHint = { originalException: original };

    const result = beforeSend(event, hint);

    expect(result).not.toBeNull();
    expect(result?.tags?.["error.scope"]).toBe("app");
    expect(result?.tags?.["error.code"]).toBe("db_down");
    expect(result?.tags?.["request.id"]).toBe("01J9X7Z0000000000000000000");
    // Existing tags are preserved.
    expect(result?.tags?.existing).toBe("tag");
  });

  it("uses the code as the Sentry message for stable grouping", () => {
    const original = new FrontalError("Internal: db down", {
      scope: "app",
      code: "db_down",
    });
    const event = baseEvent();
    const hint: EventHint = { originalException: original };

    const result = beforeSend(event, hint);

    expect(result?.message).toBe("podyard/db_down");
  });

  it("leaves events without a FrontalError untouched", () => {
    const event = baseEvent();
    const hint: EventHint = { originalException: new Error("boom") };

    const result = beforeSend(event, hint);

    expect(result).toBe(event);
    expect(result?.message).toBe("original message");
    expect(result?.tags?.["error.scope"]).toBeUndefined();
  });

  it("leaves events without an original exception untouched", () => {
    const event = baseEvent();
    const hint: EventHint = {};

    const result = beforeSend(event, hint);

    expect(result).toBe(event);
    expect(result?.message).toBe("original message");
  });

  it("enriches but never drops the event", () => {
    const original = new FrontalError("Internal: db down", {
      scope: "app",
      code: "db_down",
    });
    const event = baseEvent();
    const hint: EventHint = { originalException: original };

    const result = beforeSend(event, hint);

    expect(result).not.toBeNull();
  });
});
