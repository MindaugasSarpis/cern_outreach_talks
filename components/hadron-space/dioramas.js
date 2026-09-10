import {
  Group, Mesh, Points, MeshBasicMaterial, ShaderMaterial, PlaneGeometry, TorusGeometry, SphereGeometry, BufferGeometry, BufferAttribute,
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
// Public assets in space.json are written as `/figures/…`; the deck is served
// under a base (`/<repo>/<talk>/` on GitHub Pages), so resolve against it —
// an unresolved path left the Zweig page a blank white sheet.
const BASE = (import.meta.env?.BASE_URL || '/').replace(/\/?$/, '/');
const asset = (src) => (src.startsWith('/') ? BASE + src.slice(1) : src);

// Orbs, not discs. Every sphere in the world — quark, state marker, decay
// vertex — is lit from its rim: a dark translucent centre the dust shows
// through and a bright fresnel edge, so a ball reads as a volume of glow
// rather than a flat coloured circle.
const ORB_VERT = /* glsl */ `
varying vec3 vN, vV;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;
const ORB_FRAG = /* glsl */ `
uniform vec3 uColor; uniform float uOpacity, uCore;
varying vec3 vN, vV;
void main() {
  float nv = max(dot(normalize(vN), normalize(vV)), 0.0);
  float f = pow(1.0 - nv, 2.4);            // rim
  float c = pow(nv, 3.0);                   // the face toward the viewer, lit from the front
  vec3 col = mix(uColor * (0.7 + 0.45 * c), vec3(1.0), f * 0.6);
  float a = uOpacity * clamp(uCore + (1.0 - uCore) * f, 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}`;
function orb(color, { opacity = 0.95, core = 0.82 } = {}) {
  return new ShaderMaterial({
    vertexShader: ORB_VERT, fragmentShader: ORB_FRAG, transparent: true, depthWrite: false,
    uniforms: { uColor: { value: new Color(color) }, uOpacity: { value: opacity }, uCore: { value: core } },
  });
}
const setOrb = (mat, k, v) => { if (mat.uniforms) mat.uniforms[k].value = v; else mat[k === 'uOpacity' ? 'opacity' : 'color'] = v; };

function quarkBall(q, r = 0.42, { ghost = false } = {}) {
  const m = new Mesh(new SphereGeometry(r, 24, 16), orb(QUARK[q.flavour] || '#e6e9ee', ghost ? { opacity: 0.55, core: 0.22 } : {}));
  m.position.copy(v(q.pos));
  if (q.flavour === 'cbar' || q.flavour === 'sbar') {   // antiquark: a thin white rim
    const rim = new Mesh(new SphereGeometry(r * 1.12, 24, 16), new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: ghost ? 0.15 : 0.3, side: DoubleSide, depthWrite: false }));
    m.add(rim);
  }
  return m;
}
function shell(radius, color = '#7dd3fc', opacity = 0.12) {
  // a bubble, not a disc: the fresnel orb with almost no body, additive, so
  // only the rim glows and the inside stays open to the dust and the quarks
  const m = orb(color, { opacity: Math.min(0.4, opacity * 2.2), core: 0.05 });
  m.blending = AdditiveBlending; m.side = DoubleSide;
  return new Mesh(new SphereGeometry(radius, 40, 24), m);
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
    const mat = new MeshBasicMaterial({ color: '#2a2f36', transparent: true, opacity: 0.96, side: DoubleSide });
    loader.load(asset(o.src), (tex) => { mat.map = tex; mat.color.set('#ffffff'); mat.needsUpdate = true; },
      undefined, () => console.warn('hadron-space: page texture failed', o.src));
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
    for (const n of o.nodes || []) { const m = new Mesh(new SphereGeometry(n.size, 20, 14), orb(n.color, { core: 0.75 })); m.position.copy(v(n.pos)); g.add(m); }
    g.position.copy(v(o.pos));
    return { group: g, labels, update(t) {
      // one pulse runs down every solid track in 3 s, staggered by track index
      pulses.forEach((p, i) => { const u = (t * 0.33 + i * 0.13) % 1; p.dot.position.lerpVectors(p.a, p.b, u); p.dot.material.opacity = 0.9 * Math.sin(Math.PI * u); });
    } };
  },
  spheres(o, ctx) {
    // state markers placed by mass: an observed state is a full orb, an
    // evidence / candidate / superseded one the same orb at a third of the light
    const g = new Group(); const labels = []; const anchors = new Map();
    o.ids.forEach((id, i) => {
      const s = ctx.states.get(id); if (!s) return;
      const row = id.startsWith('Pcs') ? 'Pcs' : 'Pc';
      const x = (s.mass - o.origin) * o.scale, z = o.rows[row];
      const established = s.status === 'observed';
      const color = row === 'Pcs' ? '#d95926' : '#3987e5';
      const m = new Mesh(new SphereGeometry(0.26, 24, 16), orb(color, established ? { core: 0.7 } : { opacity: 0.45, core: 0.25 }));
      m.position.set(x, 0, z); g.add(m);
      if (established) { const halo = shell(0.4, color, 0.08); halo.position.set(x, 0, z); g.add(halo); }
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
    // `ghost: true` draws the cluster as a state that went away (the Θ⁺):
    // faint orbs that breathe apart and back together and never quite hold.
    const g = new Group(); const labels = []; const balls = new Group();
    const home = [];
    for (const q of o.quarks) { const b = quarkBall(q, 0.42 * (o.radius / 1.9) * (o.quarkScale || 1), { ghost: !!o.ghost }); balls.add(b); home.push(b.position.clone()); }
    g.add(balls);
    if (o.shell) g.add(shell(o.radius, '#7dd3fc', o.ghost ? 0.05 : 0.12));
    if (o.core) g.add(shell(o.radius * 0.38, '#7dd3fc', 0.1));   // an inner glow, the binding
    // `orbit: true`: each quark rides its own tilted ring through its home
    // position, at its own pace — the cluster lives instead of turning as a block
    const rings = o.orbit ? home.map((h, i) => {
      const n = new Vector3(Math.sin(i * 2.1), 0.8 + 0.6 * Math.cos(i * 1.3), Math.sin(i * 0.7)).normalize();
      const u = h.clone().sub(n.clone().multiplyScalar(h.dot(n))).normalize();
      const w = new Vector3().crossVectors(n, u);
      return { r: h.length(), u, w, speed: 0.22 + 0.11 * (i % 3), phase: i * 1.7 };
    }) : null;
    if (o.label) { const l = makeLabel(o.label, { worldH: 0.4, color: '#f2f5f9', letterSpacing: 0.08 }); l.position.set(0, o.radius + 0.7, 0); g.add(l); labels.push(l); }
    g.position.copy(v(o.pos));
    const anchors = o.id ? new Map([[o.id, new Vector3(0, 0, 0)]]) : undefined;   // a cluster can stand for a state (Θ⁺)
    return { group: g, labels, anchors, update(t) {
      balls.rotation.y = t * (o.spin || 0); balls.rotation.x = Math.sin(t * 0.3) * 0.15;
      if (rings) balls.children.forEach((b, i) => {
        const k = rings[i], a = k.phase + t * k.speed;
        b.position.copy(k.u).multiplyScalar(k.r * Math.cos(a)).addScaledVector(k.w, k.r * Math.sin(a));
      });
      if (o.ghost) {
        // a slow breath (5.5 s) pulls the quarks apart to twice their spacing and lets them fall back;
        // the orbs are dimmest when farthest apart — a bound state that will not stay bound
        const u = 0.5 - 0.5 * Math.cos(t * 1.15);
        balls.children.forEach((b, i) => {
          b.position.copy(home[i]).multiplyScalar(1 + 1.1 * u + 0.08 * Math.sin(t * 2.1 + i));
          setOrb(b.material, 'uOpacity', 0.6 - 0.35 * u);
        });
      }
    } };
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

// A grain sprite for the particle pentaquark: soft additive discs, sized by
// depth, each twinkling on its own seed.
const GRAIN_VERT = /* glsl */ `
attribute float aSize, aAlpha, aSeed; attribute vec3 aColor;
uniform float uPixelRatio, uTime;
varying vec3 vColor; varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.7 + 0.3 * sin(uTime * (1.2 + aSeed * 2.4) + aSeed * 40.0);
  gl_PointSize = uPixelRatio * aSize * tw * (72.0 / max(-mv.z, 0.1));
  vColor = aColor; vAlpha = aAlpha * tw;
}`;
const GRAIN_FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.04, d) * vAlpha;
  gl_FragColor = vec4(vColor * a, a);
}`;
const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2; };
const FLAVOUR = {
  c: { grain: '#4f9cff', core: '#dff0ff' }, cbar: { grain: '#8e7dff', core: '#efe9ff' },
  u: { grain: '#dfe6ee', core: '#ffffff' }, d: { grain: '#b9c4d0', core: '#ffffff' }, s: { grain: '#f0925c', core: '#fff1e6' },
};

