"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { scrollToId } from "@/animations/scroll";
import { openAskFarhan } from "@/components/ai/AskFarhan";
import { NAV_ITEMS } from "@/data/nav";
import { useSound } from "@/lib/sound";
import { usePreferences } from "@/components/common/PreferencesProvider";

interface Command { id: string; label: string; hint: string; run: () => void }

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { theme, perfMode, toggleTheme, togglePerfMode } = usePreferences();
  const { isOn: soundOn, toggleSound } = useSound();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const commands = useMemo<Command[]>(() => [
    { id: "ask", label: "Ask Farhan (AI assistant)", hint: "Assistant", run: () => setTimeout(openAskFarhan, 50) },
    ...NAV_ITEMS.map((n) => ({ id: `go-${n.id}`, label: `Go to ${n.label}`, hint: "Navigate", run: () => scrollToId(n.id) })),
    { id: "top", label: "Back to top", hint: "Navigate", run: () => scrollToId("top") },
    { id: "theme", label: `Switch to ${theme === "dark" ? "light" : "dark"} mode`, hint: "Preference", run: toggleTheme },
    { id: "perf", label: `Performance mode: turn ${perfMode === "reduced" ? "off" : "on"}`, hint: "Preference", run: togglePerfMode },
    { id: "sound", label: `Sound: turn ${soundOn ? "off" : "on"}`, hint: "Preference", run: toggleSound },
  ], [theme, perfMode, toggleTheme, togglePerfMode, soundOn, toggleSound]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    if (open) {
      returnFocus.current = document.activeElement as HTMLElement;
      setQuery(""); setIndex(0);
      requestAnimationFrame(() => input.current?.focus());
    } else {
      returnFocus.current?.focus?.();
    }
  }, [open]);

  if (!open) return null;

  const run = (c?: Command) => { if (!c) return; onClose(); c.run(); };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { e.preventDefault(); onClose(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(results[index]); }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-black/40 px-4 pt-[16vh] backdrop-blur-[2px]" onMouseDown={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKey}
        className="glass w-full max-w-lg overflow-hidden rounded-2xl shadow-lift"
        style={{ background: "var(--bg-elevated)" }}
      >
        <input
          ref={input}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
          placeholder="Type a command…"
          role="combobox"
          aria-expanded="true"
          aria-controls="palette-list"
          aria-activedescendant={results[index] ? `cmd-${results[index].id}` : undefined}
          className="w-full border-b border-line bg-transparent px-5 py-4 text-base outline-none placeholder:text-muted"
        />
        <ul id="palette-list" role="listbox" className="max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">No matching commands</li>}
          {results.map((c, i) => (
            <li
              key={c.id}
              id={`cmd-${c.id}`}
              role="option"
              aria-selected={i === index}
              onMouseEnter={() => setIndex(i)}
              onClick={() => run(c)}
              data-cursor="button"
              className={`flex cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-sm ${i === index ? "bg-accent text-on-accent" : ""}`}
            >
              <span>{c.label}</span>
              <span className={`font-mono text-[0.65rem] uppercase tracking-widest ${i === index ? "" : "text-muted"}`}>{c.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
