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
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import type { FullConfig } from "@playwright/test";
import { type AppRecord, writeRecords } from "./shared-state";

const APP_PORT = process.env.E2E_PORT_APP ?? "3000";
const WEB_PORT = process.env.E2E_PORT_WEB ?? "3001";
const API_PORT = process.env.E2E_PORT_API ?? "3002";

const BOOT_HELPER_PID_FILE = path.join(
  os.tmpdir(),
  "e2e-podyard-boot-helper.pid"
);

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
      // A dedicated health endpoint must return 200. For the app/web home
      // routes, any HTTP response means the server is up and listening —
      // route-level errors (4xx/5xx) are asserted by the specs, not here.
      const ok = app.health ? res.status === 200 : res.status < 600;
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

interface BootHelperEvent {
  app?: string;
  code?: number;
  message?: string;
  pid?: number;
  type?: string;
}

/**
 * Start e2e/start-apps.js (a plain-CJS helper) via spawnSync so it spawns
 * the three apps from a normal Node process.
 *
 * Why a helper at all: in Playwright's globalSetup context (Node 22, loaded
 * in-process through nodeModule.registerHooks), async `spawn` fails with
 * ENOENT for EVERY binary — even /bin/sh with an absolute path — while
 * spawnSync works reliably. The helper performs the actual async spawns
 * from a plain Node context where they succeed.
 *
 * The helper runs detached (own session) so the three app processes keep
 * living after global-setup returns; its PID is persisted to
 * BOOT_HELPER_PID_FILE so global-teardown can stop it (and the apps)
 * cleanly.
 *
 * spawnSync is used with a 60s timeout: the helper starts the apps and
 * exits quickly, so the call returns well within the window. Any longer
 * hang means the helper itself failed to start the apps.
 */
function resolveNodeBin(): string {
  const which = spawnSync("which", ["node"], { encoding: "utf8" });
  return which.status === 0 && which.stdout.trim()
    ? which.stdout.trim()
    : process.execPath;
}

function relayStderr(stderr: string): void {
  for (const line of stderr.split("\n")) {
    if (line.trim()) {
      process.stderr.write(`[e2e:boot-helper] ${line}\n`);
    }
  }
}

interface ParsedEvents {
  failed: string[];
  records: AppRecord[];
}

function parseHelperEvents(stdout: string): ParsedEvents {
  const records: AppRecord[] = [];
  const failed: string[] = [];
  for (const line of stdout.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) {
      continue;
    }
    let event: BootHelperEvent;
    try {
      event = JSON.parse(trimmed) as BootHelperEvent;
    } catch {
      process.stderr.write(`[e2e:boot-helper] ${trimmed}\n`);
      continue;
    }
    if (event.type === "ready" && event.app && event.pid) {
      records.push({ pid: event.pid, name: event.app });
    } else if (event.type === "spawn-error" || event.type === "spawn-throw") {
      failed.push(
        `${event.app ?? "?"}: ${event.code ?? "threw"} ${event.message ?? ""}`
      );
    }
  }
  return { failed, records };
}

function assertAppsStarted(events: ParsedEvents): void {
  if (events.failed.length > 0) {
    throw new Error(
      `[global-setup] apps failed to start: ${events.failed.join("; ")}`
    );
  }
  if (events.records.length < apps.length) {
    throw new Error(
      `[global-setup] expected ${apps.length} app PIDs from boot helper, got ${events.records.length}`
    );
  }
}

function launchBootHelper(): void {
  const helperPath = path.join(import.meta.dirname, "start-apps.cjs");
  const nodeBin = resolveNodeBin();

  const helper = spawnSync(nodeBin, [helperPath], {
    cwd: import.meta.dirname,
    stdio: ["pipe", "pipe", "pipe"],
    timeout: 60_000,
    env: {
      ...process.env,
      E2E_PORT_APP: APP_PORT,
      E2E_PORT_WEB: WEB_PORT,
      E2E_PORT_API: API_PORT,
      ...(process.env.E2E_BUN_PATH
        ? { E2E_BUN_PATH: process.env.E2E_BUN_PATH }
        : {}),
    },
  });

  if (helper.error) {
    const err = helper.error as NodeJS.ErrnoException;
    throw new Error(
      `[global-setup] failed to start boot helper ${helperPath} with ${nodeBin}: ` +
        `${err.code ?? ""} ${err.message}`
    );
  }

  const stderr = helper.stderr?.toString().trim();
  if (stderr) {
    relayStderr(stderr);
  }

  const events = parseHelperEvents(helper.stdout.toString());
  assertAppsStarted(events);
  writeRecords(events.records);

  // Persist the helper's PID so global-teardown can stop it (and thereby
  // the three apps it spawned).
  if (helper.pid) {
    fs.writeFileSync(BOOT_HELPER_PID_FILE, String(helper.pid), "utf8");
  }
}

export default async function globalSetup(_config: FullConfig): Promise<void> {
  if (process.env.E2E_NO_BOOT === "1") {
    console.log(
      "[global-setup] E2E_NO_BOOT=1 — assuming apps are already running"
    );
    return;
  }

  launchBootHelper();

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
}
