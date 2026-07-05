import { motion } from "motion/react";
import {
  FiCode, FiZap, FiLayers, FiShield, FiServer, FiCpu, FiTarget, FiBook, FiMapPin, FiCalendar,
} from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { JOURNEY_STEPS, EDUCATION } from "@/data/timeline";
import type { TimelineStep } from "@/data/timeline";

const ICON_MAP: Record<string, React.ElementType> = {
  FiCode, FiZap, FiLayers, FiShield, FiServer, FiCpu, FiTarget, FiBook,
};

function TimelineItem({ step, index }: { step: TimelineStep; index: number }) {
  const Icon = ICON_MAP[step.iconName] ?? FiCode;
  const isLast = index === JOURNEY_STEPS.length - 1;

  return (
    <motion.div
      className="relative flex gap-5 sm:gap-8"
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: index * 0.06 }}
    >
      {/* Line + dot column */}
      <div className="relative flex flex-col items-center flex-shrink-0 w-12">
        {/* Dot */}
        <div
          className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center border ${
            step.current
              ? "bg-primary/20 border-primary shadow-[0_0_16px_rgba(129,140,248,0.5)]"
              : "bg-[#0a0f1e] border-white/[0.08]"
          }`}
        >
          <Icon
            className={`w-5 h-5 ${step.current ? "text-primary" : "text-muted-foreground"}`}
            aria-hidden="true"
          />
          {step.current && (
            <div className="absolute inset-0 rounded-2xl animate-pulse bg-primary/20" aria-hidden="true" />
          )}
        </div>

        {/* Connecting line */}
        {!isLast && (
          <div className="w-0.5 flex-1 mt-3 bg-gradient-to-b from-white/[0.1] to-transparent" aria-hidden="true" />
        )}
      </div>

      {/* Content card */}
      <motion.div
        className="flex-1 pb-12 group"
        whileHover={{ x: 4 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
      >
        <div
          className={`rounded-2xl p-7 border transition-all duration-300 ${
            step.current
              ? "bg-primary/5 border-primary/25"
              : "bg-[#0a0f1e]/60 border-white/[0.06] group-hover:border-white/[0.10]"
          }`}
        >
          {/* Year badge */}
          <span className="inline-block font-mono text-primary/70 mb-3" style={{ fontSize: "var(--fs-badge)" }}>{step.year}</span>

          <h3
            className={`font-display font-semibold mb-2 ${step.current ? "text-primary" : "text-foreground"}`}
            style={{ fontSize: "var(--fs-timeline)" }}
          >
            {step.title}
          </h3>
          <p className="text-muted-foreground/80 mb-3" style={{ fontSize: "var(--fs-badge)" }}>{step.subtitle}</p>
          <p className="text-muted-foreground leading-relaxed mb-5" style={{ fontSize: "var(--fs-body)" }}>{step.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {step.tags.map((tag) => (
              <span
                key={tag}
                className={`px-2.5 py-0.5 rounded-full font-mono text-xs border ${
                  step.current
                    ? "text-primary bg-primary/10 border-primary/20"
                    : "text-muted-foreground bg-white/[0.03] border-white/[0.05]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function EducationCard() {
  return (
    <motion.div
      className="rounded-2xl bg-[#0a0f1e]/80 border border-amber-500/15 p-6 sm:p-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {/* Corner glow */}
      <div
        className="absolute top-0 right-0 w-48 h-48 blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle at top right, rgba(245,158,11,0.5) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <div className="flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <FiBook className="w-5 h-5 text-amber-400" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-display font-bold text-xl text-foreground mb-1">{EDUCATION.institution}</h3>
          <p className="text-muted-foreground text-sm mb-3">{EDUCATION.degree}</p>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-5">
            <span className="flex items-center gap-1.5"><FiMapPin className="w-3 h-3" />{EDUCATION.location}</span>
            <span className="flex items-center gap-1.5"><FiCalendar className="w-3 h-3" />{EDUCATION.period}</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <p className="font-display font-semibold text-xs text-foreground/60 tracking-widest uppercase mb-3">Coursework</p>
              <ul className="space-y-1.5">
                {EDUCATION.coursework.map((c) => (
                  <li key={c} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-amber-400/60 flex-shrink-0" aria-hidden="true" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-display font-semibold text-xs text-foreground/60 tracking-widest uppercase mb-3">Highlights</p>
              <ul className="space-y-1.5">
                {EDUCATION.achievements.map((a) => (
                  <li key={a} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1 h-1 rounded-full bg-amber-400/60 flex-shrink-0" aria-hidden="true" />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function JourneySection() {
  return (
    <SectionWrapper id="journey" label="Journey & Education">
      {/* Ambient */}
      <div
        className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full blur-[160px] pointer-events-none opacity-10"
        style={{ background: "radial-gradient(circle, rgba(245,158,11,0.6) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <SectionHeader
        eyebrow="Journey"
        title="How I Got Here"
        description="From writing my first &lt;h1&gt; to building AI products — a timeline of deliberate learning and shipping."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 xl:gap-16">
        {/* Timeline */}
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground/60 tracking-widest uppercase mb-8">
            Learning Journey
          </h3>
          <div>
            {JOURNEY_STEPS.map((step, i) => (
              <TimelineItem key={step.id} step={step} index={i} />
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="font-display font-semibold text-sm text-foreground/60 tracking-widest uppercase mb-8">
            Education
          </h3>
          <EducationCard />
        </div>
      </div>
    </SectionWrapper>
  );
}
