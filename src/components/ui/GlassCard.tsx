import { forwardRef } from "react";
import { motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface GlassCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragOver"
  > {
  hover?: boolean;
  glow?: boolean;
  glowColor?: string;
  border?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  as?: "div" | "article" | "section" | "li";
  animate?: boolean;
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      hover = false,
      glow = false,
      glowColor,
      border = true,
      padding = "md",
      animate = false,
      ...props
    },
    ref
  ) => {
    const classes = twMerge(
      clsx(
        "relative rounded-2xl",
        "bg-card/40 backdrop-blur-xl",
        border && "border border-border",
        "transition-all duration-300",
        hover && [
          "hover:bg-card/60",
          "hover:border-primary/20",
          "hover:shadow-lg hover:shadow-black/30",
        ],
        paddingClasses[padding],
        className
      )
    );

    if (animate) {
      return (
        <motion.div
          ref={ref}
          className={classes}
          whileHover={
            hover
              ? { y: -4, transition: { type: "spring", stiffness: 300, damping: 24 } }
              : undefined
          }
          {...props}
        >
          {glow && (
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-2xl"
              style={{ background: glowColor ?? "rgba(99,102,241,0.1)" }}
              aria-hidden="true"
            />
          )}
          {children}
        </motion.div>
      );
    }

    return (
      <div ref={ref} className={classes} {...props}>
        {glow && (
          <div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              boxShadow: `inset 0 0 60px ${glowColor ?? "rgba(99,102,241,0.05)"}`,
            }}
            aria-hidden="true"
          />
        )}
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
