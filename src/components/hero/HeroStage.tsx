"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { StageBoundary } from "@/three/loaders/StageBoundary";
import { PhotoFallback } from "@/three/loaders/PhotoFallback";
import { loadStore } from "@/lib/loadStore";

// three.js stays out of the initial JS bundle.
const Scene = dynamic(() => import("@/three/Scene"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** 3D stage with: WebGL check, error boundary, off-screen pausing and a photo fallback. */
export function HeroStage({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [webgl, setWebgl] = useState<"checking" | "yes" | "no">("checking");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const ok = hasWebGL();
    setWebgl(ok ? "yes" : "no");
    if (!ok) loadStore.set({ modelDone: true, modelProgress: 100 }); // nothing to wait for
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative h-full w-full ${className}`} style={{ containerType: "size" }}>
      {/* Orange ring + soft disc behind the model: gives the dark outfit contrast and a clear focal point. */}
      <div
        aria-hidden
        className="ring-breathe pointer-events-none absolute left-1/2 top-[55%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "min(76cqh, 90cqw)",
          background: "radial-gradient(closest-side, var(--stage-fill), var(--stage-fill-edge))",
          border: "3px solid var(--accent)",
          boxShadow: "0 0 70px 4px var(--ring-glow), inset 0 0 50px var(--ring-glow)",
        }}
      />
      <div
        aria-hidden
        className="ring-drift pointer-events-none absolute left-1/2 top-[55%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: "min(90cqh, 100cqw)", border: "1.5px dashed var(--accent)", opacity: 0.45 }}
      />
      {/* Moving orange + blue light: two soft glows that drift across the stage behind the character. CSS-only (transform), off in Performance Mode. */}
      <div aria-hidden className="hero-lights">
        <span className="hero-light hero-light-a" />
        <span className="hero-light hero-light-b" />
      </div>
      {webgl === "no" ? (
        <PhotoFallback reason="3D isn't supported on this device — showing photo" />
      ) : webgl === "yes" ? (
        <StageBoundary onError={() => loadStore.set({ modelDone: true, modelProgress: 100 })} fallback={<PhotoFallback reason="3D model couldn't load — showing photo" />}>
          <Scene active={visible} />
        </StageBoundary>
      ) : null}
    </div>
  );
}
