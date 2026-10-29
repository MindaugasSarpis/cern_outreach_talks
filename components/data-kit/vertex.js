// dk-vertex: one D⁰ in flight, a K⁻ strand and a π⁺ strand of grains, and the pair
// folding back into one grain that lands on a dk-hist's mass axis (T2 part 1: "one K⁻
// and one π⁺ make one number, the mass of the pair"). New for the series (bible §4).
//
// The decay is row 1's (record 401, our grain): its mass M, its pT and its decay time.
// Record 401 has no track momenta, so the decay angle is simulated (seeded): the K⁻π⁺
// pair is drawn isotropic in the D⁰'s rest frame with the two-body momentum p* of a
// D⁰ of mass M, and boosted along the flight by βγ = pT / M (the picture is the
// transverse plane). The two tracks then carry the lab momenta that rebuild M exactly
// (api.values() gives them). The strands bend in opposite senses, as a K⁻ and a π⁺
// do in a magnet, by 1/p each. The notes must say "angles simulated".
//
//   { "type": "dk-vertex", "name": "v", "pos": [0, 0, 0], "grains": 300,
//     "at": [0, 1, 0], "dir": [0.35, 1, 0], "flight": 3.5, "track": 6,
//     "land": { "of": "h" }, "heap": "heap" }
//
// Steps: 0 hidden · 1 flight (the D⁰ grain leaves `at` and flies `flight` units,
// a faint trail behind it) · 2 decay (it goes out and the two strands grow from the
// decay point) · 3 land (the strands fold back into one white grain, which arcs to
// the dk-hist `land.of` and lands on its axis at M, in M's bin). A step forward plays
// its own part; an arrival (or `c`) plays every part up to its step, from nothing;
// a step back shows the step's end at once. Once the dk-hist draws its own grain of
// our row where ours landed, ours hands over and fades.
//
// No names on the strands (the owner's decision, 29 Oct: the decay is never named, on
// screen or in the notes' Message and Picture lines). The two strands read as two tracks
// from one point by themselves: they leave the decay point together, bend apart in
// opposite senses, and their roots are brighter, so the shared origin is the brightest
// place in the pair. `names` and `tracks[].name` are ignored (check.mjs warns).
//
// Look: `trailAlpha` (0.9) for the flight; `root` (0.8): how much brighter a strand's
// first grains are; `landSize` (2.2): our grain, landed alone on an empty axis, is drawn
// that much larger (the brightest thing in the frame) and shrinks back as the hist's own
// grain of our row takes over.
//
// `heap`: a dk-heap's name. The flight then starts from our row's grain on that pile
// (its summit), and the heap gives that grain up while the vertex holds it.
import { Group, Vector3, Color, Matrix4 } from 'three';
import { GRAIN, OURS, OURS_ROW, SEED, roles } from './style.js';
import { mulberry32, gauss } from './rng.js';

export const TYPE = 'dk-vertex';
export const FIELDS = ['pos', 'name', 'grains'];
export const OWNER = 't2';
// row 1 comes from d0.json unless the object gives m, pt and tau
export const files = (o) => (o.m != null && o.pt != null ? [] : ['d0.json']);

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildVertex(o, ctx, stage, kit), { fields: FIELDS });
}

// PDG masses (MeV/c²): K± 493.677, π± 139.57039
export const M_K = 493.677, M_PI = 139.57039;
const C_MM_PER_PS = 0.299792458;

// The two-body decay D⁰ → K⁻π⁺ of a D⁰ of mass m and momentum p (MeV), with a seeded
// isotropic angle in its rest frame. Momenta are split into a part along the flight
// (par) and across it (perp, at azimuth phi about the flight). Pure, for tests.
export function decay({ m, p, seed = SEED }) {
  const rnd = mulberry32(seed * 7 + 11);
  const ps = Math.sqrt((m * m - (M_K + M_PI) ** 2) * (m * m - (M_K - M_PI) ** 2)) / (2 * m);
  const cos = 2 * rnd() - 1, sin = Math.sqrt(Math.max(0, 1 - cos * cos)), phi = 2 * Math.PI * rnd();
  const bg = p / m, ga = Math.sqrt(1 + bg * bg);
  const eK = Math.hypot(ps, M_K), eP = Math.hypot(ps, M_PI);
  const K = { par: ga * ps * cos + bg * eK, perp: ps * sin, e: ga * eK + bg * ps * cos, m: M_K, q: -1 };
  const P = { par: -ga * ps * cos + bg * eP, perp: -ps * sin, e: ga * eP - bg * ps * cos, m: M_PI, q: +1 };
  for (const t of [K, P]) t.p = Math.hypot(t.par, t.perp);
  // the mass the pair rebuilds (equals m to rounding)
  const E = K.e + P.e, px = K.par + P.par, py = K.perp + P.perp;
  const mass = Math.sqrt(Math.max(0, E * E - px * px - py * py));
  const open = Math.acos(Math.max(-1, Math.min(1, (K.par * P.par + K.perp * P.perp) / (K.p * P.p))));
  return { pstar: ps, cosStar: cos, phi, K, P, mass, open, bg };
}

