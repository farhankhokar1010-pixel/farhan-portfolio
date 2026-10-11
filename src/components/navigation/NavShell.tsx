"use client";

import { useEffect, useState } from "react";
import { Navbar } from "./Navbar";
import { CommandPalette } from "./CommandPalette";

/** Owns the shared "palette open" state and the Ctrl/Cmd + K shortcut. */
export function NavShell() {
  const [open, setOpen] = useState(false);
  const [kbd, setKbd] = useState("Ctrl K");

  useEffect(() => {
    setKbd(/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K");
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <Navbar onOpenPalette={() => setOpen(true)} kbdHint={kbd} />
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </>
  );
}
