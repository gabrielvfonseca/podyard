#!/usr/bin/env node
"use strict";
/**
 * Child process that spawns the three Next.js apps (app/web/api) with
 * `bun --bun next start` and keeps running until it is asked to stop.
 *
 * Why this exists: Playwright's globalSetup context (loaded in-process via
 * nodeModule.registerHooks in Node 22) fails to `spawn` ANY binary with
 * ENOENT — even /bin/sh with an absolute path — while spawnSync works.
 * This helper is itself spawned by global-setup through spawnSync
 * (which reliably works in that context) and performs the actual async
 * spawns from a plain Node process where they succeed.
 *
 * Protocol (stdout is a line-delimited JSON channel):
 *   child -> parent: { type: "ready",  app, pid }        per app started
 *   child -> parent: { type: "exit",   app, code, signal } when an app dies
 *   child -> parent: { type: "stderr", app, text }       app stderr line
 *   child -> parent: { type: "stdout", app, text }       app stdout line
 *   parent -> child stdin: "stop"                        shut down children
 */

const { spawn, spawnSync } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");

function resolveBun() {
  if (process.env.E2E_BUN_PATH) {
    return process.env.E2E_BUN_PATH;
  }
  const which = spawnSync("which", ["bun"], { encoding: "utf8" });
  if (which.status === 0 && which.stdout.trim()) {
    return which.stdout.trim();
  }
  return "bun";
}

function emit(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}

// app and web are Next.js apps (start with `next start`); api is a Hono
// server compiled to dist/index.js (start with `bun dist/index.js`).
const apps = [
  {
    dir: "apps/app",
    name: "app",
    port: process.env.E2E_PORT_APP ?? "3000",
    args: ["--bun", "next", "start"],
  },
  {
    dir: "apps/web",
    name: "web",
    port: process.env.E2E_PORT_WEB ?? "3001",
    args: ["--bun", "next", "start"],
  },
  {
    dir: "apps/api",
    name: "api",
    port: process.env.E2E_PORT_API ?? "3002",
    args: ["dist/index.js"],
  },
];

const BUN_BIN = resolveBun();
const children = new Map();

function attachChild(app, child) {
  children.set(app.name, child);
  child.on("error", (err) => {
    emit({
      type: "spawn-error",
      app: app.name,
      code: err.code,
      message: err.message,
    });
  });
  child.stdout?.on("data", (chunk) => {
    emit({ type: "stdout", app: app.name, text: chunk.toString() });
  });
  child.stderr?.on("data", (chunk) => {
    emit({ type: "stderr", app: app.name, text: chunk.toString() });
  });
  child.on("exit", (code, signal) => {
    emit({ type: "exit", app: app.name, code, signal });
  });
  emit({ type: "ready", app: app.name, pid: child.pid ?? 0 });
}

function startAll() {
  for (const app of apps) {
    try {
      const child = spawn(BUN_BIN, app.args, {
        cwd: path.join(root, app.dir),
        stdio: ["ignore", "pipe", "pipe"],
        env: {
          ...process.env,
          PORT: app.port,
        },
      });
      attachChild(app, child);
    } catch (err) {
      emit({ type: "spawn-throw", app: app.name, message: err.message });
    }
  }
}

function stopAll() {
  for (const child of children.values()) {
    try {
      child.kill("SIGTERM");
    } catch {
      // already gone
    }
  }
  const killer = setTimeout(() => {
    for (const child of children.values()) {
      try {
        child.kill("SIGKILL");
      } catch {
        // already gone
      }
    }
    process.exit(0);
  }, 3000);
  killer.unref?.();
  process.exit(0);
}

process.stdin.setEncoding("utf8");
let buffer = "";
process.stdin.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split("\n");
  buffer = lines.pop() ?? "";
  for (const line of lines) {
    if (line.trim() === "stop") {
      stopAll();
    }
  }
});

process.on("SIGTERM", stopAll);
process.on("SIGINT", stopAll);

startAll();
process.exit(0);
