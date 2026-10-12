# STATUS UPDATE 4 (slow-network + deployed-site fixes) — newest, read first
- Live: https://farhan-portfolio-3d.vercel.app (also farhan-portfolio-ashy-nu.vercel.app → set `NEXT_PUBLIC_SITE_URL` to the one he shares, else canonical/OG point to the other).
- **Page never waits for 3D now.** Loader = fonts (≤2.5 s) + 7 KB hero photo (`farhan-poster.webp`), hard cap 4.5 s. If JS itself is slow, CSS fades the SSR loader out after 3 s (`loader-giveup`) and `lib/ssrReveal.ts` stops Hero/Navbar/Loader from hiding + replaying the intro.
- **3D is progressive** (`HeroStage.tsx`): photo first → after `ready` + idle, fetch model with progress (own `fetch` stream → blob URL) while `import("@/three/Scene")` loads → Scene draws 4 frames hidden (`FirstFrames`, sets `loadStore.sceneVisible`) → crossfade; camera intro waits for `sceneVisible`. 2G/save-data → manual "Load 3D" button. Failures show reason + Try again; 20 s watchdog; `webglcontextlost` → `scene-lost` event.
- **Two models:** `farhan.glb` 1.8 MB (desktop, normal link) / `farhan-mobile.glb` 467 KB (≤1023px, touch, 3g/saveData, ≤4 GB RAM, perf mode). Built with gltf-transform: weld + meshopt simplify ratio 0.35 lockBorder (117k→41k tris), baseColor 1536px, normal/MR 1024px WebP q84/78, quantize + meshopt. `farhan-lite.glb` and the model `<link rel=preload>` tags are gone (they made phones download ~2.7 MB).
- **Big CSS bug fixed:** writing both `backdrop-filter` and `-webkit-backdrop-filter` made the build emit ONLY the prefixed one → Chrome/Android had NO blur anywhere. Write only `backdrop-filter`. Phone navbar is glass from the first pixel (`header nav[aria-label=Primary]` rule in globals.css).
- Images: `images.unoptimized = true` (all are small WebP in /public; optimiser asked for 3840px versions). Below-fold screenshots `fetchPriority=low`.
- PassportAI: size rows stack under the photo <480px; pipeline replay now starts at 12% visibility (35% was unreachable on phones).
- Tests: smoke now 46 checks; 5 new browser regression tests (slow JS reveal, glass blur, static images, phone glass, 360px sizes).
- Not verifiable here: real GPU/phone speed; why the model was missing on his phone before (most likely 1.8 MB + 0.9 MB preload at ~27 KB/s) — the new failure message will say if it still fails.

---

# STATUS UPDATE 3 (Phases 14–16) — newest, read first
- **Done:** 1–16 + Education. Remaining is on Farhan: real-phone/real-GPU check, add Fiverr/availability/project links, deploy via `docs/DEPLOY.md`.
- **14 Testing:** `scripts/smoke.mjs` (no deps; 40 checks: pages, SEO files, assets, headers, chat API guards, secret-leak scan, placeholder scan) and `tests/e2e/*.spec.mjs` + `playwright.config.mjs` (16 browser tests; opt-in: `npm i -D @playwright/test`, `npx playwright install chromium`). Tests are `.mjs` on purpose so `next build` never type-checks them. Test helper note: the loader sets `data-loading` in an effect, so wait for it to appear THEN disappear (`waitForLoader`).
- **Bug found by tests & fixed:** deep links like `/#contact` did not scroll (loader locks scroll) → `HashScroll.tsx`.
- **15 Polish:** optional UI sound (OFF by default, Web Audio synth, `lib/sound.ts`, navbar button + palette + mobile menu), web manifest + apple icon + 192/512 icons.
- **16 Production:** security headers + asset caching in `next.config.ts` (no CSP on purpose), `maxDuration` on the chat route, `docs/DEPLOY.md`, `npm audit --omit=dev` = 0 vulnerabilities.
- **Lighthouse (local prod build, WebGL off, simulated throttling):** desktop 82/99/96/100 (perf/a11y/best-practices/SEO), mobile 54/99/96/100. Mobile LCP ≈7.6 s because the loader waits for the 1.8 MB model on simulated slow 4G. Open design question: show content as soon as fonts are ready and stream the model in behind (keeps quality, faster first paint) — not done, needs Farhan's OK.

