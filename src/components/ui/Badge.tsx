import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "glass";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  dotColor?: string;
  className?: string;
  pulse?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-muted text-muted-foreground border border-border",
  primary: "bg-primary/10 text-primary border border-primary/20",
  success: "bg-success/10 text-success border border-success/20",
  warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
  danger: "bg-destructive/10 text-destructive border border-destructive/20",
  glass: "bg-white/5 backdrop-blur-sm text-foreground border border-white/10",
};

export function Badge({
  children,
  variant = "default",
  dot,
  dotColor,
  className,
  pulse = false,
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center gap-2 px-4 py-2 rounded-full font-medium font-display",
          variantClasses[variant],
          className
        )
      )}
      style={{ fontSize: "var(--fs-badge)" }}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulse && (
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: dotColor ?? "currentColor" }}
            />
          )}
          <span
            className="relative inline-flex rounded-full h-1.5 w-1.5"
            style={{ backgroundColor: dotColor ?? "currentColor" }}
          />
        </span>
      )}
      {children}
    </span>
  );
}
