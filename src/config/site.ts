export const SITE_CONFIG = {
  name: "PROJECT NOVA",
  shortName: "Nova",
  owner: "Rohit Dixit",
  domain: "rohitdixit.dev",
  description:
    "Full Stack Developer & Creative Engineer. Building digital experiences at the intersection of design and technology.",
  ogImage: "/og.png",
  twitterHandle: "@Iamrohitdixit17",
  themeColor: "#5a5fcf",
} as const;

export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export const ANIMATION_DURATION = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

export const Z_INDEX = {
  base: 0,
  raised: 10,
  dropdown: 20,
  sticky: 30,
  overlay: 40,
  modal: 50,
  toast: 60,
} as const;
