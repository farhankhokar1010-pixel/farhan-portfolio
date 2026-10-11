"use client";
import { useSound } from "@/lib/sound";

/** Sound toggle for the desktop navbar. Off by default. */
export function SoundIconButton({ className = "" }: { className?: string }) {
  const { isOn, toggleSound } = useSound();
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-pressed={isOn}
      aria-label={isOn ? "Sound on — click to mute" : "Sound off — click to turn on"}
      title={isOn ? "Sound: on" : "Sound: off"}
      data-cursor="button"
      className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
        isOn ? "border-accent bg-accent text-on-accent" : "border-line bg-elevated/70 text-ink hover:border-accent"
      } ${className}`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M11 5 6 9H2v6h4l5 4V5z" />
        {isOn ? <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /> : <path d="m22 9-6 6m0-6 6 6" />}
      </svg>
    </button>
  );
}
