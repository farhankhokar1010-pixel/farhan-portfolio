import { Reveal } from "./Reveal";

/** Placeholder section so every nav target exists. Replaced phase by phase. */
export function SectionShell({ id, index, title, note }: { id: string; index: string; title: string; note: string }) {
  return (
    <section id={id} className="mx-auto flex min-h-[50dvh] max-w-[1500px] flex-col justify-center gap-4 px-6 py-16 sm:px-12 lg:px-16">
      <Reveal className="flex flex-col gap-4">
        <span className="label text-accent-text">{index}</span>
        <h2 className="font-display text-5xl font-semibold tracking-tight sm:text-7xl">{title}</h2>
        <p className="max-w-lg text-muted">{note}</p>
      </Reveal>
    </section>
  );
}
