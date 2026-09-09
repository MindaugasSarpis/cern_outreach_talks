// Collision sound for the hero's interactive slides, synthesised with Web
// Audio (no assets, deterministic). One voice, ~0.45 s:
//
//   a low sine "thump" (95 → 38 Hz, fast exponential decay) for the weight,
//   under a white-noise "crack" through a resonant band-pass that sweeps
//   down (2.6 kHz → 180 Hz) — bright at the impact, dark in the tail. Output
//   peaks near -12 dBFS; laptop speakers still hear the crack when they lose
//   the thump.
//
// Autoplay policy: browsers keep an AudioContext suspended until the page
// has seen a click, tap, or key press. warmAudio() is called from those
// gestures (ParticleHero: the `c` key and clicks); it creates the context
// once and resumes it. Every failure path returns quietly — a slide must
// never log an error because a venue machine has no audio device.
//
// Ported in spirit from the lessons landing (landing/src/sound.js: hum +
// swoosh); the voice here is new.

let ctx = null;
let noise = null;

function getContext() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try { ctx = new AC(); } catch { return null; }
  return ctx;
}

// Create the context (if needed) and ask it to run. Idempotent; call from a
// user gesture. Returns the context or null when Web Audio is unavailable.
export function warmAudio() {
  const ac = getContext();
  if (ac && ac.state !== 'running') { try { ac.resume().catch(() => {}); } catch { /* noop */ } }
  return ac;
}

const LENGTH = 0.45;      // s to silence
const NOISE_PEAK = 0.55;  // pre-filter; the band-pass keeps a fraction of it
const THUMP_PEAK = 0.28;

function getNoise(ac) {
  if (noise) return noise;
  const n = Math.ceil(ac.sampleRate * (LENGTH + 0.05));
  const buf = ac.createBuffer(1, n, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  noise = buf;
  return noise;
}

export function playCollision() {
  const ac = getContext();
  if (!ac) return { played: false, reason: 'no-webaudio' };
  try {
    if (ac.state === 'suspended') ac.resume().catch(() => {});
    const t0 = ac.currentTime;
    const master = ac.createGain();
    master.gain.value = 1;
    master.connect(ac.destination);

    // crack
    const src = ac.createBufferSource();
    src.buffer = getNoise(ac);
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(2600, t0);
    bp.frequency.exponentialRampToValueAtTime(180, t0 + LENGTH * 0.8);
    const ng = ac.createGain();
    ng.gain.setValueAtTime(NOISE_PEAK, t0);
    ng.gain.exponentialRampToValueAtTime(NOISE_PEAK * 0.01, t0 + LENGTH * 0.7);
    ng.gain.linearRampToValueAtTime(0, t0 + LENGTH);
    src.connect(bp).connect(ng).connect(master);

    // thump
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, t0);
    osc.frequency.exponentialRampToValueAtTime(38, t0 + 0.28);
    const og = ac.createGain();
    og.gain.setValueAtTime(0.0001, t0);
    og.gain.exponentialRampToValueAtTime(THUMP_PEAK, t0 + 0.012);
    og.gain.exponentialRampToValueAtTime(THUMP_PEAK * 0.01, t0 + 0.4);
    og.gain.linearRampToValueAtTime(0, t0 + LENGTH);
    osc.connect(og).connect(master);

    src.start(t0); src.stop(t0 + LENGTH + 0.03);
    osc.start(t0); osc.stop(t0 + LENGTH + 0.03);
    osc.onended = () => {
      try { for (const n of [src, bp, ng, osc, og, master]) n.disconnect(); } catch { /* noop */ }
    };
    return { played: true, state: ac.state };
  } catch (e) {
    return { played: false, reason: String(e && e.message || e) };
  }
}
