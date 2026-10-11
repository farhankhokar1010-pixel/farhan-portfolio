import { SectionHeading } from "@/components/common/SectionHeading";
import { Reveal } from "@/components/common/Reveal";
import { DocumentSetterTeaser } from "./DocumentSetterTeaser";
import { LightboxProvider } from "./Lightbox";
import { MediMartShowcase } from "./MediMartShowcase";
import { PassportAIShowcase } from "./PassportAIShowcase";
import { ResumeNovaShowcase } from "./ResumeNovaShowcase";

/** Selected Work: each project gets its own composition and visual identity — not one repeated card. */
export function Projects() {
  return (
    <section id="work" className="mx-auto max-w-[1500px] px-6 py-20 sm:px-12 lg:px-16">
      <LightboxProvider>
        <SectionHeading index="01" title="Selected Work" intro="Products I've built end to end — shown the way they actually work. Click any screen to enlarge it." />
        <div className="mt-10 flex flex-col gap-6 lg:gap-8">
          <Reveal><ResumeNovaShowcase /></Reveal>
          <Reveal><MediMartShowcase /></Reveal>
          <Reveal><PassportAIShowcase /></Reveal>
          <Reveal><DocumentSetterTeaser /></Reveal>
        </div>
      </LightboxProvider>
    </section>
  );
}
