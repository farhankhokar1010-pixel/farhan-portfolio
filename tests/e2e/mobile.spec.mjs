import { test, expect } from "@playwright/test";
import { openHome, reveal } from "./helpers.mjs";

test("phone: no horizontal scroll anywhere on the page", async ({ page }) => {
  await openHome(page);
  for (const id of ["work", "about", "skills", "education", "resume", "certificates", "contact"]) await reveal(page, id);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test("phone: full-screen menu lists all sections and navigates", async ({ page }) => {
  await openHome(page);
  await page.getByRole("button", { name: /menu/i }).first().click();
  const menu = page.locator("#mobile-menu");
  await expect(menu.getByRole("link")).toHaveCount(7);
  await menu.getByRole("link", { name: /Contact/ }).click();
  await page.waitForTimeout(2200);
  expect(await page.evaluate(() => Math.abs(document.getElementById("contact").getBoundingClientRect().top))).toBeLessThan(160);
});

test("phone: contact form fields are 16px+ (no iOS zoom on focus)", async ({ page }) => {
  await openHome(page);
  await reveal(page, "contact");
  const sizes = await page.evaluate(() => [...document.querySelectorAll("#contact input, #contact textarea")].map((e) => parseFloat(getComputedStyle(e).fontSize)));
  expect(sizes.length).toBeGreaterThan(0);
  for (const s of sizes) expect(s).toBeGreaterThanOrEqual(16);
});

test("phone: navbar is frosted glass from the first pixel", async ({ page }) => {
  await openHome(page);
  const bf = await page.evaluate(() => getComputedStyle(document.querySelector("header nav")).backdropFilter);
  expect(bf).toContain("blur");
});

test("phone 360px: PassportAI size rows are fully inside their card", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 740 });
  await openHome(page);
  await reveal(page, "work");
  const bad = await page.evaluate(() => {
    const rows = [...document.querySelectorAll("li")].filter((l) => /dpi/.test(l.textContent) && /Thumbnail|Medium|Full|Passport/.test(l.textContent) && l.querySelectorAll("span").length === 2);
    return { count: rows.length, clipped: rows.filter((l) => [...l.querySelectorAll("span")].some((s) => s.getBoundingClientRect().right > l.getBoundingClientRect().right + 1 || l.getBoundingClientRect().right > window.innerWidth)).length };
  });
  expect(bad.count).toBeGreaterThanOrEqual(4);
  expect(bad.clipped).toBe(0);
});
