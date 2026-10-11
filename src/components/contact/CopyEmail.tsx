"use client";

import { useEffect, useRef, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const t = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(t.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.clearTimeout(t.current);
    t.current = window.setTimeout(() => setState("idle"), 2200);
  };

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={copy}
        data-cursor="button"
        data-cursor-label="COPY"
        className="rounded-full border border-line px-3 py-1 font-mono text-xs transition-colors hover:border-accent"
      >
        {state === "copied" ? "Copied ✓" : "Copy"}
      </button>
      <span role="status" aria-live="polite" className="text-xs text-muted">
        {state === "failed" ? "Couldn't copy — select it manually." : ""}
      </span>
    </span>
  );
}
