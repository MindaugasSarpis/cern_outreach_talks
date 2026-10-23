import { Group, Points, BufferGeometry, BufferAttribute, Color, Vector3 } from 'three'
import { state, listen, material, PLACE } from './grains.js'

// ---- triplet ------------------------------------------------------------------------
//   { type: triplet, name, pos, spread?: 2.4 (the triangle's radius), radius?: 1 (a quark's),
//     colors?: ['#…' × 3] (top, lower left, lower right), grains?: 700 per quark,
//     gluon?: 420 per gluon, loops?: 3, size?: 1.7, alpha?: 0.5, gluonSize?: 1.1,
//     gluonAlpha?: 0.55, delay?: 0.9 (s from the step to the first grain moving), dur?: 2.4 }
// A particle of three quarks, drawn as the colour-charge picture: three balls of
// grains (red, green and blue tones, softened for the palette) in a triangle that
// faces the camera, held by gluons, each a short curl of grains from one ball to
// the next (a Feynman gluon's loops) in the two balls' colours. Everything breathes
// gently: the balls swell and settle, each gluon's curl tightens and loosens, and a
// wave of light runs along it. Here the Ωc⁰ beside its spectrum (slide 12's click).
// Steps: 0 nothing; 1 the balls gather out of a loose cloud, then the gluons draw in
// from both ends. Going back to 0 fades it out in half a second. On arrival at step 1
// (a slide entered at its click) it gathers again, unless it gathered under 5 s ago.
// The triangle never turns, so HTML labels projected from a pose stay on the balls.
const VERT = /* glsl */ `
attribute vec3 aOff, aScat;
attribute float aSeed, aKind, aA, aB, aT;   // kind 0: a grain of quark aA; 1: a grain of the gluon aA → aB at aT
uniform vec3 uN[3];
uniform vec3 uCol[3];
uniform float uShow, uFade, uR, uSize, uAlpha, uGSize, uGAlpha, uLoops;
${PLACE}
void main() {
  int ia = int(aA + 0.5), ib = int(aB + 0.5);
  float show = clamp(uShow, 0.0, 1.0);
  vec3 p; vec3 color; float alpha, size;
  if (aKind < 0.5) {
    // the quark: a ball that breathes, its grains turning slowly inside it
    float breath = 1.0 + 0.05 * sin(uTime * 1.3 + aA * 2.1);
    vec3 c = uN[ia] + 0.04 * uR * vec3(sin(uTime * 0.7 + aA), cos(uTime * 0.6 + aA * 1.7), 0.0);
    vec3 home = c + turnY(aOff, uTime * (0.15 + 0.25 * hash(aSeed * 5.0))) * uR * breath;
    // gathering: each grain comes in from the loose cloud at its own moment
    float g = ease((show * 1.45 - 0.45 * hash(aSeed * 9.0)) / 0.9);
    p = mix(c + aScat * uR * 4.0, home, g);
    color = mix(uCol[ia], vec3(1.0), 0.18 * hash(aSeed * 7.0));
    alpha = uAlpha * (0.25 + 0.75 * g) * smoothstep(0.0, 0.15, show * 1.45 - 0.45 * hash(aSeed * 9.0));
    size = uSize * (0.75 + 0.6 * hash(aSeed * 23.0));
  } else {
    // the gluon: a curl of loops from one ball's edge to the other's
    vec3 a = uN[ia], b = uN[ib];
    vec3 d = normalize(b - a);
    vec3 n = vec3(-d.y, d.x, 0.0);
    float len = length(b - a) - 1.7 * uR;
    vec3 a0 = a + d * 0.85 * uR;
    float w = sin(uTime * 1.1 + aA * 1.9 + aB);
    float r = uR * 0.24 * (1.0 + 0.12 * w);                       // the curl's radius, breathing
    float th = 6.2832 * uLoops * aT - uTime * 1.6;                  // the loops turn on: the curl seems to flow
    float along = aT * len - r * 0.85 * sin(th);                    // > len / (2π loops): it loops back on itself
    p = a0 + d * along + n * r * cos(th) + vec3(0.0, 0.0, r * 0.5 * sin(th)) + aOff * 0.035 * uR;
    // drawn in from both ends once the balls have gathered
    float draw = clamp((show - 0.55) / 0.4, 0.0, 1.0);
    float edge = 1.0 - 1.1 * draw;
    float vis = smoothstep(edge, edge + 0.08, abs(aT - 0.5) * 2.0);
    float wave = 0.75 + 0.25 * sin(6.2832 * aT * 1.5 - uTime * 2.2 + aA);   // a wave of light along it
    color = mix(mix(uCol[ia], uCol[ib], aT), vec3(1.0), 0.3);
    alpha = uGAlpha * vis * wave * smoothstep(0.0, 0.06, aT) * (1.0 - smoothstep(0.94, 1.0, aT));
    size = uGSize * (0.8 + 0.4 * hash(aSeed * 13.0));
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

function buildTriplet(o, ctx) {
  const rho = o.spread ?? 2.4, R = o.radius ?? 1
  const c30 = Math.cos(Math.PI / 6)
  const nodes = [[0, rho, 0], [-rho * c30, -rho / 2, 0], [rho * c30, -rho / 2, 0]]
  const cols = o.colors || ['#ff8378', '#72e09c', '#7fa6ff']
  const per = Math.round(o.grains ?? 700), gl = Math.round(o.gluon ?? 420)
  const pairs = [[0, 1], [1, 2], [2, 0]]
  const N = 3 * per + pairs.length * gl
  const aOff = new Float32Array(N * 3), aScat = new Float32Array(N * 3)
  const aSeed = new Float32Array(N), aKind = new Float32Array(N), aA = new Float32Array(N), aB = new Float32Array(N), aT = new Float32Array(N)
  let n = 0
  for (let k = 0; k < 3; k++) for (let i = 0; i < per; i++, n++) {
    // denser toward the edge, so the middle stays calm enough for the label on it;
    // one grain in ten a faint halo just outside
    const u = unit(), r = rnd() < 0.1 ? 1 + 0.25 * rnd() : 0.35 + 0.65 * Math.pow(rnd(), 0.6)
    aOff.set([u[0] * r, u[1] * r, u[2] * r], n * 3)
    const s = unit(), sr = 0.5 + rnd()
    aScat.set([s[0] * sr, s[1] * sr, s[2] * sr], n * 3)
    aSeed[n] = rnd(); aKind[n] = 0; aA[n] = k; aB[n] = k
  }
  for (const [a, b] of pairs) for (let i = 0; i < gl; i++, n++) {
    const u = unit()
    aOff.set(u, n * 3)
    aSeed[n] = rnd(); aKind[n] = 1; aA[n] = a; aB[n] = b; aT[n] = (i + rnd()) / gl
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3))
  for (const [k, arr, sz] of [['aOff', aOff, 3], ['aScat', aScat, 3], ['aSeed', aSeed, 1], ['aKind', aKind, 1], ['aA', aA, 1], ['aB', aB, 1], ['aT', aT, 1]]) geo.setAttribute(k, new BufferAttribute(arr, sz))
  const mat = material(VERT, {
    uN: { value: nodes.map((p) => new Vector3(...p)) },
    uCol: { value: cols.map((c) => new Color(c)) },
    uShow: { value: 0 }, uFade: { value: 0 }, uR: { value: R }, uLoops: { value: o.loops ?? 3 },
    uSize: { value: o.size ?? 1.7 }, uAlpha: { value: o.alpha ?? 0.5 },
    uGSize: { value: o.gluonSize ?? 1.1 }, uGAlpha: { value: o.gluonAlpha ?? 0.55 },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const u = mat.uniforms
  const delay = o.delay ?? 0.9, dur = o.dur ?? 2.4
  // on: shown; t0: when the gather starts; off: when the fade out started
  let now = 0, step = 0, on = false, t0 = -100, off = -100, played = -100
  const gather = (wait = delay) => { on = true; t0 = now + wait; played = now }
  const go = (k, { instant = false } = {}) => {
    step = k
    if (k >= 1) { if (!on) gather(instant ? -100 : delay) }
    else if (on) { on = false; off = instant ? now - 100 : now }
  }
  const unlisten = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', unlisten)
  // a step set before the build is kept; the form waits for the station's assembly
  if (state.has(o.name)) step = state.get(o.name)
  const api = {
    arm() {},
    assemble(t, onDone) {
      now = t
      if (step >= 1 && now - played > 5) gather(0.3)
      onDone?.()
    },
    // still gathering (the headless tools' settle waits for it)
    busy: () => on && now < t0 + dur,
  }
  return {
    group: g, labels: [], api, frameScale: u.uPixelRatio,
    update(t) {
      now = t; u.uTime.value = t
      if (on) {
        u.uShow.value = Math.min(Math.max((now - t0) / dur, 0), 1)
        u.uFade.value = now >= t0 ? 1 : 0
      } else {
        u.uFade.value = Math.max(0, 1 - (now - off) / 0.5)
        if (u.uFade.value <= 0) u.uShow.value = 0
      }
    },
    dispose: unlisten,
  }
}

export function installTriplet(registerBuilder) {
  registerBuilder('triplet', buildTriplet, { fields: ['pos', 'name'] })
}
