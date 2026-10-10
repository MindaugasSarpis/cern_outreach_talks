// From a real LHCb event (event.json, read from CERN open data) to the paths its
// particles take, in metres in LHCb's frame (z along the beam, y up).
//
// A track is a list of measured states: a position and slopes (tx = dx/dz, ty =
// dy/dz) at several z. The DST keeps them near the collision (the VELO), at the
// start of RICH2 just after the magnet (z = 9.45 m) and, for a muon, in the muon
// system; none inside the magnet. Across the magnet a track is bent the way LHCb's
// dipole bends it: straight in the VELO, turning where the field is (a gaussian
// round z = 5.25 m), straight again after, its slope and position matched to both
// measured states. Elsewhere between two states the path is a cubic in z that
// meets both positions with both slopes.
//
// Before its first state a track from a primary vertex runs straight back to it;
// a track that starts elsewhere (a K0S's daughter, a downstream track) starts where
// it was first seen. After its last state it runs on to where LHCb would stop it:
// the electromagnetic calorimeter's face, or the last muon station for a muon. A
// track whose states end before the magnet (an upstream track, too slow to reach
// the T stations) is carried on through the field with the kick the dipole gives
// its momentum, which this event's own long tracks measure (their slope change
// across the magnet against q/p), until it leaves the acceptance. A VELO-only
// track has no momentum: it is drawn straight from its vertex, forward or back,
// as far as the VELO saw it, and fades out beyond.

export const MAG = { z: 5.25, w: 1.9 };            // the dipole's field along z: centre and width (m), a gaussian
const ECAL = 12.62, MUON = 19.2, EDGE = 4.6;      // m: the calorimeter's face, the last muon station, |x| that leaves
const VELO_SEEN = 0.8, VELO_DRAWN = 2.4;           // m from the vertex: as far as a VELO track is measured, and drawn

const erf = (x) => {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
  return x >= 0 ? y : -y;
};
const fieldCum = (z) => 0.5 * (1 + erf((z - MAG.z) / (MAG.w * Math.SQRT2)));   // the field's integral up to z, of 1
const shape = (z) => Math.exp(-0.5 * ((z - MAG.z) / MAG.w) ** 2) / (MAG.w * Math.sqrt(2 * Math.PI));

function hermite(a, b, z) {
  const h = b.z - a.z, s = (z - a.z) / h, s2 = s * s, s3 = s2 * s;
  const h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = -2 * s3 + 3 * s2, h11 = s3 - s2;
  return [h00 * a.x + h10 * h * a.tx + h01 * b.x + h11 * h * b.tx, h00 * a.y + h10 * h * a.ty + h01 * b.y + h11 * h * b.ty];
}

// from state a to state b across the magnet: tx turns from a's to b's as the field's
// integral runs, x is its integral, and what is left over at b (the field's shape is
// a model) is taken out evenly along the way; y on its cubic
function acrossMagnet(a, b, step) {
  const F0 = fieldCum(a.z), F1 = fieldCum(b.z), dF = Math.max(1e-6, F1 - F0);
  const out = [];
  let x = a.x;
  const xs = [], zs = [];
  for (let z = a.z; z < b.z; z += step) {
    zs.push(z); xs.push(x);
    const zm = Math.min(b.z, z + step / 2);
    const tx = a.tx + (b.tx - a.tx) * (fieldCum(zm) - F0) / dF;
    x += tx * Math.min(step, b.z - z);
  }
  const miss = b.x - x;
  for (let i = 0; i < zs.length; i++) {
    const z = zs[i], [, y] = hermite(a, b, z);
    out.push([xs[i] + miss * (z - a.z) / (b.z - a.z), y, z]);
  }
  return out;
}

// the compact event → { pvs: [[x, y, z] m], tracks, deposits }
export function readEvent(ev) {
  const mm = (v) => v / 1000;
  const pvs = (ev.pvs || []).map((v) => [mm(v[0]), mm(v[1]), mm(v[2])]);
  const good = ev.nGood ?? (ev.tracks || []).length;
  const tracks = (ev.tracks || []).slice(0, good).map((r, index) => {
    const [type, q, p, ns] = r;
    const states = [];
    let i = 4;
    states.push({ x: mm(r[i]), y: mm(r[i + 1]), z: mm(r[i + 2]), tx: r[i + 3], ty: r[i + 4] }); i += 5;
    for (let k = 1; k < ns; k++, i += 5) states.push({ z: mm(r[i]), x: mm(r[i + 1]), y: mm(r[i + 2]), tx: r[i + 3], ty: r[i + 4] });
    const [muon, back, pv] = [r[i], r[i + 1], r[i + 2]];
    states.sort((a, b) => a.z - b.z);
    return { index, type, q, p, states, muon: !!muon, back: !!back, pv: pv ?? 0 };
  });
  const deposits = [
    ...(ev.calo || ev.deposits || []).map((d) => ({ x: mm(d[0]), y: mm(d[1]), z: mm(d[2]), E: d[3], kind: 'ecal' })),
    ...(ev.hcal || []).filter((h) => h[0] < good).map((h) => ({ x: mm(h[1]), y: mm(h[2]), z: mm(h[3]), E: h[4], kind: 'hcal', track: h[0] })),
  ];
  return { pvs, tracks, deposits, jets: ev.jets || [], source: ev.source };
}

