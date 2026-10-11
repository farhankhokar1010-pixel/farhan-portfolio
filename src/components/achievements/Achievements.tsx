"use client";

import Image from "next/image";
import { achievements } from "@/data/achievements";
import { Reveal } from "@/components/common/Reveal";
import { SectionHeading } from "@/components/common/SectionHeading";
import { LightboxProvider, useLightbox } from "@/components/projects/Lightbox";

const KIND: Record<string, string> = {
  certificate: "Certificate",
  internship: "Internship",
  award: "Award",
  milestone: "Milestone",
  course: "Course",
  academic: "Academic",
};

function Cards() {
  const lb = useLightbox();
  const shots = achievements.map((a) => a.image);

  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {achievements.map((a, i) => (
        <li key={a.id} className="flex">
          <Reveal className="flex w-full" delay={i * 0.08}>
            <article className="group flex w-full flex-col overflow-hidden rounded-3xl border border-line bg-elevated shadow-soft transition-colors hover:border-accent">
              <button
                type="button"
                onClick={() => lb.open(shots, i)}
                data-cursor="button"
                data-cursor-label="VIEW"
                aria-label={`View certificate: ${a.title}`}
                className="relative block aspect-[7/5] bg-surface p-3"
              >
                <Image
                  src={a.image.src}
                  alt={a.image.alt}
                  width={a.image.width}
                  height={a.image.height}
                  sizes="(min-width: 768px) 30vw, 90vw"
                  unoptimized
                  loading="lazy"
                  className="h-full w-full rounded-lg object-contain shadow-soft transition-transform duration-500 ease-cinematic group-hover:scale-[1.02]"
                />
              </button>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="label text-accent-text">{KIND[a.kind]}</span>
                  <span className="font-mono text-xs text-muted">{a.date}</span>
                </div>
                <h3 className="font-display text-xl font-semibold leading-snug">{a.title}</h3>
                <p className="text-sm text-muted">{a.issuer}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
                  {a.tags.map((t) => <li key={t} className="rounded-full border border-line px-2.5 py-0.5 text-xs text-muted">{t}</li>)}
                </ul>
                {a.verifyUrl && (
                  <a href={a.verifyUrl} target="_blank" rel="noopener noreferrer" data-cursor="link" data-cursor-label="VERIFY" className="text-sm font-medium text-accent-text underline-offset-4 hover:underline">
                    Verify online ↗
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/** #certificates — its own section and nav entry: real scans (click to enlarge) + verify links. */
export function Achievements() {
  return (
    <section id="certificates" className="mx-auto max-w-[1500px] px-6 pb-14 pt-20 sm:px-12 lg:px-16">
      <LightboxProvider>
        <SectionHeading
          index="06"
          title="Certificates"
          kicker="Proof, not just claims"
          intro="Real documents, not badges. Click one to enlarge it, or verify it with the issuer."
        />
        <div className="mt-10">
          <Cards />
        </div>
      </LightboxProvider>
    </section>
  );
}
