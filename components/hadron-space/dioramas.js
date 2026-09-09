import {
  Group, Mesh, MeshBasicMaterial, PlaneGeometry, TorusGeometry, SphereGeometry, BufferGeometry, BufferAttribute,
  Line, LineSegments, LineBasicMaterial, LineDashedMaterial, TextureLoader, Vector3, DoubleSide, AdditiveBlending, Color, CylinderGeometry, Quaternion,
} from 'three';
import { makeLabel, makeText } from './labels.js';

// Builders for the stations of the Startertalk hadron space (spec
// 2026-09-09-startertalk-dioramas-design.md §2–3). One function per object
// type; buildStation() composes them into a Group placed at station.pos and
// returns the anchors (state spheres, station centre), an update(t, camPos)
// for the small motions, and setDim(k) so labels fade with the scrim.

const QUARK = { c: '#3987e5', cbar: '#3987e5', u: '#e6e9ee', d: '#c9d1da', s: '#d95926' };
const loader = new TextureLoader();
const v = (a) => new Vector3(a[0], a[1], a[2]);

function quarkBall(q, r = 0.42) {
  const m = new Mesh(new SphereGeometry(r, 20, 14), new MeshBasicMaterial({ color: QUARK[q.flavour] || '#e6e9ee', transparent: true, opacity: 0.95 }));
  m.position.copy(v(q.pos));
  if (q.flavour === 'cbar') {                          // antiquark: a thin white rim
    const rim = new Mesh(new SphereGeometry(r * 1.12, 20, 14), new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, side: DoubleSide }));
    m.add(rim);
  }
  return m;
}
function shell(radius, color = '#7dd3fc', opacity = 0.12) {
  return new Mesh(new SphereGeometry(radius, 32, 20), new MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: AdditiveBlending, side: DoubleSide }));
}
function endLabel(text, pts, color) {
  const l = makeLabel(text, { worldH: 0.46, color, letterSpacing: 0.02, upper: false });
  const end = pts[pts.length - 1];
  l.position.set(end.x + 0.55, end.y + 0.3, end.z);
  return l;
}

