import { motion } from "motion/react";
import type { NavItem as NavItemType } from "@/types";
import { trackEvent } from "@/lib/analytics";

interface NavItemProps {
  item: NavItemType;
  isActive: boolean;
  onClick?: () => void;
}

export function NavItem({ item, isActive, onClick }: NavItemProps) {
  return (
    <li>
      <a
        href={item.href}
        onClick={() => { trackEvent("nav_click", { section: item.id }); onClick?.(); }}
        className={[
          "relative inline-flex items-center px-1 py-1.5 font-medium font-display",
          "transition-colors duration-200 rounded-sm",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
        ].join(" ")}
        style={{ fontSize: "var(--fs-nav)" }}
      >
        {item.label}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute inset-x-0 -bottom-0.5 h-[2px] rounded-full bg-primary"
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
          />
        )}
      </a>
    </li>
  );
}
