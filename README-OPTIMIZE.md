# Slow-network + live-site fixes — how to apply (GitHub Desktop)

1. Unzip over your project folder (same paths, overwrite).
2. Delete these 3 old files by hand (not used any more, harmless if left):
   - `public/models/farhan-lite.glb`
   - `src/three/loaders/ProgressReporter.tsx`
   - `src/three/loaders/PhotoFallback.tsx`
3. GitHub Desktop → you will see the changed files → Commit ("Optimize for slow networks") → **Push origin**. Vercel redeploys by itself (~2 min).
4. Vercel → Settings → Environment Variables → add `NEXT_PUBLIC_SITE_URL` = `https://farhan-portfolio-3d.vercel.app` → Redeploy
   (your live address is different from Vercel's default one, so share/search previews were pointing at the wrong address).
5. After deploy, test on your phone with your normal data:
   - page text + photo appears in a few seconds (even before everything has loaded),
   - small "Loading 3D character · NN%" under it, then the 3D fades in,
   - top bar is frosted glass, PassportAI sizes fit.
   If the 3D does not appear, it now shows WHY under the photo plus a "Try again" button — send me that line.

Optional local check: `npm run build && npm start`, then `node scripts/smoke.mjs`.
