import { motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={twMerge(
        clsx(
          align === "center" ? "text-center" : "text-left",
          className
        )
      )}
      style={{ marginBottom: "var(--space-section-gap)" }}
    >
      <motion.span
        className="inline-flex items-center gap-2 font-mono tracking-[0.2em] uppercase text-primary mb-4"
        style={{ fontSize: "var(--fs-eyebrow)" }}
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <span className="w-4 h-px bg-primary" aria-hidden="true" />
        {eyebrow}
        <span className="w-4 h-px bg-primary" aria-hidden="true" />
      </motion.span>

      <motion.h2
        className="font-display font-bold text-foreground"
        style={{
          fontSize: "var(--fs-section-title)",
          background: "linear-gradient(135deg, var(--foreground) 0%, var(--foreground) 40%, var(--primary) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.08 }}
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          className={clsx(
            "mt-4 text-muted-foreground leading-relaxed",
            align === "center" && "max-w-2xl mx-auto"
          )}
          style={{ fontSize: "var(--fs-body-lg)" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.16 }}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
