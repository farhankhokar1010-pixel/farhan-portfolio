"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/animations/gsap";
import { getProject } from "@/data/projects";
import { cn } from "@/lib/cn";
import { CaseStudy } from "./CaseStudy";
import { useLightbox } from "./Lightbox";
import { ProjectLinks } from "./ProjectLinks";
import { ScreenFrame } from "./ScreenFrame";

const project = getProject("passportai");

const STEPS = [
  "Image upload & init", "Database verification", "Human & face detection", "Pose analysis", "Pose correction & framing",
  "Lighting enhancement", "Background removal", "Face embedding & DB save", "Compression & optimisation", "Complete",
];

// Thumbnails appear when the pipeline reaches the step number in `at`.
const THUMBS = [
  { key: "original", label: "Original", at: 1 },
  { key: "detection", label: "Detection", at: 3 },
  { key: "pose", label: "Pose analysis", at: 4 },
  { key: "corrected", label: "Corrected", at: 5 },
  { key: "lighting", label: "Lighting", at: 6, skipped: true },
  { key: "background", label: "Background", at: 7 },
] as const;

const SIZES: Array<[string, string]> = [["Passport", "413×531 · 300dpi"], ["Full", "1800×2400 · 300dpi"], ["Medium", "900×1200 · 150dpi"], ["Thumbnail", "200×267 · 72dpi"]];

