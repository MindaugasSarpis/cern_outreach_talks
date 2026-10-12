// The shape of the space of data (setup/dataspace.js draws it): the knots, the filaments
// between them and the feeders into the piles, each filament as four Bézier points, in
// the object's own frame. Pure and seeded, with no three.js, so the same object weaves
// the same web on every machine, and setup/dataspace.check.mjs can weave it in Node and
// hold it against the deck's camera poses.

// a few vectors as plain arrays: the web is woven once, on the CPU
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
export const len = (a) => Math.hypot(a[0], a[1], a[2])
export const scale = (a, k) => [a[0] * k, a[1] * k, a[2] * k]
export const norm = (a) => scale(a, 1 / (len(a) || 1))
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
export const dist = (a, b) => len(sub(a, b))
export function segDist(p, a, b) {
  const ab = sub(b, a), ap = sub(p, a), l2 = dot(ab, ab)
  const u = l2 > 0 ? Math.min(1, Math.max(0, dot(ap, ab) / l2)) : 0
  return len(sub(ap, scale(ab, u)))
}
// a cubic Bézier through four points, and its direction
export function bez(P, s) {
  const r = 1 - s, a = r * r * r, b = 3 * r * r * s, c = 3 * r * s * s, d = s * s * s
  return [0, 1, 2].map((i) => a * P[0][i] + b * P[1][i] + c * P[2][i] + d * P[3][i])
}
export function tangent(P, s) {
  const r = 1 - s, a = -3 * r * r, b = 3 * r * r - 6 * r * s, c = 6 * r * s - 3 * s * s, d = 3 * s * s
  return norm([0, 1, 2].map((i) => a * P[0][i] + b * P[1][i] + c * P[2][i] + d * P[3][i]))
}

// where p falls in the frame of a camera at `eye` looking at `look` (the engine's 50°
// and 16:9): x and y from -1 to 1 across it, and its depth
const TAN = Math.tan(25 * Math.PI / 180)
export function frame(eye, look) {
  const fw = norm(sub(look, eye)), rt = norm(cross(fw, [0, 1, 0])), up = cross(rt, fw)
  return (p) => { const e = sub(p, eye), z = dot(e, fw); return [dot(e, rt) / z / (TAN * 16 / 9), dot(e, up) / z / TAN, z] }
}

// how far p stands outside the given capsules (negative: inside one)
const room = (p, list) => list.reduce((m, c) => Math.min(m, segDist(p, c.a, c.b) - c.r), Infinity)
const caps = (list) => (list || []).map((c) => ({ a: c.slice(0, 3), b: c.slice(3, 6), r: c[6] }))

