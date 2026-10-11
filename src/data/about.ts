import type { AboutStage } from "./types";

// Draft copy built only from facts in the project plan. Edit freely.
export const aboutStages: AboutStage[] = [
  {
    index: "01",
    title: "Student",
    copy: "It starts with learning how software really works — and then building things to prove it, instead of stopping at the theory.",
  },
  {
    index: "02",
    title: "Developer",
    copy: "Full-stack web applications in Python and Flask: the database, the backend logic, and the interface people actually touch.",
    proof: ["Resume Nova", "Medimart", "Flask", "PostgreSQL"],
  },
  {
    index: "03",
    title: "AI Explorer",
    copy: "Wiring AI APIs and prompt engineering into real product features, so AI is a working part of the app rather than a demo.",
    proof: ["AI features in Resume Nova", "Prompt engineering"],
  },
  {
    index: "04",
    title: "Creative Builder",
    copy: "UI and design thinking, plus experiments in 3D. This portfolio — a 3D character built from my own likeness — is one of those experiments.",
    proof: ["Three.js", "React Three Fiber", "Blender"],
  },
];
