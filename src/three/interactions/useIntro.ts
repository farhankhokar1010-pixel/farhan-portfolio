"use client";
import { useCallback, useRef } from "react";
import { loadStore } from "@/lib/loadStore";

/**
 * Returns a function giving the intro progress (0 → 1, eased) for the cinematic
 * opening. Stays at 0 until the loader exits, so the camera dolly / model turn-in
 * happens in view rather than behind the loader.
 */
export function useIntro(reducedMotion: boolean, duration = 1.6) {
  const start = useRef<number | null>(null);
  return useCallback(
    (elapsed: number) => {
      if (reducedMotion) return 1;
      if (!loadStore.get().ready) return 0;
      if (start.current === null) start.current = elapsed;
      const k = Math.min(1, (elapsed - start.current) / duration);
      return 1 - Math.pow(1 - k, 4);
    },
    [reducedMotion, duration],
  );
}
