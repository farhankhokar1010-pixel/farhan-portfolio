"use client";

import { useEffect } from "react";
import { useProgress } from "@react-three/drei/core/Progress";
import { loadStore } from "@/lib/loadStore";

/** Forwards real asset-loading progress to the global loader. Renders nothing. */
export function ProgressReporter() {
  const { progress, active } = useProgress();
  useEffect(() => {
    loadStore.set({ modelProgress: progress, modelDone: progress >= 100 && !active });
  }, [progress, active]);
  return null;
}
