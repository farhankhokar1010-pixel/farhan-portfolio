/**
 * Interactive-resume content. Everything here is taken from Farhan's resume PDF and certificates.
 * Education and skills are NOT repeated: the resume reads them from education.ts / skills.ts.
 */
export const resumeSummary =
  "Software engineer with a strong foundation in full-stack web development, proficient in Flask, Python, HTML, CSS, JavaScript and Oracle database integration. Student at The Islamia University of Bahawalpur, experienced in designing scalable web applications.";

/** Bullets per project slug (see projects.ts), condensed from the resume PDF. */
export const resumeProjects: { slug: string; bullets: string[] }[] = [
  {
    slug: "resume-nova",
    bullets: [
      "Designed and implemented an AI-driven platform that generates customizable resumes and cover letters across multiple templates.",
      "Developed an automated font-pairing system for visual appeal and consistency across all documents.",
      "Integrated a job-finder feature that matches candidate profiles with relevant positions.",
      "Built an AI assistant that guides users through resume creation with real-time suggestions and edits.",
    ],
  },
  {
    slug: "medimart",
    bullets: [
      "Implemented end-to-end order processing and payment routing, with accurate receipt generation and order tracking.",
      "Designed user, staff and super-admin interfaces to streamline workflow.",
      "Developed staff application modules for operational and administrative tasks in a pharmaceutical e-commerce setting.",
    ],
  },
  {
    slug: "passportai",
    bullets: [
      "Developed a 10-phase pipeline for passport-size photo generation.",
      "Implemented human detection and pose-correction modules for accurate subject positioning.",
      "Integrated background removal and blue studio lighting adjustments to produce high-quality passport photos.",
    ],
  },
];

export const resumeExperience = [
  {
    role: "Intern — Section Help Desk",
    org: "Directorate of Information Technology, The Islamia University of Bahawalpur",
    period: "28 April 2026 – 28 June 2026",
    note: "Two-month internship, completed. Certificate of completion is in the Certificates section.",
  },
];

export const resumeLanguages = ["English", "Urdu", "Punjabi"];
export const resumeInterests = ["Cricket", "Gaming", "Learning New Technologies"];
