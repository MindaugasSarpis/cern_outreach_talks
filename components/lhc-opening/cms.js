// From a real CMS event (event-cms.json, read from CERN open data) to the paths its
// particles take, in metres in CMS's frame (z along the beam, y up, x towards the
// LHC's centre).
//
// Inside the solenoid a charged particle runs on a helix round the field (3.8 T
// along +z): a circle of radius R = pT / (0.2998 B) across the beam, and steady
// progress along it. Each track's helix is built from its own pT, η, φ and charge at
// its reference point (where it passes closest to the beam, beside its vertex), as
// the file describes it and as its checks rebuilt it (the helix meets the last hit
// within 4.5 mm, the median). From the first hit to the last it is measured; past
// the last it is the drawing's guess, in a field that weakens towards the tracker's
// ends (the helices miss by up to 11.5 cm there). The tracker ends short of the
// electromagnetic calorimeter (ρ 1.1 against 1.29 m, |z| 2.8 against 3.18 m), and a
// last hit is a median metre of path short of it (nine in ten more than half a
// metre): a track is drawn on at full strength for 0.6 m past its last hit, as
// event displays carry a track to the calorimeter, which takes the fast ones there
// (aCal in the file); past that it fades over a third of a metre, as the tracker
// lost it. So the slow ones, whose helix would curl on for metres, or never get
// there (under about 0.74 GeV: a looper), show only what was measured and a little
// more, and none is drawn past one full turn.
//
// Outside the solenoid the field turns round (in the return yoke, about 2 T the
// other way) and the helix no longer holds. A muon follows iSpy's propagated points
// from the file beyond the calorimeter; where they stop short (the endcap muon's
// end at |z| = 2.7 m), a cubic carries it on to its muon-system track, the line the
// chambers measured, which it follows; past its last measured point it runs on a
// metre, fading, out of the detector.
//
// A calorimeter hit is a cell with its front and back face (each cell points back
// at the collision): its deposit is drawn from the cell's front, along the cell, as
// long as its energy says, the way event displays draw towers.

const K = 0.2998 * 3.8;                              // m of radius per GeV of pT in 3.8 T
const LOOP = 2 * Math.PI;                           // no track is drawn past one full turn (or its last hit)
const REACH = 0.6;                                  // m of path past the last hit drawn at full strength
const FADE = 0.35;                                  // m over which it fades after that
const RUN_ON = 1.0;                                 // m a muon is drawn past where it was last seen

const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// a track's helix by turning angle a (the file's formula, h = -q)
export function helix(t) {
  const R = t.pt / K, h = -t.q, sh = Math.sinh(t.eta), sp = Math.sin(t.phi), cp = Math.cos(t.phi);
  return (a) => {
    const f = t.phi + h * a;
    return [t.x0 + R * h * (Math.sin(f) - sp), t.y0 - R * h * (Math.cos(f) - cp), t.z0 + R * a * sh];
  };
}

// a cubic from p with direction u to q with direction v (Hermite, tangents as long as the gap)
function bridge(p, u, q, v, step) {
  const L = len(sub(q, p)), n = Math.max(2, Math.ceil(L / step)), out = [];
  for (let i = 1; i <= n; i++) {
    const s = i / n, s2 = s * s, s3 = s2 * s;
    const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
    out.push([0, 1, 2].map((c) => h00 * p[c] + h10 * L * u[c] + h01 * q[c] + h11 * L * v[c]));
  }
  return out;
}