export function weave(o, rnd) {
  const C = o.centre || [0, 6, -10], E = o.extent || [200, 100, 200]
  const piles = o.piles || []
  const clear = caps(o.clear), hold = caps(o.hold)
  const free = (p, m) => room(p, clear) > m && room(p, hold) > m

  // knots: spread through the box, further apart the further out (a near knot shows
  // its parallax, a far one only fills the sky), the near shells a little favoured
  const want = o.knots ?? 90, knots = []
  for (let tries = 0; knots.length < want && tries < want * 80; tries++) {
    const z = 2 * rnd() - 1, ph = 2 * Math.PI * rnd(), q = Math.sqrt(1 - z * z), rr = 0.08 + 0.92 * Math.pow(rnd(), 0.7)
    const p = [C[0] + E[0] * rr * q * Math.cos(ph), C[1] + E[1] * rr * z, C[2] + E[2] * rr * q * Math.sin(ph)]
    if (!free(p, 8)) continue
    const far = dist(p, C)
    if (knots.some((k) => dist(k.p, p) < 14 + 0.2 * Math.max(far, k.far))) continue
    knots.push({ p, far, deg: 0, dirs: [] })
  }

  // a gentle bow: the middle points pushed sideways, a little, the same way or not quite
  const side = (u) => { const r = [rnd() - 0.5, rnd() - 0.5, rnd() - 0.5]; return norm(sub(r, scale(u, dot(r, u)))) }
  const bowed = (a, b, k = 0.12) => {
    const ch = sub(b, a), L = len(ch), u = norm(ch)
    const s1 = scale(side(u), L * k * (0.4 + 0.6 * rnd())), s2 = scale(side(u), L * k * 0.5 * rnd())
    const m1 = add(a, add(scale(ch, 1 / 3), s1)), m2 = add(a, add(scale(ch, 2 / 3), add(scale(s1, 0.7), s2)))
    return [a, m1, m2, b]
  }

  // filaments: the shortest links first, each knot taking at most four, never two
  // leaving a knot side by side, and none through the clear or held space: a web
  // with open cells rather than a tangle
  const cand = []
  knots.forEach((k, i) => {
    const near = knots.map((m, j) => [dist(k.p, m.p), j]).filter(([, j]) => j !== i).sort((x, y) => x[0] - y[0]).slice(0, 5)
    for (const [d, j] of near) cand.push([d, Math.min(i, j), Math.max(i, j)])
  })
  cand.sort((x, y) => x[0] - y[0])
  const seen = new Set(), fils = []
  const spread = (k, u) => k.dirs.every((v) => dot(v, u) < 0.85)   // ~32° apart at least
  for (const [d, i, j] of cand) {
    const key = i * 4096 + j
    if (seen.has(key)) continue
    seen.add(key)
    const A = knots[i], B = knots[j]
    if (A.deg >= 4 || B.deg >= 4 || d > 34 + 0.42 * (A.far + B.far) / 2) continue
    const u = norm(sub(B.p, A.p))
    if (!spread(A, u) || !spread(B, scale(u, -1))) continue
    const P = bowed(A.p, B.p)
    let ok = true
    for (let s = 1; s < 16 && ok; s++) ok = free(bez(P, s / 16), 3)
    if (!ok) continue
    A.deg++; B.deg++; A.dirs.push(u); B.dirs.push(scale(u, -1))
    // each runs toward the store: its far end first, so its light and most of its packets go inward
    fils.push({ P: dist(P[0], C) < dist(P[3], C) ? [P[3], P[2], P[1], P[0]] : P, L: d, group: -1 })
  }

  // feeders: `lines` threads into a pile, branching off the web (from a knot, or from the
  // middle of a filament) beside the pile and a little behind it as its slide sees it
  // (from behind, they run into it rather than across it), level with it (from above a
  // thread hangs a pile like a pendulum, from below holds it up like a string), fanned
  // apart. Each leaves the web with a slight bow and comes in along the line to the
  // pile's middle, and ends short of the pile, where its light has faded out: the data
  // drawn into the store, not a wire it hangs from.
  const feeds = []
  const roots = [...knots.filter((k) => k.deg > 0).map((k) => ({ p: k.p, k })), ...fils.flatMap((f) => [0.2, 0.35, 0.5, 0.65, 0.8].map((s) => ({ p: bez(f.P, s) })))]
  piles.forEach((pile, g) => {
    const lines = pile.lines ?? 0
    if (!lines || !pile.view) return
    const at = pile.at, r = pile.r ?? 1, v = norm(sub(at, pile.view))
    const opts = roots.map((x) => {
      const d = sub(x.p, at), l = len(d)
      return { ...x, l, u: scale(d, 1 / l), c: dot(d, v) / l }
    }).filter((x) => x.c > -0.1 && x.c < 0.8 && Math.abs(x.u[1]) < 0.5).sort((x, y) => x.l - y.l)
    const chosen = []
    for (const x of opts) {
      if (chosen.length >= lines) break
      if (chosen.some((y) => dot(y.u, x.u) > 0.8)) continue
      const end = add(at, scale(x.u, r * (1.5 + 0.3 * rnd()))), L = dist(x.p, end)
      const P = [x.p, add(x.p, add(scale(sub(end, x.p), 1 / 3), scale(side(x.u), L * 0.08 * (0.5 + 0.5 * rnd())))),
        add(end, scale(x.u, L * 0.3)), end]
      // A feeder is there only on its pile's slide (it comes after the flight in, and is gone
      // a moment into the flight out), so it keeps clear of that slide's camera alone (never
      // much nearer it than the pile, where its grains would swell into streaks) and
      // of the piles standing there (the lineup's earlier ones): never through one, nor
      // across or behind its edge as that camera sees it; nor behind the slide's number
      // and caption, in the bottom-left of the frame
      const seen = frame(pile.view, pile.look || at), near = Math.min(20, 0.75 * dist(at, pile.view))
      let ok = true
      for (let s = 1; s <= 24 && ok; s++) {
        const p = bez(P, s / 24), e = sub(p, pile.view), d = len(e), [x, y, z] = seen(p)
        ok = d > near && !(z > 0 && x < 0.15 && y < 0.25) && piles.every((q) => {
          if (q.ball >= pile.ball) return true
          const f = sub(q.at, pile.view), dq = len(f), rq = q.r ?? 1
          return dist(p, q.at) > rq + 3 && Math.acos(Math.min(1, dot(e, f) / (d * dq))) > 1.4 * Math.asin(Math.min(1, rq / dq)) + 0.02
        })
      }
      if (!ok) continue
      chosen.push(x); if (x.k) x.k.deg++
      feeds.push({ P, L, group: g, color: pile.color, r })
    }
  })
  return { knots: knots.filter((k) => k.deg > 0), fils, feeds, C }
}
