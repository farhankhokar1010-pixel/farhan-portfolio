"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { DirectionalLight } from "three";
import { Environment } from "@react-three/drei/core/Environment";
import { Lightformer } from "@react-three/drei/core/Lightformer";

/**
 * Procedural studio lighting (no HDR download).
 * Tuned against the real model: calm, neutral fill so the baked skin/fabric colours survive tone-mapping,
 * with the brand orange kept as a gentle edge-light only (a strong orange env/rim stains the skin).
 */
export function Lighting({ dark, reducedMotion = false }: { dark: boolean; reducedMotion?: boolean }) {
  const k = dark ? 0.85 : 1;
  const rim = useRef<DirectionalLight>(null);
  const sky = useRef<DirectionalLight>(null);
  // Living light: the orange rim and blue fill drift very slowly, so edges and cloth catch light differently over time.
  useFrame(({ clock }) => {
    if (reducedMotion) return;
    const t = clock.elapsedTime;
    rim.current?.position.set(-3 + Math.sin(t * 0.5) * 1.6, 2.2 + Math.sin(t * 0.35) * 0.5, -2.5 + Math.cos(t * 0.4) * 0.8);
    sky.current?.position.set(-2.8 + Math.cos(t * 0.42) * 1.6, 1.4 + Math.sin(t * 0.3) * 0.4, 2.4 + Math.sin(t * 0.5) * 0.6);
  });
  return (
    <>
      <ambientLight intensity={0.25 * k} />
      <directionalLight position={[2.5, 3.5, 3]} intensity={1.5 * k} color="#fff4e8" />
      <directionalLight ref={rim} position={[-3, 2.2, -2.5]} intensity={1.4} color="#ff8a2b" />
      <directionalLight ref={sky} position={[-2.8, 1.4, 2.4]} intensity={0.9} color="#9fd3f2" />

      {/* Rendered once into a cubemap (frames=1) → cheap image-based light. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={1.1 * k} color="#ffffff" position={[0, 4, 3]} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={0.4} color="#ffe6cf" position={[-5, 1.5, -2]} scale={[4, 6, 1]} />
        <Lightformer form="rect" intensity={0.35} color="#a9dbf7" position={[5, 1.5, 1]} scale={[3, 6, 1]} />
      </Environment>
    </>
  );
}
