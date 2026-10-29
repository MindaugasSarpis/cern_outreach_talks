// dk-pipeline: a plot anyone can redo (Talk 5). The open file as a ball of grains, the
// scripts as their real lines, the CSV as a sheet of value grains, and a dk-hist at the
// end; a run sends the data through, left to right, and a second run lands grain for
// grain on the first (bible §4, §5 Talk 5). Everything is grains: no words, boxes,
// arrows or icons. The order of the stages on the floor is the order the data flows in.
//
// Stages (`stages`, in the pipeline's own frame):
// - { kind: 'pile', at (the floor point under it), r: 2.1, n: 91583, spin: 0.06, alpha: 0.6,
//   ours }: the file (record 401), a ball of n grains, one a candidate, turning slowly;
//   our row at size 2.5 on the side the camera sees.
// - { kind: 'code', at (bottom-left), size: [w, h], src: 'code-lines.json', script,
//   lines: [first, last] (1-based, inclusive), cols: 1, gap: 0.5, typing: 2.2 }: a
//   script drawn from its real lines, one grain row per line, every non-blank run of
//   characters a run of grains, so indent, length and the gaps between words are the
//   file's own. `cols` folds a long range into columns, as an editor's minimap does.
//   The lines are typed in when the stage appears; a run sends white sweeps down them.
// - { kind: 'sheet', at (bottom-left), size: [w, h], values: 'd0.f32', rows: 90 (per
//   page), pages: 1, cell: 14 (grains a value), stride: 1, columns }: the CSV, rows × 4 columns of value
//   grains, each value a short dash whose brightness is 0.1 + 0.9 x the value's rank in its column
//   (over all the file's rows); a missing value (TAU = −100 in the CSV) leaves its cell
//   dark. Rows are file rows from row 1 (`stride` k draws every k-th row). The rows are
//   written top to bottom when the sheet appears, as the stream arrives.
// - { kind: 'hist', of: '<dk-hist name>' }: the plot. The dk-hist draws itself: give it
//   `from`/`fromSpread` at the last code stage's right edge (api.outlet() says where)
//   and `fill` ≈ run.seconds, so its grains leave the code while the sweeps run.
//
// Steps: 0 hidden · k = 1..S: stages 1..k stand (the k-th builds; a sheet or a hist
// stage runs the data from the file up to it) · S+1: run 2 · S+2: the third run (with
// `run.third`). A run is the data streaming through every stage at once: grains leave
// the ball for the first script, the script's lines light in sweeps, rows are written
// and read (a white head running down the sheet), grains stream on into the next
// script, and the dk-hist fills out of it. Each run needs its own dk-hist object (run
// 2: the same values, seed and ours, `tone` crowd over run 1's `tone: 'sel'`), stepped
// by the deck on the same slide.
//
// Object fields: pos name stages grains (tier-0 count: the ball's n + about 29 000);
// run { seconds: 8, lead: 0.4, twice: true, third: false }; flow (grains per stream,
// 2500); sweeps (3 a run); alpha (code and sheet, 1.4), flowAlpha, sweepAlpha; seed.
// api: value() = the sheet's rows written so far, scaled to the file's (n once it
// stands); busy; outlet(k) → { from, fromSpread } in the station's frame, for a dk-hist
// fed by stage k (default: the last code stage); box(k) → a stage's { at, size } in the
// station's frame; scripts() → what each code stage draws; ready(); step().
import { Group, Vector3, Color } from 'three';
import { GRAIN, OURS, OURS_ROW, SEED, roles } from './style.js';
import { mulberry32 } from './rng.js';
import { createMorph, OFF, MOTION } from './morph.js';

export const TYPE = 'dk-pipeline';
export const FIELDS = ['pos', 'name', 'stages', 'grains'];
export const OWNER = 't5';

export function files(o) {
  const out = [];
  for (const s of Array.isArray(o.stages) ? o.stages : []) {
    if (s?.kind === 'sheet') { const v = s.values ?? 'd0.f32'; out.push(v); if (!s.cols) out.push(v.replace(/\.f32$/, '.json')); }
    if (s?.kind === 'code') out.push(s.src ?? 'code-lines.json');
  }
  return [...new Set(out)];
}

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildPipeline(o, ctx, stage, kit), { fields: FIELDS });
}

