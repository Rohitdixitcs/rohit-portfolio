// Lightweight synthesized sound engine using the Web Audio API.
// No external audio files are bundled — every effect is generated at
// runtime with oscillators, which keeps the game's payload tiny and avoids
// any licensing questions around third-party sound assets.

class GameAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _muted = false;
  private _volume = 0.6;

  private ensureCtx() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : this._volume;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  setVolume(v: number) {
    this._volume = Math.min(1, Math.max(0, v));
    if (this.master) this.master.gain.value = this._muted ? 0 : this._volume;
  }

  get volume() { return this._volume; }

  setMuted(m: boolean) {
    this._muted = m;
    if (this.master) this.master.gain.value = m ? 0 : this._volume;
  }

  get muted() { return this._muted; }

  private tone(freq: number, duration: number, type: OscillatorType = "sine", delay = 0, gain = 0.25) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    const t0 = ctx.currentTime + delay;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + duration + 0.05);
  }

  private noiseBurst(duration: number, gain = 0.18) {
    const ctx = this.ensureCtx();
    if (!ctx || !this.master) return;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(g);
    g.connect(this.master);
    src.start();
  }

  click() { this.tone(520, 0.08, "sine", 0, 0.2); }

  place(perfect: boolean) {
    if (perfect) {
      this.tone(880, 0.12, "triangle", 0, 0.28);
      this.tone(1318.5, 0.18, "triangle", 0.04, 0.22);
    } else {
      this.tone(440, 0.1, "sine", 0, 0.25);
    }
  }

  slice() { this.noiseBurst(0.15, 0.15); }

  combo(count: number) {
    const base = 660;
    const step = Math.min(count, 8);
    this.tone(base + step * 40, 0.12, "square", 0, 0.15);
  }

  gameOver() {
    this.tone(392, 0.18, "sawtooth", 0, 0.22);
    this.tone(329.6, 0.18, "sawtooth", 0.15, 0.2);
    this.tone(261.6, 0.3, "sawtooth", 0.3, 0.2);
  }

  victory() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => this.tone(f, 0.25, "triangle", i * 0.09, 0.22));
  }

  achievement() {
    this.tone(784, 0.1, "sine", 0, 0.2);
    this.tone(987.77, 0.16, "sine", 0.08, 0.22);
  }
}

export const gameAudio = new GameAudio();
