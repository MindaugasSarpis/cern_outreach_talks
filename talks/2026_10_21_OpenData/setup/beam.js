// The beam of the „Ačiū“ ring: a fine line of gold grains (the open data's colour)
// running round the track the faces run on, as the LHC's beam runs round through its
// bunches: a bright core, a thin halo about it, and bunches in it that show it running.
//
// The line is the faces' own track: the ring's ellipse, drawn out or in the way they
// have drifted, so that it runs through every face. Each grain has a place in the beam
// that runs round at the beam's speed, and the faces bend that place out of their way
// the way a disc bends the streamlines of an ideal fluid flowing past it: the line
// parts round a face, hugs it a little way out from its rim and closes behind it, and
// a face lying off the line sends it round the nearer side. (The Joukowski map: a
// streamline at height h in the open flow lies at z, outside the circle of radius a,
// where z + a²/z = the open position.) The grains themselves have weight: each is held
// to its place by a damped spring, so where the place turns quickly round a face it
// swings wide and overshoots, and the line ripples there before it lies straight
// again. Where faces crowd the line squeezes between them and runs brighter. Where two
// bump, the grains near the contact are thrown out and the spring brings them back.
// It is injected rather than switched on: a head runs round the ring once and lays it.
//
// All of it in the picture plane, with the ring's bodies as they are seen (ring.seen),
// stepping with the ring (its onStep): the same time gives the same picture. No
// three.js here.
//
//   const beam = makeBeam(ring, { grains, speed, width, spread, halo, bunches, inject, lap, seed, … })
//   beam.reset(t)                 every grain in its place, at rest in the beam; unseen until the injection reaches it
//   beam.step(t, h)               one step, after the ring's
//   beam.kick(hit)                a bump (the ring's onHit): throws out the grains near it
//   beam.write(pos, glow, t)      where each grain stands (3 floats) and how bright (1 float)

import { mulberry32 } from './ring.js'

const TAU = Math.PI * 2
const smooth = (a, b, x) => { x = Math.min(1, Math.max(0, (x - a) / (b - a))); return x * x * (3 - 2 * x) }

