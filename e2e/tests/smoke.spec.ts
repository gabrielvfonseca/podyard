import { expect, test } from "@playwright/test";

const APP = "http://localhost:3000";
const WEB = "http://localhost:3001";
const API = "http://localhost:3002";

test.describe("app", () => {
  test("unauthenticated load does not 5xx", async ({ page }) => {
    const response = await page.goto(`${APP}/`);
    // Unauthenticated visitors are redirected to sign-in or shown a
    // landing page — never a server error.
    expect(response?.status()).toBeLessThan(500);
  });
});

test.describe("web", () => {
  test("marketing homepage renders", async ({ page }) => {
    await page.goto(`${WEB}/`);
    await expect(page.locator("main, h1, h2").first()).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
  });

  test("unknown route returns 404", async ({ page }) => {
    const response = await page.goto(`${WEB}/does-not-exist`);
    expect(response?.status()).toBe(404);
  });
});

test.describe("api", () => {
  test("health endpoint returns OK", async ({ request }) => {
    const response = await request.get(`${API}/health`);
    expect(response.status()).toBe(200);
    expect(await response.text()).toBe("OK");
  });
});
