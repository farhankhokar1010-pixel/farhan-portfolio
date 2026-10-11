"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark";
export type PerfMode = "full" | "reduced";

interface Preferences {
  theme: Theme;
  perfMode: PerfMode;
  toggleTheme: () => void;
  togglePerfMode: () => void;
}

const PreferencesContext = createContext<Preferences | null>(null);

const THEME_KEY = "fp:theme";
const PERF_KEY = "fp:perf";

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  // Defaults match the server render; the real values are read from the DOM
  // (set by the inline boot script in layout.tsx) right after mount.
  const [theme, setTheme] = useState<Theme>("light");
  const [perfMode, setPerfMode] = useState<PerfMode>("full");

  useEffect(() => {
    const root = document.documentElement;
    setTheme(root.classList.contains("dark") ? "dark" : "light");
    setPerfMode(root.dataset.perf === "reduced" ? "reduced" : "full");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try { localStorage.setItem(THEME_KEY, next); } catch {}
      return next;
    });
  }, []);

  const togglePerfMode = useCallback(() => {
    setPerfMode((prev) => {
      const next: PerfMode = prev === "reduced" ? "full" : "reduced";
      document.documentElement.dataset.perf = next;
      try { localStorage.setItem(PERF_KEY, next); } catch {}
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ theme, perfMode, toggleTheme, togglePerfMode }),
    [theme, perfMode, toggleTheme, togglePerfMode],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

function usePreferences(): Preferences {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}

export { usePreferences, THEME_KEY, PERF_KEY };
