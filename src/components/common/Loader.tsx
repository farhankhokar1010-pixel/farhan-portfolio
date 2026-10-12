"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";
import { loadStore, useLoadState } from "@/lib/loadStore";
import { profile } from "@/data/profile";
import { ssrRevealed } from "@/lib/ssrReveal";

const STAGES: Array<[number, string]> = [
  [30, "Initializing experience"],
  [60, "Loading personal profile"],
  [95, "Preparing portfolio"],
  [100, "Almost there"],
];

/**
 * Progress is REAL: app init (10) + fonts (40) + hero photo (50). The 3D model is NOT part of it — it streams in behind
 * the finished page — so the loader is short on any connection and never leaves a blank screen. Fonts are capped at 2.5 s and the whole loader at 4.5 s, and if JavaScript itself is slow the static page is revealed by CSS after 3 s.
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
    // Slow link: the page was already revealed by CSS while JS downloaded. Finish quietly, no second intro.
    if (ssrRevealed()) {
      loadStore.set({ fontsDone: true, posterDone: true, ready: true });
      setVisible(false);
      return;
    }
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.loading = "true";
    document.fonts.ready.then(() => loadStore.set({ fontsDone: true }));
    // Error / 404 pages have no hero photo to wait for.
    if (window.location.pathname !== "/") loadStore.set({ posterDone: true });
    // Fonts may never hold the loader for long (the page swaps them in when they arrive); the hero photo gets a little longer.
    const fontsBail = window.setTimeout(() => loadStore.set({ fontsDone: true }), 2500);
    const bail = window.setTimeout(() => loadStore.set({ posterDone: true, fontsDone: true }), 4500);
    return () => { window.clearTimeout(bail); window.clearTimeout(fontsBail); };
  }, []);

  const target = 10 + (load.fontsDone ? 40 : 0) + (load.posterDone ? 50 : 0);

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
        if (disp.current.v >= 99.9 && load.posterDone && load.fontsDone) finish();
      },
    });
    return () => { tween.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, load.posterDone, load.fontsDone]);

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
  const done = shown >= 99.9 && load.posterDone && load.fontsDone;
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
        <div ref={bar} className="loader-bar h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
