import type { Variants, Transition } from "motion/react";

// ─── Easings ─────────────────────────────────────────────────────────────────

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT_EXPO = [0.87, 0, 0.13, 1] as const;
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const;
export const EASE_SPRING = { type: "spring", stiffness: 340, damping: 30 } as const;
export const EASE_SPRING_SOFT = { type: "spring", stiffness: 200, damping: 28 } as const;
export const EASE_SPRING_STIFF = { type: "spring", stiffness: 500, damping: 40 } as const;

// ─── Transitions ─────────────────────────────────────────────────────────────

export const TRANSITION_BASE: Transition = {
  duration: 0.35,
  ease: EASE_OUT_EXPO,
};

export const TRANSITION_SPRING: Transition = {
  type: "spring",
  stiffness: 340,
  damping: 30,
};

// ─── Variant Sets ─────────────────────────────────────────────────────────────

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

export const fadeDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

// ─── Stagger Containers ───────────────────────────────────────────────────────

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT_EXPO },
  },
};

// ─── Letter-by-letter text animation ─────────────────────────────────────────

export const letterContainer = (stagger = 0.025, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

export const letterItem: Variants = {
  hidden: { opacity: 0, y: 40, rotateX: -20 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO },
  },
};

// ─── Hover states ─────────────────────────────────────────────────────────────

export const hoverScale = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { type: "spring", stiffness: 400, damping: 22 },
};

export const hoverLift = {
  whileHover: { y: -3, scale: 1.01 },
  whileTap: { y: 0, scale: 0.99 },
  transition: { type: "spring", stiffness: 400, damping: 22 },
};
