import { test, expect } from "@playwright/test";

// Runs with software WebGL (slow, but real): the page must appear TOGETHER with the 3D character, no photo-in-a-ring placeholder.
test("loader runs to 100% and the page appears with the 3D character already visible", async ({ page }) => {
  test.setTimeout(150_000);
  const seen = [];
  await page.goto("/", { waitUntil: "commit" });
  await page.waitForSelector("#loader", { timeout: 20_000 });
  const t0 = Date.now();
  while (Date.now() - t0 < 120_000) {
    const p = await page.evaluate(() => {
      const l = document.getElementById("loader");
      return l ? Number((l.textContent.match(/(\d+)%/) || [])[1]) : null;
    }).catch(() => -1); // page busy / navigating: try again
    if (p === null) break; // loader gone
    if (p >= 0 && seen[seen.length - 1] !== p) seen.push(p);
    await page.waitForTimeout(250);
  }
  expect(await page.locator("#loader").count()).toBe(0);
  expect(seen[seen.length - 1]).toBeGreaterThanOrEqual(99); // reached the end before leaving, not cut at 0%
  expect(seen.length).toBeGreaterThan(3); // progressed in steps
  await expect(page.locator("canvas")).toHaveCount(1);
  const opacity = await page.evaluate(() => getComputedStyle(document.querySelector("canvas").parentElement.parentElement).opacity);
  expect(opacity).toBe("1");
  await expect(page.locator('img[src*="farhan-poster"]')).toHaveCount(0); // no placeholder photo/ring-with-picture
});
