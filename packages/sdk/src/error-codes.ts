/**
 * Stable, application-owned error codes for the Podyard SDK.
 *
 * Branch on `code` and `scope`, never on message text. Codes are part of the
 * public contract sent to clients, so they must remain stable even when
 * wording changes.
 */
export const PodyardErrorCodes = {
  MISSING_API_KEY: "missing_api_key",
  NETWORK_FAILURE: "network_failure",
  API_ERROR: "api_error",
  INVALID_JSON: "invalid_json",
  AUTH_FAILED: "auth_failed",
  RATE_LIMITED: "rate_limited",
  NOT_FOUND: "not_found",
  SANDBOX_NOT_FOUND: "sandbox_not_found",
  SANDBOX_UNAVAILABLE: "sandbox_unavailable",
} as const;

export type PodyardErrorCode =
  (typeof PodyardErrorCodes)[keyof typeof PodyardErrorCodes];

/** Scope assigned to every error raised by the SDK. */
export const PODYARD_ERROR_SCOPE = "podyard";
