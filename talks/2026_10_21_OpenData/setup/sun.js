import {
  Group, Points, Mesh, PlaneGeometry, MeshBasicMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3, Quaternion,
  TextureLoader, SRGBColorSpace, Vector4,
} from 'three'
import { mulberry32 } from './ring.js'
import { state, listen, tick, waiting, material, PLACE } from './grains.js'

// ---- sun ----------------------------------------------------------------------------
//   { type: sun, name, pos, items: [{ src?, at: [x, y, z] }, …], squash?: [sx, sy, sz, sy below],
//     axis?: [0, 1, 0], turn?: 72 (s a turn), w?: 6, pileR?: 1.9, piles?: [[x, y, z, r], …], after?: 0.5,
//     travel?: 1.7, delay?: 0.2, stagger?: 0.06, lag?: 0.15, back?: 0.4, keepOut?: [x0, x1, y0, y1],
//     opacity?: 0.95, color?, alpha?, size?, grains?: 700 a ray, cloud?: 1000 a place, shed?: 90 each,
//     shedFor?: 3.5, seed?: 5 }
// Who uses the open data, as a sun round the gold pile: rays of grains leave it to
// every side in 3D, each ending at a plot made from the open data (an item with a
// `src`) or at an empty place (an item without one): a cloud of grains the size of a
// plot, stirring, the room there is for the next use. `at` is where each stands, from
// the pile's middle, as the sun opens.
//
// The whole sun turns about `axis` (tilted toward the camera, so the near half of an
// orbit runs lower on the screen than the far half, and plots going opposite ways
// mostly pass apart), once in `turn` seconds. It turns inside the ellipsoid `squash` (half widths across, up,
// toward the camera, and down): a round turn as deep as the sun is wide would bring
// the near plots up to the lens and send the far ones off to specks, so the turn is
// worked out on a unit sphere and stretched to the ellipsoid. The plots stay upright
// and face the camera; those behind the pile dim to `back` and the pile hides them
// where it covers them (they are depth tested; the piles write their depth). Where two
// still cross on the screen, the one behind steps back almost to nothing, so the one in
// front reads; and one passing in front of a pile (`piles`, from the sun's middle, with
// their radii: the 4 PB pile by default) steps back to a fifth, so the gold stays the
// sun's middle. The layout (`at`, `axis`, `squash`) was searched so that this seldom
// happens while the slide is up.
//
// Grains run out along each ray from the pile, the ray bowed back against the turn
// like a jet from a turning sprinkler; the last stretch fans out over the plot, and
// each grain lands on a spot of its drawing (the plot's bright pixels) and sparks
// there for a moment. A plot or a place sheds a few grains as it turns: they stay
// where they left it, drifting out and fading, a wake behind it. Nothing is drawn
// over the slide's caption: grains and plots in the box `keepOut` (the screen's
// −1…1) fade down to a fifth.
//
// Step 1: the rays grow out of the pile one after another, round the sun from the
// top, and each plot shows as its first grains land; the turn starts at the layout
// above. When the camera flies in to the store, the piles gather there again, and the
// rays set out `after` seconds after it lands, out of the gathering gold. Step 0:
// everything fades within 1.2 s. Taken back while fading, it comes back from where it
// is, still turning; `c` leaves a sun that stands as it is.
const MAXI = 32
const SUN_VERT = /* glsl */ `
attribute float aSeed, aKind, aDelay, aEmpty, aIdx;  // 0 a grain on its ray, 1 a grain of an empty place, 2 one shed as it turns; its item
attribute vec3 aEnd, aOff;                     // the ray's end on the unit sphere (unturned); the grain's own offset
attribute vec2 aLand;                          // its spot on the plot (shares of the width and height), or on the rim
uniform vec3 uAxis, uRight, uUp, uView, uColor, uWhite;
uniform vec4 uSquash, uKeep;
uniform float uAng, uOmega, uSince, uOn, uTravel, uFlare, uShed, uLag, uPileR, uW, uH, uBack, uSize, uAlpha;
uniform float uVeil[${MAXI}];                  // an item covered on the screen by a nearer one steps back
${PLACE}
vec3 turn(vec3 v, float a) { float c = cos(a), s = sin(a); return v * c + cross(uAxis, v) * s + uAxis * dot(uAxis, v) * (1.0 - c); }
vec3 squash(vec3 v) { return v * vec3(uSquash.x, v.y > 0.0 ? uSquash.y : uSquash.w, uSquash.z); }
vec3 endAt(float a) { return squash(turn(aEnd, a)); }
void off_() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; }
void main() {
  float since = uSince - aDelay;               // since this ray set out
  float veil = uVeil[int(aIdx + 0.5)];
  vec3 E = endAt(uAng);
  vec3 spot = aLand.x * uW * uRight + aLand.y * uH * uUp;
  vec3 p; float alpha; float size;
  if (aKind < 0.5) {
    float life = uTravel + uFlare;
    float age = fract(aSeed * 7.31 + uTime / life) * life;   // since it left the pile
    if (age > since) { off_(); return; }                     // it would have left before its ray set out
    if (age < uTravel) {
      float s = age / uTravel;
      // part way to where its end was a moment ago: the ray bows back against the turn
      vec3 Eb = endAt(uAng - uLag * sin(3.14159 * s));
      p = mix(normalize(E) * uPileR, Eb, s) + aOff * sin(3.14159 * s);
      // the last stretch fans out over the plot, each grain to its own spot
      p = mix(p, E + spot, smoothstep(0.76, 1.0, s));
      alpha = uAlpha * smoothstep(0.0, 0.05, s) * (aEmpty > 0.5 ? 0.6 : 1.0);
      size = uSize * (0.7 + 0.6 * hash(aSeed * 13.0));
    } else {
      // landed: a spark on the drawing, then gone
      float f = (age - uTravel) / uFlare;
      p = E + spot;
      alpha = uAlpha * (aEmpty > 0.5 ? 0.8 : 1.7) * (1.0 - f) * (1.0 - f) * veil;
      size = uSize * (0.9 + 1.3 * (1.0 - f));
    }
  } else if (aKind < 1.5) {
    // an empty place: a cloud the size of a plot, facing the camera, stirring round its
    // middle and breathing; it gathers as its ray arrives
    float f = ease((since - uTravel + 0.6) / 2.0);
    float w = uTime * (0.22 + 0.3 * hash(aSeed * 5.0));
    vec2 q = vec2(cos(w) * aOff.x - sin(w) * aOff.y, sin(w) * aOff.x + cos(w) * aOff.y);
    float br = 1.0 + 0.07 * sin(uTime * 0.9 + aSeed * 6.0);
    vec3 home = E + (q.x * uW * uRight + q.y * uH * uUp) * 0.36 * br + uView * aOff.z * uH * 0.25;
    vec3 far = E + normalize(aOff + 1e-4) * uW * (1.5 + 2.5 * hash(aSeed * 3.0));
    p = mix(far, home, f);
    alpha = uAlpha * 1.1 * f * (0.65 + 0.35 * sin(uTime * 1.3 + aSeed * 30.0)) * veil;
    size = uSize * (0.9 + 1.0 * hash(aSeed * 29.0));
  } else {
    // shed: it left the rim where the plot stood a moment ago, and drifts out from there
    float age = fract(aSeed * 3.71 + uTime / uShed) * uShed;
    if (age > since - uTravel - 0.8) { off_(); return; }       // only once its plot stands
    vec3 Ep = endAt(uAng - uOmega * age);
    p = Ep + spot + normalize(Ep) * age * 0.35 + aOff * age;
    float f = age / uShed;
    alpha = uAlpha * 1.3 * smoothstep(0.0, 0.06, f) * (1.0 - f) * (1.0 - f) * veil;
    size = uSize * (0.8 + 0.8 * hash(aSeed * 17.0));
  }
  // behind the pile it dims (and the pile hides it where it covers it: depth tested)
  alpha *= mix(uBack, 1.0, smoothstep(-0.9, 0.4, dot(p, uView) / uSquash.z)) * uOn;
  if (alpha <= 0.0) { off_(); return; }
  place(p, size, alpha, mix(uColor, uWhite, 0.35 * hash(aSeed * 41.0) + (aKind > 0.5 ? 0.2 : 0.0)), aSeed);
  // nothing over the caption
  vec2 n = gl_Position.xy / gl_Position.w;
  float k = (smoothstep(uKeep.x - 0.05, uKeep.x, n.x) - smoothstep(uKeep.y, uKeep.y + 0.05, n.x))
          * (smoothstep(uKeep.z - 0.05, uKeep.z, n.y) - smoothstep(uKeep.w, uKeep.w + 0.05, n.y));
  vAlpha *= 1.0 - 0.8 * k;
}`

