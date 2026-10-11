"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";

type State = "default" | "link" | "button" | "drag" | "text";

function stateFor(target: Element | null): { state: State; label: string } {
  if (!target) return { state: "default", label: "" };
  if (target.closest("input, textarea, select, [contenteditable='true']")) return { state: "text", label: "" };
  const tagged = target.closest<HTMLElement>("[data-cursor]");
  const label = target.closest<HTMLElement>("[data-cursor-label]")?.dataset.cursorLabel ?? "";
  if (tagged) return { state: (tagged.dataset.cursor as State) ?? "default", label };
  if (target.closest("button, [role='button']")) return { state: "button", label };
  if (target.closest("a")) return { state: "link", label };
  return { state: "default", label };
}

/** Small elegant cursor: dot + ring. Fine-pointer devices only; touch keeps the native behaviour. */
export function CustomCursor() {
  const root = useRef<HTMLDivElement>(null);
  const follow = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches || !root.current || !follow.current || !ring.current || !label.current || !dot.current) return;

    const el = root.current;
    const r = ring.current;       // visual ring (CSS transitions: size, press)
    const f = follow.current;     // positioner (GSAP x/y only)
    document.documentElement.classList.add("custom-cursor");

    const smooth = prefersReducedMotion() ? 0 : 0.45;
    const rx = gsap.quickTo(f, "x", { duration: smooth, ease: "power3.out" });
    const ry = gsap.quickTo(f, "y", { duration: smooth, ease: "power3.out" });
    const dx = gsap.quickTo(dot.current, "x", { duration: 0.06, ease: "none" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.06, ease: "none" });

    let dragging = false;
    let current: { state: State; label: string } = { state: "default", label: "" };

    const apply = () => {
      const state = dragging ? "drag" : current.state;
      r.dataset.state = state;
      el.dataset.visible = state === "text" ? "false" : "true";
      label.current!.textContent = dragging ? "DRAG" : current.label;
    };

    let last = { x: -1, y: -1 };
    let raf = 0;
    // Content moves under a still pointer when scrolling → re-evaluate what's under it.
    const onScroll = () => {
      if (raf || last.x < 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        current = stateFor(document.elementFromPoint(last.x, last.y));
        apply();
      });
    };

    const move = (e: PointerEvent) => {
      last = { x: e.clientX, y: e.clientY };
      rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY);
      current = stateFor(e.target as Element);
      apply();
    };
    const down = () => { r.dataset.pressed = "true"; if (current.state === "drag") { dragging = true; apply(); } };
    const up = () => { r.dataset.pressed = "false"; dragging = false; apply(); };
    const leave = () => { el.dataset.visible = "false"; };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={root} className="cursor-root" data-visible="false" aria-hidden>
      <div ref={follow} className="cursor-follow">
        <div ref={ring} className="cursor-ring" data-state="default" data-pressed="false">
          <span ref={label} className="cursor-label" />
        </div>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
