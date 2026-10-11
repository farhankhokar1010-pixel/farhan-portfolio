export interface SocialLink { label: string; href: string }

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  email: string;
  location: string;
  /** Display + dial formats of the phone number, and the WhatsApp chat link. */
  phone?: { display: string; tel: string };
  whatsappUrl?: string;
  socials: SocialLink[];
  /** Public path of the downloadable resume PDF (lives in /public). */
  resumeUrl: string;
  /** Leave undefined until Farhan confirms the wording; the UI simply hides it. */
  availability?: string;
}

export type ProjectStatus = "built" | "live" | "in-development";

export interface ProjectScreen {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}

export interface FeatureGroup { title: string; items: string[] }

export interface Project {
  slug: string;
  index: string;
  name: string;
  status: ProjectStatus;
  flagship?: boolean;
  tagline: string;
  summary: string;
  highlights: string[];
  stack: string[];
  screens: ProjectScreen[];
  features: FeatureGroup[];
  /** Fill these in when the project is online. While undefined, the buttons show "Coming soon". */
  links: { live?: string; github?: string };
}

export interface SkillGroup { category: string; blurb: string; items: string[]; learning?: boolean }

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  /** Display date, e.g. "29 July 2026". */
  date: string;
  kind: "certificate" | "internship" | "award" | "milestone" | "course" | "academic";
  summary: string;
  tags: string[];
  /** Certificate number / course code printed on the document. */
  credential?: string;
  verifyUrl?: string;
  /** Scan of the document, shown in the lightbox. */
  image: ProjectScreen;
}

export interface AboutStage {
  index: string;
  title: string;
  copy: string;
  /** Concrete evidence shown as small tags (projects / tech). */
  proof?: string[];
}

export interface EducationEntry {
  level: string;          // e.g. "Bachelor's Degree"
  degree: string;
  institution: string;
  campus?: string;
  period: string;
  status: "in-progress" | "completed";
  note?: string;          // e.g. "Currently Enrolled — 6th Semester"
  result: { value: string; suffix?: string; label: string };
  description: string;
}
