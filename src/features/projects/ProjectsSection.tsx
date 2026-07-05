import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FiExternalLink, FiGithub, FiArrowRight } from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TiltCard } from "@/components/shared/TiltCard";
import { PROJECTS } from "@/data/projects";
import type { Project } from "@/types";
import { trackEvent, recordInteraction } from "@/lib/analytics";

// ─── Browser Mockup ────────────────────────────────────────────────────────

const PROJECT_UI_ACCENT: Record<string, { bg: string; bar: string; dot1: string; dot2: string; dot3: string }> = {
  "student-productivity-dashboard": {
    bg: "rgba(99,102,241,0.15)",
    bar: "rgba(99,102,241,0.4)",
    dot1: "#ef4444", dot2: "#fbbf24", dot3: "#22c55e",
  },
  "rdx-tools": {
    bg: "rgba(245,158,11,0.15)",
    bar: "rgba(245,158,11,0.4)",
    dot1: "#ef4444", dot2: "#fbbf24", dot3: "#22c55e",
  },
  "abes-sgpa-calculator": {
    bg: "rgba(16,185,129,0.15)",
    bar: "rgba(16,185,129,0.4)",
    dot1: "#ef4444", dot2: "#fbbf24", dot3: "#22c55e",
  },
};

function BrowserMockup({ project, priority }: { project: Project; priority?: boolean }) {
  const accent = PROJECT_UI_ACCENT[project.id];

  return (
    <div>
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.07] shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0d1428]/90 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" aria-hidden="true" />
          </div>
          <div className="flex-1 mx-4">
            <div
              className="rounded-md px-3 py-1 text-xs font-mono text-muted-foreground border border-white/[0.05] truncate"
              style={{ background: accent?.bg ?? "rgba(255,255,255,0.03)" }}
            >
              {project.demoUrl ?? `rohitdixit.dev/${project.id}`}
            </div>
          </div>
        </div>

        {/* Viewport — real screenshot */}
        <div className="relative overflow-hidden bg-[#0a0f1e]">
          {project.imageUrl ? (
            <picture>
              {project.imageUrlWebp && <source srcSet={project.imageUrlWebp} type="image/webp" />}
              <img
                src={project.imageUrl}
                alt={`${project.title} — live product screenshot`}
                width={1600}
                height={850}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-auto block"
              />
            </picture>
          ) : (
            <div className="h-52 sm:h-64 bg-gradient-to-br from-slate-900/60 to-[#050816]" />
          )}
          {/* subtle bottom fade so it blends with the card edge */}
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0a0f1e]/70 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Reflection */}
      <div
        className="relative h-16 sm:h-20 -mt-1 overflow-hidden rounded-b-2xl opacity-25 pointer-events-none select-none"
        style={{
          transform: "scaleY(-1)",
          maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 80%)",
          WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 80%)",
        }}
        aria-hidden="true"
      >
        {project.imageUrl && (
          <img src={project.imageUrl} alt="" aria-hidden="true" className="w-full h-auto block" loading="lazy" />
        )}
      </div>
    </div>
  );
}

// ─── Single Project Showcase ───────────────────────────────────────────────

