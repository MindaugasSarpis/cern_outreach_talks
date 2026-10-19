// The MasterTalk's route (stations 4–11 of notes/storyboard.md): what the one
// collision passes through after the crossing, as grains. The steps come from
// <Grains :set="{ name: k }" /> (setup/grains.js's bus), the clock from the world.
//
//   detector  LHCb's real geometry (public/data/lhcb-grains.bin, baked from HSF
//             Phoenix's LHCb.glb by hero/bake_grains.py), drawn the way the
//             opening draws the event: 0.5 units a metre along the beam (world
//             +x), 2.4× that across it. Step 1: it lights up behind a front
//             running from the vertex to the last muon station. Step 2: the
//             readout: the grains the event's own tracks pass through (its hits)
//             turn white, the rest dims, and the hits leave downstream, to `out`.
//   stream    the data leaving the detector: packets of grains (crossings)
//             running along x through the trigger's gates; at each active gate
//             all but `keep` of the packets crossing it burst into dust. One
//             packet, ours, is white and moves by steps (`ours`, its x per step).
//   grid      the data centre and the grid: a store of grains, then 42 sites on
//             threads from it, then one thread lit to Vilnius.
//   spark     the one collision as one dot: a white point with a soft glow, at
//             a place per step (`steps`: null hides it; { at, from?, glide? }).
import { BufferGeometry, BufferAttribute, Points, Group, Color, Vector3 } from 'three'
import { material, PLACE, listen, state } from './grains.js'
import { trajectories } from '../components/lhc-opening/event.js'

const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }
const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2 }
const mulberry = (a) => () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
const at3 = (v) => [v?.[0] || 0, v?.[1] || 0, v?.[2] || 0]

function points(geo, mat) { const p = new Points(geo, mat); p.frustumCulled = false; return p }
function geometry(n, attrs) {
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(attrs.position || new Float32Array(n * 3), 3))
  for (const [k, [arr, size]] of Object.entries(attrs)) if (k !== 'position') geo.setAttribute(k, new BufferAttribute(arr, size))
  return geo
}
// a form's step and the world time it was set: steps change on slide enter, the
// form reads the time on its next frame
function stepper(name, initial = 0) {
  const s = { step: state.get(name) ?? initial, prev: initial, at: -1e9, fresh: state.has(name) }
  s.off = listen(name, (k) => { s.prev = s.step; s.step = k; s.fresh = true })
  return s
}

// ---- detector -------------------------------------------------------------------------
//   { type: detector, name, pos, src: 'data/lhcb-grains.bin', scale?: 0.5, stretch?: 2.4,
//     sweep?: 3.5 (s for the front to cross it), size?: 1, alpha?: 0.16, color?, hot?,
//     out?: [x, y, z] (where the hits leave to, in the object's frame), hitR?: 0.035 (m),
//     hitMin?: 0.1 (m from the beam: grains nearer it are never hits) }
const DET_VERT = PLACE + /* glsl */ `
attribute float aX, aHit, aSeed;
uniform float uShowT, uHideT, uSweep, uLen, uHitT, uSize, uAlpha;
uniform vec3 uOut, uColor, uHot;
void main() {
  if (uShowT > 1e8) { hide(); return; }
  float since = uTime - uShowT;
  float front = since / uSweep * uLen;
  float d = front - aX;
  float passed = smoothstep(-0.4, 0.0, d);
  float flash = passed * exp(-max(d, 0.0) * 0.9);
  float fade = uHideT > 1e8 ? 1.0 : 1.0 - smoothstep(0.0, 1.2, uTime - uHideT);
  vec3 p = position, col = mix(uColor, uHot, 0.6 * flash);
  float a = uAlpha * passed * (0.55 + 0.45 * hash(aSeed * 9.0)) + 0.5 * flash;
  float size = uSize;
  if (uHitT < 1e8) {
    float h = uTime - uHitT;
    if (aHit > 0.5) {
      float lit = smoothstep(0.0, 0.8, h);
      col = mix(col, uHot, lit); a = mix(a, 0.7, lit); size *= 1.0 + 0.3 * lit;
      // each hit leaves after the others ahead of it: the front ones first; then again, every
      // 3.4 s (the next crossing's hits), so the readout stays a flow from the detector into the stream
      float hh = h - 2.2 - (1.0 - aX / uLen) * 1.2 - aSeed * 0.8;
      float go = hh < 0.0 ? 0.0 : ease(mod(hh, 3.4) / 2.6);
      vec3 c1 = vec3(max(position.x, uOut.x * 0.7), position.y * 0.6, position.z * 0.6);
      vec3 q = mix(mix(position, c1, go), mix(c1, uOut, go), go);
      p = q;
      a *= (1.0 - 0.4 * smoothstep(0.0, 0.3, go)) * (1.0 - smoothstep(0.88, 1.0, go));   // in flight a hit is a fainter grain
    } else {
      a *= mix(1.0, 0.5, smoothstep(0.0, 1.6, h));
    }
  }
  place(p, size, a * fade, col, aSeed);
}`

