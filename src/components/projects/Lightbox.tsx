"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ProjectScreen } from "@/data/types";

interface LightboxApi { open: (screens: ProjectScreen[], index: number) => void }
const Ctx = createContext<LightboxApi | null>(null);

export function useLightbox(): LightboxApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLightbox must be used inside <LightboxProvider>");
  return c;
}

/** Full-screen screenshot viewer: Esc closes, ←/→ navigate, focus is restored on close. */
export function LightboxProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ screens: ProjectScreen[]; i: number } | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const open = useCallback((screens: ProjectScreen[], i: number) => {
    returnFocus.current = document.activeElement as HTMLElement;
    setState({ screens, i });
  }, []);
  const close = useCallback(() => { setState(null); returnFocus.current?.focus?.(); }, []);
  const go = useCallback((d: number) => setState((s) => (s ? { ...s, i: (s.i + d + s.screens.length) % s.screens.length } : s)), []);

  useEffect(() => {
    if (!state) return;
    document.documentElement.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
  }, [state, close, go]);

  const api = useMemo(() => ({ open }), [open]);
  const cur = state?.screens[state.i];

  return (
    <Ctx.Provider value={api}>
      {children}
      {state && cur && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Screenshot: ${cur.caption}`}
          onMouseDown={close}
          className="lb-in fixed inset-0 z-[95] flex flex-col items-center justify-center gap-4 bg-black/85 p-4 backdrop-blur-sm"
        >
          <div onMouseDown={(e) => e.stopPropagation()} className="flex max-h-full w-full max-w-[1400px] flex-col items-center gap-4">
            <Image
              key={cur.src}
              src={cur.src}
              alt={cur.alt}
              width={cur.width}
              height={cur.height}
              sizes="100vw"
              priority
              unoptimized
              className="lb-in h-auto max-h-[78dvh] w-auto max-w-full rounded-xl bg-white object-contain shadow-lift"
            />
            <div className="flex w-full items-center justify-between gap-4 text-white">
              <span className="font-mono text-xs tracking-widest">{cur.caption} · {state.i + 1}/{state.screens.length}</span>
              <div className="flex gap-2">
                {state.screens.length > 1 && (
                  <>
                    <button type="button" onClick={() => go(-1)} aria-label="Previous screenshot" data-cursor="button" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 hover:bg-white/10">←</button>
                    <button type="button" onClick={() => go(1)} aria-label="Next screenshot" data-cursor="button" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 hover:bg-white/10">→</button>
                  </>
                )}
                <button ref={closeBtn} type="button" onClick={close} aria-label="Close" data-cursor="button" className="grid h-11 w-11 place-items-center rounded-full bg-white text-black">✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Ctx.Provider>
  );
}
