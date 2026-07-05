import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy } from "lucide-react";
import { gameAudio } from "./audio";
import { HIGH_SCORE_KEY, BEST_COMBO_KEY, ACHIEVEMENTS_KEY, RECENT_RUNS_KEY, PLAYED_BEFORE_KEY } from "./constants";

const ISO = Math.PI / 6;
const COS_ISO = Math.cos(ISO);
const SIN_ISO = Math.sin(ISO);
const BLOCK_HEIGHT = 32;
const BASE_SIZE = 150;
const PERFECT_THRESHOLD = 7;
const START_SPEED = 2.4;
const MAX_SPEED = 6;
const SPEED_RAMP = 0.045;

const PALETTE = [
  ["#818cf8", "#6366f1", "#4f46e5"],
  ["#a78bfa", "#8b5cf6", "#7c3aed"],
  ["#60a5fa", "#3b82f6", "#2563eb"],
  ["#c084fc", "#a855f7", "#9333ea"],
  ["#38bdf8", "#0ea5e9", "#0284c7"],
];
const CONFETTI_COLORS = ["#818cf8", "#c084fc", "#60a5fa", "#f472b6", "#facc15", "#34d399"];

interface Block { x: number; y: number; z: number; width: number; depth: number; colorSet: string[]; }
interface Debris { x: number; y: number; z: number; width: number; depth: number; colorSet: string[]; vz: number; vx: number; rot: number; rotSpeed: number; life: number; }
interface Particle { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; maxLife: number; color: string; }
interface Confetto { x: number; y: number; vx: number; vy: number; rot: number; rotSpeed: number; life: number; color: string; w: number; h: number; }
interface FloatingText { x: number; y: number; z: number; text: string; life: number; maxLife: number; color: string; }

type Axis = "x" | "y";
export type GamePhase = "idle" | "playing" | "paused" | "over";

interface AchievementToast { id: string; text: string; key: number }

export interface StackGameStats { score: number; combo: number; best: number; bestCombo: number; phase: GamePhase; isNewBest: boolean; }

export interface StackGameHandle {
  start: () => void;
  restart: () => void;
  togglePause: () => void;
  toggleMute: () => void;
  requestFullscreen: () => void;
}

interface StackGameProps {
  onStats?: (stats: StackGameStats) => void;
  onAchievement?: (id: string, label: string) => void;
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
}

function project(x: number, y: number, z: number, originX: number, originY: number, scale: number) {
  const sx = originX + (x - y) * COS_ISO * scale;
  const sy = originY + (x + y) * SIN_ISO * scale - z * scale;
  return [sx, sy] as const;
}

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch { return fallback; }
}