---

# STATUS UPDATE 2 (Phases 11–13) — newest, read first
- **Done:** 1–13 + Education. **Next: 14 Testing, 15 Final polish, 16 Production (Vercel).**
- **11 Motion:** scroll-driven camera (`useHeroScroll` ref, smoothstep drift: closer/higher/sideways, small), model turns toward content on scroll, tap-nod spring, speed-based lean + slow idle sway (all in `FarhanModel.tsx`, gated by reduced-motion), slow orange-rim/blue-fill light drift (`Lighting.tsx`, intensities unchanged), hero rings drift/breathe (CSS, off in Performance Mode), background glows change corner per zone (`EnvironmentZones` + `@property` vars in globals.css). **3D visuals were NOT verified by eye** (software GL too slow in the sandbox): check on a real GPU and tune the small constants.
- **12 Mobile/perf:** removed `priority` on below-fold project screenshots, form/chat inputs 16px on phones (no iOS zoom), no horizontal overflow at 390/820px. Not done: real-phone check, Lighthouse, 3D fps on a phone.
- **13 A11y/SEO:** metadata + canonical + OG/Twitter image (`opengraph-image.png`), `robots.ts`, `sitemap.ts`, JSON-LD Person, `not-found`/`error`/`global-error`, `lib/site.ts` (set `NEXT_PUBLIC_SITE_URL` on Vercel). axe-core (WCAG 2.1 AA + best-practice): 0 violations desktop light+dark. About stages no longer fade by opacity (colour emphasis instead); light `--accent-text` darkened to #b04607. Known: WCAG 2.2 target-size flags 2 overlapped screenshot buttons in the Resume Nova stack on phone/tablet.
- Loader now skips the model wait on non-home routes; navbar links work from the 404 page.
- Desktop page height ~10.6k px (target was ~9k): still your call.

---

# STATUS UPDATE (Phase 9 + 10 delivered) — read this first
- **Done now:** 1–10 + Education. **Next: Phase 11 (Advanced motion)**, then 12–16.
- Phase 9: `#resume` = `ResumeSection` (interactive tabbed resume built from `src/data/*` + `resume.ts`, PDF at `/public/Muhammad_Farhan_Resume.pdf`) with certificates now a separate section + nav link (`#certificates`, index 06, data in `src/data/achievements.ts`, scans in `public/images/certificates/`). Nav: Work, About, Skills, Education, Resume, Certificates, Contact (Contact is index 07).
- Phase 10: `#contact` = email (copy), GitHub, LinkedIn, Bahawalpur, compose form (Gmail / mailto / copy — never claims "sent").
- Real contact data now in `profile.ts`. **Still unknown:** Fiverr URL, availability wording (both hidden in the UI until added in `profile.ts`). Phone (0313 7050232) + WhatsApp (his own wa.me/qr link) are now on the Contact tiles at his request.
- Ask Farhan knowledge/offline answers updated for contact, resume, certificates, internship, languages/interests.
- Fixed: Ask Farhan empty state was bottom-aligned (`justify-end`) so the heading was clipped at the top on laptops; now `min-h-full` + `mt-auto`, panel height capped to stay below the navbar.
- Dev-only: `bootScript.ts` swallows the extension rejection `Window message ... timed out` so it no longer shows in terminal/overlay.
- Page height after Phase 10 is ~10.2k px desktop (target was ~9k): needs a trim decision.
- Open: skills.ts lacks TypeScript / React Native / CI-CD (GitHub Actions) / Oracle that his resume PDF lists — ask before merging.

---

