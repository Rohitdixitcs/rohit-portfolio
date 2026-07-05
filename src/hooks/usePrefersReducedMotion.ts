import { useEffect, useState } from "react";

/**
 * Tracks the `(prefers-reduced-motion: reduce)` media query.
 * Framer Motion components should prefer its own `useReducedMotion()` hook;
 * this is for plain DOM/CSS-driven effects (raw addEventListener animations,
 * imperative libraries like Lenis, manually-injected keyframes, etc.).
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
