import { Group, Points, BufferGeometry, BufferAttribute, Color, Vector3, Vector4 } from 'three'
import { material, PLACE } from './grains.js'

// ---- interior -----------------------------------------------------------------------------------------------
//   { type: interior, kind: molecule | compact | hadroquarkonium, pos, quark?: 0.46 (a quark's radius),
//     grains?: 1500 a quark, shell?: 4200 a shell, exchange?: 220, size?: 1.7, alpha?: 0.6 }
// Slide 14's three pictures of the pentaquark (12 Nov, the owner: "14 should be more dynamic, molecule rotating
// around eachother indicate some interaction in the middle, the other ones the shell is too static"). They were
// five of the hadron plugin's `pentaquark` forms, standing still. Here every quark moves and every skin lives:
//   molecule         a baryon (c u d) and a meson (c̄ u), each in its own skin, circling their common middle; between
//                    them a stream of grains goes over and back along a bowed path, what they exchange;
//   compact          the five quarks in one skin, each on its own loop inside it;
//   hadroquarkonium  the c c̄ pair circling close in a small skin of its own, the three light quarks on wide loops
//                    round it inside the large one.
// A skin is a sphere of grains whose radius ripples (two travelling waves over it) and whose grains drift round
// it. A quark is a ball of grains with a hot core, as the cover's. No steps: the forms stand as soon as they
// are built. u light blue, d cyan, c rose, c̄ violet (the finale's tints, toward the globe's blue).
const COL = { u: '#7fa6ff', d: '#6fe6f0', c: '#ff8f9a', cbar: '#c9a0ff' }
const VERT = /* glsl */ `
attribute vec3 aOff;
attribute float aSeed, aKind, aA;   // kind 0: a quark's grain (of quark aA); 1: a skin's grain (of skin aA); 2: an exchanged grain
uniform vec3 uN[5];
uniform vec3 uCol[5];
uniform float uRq;
uniform vec4 uSh[2];                // a skin: its middle and its radius
uniform vec3 uEx0, uEx1;            // the exchange's two ends
uniform float uSize, uAlpha;
${PLACE}
void main() {
  int ia = int(aA + 0.5);
  vec3 p, color; float alpha, size;
  if (aKind < 0.5) {
    vec3 c = uN[0]; vec3 col = uCol[0];
    for (int m = 1; m < 5; m++) if (m == ia) { c = uN[m]; col = uCol[m]; }
    float breath = 1.0 + 0.06 * sin(uTime * 1.3 + aA * 2.1);
    p = c + turnY(aOff, uTime * (0.2 + 0.3 * hash(aSeed * 5.0))) * uRq * breath;
    float rr = length(aOff);
    float core = 1.0 - smoothstep(0.0, 0.4, rr);
    color = mix(col, vec3(1.0), 0.6 * core + 0.1 * hash(aSeed * 7.0));
    alpha = uAlpha * (0.6 + 0.8 * core);
    size = uSize * (1.0 + 0.6 * core);
  } else if (aKind < 1.5) {
    vec4 sh = ia == 0 ? uSh[0] : uSh[1];
    // the grain drifts round the skin, and the skin's radius ripples under it
    vec3 d = turnY(normalize(aOff), uTime * 0.25 * (hash(aSeed * 3.0) - 0.5) * 2.0);
    float rip = 0.075 * sin(uTime * 1.5 + d.x * 4.0 + d.y * 2.5 + aA * 1.7) + 0.05 * sin(uTime * 0.9 - d.z * 5.0 + d.y * 3.0);
    p = sh.xyz + d * sh.w * (1.0 + rip);
    // brighter where the ripple stands out, so the skin is seen to move
    color = mix(vec3(0.45, 0.68, 1.0), vec3(0.8, 0.92, 1.0), smoothstep(-0.05, 0.1, rip));
    alpha = uAlpha * (0.34 + 0.7 * smoothstep(0.0, 0.12, rip));
    size = uSize * 0.8;
  } else {
    // an exchanged grain: over (even seeds) or back (odd), along a path bowed to its own side
    float dir = hash(aSeed * 11.0) < 0.5 ? 1.0 : -1.0;
    float tt = fract(aSeed * 7.0 + dir * uTime * 0.42);
    vec3 a = uEx0, b = uEx1, ax = normalize(b - a);
    vec3 n = normalize(cross(ax, vec3(0.0, 1.0, 0.0)) + vec3(1e-4)), m = cross(ax, n);
    float bow = sin(3.14159 * tt);
    float ang = 6.2832 * hash(aSeed * 19.0);
    p = mix(a, b, tt) + (n * cos(ang) + m * sin(ang)) * bow * (0.25 + 0.55 * hash(aSeed * 23.0)) * max(length(b - a), 1.2) * 0.5;
    color = mix(vec3(0.7, 0.88, 1.0), vec3(1.0), 0.5 * bow);
    alpha = uAlpha * 0.9 * bow;
    size = uSize * (0.9 + 0.5 * bow);
  }
  place(p, size, alpha, color, aSeed);
}`
const inBall = () => { for (;;) { const v = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1]; if (v[0] * v[0] + v[1] * v[1] + v[2] * v[2] <= 1) return v } }
const onSphere = () => { const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z); return [q * Math.cos(ph), z, q * Math.sin(ph)] }

