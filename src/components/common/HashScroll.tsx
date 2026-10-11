"use client";
import { useEffect, useRef } from "react";
import { useLoadState } from "@/lib/loadStore";

/**
 * Deep links such as /#contact (shared links, the 404 page's nav). The loading screen locks scrolling, so the browser's own
 * jump to the hash is lost; once the site is ready we land on that section ourselves.
 */
export function HashScroll() {
  const { ready } = useLoadState();
  const done = useRef(false);
  useEffect(() => {
    if (!ready || done.current) return;
    done.current = true;
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id || id === "top") return;
    const t = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" as ScrollBehavior });
    }, 120);
    return () => window.clearTimeout(t);
  }, [ready]);
  return null;
}
