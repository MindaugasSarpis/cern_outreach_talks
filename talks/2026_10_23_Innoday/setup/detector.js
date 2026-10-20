// LHCb's real Run 3 geometry as grains, for the close (owner, 19 Oct: "position it
// in a 3D LHCb CAD (maybe as pointcloud)"), with the LHCb collision of the shared
// components/lhc-opening inside it ("LHCb collision within lhcb"). Copied on 19 Oct
// 2026 from MasterTalk (talk/mastertalk ee3e2b8): the `detector` form from
// setup/route.js and the grain bus and material from setup/grains.js, as they were;
// its data, public/data/lhcb-grains.bin, with its notice (lhcb-grains.NOTICE.txt:
// LHCb's DD4hep geometry, GPL-3.0, (c) CERN for the benefit of the LHCb
// Collaboration, through HSF Phoenix's glTF, Apache-2.0). Move both to the shared
// components/ once those talks are delivered, rather than keeping copies.
// The steps come from <Grains :set="{ det: 1 }" /> (setup/Grains.vue). Changed here: the
// grains are fetched and built once the cover is behind (afterCover.js's `places`
// latch; the build is a long task, and at boot it fell in the cover's fly-in), thinned
// to the stage's grain budget on a lower tier, the form hidden while it is not shown,
// and its grains smaller and fading sooner near the camera (Innoday's close pulls back
// past it).
import { BufferGeometry, BufferAttribute, Points, Group, ShaderMaterial, AdditiveBlending, Color, Vector3, Vector4 } from 'three'
import { trajectories } from '../components/lhc-opening/event.js'
import { places } from './afterCover.js'
import { bus } from '../components/lhc-opening/bus.js'

const BUS = 'innoday:grains'
export const state = new Map()

export function setGrains(name, step) {
  if (state.get(name) === step) return
  state.set(name, step)
  window.dispatchEvent(new CustomEvent(BUS, { detail: { name, step } }))
}
export function listen(name, fn) {
  const h = (e) => { if (e.detail?.name === name) fn(e.detail.step) }
  window.addEventListener(BUS, h)
  return () => window.removeEventListener(BUS, h)
}

// A grain's twinkle, size from distance, and the engine's linear-light point.
export const PLACE = /* glsl */ `
uniform float uTime, uPixelRatio;
varying vec3 vColor; varying float vAlpha;
void place(vec3 p, float size, float alpha, vec3 color, float seed) {
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.86 + 0.14 * sin(uTime * (0.6 + seed * 1.2) + seed * 40.0);   // a slow, shallow twinkle: a stream encoder smears fast sparkle
  // capped, and faded out within a few units of the camera: a flight that passes through a
  // scattered form must not fill the frame with huge additive sprites (a flash, and a fill-rate spike)
  gl_PointSize = min(uPixelRatio * size * tw * (72.0 / max(-mv.z, 0.1)), 10.0 * uPixelRatio);   // (MasterTalk: 48; Innoday's camera pulls back past it)
  vColor = color;
  vAlpha = alpha * tw * smoothstep(2.5, 7.0, -mv.z);
}
void hide() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; }
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
vec3 turnY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x - s * p.z, p.y, s * p.x + c * p.z); }
`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

export function material(vertexShader, uniforms) {
  return new ShaderMaterial({
    vertexShader, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    // uPixelRatio carries the frame scale (the buffer's height / 900; each builder returns it as
    // `frameScale`), so a grain is the same share of the picture at 1600×900 and on a phone
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 }, ...uniforms },
  })
}