// each kind: its quarks, its skins, and how they move at world time t (set → the uniforms)
const KINDS = {
  molecule: {
    quarks: ['c', 'u', 'd', 'cbar', 'u'], skins: 2, exchange: true,
    move(t, N, S, E) {
      // the two circle their middle in a plane tipped towards the viewer; the baryon, heavier, on the smaller circle
      const a = t * 0.38, tip = 0.42
      const A = [-1.35 * Math.cos(a), 1.35 * Math.sin(a) * Math.sin(tip) * -1, -1.35 * Math.sin(a) * Math.cos(tip)]
      const B = [1.75 * Math.cos(a), 1.75 * Math.sin(a) * Math.sin(tip), 1.75 * Math.sin(a) * Math.cos(tip)]
      for (let i = 0; i < 3; i++) { const b = t * 0.9 + i * 2.094; N[i].set(A[0] + 0.72 * Math.cos(b), A[1] + 0.72 * Math.sin(b) * 0.8, A[2] + 0.5 * Math.sin(b * 0.7 + i)) }
      for (let i = 0; i < 2; i++) { const b = -t * 1.3 + i * Math.PI; N[3 + i].set(B[0] + 0.55 * Math.cos(b), B[1] + 0.3 * Math.sin(b), B[2] + 0.45 * Math.sin(b)) }
      S[0].set(A[0], A[1], A[2], 1.5); S[1].set(B[0], B[1], B[2], 1.15)
      const d = [B[0] - A[0], B[1] - A[1], B[2] - A[2]], L = Math.hypot(...d)
      E[0].set(A[0] + d[0] / L * 1.1, A[1] + d[1] / L * 1.1, A[2] + d[2] / L * 1.1); E[1].set(B[0] - d[0] / L * 0.85, B[1] - d[1] / L * 0.85, B[2] - d[2] / L * 0.85)
    },
  },
  compact: {
    quarks: ['c', 'u', 'd', 'u', 'cbar'], skins: 1,
    move(t, N, S) {
      for (let i = 0; i < 5; i++) {
        const w = 0.5 + 0.13 * i, ph = i * 1.257
        N[i].set(1.15 * Math.cos(t * w + ph) * Math.cos(0.5 * i), 1.05 * Math.sin(t * w * 0.9 + ph * 1.7), 1.15 * Math.sin(t * w + ph) * Math.cos(0.4 * i + 0.3))
      }
      S[0].set(0, 0, 0, 2.15); S[1].set(0, 0, 0, 0)
    },
  },
  hadroquarkonium: {
    quarks: ['c', 'cbar', 'u', 'u', 'd'], skins: 2,
    move(t, N, S) {
      const a = t * 1.5
      N[0].set(0.42 * Math.cos(a), 0.14 * Math.sin(a), 0.42 * Math.sin(a)); N[1].set(-0.42 * Math.cos(a), -0.14 * Math.sin(a), -0.42 * Math.sin(a))
      for (let i = 0; i < 3; i++) {
        const b = t * (0.42 + 0.07 * i) + i * 2.094, tilt = 0.5 + 0.9 * i
        N[2 + i].set(1.75 * Math.cos(b), 1.75 * Math.sin(b) * Math.sin(tilt), 1.75 * Math.sin(b) * Math.cos(tilt))
      }
      S[0].set(0, 0, 0, 2.55); S[1].set(0, 0, 0, 0.85)
    },
  },
}

function buildInterior(o) {
  const K = KINDS[o.kind] || KINDS.compact
  const per = Math.round(o.grains ?? 1500), perSkin = Math.round(o.shell ?? 4200), nEx = K.exchange ? Math.round(o.exchange ?? 220) : 0
  const N = 5 * per + K.skins * perSkin + nEx
  const aOff = new Float32Array(N * 3), aSeed = new Float32Array(N), aKind = new Float32Array(N), aA = new Float32Array(N)
  let n = 0
  const put = (off, kind, a) => { aOff.set(off, n * 3); aSeed[n] = Math.random(); aKind[n] = kind; aA[n] = a; n++ }
  for (let q = 0; q < 5; q++) for (let i = 0; i < per; i++) { const v = inBall(), r = Math.pow(Math.random(), 0.6); put(v.map((x) => x * r), 0, q) }
  for (let s = 0; s < K.skins; s++) for (let i = 0; i < perSkin; i++) put(onSphere(), 1, s)
  for (let i = 0; i < nEx; i++) put([0, 0, 0], 2, 0)
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3))
  for (const [k, arr, sz] of [['aOff', aOff, 3], ['aSeed', aSeed, 1], ['aKind', aKind, 1], ['aA', aA, 1]]) geo.setAttribute(k, new BufferAttribute(arr, sz))
  const uN = Array.from({ length: 5 }, () => new Vector3()), uSh = [new Vector4(), new Vector4()], uEx = [new Vector3(), new Vector3()]
  const mat = material(VERT, {
    uN: { value: uN }, uCol: { value: K.quarks.map((f) => new Color(COL[f])) }, uRq: { value: o.quark ?? 0.46 },
    uSh: { value: uSh }, uEx0: { value: uEx[0] }, uEx1: { value: uEx[1] },
    uSize: { value: o.size ?? 1.7 }, uAlpha: { value: o.alpha ?? 0.6 },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const u = mat.uniforms
  K.move(0, uN, uSh, uEx)
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    api: { arm() {}, assemble(t, onDone) { onDone?.() }, busy: () => false },
    update(t) { u.uTime.value = t; K.move(t, uN, uSh, uEx) },
    dispose() {},
  }
}

export function installInteriors(registerBuilder) {
  registerBuilder('interior', buildInterior, { fields: ['pos', 'kind'] })
}
