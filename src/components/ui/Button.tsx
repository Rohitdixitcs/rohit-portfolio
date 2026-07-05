import { forwardRef } from "react";
import { motion } from "motion/react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "glass" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  loading?: boolean;
  fullWidth?: boolean;
  as?: "button" | "a";
  href?: string;
  external?: boolean;
  download?: string | boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_4px_28px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_36px_rgba(99,102,241,0.55)]",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-accent border border-border",
  ghost:
    "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
  glass:
    "bg-white/5 backdrop-blur-md border border-white/10 text-foreground hover:bg-white/10",
  outline:
    "bg-transparent border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 gap-1.5 rounded-lg text-[0.8125rem]",
  md: "h-11 px-6 gap-2 rounded-xl",
  lg: "h-[60px] lg:h-16 px-8 lg:px-11 gap-3 rounded-2xl lg:rounded-[1.25rem]",
};

const sizeStyle: Record<ButtonSize, React.CSSProperties> = {
  sm: {},
  md: { fontSize: "var(--fs-button)" },
  lg: { fontSize: "var(--fs-button)" },
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      fullWidth = false,
      className,
      children,
      disabled,
      href,
      external,
      download,
      ...props
    },
    ref
  ) => {
    const baseClasses = twMerge(
      clsx(
        "relative inline-flex items-center justify-center font-display font-medium",
        "transition-all duration-200 cursor-pointer select-none",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && "w-full",
        className
      )
    );

    const content = (
      <>
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </span>
        )}
        <span className={clsx("flex items-center gap-[inherit]", loading && "invisible")}>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </span>
      </>
    );

    if (href) {
      return (
        <motion.a
          href={href}
          download={download}
          target={external && !download ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className={baseClasses}
          style={sizeStyle[size]}
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 22 }}
          {...(props as React.ComponentProps<typeof motion.a>)}
        >
          {content}
        </motion.a>
      );
    }

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        style={sizeStyle[size]}
        disabled={disabled || loading}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