/** Technical, pipeline-first treatment: replayable step-by-step run, in PassportAI's own blue UI. */
export function PassportAIShowcase() {
  const { open } = useLightbox();
  const lab = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const started = useRef(false);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  const run = useCallback(() => {
    window.clearTimeout(timer.current);
    if (prefersReducedMotion()) { setStep(STEPS.length); setRunning(false); return; }
    setRunning(true); setStep(0);
    let n = 0;
    const tick = () => {
      n += 1; setStep(n);
      if (n < STEPS.length) timer.current = window.setTimeout(tick, 650);
      else setRunning(false);
    };
    timer.current = window.setTimeout(tick, 400);
  }, []);

  useEffect(() => {
    const el = lab.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started.current) { started.current = true; run(); } }, { threshold: 0.12 }); // low on purpose: on a phone this block is ~1700px tall, so 35% would almost never be on screen
    io.observe(el);
    return () => { io.disconnect(); window.clearTimeout(timer.current); };
  }, [run]);

  const vars = {
    "--p-ink": "#e8f0ff", "--p-accent": "#4f8cff", "--p-accent-text": "#8db5ff", "--p-on": "#071330", "--p-line": "rgba(232,240,255,0.2)",
    background: "radial-gradient(80% 70% at 0% 0%, rgba(79,140,255,0.35), transparent 60%), linear-gradient(160deg, #081226, #0c1c3d 70%, #102650)",
  } as React.CSSProperties;

  return (
    <article id="passportai" style={vars} className="relative overflow-hidden rounded-[2rem] p-5 text-[color:var(--p-ink)] sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10 [&>*]:min-w-0">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--p-accent-text)]">{project.index} · AI pipeline</span>
            <span className="rounded-full border border-[color:var(--p-line)] px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest">Built · online soon</span>
          </div>
          <h3 className="font-display text-5xl font-semibold tracking-tight sm:text-6xl">Passport<span className="text-[color:var(--p-accent)]">AI</span></h3>
          <p className="font-display text-xl font-medium sm:text-2xl">{project.tagline}</p>
          <p className="max-w-xl opacity-85">{project.summary}</p>
          <ProjectLinks project={project} />
        </div>

        {/* Replayable pipeline */}
        <div ref={lab} className="rounded-3xl border border-[color:var(--p-line)] bg-white/[0.04] p-5 sm:p-7">
          <div className="flex items-center justify-between gap-4">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[color:var(--p-accent-text)]">Pipeline run · {Math.min(step, STEPS.length)}/{STEPS.length}</h4>
            <button
              type="button"
              onClick={run}
              disabled={running}
              data-cursor="button"
              className="rounded-full bg-[color:var(--p-accent)] px-4 py-2 text-sm font-medium text-[color:var(--p-on)] disabled:opacity-50"
            >
              {running ? "Running…" : "↻ Replay"}
            </button>
          </div>
          <div className="mt-4 h-1 overflow-hidden rounded-full bg-[color:var(--p-line)]">
            <div className="h-full origin-left rounded-full bg-[color:var(--p-accent)] transition-transform duration-500" style={{ transform: `scaleX(${step / STEPS.length})` }} />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-[210px_1fr] [&>*]:min-w-0">
            <ol className="flex flex-col gap-1.5" aria-label="Pipeline steps">
              {STEPS.map((s, i) => {
                const done = step > i;
                const active = step === i + 1 && running;
                return (
                  <li key={s} className={cn("flex items-center gap-2 text-sm transition-opacity duration-300", done ? "opacity-100" : "opacity-40")}>
                    <span className={cn("grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.6rem]", done ? "border-transparent bg-[color:var(--p-accent)] text-[color:var(--p-on)]" : "border-[color:var(--p-line)]", active && "animate-pulse")}>
                      {done ? "✓" : i + 1}
                    </span>
                    {s}
                  </li>
                );
              })}
            </ol>

            <div className="flex flex-col gap-4">
              <ul className="grid grid-cols-3 gap-3">
                {THUMBS.map((t) => {
                  const shown = step >= t.at;
                  return (
                    <li key={t.key} className="flex flex-col gap-1">
                      <div className="relative aspect-[160/122] overflow-hidden rounded-xl border border-[color:var(--p-line)] bg-white/5">
                        {shown && !("skipped" in t) && (
                          <Image src={`/images/projects/passportai/pipeline/${t.key}.webp`} alt={`${t.label} step output`} fill sizes="160px" className="lb-in scale-[1.04] object-cover" />
                        )}
                        {shown && "skipped" in t && <span className="lb-in absolute inset-0 grid place-items-center px-2 text-center font-mono text-[0.6rem] opacity-70">Optional — skipped</span>}
                        {!shown && <span className="absolute inset-0 grid place-items-center font-mono text-[0.6rem] opacity-40">pending…</span>}
                      </div>
                      <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-70">{t.label}</span>
                    </li>
                  );
                })}
              </ul>

              <div className="flex flex-col gap-3 min-[480px]:grid min-[480px]:grid-cols-[10rem_minmax(0,1fr)] min-[480px]:items-end min-[480px]:gap-4">
                <div className="relative aspect-[311/400] w-28 overflow-hidden rounded-2xl border border-[color:var(--p-line)] bg-white/5 min-[480px]:w-full">
                  {step >= 9 ? (
                    <Image src="/images/projects/passportai/pipeline/final.webp" alt="Final passport photo with blue background" fill sizes="160px" className="lb-in scale-[1.03] object-cover" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center font-mono text-[0.6rem] opacity-40">final output</span>
                  )}
                </div>
                <ul className="flex min-w-0 flex-col gap-1.5">
                  {SIZES.map(([n, d]) => (
                    <li key={n} className={cn("flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 rounded-lg border border-[color:var(--p-line)] px-3 py-1.5 text-xs transition-opacity duration-500", step >= 10 ? "opacity-100" : "opacity-30")}>
                      <span className="font-medium">{n}</span>
                      <span className="font-mono text-[0.68rem] leading-snug opacity-70 sm:text-xs">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <CaseStudy
          project={project}
          extra={
            <section className="pb-6">
              <h4 className="font-mono text-xs uppercase tracking-widest text-[color:var(--p-accent-text)]">The real interface</h4>
              <ul className="mt-3 grid gap-3 md:grid-cols-3">
                {project.screens.map((sc, i) => (
                  <li key={sc.src}><ScreenFrame screen={sc} onClick={() => open(project.screens, i)} sizes="(min-width: 768px) 33vw, 100vw" /></li>
                ))}
              </ul>
            </section>
          }
        />
      </div>
    </article>
  );
}
