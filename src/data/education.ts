import type { EducationEntry } from "./types";

export const educationIntro = {
  kicker: "My Academic Journey",
  text: "My academic journey reflects a strong foundation in science, analytical thinking, and software engineering. From building my fundamentals in school to pursuing a degree in Software Engineering, I continue to develop the technical knowledge and problem-solving skills needed to build meaningful digital solutions.",
};

export const education: EducationEntry[] = [
  {
    level: "Bachelor's Degree",
    degree: "BS Software Engineering",
    institution: "The Islamia University of Bahawalpur (IUB)",
    campus: "Baghdad-ul-Jadeed Campus",
    period: "2024 – 2028 (Expected)",
    status: "in-progress",
    note: "Currently Enrolled — 6th Semester",
    result: { value: "3.94", suffix: "/ 4.00", label: "CGPA" },
    description:
      "Currently pursuing a bachelor's degree in Software Engineering, developing a foundation in software development, programming, system design, and modern technology. Alongside my academic studies, I work on practical software projects that help me apply my knowledge to real-world problems.",
  },
  {
    level: "Intermediate",
    degree: "Intermediate in Pre-Engineering",
    institution: "Government Graduate College 18 Hazari, District Jhang",
    period: "2021 – 2023",
    status: "completed",
    result: { value: "80%", label: "Final result" },
    description:
      "Completed intermediate education in the Pre-Engineering group, strengthening my understanding of mathematics, analytical reasoning, and scientific principles that support my journey into software engineering.",
  },
  {
    level: "Matriculation",
    degree: "Secondary School Certificate (Matriculation)",
    institution: "Government High School Wasu Astana, Jhang",
    period: "Completed in 2021",
    status: "completed",
    result: { value: "98%", label: "1,078 / 1,100" },
    description:
      "Achieved an excellent academic result in secondary education, establishing a strong foundation for further studies in science and technology.",
  },
];
