# Phases 14–16 — how to apply
1. Unzip over your project (same paths). No dependency changes, `package.json` untouched.
2. Restart `npm run dev`, hard-refresh (Ctrl+Shift+R).

## New
- **Tests:** `node scripts/smoke.mjs` (site must be running: `npm run build && npm start` in another terminal). Browser tests are opt-in: `npm i -D @playwright/test`, `npx playwright install chromium`, then `npx playwright test -c playwright.config.mjs`.
- **Sound** (off by default): speaker button in the navbar, also in Ctrl+K and the mobile menu.
- **Deep links** like `yoursite/#contact` now land on the section (was a bug).
- **Production:** security headers, asset caching, web manifest/app icons. Deploy steps: `docs/DEPLOY.md`.

## Please check on your own devices
- Sound toggle sounds acceptable (very quiet clicks) — or tell me to remove it.
- Real phone: speed, sharpness, touch.
