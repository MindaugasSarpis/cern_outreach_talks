// dk-heap: the unsorted pile of n grains on the floor, one grain per candidate (the
// dk-hist grain without bins). Steps: 0 hidden · 1 rain (the grains fall onto the
// floor in the series' order, `rain` seconds for all of them) · 2 settled (the pile,
// at once) · 3 collapse to a ball (the file; T4's close, T5's cover), turning slowly.
//
// A dk-hist with `{ sort: '<heap name>' }` takes its grains out of the pile: each
// leaves the heap at the moment it leaps to its bin (claim()), so the pile shrinks
// as the plot grows, and stepping the plot back gives the grains back.
//
// Grain i is row i of d0.f32 (rank from rng.order(n, seed, ours): rank 0 lands first,
// lowest; ours lands last, on top of the pile). Give the heap and the dk-hist the same
// `seed` and `ours` (both default to the series' own).
//
// `oursFrom: '<form>'` (T1's close): in the rain, our grain does not fall from above
// with the others: it starts where that form's api.ours() is (dk-trigger's folded
// packet at the lane's end) and glides down on a bowed arc, `oursGlide` seconds (2.4),
// landing last, on the summit. `oursFrom: { at: [x, y, z] }` starts it at a fixed point
// instead, in the heap's station frame (`world: true`: world coordinates): a lane hidden
// as the heap rains (T1 slide 14) then needs no stand-in form at the fold point.
//
// Since 30 Oct: the rain falls from a soft disc of emitters, each grain fading in as it
// falls (`flight`, 0.15: the share of itself it shows as it leaves). `states` (a list by
// step of 'off' | 'rain' | 'pile' | 'ball') and `alpha` as a list by step let a deck add a
// dimmer pile step. An arm keeps a standing pile (`arrival: 'replay'` rains it again).
import { Group, Vector3 } from 'three';
import { GRAIN, OURS, OURS_ROW, SEED, roles, alphaFor } from './style.js';
import { mulberry32, order as seriesOrder } from './rng.js';
import { createMorph, OFF, MOTION } from './morph.js';

export const TYPE = 'dk-heap';
export const FIELDS = ['pos', 'name', 'n', 'grains'];
export const OWNER = 'core';
export const files = () => [];

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildHeap(o, ctx, stage, kit), { fields: FIELDS });
}

