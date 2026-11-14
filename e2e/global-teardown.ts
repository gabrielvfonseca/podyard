/**
 * Playwright globalTeardown: stops the apps started by global-setup.ts.
 *
 * global-setup delegates the actual spawning to e2e/start-apps.js (a plain
 * CJS helper run in its own session). Teardown first asks that helper to
 * stop the apps cleanly (its PID is persisted by global-setup), then reads
 * the app PIDs from the shared JSON file and signals any that survived.
 *
 * Fails the run if any app crashed mid-suite (exitCode recorded by the
 * helper in the shared JSON file).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { type AppRecord, clearRecords, readRecords } from "./shared-state";

const BOOT_HELPER_PID_FILE = path.join(
  os.tmpdir(),
  "e2e-podyard-boot-helper.pid"
);

function signal(pid: number, sig: NodeJS.Signals): void {
  try {
    process.kill(pid, sig);
  } catch {
    // ESRCH (no such process) — already gone; ignore.
  }
}

function readHelperPid(): number | null {
  try {
    const raw = fs.readFileSync(BOOT_HELPER_PID_FILE, "utf8").trim();
    const pid = Number.parseInt(raw, 10);
    return Number.isInteger(pid) && pid > 0 ? pid : null;
  } catch {
    return null;
  }
}

export default async function globalTeardown(): Promise<void> {
  const records: AppRecord[] = readRecords();
  const helperPid = readHelperPid();

  // 1. Ask the boot helper to stop the apps gracefully. It forwards
  //    SIGTERM to each app, then SIGKILL after a short grace period.
  if (helperPid) {
    signal(helperPid, "SIGTERM");
  }

  // 2. Give the helper (and the apps) a moment, then force-kill any
  //    straggling app PIDs directly.
  await new Promise((r) => setTimeout(r, 3000));
  for (const rec of records) {
    if (rec.pid > 0) {
      signal(rec.pid, "SIGKILL");
    }
  }
  if (helperPid) {
    signal(helperPid, "SIGKILL");
  }

  // 3. Clean up state files.
  clearRecords();
  try {
    fs.unlinkSync(BOOT_HELPER_PID_FILE);
  } catch {
    // ignore
  }

  // Surface any apps that crashed during the suite.
  const crashed = records.filter((r) => r.exitCode !== undefined);
  if (crashed.length > 0) {
    throw new Error(
      `[global-teardown] apps exited during the run: ${crashed
        .map((r) => `${r.name}(${r.exitCode})`)
        .join(", ")}`
    );
  }
}
