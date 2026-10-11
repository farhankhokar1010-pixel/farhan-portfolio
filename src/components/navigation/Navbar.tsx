"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/animations/gsap";
import { scrollToId } from "@/animations/scroll";
import { NAV_ITEMS } from "@/data/nav";
import { profile } from "@/data/profile";
import { cn } from "@/lib/cn";
import { ThemeIconButton } from "@/components/common/ThemeIconButton";
import { PerformanceToggle } from "@/components/common/PerformanceToggle";
import { SoundToggle } from "@/components/common/SoundToggle";
import { SoundIconButton } from "@/components/common/SoundIconButton";
import { PerformanceIconButton } from "@/components/common/PerformanceIconButton";
import { useLoadState } from "@/lib/loadStore";
import { openAskFarhan } from "@/components/ai/AskFarhan";

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    const onTop = () => window.scrollY < 120 && setActive("");
    window.addEventListener("scroll", onTop, { passive: true });
    return () => { io.disconnect(); window.removeEventListener("scroll", onTop); };
  }, [ids]);
  return active;
}

export function Navbar({ onOpenPalette, kbdHint }: { onOpenPalette: () => void; kbdHint: string }) {
  const { ready } = useLoadState();
  const active = useScrollSpy(NAV_ITEMS.map((n) => n.id));
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Navbar is always visible; it only gains its glass background once the page scrolls.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance after the loader exits.
  useEffect(() => {
    if (!ready || !bar.current || prefersReducedMotion()) return;
    gsap.fromTo(bar.current, { y: -80, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1, ease: "power4.out", delay: 0.4, clearProps: "all" });
  }, [ready]);

  const go = useCallback((id: string) => (e: React.MouseEvent) => {
    if (window.location.pathname !== "/") return; // 404 / error pages: let the link navigate to /#section
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  }, []);

  // Mobile menu: animate, lock scroll, Esc to close, restore focus.
  useEffect(() => {
    if (!menu.current) return;
    const el = menu.current;
    if (open) {
      document.documentElement.style.overflow = "hidden";
      gsap.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: prefersReducedMotion() ? 0 : 0.35 });
      if (!prefersReducedMotion())
        gsap.fromTo(el.querySelectorAll("[data-menu-item]"), { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.07, ease: "power4.out", delay: 0.1 });
      el.querySelector<HTMLElement>("a")?.focus();
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
      window.addEventListener("keydown", onKey);
      return () => { window.removeEventListener("keydown", onKey); document.documentElement.style.overflow = ""; };
    }
    gsap.set(el, { autoAlpha: 0 });
  }, [open]);

  const closeMenu = () => { setOpen(false); menuBtn.current?.focus(); };

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-50"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto flex items-center justify-between gap-4 border-b border-transparent px-4 py-3 transition-[background-color,backdrop-filter,border-color] duration-500 sm:px-8",
            scrolled && "nav-glass",
          )}
        >
          <a href="/#top" onClick={go("top")} data-cursor="link" className="flex items-center gap-3" aria-label={`${profile.name} — home`}>
            <Image src="/images/farhan-avatar.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full ring-2 ring-accent" priority />
            <span className="hidden font-display text-sm font-semibold tracking-wide sm:block">{profile.name}</span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((n) => (
              <li key={n.id}>
                  <a
                    href={`/#${n.id}`}
                    onClick={go(n.id)}
                    data-cursor="link"
                    aria-current={active === n.id ? "true" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-accent-text",
                      active === n.id ? "text-accent-text" : "text-ink",
                    )}
                  >
                    {n.label}
                    <span
                      className={cn(
                        "absolute inset-x-4 -bottom-0.5 h-0.5 origin-left rounded-full bg-accent transition-transform duration-500 ease-cinematic",
                        active === n.id ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPalette}
              data-cursor="button"
              className="hidden items-center gap-2 rounded-full border border-line bg-elevated/70 px-3 py-2 text-xs text-muted transition-colors hover:border-accent md:flex"
              aria-label="Search (command palette)"
            >
              Search <kbd className="rounded border border-line px-1.5 font-mono text-[0.65rem]">{kbdHint}</kbd>
            </button>
            <PerformanceIconButton className="hidden md:grid" />
            <SoundIconButton className="hidden md:grid" />
            <ThemeIconButton />
            <button
              ref={menuBtn}
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full bg-accent text-on-accent md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => (open ? closeMenu() : setOpen(true))}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden>
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile: full-screen menu with big numbered links (not a shrunken desktop bar). */}
      <div
        id="mobile-menu"
        ref={menu}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-bg overflow-y-auto px-6 pb-8 pt-24 md:hidden"
      >
        <ul className="flex flex-col gap-2">
          {NAV_ITEMS.map((n, i) => (
            <li key={n.id} data-menu-item>
              <a
                href={`/#${n.id}`}
                onClick={go(n.id)}
                tabIndex={open ? 0 : -1}
                className="flex items-baseline gap-4 border-b border-line py-2 font-display text-[clamp(1.6rem,4.5vh,3rem)] font-semibold tracking-tight active:text-accent-text"
              >
                <span className="font-mono text-xs text-accent-text">0{i + 1}</span>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <div data-menu-item className="mt-6 flex flex-wrap items-center gap-3">
          <PerformanceToggle />
          <SoundToggle />
          <button
            type="button"
            onClick={() => { setOpen(false); setTimeout(openAskFarhan, 50); }}
            className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-on-accent"
          >
            Ask Farhan
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); onOpenPalette(); }}
            className="rounded-full border border-line bg-elevated px-5 py-3 text-sm font-medium"
          >
            Search
          </button>
        </div>
      </div>
    </>
  );
}