// Streams and sweeps: grains that exist only while a run passes. A run is a world-time
// window from uRun0, uRunDur long; s = its progress 0..1. A stream grain (aK.w = 0)
// leaves aA at s = aK.x and reaches aB after aK.y of the run, on a bow aK.z high. A
// sweep grain (aK.w = 1) stands at aA and lights as a sweep passes its phase aK.x
// (width aK.y; aK.z sweeps a run). aSeg: the stage it belongs to; it shows only when the
// run reaches that stage (uUpTo). All of it follows from uRun0 and the world time.
let FLOW = null;
const flowVert = (stage) => (FLOW ??= stage.GRAIN_GLSL + /* glsl */ `
attribute vec3 aA, aB;
attribute vec4 aK;
attribute float aSeed, aSeg;
uniform float uRun0, uRunDur, uUpTo, uShow, uAlpha, uSize;
uniform vec3 uColor;
void main() {
  if (uShow <= 0.001 || uRun0 > 1.0e8 || aSeg > uUpTo + 0.5) { hide(); return; }
  float s = (uTime - uRun0) / uRunDur;
  if (s < 0.0) { hide(); return; }
  if (aK.w < 0.5) {
    float k = (s - aK.x) / max(aK.y, 1.0e-3);
    if (k < 0.0 || k > 1.0) { hide(); return; }
    float e = k * k * (3.0 - 2.0 * k);
    vec3 c = 0.5 * (aA + aB) + vec3(0.0, aK.z, 0.0);
    vec3 p = (1.0 - e) * (1.0 - e) * aA + 2.0 * (1.0 - e) * e * c + e * e * aB;
    place(p, uSize * 0.9, uAlpha * sin(3.14159 * k) * uShow, uColor, aSeed);
  } else {
    float u = s * aK.z;
    if (u > aK.z + aK.y || u < aK.x - 2.5 * aK.y) { hide(); return; }
    float d = u - aK.x;
    d = d - floor(d + 0.5);
    if (abs(d) > 2.5 * aK.y) { hide(); return; }
    place(aA, uSize, uAlpha * exp(-(d * d) / (aK.y * aK.y)) * uShow, uColor, aSeed);
  }
}`);

// a column's values → each value's rank share 0..1 (NaN stays NaN)
function ranker(col) {
  const sorted = Float32Array.from(col.filter(Number.isFinite)).sort();
  const n = sorted.length;
  return (v) => {
    if (!Number.isFinite(v) || !n) return NaN;
    let lo = 0, hi = n;
    while (lo < hi) { const m = (lo + hi) >> 1; if (sorted[m] < v) lo = m + 1; else hi = m; }
    return lo / Math.max(1, n - 1);
  };
}

