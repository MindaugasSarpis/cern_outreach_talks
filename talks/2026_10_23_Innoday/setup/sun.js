import {
  Group, Points, Mesh, PlaneGeometry, MeshBasicMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3, Quaternion,
  TextureLoader, SRGBColorSpace, Vector4, Vector2,
} from 'three'
import { material, PLACE } from './detector.js'

// ---- sun ----------------------------------------------------------------------------
// Slide 12 (owner, 21 Oct: "Slide 12 can be more dynamic, there is a similar cool slide
// in open data talks"): LHCb's results as a sun. Copied on 21 Oct 2026 from OpenData's
// setup/sun.js (origin/main 3da294a, its slides 11-12: who uses the open data, round its
// gold pile) and cut down to what this slide needs: no named clusters, no empty places,
// no step bus. Changed here: the middle is a core of grains of its own (LHCb's output),
// not another form's pile; each plot keeps its own aspect at the same area (`area`), so
// the grains land on each drawing's own size; the deck's blues, not gold; and the sun
// shows when the camera arrives at its station (the engine's arm/assemble) and fades
// once the camera has left (`far`), with no <Grains> step on the slides round it.
//
//   { type: sun, pos, items: [{ src, at: [x, y, z] }, …], squash?: [sx, sy, sz, sy below],
//     axis?: [0, 1, 0], turn?: 150 (s a turn), area?: 27 (a plot's, world units²),
//     pileR?: 1.8 (the core's radius), core?: 5000 grains, after?: 0.5, travel?: 1.9,
//     delay?: 0.5, stagger?: 0.1, lag?: 0.12, back?: 0.45, keepOut?: [x0, x1, y0, y1],
//     far?: 60, opacity?: 0.95, color?, coreColor?, alpha?, size?, grains?: 900 a ray,
//     shed?: 110 each, shedFor?: 3.5, seed?: 5 }
//
// Rays of grains leave the core to every side in 3D, each ending at a plot (a picture of
// light on black, scripts/plots_dark.py, drawn unlit and additive as setup/plots.js
// draws them: its black is the world's, its ink under the bloom's threshold). `at` is
// where each stands, from the core's middle, as the sun opens.
//
// The whole sun turns about `axis`, once in `turn` seconds, inside the ellipsoid `squash`
// (half widths across, up, toward the camera, and down): the turn is worked out on a
// unit sphere and stretched to the ellipsoid, so the near plots never come up to the
// lens. The axis leans toward the camera and down, so the near half of the orbit runs
// high on the screen and the far half low, small and dim, under the paper count. The
// plots stay upright and face the camera; those behind the core dim to `back`. Where two
// cross on the screen, the one behind steps back almost to nothing, so the one in front
// reads; one passing over the core steps back to a fifth, so the core stays the sun's
// middle. Nothing is drawn over the count: grains and plots in the box `keepOut` (the
// screen's −1…1) fade down to a fifth. The layout (`at`, `axis`, `squash`, the pose) was
// searched in a model of this (scratch, 21 Oct) so that this seldom happens in the
// slide's first 50 s.
//
// Grains run out along each ray from the core, the ray bowed back against the turn like
// a jet from a turning sprinkler; the last stretch fans out over the plot, and each grain
// lands on a spot of its drawing (the plot's bright pixels) and sparks there for a moment
// (small and many, never a flash). A plot sheds a few grains as it turns: they stay
// where they left it, drifting out and fading, a wake behind it.
//
// The camera landing at the station (or the deck opened there): the core gathers out of
// the dust over 1.2 s and the rays grow out of it `after` seconds later, one after
// another round the sun from the top, each plot showing as its first grains land; the
// turn starts there. `busy` until the plots stand (shots, stills and plates wait). The
// camera leaving (farther than `far` from the core): everything fades within 1.2 s and
// stops drawing. `c` (the arrival again) leaves a sun that stands as it is.
const MAXI = 16
const SUN_VERT = PLACE + /* glsl */ `
attribute float aSeed, aKind, aDelay, aIdx;    // 0 a grain on its ray, 1 one shed as it turns, 2 the core's; its ray's start; its item
attribute vec3 aEnd, aOff;                     // the ray's end on the unit sphere (unturned); the grain's own offset
attribute vec2 aLand;                          // its spot on the plot (shares of the width and height), or on the rim
uniform vec3 uAxis, uRight, uUp, uView, uColor, uWhite, uCore;
uniform vec4 uSquash, uKeep;
uniform float uAng, uOmega, uSince, uOn, uCoreOn, uTravel, uFlare, uShed, uLag, uPileR, uBack, uSize, uAlpha;
uniform float uVeil[${MAXI}];                  // an item covered on the screen by a nearer one steps back
uniform vec2 uDim[${MAXI}];                    // each plot's width and height as it stands
vec3 turn(vec3 v, float a) { float c = cos(a), s = sin(a); return v * c + cross(uAxis, v) * s + uAxis * dot(uAxis, v) * (1.0 - c); }
vec3 squash(vec3 v) { return v * vec3(uSquash.x, v.y > 0.0 ? uSquash.y : uSquash.w, uSquash.z); }
vec3 endAt(float a) { return squash(turn(aEnd, a)); }
void main() {
  if (aKind > 1.5) {
    // the core: a ball of grains, dense in its middle, each on a slow orbit of its own;
    // it gathers out of the dust as the camera lands
    if (uCoreOn <= 0.0) { hide(); return; }
    float w = uTime * (0.08 + 0.14 * hash(aSeed * 5.0));
    vec3 o = aOff;
    vec3 q = vec3(cos(w) * o.x - sin(w) * o.z, o.y, sin(w) * o.x + cos(w) * o.z);
    float g = ease(uCoreOn);
    vec3 p = mix(normalize(aOff + 1e-4) * uPileR * (3.0 + 4.0 * hash(aSeed * 3.0)), q * uPileR, g);
    float r = length(aOff);
    float a = uAlpha * (0.45 + 0.75 * (1.0 - r)) * g;
    place(p, uSize * (0.7 + 0.8 * hash(aSeed * 29.0)), a, mix(uCore, uWhite, 0.5 * (1.0 - r) + 0.3 * hash(aSeed * 41.0)), aSeed);
    return;
  }
  float since = uSince - aDelay;               // since this ray set out
  float veil = uVeil[int(aIdx + 0.5)];
  vec2 dim = uDim[int(aIdx + 0.5)];
  vec3 E = endAt(uAng);
  vec3 spot = aLand.x * dim.x * uRight + aLand.y * dim.y * uUp;
  vec3 p; float alpha; float size;
  if (aKind < 0.5) {
    float life = uTravel + uFlare;
    float age = fract(aSeed * 7.31 + uTime / life) * life;   // since it left the core
    if (age > since) { hide(); return; }                     // it would have left before its ray set out
    if (age < uTravel) {
      float s = age / uTravel;
      // part way to where its end was a moment ago: the ray bows back against the turn
      vec3 Eb = endAt(uAng - uLag * sin(3.14159 * s));
      p = mix(normalize(E) * uPileR, Eb, s) + aOff * sin(3.14159 * s);
      // the last stretch fans out over the plot, each grain to its own spot
      p = mix(p, E + spot, smoothstep(0.76, 1.0, s));
      alpha = uAlpha * smoothstep(0.0, 0.05, s);
      size = uSize * (0.7 + 0.6 * hash(aSeed * 13.0));
    } else {
      // landed: a spark on the drawing, then gone
      float f = (age - uTravel) / uFlare;
      p = E + spot;
      alpha = uAlpha * 1.5 * (1.0 - f) * (1.0 - f) * veil;
      size = uSize * (0.9 + 1.1 * (1.0 - f));
    }
  } else {
    // shed: it left the rim where the plot stood a moment ago, and drifts out from there
    float age = fract(aSeed * 3.71 + uTime / uShed) * uShed;
    if (age > since - uTravel - 0.8) { hide(); return; }      // only once its plot stands
    vec3 Ep = endAt(uAng - uOmega * age);
    p = Ep + spot + normalize(Ep) * age * 0.35 + aOff * age;
    float f = age / uShed;
    alpha = uAlpha * 1.2 * smoothstep(0.0, 0.06, f) * (1.0 - f) * (1.0 - f) * veil;
    size = uSize * (0.8 + 0.8 * hash(aSeed * 17.0));
  }
  // behind the core it dims
  alpha *= mix(uBack, 1.0, smoothstep(-0.9, 0.4, dot(p, uView) / uSquash.z)) * uOn;
  if (alpha <= 0.0) { hide(); return; }
  place(p, size, alpha, mix(uColor, uWhite, 0.35 * hash(aSeed * 41.0) + (aKind > 0.5 ? 0.2 : 0.0)), aSeed);
  // little over the count
  vec2 n = gl_Position.xy / gl_Position.w;
  float k = (smoothstep(uKeep.x - 0.05, uKeep.x, n.x) - smoothstep(uKeep.y, uKeep.y + 0.05, n.x))
          * (smoothstep(uKeep.z - 0.05, uKeep.z, n.y) - smoothstep(uKeep.w, uKeep.w + 0.05, n.y));
  vAlpha *= 1.0 - 0.8 * k;
}`