const OFFV = 1e9;
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const easeIn = (x) => { x = Math.max(0, Math.min(1, x)); return x * x; };

let VERT = null;
const vert = (stage) => (VERT ??= stage.GRAIN_GLSL + /* glsl */ `
attribute float aSeed, aSize, aA, aWhite;
uniform float uShow, uSize;
uniform vec3 uCrowd, uSel;
void main() {
  if (uShow <= 0.001 || aA <= 0.002) { hide(); return; }
  place(position, uSize * aSize, aA * uShow, mix(uCrowd, uSel, aWhite), aSeed);
}`);

function buildVertex(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const name = String(o.name);
  const seed = o.seed ?? SEED;
  const rnd = mulberry32(seed * 3 + 1);

  // ---- the grains: 0 ours · trail · strand K · strand π ----------------------------------
  const T = Math.max(8, Math.round(o.trail ?? 34));
  const S = Math.max(20, Math.round(o.strand ?? 220));
  const n = 1 + T + 2 * S;
  const pos = new Float32Array(n * 3), aA = new Float32Array(n), aW = new Float32Array(n), aS = new Float32Array(n), sd = new Float32Array(n);
  for (let i = 0; i < n; i++) { sd[i] = rnd(); aS[i] = 1; }
  aS[0] = OURS / GRAIN; aW[0] = 1;
  for (let j = 0; j < T; j++) aS[1 + j] = 1;
  const jit = new Float32Array(2 * S * 2);             // across-strand jitter (two axes)
  for (let i = 0; i < jit.length; i++) jit[i] = 0.018 * Math.max(-2, Math.min(2, gauss(rnd)));
  const mat = stage.grainMaterial(vert(stage), {
    uShow: { value: 0 }, uSize: { value: GRAIN },
    uCrowd: { value: new Color(P.crowd) }, uSel: { value: new Color(P.sel) },
  });
  const u = mat.uniforms;
  const geo = stage.grainGeometry(n, { position: pos, aSeed: [sd, 1], aSize: [aS, 1], aA: [aA, 1], aWhite: [aW, 1] });
  g.add(stage.grainPoints(geo, mat));
  // no labels: the strands carry no names (see the head of this file)
  const labels = [];
  const ROOT = Math.max(0, Number(o.root ?? 0.8));

  // ---- the decay ---------------------------------------------------------------------------
  let phys = null, geom = null, ready = false, failed = false;
  const at0 = new Vector3(...(o.at ?? [0, 0, 0]));
  const dir = new Vector3(...(o.dir ?? [0.35, 1, 0])).normalize();
  const flight = Number(o.flight ?? 3.5), L = Number(o.track ?? 6), bend = Number(o.bend ?? 0.06);
  function setup(row) {
    const m = Number(o.m ?? row?.M ?? 1880.649), pt = Number(o.pt ?? row?.PT ?? 3000.95), tau = Number(o.tau ?? row?.TAU ?? 0.4127);
    const d = decay({ m, p: pt, seed });
    // the flight's frame: e1 along it, e2 across it in the station's xy plane, e3 = e1 × e2
    const e1 = dir.clone(), e2 = new Vector3(-e1.y, e1.x, 0);
    if (e2.lengthSq() < 1e-6) e2.set(1, 0, 0);
    e2.normalize();
    const e3 = new Vector3().crossVectors(e1, e2).normalize();
    const zB = new Vector3(0, 0, 1);                  // the magnet's field, towards the camera
    // The azimuth about the flight is the view's to choose (turning the camera about the
    // D⁰'s line turns the decay with it): by default the decay plane faces the camera,
    // so the opening angle is seen whole. `face: false` keeps the simulated azimuth.
    const phi = o.face === false ? d.phi : Math.cos(d.phi) >= 0 ? 0 : Math.PI;
    const tracks = [d.K, d.P].map((t) => {
      const across = e2.clone().multiplyScalar(Math.cos(phi)).addScaledVector(e3, Math.sin(phi));
      const dv = e1.clone().multiplyScalar(t.par).addScaledVector(across, t.perp).normalize();
      const nv = new Vector3().crossVectors(zB, dv);
      if (nv.lengthSq() < 1e-6) nv.copy(e2);
      nv.normalize().multiplyScalar(t.q);
      const kappa = bend / Math.max(0.05, t.p / 1000);   // per world unit: 1/p, p in GeV/c
      const side = new Vector3().crossVectors(dv, nv).normalize();
      return { t, dv, nv, side, kappa };
    });
    phys = { m, pt, tau, ...d, flightMm: (pt / m) * C_MM_PER_PS * tau };
    geom = { e1, e2, e3, tracks };
    ready = true;
  }
  if (o.m != null && o.pt != null) setup(null);
  else kit.loadJSON(ctx, 'd0.json').then((j) => setup(j.row1)).catch((e) => { failed = true; console.warn(`dk-vertex ${name}: d0.json failed`, e); setup(null); });

  // a point s (0..1) along track k, in the station frame (from the decay point dv)
  const along = (k, s, dvp, out) => {
    const tr = geom.tracks[k], x = s * L, kp = tr.kappa;
    const a = Math.abs(kp * x) < 1e-6 ? x : Math.sin(kp * x) / kp;
    const b = Math.abs(kp * x) < 1e-6 ? 0 : (1 - Math.cos(kp * x)) / kp;
    return out.copy(dvp).addScaledVector(tr.dv, a).addScaledVector(tr.nv, b);
  };

  // ---- timeline: τ along the whole story; step k ends at END[k] --------------------------
  // our grain once it has landed alone on an empty axis is drawn `landSize` times larger
  // (the brightest thing in the frame) until the hist draws its own grain there
  const LS = Math.max(1, Number(o.landSize ?? 2.2)), trailA = Number(o.trailAlpha ?? 0.9);
  // the five phases' lengths (s): flight, decay (lift-off and split), hold, fold, landing
  const TF = Number(o.flightTime ?? 1.8), TD = Number(o.decayTime ?? 1.3), TH = Number(o.holdTime ?? 0.6), TO = Number(o.foldTime ?? 0.9), TL = Number(o.landTime ?? 1.6);
  const END = [0, TF, TF + TD, TF + TD + TH + TO + TL];
  const FOLD = TF + TD + TH, FLY = FOLD + TO;
  const st = stage.stepper(name);
  let now = 0, want = st.step ?? 0, cur = 0, armed = false, armT = 0;
  let tau0 = 0, tauEnd = 0, t0 = 0, show = 0, showTo = 0, fadeT0 = -OFFV, handT = -1, claimed = false;
  const tauNow = () => Math.min(tauEnd, tau0 + Math.max(0, now - t0));

  const heapForm = () => (o.heap ? kit.form(String(o.heap)) : null);
  const inv = new Matrix4(), w = new Vector3();
  // the flight's start: `at`, or our grain on the named heap
  const start = (out) => {
    const h = heapForm();
    if (h?.api?.posOf) {
      const p = h.api.posOf(o.ours ?? OURS_ROW, w);
      if (p) { g.updateWorldMatrix(true, false); inv.copy(g.matrixWorld).invert(); return out.copy(p).applyMatrix4(inv); }
    }
    return out.copy(at0);
  };
  // where ours lands: the hist's own grain of our row if it is drawn, else its frame at M
  const landForm = () => (o.land?.of ? kit.form(String(o.land.of)) : null);
  const landAt = (out) => {
    const f = landForm();
    const fr = f?.api?.frame?.();
    if (!fr) return null;
    const m = Number(o.land.m ?? phys.m);
    fr.group.updateWorldMatrix(true, false);
    w.set(fr.x(m), 0.5 * fr.y(1) + 0.04, 0).applyMatrix4(fr.group.matrixWorld);
    g.updateWorldMatrix(true, false); inv.copy(g.matrixWorld).invert();
    return out.copy(w).applyMatrix4(inv);
  };
  const theirs = (out) => { const f = landForm(); const p = f?.api?.ours?.(w); if (!p) return null; inv.copy(g.matrixWorld).invert(); return out.copy(p).applyMatrix4(inv); };

  // The heap gives our grain up while the vertex holds it. dk-heap keeps one claim at a
  // time (a dk-hist sorting the pile claims every row, ours with them), so the vertex
  // claims only while the dk-hist it lands on is empty and still, and never releases a
  // claim the hist has replaced (notes/requests-t2.md asks dk-heap for merged claims).
  const histHolds = () => { const f = landForm(); if (!f?.api) return false; const v = f.api.values?.(); return !!(v && v.count > 0) || !!(typeof f.api.busy === 'function' ? f.api.busy() : f.api.busy); };
  function claim(on) {
    const h = heapForm();
    if (!h?.api?.claim) return;
    if (on && !claimed) {
      if (histHolds()) return;
      const gone = new Float32Array(h.api.rows?.() ?? 1).fill(OFFV);
      gone[o.ours ?? OURS_ROW] = now;
      h.api.claim(gone, name); claimed = true;
    } else if (!on && claimed) {
      claimed = false;
      if (!histHolds()) h.api.release?.(name);
    }
  }
  function go(k, kind) {
    const prev = cur;
    cur = k;
    if (k <= 0) { showTo = 0; fadeT0 = now; return; }
    showTo = 1;
    const end = END[Math.min(k, 3)];
    claim(true);
    if (kind === 'back') { tau0 = end; tauEnd = end; t0 = now; show = 1; return; }
    if (kind === 'arrive' || prev <= 0) { tau0 = 0; show = 1; }
    else tau0 = tauNow();
    tauEnd = end; t0 = now;
  }
  const request = (k) => { want = k; if (armed || !ready) return; go(k, k < cur ? 'back' : 'fwd'); };

  // ---- each frame: every grain from τ -----------------------------------------------------
  const pv = new Vector3(), dvp = new Vector3(), lp = new Vector3(), hp = new Vector3(), q = new Vector3(), c = new Vector3();
  let oursOn = false, landOk = true;
  const oursAt = new Vector3();
  function draw() {
    const tau = tauNow();
    start(pv);
    dvp.copy(pv).addScaledVector(geom.e1, flight);
    // ours: the D⁰ (flying), gone while the pair is apart, back as the folded pair, flying to its bin
    let a0 = 0, glow = 0, big = 1;
    if (tau < TF) { q.lerpVectors(pv, dvp, ease(tau / TF)); a0 = o.heap ? 1 : Math.min(1, tau / 0.25); }
    else if (tau < TF + 0.35) { q.copy(dvp); a0 = 1 - (tau - TF) / 0.35; glow = a0; }
    else if (tau < FOLD) { q.copy(dvp); a0 = 0; }
    else if (tau < FLY) { q.copy(dvp); a0 = ease((tau - FOLD) / TO); glow = 0.6 * a0; }
    else {
      const has = landAt(lp);
      landOk = !!has;
      if (!has) { q.copy(dvp); a0 = 1; }
      else {
        const k = ease((tau - FLY) / TL);
        // a bowed arc from the decay point down to the bin
        c.lerpVectors(dvp, lp, 0.5); c.y += 0.22 * dvp.distanceTo(lp) + 0.6;
        const k1 = 1 - k;
        q.set(k1 * k1 * dvp.x + 2 * k1 * k * c.x + k * k * lp.x, k1 * k1 * dvp.y + 2 * k1 * k * c.y + k * k * lp.y, k1 * k1 * dvp.z + 2 * k1 * k * c.z + k * k * lp.z);
        a0 = 1;
        big = 1 + (LS - 1) * ease((tau - FLY - 0.5 * TL) / (0.5 * TL));
        // a short glow as it lands (not on a step back, which shows the end at once)
        const since = now - (t0 + END[3] - tau0);
        if (tau >= END[3] - 1e-6 && tau0 < END[3]) glow = Math.exp(-Math.max(0, since) * 3);
        // hand over to the hist's own grain of our row, once it stands where ours landed
        if (tau >= END[3] - 1e-6 && theirs(hp) && hp.distanceTo(lp) < 0.35) {
          if (handT < 0) handT = now;
          const hk = Math.max(0, 1 - (now - handT) / 0.5);
          a0 *= hk; big = 1 + (big - 1) * hk;
        }
        else handT = -1;
      }
    }
    pos[0] = q.x; pos[1] = q.y; pos[2] = q.z;
    aA[0] = Math.min(1.6, a0 * (1 + 0.8 * glow) * (1 + 0.25 * (big - 1)));
    aS[0] = (OURS / GRAIN) * (1 + 0.5 * glow) * big;
    oursOn = a0 > 0.3 || (tau >= TF && tau < FLY);
    oursAt.copy(tau >= TF && tau < FOLD ? dvp : q);
    // the trail: faint grains behind the D⁰, gone as the pair folds
    const fe = ease(tau / TF), trailFade = 1 - ease((tau - FOLD) / TO);
    for (let j = 0; j < T; j++) {
      const s = (j + 0.5) / T, i = 1 + j;
      q.lerpVectors(pv, dvp, s);
      pos[3 * i] = q.x; pos[3 * i + 1] = q.y; pos[3 * i + 2] = q.z;
      aA[i] = fe >= s ? trailA * trailFade : 0;
      aW[i] = 0;
    }
    // the strands: grow from the decay point, then fold back into it
    const grow = ease((tau - TF - 0.1) / TD), fold = ease((tau - FOLD) / TO);
    for (let k = 0; k < 2; k++) {
      for (let j = 0; j < S; j++) {
        const i = 1 + T + k * S + j, s = (j + 0.5) / S;
        const vis = grow >= s ? 1 : 0;
        const sAt = s * (1 - fold);
        along(k, sAt, dvp, q);
        const tr = geom.tracks[k], jj = 2 * (k * S + j);
        q.addScaledVector(tr.side, jit[jj]).addScaledVector(tr.nv, jit[jj + 1]);
        pos[3 * i] = q.x; pos[3 * i + 1] = q.y; pos[3 * i + 2] = q.z;
        // the growing tip is brighter, and so are the roots (the one point both leave);
        // the pair whitens as it folds into one grain
        const head = grow < 1 ? Math.exp(-Math.max(0, grow - s) * 14) : 0;
        const root = ROOT * Math.exp(-s * 9);
        aA[i] = vis * (1.0 + 0.6 * head + root) * (1 - easeIn(fold));
        aS[i] = 1 + 0.6 * root;
        aW[i] = Math.min(1, 0.6 * head + fold);
      }
    }
    geo.attributes.position.needsUpdate = true; geo.attributes.aA.needsUpdate = true;
    geo.attributes.aWhite.needsUpdate = true; geo.attributes.aSize.needsUpdate = true;
  }

  const api = {
    arm() { armed = true; armT = now; show = 0; showTo = 0; u.uShow.value = 0; claim(false); },
    assemble(t, onDone) {
      now = t; armed = false;
      if (ready && want > 0) go(want, 'arrive'); else cur = 0;
      onDone?.();
    },
    busy: () => armed || (!ready && !failed && want > 0) || (ready && cur > 0 && tauNow() < tauEnd) || Math.abs(show - showTo) > 0.01 || (handT >= 0 && now - handT < 0.5)
      || (ready && cur >= 3 && !!o.land?.of && !landOk && now - t0 < 6),
    // the pair's mass once our grain has landed on its bin (with `land`), or once the pair
    // has folded into one grain (without). Before that NaN, so a <StageCount for> shows no
    // number of its own: it printed 0.0 for the whole decay and then snapped to the mass
    // (lab 2 slide 14). Give the deck's number a delay that reaches the landing.
    value: () => {
      if (!ready || cur < 3) return 0;
      const at = o.land?.of ? END[3] - 1e-6 : FLY;
      return tauNow() >= at ? phys.m : NaN;
    },
    values: () => (ready ? { m: phys.m, pt: phys.pt, tau: phys.tau, pstar: phys.pstar, pK: phys.K.p, pPi: phys.P.p, open: phys.open, mass: phys.mass, flightMm: phys.flightMm, step: cur } : null),
    ready: () => ready,
    // our grain now (world): the D⁰, the decay point while the pair is apart, the folded grain
    ours(out = new Vector3()) {
      if (!ready || show < 0.05 || !oursOn || cur <= 0) return null;
      if (handT >= 0 && now - handT > 0.25) return null;
      g.updateWorldMatrix(true, false);
      return out.copy(oursAt).applyMatrix4(g.matrixWorld);
    },
  };
  kit.register(name, { type: TYPE, api });

  return {
    group: g, labels, api, frameScale: u.uPixelRatio,
    update(t) {
      const dt = Math.min(Math.max(t - now, 0), 0.1);
      now = t;
      u.uTime.value = t;
      if (st.fresh && ready) { st.fresh = false; request(st.step); }
      if (armed && now - armT > 6) { armed = false; if (want > 0) go(want, 'arrive'); }
      if (!ready) return;
      if (showTo > show) show = Math.min(1, show + dt / 0.35);
      else if (showTo < show) show = Math.max(0, show - dt / 0.35);
      if (armed) show = 0;
      u.uShow.value = show;
      if (show <= 0 && cur <= 0) { claim(false); return; }
      if (cur > 0 && !claimed) claim(true);
      draw();
    },
    dispose() { st.off(); kit.unregister(name); claim(false); geo.dispose(); mat.dispose(); },
  };
}