build.pentaquark = function (o) {
  // The hero: five quarks as fuzzy clouds of grains around a bright core,
  // riding their own tilted orbits; colour strings of flowing grains join
  // them in a ring (c → u → d → u → c̄ → c); a thin haze of grains marks the
  // bound volume. No solid surface anywhere.
  const g = new Group();
  const Q = o.quarks, nQ = Q.length;
  const R = o.radius || 3, rQ = o.quarkRadius || 0.7;
  const NQ = 360, NS = 2600, NT = 170, NC = 1;   // grains per quark, boundary, per string, cores
  const nStr = nQ;                                // ring of strings
  const total = nQ * (NQ + NC) + NS + nStr * NT;
  const pos = new Float32Array(total * 3), col = new Float32Array(total * 3);
  const size = new Float32Array(total), alpha = new Float32Array(total), seed = new Float32Array(total);
  let k = 0;
  const put = (c, sz, al) => { col.set(c, k * 3); size[k] = sz; alpha[k] = al; seed[k] = Math.random(); return k++; };
  const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b]; };
  // quark clouds: gaussian offsets, each grain with its own slow spin about the core
  const clouds = Q.map((q) => {
    const f = FLAVOUR[q.flavour] || FLAVOUR.u, grain = rgb(f.grain), core = rgb(f.core);
    const items = [];
    for (let i = 0; i < NQ; i++) {
      const off = new Vector3(gauss(), gauss(), gauss()).multiplyScalar(rQ * 0.55);
      const far = off.length() / rQ;
      items.push({ idx: put(grain, 1.0 + 1.0 * Math.random(), 0.3 + 0.55 * Math.exp(-far * 1.6)), off, w: 0.25 + 0.5 * Math.random(), ph: Math.random() * 6.28 });
    }
    const coreIdx = put(core, 15, 0.9);
    return { items, coreIdx };
  });
  // the boundary: a tight band of grains at the bound radius R — dense enough
  // to read as a surface from a distance, still grains up close — plus, below,
  // a faint rim bubble that catches the edge
  const haze = [];
  for (let i = 0; i < NS; i++) {
    const d = new Vector3(gauss(), gauss(), gauss()).normalize();
    const r = R * (0.97 + 0.06 * Math.random());
    haze.push({ idx: put(rgb('#7dd3fc'), 0.7 + 0.8 * Math.random(), 0.2 + 0.3 * Math.random()), d, r, ph: Math.random() * 6.28 });
  }
  g.add(shell(R, '#7dd3fc', 0.05));
  // strings: grains flowing from quark a to quark b along a gently bowed path
  const ring = [];
  for (let s = 0; s < nStr; s++) {
    const a = s, b = (s + 1) % nQ, items = [];
    const n = new Vector3(gauss(), gauss(), gauss()).normalize();
    for (let i = 0; i < NT; i++) items.push({ idx: put(rgb('#7dd3fc'), 0.8 + 0.8 * Math.random(), 0.25 + 0.4 * Math.random()), u: Math.random(), w: (Math.random() - 0.5) * 0.28, ph: Math.random() * 6.28 });
    ring.push({ a, b, n, items });
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aColor', new BufferAttribute(col, 3));
  geo.setAttribute('aSize', new BufferAttribute(size, 1));
  geo.setAttribute('aAlpha', new BufferAttribute(alpha, 1));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  const mat = new ShaderMaterial({
    vertexShader: GRAIN_VERT, fragmentShader: GRAIN_FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) } },
  });
  const pts = new Points(geo, mat); pts.frustumCulled = false; g.add(pts);
  // quark centres on tilted orbits through their home positions
  const home = Q.map((q) => v(q.pos));
  const orbits = home.map((h, i) => {
    const n = new Vector3(Math.sin(i * 2.1), 0.8 + 0.6 * Math.cos(i * 1.3), Math.sin(i * 0.7)).normalize();
    const u = h.clone().sub(n.clone().multiplyScalar(h.dot(n))).normalize();
    const w = new Vector3().crossVectors(n, u);
    return { r: h.length(), u, w, speed: 0.18 + 0.1 * (i % 3), phase: i * 1.7 };
  });
  const centres = home.map((h) => h.clone());
  const tmp = new Vector3(), tmp2 = new Vector3();
  const labels = [];
  if (o.label) { const l = makeLabel(o.label, { worldH: 0.5, color: '#8b97a6', letterSpacing: 0.1, upper: false }); l.position.set(0, R + 1.0, 0); g.add(l); labels.push(l); }   // above the cluster, clear of centred text on the close
  g.position.copy(v(o.pos));
  const set = (idx, p) => { pos[idx * 3] = p.x; pos[idx * 3 + 1] = p.y; pos[idx * 3 + 2] = p.z; };
  return { group: g, labels, update(t) {
    mat.uniforms.uTime.value = t;
    centres.forEach((c, i) => { const k = orbits[i], a = k.phase + t * k.speed; c.copy(k.u).multiplyScalar(k.r * Math.cos(a)).addScaledVector(k.w, k.r * Math.sin(a)); });
    clouds.forEach((cl, i) => {
      const c = centres[i];
      for (const it of cl.items) {
        // the grain circles its core: rotate the offset about y at its own rate, breathe radially
        const a = t * it.w + it.ph, ca = Math.cos(a), sa = Math.sin(a);
        const br = 1 + 0.12 * Math.sin(t * 1.3 + it.ph);
        tmp.set((it.off.x * ca - it.off.z * sa) * br, it.off.y * br, (it.off.x * sa + it.off.z * ca) * br).add(c);
        set(it.idx, tmp);
      }
      set(cl.coreIdx, c);
    });
    for (const h of haze) { tmp.copy(h.d).multiplyScalar(h.r * (1 + 0.04 * Math.sin(t * 0.6 + h.ph))); tmp.applyAxisAngle(new Vector3(0, 1, 0), t * 0.05); set(h.idx, tmp); }
    for (const s of ring) {
      const A = centres[s.a], B = centres[s.b];
      for (const it of s.items) {
        const u = (it.u + t * 0.16) % 1;
        tmp.lerpVectors(A, B, u);
        // bow the string outward from the cluster centre and let the grain wander across it
        tmp2.copy(tmp).normalize().multiplyScalar(0.35 * Math.sin(Math.PI * u));
        tmp.add(tmp2).addScaledVector(s.n, it.w * Math.sin(Math.PI * u) * (1 + 0.5 * Math.sin(t * 2.2 + it.ph)));
        set(it.idx, tmp);
      }
    }
    geo.attributes.position.needsUpdate = true;
  } };
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
