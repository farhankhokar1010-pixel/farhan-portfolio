"use client";
import { useEffect, useRef } from "react";

/**
 * 0 → 1 while the hero scrolls out of view (one viewport of scrolling). A ref, not state:
 * the 3D loop reads it every frame without causing React renders.
 */
export function useHeroScroll() {
  const progress = useRef(0);
  useEffect(() => {
    const read = () => {
      const h = Math.max(window.innerHeight, 1);
      progress.current = Math.min(1, Math.max(0, window.scrollY / h));
    };
    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => { window.removeEventListener("scroll", read); window.removeEventListener("resize", read); };
  }, []);
  return progress;
}
