import { motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  label?: string;
}

export function SectionWrapper({
  id,
  children,
  className,
  innerClassName,
  label,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={twMerge(clsx("relative overflow-hidden", className))}
      style={{ paddingTop: "var(--space-section-y)", paddingBottom: "var(--space-section-y)" }}
      aria-label={label ?? id}
    >
      <motion.div
        className={twMerge(clsx("relative z-10 mx-auto px-4 sm:px-8 lg:px-12 xl:px-16", innerClassName))}
        style={{ maxWidth: "var(--container-max)" }}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
