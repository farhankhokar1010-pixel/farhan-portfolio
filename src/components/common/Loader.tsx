"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";
import { loadStore, useLoadState } from "@/lib/loadStore";
import { profile } from "@/data/profile";

const STAGES: Array<[number, string]> = [
  [25, "Initializing experience"],
  [50, "Loading personal profile"],
  [85, "Loading 3D environment"],
  [100, "Loading projects"],
];

/**
 * Progress is REAL: app init (10) + fonts (15) + 3D model download (75).
 * If everything is already cached it exits immediately — no artificial wait.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const load = useLoadState();
  const [shown, setShown] = useState(0);
  const [visible, setVisible] = useState(true);
  const disp = useRef({ v: 0 });
  const exiting = useRef(false);

  // App init + fonts + safety timeout.
  useEffect(() => {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.loading = "true";
    document.fonts.ready.then(() => loadStore.set({ fontsDone: true }));
    // Error / 404 pages have no 3D stage, so there is no model to wait for.
    if (window.location.pathname !== "/") loadStore.set({ modelDone: true, modelProgress: 100 });
    const bail = window.setTimeout(() => loadStore.set({ modelDone: true, fontsDone: true }), 20000);
    return () => window.clearTimeout(bail);
  }, []);

  const target = 10 + (load.fontsDone ? 15 : 0) + (load.modelDone ? 75 : (load.modelProgress / 100) * 75);

  useEffect(() => {
    const tween = gsap.to(disp.current, {
      v: target,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => {
        setShown(disp.current.v);
        if (bar.current) bar.current.style.transform = `scaleX(${disp.current.v / 100})`;
      },
      onComplete: () => {
        if (disp.current.v >= 99.9 && load.modelDone && load.fontsDone) finish();
      },
    });
    return () => { tween.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, load.modelDone, load.fontsDone]);

  function finish() {
    if (exiting.current || !root.current) return;
    exiting.current = true;
    const reduced = prefersReducedMotion();
    const done = () => {
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.loading;
      loadStore.set({ ready: true });
      setVisible(false);
    };
    if (reduced) return done();
    gsap
      .timeline({ delay: 0.35, onComplete: done })
      .to(root.current.querySelectorAll("[data-load-fade]"), { autoAlpha: 0, y: -16, duration: 0.45, stagger: 0.05, ease: "power2.in" })
      .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 0.95, ease: "power4.inOut" }, "-=0.1");
  }

  if (!visible) return null;
  const done = shown >= 99.9 && load.modelDone && load.fontsDone;
  const label = done ? "System ready" : (STAGES.find(([max]) => shown <= max) ?? STAGES[3])[1];

  return (
    <div
      ref={root}
      id="loader"
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg p-6 sm:p-12"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <noscript><style>{"#loader{display:none!important}"}</style></noscript>
      <div data-load-fade className="flex items-start justify-between">
        <span className="label">{profile.name}</span>
        <span className="label text-accent-text">{label}</span>
      </div>

      <div data-load-fade className="flex flex-col gap-3">
        <div className="font-display text-[22vw] font-semibold leading-none tracking-tight tabular-nums sm:text-[14vw]">
          {Math.round(shown)}
          <span className="text-accent">%</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-line">
        <div ref={bar} className="h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
