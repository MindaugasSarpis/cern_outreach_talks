// dk-hist: a histogram of grains, one grain per entry (bible §3: "a plot is a heap of
// grains, one grain per entry; its axis is a line of dim grains"). Lifted and merged
// from Užsikrauk karjerai's setup/grains.js:851-1091 (fill from a source box on a bowed
// arc, lead), OpenData's setup/grains.js:1221-1479 (seeded, value(), rise, the
// budget's unit) and MasterTalk's setup/grains.js:63-283 (the step bus, focus), ported
// to v0.11 (GRAIN_GLSL through morph.js, stepper, busy), seeded, palette colours only.
//
// One object, every step the series needs (bible §4); see README.md for the fields.
// A step is an object; step k is steps 1..k merged in order (a later step keeps the
// keys of the ones before it; `key: null` drops one). Step 0 is hidden.
import { Group, Vector3 } from 'three';
import { GRAIN, OURS, OURS_ROW, SEED, MASS, HEIGHT, TICK_MASS, LABEL, roles, alphaFor, fmt } from './style.js';
import { mulberry32, poisson, order as seriesOrder } from './rng.js';
import { fixedLabel, shade, niceTicks } from './label.js';
import { createMorph, staticGrains, toneGrains, OFF, MOTION } from './morph.js';

export const TYPE = 'dk-hist';
export const FIELDS = ['pos', 'name', 'grains'];
export const OWNER = 'core';

// the data files an object loads (check.mjs checks they exist and match the manifest)
export function files(o) {
  const out = [];
  const steps = Array.isArray(o.steps) ? o.steps : [];
  const has = (k) => steps.some((s) => s && typeof s === 'object' && s[k] != null);
  if (o.src) out.push(o.src);
  if (!o.src && !o.model) {
    const v = o.values ?? 'd0.f32';
    out.push(v);
    if (!o.cols) out.push(v.replace(/\.f32$/, '.json'));
  }
  if (has('weights')) out.push(typeof o.weights === 'string' ? o.weights : o.weights?.file ?? (o.weights ? null : 'd0-psig.f32'));
  if (has('select')) out.push(o.selections ?? 'd0-select.json');
  if (o.model?.rolls?.file) out.push(o.model.rolls.file);
  return out.filter(Boolean);
}

// a dotted path into a bake file ('falling.rolls', 'flat.rolls.3')
const getIn = (d, path) => { let v = d; for (const k of String(path ?? '').split('.').filter(Boolean)) { if (v == null) return undefined; v = v[/^\d+$/.test(k) ? Number(k) : k]; } return v; };
// a baked roll's counts: an array of counts, or an object with `counts` (toys.json's
// falling.rolls[r] = { values, counts, z, maxBin, maxZ, alarm, alarmAt })
const rollCounts = (r) => (Array.isArray(r) ? r : Array.isArray(r?.counts) ? r.counts : null);
// the bins a baked roll's own alarm lit: `alarmBins` (a list), `alarmBin`, the bins inside
// `alarmAt` ([lo, hi] in data units), or `maxBin` when `alarm` is true; none otherwise
export function bakedAlarmBins(r, lo, bin, nb) {
  if (!r || Array.isArray(r)) return [];
  if (Array.isArray(r.alarmBins)) return r.alarmBins.map(Number).filter((b) => b >= 0 && b < nb);
  if (Number.isInteger(r.alarmBin)) return [r.alarmBin];
  if (Array.isArray(r.alarmAt) && r.alarmAt.length === 2) {
    const out = [];
    for (let b = 0; b < nb; b++) { const c = lo + (b + 0.5) * bin; if (c >= r.alarmAt[0] && c <= r.alarmAt[1]) out.push(b); }
    return out;
  }
  return r.alarm === true && Number.isInteger(r.maxBin) ? [r.maxBin] : [];
}

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildHist(o, ctx, stage, kit), { fields: FIELDS });
}

// step k: steps 1..k merged (null drops a key); 0 → null (hidden)
export function stateAt(steps, k) {
  if (!(k > 0)) return null;
  const s = {};
  for (let i = 1; i <= Math.min(k, steps.length - 1); i++) {
    const st = steps[i];
    if (st && typeof st === 'object') for (const [key, v] of Object.entries(st)) { if (v === null) delete s[key]; else s[key] = v; }
  }
  return s;
}

// [col, op, v] or [[col, op, v], …] → (row) => bool
function cutTest(spec, col) {
  if (!spec) return null;
  const list = Array.isArray(spec[0]) ? spec : [spec];
  const tests = list.map(([c, op, v]) => {
    const x = col(c);
    if (!x) { console.warn(`dk-hist: no column ${c}`); return () => true; }
    switch (op) {
      case '<': return (r) => x[r] < v;
      case '<=': return (r) => x[r] <= v;
      case '>': return (r) => x[r] > v;
      case '>=': return (r) => x[r] >= v;
      case '==': return (r) => x[r] === v;
      case '!=': return (r) => x[r] !== v;
      case 'finite': return (r) => Number.isFinite(x[r]);
      case 'in': {
        const rs = Array.isArray(v[0]) ? v : [v];
        return (r) => rs.some(([a, b]) => x[r] >= a && x[r] <= b);
      }
      default: console.warn(`dk-hist: unknown cut op ${op}`); return () => true;
    }
  });
  return (r) => { for (const t of tests) if (!t(r)) return false; return true; };
}

// the model's expected count per bin for n entries
function expected(model, lo, bin, nb, n) {
  if (Array.isArray(model.expected)) {
    const s = model.expected.reduce((a, b) => a + b, 0) || 1;
    return model.expected.map((e) => (e * n) / s);
  }
  const f = (x) => {
    let y = 0;
    for (const t of [...(model.bkg || []), ...(model.sig || [])]) {
      const [kind, a = 1, b = 0, c = 0] = t;
      if (kind === 'flat') y += a;
      else if (kind === 'exp') y += a * Math.exp(b * (x - lo));
      else if (kind === 'poly1') y += a + b * (x - lo);
      else if (kind === 'power') y += a * Math.pow(Math.max(1e-9, x - lo + bin), b);
      else if (kind === 'gauss') { const z = (x - a) / b; y += c * Math.exp(-0.5 * z * z); }
    }
    return Math.max(0, y);
  };
  const e = [];
  for (let b = 0; b < nb; b++) e.push(f(lo + (b + 0.5) * bin));
  const s = e.reduce((a, b) => a + b, 0) || 1;
  return e.map((v) => (v * n) / s);
}

const R_NONE = 0, R_CUT = 1, R_SEL = 2, R_PAIR = 3, R_SB = 4, R_TIP = 5;

