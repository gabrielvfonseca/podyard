import { getMessage } from "@frontal-labs/error";

export class PodyardError extends Error {
  readonly status?: number;
  readonly causeMessage?: string;

  constructor(message: string, opts?: { status?: number; cause?: unknown }) {
    super(message);
    this.name = "PodyardError";
    this.status = opts?.status;
    if (opts?.cause) {
      this.causeMessage = getMessage(opts.cause) ?? "unknown";
    }
  }
}
