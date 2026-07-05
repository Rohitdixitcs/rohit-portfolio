// Centralized read of build-time environment variables.
// All values are optional — every feature that depends on them degrades
// gracefully (and visibly, in dev) instead of crashing when unset.

export const ENV = {
  GA_MEASUREMENT_ID: import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined,
  EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
  EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined,
  EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
  GITHUB_USERNAME: (import.meta.env.VITE_GITHUB_USERNAME as string | undefined) ?? "Rohitdixitcs",
} as const;

export const isGaConfigured = () => Boolean(ENV.GA_MEASUREMENT_ID);
export const isEmailJsConfigured = () =>
  Boolean(ENV.EMAILJS_SERVICE_ID && ENV.EMAILJS_TEMPLATE_ID && ENV.EMAILJS_PUBLIC_KEY);
