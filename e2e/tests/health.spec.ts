import { expect, test } from "@playwright/test";

const APP = process.env.E2E_APP_URL ?? "http://localhost:3000";
const WEB = process.env.E2E_WEB_URL ?? "http://localhost:3001";
const API = process.env.E2E_API_URL ?? "http://localhost:3002";

test.describe("cross-app", () => {
  test("apps are alive concurrently", async ({ request }) => {
    const [app, web, api] = await Promise.all([
      request.get(`${APP}/`),
      request.get(`${WEB}/`),
      request.get(`${API}/health`),
    ]);

    expect(app.status()).toBeLessThan(500);
    expect(web.status()).toBeLessThan(500);
    expect(api.status()).toBe(200);
  });

  test("web homepage has no page-level JS errors", async ({ page }) => {
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    await page.goto(`${WEB}/`);
    await page.waitForLoadState("networkidle");

    expect(pageErrors).toHaveLength(0);
  });
});
