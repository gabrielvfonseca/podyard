import { FrontalError, getMessage, getRootCause } from "@frontal-labs/error";
import { captureException } from "@sentry/nextjs";
import { describe, expect, it, vi } from "vitest";

// parseError reports to Sentry. Keep tests hermetic by stubbing the SDK.
vi.mock("@sentry/nextjs", () => ({
  captureException: vi.fn(),
}));

import { developerMessage, parseError, publicMessage } from "../src/error";

describe("publicMessage", () => {
  it("returns public.message for a FrontalError with public text", () => {
    const error = new FrontalError("Internal: db down", {
      scope: "app",
      code: "db_down",
      public: { message: "Something went wrong." },
    });

    expect(publicMessage(error)).toBe("Something went wrong.");
  });

  it("falls back to the developer message when public is absent", () => {
    const error = new FrontalError("Internal: db down", {
      scope: "app",
      code: "db_down",
    });

    expect(publicMessage(error)).toBe("Internal: db down");
  });

  it("returns the message of a plain Error", () => {
    expect(publicMessage(new Error("boom"))).toBe("boom");
  });

  it("returns the fallback for values without a message", () => {
    expect(publicMessage(42)).toBe("An error occurred");
    expect(publicMessage(null)).toBe("An error occurred");
  });
});

describe("developerMessage", () => {
  it("returns the developer-facing message for a FrontalError", () => {
    const error = new FrontalError("Internal: db down", {
      scope: "app",
      code: "db_down",
      public: { message: "Something went wrong." },
    });

    expect(developerMessage(error)).toBe("Internal: db down");
  });

  it("returns the message of a plain Error", () => {
    expect(developerMessage(new Error("boom"))).toBe("boom");
  });
});

describe("parseError", () => {
  it("returns the public message for a FrontalError", () => {
    const error = new FrontalError("Internal: db down", {
      scope: "app",
      code: "db_down",
      public: { message: "Something went wrong." },
    });

    expect(parseError(error)).toBe("Something went wrong.");
  });

  it("reports the error to Sentry", () => {
    const error = new Error("boom");

    parseError(error);

    expect(captureException).toHaveBeenCalledWith(error);
  });

  it("never throws when reporting fails", () => {
    vi.mocked(captureException).mockImplementationOnce(() => {
      throw new Error("sentry down");
    });

    expect(() => parseError(new Error("boom"))).not.toThrow();
  });
});

describe("getRootCause", () => {
  it("follows cause chains to the last value", () => {
    const root = new Error("root");
    const error = new FrontalError("top", {
      scope: "app",
      code: "x",
      cause: new Error("mid", { cause: root }),
    });

    expect(getRootCause(error)).toBe(root);
  });
});

describe("getMessage passthrough", () => {
  it("still works for unknown values", () => {
    expect(getMessage(new Error("hello"))).toBe("hello");
    expect(getMessage({ message: "structured" })).toBe("structured");
  });
});
