import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Skills } from "@/components/skills/Skills";
import { Education } from "@/components/education/Education";
import { Projects } from "@/components/projects/Projects";
import { ResumeSection } from "@/components/resume/ResumeSection";
import { Achievements } from "@/components/achievements/Achievements";
import { Contact } from "@/components/contact/Contact";

export default function Page() {
  return (
    <main id="main">
      <Hero />
      <Projects />
      <About />
      <Skills />
      <Education />
      <ResumeSection />
      <Achievements />
      <Contact />
    </main>
  );
}