export const StackGame = forwardRef<StackGameHandle, StackGameProps>(function StackGame(
  { onStats, onAchievement, muted, onMutedChange },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const gameRef = useRef({
    stack: [] as Block[],
    moving: null as null | { axis: Axis; x: number; y: number; z: number; width: number; depth: number; dir: number; speed: number; colorSet: string[] },
    debris: [] as Debris[],
    particles: [] as Particle[],
    confetti: [] as Confetto[],
    floatingTexts: [] as FloatingText[],
    cameraZ: 0,
    shake: 0,
    combo: 0,
    score: 0,
    colorIndex: 0,
    phase: "idle" as GamePhase,
  });

  const [phase, setPhase] = useState<GamePhase>("idle");
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [best, setBest] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [isNewBest, setIsNewBest] = useState(false);
  const [toasts, setToasts] = useState<AchievementToast[]>([]);
  const seenThisSession = useRef<Set<string>>(new Set());
  const toastKey = useRef(0);

  useEffect(() => {
    setBest(Number(window.localStorage.getItem(HIGH_SCORE_KEY) ?? 0) || 0);
    setBestCombo(Number(window.localStorage.getItem(BEST_COMBO_KEY) ?? 0) || 0);
  }, []);

  // Single source of truth for notifying the parent: this effect fires
  // whenever StackGame's own local state changes, which is guaranteed to run
  // after render/commit has finished. Nothing else in this component calls
  // onStats directly, so a parent update can never happen synchronously
  // during StackGame's render.
  useEffect(() => {
    onStats?.({ score, combo, best, bestCombo, phase, isNewBest });
  }, [score, combo, best, bestCombo, phase, isNewBest, onStats]);

  const [pendingAchievement, setPendingAchievement] = useState<{ id: string; label: string } | null>(null);

  // Same pattern as onStats above: unlockAchievement only ever sets local
  // state, and this effect is the single place that calls the parent's
  // onAchievement callback, guaranteeing it happens post-render.
  useEffect(() => {
    if (pendingAchievement) onAchievement?.(pendingAchievement.id, pendingAchievement.label);
  }, [pendingAchievement, onAchievement]);

  const unlockAchievement = useCallback((id: string, label: string) => {
    const unlocked = readJSON<string[]>(ACHIEVEMENTS_KEY, []);
    if (!unlocked.includes(id)) {
      unlocked.push(id);
      try { window.localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(unlocked)); } catch { /* ignore */ }
    }
    setPendingAchievement({ id, label });
    if (seenThisSession.current.has(id)) return;
    seenThisSession.current.add(id);
    gameAudio.achievement();
    const key = toastKey.current++;
    setToasts((t) => [...t, { id, text: label, key }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.key !== key)), 2400);
  }, []);

  const spawnParticles = (x: number, y: number, z: number, color: string, count = 14) => {
    const g = gameRef.current;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2.5;
      g.particles.push({ x, y, z, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, vz: Math.random() * 3 + 1, life: 0, maxLife: 30 + Math.random() * 20, color });
    }
  };

  const spawnConfetti = () => {
    const g = gameRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cx = canvas.clientWidth / 2;
    for (let i = 0; i < 46; i++) {
      g.confetti.push({
        x: cx + (Math.random() - 0.5) * 120,
        y: canvas.clientHeight * 0.3,
        vx: (Math.random() - 0.5) * 4,
        vy: -Math.random() * 4 - 2,
        rot: Math.random() * Math.PI,
        rotSpeed: (Math.random() - 0.5) * 0.3,
        life: 0,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        w: 6 + Math.random() * 4,
        h: 10 + Math.random() * 6,
      });
    }
  };

  const spawnFloatingText = (x: number, y: number, z: number, text: string, color: string) => {
    gameRef.current.floatingTexts.push({ x, y, z, text, life: 0, maxLife: 45, color });
  };

  const spawnMoving = useCallback(() => {
    const g = gameRef.current;
    const prev = g.stack[g.stack.length - 1];
    const axis: Axis = g.stack.length % 2 === 0 ? "x" : "y";
    const speed = Math.min(START_SPEED + g.score * SPEED_RAMP, MAX_SPEED);
    const colorSet = PALETTE[g.colorIndex % PALETTE.length];
    g.colorIndex++;
    const range = 165;
    g.moving = {
      axis,
      x: axis === "x" ? prev.x - range : prev.x,
      y: axis === "y" ? prev.y - range : prev.y,
      z: prev.z + BLOCK_HEIGHT,
      width: prev.width,
      depth: prev.depth,
      dir: 1,
      speed,
      colorSet,
    };
  }, []);

  const resetGame = useCallback(() => {
    const g = gameRef.current;
    g.stack = [{ x: 0, y: 0, z: 0, width: BASE_SIZE, depth: BASE_SIZE, colorSet: PALETTE[0] }];
    g.debris = []; g.particles = []; g.confetti = []; g.floatingTexts = [];
    g.cameraZ = 0; g.shake = 0; g.combo = 0; g.score = 0; g.colorIndex = 1;
    g.phase = "playing";
    spawnMoving();
    setScore(0); setCombo(0); setIsNewBest(false); setPhase("playing");
  }, [spawnMoving]);

  const startGame = useCallback(() => {
    try {
      if (!window.localStorage.getItem(PLAYED_BEFORE_KEY)) {
        window.localStorage.setItem(PLAYED_BEFORE_KEY, "1");
        unlockAchievement("explorer", "Portfolio Explorer 🧭");
      }
    } catch { /* ignore */ }
    resetGame();
  }, [resetGame, unlockAchievement]);

  const saveRecentRun = (finalScore: number) => {
    const runs = readJSON<{ score: number; date: string }[]>(RECENT_RUNS_KEY, []);
    runs.unshift({ score: finalScore, date: new Date().toISOString() });
    try { window.localStorage.setItem(RECENT_RUNS_KEY, JSON.stringify(runs.slice(0, 5))); } catch { /* ignore */ }
  };

  const endGame = useCallback(() => {
    const g = gameRef.current;
    g.phase = "over";
    gameAudio.gameOver();
    g.shake = 14;
    setPhase("over");
    saveRecentRun(g.score);

    // Read current best/combo from closure and branch BEFORE calling any
    // setState — updater functions passed to setState must stay pure (no
    // side effects, no calling another component's setState via a prop
    // callback), or React can warn about updating a component while
    // rendering a different one. Parent notification happens entirely via
    // the onStats effect above, keyed off these same state changes.
    const isNewComboRecord = g.combo > bestCombo;
    if (isNewComboRecord) {
      try { window.localStorage.setItem(BEST_COMBO_KEY, String(g.combo)); } catch { /* ignore */ }
      setBestCombo(g.combo);
    }

    const isNewHighScore = g.score > best;
    if (isNewHighScore) {
      try { window.localStorage.setItem(HIGH_SCORE_KEY, String(g.score)); } catch { /* ignore */ }
      setBest(g.score);
      setIsNewBest(true);
      gameAudio.victory();
      spawnConfetti();
      unlockAchievement("high-score", "New High Score! 🏆");
    }
  }, [unlockAchievement, best, bestCombo]);

  const dropBlock = useCallback(() => {
    const g = gameRef.current;
    if (g.phase !== "playing" || !g.moving) return;
    const prev = g.stack[g.stack.length - 1];
    const m = g.moving;
    gameAudio.click();

    let prevStart: number, prevEnd: number, movingStart: number, movingEnd: number;
    if (m.axis === "x") {
      prevStart = prev.x - prev.width / 2; prevEnd = prev.x + prev.width / 2;
      movingStart = m.x - m.width / 2; movingEnd = m.x + m.width / 2;
    } else {
      prevStart = prev.y - prev.depth / 2; prevEnd = prev.y + prev.depth / 2;
      movingStart = m.y - m.depth / 2; movingEnd = m.y + m.depth / 2;
    }
    const overlapStart = Math.max(prevStart, movingStart);
    const overlapEnd = Math.min(prevEnd, movingEnd);
    const overlap = overlapEnd - overlapStart;

    if (overlap <= 2) {
      g.debris.push({ x: m.x, y: m.y, z: m.z, width: m.width, depth: m.depth, colorSet: m.colorSet, vz: 0, vx: (m.axis === "x" ? (m.x > prev.x ? 1 : -1) : 0) * 3, rot: 0, rotSpeed: 0.12, life: 0 });
      g.moving = null;
      endGame();
      return;
    }

    const size = m.axis === "x" ? m.width : m.depth;
    const isPerfect = size - overlap < PERFECT_THRESHOLD;
    const center = (overlapStart + overlapEnd) / 2;

    const newBlock: Block = {
      x: m.axis === "x" ? (isPerfect ? prev.x : center) : prev.x,
      y: m.axis === "y" ? (isPerfect ? prev.y : center) : prev.y,
      z: m.z,
      width: m.axis === "x" ? (isPerfect ? prev.width : overlap) : m.width,
      depth: m.axis === "y" ? (isPerfect ? prev.depth : overlap) : m.depth,
      colorSet: m.colorSet,
    };

    if (!isPerfect) {
      if (m.axis === "x") {
        const leftoverIsLeft = movingStart < overlapStart;
        const leftoverWidth = leftoverIsLeft ? overlapStart - movingStart : movingEnd - overlapEnd;
        const leftoverX = leftoverIsLeft ? movingStart + leftoverWidth / 2 : overlapEnd + leftoverWidth / 2;
        if (leftoverWidth > 1) g.debris.push({ x: leftoverX, y: m.y, z: m.z, width: leftoverWidth, depth: m.depth, colorSet: m.colorSet, vz: 0, vx: leftoverIsLeft ? -2.4 : 2.4, rot: 0, rotSpeed: leftoverIsLeft ? -0.1 : 0.1, life: 0 });
      } else {
        const leftoverIsFront = movingStart < overlapStart;
        const leftoverDepth = leftoverIsFront ? overlapStart - movingStart : movingEnd - overlapEnd;
        const leftoverY = leftoverIsFront ? movingStart + leftoverDepth / 2 : overlapEnd + leftoverDepth / 2;
        if (leftoverDepth > 1) g.debris.push({ x: m.x, y: leftoverY, z: m.z, width: m.width, depth: leftoverDepth, colorSet: m.colorSet, vz: 0, vx: leftoverIsFront ? -2.4 : 2.4, rot: 0, rotSpeed: leftoverIsFront ? -0.1 : 0.1, life: 0 });
      }
      g.combo = 0;
      setCombo(0);
    } else {
      g.combo += 1;
      setCombo(g.combo);
      gameAudio.combo(g.combo);
      if (g.combo === 1) unlockAchievement("perfect-1", "Perfect Stack ✨");
      if (g.combo === 10) { unlockAchievement("combo-10", "10x Combo 🔥"); spawnConfetti(); }
      if (g.combo === 25) { unlockAchievement("combo-25", "25x Combo ⚡"); spawnConfetti(); }
      if (g.combo === 50) { unlockAchievement("combo-50", "50x Combo 🚀"); spawnConfetti(); }
      if (g.combo === 100) { unlockAchievement("combo-100", "100x Combo — Portfolio Master 👑"); spawnConfetti(); }
    }

    gameAudio.place(isPerfect);
    spawnParticles(newBlock.x, newBlock.y, newBlock.z + BLOCK_HEIGHT, isPerfect ? "#c084fc" : newBlock.colorSet[0], isPerfect ? 22 : 10);
    const points = 1 + Math.floor(g.combo / 5);
    spawnFloatingText(newBlock.x, newBlock.y, newBlock.z + BLOCK_HEIGHT + 20, `+${points}`, isPerfect ? "#c084fc" : "#e2e8f0");
    if (!isPerfect) g.shake = 4;

    g.stack.push(newBlock);
    g.score += points;
    setScore(g.score);
    spawnMoving();
  }, [endGame, unlockAchievement, spawnMoving]);

  const togglePause = useCallback(() => {
    if (phase === "playing") {
      gameRef.current.phase = "paused";
      setPhase("paused");
    } else if (phase === "paused") {
      gameRef.current.phase = "playing";
      setPhase("playing");
    }
  }, [phase]);

  const toggleMute = useCallback(() => {
    const next = !muted;
    gameAudio.setMuted(next);
    onMutedChange(next);
  }, [muted, onMutedChange]);

  const requestFullscreen = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen?.();
  }, []);

  useImperativeHandle(ref, () => ({ start: startGame, restart: resetGame, togglePause, toggleMute, requestFullscreen }), [startGame, resetGame, togglePause, toggleMute, requestFullscreen]);

  // ─── Input ───────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (active && ["INPUT", "TEXTAREA"].includes(active.tagName)) return;
      // Don't let game shortcuts fire underneath an open modal (e.g. the
      // command palette) — otherwise closing it with Escape also pauses the game.
      if (document.querySelector('[role="dialog"][aria-modal="true"]')) return;
      if (e.code === "Space" || e.code === "Enter") {
        if (!containerRef.current?.contains(document.activeElement) && gameRef.current.phase === "idle") return;
        e.preventDefault();
        if (gameRef.current.phase === "playing") dropBlock();
        else if (gameRef.current.phase === "idle" || gameRef.current.phase === "over") startGame();
      } else if (e.code === "Escape" && (gameRef.current.phase === "playing" || gameRef.current.phase === "paused")) {
        togglePause();
      } else if (e.key.toLowerCase() === "m") {
        toggleMute();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dropBlock, startGame, togglePause, toggleMute]);

  const handlePointer = useCallback(() => {
    if (gameRef.current.phase === "playing") dropBlock();
  }, [dropBlock]);

  // ─── Render loop ─────────────────────────────────────────────────────
  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx: CanvasRenderingContext2D = context;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function drawCube(x: number, y: number, z: number, w: number, d: number, colorSet: string[], originX: number, originY: number, scale: number, alpha = 1) {
      const hx = w / 2, hy = d / 2;
      const p1 = [x - hx, y - hy], p2 = [x + hx, y - hy], p3 = [x + hx, y + hy], p4 = [x - hx, y + hy];
      const top = [p1, p2, p3, p4].map(([px, py]) => project(px, py, z + BLOCK_HEIGHT, originX, originY, scale));
      const p2b = project(p2[0], p2[1], z, originX, originY, scale);
      const p3b = project(p3[0], p3[1], z, originX, originY, scale);
      const p4b = project(p4[0], p4[1], z, originX, originY, scale);

      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.moveTo(...top[0]); ctx.lineTo(...top[1]); ctx.lineTo(...top[2]); ctx.lineTo(...top[3]); ctx.closePath();
      ctx.fillStyle = colorSet[0]; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(...top[1]); ctx.lineTo(...top[2]); ctx.lineTo(...p3b); ctx.lineTo(...p2b); ctx.closePath();
      ctx.fillStyle = colorSet[1]; ctx.fill();
      ctx.beginPath();
      ctx.moveTo(...top[2]); ctx.lineTo(...top[3]); ctx.lineTo(...p4b); ctx.lineTo(...p3b); ctx.closePath();
      ctx.fillStyle = colorSet[2]; ctx.fill();
      ctx.globalAlpha = 1;
    }

    function frame(t: number) {
      const g = gameRef.current;
      const dt = lastTimeRef.current ? Math.min((t - lastTimeRef.current) / 16.67, 3) : 1;
      lastTimeRef.current = t;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (width === 0 || height === 0) { rafRef.current = requestAnimationFrame(frame); return; }

      // Camera targets the top surface of the stack (where the next block will
      // land), so the newest block stays anchored near the same screen
      // position no matter how tall the tower gets — this is what makes the
      // game playable indefinitely instead of scrolling off the top.
      const lastBlock = g.stack[g.stack.length - 1];
      const targetCameraZ = lastBlock ? lastBlock.z + BLOCK_HEIGHT : 0;
      g.cameraZ += (targetCameraZ - g.cameraZ) * 0.08;

      if (g.moving && g.phase === "playing") {
        const range = 165;
        const prev = g.stack[g.stack.length - 1];
        if (g.moving.axis === "x") {
          g.moving.x += g.moving.dir * g.moving.speed * dt;
          if (g.moving.x > prev.x + range) g.moving.dir = -1;
          if (g.moving.x < prev.x - range) g.moving.dir = 1;
        } else {
          g.moving.y += g.moving.dir * g.moving.speed * dt;
          if (g.moving.y > prev.y + range) g.moving.dir = -1;
          if (g.moving.y < prev.y - range) g.moving.dir = 1;
        }
      }

      g.debris.forEach((d) => { d.vz -= 0.5 * dt; d.z += d.vz * dt * 0.5; d.x += d.vx * dt; d.rot += d.rotSpeed * dt; d.life += dt; });
      g.debris = g.debris.filter((d) => d.z > -400);

      g.particles.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt; p.vz -= 0.15 * dt; p.life += dt; });
      g.particles = g.particles.filter((p) => p.life < p.maxLife);

      g.confetti.forEach((c) => { c.x += c.vx * dt; c.y += c.vy * dt; c.vy += 0.12 * dt; c.rot += c.rotSpeed * dt; c.life += dt; });
      g.confetti = g.confetti.filter((c) => c.life < 140 && c.y < height + 40);

      g.floatingTexts.forEach((f) => { f.z += 0.6 * dt; f.life += dt; });
      g.floatingTexts = g.floatingTexts.filter((f) => f.life < f.maxLife);

      g.shake *= 0.9; if (g.shake < 0.05) g.shake = 0;

      ctx.clearRect(0, 0, width, height);
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, "#0a0f2e");
      grad.addColorStop(1, "#050816");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      const shakeX = g.shake ? (Math.random() - 0.5) * g.shake : 0;
      const shakeY = g.shake ? (Math.random() - 0.5) * g.shake : 0;
      const scale = Math.min(width, height) / 480;
      const originX = width / 2 + shakeX;
      // originY rises by exactly cameraZ*scale as the tower grows, which
      // cancels the -z*scale term in project() for the newest block —
      // keeping it pinned near the same screen height forever while older
      // blocks below it drift further down and off-screen.
      const originY = height * 0.42 + g.cameraZ * scale + shakeY;

      // Only the blocks near the top of the tower can be on-screen once the
      // camera has scrolled past them — cap what we draw so performance stays
      // flat even after hundreds of placements. Game logic still reads the
      // full (untouched) g.stack array, so scoring/axis alternation is unaffected.
      const maxVisibleBlocks = Math.ceil(height / (BLOCK_HEIGHT * scale)) + 12;
      const visibleStack = g.stack.length > maxVisibleBlocks ? g.stack.slice(-maxVisibleBlocks) : g.stack;

      visibleStack.forEach((b) => drawCube(b.x, b.y, b.z, b.width, b.depth, b.colorSet, originX, originY, scale));
      g.debris.forEach((d) => drawCube(d.x, d.y, d.z, d.width, d.depth, d.colorSet, originX, originY, scale, Math.max(0, 1 - d.life / 90)));
      if (g.moving && g.phase !== "over") drawCube(g.moving.x, g.moving.y, g.moving.z, g.moving.width, g.moving.depth, g.moving.colorSet, originX, originY, scale);

      g.particles.forEach((p) => {
        const [sx, sy] = project(p.x, p.y, p.z, originX, originY, scale);
        ctx.globalAlpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.beginPath(); ctx.arc(sx, sy, 2.5 * scale, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
      });

      g.floatingTexts.forEach((f) => {
        const [sx, sy] = project(f.x, f.y, f.z, originX, originY, scale);
        ctx.globalAlpha = Math.max(0, 1 - f.life / f.maxLife);
        ctx.fillStyle = f.color;
        ctx.font = `bold ${14 * scale}px "Space Grotesk", sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(f.text, sx, sy);
        ctx.globalAlpha = 1;
      });

      g.confetti.forEach((c) => {
        ctx.save();
        ctx.globalAlpha = Math.max(0, 1 - c.life / 140);
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      });
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(frame);
    }

    rafRef.current = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#050816] overflow-hidden rounded-2xl select-none touch-none">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        onPointerDown={handlePointer}
        aria-label="3D Isometric Stack game canvas"
        role="img"
      />

      {(phase === "playing" || phase === "paused") && (
        <div className="absolute top-4 inset-x-0 flex flex-col items-center pointer-events-none">
          <span className="font-display font-bold text-3xl sm:text-4xl text-foreground drop-shadow-[0_2px_12px_rgba(129,140,248,0.6)]">{score}</span>
          {combo > 1 && (
            <motion.span key={combo} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-primary/20 border border-primary/40 text-primary">
              {combo}x combo
            </motion.span>
          )}
        </div>
      )}

      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 items-end pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.key}
              initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="px-3 py-2 rounded-lg bg-[#0a0f1e]/90 backdrop-blur-xl border border-primary/30 shadow-lg text-xs font-display font-medium text-foreground flex items-center gap-1.5"
            >
              <Trophy className="w-3.5 h-3.5 text-primary flex-shrink-0" />
              {toast.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {phase === "idle" && (
          <motion.button
            onClick={startGame}
            data-cursor="PLAY"
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#050816]/60 backdrop-blur-sm text-foreground"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <div className="text-4xl">🎮</div>
            <span className="font-display font-semibold">Tap to Start</span>
            <span className="text-xs text-muted-foreground">Space · Click · Tap</span>
          </motion.button>
        )}
        {phase === "paused" && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center bg-[#050816]/70 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <button onClick={togglePause} className="px-6 py-3 rounded-xl font-display font-medium text-primary-foreground bg-primary">Resume</button>
          </motion.div>
        )}
        {phase === "over" && (
          <motion.div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#050816]/75 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <p className="font-display font-bold text-lg text-foreground">{isNewBest ? "New High Score! 🏆" : "Game Over"}</p>
            <p className="font-display font-bold text-4xl bg-gradient-to-r from-primary to-violet-400 bg-clip-text text-transparent">{score}</p>
            <button onClick={resetGame} className="mt-1 px-6 py-3 rounded-xl font-display font-medium text-primary-foreground bg-gradient-to-r from-primary to-violet-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              Play Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