function buildDetector(o, ctx) {
  const g = new Group(); g.position.set(...at3(o.pos))
  const S = o.scale ?? 0.5, T = o.stretch ?? 2.4
  const W = (x, y, z) => [z * S, y * S * T, x * S * T]   // LHCb metres -> world, as the collision draws it
  const mat = material(DET_VERT, {
    uShowT: { value: 1e9 }, uHideT: { value: 1e9 }, uSweep: { value: o.sweep ?? 3.5 }, uLen: { value: 19.5 * S },
    uHitT: { value: 1e9 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.16 },
    uOut: { value: new Vector3(...(o.out || [14, 0, 0])) },
    uColor: { value: new Color(...rgb(o.color || '#5b93ff')) }, uHot: { value: new Color(...rgb(o.hot || '#ffffff')) },
  })
  const u = mat.uniforms
  const build = (buf, ev) => {
    const raw = new Int16Array(buf), n = raw.length / 4
    // the event's paths, binned every 5 cm along the beam: a grain is a hit when a track passes within hitR of it
    const bins = new Map(), R = o.hitR ?? 0.035
    if (ev) for (const t of trajectories(ev).tracks) for (const p of t.pts) {
      const k = Math.round(p[2] / 0.05); if (!bins.has(k)) bins.set(k, []); bins.get(k).push(p[0], p[1])
    }
    const pos = new Float32Array(n * 3), ax = new Float32Array(n), hit = new Float32Array(n), seed = new Float32Array(n)
    let hits = 0
    for (let i = 0; i < n; i++) {
      const x = raw[i * 4] / 1000, y = raw[i * 4 + 1] / 1000, z = raw[i * 4 + 2] / 1000
      pos.set(W(x, y, z), i * 3); ax[i] = z * S; seed[i] = Math.random()
      const r = R + 0.004 * Math.max(z, 0)
      // not the beam pipe and the VELO's inner edge, where every track meets: those grains
      // would all count, and leave as one white bar along the axis
      if (Math.hypot(x, y) < (o.hitMin ?? 0.1)) continue
      for (let dk = -1; dk <= 1 && !hit[i]; dk++) {
        const b = bins.get(Math.round(z / 0.05) + dk); if (!b) continue
        for (let j = 0; j < b.length; j += 2) if ((b[j] - x) ** 2 + (b[j + 1] - y) ** 2 < r * r) { hit[i] = 1; hits++; break }
      }
    }
    g.add(points(geometry(n, { position: pos, aX: [ax, 1], aHit: [hit, 1], aSeed: [seed, 1] }), mat))
    g.userData.hits = hits
  }
  fetch(ctx.asset('/' + String(o.src || 'data/lhcb-grains.bin').replace(/^\//, ''))).then((r) => r.arrayBuffer())
    .then((buf) => build(buf, EVENT)).catch((e) => console.warn('stage: detector grains failed', o.src, e))
  const s = stepper(o.name)
  let now = 0
  const apply = () => {
    const k = s.step
    if (k <= 0) { if (u.uShowT.value < 1e8 && u.uHideT.value > 1e8) u.uHideT.value = now; if (now - u.uHideT.value > 1.3) u.uShowT.value = 1e9; u.uHitT.value = 1e9; return }
    // arriving at a later step directly (a jump) shows the detector whole at once
    if (u.uShowT.value > 1e8 || u.uHideT.value < 1e8) u.uShowT.value = k === 1 && s.prev === 0 ? now : now - 100
    u.uHideT.value = 1e9
    if (k >= 2) { if (u.uHitT.value > 1e8) u.uHitT.value = s.prev === 1 ? now : now - 100 } else u.uHitT.value = 1e9
  }
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => (u.uShowT.value < 1e8 && now - u.uShowT.value < u.uSweep.value + 1) || (u.uHitT.value < 1e8 && now - u.uHitT.value < 7.5) },
    update(t) {
      now = t; u.uTime.value = t
      if (s.fresh) { s.fresh = false; apply() }
      if (s.step <= 0 && u.uHideT.value < 1e8 && t - u.uHideT.value > 1.3) u.uShowT.value = 1e9
    },
    dispose: s.off,
  }
}

// ---- stream ----------------------------------------------------------------------------
//   { type: stream, name, pos, from: x, to: x (along the object's x), gates: [x, …], keep?: [share, …],
//     packets?: 320, grains?: 22, speed?: 7 (units/s), lane?: 1.1 (radius), ours: [x per step],
//     glide?: 3.5, buffer?: { at: x, r: 3.2, grains: 5000 }, color?, hot? }
// Step 0 hides it, 1 runs it, 1 + k turns gate k on (and the gates before it).
const STREAM_VERT = PLACE + /* glsl */ `
attribute float aPhase, aKeep1, aKeep2, aSeed;
attribute vec3 aOff;
uniform float uShow, uFrom, uTo, uSpeed, uG1, uG2, uG1T, uG2T, uSize, uAlpha;
uniform vec3 uColor;
void main() {
  if (uShow < 0.01) { hide(); return; }
  float L = uTo - uFrom;
  float s = mod(uTime * uSpeed + aPhase * L, L);
  float x = uFrom + s;
  vec3 p = vec3(x, 0.0, 0.0) + aOff;
  float a = uAlpha * uShow * smoothstep(0.0, 2.0, s) * (1.0 - smoothstep(L - 3.0, L, s));
  // a gate kills what crosses it after it is on: the packet bursts into dust and fades
  for (int k = 0; k < 2; k++) {
    float gx = k == 0 ? uG1 : uG2, gt = k == 0 ? uG1T : uG2T, keep = k == 0 ? aKeep1 : aKeep2;
    if (x > gx && keep < 0.5) {
      float age = (x - gx) / uSpeed, crossed = uTime - age;
      if (crossed > gt) {
        vec3 dir = normalize(aOff + vec3(0.0001, 0.0002, 0.0)) ;
        p = vec3(gx, 0.0, 0.0) + aOff + dir * age * 1.6 + vec3(age * 0.5, 0.0, 0.0);
        a *= 0.8 * exp(-age * 1.3);   // the dust lingers about a second: the burst reads
      }
    }
  }
  place(p, uSize, a, uColor, aSeed);
}`
const GATE_VERT = PLACE + /* glsl */ `
attribute float aSeed, aGate;
uniform float uShow, uG1T, uG2T, uSize;
uniform vec3 uColor;
void main() {
  if (uShow < 0.01) { hide(); return; }
  float t0 = aGate < 0.5 ? uG1T : uG2T;
  float on = smoothstep(0.0, 1.0, uTime - t0);
  float a = uShow * (0.08 + 0.5 * on) * (0.6 + 0.4 * hash(aSeed * 5.0));
  vec3 p = turnY(position, 0.0);
  place(p, uSize, a, uColor, aSeed);
}`
const BUF_VERT = PLACE + /* glsl */ `
attribute float aSeed, aR, aA;
uniform float uShow, uOn, uSize;
uniform vec3 uColor;
void main() {
  if (uShow * uOn < 0.01) { hide(); return; }
  float ang = aA + uTime * (0.25 / (0.4 + aR));
  vec3 p = position + vec3(0.0, cos(ang) * aR, sin(ang) * aR);
  place(p, uSize, 0.6 * uShow * uOn * (0.5 + 0.5 * hash(aSeed * 3.0)), uColor, aSeed);
}`
const OURS_VERT = PLACE + /* glsl */ `
attribute float aSeed;
uniform float uShow, uSize;
uniform vec3 uAt, uColor;
void main() {
  if (uShow < 0.01) { hide(); return; }
  float k = length(position);
  vec3 p = uAt + position * (1.0 + 0.15 * sin(uTime * 2.0 + aSeed * 6.0));
  place(p, uSize * (k < 0.001 ? 4.0 : 1.3), uShow * (k < 0.001 ? 1.0 : 0.6), uColor, aSeed);
}`

function buildStream(o, ctx) {
  const g = new Group(); g.position.set(...at3(o.pos))
  const P = o.packets ?? 320, G = o.grains ?? 22, lane = o.lane ?? 1.1
  const gates = o.gates || [1e6, 1e6], keep = o.keep || [1 / 30, 1 / 30]
  const color = new Color(...rgb(o.color || '#9cc4ff')), hot = new Color(...rgb(o.hot || '#ffffff'))
  const shared = { uShow: { value: 0 }, uG1T: { value: 1e9 }, uG2T: { value: 1e9 } }
  const mat = material(STREAM_VERT, {
    ...shared, uFrom: { value: o.from }, uTo: { value: o.to }, uSpeed: { value: o.speed ?? 7 },
    uG1: { value: gates[0] }, uG2: { value: gates[1] ?? 1e6 }, uSize: { value: o.size ?? 0.9 }, uAlpha: { value: o.alpha ?? 0.5 }, uColor: { value: color },
  })
  const u = mat.uniforms
  {
    const n = P * G, off = new Float32Array(n * 3), ph = new Float32Array(n), k1 = new Float32Array(n), k2 = new Float32Array(n), sd = new Float32Array(n)
    const rnd = mulberry(5)
    for (let i = 0, m = 0; i < P; i++) {
      const r = lane * Math.sqrt(rnd()), a = rnd() * Math.PI * 2, cy = r * Math.cos(a), cz = r * Math.sin(a), phase = rnd()
      const a1 = rnd() < keep[0] ? 1 : 0, a2 = rnd() < (keep[1] ?? 1) ? 1 : 0
      for (let j = 0; j < G; j++, m++) {
        off.set([gauss() * 0.16, cy + gauss() * 0.1, cz + gauss() * 0.1], m * 3)
        ph[m] = phase; k1[m] = a1; k2[m] = a2; sd[m] = rnd()
      }
    }
    g.add(points(geometry(n, { aOff: [off, 3], aPhase: [ph, 1], aKeep1: [k1, 1], aKeep2: [k2, 1], aSeed: [sd, 1] }), mat))
  }
  // the gates: a ring of grains round the lane at each
  {
    const per = 700, n = per * 2, pos = new Float32Array(n * 3), sd = new Float32Array(n), gi = new Float32Array(n)
    for (let k = 0; k < 2; k++) for (let i = 0; i < per; i++) {
      const a = Math.random() * Math.PI * 2, r = lane * 1.7 + gauss() * 0.06, m = k * per + i
      pos.set([(gates[k] ?? 1e6) + gauss() * 0.05, r * Math.cos(a), r * Math.sin(a)], m * 3); sd[m] = Math.random(); gi[m] = k
    }
    const gm = material(GATE_VERT, { ...shared, uSize: { value: 0.9 }, uColor: { value: color } })   // light blue: white is ours alone
    Object.assign(gm.uniforms, { uTime: u.uTime, uPixelRatio: u.uPixelRatio, uShow: u.uShow, uG1T: u.uG1T, uG2T: u.uG2T })
    g.add(points(geometry(n, { position: pos, aSeed: [sd, 1], aGate: [gi, 1] }), gm))
  }
  // the disk buffer before the second gate: a slow disc of grains round the lane
  let bm = null
  if (o.buffer) {
    const B = o.buffer, n = B.grains ?? 5000, pos = new Float32Array(n * 3), sd = new Float32Array(n), rr = new Float32Array(n), aa = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      pos.set([B.at + gauss() * (B.depth ?? 1.4), 0, 0], i * 3); rr[i] = lane * 1.2 + Math.sqrt(Math.random()) * (B.r ?? 3.2); aa[i] = Math.random() * 6.283; sd[i] = Math.random()
    }
    bm = material(BUF_VERT, { uShow: u.uShow, uOn: { value: 0 }, uSize: { value: 1.0 }, uColor: { value: color } })
    Object.assign(bm.uniforms, { uTime: u.uTime, uPixelRatio: u.uPixelRatio, uShow: u.uShow })
    g.add(points(geometry(n, { position: pos, aSeed: [sd, 1], aR: [rr, 1], aA: [aa, 1] }), bm))
  }
  // ours: a white packet, a bright core and a few grains round it
  const om = material(OURS_VERT, { uShow: { value: 0 }, uSize: { value: 1.1 }, uAt: { value: new Vector3() }, uColor: { value: hot } })
  Object.assign(om.uniforms, { uTime: u.uTime, uPixelRatio: u.uPixelRatio })
  {
    const n = 60, pos = new Float32Array(n * 3), sd = new Float32Array(n)
    for (let i = 1; i < n; i++) { pos.set([gauss() * 0.14, gauss() * 0.14, gauss() * 0.14], i * 3); sd[i] = Math.random() }
    g.add(points(geometry(n, { position: pos, aSeed: [sd, 1] }), om))
  }
  const ours = o.ours || [o.from]
  const oursAt = (k) => ours[Math.max(0, Math.min(ours.length - 1, k))]
  const s = stepper(o.name)
  let now = 0, show = 0, x0 = oursAt(s.step), x1 = x0, gT = now, bufOn = 0
  const glide = o.glide ?? 3.5
  const apply = () => {
    const k = s.step, jump = Math.abs(k - s.prev) > 1
    u.uG1T.value = k >= 2 ? (u.uG1T.value < 1e8 && !jump ? u.uG1T.value : jump ? now - 100 : now) : 1e9
    u.uG2T.value = k >= 3 ? (u.uG2T.value < 1e8 && !jump ? u.uG2T.value : jump ? now - 100 : now) : 1e9
    const cur = x0 + (x1 - x0) * Math.min(1, (now - gT) / glide)
    x0 = jump ? oursAt(k) : cur; x1 = oursAt(k); gT = now
  }
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => show > 0 && show < 1 },
    update(t) {
      const dt = Math.min(Math.max(t - now, 0), 0.1); now = t; u.uTime.value = t
      if (s.fresh) { s.fresh = false; apply() }
      const want = s.step > 0 ? 1 : 0
      show += Math.sign(want - show) * Math.min(Math.abs(want - show), dt / 1.2); u.uShow.value = show
      bufOn += ((s.step >= 3 ? 1 : 0) - bufOn) * Math.min(1, dt * 1.5); if (bm) bm.uniforms.uOn.value = bufOn
      const f = Math.min(1, (t - gT) / glide), e = f * f * (3 - 2 * f)
      om.uniforms.uAt.value.set(x0 + (x1 - x0) * e, 0, 0); om.uniforms.uShow.value = show
    },
    dispose: s.off,
  }
}

