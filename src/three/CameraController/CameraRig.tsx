"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils, Vector3 } from "three";
import type { PointerState } from "@/hooks/useMousePosition";
import { CAMERA } from "../config";
import { useIntro } from "../interactions/useIntro";

interface Props {
  pointer: React.RefObject<PointerState>;
  /** 0 → 1 while the hero scrolls away. */
  scroll: React.RefObject<number>;
  isMobile: boolean;
  reducedMotion: boolean;
}

/** Eases the camera to the framing for the current breakpoint, plus a small pointer parallax. */
export function CameraRig({ pointer, scroll, isMobile, reducedMotion }: Props) {
  const look = useRef(new Vector3());
  const sm = useRef(0); // smoothed scroll progress
  const intro = useIntro(reducedMotion);
  const frame = isMobile ? CAMERA.mobile : CAMERA.desktop;

  useFrame(({ camera, clock }, delta) => {
    sm.current = MathUtils.damp(sm.current, reducedMotion ? 0 : scroll.current, 4, delta);
    const s = sm.current * sm.current * (3 - 2 * sm.current); // smoothstep
    const e = intro(clock.elapsedTime);        // 0 → 1 once the loader exits
    const dolly = (1 - e) * 0.4;               // short, subtle glide-in
    const parallax = reducedMotion ? 0 : 1;
    // Scrolling away: the camera drifts a little closer, rises and slides toward the content — kept small (the face texture is soft up close).
    const tx = frame.position[0] + pointer.current.x * 0.28 * parallax + s * (isMobile ? 0 : 0.22);
    const ty = frame.position[1] + pointer.current.y * 0.1 * parallax + (1 - e) * 0.06 + s * 0.12;
    camera.position.x = MathUtils.damp(camera.position.x, tx, 3, delta);
    camera.position.y = MathUtils.damp(camera.position.y, ty, 3, delta);
    camera.position.z = MathUtils.damp(camera.position.z, frame.position[2] + dolly - s * 0.3, e < 1 ? 5 : 3, delta);
    look.current.set(frame.lookAt[0] + s * (isMobile ? 0 : 0.1), frame.lookAt[1] + s * 0.1, frame.lookAt[2]);
    camera.lookAt(look.current);
  });

  return null;
}
