import { getProject } from "@/data/projects";

const project = getProject("document-setter");

/** Honest "in development" treatment — no invented details. */
export function DocumentSetterTeaser() {
  return (
    <article id="document-setter" className="relative overflow-hidden rounded-[2rem] border border-line bg-elevated p-6 sm:p-8">
      <svg aria-hidden className="pointer-events-none absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] text-accent/60">
        <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="24" fill="none" stroke="currentColor" strokeWidth="1.5" className="dash-anim" />
      </svg>
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="label text-accent-text">{project.index} · Next up</span>
            <span className="rounded-full bg-accent px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-on-accent">In development</span>
          </div>
          <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-5xl">{project.name}</h3>
          <p className="text-lg text-muted">{project.tagline}</p>
        </div>
        <p className="label max-w-[16rem] sm:text-right">Actively being built — not finished, and not pretending to be.</p>
      </div>
    </article>
  );
}
