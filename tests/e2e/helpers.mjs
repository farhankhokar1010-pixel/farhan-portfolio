import { expect } from "@playwright/test";

/** The loading screen sets data-loading="true" in an effect and removes it when done; wait for both halves. */
export async function waitForLoader(page) {
  await page.waitForSelector('html[data-loading="true"]', { state: "attached", timeout: 8_000 }).catch(() => {});
  await page.waitForSelector('html:not([data-loading="true"])', { state: "attached", timeout: 30_000 });
  await page.waitForTimeout(600);
}

/** Open the home page and wait for the loading screen to leave. */
export async function openHome(page) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" && !/WebGL|GPU|webgl/i.test(m.text())) errors.push(m.text()); });
  await page.goto("/");
  await waitForLoader(page);
  return errors;
}

/** Scroll a section into view the way a visitor would, so reveal animations have run. */
export async function reveal(page, id) {
  await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
  await page.waitForTimeout(1500);
}
