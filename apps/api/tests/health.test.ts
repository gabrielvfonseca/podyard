import { expect, test, vi } from "vitest";
import { app } from "../src/app";

// Mock the database to avoid server-only import issues
vi.mock("@podyard/database", () => ({
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
vi.mock("@podyard/analytics/server", () => ({
  analytics: undefined,
}));

// Mock the payments
vi.mock("@podyard/payments", () => ({
  stripe: undefined,
}));

test("Health Check", async () => {
  const response = await app.request("/health");
  expect(response.status).toBe(200);
  expect(await response.text()).toBe("OK");
});