function ProjectShowcase({ project, index }: { project: Project; index: number }) {
  const isReversed = index % 2 !== 0;
  const num = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      className={`flex flex-col ${isReversed ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-8 lg:gap-12`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      aria-label={project.title}
      data-cursor="PROJECT"
    >
      {/* Browser mockup */}
      <motion.div
        className="w-full lg:w-[58%] relative"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
      >
        {/* Ambient glow */}
        <div
          className="absolute -inset-4 rounded-3xl blur-2xl opacity-20 pointer-events-none"
          style={{ background: `radial-gradient(circle, ${project.accentColor ?? "#6366f1"} 0%, transparent 70%)` }}
          aria-hidden="true"
        />
        <TiltCard maxTilt={4} data-cursor="VIEW">
          <BrowserMockup project={project} priority={index === 0} />
        </TiltCard>
      </motion.div>

      {/* Content */}
      <div className="w-full lg:w-[45%] flex flex-col gap-5">
        {/* Number */}
        <span
          className="font-display font-bold text-6xl lg:text-8xl leading-none select-none"
          style={{
            background: `linear-gradient(135deg, ${project.accentColor ?? "#6366f1"}22, ${project.accentColor ?? "#6366f1"}55)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          aria-hidden="true"
        >
          {num}
        </span>

        {/* Tag */}
        <div className="flex gap-2">
          {project.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="px-2.5 py-1 rounded-full font-mono text-xs border"
              style={{
                color: project.accentColor ?? "#818cf8",
                borderColor: `${project.accentColor ?? "#6366f1"}30`,
                background: `${project.accentColor ?? "#6366f1"}10`,
              }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3
          className="font-display font-bold text-foreground leading-tight"
          style={{ fontSize: "var(--fs-project-title)" }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-muted-foreground leading-relaxed" style={{ fontSize: "var(--fs-body)" }}>{project.description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((t) => (
            <span key={t} className="px-3 py-1 rounded-lg font-mono text-xs text-muted-foreground bg-white/[0.04] border border-white/[0.06]">
              {t}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          {project.demoUrl && (
            <motion.a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => { trackEvent("project_click", { project: project.id }); recordInteraction("project"); }}
              data-cursor="LIVE"
              data-magnetic
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-medium text-sm text-primary-foreground transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              style={{ background: project.accentColor ?? "#6366f1" }}
              whileHover={{ scale: 1.03, y: -2, boxShadow: `0 8px 24px ${project.accentColor ?? "#6366f1"}50` }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <FiExternalLink className="w-3.5 h-3.5" />
              Live Demo
            </motion.a>
          )}
          {project.repoUrl && (
            <motion.a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-medium text-sm text-foreground bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.08] hover:border-white/[0.12] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              <FiGithub className="w-3.5 h-3.5" />
              GitHub
            </motion.a>
          )}
        </div>
      </div>
    </motion.article>
  );
}

// ─── Section ───────────────────────────────────────────────────────────────

const FILTER_KEY = "rd_project_filter_v1";
const FILTERS = ["All", "React", "AI", "Tools"] as const;
type Filter = (typeof FILTERS)[number];

function matchesFilter(project: Project, filter: Filter): boolean {
  if (filter === "All") return true;
  return project.tags.includes(filter) || project.techStack?.includes(filter) === true;
}

function FilterBar({ active, onChange }: { active: Filter; onChange: (f: Filter) => void }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-12" role="tablist" aria-label="Filter projects by category">
      {FILTERS.map((filter) => {
        const isActive = active === filter;
        return (
          <button
            key={filter}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter)}
            className={`relative px-5 py-2.5 rounded-full font-display font-medium text-sm transition-colors ${
              isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="project-filter-pill"
                className="absolute inset-0 rounded-full bg-white/[0.06] border border-primary/30 shadow-[0_0_16px_rgba(99,102,241,0.25)]"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{filter}</span>
          </button>
        );
      })}
    </div>
  );
}

export function ProjectsSection() {
  const [filter, setFilter] = useState<Filter>(() => {
    try {
      const stored = window.localStorage.getItem(FILTER_KEY);
      return (FILTERS as readonly string[]).includes(stored ?? "") ? (stored as Filter) : "All";
    } catch { return "All"; }
  });

  const handleFilterChange = (next: Filter) => {
    setFilter(next);
    try { window.localStorage.setItem(FILTER_KEY, next); } catch { /* ignore */ }
  };

  const filteredProjects = PROJECTS.filter((p) => p.featured && matchesFilter(p, filter));

  return (
    <SectionWrapper id="projects" label="Featured Projects">
      {/* Ambient */}
      <div
        className="absolute bottom-0 left-0 w-[600px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.6) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <SectionHeader
        eyebrow="Featured Projects"
        title="Things I've Built"
        description="Production-shipped projects with real users, real code, and real impact. Every one is publicly deployed."
      />

      <FilterBar active={filter} onChange={handleFilterChange} />

      <AnimatePresence mode="popLayout">
        <motion.div key={filter} className="space-y-20 lg:space-y-28">
          {filteredProjects.length === 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-12"
            >
              No projects match this filter yet.
            </motion.p>
          )}
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectShowcase project={project} index={i} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* More projects CTA */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.a
          href="https://github.com/Rohitdixitcs"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-display text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ x: 4 }}
        >
          <FiGithub className="w-4 h-4" />
          See all projects on GitHub
          <FiArrowRight className="w-3.5 h-3.5" />
        </motion.a>
      </motion.div>
    </SectionWrapper>
  );
}
