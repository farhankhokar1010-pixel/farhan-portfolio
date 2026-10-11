# Phase 9 + 10 + fixes — how to apply

1. Unzip over your project (same paths). No new dependencies, `package.json` untouched.
2. Restart `npm run dev`, hard-refresh the page (Ctrl+Shift+R).
3. Check: Resume tabs + PDF download, certificate click-to-enlarge, Contact buttons, Ask Farhan panel on your laptop.

## What changed
- **Fix:** Ask Farhan panel top clipped on laptops (empty-state alignment bug) — `AskFarhanPanel.tsx`.
- **Fix (dev only):** `chrome: call method timed out` rejection is filtered in `src/lib/bootScript.ts`.
- **Phase 9:** `components/resume/*`, `components/achievements/*`, `data/resume.ts`, `data/achievements.ts`, PDF in `public/`, 3 certificate images in `public/images/certificates/`.
- **Phase 10:** `components/contact/*`, `data/profile.ts` (email, GitHub, LinkedIn, location from your resume).
- Ask Farhan knows the new data (`lib/ask/knowledge.ts`, `local.ts`).

## Still needed from you
- Fiverr URL and availability wording → `src/data/profile.ts` (hidden in UI until set).
- Add TypeScript / React Native / CI-CD / Oracle (from your resume PDF) to `skills.ts`?
- ACT AI certificate image shows its security code + QR; tell me if you want that area blurred.
