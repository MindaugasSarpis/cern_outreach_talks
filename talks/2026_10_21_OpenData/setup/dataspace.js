import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, DataTexture, RGBAFormat, FloatType, NearestFilter,
} from 'three'
import { listen, tick, waiting, stepOf } from './grains.js'
import { mulberry32 } from './ring.js'

// ---- dataspace ----------------------------------------------------------------------
//   { type: dataspace, name, pos, scales?: [1, 3, 9, 27, 81], seed?: 11, size?: 0.1, alpha?: 1,
//     current?: { waves: 7, swirl: 0.35, lift: 0.55 },
//     grains?: 2000 a scale, trail?: 3, life?: 9, travel?: 0.1, gap?: 0.0045,
//     currents?: 5 a scale, threads?: 8 a current, spread?: 0.07, lone?: 6 a scale,
//     threadLength?: 2.6, threadBeads?: 280, drift?: 0.025, goldShare?: 0.1,
//     streams?: [{ through: [[x, y, z], …], scale?: 10, gold? }], packets?: 36, beads?: 16 a packet,
//     path?: 600, speed?: 0.05, clusters?: [{ at, r?: 16, n?: 1600, color?, size?: 4.6, spin?: 0.02, tilt?: 20 }],
//     color?, gold? }
// The sea of data the piles stand in, behind the scale slides: no place and no
// picture, only grains, the same stuff as the rest of the world.
//   the currents  threads of grains traced along one slow flow round the piles, most
//                 of them in bundles that run side by side, the grains running down them;
//   the sea       loose faint grains between them, each drifting a little way along the
//                 flow and drawn as a short streak, so the flow reads in a still too;
//   the streams   a few long paths placed by hand, packets of brighter grains running
//                 down them: data on its way somewhere;
//   the clusters  far-off balls of grains, turning slowly: other datasets.
// The camera pulls back from a sphere seen at 0.76 to a pile seen at 78, so the sea
// is the same at every scale: one shell of it for each of `scales` round the object's
// `pos` (the terabyte sphere, where the pull-back starts), a scale's grains, currents
// and streams that much larger, and each grain shown only while it is a point of
// about the size the others are (nearer it swells and fades, as in a fog; farther
// it shrinks out). Wherever the camera stands it sees the sea round it at its own
// scale, and flying out it passes through it, the near grains streaming past.
// Step 1 fades it in over two seconds, 0 out; at 0 it is not drawn at all.
// The bottom left of the frame, where a slide's number stands, is kept calm.

// a random direction
function sphere(rnd) {
  const z = 2 * rnd() - 1, ph = rnd() * Math.PI * 2, q = Math.sqrt(1 - z * z)
  return [q * Math.cos(ph), z, q * Math.sin(ph)]
}
const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }
const gaussOf = (rnd) => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 0.577 }

// The current: one divergence-free flow for every grain and stream, so all that drifts
// in one place drifts one way. Each scale brings an octave (the curl of a few random
// plane waves, ∇ × (sin(k·u + φ) e) = cos(k·u + φ) k × e), weighted where its shell is,
// so the eddies are as large as the sea is wide at every distance; a slow turn round
// the vertical through the centre on top, so the sea circles the piles; and its rise
// damped, so the currents run level, as a sea's do.
function makeCurrent(rnd, scales, { waves = 7, swirl = 0.35, lift = 0.55 } = {}) {
  const octaves = scales.map((s) => {
    const W = []
    for (let i = 0; i < waves; i++) {
      const n = sphere(rnd), e = sphere(rnd), m = (0.5 + 1.5 * rnd() ** 1.5) / s
      W.push([n[0] * m, n[1] * m, n[2] * m, n[1] * e[2] - n[2] * e[1], n[2] * e[0] - n[0] * e[2], n[0] * e[1] - n[1] * e[0], rnd() * Math.PI * 2])
    }
    return { s, W }
  })
  const norm = 1 / Math.sqrt(waves / 2)
  return (x, y, z, out) => {
    const r = Math.hypot(x, y, z) + 1e-6, rh = Math.hypot(x, z) + 1e-6
    let vx = 0, vy = 0, vz = 0, ws = 0
    for (const { s, W } of octaves) {
      const l = Math.log(r / (2 * s)), w = Math.exp(-l * l / 0.8)   // a bump round r = 2s, a scale wide
      if (w < 1e-3) continue
      for (const q of W) { const c = w * Math.cos(q[0] * x + q[1] * y + q[2] * z + q[6]); vx += c * q[3]; vy += c * q[4]; vz += c * q[5] }
      ws += w
    }
    const k = norm / Math.max(ws, 1e-3)
    vx = vx * k - swirl * z / rh; vz = vz * k + swirl * x / rh; vy *= k * lift
    const v = Math.hypot(vx, vy, vz) || 1
    out[0] = vx / v; out[1] = vy / v; out[2] = vz / v
    return out
  }
}

