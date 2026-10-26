// Užsikrauk karjerai's cover particle (26 Oct), on the kit's bus (kgrains.js), registered as
// `kpentaquark` (the kit's hadron plugin owns `pentaquark`); here the 1964 papers' five quarks.
import { Group, Points, BufferGeometry, BufferAttribute, Color, Vector3 } from 'three'
import { state, listen, material, PLACE } from './kgrains.js'

// ---- pentaquark ---------------------------------------------------------------------
//   { type: pentaquark, name, pos, spread?: 2.6, radius?: 0.95 (a light quark's), heavy?: 1.25 (the charm
//     quarks' radius, times radius), grains?: 1800 per quark, gluon?: 900 per gluon, loops?: 4, sea?: 5000,
//     bag?: 9000, size?: 1.5, alpha?: 0.45, gluonSize?: 1.1, gluonAlpha?: 0.6, spin?: 0.09 (rad/s),
//     delay?: 0.3, dur?: 2.8 }
// The cover's particle (the owner, 25 Oct: "the pentaquark should be much more detailed, spectacular";
// the five gold clusters before it did not read as quarks: "They are not quarks.. a bit confusing").
// LHCb's 2015 pentaquark, uudc c̄, in the colour-charge picture slide 10's Ωc⁰ uses (setup/triplet.js),
// in 3D: three light quarks (u red, u green, d blue: a colourless triangle) and the charm pair
// (c red, c̄ anti-red, cyan: a colourless pair), a little larger, each ball a hot core in a soft halo;
// seven gluons, curls of grains from ball to ball with light running along them (the triangle, the pair,
// and three across); the sea: quark–antiquark pairs that pop out of the gluons and vanish; and a faint
// skin of grains round it all, the bound particle. The whole turns slowly. Steps: 0 nothing (fades
// out); 1 or more, it gathers out of a loose cloud (the balls, then the gluons drawn in, then the sea and
// the skin). On arrival at a shown step it gathers again unless it did under 5 s ago.
const VERT = /* glsl */ `
attribute vec3 aOff, aScat;
attribute float aSeed, aKind, aA, aB, aT;   // kind 0 quark grain (of aA); 1 gluon grain (aA → aB at aT); 2 sea grain (on gluon aA → aB); 3 skin grain
uniform vec3 uN[5];
uniform vec3 uCol[5];
uniform float uRq[5];
uniform float uShow, uFade, uSize, uAlpha, uGSize, uGAlpha, uLoops, uSkin;
uniform vec3 uMid;
${PLACE}
vec3 perp(vec3 d) { vec3 n = cross(d, vec3(0.0, 1.0, 0.0)); if (dot(n, n) < 1e-4) n = cross(d, vec3(1.0, 0.0, 0.0)); return normalize(n); }
// a point on the gluon from quark ia to ib at t (0…1), its curl turning with time
vec3 gluon(int ia, int ib, float t, float seed, out float r) {
  vec3 a = uN[ia], b = uN[ib], d = normalize(b - a), n = perp(d), m = cross(d, n);
  float ra = uRq[ia], rb = uRq[ib];
  float len = length(b - a) - 0.85 * (ra + rb);
  vec3 a0 = a + d * 0.85 * ra;
  float w = sin(uTime * 1.1 + float(ia) * 1.9 + float(ib));
  r = 0.22 * min(ra, rb) * (1.0 + 0.12 * w);
  float th = 6.2832 * uLoops * t - uTime * 1.7;
  float along = t * len - r * 0.85 * sin(th);
  return a0 + d * along + n * r * cos(th) + m * r * sin(th);
}
void main() {
  int ia = int(aA + 0.5), ib = int(aB + 0.5);
  float show = clamp(uShow, 0.0, 1.0);
  vec3 p; vec3 color; float alpha, size;
  if (aKind < 0.5) {
    // a quark: a ball that breathes, its grains turning slowly inside it; a hot core
    float R = uRq[ia];
    float breath = 1.0 + 0.05 * sin(uTime * 1.3 + aA * 2.1);
    vec3 c = uN[ia];
    vec3 home = c + turnY(aOff, uTime * (0.15 + 0.25 * hash(aSeed * 5.0))) * R * breath;
    float g = ease((show * 1.6 - 0.6 * hash(aSeed * 9.0)) / 0.9);
    p = mix(uMid + aScat * 5.0, home, g);
    float rr = length(aOff);
    color = mix(uCol[ia], vec3(1.0), 0.55 * (1.0 - smoothstep(0.0, 0.35, rr)) + 0.12 * hash(aSeed * 7.0));
    alpha = uAlpha * (0.3 + 0.7 * g) * (rr > 1.0 ? 0.35 : 1.0) * smoothstep(0.0, 0.15, show * 1.6 - 0.6 * hash(aSeed * 9.0));
    size = uSize * (0.7 + 0.6 * hash(aSeed * 23.0)) * (rr < 0.3 ? 0.8 : 1.0);
  } else if (aKind < 1.5) {
    // a gluon: drawn in from both ends once the balls have gathered; a wave of light along it
    float r;
    p = gluon(ia, ib, aT, aSeed, r) + aOff * 0.03;
    float draw = clamp((show - 0.5) / 0.35, 0.0, 1.0);
    float edge = 1.0 - 1.1 * draw;
    float vis = smoothstep(edge, edge + 0.08, abs(aT - 0.5) * 2.0);
    float wave = 0.6 + 0.4 * pow(0.5 + 0.5 * sin(6.2832 * aT * 1.5 - uTime * 2.4 + aA * 1.3), 3.0);
    color = mix(mix(uCol[ia], uCol[ib], aT), vec3(1.0), 0.35);
    alpha = uGAlpha * vis * wave * smoothstep(0.0, 0.06, aT) * (1.0 - smoothstep(0.94, 1.0, aT));
    size = uGSize * (0.8 + 0.4 * hash(aSeed * 13.0));
  } else if (aKind < 2.5) {
    // the sea: a quark–antiquark pair born on a gluon, flying apart a little, gone (each grain is one of
    // the two; a new place on its gluon every cycle)
    float P = 1.8 + 1.4 * hash(aSeed * 3.1);
    float ph = uTime / P + hash(aSeed * 7.7);
    float cyc = floor(ph), life = fract(ph);
    float t = 0.15 + 0.7 * hash(aSeed * 1.3 + cyc * 0.37);
    float r;
    vec3 at = gluon(ia, ib, t, aSeed, r);
    vec3 dir = normalize(vec3(hash(aSeed + cyc * 2.1) - 0.5, hash(aSeed * 2.0 + cyc * 3.3) - 0.5, hash(aSeed * 3.0 + cyc * 1.1) - 0.5));
    p = at + dir * aT * 0.55 * life;   // aT here: ±1, which of the pair
    color = aT > 0.0 ? vec3(1.0, 0.92, 0.75) : vec3(0.75, 0.9, 1.0);
    alpha = 0.55 * uGAlpha * sin(3.14159 * life) * smoothstep(0.75, 1.0, show);
    size = uGSize * 0.9;
  } else {
    // the skin: a faint shell of grains round the particle, swirling slowly; its edge reads brighter
    float wob = 1.0 + 0.04 * sin(uTime * 0.8 + aSeed * 12.0);
    p = uMid + turnY(aOff, uTime * 0.05 + aSeed * 0.2) * uSkin * wob;
    color = vec3(0.78, 0.86, 1.0);
    alpha = 0.16 * smoothstep(0.8, 1.0, show);
    size = uSize * 0.8;
  }
  alpha *= uFade;
  if (alpha <= 0.002) { hide(); return; }
  place(p, size, alpha, color, aSeed);
}`

