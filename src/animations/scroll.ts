import { gsap, prefersReducedMotion } from "./gsap";

/** Eased scroll to a section id; instant when the user prefers reduced motion. */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const instant = prefersReducedMotion();
  gsap.to(window, {
    scrollTo: { y: id === "top" ? 0 : el, offsetY: 0, autoKill: true },
    duration: instant ? 0 : 1.1,
    ease: "power3.inOut",
    overwrite: true,
  });
  history.replaceState(null, "", id === "top" ? location.pathname : `#${id}`);
}
