"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { StageBoundary } from "@/three/loaders/StageBoundary";
import { HeroPoster } from "./HeroPoster";
import { loadStore, useLoadState } from "@/lib/loadStore";
import { isVerySlowConnection } from "@/lib/device";
import { MODEL_BYTES, MODEL_URL } from "@/three/config";

// three.js stays out of the initial JS bundle (the page itself hydrates first), then loads in parallel with the model.
const loadScene = () => import("@/three/Scene");
const Scene = dynamic(loadScene, { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

type Phase = "checking" | "nowebgl" | "waiting" | "manual" | "loading" | "ready" | "failed";
const mb = (bytes: number) => `${(bytes / 1048576).toFixed(1)} MB`;

/**
 * Hero stage. The model starts downloading the moment the page hydrates (a small file on phones / slow links), the 3D code
 * loads in parallel, and the scene is drawn a few frames off-screen — all BEHIND the loader, whose progress follows these steps —
 * so the page is revealed with the character already there. The photo is only used when 3D is unavailable or failed.
 */
export function HeroStage({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { sceneVisible, exiting } = useLoadState();
  const [phase, setPhase] = useState<Phase>("checking");
  const [progress, setProgress] = useState(0);
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [visible, setVisible] = useState(true);
  const [size, setSize] = useState("");
  const [reason, setReason] = useState("");
  const started = useRef(false);
  const abort = useRef<AbortController | null>(null);
  const blobUrl = useRef<string | null>(null);

  useEffect(() => { setPhase(hasWebGL() ? "waiting" : "nowebgl"); }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const start = useCallback(async () => {
    if (started.current) return;
    started.current = true;
    setPhase("loading");
    setProgress(0);
    const url = MODEL_URL; // the same model on phone and laptop
    const ctl = new AbortController();
    abort.current = ctl;
    try {
      void loadScene().then(() => loadStore.set({ codeDone: true })); // 3D code downloads in parallel with the model
      const res = await fetch(url, { signal: ctl.signal });
      if (!res.ok || !res.body) throw new Error(`model ${res.status}`);
      const total = MODEL_BYTES[url] || Number(res.headers.get("content-length")) || 1;
      const reader = res.body.getReader();
      const parts: BlobPart[] = [];
      let got = 0, last = -1;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        parts.push(value as BlobPart);
        got += value.length;
        const pct = Math.min(99, Math.floor((got / total) * 100));
        if (pct !== last) { last = pct; setProgress(pct); loadStore.set({ modelProgress: pct }); }
      }
      await loadScene();
      loadStore.set({ codeDone: true });
      const obj = URL.createObjectURL(new Blob(parts, { type: "model/gltf-binary" }));
      blobUrl.current = obj;
      loadStore.set({ modelProgress: 100, modelDone: true });
      setModelUrl(obj);
      setPhase("ready");
    } catch (e) {
      if (ctl.signal.aborted) return;
      started.current = false;
      const msg = e instanceof Error ? e.message : String(e);
      console.warn("[3d] model download failed:", msg);
      setReason(msg);
      setPhase("failed");
    }
  }, []);

  // Safety nets so the 3D can never silently be missing: a start that takes too long, or a lost GPU context, shows a clear message + retry.
  useEffect(() => {
    if (phase !== "ready" || sceneVisible || !visible) return;
    const t = window.setTimeout(() => {
      if (loadStore.get().sceneVisible) return;
      console.warn("[3d] scene did not start within 20 s");
      setReason("the 3D view took too long to start");
      setPhase("failed");
    }, 20000);
    return () => window.clearTimeout(t);
  }, [phase, sceneVisible, visible]);

  useEffect(() => {
    const lost = () => { console.warn("[3d] graphics context lost"); loadStore.set({ sceneVisible: false }); setReason("the graphics context was lost"); setPhase("failed"); };
    window.addEventListener("scene-lost", lost);
    return () => window.removeEventListener("scene-lost", lost);
  }, []);

  // Start straight away (the loader is waiting for exactly this) — except on data-saver / 2G, where we ask first.
  useEffect(() => {
    if (phase !== "waiting") return;
    if (isVerySlowConnection()) {
      setSize(mb(MODEL_BYTES[MODEL_URL]));
      setPhase("manual");
      return;
    }
    void start();
  }, [phase, start]);

  // Tell the loader when 3D will not happen, so it stops waiting and the photo becomes the hero.
  const skipped = phase === "nowebgl" || phase === "manual" || phase === "failed";
  useEffect(() => { loadStore.set({ threeSkipped: skipped }); }, [skipped]);

  useEffect(() => () => {
    abort.current?.abort();
    if (blobUrl.current) URL.revokeObjectURL(blobUrl.current);
  }, []);

  const retry = () => {
    if (blobUrl.current) { URL.revokeObjectURL(blobUrl.current); blobUrl.current = null; }
    loadStore.set({ sceneVisible: false });
    setAttempt((a) => a + 1);
    setModelUrl(null);
    setReason("");
    started.current = false;
    void start();
  };

  const caption =
    phase === "nowebgl" ? "3D isn't supported on this device — showing photo" : undefined;

  return (
    <div ref={ref} className={`relative h-full w-full ${className}`} style={{ containerType: "size" }}>
      {/* Orange ring + soft disc behind the model: gives the dark outfit contrast and a clear focal point. */}
      <div
        aria-hidden
        className="ring-breathe pointer-events-none absolute left-1/2 top-[55%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: "min(76cqh, 90cqw)",
          background: "radial-gradient(closest-side, var(--stage-fill), var(--stage-fill-edge))",
          border: "3px solid var(--accent)",
          boxShadow: "0 0 70px 4px var(--ring-glow), inset 0 0 50px var(--ring-glow)",
        }}
      />
      <div
        aria-hidden
        className="ring-drift pointer-events-none absolute left-1/2 top-[55%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: "min(90cqh, 100cqw)", border: "1.5px dashed var(--accent)", opacity: 0.45 }}
      />
      {/* Moving orange + blue light: two soft glows that drift across the stage behind the character. CSS-only (transform), off in Performance Mode. */}
      <div aria-hidden className="hero-lights">
        <span className="hero-light hero-light-a" />
        <span className="hero-light hero-light-b" />
      </div>

      {skipped && <HeroPoster hidden={false} caption={caption} />}

      {phase === "ready" && modelUrl && (
        <StageBoundary key={attempt} onError={(e) => { console.warn("[3d] scene error:", e.message); setReason(e.message); setPhase("failed"); }} fallback={null}>
          <div className="absolute inset-0 transition-opacity duration-700 ease-out" style={{ opacity: sceneVisible ? 1 : 0 }}>
            <Scene active={visible && !exiting} url={modelUrl} />
          </div>
        </StageBoundary>
      )}

      {/* Non-blocking status: the page is already usable while this runs. */}
      {!sceneVisible && (phase === "loading" || phase === "ready") && (
        <div role="status" className="pointer-events-none absolute inset-x-0 bottom-[5%] flex flex-col items-center gap-2">
          <span className="label">Loading 3D character<span aria-hidden> · {phase === "ready" ? 100 : progress}%</span></span>
          <span aria-hidden className="h-1 w-32 overflow-hidden rounded-full bg-line">
            <span className="block h-full origin-left rounded-full bg-accent transition-transform duration-300" style={{ transform: `scaleX(${(phase === "ready" ? 100 : progress) / 100})` }} />
          </span>
        </div>
      )}
      {phase === "manual" && (
        <div className="absolute inset-x-0 bottom-[5%] flex justify-center">
          <button type="button" onClick={() => void start()} data-cursor="button" className="rounded-full border border-accent bg-elevated/80 px-4 py-2 text-sm font-medium backdrop-blur">
            Load 3D character ({size})
          </button>
        </div>
      )}
      {phase === "failed" && (
        <div className="absolute inset-x-0 bottom-[5%] flex flex-col items-center gap-2">
          <span className="label">3D couldn&apos;t load — showing photo</span>
          {reason && <span className="max-w-[16rem] px-4 text-center font-mono text-[0.62rem] opacity-60">{reason.slice(0, 90)}</span>}
          <button type="button" onClick={retry} data-cursor="button" className="rounded-full border border-line px-4 py-1.5 text-sm font-medium hover:border-accent">Try again</button>
        </div>
      )}
    </div>
  );
}
