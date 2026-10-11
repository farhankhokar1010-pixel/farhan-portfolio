"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";
import { education, educationIntro } from "@/data/education";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { cn } from "@/lib/cn";

export function Education() {
  const root = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current || !fill.current) return;
    if (prefersReducedMotion()) { gsap.set(fill.current, { scaleY: 1 }); return; }
    const tween = gsap.fromTo(
      fill.current,
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 70%", end: "bottom 80%", scrub: true } },
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  return (
    <section id="education" className="mx-auto max-w-[1500px] px-6 py-20 sm:px-12 lg:px-16">
      <div className="grid gap-12 lg:grid-cols-[4fr_7fr] lg:gap-20">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading index="04" title="Education" kicker={educationIntro.kicker} intro={educationIntro.text} />
        </div>

        <div ref={root} className="relative pl-8 sm:pl-12">
          <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line">
            <div ref={fill} className="h-full origin-top bg-accent" style={{ transform: "scaleY(0)" }} />
          </div>
          <ol className="flex flex-col gap-5">
            {education.map((e, i) => {
              const current = e.status === "in-progress";
              return (
                <li key={e.degree} className="relative">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-[2.45rem] top-9 h-3 w-3 rounded-full border-2 border-accent bg-accent sm:-left-[3.45rem]",
                      current && "shadow-[0_0_0_6px_var(--ring-glow)]",
                    )}
                  />
                  <Reveal>
                    <article className={cn("rounded-3xl border bg-elevated p-5 shadow-soft sm:p-7", current ? "border-accent" : "border-line")}>
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                        <div className="min-w-0 flex-1">
                          <span className="label text-accent-text">0{i + 1} — {e.level}</span>
                          <h3 className="mt-3 font-display text-2xl font-semibold leading-tight tracking-tight sm:text-4xl">{e.degree}</h3>
                          <p className="mt-2 text-lg">{e.institution}</p>
                          {e.campus && <p className="text-muted">{e.campus}</p>}
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{e.period}</span>
                            {e.note && <span className="rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">{e.note}</span>}
                            <span
                              className={cn(
                                "rounded-full px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest",
                                current ? "bg-accent text-on-accent" : "border border-line text-muted",
                              )}
                            >
                              {current ? "In progress" : "Completed"}
                            </span>
                          </div>
                        </div>

                        <div className="flex w-full items-baseline gap-3 rounded-2xl bg-surface px-5 py-4 sm:block sm:w-auto sm:shrink-0 sm:px-6 sm:text-center">
                          <div className="font-display text-5xl font-semibold leading-none text-accent-text sm:text-6xl">
                            {e.result.value}
                            {e.result.suffix && <span className="ml-1 text-lg font-medium text-muted sm:text-xl">{e.result.suffix}</span>}
                          </div>
                          <div className="label sm:mt-2">{e.result.label}</div>
                        </div>
                      </div>
                      <p className="mt-6 max-w-2xl text-muted">{e.description}</p>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
