# @podyard/sdk

TypeScript SDK for Podyard sandboxes with a simple, typed API.

## Install

```bash
npm install @podyard/sdk
```

## Quick start

```ts
import { Podyard } from "@podyard/sdk";

const client = Podyard.fromEnv(); // uses PODYARD_API_KEY and optional PODYARD_BASE_URL

const sandboxes = await client.sandboxes.list();
const sandbox = await client.sandboxes.create({ template: "node" });
```

## Configuration

- `PODYARD_API_KEY` (required)
- `PODYARD_BASE_URL` (optional, defaults to `https://api.podyard.com`)

## API

- `new Podyard({ apiKey, baseUrl?, fetch? })`
- `Podyard.fromEnv()`
- `client.sandboxes.list()`
- `client.sandboxes.create(input?)`
- `client.sandboxes.get(id)`
- `client.sandboxes.delete(id)`

## Errors

All failures thrown by the SDK are instances of `PodyardError`, which extends
`FrontalError` from [`@frontal-labs/error`](https://www.npmjs.com/package/@frontal-labs/error).
Every error carries:

- **`scope`** — always `"podyard"`.
- **`code`** — a stable string from `PodyardErrorCodes`. Branch on this, never
  on message text.
- **`message`** — developer-facing detail (e.g. `"fetch failed: ECONNREFUSED"`).
  Never sent to clients.
- **`public.message`** — approved client-facing text. This is what reaches end
  users via HTTP responses or UI error boundaries.

### Error codes

| Code | Meaning |
|---|---|
| `missing_api_key` | `PODYARD_API_KEY` is absent |
| `network_failure` | The underlying `fetch` rejected |
| `api_error` | The API returned an unexpected non-2xx response |
| `invalid_json` | The response body could not be parsed as JSON |
| `auth_failed` | The API returned 401 or 403 |
| `rate_limited` | The API returned 429 |
| `not_found` | The API returned 404 |
| `sandbox_not_found` | A specific sandbox resource was not found |
| `sandbox_unavailable` | A specific sandbox resource is in an unavailable state |

### Handling errors

```ts
import { PodyardError, PodyardErrorCodes } from "@podyard/sdk";

try {
  const sandboxes = await client.sandboxes.list();
} catch (error) {
  if (error instanceof PodyardError) {
    switch (error.code) {
      case PodyardErrorCodes.RATE_LIMITED:
        // back off and retry
        break;
      case PodyardErrorCodes.NETWORK_FAILURE:
        // show error.public.message to the user
        break;
    }
  }
}
```

### Building custom errors

`PodyardError` can be thrown directly when you need to raise an SDK-scoped
error from your own code:

```ts
import { PodyardError, PodyardErrorCodes } from "@podyard/sdk";

throw new PodyardError("Sandbox sbx_123 is in a failed state", {
  code: PodyardErrorCodes.SANDBOX_UNAVAILABLE,
  statusCode: 503,
  public: {
    message: "The sandbox is temporarily unavailable.",
    hint: "Try again in a few seconds.",
  },
});
```

## Requirements

- Node.js >= 22
