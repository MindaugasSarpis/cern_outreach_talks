// The opening's sound, synthesised with Web Audio (no files, so no licence and
// nothing to fetch: it is in every build and in the venue zip):
//
//   the approach  a sub-bass swell under the bunches' run-in, a 38 Hz sine and its
//                 octave over brown noise low-passed at 140 Hz, rising over the
//                 run-in and a little sharp as they near;
//   the crossing  a soft deep thump (60 → 30 Hz), and the swell drops to a held,
//                 lower drone while the world stands nearly still;
//   the fly-out   the drone lets go as the debris runs out, fading over four
//                 seconds at the pitch it holds. No boom: the falling, saturated
//                 sine it had (110 → 28 Hz, with a burst of low noise) read on a
//                 laptop's speakers as a car driving away (owner, 12 Oct 2026).
//
// While the world stands nearly still the drone follows its clock rate (the
// engine's `rate` event, or the rate the builder reports): slowed, it sinks; as
// the world speeds up, it rises. A compressor keeps it low enough to talk over.
//
// Audio comes from the stage (`ctx.audio()`: its context once a key or click has
// unlocked it, and its master gain), so the presenter window stays silent. With
// an older stage it makes its own context on the first key or pointer, and stays
// silent on /presenter.

let own = null;
function fallbackAudio() {
  if (/\/presenter/.test(location.hash + location.pathname)) return null;
  if (own) return own.context.state === 'running' ? own : null;
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    const context = new AC();
    const out = context.createGain(); out.gain.value = 1; out.connect(context.destination);
    own = { context, out };
    const wake = () => context.resume().catch(() => {});
    for (const e of ['keydown', 'pointerdown']) window.addEventListener(e, wake, { capture: true });
    wake();
    return context.state === 'running' ? own : null;
  } catch { return null; }
}

function brown(ac, secs) {
  const n = Math.round(ac.sampleRate * secs), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < n; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
  const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
  return src;
}

export function openingSound(ctx, bus, o = {}) {
  const level = o.level ?? 0.32;
  let run = null;
  const audio = () => (ctx.audio ? ctx.audio() : fallbackAudio());

  function stop(fade = 1.0) {
    if (!run) return;
    const r = run; run = null;
    const t = r.ac.currentTime;
    r.master.gain.cancelScheduledValues(t);
    r.master.gain.setValueAtTime(r.master.gain.value, t);
    r.master.gain.linearRampToValueAtTime(0.0001, t + fade);
    setTimeout(() => { for (const n of r.nodes) { try { n.stop?.(); n.disconnect(); } catch {} } }, (fade + 0.2) * 1000);
  }

  function start() {
    stop(0.3);
    const a = audio();
    if (!a) return;
    const ac = a.context, t = ac.currentTime, nodes = [];
    const comp = ac.createDynamicsCompressor();
    comp.threshold.value = -24; comp.knee.value = 12; comp.ratio.value = 4; comp.attack.value = 0.01; comp.release.value = 0.4;
    const master = ac.createGain(); master.gain.value = level;
    comp.connect(master).connect(a.out);
    nodes.push(comp, master);
    // the swell
    const sub = ac.createOscillator(); sub.type = 'sine'; sub.frequency.value = 38;
    const oct = ac.createOscillator(); oct.type = 'sine'; oct.frequency.value = 76;
    const octG = ac.createGain(); octG.gain.value = 0.3;
    const noise = brown(ac, 4), lp = ac.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 140; lp.Q.value = 0.7;
    const noiseG = ac.createGain(); noiseG.gain.value = 0.5;
    const swell = ac.createGain(); swell.gain.setValueAtTime(0.0001, t); swell.gain.exponentialRampToValueAtTime(0.7, t + 2.6);
    sub.connect(swell); oct.connect(octG).connect(swell); noise.connect(lp).connect(noiseG).connect(swell);
    swell.connect(comp);
    sub.frequency.setValueAtTime(36, t); sub.frequency.linearRampToValueAtTime(42, t + 2.6);
    oct.frequency.setValueAtTime(72, t); oct.frequency.linearRampToValueAtTime(84, t + 2.6);
    for (const n of [sub, oct, noise]) n.start(t);
    nodes.push(sub, oct, octG, noise, lp, noiseG, swell);
    run = { ac, master, comp, nodes, sub, oct, swell, lp, crossed: false, flown: false, rate: 1 };
  }

  function cross() {
    if (!run || run.crossed) return;
    run.crossed = true;
    const { ac, comp, nodes } = run, t = ac.currentTime;
    // the thump
    const th = ac.createOscillator(); th.type = 'sine';
    th.frequency.setValueAtTime(62, t); th.frequency.exponentialRampToValueAtTime(30, t + 0.3);
    const thG = ac.createGain(); thG.gain.setValueAtTime(0.0001, t); thG.gain.exponentialRampToValueAtTime(0.9, t + 0.02); thG.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    th.connect(thG).connect(comp); th.start(t); th.stop(t + 1.5);
    nodes.push(th, thG);
    // the swell settles to a held drone, lower: time has nearly stopped
    run.sub.frequency.cancelScheduledValues(t); run.sub.frequency.setValueAtTime(run.sub.frequency.value, t); run.sub.frequency.linearRampToValueAtTime(31, t + 0.8);
    run.oct.frequency.cancelScheduledValues(t); run.oct.frequency.setValueAtTime(run.oct.frequency.value, t); run.oct.frequency.linearRampToValueAtTime(62, t + 0.8);
    run.lp.frequency.setTargetAtTime(90, t, 0.3);
    run.swell.gain.cancelScheduledValues(t); run.swell.gain.setValueAtTime(Math.max(0.0001, run.swell.gain.value), t); run.swell.gain.setTargetAtTime(0.45, t, 0.4);
  }

  // the fly-out: the drone lets go over four seconds, its pitch held where it is
  function flyout() {
    if (!run || run.flown) return;
    run.flown = true;
    const t = run.ac.currentTime;
    for (const p of [run.sub.frequency, run.oct.frequency, run.lp.frequency]) { p.cancelScheduledValues(t); p.setValueAtTime(p.value, t); }
    run.swell.gain.cancelScheduledValues(t); run.swell.gain.setValueAtTime(Math.max(0.0001, run.swell.gain.value), t);
    run.swell.gain.exponentialRampToValueAtTime(0.0001, t + 4);
    const r = run;
    setTimeout(() => { if (run === r) stop(0.5); }, 4500);
  }

  // the world's clock rate: the drone follows it, and a speed-up after the crossing
  // is the fly-out (with no rate in the engine, the fly-out follows the crossing)
  function rate(r) {
    if (!run) return;
    const t = run.ac.currentTime;
    if (run.crossed && !run.flown) {
      if (r > 0.6 && run.rate <= 0.6) flyout();
      else run.sub.frequency.setTargetAtTime(31 * (0.8 + 0.2 * Math.min(1, r)), t, 0.2);
    }
    run.rate = r;
  }

  const name = o.name;
  bus.on('start', (d) => { if (d.name === name) start(); });
  bus.on('cross', (d) => {
    if (d.name !== name) return;
    cross();
    if (!ctx.rate) setTimeout(flyout, 150);
  });
  bus.on('rate', (d) => { if (d.name === name) rate(d.rate); });
  bus.on('stop', (d) => { if (d.name === name) stop(1.0); });
  ctx.on?.('rate', (d) => rate(d.rate));
}
