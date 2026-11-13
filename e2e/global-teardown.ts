/**
 * Playwright globalTeardown: kills the apps started by global-setup.ts.
 *
 * Reads the PIDs from the shared JSON file (written by global-setup) and
 * signals each process. Fails the run if any app crashed mid-suite.
 */
import { type AppRecord, clearRecords, readRecords } from "./shared-state";

function signal(pid: number, sig: NodeJS.Signals): void {
  try {
    process.kill(pid, sig);
  } catch {
    // ESRCH (no such process) — already gone; ignore.
  }
}

export default async function globalTeardown(): Promise<void> {
  const records: AppRecord[] = readRecords();

  if (records.length === 0) {
    clearRecords();
    return;
  }

  // Terminate gracefully first.
  for (const rec of records) {
    if (rec.pid > 0) {
      signal(rec.pid, "SIGTERM");
    }
  }

  // Give Next.js a moment to flush, then force-kill stragglers.
  await new Promise((r) => setTimeout(r, 2000));
  for (const rec of records) {
    if (rec.pid > 0) {
      signal(rec.pid, "SIGKILL");
    }
  }

  clearRecords();

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