function buildPipeline(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  const pos0 = [o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0];
  g.position.set(...pos0);
  const name = String(o.name);
  const seed = o.seed ?? SEED;
  const stages = (Array.isArray(o.stages) ? o.stages : []).filter((s) => s && typeof s === 'object');
  const S = stages.length;
  const run = { seconds: 8, lead: 0.4, twice: true, third: false, ...(o.run || {}) };
  const D = Number(run.seconds), LEAD = Number(run.lead);
  const lastStep = S + (run.twice === false ? 0 : 1) + (run.twice !== false && run.third ? 1 : 0);
  const frameScale = { value: 1 };     // the engine keeps it at the buffer's height / 900
  const st = stage.stepper(name);

  // each stage's geometry in the pipeline's frame
  const geo = stages.map((s) => {
    const G = { kind: s.kind, at: new Vector3(...(s.at || [0, 0, 0])), size: s.size || [4, 8] };
    if (s.kind === 'pile') { G.r = Number(s.r ?? 2.1); G.c = G.at.clone().add(new Vector3(0, G.r + 0.3, 0)); }
    return G;
  });
  const box = (k) => {
    const G = geo[k];
    if (!G) return null;
    if (G.kind === 'pile') return { at: [G.c.x - G.r + pos0[0], G.at.y + pos0[1], G.c.z + pos0[2]], size: [2 * G.r, 2 * G.r + 0.3] };
    return { at: [G.at.x + pos0[0], G.at.y + pos0[1], G.at.z + pos0[2]], size: [...G.size] };
  };

  let now = 0, ready = false, failed = false, armed = false, armT = 0, pendingArrive = false, playedAt = -OFF;
  let want = st.step ?? 0, cur = 0;
  let ball = null, flat = null, flows = null, pulses = null;
  let ballN = 0, flatN = 0, flatStage = null, flatOrder = null;
  let sheetK = -1, nFile = 91583, rowsT0 = OFF, rowsDur = 0;
  // the run's times: an event (eventLatch), cleared once the run has passed
  const runU = { uRun0: { value: OFF }, uRunEnd: { value: OFF }, uRunDur: { value: D }, uUpTo: { value: -1 } };
  const ev = stage.eventLatch(runU, { start: 'uRun0', hide: 'uRunEnd', fade: 0.05 });
  let runEndsAt = -OFF;

  // the write head reaches sheet row r (of R) at this share of a run; the read head just behind
  const sw = (r, R) => 0.05 + 0.85 * (r / Math.max(1, R));
  const sr = (r, R) => Math.min(0.97, sw(r, R) + 0.03);

  async function load() {
    const rnd = mulberry32(seed * 7 + 11);
    // ---- code and sheet grains (one morph)
    const items = [];
    for (let k = 0; k < S; k++) {
      const s = stages[k], G = geo[k];
      const [w, h] = G.size;
      if (s.kind === 'code') {
        const d = await kit.loadJSON(ctx, s.src ?? 'code-lines.json');
        const sc = d.scripts?.[s.script] ?? Object.values(d.scripts || {})[0];
        if (!sc) throw new Error(`no script ${s.script} in ${s.src ?? 'code-lines.json'}`);
        const [a, b] = Array.isArray(s.lines) ? s.lines : [1, sc.runs.length];
        const lines = sc.runs.slice(Math.max(0, a - 1), Math.min(sc.runs.length, b));
        const L = lines.length, C = Math.max(1, Number(s.cols ?? 1));
        const per = Math.ceil(L / C), gap = Number(s.gap ?? 0.5);
        const colW = (w - gap * (C - 1)) / C;
        let longest = 1;
        for (const ln of lines) if (ln.length) longest = Math.max(longest, ln[ln.length - 1]);
        const cp = Number(s.pitch ?? colW / Math.max(longest, Number(s.chars ?? 0))), lp = h / per;
        Object.assign(G, { lines: L, per, lp, cp, cols: C, colW, gap, script: { name: s.script, bytes: sc.bytes, sha256: sc.sha256, first: a, last: a + L - 1 } });
        lines.forEach((ln, l) => {
          const col = Math.floor(l / per), row = l % per;
          const x0 = G.at.x + col * (colW + gap), y = G.at.y + h - (row + 0.5) * lp;
          for (let j = 0; j < ln.length; j += 2) {
            for (let ch = ln[j]; ch < ln[j + 1]; ch++) items.push({ k, x: x0 + (ch + 0.5) * cp, y, z: G.at.z, b: 1, build: l / L + ch * 0.0015, phase: (l + 0.5) / L, ch });
          }
        });
      } else if (s.kind === 'sheet') {
        const tab = await kit.loadTable(ctx, s.values ?? 'd0.f32', s.cols);
        nFile = tab.n;
        const cols = (s.columns ?? tab.cols).slice(0, 8);
        const nc = cols.length, wTab = tab.cols.length;
        const rank = cols.map((c) => ranker(tab.col(c) || new Float32Array(0)));
        const idx = cols.map((c) => tab.cols.indexOf(c));
        const per = Math.max(1, Number(s.rows ?? 90)), pages = Math.max(1, Number(s.pages ?? 1));
        const stride = Math.max(1, Math.round(Number(s.stride ?? 1)));
        const R = Math.min(per * pages, Math.floor((tab.n - 1) / stride) + 1);
        const pageGap = Number(s.pageGap ?? 0.5);
        const pageW = (w - pageGap * (pages - 1)) / pages;
        const cellN = Math.max(2, Number(s.cell ?? 14));
        const cellW = pageW / (nc + 0.35 * (nc - 1)), colGap = 0.35 * cellW;
        const lp = h / per, cp = cellW / (cellN - 1);
        Object.assign(G, { rows: R, per, pages, pageW, pageGap, lp, cellW, colGap, nc, stride });
        sheetK = k;
        for (let r = 0; r < R; r++) {
          const fr = r * stride, page = Math.floor(r / per), j = r % per;
          const y = G.at.y + h - (j + 0.5) * lp, xp = G.at.x + page * (pageW + pageGap);
          for (let c = 0; c < nc; c++) {
            const q = idx[c] >= 0 ? rank[c](tab.data[fr * wTab + idx[c]]) : NaN;
            if (!Number.isFinite(q)) continue;      // a missing value: its cell stays dark
            const b = 0.1 + 0.9 * q;      // a wide range: neighbouring rows differ at room size
            for (let e = 0; e < cellN; e++) items.push({ k, x: xp + c * (cellW + colGap) + e * cp, y, z: G.at.z, b, row: r, build: sw(r, R), phase: sw(r, R) });
          }
        }
      }
    }

    // ---- streams between stages, sweeps over code and sheet
    const F = Math.max(0, Math.round(Number(o.flow ?? 2500)));
    const fl = [];          // per grain: ax ay az bx by bz | phase trip bow kind | seg seed
    const A = new Vector3(), B = new Vector3();
    const srcPoint = (k, rowShare, out) => {
      const s = stages[k], G = geo[k];
      if (s.kind === 'pile') {
        // the half of the ball that faces the next stage
        const u = 2 * rnd() - 1, ph = (rnd() - 0.5) * Math.PI, q = Math.sqrt(1 - u * u);
        return out.set(G.c.x + G.r * q * Math.cos(ph), G.c.y + G.r * u, G.c.z + G.r * q * Math.sin(ph));
      }
      if (s.kind === 'code') return out.set(G.at.x + G.size[0] + 0.15, G.at.y + G.size[1] * (0.05 + 0.9 * rnd()), G.at.z + 0.3 * (rnd() - 0.5));
      // a sheet: the right end of the row the read head is on
      const r = Math.min(G.rows - 1, Math.floor(rowShare * G.rows)), page = Math.floor(r / G.per), j = r % G.per;
      return out.set(G.at.x + page * (G.pageW + G.pageGap) + G.pageW + 0.05, G.at.y + G.size[1] - (j + 0.5) * G.lp, G.at.z);
    };
    const dstPoint = (k, r, out) => {
      const s = stages[k], G = geo[k];
      if (s.kind === 'pile') return out.set(G.c.x, G.c.y, G.c.z);
      if (s.kind === 'code') return out.set(G.at.x - 0.1, G.at.y + G.size[1] * (0.05 + 0.9 * rnd()), G.at.z + 0.3 * (rnd() - 0.5));
      // a sheet: a point along the row being written
      const page = Math.floor(r / G.per), j = r % G.per;
      return out.set(G.at.x + page * (G.pageW + G.pageGap) + rnd() * G.pageW, G.at.y + G.size[1] - (j + 0.5) * G.lp, G.at.z);
    };
    for (let k = 1; k < S; k++) {
      const s = stages[k], p = stages[k - 1];
      if (s.kind === 'hist' || p.kind === 'hist') continue;
      for (let f = 0; f < F; f++) {
        let phase, trip, r = 0;
        if (s.kind === 'sheet') { r = Math.floor(rnd() * geo[k].rows); trip = 0.07; phase = Math.max(0, sw(r, geo[k].rows) - trip); }
        else if (p.kind === 'sheet') { r = Math.floor(rnd() * geo[k - 1].rows); trip = 0.07; phase = sr(r, geo[k - 1].rows); }
        else { trip = 0.09; phase = 0.02 + rnd() * (0.93 - trip); }
        srcPoint(k - 1, (r + 0.5) / Math.max(1, geo[k - 1].rows || 1), A);
        dstPoint(k, r, B);
        fl.push(A.x, A.y, A.z, B.x, B.y, B.z, phase, trip, (0.12 + 0.1 * rnd()) * A.distanceTo(B), 0, k, rnd());
      }
    }
    const pl = [];
    const sweeps = Math.max(1, Number(o.sweeps ?? 3));
    for (const it of items) {
      const s = stages[it.k];
      if (s.kind === 'code') {
        if (it.ch & 1) continue;        // every other character: the sweep is a light passing, not a copy
        pl.push(it.x, it.y, it.z + 0.01, 0, 0, 0, it.phase * 0.92 + 0.04, 0.035, sweeps, 1, it.k, rnd());
      } else if (s.kind === 'sheet') {
        // the write head (the run reaches the sheet) and the read head (the run goes on)
        pl.push(it.x, it.y, it.z + 0.01, 0, 0, 0, it.phase, 0.012, 1, 1, it.k, rnd());
        if (it.k < S - 1) pl.push(it.x, it.y, it.z + 0.01, 0, 0, 0, sr(it.row, geo[it.k].rows), 0.012, 1, 1, it.k + 1, rnd());
      }
    }

    // ---- the ball: one grain a candidate, as far as the tier's budget allows
    const pileK = stages.findIndex((s) => s.kind === 'pile');
    if (pileK >= 0) {
      const s = stages[pileK], G = geo[pileK], c = G.c, r = G.r;
      const n = Math.max(1, Math.round(Number(s.n ?? nFile)));
      const others = items.length + fl.length / 12 + pl.length / 12;
      ballN = Math.min(n, Math.max(1000, (ctx.budget ?? 300000) - others));
      ball = createMorph(stage, ballN, { crowd: P.crowd, sel: P.sel, seed, uniforms: { uPixelRatio: frameScale } });
      ball.u.uSpinC.value.copy(c); ball.u.uSpin.value = Number(s.spin ?? 0.06);
      ball.u.uAlpha.value = Number(s.alpha ?? 0.6);
      ball.home = new Float32Array(ballN * 3); ball.scatter = new Float32Array(ballN * 3);
      for (let i = 0; i < ballN; i++) {
        const u = 2 * rnd() - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - u * u), rr = r * Math.cbrt(rnd());
        ball.home.set([c.x + rr * q * Math.cos(ph), c.y + rr * u, c.z + rr * q * Math.sin(ph)], 3 * i);
        const R2 = r * (2 + 2 * rnd());
        ball.scatter.set([c.x + R2 * q * Math.cos(ph), c.y + R2 * u, c.z + R2 * q * Math.sin(ph)], 3 * i);
      }
      const ours = s.ours === false ? null : (s.ours ?? OURS_ROW);
      if (ours != null && ours < ballN) {
        ball.home.set([c.x + 0.3 * r, c.y + 0.35 * r, c.z + 0.86 * r], 3 * ours);
        ball.Z[ours] = OURS / GRAIN; ball.sizes();
      }
      g.add(ball.points);
    }
    flatN = items.length;
    if (flatN) {
      flat = createMorph(stage, flatN, { crowd: P.crowd, sel: P.sel, seed: seed + 1, uniforms: { uPixelRatio: frameScale } });
      flat.u.uAlpha.value = Number(o.alpha ?? 1.4);
      flat.home = new Float32Array(flatN * 3); flat.bright = new Float32Array(flatN);
      flatStage = new Int16Array(flatN); flatOrder = new Float32Array(flatN);
      items.forEach((it, i) => { flat.home.set([it.x, it.y, it.z], 3 * i); flatStage[i] = it.k; flatOrder[i] = it.build; flat.bright[i] = it.b; });
      g.add(flat.points);
    }
    const mk = (arr, color, alpha, size) => {
      const n = arr.length / 12;
      if (!n) return null;
      const a = new Float32Array(n * 3), b = new Float32Array(n * 3), kk = new Float32Array(n * 4), sd = new Float32Array(n), sg = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const j = 12 * i;
        a[3 * i] = arr[j]; a[3 * i + 1] = arr[j + 1]; a[3 * i + 2] = arr[j + 2];
        b[3 * i] = arr[j + 3]; b[3 * i + 1] = arr[j + 4]; b[3 * i + 2] = arr[j + 5];
        kk[4 * i] = arr[j + 6]; kk[4 * i + 1] = arr[j + 7]; kk[4 * i + 2] = arr[j + 8]; kk[4 * i + 3] = arr[j + 9];
        sg[i] = arr[j + 10]; sd[i] = arr[j + 11];
      }
      const gg = stage.grainGeometry(n, { position: a.slice(), aA: [a, 3], aB: [b, 3], aK: [kk, 4], aSeed: [sd, 1], aSeg: [sg, 1] });
      const mat = stage.grainMaterial(flowVert(stage), {
        ...runU, uPixelRatio: frameScale, uShow: { value: 1 }, uAlpha: { value: alpha }, uSize: { value: size }, uColor: { value: new Color(color) },
      });
      g.add(stage.grainPoints(gg, mat));
      return { geo: gg, mat, n };
    };
    flows = mk(fl, P.crowd, Number(o.flowAlpha ?? 0.9), GRAIN);
    pulses = mk(pl, P.sel, Number(o.sweepAlpha ?? 0.75), GRAIN);
    ready = true;
  }

  // ---- states ------------------------------------------------------------------------
  const shownStages = (k) => Math.min(k, S);
  // the stage a step's run reaches (-1: the step runs nothing)
  const chainTo = (k) => {
    if (k > S) return S - 1;
    const s = stages[k - 1];
    return s && (s.kind === 'sheet' || s.kind === 'hist') ? k - 1 : -1;
  };
  function flatTarget(k) {
    const n = shownStages(k);
    const vis = new Float32Array(flatN), white = new Float32Array(flatN);
    for (let i = 0; i < flatN; i++) vis[i] = flatStage[i] < n ? flat.bright[i] : 0;
    return { pos: flat.home, vis, white };
  }
  function ballTarget(k) {
    const vis = new Float32Array(ballN), white = new Float32Array(ballN);
    if (k > 0) vis.fill(1);
    return { pos: ball.home, vis, white };
  }

  function transition(k, kind) {
    const t = now;
    const instant = kind === 'back' || kind === 'hide';
    const fresh = kind === 'arrive' || cur === 0;
    const newest = k >= 1 && k <= S ? k - 1 : -1;        // the stage this step builds
    const chain = instant ? -1 : chainTo(k);
    const runT0 = t + LEAD;
    if (ball) {
      ball.go(t, ballTarget(k), (m) => {
        const { A, B, V, T, M, S: Sd } = m;
        for (let i = 0; i < ballN; i++) {
          const i2 = 2 * i, i3 = 3 * i, v0 = V[i2], v1 = V[i2 + 1];
          if (v0 < 0.01 && v1 > 0.01) {
            M[i] = MOTION.GLIDE;
            if (instant || !fresh) { A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1]; A[i3 + 2] = B[i3 + 2]; T[i2] = instant ? 0 : 0.3 * Sd[i]; T[i2 + 1] = instant ? 0.35 : 0.8; }
            else { A[i3] = ball.scatter[i3]; A[i3 + 1] = ball.scatter[i3 + 1]; A[i3 + 2] = ball.scatter[i3 + 2]; T[i2] = 0.1 + 0.5 * Sd[i]; T[i2 + 1] = 1.8; }
          } else if (v0 > 0.01 && v1 < 0.01) { B[i3] = A[i3]; B[i3 + 1] = A[i3 + 1]; B[i3 + 2] = A[i3 + 2]; M[i] = MOTION.GLIDE; T[i2] = 0; T[i2 + 1] = 0.35; }
          // a grain that stays: it stands where the turning ball has it (the default, at once)
        }
      }, { rotB: 1 });
    }
    if (flat) {
      flat.go(t, flatTarget(k), (m) => {
        const { A, B, V, T, M, S: Sd } = m;
        for (let i = 0; i < flatN; i++) {
          const i2 = 2 * i, i3 = 3 * i, v0 = V[i2], v1 = V[i2 + 1], sk = flatStage[i];
          if (v0 < 0.01 && v1 > 0.01) {
            A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1]; A[i3 + 2] = B[i3 + 2];
            M[i] = MOTION.GLIDE;
            if (instant) { T[i2] = 0; T[i2 + 1] = 0.35; }
            else if (sk === newest && stages[sk].kind === 'sheet') { T[i2] = LEAD + flatOrder[i] * D; T[i2 + 1] = 0.25; }   // written as the stream arrives
            else if (sk === newest) { T[i2] = 0.2 + flatOrder[i] * Number(stages[sk].typing ?? 2.2); T[i2 + 1] = 0.3; }      // typed in, line by line
            else { T[i2] = 0.15 * sk + 0.4 * Sd[i]; T[i2 + 1] = 0.6; }                                                         // standing already: back at once
          } else if (v0 > 0.01 && (v1 < 0.01 || Math.abs(v0 - v1) > 1e-3)) { M[i] = MOTION.GLIDE; T[i2] = 0; T[i2 + 1] = 0.35; }
        }
      });
    }
    // the sheet's writing window, for value()
    if (sheetK >= 0 && newest === sheetK && !instant) { rowsT0 = runT0 + 0.05 * D; rowsDur = 0.85 * D; }
    else rowsT0 = shownStages(k) > sheetK ? -OFF : OFF;
    // the run: a fresh event each time (a run never carries into the next one)
    runU.uRun0.value = OFF; runU.uRunEnd.value = OFF; runEndsAt = -OFF;
    if (chain >= 0 && (flows || pulses)) {
      runU.uUpTo.value = chain;
      ev.start(t, runT0);
      runEndsAt = runT0 + D * 1.06;
    }
    cur = k; playedAt = t;
  }

  const request = (k) => {
    want = Math.max(0, Math.min(lastStep, Number(k) || 0));
    if (!ready || armed) return;
    if (want !== cur) transition(want, want < cur ? (want === 0 ? 'hide' : 'back') : 'fwd');
  };
  const hideNow = () => {
    if (!ready) return;
    if (ball) ball.jump(now, ballTarget(0), { rotB: 1 });
    if (flat) flat.jump(now, flatTarget(0));
    runU.uRun0.value = OFF; runU.uRunEnd.value = OFF; runEndsAt = -OFF; rowsT0 = OFF;
    cur = 0;
  };
  const arrive = () => {
    const wasArmed = armed;
    armed = false;
    if (!ready) { pendingArrive = !failed; return; }
    pendingArrive = false;
    // `c` (an assembly with no flight before it) replays from nothing, unless it just played
    if (!wasArmed && now - playedAt > 1.5) hideNow();
    if (want > 0) transition(want, 'arrive');
  };

  const api = {
    arm() { armed = true; armT = now; hideNow(); },
    assemble(t, onDone) { now = t; arrive(); onDone?.(); },
    busy: () => (!ready && !failed && want > 0) || armed || pendingArrive
      || !!(ball && now < ball.end + 0.3) || !!(flat && now < flat.end + 0.3) || now < runEndsAt,
    // the sheet's rows written so far, scaled to the file's (all of them once it stands)
    value() {
      if (sheetK < 0 || cur <= sheetK) return 0;
      if (rowsT0 <= -OFF / 2) return nFile;
      return Math.round(Math.max(0, Math.min(1, (now - rowsT0) / Math.max(1e-3, rowsDur))) * nFile);
    },
    ready: () => ready,
    step: () => cur,
    box,
    // where a dk-hist fed by stage k takes its grains from (the station's frame)
    outlet(k) {
      if (k == null) for (let j = S - 1; j >= 0; j--) if (stages[j].kind === 'code') { k = j; break; }
      const b = box(k);
      if (!b) return null;
      return { from: [b.at[0] + b.size[0] + 0.4, b.at[1] + b.size[1] / 2, b.at[2]], fromSpread: [0.3, b.size[1], 0.3] };
    },
    scripts: () => geo.filter((G) => G.script).map((G) => ({ ...G.script, lines: G.lines, cols: G.cols })),
  };
  kit.register(name, { type: TYPE, api });

  load().then(() => { if (pendingArrive) arrive(); else if (want > 0 && !armed) transition(want, 'arrive'); })
    .catch((e) => { failed = true; pendingArrive = false; console.warn(`dk-pipeline ${name}: data failed`, e); });

  return {
    group: g, api, frameScale,
    update(t) {
      now = t;
      if (st.fresh) { st.fresh = false; request(st.step); }
      if (!ready) return;
      if (ball) ball.u.uTime.value = t;
      if (flat) flat.u.uTime.value = t;
      if (flows) flows.mat.uniforms.uTime.value = t;
      if (pulses) pulses.mat.uniforms.uTime.value = t;
      if (armed && now - armT > 6) arrive();
      // the run lets go once it has passed; the latch then clears its times
      if (ev.on && t > runEndsAt) ev.stop(t);
      ev.tick(t);
    },
    dispose() {
      st.off(); kit.unregister(name);
      ball?.dispose(); flat?.dispose();
      for (const f of [flows, pulses]) if (f) { f.geo.dispose(); f.mat.dispose(); }
    },
  };
}