const ease = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (x * 6 - 15) + 10) }
const smooth = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x) }

function buildSun(o, ctx) {
  const items = (o.items || []).slice(0, MAXI)
  const sq = o.squash || [24, 12, 9, 9]
  const axis = new Vector3(...(o.axis || [0, 1, 0])).normalize()
  const omega = (2 * Math.PI) / (o.turn ?? 72)
  const w = o.w ?? 6, pileR = o.pileR ?? 1.9
  const travel = o.travel ?? 1.7, flare = o.flare ?? 0.5, shedL = o.shedFor ?? 3.5
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
  order.forEach((i, r) => { delay[i] = (o.delay ?? 0.2) + (o.stagger ?? 0.06) * r })
  const settles = Math.max(0, ...delay) + travel + 1.2

  // the grains: as many as the device's budget allows
  const f = Math.max(0.3, Math.min(1, (ctx.budget ?? 300000) / 300000))
  const per = Math.round((o.grains ?? 700) * f), perEmpty = Math.round(per * 0.6)
  const cloudN = Math.round((o.cloud ?? 1000) * f), shedN = Math.round((o.shed ?? 90) * f)
  const counts = items.map((it) => (it.src ? per : perEmpty + cloudN) + shedN)
  const N = counts.reduce((a, b) => a + b, 0)
  const seed = new Float32Array(N), kind = new Float32Array(N), dl = new Float32Array(N), empty = new Float32Array(N), idx = new Float32Array(N)
  const end = new Float32Array(N * 3), off = new Float32Array(N * 3), land = new Float32Array(N * 2), pos = new Float32Array(N * 3)
  const rays = []   // per item: where its ray's grains lie, so a plot's bright pixels can become their spots
  // a spot on the rim of a plot (a rectangle) or of a place (an ellipse)
  const rim = (isEmpty) => {
    if (isEmpty) { const a = rnd() * Math.PI * 2; return [0.3 * Math.cos(a), 0.3 * Math.sin(a)] }
    const u = rnd() - 0.5, side = rnd()
    return side < 0.25 ? [u, 0.5] : side < 0.5 ? [u, -0.5] : side < 0.75 ? [0.5, u] : [-0.5, u]
  }
  let n = 0
  items.forEach((it, i) => {
    const isEmpty = !it.src
    const rayN = isEmpty ? perEmpty : per
    rays.push({ from: n, to: n + rayN })
    for (let k = 0; k < counts[i]; k++, n++) {
      const kd = k < rayN ? 0 : k < rayN + (isEmpty ? cloudN : 0) ? 1 : 2
      seed[n] = rnd(); kind[n] = kd; dl[n] = delay[i]; empty[n] = isEmpty ? 1 : 0; idx[n] = i
      end[n * 3] = ends[i].x; end[n * 3 + 1] = ends[i].y; end[n * 3 + 2] = ends[i].z
      let ox, oy, oz, lx, ly
      if (kd === 0) {
        const s = o.spread ?? 0.14
        ox = gauss() * s; oy = gauss() * s; oz = gauss() * s
        if (isEmpty) { const a = rnd() * Math.PI * 2, r = 0.3 * Math.sqrt(rnd()); lx = r * Math.cos(a); ly = r * Math.sin(a) }
        else { lx = rnd() - 0.5; ly = rnd() - 0.5 }   // until the plot has loaded: anywhere on it
      } else if (kd === 1) {
        // a cloud the shape of a plot, dense in its middle, so it glows there
        const a = rnd() * Math.PI * 2, r = Math.pow(rnd(), 1.4)
        ox = r * Math.cos(a); oy = r * Math.sin(a); oz = gauss() * 0.5; lx = 0; ly = 0
      } else {
        ox = gauss() * 0.12; oy = gauss() * 0.12; oz = gauss() * 0.12
        const r = rim(isEmpty); lx = r[0]; ly = r[1]
      }
      off[n * 3] = ox; off[n * 3 + 1] = oy; off[n * 3 + 2] = oz
      land[n * 2] = lx; land[n * 2 + 1] = ly
    }
  })
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, a, s] of [['aSeed', seed, 1], ['aKind', kind, 1], ['aDelay', dl, 1], ['aEmpty', empty, 1], ['aIdx', idx, 1], ['aEnd', end, 3], ['aOff', off, 3], ['aLand', land, 2]]) geo.setAttribute(k, new BufferAttribute(a, s))
  const h = w * 0.625
  const mat = material(SUN_VERT, {
    uAxis: { value: axis }, uRight: { value: new Vector3(1, 0, 0) }, uUp: { value: new Vector3(0, 1, 0) }, uView: { value: new Vector3(0, 0, 1) },
    uSquash: { value: new Vector4(sq[0], sq[1], sq[2], sq[3]) }, uKeep: { value: new Vector4(keep[0], keep[1], keep[2], keep[3]) },
    uAng: { value: 0 }, uOmega: { value: omega }, uSince: { value: 0 }, uOn: { value: 0 },
    uTravel: { value: travel }, uFlare: { value: flare }, uShed: { value: shedL }, uLag: { value: o.lag ?? 0.15 },
    uPileR: { value: pileR }, uW: { value: w }, uH: { value: h }, uBack: { value: o.back ?? 0.4 },
    uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.7 }, uVeil: { value: new Array(MAXI).fill(1) },
    uColor: { value: new Color(o.color || '#ffc05a').convertLinearToSRGB() }, uWhite: { value: new Color(1, 0.97, 0.9) },
  })
  mat.depthTest = true   // the pile hides what passes behind it
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)

  // Once a frame, before the first of its parts is drawn: the camera's right, up and the
  // way to it in the sun's own frame (the plots face it, the clouds and spots lie in its
  // picture plane, what is far from it dims), and where each plot, place and pile stands
  // on the screen. One covered by a nearer one steps back (its veil), so the one in front
  // reads; one in front of a pile steps back, so the gold does; a plot over the caption
  // fades down.
  const u = mat.uniforms
  const gq = new Quaternion(), cq = new Quaternion(), cp = new Vector3(), c0 = new Vector3(), c1 = new Vector3()
  const box = items.map(() => ({ x: 0, y: 0, hx: 0, hy: 0, z: 0, on: false, keep: 0 }))
  // a pile as the square of its disc's area (its middle from the sun's, and its radius)
  const piles = (o.piles || [[0, 0, 0, pileR]]).map(([x, y, z, r]) => ({ at: new Vector3(x, y, z), r, x: 0, y: 0, z: 0, hx: 0, hy: 0 }))
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
  const veil = u.uVeil.value, stand = new Vector3()
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
    for (const pl of piles) onScreen(pl, pl.at, 0.886 * pl.r, 0.886 * pl.r, camera)
    // each one faces the camera, so it stands on the screen as a rectangle (a place: the
    // size of its cloud)
    items.forEach((it, i) => {
      const b = box[i], p = plotOf[i]
      b.on = p ? p.grow > 0.05 : u.uSince.value - delay[i] - travel > 0.4
      if (!b.on) return
      onScreen(b, standAt(ends[i], u.uAng.value, stand), p ? p.mesh.scale.x / 2 : 0.36 * w, p ? p.mesh.scale.y / 2 : 0.36 * h, camera)
      b.keep = cross(b, capt)
    })
    // the veils ease on the engine clock (a still taken after the world ran undrawn lands on them)
    const k = 1 - Math.exp(-Math.max(0, now - veilT) / 0.3); veilT = now
    box.forEach((b, i) => {
      let covered = 0, onPile = 0
      if (b.on) {
        for (const c of box) if (c !== b && c.on && c.z < b.z) covered += cross(b, c)
        for (const pl of piles) if (pl.z > b.z) onPile += cross(b, pl)
      }
      const want = Math.min(1 - 0.9 * smooth(0.03, 0.25, covered), 1 - 0.78 * smooth(0.02, 0.08, onPile))
      veil[i] += (want - veil[i]) * k
    })
    for (const p of plots) {
      p.mesh.quaternion.copy(gq); p.mesh.updateMatrixWorld()
      // behind the pile it dims, as the grains do
      const near = smooth(-0.9, 0.4, p.mesh.position.dot(u.uView.value) / sq[2])
      p.pm.opacity = peak * p.grow * u.uOn.value * (back + (1 - back) * near) * veil[p.i] * (1 - 0.8 * smooth(0, 0.15, box[p.i].keep))
    }
  }
  pts.onBeforeRender = (r, s, camera) => arrange(r, camera)

  // the plots: pictures on planes, drawn additively so their black is the world's
  const base = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '')
  const url = (src) => (ctx.asset ? ctx.asset(src) : String(src).startsWith('/') ? base + src : src)
  const loader = new TextureLoader()
  const peak = o.opacity ?? 0.95, back = o.back ?? 0.4
  let loading = 0
  const plots = [], plotOf = []
  items.forEach((it, i) => {
    if (!it.src) return
    const pm = new MeshBasicMaterial({ transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, depthTest: true, color: 0xffffff })
    const mesh = new Mesh(new PlaneGeometry(1, 1), pm)
    mesh.visible = false
    const plot = { i, mesh, pm, aspect: 0.625, grow: 0 }
    mesh.onBeforeRender = (r, s, camera) => arrange(r, camera)
    loading++
    loader.load(url(it.src), (tex) => {
      loading--
      tex.colorSpace = SRGBColorSpace; tex.anisotropy = ctx.anisotropy || 4
      pm.map = tex; pm.needsUpdate = true
      const im = tex.image
      if (im && im.width) plot.aspect = im.height / im.width
      spotsFrom(im, rays[i])
    }, undefined, () => { loading--; console.warn('stage: sun plot failed', it.src) })
    g.add(mesh); plots.push(plot); plotOf[i] = plot
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

  // t0: when the rays set out (it may lie ahead: nothing shows before it); the turn starts there
  let now = 0, last = 0, t0 = -1, hideT = -1, level = 0
  let step = state.has(o.name) ? state.get(o.name) : 0, armed = false, armedAt = 0
  let doneCbs = []                             // the arrival's onDone, called once the plots stand
  const done = () => { const cbs = doneCbs; doneCbs = []; for (const cb of cbs) cb() }
  const start = (t) => { t0 = t; hideT = -1; level = 1 }
  const go = (k) => {
    step = k
    if (armed) return                          // the camera is on its way here: the arrival starts it
    if (k) {
      if (t0 < 0) start(now)
      else hideT = -1                          // taken back while fading: it comes back from where it is
    } else if (t0 >= 0 && hideT < 0) hideT = now
  }
  const offL = listen(o.name, go)
  mat.addEventListener('dispose', offL)
  // opened on its slide (a reload, a link): the engine assembles the station it opens on, else at 1 s
  if (step) { armed = true; armedAt = -5 }
  // busy (v0.7) while the rays grow and the plots arrive, a plot is still loading, it
  // fades out, or a step for later is to come; the turn itself runs on while it is seen
  const busy = () => waiting(o.name) || (armed && !!step) || (t0 >= 0 && ((hideT < 0 && (loading > 0 || now - t0 < settles)) || hideT >= 0 || level < 1))
  const api = {
    busy,
    // the camera sets out for the store: a sun set going on this slide's step a moment
    // ago waits for the arrival instead
    arm() { done(); armed = true; armedAt = now; if (t0 >= 0 && hideT < 0 && now - t0 < 0.5) t0 = -1 },
    // the arrival: the piles gather again there, and the rays set out `after` seconds
    // later, out of the gathering gold. `c` (the arrival again) leaves a sun that stands,
    // and one fading comes back from where it is. The station counts as built once the
    // plots stand (what waits on it, a recording's settle among them, waits for them)
    assemble(t, onDone) {
      now = t; armed = false
      if (onDone) doneCbs.push(onDone)
      if (!step) { if (t0 >= 0 && hideT < 0) hideT = t }
      else if (t0 < 0) start(t + (o.after ?? 0.5))
      else hideT = -1
    },
  }
  return {
    group: g, labels: [], api, frameScale: mat.uniforms.uPixelRatio,
    update(t) {
      tick(t)
      const dt = Math.max(0, t - last); last = t; now = t
      if (armed && t - armedAt > 6) { armed = false; go(step) }   // the flight was turned away
      if (doneCbs.length && (t0 < 0 || hideT >= 0 || t - t0 >= settles)) done()
      if (t0 >= 0) {
        // the fade: down over 1.2 s once stopped, back up as fast if taken back
        level = Math.min(1, Math.max(0, level + (hideT >= 0 ? -dt : dt) / 1.2))
        if (hideT >= 0 && level <= 0) { t0 = -1; hideT = -1 }
      }
      g.visible = t0 >= 0
      if (!g.visible) return
      const ang = omega * (t - t0)
      u.uTime.value = t; u.uAng.value = ang; u.uSince.value = t - t0; u.uOn.value = ease(level)
      for (const p of plots) {
        standAt(ends[p.i], ang, p.mesh.position)
        // it shows as its first grains land, growing a little into its size
        p.grow = ease((t - t0 - delay[p.i] - travel + 0.2) / 1.0)
        const s = 0.8 + 0.2 * p.grow
        p.mesh.scale.set(w * s, w * p.aspect * s, 1)
        p.mesh.visible = p.grow > 0.001 && level > 0 && !!p.pm.map   // never a blank white plane before its picture
      }
    },
    dispose() { offL(); for (const p of plots) p.pm.map?.dispose() },
  }
}

export function installSun(registerBuilder) {
  registerBuilder('sun', buildSun, { fields: ['pos', 'name', 'items'] })
}
