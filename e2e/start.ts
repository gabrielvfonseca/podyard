#!/usr/bin/env bun
/**
 * Starts all Next.js apps for the E2E suite.
 *
 * Usage: bun start.ts
 *
 * Listens for SIGTERM/SIGINT and tears down every child process.
 */
import { spawn } from "node:child_process";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");

const apps: Array<{ dir: string; env: Record<string, string> }> = [
  { dir: "apps/app", env: { PORT: "3000" } },
  { dir: "apps/web", env: { PORT: "3001" } },
  { dir: "apps/api", env: { PORT: "3002" } },
];

const children: ReturnType<typeof spawn>[] = [];

for (const app of apps) {
  const child = spawn("bun", ["--bun", "next", "start"], {
    cwd: path.join(root, app.dir),
    stdio: "inherit",
    env: {
      ...process.env,
      ...app.env,
      SKIP_ENV_VALIDATION: "true",
    },
  });

  child.on("exit", (code) => {
    console.error(`[start] ${app.dir} exited with code ${code}`);
    shutdown(code ?? 1);
  });

  children.push(child);
}

let shuttingDown = false;

const shutdown = (code: number) => {
  if (shuttingDown) return;
  shuttingDown = true;

  for (const child of children) {
    child.kill("SIGTERM");
  }

  setTimeout(() => process.exit(code), 5_000).unref();
};

process.on("SIGTERM", () => shutdown(0));
process.on("SIGINT", () => shutdown(0));

console.log(`[start] Started ${apps.length} apps:`, apps.map((a) => a.dir).join(", "));
