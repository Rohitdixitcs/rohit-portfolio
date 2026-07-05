import { motion } from "motion/react";
import type { LogoConfig } from "@/types";

interface LogoProps {
  config: LogoConfig;
  onClick?: () => void;
}

export function Logo({ config, onClick }: LogoProps) {
  return (
    <motion.a
      href="#home"
      onClick={onClick}
      className="flex items-center gap-2.5 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      aria-label={`${config.fullName} — Home`}
    >
      <motion.div
        className="relative w-9 h-9 lg:w-11 lg:h-11 rounded-xl bg-primary flex items-center justify-center overflow-hidden flex-shrink-0"
        initial={{ rotate: -12, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
      >
        <span
          className="text-primary-foreground font-display font-bold leading-none tracking-tight relative z-10"
          style={{ fontSize: "clamp(0.75rem, 0.65rem + 0.4vw, 1.05rem)" }}
        >
          {config.initials}
        </span>
        <div
          className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent"
          aria-hidden="true"
        />
      </motion.div>

      <motion.span
        className="font-display font-semibold tracking-tight text-foreground leading-none"
        style={{ fontSize: "var(--fs-logo)" }}
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25, delay: 0.12 }}
      >
        {config.fullName}
      </motion.span>
    </motion.a>
  );
}
