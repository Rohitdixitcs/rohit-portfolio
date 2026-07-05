import type { LabItem } from "@/types";

export const LAB_ITEMS: LabItem[] = [
  {
    id: "ai-assistant",
    title: "Personal AI Assistant",
    description:
      "A context-aware AI assistant that learns from your notes, calendar, and habits to proactively surface what you need before you ask.",
    status: "building",
    tags: ["OpenAI", "LangChain", "RAG", "Vector DB"],
    accentColor: "#6366f1",
  },
  {
    id: "campus-platform",
    title: "Campus Connect",
    description:
      "A unified platform for ABES students — notices, timetables, assignment tracking, and peer collaboration in one place.",
    status: "prototype",
    tags: ["Next.js", "MongoDB", "Real-time", "PWA"],
    accentColor: "#8b5cf6",
  },
  {
    id: "dev-toolkit",
    title: "DevKit CLI",
    description:
      "An open-source command-line toolkit that scaffolds projects, manages environment variables, and automates repetitive development tasks.",
    status: "concept",
    tags: ["Node.js", "CLI", "Open Source", "DX"],
    accentColor: "#06b6d4",
  },
  {
    id: "automation",
    title: "StudyFlow AI",
    description:
      "AI-driven study planner that analyzes your syllabus, past performance, and available time to generate optimized revision schedules.",
    status: "concept",
    tags: ["Python", "OpenAI", "Scheduling", "ML"],
    accentColor: "#f59e0b",
  },
  {
    id: "open-source",
    title: "React Component Library",
    description:
      "A premium open-source UI library built for dark-first developer portfolios and SaaS applications, inspired by Linear and Vercel.",
    status: "building",
    tags: ["React", "TypeScript", "Storybook", "npm"],
    accentColor: "#10b981",
  },
];

export const LAB_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  concept: { label: "Concept", color: "#64748b" },
  prototype: { label: "Prototype", color: "#f59e0b" },
  building: { label: "Building", color: "#4ade80" },
  paused: { label: "Paused", color: "#ef4444" },
};
