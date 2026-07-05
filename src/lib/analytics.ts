import { ENV, isGaConfigured } from "./env";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

let gaLoaded = false;

/** Injects the GA4 gtag.js script and initializes it. No-op if VITE_GA_MEASUREMENT_ID is unset or in dev. */
export function initGA() {
  if (gaLoaded || !isGaConfigured() || typeof window === "undefined") return;
  if (!import.meta.env.PROD) return; // only track real production traffic
  gaLoaded = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ENV.GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };
  window.gtag("js", new Date());
  window.gtag("config", ENV.GA_MEASUREMENT_ID, { send_page_view: true });
}

/** Sends a GA4 event. No-op if GA isn't configured, so calls are always safe to fire. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (isGaConfigured() && typeof window !== "undefined" && window.gtag) {
    window.gtag("event", name, params);
  }
}

// ─── Local visit tracking ───────────────────────────────────────────────────
// GA4's *reporting* API requires a private service-account backend and can't
// be queried securely from a static frontend. To give the on-page Analytics
// dashboard real numbers without inventing data, we track this browser's own
// visits in localStorage. It's honestly labeled as "this device" in the UI —
// real cross-visitor totals should come from the GA4 web console or a public
// Looker Studio report (see README).

const STORAGE_KEY = "rd_portfolio_visits_v1";

interface LocalVisitStats {
  totalVisits: number;
  firstVisit: string;
  lastVisit: string;
  visitDates: string[]; // ISO date (yyyy-mm-dd) per visit, for day/week/month rollups
  resumeDownloads: number;
  projectClicks: number;
  contactClicks: number;
}

function readStats(): LocalVisitStats {
  if (typeof window === "undefined") {
    return { totalVisits: 0, firstVisit: "", lastVisit: "", visitDates: [], resumeDownloads: 0, projectClicks: 0, contactClicks: 0 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("no stats yet");
    return JSON.parse(raw) as LocalVisitStats;
  } catch {
    return { totalVisits: 0, firstVisit: "", lastVisit: "", visitDates: [], resumeDownloads: 0, projectClicks: 0, contactClicks: 0 };
  }
}

function writeStats(stats: LocalVisitStats) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

/** Call once per app load. Records a visit for this device and returns the running totals. */
export function recordVisit(): LocalVisitStats {
  const stats = readStats();
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  const isNewSession = stats.lastVisit.slice(0, 16) !== now.toISOString().slice(0, 16); // dedupe rapid re-renders
  if (isNewSession) {
    stats.totalVisits += 1;
    stats.visitDates.push(today);
    if (stats.visitDates.length > 400) stats.visitDates = stats.visitDates.slice(-400);
  }
  if (!stats.firstVisit) stats.firstVisit = now.toISOString();
  stats.lastVisit = now.toISOString();
  writeStats(stats);
  return stats;
}

export function recordInteraction(kind: "resume" | "project" | "contact") {
  const stats = readStats();
  if (kind === "resume") stats.resumeDownloads += 1;
  if (kind === "project") stats.projectClicks += 1;
  if (kind === "contact") stats.contactClicks += 1;
  writeStats(stats);
}

export function getLocalStats() {
  const stats = readStats();
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 86400000);
  const monthAgo = new Date(Date.now() - 30 * 86400000);

  const todayCount = stats.visitDates.filter((d) => d === today).length;
  const weekCount = stats.visitDates.filter((d) => new Date(d) >= weekAgo).length;
  const monthCount = stats.visitDates.filter((d) => new Date(d) >= monthAgo).length;
  const isReturning = stats.totalVisits > 1;

  return {
    totalVisits: stats.totalVisits,
    todayVisits: todayCount,
    weekVisits: weekCount,
    monthVisits: monthCount,
    isReturning,
    resumeDownloads: stats.resumeDownloads,
    projectClicks: stats.projectClicks,
    contactClicks: stats.contactClicks,
    lastUpdated: stats.lastVisit,
  };
}
