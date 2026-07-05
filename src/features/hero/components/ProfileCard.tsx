import { useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useReducedMotion } from "motion/react";
import { FiMapPin, FiStar } from "react-icons/fi";
import { PERSONAL_INFO } from "@/data/personal";

const CARD_TECH = ["React", "TypeScript", "Node.js", "AI"];

const TECH_COLORS: Record<string, string> = {
  "React": "#61DAFB",
  "TypeScript": "#3178C6",
  "Node.js": "#84BA64",
  "AI": "#818CF8",
};

export function ProfileCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 40, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
    >
      {/* Floating animation wrapper */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { y: [0, -12, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* Card */}
        <motion.div
          ref={cardRef}
          className="relative w-[25rem] max-w-[88vw] rounded-3xl overflow-hidden cursor-default select-none"
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            perspective: 1000,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Rim glow */}
          <div
            className="absolute -inset-[1px] rounded-3xl pointer-events-none"
            style={{
              background: "linear-gradient(135deg, rgba(99,102,241,0.7) 0%, rgba(139,92,246,0.5) 50%, rgba(6,182,212,0.4) 100%)",
              zIndex: -1,
            }}
            aria-hidden="true"
          />

          {/* Glass body */}
          <div className="relative bg-[#0a0f1e]/80 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
            {/* Glare effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.06) 0%, transparent 60%)`,
              }}
              aria-hidden="true"
            />

            {/* Avatar */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-violet-500 blur-md opacity-60" aria-hidden="true" />
              <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-[#161e3a] to-[#0f1629] border border-white/10 overflow-hidden">
                {PERSONAL_INFO.photoUrl ? (
                  <picture>
                    {PERSONAL_INFO.photoUrlWebp && (
                      <source srcSet={PERSONAL_INFO.photoUrlWebp} type="image/webp" />
                    )}
                    <img
                      src={PERSONAL_INFO.photoUrl}
                      alt={PERSONAL_INFO.name}
                      width={128}
                      height={128}
                      loading="eager"
                      decoding="async"
                      className="w-full h-full object-cover"
                    />
                  </picture>
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span
                      className="font-display font-bold text-4xl"
                      style={{
                        background: "linear-gradient(135deg, #e2e8f0 0%, #818cf8 60%, #c084fc 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {PERSONAL_INFO.firstName[0]}{PERSONAL_INFO.lastName[0]}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Identity */}
            <div className="text-center mb-6">
              <h3 className="font-display font-bold text-2xl text-foreground mb-1.5">
                {PERSONAL_INFO.name}
              </h3>
              <p className="text-base text-muted-foreground mb-2.5">{PERSONAL_INFO.title}</p>
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
                <FiMapPin className="w-3.5 h-3.5" aria-hidden="true" />
                <span>ABES Engineering College</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex justify-center mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-success/10 border border-success/20 text-success">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
                </span>
                Available for Internship
              </span>
            </div>

            {/* Tech chips */}
            <div className="flex flex-wrap justify-center gap-2">
              {CARD_TECH.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-white/5 border border-white/10"
                  style={{ color: TECH_COLORS[tech] ?? "#e2e8f0" }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Stars decoration */}
            <div className="absolute top-4 right-4 flex gap-0.5" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <FiStar key={i} className="w-2.5 h-2.5 text-primary/40 fill-primary/20" />
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Ambient glow beneath the card */}
      <div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-48 h-8 blur-2xl rounded-full"
        style={{ background: "rgba(99,102,241,0.35)" }}
        aria-hidden="true"
      />
    </motion.div>
  );
}
