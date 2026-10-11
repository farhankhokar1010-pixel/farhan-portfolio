import { useSyncExternalStore } from "react";

/**
 * Tiny global store that lets the loader (main bundle) see real progress from the
 * 3D scene (lazy chunk) without importing three.js/drei into the main bundle.
 */
export interface LoadState {
  modelProgress: number; // 0–100, from the Three loading manager
  modelDone: boolean;    // model loaded, or 3D unavailable/failed (nothing left to wait for)
  fontsDone: boolean;
  ready: boolean;        // loader has finished → hero intro + camera dolly may start
  aiOpen: boolean;       // Ask Farhan panel is open
  ai: "idle" | "thinking" | "speaking"; // assistant activity → subtle character reaction
}

let state: LoadState = { modelProgress: 0, modelDone: false, fontsDone: false, ready: false, aiOpen: false, ai: "idle" };
const listeners = new Set<() => void>();

export const loadStore = {
  get: () => state,
  set(partial: Partial<LoadState>) {
    state = { ...state, ...partial };
    listeners.forEach((l) => l());
  },
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  },
};

export function useLoadState(): LoadState {
  return useSyncExternalStore(loadStore.subscribe, loadStore.get, loadStore.get);
}
