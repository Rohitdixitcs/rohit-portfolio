import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface TiltCardProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    "onAnimationStart" | "onAnimationEnd" | "onDrag" | "onDragStart" | "onDragEnd" | "onDragOver"
  > {
  children: React.ReactNode;
  maxTilt?: number;
}

/** Wraps children in a subtle mouse-following 3D tilt, with a moving glass highlight. */
export function TiltCard({ children, className, maxTilt = 5, ...rest }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);
  const highlightX = useTransform(springX, [0, 1], ["0%", "100%"]);
  const highlightY = useTransform(springY, [0, 1], ["0%", "100%"]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => { mouseX.set(0.5); mouseY.set(0.5); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={className}
      {...rest}
    >
      <div className="relative">
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{
            background: useTransform(
              [highlightX, highlightY],
              ([hx, hy]) => `radial-gradient(circle at ${hx} ${hy}, rgba(255,255,255,0.08), transparent 55%)`
            ),
          }}
          aria-hidden="true"
        />
      </div>
    </motion.div>
  );
}
