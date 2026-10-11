"use client";

import { usePerformanceMode } from "@/hooks/usePerformanceMode";

/** Compact performance-mode toggle for the desktop navbar (the mobile menu has its own labelled toggle). */
export function PerformanceIconButton({ className = "" }: { className?: string }) {
  const { isReduced, togglePerfMode } = usePerformanceMode();
  return (
    <button
      type="button"
      onClick={togglePerfMode}
      aria-pressed={isReduced}
      aria-label={isReduced ? "Performance mode on — click to turn off" : "Performance mode off — click to turn on"}
      title={isReduced ? "Performance mode: on" : "Performance mode: off"}
      data-cursor="button"
      className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
        isReduced ? "border-accent bg-accent text-on-accent" : "border-line bg-elevated/70 text-ink hover:border-accent"
      } ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill={isReduced ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    </button>
  );
}
