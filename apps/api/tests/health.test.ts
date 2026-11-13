import { expect, test, vi } from "vitest";
import { app } from "../src/app";

// Mock the database to avoid server-only import issues
vi.mock("@podyard/database", () => ({
  database: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([]),
    insert: vi.fn().mockReturnThis(),
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([{ id: 1 }]),
    delete: vi.fn().mockReturnThis(),
  },
  schema: {},
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
