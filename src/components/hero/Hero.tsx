"use client";

import { useEffect, useRef } from "react";
import { hideHero, playHeroIntro } from "@/animations/hero";
import { useLoadState } from "@/lib/loadStore";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/common/Button";
import { Magnetic } from "@/components/common/Magnetic";
import { HeroStage } from "./HeroStage";
import { scrollToId } from "@/animations/scroll";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const { ready } = useLoadState();
  const played = useRef(false);

  useEffect(() => { if (root.current && !played.current) hideHero(root.current); }, []);
  useEffect(() => {
    if (ready && root.current && !played.current) {
      played.current = true;
      playHeroIntro(root.current);
    }
  }, [ready]);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };
  const [first, ...rest] = profile.name.toUpperCase().split(" ");

  return (
    <section ref={root} id="top" className="relative isolate overflow-hidden">
      <div className="mx-auto grid min-h-dvh max-w-[1500px] grid-rows-[auto_1fr] lg:grid-cols-[5fr_6fr] lg:grid-rows-1">
        <div className="relative z-10 flex flex-col justify-center gap-5 px-6 pt-28 sm:px-12 lg:py-0 lg:pl-16">
          <span data-hero="fade" className="label">Portfolio</span>
          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl xl:text-8xl">
            {[first, rest.join(" ")].map((line) => (
              <span key={line} className="block overflow-hidden pb-1">
                <span data-hero="line" className="block">{line}</span>
              </span>
            ))}
          </h1>
          <div data-hero="bar" className="h-1.5 w-20 rounded-full bg-accent" />
          <p data-hero="fade" className="font-display text-xl font-medium text-accent-text sm:text-3xl">{profile.title.toUpperCase()}</p>
          <p data-hero="fade" className="max-w-md text-base text-muted sm:text-lg">{profile.tagline}</p>
          <div data-hero="fade" className="mt-2 flex flex-wrap gap-3">
            <Magnetic><ButtonLink href="#work" onClick={go("work")} cursorLabel="VIEW">View my work</ButtonLink></Magnetic>
            <Magnetic><ButtonLink href="#resume" onClick={go("resume")} variant="secondary" cursorLabel="OPEN">Resume</ButtonLink></Magnetic>
          </div>
          <p data-hero="fade" className="label mt-4 hidden lg:block">Drag the model to rotate · move your cursor</p>
        </div>

        <div data-hero="stage" data-cursor="drag" data-cursor-label="ROTATE" className="relative h-[68dvh] min-h-[460px] lg:h-dvh">
          <HeroStage />
        </div>
      </div>

      <a
        href="#work"
        onClick={go("work")}
        aria-label="Scroll to work"
        data-hero="fade"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="label">Scroll</span>
        <span className="scroll-line h-8 w-px bg-accent" />
      </a>
    </section>
  );
}
