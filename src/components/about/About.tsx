"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";
import { aboutStages } from "@/data/about";
import { SectionHeading } from "@/components/common/SectionHeading";
import { cn } from "@/lib/cn";

/**
 * Left: Farhan's real photo (sticky) — the counterpart to the 3D character in the hero.
 * Right: a four-stage story; the stage in view lights up and drives the photo's label + progress line.
 */
export function About() {
  const root = useRef<HTMLElement>(null);
  const photo = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const blocks = useRef<Array<HTMLDivElement | null>>([]);
  const [active, setActive] = useState(0);

  // Which stage is centred in the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.i))),
      { rootMargin: "-42% 0px -48% 0px" },
    );
    blocks.current.forEach((b) => b && io.observe(b));
    return () => io.disconnect();
  }, []);

  // Progress line fills as you scroll through the story.
  useEffect(() => {
    if (!root.current || !fill.current) return;
    if (prefersReducedMotion()) { gsap.set(fill.current, { scaleY: 1 }); return; }
    const tween = gsap.fromTo(
      fill.current,
      { scaleY: 0 },
      { scaleY: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top 55%", end: "bottom 75%", scrub: true } },
    );
    return () => { tween.scrollTrigger?.kill(); tween.kill(); };
  }, []);

  // Gentle, bounded 3D tilt of the photo toward the pointer.
  useEffect(() => {
    const el = photo.current;
    if (!el || !window.matchMedia("(hover: hover) and (pointer: fine)").matches || prefersReducedMotion()) return;
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, "rotationX", { duration: 0.9, ease: "power3.out" });
    const ry = gsap.quickTo(el, "rotationY", { duration: 0.9, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      if (b.bottom < 0 || b.top > window.innerHeight) return; // only while visible
      ry(((e.clientX - (b.left + b.width / 2)) / window.innerWidth) * 12);
      rx((-(e.clientY - (b.top + b.height / 2)) / window.innerHeight) * 12);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const stage = aboutStages[active];

  return (
    <section ref={root} id="about" className="mx-auto max-w-[1500px] px-6 py-20 sm:px-12 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-[5fr_6fr] lg:gap-20">
        {/* Photo column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <SectionHeading index="02" title="The person behind the code" />
          <div className="mt-8 flex flex-col items-center gap-5 lg:items-start">
            <div ref={photo} className="relative aspect-square w-[min(84vw,420px)] lg:w-[clamp(300px,47dvh,520px)]">
              <div
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ border: "3px solid var(--accent)", boxShadow: "0 0 60px 2px var(--ring-glow), inset 0 0 40px var(--ring-glow)" }}
              />
              <div aria-hidden className="absolute -inset-4 rounded-full border border-dashed border-accent/45" />
              <div className="absolute inset-[7%] overflow-hidden rounded-full bg-surface">
                <Image src="/images/farhan-profile.sm.webp" alt="Muhammad Farhan" fill sizes="520px" className="object-cover" />
              </div>
              <div className="glass absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-2" style={{ background: "var(--bg-elevated)" }}>
                <span key={stage.index} className="label text-accent-text">{stage.index} · {stage.title}</span>
              </div>
            </div>
            <p className="label mt-3 text-center lg:text-left">The real me — the 3D one is up top</p>
          </div>
        </div>

        {/* Story column */}
        <div className="relative pl-8 sm:pl-12">
          <div aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-line">
            <div ref={fill} className="h-full origin-top bg-accent" style={{ transform: "scaleY(0)" }} />
          </div>
          <ol className="flex flex-col">
            {aboutStages.map((s, i) => (
              <li
                key={s.index}
                ref={(el) => { blocks.current[i] = el as HTMLDivElement | null; }}
                data-i={i}
                className={cn(
                  "relative flex min-h-[44dvh] flex-col justify-center gap-3 py-6",
                )}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[2.45rem] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 transition-colors duration-500 sm:-left-[3.45rem]",
                    active >= i ? "border-accent bg-accent" : "border-line bg-bg",
                  )}
                />
                {/* Focus is shown by colour, not by fading the text, so every stage stays readable (WCAG AA). */}
                <span aria-hidden className={cn("font-display text-7xl font-semibold leading-none transition-colors duration-500 sm:text-8xl", active === i ? "text-accent-text" : "text-muted")}>{s.index}</span>
                <h3 className={cn("font-display text-3xl font-semibold tracking-tight transition-colors duration-500 sm:text-5xl", active === i ? "text-ink" : "text-muted")}>{s.title}</h3>
                <p className="max-w-lg text-base text-muted sm:text-lg">{s.copy}</p>
                {s.proof && (
                  <ul className="mt-1 flex flex-wrap gap-2">
                    {s.proof.map((p) => (
                      <li key={p} className="rounded-full border border-line bg-elevated px-3 py-1 text-xs font-medium">{p}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
