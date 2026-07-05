import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ArrowRight, Download, Mail, Github, Gamepad2, TerminalSquare } from "lucide-react";
import { NAV_ITEMS } from "@/data/navigation";
import { PROJECTS } from "@/data/projects";
import { PERSONAL_INFO } from "@/data/personal";
import { trackEvent } from "@/lib/analytics";
import { scrollToId } from "@/lib/scroll";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

interface PaletteItem {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  action: () => void;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          const next = !o;
          if (next) trackEvent("command_palette_open");
          return next;
        });
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onCustomOpen = () => { setOpen(true); trackEvent("command_palette_open"); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-command-palette", onCustomOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-command-palette", onCustomOpen);
    };
  }, []);

  // Restore focus to whatever triggered the palette (⌘K from anywhere, or
  // the navbar/terminal buttons that dispatch open-command-palette) once it
  // closes, matching this dialog's aria-modal="true" contract.
  useEffect(() => {
    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
    } else {
      previouslyFocused.current?.focus();
    }
  }, [open]);

  // Trap Tab/Shift+Tab within the palette while it's open.
  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  useEffect(() => {
    if (open) { setQuery(""); setActiveIndex(0); }
  }, [open]);

  const goTo = (hash: string) => {
    scrollToId(hash);
    setOpen(false);
  };

  const items: PaletteItem[] = useMemo(() => {
    const sectionItems: PaletteItem[] = NAV_ITEMS.filter((n) => n.id !== "home").map((n) => ({
      id: `section-${n.id}`,
      label: n.label,
      hint: "Section",
      icon: <ArrowRight className="w-4 h-4" />,
      action: () => goTo(n.id),
    }));

    const projectItems: PaletteItem[] = PROJECTS.map((p) => ({
      id: `project-${p.id}`,
      label: p.title,
      hint: "Project",
      icon: <ArrowRight className="w-4 h-4" />,
      action: () => goTo("projects"),
    }));

    const utilityItems: PaletteItem[] = [
      {
        id: "resume",
        label: "Download Resume",
        hint: "PDF",
        icon: <Download className="w-4 h-4" />,
        action: () => {
          trackEvent("resume_download");
          const a = document.createElement("a");
          a.href = PERSONAL_INFO.cvUrl;
          a.download = "Rohit-Dixit-Resume.pdf";
          a.click();
          setOpen(false);
        },
      },
      {
        id: "github-profile",
        label: "Open GitHub Profile",
        hint: "External",
        icon: <Github className="w-4 h-4" />,
        action: () => {
          const url = PERSONAL_INFO.social.find((s) => s.id === "github")?.url ?? "https://github.com";
          window.open(url, "_blank");
          setOpen(false);
        },
      },
      {
        id: "contact",
        label: "Contact Me",
        hint: "Section",
        icon: <Mail className="w-4 h-4" />,
        action: () => goTo("contact"),
      },
      {
        id: "playroom",
        label: "Play the Stack Game",
        hint: "Playroom",
        icon: <Gamepad2 className="w-4 h-4" />,
        action: () => goTo("playroom"),
      },
      {
        id: "terminal",
        label: "Open the Terminal",
        hint: "Section",
        icon: <TerminalSquare className="w-4 h-4" />,
        action: () => goTo("terminal"),
      },
    ];

    return [...utilityItems, ...sectionItems, ...projectItems];
  }, []);

  const filtered = query.trim()
    ? items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : items;

  useEffect(() => { setActiveIndex(0); }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === "Enter") {
      e.preventDefault();
      const item = filtered[activeIndex];
      if (item) { trackEvent("command_palette_select", { item: item.id }); item.action(); }
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh] px-4 bg-[#050816]/70 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl bg-[#0a0f1e]/95 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.07]">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search sections, projects, resume, contact..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
              />
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-muted-foreground font-mono">Esc</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto py-2">
              {filtered.length === 0 && (
                <p className="px-4 py-6 text-sm text-muted-foreground text-center">No results</p>
              )}
              {filtered.map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => { trackEvent("command_palette_select", { item: item.id }); item.action(); }}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    i === activeIndex ? "bg-primary/10 text-foreground" : "text-muted-foreground hover:bg-white/[0.03]"
                  }`}
                >
                  <span className="text-primary flex-shrink-0">{item.icon}</span>
                  <span className="flex-1 truncate">{item.label}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground/60">{item.hint}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