export function makeBeam(ring, o = {}) {
  const n = Math.max(1, Math.round(o.grains ?? 4000))
  const { cx, cy, rx, ry } = ring.ring
  const F = ring.seen                              // the faces as they are seen: x, y, r, vx, vy
  const m = F.x.length
  const v0 = (o.speed ?? 1.6) * (o.dir ?? -1)      // along the ring, units/s; -1 runs clockwise on screen, with the faces
  const width = o.width ?? 0.06                    // the core's spread, across the line
  const spread = o.spread ?? 0.3, core = o.core ?? 0.85   // the halo's spread, and the share of the grains in the core
  const halo = o.halo ?? 1.3                       // the line parts round a face this many of its radii out
  const rim = o.rim ?? 1.15                        // and no grain comes nearer its middle than this many
  const w0 = o.spring ?? 4, zeta = o.damp ?? 0.45  // a grain's hold on its place: 1/s, and its damping (of critical)
  const bunches = o.bunches ?? 40, bunched = o.bunched ?? 0.3   // the beam's bunches round the ring, and the share of grains in them
  const inject = o.inject ?? 3.4, lap = o.lap ?? 3.2   // the injection: when its head sets out after reset (the camera has landed), and its lap, s
  const T = ring.title, pad = 0.4                  // the title's box, kept clear

  // the ellipse's length by its angle, and back, so the grains run evenly along it
  const K = 2048, arc = new Float64Array(K + 1), ang = new Float64Array(K + 1)
  for (let k = 1; k <= K; k++) {
    const a = (k - 0.5) / K * TAU
    arc[k] = arc[k - 1] + Math.hypot(rx * Math.sin(a), ry * Math.cos(a)) * TAU / K
  }
  const L = arc[K]
  for (let k = 0, j = 0; k <= K; k++) {
    const s = k / K * L
    while (j < K - 1 && arc[j + 1] < s) j++
    ang[k] = (j + Math.min(1, (s - arc[j]) / (arc[j + 1] - arc[j]))) / K * TAU
  }
  const angleAt = (s) => { const f = (((s / L) % 1 + 1) % 1) * K, k = Math.min(K - 1, Math.floor(f)); return ang[k] + (ang[k + 1] - ang[k]) * (f - k) }
  const arcAt = (th) => { const f = (((th / TAU) % 1 + 1) % 1) * K, k = Math.min(K - 1, Math.floor(f)); return arc[k] + (arc[k + 1] - arc[k]) * (f - k) }

  const s0 = new Float64Array(n), lane = new Float32Array(n), z = new Float32Array(n)
  const x = new Float64Array(n), y = new Float64Array(n), vx = new Float64Array(n), vy = new Float64Array(n)
  const qx = new Float64Array(n), qy = new Float64Array(n), bend = new Float32Array(n)
  const born = new Float64Array(n), stir = new Float32Array(n)
  const fs = new Float64Array(m), foff = new Float64Array(m), fw = new Float64Array(m)   // each face along the line (arc length), off the ellipse, off the line
  const KL = 512, line = new Float64Array(KL + 1)  // the line's offset from the ellipse, by arc length
  const follow = o.follow ?? 1                     // how far the line follows the faces' drift off the ellipse
  const reach = o.reach ?? 1.4                     // over how much of the ring a face draws the line (a Gaussian's σ)
  let rnd = mulberry32(o.seed ?? 11), t0 = 0, sIn = 0, acc = 0
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 0.577 }
  const wrap = (d) => (d > L / 2 ? d - L : d < -L / 2 ? d + L : d)

  // where each face stands by the line: the foot of it on the ellipse (a few Newton steps
  // from its angle) and how far out along the normal it stands. The line is the ellipse
  // drawn out to the faces: at each place, the faces' offsets averaged with weights
  // that fall off along the ring, so it runs through a face on its own and between
  // two side by side, and changes smoothly from one face's offset to the next
  function faces() {
    const e2 = rx * rx - ry * ry
    for (let j = 0; j < m; j++) {
      const fx = F.x[j] - cx, fy = F.y[j] - cy
      let th = Math.atan2(fy / ry, fx / rx)
      for (let k = 0; k < 4; k++) {
        const c = Math.cos(th), s = Math.sin(th)
        th -= (-fx * rx * s + fy * ry * c + e2 * s * c) / (-fx * rx * c - fy * ry * s + e2 * (c * c - s * s))
      }
      const c = Math.cos(th), s = Math.sin(th), tl = Math.hypot(rx * s, ry * c)
      fs[j] = arcAt(th); foff[j] = ((fx - rx * c) * ry * c + (fy - ry * s) * rx * s) / tl
    }
    for (let k = 0; k <= KL; k++) {
      let num = 0, den = 0, near = Infinity, nearOff = 0
      for (let j = 0; j < m; j++) {
        const d = wrap(k / KL * L - fs[j]), g = Math.exp(-d * d / (2 * reach * reach))
        num += g * foff[j]; den += g
        if (Math.abs(d) < near) { near = Math.abs(d); nearOff = foff[j] }
      }
      line[k] = (den > 1e-12 ? num / den : nearOff) * follow
    }
    for (let j = 0; j < m; j++) fw[j] = foff[j] - lineAt(fs[j])
  }
  const lineAt = (s) => { const f = (((s / L) % 1 + 1) % 1) * KL, k = Math.min(KL - 1, Math.floor(f)); return line[k] + (line[k + 1] - line[k]) * (f - k) }

  // a grain's place at time t. In the line's own terms (u along it from a face, w across
  // it) a grain runs straight, at its lane; the face bends that, and the bent (u, w) is
  // laid back on the curved line. Where two faces are near, each one's bend counts the
  // more the nearer it is (by the sixth power): next to one face that face's alone,
  // between two close together the line goes round both, where adding their bends would
  // throw it past them
  function place(i, t) {
    const sg = ((s0[i] + v0 * (t - t0)) % L + L) % L
    let du = 0, dw = 0, wsum = 0
    for (let j = 0; j < m; j++) {
      const a = F.r[j] * halo
      const u = wrap(sg - fs[j])
      if (u > 4 * a || u < -4 * a) continue
      const w = lane[i] - fw[j], r2 = u * u + w * w
      if (r2 > 16 * a * a) continue
      // z = W/2 ± √(W²/4 − a²): the root outside the circle. On the line through the
      // face's middle both roots lie on the circle, and the grain's lane picks the side
      const ar = (u * u - w * w) / 4 - a * a, ai = u * w / 2, am = Math.sqrt(ar * ar + ai * ai)
      let sr = Math.sqrt(Math.max(0, (am + ar) / 2)), si = Math.sqrt(Math.max(0, (am - ar) / 2)) * (ai < 0 ? -1 : 1)
      const out = u * sr + w * si                // > 0: W/2 + S is the outside root
      if (Math.abs(out) < 1e-9 * a * a ? (w / 2 + si) * (w || lane[i] || 1) < 0 : out < 0) { sr = -sr; si = -si }
      const fade = (1 - smooth(2.5 * a, 4 * a, Math.sqrt(r2))) / (r2 * r2 * r2 + 1e-9)
      du += (sr - u / 2) * fade; dw += (si - w / 2) * fade; wsum += 1 / (r2 * r2 * r2 + 1e-9)
    }
    if (wsum > 0) { du /= wsum; dw /= wsum }
    const th = angleAt(sg + du), c = Math.cos(th), s = Math.sin(th)
    const tl = Math.sqrt(rx * rx * s * s + ry * ry * c * c), off = lineAt(sg + du) + lane[i] + dw
    qx[i] = cx + rx * c + ry * c / tl * off; qy[i] = cy + ry * s + rx * s / tl * off
    bend[i] = Math.sqrt(du * du + dw * dw)
  }

  function reset(t) {
    rnd = mulberry32(o.seed ?? 11)
    t0 = t; acc = 0
    sIn = arcAt(o.from ?? 0)
    faces()
    for (let i = 0; i < n; i++) {
      // most of them in bunches, the rest spread evenly between: the bunches show the
      // beam running, where an even line would look still
      s0[i] = rnd() < bunched ? (Math.floor(rnd() * bunches) + 0.5) / bunches * L + gauss() * 0.3 : (i + rnd()) / n * L
      lane[i] = gauss() * (rnd() < core ? width : spread)
      z[i] = gauss() * width * 2
      born[i] = -1; stir[i] = 0
      place(i, t + 1 / 60); const x1 = qx[i], y1 = qy[i]
      place(i, t)
      x[i] = qx[i]; y[i] = qy[i]; vx[i] = (x1 - qx[i]) * 60; vy[i] = (y1 - qy[i]) * 60
    }
  }

  function step(t, h) {
    // half the ring's rate is plenty for grains this light
    acc += h
    if (acc < 1 / 60 - 1e-9) return
    h = acc; acc = 0
    faces()
    const head = t - t0 - inject >= 0 ? L * (t - t0 - inject) / lap : -1
    const k2 = w0 * w0, c = 2 * zeta * w0, calm = Math.exp(-h / 0.8)
    for (let i = 0; i < n; i++) {
      const ox = qx[i], oy = qy[i]
      place(i, t)
      // the injection: a grain shows once the head has come round to it
      if (born[i] < 0 && head >= 0 && head >= ((s0[i] + v0 * (t - t0) - sIn) * Math.sign(v0) % L + L) % L) born[i] = t
      // held to its place by a damped spring (semi-implicit Euler: stable at this step)
      const ux = (qx[i] - ox) / h, uy = (qy[i] - oy) / h
      vx[i] += (k2 * (qx[i] - x[i]) - c * (vx[i] - ux)) * h
      vy[i] += (k2 * (qy[i] - y[i]) - c * (vy[i] - uy)) * h
      x[i] += vx[i] * h; y[i] += vy[i] * h
      // how far it is from its place: a thrown grain glows a little until it settles
      const ex = qx[i] - x[i], ey = qy[i] - y[i]
      stir[i] = Math.max(stir[i] * calm, Math.min(1, Math.sqrt(ex * ex + ey * ey) / 0.6))
      // no grain on a face: back to its rim, with what moved it inward taken away
      for (let j = 0; j < m; j++) {
        const dx = x[i] - F.x[j], dy = y[i] - F.y[j], r = F.r[j] * rim
        const d2 = dx * dx + dy * dy
        if (d2 >= r * r) continue
        const d = Math.sqrt(d2) || 1e-6, nx = dx / d, ny = dy / d
        x[i] = F.x[j] + nx * r; y[i] = F.y[j] + ny * r
        const vin = (vx[i] - F.vx[j]) * nx + (vy[i] - F.vy[j]) * ny
        if (vin < 0) { vx[i] -= vin * nx; vy[i] -= vin * ny }
      }
      // nor in the title's box
      const bx = x[i] - T.x, by = y[i] - T.y, px = Math.abs(bx) - T.w - pad, py = Math.abs(by) - T.h - pad
      if (px < 0 && py < 0) {
        if (px > py) { x[i] = T.x + Math.sign(bx) * (T.w + pad); vx[i] = 0 } else { y[i] = T.y + Math.sign(by) * (T.h + pad); vy[i] = 0 }
      }
    }
  }

  // a bump: the grains near the contact are thrown out of it, the nearer the harder
  function kick(hit) {
    const far = 1.2 + 0.8 * Math.min(1, hit.v)
    for (let i = 0; i < n; i++) {
      const dx = x[i] - hit.sx, dy = y[i] - hit.sy, d2 = dx * dx + dy * dy
      if (d2 > far * far) continue
      const d = Math.sqrt(d2) || 1e-6, f = (1 - d / far) ** 2 * (1.5 + 3.5 * hit.v) * (0.6 + 0.8 * rnd())
      vx[i] += dx / d * f; vy[i] += dy / d * f
    }
  }

  // where a grain stands so that it is seen at (x, y) from depth z (the ring unprojects its bodies so)
  const D = ring.view
  function write(pos, glow, t) {
    for (let i = 0; i < n; i++) {
      const s = D === Infinity ? 1 : Math.max(D - z[i], 1) / D
      pos[i * 3] = T.x + (x[i] - T.x) * s; pos[i * 3 + 1] = T.y + (y[i] - T.y) * s; pos[i * 3 + 2] = z[i]
      const age = born[i] < 0 ? -1 : t - born[i]
      // the injection's head flares as it passes; a grain bent round a face, or thrown, glows a little more
      glow[i] = age < 0 ? 0 : Math.min(1, age / 0.2) * (1 + 0.9 * Math.exp(-age / 0.3) + 0.5 * Math.min(1, bend[i] / 1.5) + 1.2 * stir[i])
    }
  }

  reset(0)
  return { n, x, y, reset, step, kick, write }
}
