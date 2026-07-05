export interface TimelineStep {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  current?: boolean;
  iconName: string;
}

export const JOURNEY_STEPS: TimelineStep[] = [
  {
    id: "html-css",
    year: "Early 2025",
    title: "First Line of Code",
    subtitle: "HTML & CSS",
    description:
      "Started with the fundamentals — building static pages, learning the box model, and falling in love with the visual feedback loop of web development.",
    tags: ["HTML5", "CSS3", "Responsive Design"],
    iconName: "FiCode2",
  },
  {
    id: "javascript",
    year: "Mid 2025",
    title: "JavaScript Clicked",
    subtitle: "Core JS & DOM",
    description:
      "DOM manipulation, event listeners, async/await, fetch API. Built small interactive projects that started feeling like real software.",
    tags: ["JavaScript", "DOM", "Async/Await", "Fetch API"],
    iconName: "FiZap",
  },
  {
    id: "react",
    year: "Late 2025",
    title: "React Changed Everything",
    subtitle: "Modern UI Development",
    description:
      "Discovered component-driven development. Hooks, state management, and the React ecosystem opened up a new way of thinking about UIs.",
    tags: ["React", "Hooks", "State", "JSX"],
    iconName: "FiLayers",
  },
  {
    id: "typescript",
    year: "Late 2025",
    title: "TypeScript & Tooling",
    subtitle: "Type-safe Development",
    description:
      "Added TypeScript to the stack. Vite, ESLint, Tailwind CSS — started building with professional-grade tooling and never looked back.",
    tags: ["TypeScript", "Vite", "Tailwind", "ESLint"],
    iconName: "FiShield",
  },
  {
    id: "backend",
    year: "Early 2026",
    title: "Full Stack Leap",
    subtitle: "Node.js & Backend",
    description:
      "Learned Node.js and Express to build REST APIs. Connected MongoDB databases, implemented JWT auth, and shipped my first full-stack application.",
    tags: ["Node.js", "Express", "MongoDB", "REST API"],
    iconName: "FiServer",
  },
  {
    id: "ai",
    year: "2026",
    title: "Building with AI",
    subtitle: "AI Integration & Agents",
    description:
      "Integrated OpenAI APIs into projects. Explored LangChain, prompt engineering, and RAG systems. Building AI-powered products that solve real problems.",
    tags: ["OpenAI", "LangChain", "RAG", "AI Agents"],
    iconName: "FiCpu",
  },
  {
    id: "now",
    year: "Now",
    title: "Seeking Opportunities",
    subtitle: "Ready for Internship",
    description:
      "10+ projects shipped, 1+ year of learning, building open source tools, and actively looking for an internship to grow inside a great engineering team.",
    tags: ["Open to Work", "Internship", "Remote OK"],
    current: true,
    iconName: "FiTarget",
  },
];

export const EDUCATION = {
  institution: "ABES Engineering College",
  degree: "B.Tech in Computer Science",
  location: "Ghaziabad, Uttar Pradesh",
  period: "2025 – 2029",
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks",
    "Software Engineering",
  ],
  achievements: [
    "Built and deployed 10+ projects during first year",
    "Active contributor to college developer community",
    "Self-taught Full Stack and AI development",
  ],
};
