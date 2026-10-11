"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/cn";
import { CaseStudy } from "./CaseStudy";
import { useLightbox } from "./Lightbox";
import { ProjectLinks } from "./ProjectLinks";
import { ScreenFrame } from "./ScreenFrame";

const project = getProject("resume-nova");

// Depth slots: 0 = front, 1/2 = fanned behind it.
const SLOTS = [
  { xPercent: 0, yPercent: 0, scale: 1, opacity: 1, zIndex: 30 },
  { xPercent: 11, yPercent: -14, scale: 0.93, opacity: 0.95, zIndex: 20 },
  { xPercent: 22, yPercent: -28, scale: 0.86, opacity: 0.9, zIndex: 10 },
];

const STATS: Array<[string, string]> = [
  ["8", "AI writing & analysis actions"],
  ["2", "Documents from one profile"],
  ["1:1", "Live preview matches the PDF"],
  ["SQL → PG", "SQLite locally, PostgreSQL-ready"],
];

/** Flagship: layered, depth-stacked product screens in the product's own forest-green identity. */
export function ResumeNovaShowcase() {
  const { open } = useLightbox();
  const stage = useRef<HTMLDivElement>(null);
  const frames = useRef<Array<HTMLDivElement | null>>([]);
  const [order, setOrder] = useState([0, 1, 2]); // order[slot] = screen index

  useEffect(() => {
    const d = prefersReducedMotion() ? 0 : 0.9;
    frames.current.forEach((el, s) => {
      if (el) gsap.to(el, { x: 0, y: 0, ...SLOTS[order.indexOf(s)], duration: d, ease: "power4.out", overwrite: true });
    });
  }, [order]);

  // Gentle pointer-driven tilt of the whole stack.
  useEffect(() => {
    const el = stage.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    gsap.set(el, { transformPerspective: 1400 });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3.out" });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      if (b.bottom < 0 || b.top > window.innerHeight) return;
      ry(((e.clientX - (b.left + b.width / 2)) / b.width) * 7);
      rx((-(e.clientY - (b.top + b.height / 2)) / b.height) * 5);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const pick = (s: number) => {
    if (order.indexOf(s) === 0) open(project.screens, s);
    else setOrder([s, ...order.filter((x) => x !== s)]);
  };

  const vars = {
    "--p-ink": "#f4efe4", "--p-accent": "#5fc08c", "--p-accent-text": "#8fe0b3", "--p-on": "#0d2a20", "--p-line": "rgba(244,239,228,0.22)",
    background: "radial-gradient(120% 90% at 85% 0%, #1f6a4b 0%, transparent 55%), linear-gradient(135deg, #0d2a20, #123826 60%, #17402f)",
  } as React.CSSProperties;

  return (
    <article id="resume-nova" style={vars} className="relative overflow-hidden rounded-[2rem] p-5 text-[color:var(--p-ink)] sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10 [&>*]:min-w-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--p-accent-text)]">{project.index} · Flagship</span>
            <span className="rounded-full border border-[color:var(--p-line)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest">Built · online soon</span>
          </div>
          <h3 className="text-5xl leading-none tracking-tight sm:text-6xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            Resume <em className="text-[color:var(--p-accent)]">Nova</em>
          </h3>
          <p className="text-xl leading-snug sm:text-2xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{project.tagline}</p>
          <p className="max-w-xl opacity-85">{project.summary}</p>
          <ProjectLinks project={project} />
        </div>

        <div className="flex flex-col gap-6">
          {/* Layered stack */}
          <div ref={stage} className="relative aspect-[1/0.66] w-full" style={{ transformStyle: "preserve-3d" }}>
            {project.screens.map((s, i) => (
              <div
                key={s.src}
                ref={(el) => { frames.current[i] = el; }}
                className="absolute bottom-0 left-0 w-[80%] origin-bottom-left"
                style={{ transform: `translate(${SLOTS[i].xPercent}%, ${SLOTS[i].yPercent}%) scale(${SLOTS[i].scale})`, zIndex: SLOTS[i].zIndex, opacity: SLOTS[i].opacity }}
              >
                <ScreenFrame screen={s} onClick={() => pick(i)} sizes="(min-width: 1024px) 560px, 80vw" label={order.indexOf(i) === 0 ? "ZOOM" : "FRONT"} />
              </div>
            ))}
          </div>

          <div role="group" aria-label="Choose screen" className="flex flex-wrap gap-2">
            {project.screens.map((s, i) => (
              <button
                key={s.src}
                type="button"
                aria-pressed={order[0] === i}
                onClick={() => setOrder([i, ...order.filter((x) => x !== i)])}
                data-cursor="button"
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors",
                  order[0] === i ? "border-transparent bg-[color:var(--p-accent)] font-medium text-[color:var(--p-on)]" : "border-[color:var(--p-line)] hover:border-[color:var(--p-accent)]",
                )}
              >
                {s.caption}
              </button>
            ))}
          </div>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-[color:var(--p-line)] pt-6 lg:grid-cols-4">
        {STATS.map(([v, l]) => (
          <div key={l}>
            <dt className="text-3xl text-[color:var(--p-accent)] sm:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{v}</dt>
            <dd className="mt-1 text-sm opacity-80">{l}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6"><CaseStudy project={project} /></div>
    </article>
  );
}
