import { useSyncExternalStore } from "react";

/**
 * Tiny global store that lets the loader (main bundle) see real progress from the
 * 3D scene (lazy chunk) without importing three.js/drei into the main bundle.
 */
export interface LoadState {
  modelProgress: number; // 0–100, download progress of the 3D model (does NOT hold up the page)
  modelDone: boolean;    // model downloaded
  fontsDone: boolean;
  posterDone: boolean;   // hero photo is on screen (this, with fonts, is all the loader waits for)
  sceneVisible: boolean; // the 3D canvas has rendered its first frames and is fading in → camera intro starts
  ready: boolean;        // loader has finished → hero text intro may start
  aiOpen: boolean;       // Ask Farhan panel is open
  ai: "idle" | "thinking" | "speaking"; // assistant activity → subtle character reaction
}

let state: LoadState = { modelProgress: 0, modelDone: false, fontsDone: false, posterDone: false, sceneVisible: false, ready: false, aiOpen: false, ai: "idle" };
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
