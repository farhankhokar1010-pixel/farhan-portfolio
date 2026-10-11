"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { resumeExperience, resumeInterests, resumeLanguages, resumeProjects, resumeSummary } from "@/data/resume";
import { skills } from "@/data/skills";
import { scrollToId } from "@/animations/scroll";
import { ButtonLink } from "@/components/common/Button";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { cn } from "@/lib/cn";

const TABS = [
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
] as const;
type TabId = (typeof TABS)[number]["id"];

const chip = "rounded-full border border-line px-3 py-1 text-sm";

/** Interactive web resume (tabs) built from src/data/*, next to a PDF download. */
export function Resume() {
  const [tab, setTab] = useState<TabId>("projects");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = TABS[(i + d + TABS.length) % TABS.length].id;
    setTab(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[4fr_7fr] lg:gap-20">
      <div className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
        <SectionHeading index="05" title="Resume" kicker="The short version" intro="Everything on one page. Prefer paper? Grab the PDF." />
        <Reveal className="flex flex-wrap gap-3">
          <ButtonLink href={profile.resumeUrl} download="Muhammad_Farhan_Resume.pdf" cursorLabel="PDF">
            Download PDF <span aria-hidden>↓</span>
          </ButtonLink>
          <ButtonLink href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" variant="secondary" cursorLabel="OPEN">
            View in new tab <span aria-hidden>↗</span>
          </ButtonLink>
        </Reveal>
      </div>

      <Reveal>
        <article className="grid overflow-hidden rounded-3xl border border-line bg-elevated shadow-soft md:grid-cols-[15rem_1fr]">
          {/* Sidebar: always visible, like the PDF */}
          <aside className="flex flex-col gap-5 border-b border-line bg-surface p-6 md:border-b-0 md:border-r">
            <div className="flex items-center gap-3">
              <Image src="/images/farhan-avatar.webp" alt="" width={56} height={56} className="h-14 w-14 rounded-full ring-2 ring-accent" />
              <div>
                <p className="font-display text-lg font-semibold leading-tight">{profile.name}</p>
                <p className="text-sm text-muted">{profile.title}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted">{resumeSummary}</p>
            <dl className="flex flex-col gap-3 text-sm">
              <div>
                <dt className="label">Location</dt>
                <dd>{profile.location}</dd>
              </div>
              <div>
                <dt className="label">Languages</dt>
                <dd>{resumeLanguages.join(" · ")}</dd>
              </div>
              <div>
                <dt className="label">Interests</dt>
                <dd>{resumeInterests.join(" · ")}</dd>
              </div>
            </dl>
          </aside>

          {/* Main: tabs */}
          <div className="flex min-w-0 flex-col p-6 sm:p-7">
            <div role="tablist" aria-label="Resume sections" className="mb-5 flex flex-wrap gap-2">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  ref={(el) => { refs.current[t.id] = el; }}
                  role="tab"
                  id={`rtab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`rpanel-${t.id}`}
                  tabIndex={tab === t.id ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  data-cursor="button"
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    tab === t.id ? "border-accent bg-accent text-on-accent" : "border-line hover:border-accent",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="min-h-[26rem]">
              <div role="tabpanel" id="rpanel-projects" aria-labelledby="rtab-projects" hidden={tab !== "projects"} className="flex flex-col gap-6">
                {resumeProjects.map((rp) => {
                  const p = projects.find((x) => x.slug === rp.slug);
                  if (!p) return null;
                  return (
                    <section key={rp.slug}>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-display text-xl font-semibold">{p.name}</h3>
                        <a href="#work" onClick={(e) => { e.preventDefault(); scrollToId("work"); }} data-cursor="link" className="text-sm text-accent-text underline-offset-4 hover:underline">
                          See it in Work ↗
                        </a>
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted marker:text-accent">
                        {rp.bullets.map((b) => <li key={b}>{b}</li>)}
                      </ul>
                    </section>
                  );
                })}
              </div>

              <div role="tabpanel" id="rpanel-experience" aria-labelledby="rtab-experience" hidden={tab !== "experience"} className="flex flex-col gap-6">
                {resumeExperience.map((x) => (
                  <section key={x.role}>
                    <h3 className="font-display text-xl font-semibold">{x.role}</h3>
                    <p>{x.org}</p>
                    <p className="mt-2"><span className={cn(chip, "font-mono text-xs text-muted")}>{x.period}</span></p>
                    <p className="mt-3 text-sm text-muted">{x.note}</p>
                  </section>
                ))}
              </div>

              <div role="tabpanel" id="rpanel-education" aria-labelledby="rtab-education" hidden={tab !== "education"} className="flex flex-col gap-5">
                {education.map((e) => (
                  <section key={e.degree} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold leading-snug">{e.degree}</h3>
                      <p className="text-sm">{e.institution}</p>
                      <p className="mt-1 font-mono text-xs text-muted">{e.period}{e.note ? ` · ${e.note}` : ""}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-2xl font-semibold text-accent-text">{e.result.value}{e.result.suffix && <span className="ml-1 text-sm text-muted">{e.result.suffix}</span>}</p>
                      <p className="label">{e.result.label}</p>
                    </div>
                  </section>
                ))}
              </div>

              <div role="tabpanel" id="rpanel-skills" aria-labelledby="rtab-skills" hidden={tab !== "skills"} className="flex flex-col gap-4">
                {skills.map((g) => (
                  <section key={g.category}>
                    <h3 className="label">{g.category}{g.learning ? " · learning" : ""}</h3>
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {g.items.map((it) => <li key={it} className={chip}>{it}</li>)}
                    </ul>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </article>
      </Reveal>
    </div>
  );
}