// What every grain here shares: its size from distance, shown only while that size
// is about the others' (`depth`), dimmed in the bottom left of the frame (`calm`), and
// the talk's linear-light point.
const COMMON = /* glsl */ `
uniform float uTime, uPixelRatio, uVis, uAlpha;
varying vec3 vColor; varying float vAlpha;
// px: the grain's size on a 900-line frame. It shows from under a pixel to a few, and
// fades in the far fog
float depth(float px, float d) {
  return smoothstep(0.45, 1.1, px) * (1.0 - smoothstep(4.5, 8.5, px)) * (1.0 - smoothstep(190.0, 340.0, d));
}
// the bottom left, where the slide's number and its line stand
float calm(vec4 c) {
  vec2 q = c.xy / max(c.w, 1e-3);
  return 1.0 - 0.88 * (1.0 - smoothstep(-0.05, 0.45, q.x)) * (1.0 - smoothstep(-0.35, 0.1, q.y));
}
void put(vec3 p, float size, float alpha, vec3 color, float seed) {
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float d = max(-mv.z, 0.1);
  float px = size * 72.0 / d;
  float tw = 0.75 + 0.25 * sin(uTime * (0.9 + seed * 2.1) + seed * 40.0);
  vColor = color;
  vAlpha = uAlpha * uVis * alpha * tw * depth(px, d) * calm(gl_Position);
  gl_PointSize = uPixelRatio * min(px, 8.5) * tw;
  if (vAlpha < 0.004) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; }
}`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(max(vColor * a, vec3(1e-6)), vec3(2.2)), 1.0);
}`

// the sea: each grain lives some seconds, drifting along the current where it was
// born and fading in and out at the ends of its life, so the drift never jumps back;
// its streak is the same grain a little behind itself (aTrail 1, 2 …), dimmer
const SEA_VERT = /* glsl */ `
attribute vec3 aDir, aColor;
attribute float aSeed, aScale, aTrail;
uniform float uLife, uTravel, uGap, uSize;
${COMMON}
void main() {
  float life = uLife * (0.75 + 0.5 * fract(aSeed * 7.13));
  float a = fract(uTime / life + aSeed * 13.7);
  float go = uTravel * aScale * (0.6 + 0.8 * fract(aSeed * 3.71));
  vec3 p = position + aDir * ((a - 0.5) * go - aTrail * uGap * aScale);
  float fade = sin(3.14159 * a) * pow(1.0 - aTrail / 3.6, 1.6);
  put(p, uSize * aScale * (1.0 - 0.12 * aTrail), fade, aColor, aSeed);
}`

// the streams: a path is a row of uPath (points at equal steps along it); its grains
// run down it at aRate laps a second, coming out of nothing at its start and going
// back into it at its end. aBright 0 is the faint thread, 1 a packet
const STREAM_VERT = /* glsl */ `
attribute vec3 aOff, aColor;
attribute float aSeed, aRow, aPhase, aRate, aScale, aBright;
uniform sampler2D uPath;
uniform float uSamples, uSize;
${COMMON}
void main() {
  float s = fract(aPhase + uTime * aRate);
  float x = s * (uSamples - 1.0), i = floor(x);
  vec3 a = texelFetch(uPath, ivec2(int(i), int(aRow)), 0).xyz;
  vec3 b = texelFetch(uPath, ivec2(int(min(i + 1.0, uSamples - 1.0)), int(aRow)), 0).xyz;
  vec3 p = mix(a, b, x - i) + aOff * aScale;
  float ends = smoothstep(0.0, 0.1, s) * (1.0 - smoothstep(0.86, 1.0, s));
  // slow swells of light run down a thread, so it is never an even line
  float swell = aBright < 1.0 ? 0.55 + 0.45 * smoothstep(0.2, 1.0, sin(6.2832 * (s * 2.5 - uTime * 0.04 + aRow * 0.37))) : 1.0;
  put(p, uSize * aScale * mix(0.8, 1.5, aBright), ends * swell * mix(0.3, 1.0, aBright), aColor, aSeed);
}`

// the clusters: a ball of grains round its centre, turning about its own axis
const CLUSTER_VERT = /* glsl */ `
attribute vec3 aCentre, aColor;
attribute float aSeed, aSpin, aSize, aBright;
${COMMON}
void main() {
  float w = uTime * aSpin, c = cos(w), s = sin(w);
  vec3 p = aCentre + vec3(c * position.x - s * position.z, position.y, s * position.x + c * position.z);
  put(p, aSize, aBright, aColor, aSeed);
}`

function buildDataspace(o, ctx) {
  const rnd = mulberry32(o.seed ?? 11), gauss = () => gaussOf(rnd)
  // a laptop driving a projector draws fewer: the share of the grains this tier's budget allows
  const share = Math.max(0.3, Math.sqrt((ctx.budget ?? 300000) / 300000))
  const scales = o.scales || [1, 3, 9, 27, 81]
  const current = makeCurrent(rnd, scales, o.current)
  const v = [0, 0, 0]
  const fs = { value: Math.min(devicePixelRatio || 1, 2) }   // the frame's scale, kept by the engine
  const vis = { value: 0 }
  const base = rgb(o.color || '#a9bde6'), white = [0.94, 0.96, 1], gold = rgb(o.gold || '#ffcf73')
  const mixRgb = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]
  // a faint gold grain is paler: the linear-light point darkens a dim gold toward orange
  const paleGold = mixRgb(gold, white, 0.35)
  const mat = (vertexShader, uniforms) => new ShaderMaterial({
    vertexShader, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: true, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: fs, uVis: vis, ...uniforms },
  })
  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  const mats = []

  // the sea: a shell for each scale (from 0.9 to 3.2 of it out from the centre, flattened
  // to a sea's depth), its grains born uniformly through it
  {
    const per = Math.round((o.grains ?? 2000) * share), T = o.trail ?? 3
    const N = per * scales.length * (T + 1)
    const pos = new Float32Array(N * 3), dir = new Float32Array(N * 3), col = new Float32Array(N * 3)
    const seed = new Float32Array(N), scale = new Float32Array(N), trail = new Float32Array(N)
    let n = 0
    for (const s of scales) {
      for (let i = 0; i < per; i++) {
        const u = sphere(rnd), r = s * Math.cbrt(0.73 + rnd() * (32.8 - 0.73))
        const p = [u[0] * r, u[1] * r * 0.55, u[2] * r]
        current(p[0], p[1], p[2], v)
        const c = rnd() < (o.goldShare ?? 0.1) * 0.6 ? paleGold : mixRgb(base, white, 0.45 * rnd())
        const sd = rnd()
        for (let j = 0; j <= T; j++, n++) {
          pos.set(p, n * 3); dir.set(v, n * 3); col.set(c, n * 3)
          seed[n] = sd; scale[n] = s; trail[n] = j
        }
      }
    }
    const geo = new BufferGeometry()
    for (const [k, a, z] of [['position', pos, 3], ['aDir', dir, 3], ['aColor', col, 3], ['aSeed', seed, 1], ['aScale', scale, 1], ['aTrail', trail, 1]]) geo.setAttribute(k, new BufferAttribute(a, z))
    const m = mat(SEA_VERT, {
      uAlpha: { value: o.alpha ?? 1.0 }, uSize: { value: o.size ?? 0.1 },
      uLife: { value: o.life ?? 9 }, uTravel: { value: o.travel ?? 0.1 }, uGap: { value: o.gap ?? 0.0045 },
    })
    const pts = new Points(geo, m); pts.frustumCulled = false
    g.add(pts); mats.push(m)
  }

  // the threads and the streams, both rows of the texture uPath (a path at S equal steps)
  // with grains running down them. The threads, `threadLength` of a scale long, are traced
  // along the current: lines of grains, so the currents show in a still.
  // A stream is drawn `through` its points (a Catmull-Rom curve), with its `scale`: a
  // faint thread with packets of brighter grains running down it, data on its way
  // somewhere. The streams are placed by hand, one or two in every scale slide's frame.
  {
    const S = 96, rows = [], meta = []
    // a path, as S points at equal steps along it
    const addPath = (pts) => {
      const acc = [0]
      for (let i = 1; i < pts.length; i++) acc.push(acc[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]))
      const L = acc[acc.length - 1], out = new Float32Array(S * 4)
      for (let i = 0, j = 0; i < S; i++) {
        const want = L * i / (S - 1)
        while (j < pts.length - 2 && acc[j + 1] < want) j++
        const f = Math.min(1, Math.max(0, (want - acc[j]) / Math.max(acc[j + 1] - acc[j], 1e-9)))
        out.set([0, 1, 2].map((k) => pts[j][k] + (pts[j + 1][k] - pts[j][k]) * f).concat(1), i * 4)
      }
      rows.push(out)
      return L
    }
    const trace = (start, s, len) => {
      let p = start.slice()
      const pts = [p.slice()], h = s * 0.02
      for (let L = 0; L < len; L += h) {
        // midpoint steps of a fixed length: a path, not a timing
        current(p[0], p[1], p[2], v)
        const m = [p[0] + v[0] * h / 2, p[1] + v[1] * h / 2, p[2] + v[2] * h / 2]
        current(m[0], m[1], m[2], v)
        p = [p[0] + v[0] * h, p[1] + v[1] * h, p[2] + v[2] * h]
        pts.push(p.slice())
      }
      return addPath(pts)
    }
    const curve = (through) => {
      const q = [through[0].map((x, k) => 2 * x - through[1][k]), ...through, through.at(-1).map((x, k) => 2 * x - through.at(-2)[k])]
      const pts = []
      for (let i = 1; i < q.length - 2; i++) {
        for (let j = 0; j < 40; j++) {
          const t = j / 40, t2 = t * t, t3 = t2 * t
          pts.push([0, 1, 2].map((k) => 0.5 * (2 * q[i][k] + (q[i + 1][k] - q[i - 1][k]) * t
            + (2 * q[i - 1][k] - 5 * q[i][k] + 4 * q[i + 1][k] - q[i + 2][k]) * t2 + (3 * q[i][k] - q[i - 1][k] - 3 * q[i + 1][k] + q[i + 2][k]) * t3)))
        }
      }
      pts.push(through.at(-1).slice())
      return addPath(pts)
    }
    // the threads of a scale run in `currents` bundles of `threads` each, started close
    // together, so they keep side by side as a ribbon: a current reads from across the room
    // where one thread alone would not; a few run alone between them
    const inShell = (s, flat) => { const u = sphere(rnd), r = s * (1 + 2 * rnd()); return [u[0] * r, u[1] * r * flat, u[2] * r] }
    for (const s of scales) {
      const lone = o.lone ?? 6
      for (let c = 0; c < (o.currents ?? 5) + lone; c++) {
        const at = inShell(s, 0.5), many = c < (o.currents ?? 5), au = rnd() < (o.goldShare ?? 0.1)
        const b = 0.65 + 0.35 * rnd() ** 2, spread = s * (o.spread ?? 0.07)
        for (let j = 0; j < (many ? o.threads ?? 8 : 1); j++) {
          const start = many ? at.map((x) => x + gauss() * spread) : at
          const len = trace(start, s, s * (o.threadLength ?? 2.6) * (0.75 + 0.5 * rnd()))
          meta.push({ s, len, stream: false, gold: au, b: many ? b * (0.7 + 0.3 * rnd()) : b })
        }
      }
    }
    for (const st of o.streams || []) {
      if (!(st.through?.length >= 2)) continue
      meta.push({ s: st.scale ?? 10, len: curve(st.through), stream: true, gold: !!st.gold })
    }
    const tex = new DataTexture(new Float32Array(S * 4 * rows.length), S, rows.length, RGBAFormat, FloatType)
    rows.forEach((row, i) => tex.image.data.set(row, i * S * 4))
    tex.magFilter = tex.minFilter = NearestFilter; tex.needsUpdate = true
    const TB = Math.round((o.threadBeads ?? 280) * share)
    const P = Math.round((o.packets ?? 36) * share), B = o.beads ?? 16, F = Math.round((o.path ?? 600) * share)
    const N = meta.reduce((a, m) => a + (m.stream ? P * B + F : TB), 0)
    const off = new Float32Array(N * 3), col = new Float32Array(N * 3), pos = new Float32Array(N * 3)
    const seed = new Float32Array(N), row = new Float32Array(N), phase = new Float32Array(N), rate = new Float32Array(N), scale = new Float32Array(N), bright = new Float32Array(N)
    let n = 0
    meta.forEach(({ s, len, stream, gold: au, b: tb }, i) => {
      // a lap in len / (speed · s) seconds: as fast on screen at every scale
      const lap = (stream ? o.speed ?? 0.05 : o.drift ?? 0.025) * s / len
      const tint = au ? (stream ? gold : paleGold) : mixRgb(base, white, stream ? 0.55 : 0.3 * rnd())
      const put = (ph, b, w) => {
        seed[n] = rnd(); row[n] = i; phase[n] = ph; rate[n] = lap; scale[n] = s; bright[n] = b
        off.set([gauss() * w, gauss() * w * 0.6, gauss() * w], n * 3)
        col.set(mixRgb(tint, white, b * 0.3 * rnd()), n * 3); n++
      }
      // a thread's grains at even steps, a dotted line: a run of data, not dust
      if (!stream) { const ph = rnd(); for (let f = 0; f < TB; f++) put(ph + (f + 0.2 * rnd()) / TB, tb, 0.003); return }
      for (let f = 0; f < F; f++) put(rnd(), 0.5, 0.008)
      for (let k = 0; k < P; k++) {
        const at = (k + 0.6 * rnd()) / P
        for (let b = 0; b < B; b++) put(at + gauss() * 0.0035, 1, 0.005)
      }
    })
    const geo = new BufferGeometry()
    for (const [k, a, z] of [['position', pos, 3], ['aOff', off, 3], ['aColor', col, 3], ['aSeed', seed, 1], ['aRow', row, 1], ['aPhase', phase, 1], ['aRate', rate, 1], ['aScale', scale, 1], ['aBright', bright, 1]]) geo.setAttribute(k, new BufferAttribute(a, z))
    const m = mat(STREAM_VERT, { uAlpha: { value: o.streamAlpha ?? 1.0 }, uSize: { value: (o.size ?? 0.1) * 1.2 }, uPath: { value: tex }, uSamples: { value: S } })
    m.addEventListener('dispose', () => tex.dispose())
    const pts = new Points(geo, m); pts.frustumCulled = false
    g.add(pts); mats.push(m)
  }

  // the clusters: far off, each a ball of grains thick in the middle and thinning
  // outward (a Plummer sphere, cut at three of its radii), a little flattened
  if (o.clusters?.length) {
    const list = o.clusters
    const per = list.map((c) => Math.round((c.n ?? 1600) * share))
    const N = per.reduce((a, b) => a + b, 0)
    const pos = new Float32Array(N * 3), centre = new Float32Array(N * 3), col = new Float32Array(N * 3)
    const seed = new Float32Array(N), spin = new Float32Array(N), size = new Float32Array(N), bright = new Float32Array(N)
    let n = 0
    list.forEach((c, i) => {
      const a = (c.r ?? 16) / 3, tint = rgb(c.color || '#cdd8f0'), tilt = (c.tilt ?? 20) * Math.PI / 180
      for (let k = 0; k < per[i]; k++, n++) {
        const q = Math.max(1e-3, rnd()), r = Math.min(3 * a, a / Math.sqrt(q ** (-2 / 3) - 1)), u = sphere(rnd)
        const y = u[1] * r * 0.7, z = u[2] * r
        pos.set([u[0] * r, y * Math.cos(tilt) - z * Math.sin(tilt), y * Math.sin(tilt) + z * Math.cos(tilt)], n * 3)
        centre.set(c.at, n * 3)
        col.set(mixRgb(tint, white, 0.5 * Math.max(0, 1 - r / a) + 0.2 * rnd()), n * 3)
        seed[n] = rnd(); spin[n] = (c.spin ?? 0.02) * (1.3 - 0.6 * r / (3 * a))
        size[n] = (c.size ?? 4.6) * (0.7 + 0.6 * rnd()); bright[n] = 0.55 + 0.45 * Math.max(0, 1 - r / (1.5 * a))
      }
    })
    const geo = new BufferGeometry()
    for (const [k, a, z] of [['position', pos, 3], ['aCentre', centre, 3], ['aColor', col, 3], ['aSeed', seed, 1], ['aSpin', spin, 1], ['aSize', size, 1], ['aBright', bright, 1]]) geo.setAttribute(k, new BufferAttribute(a, z))
    const m = mat(CLUSTER_VERT, { uAlpha: { value: o.clusterAlpha ?? 1.0 } })
    const pts = new Points(geo, m); pts.frustumCulled = false
    g.add(pts); mats.push(m)
  }

  // step 1 fades it in, 0 out, on the world's clock
  let want = stepOf(o.name) ? 1 : 0, last = null
  const off = listen(o.name, (k) => { want = k ? 1 : 0 })
  const busy = () => waiting(o.name) || Math.abs(want - vis.value) > 0.01
  g.visible = false
  return {
    group: g, labels: [], api: { busy }, frameScale: fs,
    update(t) {
      tick(t)
      const dt = last === null ? 0 : Math.min(Math.max(t - last, 0), 0.5); last = t
      vis.value += (want - vis.value) * (1 - Math.exp(-dt * 2.4))
      if (Math.abs(want - vis.value) < 0.004) vis.value = want
      for (const m of mats) m.uniforms.uTime.value = t
      g.visible = vis.value > 0.003
    },
    dispose: off,
  }
}

export function installDataspace(registerBuilder) {
  registerBuilder('dataspace', buildDataspace, { fields: ['pos', 'name'], enterable: true })
}