// ---- grid ------------------------------------------------------------------------------
//   { type: grid, name, pos, store?: 2.6 (radius), sites?: 42, radius?: 24, flat?: 0.32,
//     vilnius: [x, y, z], thread?: 160 (grains a thread), color?, hot? }
// Step 1: the store gathers; 2: the sites and their threads light, packets running out;
// 3: the thread to Vilnius turns white, Vilnius with it.
const GRID_VERT = PLACE + /* glsl */ `
attribute float aSeed, aKind, aSite, aU;
attribute vec3 aEnd, aBow;
uniform float uStoreT, uSitesT, uVilT, uHideT, uSize;
uniform vec3 uColor, uHot;
void main() {
  float fade = uHideT > 1e8 ? 1.0 : 1.0 - smoothstep(0.0, 1.2, uTime - uHideT);
  vec3 p = position, col = uColor; float a = 0.0, size = uSize;
  bool vil = aSite < 0.5;
  if (aKind < 0.5) {            // the store: grains gathering from far out into a ball
    float g = ease((uTime - uStoreT - aSeed * 1.2) / 2.4);
    p = mix(position * 6.0 + vec3(0.0, 0.0, 0.0), position, g);
    a = 0.55 * g * (0.5 + 0.5 * hash(aSeed * 7.0));
    col = mix(uColor, uHot, 0.35);
  } else if (aKind < 1.5) {     // a site: a small cloud at the thread's end
    float on = smoothstep(0.0, 1.0, uTime - uSitesT - aU * 1.5);
    p = aEnd + position;
    a = 0.6 * on;
    if (vil) { float w = smoothstep(0.0, 1.0, uTime - uVilT - 2.2); col = mix(uColor, uHot, w); a *= 1.0 + 0.8 * w; size *= 1.0 + 0.6 * w; }
  } else {                      // a thread: grains running out from the store to its site, bowed
    float grow = smoothstep(0.0, 1.5, uTime - uSitesT);
    float u = fract(aU + uTime * 0.12);
    vec3 q = mix(mix(vec3(0.0), aBow, u), mix(aBow, aEnd, u), u);
    p = q + position * 0.6;
    a = 0.3 * grow * step(u, grow) * (0.5 + 0.5 * hash(aSeed * 3.0));
    if (vil) { float w = smoothstep(0.0, 1.0, uTime - uVilT); col = mix(uColor, uHot, w); a *= 1.0 + 1.5 * w; }
  }
  place(p, size, a * fade, col, aSeed);
}`

