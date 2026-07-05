import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { Logo } from "./Logo";
import type { NavItem, LogoConfig } from "@/types";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  activeId: string;
  logoConfig: LogoConfig;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export function MobileDrawer({
  isOpen,
  onClose,
  items,
  activeId,
  logoConfig,
}: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Move focus into the dialog when it opens, and restore it to whatever
  // triggered the drawer (the navbar's hamburger button) once it closes —
  // otherwise keyboard/screen-reader users lose their place in the page.
  useEffect(() => {
    if (isOpen) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
      firstFocusable?.focus();
    } else {
      previouslyFocused.current?.focus();
    }
  }, [isOpen]);

  // Trap Tab/Shift+Tab within the drawer while it's open, matching its
  // role="dialog" aria-modal="true" contract.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            key="drawer"
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-y-0 right-0 z-50 w-72 flex flex-col bg-card/98 backdrop-blur-2xl border-l border-border"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <Logo config={logoConfig} onClick={onClose} />
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-5" aria-label="Mobile navigation">
              <ul className="space-y-0.5" role="list">
                {items.map((item, index) => {
                  const isActive = activeId === item.id;
                  return (
                    <motion.li
                      key={item.id}
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.035 + 0.08, type: "spring", stiffness: 320, damping: 26 }}
                    >
                      <a
                        href={item.href}
                        onClick={onClose}
                        className={[
                          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium font-display",
                          "transition-all duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-accent",
                        ].join(" ")}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${isActive ? "bg-primary" : "bg-muted-foreground/30"}`}
                        />
                        {item.label}
                        {isActive && (
                          <motion.span
                            layoutId="mobile-active"
                            className="ml-auto w-1 h-4 rounded-full bg-primary"
                          />
                        )}
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
