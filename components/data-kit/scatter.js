// dk-scatter: one grain per event in two variables (bible §4, Talk 4). Class colours
// (white = signal / kept, light blue = the crowd), a box cut, the perceptron's line per
// epoch from the bake's log, a bent boundary from a score grid or a logged network,
// train / test arrivals, the rare-signal mode, the leak axis ({depth}, {undo}), and the
// tip-in from a dk-hist ({tip}).
//
// Every boundary is the zero contour of a "kept" function over the plot (a box, a line,
// a network's score − 0.5), drawn as a chain of fine white grains. Because each one is
// a chain of the same grains, any boundary can turn into any other: the vertical cut
// tilts into a line, the line sweeps through the epochs, and then bends round the cloud.
//
// The grains move through the kit's grain engine (morph.js), on the world clock: a step
// is a target state per grain, and stepping back and forth leaves no state behind.
// See README.md for the fields and steps.
import { Group, Vector3 } from 'three';
import { GRAIN, OURS, OURS_ROW, SEED, LABEL, roles, fmt } from './style.js';
import { mulberry32, gauss, order as seriesOrder } from './rng.js';
import { fixedLabel, shade, niceTicks } from './label.js';
import { createMorph, staticGrains, OFF, MOTION } from './morph.js';
import { stateAt } from './hist.js';

export const TYPE = 'dk-scatter';
export const FIELDS = ['pos', 'name', 'grains'];
export const OWNER = 't4';

// ---- presets: what an object gets when it does not say ----------------------------
// record 401 (d0.f32): log IPχ² against log decay time, the 91 531 rows with TAU > 0,
// label = the mass window 1845-1885 MeV/c² (the course's Lecture 16 recipe), the leak
// axis on M, and the honest two-input network of train.py as the bent boundary.
export const D0 = {
  x: { col: 'IPCHI2', log: true, range: [-3.5, 5] },
  // 0.08-50 ps: the data's own 0.150 ps start (a pre-selection) and the long tail both
  // sit inside the frame, so neither reads as a clamp
  y: { col: 'TAU', log: true, range: [Math.log10(0.08), Math.log10(50)] },
  where: [['TAU', '>', 0]],
  label: [['M', '>', 1845], ['M', '<', 1885]],
  depth: { col: 'M', range: [1810, 1920], size: 9, squeeze: 0.04 },
  score: { file: 'train-d0.json', net: 'twoInputs', inputs: [['IPCHI2', 1], ['TAU', 0.001]] },
};
// the course's JSON point sets (train-perceptron.json, train-ring.json):
// points.x[i] = [x1, x2], points.label[i], points.splitRole[i]
const POINTS = { x: { col: 'x1' }, y: { col: 'x2' }, label: 'label' };

const isD0 = (o) => !o.rare && /(^|\/)d0\.f32$/.test(String(o.src ?? 'd0.f32'));
const isProxy = (o) => o.of != null && o.src == null && !o.rare;
const usesStep = (o, k) => (Array.isArray(o.steps) ? o.steps : []).some((s) => s && typeof s === 'object' && s[k] != null);

// the data files an object loads (check.mjs checks them against the manifest)
export function files(o) {
  if (isProxy(o) || o.rare) return [];
  const src = String(o.src ?? 'd0.f32');
  const out = [src];
  if (/\.f32$/.test(src) && !o.tableCols) out.push(src.replace(/\.f32$/, '.json'));
  const score = o.score ?? (isD0(o) ? D0.score : null);
  if (score?.file && usesStep(o, 'bend')) out.push(score.file);
  return [...new Set(out)];
}

let unnamed = 0;   // a deterministic stepper id for a plot with no name

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => (isProxy(o) ? buildProxy(o, kit) : buildScatter(o, ctx, stage, kit)), { fields: FIELDS });
}

// A readout proxy: { type: 'dk-scatter', name: 'w1', of: 'p', readout: 'w1', grains: 0 }
// draws nothing and shows another scatter's number, so one form can feed three
// <StageCount>s (w₁, w₂, b).
function buildProxy(o, kit) {
  const g = new Group();
  const api = {
    arm() {}, assemble(t, onDone) { onDone?.(); }, busy: false,
    value: () => { const f = kit.form(o.of); const v = f?.api?.read?.(o.readout ?? 'count'); return Number.isFinite(v) ? v : null; },
  };
  return { group: g, api };
}

// [col, op, v] or a list of them → (row) => bool, over a column getter
function rowTest(spec, col) {
  if (!spec) return null;
  const list = Array.isArray(spec[0]) ? spec : [spec];
  const tests = list.map(([c, op, v]) => {
    const x = col(c);
    if (!x) { console.warn(`dk-scatter: no column ${c}`); return () => true; }
    switch (op) {
      case '<': return (r) => x[r] < v;
      case '<=': return (r) => x[r] <= v;
      case '>': return (r) => x[r] > v;
      case '>=': return (r) => x[r] >= v;
      case '==': return (r) => x[r] === v;
      case '!=': return (r) => x[r] !== v;
      case 'finite': return (r) => Number.isFinite(x[r]);
      case 'in': return (r) => x[r] >= v[0] && x[r] <= v[1];
      default: console.warn(`dk-scatter: unknown op ${op}`); return () => true;
    }
  });
  return (r) => { for (const t of tests) if (!t(r)) return false; return true; };
}

const sig = (z) => 1 / (1 + Math.exp(-z));
const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x) => { x = clamp01(x); return x * x * x * (x * (x * 6 - 15) + 10); };

// ---- marching squares: the zero contour of f over the plot, as chained polylines ----
// f(x, y) in plot coordinates (x from −W/2 to W/2, y from 0 to H). → [[x0, y0, x1, y1, …], …]
export function contour(f, W, H, nx, ny) {
  const val = new Float32Array(nx * ny);
  const gx = (i) => -W / 2 + (i * W) / (nx - 1), gy = (j) => (j * H) / (ny - 1);
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const v = f(gx(i), gy(j)); val[j * nx + i] = Number.isFinite(v) ? v : -1; }
  // edge ids: horizontal (i,j)-(i+1,j) = 2(j·nx+i); vertical (i,j)-(i,j+1) = 2(j·nx+i)+1
  const pt = new Map();
  const edgePoint = (id) => {
    if (pt.has(id)) return pt.get(id);
    const k = id >> 1, i = k % nx, j = (k - i) / nx;
    const a = val[k], b = id & 1 ? val[k + nx] : val[k + 1];
    const s = Math.abs(a - b) < 1e-12 ? 0.5 : a / (a - b);
    const p = id & 1 ? [gx(i), gy(j) + s * (gy(j + 1) - gy(j))] : [gx(i) + s * (gx(i + 1) - gx(i)), gy(j)];
    pt.set(id, p);
    return p;
  };
  const segs = [];
  for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
    const k = j * nx + i;
    const a = val[k] > 0, b = val[k + 1] > 0, c = val[k + nx + 1] > 0, d = val[k + nx] > 0;
    const e = [2 * k, 2 * (k + 1) + 1, 2 * (k + nx), 2 * k + 1];   // bottom, right, top, left
    const cut = [a !== b, b !== c, c !== d, d !== a];
    const n = cut.filter(Boolean).length;
    if (n === 2) { const q = [0, 1, 2, 3].filter((z) => cut[z]); segs.push([e[q[0]], e[q[1]]]); }
    else if (n === 4) {
      const centre = (val[k] + val[k + 1] + val[k + nx + 1] + val[k + nx]) / 4 > 0;
      // cut off the two corners whose sign differs from the centre's
      if (b !== centre) { segs.push([e[0], e[1]]); segs.push([e[2], e[3]]); }
      else { segs.push([e[3], e[0]]); segs.push([e[1], e[2]]); }
    }
  }
  // chain the segments through their shared edges
  const at = new Map();
  segs.forEach((s, q) => { for (const id of s) { if (!at.has(id)) at.set(id, []); at.get(id).push(q); } });
  const used = new Uint8Array(segs.length);
  const lines = [];
  const walk = (q0, from) => {
    const ids = [from];
    let q = q0, cur = from;
    while (q >= 0 && !used[q]) {
      used[q] = 1;
      const nxt = segs[q][0] === cur ? segs[q][1] : segs[q][0];
      ids.push(nxt);
      cur = nxt;
      q = (at.get(cur) || []).find((z) => !used[z]) ?? -1;
    }
    const out = [];
    for (const id of ids) out.push(...edgePoint(id));
    return out;
  };
  // open chains first (they end on the frame), then closed loops
  for (const [id, qs] of at) if (qs.length === 1 && !used[qs[0]]) lines.push(walk(qs[0], id));
  for (let q = 0; q < segs.length; q++) if (!used[q]) lines.push(walk(q, segs[q][0]));
  return lines;
}

