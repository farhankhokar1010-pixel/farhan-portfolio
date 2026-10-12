import { test, expect } from "@playwright/test";
import { openHome, reveal, waitForLoader } from "./helpers.mjs";

const SECTIONS = ["Work", "About", "Skills", "Education", "Resume", "Certificates", "Contact"];

test("home loads without console or page errors", async ({ page }) => {
  const errors = await openHome(page);
  await expect(page.locator("h1")).toContainText("FARHAN", { ignoreCase: true });
  expect(errors).toEqual([]);
});

test("every navbar link scrolls to its section and becomes current", async ({ page }) => {
  await openHome(page);
  for (const name of SECTIONS) {
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name, exact: true }).click();
    await page.waitForTimeout(1800);
    const id = name.toLowerCase();
    const top = await page.evaluate((i) => Math.round(document.getElementById(i).getBoundingClientRect().top), id);
    expect(Math.abs(top), `${name} section top`).toBeLessThan(220);
    await expect(page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name, exact: true })).toHaveAttribute("aria-current", "true");
  }
});

test("theme choice is applied and survives a reload", async ({ page }) => {
  await openHome(page);
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  const before = await isDark();
  await page.getByRole("button", { name: /Switch to (dark|light) mode/ }).click();
  expect(await isDark()).toBe(!before);
  await page.reload();
  await waitForLoader(page);
  expect(await isDark()).toBe(!before);
});

test("performance mode toggles data-perf", async ({ page }) => {
  await openHome(page);
  await page.getByRole("button", { name: /Performance mode off/ }).click();
  await expect(page.locator("html")).toHaveAttribute("data-perf", "reduced");
});

test("sound is off by default and the toggle remembers its state", async ({ page }) => {
  await openHome(page);
  const btn = page.getByRole("button", { name: /^Sound (off|on)/ });
  await expect(btn).toHaveAttribute("aria-pressed", "false");
  await btn.click();
  await expect(btn).toHaveAttribute("aria-pressed", "true");
  expect(await page.evaluate(() => localStorage.getItem("sound"))).toBe("on");
});

test("resume tabs switch content and the PDF link is correct", async ({ page }) => {
  await openHome(page);
  await reveal(page, "resume");
  for (const [tab, panel] of [["Experience", "rpanel-experience"], ["Education", "rpanel-education"], ["Skills", "rpanel-skills"], ["Projects", "rpanel-projects"]]) {
    await page.getByRole("tab", { name: tab }).click();
    await expect(page.locator(`#${panel}`)).toBeVisible();
  }
  const pdf = page.getByRole("link", { name: /Download PDF/ });
  await expect(pdf).toHaveAttribute("href", "/Muhammad_Farhan_Resume.pdf");
  const res = await page.request.get("/Muhammad_Farhan_Resume.pdf");
  expect(res.status()).toBe(200);
});

test("certificates open in a lightbox and verify links are right", async ({ page }) => {
  await openHome(page);
  await reveal(page, "certificates");
  await expect(page.getByRole("link", { name: /Verify online/ }).first()).toHaveAttribute("href", "https://actai.aiskillbridge.pk/v/RQN3FGT6D58TQK8F");
  await page.getByRole("button", { name: /View certificate: ACT AI/ }).click();
  const box = page.locator('[aria-label^="Screenshot:"]');
  await expect(box).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(box).toHaveCount(0);
});

