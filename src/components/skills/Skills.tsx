"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";
import { skills } from "@/data/skills";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/cn";

/** Readable by design: every skill is real text. Interaction = switching category, not hiding information. */
export function Skills() {
  const [active, setActive] = useState(0);
  const panel = useRef<HTMLDivElement>(null);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);
  const group = skills[active];

  useEffect(() => {
    if (!panel.current || prefersReducedMotion()) return;
    const chips = panel.current.querySelectorAll("[data-chip]");
    const t = gsap.fromTo(chips, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.045, ease: "power3.out", overwrite: true });
    return () => { t.kill(); gsap.set(chips, { clearProps: "all" }); };
  }, [active]);

  const onKey = (e: React.KeyboardEvent) => {
    const next = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!next) return;
    e.preventDefault();
    const i = (active + next + skills.length) % skills.length;
    setActive(i);
    tabs.current[i]?.focus();
  };

  return (
    <section id="skills" className="mx-auto max-w-[1500px] px-6 py-20 sm:px-12 lg:px-16">
      <SectionHeading index="03" title="Expertise" intro="Grouped by what they're for — not rated with made-up percentages." />

      <div className="mt-10 grid gap-6 lg:grid-cols-[4fr_7fr] lg:gap-16">
        <div
          role="tablist"
          aria-label="Skill categories"
          aria-orientation="vertical"
          onKeyDown={onKey}
          className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0"
        >
          {skills.map((g, i) => (
            <button
              key={g.category}
              ref={(el) => { tabs.current[i] = el; }}
              role="tab"
              id={`tab-${i}`}
              aria-selected={active === i}
              aria-controls="skills-panel"
              tabIndex={active === i ? 0 : -1}
              data-cursor="button"
              onClick={() => setActive(i)}
              className={cn(
                "group flex shrink-0 items-baseline gap-3 rounded-full border px-5 py-3 text-left transition-colors duration-300 lg:rounded-2xl lg:border-0 lg:px-4 lg:py-4",
                active === i ? "border-accent bg-accent text-on-accent lg:bg-elevated lg:text-ink lg:shadow-soft" : "border-line hover:border-accent",
              )}
            >
              <span className={cn("font-mono text-xs", active === i ? "lg:text-accent-text" : "text-muted")}>0{i + 1}</span>
              <span className="font-display text-lg font-semibold sm:text-2xl lg:text-3xl">{g.category}</span>
              <span aria-hidden className={cn("ml-auto hidden h-0.5 w-8 rounded-full bg-accent transition-transform duration-500 lg:block", active === i ? "scale-x-100" : "scale-x-0")} />
            </button>
          ))}
        </div>

        <div
          ref={panel}
          role="tabpanel"
          id="skills-panel"
          aria-labelledby={`tab-${active}`}
          className="relative flex min-h-[260px] flex-col gap-8 overflow-hidden rounded-3xl border border-line bg-elevated p-7 shadow-soft sm:p-10"
        >
          <span aria-hidden className="pointer-events-none absolute -right-4 -top-10 font-display text-[12rem] font-semibold leading-none text-accent/10">0{active + 1}</span>
          <div className="relative flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">{group.category}</h3>
              {group.learning && <span className="rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-on-accent">Learning</span>}
            </div>
            <p className="max-w-md text-muted sm:text-lg">{group.blurb}</p>
          </div>
          <ul className="relative flex flex-wrap gap-3">
            {group.items.map((item) => (
              <li
                key={item}
                data-chip
                className="rounded-full border border-line bg-bg px-5 py-3 text-sm font-medium transition-[transform,border-color,background-color] duration-300 hover:-translate-y-1 hover:border-accent hover:bg-accent/10 sm:text-base"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
