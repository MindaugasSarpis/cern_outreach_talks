// The motion of the „Ačiū“ ring: each portrait is one body and the ring is its
// track, the way a bunch of protons keeps to the LHC's. The bodies run round
// an ellipse, each at a speed of its own that changes now and then (so the
// quick ones catch up), held to it by a soft spring and wandering a little on a
// slow random force. They meet as discs: an elastic bump with friction, so a
// glancing hit sets a face turning and a soft torque rights it again; the
// spring is soft enough that a bump can send one inside the other and past it.
// Before they touch, they push each other away, the way charges do, more the
// closer they come: so the ring keeps its spacing instead of bunching up
// behind its slowest, and a body coming up on another nudges it on ahead.
// Now and then one of them sprints for a moment: it runs into the next, which
// is shoved on into the one after, and the ring settles again.
// They keep out of the box the title stands in and inside the frame.
//
// All of that happens where it is seen: in the picture plane through `title`,
// as the camera sees it from `view` units away. A body nearer the camera is
// drawn larger and further out from the middle; worked out in the scene's own
// plane, two faces at different depths could touch there and still overlap on
// the screen. The builder gets back where each body stands in 3D (x, y, z), so
// that it lands on its spot in the picture, and a (its turn about the view
// axis). Without `view` the picture plane is the scene's.
//
// Fixed steps from the moment the ring is reset, on the engine clock, with a
// seeded random: the same time gives the same picture, so a recording or a
// still comes out the same every run. No three.js here.
//
//   const ring = makeRing(homes, { speed, spread, radius, view, title, keepOut, frame, seed, … })
//   ring.reset(t)                  at the homes, at rest; the drive and the wander ramp in
//   ring.advance(t, onHit)         steps up to t; onHit({ t, x, y, z, nx, ny, tx, ty, v }) as two meet

const H = 1 / 120   // the step, s

export function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const ease = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * x * (x * (x * 6 - 15) + 10) }

