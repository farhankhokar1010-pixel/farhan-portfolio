# Fix 3 — model WITH the page, tiny images, honest loader (apply over the project)

This zip is CUMULATIVE (contains the earlier optimisation files too), so apply just this one.
1. Unzip over your project folder (overwrite).
2. Delete by hand if still there: `public/models/farhan-lite.glb`, `src/three/loaders/ProgressReporter.tsx`, `src/three/loaders/PhotoFallback.tsx`.
3. GitHub Desktop → commit "Model with page + tiny images" → Push origin. Vercel redeploys (~2 min).
   (If Vercel again says "Git information retrieval failed", press Redeploy once.)
4. Vercel → Settings → Environment Variables: `NEXT_PUBLIC_SITE_URL` = `https://farhan-portfolio-3d.vercel.app` (if not added yet) → Redeploy.

What you should see now
- Loader counts 8% → 100% with real steps (3D engine → 3D character → scene), then the page opens WITH the character in the ring. No photo placeholder.
- Phones/slow links download a 175 KB model (was 1.8 MB); laptops 515 KB.
- Every picture on the page is ≤ 20 KB; full-size versions load only when you click a picture to enlarge it.
- If 3D cannot run (old phone / data-saver) the photo is shown instead, with a button to load 3D.