const rnd = () => Math.random()
const unit = () => {
  const z = 2 * rnd() - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - z * z)
  return [q * Math.cos(ph), z, q * Math.sin(ph)]
}

function buildPentaquark(o, ctx) {
  const S = o.spread ?? 2.6, R = o.radius ?? 0.95, H = R * (o.heavy ?? 1.25)
  // u, u, d (a triangle a little to the left and back) and c, c̄ (a pair to the right and front)
  const nodes = [[-0.55, 0.75, -0.35], [-0.95, -0.45, 0.15], [-0.1, -0.35, -0.75], [0.65, 0.3, 0.55], [0.95, -0.55, -0.05]].map((v) => v.map((x) => x * S))
  const radii = [R, R, R, H, H]
  const cols = o.colors || ['#ff8378', '#72e09c', '#7fa6ff', '#ff9d6b', '#6fe6f0']
  const per = Math.round(o.grains ?? 1800), gl = Math.round(o.gluon ?? 900), sea = Math.round(o.sea ?? 5000), skin = Math.round(o.bag ?? 9000)
  const pairs = [[0, 1], [1, 2], [2, 0], [3, 4], [0, 3], [2, 4], [1, 4]]
  const N = 5 * per + pairs.length * gl + sea + skin
  const aOff = new Float32Array(N * 3), aScat = new Float32Array(N * 3)
  const aSeed = new Float32Array(N), aKind = new Float32Array(N), aA = new Float32Array(N), aB = new Float32Array(N), aT = new Float32Array(N)
  let n = 0
  for (let k = 0; k < 5; k++) for (let i = 0; i < per; i++, n++) {
    // a core (one in six), the ball, and one in ten a halo just outside
    const u = unit(), q = rnd()
    const r = q < 0.16 ? 0.3 * Math.pow(rnd(), 0.7) : q < 0.9 ? 0.35 + 0.65 * Math.pow(rnd(), 0.6) : 1 + 0.35 * rnd()
    aOff.set([u[0] * r, u[1] * r, u[2] * r], n * 3)
    const s = unit(), sr = 0.4 + rnd()
    aScat.set([s[0] * sr, s[1] * sr, s[2] * sr], n * 3)
    aSeed[n] = rnd(); aKind[n] = 0; aA[n] = k; aB[n] = k
  }
  for (const [a, b] of pairs) for (let i = 0; i < gl; i++, n++) {
    aOff.set(unit(), n * 3)
    aSeed[n] = rnd(); aKind[n] = 1; aA[n] = a; aB[n] = b; aT[n] = (i + rnd()) / gl
  }
  for (let i = 0; i < sea; i++, n++) {
    const [a, b] = pairs[Math.floor(i / 2) % pairs.length]
    aSeed[n] = Math.floor(i / 2) * 0.6180339 % 1   // the two of a pair share a seed: same place, same cycle
    aKind[n] = 2; aA[n] = a; aB[n] = b; aT[n] = i % 2 ? 1 : -1
  }
  for (let i = 0; i < skin; i++, n++) {
    aOff.set(unit(), n * 3); aSeed[n] = rnd(); aKind[n] = 3
  }
  const mid = nodes.reduce((m, v) => m.map((x, i) => x + v[i] / 5), [0, 0, 0])
  const skinR = Math.max(...nodes.map((v, i) => Math.hypot(v[0] - mid[0], v[1] - mid[1], v[2] - mid[2]) + radii[i])) * 1.12
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3))
  for (const [k, arr, sz] of [['aOff', aOff, 3], ['aScat', aScat, 3], ['aSeed', aSeed, 1], ['aKind', aKind, 1], ['aA', aA, 1], ['aB', aB, 1], ['aT', aT, 1]]) geo.setAttribute(k, new BufferAttribute(arr, sz))
  const mat = material(VERT, {
    uN: { value: nodes.map((p) => new Vector3(...p)) },
    uCol: { value: cols.map((c) => new Color(c)) },
    uRq: { value: radii },
    uMid: { value: new Vector3(...mid) }, uSkin: { value: skinR },
    uShow: { value: 0 }, uFade: { value: 0 }, uLoops: { value: o.loops ?? 4 },
    uSize: { value: o.size ?? 1.5 }, uAlpha: { value: o.alpha ?? 0.45 },
    uGSize: { value: o.gluonSize ?? 1.1 }, uGAlpha: { value: o.gluonAlpha ?? 0.6 },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const spin = new Group(); spin.add(pts)
  spin.position.set(...mid); pts.position.set(-mid[0], -mid[1], -mid[2])   // it turns about its own middle
  const g = new Group(); g.add(spin)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const u = mat.uniforms
  const delay = o.delay ?? 0.3, dur = o.dur ?? 2.8
  let now = 0, step = 0, on = false, t0 = -100, off = -100, played = -100
  const gather = (wait = delay) => { on = true; t0 = now + wait; played = now }
  const go = (k, { instant = false } = {}) => {
    step = k
    if (k >= 1) { if (!on) gather(instant ? -100 : delay) }
    else if (on) { on = false; off = instant ? now - 100 : now }
  }
  const unlisten = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', unlisten)
  if (state.has(o.name)) step = state.get(o.name)
  const api = {
    arm() {},
    assemble(t, onDone) {
      now = t
      if (step >= 1 && now - played > 5) gather(0.3)
      onDone?.()
    },
    busy: () => on && now < t0 + dur,
  }
  return {
    group: g, labels: [], api, frameScale: u.uPixelRatio,
    update(t) {
      now = t; u.uTime.value = t
      spin.rotation.y = t * (o.spin ?? 0.09)
      spin.rotation.x = 0.18 * Math.sin(t * 0.05)
      if (on) {
        u.uShow.value = Math.min(Math.max((now - t0) / dur, 0), 1)
        u.uFade.value = now >= t0 ? 1 : 0
      } else {
        u.uFade.value = Math.max(0, 1 - (now - off) / 0.6)
        if (u.uFade.value <= 0) u.uShow.value = 0
      }
    },
    dispose: unlisten,
  }
}

export function installPentaquark(registerBuilder) {
  registerBuilder('kpentaquark', buildPentaquark, { fields: ['pos', 'name'] })
}
