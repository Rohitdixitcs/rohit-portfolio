import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Particle {
  id: number;
  size: number;
  x: string;
  y: string;
  duration: number;
  delay: number;
  opacity: number;
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: Math.random() * 2 + 1,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 6,
    opacity: Math.random() * 0.4 + 0.1,
  }));
}

export function FloatingParticles({ count = 60 }: { count?: number }) {
  const particles = useMemo(() => generateParticles(count), [count]);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
            opacity: p.opacity,
            animation: prefersReducedMotion
              ? "none"
              : `particle-float ${p.duration}s ${p.delay}s infinite ease-in-out alternate`,
          }}
        />
      ))}

      {!prefersReducedMotion && (
        <style>{`
          @keyframes particle-float {
            0%   { transform: translateY(0px) translateX(0px); opacity: var(--tw-opacity, 0.2); }
            50%  { transform: translateY(-20px) translateX(8px); }
            100% { transform: translateY(-40px) translateX(-8px); opacity: 0; }
          }
        `}</style>
      )}
    </div>
  );
}
