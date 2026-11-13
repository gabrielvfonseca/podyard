#!/usr/bin/env bun
/**
 * Parallel dev server launcher.
 *
 * Usage:
 *   bun dev.ts            # all apps (app, web, api)
 *   bun dev.ts app web    # subset
 *
 * Each app runs `bun dev` in its workspace directory. SIGINT/SIGTERM tear
 * down every child process.
 */
import { spawn, type ChildProcess } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");

const APPS: Record<string, { dir: string; port: string }> = {
  app: { dir: "apps/app", port: "3000" },
  web: { dir: "apps/web", port: "3001" },
  api: { dir: "apps/api", port: "3002" },
};

const requested = process.argv.slice(2);
const selected = requested.length > 0 ? requested : Object.keys(APPS);

for (const name of selected) {
  if (!(name in APPS)) {
    console.error(`Unknown app: ${name}. Available: ${Object.keys(APPS).join(", ")}`);
    process.exit(1);
  }
}

const children: ChildProcess[] = [];
let shuttingDown = false;

const shutdown = (code: number) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    child.kill("SIGTERM");
  }

  setTimeout(() => process.exit(code), 5_000).unref();
};

for (const name of selected) {
  const { dir, port } = APPS[name];

  const child = spawn("bun", ["dev"], {
    cwd: path.join(root, dir),
    stdio: "inherit",
    env: {
      ...process.env,
      PORT: port,
    },
  });

  child.on("exit", (code) => {
    console.error(`[dev] ${name} exited with code ${code}`);
    shutdown(code ?? 1);
  });

  children.push(child);
  console.log(`[dev] ${name} → http://localhost:${port}`);
}

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));
