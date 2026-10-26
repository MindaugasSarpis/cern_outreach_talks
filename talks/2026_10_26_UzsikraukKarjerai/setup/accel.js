import { Group, Points, BufferGeometry, BufferAttribute, Color, Vector3 } from 'three'
import { material, PLACE, state } from './grains.js'
import { bus } from '../components/lhc-opening/bus.js'

// The close (slide 16) as a world of its own (the owner, 24 Oct: "why is this not fullscreen, make it
// vast, filling the entire screen"; "maybe slowly orbit, indicate 3D fcc 300m underground"; "Then,
// 'Ačiū už dėmesį' appears out of particle collision"; the recorded close's point cloud was "a bit too
// fuzzy"). Two builders:
//
// ---- accel --------------------------------------------------------------------------
//   { type: accel, pos, map: 'data/accel_map.json', scale?: 2.2 (units a km), depth?: 0.04 (units a
//     metre below the surface: the depths drawn ~20 times deeper than true so the layers read),
//     lhcDepth?: 100, fccDepth?: 200 (m), show?: { below: 60, over: 25 }, step?: (a grain step name: shown only while it is on) }
// Innoday's accelerator map (hero/ring_map.py: OpenStreetMap's tunnels, Lake Geneva, the border, the
// Rhône and the ridges; km east and north of the LHC's centre) north up, as a surface of faint grains
// with the rings under it: the LHC (4,22 km) at `lhcDepth` with its two beams going round it both ways,
// the proposed FCC (90,7 km) dashed at `fccDepth`, a shaft of grains from the surface down to each ring
// at LHCb's Point 8 and at the FCC's eight sites (evenly round it here: the sites' places are
// indicative). It shows as the camera rises out of the cavern below it (its height over the station's
// surface less `show.below`, eased over `show.over` units), so no step is needed and the data slide,
// down in the cavern, never sees it. anchors: `lhc`, `fcc`, `p8`, `fccShaft` (the label points).
//
// ---- word ---------------------------------------------------------------------------
//   { type: word, name, pos, text, from: (a collision's name), height?: 6, grains?: 26000,
//     font?: '500 200px "Space Grotesk"', color?: '#eef1ff', size?: 1.6, gather?: 2.2, burstY?: 0 (the vertex this far above the word's middle) }
// The text as grains, standing up and turned to the camera: at the named collision's crossing they
// burst from its vertex (the word's middle) like its debris and gather into the letters over `gather`
// seconds, the inner ones first; then they hold with a slow shimmer. The collision's step back to 0
// hides them.

const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }
const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v) }

const ACCEL_VERT = /* glsl */ `
attribute vec4 aA;      // kind 0 (still): xyz, alpha · kind 1 (beam): angle, radial offset, height, direction
attribute vec3 aCol;
attribute float aSeed, aKind, aSize;
uniform float uShow, uR, uY, uSpeed;
${PLACE}
void main() {
  if (uShow <= 0.002) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  vec3 p; float a;
  if (aKind < 0.5) { p = aA.xyz; a = aA.w; }
  else {
    float ang = aA.x + aA.w * uSpeed * uTime, r = uR + aA.y;
    p = vec3(r * cos(ang), uY + aA.z, -r * sin(ang));
    a = 0.75 * (0.45 + 0.55 * fract(sin(aSeed * 91.7) * 43758.5));
  }
  place(p, aSize, a * uShow, aCol, aSeed);
}`

