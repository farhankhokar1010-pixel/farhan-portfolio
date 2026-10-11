"use client";
import { useSyncExternalStore } from "react";

/**
 * Optional UI sound, OFF by default. Everything is synthesised with the Web Audio API (no audio files to download),
 * very quiet, and only starts after the visitor turns it on (browsers require that gesture anyway).
 */
const KEY = "sound";
const listeners = new Set<() => void>();
let on = false;
let loaded = false;
let ctx: AudioContext | null = null;

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { on = window.localStorage.getItem(KEY) === "on"; } catch { /* storage blocked */ }
}
const emit = () => listeners.forEach((l) => l());

export function setSound(next: boolean) {
  load();
  on = next;
  try { window.localStorage.setItem(KEY, next ? "on" : "off"); } catch { /* ignore */ }
  emit();
  if (next) play("on");
}

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(c: AudioContext, freq: number, to: number, start: number, dur: number, vol: number) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(freq, start);
  o.frequency.exponentialRampToValueAtTime(to, start + dur);
  g.gain.setValueAtTime(0.0001, start);
  g.gain.exponentialRampToValueAtTime(vol, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  o.connect(g).connect(c.destination);
  o.start(start);
  o.stop(start + dur + 0.02);
}

export function play(kind: "tick" | "on") {
  load();
  if (!on) return;
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  if (kind === "tick") blip(c, 920, 640, t, 0.07, 0.035);
  else { blip(c, 660, 660, t, 0.12, 0.05); blip(c, 990, 990, t + 0.09, 0.18, 0.05); }
}

export function useSound() {
  const isOn = useSyncExternalStore(
    (cb) => { load(); listeners.add(cb); return () => { listeners.delete(cb); }; },
    () => { load(); return on; },
    () => false,
  );
  return { isOn, toggleSound: () => setSound(!isOn) };
}
