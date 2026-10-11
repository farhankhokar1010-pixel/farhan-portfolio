import { aboutStages } from "@/data/about";
import { achievements } from "@/data/achievements";
import { education } from "@/data/education";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { resumeInterests, resumeLanguages } from "@/data/resume";

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));
const soon = "His projects are built but not online yet — live demo and source links are coming soon.";

/** Offline answers straight from the portfolio data. Used when no Groq key is configured. */
export function answerLocally(question: string): string {
  const q = question.toLowerCase();

  for (const p of projects) {
    const keys = [p.name.toLowerCase(), p.slug.replace(/-/g, " "), ...(p.slug === "passportai" ? ["passport"] : [])];
    if (keys.some((k) => q.includes(k))) {
      const base = `${p.name}: ${p.tagline}\n\n${p.summary}`;
      if (p.status === "in-development") return `${base}\n\nIt's still in development.`;
      return `${base}\n\n${p.highlights.map((h) => `- ${h}`).join("\n")}\n\nTech: ${p.stack.join(", ")}.\n\n${soon}`;
    }
  }
  if (has(q, "certif", "achievement", "award", "intern", "act ai", "ibm", "cognitive", "help desk", "course")) {
    return `Certificates and internship:\n\n${achievements.map((a) => `- **${a.title}** — ${a.issuer} (${a.date}).`).join("\n")}\n\nYou can view each document in the Certificates section.`;
  }
  if (has(q, "project", "built", "work on", "portfolio", "made")) {
    return `Farhan's featured projects:\n\n${projects.map((p) => `- **${p.name}** — ${p.tagline}`).join("\n")}\n\nAsk about any of them for details. ${soon}`;
  }
  if (has(q, "tech", "skill", "stack", "language", "framework", "tools", "use")) {
    return `Here is what Farhan works with:\n\n${skills.map((g) => `- **${g.category}**${g.learning ? " (learning)" : ""}: ${g.items.join(", ")}`).join("\n")}`;
  }
  if (has(q, "educat", "study", "university", "degree", "cgpa", "school", "college", "iub", "student")) {
    return `Education:\n\n${education.map((e) => `- **${e.degree}** — ${e.institution} (${e.period}). ${e.result.label}: ${e.result.value}${e.result.suffix ? " " + e.result.suffix : ""}.`).join("\n")}`;
  }
  if (has(q, "avail", "hire", "hiring", "job", "freelance", "contact", "email", "reach", "rate", "github", "linkedin")) {
    const links = profile.socials.map((x) => `[${x.label}](${x.href})`).join(" · ");
    const phone = profile.phone ? ` or call/WhatsApp ${profile.phone.display}` : "";
    return `You can reach Farhan at ${profile.email}${phone}, or via ${links}. The Contact section also has a form that opens Gmail or your email app.\n\n${profile.availability ?? "His availability and rates aren't listed on the site, so please ask him directly by email."}`;
  }
  if (has(q, "resume", "cv", "download")) {
    return "Farhan's resume is in the Resume section: an interactive version plus a PDF you can download.";
  }
  if (has(q, "language", "speak", "hobby", "hobbies", "cricket", "gaming")) {
    return `Languages: ${resumeLanguages.join(", ")}. Interests: ${resumeInterests.join(", ")}.`;
  }
  if (has(q, "interest", "passion", "learning", "explor", "like")) {
    const exploring = skills.find((g) => g.learning);
    return `Farhan describes his path as ${aboutStages.map((s) => s.title).join(" → ")}. He's currently exploring ${exploring?.items.join(", ")}.`;
  }
  if (has(q, "website", "site", "3d", "model", "how was", "built with")) {
    return "This site is built with Next.js, React, TypeScript, Tailwind CSS, GSAP and Three.js (React Three Fiber). The 3D character is a model of Farhan, and Ask Farhan runs through a server-side API route so no key reaches your browser.";
  }
  if (has(q, "who", "what does", "about", "introduc", "hello", "hi ", "salam", "assalam", "hey")) {
    return `${profile.name} is a ${profile.title.toLowerCase()} from Pakistan and a BS Software Engineering student at IUB. He builds full-stack web apps, mainly with Python and Flask, with work spanning databases, AI API integration and UI/UX design.\n\nTry asking about his projects, skills or education.`;
  }
  return "I'm running in offline mode right now, so I can answer questions about Farhan's projects, skills, education and this site. Try one of those.";
}
