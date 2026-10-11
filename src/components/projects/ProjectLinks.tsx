"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/types";

const base =
  "inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-[transform,background-color,opacity] duration-300 active:scale-[0.97]";

/**
 * Live / source buttons. When a link is not set in src/data/projects.ts the button
 * says "Coming soon" instead of linking anywhere.
 */
export function ProjectLinks({ project }: { project: Project }) {
  const [note, setNote] = useState("");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const flash = (what: string) => {
    setNote(`${what} for ${project.name} — coming soon.`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNote(""), 2600);
  };

  const make = (key: "live" | "github", label: string, primary: boolean) => {
    const href = project.links[key];
    const style = primary
      ? "bg-[color:var(--p-accent)] text-[color:var(--p-on)] hover:opacity-90"
      : "border border-[color:var(--p-line)] text-[color:var(--p-ink)] hover:bg-[color:var(--p-line)]";
    if (href) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" data-cursor="button" data-cursor-label="OPEN" className={`${base} ${style}`}>
          {label} <span aria-hidden>↗</span>
        </a>
      );
    }
    return (
      <button
        type="button"
        aria-disabled="true"
        onClick={() => flash(label)}
        data-cursor="button"
        data-cursor-label="SOON"
        className={`${base} ${style} border-dashed opacity-80`}
      >
        {label} <span className="font-mono text-[0.6rem] uppercase tracking-widest opacity-70">Soon</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3">
        {make("live", "Live demo", true)}
        {make("github", "Source code", false)}
      </div>
      <p role="status" aria-live="polite" className="min-h-5 font-mono text-xs text-[color:var(--p-ink)] opacity-80">{note}</p>
    </div>
  );
}
