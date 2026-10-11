# Deploy to Vercel — step by step

## 0. Before you deploy
1. `npm run build` locally must finish with no errors (it does in my tests).
2. Optional but recommended: `npm start` then `node scripts/smoke.mjs` (all PASS).
3. Fill what is still empty in `src/data/profile.ts` (Fiverr link, `availability`) and the project links in `src/data/projects.ts` (`links: { live, github }`). Buttons say "Coming soon" until you do.

## 1. Put the code on GitHub
- Create a **private or public** repo (e.g. `portfolio`) under your GitHub account and push the project.
- `.env.local` is already in `.gitignore` — never commit it. Your Groq key must only live in Vercel.

## 2. Import in Vercel
- vercel.com → **Add New → Project** → pick the repo. Framework is detected as **Next.js**; leave Build/Output/Install commands as they are (do NOT change the `dev` script — Vercel only runs `build`).

## 3. Environment variables (Project → Settings → Environment Variables)
| Name | Value | Notes |
|---|---|---|
| `GROQ_API_KEY` | your key | Server-only. Never prefix with `NEXT_PUBLIC_`. |
| `GROQ_MODEL` | `openai/gpt-oss-20b` | |
| `NEXT_PUBLIC_SITE_URL` | `https://your-domain.com` | Used for canonical links, share image, sitemap. Add after you have the domain; until then Vercel's URL is used automatically. |

Tick Production + Preview. Redeploy after changing variables.

## 4. Domain
- Project → **Settings → Domains → Add**. Follow Vercel's DNS instructions at your registrar (A record / CNAME). HTTPS is automatic.
- Then set `NEXT_PUBLIC_SITE_URL` to that domain and redeploy.

## 5. Verify the live site (10 minutes)
1. `node scripts/smoke.mjs https://your-domain.com` → all PASS (the secret-leak check only runs if `GROQ_API_KEY` is in your local `.env.local`).
2. Open `https://your-domain.com/api/chat` → shows `"configured":true`.
3. Ask Farhan a question → answer streams (header `X-Ask-Source: groq`; if it says offline, check the Vercel function logs for a line starting `[ask-farhan]`).
4. On your **real phone**: loader finishes, 3D hero looks sharp, scrolling is smooth, menu opens, contact buttons open WhatsApp/Gmail, certificate lightbox works, form fields don't zoom the page. If it stutters, turn on ⚡ Performance Mode and tell me the phone model.
5. Share the link in WhatsApp/LinkedIn to check the preview image (LinkedIn Post Inspector, Facebook Sharing Debugger refresh stale previews).
6. Google Search Console → add the domain → submit `https://your-domain.com/sitemap.xml`.

## 6. If something breaks
- Vercel → Deployments → pick the last good one → **Promote / Instant Rollback**.
- Groq key leaked or misused? Create a new key in the Groq console, update `GROQ_API_KEY` in Vercel, redeploy, delete the old key.

## Notes
- Static files in `/public` (3D model, images, PDF) are cached for a week by `next.config.ts`. If you replace one under the same name, rename it or wait/purge.
- The chat route limits message size/count and requests per visitor, and refuses other origins. Rate limiting is per server instance (best effort).
- A strict Content-Security-Policy is intentionally not set (the inline theme script, JSON-LD and 3D decoder would each need exceptions; a wrong CSP silently breaks the hero). Ask me if you want one added and tested on a real GPU.
