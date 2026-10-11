import { Reveal } from "./Reveal";

export function SectionHeading({ index, title, kicker, intro }: { index: string; title: string; kicker?: string; intro?: string }) {
  return (
    <Reveal className="flex flex-col gap-4">
      <span className="label text-accent-text">{index}</span>
      <h2 className="font-display text-4xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">{title}</h2>
      <div className="h-1.5 w-16 rounded-full bg-accent" />
      {kicker && <p className="font-display text-xl font-medium text-accent-text sm:text-2xl">{kicker}</p>}
      {intro && <p className="max-w-md text-muted sm:text-lg">{intro}</p>}
    </Reveal>
  );
}
