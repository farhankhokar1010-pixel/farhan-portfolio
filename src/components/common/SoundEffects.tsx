"use client";
import { useEffect } from "react";
import { play } from "@/lib/sound";

/** A soft tick when a link, button or tab is activated (only when sound is on). */
export function SoundEffects() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (t?.closest('a[href], button, [role="tab"], [role="option"]')) play("tick");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
