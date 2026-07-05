import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import { Volume2, VolumeX, RotateCcw, Maximize2, Trophy, Gamepad2, Play } from "lucide-react";
import { SectionWrapper } from "@/components/shared/SectionWrapper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StackGame } from "./StackGame";
import type { StackGameHandle, StackGameStats } from "./StackGame";
import { ACHIEVEMENT_DEFS, HIGH_SCORE_KEY, BEST_COMBO_KEY, ACHIEVEMENTS_KEY, RECENT_RUNS_KEY } from "./constants";
import { trackEvent } from "@/lib/analytics";

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

interface RecentRun { score: number; date: string }

export function PlayroomSection() {
  const gameRef = useRef<StackGameHandle>(null);
  const [stats, setStats] = useState<StackGameStats>({ score: 0, combo: 0, best: 0, bestCombo: 0, phase: "idle", isNewBest: false });
  const [muted, setMuted] = useState(false);
  const [unlocked, setUnlocked] = useState<string[]>([]);
  const [recentRuns, setRecentRuns] = useState<RecentRun[]>([]);
  const gameStarted = useRef(false);

  useEffect(() => {
    setStats((s) => ({
      ...s,
      best: Number(window.localStorage.getItem(HIGH_SCORE_KEY) ?? 0) || 0,
      bestCombo: Number(window.localStorage.getItem(BEST_COMBO_KEY) ?? 0) || 0,
    }));
    setUnlocked(readJSON<string[]>(ACHIEVEMENTS_KEY, []));
    setRecentRuns(readJSON<RecentRun[]>(RECENT_RUNS_KEY, []));
  }, []);

  const handleStats = useCallback((next: StackGameStats) => {
    setStats(next);
    if (next.phase === "playing" && !gameStarted.current) {
      gameStarted.current = true;
      trackEvent("game_start");
    }
    if (next.phase === "over") {
      gameStarted.current = false;
      trackEvent("game_over", { score: next.score });
      if (next.isNewBest) trackEvent("high_score", { score: next.score });
      setRecentRuns(readJSON<RecentRun[]>(RECENT_RUNS_KEY, []));
    }
  }, []);

  const handleAchievement = useCallback((id: string) => {
    setUnlocked((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  return (
    <SectionWrapper id="playroom" label="Playroom">
      <SectionHeader
        eyebrow="Take a break"
        title="Playroom"
        description="A fully playable 3D isometric Stack game, built from scratch — right here on the page. Stack blocks perfectly, chain combos, and beat your own high score."
      />

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-10 lg:gap-14 items-center lg:min-h-[820px]">
        {/* Left — info panel */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          <div className="grid grid-cols-3 gap-4">
            <StatBlock label="Score" value={stats.score} />
            <StatBlock label="High Score" value={stats.best} icon={<Trophy className="w-4 h-4" />} />
            <StatBlock label="Best Combo" value={stats.bestCombo} />
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
            <h3 className="font-display font-semibold text-base text-foreground mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" /> Achievements
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              {ACHIEVEMENT_DEFS.map((a) => {
                const isUnlocked = unlocked.includes(a.id);
                return (
                  <div
                    key={a.id}
                    className={`px-3.5 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                      isUnlocked
                        ? "bg-primary/10 border-primary/30 text-foreground"
                        : "bg-white/[0.02] border-white/[0.05] text-muted-foreground/50"
                    }`}
                  >
                    {a.label}
                  </div>
                );
              })}
            </div>
          </div>

          {recentRuns.length > 0 && (
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.07]">
              <h3 className="font-display font-semibold text-base text-foreground mb-4">Recent Runs</h3>
              <div className="space-y-2">
                {recentRuns.map((run, i) => (
                  <div key={i} className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{new Date(run.date).toLocaleDateString()}</span>
                    <span className="font-display font-semibold text-foreground">{run.score} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3.5">
            <ControlButton
              icon={<Play className="w-5 h-5" />}
              label={stats.phase === "idle" || stats.phase === "over" ? "Start Game" : "Resume"}
              primary
              onClick={() => gameRef.current?.start()}
              cursorLabel="PLAY"
            />
            <ControlButton icon={<RotateCcw className="w-5 h-5" />} label="Restart" onClick={() => gameRef.current?.restart()} />
            <ControlButton icon={muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />} label={muted ? "Unmute" : "Mute"} onClick={() => gameRef.current?.toggleMute()} />
            <ControlButton icon={<Maximize2 className="w-5 h-5" />} label="Fullscreen" onClick={() => gameRef.current?.requestFullscreen()} />
          </div>

          <p className="text-sm text-muted-foreground/70 flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" /> Mouse, touch, and keyboard (Space to drop, Esc to pause, M to mute) all supported.
          </p>
        </div>

        {/* Right — game canvas */}
        <div className="order-1 lg:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative mx-auto w-full aspect-square max-w-[380px] sm:max-w-[520px] md:max-w-[700px] lg:max-w-[880px] rounded-3xl p-1 bg-gradient-to-br from-primary/40 via-violet-500/30 to-transparent shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
          >
            <div className="w-full h-full rounded-[calc(1.5rem-2px)] overflow-hidden">
              <StackGame ref={gameRef} onStats={handleStats} onAchievement={handleAchievement} muted={muted} onMutedChange={setMuted} />
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}

function StatBlock({ label, value, icon }: { label: string; value: number; icon?: React.ReactNode }) {
  return (
    <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] text-center">
      <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm mb-1.5">{icon}{label}</div>
      <div className="font-display font-bold text-3xl text-foreground">{value}</div>
    </div>
  );
}

function ControlButton({ icon, label, onClick, primary, cursorLabel }: { icon: React.ReactNode; label: string; onClick: () => void; primary?: boolean; cursorLabel?: string }) {
  return (
    <motion.button
      onClick={onClick}
      data-cursor={cursorLabel}
      data-magnetic={cursorLabel ? true : undefined}
      whileHover={{ scale: 1.03, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-display font-medium text-base transition-colors ${
        primary
          ? "text-primary-foreground bg-gradient-to-r from-primary to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]"
          : "text-foreground bg-white/[0.05] border border-white/10 hover:bg-white/[0.08]"
      }`}
    >
      {icon} {label}
    </motion.button>
  );
}