# PASTE THIS INTO THE NEW CHAT
(Attach with it: ① the project zip, ② the full requirement plan .docx, ③ my master prompt.)

---

You are taking over a portfolio build that another Claude session started. **You have no memory of it.** Everything you need is in this message plus the three attached files. Read all of it, unzip the project, read the plan and master prompt, then reply in **max 8 lines**: what you understood, what's done, and what you need from me. Don't write code yet.

## 1. Who I am & how to work with me
- I'm **Muhammad Farhan** ("Farhan"): BS Software Engineering student at The Islamia University of Bahawalpur (IUB), Pakistan. Full-stack dev: Python/Flask, databases, AI-API integration, UI/UX.
- I write informally and like **short, direct answers**. No long essays unless I ask.
- Windows + Chrome + PowerShell. I run **`npm run dev`** = `next dev --webpack` (Turbopack killed my terminal). **Never overwrite my `package.json` scripts.** Don't add dependencies unless truly needed (then tell me to `npm install`).
- Deploy target: **Vercel**.
- **Delivery format every step:** a zip with ONLY the new/changed files (same folder paths as the project; no `package.json` unless dependencies changed) + a tiny README with steps + a few screenshots. Say plainly **what you verified and what you could not**.
- **Never invent facts about me** (employers, awards, links, dates). Unknown = clearly-labelled placeholder + ask me.
- Test before claiming it works. If something fails, say so.

## 2. Status — 8 of 16 plan phases done
Plan phases (see attached plan): 0 Content · 1 Design system · 2 Foundation · 3 3D · 4 Hero · 5 Nav/transitions · 6 About+Skills · 7 Projects · 8 AI · **9 Resume+Achievements** · 10 Contact · 11 Advanced motion · 12 Mobile+Performance · 13 Accessibility+SEO · 14 Testing · 15 Final polish · 16 Production.

**Done:** 1–8, plus an extra **Education** section I asked for (real data). **Start at Phase 9**, after the "fix first" list (§7).

## 3. Stack
Next.js 16 (App Router, webpack in dev) · React 19 · TypeScript · Tailwind CSS v4 · GSAP (+ScrollTrigger, ScrollToPlugin) · three + @react-three/fiber 9 + drei 10 · Groq API (server route). Fonts are self-hosted (`src/fonts`, `next/font/local`): Bricolage Grotesque (display), Inter (body), JetBrains Mono (labels).

## 4. Decisions already made (don't reopen without asking)
- **Palette:** Light = cool white-blue bg `#f3f9fd`, light-blue surface `#dcedf9`, **orange** accent `#ff7a1a` (text-safe `#c2500a`), blue dotted pattern + soft orange/blue glows. Dark = **neutral dark grey** `#1a1a1a` (elevated `#242424`) + orange `#ff8a2b`, **blue** dots. I disliked the original warm ivory/charcoal. Tokens live in `src/styles/globals.css`.
- **Hero:** desktop 2 columns (name in 2 lines + title + tagline + CTAs left; 3D character right inside a bold 3px orange ring with glow; blue spotlight behind him in dark mode); mobile stacked. Intro animation is **subtle** (short camera glide, small turn) — I disliked a big spinning fly-in.
- **Navbar:** always visible (**never hides on scroll**), translucent blur glass (`.nav-glass`), my photo avatar, section links with active underline, ⚡ performance toggle + theme toggle + Ctrl+K command palette; mobile = full-screen menu with big numbered links. Nav links are NOT magnetic (only hero CTA buttons, max 7px).
- **About:** my real photo (large, sticky) + 4-stage story (Student → Developer → AI Explorer → Creative Builder). **Skills:** category tabs, no percentage bars. **Education:** timeline using my exact real data.
- **Projects (Phase 7):** Resume Nova (flagship, layered screenshot stack, forest-green identity), MediMart (role-first, green/yellow), PassportAI (replayable pipeline demo, blue), Document Setter (small "in development" teaser). Each has "Open case study" + screenshot lightbox. **None are live / on GitHub yet** → buttons say "Coming soon". URLs go in `src/data/projects.ts` → `links: { live, github }`.
- **Ask Farhan (Phase 8):** floating assistant, Groq model `openai/gpt-oss-20b` through `src/app/api/chat/route.ts` (key server-side only). Answers about me ONLY from `src/lib/ask/knowledge.ts` (auto-built from `src/data/*`); can also answer general technical/career questions; tone adapts (professional by default, friendly only if the visitor is). If Groq fails/no key → offline answers from the same data. I want it useful beyond friendly/funny chat.
- **3D:** my Meshy-generated static GLB (no rig). Files: `public/models/farhan.glb` (1.8 MB, WebP q96 + meshopt, NO mesh simplification) and `farhan-lite.glb` (only used in Performance Mode). **Quality is a must-keep priority** on laptop AND phone. Tuned render settings (found by A/B renders — keep them): `NeutralToneMapping`, calm lights (key 1.5, orange rim 1.4, fill 0.9, soft env), supersampled rendering starting at dpr 2 with `PerformanceMonitor` stepping down to ≥1.25 only if fps drops, anisotropy 16. (The old ACES + strong orange lights washed out the face and stained the nose.) Known limit: the face is a small area of the texture atlas, so extreme close-ups stay soft.
- **Loader** shows real progress (fonts + model download). **Reduced-motion** and **Performance Mode** (`data-perf="reduced"`) are respected everywhere.