function buildAccel(o, ctx) {
  const g = new Group()
  const S = o.scale ?? 2.2, D = o.depth ?? 0.04
  const yL = -(o.lhcDepth ?? 100) * D, yF = -(o.fccDepth ?? 200) * D
  const thin = Math.min(1, (ctx.budget || 300000) / 300000) ** 0.5
  const mat = material(ACCEL_VERT, { uShow: { value: 0 }, uR: { value: 1 }, uY: { value: yL }, uSpeed: { value: (2 * Math.PI) / (o.lap ?? 14) } })
  const u = mat.uniforms
  const anchors = new Map()
  const P = (e, n, y = 0) => new Vector3(e * S, y, -n * S)   // km east, km north, units up
  const recs = []   // [a0, a1, a2, a3, kind, r, g, b, size]
  const still = (v, a, c, size) => recs.push([v.x, v.y, v.z, a, 0, c[0], c[1], c[2], size])
  fetch(ctx.asset('/' + String(o.map || 'data/accel_map.json').replace(/^\//, ''))).then((r) => r.json()).then((M) => {
    const km = M.km ?? 4.22
    // the surface: the map's lines (shores, border, river, ridges, tunnels) and a faint sheet of ground
    for (const l of M.lines || []) {
      const c = rgb(l.color || '#9cc4ff'), n = Math.round((l.grains ?? 1500) * thin * 1.3), dash = l.dash || 0
      const seg = []; let total = 0
      for (let j = 1; j < l.pts.length; j++) { const d = Math.hypot(l.pts[j][0] - l.pts[j - 1][0], l.pts[j][1] - l.pts[j - 1][1]); seg.push(d); total += d }
      if (!total) continue
      for (let i = 0; i < n; i++) {
        let f = Math.random(); if (dash) f = (Math.floor(f * dash) + Math.random() * 0.5) / dash
        let s = f * total, j = 0
        while (j < seg.length - 1 && s > seg[j]) { s -= seg[j]; j++ }
        const k = seg[j] ? s / seg[j] : 0, A = l.pts[j], B = l.pts[j + 1], w = l.width ?? 0.03
        still(P(A[0] + (B[0] - A[0]) * k + gauss() * w, A[1] + (B[1] - A[1]) * k + gauss() * w), Math.min(1, (l.alpha ?? 0.5) * 1.5), c, 2.0)
      }
    }
    const fcc = (M.rings || [])[0] || { c: [4.322, -16.247], r: 14.435 }
    const ground = Math.round(42000 * thin), gc = rgb('#8fa8e8')
    for (let i = 0; i < ground; i++) {
      const a = Math.random() * Math.PI * 2, r = (fcc.r + 6) * Math.sqrt(Math.random())
      still(P(fcc.c[0] + r * Math.cos(a), fcc.c[1] + r * Math.sin(a)), 0.2, gc, 1.4)
    }
    // the FCC: dashed, its tunnel at depth, warm (proposed)
    const fc = rgb(o.fccColor || '#ff9a5c'), nf = Math.round(26000 * thin)
    for (let i = 0; i < nf; i++) {
      const t = (Math.floor(Math.random() * 90) + Math.random() * 0.55) / 90, a = t * Math.PI * 2, rr = fcc.r + gauss() * 0.06
      still(P(fcc.c[0] + rr * Math.cos(a), fcc.c[1] + rr * Math.sin(a), yF + gauss() * 0.1), 1, fc, 2.6)
    }
    // the LHC's tunnel, faint, and its two beams (kind 1), the ring round the station's origin
    u.uR.value = km * S
    const lc = rgb('#9cc4ff'), wc = rgb('#ffffff'), nl = Math.round(5000 * thin)
    for (let i = 0; i < nl; i++) { const a = Math.random() * Math.PI * 2; still(P(km * Math.cos(a), km * Math.sin(a), yL + gauss() * 0.06), 0.5, lc, 1.8) }
    const nb = Math.round(22000 * thin)
    for (let i = 0; i < nb; i++) {
      const beam = i % 2, trains = 18, tr = Math.floor(Math.random() * trains)
      const ang = Math.random() < 0.4 ? (tr + 0.5 + gauss() * 0.1) / trains * Math.PI * 2 : Math.random() * Math.PI * 2
      const c = beam ? wc : lc
      recs.push([ang, (beam ? -0.22 : 0.22) + gauss() * 0.07, gauss() * 0.07, beam ? -1 : 1, 1, c[0], c[1], c[2], 2.4])
    }
    // the shafts: LHCb's at Point 8 (bright), the FCC's eight
    const shaft = (e, n, y, c, a, grains, size) => { for (let i = 0; i < grains; i++) { const h = Math.random(); still(P(e + gauss() * 0.02, n + gauss() * 0.02, y * h), a * (0.55 + 0.45 * h), c, size) } }
    const p8 = ((M.p8 ?? -55.78) * Math.PI) / 180, e8 = km * Math.cos(p8), n8 = km * Math.sin(p8)
    shaft(e8, n8, yL, rgb('#ffffff'), 1, Math.round(2600 * thin), 2.4)
    for (let i = 0; i < 300; i++) still(P(e8 + gauss() * 0.12, n8 + gauss() * 0.12, yL + gauss() * 0.12), 1, rgb('#ffffff'), 2.6)
    for (let s = 0; s < 8; s++) {
      const a = (s + 0.5) / 8 * Math.PI * 2
      shaft(fcc.c[0] + fcc.r * Math.cos(a), fcc.c[1] + fcc.r * Math.sin(a), yF, fc, 1, Math.round(1600 * thin), 2.2)
    }
    anchors.set('p8', P(e8, n8, yL * 0.5))
    anchors.set('lhc', P(-km * 0.95, km * 0.45, yL))
    anchors.set('fcc', P(fcc.c[0] + fcc.r * Math.cos(-0.35), fcc.c[1] + fcc.r * Math.sin(-0.35), yF))
    const fs = 3.5 / 8 * Math.PI * 2
    anchors.set('fccShaft', P(fcc.c[0] + fcc.r * Math.cos(fs), fcc.c[1] + fcc.r * Math.sin(fs), yF * 0.5))
    anchors.set('centre', P(fcc.c[0], fcc.c[1], 0))
    const n = recs.length, A = new Float32Array(n * 4), C = new Float32Array(n * 3), seed = new Float32Array(n), kind = new Float32Array(n), size = new Float32Array(n)
    recs.forEach((r, i) => { A.set(r.slice(0, 4), i * 4); kind[i] = r[4]; C.set(r.slice(5, 8), i * 3); size[i] = r[8]; seed[i] = Math.random() })
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(new Float32Array(n * 3), 3))
    geo.setAttribute('aA', new BufferAttribute(A, 4)); geo.setAttribute('aCol', new BufferAttribute(C, 3))
    geo.setAttribute('aSeed', new BufferAttribute(seed, 1)); geo.setAttribute('aKind', new BufferAttribute(kind, 1)); geo.setAttribute('aSize', new BufferAttribute(size, 1))
    const pts = new Points(geo, mat); pts.frustumCulled = false
    g.add(pts)
  }).catch(() => console.warn('stage: accel map failed', o.map))
  const below = o.show?.below ?? 60, over = o.show?.over ?? 25, wp = new Vector3()
  return {
    group: g, labels: [], anchors, frameScale: u.uPixelRatio,
    update(t, cam) {
      u.uTime.value = t
      if (cam) {
        g.getWorldPosition(wp)
        const h = cam.y - (wp.y - below)
        // only from round about the station (the Europe station's camera stands high above, 180 units off)
        const near = Math.hypot(cam.x - wp.x, cam.z - wp.z) < 260 && cam.y < wp.y + 260
        // and with `step`, only while that grain step is on (25 Oct: slide 13's flight up from the inventions,
        // which stand by the cavern, rose through the map's surface and the map flashed on for half a second)
        const on = !o.step || (state.get(o.step) ?? 0) > 0
        u.uShow.value = near && on ? Math.min(1, Math.max(0, h / over)) : 0
      }
    },
  }
}

