import { PodyardError } from "./errors";
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
      throw new PodyardError("Podyard apiKey is required");
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
      throw new PodyardError("Missing PODYARD_API_KEY environment variable");
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
      throw new PodyardError("Network request failed", { cause });
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
        { status: response.status }
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
        cause,
      });
    }
  }
}

export default Podyard;
