"use client";
import { usePerformanceMode } from "@/hooks/usePerformanceMode";
import { Button } from "./Button";

export function PerformanceToggle() {
  const { isReduced, togglePerfMode } = usePerformanceMode();
  return (
    <Button variant="secondary" onClick={togglePerfMode} aria-pressed={isReduced}>
      Performance mode: {isReduced ? "On" : "Off"}
    </Button>
  );
}