// a muon's path past the calorimeter's front: iSpy's points beyond where the helix
// stopped, then (if they end short of the muon system's track) a cubic to it and
// along it; then on a metre. seen: 1 where measured or propagated, falling off after
function muonOn(m, pts, seen, from, step) {
  const end = pts[pts.length - 1];
  let dir = unit(sub(end, pts[pts.length - 2]));
  const reach = len(sub(end, from));
  const add = (p, w = 1) => { pts.push(p); seen.push(w); };
  for (const p of m.points || []) if (len(sub(p, from)) > reach + 0.05) {
    const last = pts[pts.length - 1];
    // fill the gaps between iSpy's points (up to 40 cm apart) so the grains follow a line
    for (const q of bridge(last, dir, p, unit(sub(p, last)), step)) add(q);
    dir = unit(sub(p, last));
  }
  const sa = m.standalone;
  if (sa) {
    const p1 = sa.slice(0, 3), u1 = sa.slice(3, 6), p2 = sa.slice(6, 9), u2 = sa.slice(9, 12);
    const last = pts[pts.length - 1];
    if (len(sub(p1, from)) > len(sub(last, from)) + 0.3) {
      for (const q of bridge(last, dir, p1, u1, step)) add(q);
      for (const q of bridge(p1, u1, p2, u2, step)) add(q);
      dir = unit(u2);
    }
  }
  const last = pts[pts.length - 1];
  for (let d = step; d <= RUN_ON; d += step) add([last[0] + dir[0] * d, last[1] + dir[1] * d, last[2] + dir[2] * d], Math.exp(-d / (RUN_ON * 0.35)));
}

// the compact event → { pvs: [{ at: [x, y, z] m, n }], tracks, deposits }
//   tracks: { pts: [[x, y, z] m], seen: [0..1], muon, electron, pv }
//   deposits: { kind ('EB' …), E (GeV), at: the cell's front centre, dir: along the
//   cell, depth: the cell's (m), wide: its front face's edge (m) }
export function cmsPaths(ev, { step = 0.01, calo = ['EB', 'EE', 'HB', 'HE', 'HO'] } = {}) {
  const pvs = (ev.vertices || []).map((v) => ({ at: [v[0], v[1], v[2]], n: v[4] }));
  const good = ev.nGood ?? (ev.tracks || []).length;
  const muons = new Map((ev.muons || []).map((m) => [m.track, m]));
  const tracks = [];
  for (const [i, r] of (ev.tracks || []).slice(0, good).entries()) {
    const [, q, pt, eta, phi, x0, y0, z0, pv, , , , aEnd, aCal, tag] = r;
    const at = helix({ q, pt, eta, phi, x0, y0, z0 });
    const perRad = (pt / K) * Math.cosh(eta);       // m of path per radian turned
    // to the calorimeter, or one turn, or until it has faded out (a fiftieth)
    let aMax = Math.min(aCal ?? Infinity, Math.max(aEnd, LOOP));
    if (tag !== 1) aMax = Math.min(aMax, aEnd + (REACH + 4 * FADE) / perRad);
    const n = Math.max(2, Math.ceil(aMax * perRad / step));
    const pts = [], seen = [];
    for (let k = 0; k <= n; k++) {
      const a = aMax * k / n, past = (a - aEnd) * perRad - REACH;
      pts.push(at(a));
      // a muon is measured on through the muon system: it never fades here
      seen.push(past > 0 && tag !== 1 ? Math.exp(-past / FADE) : 1);
    }
    // the vertex it came from (the file's, or the nearest along the beam)
    let v = pv;
    if (!(v >= 0)) v = pvs.reduce((b, p, j) => (Math.abs(p.at[2] - z0) < Math.abs(pvs[b].at[2] - z0) ? j : b), 0);
    const m = muons.get(i);
    if (m) muonOn(m, pts, seen, pvs[v]?.at || [x0, y0, z0], step * 2);
    tracks.push({ index: i, pts, seen, pv: v, muon: tag === 1, electron: tag === 2, looper: aCal == null });
  }
  const deposits = [];
  for (const kind of calo) {
    for (const h of ev.calo?.[kind]?.hits || []) {
      const f = h.slice(3, 6), b = h.slice(6, 9);
      deposits.push({ kind, E: h[0], at: f, dir: unit(sub(b, f)), depth: len(sub(b, f)), wide: h[9] });
    }
  }
  return { pvs, tracks, deposits };
}
