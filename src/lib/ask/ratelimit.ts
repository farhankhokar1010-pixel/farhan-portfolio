/** Small in-memory limiter: N requests per window per IP. (Per server instance — a sensible guard, not a firewall.) */
const hits = new Map<string, { count: number; reset: number }>();
const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

export function checkRate(ip: string): { ok: true } | { ok: false; retryAfter: number } {
  const now = Date.now();
  if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
  const h = hits.get(ip);
  if (!h || h.reset < now) { hits.set(ip, { count: 1, reset: now + WINDOW_MS }); return { ok: true }; }
  if (h.count >= LIMIT) return { ok: false, retryAfter: Math.ceil((h.reset - now) / 1000) };
  h.count += 1;
  return { ok: true };
}
