import { FrontalError, type FrontalErrorOptions } from "@frontal-labs/error";
import { PODYARD_ERROR_SCOPE, type PodyardErrorCode } from "./error-codes";

/**
 * Options accepted by `PodyardError`. `code` is required and typed to the
 * stable SDK code set; `scope` is fixed to `"podyard"` and excluded.
 */
export type PodyardErrorOptions = {
  code: PodyardErrorCode;
} & Omit<FrontalErrorOptions<PodyardErrorCode>, "scope" | "code">;

/**
 * The SDK's error class. Extends `FrontalError` so every error carries a
 * stable `scope` and `code`, a developer-facing `message`, and approved
 * `public` text for clients.
 */
export class PodyardError extends FrontalError<PodyardErrorCode> {
  override readonly scope = PODYARD_ERROR_SCOPE;

  constructor(
    message: string,
    options: PodyardErrorOptions = { code: "api_error" }
  ) {
    super(message, options);
  }
}

export type { PodyardErrorCode } from "./error-codes";
export { PODYARD_ERROR_SCOPE, PodyardErrorCodes } from "./error-codes";