function buildGrid(o, ctx) {
  const g = new Group(); g.position.set(...at3(o.pos))
  const N = o.sites ?? 42, R = o.radius ?? 24, flat = o.flat ?? 0.32, rS = o.store ?? 2.6, TH = o.thread ?? 160
  const rnd = mulberry(42)
  const ends = []
  ends.push(o.vilnius || [R * 0.8, R * 0.12, R * 0.35])
  for (let i = 1; i < N; i++) {
    const y = 1 - 2 * (i + 0.5) / N, r = Math.sqrt(1 - y * y), th = i * 2.39996
    const k = R * (0.7 + 0.45 * rnd())
    ends.push([Math.cos(th) * r * k, y * k * flat, Math.sin(th) * r * k])
  }
  const STORE = 7000, CLOUD = 120
  const n = STORE + N * CLOUD + N * TH
  const pos = new Float32Array(n * 3), end = new Float32Array(n * 3), bow = new Float32Array(n * 3)
  const sd = new Float32Array(n), kind = new Float32Array(n), site = new Float32Array(n), uu = new Float32Array(n)
  let m = 0
  for (let i = 0; i < STORE; i++, m++) {
    const d = new Vector3(gauss(), gauss(), gauss()).normalize().multiplyScalar(rS * Math.cbrt(Math.random()))
    pos.set([d.x, d.y, d.z], m * 3); sd[m] = Math.random(); kind[m] = 0; site[m] = 99
  }
  for (let s = 0; s < N; s++) {
    const e = ends[s], b = [e[0] * 0.5 + gauss() * R * 0.08, e[1] * 0.5 + R * 0.1, e[2] * 0.5 + gauss() * R * 0.08]
    const order = rnd()
    for (let i = 0; i < CLOUD; i++, m++) {
      pos.set([gauss() * 0.35, gauss() * 0.35, gauss() * 0.35], m * 3); end.set(e, m * 3); sd[m] = Math.random(); kind[m] = 1; site[m] = s; uu[m] = order
    }
    for (let i = 0; i < TH; i++, m++) {
      pos.set([gauss() * 0.08, gauss() * 0.08, gauss() * 0.08], m * 3); end.set(e, m * 3); bow.set(b, m * 3)
      sd[m] = Math.random(); kind[m] = 2; site[m] = s; uu[m] = i / TH
    }
  }
  const mat = material(GRID_VERT, {
    uStoreT: { value: 1e9 }, uSitesT: { value: 1e9 }, uVilT: { value: 1e9 }, uHideT: { value: 1e9 }, uSize: { value: o.size ?? 1 },
    uColor: { value: new Color(...rgb(o.color || '#9cc4ff')) }, uHot: { value: new Color(...rgb(o.hot || '#ffffff')) },
  })
  const u = mat.uniforms
  g.add(points(geometry(n, { position: pos, aEnd: [end, 3], aBow: [bow, 3], aSeed: [sd, 1], aKind: [kind, 1], aSite: [site, 1], aU: [uu, 1] }), mat))
  const s = stepper(o.name)
  let now = 0
  const apply = () => {
    const k = s.step, jump = Math.abs(k - s.prev) > 1
    const set = (key, on) => { u[key].value = on ? (u[key].value < 1e8 ? u[key].value : jump ? now - 100 : now) : 1e9 }
    if (k <= 0) { u.uHideT.value = now; return }
    u.uHideT.value = 1e9
    set('uStoreT', k >= 1); set('uSitesT', k >= 2); set('uVilT', k >= 3)
  }
  const anchors = new Map([['vilnius', new Vector3(...ends[0])], ['store', new Vector3(0, 0, 0)]])
  return {
    group: g, labels: [], anchors, frameScale: u.uPixelRatio,
    update(t) {
      now = t; u.uTime.value = t
      if (s.fresh) { s.fresh = false; apply() }
      if (s.step <= 0 && u.uHideT.value < 1e8 && t - u.uHideT.value > 1.3) { u.uStoreT.value = 1e9; u.uSitesT.value = 1e9; u.uVilT.value = 1e9 }
    },
    dispose: s.off,
  }
}

