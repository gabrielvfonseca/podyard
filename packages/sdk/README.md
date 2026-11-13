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