// the dipole's kick from the long tracks: Δtx across the magnet × p / q (GeV), the median
export function kick(tracks) {
  const ks = [];
  for (const t of tracks) {
    if (!t.p || !t.q) continue;
    const a = t.states.filter((s) => s.z < 2.5), b = t.states.filter((s) => s.z > 8);
    if (!a.length || !b.length) continue;
    ks.push((b[0].tx - a[a.length - 1].tx) * (t.p / 1000) / t.q);
  }
  if (!ks.length) return 1.2;
  ks.sort((x, y) => x - y);
  return ks[ks.length >> 1];
}

export function trajectories(ev, { step = 0.04 } = {}) {
  const { pvs, tracks, deposits, jets, source } = readEvent(ev);
  const K = kick(tracks);                          // GeV: Δtx = K q / p
  const out = [];
  for (const t of tracks) {
    const pv = pvs[t.pv] || pvs[0] || [0, 0, 0], zv = pv[2];
    const lineAt = (s, z) => [s.x + s.tx * (z - s.z), s.y + s.ty * (z - s.z), z];
    if (!t.p) {
      // VELO only: a straight line, whichever side of the vertex its one state lies;
      // from the vertex along it, forward or back, measured as far as VELO_SEEN
      const s0 = t.states[0], dir = t.back ? -1 : 1, pts = [], seen = [];
      for (let d = 0; d <= VELO_DRAWN; d += step) { pts.push(lineAt(s0, zv + dir * d)); seen.push(d < VELO_SEEN ? 1 : Math.exp(-(d - VELO_SEEN) / 0.6)); }
      out.push({ ...t, pts, seen, end: 'velo' }); continue;
    }
    // a state on the wrong side of the vertex (a "closest to the beam" point far
    // upstream of a track nearly parallel to it) is no part of the path
    let S = t.back ? t.states.filter((s) => s.z <= zv + 0.05) : t.states.filter((s) => s.z >= zv - 0.05);
    // nor is one far out in the magnet's middle for a track the VELO saw: the DST's
    // nearest-to-the-beam point of a track almost parallel to the beam
    if (!t.back && S.some((s) => s.z < 1.0)) S = S.filter((s) => s.z < 1.0 || s.z > 8.5);
    if (!S.length) continue;
    const pts = [], seen = [];                   // seen: 1 where measured, falling off where only drawn
    const add = (p, w = 1) => { pts.push(p); seen.push(w); };
    const first = S[0];
    const fromPV = first.z - zv < 0.35;            // a track from the vertex, not a daughter seen later
    if (fromPV && first.z > zv + step) for (let z = zv; z < first.z; z += step) add(lineAt(first, z));
    for (let k = 0; k < S.length - 1; k++) {
      const a = S[k], b = S[k + 1];
      if (a.z < 3.0 && b.z > 7.5) for (const p of acrossMagnet(a, b, step)) add(p);
      else for (let z = a.z; z < b.z; z += step) { const [x, y] = hermite(a, b, z); add([x, y, z]); }
    }
    const last = S[S.length - 1];
    add([last.x, last.y, last.z]);
    let end = 'ecal';
    {
      let { x, y, tx, ty } = last, z = last.z;
      const stopZ = t.muon ? MUON : ECAL;
      // the field's kick only where no state has measured it: a track whose states
      // run past the magnet has its bend in them
      const c = last.z < MAG.z + 2 * MAG.w ? K * t.q / (t.p / 1000) : 0;
      while (z < stopZ) {
        tx += c * shape(z + step / 2) * step;
        x += tx * step; y += ty * step; z += step;
        add([x, y, z], c ? 0.8 : 1);
        if (Math.abs(x) > EDGE || Math.abs(y) > EDGE * 0.8) { end = 'out'; break; }
      }
    }
    out.push({ ...t, pts, seen, end });
  }
  return { pvs, tracks: out, deposits, jets, source, kick: K };
}
