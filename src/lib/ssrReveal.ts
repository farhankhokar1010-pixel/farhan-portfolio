/**
 * On a very slow connection the static page is revealed (by CSS alone) while JavaScript is still downloading, so the visitor
 * never stares at a frozen loader. When JavaScript finally arrives it must NOT hide and re-animate what is already on screen.
 * Call before anything sets data-loading.
 */
export function ssrRevealed(): boolean {
  if (typeof document === "undefined") return false;
  const d = document.documentElement;
  if (d.dataset.ssrReveal === "1") return true;
  if (d.dataset.loading) return false;
  const el = document.getElementById("loader");
  if (!el) return false;
  const cs = getComputedStyle(el);
  const gone = cs.visibility === "hidden" || parseFloat(cs.opacity) < 1;
  if (gone) d.dataset.ssrReveal = "1";
  return gone;
}