const lenOf = (pl) => { let L = 0; for (let k = 2; k < pl.length; k += 2) L += Math.hypot(pl[k] - pl[k - 2], pl[k + 1] - pl[k - 1]); return L; };
// K points spread along the polylines by arc length (pieces shorter than `minLen` dropped)
export function resample(lines, K, minLen) {
  const keep = lines.map((pl) => ({ pl, L: lenOf(pl) })).filter((x) => x.L >= minLen).sort((a, b) => b.L - a.L);
  const total = keep.reduce((a, b) => a + b.L, 0);
  if (!(total > 0)) return null;
  const out = new Float32Array(K * 2);
  let q = 0;
  keep.forEach(({ pl, L }, p) => {
    const k = p === keep.length - 1 ? K - q : Math.min(K - q, Math.round((K * L) / total));
    if (k <= 0) return;
    let seg = 2, acc = 0, segL = Math.hypot(pl[2] - pl[0], pl[3] - pl[1]);
    for (let s = 0; s < k; s++) {
      const want = ((s + 0.5) / k) * L;
      while (acc + segL < want && seg < pl.length - 2) { acc += segL; seg += 2; segL = Math.hypot(pl[seg] - pl[seg - 2], pl[seg + 1] - pl[seg - 1]); }
      const u = segL > 0 ? clamp01((want - acc) / segL) : 0;
      out[2 * q] = pl[seg - 2] + u * (pl[seg] - pl[seg - 2]);
      out[2 * q + 1] = pl[seg - 1] + u * (pl[seg + 1] - pl[seg - 1]);
      q++;
    }
  });
  return out;
}

// ---- the rare-signal set (simulated): n background, `signal` signal, a cut that keeps
// exactly `fp` background and `tp` signal (Lecture 16's arithmetic, train-rare.json:
// 100 in 100 000, recall 0.90, 1 % false positives → 90 and 999). Seeded.
export function rareSet(cfg) {
  const n = Math.round(cfg.n ?? 100000), ns = Math.round(cfg.signal ?? 100);
  const tp = Math.round(cfg.tp ?? 90), fp = Math.round(cfg.fp ?? 999);
  const rnd = mulberry32(cfg.seed ?? SEED);
  const nb = n - ns;
  const x1 = new Float32Array(n), x2 = new Float32Array(n), label = new Float32Array(n);
  // background: a broad cloud low on the left, 4 sd clear of the frame's edges (at 2.3 sd
  // the rejection cut showed as straight edges); signal: a tight cloud up on the right,
  // just past the cut (near u + v = 1.17; the signal's u + v is 1.36 ± 0.085), so the
  // white cluster stands clear of the crowd's tail. The 10 below the cut are drawn by
  // seeded rejection, as the 90 above are (lab 4: at 1.28 the cluster sank into the tail)
  const [bx, by, bs] = cfg.bkg ?? [0.42, 0.42, 0.1];
  const [sx, sy, ss] = cfg.sig ?? [0.68, 0.68, 0.06];
  const score = new Float64Array(nb);
  for (let i = 0; i < nb; i++) {
    let u, v;
    do { u = bx + bs * gauss(rnd); v = by + bs * gauss(rnd); } while (u < 0.01 || u > 0.99 || v < 0.01 || v > 0.99);
    x1[i] = u; x2[i] = v; score[i] = u + v;
  }
  // the cut: u + v > c, with exactly fp background above it
  const sorted = Float64Array.from(score).sort();
  const c = 0.5 * (sorted[nb - fp] + sorted[nb - fp - 1]);
  let above = 0, below = 0, i = nb, tries = 0;
  while (above + below < ns && tries++ < 1e6) {
    const u = sx + ss * gauss(rnd), v = sy + ss * gauss(rnd);
    if (u < 0.01 || u > 0.99 || v < 0.01 || v > 0.99) continue;
    const up = u + v > c;
    if (up && above < tp) above++;
    else if (!up && below < ns - tp) below++;
    else continue;
    x1[i] = u; x2[i] = v; label[i] = 1; i++;
  }
  return { n, x1, x2, label, cut: c };
}

