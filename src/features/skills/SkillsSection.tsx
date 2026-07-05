import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import {
  FiMonitor, FiServer, FiCode, FiCpu, FiDatabase, FiTool,
} from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SKILL_CATEGORIES, type SkillCategory } from "@/data/skills";

const ICON_MAP: Record<string, React.ElementType> = {
  FiMonitor, FiServer, FiCode, FiCpu, FiDatabase, FiTool,
};

function SkillCard({ category, index }: { category: SkillCategory; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const Icon = ICON_MAP[category.iconName] ?? FiCode;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: index * 0.07 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={cardRef}
        className="relative rounded-3xl bg-[#0a0f1e]/80 border border-white/[0.06] p-8 cursor-default group overflow-hidden h-full"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{
          borderColor: category.glowColor,
          boxShadow: `0 0 30px ${category.glowColor}, 0 8px 32px rgba(0,0,0,0.4)`,
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Gradient bg */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
          aria-hidden="true"
        />

        {/* Icon */}
        <div
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/[0.07]"
          style={{ background: `${category.glowColor.replace("0.3", "0.12")}` }}
        >
          <Icon
            className="w-6 h-6"
            style={{ color: category.glowColor.replace("rgba(", "").replace(", 0.3)", "") }}
            aria-hidden="true"
          />
          {/* Glow dot */}
          <div
            className="absolute inset-0 rounded-2xl blur-md opacity-40 group-hover:opacity-70 transition-opacity"
            style={{ background: category.glowColor }}
            aria-hidden="true"
          />
        </div>

        {/* Label + Description */}
        <h3 className="font-display font-semibold text-foreground mb-2" style={{ fontSize: "var(--fs-skill-card)" }}>
          {category.label}
        </h3>
        <p className="text-muted-foreground mb-6 leading-relaxed" style={{ fontSize: "var(--fs-badge)" }}>
          {category.description}
        </p>

        {/* Skill badges */}
        <div className="flex flex-wrap gap-2.5">
          {category.skills.map((skill) => (
            <span
              key={skill}
              className="px-3.5 py-1.5 rounded-lg font-mono text-muted-foreground bg-white/[0.04] border border-white/[0.06] group-hover:border-white/10 transition-colors"
              style={{ fontSize: "var(--fs-badge)" }}
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Corner accent */}
        <div
          className="absolute top-0 right-0 w-20 h-20 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at top right, ${category.glowColor} 0%, transparent 70%)` }}
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}

export function SkillsSection() {
  return (
    <SectionWrapper id="skills" label="Skills">
      {/* Background glow */}
      <div
        className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full blur-[160px] pointer-events-none opacity-15"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <SectionHeader
        eyebrow="Skills"
        title="Tech Stack &amp; Tools"
        description="The technologies I reach for when building — chosen because they solve real problems, not because they're trendy."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SKILL_CATEGORIES.map((cat, i) => (
          <SkillCard key={cat.id} category={cat} index={i} />
        ))}
      </div>

      {/* All badges row */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <p className="text-xs font-mono text-muted-foreground/60 tracking-widest uppercase mb-5">
          And everything else I pick up along the way
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["React", "Next.js", "Node", "Express", "MongoDB", "Firebase", "Python", "Java", "C++", "Git", "Docker", "Vercel", "Netlify", "Tailwind", "TypeScript", "Linux"].map((t) => (
            <span key={t} className="px-3 py-1 rounded-full font-mono text-xs text-muted-foreground bg-white/[0.03] border border-white/[0.05] hover:border-primary/20 hover:text-foreground transition-colors">
              {t}
            </span>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
