import { describe, expect, it } from "vitest";
import { Podyard } from "../src/client";
import { PodyardError, PodyardErrorCodes } from "../src/errors";
import type { PodyardClientOptions, Sandbox } from "../src/types";

const jsonResponse = (
  body: unknown,
  init?: { status?: number; statusText?: string }
): Response =>
  new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    statusText: init?.statusText ?? "OK",
    headers: { "content-type": "application/json" },
  });

describe("Podyard constructor", () => {
  it("throws MISSING_API_KEY when the key is absent", () => {
    expect(() => new Podyard({} as PodyardClientOptions)).toThrowError(
      PodyardError
    );

    try {
      new Podyard({} as PodyardClientOptions);
    } catch (error) {
      expect(error).toBeInstanceOf(PodyardError);
      expect((error as PodyardError).code).toBe(
        PodyardErrorCodes.MISSING_API_KEY
      );
      expect((error as PodyardError).scope).toBe("podyard");
    }
  });

  it("strips a trailing slash from the base URL", () => {
    const client = new Podyard({
      apiKey: "sk-test",
      baseUrl: "https://api.example.com/",
    });

    expect(client.baseUrl).toBe("https://api.example.com");
  });

  it("falls back to the default base URL", () => {
    const client = new Podyard({ apiKey: "sk-test" });

    expect(client.baseUrl).toBe("https://api.podyard.com");
  });
});

describe("Podyard.fromEnv", () => {
  it("throws MISSING_API_KEY when PODYARD_API_KEY is unset", () => {
    try {
      Podyard.fromEnv({} as NodeJS.ProcessEnv);
      expect.unreachable("should have thrown");
    } catch (error) {
      expect((error as PodyardError).code).toBe(
        PodyardErrorCodes.MISSING_API_KEY
      );
    }
  });

  it("reads the key from the provided env", () => {
    const client = Podyard.fromEnv({
      PODYARD_API_KEY: "sk-env",
    } as NodeJS.ProcessEnv);

    expect(client.apiKey).toBe("sk-env");
  });
});

describe("Podyard.request", () => {
  it("throws NETWORK_FAILURE when fetch rejects", async () => {
    const client = new Podyard({
      apiKey: "sk-test",
      fetch: (() => {
        throw new TypeError("fetch failed");
      }) as typeof fetch,
    });

    await expect(client.sandboxes.list()).rejects.toThrowError(PodyardError);

    try {
      await client.sandboxes.list();
    } catch (error) {
      expect((error as PodyardError).code).toBe(
        PodyardErrorCodes.NETWORK_FAILURE
      );
      expect((error as PodyardError).statusCode).toBe(502);
    }
  });

  const apiCase = (
    status: number,
    expectedCode: (typeof PodyardErrorCodes)[keyof typeof PodyardErrorCodes]
  ) => {
    it(`maps ${status} to ${expectedCode}`, async () => {
      const client = new Podyard({
        apiKey: "sk-test",
        fetch: (async () =>
          jsonResponse({ error: "nope" }, { status })) as typeof fetch,
      });

      try {
        await client.sandboxes.list();
        expect.unreachable("should have thrown");
      } catch (error) {
        expect((error as PodyardError).code).toBe(expectedCode);
        expect((error as PodyardError).statusCode).toBe(status);
      }
    });
  };

  apiCase(401, PodyardErrorCodes.AUTH_FAILED);
  apiCase(403, PodyardErrorCodes.AUTH_FAILED);
  apiCase(404, PodyardErrorCodes.NOT_FOUND);
  apiCase(429, PodyardErrorCodes.RATE_LIMITED);
  apiCase(500, PodyardErrorCodes.API_ERROR);

  it("throws INVALID_JSON for a malformed 200 body", async () => {
    const client = new Podyard({
      apiKey: "sk-test",
      fetch: (async () =>
        new Response("<html>not json</html>", {
          status: 200,
          headers: { "content-type": "text/html" },
        })) as typeof fetch,
    });

    try {
      await client.sandboxes.list();
      expect.unreachable("should have thrown");
    } catch (error) {
      expect((error as PodyardError).code).toBe(PodyardErrorCodes.INVALID_JSON);
    }
  });

  it("returns the sandbox array from a 200 list call", async () => {
    const sandboxes: Sandbox[] = [{ id: "sbx_1" } as Sandbox];
    const client = new Podyard({
      apiKey: "sk-test",
      fetch: (async () => jsonResponse({ sandboxes })) as typeof fetch,
    });

    await expect(client.sandboxes.list()).resolves.toEqual(sandboxes);
  });
});
