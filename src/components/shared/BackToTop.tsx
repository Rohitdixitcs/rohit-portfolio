import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { scrollWindowTo } from "@/lib/scroll";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      rafId.current = null;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
      setProgress(pct);
      setVisible(scrollTop > 480);
    };
    const onScroll = () => {
      if (rafId.current === null) rafId.current = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => scrollWindowTo(0)}
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.7 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-[#0a0f1e]/80 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[0_8px_24px_rgba(0,0,0,0.5)]"
          aria-label="Back to top"
        >
          <svg width="44" height="44" viewBox="0 0 44 44" className="absolute inset-0 -rotate-90">
            <circle cx="22" cy="22" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="2" />
            <circle
              cx="22" cy="22" r={RADIUS} fill="none" stroke="url(#backToTopGradient)" strokeWidth="2"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="backToTopGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" />
                <stop offset="100%" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="w-4 h-4 text-foreground relative z-10" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
