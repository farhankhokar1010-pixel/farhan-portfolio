"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadStore, useLoadState } from "@/lib/loadStore";

const Panel = dynamic(() => import("./AskFarhanPanel"), { ssr: false });

export const ASK_OPEN_EVENT = "ask-farhan:open";
export const openAskFarhan = () => window.dispatchEvent(new Event(ASK_OPEN_EVENT));

/** Floating launcher + lazy-loaded chat panel. The panel code only downloads on first open. */
export function AskFarhan() {
  const { ready } = useLoadState();
  const [open, setOpen] = useState(false);
  const [everOpened, setEverOpened] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  const show = useCallback(() => { setOpen(true); setEverOpened(true); loadStore.set({ aiOpen: true }); }, []);
  const hide = useCallback(() => { setOpen(false); loadStore.set({ aiOpen: false, ai: "idle" }); btn.current?.focus(); }, []);

  useEffect(() => {
    window.addEventListener(ASK_OPEN_EVENT, show);
    return () => window.removeEventListener(ASK_OPEN_EVENT, show);
  }, [show]);

  if (!ready) return null;
  return (
    <>
      {everOpened && open && <Panel onClose={hide} />}
      <button
        ref={btn}
        type="button"
        onClick={() => (open ? hide() : show())}
        aria-expanded={open}
        aria-label={open ? "Close Ask Farhan" : "Ask Farhan — AI assistant"}
        data-cursor="button"
        data-cursor-label="ASK"
        className="fixed bottom-5 right-5 z-[65] flex items-center gap-2.5 rounded-full bg-accent px-4 py-3.5 text-sm font-semibold text-on-accent shadow-lift transition-transform duration-300 hover:scale-[1.04] active:scale-95 sm:px-5"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2l2.2 6.3L21 10l-6.3 2.2L12 19l-2.2-6.8L3 10l6.8-1.7L12 2zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z" /></svg>
        <span className="hidden sm:inline">{open ? "Close" : "Ask Farhan"}</span>
      </button>
    </>
  );
}
