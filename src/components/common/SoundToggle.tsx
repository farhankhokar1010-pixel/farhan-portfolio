"use client";
import { useSound } from "@/lib/sound";
import { Button } from "./Button";

/** Labelled sound toggle for the mobile menu. */
export function SoundToggle() {
  const { isOn, toggleSound } = useSound();
  return (
    <Button variant="secondary" onClick={toggleSound} aria-pressed={isOn}>
      Sound: {isOn ? "On" : "Off"}
    </Button>
  );
}
