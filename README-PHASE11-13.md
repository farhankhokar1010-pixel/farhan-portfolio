# Phases 11–13 — how to apply
1. Unzip over your project (same paths). No new dependencies, `package.json` untouched.
2. Restart `npm run dev`, hard-refresh (Ctrl+Shift+R).

## Check these on your laptop (I could not see the 3D move)
- Hero: scroll down slowly — camera drifts slightly closer/up, he turns a little toward the content.
- Click/tap him (no drag) — small nod. Move the mouse fast — tiny lean. Light edges drift slowly.
- Rings behind him: dashed one turns slowly, orange one breathes. Performance Mode (⚡) turns these off.
- Scrolling through sections: background glows slowly change corner (Work → About → Resume/Contact).
- Open /anything-wrong → branded 404.
If any motion feels too strong, tell me which and I'll lower it (constants are at the top of each file).

## Production
- On Vercel set `NEXT_PUBLIC_SITE_URL` to your real domain (canonical links, share image, sitemap use it). Until then Vercel's own URL is used; locally it shows localhost (normal).
- Share preview image: `src/app/opengraph-image.png` (1200×630).
