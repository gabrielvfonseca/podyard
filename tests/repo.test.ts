import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

describe("repo sanity", () => {
  test("workspace layout is intact", () => {
    // Guards against accidental deletion of the top-level structure the
    // rest of the tooling (turbo, biome, this suite) depends on.
    const root = path.resolve(import.meta.dirname, "..");

    for (const entry of [
      "apps",
      "packages",
      "e2e",
      "tests",
      "tools",
      "deploy",
      "infrastructure",
    ]) {
      expect(
        fs.existsSync(path.join(root, entry)),
        `${entry}/ should exist`
      ).toBe(true);
    }
  });
});
