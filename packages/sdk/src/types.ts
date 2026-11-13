export interface PodyardClientOptions {
  apiKey: string;
  baseUrl?: string;
  fetch?: typeof fetch;
}

export interface Sandbox {
  id: string;
  status?: string;
  [key: string]: unknown;
}

export interface CreateSandboxInput {
  template?: string;
  [key: string]: unknown;
}
