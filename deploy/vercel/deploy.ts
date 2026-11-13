#!/usr/bin/env bun
/**
 * Vercel deploy helper.
 *
 * Usage:
 *   VERCEL_TOKEN=... bun deploy/vercel/deploy.ts <app|web|api|docs> [--prod]
 */
import { spawnSync } from "node:child_process";

const PROJECTS: Record<string, string> = {
  app: "apps/app",
  web: "apps/web",
  api: "apps/api",
  docs: "apps/docs",
};

const [project, ...rest] = process.argv.slice(2);
const prod = rest.includes("--prod");

if (!(project && project in PROJECTS)) {
  console.error(
    "Usage: bun deploy/vercel/deploy.ts <app|web|api|docs> [--prod]"
  );
  process.exit(1);
}

if (!process.env.VERCEL_TOKEN) {
  console.error("VERCEL_TOKEN environment variable is required.");
  process.exit(1);
}

const args = ["deploy", "--yes", "--cwd", PROJECTS[project]];
if (prod) {
  args.push("--prod");
}

console.log(`[vercel] bunx vercel ${args.join(" ")}`);
const result = spawnSync("bunx", ["vercel", ...args], {
  stdio: "inherit",
  env: process.env,
});
process.exit(result.status ?? 1);
