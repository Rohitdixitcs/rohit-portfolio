import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

interface OrbConfig {
  size: number;
  x: string;
  y: string;
  color: string;
  duration: number;
  delay: number;
  blur: number;
  offsetX: number;
  offsetY: number;
}

const ORBS: OrbConfig[] = [
  { size: 800, x: "10%",  y: "20%",  color: "rgba(99,102,241,0.55)",  duration: 22, delay: 0,  blur: 130, offsetX: 60,  offsetY: 50  },
  { size: 700, x: "70%",  y: "60%",  color: "rgba(139,92,246,0.45)",  duration: 28, delay: 6,  blur: 140, offsetX: -50, offsetY: -60 },
  { size: 600, x: "45%",  y: "80%",  color: "rgba(6,182,212,0.3)",    duration: 20, delay: 12, blur: 120, offsetX: 40,  offsetY: 40  },
  { size: 500, x: "85%",  y: "10%",  color: "rgba(168,85,247,0.35)",  duration: 25, delay: 4,  blur: 110, offsetX: -30, offsetY: 50  },
  { size: 400, x: "20%",  y: "75%",  color: "rgba(99,102,241,0.3)",   duration: 18, delay: 8,  blur: 100, offsetX: 50,  offsetY: -40 },
];

export function AuroraBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const orbs = container.querySelectorAll<HTMLElement>("[data-parallax]");
      orbs.forEach((orb, i) => {
        const depth = (i % 3 + 1) * 0.5;
        orb.style.transform = `translate(calc(-50% + ${x * 30 * depth}px), calc(-50% + ${y * 20 * depth}px))`;
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Deep space base */}
      <div className="absolute inset-0 bg-[#050816]" />

      {/* Aurora orbs */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          data-parallax="true"
          className="absolute rounded-full will-change-transform"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: `blur(${orb.blur}px)`,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, orb.offsetX, -orb.offsetX * 0.6, orb.offsetX * 0.4, 0],
                  y: [0, -orb.offsetY * 0.8, orb.offsetY * 0.5, -orb.offsetY * 0.3, 0],
                  scale: [1, 1.1, 0.92, 1.06, 1],
                }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : {
                  duration: orb.duration,
                  delay: orb.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
          }
        />
      ))}

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,transparent_20%,#050816_100%)]" />

      {/* Top fade */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#050816] to-transparent" />
    </div>
  );
}
