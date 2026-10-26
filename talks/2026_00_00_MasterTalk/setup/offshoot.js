import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color,
} from 'three'
import { onStep, stepOf } from 'slidev-addon-stage'
import { POINT_GLSL, viewScale } from './view.js'

// The master deck's inventions under spine A (notes/master.md, 27 Oct): each one
// grows out of the part of the route whose problem forced it. Innoday's `strands`
// cut down to one strand between two points: grains flowing on an arc from `from`
// (the part: the VELO, CERN's store) to `to` (the product), where a slow cluster
// stands and the slide's StagePhoto place stands with the invention's picture.
// Prototype on two slides (one sparse, one dense) for the owner before it spreads.
//
//   { type: offshoot, name, pos, from: [x,y,z], to: [x,y,z], grains?: 1400, node?: 600,
//     nodeRadius?: 0.5, lift?: 0.3, speed?: 0.12, size?: 1, alpha?: 0.55, color?: '#cfe2ff' }
//
// Step 0 hidden, 1 shown (a 1.5 s fade on the engine clock).
const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2 }
const VERT = /* glsl */ `
attribute float aSeed, aKind;          // 0 a grain on the way, 1 a grain of the end cluster
attribute vec3 aFrom, aEnd, aCtl, aOff;
uniform float uTime, uSpeed, uSize, uAlpha, uNodeR, uOn;
uniform vec3 uColor, uWhite;
varying vec3 vColor; varying float vAlpha;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
${POINT_GLSL}
void main() {
  vec3 p; float alpha; float size;
  if (aKind < 0.5) {
    float s = fract(aSeed * 7.31 + uSpeed * uTime);
    vec3 a = mix(aFrom, aCtl, s), b = mix(aCtl, aEnd, s);
    p = mix(a, b, s) + aOff * (0.35 + sin(s * 3.14159));
    alpha = uAlpha * smoothstep(0.0, 0.08, s) * (1.0 - smoothstep(0.88, 1.0, s));
    size = uSize * (0.7 + 0.7 * hash(aSeed * 13.0));
  } else {
    float w = uTime * (0.2 + 0.35 * hash(aSeed * 5.0));
    vec3 o = aOff * uNodeR;
    p = aEnd + vec3(cos(w) * o.x - sin(w) * o.z, o.y, sin(w) * o.x + cos(w) * o.z);
    alpha = uAlpha * 1.4;
    size = uSize * (0.9 + 0.9 * hash(aSeed * 29.0));
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.72 + 0.28 * sin(uTime * (1.1 + aSeed * 2.3) + aSeed * 40.0);
  float ps = uView * size * tw * (72.0 / max(-mv.z, 0.1));
  gl_PointSize = pointSize(ps, 48.0);
  vColor = mix(uColor, uWhite, 0.35 * hash(aSeed * 41.0) + (aKind > 0.5 ? 0.25 : 0.0));
  vAlpha = alpha * tw * uOn * coverage(ps);
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

function buildOffshoot(o) {
  const per = Math.round(o.grains ?? 1400), node = Math.round(o.node ?? 600), N = per + node
  const f = o.from || [0, 0, 0], e = o.to || [0, 5, 5]
  const len = Math.hypot(e[0] - f[0], e[1] - f[1], e[2] - f[2])
  const c = [(f[0] + e[0]) / 2, (f[1] + e[1]) / 2 + (o.lift ?? 0.3) * len, (f[2] + e[2]) / 2]
  const seed = new Float32Array(N), kind = new Float32Array(N)
  const from = new Float32Array(N * 3), end = new Float32Array(N * 3), ctl = new Float32Array(N * 3), off = new Float32Array(N * 3)
  const spread = o.spread ?? 0.06
  for (let n = 0; n < N; n++) {
    seed[n] = Math.random(); kind[n] = n < per ? 0 : 1
    from.set(f, n * 3); end.set(e, n * 3); ctl.set(c, n * 3)
    if (n < per) off.set([gauss() * spread * len * 0.1, gauss() * spread * len * 0.1, gauss() * spread * len * 0.1], n * 3)
    else {
      const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z), r = Math.cbrt(Math.random())
      off.set([r * q * Math.cos(ph), r * z * 0.8, r * q * Math.sin(ph)], n * 3)
    }
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(end.slice(), 3))
  for (const [k, a, sz] of [['aSeed', seed, 1], ['aKind', kind, 1], ['aFrom', from, 3], ['aEnd', end, 3], ['aCtl', ctl, 3], ['aOff', off, 3]]) geo.setAttribute(k, new BufferAttribute(a, sz))
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uView: { value: 1 },
      uSpeed: { value: o.speed ?? 0.12 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.55 },
      uNodeR: { value: o.nodeRadius ?? 0.5 }, uOn: { value: (stepOf(o.name) ?? 0) >= 1 ? 1 : 0 },
      uColor: { value: new Color(o.color || '#cfe2ff').convertLinearToSRGB() }, uWhite: { value: new Color(1, 1, 1) },
    },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  pts.onBeforeRender = (r) => { mat.uniforms.uView.value = viewScale(r) }
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  let goal = mat.uniforms.uOn.value, last = null
  const off_ = onStep(o.name, (k) => { goal = (k ?? 0) >= 1 ? 1 : 0 })
  return {
    group: g, labels: [],
    // busy while it fades in or out (the flow itself never stops, as Innoday's strands)
    api: { busy: () => Math.abs(goal - mat.uniforms.uOn.value) > 0.01 },
    update(t) {
      const u = mat.uniforms
      if (last != null) u.uOn.value += Math.sign(goal - u.uOn.value) * Math.min(Math.abs(goal - u.uOn.value), (t - last) / 1.5)
      last = t; u.uTime.value = t
      pts.visible = u.uOn.value > 0.002 || goal > 0
    },
    dispose() { off_(); geo.dispose(); mat.dispose() },
  }
}

export function installOffshoot(registerBuilder) {
  registerBuilder('offshoot', buildOffshoot, { fields: ['pos', 'name'] })
}
