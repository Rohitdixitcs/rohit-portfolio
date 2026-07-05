import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import { FiBook, FiTarget, FiZap, FiHeart, FiMapPin, FiCalendar, FiAward, FiTrendingUp } from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PERSONAL_INFO } from "@/data/personal";
import { EDUCATION } from "@/data/timeline";

// ─── Animated Counter ──────────────────────────────────────────────────────

interface CounterProps { value: number; suffix?: string; label: string; sub?: string; }

function AnimatedCounter({ value, suffix = "", label, sub }: CounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1200;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) { setCount(value); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-display font-bold text-foreground flex items-end justify-center gap-1" style={{ fontSize: "var(--fs-stat-number)" }}>
        <span>{count}</span>
        <span className="text-primary" style={{ fontSize: "calc(var(--fs-stat-number) * 0.6)" }}>{suffix}</span>
      </div>
      <div className="font-medium text-foreground mt-2" style={{ fontSize: "var(--fs-stat-label)" }}>{label}</div>
      {sub && <div className="text-muted-foreground mt-1" style={{ fontSize: "var(--fs-badge)" }}>{sub}</div>}
    </div>
  );
}

// ─── Bento Card base ───────────────────────────────────────────────────────

function BentoCard({
  children,
  className = "",
  delay = 0,
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  glow?: string;
}) {
  return (
    <motion.div
      className={`relative rounded-2xl bg-[#0a0f1e]/80 border border-white/[0.06] backdrop-blur-sm overflow-hidden group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      whileHover={{ borderColor: "rgba(129,140,248,0.25)" }}
    >
      {glow && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: `radial-gradient(circle at 50% 0%, ${glow} 0%, transparent 60%)` }}
          aria-hidden="true"
        />
      )}
      {children}
    </motion.div>
  );
}

// ─── Dev Timeline (right column) ──────────────────────────────────────────

const DEV_MILESTONES = [
  { year: "2024", event: "Started Web Development" },
  { year: "2024", event: "Built first 10 projects" },
  { year: "2024–25", event: "Learning Full Stack" },
  { year: "2025", event: "Building AI Products" },
  { year: "2025 →", event: "Looking for Internship", current: true },
];

function DevTimeline() {
  return (
    <div className="relative pl-6">
      {/* Glowing vertical line */}
      <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" aria-hidden="true" />

      <div className="space-y-6">
        {DEV_MILESTONES.map((m, i) => (
          <motion.div
            key={i}
            className="relative"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.45 }}
          >
            {/* Dot */}
            <div
              className={`absolute -left-[22px] top-1 w-2.5 h-2.5 rounded-full border-2 ${m.current ? "border-primary bg-primary shadow-[0_0_8px_rgba(129,140,248,0.8)]" : "border-muted-foreground/40 bg-background"}`}
              aria-hidden="true"
            />
            <div className="font-mono text-xs text-primary/70 mb-0.5">{m.year}</div>
            <div className={`text-sm font-medium ${m.current ? "text-primary" : "text-foreground/80"}`}>
              {m.event}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────

export function AboutSection() {
  return (
    <SectionWrapper id="about" label="About Me">
      {/* Ambient blob */}
      <div
        className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      <SectionHeader
        eyebrow="About Me"
        title="Who I Am &amp; What I Build"
        description="A CS student who turned curiosity into shipped products. Here's the story so far."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ── Left: Bento Grid (2/3 width) ──────────────── */}
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">

          {/* Who I Am — spans full width */}
          <BentoCard className="sm:col-span-2 p-6" delay={0.05} glow="rgba(99,102,241,0.12)">
            <div className="flex items-start gap-4">
              {PERSONAL_INFO.photoUrl ? (
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                  <picture>
                    {PERSONAL_INFO.photoUrlWebp && (
                      <source srcSet={PERSONAL_INFO.photoUrlWebp} type="image/webp" />
                    )}
                    <img
                      src={PERSONAL_INFO.photoUrl}
                      alt={PERSONAL_INFO.name}
                      width={56}
                      height={56}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <FiHeart className="w-4 h-4 text-primary" aria-hidden="true" />
                </div>
              )}
              <div>
                <h3 className="font-display font-semibold text-lg text-foreground mb-2">Who I Am</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{PERSONAL_INFO.bio}</p>
              </div>
            </div>
          </BentoCard>

          {/* Mission */}
          <BentoCard className="p-6" delay={0.1} glow="rgba(139,92,246,0.12)">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
              <FiTarget className="w-4 h-4 text-violet-400" aria-hidden="true" />
            </div>
            <h3 className="font-display font-semibold text-base text-foreground mb-2">Mission</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              "I love building products that solve real-world problems — fast, accessible, and beautiful."
            </p>
          </BentoCard>

          {/* Current Focus */}
          <BentoCard className="p-6" delay={0.15} glow="rgba(6,182,212,0.12)">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4">
              <FiZap className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            </div>
            <h3 className="font-display font-semibold text-base text-foreground mb-2">Current Focus</h3>
            <ul className="space-y-1.5">
              {["Building AI-powered tools", "Full stack with Next.js + Node", "Open source contributions", "Seeking internship 2025"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-cyan-400 flex-shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </BentoCard>

          {/* Education */}
          <BentoCard className="p-6" delay={0.2} glow="rgba(245,158,11,0.1)">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                <FiBook className="w-4 h-4 text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-base text-foreground">{EDUCATION.institution}</h3>
                <p className="text-xs text-muted-foreground">{EDUCATION.degree}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
              <span className="flex items-center gap-1"><FiMapPin className="w-3 h-3" />{EDUCATION.location}</span>
              <span className="flex items-center gap-1"><FiCalendar className="w-3 h-3" />{EDUCATION.period}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EDUCATION.coursework.slice(0, 4).map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-md text-xs bg-white/[0.04] border border-white/[0.06] text-muted-foreground">{c}</span>
              ))}
            </div>
          </BentoCard>

          {/* Quick Facts */}
          <BentoCard className="p-6" delay={0.25}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <FiAward className="w-4 h-4 text-rose-400" aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-base text-foreground">Quick Facts</h3>
            </div>
            <ul className="space-y-2">
              {[
                "Self-taught in under 1 year",
                `Based in ${PERSONAL_INFO.location}`,
                "10+ projects shipped",
                "Open to remote work",
                "Loves clean code & design",
              ].map((fact) => (
                <li key={fact} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1 h-1 rounded-full bg-rose-400 flex-shrink-0" aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
          </BentoCard>

          {/* Stats — full width at bottom */}
          <BentoCard className="sm:col-span-2 p-6" delay={0.3} glow="rgba(99,102,241,0.08)">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <AnimatedCounter value={10} suffix="+" label="Projects" sub="Shipped to production" />
              <AnimatedCounter value={1} suffix="+" label="Years Learning" sub="Self-driven" />
              <AnimatedCounter value={3} suffix="+" label="Live Websites" sub="Real users" />
              <AnimatedCounter value={100} suffix="%" label="Passion" sub="For building" />
            </div>
          </BentoCard>
        </div>

        {/* ── Right: Timeline + Quote (1/3 width) ──────────── */}
        <div className="flex flex-col gap-4">

          {/* Developer Timeline */}
          <BentoCard className="p-6 flex-1" delay={0.08} glow="rgba(129,140,248,0.1)">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FiTrendingUp className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-sm text-foreground">Developer Journey</h3>
            </div>
            <DevTimeline />
          </BentoCard>

          {/* Glowing Quote Card */}
          <BentoCard className="p-6" delay={0.12} glow="rgba(99,102,241,0.15)">
            <div className="relative">
              <span
                className="absolute -top-2 -left-1 font-display text-6xl text-primary/20 leading-none select-none"
                aria-hidden="true"
              >
                "
              </span>
              <p className="text-sm text-muted-foreground leading-relaxed relative z-10 pt-3">
                I love building products that solve real-world problems. Good engineering is invisible — people just feel it work.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-violet-500 flex items-center justify-center text-xs font-bold text-white">
                  {PERSONAL_INFO.firstName[0]}
                </div>
                <span className="text-xs text-muted-foreground font-display">{PERSONAL_INFO.name}</span>
              </div>
            </div>
          </BentoCard>
        </div>
      </div>
    </SectionWrapper>
  );
}
