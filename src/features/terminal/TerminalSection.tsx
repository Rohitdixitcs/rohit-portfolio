import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { TerminalSquare } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { PERSONAL_INFO } from "@/data/personal";
import { ENV } from "@/lib/env";
import { trackEvent, recordInteraction } from "@/lib/analytics";
import { scrollToId } from "@/lib/scroll";

const PROMPT = "rohitrdx@portfolio ~";

const COMMAND_LIST = [
  "help", "about", "projects", "skills", "resume", "github",
  "play", "analytics", "contact", "experience", "journey",
  "futurelab", "certificates", "clear",
];

interface Line { type: "command" | "output"; text: string }

function scrollTo(id: string) {
  scrollToId(id);
}

export function TerminalSection() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: `Welcome to ${PERSONAL_INFO.firstName}'s portfolio terminal. Type "help" to see available commands.` },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines]);

  const focusInput = useCallback(() => inputRef.current?.focus(), []);

  const runCommand = useCallback((raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    trackEvent("terminal_command", { command: cmd });
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(null);
    setLines((prev) => [...prev, { type: "command", text: cmd }]);

    const output = (text: string) => setLines((prev) => [...prev, { type: "output", text }]);

    switch (cmd) {
      case "help":
        output(`Available commands: ${COMMAND_LIST.join(", ")}`);
        break;
      case "about":
        output("Scrolling to About...");
        scrollTo("about");
        break;
      case "projects":
        output("Scrolling to Projects...");
        scrollTo("projects");
        break;
      case "skills":
        output("Scrolling to Skills...");
        scrollTo("skills");
        break;
      case "resume": {
        output("Downloading resume...");
        trackEvent("resume_download");
        recordInteraction("resume");
        const a = document.createElement("a");
        a.href = PERSONAL_INFO.cvUrl;
        a.download = "Rohit-Dixit-Resume.pdf";
        a.click();
        break;
      }
      case "github":
        output(`Opening github.com/${ENV.GITHUB_USERNAME}...`);
        trackEvent("github_click");
        window.open(`https://github.com/${ENV.GITHUB_USERNAME}`, "_blank");
        break;
      case "play":
        output("Scrolling to Playroom...");
        scrollTo("playroom");
        break;
      case "analytics":
        output("Scrolling to Analytics...");
        scrollTo("analytics");
        break;
      case "contact":
        output("Scrolling to Contact...");
        scrollTo("contact");
        break;
      case "experience":
      case "journey":
        output("Scrolling to Journey...");
        scrollTo("journey");
        break;
      case "futurelab":
        output("Scrolling to Future Lab...");
        scrollTo("future-lab");
        break;
      case "certificates":
        output("Scrolling to Certificates...");
        scrollTo("certificates");
        break;
      case "clear":
        setLines([]);
        return;
      default:
        output(`Command not found: "${cmd}". Type "help" for a list of commands.`);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInput(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === null) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) { setHistoryIndex(null); setInput(""); }
      else { setHistoryIndex(nextIndex); setInput(history[nextIndex]); }
    }
  };

  return (
    <SectionWrapper id="terminal" label="Terminal">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        onClick={focusInput}
        className="max-w-3xl mx-auto rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0a0f1e]/90 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] cursor-text"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" aria-hidden="true" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" aria-hidden="true" />
          </div>
          <div className="flex-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground font-mono">
            <TerminalSquare className="w-3.5 h-3.5" /> portfolio — zsh
          </div>
        </div>

        <div ref={scrollRef} className="h-72 sm:h-80 overflow-y-auto px-5 py-4 font-mono text-sm space-y-1.5">
          {lines.map((line, i) =>
            line.type === "command" ? (
              <div key={i} className="text-foreground">
                <span className="text-primary">{PROMPT}</span>
                <span className="text-muted-foreground"> $ </span>
                {line.text}
              </div>
            ) : (
              <div key={i} className="text-muted-foreground whitespace-pre-wrap">{line.text}</div>
            )
          )}

          <div className="flex items-center text-foreground">
            <span className="text-primary">{PROMPT}</span>
            <span className="text-muted-foreground mr-2"> $</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal command input"
              className="flex-1 bg-transparent outline-none text-foreground caret-transparent"
            />
            <motion.span
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
              className="inline-block w-2 h-4 bg-primary ml-0.5"
              aria-hidden="true"
            />
          </div>
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
