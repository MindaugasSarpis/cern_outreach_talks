import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color,
} from 'three'

// Innoday's own world form, on the engine's stage (slidev-addon-stage):
//
//   strands  grains flowing from points on the LHC ring out to the inventions
//            each part forced (control room → touchscreen, detector → PET and
//            colour X-ray, magnets → superconducting line, …), each strand
//            ending in a small gold cluster: the product. Part II's photo
//            slides stand at these clusters, looking back down the strand to
//            the machine, so moving from one invention to the next swings
//            the camera round the ring and up the next strand.
//
// It is only a form in the world: how a photo arrives over it (StagePhoto's
// grains, a depth point cloud, a plain image) is the slide's business.
// Drawn like the engine's collider and galaxy: points of light, added together.
//
//   { type: strands, pos, center?: [x,y,z], radius: 7, reach?: 15, rise?: 3,
//     strands: [{ angle (deg, in the ring's plane), label? (ignored: no labels in this world) }, …],
//     grains?: 1600 per strand, node?: 700 per end cluster, nodeRadius?: 0.6,
//     speed?: 0.09 (strands a second), lift?: 0.35, color?: gold, size?: 1, alpha?: 0.5 }

// Part I shows the machine before anything has left it: the strands come on
// with Part II. <Strands :on="true|false" /> sets this when its slide becomes
// current; the last value is kept for a form built later.
let shown = false
export function setStrands(on) { shown = on }

const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2 }

const VERT = /* glsl */ `
attribute float aSeed, aKind;          // 0 a grain on the way, 1 a grain of the end cluster
attribute vec3 aFrom, aEnd, aCtl, aOff;
uniform float uTime, uPixelRatio, uSpeed, uSize, uAlpha, uNodeR, uOn;
uniform vec3 uColor, uWhite;
varying vec3 vColor; varying float vAlpha;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
void main() {
  vec3 p; float alpha; float size;
  if (aKind < 0.5) {
    // along a quadratic arc from the ring part out to the product, always flowing
    float s = fract(aSeed * 7.31 + uSpeed * uTime);
    vec3 a = mix(aFrom, aCtl, s), b = mix(aCtl, aEnd, s);
    p = mix(a, b, s) + aOff * (0.35 + sin(s * 3.14159));
    alpha = uAlpha * smoothstep(0.0, 0.08, s) * (1.0 - smoothstep(0.88, 1.0, s));
    size = uSize * (0.7 + 0.7 * hash(aSeed * 13.0));
  } else {
    // the product: a slow cluster of grains round the strand's end
    float w = uTime * (0.2 + 0.35 * hash(aSeed * 5.0));
    vec3 o = aOff * uNodeR;
    p = aEnd + vec3(cos(w) * o.x - sin(w) * o.z, o.y, sin(w) * o.x + cos(w) * o.z);
    alpha = uAlpha * 1.4;
    size = uSize * (0.9 + 0.9 * hash(aSeed * 29.0));
  }
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.72 + 0.28 * sin(uTime * (1.1 + aSeed * 2.3) + aSeed * 40.0);
  gl_PointSize = uPixelRatio * size * tw * (72.0 / max(-mv.z, 0.1));
  vColor = mix(uColor, uWhite, 0.35 * hash(aSeed * 41.0) + (aKind > 0.5 ? 0.25 : 0.0));
  vAlpha = alpha * tw * uOn;
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

// Where strand i starts (on the ring) and ends (the product), in the object's
// frame: the ring lies in the x–z plane round `center`.
export function strandEnds(o, angle) {
  const c = o.center || [0, 0, 0], r = o.radius ?? 7, R = o.reach ?? 15, rise = o.rise ?? 3
  const t = (angle * Math.PI) / 180, dx = Math.cos(t), dz = Math.sin(t)
  return {
    from: [c[0] + r * dx, c[1], c[2] + r * dz],
    to: [c[0] + R * dx, c[1] + rise, c[2] + R * dz],
  }
}

function buildStrands(o, ctx) {
  const list = o.strands || []
  const per = Math.round(o.grains ?? 1600), node = Math.round(o.node ?? 700)
  const N = list.length * (per + node)
  const seed = new Float32Array(N), kind = new Float32Array(N)
  const from = new Float32Array(N * 3), end = new Float32Array(N * 3), ctl = new Float32Array(N * 3), off = new Float32Array(N * 3)
  const spread = o.spread ?? 0.06
  let n = 0
  for (const s of list) {
    const { from: f, to: e } = strandEnds(o, s.angle ?? 0)
    const len = Math.hypot(e[0] - f[0], e[1] - f[1], e[2] - f[2])
    const c = [(f[0] + e[0]) / 2, (f[1] + e[1]) / 2 + (o.lift ?? 0.35) * len, (f[2] + e[2]) / 2]
    for (let k = 0; k < per + node; k++, n++) {
      seed[n] = Math.random(); kind[n] = k < per ? 0 : 1
      from.set(f, n * 3); end.set(e, n * 3); ctl.set(c, n * 3)
      if (k < per) off.set([gauss() * spread * len * 0.1, gauss() * spread * len * 0.1, gauss() * spread * len * 0.1], n * 3)
      else {
        const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z), r = Math.cbrt(Math.random())
        off.set([r * q * Math.cos(ph), r * z * 0.8, r * q * Math.sin(ph)], n * 3)
      }
    }
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(end.slice(), 3))
  for (const [k, a, sz] of [['aSeed', seed, 1], ['aKind', kind, 1], ['aFrom', from, 3], ['aEnd', end, 3], ['aCtl', ctl, 3], ['aOff', off, 3]]) geo.setAttribute(k, new BufferAttribute(a, sz))
  const mat = new ShaderMaterial({
    vertexShader: VERT, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) },
      uSpeed: { value: o.speed ?? 0.09 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.5 },
      uNodeR: { value: o.nodeRadius ?? 0.6 }, uOn: { value: shown ? 1 : 0 },
      uColor: { value: new Color(o.color || '#ffc96b').convertLinearToSRGB() }, uWhite: { value: new Color(1, 0.97, 0.9) },
    },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  // fade in or out over 1.5 s on the engine clock, towards the module's `shown`
  // (read every frame: no listener, since a station never calls a form's dispose)
  let last = null
  return {
    group: g, labels: [], pixelRatio: mat.uniforms.uPixelRatio,
    update(t) {
      const u = mat.uniforms, goal = shown ? 1 : 0
      if (last != null) u.uOn.value += Math.sign(goal - u.uOn.value) * Math.min(Math.abs(goal - u.uOn.value), (t - last) / 1.5)
      last = t; u.uTime.value = t
      pts.visible = u.uOn.value > 0.002 || goal > 0
    },
    dispose() { geo.dispose(); mat.dispose() },
  }
}

export function installStrands(registerBuilder) {
  registerBuilder('strands', buildStrands, { fields: ['pos', 'strands'] })
}
