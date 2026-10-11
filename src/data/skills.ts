import type { SkillGroup } from "./types";

export const skills: SkillGroup[] = [
  { category: "Development", blurb: "Languages and frameworks I build products with.", items: ["Python", "JavaScript", "HTML", "CSS", "React", "Next.js", "Flask"] },
  { category: "Backend / Data", blurb: "Where application data lives and how it gets served.", items: ["PostgreSQL", "Supabase", "Neon"] },
  { category: "AI", blurb: "Putting models to work inside real features.", items: ["AI APIs", "Prompt Engineering", "AI-assisted development"] },
  { category: "Tools", blurb: "The workflow around the code.", items: ["Git", "GitHub", "VS Code"] },
  { category: "Exploring", blurb: "Currently learning — the 3D and creative side.", items: ["Three.js", "React Three Fiber", "Blender"], learning: true },
];
