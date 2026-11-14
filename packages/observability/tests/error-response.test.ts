import { FrontalError } from "@frontal-labs/error";
import { describe, expect, it } from "vitest";
import { toPublicResponse } from "../src/error-response";

describe("toPublicResponse", () => {
  it("builds a response from a FrontalError with public text", async () => {
    const error = new FrontalError("Internal: rate limit", {
      scope: "contact",
      code: "rate_limited",
      statusCode: 429,
      public: { message: "You have reached your request limit." },
    });

    const response = toPublicResponse(error);
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(response.headers.get("content-type")).toBe("application/json");
    expect(body.error.code).toBe("rate_limited");
    expect(body.error.scope).toBe("contact");
    expect(body.error.message).toBe("You have reached your request limit.");
  });

  it("omits developer details from the body", async () => {
    const error = new FrontalError("Internal: secret token leaked", {
      scope: "app",
      code: "boom",
      statusCode: 500,
      public: { message: "Something went wrong." },
    });

    const response = toPublicResponse(error);
    const text = await response.text();

    expect(text).not.toContain("secret token leaked");
    expect(text).toContain("Something went wrong.");
  });

  it("defaults to 500 when the error has no statusCode", () => {
    const error = new FrontalError("Internal: crash", {
      scope: "app",
      code: "crash",
      public: { message: "Something went wrong." },
    });

    const response = toPublicResponse(error);

    expect(response.status).toBe(500);
  });

  it("uses a generic message for a FrontalError without public text", async () => {
    const error = new FrontalError("Internal: crash", {
      scope: "app",
      code: "crash",
      statusCode: 500,
    });

    const response = toPublicResponse(error);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.message).toBe("An error occurred.");
  });

  it("falls back to a generic 500 for untagged errors", async () => {
    const response = toPublicResponse(new Error("boom: internal detail"));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.message).toBe("An error occurred");
  });

  it("falls back to a generic 500 for non-error values", async () => {
    const response = toPublicResponse("just a string");
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error.message).toBe("An error occurred");
  });

  it("accepts an explicit public input for untagged errors", async () => {
    const input = {
      public: { message: "We could not complete your request." },
      scope: "payments",
      code: "unavailable",
      statusCode: 503,
    };

    const response = toPublicResponse(input);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.error.message).toBe("We could not complete your request.");
    expect(body.error.code).toBe("unavailable");
  });
});
