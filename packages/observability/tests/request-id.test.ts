import { describe, expect, it } from "vitest";
import {
  getRequestId,
  newRequestId,
  REQUEST_ID_HEADER,
} from "../src/request-id";

const ID_PATTERN = /^[0-9A-F]{32}$/;

describe("newRequestId", () => {
  it("returns a 32-character uppercase hex string", () => {
    const id = newRequestId();

    expect(id).toMatch(ID_PATTERN);
  });

  it("returns unique values", () => {
    expect(newRequestId()).not.toBe(newRequestId());
  });
});

describe("getRequestId", () => {
  it("reuses the ID from the request header when present", () => {
    const request = new Request("https://example.com", {
      headers: { [REQUEST_ID_HEADER]: "01J9X7Z0000000000000000000" },
    });

    expect(getRequestId(request)).toBe("01J9X7Z0000000000000000000");
  });

  it("generates a new ID when the header is absent", () => {
    const request = new Request("https://example.com");
    const id = getRequestId(request);

    expect(id).toMatch(ID_PATTERN);
  });

  it("generates a new ID when the header is empty", () => {
    const request = new Request("https://example.com", {
      headers: { [REQUEST_ID_HEADER]: "" },
    });

    const id = getRequestId(request);

    expect(id).toMatch(ID_PATTERN);
  });

  it("generates a new ID when no request is supplied", () => {
    const id = getRequestId(undefined);

    expect(id).toMatch(ID_PATTERN);
  });
});
