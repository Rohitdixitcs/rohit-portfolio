import { motion } from "motion/react";
import { FiGithub, FiLinkedin, FiTwitter, FiMail, FiArrowUp } from "react-icons/fi";
import { PERSONAL_INFO } from "@/data/personal";
import { NAV_ITEMS } from "@/data/navigation";
import { scrollWindowTo } from "@/lib/scroll";

const ICON_MAP: Record<string, React.ElementType> = { FiGithub, FiLinkedin, FiTwitter, FiMail };

function BackToTop() {
  const handleClick = () => scrollWindowTo(0);
  return (
    <motion.button
      onClick={handleClick}
      className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground bg-white/[0.04] border border-white/[0.07] hover:border-white/[0.12] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      whileHover={{ scale: 1.08, y: -2 }}
      whileTap={{ scale: 0.93 }}
      aria-label="Back to top"
    >
      <FiArrowUp className="w-4 h-4" />
    </motion.button>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.05]" aria-label="Footer">
      {/* Gradient divider */}
      <div
        className="absolute top-0 inset-x-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), rgba(139,92,246,0.3), transparent)" }}
        aria-hidden="true"
      />

      <div className="mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-14" style={{ maxWidth: "var(--container-max)" }}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-7">
          {/* Left — branding */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <span className="font-display font-bold text-base text-foreground">
              {PERSONAL_INFO.name}
            </span>
            <p className="text-sm text-muted-foreground">{PERSONAL_INFO.title}</p>
          </div>

          {/* Center — nav links (desktop) */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Footer navigation">
            {NAV_ITEMS.slice(0, 5).map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="text-sm font-display text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right — social + back-to-top */}
          <div className="flex items-center gap-3.5">
            {PERSONAL_INFO.social.map((s) => {
              const Icon = ICON_MAP[s.icon];
              return (
                <motion.a
                  key={s.id}
                  href={s.url}
                  target={s.id !== "email" ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  data-cursor={s.id === "email" ? "EMAIL" : "OPEN"}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  whileHover={{ scale: 1.1, y: -1 }}
                  whileTap={{ scale: 0.93 }}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                </motion.a>
              );
            })}
            <div className="w-px h-6 bg-border mx-1" aria-hidden="true" />
            <BackToTop />
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 pt-7 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground/60">
          <span>© {year} {PERSONAL_INFO.name}. All rights reserved.</span>
          <span className="font-mono text-xs">
            Built with React · TypeScript · Framer Motion
          </span>
        </div>
      </div>
    </footer>
  );
}
