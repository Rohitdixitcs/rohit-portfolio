import { useEffect, useState } from "react";
import { motion } from "motion/react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? scrolled / max : 0);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="absolute inset-x-0 bottom-0 h-[1.5px] overflow-hidden rounded-full"
      aria-hidden="true"
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-primary via-violet-400 to-cyan-400"
        style={{ scaleX: progress }}
      />
    </div>
  );
}
