"use client";

import { useId, useState } from "react";
import type { Project } from "@/data/types";
import { cn } from "@/lib/cn";

/** Expands in place: full feature breakdown + tech stack. */
export function CaseStudy({ project, extra }: { project: Project; extra?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
        data-cursor="button"
        className="inline-flex w-fit items-center gap-3 font-medium text-[color:var(--p-ink)]"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full border border-[color:var(--p-line)] text-lg leading-none transition-transform duration-500" style={{ transform: open ? "rotate(45deg)" : "none" }}>+</span>
        {open ? "Close case study" : "Open case study"}
      </button>

      <div
        id={id}
        className={cn("grid transition-[grid-template-rows,opacity] duration-700 ease-cinematic", open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}
        {...(!open ? { inert: true } : {})}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[color:var(--p-line)] pt-6">
            {project.highlights.length > 0 && (
              <section className="pb-6">
                <h4 className="font-mono text-xs uppercase tracking-widest text-[color:var(--p-accent-text)]">Highlights</h4>
                <ul className="mt-3 grid gap-2 text-sm text-[color:var(--p-ink)] opacity-90 md:grid-cols-2">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--p-accent)]" />{h}</li>
                  ))}
                </ul>
              </section>
            )}
            {extra}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {project.features.map((g) => (
              <section key={g.title}>
                <h4 className="font-mono text-xs uppercase tracking-widest text-[color:var(--p-accent-text)]">{g.title}</h4>
                <ul className="mt-3 flex flex-col gap-2 text-sm text-[color:var(--p-ink)] opacity-90">
                  {g.items.map((it) => (
                    <li key={it} className="flex gap-2"><span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--p-accent)]" />{it}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <div className="mt-6">
            <h4 className="font-mono text-xs uppercase tracking-widest text-[color:var(--p-accent-text)]">Tech stack</h4>
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.stack.map((t) => (
                <li key={t} className="rounded-full border border-[color:var(--p-line)] px-3 py-1 text-xs font-medium text-[color:var(--p-ink)]">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
