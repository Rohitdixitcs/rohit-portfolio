import { useState } from "react";
import { motion } from "motion/react";
import { Menu, Search } from "lucide-react";
import { Logo } from "./Logo";
import { NavItem } from "./NavItem";
import { MobileDrawer } from "./MobileDrawer";
import { ScrollProgress } from "./ScrollProgress";
import { useScrollBehavior } from "@/hooks/useScrollBehavior";
import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_ITEMS, LOGO_CONFIG } from "@/data/navigation";

export function Navbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isVisible, isScrolled } = useScrollBehavior();
  const activeId = useActiveSection(NAV_ITEMS);

  return (
    <>
      <motion.div
        className="fixed top-0 inset-x-0 z-30 flex justify-center px-4 pt-3"
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        initial={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <nav
          className={[
            "relative w-full max-w-6xl xl:max-w-[85rem] min-[1600px]:max-w-[100rem] rounded-2xl px-5 sm:px-7 lg:px-8 py-3.5 lg:py-4.5",
            "transition-[background,border-color,box-shadow] duration-300",
            isScrolled
              ? [
                  "bg-[#050816]/70 backdrop-blur-2xl",
                  "border border-white/[0.07]",
                  "shadow-[0_8px_32px_rgba(0,0,0,0.6)]",
                ].join(" ")
              : "bg-transparent border border-transparent",
          ].join(" ")}
          style={{ minHeight: "var(--nav-height)" }}
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between gap-3 h-full">
            <div className="flex-shrink-0">
              <Logo config={LOGO_CONFIG} />
            </div>

            <ul className="hidden min-[1600px]:flex items-center gap-6 min-[1920px]:gap-7" role="list">
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.id} item={item} isActive={activeId === item.id} />
              ))}
            </ul>

            <div className="flex items-center gap-3 flex-shrink-0">
              <motion.button
                onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                aria-label="Open command palette"
              >
                <Search className="w-4 h-4" />
                <kbd className="text-xs font-mono">⌘K</kbd>
              </motion.button>

              <motion.button
                onClick={() => setIsMobileOpen(true)}
                className="min-[1600px]:hidden w-10 h-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open navigation menu"
                aria-expanded={isMobileOpen}
                aria-controls="mobile-nav"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {isScrolled && <ScrollProgress />}
        </nav>
      </motion.div>

      <MobileDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        items={NAV_ITEMS}
        activeId={activeId}
        logoConfig={LOGO_CONFIG}
      />
    </>
  );
}