function buildHist(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const plot = new Group();            // tilts back about the axis line ({tilt})
  g.add(plot);
  const name = o.name != null ? String(o.name) : null;
  const steps = Array.isArray(o.steps) && o.steps.length ? o.steps : [0, {}];
  const seed = o.seed ?? SEED;
  // a deterministic default (never Math.random: the same name on every load)
  const sel = stage.stepper(name ?? `dk-hist-${(o.pos || [0, 0, 0]).join(',')}-${o.key ?? 'M'}`);
  // an arrival replays the fill from nothing, unless `replay: false` (it then stands at
  // once): on the object (every arrival) or as a step key (that step and the steps that
  // inherit it: a plot that already stood on an earlier slide comes back standing)
  const standsAt = (k) => o.replay === false || stateAt(steps, k)?.replay === false;
  const arriveKind = (k) => (standsAt(k) ? 'settle' : 'arrive');
  const labels = [];
  const frameScale = { value: 1 };     // the engine keeps it at the buffer's height / 900 (read at build)

  let now = 0, ready = false, failed = false, armed = false, armT = 0, pendingArrive = false;
  let want = sel.step ?? 0, cur = 0, shown = null;     // the step asked for, the step drawn, its state
  // frame
  let lo, hi, bin, nb, W, H, D, xOf, frame = null;
  // grains
  let N = 0, unit = 1, morph = null, mode = 'rows';
  let rowOf, valOf, binOfSlot, slotOf, rankIdx, fillOrder, jx, jz, pick;
  let tab = null, weightsArr = null, selections = null, model = null, srcCounts = null, cap = null;
  let counted = null, claimedGone = null, heapUsed = null;
  let oursG = -1, rowToGrain = null, lastReason = null, playedAt = -OFF;
  // what is shown now
  let dy = 1, colMax = 1, alphaFrom = 0.5, alphaTo = 0.5, alphaT0 = -OFF, alphaDur = 1.2;
  let arrTimes = new Float64Array(0), leaveTimes = new Float64Array(0), baseCount = 0;
  let meanTarget = null, meanFrom = null, meanT0 = -OFF, meanTopY = 0, meanTopFrom = 0, lastMean = null;
  let tiltFrom = 0, tiltTo = 0, tiltT0 = -OFF, blur = 0, frameShow = 0;
  let whisk = null, whiskShowT = OFF, whiskOn = false, whiskKey = '', band = null, bandRnd = null;
  let baseLabels = [], stepTk = null, stepLabels = new Map(), tickKey = '', ticksOn = false, tickFrom = 0, tickT0 = -OFF, ay = 0;
  let tick = null, peaks = null;
  let selFrom = 1.3, selTo = 1.3;                       // the white grains' alpha gain (uSelGain)
  let sw = null;                                        // a sweep: { key, a, b, every, start, idx, done }
  let rolls = null;                                     // a model's baked re-rolls (model.rolls)
  let lastL = null;                                     // the last shown layout that was not {tip}
  let ceded = null;                                     // the dk-hist this one took over ({over})
  let near = 1, far = 1;                                // distance fades (labels, grains)
  let everShown = false;                                // a state has stood once (an arrival then refills fast)
  let subK = 0, subAt = 0;                              // a fresh {subtract} or {tip}: its state without it first
  let restoreGone = false;                              // a cede(null) that came while this plot was hiding
  let shownRoll = -1, shownAlarms = [];                 // a model's baked roll shown, and the bins its alarm lit
  let rowT = new Float64Array(0), rowM = new Int32Array(0), rowsFrom = 0, rowsTo = 0;  // order 'file': rows read
  let arrTimesW = new Float64Array(0), leaveTimesW = new Float64Array(0), baseCountW = 0;  // readout 'window': white grains
  let frameFrom = -OFF;                                 // axisWith 'grains': the frame waits for the first grain
  let alarmMk = null;                                   // alarmMark: white marks under the lit bins
  let byN = null;                                       // `by: 'n'`: the selections by kept count, falling
  let keptAt = -OFF;                                    // an arm that kept the standing plot (no replay)
  let fadeT0 = -OFF, fadeDur = 0, fadeMul = 1;          // `fadeOut` (step, s): grains, frame and labels go
  let glowGain = 1;                                     // the landing glow, scaled down for a dense landing
  const centre = new Vector3();

  const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  // whiskers, the band and tall step ticks stand at this share of the depth: 0, the columns'
  // own centre, so they meet the grains at any distance (at 0.55 the band and a mark stood
  // about 14 px off the column tops by parallax at dist 4-7: T2 slides 6-7, T3 slide 3)
  const markZ = Number(o.markZ ?? 0);

  // ---- data ---------------------------------------------------------------------
  async function load() {
    if (o.model) {
      mode = 'model'; model = { ...o.model };
      lo = o.lo ?? model.lo; hi = o.hi ?? model.hi; nb = model.bins ?? Math.round((hi - lo) / (o.bin ?? 2)); bin = (hi - lo) / nb;
      if (model.rolls?.file) {
        // { file: 'toys.json', key: 'flat.rolls' }: {resample: k} (k ≥ 1) shows baked roll k − 1.
        // A roll is an array of counts or an object with `counts` (falling.rolls). `expected`:
        // a path in the same file to the expected count per bin (falling.expected140), so the
        // scale, the band and a `{alarm: z}` test use the bake's expectation
        const root = await kit.loadJSON(ctx, model.rolls.file);
        const d = getIn(root, model.rolls.key ?? 'rolls');
        rolls = Array.isArray(d) && d.every((r) => rollCounts(r)) ? d : null;
        if (!rolls) console.warn(`dk-hist ${name}: no rolls of counts at ${model.rolls.file}:${model.rolls.key}`);
        if (model.rolls.expected) {
          const e = getIn(root, model.rolls.expected);
          if (Array.isArray(e) && e.length === nb) model.expected = e.map(Number);
          else console.warn(`dk-hist ${name}: no ${nb}-bin expectation at ${model.rolls.file}:${model.rolls.expected}`);
        }
      }
    } else if (o.src) {
      mode = 'counts';
      const d = await kit.loadJSON(ctx, o.src);
      srcCounts = (d[o.key || 'counts'] || []).map((v) => Math.max(0, Math.round(v)));
      lo = o.lo ?? d.lo ?? 0; bin = o.bin ?? d.bin ?? 1; nb = srcCounts.length; hi = o.hi ?? lo + nb * bin;
    } else {
      mode = 'rows';
      tab = await kit.loadTable(ctx, o.values ?? 'd0.f32', o.cols);
      lo = o.lo ?? MASS.lo; hi = o.hi ?? MASS.hi; bin = o.bin ?? MASS.bin; nb = Math.max(1, Math.round((hi - lo) / bin));
      const wantsW = steps.some((s) => s && s.weights != null), wantsS = steps.some((s) => s && s.select != null);
      if (wantsW) weightsArr = await loadWeights();
      if (wantsS) selections = (await kit.loadJSON(ctx, o.selections ?? 'd0-select.json')).selections || [];
    }
    W = o.width ?? (hi - lo) * MASS.scale; H = o.height ?? HEIGHT;
    const bw = W / nb; D = o.depth ?? bw;
    xOf = (v) => -W / 2 + ((v - lo) / (hi - lo)) * W;
    setupGrains(bw);
    buildFrame();
    // the frame of the step the plot will stand at (step 1 if hidden now), before any
    // transition: a dk-curve drawn on its first arrival takes the right scale from frame 0
    // (it stood hundreds of times too tall and glided down: T3 slide 9)
    const L0 = layout(restState(stateAt(steps, want > 0 ? want : 1)));
    colMax = L0.colMax; dy = L0.dy ?? dy;
  }
  async function loadWeights() {
    const w = o.weights;
    if (w && typeof w === 'object' && w.mu != null) {
      // P(signal) from fit parameters: S = ns·bin·N(m; mu, width), B = a + b·(m − ref)
      const m = tab.col(o.key ?? 'M'), out = new Float32Array(tab.n);
      const bn = w.bin ?? 2, ref = w.ref ?? 1865;
      for (let r = 0; r < tab.n; r++) {
        const z = (m[r] - w.mu) / w.width;
        const S = (w.ns * bn) / (w.width * Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
        const B = Math.max(0, (w.a ?? 0) + (w.b ?? 0) * (m[r] - ref));
        out[r] = S + B > 0 ? S / (S + B) : 0;
      }
      return out;
    }
    const file = typeof w === 'string' ? w : w?.file ?? 'd0-psig.f32';
    return kit.loadF32(ctx, file);
  }

  function setupGrains(bw) {
    const rnd = mulberry32(seed * 31 + 7);
    const budget = Math.max(1000, Math.min(ctx.budget ?? 300000, o.grains ?? Infinity));
    if (mode === 'rows') {
      const key = o.key ?? 'M';
      const val = tab.col(key);
      const where = cutTest(o.where, tab.col);
      const split = o.split ? cutTest([o.split.col ?? 'M', 'in', [o.split.win, ...o.split.sb]], tab.col) : null;
      const ours = o.ours === false ? null : (o.ours ?? OURS_ROW);
      const heapRank = seriesOrder(tab.n, seed, ours);
      const keep = [];
      for (let r = 0; r < tab.n; r++) {
        if (!Number.isFinite(val[r])) continue;
        if (where && !where(r)) continue;
        if (split && !split(r)) continue;
        keep.push(r);
      }
      unit = o.unit ?? Math.max(1, Math.ceil(keep.length / budget));
      const rows = unit > 1 ? keep.filter((r) => heapRank[r] % unit === 0 || r === ours) : keep;
      N = rows.length;
      rowOf = Int32Array.from(rows);
      valOf = new Float32Array(N);
      for (let i = 0; i < N; i++) valOf[i] = val[rowOf[i]];
      // fill order: the reverse of the series' heap order (the top of a pile first, ours first),
      // or with `order: 'file'` the file's own order (row 1 first): then `n` counts rows of the
      // file read so far, so "after 186 candidates in the file" is the picture's 186
      fillOrder = o.order === 'file' ? Int32Array.from({ length: N }, (_, i) => i)
        : Int32Array.from({ length: N }, (_, i) => i).sort((a, b) => heapRank[rowOf[b]] - heapRank[rowOf[a]]);
      oursG = ours == null ? -1 : rows.indexOf(ours);
      rowToGrain = new Int32Array(tab.n).fill(-1);
      for (let i = 0; i < N; i++) rowToGrain[rowOf[i]] = i;
    } else {
      // slots: a grain is (bin, slot); lower slots fill first
      if (mode === 'counts') {
        unit = o.unit ?? Math.max(1, Math.ceil(srcCounts.reduce((a, b) => a + b, 0) / budget));
        cap = srcCounts.map((c) => Math.round(c / unit));
      } else {
        const nMax = Math.max(model.n ?? 0, ...steps.map((s) => (s && typeof s === 'object' && Number(s.n)) || 0)) || 1000;
        const e = expected(model, lo, bin, nb, nMax);
        unit = o.unit ?? 1;
        cap = e.map((x) => Math.ceil((x + 6 * Math.sqrt(x) + 8) / unit));
      }
      N = cap.reduce((a, b) => a + b, 0);
      binOfSlot = new Int16Array(N); slotOf = new Int32Array(N);
      const r = new Float32Array(N);
      let i = 0;
      for (let b = 0; b < nb; b++) {
        const rs = Array.from({ length: cap[b] }, () => rnd()).sort((x, y) => x - y);
        for (let j = 0; j < cap[b]; j++, i++) { binOfSlot[i] = b; slotOf[i] = j; r[i] = rs[j]; }
      }
      fillOrder = Int32Array.from({ length: N }, (_, k) => k).sort((a, b) => r[a] - r[b]);
    }
    rankIdx = new Int32Array(N);
    for (let k = 0; k < N; k++) rankIdx[fillOrder[k]] = k;
    jx = new Float32Array(N); jz = new Float32Array(N); pick = new Float32Array(N);
    for (let i = 0; i < N; i++) { jx[i] = 0.12 + 0.76 * rnd(); jz[i] = (rnd() - 0.5) * D; pick[i] = rnd(); }
    counted = new Uint8Array(N); lastReason = new Uint8Array(N);
    morph = createMorph(stage, N, { crowd: P.crowd, sel: P.sel, seed, uniforms: { uPixelRatio: frameScale } });
    if (oursG >= 0) { morph.Z[oursG] = OURS / GRAIN; morph.sizes(); }
    morph.u.uSpread.value = o.spread ?? 1.2;
    // a landing grain glows in the plot's own tone, not white (white means selected)
    morph.u.uGlowTint.value = Number(o.glowTint ?? 0.3);
    plot.add(morph.points);
    ready = true;
  }

  // ---- the frame: axis, tick marks, tick numbers, one caption ---------------------
  function buildFrame() {
    const share = morph.u;
    const A = Math.round(Math.min(1400, Math.max(300, W / 0.03)));
    const axis = staticGrains(stage, A, { color: P.axis, alpha: 0.9, size: GRAIN, share });
    ay = -0.012 * H;
    for (let i = 0; i < A; i++) axis.pos.set([-W / 2 - 0.015 * W + (W * 1.03 * i) / (A - 1), ay, 0], i * 3);
    axis.touch(); plot.add(axis.points);
    // ticks
    let tv = o.ticks;
    if (!Array.isArray(tv)) tv = o.width == null ? niceStep(lo, hi, TICK_MASS) : niceTicks(lo, hi, 5);
    const ticks = tv.map((t) => (Array.isArray(t) ? { v: t[0], text: String(t[1]) } : { v: t, text: fmt(t, decimalsOf(t)) })).filter((t) => t.v >= lo - 1e-9 && t.v <= hi + 1e-9);
    const TM = 14;
    const marks = staticGrains(stage, Math.max(1, ticks.length * TM), { color: P.axis, alpha: 0.9, size: GRAIN, share });
    ticks.forEach((t, k) => {
      for (let j = 0; j < TM; j++) marks.pos.set([xOf(t.v), ay - (0.03 * H * j) / (TM - 1), 0], (k * TM + j) * 3);
      const l = fixedLabel(stage, t.text, { px: o.tickPx ?? LABEL.px, color: P.tick, align: 'center', hang: 0.5 });
      l.position.set(xOf(t.v), ay - 0.045 * H, 0);
      plot.add(l); labels.push(l); baseLabels.push(l);
    });
    marks.touch(); plot.add(marks.points);
    if (o.word) {
      const l = fixedLabel(stage, o.word, { px: LABEL.captionPx, color: P.name, align: 'right', hang: 1.75 });
      l.position.set(W / 2 + 0.015 * W, ay - 0.045 * H, 0);
      plot.add(l); labels.push(l);
    }
    // √N whiskers (dim axis grains: white is for selected grains), the window's mean
    // tick, the selections' peak ticks
    const WM = 140, ec = typeof o.errors === 'object' && o.errors ? o.errors : {};
    whisk = staticGrains(stage, nb * WM, { color: P.axis, alpha: Number(ec.alpha ?? 0.9), size: GRAIN * Number(ec.size ?? 0.75), share });
    whisk.count(0); plot.add(whisk.points);
    // {errors: 'band'}: the ±√N band as two bright edges and a faint fill between them, in
    // the tick numbers' colour by default, so it reads in front of dense light-blue columns
    const bandColor = ec.tone === 'axis' ? P.axis : ec.tone === 'sel' ? P.sel : ec.tone === 'crowd' ? P.crowd : P.tick;
    band = toneGrains(stage, nb * 200, { crowd: P.crowd, sel: bandColor, axis: P.axis, alpha: Number(ec.alpha ?? 1), size: GRAIN * Number(ec.size ?? 1), share });
    plot.add(band.points);
    bandRnd = new Float32Array(nb * 200 * 2);
    { const r = mulberry32(seed * 5 + 13); for (let i = 0; i < bandRnd.length; i++) bandRnd[i] = r(); }
    // per-step ticks ({ticks: [...]} as a step key): their marks, each in its own tone
    stepTk = toneGrains(stage, 2400, { crowd: P.crowd, sel: P.sel, axis: P.axis, alpha: 0.95, size: GRAIN, share });
    plot.add(stepTk.points);
    tick = staticGrains(stage, 90, { color: P.sel, alpha: 0.8, size: GRAIN, share });
    plot.add(tick.points);
    if (selections) {
      peaks = staticGrains(stage, selections.length, { color: P.sel, alpha: 0.95, size: GRAIN, share });
      peaks.count(0); plot.add(peaks.points);
    }
    // alarmMark: a short white mark under each bin the baked alarm lit (it follows the roll)
    alarmMk = staticGrains(stage, 8 * 24, { color: P.sel, alpha: 0.95, size: GRAIN, share });
    alarmMk.count(0); plot.add(alarmMk.points);
    frame = { axis, marks };
  }
  // a selection index as the state names it, through `by` ('n': the 120 selections ordered by
  // the rows each kept, most first, so a sweep's count falls steadily instead of jumping)
  const selIdx = (k, by) => {
    const n = selections ? selections.length : 0;
    const i = Math.max(0, Math.min(n - 1, Number(k) || 0));
    if (by !== 'n' || !n) return i;
    byN ??= Array.from({ length: n }, (_, j) => j).sort((a, b) => (Number(selections[b].n) || 0) - (Number(selections[a].n) || 0) || a - b);
    return byN[i];
  };
  const decimalsOf = (v) => (Number.isInteger(v) ? 0 : String(v).split('.')[1]?.length ?? 1);
  // order 'file': the rows of the file a state has read, and the grains of rows before r
  const rowsOf = (s) => (!s ? 0 : s.n == null || s.n === 'all' ? (tab?.n ?? N) : Math.max(0, Math.min(tab?.n ?? N, Math.round(Number(s.n)))));
  const upperRow = (r) => { let a = 0, b = N; while (a < b) { const m = (a + b) >> 1; if (rowOf[m] < r) a = m + 1; else b = m; } return a; };
  function niceStep(a, b, step) { const out = []; for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(v); return out; }

  // ---- layout: where every grain stands in state s ---------------------------------
  function layout(s) {
    const pos = new Float32Array(N * 3), vis = new Float32Array(N), white = new Float32Array(N);
    const reason = new Uint8Array(N), cnt = new Uint8Array(N), partner = new Int32Array(N).fill(-1);
    const counts = new Int32Array(nb), fillCounts = new Int32Array(nb);
    const out = { pos, vis, white, reason, counted: cnt, partner, counts, colMax: 1, mean: null, meanBin: -1 };
    if (!s) return out;
    // `n`: entries of the fill order, or with `order: 'file'` rows of the file read (the
    // grains of rows before n, whatever `where` or `split` left out of them)
    const fileRows = rowsOf(s);
    const nShow = s.n == null || s.n === 'all' ? N
      : o.order === 'file' && mode === 'rows' ? upperRow(fileRows)
        : Math.min(N, Math.ceil(Number(s.n) / unit));
    const shift = Number(s.shift ?? 1);
    const binOf = new Int32Array(N).fill(-1);
    const inFill = new Uint8Array(N);
    const tone = o.tone === 'sel' ? 1 : Number(o.tone) || 0;
    let modelCounts = null, exp = null;
    if (mode === 'model') {
      exp = expected(model, lo, bin, nb, Number(s.n ?? model.n ?? 1000));
      const rk = Number(s.resample ?? 0);
      const baked = rolls && rk >= 1 ? rolls[(rk - 1) % rolls.length] : null;
      out.roll = baked ? (rk - 1) % rolls.length : -1;
      out.alarmBins = s.alarm === 'baked' ? bakedAlarmBins(baked, lo, bin, nb) : [];
      const bc = rollCounts(baked);
      if (bc) modelCounts = exp.map((e, b) => Math.min(cap[b], Math.round((Number(bc[b]) || 0) / unit)));
      else {
        const rr = mulberry32((model.seed ?? seed) + 7919 * rk + 31 * Math.round(Number(s.n ?? 0)));
        modelCounts = exp.map((e, b) => Math.min(cap[b], Math.round(poisson(rr, e) / unit)));
      }
    }
    // 1. the fill set and its bins
    for (let k = 0; k < N; k++) {
      const i = fillOrder[k];
      let b;
      if (mode === 'rows') {
        if (k >= nShow) continue;
        b = Math.floor((valOf[i] * shift - lo) / bin);
      } else {
        b = binOfSlot[i];
        if (mode === 'model' ? slotOf[i] >= modelCounts[b] : k >= nShow) continue;
      }
      inFill[i] = 1;
      if (b >= 0 && b < nb) { binOf[i] = b; fillCounts[b]++; }
    }
    // 2. filters: cut, select, subtract, tip
    const col = mode === 'rows' ? tab.col : null;
    const cut = mode === 'rows' && s.cut ? cutTest(s.cut, col) : null;
    let selTest = null;
    if (mode === 'rows' && s.select != null && selections) {
      const sl = selections[selIdx(s.select, s.by)];
      if (sl?.cuts) selTest = cutTest(sl.cuts, col);
      else if (sl) {
        const PT = col('PT'), IP = col('IPCHI2'), TAU = col('TAU');
        selTest = (r) => Number.isFinite(TAU[r]) && PT[r] > (sl.pt ?? -Infinity) && IP[r] < (sl.ip ?? Infinity) && TAU[r] > (sl.tau ?? -Infinity);
      }
    }
    const split = mode === 'rows' && o.split ? o.split : null;
    const sub = split && s.subtract ? { ...split, ...(typeof s.subtract === 'object' ? s.subtract : {}) } : null;
    const splitCol = split ? col(split.col ?? 'M') : null;
    const inWin = (r) => splitCol[r] >= split.win[0] && splitCol[r] <= split.win[1];
    for (let i = 0; i < N; i++) {
      if (!inFill[i]) continue;
      const r = mode === 'rows' ? rowOf[i] : -1;
      if (cut && !cut(r)) { reason[i] = R_CUT; continue; }
      if (selTest && !selTest(r)) { reason[i] = R_SEL; continue; }
      if (s.tip) { reason[i] = R_TIP; continue; }
      cnt[i] = 1;
    }
    if (sub) {
      // sideband grains (picked at the sidebands' share of the window width) meet window
      // grains in their bin, pair by pair, and both go; the rest of the sidebands go too
      const winW = split.win[1] - split.win[0];
      const sbW = split.sb.reduce((a, [x, y]) => a + (y - x), 0) || 1;
      const scale = sub.scale ?? winW / sbW;
      // stack the counted set first (pre-subtraction slots), then pair within each bin by slot
      const slot = new Int32Array(N), tmp = new Int32Array(nb);
      for (let k = 0; k < N; k++) { const i = fillOrder[k]; if (cnt[i] && binOf[i] >= 0) slot[i] = tmp[binOf[i]]++; }
      const wins = Array.from({ length: nb }, () => []), sbs = Array.from({ length: nb }, () => []);
      for (let i = 0; i < N; i++) {
        if (!cnt[i]) continue;
        const r = rowOf[i];
        if (inWin(r)) { if (binOf[i] >= 0) wins[binOf[i]].push(i); }
        else { cnt[i] = 0; reason[i] = R_SB; if (binOf[i] >= 0 && pick[i] < scale) sbs[binOf[i]].push(i); }
      }
      for (let b = 0; b < nb; b++) {
        const w = wins[b].sort((p, q) => slot[p] - slot[q]), sb = sbs[b].sort((p, q) => slot[p] - slot[q]);
        // both lists run up the column in slot order: the k-th sideband grain takes the
        // window grain at the same share of the way up (a neighbour; O(n))
        const np = Math.min(sb.length, w.length);
        for (let k = 0; k < np; k++) {
          const j = sb[k], i = w[Math.min(w.length - 1, Math.round(((k + 0.5) * w.length) / np - 0.5))];
          if (reason[i] === R_PAIR) continue;
          cnt[i] = 0; reason[i] = R_PAIR; reason[j] = R_PAIR; partner[i] = j; partner[j] = i;
        }
      }
    }
    // 3. the scale: the fill set's tallest column (a cut or a subtraction keeps it)
    let cm = 1;
    if (mode === 'model') for (let b = 0; b < nb; b++) cm = Math.max(cm, Math.ceil((exp[b] + 3 * Math.sqrt(exp[b])) / unit));
    else if (s.rescale) {
      // {rescale: true}: the scale is the counted set's own tallest column (each selection
      // of a sweep fills the height, so the peak's place reads, not the rows it kept)
      const cc = new Int32Array(nb);
      for (let i = 0; i < N; i++) if (cnt[i] && binOf[i] >= 0) cc[binOf[i]]++;
      for (let b = 0; b < nb; b++) cm = Math.max(cm, cc[b]);
    } else for (let b = 0; b < nb; b++) cm = Math.max(cm, fillCounts[b]);
    if (s.max != null || o.max != null) cm = Math.max(1, Math.ceil(Number(s.max ?? o.max) / unit));
    out.colMax = cm;
    // A sparse set stands as a dot plot: grains on a lattice, `across` to a row, rows
    // at most 3 grain widths apart (so a 1 000-grain plot reads as stacks of grains,
    // not as dust). A dense set fills the full height, each grain jittered in its bin.
    const bw = W / nb, gd = 0.0746 * GRAIN;
    const across = Math.max(1, Math.floor((0.8 * bw) / (1.9 * gd)));
    const rows = Math.ceil(cm / across);
    const lattice = o.lattice !== false && H / rows > 1.5 * gd;
    const rowH = lattice ? Math.min(H / rows, 3 * gd) : 0;
    const h = lattice ? rowH / across : H / cm;
    out.dy = h; out.lattice = lattice;
    // 4. stack the counted grains: earlier in the fill order, lower in the column
    let wsum = 0, wn = 0;
    const win = s.window;
    const fitR = s.fitRange ?? o.fitRange;
    // `oursSlot` (k): our grain stands k grains up its column, not at its foot on the axis line
    const oSlot = Math.max(0, Math.round(Number(s.oursSlot ?? o.oursSlot ?? 0)));
    const oBin = oursG >= 0 && oSlot > 0 && cnt[oursG] ? binOf[oursG] : -1;
    const oList = [];
    for (let k = 0; k < N; k++) {
      const i = fillOrder[k];
      if (!cnt[i] || binOf[i] < 0) continue;
      const b = binOf[i], j = counts[b]++;
      if (b === oBin) oList.push(i);
      if (lattice) {
        const c = j % across, rw = Math.floor(j / across);
        pos[3 * i] = -W / 2 + (b + 0.5) * bw + (c - (across - 1) / 2) * 1.9 * gd + 0.12 * gd * (jx[i] - 0.5);
        pos[3 * i + 1] = (rw + 0.5) * rowH;
        pos[3 * i + 2] = 0.15 * jz[i];
      } else {
        pos[3 * i] = -W / 2 + (b + jx[i]) * bw;
        pos[3 * i + 1] = (j + 0.5) * h;
        pos[3 * i + 2] = jz[i];
      }
      vis[i] = 1;
      const v = mode === 'rows' ? valOf[i] * shift : lo + (b + 0.5) * bin;
      let w = tone;
      if (split) w = inWin(rowOf[i]) ? 1 : 0;
      if (win) { const inside = v >= win[0] && v <= win[1]; w = inside ? 1 : 0; if (inside) { wsum += v; wn++; } }
      if (s.weights && weightsArr) { const x = weightsArr[rowOf[i]]; w = Number.isFinite(x) ? Math.max(0, Math.min(1, x)) : 0; }
      // {fitRange: [a, b]}: outside the fitted range a grain keeps the crowd colour
      if (fitR && (v < fitR[0] || v > fitR[1])) w = 0;
      white[i] = w;
    }
    if (oBin >= 0 && oList.length > 1) {
      const j = oList[Math.min(oList.length - 1, oSlot)];
      for (let c = 0; c < 3; c++) { const tmp = pos[3 * oursG + c]; pos[3 * oursG + c] = pos[3 * j + c]; pos[3 * j + c] = tmp; }
    }
    if (mode === 'model' && s.alarm === 'baked') {
      // exactly the bins the bake's own test lit in the roll shown (its one-sided Poisson z,
      // not the plot's (n − e)/√e)
      const lit = new Uint8Array(nb);
      for (const b of out.alarmBins) lit[b] = 1;
      for (let i = 0; i < N; i++) if (vis[i] && lit[binOf[i]]) white[i] = 1;
    } else if (mode === 'model' && s.alarm != null) {
      for (let i = 0; i < N; i++) if (vis[i]) { const b = binOf[i]; if ((counts[b] * unit - exp[b]) / Math.sqrt(Math.max(exp[b], 1e-9)) >= Number(s.alarm)) white[i] = 1; }
    }
    // leaving grains keep a position to leave from (their old one: go() snapshots it)
    if (win && wn) { out.mean = wsum / wn; out.meanBin = Math.max(0, Math.min(nb - 1, Math.floor((out.mean - lo) / bin))); }
    if (s.rise) {
      const [rx, ry, rz] = s.rise, rr = mulberry32(seed + 99), R0 = Number(s.riseR ?? 1.6);
      for (let i = 0; i < N; i++) if (vis[i] && white[i] > 0.5) {
        const u = 2 * rr() - 1, ph = rr() * Math.PI * 2, q = Math.sqrt(1 - u * u), r = R0 * Math.cbrt(rr());
        pos[3 * i] = rx + r * q * Math.cos(ph); pos[3 * i + 1] = ry + r * u; pos[3 * i + 2] = rz + r * q * Math.sin(ph);
      }
    }
    out.exp = exp;
    return out;
  }

  // ---- a transition -------------------------------------------------------------
  const v = new Vector3();
  // A sweep: {select: [a, b], every} or {resample: [a, b], every} (or {reroll: {every,
  // rolls}} = {resample: [1, rolls]}) steps its own index on the world clock, from a to b,
  // once the step's first state stands. Only the step that names the range sweeps; a later
  // step that inherits it, a step back, or a settled arrival stands at b at once.
  const SWEEP = { select: 0.15, resample: 1.2 };
  function sweepState(s, k, kind) {
    if (!s) { sw = null; return s; }
    const own = steps[k] && typeof steps[k] === 'object' ? steps[k] : {};
    let st = s;
    // `end` (reroll.end, or a step's `end` beside a range): the sweep comes to rest on that
    // state after b (T2: re-roll 20 times, rest on roll 2, the one with the alarm)
    if (st.reroll) st = { ...st, resample: [1, Math.max(1, Number(st.reroll.rolls ?? 12))], every: st.reroll.every ?? 1.2, end: st.reroll.end ?? st.end };
    const key = Array.isArray(st.select) ? 'select' : Array.isArray(st.resample) ? 'resample' : null;
    if (!key) { sw = null; return st; }
    const [a, b] = st[key].map(Number);
    const fin = st.end != null && Number.isFinite(Number(st.end)) ? Number(st.end) : b;
    if (kind === 'sweep' && sw && sw.key === key) return { ...st, [key]: sw.idx };
    const mine = Array.isArray(own[key]) || (key === 'resample' && !!own.reroll);
    if (!mine || kind === 'back' || kind === 'hide' || kind === 'settle' || b <= a) { sw = null; return { ...st, [key]: fin }; }
    sw = { key, a, b, fin, every: Math.max(0.05, Number(st.every ?? SWEEP[key])), start: null, idx: a, done: false };
    return { ...st, [key]: a };
  }
  // a state as it stands at rest (a sweep at its end), with no side effects (the load-time frame)
  function restState(s) {
    if (!s) return s;
    let st = s;
    if (st.reroll) st = { ...st, resample: st.reroll.end ?? Math.max(1, Number(st.reroll.rolls ?? 12)) };
    for (const key of ['select', 'resample']) if (Array.isArray(st[key])) st = { ...st, [key]: st.end ?? st[key][1] };
    return st;
  }
  let landAt = new Float64Array(0);
  function transition(k, kind, pre = false) {
    if (!pre) {
      subK = 0;
      // a {subtract} opened fresh (an arrival, a replay) fills its window and sidebands first,
      // holds 0.5 s, then the pairs meet: the subtraction is seen, and the count climbs to the
      // full set and falls to what is left (else only the survivors fell in, lab 3 slide 5)
      // A {tip} opened fresh likewise stands as the histogram first, `tipHold` (1 s), then
      // lets its grains go (lab 4 slide 6 opened on the tip: the plot was never seen)
      const s0 = stateAt(steps, k);
      const opened = (!shown || kind === 'arrive') && kind !== 'settle' && kind !== 'back' && kind !== 'hide' && mode === 'rows';
      const preKey = !opened ? null
        : s0?.subtract && o.split && o.subtractFirst !== false ? 'subtract'
          : s0?.tip && o.tipFirst !== false ? 'tip' : null;
      if (preKey) {
        transition(k, kind, preKey);
        subK = k; subAt = morph.end + (preKey === 'tip' ? Number(s0.tipHold ?? o.tipHold ?? 1) : 0.5);
        return;
      }
    }
    let s0 = stateAt(steps, k);
    if (pre && s0) s0 = { ...s0, [pre]: null };
    const s = sweepState(s0, k, kind);
    const prev = shown;
    if (s && restoreGone) { restoreGone = false; morph.G.fill(OFF); morph.gone(); }
    const L = layout(s);
    if (s && !s.tip) lastL = L;
    const instant = kind === 'back' || kind === 'hide' || kind === 'settle';
    const t = now;
    // {oursFrom: '<form>'}: our grain starts where that form's api.ours() is (a dk-vertex
    // that landed it), and glides into its slot instead of leaping from the heap again
    const oursName = s?.oursFrom ?? o.oursFrom;
    const oursSrc = oursName && oursG >= 0 && !instant ? kit.form(String(oursName)) : null;
    if (oursSrc) plot.updateWorldMatrix(true, false);
    // where arriving grains come from
    const heap = s?.sort ? kit.form(String(s.sort)) : null;
    const heapOk = !!(heap && heap.api.ready?.() && mode === 'rows');
    if (heapOk) { plot.updateWorldMatrix(true, false); }
    const resampled = !!(prev && s && mode === 'model' && (prev.resample !== s.resample || prev.n !== s.n) && kind !== 'arrive');
    const fresh = !prev || kind === 'arrive' || kind === 'settle';
    const cutting = !!(s && prev && (JSON.stringify(s.cut) !== JSON.stringify(prev.cut) || s.select !== prev.select || !!s.subtract !== !!prev.subtract));
    const shifting = !!(s && prev && (s.shift ?? 1) !== (prev.shift ?? 1));
    const fall = Number(s?.fall ?? o.fall ?? 1.1);
    const arrivals = [], leavers = [];
    const arrW = [], leaveW = [];
    let firstStart = OFF;
    const prevCounted = counted;
    const newCounted = L.counted;
    let moves = 0;
    const plan = (m) => {
      const { A, B, C, V, T, M, S } = m;
      // arrivals, in the fill order
      for (let q = 0; q < N; q++) { const i = fillOrder[q]; if (!prevCounted[i] && newCounted[i]) arrivals.push(i); }
      const nA = arrivals.length;
      // auto fill: 1.6 s for a few grains, up to 5.5 s for a dense set (9 s read as a take
      // spent waiting, labs 2, 3 and 5). An arrival at a plot already seen refills in `refill`
      // (2 s): the audience has watched it build once.
      let fd = Number(s?.fill ?? o.fill ?? Math.min(5.5, Math.max(1.6, 1.2 + 1.9 * Math.log10(Math.max(10, nA) / 30))));
      if (kind === 'arrive' && everShown) fd = Math.min(fd, Number(o.refill ?? 2));
      const curve = Number(s?.curve ?? o.curve ?? 1.4);
      // `fillBy: 'x'`: the grains land column by column, left to right (a white pass rising
      // across the plot, T5 slide 10), instead of by the fill order's curve
      const byX = (s?.fillBy ?? o.fillBy) === 'x';
      const oursLast = !!(s?.oursLast ?? o.oursLast);
      const lead = Number(fresh ? (s?.lead ?? o.lead ?? 0.4) : 0.15);
      const arc = Number(o.arc ?? 4);
      // {weights} on or off: the change runs left to right, as a window's does, not all at
      // once (a whole plot whitening and landing together read as a pulse, lab 2 slide 7)
      const weighting = !fresh && !instant && !!s?.weights !== !!prev?.weights;
      const xs = (i3) => 1.2 * (B[i3] + W / 2) / W;   // 1.2 s across: thousands of returning landings, spread
      const src = o.from ? new Vector3(...o.from).sub(new Vector3(...(o.pos || [0, 0, 0]))) : null;
      // `flight` (object or step, 0..1, 0.3): how much of itself a dropping grain (or one from
      // `from`) shows as it leaves; it grows to whole as it lands. Leaps out of a heap keep 0.7
      const fly = Math.max(0, Math.min(1, Number(s?.flight ?? o.flight ?? 0.3)));
      m.u.uFlyD.value = fly; m.u.uFlyL.value = heapOk ? 0.7 : fly;
      const spread = o.fromSpread || [0, 0, 0];
      const arrT = new Float64Array(nA);
      for (let a = 0; a < nA; a++) {
        const i = arrivals[a], i3 = 3 * i, r = S[i];
        if (instant) { A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1]; A[i3 + 2] = B[i3 + 2]; M[i] = MOTION.GLIDE; T[2 * i] = 0; T[2 * i + 1] = 0.35; arrT[a] = t; continue; }
        if (i === oursG && oursSrc && oursSrc.api.ours?.(v)) {
          plot.worldToLocal(v);
          A[i3] = v.x; A[i3 + 1] = v.y; A[i3 + 2] = v.z;
          M[i] = MOTION.GLIDE; T[2 * i] = 0; T[2 * i + 1] = 0.6; arrT[a] = t + 0.6; continue;
        }
        if (resampled) {
          A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1] + 0.05 * H * (0.6 + r); A[i3 + 2] = B[i3 + 2];
          M[i] = MOTION.DROP; T[2 * i] = 0.25 * r; T[2 * i + 1] = 0.45; arrT[a] = t + T[2 * i] + 0.45; continue;
        }
        if (lastReason[i] !== R_NONE && !fresh) {
          // back from a cut or another selection: a short drop onto its column
          A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1] + 0.08 * H * (0.6 + r); A[i3 + 2] = B[i3 + 2];
          // a new selection's returning grains are spread over 0.8 s, so their landing glows do not flash together
          const spreadR = s?.select !== prev?.select ? 0.8 : 0.3;
          M[i] = MOTION.DROP; T[2 * i] = weighting ? xs(i3) + 0.25 * r : spreadR * r + (cutting ? 0.4 : 0); T[2 * i + 1] = 0.5; arrT[a] = t + T[2 * i] + 0.5; continue;
        }
        let delay = byX ? lead + fd * (0.85 * Math.max(0, Math.min(1, (B[i3] + W / 2) / W)) + 0.15 * r) : lead + Math.pow(a / Math.max(1, nA - 1), curve) * fd;
        if (oursLast && i === oursG) delay = lead + fd;
        T[2 * i] = delay;
        let fromHeap = false;
        if (heapOk && heap.api.posOf(rowOf[i], v)) {
          plot.worldToLocal(v);
          A[i3] = v.x; A[i3 + 1] = v.y; A[i3 + 2] = v.z;
          const d = Math.hypot(B[i3] - v.x, B[i3 + 1] - v.y, B[i3 + 2] - v.z);
          C[i3 + 1] = (0.18 * d + 0.06 * H) * (0.6 + 0.8 * r);
          M[i] = MOTION.LEAP; T[2 * i + 1] = Number(o.leap ?? 1.5); fromHeap = true;
        } else if (src) {
          A[i3] = src.x + spread[0] * (r - 0.5); A[i3 + 1] = src.y + spread[1] * (S[(i + 1) % N] - 0.5); A[i3 + 2] = src.z + spread[2] * (S[(i + 7) % N] - 0.5);
          C[i3 + 1] = arc * (0.55 + 0.9 * S[(i + 13) % N]);
          M[i] = MOTION.LEAP; T[2 * i + 1] = fall * 1.3;
        } else {
          A[i3] = B[i3] + 0.15 * (r - 0.5); A[i3 + 1] = H * 1.25 + 2 * r; A[i3 + 2] = B[i3 + 2];
          M[i] = MOTION.DROP; T[2 * i + 1] = fall;
        }
        if (V[2 * i + 1] < 0.5) { M[i] = MOTION.GLIDE; T[2 * i + 1] = fromHeap ? 0.4 : 0.3; } // counted off the drawn range
        // an arriving grain has its colour from the start: a white pass flies white, not
        // light blue whitening as it lands (T5 slide 9 read the flight as blue grains leaving)
        else if (V[2 * i] < 0.01) m.W[2 * i] = m.W[2 * i + 1];
        arrT[a] = t + T[2 * i] + T[2 * i + 1];
      }
      // leavers and movers
      const settle = s?.subtract && !prev?.subtract ? 1.7 : cutting ? 1.1 : 0;
      // `ghost` (0..1, with {subtract}): the sideband grains the subtraction removes stay as a
      // faint ghost where they stood, so a still shows what was taken away
      const ghostA = Math.max(0, Math.min(1, Number(s?.ghost ?? 0)));
      const bw = W / nb, flash = Number(s?.shiftFlash ?? o.shiftFlash ?? 1);
      const lt = [];
      for (let i = 0; i < N; i++) {
        const i2 = 2 * i, i3 = 3 * i, v0 = V[i2], v1 = V[i2 + 1], r = S[i];
        if (prevCounted[i] && !newCounted[i]) { lt.push(i); if (m.W[i2] > 0.5) leaveW.push(i); }
        if (v0 > 0.01 && v1 < 0.5) {
          const why = L.reason[i];
          if (ghostA > 0 && why === R_SB) {
            B[i3] = A[i3]; B[i3 + 1] = A[i3 + 1]; B[i3 + 2] = A[i3 + 2]; V[i2 + 1] = ghostA;
            M[i] = MOTION.GLIDE; T[i2] = instant ? 0 : 0.3 + 0.6 * r; T[i2 + 1] = instant ? 0.35 : 1.2;
          } else if (instant || why === R_NONE || why === R_TIP) {
            B[i3] = A[i3]; B[i3 + 1] = A[i3 + 1]; B[i3 + 2] = A[i3 + 2];
            M[i] = MOTION.GLIDE; T[i2] = resampled ? 0.15 * r : 0; T[i2 + 1] = instant ? 0.35 : resampled ? 0.3 : why === R_TIP ? 0.4 : 0.5;
          } else if (why === R_PAIR) {
            const p = L.partner[i];
            const rp = Math.min(S[i], S[p]);
            B[i3] = 0.5 * (A[i3] + A[3 * p]); B[i3 + 1] = 0.5 * (A[i3 + 1] + A[3 * p + 1]); B[i3 + 2] = 0.5 * (A[i3 + 2] + A[3 * p + 2]);
            M[i] = MOTION.ANNIHILATE; T[i2] = 0.7 * rp; T[i2 + 1] = 1.0;
          } else {
            // `dust: { lift, spread, time }` (step): how far a cut's dust rises (share of H, 0.25
            // over the first 0.12), spreads (share of W, 0.04) and how long it lasts (1.6 s): a cut
            // that takes every row reads as the plot lifting away (T5 slide 3: 0.7, 0.15, 2)
            const dz = why === R_CUT && s?.dust && typeof s.dust === 'object' ? s.dust : null;
            const up = why === R_SEL ? 0.06 * H * (0.6 + r) : 0.12 * H + Number(dz?.lift ?? 0.25) * H * r;
            const spr = Number(dz?.spread ?? 0.04);
            B[i3] = A[i3] + spr * W * (S[(i + 3) % N] - 0.5); B[i3 + 1] = A[i3 + 1] + up; B[i3 + 2] = A[i3 + 2] + (dz ? 1 + 0.5 * spr * W : 0.5) * (S[(i + 5) % N] - 0.5);
            M[i] = MOTION.DUST;
            T[i2] = why === R_SEL ? 0.3 * r : why === R_SB ? 0.3 + 0.6 * r : 0.9 * r;
            T[i2 + 1] = why === R_SEL ? 0.7 : dz ? Math.max(0.4, Number(dz.time ?? 1.6)) : 1.6;
          }
        } else if (v0 > 0.01 && v1 > 0.5) {
          const moved = Math.abs(A[i3] - B[i3]) + Math.abs(A[i3 + 1] - B[i3 + 1]) + Math.abs(A[i3 + 2] - B[i3 + 2]) > 1e-4;
          const recolour = Math.abs(m.W[i2] - m.W[i2 + 1]) > 1e-3 || v0 < 0.99;
          if (!moved && !recolour) continue;
          moves++;
          M[i] = s?.rise && m.W[i2 + 1] > 0.5 ? MOTION.LEAP : MOTION.GLIDE;
          if (M[i] === MOTION.LEAP) C[i3 + 1] = 0.15 * H * (0.5 + r);
          if (instant) { T[i2] = 0; T[i2 + 1] = 0.35; }
          else if (resampled) { T[i2] = 0.1 * r; T[i2 + 1] = 0.5; }
          else if (!moved) { T[i2] = 0.5 * (A[i3] + W / 2) / W; T[i2 + 1] = 0.8; }      // a sweep of colour, left to right
          else if (weighting) { T[i2] = xs(i3) + 0.15 * r; T[i2 + 1] = 0.9; }
          else if (shifting) {
            T[i2] = 0.3 * r; T[i2 + 1] = 1.6;
            // a grain that changes bin starts white and eases back to its colour as it moves:
            // a still and a recording show which grains the shift moved (`shiftFlash`: 0 off)
            if (flash > 0 && Math.abs(A[i3] - B[i3]) > 0.3 * bw) m.W[i2] = Math.max(m.W[i2], Math.min(1, flash));
          }
          else { T[i2] = settle + 0.3 * r; T[i2 + 1] = settle ? 1.1 : 1.0; }
        }
      }
      if (kind === 'sweep') {
        // a sweep re-plans every `every` s: each motion short enough to be seen before the next
        const cap = Math.max(0.25, 2 * sw.every);
        for (let i = 0; i < N; i++) { T[2 * i] = Math.min(T[2 * i], 0.25 * cap * S[i]); T[2 * i + 1] = Math.min(T[2 * i + 1], cap); }
        for (let a = 0; a < nA; a++) { const i = arrivals[a]; arrT[a] = t + T[2 * i] + T[2 * i + 1]; }
      }
      // order 'file': the rows read so far as the grains land (a running "in the file" count)
      if (o.order === 'file' && mode === 'rows') {
        const idx = Array.from({ length: nA }, (_, a) => a).sort((p, q) => arrT[p] - arrT[q]);
        rowT = Float64Array.from(idx, (a) => arrT[a]);
        rowM = new Int32Array(nA);
        let mx = 0;
        idx.forEach((a, q) => { mx = Math.max(mx, rowOf[arrivals[a]] + 1); rowM[q] = mx; });
      }
      // when each grain stands ({over} hands the other hist's grain over at that moment)
      landAt = new Float64Array(N).fill(t);
      for (let a = 0; a < nA; a++) {
        landAt[arrivals[a]] = arrT[a];
        if (L.white[arrivals[a]] > 0.5) arrW.push(arrT[a]);
        if (T[2 * arrivals[a]] < firstStart) firstStart = T[2 * arrivals[a]];
      }
      const lw = Float64Array.from(leaveW, (i) => t + T[2 * i] + 0.6 * T[2 * i + 1]);
      lw.sort(); arrTimesW = Float64Array.from(arrW).sort(); leaveTimesW = lw;
      const lv = new Float64Array(lt.length);
      lt.forEach((i, q) => { lv[q] = t + T[2 * i] + 0.6 * T[2 * i + 1]; });
      arrT.sort(); lv.sort();
      arrTimes = arrT; leaveTimes = lv;
      // the summed landing glow: the most grains landing in any third of a second (the glow's
      // e-fold) sets the gain, so a dense pour does not bloom (T2 slides 12-14, T5 slide 10);
      // `glowCap: false` keeps every grain's whole glow
      let peak = 0;
      for (let a = 0, b = 0; a < nA; a++) { while (arrT[a] - arrT[b] > 0.33) b++; if (a - b + 1 > peak) peak = a - b + 1; }
      glowGain = o.glowCap === false ? 1 : Math.max(0.2, Math.min(1, Math.sqrt(1500 / Math.max(1, peak))));
    };
    let base = 0, baseW = 0;
    for (let i = 0; i < N; i++) if (prevCounted[i] && newCounted[i]) { base++; if (L.white[i] > 0.5 && morph.W[2 * i + 1] > 0.5) baseW++; }
    baseCount = base;
    rowT = new Float64Array(0); rowM = new Int32Array(0);
    rowsFrom = base > 0 ? Math.min(rowsTo, rowsOf(s)) : 0; rowsTo = rowsOf(s);
    // white grains that stood before and still stand white (morph.W[2i + 1] is the old target until go())
    baseCountW = baseW;
    morph.go(t, L, plan);
    counted = newCounted; lastReason = L.reason; playedAt = t;
    // the landing glow's strength (`glow`, object or step, 1): a dense pour lands quietly at 0.3
    morph.u.uGlow.value = Math.max(0, Number(s?.glow ?? o.glow ?? 1)) * glowGain;
    // our grain's own size and alpha (object or step): `oursSize` (× the series' 2.5),
    // `oursAlpha` (its alpha outright; else at least 0.95): a close shot keeps our light-blue
    // core a grain, not a white disc (T5 slide 11)
    if (oursG >= 0) {
      const zs = (OURS / GRAIN) * Number(s?.oursSize ?? o.oursSize ?? 1);
      if (morph.Z[oursG] !== zs) { morph.Z[oursG] = zs; morph.sizes(); }
      const oa = s?.oursAlpha ?? o.oursAlpha;
      morph.u.uBigA.value = oa == null ? -1 : Math.max(0, Number(oa));
    }
    // `fadeOut` (step, s): the plot's grains, frame and labels go over that time, in place
    if (s?.fadeOut != null && !(prev?.fadeOut != null)) { fadeT0 = instant ? t - 100 : t; fadeDur = Math.max(0.05, Number(s.fadeOut)); }
    else if (s?.fadeOut == null) { fadeT0 = -OFF; }
    // axisWith 'grains': on a fresh fill the axis, ticks and caption come in with the first grain
    frameFrom = s && (s.axisWith ?? o.axisWith) === 'grains' && fresh && !instant && firstStart < OFF ? t + firstStart : -OFF;
    if (sw && sw.start == null) sw.start = morph.end + 0.2;
    // the heap gives up the grains the plot holds, each as it leaves
    claimHeap(L, heapOk ? heap : null, t);
    cedeTo(s ? L : null);
    // brightness, scale, extras
    colMax = L.colMax; dy = L.dy ?? dy;
    alphaFrom = morph.u.uAlpha.value; alphaTo = Number(s?.alpha ?? o.alpha ?? alphaFor(colMax * (o.density ?? 1))); alphaT0 = t;
    // a plot getting denser drops its grain alpha quickly, before most new grains land: over
    // 1.2 s they landed at the sparse plot's alpha and the plot swelled and dimmed (lab 5 slide 8)
    alphaDur = alphaTo < 0.85 * alphaFrom ? 0.4 : 1.2;
    // the white grains' alpha gain: 1.3 unless the deck sets `selGain` (object or step).
    // A sparse or thin white set may want more (1.5-1.8) to read as fg, not grey; an
    // automatic lift (0.7 / alpha) was tried and bloomed dense narrow white columns into
    // a halo (lab 2 tau station, 29 Oct), so it is the deck's call per plot.
    selFrom = morph.u.uSelGain.value; selTo = Number(s?.selGain ?? o.selGain ?? 1.3);
    if (L.mean != null) {
      meanFrom = lastMean ?? L.mean; meanTarget = L.mean; meanT0 = t + (fresh ? morph.end - t : 0);
      meanTopFrom = meanTopY || (L.counts[L.meanBin] * dy); meanTopY = Math.max(...Array.from(L.counts.slice(Math.max(0, L.meanBin - 1), L.meanBin + 2))) * L.dy;
    } else { meanTarget = null; }
    tiltFrom = plot.rotation.x; tiltTo = (-Number(s?.tilt ?? 0) * Math.PI) / 180; tiltT0 = t;
    setWhiskers(s, L, t);
    setTicks(s);
    setPeaks(s);
    shown = s; cur = s ? k : 0;
    shownRoll = L.roll ?? -1; shownAlarms = L.alarmBins ?? [];
    setAlarmMarks(s);
    if (s) everShown = true;
  }
  function setAlarmMarks(s) {
    if (!alarmMk) return;
    const on = !!(s && s.alarm === 'baked' && (s.alarmMark ?? o.alarmMark));
    if (!on || !shownAlarms.length) { alarmMk.count(0); return; }
    let q = 0;
    for (const b of shownAlarms.slice(0, 8)) {
      const x = -W / 2 + (b + 0.5) * (W / nb);
      for (let j = 0; j < 24; j++, q++) alarmMk.pos.set([x, ay - 0.004 * H - (0.034 * H * j) / 23, 0.02], 3 * q);
    }
    alarmMk.count(q); alarmMk.touch();
  }

  const claimer = name ?? 'dk-hist';
  function claimHeap(L, heap, t) {
    if (heapUsed && heapUsed !== heap) heapUsed.api.release?.(claimer);
    heapUsed = heap;
    if (!heap) { claimedGone = null; return; }
    const gone = new Float32Array(heap.api.rows?.() ?? tab.n).fill(OFF);
    const prevGone = claimedGone, T = morph.T;
    for (let i = 0; i < N; i++) {
      const r = rowOf[i];
      if (r >= gone.length) continue;
      // held: in the fill set now (drawn, or cut, paired or tipped away after it was taken)
      if (!(L.counted[i] || L.reason[i] !== R_NONE)) continue;
      gone[r] = prevGone && prevGone[r] < OFF ? prevGone[r] : t + T[2 * i];
    }
    claimedGone = gone;
    heap.api.claim?.(gone, claimer);
  }

  // {over: '<dk-hist>'}: this plot takes over the other's grains row by row, each grain
  // of the other going at the moment this one's grain of the same row lands (T5: run 2
  // lands grain for grain on run 1). A step back or a hide gives them back.
  function cedeTo(L) {
    const other = o.over && mode === 'rows' ? kit.form(String(o.over)) : null;
    if (ceded && ceded !== other) ceded.api.cede?.(null);
    ceded = other;
    if (!other?.api?.cede) return;
    if (!L) { other.api.cede(null); return; }
    const gone = new Float32Array(tab.n).fill(OFF);
    for (let i = 0; i < N; i++) if (L.counted[i]) gone[rowOf[i]] = landAt[i] ?? now;
    other.api.cede(gone);
  }

  // {errors: true}: a dim whisker of ±√N on each column (round the expectation for a
  // model: the band the tops tremble in), with caps of 3 grains. {errors: 'band'}: only
  // the band's two edges, as two dim grain lines across all bins. Look: o.errors
  // { alpha 0.9, size 0.75 (× GRAIN), cap 3 }: the axis line's colour and weight.
  function setWhiskers(s, L, t) {
    if (!whisk) return;
    const on = !!(s && s.errors);
    if (!on) { whiskOn = false; return; }
    const ec = typeof o.errors === 'object' && o.errors ? o.errors : {};
    const isBand = s.errors === 'band';
    if (isBand) { whisk.count(0); return setBand(s, L, t, ec); }
    band.u.uShow.value = 0;
    const WM = 140, CAP = Math.max(0, Math.min(12, Number(ec.cap ?? 3))), bw = W / nb;
    let k = 0;
    const pts = whisk.pos;
    for (let b = 0; b < nb; b++) {
      const c = L.exp ? L.exp[b] : L.counts[b] * unit;
      if (!(c > 0)) continue;
      const sq = Math.sqrt(c), y0 = ((c - sq) / unit) * L.dy, y1 = ((c + sq) / unit) * L.dy;
      const x = -W / 2 + (b + 0.5) * bw, z = markZ * D;
      const nW = Math.max(5, Math.min(WM - 2 * CAP, Math.round((y1 - y0) / 0.012)));
      for (let j = 0; j < nW; j++) { pts[3 * k] = x; pts[3 * k + 1] = y0 + ((y1 - y0) * j) / (nW - 1); pts[3 * k + 2] = z; k++; }
      if (CAP > 1) for (const y of [y0, y1]) for (let j = 0; j < CAP; j++) { pts[3 * k] = x + (j / (CAP - 1) - 0.5) * 0.2 * bw; pts[3 * k + 1] = y; pts[3 * k + 2] = z; k++; }
    }
    const key = `w:${k}:${pts[1]}:${pts[3 * Math.max(0, k - 1) + 1]}`;
    whisk.count(k); whisk.touch();
    if (key !== whiskKey || !whiskOn) { whiskShowT = L.exp ? t + 0.3 : morph.end; whisk.u.uShow.value = whiskOn && key === whiskKey ? 1 : 0; }
    whiskKey = key; whiskOn = true;
  }

  // {errors: 'band'}: c ± √c per bin (the expectation for a model, the count for data) as
  // two edge lines, edge to edge of each bin so neighbours join into one band, and a fill
  // of `fill` (0.3) alpha between them. Look (object `errors`): tone 'tick' (the tick
  // numbers' near-white; 'axis' is the old dim look), alpha 1, size 1 (× GRAIN), fill 0.3.
  // The owner's rollout condition (29 Oct): T2's √N band brighter, legible in dense columns.
  function setBand(s, L, t, ec) {
    const bw = W / nb, fill = Math.max(0, Number(ec.fill ?? 0.3));
    let k = 0;
    const pts = band.pos, vis = band.vis, tone = band.tone, cap = band.n;
    for (let b = 0; b < nb; b++) {
      const c = L.exp ? L.exp[b] : L.counts[b] * unit;
      if (!(c > 0)) continue;
      const sq = Math.sqrt(c), y0 = ((c - sq) / unit) * L.dy, y1 = ((c + sq) / unit) * L.dy;
      const x = -W / 2 + (b + 0.5) * bw, z = markZ * D;
      // a band thinner than half a grain is no band: its two edges would sit on each other
      // as one bright line (the near-empty edge bins of a dense plot)
      const gd = 0.0746 * GRAIN;
      if (y1 - y0 < 0.5 * gd) continue;
      const nB = Math.max(6, Math.min(60, Math.round(bw / 0.022)));
      for (const y of [y0, y1]) for (let j = 0; j < nB && k < cap; j++, k++) {
        pts[3 * k] = x + ((j + 0.5) / nB - 0.5) * bw; pts[3 * k + 1] = y; pts[3 * k + 2] = z; vis[k] = 1; tone[k] = 1;
      }
      if (fill > 0 && y1 - y0 >= 2 * gd) {
        const nF = Math.max(0, Math.min(80, Math.round(((y1 - y0) * bw) / 0.0016)));
        for (let j = 0; j < nF && k < cap; j++, k++) {
          const r0 = bandRnd[2 * k], r1 = bandRnd[2 * k + 1];
          pts[3 * k] = x + (r0 - 0.5) * bw; pts[3 * k + 1] = y0 + (y1 - y0) * r1; pts[3 * k + 2] = z + 0.02 * (r0 - r1);
          vis[k] = fill; tone[k] = 1;
        }
      }
    }
    for (let j = k; j < cap; j++) vis[j] = 0;
    band.touch();
    const key = `b:${k}:${pts[1]}:${pts[3 * Math.max(0, k - 1) + 1]}`;
    if (key !== whiskKey || !whiskOn) { whiskShowT = L.exp ? t + 0.3 : morph.end; whisk.u.uShow.value = whiskOn && key === whiskKey ? 1 : 0; }
    whiskKey = key; whiskOn = true;
  }

  // {ticks: [...]} as a step key: that step's world ticks instead of the object's (null
  // gives the object's back, [] none). An entry is a value, [value, 'text'], or
  // { v, text, tone: 'tick' | 'axis' | 'sel' | 'crowd', y: [y0, y1] (shares of H; default
  // the axis tick), label: 'below' | 'above' | false, align }. A tick that reaches into the
  // plot (y1 > 0.05) stands in front of the columns with its number above it: T3's dim
  // 1 864.84 and white 1 864.47 at the summit of the peak.
  const tickOf = (t) => (Array.isArray(t) ? { v: Number(t[0]), text: String(t[1]) } : t && typeof t === 'object' ? { ...t, v: Number(t.v ?? t.at) } : { v: Number(t) });
  function setTicks(s) {
    const spec = s && Array.isArray(s.ticks) ? s.ticks : null;
    const key = spec ? JSON.stringify(spec) : '';
    if (key === tickKey) return;
    const mixNow = tickMix();
    tickKey = key; tickT0 = now;
    if (!spec) { ticksOn = false; tickFrom = mixNow; return; }
    ticksOn = true; tickFrom = 0;
    for (const l of stepLabels.values()) l.userData.on = 0;
    let i = 0;
    const cap = stepTk.n;
    for (const t0 of spec) {
      const t = tickOf(t0);
      if (!(t.v >= lo - 1e-9 && t.v <= hi + 1e-9)) continue;
      const tone = String(t.tone ?? 'tick');
      const tv = tone === 'sel' ? 1 : tone === 'crowd' ? 0 : -1;
      const [y0s, y1s] = Array.isArray(t.y) ? t.y.map(Number) : [-0.03, 0];
      const tall = y1s > 0.05;
      const y0 = ay + y0s * H, y1 = ay + y1s * H, x = xOf(t.v), z = tall ? markZ * D : 0;
      // a tall tick is a dotted line (a solid white line blooms into a bar at close range);
      // `dash` its grain spacing (units, 0.035), `alpha` its brightness share
      const dash = Math.max(0.006, Number(t.dash ?? (tall ? 0.035 : 0.02)));
      const nG = Math.max(14, Math.min(400, Math.round(Math.abs(y1 - y0) / dash)));
      const va = t.alpha != null ? Number(t.alpha) : tone === 'tick' || tone === 'axis' ? 1 : tall ? 0.6 : 0.9;
      for (let j = 0; j < nG && i < cap; j++, i++) {
        stepTk.pos[3 * i] = x; stepTk.pos[3 * i + 1] = y0 + ((y1 - y0) * j) / (nG - 1); stepTk.pos[3 * i + 2] = z;
        stepTk.tone[i] = tv; stepTk.vis[i] = va;
      }
      const where = t.label ?? (tall ? 'above' : 'below');
      if (where === false || where === 'none') continue;
      const color = tone === 'sel' ? P.sel : tone === 'crowd' ? P.crowd : tone === 'axis' ? P.axis : P.tick;
      const text = t.text ?? fmt(t.v, decimalsOf(t.v));
      const align = t.align ?? 'center';
      const lk = `${text}|${color}|${align}|${where}`;
      let l = stepLabels.get(lk);
      if (!l) {
        l = fixedLabel(stage, text, { px: o.tickPx ?? LABEL.px, color, align, hang: where === 'above' ? -0.6 : 0.5 });
        plot.add(l); labels.push(l); stepLabels.set(lk, l);
      }
      l.position.set(x, where === 'above' ? y1 + 0.01 * H : ay - 0.045 * H, z);
      l.userData.on = 1;
    }
    for (let j = i; j < cap; j++) stepTk.vis[j] = 0;
    stepTk.touch();
  }
  function tickMix() { return tickFrom + ((ticksOn ? 1 : 0) - tickFrom) * ease((now - tickT0) / 0.5); }

  // the selections' fitted peaks, one grain each on a line under the axis, for
  // selections 0..i: { peaks: { y: 0.2 (share of H below the axis), zoom: 1, at: (MeV) } }.
  // The 120 peaks of d0-select.json span 0.43 MeV, a tenth of a world unit at the series'
  // scale: either the camera comes close, or `zoom` spreads the row about `at` (a
  // magnified ruler; say so in the notes).
  function setPeaks(s) {
    if (!peaks) return;
    const k = s && s.select != null ? Math.max(0, Math.min(selections.length - 1, Number(s.select))) : -1;
    const cfg = s?.peaks ?? o.peaks;
    if (k < 0 || !cfg) { peaks.count(0); return; }
    const y = -Number(cfg.y ?? 0.2) * H, zoom = Number(cfg.zoom ?? 1);
    const mus = selections.map((x) => x.mu).filter(Number.isFinite);
    const at = Number(cfg.at ?? mus.reduce((a, b) => a + b, 0) / Math.max(1, mus.length));
    let q = 0;
    for (let i = 0; i <= k; i++) {
      const mu = selections[selIdx(i, s.by)].mu;
      if (!Number.isFinite(mu)) continue;
      peaks.pos[3 * q] = xOf(at + (mu - at) * zoom); peaks.pos[3 * q + 1] = y; peaks.pos[3 * q + 2] = 0; q++;
    }
    peaks.count(q); peaks.touch(); peaks.u.uShow.value = 1;
  }

  // ---- stepping, arrival ------------------------------------------------------------
  // the slide's steps can land a frame after the station's assembly (a cut on a `path`
  // assembles on its first frame): a step up from nothing just after an arrival is that
  // arrival, so `replay` and `refill` hold (lab 3 slide 7 refilled from nothing for 8 s)
  let arrivedAt = -OFF;
  const request = (k) => {
    want = k;
    if (!ready || armed) return;
    const late = k > 0 && cur === 0 && now - arrivedAt < 1;
    // from hidden into a step with `replay: false`: it stands at once, arrival or not
    const stand = k > 0 && cur === 0 && standsAt(k);
    transition(k, k < cur ? (k === 0 ? 'hide' : 'back') : late || stand ? arriveKind(k) : 'fwd');
  };
  const arrive = () => {
    const wasArmed = armed;
    armed = false;
    arrivedAt = now;
    if (!ready) { pendingArrive = !failed; return; }
    pendingArrive = false;
    // kept at the arm: it went on to the slide's step as a plain step (request)
    if (keptAt > -OFF) { keptAt = -OFF; if (want !== cur) transition(want, want < cur ? (want === 0 ? 'hide' : 'back') : 'fwd'); return; }
    // `c` (an assembly with no flight before it) replays from nothing, unless it just played
    if (!wasArmed && now - playedAt > 1.5) hideNow();
    if (want > 0) transition(want, arriveKind(want));
  };
  const hideNow = () => {
    if (!ready) return;
    const L = layout(null);
    morph.jump(now, L);
    counted = L.counted; lastReason = L.reason; shown = null; cur = 0;
    if (heapUsed) { heapUsed.api.release?.(claimer); heapUsed = null; claimedGone = null; }
    cedeTo(null); sw = null; subK = 0;
    whiskOn = false; if (whisk) whisk.u.uShow.value = 0;
    meanTarget = null; lastMean = null;
    arrTimes = new Float64Array(0); leaveTimes = new Float64Array(0); baseCount = 0;
    arrTimesW = new Float64Array(0); leaveTimesW = new Float64Array(0); baseCountW = 0;
    rowT = new Float64Array(0); rowM = new Int32Array(0); rowsFrom = 0; rowsTo = 0;
    frameFrom = -OFF; if (alarmMk) alarmMk.count(0);
  };

  // ---- readouts -------------------------------------------------------------------
  const upper = (arr, x) => { let lo2 = 0, hi2 = arr.length; while (lo2 < hi2) { const m = (lo2 + hi2) >> 1; if (arr[m] <= x) lo2 = m + 1; else hi2 = m; } return lo2; };
  const landed = () => baseCount + upper(arrTimes, now) + (leaveTimes.length - upper(leaveTimes, now));
  const meanNow = () => {
    if (meanTarget == null) return null;
    const k = ease((now - meanT0) / 1.4);
    return meanFrom + (meanTarget - meanFrom) * k;
  };
  // order 'file': rows of the file read so far (the last landed grain's row), then the
  // step's n exactly once every grain of it stands
  const rowsRead = () => {
    if (!rowT.length || now >= rowT[rowT.length - 1]) return rowsTo;
    const k = upper(rowT, now);
    return Math.max(rowsFrom, k ? rowM[k - 1] : 0);
  };
  const readout = () => {
    const m = meanNow();
    const ro = o.readout ?? (o.order === 'file' && mode === 'rows' ? 'rows' : undefined);
    if (m != null && ro !== 'count' && ro !== 'rows' && ro !== 'window') return m;
    if (ro === 'rows') return rowsRead();
    // 'window': the white grains landed (a {split}'s window, a {window}, the weights' whites)
    if (ro === 'window') return (baseCountW + upper(arrTimesW, now) + (leaveTimesW.length - upper(leaveTimesW, now))) * unit;
    const c = landed();
    const total = Math.max(1, N);
    if (ro === 'share') return c / total;
    if (ro && typeof ro === 'object' && ro.count != null) return (c / total) * Number(ro.count);
    if (ro && typeof ro === 'object' && ro.share != null) return (c / total) * Number(ro.share);
    return c * unit;
  };

  const api = {
    // a plot that stands (any step but 0) when its station is armed stays standing: the slide's
    // step then plays on from it (T2 slide 5 poured on from 1 000 instead of refilling from
    // nothing; T3 slide 13 kept its grains under the curve). `arrival: 'replay'` replays it
    arm() {
      if (o.arrival !== 'replay' && ready && cur > 0 && shown) { keptAt = now; return; }
      armed = true; armT = now; hideNow();
    },
    assemble(t, onDone) { now = t; arrive(); onDone?.(); },
    // a step the bus has set but this form has not taken yet counts as busy (a recorder that
    // checks between the click and the next frame saw a sweep's plot as settled: T5 slide 11)
    busy: () => (!ready && !failed && want > 0) || armed || pendingArrive || sel.fresh || now < frameFrom
      || (morph && now < morph.end + 0.4)
      || (meanTarget != null && now < meanT0 + 1.4)
      || now < tiltT0 + 1.7 || Math.abs(blur - Number(shown?.focus ?? 0)) > 0.01
      || (whiskOn && whisk && whisk.u.uShow.value < 0.99)
      || !!(sw && !sw.done) || subK > 0 || (fadeT0 > -OFF && now < fadeT0 + fadeDur),
    value: readout,
    values: () => ({ count: landed() * unit, mean: meanNow(), grains: N, unit, step: cur, rows: rowsRead(), roll: shownRoll, alarms: shownAlarms.slice() }),
    ready: () => ready,
    // the shown state stands (its fill done; a sweep counts as standing once its first state
    // does): a dk-curve over a re-rolling plot draws on then, not after the last roll
    standing: () => ready && !!shown && !armed && subK === 0 && (sw ? sw.start != null && now >= sw.start : !(morph && now < morph.end)),
    // false while a {tip} is still to come (the plot filling, or standing before it lets go):
    // a dk-scatter tipping from this plot waits for it
    tipReady: () => ready && !sel.fresh && subK === 0 && (!!shown?.tip || !(morph && now < morph.end)),
    // the frame other forms draw in (dk-curve, dk-vertex, dk-spark): add to `group` to tilt with the plot
    frame: () => ready && { lo, hi, bin, bins: nb, width: W, height: H, unit, perEntry: dy / unit, colMax, group: plot, x: xOf, y: (entries) => (entries / unit) * dy },
    // where a row's grain is now (world), or null when it is not drawn
    pointOf(row, out = new Vector3()) {
      if (!ready || mode !== 'rows') return null;
      const i = row >= 0 && row < rowToGrain.length ? rowToGrain[row] : -1;
      if (i < 0) return null;
      const c = morph.sample(i, now, [0, 0, 0, 0, 0]);
      if (c[3] < 0.01) return null;
      plot.updateWorldMatrix(true, false);
      return out.set(c[0], c[1], c[2]).applyMatrix4(plot.matrixWorld);
    },
    ours(out) { return oursG >= 0 ? api.pointOf(rowOf[oursG], out) : null; },
    // a row's grain stands (drawn, its motion over): a dk-spark `when: 'landed'` rings it only then
    landed(row = rowOf?.[oursG]) {
      if (!ready || mode !== 'rows') return false;
      const i = row >= 0 && row < rowToGrain.length ? rowToGrain[row] : -1;
      if (i < 0) return false;
      const c = morph.sample(i, now, [0, 0, 0, 0, 0]);
      return c[3] > 0.5 && now >= morph.t0 + morph.T[2 * i] + morph.T[2 * i + 1];
    },
    // how white a row's grain is now (0 crowd … 1 selected), or null when it is not drawn
    // (a dk-spark with color 'follow' takes its core's colour from it)
    whiteOf(row) {
      if (!ready || mode !== 'rows') return null;
      const i = row >= 0 && row < rowToGrain.length ? rowToGrain[row] : -1;
      if (i < 0) return null;
      const c = morph.sample(i, now, [0, 0, 0, 0, 0]);
      return c[3] < 0.01 ? null : Math.max(0, Math.min(1, c[4]));
    },
    // every drawn grain now (world positions), for a form that takes them over ({tip});
    // grains({ last: true }): where they stood in the last state shown that was not
    // {tip}, even after they have gone (a slide opened on the tip step)
    grains(opts) {
      if (!ready) return null;
      plot.updateWorldMatrix(true, false);
      const e = plot.matrixWorld.elements, c = [0, 0, 0, 0, 0];
      const rows = [], pos = [], white = [];
      const last = opts?.last && lastL;
      for (let i = 0; i < N; i++) {
        if (last) {
          if (!(lastL.vis[i] > 0.5)) continue;
          c[0] = lastL.pos[3 * i]; c[1] = lastL.pos[3 * i + 1]; c[2] = lastL.pos[3 * i + 2]; c[4] = lastL.white[i];
        } else {
          morph.sample(i, now, c);
          if (c[3] < 0.01) continue;
        }
        const [x, y, z] = c;
        rows.push(mode === 'rows' ? rowOf[i] : i);
        pos.push(e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], e[2] * x + e[6] * y + e[10] * z + e[14]);
        white.push(c[4]);
      }
      // alpha: the plot's grain alpha now, so a form taking the grains over starts them as bright as they were
      return { rows: Int32Array.from(rows), pos: Float32Array.from(pos), white: Float32Array.from(white), alpha: morph.u.uAlpha.value };
    },
    // the other side of {over}: gone[row] = the world time this plot's grain of that row
    // goes (OFF stays); null gives every grain back
    cede(gone) {
      if (!ready || mode !== 'rows') return;
      // given back while this plot is itself going (the bus says 0): its grains stay gone, or
      // run 1 flashed back whole for the 0.35 s of its own fade (lab 5 slide 7). They come
      // back at its next shown state.
      if (!gone && (sel.step ?? 0) <= 0) { restoreGone = true; return; }
      const G = morph.G;
      for (let i = 0; i < N; i++) { const r = rowOf[i]; G[i] = gone && r < gone.length ? gone[r] : OFF; }
      morph.gone();
    },
  };

  load().then(() => { if (pendingArrive) arrive(); else if (want > 0 && !armed) transition(want, arriveKind(want)); })
    .catch((e) => { failed = true; pendingArrive = false; console.warn(`dk-hist ${name}: data failed`, e); });
  if (name) kit.register(name, { type: TYPE, api });

  return {
    group: g, labels, api,
    frameScale,
    update(t, camPos) {
      const dt = Math.min(Math.max(t - now, 0), 0.1);
      now = t;
      if (sel.fresh) { sel.fresh = false; request(sel.step); }
      if (!ready) return;
      morph.u.uTime.value = t;
      if (armed && now - armT > 6) arrive();
      if (subK > 0 && now >= subAt && !armed) { const kk = subK; subK = 0; if (cur === kk) transition(kk, 'fwd'); }
      // a sweep's next index
      if (sw && !sw.done && sw.start != null && t >= sw.start && !armed) {
        const raw = sw.a + 1 + Math.floor((t - sw.start) / sw.every);
        let idx = Math.min(sw.b, raw), last = idx >= sw.b && sw.fin === sw.b;
        if (raw > sw.b && sw.fin !== sw.b) { idx = sw.fin; last = true; }
        if (idx !== sw.idx) { sw.idx = idx; if (last) sw.done = true; transition(cur, 'sweep'); }
        else if (last) sw.done = true;
      }
      // another station's plot: fixed-size numbers fade from 4 to 6 plot sizes away, the
      // grains from 8 to 12 (a dense plot far off is a bright point). `fade: false` keeps both.
      if (camPos && o.fade !== false) {
        centre.set(0, H / 2, 0); plot.localToWorld(centre);
        const R = Math.max(W, H), d = centre.distanceTo(camPos);
        near = Math.max(0, Math.min(1, (6 * R - d) / (2 * R)));
        far = Math.max(0, Math.min(1, (12 * R - d) / (4 * R)));
      }
      fadeMul = fadeT0 > -OFF ? 1 - ease((t - fadeT0) / fadeDur) : 1;
      morph.u.uShow.value = far * fadeMul;
      // brightness
      const ka = ease((t - alphaT0) / alphaDur);
      morph.u.uAlpha.value = alphaFrom + (alphaTo - alphaFrom) * ka;
      morph.u.uSelGain.value = selFrom + (selTo - selFrom) * ka;
      // the frame stands while the plot is shown
      // `axis: false` (step): the frame fades with the plot's grains (a {cut} that takes them all)
      const fw = shown && !shown.tip && shown.axis !== false && t >= frameFrom ? 1 : 0;
      frameShow += (fw - frameShow) * Math.min(1, dt * 3.5);
      if (Math.abs(fw - frameShow) < 0.003) frameShow = fw;
      // the object's ticks, or a step's own ({ticks}), crossfading over 0.5 s
      const mix = tickMix();
      // `axisAlpha` (object or step, 1): the axis line's brightness (an empty plot's baseline
      // that must read as a plot waiting for its data, T5 slide 12: 2)
      const fs = frameShow * fadeMul;
      frame.axis.u.uShow.value = fs * far * Math.max(0, Number(shown?.axisAlpha ?? o.axisAlpha ?? 1)); frame.marks.u.uShow.value = fs * far * (1 - mix);
      stepTk.u.uShow.value = fs * far * mix;
      if (alarmMk) alarmMk.u.uShow.value = fs * far;
      for (const l of baseLabels) l.userData.show = 1 - mix;
      for (const l of stepLabels.values()) l.userData.show = (l.userData.on ?? 0) * mix;
      shade(labels, fs * near);
      // tilt
      const kt = ease((t - tiltT0) / 1.6);
      plot.rotation.x = tiltFrom + (tiltTo - tiltFrom) * kt;
      // focus
      const fwant = Number(shown?.focus ?? 0);
      blur += (fwant - blur) * (1 - Math.exp(-dt * 3 / Number(o.focusTime ?? 2.5)));
      if (Math.abs(fwant - blur) < 0.004) blur = fwant;
      morph.u.uBlur.value = blur;
      // whiskers fade in once their columns stand
      if (whisk) {
        const ws = whiskOn ? Math.max(0, Math.min(1, (t - whiskShowT) / 0.6)) : Math.max(0, whisk.u.uShow.value - dt * 3);
        whisk.u.uShow.value = whiskOn ? Math.max(whisk.u.uShow.value, ws) : ws;
        // the band rides the same fader (a band step draws no whiskers: whisk.count(0))
        band.u.uShow.value = whiskKey.startsWith('b:') ? whisk.u.uShow.value * far : 0;
      }
      // the window's mean tick, gliding to each new mean
      const mt = shown?.meanTick ?? o.meanTick;
      const m = mt === false ? null : meanNow();
      if (tick) {
        if (m == null) tick.u.uShow.value = Math.max(0, tick.u.uShow.value - dt * 3);
        else {
          lastMean = m;
          const kk = ease((t - meanT0) / 1.4);
          const x = xOf(m), n = 90;
          // `meanTick: { y: [y0, y1], tone }`: the mean drawn like a step tick, a dotted line over
          // that span (shares of H from the axis line) in its tone, still gliding (T3 slide 3: the
          // mean and the world mark on one line, no parallax)
          const mo = mt && typeof mt === 'object' ? mt : null;
          if (mo && Array.isArray(mo.y)) {
            const y0 = ay + Number(mo.y[0]) * H, y1 = ay + Number(mo.y[1]) * H;
            for (let j = 0; j < n; j++) { tick.pos[3 * j] = x; tick.pos[3 * j + 1] = y0 + ((y1 - y0) * j) / (n - 1); tick.pos[3 * j + 2] = 0; }
          } else {
            const top = meanTopFrom + (meanTopY - meanTopFrom) * kk;
            for (let j = 0; j < n; j++) { tick.pos[3 * j] = x; tick.pos[3 * j + 1] = top + 0.04 * H + (0.12 * H * j) / (n - 1); tick.pos[3 * j + 2] = 0; }
          }
          const tc = mo?.tone === 'axis' ? P.axis : mo?.tone === 'crowd' ? P.crowd : mo?.tone === 'tick' ? P.tick : P.sel;
          if (tick.u.uColor.value.getHexString() !== tc.replace('#', '').toLowerCase()) tick.u.uColor.value.set(tc);
          tick.touch();
          tick.u.uShow.value = Math.min(1, Math.max(0, (t - meanT0 + 0.2) / 0.6)) * fadeMul;
        }
      }
    },
    dispose() {
      sel.off(); if (name) kit.unregister(name); heapUsed?.api.release?.(claimer); if (ceded) ceded.api.cede?.(null);
      morph?.dispose();
      for (const sg of [frame?.axis, frame?.marks, whisk, tick, peaks]) if (sg) { sg.geo.dispose(); sg.mat.dispose(); }
      band?.dispose(); stepTk?.dispose();
      for (const l of labels) { l.material.map?.dispose(); l.material.dispose(); }
    },
  };
}