## 5. Architecture (key files)
- `src/app/layout.tsx` (fonts, providers, Loader, CustomCursor, NavShell, AskFarhan), `src/app/page.tsx` (section order), `src/app/api/chat/route.ts`.
- `src/data/*` = single source of truth: `profile.ts` (**email/socials/availability are still PLACEHOLDERS**), `projects.ts`, `skills.ts`, `education.ts`, `about.ts`, `nav.ts`, `achievements.ts` (**empty — ask me, never invent**), `types.ts`.
- `src/lib/loadStore.ts`: tiny global store (`useSyncExternalStore`) shared by Loader, Hero, 3D scene, AI (`ready`, `aiOpen`, `ai: idle|thinking|speaking`).
- `src/three/*`: `Scene.tsx`, `FarhanModel/`, `CameraController/`, `Environment/Lighting.tsx`, `interactions/useIntro.ts`, `loaders/`. 3D chunk is lazy (`HeroStage` → `next/dynamic`, `ssr:false`) with WebGL check + photo fallback.
- `src/animations/*` (`gsap.ts` registers plugins, `scroll.ts` = eased anchor scroll, `hero.ts`), `src/components/{hero,about,skills,education,projects,ai,navigation,common,cursor}`.
- Sections: `#top`, `#work`, `#about`, `#skills`, `#education`, `#resume` (placeholder), `#contact` (placeholder). Placeholders use `SectionShell`.

## 6. Hard-won gotchas (these already cost hours — don't repeat)
1. **GSAP + React StrictMode (dev):** never `gsap.from()` in effects (animates invisible→invisible after the double-run). Use `gsap.fromTo` + `clearProps` in cleanup. `gsap.ticker.lagSmoothing(0)` is set.
2. Don't mix GSAP transforms with CSS `transform`/percent translate on the same element — put `x:0,y:0` in tweens or use separate wrapper elements.
3. **Tailwind v4:** unlayered custom CSS (e.g. `.glass`) beats utility classes → use a dedicated class or inline style.
4. R3F does **not** bridge React context into `<Canvas>` → read hooks outside, pass props in.
5. drei imports are per-module (`@react-three/drei/core/Gltf`, etc.) and `three` uses named imports — faster dev compile. `useGLTF(url, false, true)` = meshopt, no Draco CDN.
6. Google Fonts fetch times out on my network → fonts are local. Keep it that way.
7. Next Image optimizer is slow on first request → lightbox uses `unoptimized`.
8. HTTP header values must be ASCII. Collapsed panels use the `inert` attribute.
9. Page-length matters to me. Desktop heights now: whole page ≈ 8,750px (Work 3,145 · About 1,744 · Education 1,315). Keep the final page ≲ 9,000px desktop; measure after adding Resume/Contact.

