"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei/core/Gltf";
import { Box3, MathUtils, Mesh, MeshStandardMaterial, Vector3, type Group } from "three";
import type { PointerState } from "@/hooks/useMousePosition";
import { MODEL_HEIGHT } from "../config";
import { useIntro } from "../interactions/useIntro";
import { loadStore } from "@/lib/loadStore";

interface Props {
  url: string;
  pointer: React.RefObject<PointerState>;
  scroll: React.RefObject<number>;
  isMobile: boolean;
  reducedMotion: boolean;
}

const MAX_POINTER_YAW = 0.38;  // rad — body turns toward the cursor
const MAX_POINTER_PITCH = 0.04;
const DRAG_SPEED = 0.008;       // rad per px

/**
 * The GLB has no rig or animation, so every reaction here is a whole-model transform:
 * cursor-follow yaw/pitch, a breathing idle, and drag-to-rotate that eases back to front.
 * When a rigged model arrives, swap this for bone-based head/eye tracking.
 */
export function FarhanModel({ url, pointer, scroll, isMobile, reducedMotion }: Props) {
  // useGLTF(url, useDraco, useMeshopt): the optimised files use meshopt only → no CDN decoder needed.
  const { scene } = useGLTF(url, false, true);
  const gl = useThree((s) => s.gl);
  const maxAniso = Math.min(16, gl.capabilities.getMaxAnisotropy());
  const intro = useIntro(reducedMotion);
  const rig = useRef<Group>(null);
  const drag = useRef({ active: false, lastX: 0, yaw: 0 });
  const ai = useRef({ open: 0, think: 0, speak: 0 }); // damped 0..1 intensities
  const nod = useRef({ pos: 0, vel: 0 });
  const nodRef = nod;              // spring driven by a tap/click on the model
  const mv = useRef({ lastX: 0, vx: 0, roll: 0, scroll: 0 }); // pointer speed → tiny weight-shift lean

  // Clone + normalise: fit to MODEL_HEIGHT, centre on x/z, feet on y = 0.
  const { object, scale, offset } = useMemo(() => {
    const clone = scene.clone(true);
    clone.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const s = MODEL_HEIGHT / size.y;
    clone.traverse((o) => {
      if ((o as Mesh).isMesh) {
        const mesh = o as Mesh;
        mesh.frustumCulled = true;
        const mat = mesh.material as MeshStandardMaterial;
        mat.envMapIntensity = 1;
        // Sharper textures at grazing angles (face, cargo pockets, shoes).
        for (const tex of [mat.map, mat.normalMap, mat.roughnessMap]) if (tex) tex.anisotropy = maxAniso;
      }
    });
    return { object: clone, scale: s, offset: new Vector3(-center.x * s, -box.min.y * s, -center.z * s) };
  }, [scene, maxAniso]);

  // Drag to rotate (mouse + touch). touch-action: pan-y keeps vertical page scroll working on phones.
  useEffect(() => {
    const el = gl.domElement;
    const d = drag.current;
    el.style.touchAction = "pan-y";

    const tap = { x: 0, y: 0, t: 0, moved: 0 };
    const down = (e: PointerEvent) => {
      d.active = true;
      tap.x = e.clientX; tap.y = e.clientY; tap.t = performance.now(); tap.moved = 0;
      d.lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!d.active) return;
      tap.moved = Math.max(tap.moved, Math.hypot(e.clientX - tap.x, e.clientY - tap.y));
      d.yaw += (e.clientX - d.lastX) * DRAG_SPEED;
      d.lastX = e.clientX;
    };
    const up = (e: PointerEvent) => {
      if (!d.active) return;
      d.active = false;
      // A short tap (not a drag) makes him give a small nod.
      if (tap.moved < 6 && performance.now() - tap.t < 450) nodRef.current.vel = 2.2;
      // Take the shortest way back to facing the camera.
      d.yaw = MathUtils.euclideanModulo(d.yaw + Math.PI, Math.PI * 2) - Math.PI;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };

    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, [gl]);

  useFrame((state, delta) => {
    const g = rig.current;
    if (!g) return;
    const d = drag.current;
    const follow = reducedMotion ? 0.25 : 1;

    if (!d.active) d.yaw = MathUtils.damp(d.yaw, 0, 2.5, delta); // ease back to front

    const turnIn = (1 - intro(state.clock.elapsedTime)) * -0.3; // a small settle toward the camera
    const targetYaw = pointer.current.x * MAX_POINTER_YAW * follow + d.yaw + turnIn;
    const targetPitch = -pointer.current.y * MAX_POINTER_PITCH * follow;

    // Subtle reaction while Ask Farhan is active: turns a touch toward the chat, sways while "thinking", nods while "speaking".
    const st = loadStore.get();
    const calm = reducedMotion ? 0 : 1;
    ai.current.open = MathUtils.damp(ai.current.open, st.aiOpen ? 1 : 0, 3, delta);
    ai.current.think = MathUtils.damp(ai.current.think, st.ai === "thinking" ? 1 : 0, 4, delta);
    ai.current.speak = MathUtils.damp(ai.current.speak, st.ai === "speaking" ? 1 : 0, 6, delta);
    const t = state.clock.elapsedTime;
    const aiYaw = ai.current.open * 0.12 * calm + Math.sin(t * 1.1) * 0.05 * ai.current.think * calm;
    const aiPitch = (Math.sin(t * 5.5) * 0.012 * ai.current.speak + ai.current.think * 0.025) * calm;

    // Scroll: as the page moves on he turns toward the content (left on desktop, down on phones).
    const m = mv.current;
    m.scroll = MathUtils.damp(m.scroll, reducedMotion ? 0 : scroll.current, 4, delta);
    const scrollYaw = isMobile ? 0 : -0.3 * m.scroll;
    const scrollPitch = isMobile ? 0.05 * m.scroll : 0.02 * m.scroll;

    // Tap nod: damped spring.
    const n = nod.current;
    n.vel += (-60 * n.pos - 9 * n.vel) * delta;
    n.pos += n.vel * delta;
    const nodPitch = n.pos * 0.06 * calm;

    // Weight shift: quick cursor movement leans him a hair; plus a very slow idle sway.
    const px = pointer.current.x;
    m.vx = MathUtils.damp(m.vx, delta > 0 ? (px - m.lastX) / delta : 0, 8, delta);
    m.lastX = px;
    const t2 = state.clock.elapsedTime;
    const rollTarget = (MathUtils.clamp(-m.vx * 0.012, -0.02, 0.02) + Math.sin(t2 * 0.5) * 0.004) * calm;
    m.roll = MathUtils.damp(m.roll, rollTarget, 5, delta);

    g.rotation.y = MathUtils.damp(g.rotation.y, targetYaw + aiYaw + scrollYaw, d.active ? 14 : 4, delta);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetPitch + aiPitch + scrollPitch + nodPitch, 4, delta);
    g.rotation.z = m.roll;

    if (!reducedMotion) {
      const t = state.clock.elapsedTime;
      g.position.y = Math.sin(t * 1.3) * 0.004 + Math.max(0, n.pos) * 0.012; // breathing + small hop on nod
      g.scale.setScalar(1 + Math.sin(t * 1.3 + 0.6) * 0.0015);
    }
  });

  return (
    <group ref={rig}>
      <primitive object={object} scale={scale} position={offset} />
    </group>
  );
}