const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }
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
//     hitMin?: 0.1 (m from the beam: grains nearer it are never hits),
//     pulse?: a collision's name, light?: 5.5 (its `light`) }
// With `pulse` (Innoday's close, owner 20 Oct: "make it even more spectacular"), that
// collision's crossing sends a front down the detector at its debris's speed: each station
// flares as the debris reaches it, and the grains its tracks pass through (the hits) light
// and stay lit, without leaving; they fade when the collision is let go.
const DET_VERT = PLACE + /* glsl */ `
attribute float aX, aHit, aSeed, aPart;
uniform float uShowT, uHideT, uSweep, uLen, uHitT, uSize, uAlpha;
uniform vec3 uOut, uColor, uHot;
uniform float uCrossT, uCrossHide, uLight;
uniform vec4 uHole;   // Innoday: a small disc on screen round this point (object space; w: radius, of the half-height) is left clear
void main() {
  if (uShowT > 1e8) { hide(); return; }
  float since = uTime - uShowT;
  float front = since / uSweep * uLen;
  float d = front - aX;
  float passed = smoothstep(-0.4, 0.0, d);
  float flash = passed * exp(-max(d, 0.0) * 0.9);
  float fade = uHideT > 1e8 ? 1.0 : 1.0 - smoothstep(0.0, 1.2, uTime - uHideT);
  vec3 p = position, col = mix(uColor, uHot, 0.6 * flash);
  float w = aPart == 1.0 ? 0.0 : (aPart == 0.0 ? 0.25 : (aPart >= 7.0 ? 2.0 : 1.0));
  float a = (uAlpha * passed * (0.55 + 0.45 * hash(aSeed * 9.0)) + 0.5 * flash) * w;   // the beam pipe (part 1) read as a stick when lit, then as a stray dash: not drawn; the VELO (0), its grains packed round the vertex, read as a white-hot blob: dimmed; the calorimeters and muon stations (7-9), spread over the widest walls, read as haze: doubled
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
  if (uCrossT < 1e8) {
    // the collision's debris front, this far past the grain (units along the beam)
    float dd = (uTime - uCrossT) * uLight - aX;
    float reached = smoothstep(-0.3, 0.0, dd) * (uCrossHide > 1e8 ? 1.0 : 1.0 - smoothstep(0.0, 1.6, uTime - uCrossHide));
    float flare = reached * exp(-max(dd, 0.0) * 0.45);
    // (the calorimeters' and muon stations' doubled weight capped: at full weight their walls
    // flared to a white slab)
    col = mix(col, uHot, 0.35 * flare);
    a += 0.16 * flare * min(w, 1.2);
    if (aHit > 0.5) {
      // lit by its part's weight too: the VELO's hits, packed round the vertex, lit at full
      // strength stayed a white-hot blob there to the end
      float lit = reached * (0.4 + 0.6 * exp(-max(dd, 0.0) * 0.12)) * min(w, 1.0);
      col = mix(col, uHot, lit); a = mix(a, 0.75, lit); size *= 1.0 + 0.3 * lit;
    }
  }
  if (uHole.w > 0.0) {
    // the close's flag mark sits in front of all the station's grains along its line of
    // sight; added on, their blue washed its colours out: they make way round it
    vec4 hc = projectionMatrix * modelViewMatrix * vec4(uHole.xyz, 1.0), gc = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vec2 dn = (gc.xy / gc.w - hc.xy / hc.w) * vec2(projectionMatrix[1][1] / projectionMatrix[0][0], 1.0);
    a *= mix(0.25, 1.0, smoothstep(uHole.w * 0.2, uHole.w, length(dn)));   // a soft dimming round it, not a hole
  }
  place(p, size, a * fade, col, aSeed);
}`

