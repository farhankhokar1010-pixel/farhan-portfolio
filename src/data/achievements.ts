import type { Achievement } from "./types";

// Real documents supplied by Farhan. Never add an entry that isn't backed by a certificate.
// Newest first.
export const achievements: Achievement[] = [
  {
    id: "act-ai",
    title: "ACT AI — National AI Training Programme (Cycle 1)",
    issuer: "AI Skillbridge · Prime Minister's Youth Programme, with HEC and NAVTTC",
    date: "29 July 2026",
    kind: "certificate",
    summary:
      "Eight-week national programme (8 June – 29 July 2026) delivered live to HEC Smart Classrooms. Completed attendance, the nationally proctored midterm, the final assessment and the Final Course Project.",
    tags: ["AI Foundations", "Generative AI", "Agentic AI", "AI Tools & Productivity", "Freelancing with AI"],
    credential: "ACTAI-C1-2026-01054-ESH9",
    verifyUrl: "https://actai.aiskillbridge.pk/v/RQN3FGT6D58TQK8F",
    image: {
      src: "/images/certificates/act-ai.webp",
      thumb: { src: "/images/certificates/act-ai.sm.webp", width: 640, height: 452 },
      alt: "ACT AI Cycle 1 certificate of completion awarded to Muhammad Farhan",
      caption: "ACT AI — Certificate of Completion",
      width: 1400,
      height: 989,
    },
  },
  {
    id: "iub-internship",
    title: "Internship Completion — Section Help Desk",
    issuer: "Directorate of Information Technology, The Islamia University of Bahawalpur",
    date: "28 April – 28 June 2026",
    kind: "internship",
    summary: "Two-month internship in the Section Help Desk of the university's IT directorate.",
    tags: ["IT Help Desk", "University IT", "Internship"],
    image: {
      src: "/images/certificates/internship-iub.webp",
      thumb: { src: "/images/certificates/internship-iub.sm.webp", width: 560, height: 396 },
      alt: "Certificate of internship completion from the IUB Directorate of Information Technology",
      caption: "IUB Directorate of IT — Internship Certificate",
      width: 1400,
      height: 991,
    },
  },
  {
    id: "python-ibm",
    title: "Python 101 for Data Science",
    issuer: "Cognitive Class · IBM Developer Skills Network",
    date: "7 May 2024",
    kind: "certificate",
    summary: "Course PY0101EN, provided by IBM on cognitiveclass.ai. Completed with a passing grade.",
    tags: ["Python", "Data Science", "IBM"],
    credential: "PY0101EN",
    verifyUrl: "https://courses.cognitiveclass.ai/certificates/cc729db74a6a41b0a15436e5d874c204",
    image: {
      src: "/images/certificates/python-ibm.webp",
      thumb: { src: "/images/certificates/python-ibm.sm.webp", width: 640, height: 458 },
      alt: "Cognitive Class Python 101 for Data Science certificate awarded to Muhammad Farhan",
      caption: "IBM / Cognitive Class — Python 101 for Data Science",
      width: 1400,
      height: 1002,
    },
  },
];