const ease = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (x * 6 - 15) + 10) }
const smooth = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x) }
// a small seeded generator (OpenData's setup/ring.js)
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function buildSun(o, ctx) {
  const items = (o.items || []).filter((it) => it.src).slice(0, MAXI)
  const sq = o.squash || [17, 9, 8, 9]
  const axis = new Vector3(...(o.axis || [0, 1, 0])).normalize()
  const omega = (2 * Math.PI) / (o.turn ?? 150)
  const area = o.area ?? 27, pileR = o.pileR ?? 1.8, far = o.far ?? 60
  const travel = o.travel ?? 1.9, flare = o.flare ?? 0.5, shedL = o.shedFor ?? 3.5
  const keep = o.keepOut || [-2, -2, -2, -2]
  const rnd = mulberry32(o.seed ?? 5)
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 1.2 }

  // where each stands on the unit sphere the turn is worked out on (the ellipsoid undone)
  const unsquash = (a) => new Vector3(a[0] / sq[0], a[1] / (a[1] > 0 ? sq[1] : sq[3]), a[2] / sq[2])
  const ends = items.map((it) => unsquash(it.at || [0, 0, 0]))
  const standAt = (e, ang, out) => {
    out.copy(e).applyAxisAngle(axis, ang)
    return out.set(out.x * sq[0], out.y * (out.y > 0 ? sq[1] : sq[3]), out.z * sq[2])
  }
  // the rays set out round the sun from the top, clockwise as seen
  const order = items.map((it, i) => i).sort((a, b) => {
    const ang = (i) => { const p = items[i].at || [0, 0, 0]; return (Math.atan2(p[0], p[1]) + 2 * Math.PI) % (2 * Math.PI) }
    return ang(a) - ang(b)
  })
  const delay = new Array(items.length)
  order.forEach((i, r) => { delay[i] = (o.delay ?? 0.5) + (o.stagger ?? 0.1) * r })
  const settles = Math.max(0, ...delay) + travel + 1.2

  // the grains: as many as the device's budget allows
  const f = Math.max(0.3, Math.min(1, (ctx.budget ?? 300000) / 300000))
  const per = Math.round((o.grains ?? 900) * f), shedN = Math.round((o.shed ?? 110) * f), coreN = Math.round((o.core ?? 5000) * f)
  const N = items.length * (per + shedN) + coreN
  const seed = new Float32Array(N), kind = new Float32Array(N), dl = new Float32Array(N), idx = new Float32Array(N)
  const end = new Float32Array(N * 3), off = new Float32Array(N * 3), land = new Float32Array(N * 2), pos = new Float32Array(N * 3)
  const rays = []   // per item: where its ray's grains lie, so a plot's bright pixels can become their spots
  const rim = () => {
    const u = rnd() - 0.5, side = rnd()
    return side < 0.25 ? [u, 0.5] : side < 0.5 ? [u, -0.5] : side < 0.75 ? [0.5, u] : [-0.5, u]
  }
  let n = 0
  items.forEach((it, i) => {
    rays.push({ from: n, to: n + per })
    for (let k = 0; k < per + shedN; k++, n++) {
      const kd = k < per ? 0 : 1
      seed[n] = rnd(); kind[n] = kd; dl[n] = delay[i]; idx[n] = i
      end[n * 3] = ends[i].x; end[n * 3 + 1] = ends[i].y; end[n * 3 + 2] = ends[i].z
      let ox, oy, oz, lx, ly
      if (kd === 0) {
        const s = o.spread ?? 0.14
        ox = gauss() * s; oy = gauss() * s; oz = gauss() * s
        lx = rnd() - 0.5; ly = rnd() - 0.5   // until the plot has loaded: anywhere on it
      } else {
        ox = gauss() * 0.12; oy = gauss() * 0.12; oz = gauss() * 0.12
        const r = rim(); lx = r[0]; ly = r[1]
      }
      off[n * 3] = ox; off[n * 3 + 1] = oy; off[n * 3 + 2] = oz
      land[n * 2] = lx; land[n * 2 + 1] = ly
    }
  })
  // the core: a ball, denser toward its middle
  for (let k = 0; k < coreN; k++, n++) {
    seed[n] = rnd(); kind[n] = 2; idx[n] = 0
    const z = 2 * rnd() - 1, a = rnd() * Math.PI * 2, s = Math.sqrt(1 - z * z), r = Math.pow(rnd(), 1.8)
    off[n * 3] = r * s * Math.cos(a); off[n * 3 + 1] = r * z; off[n * 3 + 2] = r * s * Math.sin(a)
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, a, s] of [['aSeed', seed, 1], ['aKind', kind, 1], ['aDelay', dl, 1], ['aIdx', idx, 1], ['aEnd', end, 3], ['aOff', off, 3], ['aLand', land, 2]]) geo.setAttribute(k, new BufferAttribute(a, s))
  const srgb = (hex) => new Color(hex).convertLinearToSRGB()
  const mat = material(SUN_VERT, {
    uAxis: { value: axis }, uRight: { value: new Vector3(1, 0, 0) }, uUp: { value: new Vector3(0, 1, 0) }, uView: { value: new Vector3(0, 0, 1) },
    uSquash: { value: new Vector4(sq[0], sq[1], sq[2], sq[3]) }, uKeep: { value: new Vector4(keep[0], keep[1], keep[2], keep[3]) },
    uAng: { value: 0 }, uOmega: { value: omega }, uSince: { value: 0 }, uOn: { value: 0 }, uCoreOn: { value: 0 },
    uTravel: { value: travel }, uFlare: { value: flare }, uShed: { value: shedL }, uLag: { value: o.lag ?? 0.12 },
    uPileR: { value: pileR }, uBack: { value: o.back ?? 0.45 },
    uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.7 }, uVeil: { value: new Array(MAXI).fill(1) },
    uDim: { value: Array.from({ length: MAXI }, () => new Vector2(1, 1)) },
    uColor: { value: srgb(o.color || '#9cc4ff') }, uWhite: { value: srgb(o.white || '#e8eefa') }, uCore: { value: srgb(o.coreColor || '#b4ceff') },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)

  // Once a frame, before the first of its parts is drawn: the camera's right, up and the
  // way to it in the sun's own frame (the plots face it, the spots lie in its picture
  // plane, what is far from it dims), and where each plot and the core stand on the
  // screen. One covered by a nearer one steps back (its veil), so the one in front reads;
  // one over the core steps back, so the core does; a plot over the count fades down.
  const u = mat.uniforms
  const gq = new Quaternion(), cq = new Quaternion(), cp = new Vector3(), c0 = new Vector3(), c1 = new Vector3()
  const box = items.map(() => ({ x: 0, y: 0, hx: 0, hy: 0, z: 0, on: false, keep: 0 }))
  const core = { at: new Vector3(), x: 0, y: 0, z: 0, hx: 0, hy: 0 }
  const capt = { x: (keep[0] + keep[1]) / 2, y: (keep[2] + keep[3]) / 2, hx: (keep[1] - keep[0]) / 2, hy: (keep[3] - keep[2]) / 2 }
  // the share of rectangle a (on the screen: its middle and half sizes) that b covers
  const cross = (a, b) => Math.max(0, Math.min(a.x + a.hx, b.x + b.hx) - Math.max(a.x - a.hx, b.x - b.hx))
    * Math.max(0, Math.min(a.y + a.hy, b.y + b.hy) - Math.max(a.y - a.hy, b.y - b.hy)) / Math.max(4 * a.hx * a.hy, 1e-6)
  // a point of the sun's frame, `hw` and `hh` to the camera's right and up from it, on the screen
  const onScreen = (b, at, hw, hh, camera) => {
    c1.copy(at).addScaledVector(u.uRight.value, hw).addScaledVector(u.uUp.value, hh)
    c0.copy(at).applyMatrix4(g.matrixWorld).project(camera); c1.applyMatrix4(g.matrixWorld).project(camera)
    b.x = c0.x; b.y = c0.y; b.z = c0.z; b.hx = Math.abs(c1.x - c0.x); b.hy = Math.abs(c1.y - c0.y)
  }
  const veil = u.uVeil.value
  let seen = -1, veilT = 0
  const arrange = (renderer, camera) => {
    const frame = renderer.info.render.frame
    if (frame === seen) return
    seen = frame
    g.getWorldQuaternion(gq).invert().multiply(camera.getWorldQuaternion(cq))
    u.uRight.value.set(1, 0, 0).applyQuaternion(gq)
    u.uUp.value.set(0, 1, 0).applyQuaternion(gq)
    g.worldToLocal(camera.getWorldPosition(cp))
    u.uView.value.copy(cp).normalize()
    onScreen(core, core.at, 0.886 * pileR, 0.886 * pileR, camera)
    plots.forEach((p, i) => {
      const b = box[i]
      b.on = p.grow > 0.05
      if (!b.on) return
      onScreen(b, p.mesh.position, p.mesh.scale.x / 2, p.mesh.scale.y / 2, camera)
      b.keep = cross(b, capt)
    })
    // the veils ease on the engine clock (a still taken after the world ran undrawn lands on them)
    const k = 1 - Math.exp(-Math.max(0, now - veilT) / 0.3); veilT = now
    box.forEach((b, i) => {
      let covered = 0, onCore = 0
      if (b.on) {
        for (const c of box) if (c !== b && c.on && c.z < b.z) covered += cross(b, c)
        onCore = cross(b, core)
      }
      const want = Math.min(1 - 0.9 * smooth(0.0, 0.12, covered), 1 - 0.78 * smooth(0.02, 0.08, onCore))
      veil[i] += (want - veil[i]) * k
    })
    for (const p of plots) {
      p.mesh.quaternion.copy(gq); p.mesh.updateMatrixWorld()
      // behind the core it dims, as the grains do
      const near = smooth(-0.9, 0.4, p.mesh.position.dot(u.uView.value) / sq[2])
      p.pm.opacity = peak * p.grow * u.uOn.value * (back + (1 - back) * near) * veil[p.i] * (1 - 0.8 * smooth(0, 0.15, box[p.i].keep))
    }
  }
  pts.onBeforeRender = (r, s, camera) => arrange(r, camera)

  // the plots: pictures on planes, drawn additively so their black is the world's
  const loader = new TextureLoader()
  const peak = o.opacity ?? 0.95, back = o.back ?? 0.45
  let loading = 0, alive = true
  const plots = []
  items.forEach((it, i) => {
    const pm = new MeshBasicMaterial({ transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, depthTest: true, color: 0xffffff })
    const mesh = new Mesh(new PlaneGeometry(1, 1), pm)
    mesh.visible = false   // never a blank white plane before its picture
    const plot = { i, mesh, pm, w: Math.sqrt(area / 0.7), h: Math.sqrt(area * 0.7), grow: 0 }
    mesh.onBeforeRender = (r, s, camera) => arrange(r, camera)
    loading++
    loader.load(ctx.asset ? ctx.asset(it.src) : it.src, (tex) => {
      loading--
      if (!alive) { tex.dispose(); return }
      tex.colorSpace = SRGBColorSpace; tex.anisotropy = ctx.anisotropy || 4
      pm.map = tex; pm.needsUpdate = true
      const im = tex.image
      // the same area whatever its shape
      if (im && im.width) { const a = im.height / im.width; plot.w = Math.sqrt(area / a); plot.h = Math.sqrt(area * a) }
      spotsFrom(im, rays[i])
    }, undefined, () => { loading--; console.warn('stage: sun plot failed', it.src) })
    g.add(mesh); plots.push(plot)
  })

  // a plot's grains land on its drawing: spots picked among its bright pixels
  function spotsFrom(im, ray) {
    if (!im || !im.width) return
    const cw = 128, ch = Math.max(1, Math.round(cw * im.height / im.width))
    const c = document.createElement('canvas'); c.width = cw; c.height = ch
    const cx = c.getContext('2d', { willReadFrequently: true })
    cx.drawImage(im, 0, 0, cw, ch)
    const px = cx.getImageData(0, 0, cw, ch).data
    const lit = []
    for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
      const k = (y * cw + x) * 4
      if (0.2126 * px[k] + 0.7152 * px[k + 1] + 0.0722 * px[k + 2] > 120) lit.push((x + 0.5) / cw - 0.5, 0.5 - (y + 0.5) / ch)
    }
    if (!lit.length) return
    const pick = mulberry32(ray.from + 1)
    for (let q = ray.from; q < ray.to; q++) {
      const j = Math.floor(pick() * (lit.length / 2)) * 2
      land[q * 2] = lit[j]; land[q * 2 + 1] = lit[j + 1]
    }
    geo.attributes.aLand.needsUpdate = true
  }

  // t0: when the rays set out (it may lie ahead: only the core shows before it); the turn
  // starts there. gatherT: when the core began to gather. hideT: when the camera left.
  let now = 0, last = 0, t0 = -1, gatherT = -1, hideT = -1, level = 0, armed = false, armedAt = 0, nearSince = -1
  let doneCbs = []                             // the arrival's onDone, called once the plots stand
  const done = () => { const cbs = doneCbs; doneCbs = []; for (const cb of cbs) cb() }
  const start = (t) => { gatherT = t; t0 = t + (o.after ?? 0.5); hideT = -1; level = 1 }
  const busy = () => armed || (t0 >= 0 && hideT < 0 && (loading > 0 || now - t0 < settles))
  const api = {
    busy,
    // the camera sets out for the station: scatter, start from nothing on arrival
    arm() { done(); armed = true; armedAt = now; if (t0 >= 0 && hideT < 0 && now - gatherT < 0.5) { t0 = -1; gatherT = -1; level = 0 } },
    // the arrival (or the deck opened here): the core gathers and the rays set out
    // `after` seconds later. `c` (the arrival again) leaves a sun that stands, and one
    // fading comes back from where it is
    assemble(t, onDone) {
      now = t; armed = false
      if (onDone) doneCbs.push(onDone)
      if (t0 < 0 || level <= 0) start(t)
      else hideT = -1
    },
  }
  const sunAt = new Vector3()
  return {
    group: g, labels: [], api, frameScale: mat.uniforms.uPixelRatio,
    update(t, camPos) {
      const dt = Math.max(0, t - last); last = t; now = t
      if (armed && t - armedAt > 6) armed = false   // the flight was turned away
      // the camera's distance: gone past `far`, it fades; near for a second without an
      // arrival (a jump with no flight), it starts as on an arrival
      if (camPos) {
        g.getWorldPosition(sunAt)
        const near = camPos.distanceTo(sunAt) < far
        nearSince = near ? (nearSince < 0 ? t : nearSince) : -1
        if (!near && t0 >= 0 && hideT < 0) hideT = t
        if (near && t - nearSince > 1 && !armed && t0 < 0) start(t)
      }
      if (doneCbs.length && (t0 < 0 || hideT >= 0 || (t - t0 >= settles && loading === 0))) done()
      if (t0 >= 0) {
        // the fade: down over 1.2 s once the camera has left, back up as fast if it returns
        level = Math.min(1, Math.max(0, level + (hideT >= 0 ? -dt : dt) / 1.2))
        if (hideT >= 0 && level <= 0) { t0 = -1; gatherT = -1; hideT = -1 }
      }
      g.visible = t0 >= 0
      if (!g.visible) return
      const ang = omega * Math.max(0, t - t0)
      u.uTime.value = t; u.uAng.value = ang; u.uSince.value = t - t0; u.uOn.value = ease(level)
      u.uCoreOn.value = Math.min(ease(level), Math.max(0, (t - gatherT) / 1.2))
      for (const p of plots) {
        standAt(ends[p.i], ang, p.mesh.position)
        // it shows as its first grains land, growing a little into its size
        p.grow = ease((t - t0 - delay[p.i] - travel + 0.2) / 1.0)
        const s = 0.8 + 0.2 * p.grow
        p.mesh.scale.set(p.w * s, p.h * s, 1)
        u.uDim.value[p.i].set(p.w * s, p.h * s)
        p.mesh.visible = p.grow > 0.001 && level > 0 && !!p.pm.map   // never a blank white plane before its picture
      }
    },
    dispose() { alive = false; for (const p of plots) { p.pm.map?.dispose(); p.pm.dispose(); p.mesh.geometry.dispose() } },
  }
}

export function installSun(registerBuilder) {
  registerBuilder('sun', buildSun, { fields: ['pos', 'items'] })
}
