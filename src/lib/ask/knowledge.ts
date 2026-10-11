import { aboutStages } from "@/data/about";
import { achievements } from "@/data/achievements";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { resumeExperience, resumeInterests, resumeLanguages } from "@/data/resume";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";

const statusText = {
  built: "Built and working locally; not publicly online yet (live demo and source links are coming soon).",
  live: "Live.",
  "in-development": "In development; not finished.",
} as const;

/**
 * The approved facts the assistant may state about Farhan.
 * Generated from the same data files that power the site, so the two can never disagree.
 */
export function buildKnowledge(): string {
  const L: string[] = [];
  const edu = education[0];

  L.push("# Farhan — overview");
  L.push(`Name: ${profile.name}`);
  L.push(`Role: ${profile.title}`);
  L.push(`Tagline: ${profile.tagline}`);
  L.push("Based in: Pakistan.");
  L.push(`Currently studying: ${edu.degree} at ${edu.institution} (${edu.period}), ${edu.note ?? edu.status}. CGPA ${edu.result.value} ${edu.result.suffix ?? ""}.`.replace(/\s+\./, "."));
  L.push("Works with: full-stack web applications (primarily Python and Flask), database management, AI/ML API integration, and UI/UX design.");

  L.push("\n# Skills (grouped, no ratings)");
  for (const g of skills) L.push(`- ${g.category}${g.learning ? " (currently learning)" : ""}: ${g.items.join(", ")}`);

  L.push("\n# Education");
  for (const e of education) {
    L.push(`- ${e.level}: ${e.degree}, ${e.institution}${e.campus ? ` (${e.campus})` : ""}. ${e.period}. ${e.status === "in-progress" ? "In progress" : "Completed"}${e.note ? ` — ${e.note}` : ""}. Result: ${e.result.value}${e.result.suffix ? ` ${e.result.suffix}` : ""} (${e.result.label}). ${e.description}`);
  }

  L.push("\n# Projects");
  for (const p of projects) {
    L.push(`\n## ${p.name}${p.flagship ? " (flagship project)" : ""}`);
    L.push(`Status: ${statusText[p.status]}`);
    L.push(`Tagline: ${p.tagline}`);
    L.push(`Summary: ${p.summary}`);
    if (p.highlights.length) L.push(`Highlights: ${p.highlights.join("; ")}`);
    if (p.stack.length) L.push(`Tech stack: ${p.stack.join(", ")}`);
    for (const f of p.features) L.push(`${f.title}: ${f.items.join("; ")}`);
    if (p.links.live) L.push(`Live demo: ${p.links.live}`);
    if (p.links.github) L.push(`Source code: ${p.links.github}`);
  }

  L.push("\n# How Farhan describes his journey");
  for (const s of aboutStages) L.push(`${s.index} ${s.title}: ${s.copy}`);

  L.push("\n# This website");
  L.push("Built with Next.js, React, TypeScript, Tailwind CSS, GSAP and Three.js (React Three Fiber). The 3D character is a model of Farhan. Sections: Work, About, Skills, Education, Resume, Certificates, Contact. Ask Farhan runs on Groq (model openai/gpt-oss-20b) through a server-side API route; the API key is never exposed to the browser.");

  L.push("\n# Experience");
  for (const x of resumeExperience) L.push(`- ${x.role}, ${x.org} (${x.period}). ${x.note}`);

  L.push("\n# Certificates and internship (real documents shown in the Certificates section)");
  for (const a of achievements) {
    L.push(`- ${a.title} — ${a.issuer} (${a.date}). ${a.summary}${a.tags.length ? ` Topics: ${a.tags.join(", ")}.` : ""}${a.credential ? ` Reference: ${a.credential}.` : ""}${a.verifyUrl ? ` Verify: ${a.verifyUrl}` : ""}`);
  }

  L.push("\n# Personal");
  L.push(`Languages: ${resumeLanguages.join(", ")}. Interests: ${resumeInterests.join(", ")}. Location: ${profile.location}.`);

  L.push("\n# Contact and resume");
  L.push(`Email: ${profile.email}`);
  if (profile.phone) L.push(`Phone: ${profile.phone.display} (Pakistan, ${profile.phone.tel}). WhatsApp: ${profile.whatsappUrl ?? "same number"}`);
  for (const s of profile.socials) L.push(`${s.label}: ${s.href}`);
  L.push("The Contact section has a form that opens Gmail or the visitor's email app with the message filled in (nothing is sent automatically).");
  L.push(`A downloadable PDF resume is in the Resume section (${profile.resumeUrl}).`);
  L.push(profile.availability ? `Availability: ${profile.availability}` : "Not published: availability for work, rates and a Fiverr profile. For availability or rates, tell visitors to email Farhan directly.");

  return L.join("\n");
}
