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
    // Wait for the main content to be visible rather than networkidle.
    // The page loads fonts and testimonial images that can keep the
    // network busy in headless, so networkidle is unreliable here.
    await expect(page.locator("h1, h2").first()).toBeVisible({
      timeout: 15_000,
    });
    // Give React a moment to settle and surface any async page errors.
    await page.waitForTimeout(1000);

    expect(pageErrors).toHaveLength(0);
  });
});
