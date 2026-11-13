import { expect, test, vi } from "vitest";
import { app } from "../app";

// Mock the database to avoid server-only import issues
vi.mock("@repo/database", () => ({
  database: {
    page: {
      create: vi.fn().mockResolvedValue({ id: 1 }),
      delete: vi.fn().mockResolvedValue({}),
    },
    user: {
      findFirst: vi.fn().mockResolvedValue(null),
    },
  },
}));

// Mock the analytics server
vi.mock("@repo/analytics/server", () => ({
  analytics: undefined,
}));

// Mock the payments
vi.mock("@repo/payments", () => ({
  stripe: undefined,
}));

test("Health Check", async () => {
  const response = await app.request("/health");
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("OK");
});
