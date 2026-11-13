import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@repo": path.resolve(import.meta.dirname, "../packages"),
    },
  },
});
