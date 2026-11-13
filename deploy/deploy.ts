#!/usr/bin/env bun
/**
 * Vercel deploy helper for podyard.
 *
 * Wraps the `vercel` CLI so every project shares one invocation contract:
 *
 *   VERCEL_TOKEN=... bun deploy.ts <app|web|api|docs> [--prod]
 *
 * The default deploy path is Vercel's GitHub integration. This script is for
 * CI jobs that prefer `vercel deploy` from the terminal (see
 * `infrastructure/github/deploy.yml`).
 *
 * Requirements:
 *   - `vercel` CLI on PATH (`bunx vercel` works without a global install)
 *   - VERCEL_TOKEN environment variable
 */
import { spawnSync } from "node:child_process";

const PROJECTS: Record<string, string> = {
  app: "apps/app",
  web: "apps/web",
  api: "apps/api",
  docs: "apps/docs",
};

function parseArgs(argv: string[]): { project: string; prod: boolean } {
  const args = argv.slice(2);

  const project = args.find((arg) => !arg.startsWith("--"));
  const prod = args.includes("--prod");

  if (!project || !(project in PROJECTS)) {
    console.error("Usage: bun deploy.ts <app|web|api|docs> [--prod]");
    process.exit(1);
  }

  return { project, prod };
}

async function main() {
  const { project, prod } = parseArgs(process.argv);

  if (!process.env.VERCEL_TOKEN) {
    console.error("VERCEL_TOKEN environment variable is required.");
    process.exit(1);
  }

  const rootDir = PROJECTS[project];
  const args = ["deploy", "--yes", "--cwd", rootDir];
  if (prod) args.push("--prod");

  console.log(`[deploy] vercel ${args.join(" ")}`);

  const result = spawnSync("bunx", args, {
    stdio: "inherit",
    env: process.env,
    cwd: process.cwd(),
  });

  process.exit(result.status ?? 1);
}

main();
