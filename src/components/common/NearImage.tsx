"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * Image that is only requested once it is close to the screen (500 px before). On a slow link this keeps below-the-fold
 * pictures from competing with the page's own code and the 3D character; a sized placeholder prevents layout shift.
 */
export function NearImage({ priority, margin = "500px", alt, ...img }: Omit<ImageProps, "fill" | "width" | "height"> & { width: number; height: number; margin?: string }) {
  const [near, setNear] = useState(!!priority);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (near) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: `${margin} 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [near, margin]);
  if (near) return <Image {...img} alt={alt} priority={priority} />;
  return <span ref={ref} role="img" aria-label={alt} className="block w-full" style={{ aspectRatio: `${img.width} / ${img.height}` }} />;
}
