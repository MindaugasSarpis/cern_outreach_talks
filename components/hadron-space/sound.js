// The opening sound of the hadron space, synthesised with Web Audio (no
// assets), in the manner of particle-hero/sound.js:
//
//   playAssembly(seconds): a low swell while the five quarks fly in — two
//   sines a fifth apart (E1, B1) and a soft triangle an octave up, through a
//   low-pass that opens from 110 to 700 Hz, plus a breath of band-passed
//   noise; the gain rises over the flight and lets go after it.
//   playLanding(): the last quark lands — a deep thump (70 → 28 Hz) under a
//   short, dark crack. Peaks near -14 dBFS: low, as asked.
//
// Autoplay policy: a browser keeps an AudioContext suspended until the page
// has seen a click, tap or key press, so the assembly on first load is
// silent; warmAudio() runs on the first key press or pointer down (see
// HadronSpace.vue), after which every assembly — a flight back to the cover,
// the close, or `c` — sounds. Every failure path returns quietly.

import { warmAudio } from '../particle-hero/sound.js';

let noise = null;
function getNoise(ac, seconds) {
  if (noise && noise.duration >= seconds) return noise;
  const n = Math.ceil(ac.sampleRate * seconds);
  const buf = ac.createBuffer(1, n, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  noise = buf;
  return noise;
}
const ready = () => { const ac = warmAudio(); return ac && ac.state === 'running' ? ac : null; };
const cleanup = (nodes) => { try { for (const n of nodes) n.disconnect(); } catch { /* noop */ } };

export function playAssembly(seconds = 3.0) {
  const ac = ready();
  if (!ac) return { played: false, reason: 'audio-not-running' };
  try {
    const t0 = ac.currentTime, tEnd = t0 + seconds, tOff = tEnd + 0.9;
    const master = ac.createGain(); master.gain.value = 0.9; master.connect(ac.destination);

    // the swell: a low-pass opening over the flight
    const lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = 3.5;
    lp.frequency.setValueAtTime(110, t0); lp.frequency.exponentialRampToValueAtTime(700, tEnd);
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.2, t0 + seconds * 0.8);
    g.gain.setValueAtTime(0.2, tEnd);
    g.gain.exponentialRampToValueAtTime(0.0005, tOff);
    lp.connect(g).connect(master);
    const voices = [];
    for (const [type, f, level] of [['sine', 41.2, 1.0], ['sine', 61.74, 0.6], ['triangle', 82.4, 0.25]]) {
      const o = ac.createOscillator(); o.type = type; o.frequency.value = f;
      const og = ac.createGain(); og.gain.value = level;
      o.connect(og).connect(lp); o.start(t0); o.stop(tOff + 0.05); voices.push(o, og);
    }
    // a breath of air under it
    const src = ac.createBufferSource(); src.buffer = getNoise(ac, seconds + 1.2);
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 0.8;
    bp.frequency.setValueAtTime(220, t0); bp.frequency.exponentialRampToValueAtTime(1200, tEnd);
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.0001, t0);
    ng.gain.exponentialRampToValueAtTime(0.05, tEnd);
    ng.gain.exponentialRampToValueAtTime(0.0005, tOff);
    src.connect(bp).connect(ng).connect(master); src.start(t0); src.stop(tOff + 0.05);

    voices[0].onended = () => cleanup([...voices, lp, g, src, bp, ng, master]);
    return { played: true };
  } catch (e) {
    return { played: false, reason: String((e && e.message) || e) };
  }
}

export function playLanding() {
  const ac = ready();
  if (!ac) return { played: false, reason: 'audio-not-running' };
  try {
    const t0 = ac.currentTime, len = 0.9;
    const master = ac.createGain(); master.gain.value = 0.9; master.connect(ac.destination);

    // the thump
    const osc = ac.createOscillator(); osc.type = 'sine';
    osc.frequency.setValueAtTime(70, t0); osc.frequency.exponentialRampToValueAtTime(28, t0 + 0.35);
    const og = ac.createGain();
    og.gain.setValueAtTime(0.0001, t0);
    og.gain.exponentialRampToValueAtTime(0.32, t0 + 0.015);
    og.gain.exponentialRampToValueAtTime(0.003, t0 + len * 0.85);
    og.gain.linearRampToValueAtTime(0, t0 + len);
    osc.connect(og).connect(master); osc.start(t0); osc.stop(t0 + len + 0.03);

    // a short, dark crack over it
    const src = ac.createBufferSource(); src.buffer = getNoise(ac, 1.0);
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(1800, t0); bp.frequency.exponentialRampToValueAtTime(160, t0 + 0.3);
    const ng = ac.createGain();
    ng.gain.setValueAtTime(0.16, t0);
    ng.gain.exponentialRampToValueAtTime(0.002, t0 + 0.3);
    ng.gain.linearRampToValueAtTime(0, t0 + 0.4);
    src.connect(bp).connect(ng).connect(master); src.start(t0); src.stop(t0 + 0.45);

    osc.onended = () => cleanup([osc, og, src, bp, ng, master]);
    return { played: true };
  } catch (e) {
    return { played: false, reason: String((e && e.message) || e) };
  }
}