const WORD_VERT = /* glsl */ `
attribute vec3 aT, aDir;
attribute float aSeed, aLag;
uniform float uT0, uGather, uSize, uAlpha, uBurstY;
uniform vec3 uColor, uHot;
${PLACE}
void main() {
  float e = uTime - uT0;
  if (e < 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 0.0; return; }
  // out like debris (fast, slowing), then home into its letter
  vec3 burst = vec3(0.0, uBurstY, 0.0) + aDir * (1.0 - exp(-e * 2.6)) * (3.0 + 5.0 * aSeed);
  float k = clamp((e - 0.25 - aLag) / uGather, 0.0, 1.0); k = k * k * (3.0 - 2.0 * k);
  vec3 p = mix(burst, aT, k);
  float hot = exp(-e * 1.6) * (1.0 - k);
  vec3 col = mix(uColor, uHot, hot);
  float a = uAlpha * (0.55 + 0.45 * k) * (0.85 + 0.15 * sin(uTime * 1.3 + aSeed * 30.0));
  place(p, uSize * (1.0 + 1.2 * hot), a, col, aSeed);
}`

function buildWord(o, ctx) {
  const g = new Group()
  const inner = new Group(); g.add(inner)
  const mat = material(WORD_VERT, {
    uT0: { value: 1e9 }, uBurstY: { value: o.burstY ?? 0 }, uGather: { value: o.gather ?? 2.2 }, uSize: { value: o.size ?? 1.6 }, uAlpha: { value: o.alpha ?? 0.9 },
    uColor: { value: new Color(...rgb(o.color || '#eef1ff')) }, uHot: { value: new Color(...rgb(o.hot || '#ffe9c4')) },
  })
  const u = mat.uniforms
  let now = 0
  const make = () => {
    const W = 2400, H = 520, cv = document.createElement('canvas'); cv.width = W; cv.height = H
    const x = cv.getContext('2d')
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = o.font || '500 230px "Space Grotesk"'
    x.fillText(o.text || 'Ačiū', W / 2, H / 2)
    const px = x.getImageData(0, 0, W, H).data, on = []
    for (let yy = 0; yy < H; yy += 2) for (let xx = 0; xx < W; xx += 2) if (px[(yy * W + xx) * 4 + 3] > 120) on.push(xx, yy)
    if (!on.length) return
    const Hh = o.height ?? 6, k = Hh / 230, N = Math.min(Math.round((o.grains ?? 26000) * Math.min(1, (ctx.budget || 300000) / 300000) ** 0.5), on.length / 2)
    const T = new Float32Array(N * 3), Dd = new Float32Array(N * 3), seed = new Float32Array(N), lag = new Float32Array(N)
    for (let i = 0; i < N; i++) {
      const j = Math.floor(Math.random() * (on.length / 2))
      const tx = (on[j * 2] - W / 2) * k + (Math.random() - 0.5) * k * 2, ty = (H / 2 - on[j * 2 + 1]) * k + (Math.random() - 0.5) * k * 2
      T.set([tx, ty, (Math.random() - 0.5) * 0.15], i * 3)
      let dx = gauss(), dy = gauss(), dz = gauss(); const m = Math.hypot(dx, dy, dz) || 1
      Dd.set([dx / m, dy / m, dz / m], i * 3)
      seed[i] = Math.random(); lag[i] = 0.6 * Math.min(1, Math.hypot(tx, ty) / (Hh * 3))   // the middle first
    }
    const geo = new BufferGeometry()
    geo.setAttribute('position', new BufferAttribute(new Float32Array(N * 3), 3))
    geo.setAttribute('aT', new BufferAttribute(T, 3)); geo.setAttribute('aDir', new BufferAttribute(Dd, 3))
    geo.setAttribute('aSeed', new BufferAttribute(seed, 1)); geo.setAttribute('aLag', new BufferAttribute(lag, 1))
    const pts = new Points(geo, mat); pts.frustumCulled = false
    inner.add(pts)
  }
  ;(document.fonts?.load?.(o.font || '500 230px "Space Grotesk"', o.text) || Promise.resolve()).then(make, make)
  const offs = [
    bus.on('cross', (e) => { if (e.name === o.from) u.uT0.value = e.at ?? now }),
    bus.listen(o.from, (k) => { if (!k) u.uT0.value = 1e9 }),
    bus.on('stop', (e) => { if (e.name === o.from) u.uT0.value = 1e9 }),
  ]
  const wp = new Vector3()
  return {
    group: g, labels: [], frameScale: u.uPixelRatio,
    // the gathering runs on its own clock: the shots and plates wait for it
    api: { busy: () => u.uT0.value < 1e8 && now - u.uT0.value < (o.gather ?? 2.2) + 1.2 },
    update(t, cam) {
      now = t; u.uTime.value = t
      // stand up and face the camera (turned about the vertical only, so the word stays level)
      if (cam) { g.getWorldPosition(wp); inner.rotation.set(0, Math.atan2(cam.x - wp.x, cam.z - wp.z), 0) }
    },
    dispose() { for (const f of offs) f() },
  }
}

export function installAccel(registerBuilder) {
  registerBuilder('accel', buildAccel, { fields: ['pos'] })
  registerBuilder('word', buildWord, { fields: ['pos', 'name', 'text', 'from'] })
}
