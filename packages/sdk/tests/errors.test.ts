import { FrontalError, isFrontalError } from "@frontal-labs/error";
import { describe, expect, it } from "vitest";
import {
  PODYARD_ERROR_SCOPE,
  PodyardError,
  PodyardErrorCodes,
} from "../src/errors";

describe("PodyardError", () => {
  it("is a FrontalError", () => {
    const error = new PodyardError("test", {
      code: PodyardErrorCodes.API_ERROR,
    });

    expect(error).toBeInstanceOf(FrontalError);
    expect(isFrontalError(error)).toBe(true);
  });

  it("sets the podyard scope", () => {
    const error = new PodyardError("test", {
      code: PodyardErrorCodes.API_ERROR,
    });

    expect(error.scope).toBe(PODYARD_ERROR_SCOPE);
    expect(error.scope).toBe("podyard");
  });

  it("carries the provided code", () => {
    const error = new PodyardError("test", {
      code: PodyardErrorCodes.MISSING_API_KEY,
    });

    expect(error.code).toBe(PodyardErrorCodes.MISSING_API_KEY);
  });

  it("defaults to the api_error code when none is given", () => {
    const error = new PodyardError("test");

    expect(error.code).toBe(PodyardErrorCodes.API_ERROR);
  });

  it("keeps public text separate from the developer message", () => {
    const error = new PodyardError(
      "Internal: connection refused on port 5432",
      {
        code: PodyardErrorCodes.NETWORK_FAILURE,
        statusCode: 502,
        public: { message: "Could not reach the Podyard API." },
      }
    );

    expect(error.message).toBe("Internal: connection refused on port 5432");
    expect(error.public?.message).toBe("Could not reach the Podyard API.");
  });

  it("preserves statusCode, cause, and requestId", () => {
    const cause = new Error("dial tcp: connection refused");
    const requestId = "req_01J9X7Z0000000000000000000";
    const error = new PodyardError("Network request failed", {
      code: PodyardErrorCodes.NETWORK_FAILURE,
      statusCode: 502,
      cause,
      requestId,
    });

    expect(error.statusCode).toBe(502);
    expect(error.cause).toBe(cause);
    expect(error.requestId).toBe(requestId);
  });
});

describe("PodyardErrorCodes", () => {
  it("exposes stable string codes", () => {
    expect(PodyardErrorCodes.MISSING_API_KEY).toBe("missing_api_key");
    expect(PodyardErrorCodes.NETWORK_FAILURE).toBe("network_failure");
    expect(PodyardErrorCodes.AUTH_FAILED).toBe("auth_failed");
    expect(PodyardErrorCodes.RATE_LIMITED).toBe("rate_limited");
    expect(PodyardErrorCodes.NOT_FOUND).toBe("not_found");
  });
});
