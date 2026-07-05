import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";

interface Ripple { id: number; x: number; y: number }

/** Reads the nearest ancestor's data-cursor attribute to decide the cursor label. */
function getCursorLabel(el: Element | null): string | null {
  let node: Element | null = el;
  while (node) {
    const label = node.getAttribute?.("data-cursor");
    if (label) return label;
    node = node.parentElement;
  }
  return null;
}

function isMagnetic(el: Element | null): HTMLElement | null {
  let node: Element | null = el;
  while (node) {
    if (node.hasAttribute?.("data-magnetic")) return node as HTMLElement;
    node = node.parentElement;
  }
  return null;
}

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const outerX = useSpring(x, { stiffness: 300, damping: 28, mass: 0.6 });
  const outerY = useSpring(y, { stiffness: 300, damping: 28, mass: 0.6 });
  const innerX = useSpring(x, { stiffness: 700, damping: 32, mass: 0.3 });
  const innerY = useSpring(y, { stiffness: 700, damping: 32, mass: 0.3 });

  const magneticTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!hasFinePointer || reducedMotion) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor-active");

    let rafId: number | null = null;
    let lastEvent: PointerEvent | null = null;

    const processMove = () => {
      rafId = null;
      const e = lastEvent;
      if (!e) return;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const magnet = isMagnetic(target);

      if (magnet) {
        const rect = magnet.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Blend the cursor position toward the button's center — pull=0.3
        // means the cursor sits 30% of the way from the pointer toward the
        // center, giving the "drawn toward the button" feel.
        const pull = 0.3;
        x.set(e.clientX + (cx - e.clientX) * pull);
        y.set(e.clientY + (cy - e.clientY) * pull);
        magnet.style.transform = `translate(${(e.clientX - cx) * 0.15}px, ${(e.clientY - cy) * 0.15}px)`;
        magneticTarget.current = magnet;
      } else {
        if (magneticTarget.current) {
          magneticTarget.current.style.transform = "";
          magneticTarget.current = null;
        }
        x.set(e.clientX);
        y.set(e.clientY);
      }

      setLabel(getCursorLabel(target));
    };

    const onMove = (e: PointerEvent) => {
      lastEvent = e;
      if (rafId === null) rafId = requestAnimationFrame(processMove);
    };

    const onDown = () => setIsPointerDown(true);
    const onUp = (e: PointerEvent) => {
      setIsPointerDown(false);
      const id = rippleId.current++;
      setRipples((r) => [...r, { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 600);
    };
    const onLeave = () => { x.set(-100); y.set(-100); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (magneticTarget.current) magneticTarget.current.style.transform = "";
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Outer glass ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-white/25 backdrop-blur-[2px]"
        style={{
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%",
          width: label ? 72 : 40,
          height: label ? 72 : 40,
          background: "rgba(129,140,248,0.08)",
          boxShadow: "0 0 24px rgba(129,140,248,0.25)",
        }}
        animate={{ scale: isPointerDown ? 0.85 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <AnimatePresence>
          {label && (
            <motion.span
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              className="absolute inset-0 flex items-center justify-center text-[10px] font-display font-semibold tracking-wide text-foreground uppercase"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Inner glowing dot */}
      <motion.div
        className="fixed top-0 left-0 rounded-full"
        style={{
          x: innerX,
          y: innerY,
          translateX: "-50%",
          translateY: "-50%",
          width: 10,
          height: 10,
          background: "radial-gradient(circle at 35% 35%, #c4b5fd, #6366f1 70%)",
          boxShadow: "0 0 12px rgba(129,140,248,0.8)",
        }}
        animate={{ scale: label ? 0 : isPointerDown ? 1.4 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
      />

      {/* Click ripples */}
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.div
            key={r.id}
            className="fixed rounded-full border border-primary/50"
            style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 8, height: 8, opacity: 0.8 }}
            animate={{ width: 64, height: 64, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
