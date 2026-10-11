"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";

const MAX_PULL = 7; // px — never drifts far from its slot

/** A small, bounded pull toward the pointer. Only for big call-to-action buttons. */
export function Magnetic({ children, strength = 0.2, className = "" }: { children: React.ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    const x = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
    const y = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
    const clamp = (v: number) => Math.max(-MAX_PULL, Math.min(MAX_PULL, v));
    const reset = () => { x(0); y(0); };

    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const dx = e.clientX - (b.left + b.width / 2);
      const dy = e.clientY - (b.top + b.height / 2);
      const reach = Math.max(b.width, b.height) * 0.6 + 16;
      if (Math.hypot(dx, dy) < reach) { x(clamp(dx * strength)); y(clamp(dy * strength)); }
      else reset();
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", reset, { passive: true }); // page moves under a still pointer
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", reset);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, [strength]);

  return <span ref={ref} className={`inline-block ${className}`}>{children}</span>;
}