## 7. FIX FIRST (before Phase 9)
1. **Ask Farhan showed `POST /api/chat 502` on my machine.** The latest code (in the zip) no longer errors: if Groq fails it answers in offline mode and logs the real reason. Ask me to: (a) restart `npm run dev`; (b) open `http://localhost:3000/api/chat` (should show `"configured":true`); (c) ask the assistant something and **paste the terminal line starting with `[ask-farhan]`** (or the dev-only note in the chat panel). Likely causes: 401 key typo/quotes/spaces in `.env.local`, 404 model not enabled on my Groq account, 403/unreachable = my ISP/region blocking `api.groq.com` (then discuss a VPN or another OpenAI-compatible provider via `GROQ_BASE_URL`). Don't guess — get the log. `.env.local` needs `GROQ_API_KEY=…` and `GROQ_MODEL=openai/gpt-oss-20b`; Vercel needs the same two env vars (never `NEXT_PUBLIC_`).
2. My terminal also printed `[browser] ⨯ unhandledRejection: Error: Window message "chrome: call method" timed out`. That comes from the Chrome/DevTools/extension bridge, not our code. Verify in an incognito window with extensions off; ignore if it disappears.
3. Keep page height in check (see §6.9).

## 8. Roadmap for you (Phases 9 → 16)
- **9 Resume + Achievements:** interactive resume section (built from `src/data/*`) + PDF download (put the PDF in `/public`); achievements showcase from `achievements.ts`. **Ask me for:** my resume PDF and real achievements/certificates. Replace the `#resume` placeholder in `page.tsx`.
- **10 Contact:** contact UI with mailto/Gmail-compose fallback (no backend needed), copy-email, socials. **Ask me for:** public email, GitHub/LinkedIn/Fiverr URLs, availability wording. Then update `profile.ts`, and update the "Not published yet" text in `src/lib/ask/knowledge.ts` and the availability answer in `src/lib/ask/local.ts`.
- **11 Advanced motion** (scroll-driven camera, procedural character reactions, subtle environment motion) — subtle, performance-safe.
- **12 Mobile + performance** audit (real phone behaviour, touch, lazy loading, asset sizes). **13 Accessibility + SEO** (metadata, OG image, sitemap/robots, JSON-LD Person, `not-found`/`error` pages, keyboard/focus). **14 Testing. 15 Final polish** (sound optional, muted by default). **16 Production** (Vercel build, env vars, domain, audit).
- Also still open: my project links (`projects.ts`), real social links/email, achievements.

## 9. Testing playbook (if you have a Linux sandbox)
- Playwright Chromium works. For UI tests launch with WebGL off (`--disable-gpu --disable-webgl --disable-3d-apis`) → 3D falls back to my photo; software-GL renders of the real 3D page are extremely slow, so verify 3D with a standalone three.js page that loads the GLB.
- Use `next build` + `next start` for realistic tests. Start server and run tests **in one command** (background processes die between commands). **Never `pkill -f "<pattern in your own command>"`** (kills your shell) — kill by PID. Stale `next start` processes on old ports serve deleted chunks → the loader never exits (looks like a bug, isn't).
- Groq isn't reachable from the sandbox → test the route with a mock SSE server (include `delta.reasoning` chunks, 400/401/404/429/500 cases).
- Playwright won't click `aria-disabled` buttons without `force=True`. Measure section heights with `getBoundingClientRect` after changes.

## 10. Your first reply to me should
1. Confirm in ≤8 lines what's done / what's next.
2. Ask me for the **§7.1 terminal log**, and the Phase 9–10 inputs (resume PDF, achievements, email, socials, availability, project links).
3. Then wait for my answers before building.