function buildDetector(o, ctx) {
  const g = new Group(); g.position.set(...at3(o.pos)); g.name = 'detector:' + (o.name || '')
  const S = o.scale ?? 0.5, T = o.stretch ?? 2.4
  const W = (x, y, z) => [z * S, y * S * T, x * S * T]   // LHCb metres -> world, as the collision draws it
  const mat = material(DET_VERT, {
    uShowT: { value: 1e9 }, uHideT: { value: 1e9 }, uSweep: { value: o.sweep ?? 3.5 }, uLen: { value: 19.5 * S },
    uHitT: { value: 1e9 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.16 },
    uOut: { value: new Vector3(...(o.out || [14, 0, 0])) },
    uColor: { value: new Color(...rgb(o.color || '#5b93ff')) }, uHot: { value: new Color(...rgb(o.hot || '#ffffff')) },
    uHole: { value: new Vector4(...(o.hole || [0, 0, 0, 0])) },
    uCrossT: { value: 1e9 }, uCrossHide: { value: 1e9 }, uLight: { value: o.light ?? 5.5 },
  })
  const u = mat.uniforms
  const build = (buf, ev) => {
    // on a lower tier (a phone) every k-th grain, to the stage's budget for one form; all of
    // them at tier 0 (the file has 446 400 since the re-bake)
    const all = new Int16Array(buf), k = (ctx.tier ?? 0) === 0 ? 1 : Math.max(1, Math.ceil(all.length / 4 / (ctx.budget || 300000)))
    const raw = k === 1 ? all : all.filter((_, j) => ((j >> 2) % k) === 0), n = raw.length / 4
    // the event's paths, binned every 5 cm along the beam: a grain is a hit when a track passes within hitR of it
    const bins = new Map(), R = o.hitR ?? 0.035
    if (ev) for (const t of trajectories(ev).tracks) for (const p of t.pts) {
      const k = Math.round(p[2] / 0.05); if (!bins.has(k)) bins.set(k, []); bins.get(k).push(p[0], p[1])
    }
    const pos = new Float32Array(n * 3), ax = new Float32Array(n), hit = new Float32Array(n), seed = new Float32Array(n), part = new Float32Array(n)
    let hits = 0
    for (let i = 0; i < n; i++) {
      const x = raw[i * 4] / 1000, y = raw[i * 4 + 1] / 1000, z = raw[i * 4 + 2] / 1000
      pos.set(W(x, y, z), i * 3); ax[i] = z * S; seed[i] = Math.random(); part[i] = raw[i * 4 + 3]
      const r = R + 0.004 * Math.max(z, 0)
      // not the beam pipe and the VELO's inner edge, where every track meets: those grains
      // would all count, and leave as one white bar along the axis
      if (Math.hypot(x, y) < (o.hitMin ?? 0.1)) continue
      for (let dk = -1; dk <= 1 && !hit[i]; dk++) {
        const b = bins.get(Math.round(z / 0.05) + dk); if (!b) continue
        for (let j = 0; j < b.length; j += 2) if ((b[j] - x) ** 2 + (b[j + 1] - y) ** 2 < r * r) { hit[i] = 1; hits++; break }
      }
    }
    g.add(points(geometry(n, { position: pos, aX: [ax, 1], aHit: [hit, 1], aSeed: [seed, 1], aPart: [part, 1] }), mat))
    g.userData.hits = hits
  }
  let alive = true, warm = 0
  const onWarm = () => { warm = 3 }
  addEventListener('innoday:prewarm', onWarm)
  const offLatch = places.when(() => {
    fetch(ctx.asset('/' + String(o.src || 'data/lhcb-grains.bin').replace(/^\//, ''))).then((r) => r.arrayBuffer())
      .then((buf) => { if (alive) build(buf, EVENT) }).catch((e) => console.warn('stage: detector grains failed', o.src, e))
  })
  const s = stepper(o.name)
  let now = 0
  // the named collision's crossing (world time, from its start) and its letting go
  const offPulse = o.pulse ? [
    bus.on('start', (e) => { if (e.name === o.pulse) { u.uCrossT.value = e.cross; u.uCrossHide.value = 1e9 } }),
    bus.listen(o.pulse, (k) => { if (!k && u.uCrossT.value < 1e8 && u.uCrossHide.value > 1e8) u.uCrossHide.value = now }),
  ] : []
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
      if (warm > 0) warm--
      g.visible = u.uShowT.value < 1e8 || warm > 0   // hidden, it costs nothing on the other slides
    },
    dispose() { alive = false; offLatch(); s.off(); offPulse.forEach((f) => f()); removeEventListener('innoday:prewarm', onWarm) },
  }
}

let EVENT = null
export function installDetector(registerBuilder, { event } = {}) {
  EVENT = event || null
  registerBuilder('detector', buildDetector, { fields: ['pos', 'name'] })
}