// ---- spark -----------------------------------------------------------------------------
//   { type: spark, name, pos, steps: [null | { at: [x, y, z], from?: [x, y, z], glide?: s }, …],
//     size?: 1, color? }
const SPARK_VERT = /* glsl */ `
attribute float aSeed;
uniform float uTime, uPixelRatio, uShow, uSize;
uniform vec3 uAt, uColor;
varying vec3 vColor; varying float vAlpha;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
void main() {
  float core = step(length(position), 0.0001);
  vec3 p = uAt + position * (1.0 + 0.2 * sin(uTime * 1.7 + aSeed * 6.0));
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float pulse = 0.85 + 0.15 * sin(uTime * 2.4);
  gl_PointSize = min(uPixelRatio * uSize * (core > 0.5 ? 5.0 : 1.2) * (72.0 / max(-mv.z, 0.05)), 220.0 * uPixelRatio);
  vColor = uColor;
  vAlpha = uShow * (core > 0.5 ? pulse : 0.35 * (0.5 + 0.5 * hash(aSeed * 4.0)));
}`
const SPARK_FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (exp(-d * d * 28.0) + 0.25 * exp(-d * d * 6.0)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

function buildSpark(o, ctx) {
  const g = new Group(); g.position.set(...at3(o.pos))
  const mat = material(SPARK_VERT, { uShow: { value: 0 }, uSize: { value: o.size ?? 1 }, uAt: { value: new Vector3() }, uColor: { value: new Color(...rgb(o.color || '#ffffff')) } })
  mat.fragmentShader = SPARK_FRAG
  const u = mat.uniforms
  const n = 90, pos = new Float32Array(n * 3), sd = new Float32Array(n)
  for (let i = 1; i < n; i++) { pos.set([gauss() * 0.05, gauss() * 0.05, gauss() * 0.05], i * 3); sd[i] = Math.random() }
  g.add(points(geometry(n, { position: pos, aSeed: [sd, 1] }), mat))
  const steps = o.steps || [null, { at: [0, 0, 0] }]
  const of = (k) => steps[Math.max(0, Math.min(steps.length - 1, k))]
  const s = stepper(o.name)
  let now = 0, show = 0, from = new Vector3(), to = new Vector3(), t0 = -1e9, glide = 0.01
  const apply = () => {
    const st = of(s.step), jump = Math.abs(s.step - s.prev) > 1
    if (!st) return
    const cur = u.uAt.value.clone()
    to.set(...st.at)
    from.set(...(st.from || (show > 0.05 ? [cur.x, cur.y, cur.z] : st.at)))
    // a step with a `from` always plays its move (the dot falling into its bin, however the slide was reached); one without moves on from where it stands
    glide = st.from ? st.glide ?? 2.5 : jump || show < 0.05 ? 0.01 : st.glide ?? 2.5; t0 = now
  }
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { busy: () => now - t0 < glide },
    update(t) {
      const dt = Math.min(Math.max(t - now, 0), 0.1); now = t; u.uTime.value = t
      if (s.fresh) { s.fresh = false; apply() }
      const want = of(s.step) ? 1 : 0
      show += Math.sign(want - show) * Math.min(Math.abs(want - show), dt / 0.8); u.uShow.value = show
      const f = Math.min(1, Math.max(0, (t - t0) / glide)), e = f * f * (3 - 2 * f)
      u.uAt.value.lerpVectors(from, to, e)
    },
    dispose: s.off,
  }
}

let EVENT = null
export function installRoute(registerBuilder, { event } = {}) {
  EVENT = event || null
  registerBuilder('detector', buildDetector, { fields: ['pos', 'name'] })
  registerBuilder('stream', buildStream, { fields: ['pos', 'name', 'from', 'to'] })
  registerBuilder('grid', buildGrid, { fields: ['pos', 'name'] })
  registerBuilder('spark', buildSpark, { fields: ['pos', 'name'] })
}
