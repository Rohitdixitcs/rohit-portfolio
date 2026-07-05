export interface SkillCategory {
  id: string;
  label: string;
  description: string;
  gradient: string;
  glowColor: string;
  iconName: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    description: "Crafting fast, accessible, beautiful interfaces",
    gradient: "from-indigo-500/20 to-blue-500/10",
    glowColor: "rgba(99,102,241,0.3)",
    iconName: "FiMonitor",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "HTML5", "CSS3", "JavaScript"],
  },
  {
    id: "backend",
    label: "Backend",
    description: "Building reliable, scalable server-side systems",
    gradient: "from-violet-500/20 to-purple-500/10",
    glowColor: "rgba(139,92,246,0.3)",
    iconName: "FiServer",
    skills: ["Node.js", "Express.js", "REST APIs", "JWT Auth", "Middleware", "MVC"],
  },
  {
    id: "programming",
    label: "Languages",
    description: "Fluent in the languages that matter",
    gradient: "from-cyan-500/20 to-teal-500/10",
    glowColor: "rgba(6,182,212,0.3)",
    iconName: "FiCode",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "C++", "Bash"],
  },
  {
    id: "ai",
    label: "AI / ML",
    description: "Integrating intelligence into every product",
    gradient: "from-orange-500/20 to-amber-500/10",
    glowColor: "rgba(249,115,22,0.3)",
    iconName: "FiCpu",
    skills: ["OpenAI API", "LangChain", "Prompt Engineering", "AI Agents", "RAG", "Embeddings"],
  },
  {
    id: "database",
    label: "Database",
    description: "Designing data models that scale",
    gradient: "from-emerald-500/20 to-green-500/10",
    glowColor: "rgba(16,185,129,0.3)",
    iconName: "FiDatabase",
    skills: ["MongoDB", "Firebase", "PostgreSQL", "Redis", "Mongoose", "SQL"],
  },
  {
    id: "tools",
    label: "Tools & DevOps",
    description: "Shipping with confidence using the right stack",
    gradient: "from-rose-500/20 to-pink-500/10",
    glowColor: "rgba(244,63,94,0.3)",
    iconName: "FiTool",
    skills: ["Git", "GitHub", "Docker", "Vercel", "Netlify", "Vite", "Linux", "Figma"],
  },
];
