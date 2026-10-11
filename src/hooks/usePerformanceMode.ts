"use client";
import { usePreferences } from "@/components/common/PreferencesProvider";

/** `isReduced` → turn off particles, shadows, post-processing, heavy environment. */
export function usePerformanceMode() {
  const { perfMode, togglePerfMode } = usePreferences();
  return { perfMode, isReduced: perfMode === "reduced", togglePerfMode };
}
