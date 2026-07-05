// Lightweight, local-only visitor insight tracking to power the on-page
// Analytics dashboard's extra fields (device type, most-visited section,
// average session time, this visit's traffic source). None of this requires
// a backend or exposes any credentials — it's derived entirely from what
// the browser already knows about itself.

import { trackEvent } from "@/lib/analytics";

type DeviceType = "mobile" | "tablet" | "desktop";

const DEVICE_KEY = "rd_portfolio_devices_v1";
const SECTION_KEY = "rd_portfolio_section_time_v1";
const SESSION_KEY = "rd_portfolio_sessions_v1";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}
function writeJSON(key: string, value: unknown) {
  try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

export function getDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop";
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1024) return "tablet";
  return "desktop";
}

export function recordDeviceVisit() {
  const counts = readJSON<Record<DeviceType, number>>(DEVICE_KEY, { mobile: 0, tablet: 0, desktop: 0 });
  const type = getDeviceType();
  counts[type] = (counts[type] ?? 0) + 1;
  writeJSON(DEVICE_KEY, counts);
}

export function getDeviceBreakdown() {
  return readJSON<Record<DeviceType, number>>(DEVICE_KEY, { mobile: 0, tablet: 0, desktop: 0 });
}

export function getTrafficSource(): string {
  if (typeof document === "undefined" || !document.referrer) return "Direct";
  try {
    const host = new URL(document.referrer).hostname.replace(/^www\./, "");
    return host || "Direct";
  } catch { return "Direct"; }
}

// ─── Section engagement (which section gets the most scroll-time) ─────────

let observer: IntersectionObserver | null = null;
const sectionStartTimes = new Map<string, number>();
const viewedSections = new Set<string>();

export function startSectionEngagementTracking() {
  if (typeof window === "undefined" || observer) return;
  const tally = readJSON<Record<string, number>>(SECTION_KEY, {});

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (!id) return;
        if (entry.isIntersecting) {
          sectionStartTimes.set(id, Date.now());
          if (!viewedSections.has(id)) {
            viewedSections.add(id);
            trackEvent("section_view", { section: id });
          }
        } else {
          const start = sectionStartTimes.get(id);
          if (start) {
            tally[id] = (tally[id] ?? 0) + (Date.now() - start);
            sectionStartTimes.delete(id);
            writeJSON(SECTION_KEY, tally);
          }
        }
      });
    },
    { threshold: 0.4 }
  );

  document.querySelectorAll("section[id]").forEach((el) => observer!.observe(el));

  const flush = () => {
    sectionStartTimes.forEach((start, id) => {
      tally[id] = (tally[id] ?? 0) + (Date.now() - start);
    });
    writeJSON(SECTION_KEY, tally);
  };
  window.addEventListener("beforeunload", flush);
  document.addEventListener("visibilitychange", () => { if (document.hidden) flush(); });
}

export function getMostVisitedSection(): { id: string; ms: number } | null {
  const tally = readJSON<Record<string, number>>(SECTION_KEY, {});
  const entries = Object.entries(tally);
  if (entries.length === 0) return null;
  const [id, ms] = entries.sort((a, b) => b[1] - a[1])[0];
  return { id, ms };
}

// ─── Session duration ───────────────────────────────────────────────────

const sessionStart = typeof window !== "undefined" ? Date.now() : 0;

export function recordSessionEnd() {
  const durationSec = Math.round((Date.now() - sessionStart) / 1000);
  if (durationSec < 1) return;
  const sessions = readJSON<number[]>(SESSION_KEY, []);
  sessions.push(durationSec);
  writeJSON(SESSION_KEY, sessions.slice(-30));
}

export function getAverageSessionSeconds(): number {
  const sessions = readJSON<number[]>(SESSION_KEY, []);
  if (sessions.length === 0) return 0;
  return Math.round(sessions.reduce((a, b) => a + b, 0) / sessions.length);
}

export function initVisitorInsights() {
  recordDeviceVisit();
  startSectionEngagementTracking();
  window.addEventListener("beforeunload", recordSessionEnd);
  document.addEventListener("visibilitychange", () => { if (document.hidden) recordSessionEnd(); });
}
