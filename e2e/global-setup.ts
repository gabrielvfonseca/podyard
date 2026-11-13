#!/usr/bin/env bun
/**
 * Playwright globalSetup: boots the Next.js apps for the E2E suite and
 * waits until each is ready. Records their PIDs in a shared file so
 * global-teardown.ts can kill them after the run.
 *
 * This makes the suite a single command — it no longer depends on apps
 * being started externally.
 *
 * Set E2E_NO_BOOT=1 to skip booting (assumes apps are already running).
 * Override ports with E2E_PORT_APP / E2E_PORT_WEB / E2E_PORT_API.
 * Override the bun binary with E2E_BUN_PATH (rarely needed).
 */
import { type ChildProcess, spawn, spawnSync } from "node:child_process";
import path from "node:path";
import type { FullConfig } from "@playwright/test";
import { type AppRecord, writeRecords } from "./shared-state";

const root = path.resolve(import.meta.dirname, "../..");

/**
 * Resolve the full path to the `bun` binary so we can spawn it directly
 * without relying on `shell: true` (which fails in some Playwright
 * globalSetup environments where /bin/sh is not resolvable).
 */
function resolveBun(): string {
  if (process.env.E2E_BUN_PATH) {
    return process.env.E2E_BUN_PATH;
  }
  // Try `which bun` first — works in mise, nvm, homebrew, etc.
  const which = spawnSync("which", ["bun"], { encoding: "utf8" });
  if (which.status === 0 && which.stdout.trim()) {
    return which.stdout.trim();
  }
  // Fall back to the bare name (works when bun is on PATH).
  return "bun";
}

const BUN_BIN = resolveBun();
const BOOT_ARGS = ["--bun", "next", "start"];

const APP_PORT = process.env.E2E_PORT_APP ?? "3000";
const WEB_PORT = process.env.E2E_PORT_WEB ?? "3001";
const API_PORT = process.env.E2E_PORT_API ?? "3002";

const apps: Array<{
  dir: string;
  name: string;
  port: string;
  health?: string;
}> = [
  { dir: "apps/app", name: "app", port: APP_PORT },
  { dir: "apps/web", name: "web", port: WEB_PORT },
  { dir: "apps/api", name: "api", port: API_PORT, health: "/health" },
];

/** Poll `url` until it returns a non-5xx status (or 200 for a health probe). */
async function waitForReady(
  app: (typeof apps)[number],
  timeoutMs = 120_000
): Promise<void> {
  const base = `http://127.0.0.1:${app.port}`;
  const url = app.health ? `${base}${app.health}` : `${base}/`;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "GET", redirect: "manual" });
      const ok = app.health ? res.status === 200 : res.status < 500;
      if (ok) {
        return;
      }
    } catch {
      // Connection refused / not ready yet — keep polling.
    }
    await new Promise((r) => setTimeout(r, 1000));
  }

  throw new Error(
    `[global-setup] ${app.name} (http://127.0.0.1:${app.port}) did not become ready within ${timeoutMs / 1000}s`
  );
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  if (process.env.E2E_NO_BOOT === "1") {
    console.log(
      "[global-setup] E2E_NO_BOOT=1 — assuming apps are already running"
    );
    return;
  }

  const children: ChildProcess[] = [];
  const records: AppRecord[] = [];

  try {
    for (const app of apps) {
      const child = spawn(BUN_BIN, BOOT_ARGS, {
        cwd: path.join(root, app.dir),
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          PORT: app.port,
          SKIP_ENV_VALIDATION: "true",
        },
      });

      // Surface spawn failures as actionable errors instead of an
      // unhandled 'error' event that crashes the whole test process.
      child.on("error", (err: NodeJS.ErrnoException) => {
        process.stderr.write(
          `[global-setup] failed to start ${app.name}: ${err.code} ${err.message}\n`
        );
      });

      child.stdout?.on("data", (chunk: Buffer) => {
        process.stdout.write(`[e2e:${app.name}] ${chunk}`);
      });
      child.stderr?.on("data", (chunk: Buffer) => {
        process.stderr.write(`[e2e:${app.name}] ${chunk}`);
      });

      // If an app dies, record its exit code for teardown to surface.
      child.on("exit", (code) => {
        const rec = records.find((r) => r.name === app.name);
        if (rec) {
          rec.exitCode = code ?? 1;
          writeRecords(records);
        }
      });

      children.push(child);
      records.push({ pid: child.pid ?? 0, name: app.name });
      writeRecords(records);
    }

    // Wait for each app to become ready.
    for (const app of apps) {
      console.log(
        `[global-setup] waiting for ${app.name} on port ${app.port}...`
      );
      await waitForReady(app);
      console.log(`[global-setup] ${app.name} ready`);
    }

    // Expose the resolved base URLs to the test process.
    process.env.E2E_APP_URL = `http://127.0.0.1:${APP_PORT}`;
    process.env.E2E_WEB_URL = `http://127.0.0.1:${WEB_PORT}`;
    process.env.E2E_API_URL = `http://127.0.0.1:${API_PORT}`;
  } catch (err) {
    // Clean up any apps we started before rethrowing.
    for (const child of children) {
      child.kill("SIGKILL");
    }
    throw err;
  }
}
