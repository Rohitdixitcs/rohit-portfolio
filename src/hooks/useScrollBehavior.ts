import { useState, useEffect, useRef } from "react";

export interface ScrollState {
  isVisible: boolean;
  isScrolled: boolean;
  scrollY: number;
  scrollDirection: "up" | "down" | null;
}

export function useScrollBehavior(threshold = 80): ScrollState {
  const [state, setState] = useState<ScrollState>({
    isVisible: true,
    isScrolled: false,
    scrollY: 0,
    scrollDirection: null,
  });
  const lastScrollY = useRef(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const compute = () => {
      rafId.current = null;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      setState((prev) => {
        const isScrolled = currentScrollY > 24;
        const scrollDirection = Math.abs(delta) > 2 ? (delta > 0 ? "down" : "up") : prev.scrollDirection;

        let isVisible = prev.isVisible;
        if (currentScrollY < threshold) {
          isVisible = true;
        } else if (delta > 4) {
          isVisible = false;
        } else if (delta < -4) {
          isVisible = true;
        }

        // Bail out of the state update entirely when nothing visible changed —
        // avoids a re-render on every scroll tick once direction/visibility settle.
        if (
          isVisible === prev.isVisible &&
          isScrolled === prev.isScrolled &&
          scrollDirection === prev.scrollDirection &&
          currentScrollY === prev.scrollY
        ) {
          return prev;
        }

        return { isVisible, isScrolled, scrollY: currentScrollY, scrollDirection };
      });

      lastScrollY.current = currentScrollY;
    };

    const onScroll = () => {
      // Coalesce to one update per animation frame, no matter how many
      // native scroll events fire in between (trackpads/high-polling mice
      // can fire dozens per frame).
      if (rafId.current === null) rafId.current = requestAnimationFrame(compute);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, [threshold]);

  return state;
}
