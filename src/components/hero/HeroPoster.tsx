"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { loadStore } from "@/lib/loadStore";

/**
 * The hero photo (7 KB). It is the first thing in the ring, paints almost instantly on any connection, and is what the
 * loader waits for. When the 3D character has loaded behind it, it fades away. If 3D never arrives, it simply stays.
 */
export function HeroPoster({ hidden, caption }: { hidden: boolean; caption?: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const done = () => loadStore.set({ posterDone: true });

  // An image that finished loading before React attached onLoad would never report; check it directly.
  useEffect(() => {
    const img = wrap.current?.querySelector("img");
    if (img?.complete) done();
  }, []);

  return (
    <div
      ref={wrap}
      aria-hidden={hidden}
      className="pointer-events-none absolute inset-0 transition-opacity duration-700 ease-out"
      style={{ opacity: hidden ? 0 : 1, visibility: hidden ? "hidden" : "visible", transitionProperty: "opacity, visibility" }}
    >
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2" style={{ width: "min(54cqh, 64cqw)" }}>
        <Image
          src="/images/farhan-poster.webp"
          alt="Muhammad Farhan"
          width={360}
          height={360}
          unoptimized
          priority
          onLoad={done}
          onError={done}
          className="aspect-square w-full rounded-full object-cover shadow-lift"
        />
      </div>
      {caption && <p className="label absolute inset-x-0 bottom-[7%] px-6 text-center">{caption}</p>}
    </div>
  );
}
