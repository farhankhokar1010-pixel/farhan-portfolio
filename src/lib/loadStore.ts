import { useSyncExternalStore } from "react";

/**
 * Tiny global store that lets the loader (main bundle) see real progress from the
 * 3D scene (lazy chunk) without importing three.js/drei into the main bundle.
 */
export interface LoadState {
  codeDone: boolean;     // the 3D engine chunk has downloaded
  modelProgress: number; // 0–100, download progress of the 3D model
  modelDone: boolean;    // model downloaded
  fontsDone: boolean;
  posterDone: boolean;   // hero photo is on screen (only needed when 3D is skipped / unavailable)
  threeSkipped: boolean; // 3D will not be shown (no WebGL, data-saver, failed): the photo is the hero and the loader stops waiting for 3D
  sceneVisible: boolean; // the 3D canvas has drawn its first frames (off-screen, behind the loader) and is safe to show
  exiting: boolean;      // the loader curtain is sliding away: the 3D render loop pauses so the curtain stays smooth
  forced: boolean;       // loader gave up waiting (very slow link): page shows now, 3D fades in when it arrives
  ready: boolean;        // loader has finished → hero text + camera intro may start
  aiOpen: boolean;       // Ask Farhan panel is open
  ai: "idle" | "thinking" | "speaking"; // assistant activity → subtle character reaction
}

let state: LoadState = { codeDone: false, modelProgress: 0, modelDone: false, fontsDone: false, posterDone: false, threeSkipped: false, sceneVisible: false, exiting: false, forced: false, ready: false, aiOpen: false, ai: "idle" };
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
