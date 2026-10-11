"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";

/**
 * Fades/lifts its children in once when scrolled into view.
 * Uses fromTo + clearProps on cleanup so React StrictMode's double-run (dev) can't leave it invisible.
 */
export function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const tween = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 36 },
      { autoAlpha: 1, y: 0, duration: 0.9, delay, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(el, { clearProps: "opacity,visibility,transform" });
    };
  }, [delay]);

  return <div ref={ref} className={className}>{children}</div>;
}
