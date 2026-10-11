/**
 * Public site URL used for canonical links, Open Graph and the sitemap.
 * Set NEXT_PUBLIC_SITE_URL on Vercel once the real domain exists; until then Vercel's own production URL is used.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
).replace(/\/$/, "");
