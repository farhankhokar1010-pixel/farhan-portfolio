"use client";

import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { NeutralToneMapping } from "three";
import { ContactShadows } from "@react-three/drei/core/ContactShadows";
import { PerformanceMonitor } from "@react-three/drei/core/PerformanceMonitor";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useHeroScroll } from "@/hooks/useHeroScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { usePreferences } from "@/components/common/PreferencesProvider";
import { CAMERA, MODEL_LITE_URL, MODEL_URL } from "./config";
import { FarhanModel } from "./FarhanModel/FarhanModel";
import { CameraRig } from "./CameraController/CameraRig";
import { Lighting } from "./Environment/Lighting";
import { ProgressReporter } from "./loaders/ProgressReporter";

/**
 * R3F does not bridge React context into <Canvas>, so every preference is read here
 * and handed down as plain props.
 */
export default function Scene({ active }: { active: boolean }) {
  const pointer = useMousePosition();
  const scroll = useHeroScroll();
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const { isReduced } = usePerformanceMode();
  const { theme } = usePreferences();

  // Full-quality model everywhere; the lighter file is only for performance mode.
  const url = isReduced ? MODEL_LITE_URL : MODEL_URL;
  // Start sharp (2× supersampling, even on 1× laptop screens) and only step down — never below 1.25× — if the frame rate really drops.
  const [dpr, setDpr] = useState(2);

  return (
    <>
      <Canvas
        frameloop={active ? "always" : "never"}  // pause when scrolled out of view
        dpr={isReduced ? 1 : dpr}
        camera={{ fov: CAMERA.fov, position: [...CAMERA.desktop.position], near: 0.1, far: 50 }}
        gl={{ antialias: !isReduced, alpha: true, powerPreference: "high-performance", toneMapping: NeutralToneMapping }}
        // Neutral tone-mapping keeps the model's true skin and fabric colours (the default ACES washed out the face).
        onCreated={({ gl }) => { gl.toneMapping = NeutralToneMapping; gl.toneMappingExposure = 1; }}
        aria-label="Interactive 3D model of Muhammad Farhan. Drag to rotate."
      >
        <Suspense fallback={null}>
          <Lighting dark={theme === "dark"} reducedMotion={reducedMotion} />
          <FarhanModel url={url} pointer={pointer} scroll={scroll} isMobile={isMobile} reducedMotion={reducedMotion} />
          {!isReduced && (
            <ContactShadows position={[0, 0.001, 0]} opacity={0.4} scale={5} blur={2.6} far={1.6} resolution={512} frames={1} />
          )}
        </Suspense>
        {!isReduced && <PerformanceMonitor onChange={({ factor }) => setDpr(Math.round((1.25 + 0.75 * factor) * 20) / 20)} />}
        <CameraRig pointer={pointer} scroll={scroll} isMobile={isMobile} reducedMotion={reducedMotion} />
      </Canvas>
      <ProgressReporter />
    </>
  );
}
