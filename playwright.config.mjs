// Opt-in browser tests (not part of the site build). One-time setup on your PC:
//   npm i -D @playwright/test        then      npx playwright install chromium
// Run:   npm run build && npx playwright test -c playwright.config.mjs
// (Tests start `npm run start` for you; set BASE_URL to test a deployed site instead.)
import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.BASE_URL || "http://localhost:3000";
// WebGL is switched off so the tests are fast and deterministic: the hero falls back to the photo.
const launchOptions = {
  args: ["--disable-gpu", "--disable-webgl", "--disable-3d-apis"],
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
};

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: { timeout: 12_000 },
  retries: 1,
  reporter: [["list"]],
  use: { baseURL, launchOptions, trace: "retain-on-failure" },
  webServer: process.env.BASE_URL ? undefined : { command: "npm run start", url: baseURL, reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "desktop", testIgnore: /(mobile|webgl)\.spec/, use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, colorScheme: "dark" } },
    {
      name: "webgl",
      testMatch: /webgl\.spec\.mjs/,
      use: { ...devices["Desktop Chrome"], viewport: { width: 700, height: 800 }, launchOptions: { ...launchOptions, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl"] } },
    },
    { name: "mobile", testMatch: /mobile\.spec\.mjs/, use: { ...devices["Pixel 7"], colorScheme: "dark" } },
  ],
});
