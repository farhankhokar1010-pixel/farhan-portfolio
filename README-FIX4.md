# Fix 4 — ONE sharper model for phone + laptop, new IBM certificate image

Apply: unzip over the project (overwrite), then DELETE by hand `public/models/farhan-mobile.glb` (no longer used).
GitHub Desktop → commit → Push origin → Vercel redeploys (press Redeploy if it says "Git information retrieval failed").

What changed
- `public/models/farhan.glb` (579 KB) is now used on EVERY device. The face keeps its full detail (see proof-A / proof-B).
- IBM certificate uses your new image (lightbox 815x584 + 19 KB card version).
- Code: `src/three/config.ts`, `src/components/hero/HeroStage.tsx` (single model), `scripts/smoke.mjs`, `src/data/achievements.ts`.

Phone download is 579 KB (about 3x the old 175 KB phone model) — on a very slow link the loader takes a little longer, then the page opens with the sharp model.
If you ever want a smaller/larger one, tell me: 452 KB (A) or 750 KB (C) were also built.
