import type { PodyardErrorCode } from "./error-codes";
import { PodyardError, PodyardErrorCodes } from "./errors";
import type {
  CreateSandboxInput,
  PodyardClientOptions,
  Sandbox,
} from "./types";

const TRAILING_SLASH = /\/$/;

export class Podyard {
  readonly apiKey: string;
  readonly baseUrl: string;
  private readonly _fetch: typeof fetch;

  constructor(options: PodyardClientOptions) {
    if (!options.apiKey) {
      throw new PodyardError("Podyard apiKey is required", {
        code: PodyardErrorCodes.MISSING_API_KEY,
        statusCode: 500,
        public: { message: "A Podyard API key is required." },
      });
    }
    this.apiKey = options.apiKey;
    this.baseUrl = (
      options.baseUrl ??
      process.env.PODYARD_BASE_URL ??
      "https://api.podyard.com"
    ).replace(TRAILING_SLASH, "");
    this._fetch = options.fetch ?? fetch;
  }

  static fromEnv(env: NodeJS.ProcessEnv = process.env): Podyard {
    const apiKey = env.PODYARD_API_KEY;
    if (!apiKey) {
      throw new PodyardError("Missing PODYARD_API_KEY environment variable", {
        code: PodyardErrorCodes.MISSING_API_KEY,
        statusCode: 500,
        public: {
          message:
            "Podyard is not configured. Set the PODYARD_API_KEY environment variable.",
        },
      });
    }
    return new Podyard({ apiKey, baseUrl: env.PODYARD_BASE_URL });
  }

  readonly sandboxes = {
    list: async (): Promise<Sandbox[]> => {
      const res = await this.request<{ sandboxes?: Sandbox[] } | Sandbox[]>(
        "/v1/sandboxes",
        { method: "GET" }
      );
      return Array.isArray(res) ? res : (res.sandboxes ?? []);
    },
    create: (input: CreateSandboxInput = {}): Promise<Sandbox> =>
      this.request<Sandbox>("/v1/sandboxes", {
        method: "POST",
        body: JSON.stringify(input),
      }),
    get: (id: string): Promise<Sandbox> =>
      this.request<Sandbox>(`/v1/sandboxes/${encodeURIComponent(id)}`, {
        method: "GET",
      }),
    delete: async (id: string): Promise<void> => {
      await this.request<void>(`/v1/sandboxes/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
    },
  };

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    let response: Response;
    try {
      response = await this._fetch(url, {
        ...init,
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.apiKey}`,
          ...(init.headers ?? {}),
        },
      });
    } catch (cause) {
      throw new PodyardError("Network request failed", {
        code: PodyardErrorCodes.NETWORK_FAILURE,
        statusCode: 502,
        cause,
        public: {
          message: "Could not reach the Podyard API. Please try again.",
        },
      });
    }

    if (!response.ok) {
      let detail = "";
      try {
        detail = await response.text();
      } catch {
        detail = response.statusText;
      }

      throw new PodyardError(
        `Podyard API error ${response.status}: ${detail || response.statusText}`,
        {
          code: this.mapApiErrorCode(response.status),
          statusCode: response.status,
          cause: detail ? new Error(detail) : undefined,
          public: {
            message: "The Podyard API returned an error. Please try again.",
            hint: `Status ${response.status}`,
          },
        }
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }
    const text = await response.text();
    if (!text) {
      return undefined as T;
    }
    try {
      return JSON.parse(text) as T;
    } catch (cause) {
      throw new PodyardError("Invalid JSON response from Podyard API", {
        code: PodyardErrorCodes.INVALID_JSON,
        statusCode: 502,
        cause,
        public: { message: "Received an unexpected response from Podyard." },
      });
    }
  }

  private mapApiErrorCode(status: number): PodyardErrorCode {
    if (status === 401 || status === 403) {
      return PodyardErrorCodes.AUTH_FAILED;
    }
    if (status === 404) {
      return PodyardErrorCodes.NOT_FOUND;
    }
    if (status === 429) {
      return PodyardErrorCodes.RATE_LIMITED;
    }
    return PodyardErrorCodes.API_ERROR;
  }
}

export default Podyard;
