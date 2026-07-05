import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function ScrollIndicator() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2.2, duration: 0.6 }}
      aria-hidden="true"
    >
      <span className="text-xs font-display text-muted-foreground tracking-widest uppercase">
        Scroll
      </span>
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </motion.div>
    </motion.div>
  );
}
