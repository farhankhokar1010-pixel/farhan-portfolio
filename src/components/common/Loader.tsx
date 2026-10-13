"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";
import { loadStore, useLoadState } from "@/lib/loadStore";
import { profile } from "@/data/profile";
import { ssrRevealed } from "@/lib/ssrReveal";

const STAGES: Array<[number, string]> = [
  [25, "Initializing experience"],
  [45, "Loading 3D engine"],
  [90, "Loading 3D character"],
  [99, "Preparing scene"],
  [100, "Almost there"],
];
const GIVE_UP_MS = 45000; // a connection this slow: show the page anyway, let the 3D arrive when it can

/**
 * Progress is REAL and the page appears WITH the model: app (8) + fonts (7) + 3D engine code (20) + model download (55) +
 * first frames drawn off-screen (10). Behind the loader the 3D is already warmed up, so the reveal is smooth and the character
 * is there from the first frame. If 3D can't be used (no WebGL, data-saver, error) it skips straight to the photo; and after
 * 45 s the page is shown anyway and the 3D fades in later.
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
      loadStore.set({ fontsDone: true, posterDone: true, forced: true, ready: true });
      setVisible(false);
      return;
    }
    history.scrollRestoration = "manual";
    disp.current.v = 8; // the CSS-only count + bar already creep up to 8 before JS arrives; continue from there
    setShown(8);
    window.scrollTo(0, 0);
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.loading = "true";
    document.fonts.ready.then(() => loadStore.set({ fontsDone: true }));
    // Error / 404 pages have no 3D stage.
    if (window.location.pathname !== "/") loadStore.set({ posterDone: true, threeSkipped: true });
    // Fonts never hold the loader for long (the page swaps them in when they arrive).
    const fontsBail = window.setTimeout(() => loadStore.set({ fontsDone: true }), 2500);
    const bail = window.setTimeout(() => loadStore.set({ forced: true, fontsDone: true }), GIVE_UP_MS);
    return () => { window.clearTimeout(bail); window.clearTimeout(fontsBail); };
  }, []);

  const threeShare = load.threeSkipped
    ? (load.posterDone ? 85 : 0)
    : (load.codeDone ? 20 : 0) + 55 * (load.modelProgress / 100) + (load.sceneVisible ? 10 : 0);
  const complete = load.forced || (load.fontsDone && (load.threeSkipped ? load.posterDone : load.sceneVisible));
  const target = complete ? 100 : Math.min(99, 8 + (load.fontsDone ? 7 : 0) + threeShare);

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
        if (disp.current.v >= 99.9 && complete) finish();
      },
    });
    return () => { tween.kill(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, complete]);

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
  const done = shown >= 99.9 && complete;
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
        <div className="loader-digits font-display text-[22vw] font-semibold leading-none tracking-tight tabular-nums sm:text-[14vw]">
          <span className="loader-int">{Math.round(shown)}</span>
          <span className="text-accent">%</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-line">
        <div ref={bar} className="loader-bar h-full origin-left bg-accent" style={{ transform: "scaleX(0)" }} />
      </div>
    </div>
  );
}
