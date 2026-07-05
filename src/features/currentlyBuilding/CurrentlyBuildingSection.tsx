import { motion } from "motion/react";
import { FiCpu, FiUsers, FiTool, FiZap } from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface BuildingItem {
  id: string;
  title: string;
  description: string;
  progress: number;
  icon: React.ElementType;
  accent: string;
}

const BUILDING_ITEMS: BuildingItem[] = [
  {
    id: "ai-portfolio-assistant",
    title: "AI Portfolio Assistant",
    description: "An AI assistant that can answer recruiter questions about my projects, skills, and experience.",
    progress: 70,
    icon: FiCpu,
    accent: "#818cf8",
  },
  {
    id: "campus-platform",
    title: "Campus Platform",
    description: "A platform for students featuring resources, productivity tools, and community features.",
    progress: 55,
    icon: FiUsers,
    accent: "#c084fc",
  },
  {
    id: "developer-toolkit",
    title: "Developer Toolkit",
    description: "A growing collection of utilities and productivity tools for developers.",
    progress: 90,
    icon: FiTool,
    accent: "#4ade80",
  },
  {
    id: "automation-projects",
    title: "Automation Projects",
    description: "Telegram bots, automation scripts, APIs, and workflow tools.",
    progress: 40,
    icon: FiZap,
    accent: "#fbbf24",
  },
];

function BuildingCard({ item, index }: { item: BuildingItem; index: number }) {
  const Icon = item.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative rounded-3xl p-[1px] overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${item.accent}55, transparent 60%)` }}
    >
      <div
        className="relative h-full rounded-[calc(1.5rem-1px)] p-7 bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] transition-all duration-300 group-hover:bg-white/[0.05]"
        style={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
      >
        <div
          className="absolute -inset-px rounded-[calc(1.5rem-1px)] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: `0 0 40px ${item.accent}33` }}
          aria-hidden="true"
        />

        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center border"
            style={{ background: `${item.accent}1a`, borderColor: `${item.accent}40` }}
          >
            <Icon className="w-5 h-5" style={{ color: item.accent }} aria-hidden="true" />
          </div>
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-medium border"
            style={{ color: item.accent, borderColor: `${item.accent}40`, background: `${item.accent}12` }}
          >
            Building...
          </span>
        </div>

        <h3 className="font-display font-semibold text-lg text-foreground mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{item.description}</p>

        <div>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-muted-foreground font-mono">Progress</span>
            <span className="font-display font-semibold text-foreground">{item.progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${item.accent}88, ${item.accent})` }}
              initial={{ width: 0 }}
              whileInView={{ width: `${item.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function CurrentlyBuildingSection() {
  return (
    <SectionWrapper id="currently-building" label="Currently Building">
      <SectionHeader
        eyebrow="Work in Progress"
        title="Currently Building"
        description="A glimpse into the products and ideas I'm actively working on."
      />

      <div className="grid sm:grid-cols-2 gap-6">
        {BUILDING_ITEMS.map((item, i) => (
          <BuildingCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </SectionWrapper>
  );
}
