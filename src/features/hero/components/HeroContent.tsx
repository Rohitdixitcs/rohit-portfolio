import { motion } from "motion/react";
import { ArrowRight, Download } from "lucide-react";
import { FiGithub, FiLinkedin, FiTwitter, FiMail } from "react-icons/fi";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProfileCard } from "./ProfileCard";
import { PERSONAL_INFO } from "@/data/personal";
import { trackEvent, recordInteraction } from "@/lib/analytics";

const ICON_MAP: Record<string, React.ElementType> = { FiGithub, FiLinkedin, FiTwitter, FiMail };

const STAGGER_DELAY = 0.1;

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const, delay },
  };
}

export function HeroContent() {
  return (
    <div className="relative z-10 w-full mx-auto px-4 sm:px-8 lg:px-12 xl:px-16" style={{ maxWidth: "var(--container-max)" }}>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

        {/* ── Left: Text ──────────────────────────────────────── */}
        <div className="flex-1 min-w-0 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">

          {/* Availability badge */}
          <motion.div {...fadeUp(STAGGER_DELAY * 1)} className="mb-7 inline-flex lg:flex">
            <Badge variant="success" dot dotColor="#4ade80" pulse className="font-display">
              {PERSONAL_INFO.available ? "Available for Internship" : "Unavailable"}
            </Badge>
          </motion.div>

          {/* Name */}
          <motion.div {...fadeUp(STAGGER_DELAY * 2)} className="mb-4">
            <h1
              className="font-display font-extrabold leading-[1.05] tracking-tight text-balance"
              style={{
                fontSize: "var(--fs-hero)",
                background: "linear-gradient(135deg, #e2e8f0 0%, #e2e8f0 30%, #818cf8 65%, #c084fc 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {PERSONAL_INFO.name}
            </h1>
          </motion.div>

          {/* Title */}
          <motion.div {...fadeUp(STAGGER_DELAY * 3)} className="mb-5">
            <h2
              className="font-display font-semibold text-muted-foreground text-balance mx-auto lg:mx-0"
              style={{ fontSize: "var(--fs-hero-subtitle)", maxWidth: "34ch" }}
            >
              {PERSONAL_INFO.title}
              <span className="text-border mx-3" aria-hidden="true">—</span>
              <span className="text-foreground/60">Student @ ABES Engineering College</span>
            </h2>
          </motion.div>

          {/* Tagline */}
          <motion.p
            {...fadeUp(STAGGER_DELAY * 4)}
            className="text-muted-foreground mx-auto lg:mx-0 mb-8 text-pretty"
            style={{ fontSize: "var(--fs-hero-desc)", maxWidth: "60ch", lineHeight: 1.7 }}
          >
            {PERSONAL_INFO.tagline}
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            {...fadeUp(STAGGER_DELAY * 5)}
            className="flex flex-wrap items-center gap-3 mb-8 justify-center lg:justify-start"
          >
            <Button
              variant="primary"
              size="lg"
              href="#projects"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Explore Projects
            </Button>

            <Button
              variant="glass"
              size="lg"
              href={PERSONAL_INFO.cvUrl}
              download="Rohit-Dixit-Resume.pdf"
              onClick={() => { trackEvent("resume_download"); recordInteraction("resume"); }}
              data-cursor="PDF"
              data-magnetic
              icon={<Download className="w-4 h-4" />}
              iconPosition="right"
            >
              Download Resume
            </Button>
          </motion.div>

          {/* Social links */}
          <motion.div
            {...fadeUp(STAGGER_DELAY * 6)}
            className="flex flex-wrap items-center gap-3 justify-center lg:justify-start"
          >
            {PERSONAL_INFO.social.map((s) => {
              const Icon = ICON_MAP[s.icon];
              return (
                <motion.a
                  key={s.id}
                  href={s.url}
                  target={s.id !== "email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] hover:border-primary/40 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                </motion.a>
              );
            })}

            <div className="h-6 w-px bg-border hidden sm:block" aria-hidden="true" />

            <span className="text-sm text-muted-foreground font-display hidden sm:flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success" aria-hidden="true" />
              {PERSONAL_INFO.location}
              <span className="text-border" aria-hidden="true">·</span>
              Open to remote
            </span>
          </motion.div>

          {/* Tech stack */}
          <motion.div
            {...fadeUp(STAGGER_DELAY * 7)}
            className="mt-8 flex flex-wrap gap-2 justify-center lg:justify-start"
          >
            {PERSONAL_INFO.techStack.map((tech, i) => (
              <motion.span
                key={tech}
                className="px-3 py-1 rounded-full font-mono text-xs text-muted-foreground bg-white/[0.03] border border-white/[0.06] hover:border-primary/30 hover:text-foreground transition-colors"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: STAGGER_DELAY * 7 + i * 0.04, duration: 0.35 }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>
        </div>

        {/* ── Right: Profile Card ──────────────────────────────── */}
        <div className="flex-shrink-0 hidden sm:flex justify-center items-center">
          <ProfileCard />
        </div>
      </div>
    </div>
  );
}
