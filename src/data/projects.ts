import type { Project } from "@/types";

export const PROJECTS: Project[] = [
  {
    id: "student-productivity-dashboard",
    title: "Student Productivity Dashboard Pro",
    description:
      "AI-powered productivity dashboard built for students. Tracks assignments, study streaks, and analytics. Features a PWA with offline support and real-time progress insights.",
    longDescription:
      "A comprehensive productivity platform that helps students stay organized and focused. Built with React + TypeScript, it includes assignment tracking with deadlines, Pomodoro-style study sessions, streak tracking, interactive analytics charts, and a full PWA architecture for offline use.",
    tags: ["AI", "PWA", "Productivity", "Analytics"],
    techStack: ["React", "TypeScript", "Recharts", "PWA", "LocalStorage API"],
    status: "shipped",
    featured: true,
    year: 2025,
    demoUrl: "https://dixitdashboard.netlify.app/",
    repoUrl: "https://github.com/Rohitdixitcs/student-productivity-dashboard",
    accentColor: "#6366f1",
    imageUrl: "/projects/student-productivity-dashboard.jpg",
    imageUrlWebp: "/projects/student-productivity-dashboard.webp",
  },
  {
    id: "rdx-tools",
    title: "RDX Tools",
    description:
      "A daily-use productivity suite featuring a calculator, translator, QR generator, weather dashboard, password manager, and 10+ other useful micro-tools — all in one fast PWA.",
    longDescription:
      "RDX Tools consolidates the micro-utilities developers and students reach for daily into a single, fast, installable PWA. Built with Vite for sub-100ms load time. Integrates multiple public APIs including weather, translation, and QR generation.",
    tags: ["Productivity", "PWA", "Multi-tool", "API", "Tools"],
    techStack: ["React", "Vite", "PWA", "REST APIs", "CSS Modules"],
    status: "shipped",
    featured: true,
    year: 2025,
    demoUrl: "https://rdxtools.netlify.app/",
    repoUrl: "https://github.com/Rohitdixitcs/RDX-Tools-",
    accentColor: "#f59e0b",
    imageUrl: "/projects/rdx-tools.jpg",
    imageUrlWebp: "/projects/rdx-tools.webp",
  },
  {
    id: "abes-sgpa-calculator",
    title: "ABES SGPA & CGPA Calculator",
    description:
      "Semester-wise SGPA & CGPA calculator purpose-built for ABES Engineering College autonomous students. Supports all branches, PDF export, and accurate grading formula.",
    longDescription:
      "A precision academic tool built specifically for the ABES Engineering College autonomous grading system. Students enter their subject marks and instantly get accurate SGPA and CGPA calculations. Supports PDF export for official records, handles all branches, and runs entirely client-side.",
    tags: ["Education", "TypeScript", "PDF Export", "Tools"],
    techStack: ["React", "TypeScript", "PDF.js", "Tailwind CSS"],
    status: "shipped",
    featured: true,
    year: 2025,
    demoUrl: "https://abessgpa.netlify.app/",
    repoUrl: "",
    accentColor: "#10b981",
    imageUrl: "/projects/abes-sgpa-calculator.jpg",
    imageUrlWebp: "/projects/abes-sgpa-calculator.webp",
  },
];