function buildHeap(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const name = String(o.name);
  const n = Math.max(1, Math.round(Number(o.n) || 1));
  const N = Math.min(n, Math.max(1000, Math.min(ctx.budget ?? 300000, o.grains ?? n)));   // rows ≥ N are not drawn
  const seed = o.seed ?? SEED;
  const ours = o.ours === false ? null : (o.ours ?? OURS_ROW);
  const rank = seriesOrder(n, seed, ours);
  const R = Number(o.radius ?? 5), Hm = Number(o.height ?? 0.5 * R);
  const rb = Number(o.ball?.r ?? 0.42 * R);
  const ballC = new Vector3(...(o.ball?.at ?? [0, rb + 0.3, 0]));
  const frameScale = { value: 1 };
  const morph = createMorph(stage, N, { crowd: P.crowd, sel: P.sel, seed, uniforms: { uPixelRatio: frameScale } });
  if (ours != null && ours < N) { morph.Z[ours] = OURS / GRAIN; morph.sizes(); }
  g.add(morph.points);
  morph.u.uSpinC.value.copy(ballC);
  morph.u.uSpin.value = Number(o.spin ?? 0.12);
  const tone = o.tone === 'sel' ? 1 : Number(o.tone) || 0;

  // the pile: N points in a paraboloid mound (uniform in volume), lowest to the first rank
  const rnd = mulberry32(seed * 13 + 5);
  const mound = new Float32Array(N * 3);
  {
    const pts = [];
    for (let i = 0; i < N; i++) {
      const s2 = 1 - Math.sqrt(1 - rnd()), r = R * Math.sqrt(s2), ph = rnd() * Math.PI * 2;
      const h = Hm * (1 - s2);
      pts.push([r * Math.cos(ph), h * Math.pow(rnd(), 0.85), r * Math.sin(ph)]);
    }
    pts.sort((a, b) => a[1] - b[1]);
    const byRank = Int32Array.from({ length: N }, (_, i) => i).sort((a, b) => rank[a] - rank[b]);
    byRank.forEach((gi, k) => mound.set(pts[k], gi * 3));
    // ours on the summit
    if (ours != null && ours < N) mound.set([0, Hm * 1.01, 0], ours * 3);
  }
  // the ball: each grain pulled in along its line from the pile's centre
  const ball = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    const x = mound[3 * i], y = mound[3 * i + 1] - Hm / 3, z = mound[3 * i + 2];
    const l = Math.hypot(x, y, z) || 1, r = rb * Math.cbrt(rnd());
    ball[3 * i] = ballC.x + (x / l) * r; ball[3 * i + 1] = ballC.y + (y / l) * r; ball[3 * i + 2] = ballC.z + (z / l) * r;
  }
  const fillOrder = Int32Array.from({ length: N }, (_, i) => i).sort((a, b) => rank[a] - rank[b]);
  // `states` (a list by step: 'off', 'rain', 'pile', 'ball'; default the four in that order):
  // a deck may add steps, e.g. a dimmer pile with `alpha` by step (T2: the pile dims once our
  // grain has left it, while the cover keeps T1's brightness)
  const STATES = Array.isArray(o.states) ? o.states.map(String) : ['off', 'rain', 'pile', 'ball'];
  const kindOf = (k) => (k <= 0 ? 'off' : STATES[Math.min(k, STATES.length - 1)] ?? 'pile');
  const isBall = (k) => kindOf(k) === 'ball';
  const layout = (k) => {
    const kd = kindOf(k);
    const pos = kd === 'ball' ? ball : mound, vis = new Float32Array(N), white = new Float32Array(N);
    if (kd !== 'off') { vis.fill(1); white.fill(tone); }
    return { pos, vis, white };
  };

  const st = stage.stepper(name);
  let now = 0, cur = 0, want = st.step ?? 0, armed = false, armT = 0, playedAt = -OFF, kept = false;
  let arrTimes = new Float64Array(0), base = 0;
  // `alpha`: a number, or a list by step (entry k for step k, the last for any step past it)
  const alphas = Array.isArray(o.alpha) ? o.alpha.map(Number) : null;
  const alpha0 = Math.min(0.9, alphaFor(N / (3 * R)));
  const alphaAt = (k) => (alphas ? alphas[Math.max(1, Math.min(alphas.length - 1, k || 1))] ?? alpha0 : Number(o.alpha ?? alpha0));
  let aFrom = alphaAt(st.step ?? 1), aTo = aFrom, aT0 = -OFF;
  morph.u.uAlpha.value = aFrom;
  // the rain's grains show this share of themselves as they leave (they fade in as they fall)
  morph.u.uFlyD.value = Number(o.flight ?? 0.15);

  function transition(k, kind) {
    const L = layout(k);
    const t = now, prev = cur;
    const instant = kind === 'back' || kind === 'hide';
    const fresh = kind === 'arrive' || prev === 0;
    const rainDur = Number(o.rain ?? 6);
    const arr = [];
    // our grain's start for the rain: the named form's api.ours() now, in the pile's frame
    let oursStart = null;
    const raining = kindOf(k) === 'rain' && fresh;
    if (raining && !instant && o.oursFrom && ours != null && ours < N) {
      let p = null;
      if (typeof o.oursFrom === 'object' && Array.isArray(o.oursFrom.at)) {
        p = new Vector3(...o.oursFrom.at.map(Number));
        if (!o.oursFrom.world && g.parent) { g.parent.updateWorldMatrix(true, false); g.parent.localToWorld(p); }
      } else p = kit.form(String(o.oursFrom))?.api?.ours?.(new Vector3()) ?? null;
      if (p) { g.updateWorldMatrix(true, false); oursStart = g.worldToLocal(p.clone()); }
    }
    // the grains that land in this transition (counted by their arrival times, not in `base`)
    const arriving = new Uint8Array(N);
    morph.go(t, L, (m) => {
      const { A, B, V, T, M, S } = m;
      for (let q = 0; q < N; q++) {
        const i = fillOrder[q], i2 = 2 * i, i3 = 3 * i, r = S[i];
        const v0 = V[i2], v1 = V[i2 + 1];
        if (instant) { if (v0 > 0.01 || v1 > 0.01) { if (v0 < 0.01) { A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1]; A[i3 + 2] = B[i3 + 2]; } T[i2] = 0; T[i2 + 1] = 0.35; } continue; }
        if (v0 < 0.5 && v1 > 0.5) {
          if (raining && i === ours && oursStart) {
            // ours: from the form it came out of, down onto the summit as the rain ends
            A[i3] = oursStart.x; A[i3 + 1] = oursStart.y; A[i3 + 2] = oursStart.z;
            const d = Math.hypot(B[i3] - A[i3], B[i3 + 1] - A[i3 + 1], B[i3 + 2] - A[i3 + 2]);
            m.C[i3 + 1] = 0.12 * d;
            const g2 = Number(o.oursGlide ?? 2.4);
            // shown at its start from the first frame (it is the packet that folded there)
            V[i2] = 1; M[i] = MOTION.GLIDE; T[i2] = Math.max(0, 0.3 + rainDur + 1.2 - g2); T[i2 + 1] = g2;
          } else if (raining) {
            // rain: in the series' order, from a soft disc of emitters above the pile (a
            // gaussian spread round each grain's own place, wider than the pile, and heights
            // spread too), each grain fading in as it falls: no column with hard edges, no
            // slab standing over the heap (T1 slide 14)
            const ga = 2 * Math.PI * S[(i + 7) % N], gr = 0.45 * R * Math.sqrt(-2 * Math.log(Math.max(1e-6, S[(i + 11) % N])));
            A[i3] = B[i3] + gr * Math.cos(ga); A[i3 + 1] = B[i3 + 1] + Hm + 4 + 7 * Math.pow(r, 0.7); A[i3 + 2] = B[i3 + 2] + gr * Math.sin(ga);
            M[i] = MOTION.DROP; T[i2] = 0.3 + (q / Math.max(1, N - 1)) * rainDur; T[i2 + 1] = 1.2;
          } else {
            // the pile (or the ball) at once: a soft fade in place
            A[i3] = B[i3]; A[i3 + 1] = B[i3 + 1]; A[i3 + 2] = B[i3 + 2];
            M[i] = MOTION.GLIDE; T[i2] = (fresh ? 0.2 : 0.3) * r; T[i2 + 1] = 0.6;
          }
          arr.push(t + T[i2] + T[i2 + 1]); arriving[i] = 1;
        } else if (v0 > 0.01 && v1 > 0.5) {
          const moved = Math.abs(A[i3] - B[i3]) + Math.abs(A[i3 + 1] - B[i3 + 1]) + Math.abs(A[i3 + 2] - B[i3 + 2]) > 1e-4;
          if (!moved && v0 > 0.99) continue;
          if (isBall(k) && !isBall(prev)) {
            // the collapse: the rim first, everything in over ~2.5 s
            const rho = Math.hypot(A[i3], A[i3 + 2]) / R;
            M[i] = MOTION.GLIDE; T[i2] = 0.6 * (1 - Math.min(1, rho)) + 0.2 * r; T[i2 + 1] = 2.2;
          } else { M[i] = MOTION.GLIDE; T[i2] = 0.2 * r; T[i2 + 1] = 0.6; }
        } else if (v0 > 0.01 && v1 < 0.5) {
          B[i3] = A[i3]; B[i3 + 1] = A[i3 + 1]; B[i3 + 2] = A[i3 + 2]; M[i] = MOTION.GLIDE; T[i2] = 0; T[i2 + 1] = 0.5;
        }
      }
    }, { rotB: isBall(k) ? 1 : 0 });
    arr.sort((a, b) => a - b);
    arrTimes = Float64Array.from(arr);
    base = 0;
    // the grains already standing (our glided grain is shown at its start, V = 1, but it is
    // still to land: counted once, by its arrival time; it was counted twice: 91 584)
    if (k > 0) for (let i = 0; i < N; i++) if (morph.V[2 * i] > 0.5 && !arriving[i]) base++;
    cur = k; playedAt = t;
    if (k > 0) { const a = alphaAt(k); if (a !== aTo) { aFrom = instant || prev === 0 ? a : morph.u.uAlpha.value; aTo = a; aT0 = t; } }
  }
  const request = (k) => { want = k; if (armed) return; if (k !== cur) transition(k, k < cur ? (k === 0 ? 'hide' : 'back') : 'fwd'); };
  const hideNow = () => { morph.jump(now, layout(0)); cur = 0; arrTimes = new Float64Array(0); base = 0; };
  const arrive = () => {
    if (kept) { kept = false; if (want !== cur) transition(want, want < cur ? (want === 0 ? 'hide' : 'back') : 'fwd'); return; }
    const wasArmed = armed; armed = false;
    if (!wasArmed && now - playedAt > 1.5) hideNow();
    if (want > 0 && want !== cur) transition(want, 'arrive');
  };
  const upper = (a, x) => { let l = 0, h = a.length; while (l < h) { const m = (l + h) >> 1; if (a[m] <= x) l = m + 1; else h = m; } return l; };
  const v = new Vector3();
  const claims = new Map();
  const centreW = new Vector3();
  function applyClaims() {
    const G = morph.G;
    G.fill(OFF);
    for (const gone of claims.values()) for (let i = 0; i < N && i < gone.length; i++) if (gone[i] < G[i]) G[i] = gone[i];
    morph.gone();
  }

  const api = {
    // a pile that stands when its station is armed stays (no second rain); `arrival: 'replay'` rains again
    arm() { if (o.arrival !== 'replay' && cur > 0) { kept = true; return; } armed = true; armT = now; hideNow(); },
    assemble(t, onDone) { now = t; arrive(); onDone?.(); },
    busy: () => armed || now < morph.end + 0.3 || now < aT0 + 0.8,
    // grains on the floor so far (all n when settled)
    value: () => (cur === 0 ? 0 : Math.round(((base + upper(arrTimes, now)) / N) * n)),
    ready: () => true,
    rows: () => n,
    // where a row lies in the pile (world), for a dk-hist {sort}; null when it is not drawn
    posOf(row, out = v) {
      if (!(row >= 0 && row < N)) return null;
      g.updateWorldMatrix(true, false);
      return out.set(mound[3 * row], mound[3 * row + 1], mound[3 * row + 2]).applyMatrix4(g.matrixWorld);
    },
    // our grain where it is now (world): gliding in with `oursFrom`, on the summit, in the
    // turning ball; null while hidden or claimed away (a dk-spark `on` the heap follows it)
    ours(out = new Vector3()) {
      if (ours == null || ours >= N || cur === 0 || now >= morph.G[ours]) return null;
      const c = morph.sample(ours, now, [0, 0, 0, 0, 0]);
      if (c[3] < 0.01) return null;
      g.updateWorldMatrix(true, false);
      return out.set(c[0], c[1], c[2]).applyMatrix4(g.matrixWorld);
    },
    // gone[row] = the world time the row leaves the pile (OFF: it stays). Claims merge:
    // each claimant (`who`, e.g. its form name) keeps its own array, and a row goes at the
    // earliest time any claimant names; release(who) drops only that claimant's.
    claim(gone, who = '_') { claims.set(String(who), gone); applyClaims(); },
    release(who = '_') { claims.delete(String(who)); applyClaims(); },
  };
  kit.register(name, { type: TYPE, api });

  return {
    group: g, api, frameScale,
    update(t, camPos) {
      now = t;
      morph.u.uTime.value = t;
      if (st.fresh) { st.fresh = false; request(st.step); }
      { const q = Math.max(0, Math.min(1, (t - aT0) / 0.8)); morph.u.uAlpha.value = aFrom + (aTo - aFrom) * q * q * (3 - 2 * q); }
      if (armed && now - armT > 6) arrive();
      // another station's pile far off is one bright point: it fades from 8 to 12 pile
      // sizes away (`fade: false` keeps it)
      if (camPos && o.fade !== false) {
        g.getWorldPosition(centreW);
        const S = 2 * R, d = centreW.distanceTo(camPos);
        morph.u.uShow.value = Math.max(0, Math.min(1, (12 * S - d) / (4 * S)));
      }
    },
    dispose() { st.off(); kit.unregister(name); morph.dispose(); },
  };
}