function buildScatter(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  if (o.yaw) g.rotation.y = (Number(o.yaw) * Math.PI) / 180;
  const plot = new Group();
  g.add(plot);
  // the labels stand beside the plot, not in it: the plot squeezes in x while the leak
  // axis is open, and a sprite under a squeezed parent is squeezed with it
  const labG = new Group();
  g.add(labG);
  const name = o.name != null ? String(o.name) : null;
  const steps = Array.isArray(o.steps) && o.steps.length ? o.steps : [0, {}];
  const seed = o.seed ?? SEED;
  const sel = stage.stepper(name ?? `dk-scatter-${o.pos ? o.pos.join(',') : unnamed++}`);
  // every label (the engine's scrim dims these); axis labels fade with the frame,
  // depth labels with the leak axis
  const labels = [], axisLabels = [], depthLabels = [];
  const frameScale = { value: 1 };
  const d0 = isD0(o);
  const pre = d0 ? D0 : o.rare ? {} : POINTS;

  let now = 0, ready = false, failed = false, armed = false, armT = 0, pendingArrive = false;
  let want = sel.step ?? 0, cur = 0, shown = null, playedAt = -OFF;
  // data: kept rows k, their raw axis values, display values, labels, roles
  let rawX, rawY, uX, uY, lab, role = null, roleNames = [], rowCol = null, srcJSON = null;
  let ax, ay, W, H, xOf, yOf, depthCfg = null, depthVal = null;
  // grains
  let N = 0, rowOf, grainOf, morph = null, baseVis, sideVis = null, fillRank, jz, oursG = -1;
  let counted = new Uint8Array(0), arrTimes = new Float64Array(0), leaveTimes = new Float64Array(0), baseCount = 0;
  // the boundary: K grains along the zero contour of the state's kept function
  const K = Math.round(o.boundaryGrains ?? 1800);
  let bnd = null, bFrom = null, bCur = null, bT0 = -OFF, bDur = 1.2, bShow = 0, bShowFrom = 0, bShowTo = 0;
  let bTarget = () => null;   // → Float32Array(2K) | null; moves while the line sweeps
  // a boundary that goes with nothing after it dissolves to dust where it stands (bDust);
  // one that comes with nothing before it draws on along its length (bDraw)
  let bDust = false, bDraw = false, dustOff = null;
  let sweep = null;           // { e0, e1, t0, dur }
  let epochNow = 0, version = 0, readCache = null;
  let scoreFn = null;
  const lineAlpha = Number(o.lineAlpha ?? 1.1);
  let frame = null, depthShow = 0, depthWant = 0, near = 1, far = 1;
  let depthNext = 0, depthAt = -1;                      // a step's `after`: the depth changes then
  let tipWait = null;                                   // a {tip} waiting for its hist to stand and let go
  const camDir = new Vector3(), zAxis = new Vector3();
  const centre = new Vector3();

  // ---- data -------------------------------------------------------------------------
  async function load() {
    const ax0 = { ...(pre.x || {}), ...(o.x || {}) }, ay0 = { ...(pre.y || {}), ...(o.y || {}) };
    if (o.cols) { ax0.col = o.cols[0]; ay0.col = o.cols[1]; }
    if (o.log) { ax0.log = !!o.log[0]; ay0.log = !!o.log[1]; }
    if (o.range) { ax0.range = o.range[0]; ay0.range = o.range[1]; }
    let col, n;
    let labelSpec = o.label ?? o.classCol ?? pre.label ?? null;
    const whereSpec = o.where ?? pre.where ?? null;
    if (o.rare) {
      const r = rareSet(o.rare);
      const cols = { x1: r.x1, x2: r.x2, label: r.label };
      col = (c) => cols[c] || null;
      n = r.n; ax0.col ??= 'x1'; ay0.col ??= 'x2'; ax0.range ??= [0, 1]; ay0.range ??= [0, 1];
      labelSpec = o.label ?? 'label';
      // the rare set's cut, as the line u + v = c (in the steps: { line: 'cut' })
      srcJSON = { cut: { w: [1, 1], b: -r.cut } };
    } else if (/\.json$/.test(String(o.src))) {
      srcJSON = await kit.loadJSON(ctx, o.src);
      const pts = srcJSON.points || {};
      n = (pts.x || []).length;
      const cols = { x1: new Float32Array(n), x2: new Float32Array(n), label: new Float32Array(n), role: new Float32Array(n) };
      for (let i = 0; i < n; i++) { cols.x1[i] = pts.x[i][0]; cols.x2[i] = pts.x[i][1]; cols.label[i] = pts.label?.[i] ?? 0; cols.role[i] = pts.splitRole?.[i] ?? -1; }
      col = (c) => cols[c] || null;
      roleNames = pts.splitRoleNames || [];
      role = cols.role;
    } else {
      const tab = await kit.loadTable(ctx, o.src ?? 'd0.f32', o.tableCols ?? null);
      col = tab.col;
      n = tab.n;
    }
    // rows: those passing `where`
    const where = rowTest(whereSpec, col);
    const keep = [];
    for (let r = 0; r < n; r++) if (!where || where(r)) keep.push(r);
    rowCol = Int32Array.from(keep);
    const m = keep.length;
    const cx = col(ax0.col), cy = col(ay0.col);
    if (!cx || !cy) throw new Error(`dk-scatter ${name}: no column ${!cx ? ax0.col : ay0.col}`);
    // display value of an axis: log10 on a log axis; `std: true` shows a JSON source's
    // inputs in the standardised units its network used ((raw − mean) / sd, both axes)
    const scl = o.std ? srcJSON?.scaling : null;
    if (o.std && !scl) console.warn(`dk-scatter ${name}: std asks for a scaling the source does not have`);
    const axisFns = (a, q) => {
      const st = scl ? [scl.mean[q], scl.sd[q]] : null;
      a.fwd = (r) => { const u = a.log ? Math.log10(r) : r; return st ? (u - st[0]) / st[1] : u; };
      a.inv = (u) => { const w = st ? st[0] + st[1] * u : u; return a.log ? Math.pow(10, w) : w; };
    };
    axisFns(ax0, 0); axisFns(ay0, 1);
    rawX = new Float32Array(m); rawY = new Float32Array(m); uX = new Float32Array(m); uY = new Float32Array(m); lab = new Uint8Array(m);
    const lt = typeof labelSpec === 'string' ? null : rowTest(labelSpec, col);
    const lc = typeof labelSpec === 'string' ? col(labelSpec) : null;
    const rl = role ? new Int8Array(m) : null;
    for (let k = 0; k < m; k++) {
      const r = keep[k];
      rawX[k] = cx[r]; rawY[k] = cy[r];
      uX[k] = ax0.fwd(cx[r]);
      uY[k] = ay0.fwd(cy[r]);
      lab[k] = lt ? (lt(r) ? 1 : 0) : lc ? (lc[r] > 0.5 ? 1 : 0) : 0;
      if (rl) rl[k] = role[r];
    }
    role = rl;
    // ranges: given, or the data's with a margin
    const span = (u) => { let a = Infinity, b = -Infinity; for (const v of u) if (Number.isFinite(v)) { if (v < a) a = v; if (v > b) b = v; } const p = 0.06 * (b - a || 1); return [a - p, b + p]; };
    ax = { ...ax0, range: ax0.range ?? span(uX) };
    ay = { ...ay0, range: ay0.range ?? span(uY) };
    // world size: given, or 22 × 12.5 (the D⁰ mass plot is 27.5 × 11)
    const size = o.size ?? [22, 12.5];
    W = Number(size[0]); H = Number(size[1]);
    xOf = (u) => -W / 2 + ((u - ax.range[0]) / (ax.range[1] - ax.range[0])) * W;
    yOf = (v) => ((v - ay.range[0]) / (ay.range[1] - ay.range[0])) * H;
    // the leak axis: a third column across the depth
    const dc = o.depth === false ? null : (o.depth && typeof o.depth === 'object' ? { ...(pre.depth || {}), ...o.depth } : pre.depth || null);
    if (dc && col(dc.col)) {
      depthCfg = { col: dc.col, range: dc.range, size: Number(dc.size ?? 9), ticks: dc.ticks ?? null, side: dc.side ?? 'right', reverse: !!dc.reverse, squeeze: Number(dc.squeeze ?? 1), crowd: dc.crowd };
      const c = col(dc.col);
      depthVal = new Float32Array(m);
      for (let k = 0; k < m; k++) depthVal[k] = c[keep[k]];
      depthCfg.range ??= span(depthVal);
    }
    // the score a {bend} draws, if a step asks for one
    if (usesStep(o, 'bend')) scoreFn = await loadScore();
    setupGrains();
    buildFrame();
    ready = true;
  }

  // raw (x, y) → a network's score or a grid's, minus the level: > 0 is the white side
  async function loadScore() {
    const sc = o.score ?? pre.score ?? (srcJSON?.scoreGrid ? { grid: 'scoreGrid' } : null);
    if (!sc) return null;
    const J = sc.file ? await kit.loadJSON(ctx, sc.file) : srcJSON;
    const level = Number(sc.level ?? 0.5);
    if (sc.net) {
      const N0 = J[sc.net];
      const net = N0.net, mu = N0.scaling.mean, sd = N0.scaling.sd;
      // inputs: [col, scale] → ln(col · scale), the course's log inputs (TAU in ns: scale 0.001)
      const ins = (sc.inputs || []).map(([c, s]) => ({ isX: c === ax.col, s: Number(s ?? 1) }));
      const nh = net.c.length, z = new Float64Array(ins.length);
      return (x, y) => {
        for (let q = 0; q < ins.length; q++) z[q] = (Math.log((ins[q].isX ? x : y) * ins[q].s) - mu[q]) / sd[q];
        let out = net.b;
        for (let h = 0; h < nh; h++) { let a = net.c[h]; for (let q = 0; q < ins.length; q++) a += net.V[h][q] * z[q]; out += net.w[h] * sig(a); }
        return sig(out) - level;
      };
    }
    const G = sc.grid ? J[sc.grid] : J.scoreGrid;
    const zz = sc.z ? String(sc.z).split('.').reduce((a, k) => a?.[k], J) : G.z;
    const [x0, x1, gnx] = G.x, [y0, y1, gny] = G.y;
    const sp = sc.space || ['lin', 'lin'];
    return (x, y) => {
      const gxv = sp[0] === 'log10' ? Math.log10(x) : x, gyv = sp[1] === 'log10' ? Math.log10(y) : y;
      const fx = ((gxv - x0) / (x1 - x0)) * (gnx - 1), fy = ((gyv - y0) / (y1 - y0)) * (gny - 1);
      if (!(fx >= 0 && fy >= 0 && fx <= gnx - 1 && fy <= gny - 1)) return NaN;
      const i = Math.min(gnx - 2, Math.floor(fx)), j = Math.min(gny - 2, Math.floor(fy)), a = fx - i, b = fy - j;
      const v = (1 - a) * (1 - b) * zz[j * gnx + i] + a * (1 - b) * zz[j * gnx + i + 1] + (1 - a) * b * zz[(j + 1) * gnx + i] + a * b * zz[(j + 1) * gnx + i + 1];
      return v - level;
    };
  }

  // per-grain alpha from the local density of the grains' places (px(i), py(i)) over a
  // w × h area: cells of `cell` world units, a 3×3 blur, a bilinear read.
  // A pixel under n overlapping grains shows c · a · n^(1/2.2) (the fragment's 2.2 power in
  // linear light), so (K0 / d)^(1/2.2) keeps a dense core near one whole grain's colour:
  // light blue stays light blue, white stays white (tuned on record 401 at dist 23, lab 4)
  function densityVis(px, py, w, h, crowd) {
    const cs = Number(o.cell ?? 0.12), gx = Math.max(2, Math.ceil(w / cs)), gy = Math.max(2, Math.ceil(h / cs));
    const cnt = new Float32Array(gx * gy);
    const cell = (i) => [Math.min(gx - 1e-3, Math.max(0, px(i) / cs)), Math.min(gy - 1e-3, Math.max(0, py(i) / cs))];
    for (let i = 0; i < N; i++) { const [x, y] = cell(i); cnt[Math.floor(y) * gx + Math.floor(x)]++; }
    const sm = new Float32Array(gx * gy);
    for (let y = 0; y < gy; y++) for (let x = 0; x < gx; x++) {
      let a = 0, wt = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= gx || yy >= gy) continue;
        const ww = dx || dy ? 0.6 : 1; a += ww * cnt[yy * gx + xx]; wt += ww;
      }
      sm[y * gx + x] = a / wt;
    }
    const K0 = crowd * (cs / 0.12) ** 2, gam = Number(o.gamma ?? 1 / 2.2), floor = Number(o.dimFloor ?? 0.06);
    const out = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      let [x, y] = cell(i); x = Math.max(0, x - 0.5); y = Math.max(0, y - 0.5);
      const i0 = Math.min(gx - 2, Math.floor(x)), j0 = Math.min(gy - 2, Math.floor(y)), a = Math.min(1, x - i0), b = Math.min(1, y - j0);
      const d = (1 - a) * (1 - b) * sm[j0 * gx + i0] + a * (1 - b) * sm[j0 * gx + i0 + 1] + (1 - a) * b * sm[(j0 + 1) * gx + i0] + a * b * sm[(j0 + 1) * gx + i0 + 1];
      out[i] = Math.max(floor, Math.min(1, Math.pow(K0 / Math.max(1e-3, d), gam)));
    }
    return out;
  }

  function setupGrains() {
    const m = rawX.length;
    const [x0, x1] = ax.range, [y0, y1] = ay.range;
    const cand = [];
    for (let k = 0; k < m; k++) {
      if (Number.isFinite(uX[k]) && Number.isFinite(uY[k]) && uX[k] >= x0 && uX[k] <= x1 && uY[k] >= y0 && uY[k] <= y1) cand.push(k);
    }
    const extras = K + 3000;
    const budget = Math.max(1000, Math.min((ctx.budget ?? 300000) - extras, Number(o.grains ?? Infinity)));
    // our grain (record 401's row 1) stays when thinning
    const oursRow = d0 && o.ours !== false ? (o.ours ?? OURS_ROW) : null;
    const oursK = oursRow == null ? -1 : rowCol.indexOf(oursRow);
    const rank = seriesOrder(m, seed, oursK >= 0 ? oursK : null);
    const unit = Math.max(1, Math.ceil(cand.length / budget));
    const rows = unit > 1 ? cand.filter((k) => rank[k] % unit === 0 || k === oursK) : cand;
    N = rows.length;
    rowOf = Int32Array.from(rows);
    grainOf = new Int32Array(m).fill(-1);
    for (let i = 0; i < N; i++) grainOf[rowOf[i]] = i;
    oursG = oursK >= 0 ? grainOf[oursK] : -1;
    // fill order: the series order reversed (ours first, as dk-hist fills)
    fillRank = new Int32Array(N);
    const ord = Int32Array.from({ length: N }, (_, i) => i).sort((a, b) => rank[rowOf[b]] - rank[rowOf[a]]);
    for (let q = 0; q < N; q++) fillRank[ord[q]] = q;
    const rnd = mulberry32(seed * 131 + 5);
    jz = new Float32Array(N);
    for (let i = 0; i < N; i++) jz[i] = (rnd() - 0.5) * Number(o.thick ?? 0.16);
    // brightness by local density: a lone grain whole, a dense core dimmer per grain, so
    // the crowd stays light blue and a white class stays white (fixed size, varying alpha).
    // The front view counts over (x, y); the leak's side view over (mass, y), because seen
    // from the side every grain of a mass band stands in one column
    baseVis = densityVis((i) => xOf(uX[rowOf[i]]) + W / 2, (i) => yOf(uY[rowOf[i]]), W, H, Number(o.crowd ?? 8));
    if (depthCfg) {
      const D = depthCfg.size;
      sideVis = densityVis((i) => zOf(depthVal[rowOf[i]]) + D / 2, (i) => yOf(uY[rowOf[i]]), D, H, Number(depthCfg.crowd ?? o.crowd ?? 8));
    }
    morph = createMorph(stage, N, { crowd: P.crowd, sel: P.sel, seed, uniforms: { uPixelRatio: frameScale } });
    morph.u.uAlpha.value = Number(o.alpha ?? (N < 3000 ? 1.25 : 1.05));
    // a sparse set: white no brighter than light blue (the bloom would make the white class
    // read as larger grains); a dense one keeps the engine's 1.3 so white holds in a crowd
    // the rare set's 100 white stand whole (whiteVis); 1.15 keeps them white without a
    // bloom halo (1.8, and 1.3 with whiteVis 1.5, bloomed into a grey disc: lab 4 slide 11)
    morph.u.uSelGain.value = Number(o.selGain ?? (o.rare ? 1.15 : N < 3000 ? 1.0 : 0.85));
    if (oursG >= 0) { morph.Z[oursG] = OURS / GRAIN; morph.sizes(); }
    plot.add(morph.points);
    counted = new Uint8Array(N);
  }

  // ---- the frame: two axes of dim grains, tick numbers, at most one caption ----------
  function addLabel(l, list) { l.userData.x0 = l.position.x; labG.add(l); labels.push(l); list.push(l); }
  function buildFrame() {
    const share = morph.u;
    const nA = Math.round(Math.min(1400, Math.max(300, W / 0.03))), nB = Math.round(Math.min(1000, Math.max(200, H / 0.03)));
    const axis = staticGrains(stage, nA + nB, { color: P.axis, alpha: 0.9, size: GRAIN, share });
    const y0 = -0.015 * H, x0 = -W / 2 - 0.015 * W;
    for (let i = 0; i < nA; i++) axis.pos.set([x0 + (W * 1.03 * i) / (nA - 1), y0, 0], i * 3);
    for (let i = 0; i < nB; i++) axis.pos.set([x0, y0 + (H * 1.02 * i) / (nB - 1), 0], (nA + i) * 3);
    axis.touch(); plot.add(axis.points);
    // ticks: numbers in display units, or [value, 'text'] pairs; `raw: true` on a log
    // axis takes the values in the column's own units (0.2, 1, 5 ps → log10)
    const tickList = (a) => {
      const tv = Array.isArray(a.ticks) ? a.ticks : niceTicks(a.range[0], a.range[1], 5);
      return tv.map((t) => {
        const [v, text] = Array.isArray(t) ? t : [t, null];
        const u = a.raw ? a.fwd(v) : v;
        return { u, text: text != null ? String(text) : fmt(v, decs(v)) };
      }).filter((t) => t.u >= a.range[0] - 1e-9 && t.u <= a.range[1] + 1e-9);
    };
    const noAxes = o.axes === false;   // the rare set's abstract inputs: no axes at all
    const tx = noAxes ? [] : tickList(ax), ty = noAxes ? [] : tickList(ay), TM = 12;
    const marks = staticGrains(stage, Math.max(1, (tx.length + ty.length) * TM), { color: P.axis, alpha: 0.9, size: GRAIN, share });
    let q = 0;
    const px = o.tickPx ?? LABEL.px;
    for (const t of tx) {
      for (let j = 0; j < TM; j++) marks.pos.set([xOf(t.u), y0 - (0.025 * H * j) / (TM - 1), 0], 3 * q++);
      const l = fixedLabel(stage, t.text, { px, color: P.tick, align: 'center', hang: 0.5 });
      l.position.set(xOf(t.u), y0 - 0.04 * H, 0); addLabel(l, axisLabels);
    }
    for (const t of ty) {
      for (let j = 0; j < TM; j++) marks.pos.set([x0 - (0.025 * H * j) / (TM - 1), yOf(t.u), 0], 3 * q++);
      const l = fixedLabel(stage, t.text, { px, color: P.tick, align: 'right', hang: 0 });
      l.position.set(x0 - 0.04 * H, yOf(t.u), 0); addLabel(l, axisLabels);
    }
    marks.touch(); plot.add(marks.points);
    // the one caption (bible §3: at most one, five words or fewer); `wordY` exists for a
    // slide that must name the other axis instead
    if (o.word) {
      const l = fixedLabel(stage, o.word, { px: LABEL.captionPx, color: P.name, align: 'right', hang: 1.75 });
      l.position.set(W / 2 + 0.015 * W, y0 - 0.04 * H, 0); addLabel(l, axisLabels);
    }
    if (o.wordY) {
      const l = fixedLabel(stage, o.wordY, { px: LABEL.captionPx, color: P.name, align: 'left', hang: -0.9 });
      l.position.set(x0, H * 1.02, 0); addLabel(l, axisLabels);
    }
    // the boundary: a chain of fine white grains
    bnd = staticGrains(stage, K, { color: P.sel, alpha: lineAlpha, size: GRAIN * 0.8, share });
    plot.add(bnd.points);
    // the leak axis: a dim line into the depth along the bottom left edge, ticks on it
    let dax = null;
    if (depthCfg) {
      const D = depthCfg.size, nD = Math.round(Math.max(150, D / 0.03));
      dax = staticGrains(stage, nD, { color: P.axis, alpha: 0.9, size: GRAIN, share });
      // on the side the camera sees it from (`side`: 'right' or 'left' edge of the plot)
      const xd = depthCfg.side === 'left' ? x0 : W / 2 + 0.015 * W;
      for (let i = 0; i < nD; i++) dax.pos.set([xd, y0, -D / 2 + (D * i) / (nD - 1)], 3 * i);
      dax.touch(); plot.add(dax.points);
      for (const v of depthCfg.ticks || []) {
        const [val, text] = Array.isArray(v) ? v : [v, fmt(v, decs(v))];
        const l = fixedLabel(stage, String(text), { px, color: P.tick, align: depthCfg.side === 'left' ? 'right' : 'left', hang: 0.5 });
        l.position.set(xd + (depthCfg.side === 'left' ? -1 : 1) * 0.015 * W, y0, zOf(val)); addLabel(l, depthLabels);
      }
    }
    frame = { axis, marks, dax, show: 0 };
  }
  const decs = (v) => (Number.isInteger(v) ? 0 : Math.min(3, String(v).split('.')[1]?.length ?? 1));
  // the mass runs right as the camera sees it from the plot's right side (yaw > 0, the
  // series' convention: mass to the right); `reverse` for a camera on the left
  const zOf = (val) => { const [a, b] = depthCfg.range, D = depthCfg.size, f = clamp01((val - a) / (b - a)); return depthCfg.reverse ? -D / 2 + f * D : D / 2 - f * D; };

  // ---- boundaries: a state's "kept" function over raw (x, y) ------------------------
  // box: [[x0, x1], [y0, y1]] in display units (log10 on a log axis; null = open)
  // line: [w1, w2, b] on raw values, or the name of a { w, b } in the source
  //       (perceptron: 'line', 'split', 'bayes', 'after1'; ring: 'line'; rare: 'cut'),
  //       or epoch: k from the source's per-epoch log
  // bend: the score (a network or a grid) − level
  function lineParams(s, e = null) {
    if (s.epoch != null || e != null) {
      const ep = srcJSON?.epochs;
      if (!ep) return null;
      const x = Math.max(0, Math.min(ep.length - 1, e ?? Number(s.epoch)));
      const i = Math.floor(x), j = Math.min(ep.length - 1, i + 1), a = x - i;
      const L = (k) => ep[i][k] + a * (ep[j][k] - ep[i][k]);
      return { w: [L(2), L(3)], b: L(4), loss: L(0), acc: L(1), epoch: x };
    }
    const l = s.line;
    if (Array.isArray(l)) return { w: [l[0], l[1]], b: l[2] };
    if (typeof l === 'string' && srcJSON?.[l]) {
      const d = srcJSON[l];
      return { w: d.w, b: d.b, loss: d.loss, scaling: d.scaling ?? (srcJSON.scaling && l === 'line' ? srcJSON.scaling : null) };
    }
    return null;
  }
  function keptFn(s, e = null) {
    if (!s) return null;
    if (s.bend && scoreFn) return scoreFn;
    const lp = s.epoch != null || s.line != null ? lineParams(s, e) : null;
    if (lp) {
      const [w1, w2] = lp.w, b = lp.b, sc = lp.scaling;
      if (!(Math.abs(w1) + Math.abs(w2) > 1e-9)) return null;
      if (sc) { const [m1, m2] = sc.mean, [s1, s2] = sc.sd; return (x, y) => (w1 * (x - m1)) / s1 + (w2 * (y - m2)) / s2 + b; }
      return (x, y) => w1 * x + w2 * y + b;
    }
    if (s.box) {
      const [a0, a1] = s.box[0] || [], [b0, b1] = s.box[1] || [];
      const sx = ax.range[1] - ax.range[0], sy = ay.range[1] - ay.range[0];
      const ux = ax.fwd, uy = ay.fwd;
      return (x, y) => {
        const u = ux(x), v = uy(y);
        let f = Infinity;
        if (a0 != null) f = Math.min(f, (u - a0) / sx);
        if (a1 != null) f = Math.min(f, (a1 - u) / sx);
        if (b0 != null) f = Math.min(f, (v - b0) / sy);
        if (b1 != null) f = Math.min(f, (b1 - v) / sy);
        return f === Infinity ? 1 : f;
      };
    }
    return null;
  }
  // plot coordinates → raw values (for contouring over the plot)
  const rawOfX = (x) => ax.inv(ax.range[0] + ((x + W / 2) / W) * (ax.range[1] - ax.range[0]));
  const rawOfY = (y) => ay.inv(ay.range[0] + (y / H) * (ay.range[1] - ay.range[0]));
  function boundaryPoints(f) {
    if (!f) return null;
    const nx = Math.round(o.contourRes ?? 180), ny = Math.max(20, Math.round((nx * H) / W));
    const lines = contour((x, y) => f(rawOfX(x), rawOfY(y)), W, H, nx, ny);
    return resample(lines, K, 0.03 * Math.min(W, H));
  }

  // ---- layout: where every grain stands in state s ---------------------------------
  const roleIndex = (r) => { const k = roleNames.indexOf(String(r)); return k >= 0 ? k : Number(r); };
  function visibleRow(s, k) {
    if (!s) return false;
    const sh = s.show ?? 'all';
    if (sh !== 'all' && role) { const ok = Array.isArray(sh) ? sh.map(roleIndex) : [roleIndex(sh)]; if (!ok.includes(role[k])) return false; }
    return true;
  }
  const depthOf = (s) => (depthCfg && s && !s.undo && Number(s.depth === true ? 1 : s.depth ?? 0) > 0 ? Math.min(1, Number(s.depth === true ? 1 : s.depth)) : 0);
  function layout(s) {
    const pos = new Float32Array(N * 3), vis = new Float32Array(N), white = new Float32Array(N), cnt = new Uint8Array(N);
    const out = { pos, vis, white, counted: cnt };
    for (let i = 0; i < N; i++) { const k = rowOf[i]; pos[3 * i] = xOf(uX[k]); pos[3 * i + 1] = yOf(uY[k]); pos[3 * i + 2] = jz[i]; }
    if (!s) return out;
    const nShow = s.n == null || s.n === 'all' ? N : Math.min(N, Math.round(Number(s.n)));
    const f = keptFn(s);
    const colour = s.color ?? 'none';
    const dOpen = depthOf(s);
    const litDim = Number(s.litDim ?? o.litDim ?? (o.rare ? 0.55 : 0.35));
    // `dim: 'train'` (a role or a list): those rows step back, so the rows that arrive
    // next (the held-out test points) are the only bright ones
    const dimRoles = s.dim != null && role ? (Array.isArray(s.dim) ? s.dim : [s.dim]).map(roleIndex) : null;
    const dimBy = Number(s.dimBy ?? o.roleDim ?? 0.2);
    const whiteVis = o.whiteVis != null ? Number(o.whiteVis) : o.rare ? 1.25 : null;
    for (let i = 0; i < N; i++) {
      const k = rowOf[i];
      if (fillRank[i] >= nShow || !visibleRow(s, k)) continue;
      cnt[i] = 1;
      const kept = f ? f(rawX[k], rawY[k]) > 0 : true;
      let v = dOpen && sideVis ? baseVis[i] + dOpen * (sideVis[i] - baseVis[i]) : baseVis[i];
      if (s.lit && f && !kept) v *= litDim;
      if (dimRoles && dimRoles.includes(role[k])) v *= dimBy;
      vis[i] = v;
      white[i] = colour === 'truth' ? lab[k] : colour === 'kept' ? (kept ? 1 : 0) : colour === 'sel' ? 1 : 0;
      if (oursG === i && o.oursTone === 'crowd') white[i] = 0;
      // `whiteVis`: a few white grains among many (the rare set's 100) stand whole, not
      // thinned by the crowd's density around them (× whiteVis; above 1 they bloom)
      if (white[i] && whiteVis != null) vis[i] = Math.max(vis[i], 1) * whiteVis;
      // open, the plane's thickness goes, so a band's edge in mass stays sharp from the side
      if (dOpen) pos[3 * i + 2] = (1 - dOpen) * jz[i] + dOpen * zOf(depthVal[k]);
    }
    return out;
  }

  // the numbers a state shows, over every row in it, drawn or not (rows outside the
  // range still count). Cached per state; recomputed per frame while the line sweeps.
  function tally(s, f, roleOnly = null) {
    const m = rawX.length;
    const r = { rows: 0, kept: 0, right: 0, sig: 0, sigKept: 0, bkgKept: 0 };
    if (!s) return r;
    const nShow = s.n == null || s.n === 'all' ? Infinity : Number(s.n);
    for (let k = 0; k < m; k++) {
      const i = grainOf[k];
      if (i >= 0 ? fillRank[i] >= nShow : nShow !== Infinity) continue;
      if (roleOnly != null) { if (!role || role[k] !== roleIndex(roleOnly)) continue; }
      else if (!visibleRow(s, k)) continue;
      r.rows++;
      const kept = f ? f(rawX[k], rawY[k]) > 0 : false;
      if (kept) r.kept++;
      if (lab[k]) { r.sig++; if (kept) r.sigKept++; } else if (kept) r.bkgKept++;
      if (f && kept === !!lab[k]) r.right++;
    }
    return r;
  }

  // ---- a transition -----------------------------------------------------------------
  const v3 = new Vector3();
  function transition(k, kind) {
    const s = stateAt(steps, k);
    // a {tip} waits until its hist stands and lets go (the hist fills its own state first on
    // a fresh arrival, then tips): the histogram is seen before it pours (lab 4 slide 6)
    if (s?.tip && kind !== 'back' && kind !== 'hide' && (!shown || kind === 'arrive' || !shown.tip)) {
      const h = kit.form(String(s.tip));
      const t0 = tipWait && tipWait.k === k ? tipWait.t0 : now;
      if (h?.api?.tipReady && !h.api.tipReady() && now - t0 < 15) { tipWait = { k, kind, t0 }; return; }
    }
    tipWait = null;
    const prev = shown;
    const L = layout(s);
    const instant = kind === 'back' || kind === 'hide';
    const t = now;
    const fresh = !prev || kind === 'arrive';
    const prevCounted = counted, newCounted = L.counted;
    const depthMoved = !!(prev && s && depthOf(prev) !== depthOf(s));
    const opening = depthMoved && depthOf(s) > depthOf(prev);
    // where tipping grains come from: a dk-hist's grains now, or its layout
    const tipFrom = s?.tip && !instant && (fresh || !prev?.tip) ? tipSource(String(s.tip)) : null;
    const plan = (m) => {
      const { A, B, C, V, T, M, S } = m, Wh = m.W;
      const arrivals = [];
      for (let i = 0; i < N; i++) if (!prevCounted[i] && newCounted[i]) arrivals.push(i);
      arrivals.sort((a, b) => fillRank[a] - fillRank[b]);
      const nA = arrivals.length;
      const fd = Number(s?.fill ?? o.fill ?? Math.min(4, Math.max(1.2, 0.8 + 0.9 * Math.log10(Math.max(10, nA) / 10))));
      const lead = Number(s?.lead ?? o.lead ?? 0.3);
      const arrT = new Float64Array(nA);
      const R = Math.max(W, H);
      for (let a = 0; a < nA; a++) {
        const i = arrivals[a], i3 = 3 * i, i2 = 2 * i, r = S[i];
        if (instant) { A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1]; A[i3 + 2] = B[i3 + 2]; T[i2 + 1] = 0.35; arrT[a] = t; continue; }
        const tp = tipFrom && tipFrom.get(rowOf[i]);
        if (tp) {
          // tip over: from its place in the histogram, a sweep left to right, bowed toward us
          A[i3] = tp[0]; A[i3 + 1] = tp[1]; A[i3 + 2] = tp[2]; V[i2] = tp[3]; Wh[i2] = tp[4];
          C[i3 + 2] = 0.12 * R * (0.6 + 0.8 * r); C[i3 + 1] = 0.04 * R * (r - 0.5);
          M[i] = MOTION.GLIDE; T[i2] = lead + 1.1 * clamp01((tp[0] + W / 2) / W) + 0.25 * r; T[i2 + 1] = 1.9;
        } else if (fresh || s?.gather) {
          // gather out of a wide seeded cloud, faded in on the way
          A[i3] = B[i3] + 0.9 * R * (S[(i + 3) % N] - 0.5); A[i3 + 1] = B[i3 + 1] + 0.7 * R * (S[(i + 7) % N] - 0.5); A[i3 + 2] = B[i3 + 2] + 0.5 * R * (S[(i + 11) % N] - 0.5);
          M[i] = MOTION.GLIDE; T[i2] = lead + Math.pow(a / Math.max(1, nA - 1), 1.3) * fd; T[i2 + 1] = 1.5;
        } else {
          // later arrivals (held-out test points): a short drop onto their place
          A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1] + 0.1 * H * (0.6 + r); A[i3 + 2] = B[i3 + 2];
          M[i] = MOTION.DROP; T[i2] = 0.2 + (a / Math.max(1, nA - 1)) * Math.min(1.6, fd); T[i2 + 1] = 0.55;
        }
        arrT[a] = t + T[i2] + T[i2 + 1];
      }
      const lt = [];
      for (let i = 0; i < N; i++) {
        const i2 = 2 * i, i3 = 3 * i, r = S[i];
        if (prevCounted[i] && !newCounted[i]) {
          lt.push(i);
          B[i3] = A[i3]; B[i3 + 1] = A[i3 + 1]; B[i3 + 2] = A[i3 + 2];
          M[i] = MOTION.GLIDE; T[i2] = instant ? 0 : 0.2 * r; T[i2 + 1] = instant ? 0.35 : 0.5;
        } else if (prevCounted[i] && newCounted[i]) {
          const moved = Math.abs(A[i3] - B[i3]) + Math.abs(A[i3 + 1] - B[i3 + 1]) + Math.abs(A[i3 + 2] - B[i3 + 2]) > 1e-4;
          const recolour = Math.abs(Wh[i2] - Wh[i2 + 1]) > 1e-3 || Math.abs(V[i2] - V[i2 + 1]) > 1e-3;
          if (!moved && !recolour) continue;
          M[i] = MOTION.GLIDE;
          if (instant) { T[i2] = 0; T[i2 + 1] = 0.35; }
          else if (depthMoved) {
            // the leak: the clouds snap apart along the mass, fast; the undo glides back
            T[i2] = opening ? 0.12 * r : 0.25 * r; T[i2 + 1] = opening ? 0.55 : 1.1;
          } else if (!moved) { T[i2] = 0.6 * clamp01((A[i3] + W / 2) / W); T[i2 + 1] = 0.8; }   // a sweep of colour, left to right
          else { T[i2] = 0.3 * r; T[i2 + 1] = 1.2; }
        }
      }
      // a step's `after` (s): everything it moves waits that long (lab 4 slide 10: the depth
      // closes once the camera has turned off edge-on, not while the plane is seen side on)
      const lag = instant ? 0 : Math.max(0, Number(s?.after ?? 0));
      if (lag) { for (let i = 0; i < N; i++) T[2 * i] += lag; for (let a = 0; a < nA; a++) arrT[a] += lag; }
      const lv = new Float64Array(lt.length);
      lt.forEach((i, q) => { lv[q] = t + T[2 * i] + 0.6 * T[2 * i + 1]; });
      arrT.sort(); lv.sort();
      arrTimes = arrT; leaveTimes = lv;
    };
    let base = 0;
    for (let i = 0; i < N; i++) if (prevCounted[i] && newCounted[i]) base++;
    baseCount = base;
    morph.go(t, L, plan);
    counted = newCounted; playedAt = t;
    setBoundary(s, prev, instant, fresh);
    depthNext = depthOf(s) > 0 ? 1 : 0;
    depthAt = now + (instant ? 0 : Math.max(0, Number(s?.after ?? 0)));
    if (depthAt <= now) depthWant = depthNext;
    shown = s; cur = s ? k : 0;
    version++; readCache = null;
  }

  // a dk-hist's grains, kept row k → [x, y, z, vis, white] in this plot's frame
  function tipSource(histName) {
    const h = kit.form(histName);
    if (!h?.api) return null;
    plot.updateWorldMatrix(true, false);
    const map = new Map();
    const byTableRow = new Map();
    for (let i = 0; i < N; i++) byTableRow.set(rowCol[rowOf[i]], rowOf[i]);
    // the tipped grains start as bright as the hist drew them (its alpha against ours), not
    // at the scatter's full alpha: they stepped up in one frame as the pour began (lab 4 slide 6)
    const va = (g) => Math.max(0.05, Math.min(1, Number(g?.alpha ?? morph.u.uAlpha.value) / Math.max(1e-3, morph.u.uAlpha.value)));
    const gr = h.api.grains?.();
    if (gr && gr.rows.length) {
      for (let q = 0; q < gr.rows.length; q++) {
        const k = byTableRow.get(gr.rows[q]);
        if (k == null) continue;
        v3.set(gr.pos[3 * q], gr.pos[3 * q + 1], gr.pos[3 * q + 2]);
        plot.worldToLocal(v3);
        map.set(k, [v3.x, v3.y, v3.z, va(gr), gr.white[q]]);
      }
      if (map.size > 0.5 * N) return map;
    }
    // the hist has let its grains go: where they stood in its last shown state (its
    // whitening and jitter kept), when the hist offers it
    const last = h.api.grains?.({ last: true });
    if (last && last.rows.length) {
      map.clear();
      for (let q = 0; q < last.rows.length; q++) {
        const k = byTableRow.get(last.rows[q]);
        if (k == null) continue;
        v3.set(last.pos[3 * q], last.pos[3 * q + 1], last.pos[3 * q + 2]);
        plot.worldToLocal(v3);
        map.set(k, [v3.x, v3.y, v3.z, va(last), last.white[q]]);
      }
      if (map.size > 0.5 * N) return map;
    }
    // the hist has already let its grains go (a slide opened on the tip step): stand each
    // row where it would be in the histogram's frame, stacked in its bin
    const fr = h.api.frame?.();
    const M = depthCfg?.col === 'M' ? depthVal : null;
    if (!fr || !M) return map.size ? map : null;
    const stack = new Int32Array(fr.bins);
    const ordr = Int32Array.from({ length: N }, (_, i) => i).sort((a, b) => fillRank[a] - fillRank[b]);
    fr.group.updateWorldMatrix(true, false);
    for (const i of ordr) {
      const k = rowOf[i];
      if (map.has(k)) continue;
      const b = Math.floor((M[k] - fr.lo) / fr.bin);
      if (!(b >= 0 && b < fr.bins)) continue;
      const y = fr.y((stack[b]++ + 0.5) * fr.unit);
      v3.set(fr.x(fr.lo + (b + 0.12 + 0.76 * morph.S[i]) * fr.bin), y, 0).applyMatrix4(fr.group.matrixWorld);
      plot.worldToLocal(v3);
      map.set(k, [v3.x, v3.y, v3.z, 1, 0]);
    }
    return map;
  }

  // ---- the boundary's grains ----------------------------------------------------------
  const flip = (p) => { if (!p) return p; const q = new Float32Array(p.length); for (let i = 0; i < K; i++) { q[2 * i] = p[2 * (K - 1 - i)]; q[2 * i + 1] = p[2 * (K - 1 - i) + 1]; } return q; };
  function setBoundary(s, prev, instant, fresh) {
    // a boundary still dissolving is not glided from: the next one draws on fresh
    const was = bShow > 0.01 && bCur && bShowTo > 0 ? Float32Array.from(bCur) : null;
    if (!was && bDust) { bCur = null; bShow = 0; }
    sweep = null;
    if (s && s.epoch != null && s.sweep && !instant) {
      const e0 = prev?.epoch != null && !fresh ? epochNow : Number(s.from ?? 0);
      sweep = { e0, e1: Number(s.epoch), t0: now, dur: Number(s.sweep) };
      bTarget = () => boundaryPoints(keptFn(s, sweepEpoch()));
    } else {
      const tgt = s && s.boundary !== false ? boundaryPoints(keptFn(s, s?.epoch != null ? Number(s.epoch) : null)) : null;
      bTarget = () => tgt;
      if (s?.epoch != null) epochNow = Number(s.epoch);
    }
    const first = bTarget();
    if (was && first) {
      // keep the grains in order: run the new chain the way round that is nearer
      const d = (p, i, q, j) => Math.hypot(p[2 * i] - q[2 * j], p[2 * i + 1] - q[2 * j + 1]);
      const fwd = d(was, 0, first, 0) + d(was, K - 1, first, K - 1), rev = d(was, 0, first, K - 1) + d(was, K - 1, first, 0);
      if (rev < fwd) { const inner = bTarget; bTarget = () => flip(inner()); }
    }
    bFrom = was;
    bT0 = now; bDur = instant ? 0.35 : Number(s?.bendTime ?? (s?.bend && !prev?.bend ? 1.8 : 1.2));
    bShowFrom = was ? bShow : 0; bShowTo = first || sweep ? 1 : 0;
    if (!was) bShow = 0;
    // `{box: null}` (any boundary that goes with none after it): the edge breaks into dust
    // where it stands, rising and spreading as it fades (1.6 s). `dust: false` fades it
    bDust = !instant && !!was && !bShowTo && o.dust !== false && s?.dust !== false;
    if (bDust) bDur = 1.6;
    // a boundary with none before it draws on along its length instead of fading in whole
    // (`{epoch: 1}` after the cut has gone: no glide from the cut). `draw: false` fades it in
    bDraw = !instant && !was && !!bShowTo && o.draw !== false && s?.draw !== false;
    // `{undo}` with a boundary: it comes once the mass axis has closed, not in the plane
    // while the cloud still stands apart in depth
    if (!instant && prev && depthOf(prev) > 0 && depthOf(s) === 0 && bShowTo) bT0 = Math.max(bT0, now + Math.max(0, Number(s?.after ?? 0)) + 1.0);
    // on a fresh arrival the line comes in once half the cloud has gathered, not whole over
    // an empty frame (lab 4 slide 4); a step's `after` holds it too
    if (!instant && !sweep && !was && fresh && arrTimes.length) bT0 = Math.max(bT0, arrTimes[arrTimes.length >> 1] - 0.4 * bDur);
    if (!instant && s?.after) bT0 += Math.max(0, Number(s.after));
  }
  function sweepEpoch() {
    if (!sweep) return epochNow;
    const u = ease((now - sweep.t0) / sweep.dur);
    const a = Math.log(sweep.e0 + 1), b = Math.log(sweep.e1 + 1);
    return Math.exp(a + (b - a) * u) - 1;
  }
  function drawBoundary(t) {
    if (sweep) {
      epochNow = sweepEpoch(); version++;
      if (t >= sweep.t0 + sweep.dur) { epochNow = sweep.e1; const inner = bTarget; sweep = null; const fin = inner(); bTarget = () => fin; }
    }
    const to = bTarget();
    const e = ease((t - bT0) / bDur);
    const k = Math.max(0, Math.min(1, (t - bT0) / bDur));
    bShow = bDust ? bShowFrom * Math.pow(1 - k, 1.5) : bDraw ? (t >= bT0 ? Math.min(1, (t - bT0) / 0.15) : 0) : bShowFrom + (bShowTo - bShowFrom) * e;
    if (to) {
      const from = bFrom || to;   // appearing: it fades in where it stands (and follows a sweep)
      bCur ??= new Float32Array(2 * K);
      for (let q = 0; q < 2 * K; q++) bCur[q] = from[q] + (to[q] - from[q]) * e;
    }
    // drawing on: the first share of the chain stands, its front runs along the line
    bnd.count(bDraw && k < 1 ? Math.ceil(K * (1 - Math.pow(1 - k, 2))) : K);
    if (bDraw && k >= 1) bDraw = false;
    if (bCur && bShow > 0.001) {
      let L = 0;
      if (bDust && !dustOff) {
        // seeded per grain: a spread across the line, a rise, a drift out of the plane
        const rr = mulberry32((Number(seed) || 401) * 13 + 5), R = 0.05 * Math.min(W, H);
        dustOff = new Float32Array(3 * K);
        for (let q = 0; q < K; q++) { const u = rr(); dustOff[3 * q] = (rr() - 0.5) * 2 * R; dustOff[3 * q + 1] = R * (0.4 + 1.2 * u); dustOff[3 * q + 2] = (rr() - 0.5) * 2 * R; }
      }
      const d = bDust ? 1 - (1 - k) * (1 - k) : 0;
      for (let q = 0; q < K; q++) {
        bnd.pos[3 * q] = bCur[2 * q] + (bDust ? d * dustOff[3 * q] : 0);
        bnd.pos[3 * q + 1] = bCur[2 * q + 1] + (bDust ? d * dustOff[3 * q + 1] : 0);
        bnd.pos[3 * q + 2] = 0.02 + (bDust ? d * dustOff[3 * q + 2] : 0);
        if (q) L += Math.min(0.3, Math.hypot(bCur[2 * q] - bCur[2 * q - 2], bCur[2 * q + 1] - bCur[2 * q - 1]));
      }
      bnd.touch();
      // K grains along a line of length L overlap (grain width / spacing) deep: set each
      // grain's alpha so the chain reads as one grain's white, not a blooming bar
      const overlap = Math.max(1, (0.8 * GRAIN * 0.0746 * 0.6) / Math.max(1e-4, L / K));
      bnd.u.uAlpha.value = lineAlpha * Math.min(1, Math.pow(1 / overlap, 1 / 2.2));
    }
    if (bShow <= 0.001 && bShowTo === 0 && (!bDust || k >= 1)) { bCur = null; bDust = false; }
    // no boundary in the plane while the mass axis stands open (seen from the side it is a line through the bands)
    bnd.u.uShow.value = bShow * frame.show * far * (1 - depthShow);
  }

  // ---- stepping, arrival ----------------------------------------------------------------
  const request = (k) => {
    want = k;
    if (!ready || armed) return;
    transition(k, k < cur ? (k === 0 ? 'hide' : 'back') : 'fwd');
  };
  const hideNow = () => {
    if (!ready) return;
    const L = layout(null);
    morph.jump(now, L);
    counted = L.counted; shown = null; cur = 0;
    arrTimes = new Float64Array(0); leaveTimes = new Float64Array(0); baseCount = 0;
    sweep = null; bTarget = () => null; bShow = 0; bShowFrom = 0; bShowTo = 0; bCur = null; bFrom = null; bDust = false; bDraw = false;
    depthWant = 0; depthNext = 0; depthAt = -1; tipWait = null; version++; readCache = null;
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

  // ---- readouts -----------------------------------------------------------------------
  const upper = (arr, x) => { let a = 0, b = arr.length; while (a < b) { const m = (a + b) >> 1; if (arr[m] <= x) a = m + 1; else b = m; } return a; };
  const landed = () => baseCount + upper(arrTimes, now) + (leaveTimes.length - upper(leaveTimes, now));
  function tallyNow(roleOnly) {
    const key = `${version}:${roleOnly ?? ''}`;
    if (readCache?.key === key) return readCache.r;
    const s = shown;
    const f = s ? keptFn(s, s.epoch != null ? epochNow : null) : null;
    const r = tally(s, f, roleOnly);
    readCache = { key, r };
    return r;
  }
  // 'count' (grains landed), 'rows', 'kept', 'right', 'wrong', 'accuracy' (%), 'signal',
  // 'signalKept', 'bkgKept', 'precision' (%), 'w1', 'w2', 'b', 'loss', 'epoch';
  // 'right:test', 'accuracy:train' … count one role of the source's split only.
  function read(spec = o.readout ?? 'count') {
    if (!ready) return null;
    const [key, rl] = String(spec).split(':');
    if (key === 'count') {
      // grains landed, scaled to the state's rows (rows outside the range or thinned out
      // by the budget count too: a landed plot shows every row it stands for)
      const drawn = counted.reduce((a, b) => a + b, 0), r = tallyNow(null).rows;
      return drawn ? Math.round((landed() * r) / drawn) : 0;
    }
    if (['w1', 'w2', 'b', 'loss', 'epoch'].includes(key)) {
      const s = shown;
      if (!s) return null;
      const lp = s.epoch != null ? lineParams(s, epochNow) : lineParams(s);
      if (!lp) return null;
      return key === 'w1' ? lp.w[0] : key === 'w2' ? lp.w[1] : key === 'b' ? lp.b : key === 'loss' ? lp.loss : lp.epoch;
    }
    const r = tallyNow(rl ?? null);
    switch (key) {
      case 'rows': return r.rows;
      case 'kept': return r.kept;
      case 'right': return r.right;
      case 'wrong': return r.rows - r.right;
      case 'accuracy': return r.rows ? (100 * r.right) / r.rows : null;
      case 'signal': return r.sig;
      case 'signalKept': return r.sigKept;
      case 'bkgKept': return r.bkgKept;
      case 'precision': return r.kept ? (100 * r.sigKept) / r.kept : null;
      default: return null;
    }
  }

  const api = {
    arm() { armed = true; armT = now; hideNow(); },
    assemble(t, onDone) { now = t; arrive(); onDone?.(); },
    busy: () => (!ready && !failed && want > 0) || armed || pendingArrive
      || (!!morph && now < morph.end + 0.3)
      || !!sweep || now < bT0 + bDur + 0.1
      || Math.abs(depthShow - depthWant) > 0.01 || depthWant !== depthNext || !!tipWait
      || (!!frame && Math.abs(frame.show - (shown ? 1 : 0)) > 0.01),
    value: () => read(),
    read,
    values: () => ({ count: read('count'), landed: landed(), grains: N, rows: rawX?.length ?? 0, step: cur, epoch: epochNow }),
    ready: () => ready,
    frame: () => ready && { width: W, height: H, x: xOf, y: yOf, xRange: ax.range, yRange: ay.range, group: plot },
    // where a row's grain is now (world), or null; row = the source's row (d0: file order)
    pointOf(row, out = new Vector3()) {
      if (!ready) return null;
      const k = rowCol.indexOf(row);
      const i = k >= 0 ? grainOf[k] : -1;
      if (i < 0) return null;
      const c = morph.sample(i, now, [0, 0, 0, 0, 0]);
      if (c[3] < 0.01) return null;
      plot.updateWorldMatrix(true, false);
      return out.set(c[0], c[1], c[2]).applyMatrix4(plot.matrixWorld);
    },
    ours(out) { return oursG >= 0 ? api.pointOf(rowCol[rowOf[oursG]], out) : null; },
  };

  load().then(() => { if (pendingArrive) arrive(); else if (want > 0 && !armed) transition(want, 'arrive'); })
    .catch((e) => { failed = true; pendingArrive = false; console.warn(`dk-scatter ${name}: data failed`, e); });
  if (name) kit.register(name, { type: TYPE, api });

  return {
    group: g, labels, api, frameScale,
    update(t, camPos) {
      const dt = Math.min(Math.max(t - now, 0), 0.1);
      now = t;
      if (sel.fresh) { sel.fresh = false; request(sel.step); }
      if (!ready) return;
      // fixed-size labels stay legible at any distance: a plot far from the camera (another
      // station's) lets its numbers go, from 4 to 6 plot sizes away
      if (camPos) {
        centre.set(0, H / 2, 0); plot.localToWorld(centre);
        const R = Math.max(W, H), d = centre.distanceTo(camPos);
        near = clamp01((6 * R - d) / (2 * R));
        // and a dense plot far off is thousands of grains in a few pixels: a bright point.
        // Its grains go too, from 8 to 12 plot sizes away
        far = clamp01((12 * R - d) / (4 * R));
        morph.u.uShow.value = far;
      }
      morph.u.uTime.value = t;
      if (armed && now - armT > 6) arrive();
      if (tipWait && !armed) transition(tipWait.k, tipWait.kind);
      if (depthWant !== depthNext && now >= depthAt) depthWant = depthNext;
      // the frame stands while the plot is shown
      const fw = shown ? 1 : 0;
      frame.show += (fw - frame.show) * Math.min(1, dt * 3.5);
      if (Math.abs(fw - frame.show) < 0.003) frame.show = fw;
      // `axes: false` (the rare set's abstract inputs): no axis lines, no tick marks.
      // The plane's axes go while the leak axis is open: from the side, the y axis would
      // stand as a line through the middle of the mass bands
      const axisShow = o.axes === false ? 0 : frame.show * far * (1 - depthShow);
      frame.axis.u.uShow.value = axisShow; frame.marks.u.uShow.value = axisShow;
      // the plane's numbers step back while the leak axis is open (seen from the side they
      // would sit on the cloud); the depth's own ticks come in
      shade(axisLabels, frame.show * near * (1 - depthShow));
      depthShow += (depthWant - depthShow) * Math.min(1, dt * 3);
      if (Math.abs(depthWant - depthShow) < 0.005) depthShow = depthWant;
      // the plane turns edge-on as the mass axis opens (`depth.squeeze`, 0.04 on record
      // 401): seen from the side, the plot's x then adds no smear of its own (perspective
      // spread a 22-unit x extent into each mass band, lab 4 slide 9)
      if (depthCfg) {
        // the squeeze follows the camera round: none seen face on, all of it side on. Squeezed
        // while still seen from the front, the plane collapsed into one white column of 91 k
        // stacked grains (lab 4 slides 9 and 10)
        let side = 1;
        if (camPos) {
          centre.set(0, H / 2, 0); plot.localToWorld(centre);
          camDir.copy(camPos).sub(centre).normalize();
          zAxis.setFromMatrixColumn(plot.matrixWorld, 2).normalize();
          const q = Math.max(0, Math.min(1, (1 - Math.abs(camDir.dot(zAxis)) - 0.1) / 0.75));
          side = q * q * (3 - 2 * q);
        }
        const sx = 1 - depthShow * side * (1 - depthCfg.squeeze);
        if (plot.scale.x !== sx) { plot.scale.x = sx; for (const l of labels) l.position.x = l.userData.x0 * sx; }
      }
      if (frame.dax) frame.dax.u.uShow.value = depthShow * frame.show * far;
      shade(depthLabels, depthShow * frame.show * near);
      drawBoundary(t);
    },
    dispose() {
      sel.off();
      if (name) kit.unregister(name);
      morph?.dispose();
      for (const x of [frame?.axis, frame?.marks, frame?.dax, bnd]) if (x) { x.geo.dispose(); x.mat.dispose(); }
      for (const l of labels) { l.material?.map?.dispose?.(); l.material?.dispose?.(); }
    },
  };
}
