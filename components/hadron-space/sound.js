// The sound of the hadron space, synthesised with Web Audio (no assets): the
// lessons landing's hum (landing/src/sound.js) made continuous.
//
//   A low drone on a 55 Hz fundamental: two sawtooths 5 cents apart, the second at
//   0.4 of the first, so their slow beating (one swell every ~6 s) moves the drone
//   without emptying it (at 7 cents and equal level the fundamental cancelled every
//   4.5 s and the hum pulsed; at 0.6 the level still swung 7.5 dB), and a sine an octave up for laptop speakers, which
//   reproduce little below ~150 Hz, all through a resonant low-pass whose cutoff
//   breathes on a slow LFO. It swells in over 2.5 s, holds for as long as it is
//   wanted and fades over 1.8 s. Output peaks near -14 dBFS.
//
// HadronSpace.vue runs it while the cover or the close (the hero station) is on
// screen, in the audience window only: not on /presenter, so two open windows do
// not hum twice. Autoplay policy: nothing starts before the page has seen a key
// press or pointer down; from then on the hum follows the pose. Every failure
// path returns quietly.
import { warmAudio } from '../particle-hero/sound.js';

const F0 = 55, DETUNE = 5, SAW_B = 0.4, PEAK = 0.1;
const ATTACK = 2.5, RELEASE = 1.8;
const CUT_LO = 90, CUT_HI = 320, LFO_HZ = 0.25, LFO_DEPTH = 40, Q = 1.8;

let hum = null;

// from wherever the automation is now, glide to a value
function glide(param, t, value, secs) {
  const cur = param.value;
  param.cancelScheduledValues(t);
  param.setValueAtTime(cur, t);
  param.linearRampToValueAtTime(value, t + secs);
}

export function startHum() {
  const ac = warmAudio();
  if (!ac) return { playing: false, reason: 'no-webaudio' };
  try {
    const t = ac.currentTime;
    if (hum) {
      // already humming, or fading out: cancel the fade and swell back
      if (hum.stopTimer) {
        clearTimeout(hum.stopTimer); hum.stopTimer = 0;
        glide(hum.master.gain, t, PEAK, ATTACK * 0.5);
        glide(hum.filter.frequency, t, CUT_HI, ATTACK * 0.5);
      }
      return { playing: true, state: ac.state };
    }
    const sawA = ac.createOscillator(); sawA.type = 'sawtooth'; sawA.frequency.value = F0;
    const sawB = ac.createOscillator(); sawB.type = 'sawtooth'; sawB.frequency.value = F0; sawB.detune.value = DETUNE;
    const sawBGain = ac.createGain(); sawBGain.gain.value = SAW_B;
    const octave = ac.createOscillator(); octave.type = 'sine'; octave.frequency.value = F0 * 2;
    const octaveGain = ac.createGain(); octaveGain.gain.value = 0.35;
    const filter = ac.createBiquadFilter(); filter.type = 'lowpass'; filter.Q.value = Q;
    filter.frequency.setValueAtTime(CUT_LO, t);
    filter.frequency.exponentialRampToValueAtTime(CUT_HI, t + ATTACK + 1);
    const lfo = ac.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = LFO_HZ;
    const lfoGain = ac.createGain(); lfoGain.gain.value = LFO_DEPTH;
    lfo.connect(lfoGain).connect(filter.frequency);
    const master = ac.createGain();
    master.gain.setValueAtTime(0.0001, t);
    master.gain.linearRampToValueAtTime(PEAK, t + ATTACK);
    const analyser = ac.createAnalyser(); analyser.fftSize = 8192;   // for humProbe()
    sawA.connect(filter); sawB.connect(sawBGain).connect(filter);
    octave.connect(octaveGain).connect(filter);
    filter.connect(master).connect(analyser).connect(ac.destination);
    const oscs = [sawA, sawB, octave, lfo];
    for (const o of oscs) o.start(t);
    hum = { ac, oscs, nodes: [...oscs, sawBGain, octaveGain, lfoGain, filter, master, analyser], master, filter, analyser, stopTimer: 0 };
    return { playing: true, state: ac.state };
  } catch (e) {
    return { playing: false, reason: String((e && e.message) || e) };
  }
}

export function stopHum() {
  if (!hum || hum.stopTimer) return;
  const h = hum;
  try {
    const t = h.ac.currentTime;
    glide(h.master.gain, t, 0.0001, RELEASE);
    glide(h.filter.frequency, t, CUT_LO, RELEASE);
  } catch { /* noop */ }
  h.stopTimer = setTimeout(() => {
    try { for (const o of h.oscs) o.stop(); for (const n of h.nodes) n.disconnect(); } catch { /* noop */ }
    if (hum === h) hum = null;
  }, (RELEASE + 0.3) * 1000);
}

// For the headless probes: the output level and the strongest frequency now.
export function humProbe() {
  if (!hum) return { playing: false };
  try {
    const a = hum.analyser;
    const buf = new Float32Array(a.fftSize); a.getFloatTimeDomainData(buf);
    let s = 0; for (const x of buf) s += x * x;
    const spec = new Float32Array(a.frequencyBinCount); a.getFloatFrequencyData(spec);
    let bi = 1; for (let i = 2; i < spec.length; i++) if (spec[i] > spec[bi]) bi = i;
    return { playing: true, fading: !!hum.stopTimer, state: hum.ac.state, rmsDb: +(20 * Math.log10(Math.sqrt(s / buf.length) + 1e-9)).toFixed(1), peakHz: Math.round(bi * hum.ac.sampleRate / a.fftSize) };
  } catch (e) {
    return { playing: true, error: String(e) };
  }
}