const build = {
  page(o) {
    const g = new Group();
    const mat = new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.96, side: DoubleSide });
    loader.load(o.src, (tex) => { mat.map = tex; mat.needsUpdate = true; });
    const m = new Mesh(new PlaneGeometry(o.width, o.height), mat);
    m.rotation.y = (o.yaw || 0) * Math.PI / 180;
    g.add(m);
    // a faint lit halo behind the sheet so it reads as a lit object in the dark
    const halo = new Mesh(new PlaneGeometry(o.width * 1.25, o.height * 1.18), new MeshBasicMaterial({ color: '#7dd3fc', transparent: true, opacity: 0.08, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }));
    halo.position.z = -0.05; halo.rotation.y = m.rotation.y; g.add(halo);
    g.position.copy(v(o.pos));
    return { group: g, labels: [] };
  },
  text(o) {
    const s = makeText(o.text, { height: o.height, color: o.color, weight: o.weight });
    s.position.copy(v(o.pos));
    return { group: s, labels: [s] };
  },
  ring(o) {
    const g = new Group();
    const mat = new MeshBasicMaterial({ color: o.color || '#7dd3fc', transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false });
    const ring = new Mesh(new TorusGeometry(o.radius, o.radius * 0.07, 12, 64), mat);
    g.add(ring); g.position.copy(v(o.pos));
    const fadeNear = o.fadeNear || 0;
    const world = new Vector3();
    const anchors = o.id ? new Map([[o.id, new Vector3(0, 0, 0)]]) : undefined;   // a ring can stand for a state (Θ⁺)
    return { group: g, labels: [], anchors, update(t, camPos) {
      ring.rotation.y = t * 0.2;
      if (fadeNear) { const d = camPos.distanceTo(g.getWorldPosition(world)); mat.opacity = 0.15 + 0.7 * Math.min(1, Math.max(0, (d - fadeNear) / fadeNear)); }
    } };
  },
  tracks(o) {
    const g = new Group(); const labels = []; const pulses = [];
    for (const t of o.tracks) {
      const pts = t.points.map(v);
      const geo = new BufferGeometry().setFromPoints(pts);
      const col = new Color(t.color || '#f2f5f9');
      const mat = t.dashed
        ? new LineDashedMaterial({ color: col, transparent: true, opacity: t.fade ?? 0.9, dashSize: 0.22, gapSize: 0.16, depthWrite: false })
        : new LineBasicMaterial({ color: col, transparent: true, opacity: t.fade ?? 0.9, depthWrite: false });
      const line = new Line(geo, mat); if (t.dashed) line.computeLineDistances();
      g.add(line);
      // a soft glow: a second pass with additive blending
      g.add(new Line(geo.clone(), new LineBasicMaterial({ color: col, transparent: true, opacity: 0.25 * (t.fade ?? 1), blending: AdditiveBlending, depthWrite: false })));
      if (!t.dashed) {
        // solid tracks as thin tubes: WebGL lines are one pixel wide whatever the screen
        for (let k = 0; k + 1 < pts.length; k++) {
          const a = pts[k], b = pts[k + 1], dir = b.clone().sub(a), len = dir.length();
          const tube = new Mesh(new CylinderGeometry(0.03 * (t.width || 2), 0.03 * (t.width || 2), len, 8, 1, true), new MeshBasicMaterial({ color: col, transparent: true, opacity: t.fade ?? 0.9 }));
          tube.position.copy(a).addScaledVector(dir, 0.5);
          tube.quaternion.copy(new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize()));
          g.add(tube);
        }
      }
      if (t.label) { const l = endLabel(t.label, pts, t.color || '#f2f5f9'); g.add(l); labels.push(l); }
      if (o.pulse && !t.dashed) {
        const dot = new Mesh(new SphereGeometry(0.09, 10, 8), new MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false }));
        g.add(dot); pulses.push({ a: pts[0], b: pts[pts.length - 1], dot });
      }
    }
    for (const n of o.nodes || []) { const m = new Mesh(new SphereGeometry(n.size, 16, 12), new MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.95 })); m.position.copy(v(n.pos)); g.add(m); }
    g.position.copy(v(o.pos));
    return { group: g, labels, update(t) {
      // one pulse runs down every solid track in 3 s, staggered by track index
      pulses.forEach((p, i) => { const u = (t * 0.33 + i * 0.13) % 1; p.dot.position.lerpVectors(p.a, p.b, u); p.dot.material.opacity = 0.9 * Math.sin(Math.PI * u); });
    } };
  },
  spheres(o, ctx) {
    // state markers: filled when observed, hollow otherwise; placed by mass
    const g = new Group(); const labels = []; const anchors = new Map();
    o.ids.forEach((id, i) => {
      const s = ctx.states.get(id); if (!s) return;
      const row = id.startsWith('Pcs') ? 'Pcs' : 'Pc';
      const x = (s.mass - o.origin) * o.scale, z = o.rows[row];
      const hollow = s.status !== 'observed';
      const color = row === 'Pcs' ? '#d95926' : '#3987e5';
      const m = hollow
        ? new Mesh(new TorusGeometry(0.26, 0.04, 10, 40), new MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }))
        : new Mesh(new SphereGeometry(0.26, 20, 14), new MeshBasicMaterial({ color }));
      m.position.set(x, 0, z); g.add(m);
      const halo = shell(0.4, color, 0.08); halo.position.set(x, 0, z); g.add(halo);
      anchors.set(id, new Vector3(x, 0, z));
      if (o.labels) { const l = makeLabel(s.label || id, { worldH: 0.3, color: '#e6e9ee', letterSpacing: 0.02, upper: false }); l.position.set(x, 0.75 + (i % 2) * 0.32, z); g.add(l); labels.push(l); }
    });
    g.position.copy(v(o.pos));
    return { group: g, labels, anchors };
  },
  planes(o) {
    const g = new Group(); const labels = [];
    for (const p of o.planes) {
      const x = (p.mass - o.origin) * o.scale, z = (o.rows && o.rows[p.row]) ?? 0;
      const m = new Mesh(new PlaneGeometry(o.depth, o.height), new MeshBasicMaterial({ color: '#7dd3fc', transparent: true, opacity: 0.13, side: DoubleSide, depthWrite: false, blending: AdditiveBlending }));
      m.rotation.y = Math.PI / 2; m.position.set(x, 0, z); g.add(m);
      const l = makeLabel(p.label, { worldH: 0.26, color: '#8b97a6', letterSpacing: 0.02, upper: false }); l.position.set(x, o.height / 2 + 0.25, z); g.add(l); labels.push(l);
    }
    g.position.copy(v(o.pos));
    return { group: g, labels };
  },
  cluster(o) {
    const g = new Group(); const labels = []; const balls = new Group();
    for (const q of o.quarks) balls.add(quarkBall(q, 0.42 * (o.radius / 1.9)));
    g.add(balls);
    if (o.shell) g.add(shell(o.radius));
    if (o.label) { const l = makeLabel(o.label, { worldH: 0.4, color: '#f2f5f9', letterSpacing: 0.08 }); l.position.set(0, o.radius + 0.7, 0); g.add(l); labels.push(l); }
    g.position.copy(v(o.pos));
    return { group: g, labels, update(t) { balls.rotation.y = t * (o.spin || 0); balls.rotation.x = Math.sin(t * 0.3) * 0.15; } };
  },
  molecule(o) {
    const g = new Group(); const labels = [];
    const A = new Group(), B = new Group();
    for (const q of o.a.quarks) A.add(quarkBall(q, 0.42)); A.add(shell(o.a.radius)); A.position.x = -o.separation / 2;
    for (const q of o.b.quarks) B.add(quarkBall(q, 0.42)); B.add(shell(o.b.radius)); B.position.x = o.separation / 2;
    g.add(A, B);
    let link = null;
    if (o.link) {
      // exchange glow: a faint additive dashed line between the shells, pulsing
      const geo = new BufferGeometry().setFromPoints([new Vector3(-o.separation / 2 + o.a.radius, 0, 0), new Vector3(o.separation / 2 - o.b.radius, 0, 0)]);
      link = new LineDashedMaterial({ color: '#7dd3fc', transparent: true, opacity: 0.6, dashSize: 0.3, gapSize: 0.2, blending: AdditiveBlending, depthWrite: false });
      const line = new Line(geo, link); line.computeLineDistances(); g.add(line);
    }
    if (o.label) { const l = makeLabel(o.label, { worldH: 0.4, color: '#f2f5f9', letterSpacing: 0.08 }); l.position.set(0, Math.max(o.a.radius, o.b.radius) + 0.7, 0); g.add(l); labels.push(l); }
    g.position.copy(v(o.pos));
    return { group: g, labels, update(t) { A.rotation.y = t * 0.12; B.rotation.y = -t * 0.15; if (link) link.opacity = 0.35 + 0.25 * Math.sin(t * 1.3); } };
  },
  grid(o) {
    const pts = []; const cols = [];
    for (let x = o.from; x <= o.to; x += o.step) { pts.push(x, 0, -8, x, 0, 8); const a = 1 - (x - o.from) / (o.to - o.from); cols.push(a, a, a, a, a, a); }
    for (let z = -8; z <= 8; z += o.step) { pts.push(o.from, 0, z, o.to, 0, z); cols.push(1, 1, 1, 0.05, 0.05, 0.05); }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3));
    geo.setAttribute('color', new BufferAttribute(new Float32Array(cols), 3));
    const m = new LineSegments(geo, new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false }));
    m.position.copy(v(o.pos));
    return { group: m, labels: [] };
  },
  bar(o) {
    const g = new Group();
    const geo = new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), new Vector3(o.length, 0, 0), new Vector3(0, -0.15, 0), new Vector3(0, 0.15, 0), new Vector3(o.length, -0.15, 0), new Vector3(o.length, 0.15, 0)]);
    g.add(new LineSegments(geo, new LineBasicMaterial({ color: '#f2f5f9', transparent: true, opacity: 0.9 })));
    const l = makeLabel(o.label, { worldH: 0.34, color: '#f2f5f9', letterSpacing: 0.04 }); l.position.set(o.length / 2, 0.45, 0); g.add(l);
    g.position.copy(v(o.pos));
    return { group: g, labels: [l] };
  },
};

export function buildStation(station, ctx) {
  const group = new Group(); group.position.copy(v(station.pos));
  const anchors = new Map([[station.id, v(station.pos)]]);
  const labels = []; const updaters = [];
  for (const o of station.objects || []) {
    const b = build[o.type]; if (!b) { console.warn('hadron-space: unknown object type', o.type); continue; }
    const r = b(o, ctx);
    group.add(r.group); labels.push(...(r.labels || []));
    if (r.update) updaters.push(r.update);
    if (r.anchors) for (const [id, p] of r.anchors) anchors.set(id, p.clone().add(v(o.pos)).add(v(station.pos)));
  }
  return {
    group, anchors,
    update(t, camPos) { for (const u of updaters) u(t, camPos); },
    setDim(k) { const op = 0.9 * Math.max(0, 1 - k / 0.85); for (const l of labels) l.material.opacity = op; },
    dispose() { group.traverse((o) => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); }); },
  };
}
