/**
 * Tracks the PIDs of apps started by global-setup so global-teardown can
 * kill them, even though Playwright may evaluate the two modules in
 * separate module instances (or processes). A small JSON file on disk is
 * the shared channel.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Fixed name (no PID) so both modules resolve to the same file.
const PID_FILE = path.join(os.tmpdir(), "e2e-podyard-apps.json");

export interface AppRecord {
  exitCode?: number;
  name: string;
  pid: number;
}

export function writeRecords(records: AppRecord[]): void {
  fs.writeFileSync(PID_FILE, JSON.stringify(records, null, 2), "utf8");
}

export function readRecords(): AppRecord[] {
  try {
    return JSON.parse(fs.readFileSync(PID_FILE, "utf8")) as AppRecord[];
  } catch {
    return [];
  }
}

export function clearRecords(): void {
  try {
    fs.unlinkSync(PID_FILE);
  } catch {
    // ignore
  }
}
