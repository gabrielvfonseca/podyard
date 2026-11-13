import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@repo": path.resolve(import.meta.dirname, "../../packages"),
      // Mock server-only so it doesn't throw in the test environment
      "server-only": path.resolve(
        import.meta.dirname,
        "./src/__tests__/__mocks__/server-only.ts"
      ),
    },
  },
});