export function makeRing(homes, o = {}) {
  const n = homes.length
  const D = o.view ?? Infinity                    // the camera's distance to the picture plane
  const grow = (z) => (D === Infinity ? 1 : D / Math.max(D - z, 1))   // how much larger depth z is drawn
  const tc = o.title ?? [homes.reduce((s, p) => s + p[0], 0) / n, homes.reduce((s, p) => s + p[1], 0) / n]
  // the homes as the camera sees them
  const seen = homes.map((p) => { const s = grow(p[2] || 0); return [tc[0] + (p[0] - tc[0]) * s, tc[1] + (p[1] - tc[1]) * s] })
  const xs = seen.map((p) => p[0]), ys = seen.map((p) => p[1])
  const cx = o.center?.[0] ?? (Math.min(...xs) + Math.max(...xs)) / 2
  const cy = o.center?.[1] ?? (Math.min(...ys) + Math.max(...ys)) / 2
  const rx = o.rx ?? (Math.max(...xs) - Math.min(...xs)) / 2
  const ry = o.ry ?? (Math.max(...ys) - Math.min(...ys)) / 2
  const R = o.radius ?? 1.5                       // a disc's radius as it is seen, at depth 0
  const speed = (o.speed ?? 0.7) * (o.dir ?? -1)  // along the ring, units/s; -1 runs clockwise on screen
  const spread = o.spread ?? 0.35                 // each body's own speed, ± this fraction, drawn again every 5–11 s
  const kr = o.spring ?? 0.4, cr = o.damp ?? 0.5  // the pull back to the ring and its damping, across it
  const kd = o.drive ?? 0.5                       // how fast a body returns to its own speed, 1/s
  const wander = o.wander ?? 0.12, tau = 2.5      // the slow random force: size, and how long it lasts
  const kz = 0.6, cz = 0.5, wz = o.depth ?? 0.18  // in and out of the picture
  const e = o.bounce ?? 0.9, mu = o.friction ?? 0.5
  const q = o.charge ?? 1.5, reach = o.reach ?? 8 // the push at a distance: q (1/d² − 1/reach²), none beyond reach
  const dashEvery = o.dashEvery ?? 30, dashFor = o.dashFor ?? 1.2, dashBy = o.dashBy ?? 1.5   // a sprint: how often (s, each), how long, how much faster
  const ka = 1.2, ca = 0.9, amax = 0.35           // the torque that rights a face; the most it turns
  const hitMin = o.hitMin ?? 0.06                 // the slowest bump that counts as a hit
  const box = o.keepOut ?? [4.8, 2.2]             // the title's half width and height, around tc (`title`, else the homes' middle)
  const frame = o.frame ?? [rx * 1.2 + R, ry * 1.2 + R]   // where the discs' edges stop, half width and height around tc

  // x, y: where a body is seen (the picture plane); px, py, pz: where it stands
  const x = new Float64Array(n), y = new Float64Array(n), z = new Float64Array(n)
  const px = new Float64Array(n), py = new Float64Array(n), pz = new Float64Array(n), rad = new Float64Array(n)
  const vx = new Float64Array(n), vy = new Float64Array(n), vz = new Float64Array(n)
  const a = new Float64Array(n), w = new Float64Array(n)
  const fx = new Float64Array(n), fy = new Float64Array(n), fz = new Float64Array(n)
  const pref = new Float64Array(n), goal = new Float64Array(n), next = new Float64Array(n), z0 = new Float64Array(n)
  const dashAt = new Float64Array(n)
  const touching = new Uint8Array(n * n)
  let rnd = mulberry32(o.seed ?? 7), t0 = 0, steps = 0
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rnd(); return (s - 2) / 0.577 }
  const unproject = (sx, sy, sz) => { const s = grow(sz); return [tc[0] + (sx - tc[0]) / s, tc[1] + (sy - tc[1]) / s] }
  const place = () => {
    for (let i = 0; i < n; i++) { const [ux, uy] = unproject(x[i], y[i], z[i]); px[i] = ux; py[i] = uy; pz[i] = z[i] }
  }

  function reset(t) {
    rnd = mulberry32(o.seed ?? 7)
    for (let i = 0; i < n; i++) {
      x[i] = seen[i][0]; y[i] = seen[i][1]; z[i] = z0[i] = homes[i][2] || 0; rad[i] = R * grow(z[i])
      vx[i] = vy[i] = vz[i] = a[i] = w[i] = fx[i] = fy[i] = fz[i] = 0
      pref[i] = goal[i] = speed * (1 + spread * (2 * rnd() - 1))
      next[i] = t + 5 + 6 * rnd()
      dashAt[i] = dashEvery > 0 ? t + 3 + dashEvery * rnd() : Infinity
    }
    touching.fill(0)
    t0 = t; steps = 0
    place()
  }

  function step(simT, onHit) {
    const ramp = ease((simT - t0 - 0.8) / 2.5)   // still while they gather, then away
    const decay = Math.exp(-H / tau), kick = Math.sqrt(1 - decay * decay)
    for (let i = 0; i < n; i++) {
      // a new speed of its own now and then, eased into over a couple of seconds
      if (simT >= next[i]) { goal[i] = speed * (1 + spread * (2 * rnd() - 1)); next[i] = simT + 5 + 6 * rnd() }
      if (simT >= dashAt[i] + dashFor) dashAt[i] = simT + dashEvery * (0.5 + rnd())
      const dash = simT >= dashAt[i] ? speed * dashBy : 0
      pref[i] += (goal[i] + dash - pref[i]) * H / (dash ? 0.25 : 2)
      // the wander: a force that changes slowly (an Ornstein–Uhlenbeck walk)
      fx[i] = fx[i] * decay + wander * kick * gauss()
      fy[i] = fy[i] * decay + wander * kick * gauss()
      fz[i] = fz[i] * decay + wz * kick * gauss()
      const ex = (x[i] - cx) / rx, ey = (y[i] - cy) / ry
      const rho = Math.hypot(ex, ey) || 1e-6
      const ct = ex / rho, st = ey / rho
      // across the ring: from the centre through the body; along it: the tangent
      let nx = rx * ct, ny = ry * st; const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl
      let tx = -rx * st, ty = ry * ct; const tl = Math.hypot(tx, ty); tx /= tl; ty /= tl
      const off = (rho - 1) * nl                 // how far off the ring, in units
      const vn = vx[i] * nx + vy[i] * ny, vt = vx[i] * tx + vy[i] * ty
      const fn = -kr * off - cr * vn
      const ft = kd * (pref[i] * ramp - vt)
      vx[i] += (fn * nx + ft * tx + fx[i] * ramp) * H
      vy[i] += (fn * ny + ft * ty + fy[i] * ramp) * H
      vz[i] += (-kz * (z[i] - z0[i]) - cz * vz[i] + fz[i] * ramp) * H
      w[i] += (-ka * a[i] - ca * w[i]) * H
    }
    // the push at a distance
    if (q > 0) for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      const dx = x[j] - x[i], dy = y[j] - y[i], d2 = dx * dx + dy * dy
      if (d2 >= reach * reach) continue
      const d = Math.sqrt(d2) || 1e-6, f = q * (1 / Math.max(d2, R * R) - 1 / (reach * reach)) * H / d
      vx[i] -= dx * f; vy[i] -= dy * f; vx[j] += dx * f; vy[j] += dy * f
    }
    for (let i = 0; i < n; i++) {
      x[i] += vx[i] * H; y[i] += vy[i] * H; z[i] += vz[i] * H
      a[i] = Math.max(-amax, Math.min(amax, a[i] + w[i] * H))
      rad[i] = R * grow(z[i])
    }
    // the bumps: discs as they are seen, equal masses
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let dx = x[j] - x[i], dy = y[j] - y[i]
      const d2 = dx * dx + dy * dy, touch = rad[i] + rad[j]
      if (d2 >= touch * touch) { touching[i * n + j] = 0; continue }
      const d = Math.sqrt(d2) || 1e-6; dx /= d; dy /= d
      const tx = -dy, ty = dx
      // push apart what overlaps, a share per step, so a contact is soft
      const over = (touch - d) * 0.25
      x[i] -= dx * over; y[i] -= dy * over; x[j] += dx * over; y[j] += dy * over
      const rvn = (vx[j] - vx[i]) * dx + (vy[j] - vy[i]) * dy
      if (rvn >= 0) continue
      const J = -(1 + e) * rvn / 2
      // friction at the rims: the slip of the two edges, spin included. For a disc
      // I = m r²/2, so r²/I is 2 whatever its size, and a unit of Jt changes the slip by 6
      const slip = (vx[j] - vx[i]) * tx + (vy[j] - vy[i]) * ty - rad[i] * w[i] - rad[j] * w[j]
      const Jt = Math.max(-mu * J, Math.min(mu * J, -slip / 6))
      vx[i] -= J * dx + Jt * tx; vy[i] -= J * dy + Jt * ty
      vx[j] += J * dx + Jt * tx; vy[j] += J * dy + Jt * ty
      w[i] -= 2 * Jt / rad[i]; w[j] -= 2 * Jt / rad[j]
      const first = !touching[i * n + j]; touching[i * n + j] = 1
      if (first && -rvn > hitMin && onHit) {
        const cz = (z[i] + z[j]) / 2, [hx, hy] = unproject(x[i] + dx * rad[i], y[i] + dy * rad[i], cz)
        onHit({ t: simT, x: hx, y: hy, z: cz, nx: dx, ny: dy, tx, ty, v: -rvn })
      }
    }
    for (let i = 0; i < n; i++) {
      const r = rad[i]
      // the title's box: a rounded rectangle the discs stay a radius away from
      const ux = x[i] - tc[0], uy = y[i] - tc[1]
      const qx = Math.abs(ux) - box[0], qy = Math.abs(uy) - box[1]
      const out = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0)
      if (out < r) {
        let gx, gy
        if (qx > 0 || qy > 0) { gx = Math.max(qx, 0) * Math.sign(ux); gy = Math.max(qy, 0) * Math.sign(uy) } else if (qx > qy) { gx = Math.sign(ux); gy = 0 } else { gx = 0; gy = Math.sign(uy) }
        const gl = Math.hypot(gx, gy) || 1; gx /= gl; gy /= gl
        x[i] += gx * (r - out); y[i] += gy * (r - out)
        const vin = vx[i] * gx + vy[i] * gy
        if (vin < 0) { vx[i] -= 1.5 * vin * gx; vy[i] -= 1.5 * vin * gy }
      }
      // the frame: a disc that reaches an edge comes back off it
      const lx = frame[0] - r, ly = frame[1] - r, fx0 = x[i] - tc[0], fy0 = y[i] - tc[1]
      if (fx0 > lx) { x[i] = tc[0] + lx; if (vx[i] > 0) vx[i] *= -0.5 }
      if (fx0 < -lx) { x[i] = tc[0] - lx; if (vx[i] < 0) vx[i] *= -0.5 }
      if (fy0 > ly) { y[i] = tc[1] + ly; if (vy[i] > 0) vy[i] *= -0.5 }
      if (fy0 < -ly) { y[i] = tc[1] - ly; if (vy[i] < 0) vy[i] *= -0.5 }
    }
  }

  function advance(t, onHit) {
    // the engine holds a frame to 1/12 s, so this catches up ten steps at most;
    // a longer gap (a hidden tab) skips ahead rather than racing
    if (t - (t0 + steps * H) > 1) steps = Math.floor((t - 1 - t0) / H)
    let moved = false
    while (t0 + (steps + 1) * H <= t) { step(t0 + steps * H, onHit); steps++; moved = true }
    if (moved) place()
  }

  reset(0)
  return { n, x: px, y: py, z: pz, a, seen: { x, y, r: rad }, reset, advance, get t() { return t0 + steps * H }, ring: { cx, cy, rx, ry } }
}
