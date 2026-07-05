import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";

const SESSION_KEY = "rd_portfolio_loaded_v2";
const TOTAL_MS = 2600;

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const particles = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 1.5,
        duration: 3 + Math.random() * 2,
        size: 1.5 + Math.random() * 2,
      })),
    []
  );

  useEffect(() => {
    let already = false;
    try { already = Boolean(window.sessionStorage.getItem(SESSION_KEY)); } catch { /* ignore */ }
    if (already) return;

    setVisible(true);
    const start = Date.now();
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      // Progress bar fills between ~40% and ~95% of the total sequence
      const fillStart = TOTAL_MS * 0.35;
      const fillEnd = TOTAL_MS * 0.85;
      const pct = Math.min(100, Math.max(0, Math.round(((elapsed - fillStart) / (fillEnd - fillStart)) * 100)));
      setProgress(pct);

      if (elapsed < TOTAL_MS) {
        raf = requestAnimationFrame(tick);
      } else {
        try { window.sessionStorage.setItem(SESSION_KEY, "1"); } catch { /* ignore */ }
        setVisible(false);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#050816] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Noise texture fades in */}
          <motion.div
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            aria-hidden="true"
          />

          {/* Aurora expands */}
          <motion.div
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, rgba(139,92,246,0.25) 45%, transparent 70%)", filter: "blur(60px)" }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: [0.3, 1, 1.15], opacity: [0, 0.6, 0.85] }}
            transition={{ duration: TOTAL_MS / 1000, times: [0, 0.5, 1], ease: "easeInOut" }}
            aria-hidden="true"
          />

          {/* Particles */}
          {!prefersReducedMotion && particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-primary/60 pointer-events-none"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [0, 0.8, 0], y: -30 }}
              transition={{ duration: p.duration, delay: 0.8 + p.delay, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden="true"
            />
          ))}

          {/* RD mark */}
          <motion.div
            className="relative w-24 h-24 rounded-3xl bg-primary flex items-center justify-center overflow-hidden z-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, boxShadow: ["0 0 0px rgba(129,140,248,0)", "0 0 60px rgba(129,140,248,0.6)"] }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <span className="font-display font-bold text-4xl text-primary-foreground">RD</span>
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.2, delay: 1, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
              />
            )}
          </motion.div>

          {/* Loading text */}
          <motion.p
            className="mt-7 text-sm font-mono tracking-widest text-muted-foreground z-10"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
          >
            Loading Portfolio...
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="mt-5 w-48 h-1 rounded-full bg-white/10 overflow-hidden z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-violet-400"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
