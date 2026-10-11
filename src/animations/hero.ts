import { gsap, prefersReducedMotion } from "./gsap";

/** Cinematic hero entrance. Runs once, right after the loader exits. */
export function hideHero(root: HTMLElement) {
  gsap.set(root.querySelectorAll('[data-hero="line"]'), { yPercent: 110 });
  gsap.set(root.querySelectorAll('[data-hero="fade"]'), { autoAlpha: 0, y: 24 });
  gsap.set(root.querySelector('[data-hero="bar"]'), { scaleX: 0, transformOrigin: "left center" });
  gsap.set(root.querySelector('[data-hero="stage"]'), { autoAlpha: 0, scale: 0.96 });
}

export function playHeroIntro(root: HTMLElement) {
  if (prefersReducedMotion()) {
    gsap.set(root.querySelectorAll('[data-hero]'), { clearProps: "all" });
    return gsap.timeline();
  }
  const q = (s: string) => root.querySelectorAll(s);
  return gsap
    .timeline({ defaults: { ease: "power4.out" } })
    .to(root.querySelector('[data-hero="stage"]'), { autoAlpha: 1, scale: 1, duration: 1.3 }, 0)
    .to(q('[data-hero="line"]'), { yPercent: 0, duration: 1.1, stagger: 0.12 }, 0.15)
    .to(root.querySelector('[data-hero="bar"]'), { scaleX: 1, duration: 0.9 }, 0.6)
    .to(q('[data-hero="fade"]'), { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.1 }, 0.5);
}
