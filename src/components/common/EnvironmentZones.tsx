"use client";
import { useEffect } from "react";

const ZONES: Record<string, "a" | "b" | "c"> = {
  top: "a", work: "a",
  about: "b", skills: "b", education: "b",
  resume: "c", certificates: "c", contact: "c",
};

/** Sets <html data-zone> from the section nearest the middle of the screen; CSS eases the background glows. */
export function EnvironmentZones() {
  useEffect(() => {
    const root = document.documentElement;
    const els = Object.keys(ZONES).map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) root.dataset.zone = ZONES[e.target.id];
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => { io.disconnect(); delete root.dataset.zone; };
  }, []);
  return null;
}
