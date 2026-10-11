# Muhammad Farhan — Portfolio

Next.js 16 · React 19 · TypeScript · Tailwind v4 · GSAP · three / React Three Fiber · Groq (Ask Farhan)

```bash
npm install
npm run dev          # = next dev --webpack
npm run build && npm start   # closest to Vercel
```

Create `.env.local` (see `.env.example`):
```
GROQ_API_KEY=...
GROQ_MODEL=openai/gpt-oss-20b
```
Check it loaded: open http://localhost:3000/api/chat → `"configured": true`.

Status: plan phases 1–16 done (+ Education); needs a real-phone check, then deploy (see docs/DEPLOY.md). Tests: `node scripts/smoke.mjs` and `tests/e2e` (opt-in Playwright). Full handoff notes: `docs/HANDOFF.md`.
Content lives in `src/data/*` (placeholders are labelled). Project links: `src/data/projects.ts`.
