import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  FiEye, FiCalendar, FiTrendingUp, FiDownload, FiMousePointer, FiMail,
  FiWifi, FiWifiOff, FiInfo, FiSmartphone, FiMonitor, FiTablet, FiGlobe,
  FiClock, FiTarget, FiAward,
} from "react-icons/fi";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Badge } from "@/components/ui/Badge";
import { useCountUp } from "@/hooks/useCountUp";
import { getLocalStats } from "@/lib/analytics";
import { isGaConfigured } from "@/lib/env";
import { getDeviceBreakdown, getTrafficSource, getMostVisitedSection, getAverageSessionSeconds } from "@/lib/visitorInsights";
import { HIGH_SCORE_KEY, BEST_COMBO_KEY } from "@/features/playroom/constants";
import { NAV_ITEMS } from "@/data/navigation";

function StatTile({ icon: Icon, label, value, delay }: { icon: React.ElementType; label: string; value: number; delay: number }) {
  const { count, ref } = useCountUp(value, 1000);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl bg-white/[0.03] border border-white/[0.07] p-5"
    >
      <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-primary" aria-hidden="true" />
      </div>
      <div className="font-display font-bold text-3xl text-foreground">{count}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
      <span className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="w-3.5 h-3.5" /> {label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function formatSeconds(sec: number) {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}m ${s}s`;
}

export function AnalyticsSection() {
  const [stats, setStats] = useState(() => getLocalStats());
  const [devices, setDevices] = useState(() => getDeviceBreakdown());
  const [source, setSource] = useState("Direct");
  const [mostVisited, setMostVisited] = useState<{ id: string; ms: number } | null>(null);
  const [avgSession, setAvgSession] = useState(0);
  const [gameBest, setGameBest] = useState({ score: 0, combo: 0 });
  const gaOn = isGaConfigured();

  useEffect(() => {
    setStats(getLocalStats());
    setDevices(getDeviceBreakdown());
    setSource(getTrafficSource());
    setMostVisited(getMostVisitedSection());
    setAvgSession(getAverageSessionSeconds());
    setGameBest({
      score: Number(window.localStorage.getItem(HIGH_SCORE_KEY) ?? 0) || 0,
      combo: Number(window.localStorage.getItem(BEST_COMBO_KEY) ?? 0) || 0,
    });
  }, []);

  const totalDeviceVisits = devices.mobile + devices.tablet + devices.desktop || 1;
  const mostVisitedLabel = mostVisited
    ? NAV_ITEMS.find((n) => n.id === mostVisited.id)?.label ?? mostVisited.id
    : "Not enough data yet";

  return (
    <SectionWrapper id="analytics" label="Analytics">
      <SectionHeader
        eyebrow="Transparency"
        title="Visitor Analytics"
        description="Real engagement data — no invented numbers. This device's activity, plus live GA4 connection status."
      />

      <div className="flex items-center justify-center mb-8">
        <Badge variant={gaOn ? "success" : "warning"} dot pulse={gaOn}>
          {gaOn ? <FiWifi className="w-3.5 h-3.5 mr-1" /> : <FiWifiOff className="w-3.5 h-3.5 mr-1" />}
          Google Analytics 4 {gaOn ? "Connected" : "Not Configured"}
        </Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile icon={FiEye} label="Visits (this device)" value={stats.totalVisits} delay={0} />
        <StatTile icon={FiCalendar} label="Today" value={stats.todayVisits} delay={0.05} />
        <StatTile icon={FiTrendingUp} label="Last 7 Days" value={stats.weekVisits} delay={0.1} />
        <StatTile icon={FiCalendar} label="Last 30 Days" value={stats.monthVisits} delay={0.15} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatTile icon={FiDownload} label="Resume Downloads" value={stats.resumeDownloads} delay={0.2} />
        <StatTile icon={FiMousePointer} label="Project Clicks" value={stats.projectClicks} delay={0.25} />
        <StatTile icon={FiMail} label="Contact Attempts" value={stats.contactClicks} delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
          <h3 className="font-display font-semibold text-sm text-foreground mb-4">Device Types</h3>
          <div className="space-y-3">
            {([["desktop", FiMonitor], ["tablet", FiTablet], ["mobile", FiSmartphone]] as const).map(([key, Icon]) => (
              <div key={key}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-foreground capitalize"><Icon className="w-3.5 h-3.5" /> {key}</span>
                  <span className="text-muted-foreground">{devices[key]}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(devices[key] / totalDeviceVisits) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
          <h3 className="font-display font-semibold text-sm text-foreground mb-3">Session Insights</h3>
          <InfoRow icon={FiGlobe} label="Traffic Source (this visit)" value={source} />
          <InfoRow icon={FiTarget} label="Most Visited Section" value={mostVisitedLabel} />
          <InfoRow icon={FiClock} label="Avg. Session Time" value={avgSession > 0 ? formatSeconds(avgSession) : "Still gathering data"} />
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
          <h3 className="font-display font-semibold text-sm text-foreground mb-3 flex items-center gap-2">
            <FiAward className="w-4 h-4 text-primary" /> Playroom Stats
          </h3>
          <InfoRow icon={FiAward} label="High Score" value={String(gameBest.score)} />
          <InfoRow icon={FiTarget} label="Best Combo" value={String(gameBest.combo)} />
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-muted-foreground max-w-2xl mx-auto">
        <FiInfo className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
        <p>
          The numbers above track <strong className="text-foreground">this browser only</strong> — a static site can't
          securely query Google's cross-visitor reporting API (including country data) without a backend. Every real visit and interaction
          is also sent to GA4{gaOn ? "" : " (once configured)"}, where site-wide totals, countries, and realtime activity are visible in
          the GA4 dashboard or a published Looker Studio report.
        </p>
      </div>
    </SectionWrapper>
  );
}
