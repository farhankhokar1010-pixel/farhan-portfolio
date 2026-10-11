"use client";
import { useEffect, useRef } from "react";

export interface PointerState {
  /** Normalised -1..1 (left→right). Read inside useFrame / rAF — no re-renders. */
  x: number;
  /** Normalised -1..1 (bottom→top). */
  y: number;
}

/**
 * Tracks the pointer in a ref so 3D/animation loops can read it every frame
 * without triggering React renders. Touch pointers are tracked too, which
 * lets the same value drive character reactions on mobile.
 */
export function useMousePosition() {
  const pointer = useRef<PointerState>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return pointer;
}