test("contact: validation, Gmail compose URL and direct links", async ({ page }) => {
  await openHome(page);
  await reveal(page, "contact");
  await page.getByRole("button", { name: /Compose in Gmail/ }).click();
  await expect(page.locator("#compose-err")).toContainText("at least 10");
  await page.getByLabel("Your name").fill("Test User");
  await page.getByLabel("Message").fill("Hello Farhan, this is a test message.");
  await page.evaluate(() => { window.__url = null; window.open = (u) => { window.__url = u; return null; }; });
  await page.getByRole("button", { name: /Compose in Gmail/ }).click();
  const url = await page.evaluate(() => window.__url);
  expect(url).toContain("mail.google.com");
  expect(url).toContain(encodeURIComponent("farhankhokar1010@gmail.com"));
  expect(url).toContain(encodeURIComponent("Hello Farhan"));
  await expect(page.getByRole("link", { name: /WhatsApp/ })).toHaveAttribute("href", /wa\.me/);
  await expect(page.getByRole("link", { name: /Call/ })).toHaveAttribute("href", "tel:+923137050232");
  await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute("href", /linkedin\.com\/in\//);
  await expect(page.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", /github\.com\//);
});

test("Ask Farhan: opens, shows full heading on a small laptop, streams an answer", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 });
  await page.route("**/api/chat", (route) => route.request().method() === "POST"
    ? route.fulfill({ status: 200, headers: { "Content-Type": "text/plain; charset=utf-8", "X-Ask-Source": "local" }, body: "He built Resume Nova, MediMart and PassportAI." })
    : route.continue());
  await openHome(page);
  await page.getByRole("button", { name: /Ask Farhan/ }).first().click();
  const log = page.locator('[role="dialog"][aria-label="Ask Farhan"] [role="log"]');
  const heading = log.locator("p.font-display").first();
  await expect(heading).toBeVisible();
  const clipped = await page.evaluate(() => {
    const l = document.querySelector('[role="dialog"][aria-label="Ask Farhan"] [role="log"]');
    return l.querySelector("p.font-display").getBoundingClientRect().top < l.getBoundingClientRect().top - 1;
  });
  expect(clipped).toBe(false);
  await page.getByLabel("Your question").fill("What has he built?");
  await page.keyboard.press("Enter");
  await expect(log).toContainText("Resume Nova, MediMart and PassportAI");
  await page.keyboard.press("Escape");
});

test("command palette: Ctrl+K, filter, Enter navigates, Esc closes", async ({ page }) => {
  await openHome(page);
  await page.keyboard.press("Control+k");
  const dlg = page.getByRole("dialog", { name: "Command palette" });
  await expect(dlg).toBeVisible();
  await expect(dlg.locator("input")).toBeFocused();
  await page.keyboard.type("contact");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(2000);
  expect(await page.evaluate(() => Math.abs(document.getElementById("contact").getBoundingClientRect().top))).toBeLessThan(220);
  await page.keyboard.press("Control+k");
  await expect(dlg.locator("input")).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dlg).toBeHidden();
});

test("keyboard: first Tab stop is the skip link and it works", async ({ page }) => {
  await openHome(page);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
});

test("unknown route shows the branded 404 and a way home", async ({ page }) => {
  const res = await page.goto("/nope");
  expect(res.status()).toBe(404);
  await expect(page.locator("h1")).toContainText("Lost in 3D space");
  await expect(page.getByRole("link", { name: "Back to the portfolio" })).toHaveAttribute("href", "/");
});

test("deep link /#contact lands on the contact section after loading", async ({ page }) => {
  await page.goto("/#contact");
  await waitForLoader(page);
  await page.waitForTimeout(1200);
  const top = await page.evaluate(() => Math.abs(Math.round(document.getElementById("contact").getBoundingClientRect().top)));
  expect(top).toBeLessThan(220);
});

test("very slow JavaScript: the page reveals itself after a few seconds instead of staying on the loader", async ({ page }) => {
  await page.route("**/_next/static/**/*.js", (route) => route.abort()); // JS never arrives
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("h1")).toBeVisible();
  await page.waitForTimeout(4500); // 3 s give-up delay + 0.6 s fade
  const loader = await page.evaluate(() => getComputedStyle(document.getElementById("loader")).visibility);
  expect(loader).toBe("hidden");
  await expect(page.locator("h1")).toBeInViewport();
  await expect(page.locator('img[src*="farhan-poster"]')).toBeVisible();
});

test("glass blur really applies (the compiled CSS keeps backdrop-filter)", async ({ page }) => {
  await openHome(page);
  await page.evaluate(() => window.scrollTo(0, 600));
  await page.waitForTimeout(800);
  const bf = await page.evaluate(() => getComputedStyle(document.querySelector("header nav")).backdropFilter);
  expect(bf).toContain("blur");
});

test("images are served as static files, not through the slow on-demand optimiser", async ({ page }) => {
  const urls = [];
  page.on("request", (r) => { if (r.resourceType() === "image") urls.push(r.url()); });
  await openHome(page);
  await reveal(page, "work");
  expect(urls.length).toBeGreaterThan(0);
  expect(urls.filter((u) => u.includes("/_next/image"))).toEqual([]);
});
