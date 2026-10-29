// dk-lineup: piles of one and the same sphere, one sphere a terabyte (bible §5 Talk 1
// "Bytes", Talk 5 "The record"). Every pile is built of the same spheres, so the single
// sphere stands beside the pile of 4, the pile of 4 beside a day's 345 600, and all of
// them keep their size when the camera pulls back for the next: what came before is
// seen shrinking into the new scale.
//
// Lifted from Užsikrauk karjerai's setup/piles.js:16-496 `lineup` (OpenData's before it,
// MasterTalk's after), with these changes:
// - it is on the kit's step bus;
// - every placement is seeded;
// - colours are the palette's roles, never a literal (OpenData's gold is gone);
// - the piles rest on the series floor by default (KJ's floated, centred on y = 0);
// - the labels are the kit's fixed-size labels (≥ 18 px, numbers and units only);
// - the object declares `grains` (the sphere impostors it draws).
// The metal look (a studio reflected in each sphere, the satin heap seen from far) is
// KJ's, unchanged: the owner chose it ("washed out … photorealistic", 8 Oct). These are
// sphere impostors, not grains: the one solid form the bible keeps (§4, "piles of 1 TB
// spheres").
//
//   { "type": "dk-lineup", "name": "tb", "pos": [0, 0, 0], "grains": 92000, "unit": 0.1,
//     "balls": [{ "n": 1 }, { "n": 4 }, { "n": 345600, "grain": 8 }, { "n": 1300000, "grain": 27, "color": "sel" }],
//     "gaps": [0.6, 1.2, 4] }
//
// Fields:
// - balls: up to 8 piles {n, grain (1), color ('crowd' | 'sel' | 'axis'), at, label, merge}.
//   n is the number of spheres the pile stands for. With `grain`, each drawn sphere
//   stands for `grain` of them and is cbrt(grain) times as wide, so a pile of millions
//   keeps its true volume with a fraction of the points. Without `at`, the piles stand
//   side by side along x, resting on the floor. `label` is a number with its unit
//   ("4 TB"), hung above the pile at a fixed size. `merge` is KJ's {from, copiesAt}: the
//   pile first gathers as copies of a smaller pile, then flies together.
// - unit (0.1): one sphere's lattice step. Its radius is 0.9 × unit.
// - anchor (0): the pile at the origin. gaps: the spaces between neighbours (2).
//   `wait` (s, 0): the pile gathers that long after its step, so piles shown together
//   still come one after another (lab 1 slide 8: one sphere, then 4, then a day's). `from`
//   ([x, y, z]): its spheres gather from that side (e.g. behind and below the piles, out
//   of a close camera's way) instead of from all round.
// - grow (3.2): seconds for a pile to gather. reach (3): how far out its spheres start.
// - mergeAt (2.4), armWait (6), rest (true: on the floor), assemble (true). A slide that
//   reaches the station on a `path` (the camera cuts to its first key) gets no assembly
//   until the path ends, so the piles wait out armWait in the dark: give such a lineup
//   `assemble: false`, and it gathers on its steps alone.
//
// Steps: k shows piles 0..k-1 (0 hides them all). An array [i, j, …] (from <StageSteps>)
// shows exactly those. A pile that appears gathers out of the dust, inner spheres
// first; going back, the piles past the step fly apart. A flight to the station
// scatters them and the arrival gathers them again (arm / assemble).
// api.value(): the spheres (terabytes) the shown piles stand for. busy while a pile
// gathers, flies apart or merges.
import {
  Group, Points, Mesh, SphereGeometry, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3, Vector4, Matrix4, Euler,
} from 'three';
import { FLOOR_Y, SEED, LABEL, roles } from './style.js';
import { mulberry32, gauss } from './rng.js';

export const TYPE = 'dk-lineup';
export const FIELDS = ['pos', 'name', 'grains', 'balls'];
export const OWNER = 't1';
export const files = () => [];

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildLineup(o, ctx, stage, kit), { fields: FIELDS });
}

// The first n points of the face-centred cubic lattice (integer coordinates with an even
// sum, neighbours √2 apart), nearest the origin first; the points of one shell in a
// seeded order, so a pile grows evenly.
function fccShells(n, rnd) {
  const rho = Math.cbrt((3 * n) / (2 * Math.PI)) + 2;
  const m = Math.ceil(rho), max = Math.ceil(rho * rho);
  const first = new Uint32Array(max + 2);
  for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) for (let z = -m; z <= m; z++) {
    if ((x + y + z) & 1) continue;
    const r2 = x * x + y * y + z * z;
    if (r2 <= max) first[r2 + 1]++;
  }
  for (let i = 1; i < first.length; i++) first[i] += first[i - 1];
  const total = first[max + 1], xyz = new Int16Array(total * 3), fill = first.slice();
  for (let x = -m; x <= m; x++) for (let y = -m; y <= m; y++) for (let z = -m; z <= m; z++) {
    if ((x + y + z) & 1) continue;
    const r2 = x * x + y * y + z * z;
    if (r2 > max) continue;
    const k = fill[r2]++;
    xyz[k * 3] = x; xyz[k * 3 + 1] = y; xyz[k * 3 + 2] = z;
  }
  for (let r2 = 0; r2 <= max; r2++) {
    const lo = first[r2], hi = first[r2 + 1];
    for (let i = hi - 1; i > lo; i--) {
      const j = lo + Math.floor(rnd() * (i - lo + 1));
      for (let c = 0; c < 3; c++) { const t = xyz[i * 3 + c]; xyz[i * 3 + c] = xyz[j * 3 + c]; xyz[j * 3 + c] = t; }
    }
  }
  return xyz.subarray(0, Math.min(n, total) * 3);
}

const MAXB = 8;
// Metal under a studio light (KJ, unchanged): a polished sphere shows the room it
// reflects, so the room is drawn here (a dark floor, a deep sky, a large soft key light
// from the upper left front, a thin cool rim light from behind right) and each sphere
// reflects it with its colour as the reflectance (Schlick's Fresnel lifts the edges).
const METAL = /* glsl */ `
vec3 studio(vec3 d) {
  vec3 sky = mix(vec3(0.012, 0.012, 0.014), vec3(0.08, 0.085, 0.095), smoothstep(-0.25, 0.9, d.y));
  float key = smoothstep(0.84, 0.975, dot(d, normalize(vec3(-6.0, 9.0, 7.0))));
  float fill = smoothstep(0.55, 0.95, dot(d, normalize(vec3(5.0, 1.0, 8.0))));
  float rim = smoothstep(0.93, 0.995, dot(d, normalize(vec3(7.0, 3.0, -6.0))));
  return sky + vec3(0.96, 0.97, 1.0) * key * 3.2 + vec3(0.9, 0.92, 1.0) * fill * 0.22 + vec3(0.55, 0.72, 1.0) * rim * 1.6;
}
vec3 studioHard(vec3 d) {
  vec3 room = mix(vec3(0.004, 0.004, 0.005), vec3(0.05, 0.052, 0.06), smoothstep(-0.05, 0.85, d.y));
  room += vec3(0.034, 0.034, 0.035) * exp(-abs(d.y - 0.05) * 4.0);
  vec3 kd = normalize(vec3(-6.0, 9.0, 7.0));
  vec3 kx = normalize(cross(vec3(0.0, 1.0, 0.0), kd));
  vec3 ky = cross(kd, kx);
  float kz = dot(d, kd);
  vec2 kp = vec2(dot(d, kx), dot(d, ky)) / max(kz, 0.05);
  float key = step(0.0, kz) * (1.0 - smoothstep(0.05, 0.42, length(kp * vec2(1.0, 0.8))));
  vec2 h = normalize(d.xz + 1e-5);
  float rim = smoothstep(0.9965, 0.9985, dot(h, normalize(vec2(7.0, -6.0)))) * smoothstep(-0.35, -0.15, d.y) * (1.0 - smoothstep(0.55, 0.75, d.y));
  return room + vec3(0.96, 0.97, 1.0) * key * 2.6 + vec3(0.85, 0.9, 1.0) * rim * 1.6;
}
vec3 metalHard(vec3 nW, vec3 vW, vec3 F0) {
  float ndv = clamp(dot(nW, vW), 0.0, 1.0 - 1e-6);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
  return studioHard(reflect(-vW, nW)) * F + F0 * 0.02;
}
vec3 metal(vec3 nW, vec3 vW, vec3 F0) {
  float ndv = clamp(dot(nW, vW), 0.0, 1.0 - 1e-6);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0);
  return studio(reflect(-vW, nW)) * F + F0 * 0.035;
}`;

const LINEUP_VERT = /* glsl */ `
attribute float aSeed, aK, aBall, aOld;
attribute vec3 aFrom, aFromDir;
uniform float uGrowing[${MAXB}];
uniform float uGrowK[${MAXB}];
uniform vec3 uGrowOff[${MAXB}];
uniform float uMerge[${MAXB}];
uniform vec3 uFromColor[${MAXB}];
uniform float uMergeAt;
uniform float uTime, uGrow, uReach, uRad, uViewH, uMaxPt, uShell;
uniform float uGs[${MAXB}];
uniform float uShowT[${MAXB}];
uniform float uHideT[${MAXB}];
uniform float uR[${MAXB}];
uniform vec3 uCenter[${MAXB}];
uniform vec3 uColor[${MAXB}];
uniform vec3 uCome[${MAXB}];
uniform vec3 uLight;
varying vec3 vColor; varying vec3 vCv; varying float vShade; varying float vPx; varying vec3 vOut; varying float vF; varying float vRad;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void off_() { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vCv = vec3(0.0); vShade = 0.0; vPx = 1.0; vOut = vec3(0.0, 1.0, 0.0); vF = 0.0; vRad = 0.0; }
void main() {
  int b = int(aBall + 0.5);
  float st = uShowT[b], ht = uHideT[b];
  bool merging = uMerge[b] > 0.5 && ht < 0.0;
  // grown in place ({grow: {from}}): the earlier pile's spheres (aOld) stand from the first
  // frame and lift with the pile's centre as it grows; the new ones gather round them
  bool growing = uGrowing[b] > 0.5, old = growing && aOld > 0.5;
  float k0 = growing ? uGrowK[b] : 0.0, kk = growing ? clamp((aK - k0) / max(1.0 - k0, 1e-3), 0.0, 1.0) : aK;
  float start = merging ? st : st + uGrow * (0.78 * pow(max(kk, 1e-6), 0.8) + 0.22 * aSeed);
  float f = merging ? ease((uTime - st - uMergeAt - 0.5 * aSeed) / 2.2) : ease((uTime - start) / 1.6);
  bool on = st >= 0.0 && uTime >= start;
  vec3 lift = vec3(0.0);
  if (old) {
    f = 1.0; on = st >= 0.0;
    lift = uGrowOff[b] * (1.0 - ease((uTime - st) / (uGrow + 1.6)));
    if (ht >= 0.0) { lift = uGrowOff[b] * ease((uTime - ht) / 1.1); on = on && uTime - ht < 1.2; }
  } else if (ht >= 0.0) { float g = 1.0 - ease((uTime - ht) / 1.1); f = min(f, g); on = on && g > 0.0; }
  if (!on) { off_(); return; }
  vec3 c = uCenter[b];
  vec3 off = position - c;
  float r = length(off);
  vec3 dir = r > 1e-4 ? off / r : normalize(vec3(hash(aSeed * 3.0), hash(aSeed * 5.0), hash(aSeed * 9.0)) - 0.5 + 1e-4);
  vec3 wp = (modelMatrix * vec4(c + off, 1.0)).xyz;
  float facingS = dot(dir, normalize(cameraPosition - wp));
  // a pile that stands is seen only by its skin: the buried spheres and its far side are never drawn
  float gs = uGs[b];
  bool settled = !old || (ht < 0.0 && uTime - st > uGrow + 1.6);
  if (f >= 1.0 && ht < 0.0 && settled && (r < uR[b] - uShell * gs || facingS < -0.3)) { off_(); return; }
  vec3 side = normalize(cross(dir, vec3(0.0, 1.0, 0.0)) + 1e-4);
  float reach = (uReach + uR[b]) * (0.8 + 1.4 * hash(aSeed * 91.0));
  vec3 far = dir * (r + reach) + side * reach * 0.6 * (hash(aSeed * 17.0) - 0.5) + vec3(0.0, reach * 0.5 * (hash(aSeed * 53.0) - 0.5), 0.0);
  vec3 come = uCome[b];
  if (dot(come, come) > 1e-6) {
    // from one side only: a cloud beyond the pile on that side, no swirl through the camera
    vec3 jit = (vec3(hash(aSeed * 17.0), hash(aSeed * 53.0), hash(aSeed * 29.0)) - 0.5) * reach * 0.9;
    far = off * 0.4 + normalize(come) * (uR[b] + reach) + jit;
  } else {
    float a = (1.0 - f) * 2.2;
    far = vec3(cos(a) * far.x - sin(a) * far.z, far.y, sin(a) * far.x + cos(a) * far.z);
  }
  vec3 placed = c + mix(far, off, f) + lift;
  vec3 outw = dir;
  if (merging) {
    float a1 = ease((uTime - st - 0.25 * aSeed) / 1.3);
    vec3 scat = (vec3(hash(aSeed * 3.0), hash(aSeed * 5.0), hash(aSeed * 9.0)) - 0.5) * 7.0;
    placed = mix(aFrom + scat * (1.0 - a1), position, f);
    outw = normalize(mix(aFromDir, dir, f) + 1e-4);
  }
  vec4 mv = modelViewMatrix * vec4(placed, 1.0);
  gl_Position = projectionMatrix * mv;
  vRad = uRad * gs;
  float px = vRad * projectionMatrix[1][1] * uViewH / max(-mv.z, 1e-3);
  float grow = f >= 1.0 ? mix(2.4, 1.0, smoothstep(2.0, 8.0, px)) : 1.0;
  float pop = merging ? smoothstep(0.0, 0.5, uTime - st - 0.25 * aSeed) : 1.0;
  gl_PointSize = clamp(px * grow * pop, 1.0, min(uMaxPt, 0.2 * uViewH));
  vPx = px;
  vCv = mv.xyz;
  float lit = 0.5 + 0.62 * max(dot(dir, normalize(uLight)), 0.0) + 0.25 * pow(1.0 - clamp(facingS, 0.0, 1.0 - 1e-6), 3.0);
  vShade = mix(1.0, lit, f);
  if (merging) { lit = 0.5 + 0.62 * max(dot(outw, normalize(uLight)), 0.0) + 0.2; vShade = mix(lit, mix(1.0, lit, f), f); }
  vOut = outw; vF = merging ? max(f, 0.999 * step(1.3, uTime - st)) : f;
  vColor = (merging ? mix(uFromColor[b], uColor[b], f) : uColor[b]) * (0.9 + 0.2 * hash(aSeed * 7.0));
}`;
// A heap of small polished balls seen as one body is satin, not a mirror (KJ).
const HEAP = /* glsl */ `
vec3 studioRough(vec3 d) {
  vec3 sky = mix(vec3(0.006, 0.006, 0.008), vec3(0.06, 0.064, 0.075), smoothstep(-0.3, 0.9, d.y));
  float key = pow(max(dot(d, normalize(vec3(-6.0, 9.0, 7.0))), 1e-6), 6.0);
  float rim = pow(max(dot(d, normalize(vec3(7.0, 3.0, -6.0))), 1e-6), 10.0);
  return sky + vec3(0.96, 0.97, 1.0) * key * 1.1 + vec3(0.55, 0.72, 1.0) * rim * 0.35;
}
vec3 heap(vec3 N, vec3 V, vec3 F0) {
  float ndv = clamp(dot(N, V), 0.0, 1.0 - 1e-6);
  vec3 F = F0 + (1.0 - F0) * pow(1.0 - ndv, 5.0) * 0.4;
  return mix(studioRough(N), studioRough(reflect(-V, N)), 0.55) * F + F0 * 0.35 * smoothstep(0.6, 0.72, min(F0.r, min(F0.g, F0.b)));
}`;
const LINEUP_FRAG = /* glsl */ `
uniform mat4 projectionMatrix;
varying vec3 vColor; varying vec3 vCv; varying float vShade; varying float vPx; varying vec3 vOut; varying float vF; varying float vRad;
${METAL}
${HEAP}
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0; q.y = -q.y;
  float r2 = dot(q, q);
  float fly = vF > 0.995 ? 0.0 : 1.0 - vF;
  bool tiny = vPx < 3.0 && fly == 0.0;
  if (r2 > 1.0 && !tiny) discard;
  r2 = min(r2, 1.0);
  vec3 fV = normalize(-vCv);
  vec3 xV = normalize(cross(vec3(0.0, 1.0, 0.0), fV));
  vec3 yV = cross(fV, xV);
  float nz = sqrt(1.0 - r2);
  vec3 nV = q.x * xV + q.y * yV + nz * fV;
  vec4 clip = projectionMatrix * vec4(vCv + nV * vRad, 1.0);
  gl_FragDepth = clip.z / clip.w * 0.5 + 0.5;
  vec3 vW = fV * mat3(viewMatrix);
  vec3 nW = nV * mat3(viewMatrix);
  vec3 pile = heap(vOut, vW, vColor);
  if (tiny) { gl_FragColor = vec4(pile * vShade + vColor * 0.02, 1.0); return; }
  vec3 own = metal(nW, vW, vColor);
  float ao = mix(0.28, 1.0, smoothstep(-0.45, 0.75, dot(nW, vOut))) * mix(0.5, 1.0, smoothstep(0.0, 0.55, nz));
  vec3 col = own * mix(ao, 1.0, fly) * vShade;
  float pileL = dot(pile, vec3(0.3, 0.55, 0.15));
  vec3 near = col * (0.55 + 0.9 * min(pileL, 1.4));
  col = mix(pile * vShade, mix(near, col, smoothstep(14.0, 40.0, vPx)), smoothstep(3.0, 11.0, vPx));
  gl_FragColor = vec4(mix(col, own, fly * smoothstep(3.0, 11.0, vPx)), 1.0);
}`;

// a glint for a single sphere seen from far: a soft point a few pixels wide
const GLINT_VERT = /* glsl */ `
uniform float uRad, uViewH, uShow;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float px = 2.0 * uRad * projectionMatrix[1][1] * 0.5 * uViewH / max(-mv.z, 1e-3);
  vA = uShow * (1.0 - smoothstep(2.0, 5.0, px));
  gl_PointSize = (uViewH / 1080.0) * 14.0;
}`;
const GLINT_FRAG = /* glsl */ `
uniform vec3 uColor;
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5) * 2.0;
  float a = (exp(-d * d * 9.0) + 0.3 * exp(-d * d * 2.5)) * vA;
  if (a < 0.003) discard;
  gl_FragColor = vec4(uColor * a * 2.2, 1.0);
}`;
// the single sphere: a real sphere mesh in the same metal
const UNIT_VERT = /* glsl */ `
varying vec3 vNW; varying vec3 vPW;
void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vPW = wp.xyz; vNW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;
const UNIT_FRAG = /* glsl */ `
uniform vec3 uColor;
varying vec3 vNW; varying vec3 vPW;
${METAL}
void main() { gl_FragColor = vec4(metalHard(normalize(vNW), normalize(cameraPosition - vPW), uColor), 1.0); }`;

function buildLineup(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const colorOf = (c) => new Color(c === 'sel' ? P.sel : c === 'axis' ? P.axis : P.crowd);
  const rnd = mulberry32((o.seed ?? SEED) * 17 + 11);
  const unit = Number(o.unit ?? 0.1), s = Math.SQRT2 * unit, rad = 0.9 * unit;
  const balls = (o.balls || []).slice(0, MAXB).map((x) => {
    const n = Math.max(1, Math.round(x.n || 1)), grain = Math.max(1, x.grain || 1);
    return { ...x, n, pts: Math.max(1, Math.round(n / grain)), gs: Math.cbrt(grain) };
  });
  const NB = balls.length;
  // the budget: a pile past it is drawn with coarser spheres (the same volume)
  const cap = Math.min(ctx.budget ?? 300000, Number(o.grains ?? 1e9));
  let sum = balls.reduce((a, x) => a + (x.n > 1 ? x.pts : 0), 0);
  if (sum > cap) {
    const k = sum / cap;
    for (const x of balls) if (x.n > 1 && x.pts > 1000) { x.pts = Math.max(1, Math.round(x.pts / k)); x.gs = Math.cbrt(x.n / x.pts); }
    sum = balls.reduce((a, x) => a + (x.n > 1 ? x.pts : 0), 0);
  }
  const lat = fccShells(Math.max(1, ...balls.map((x) => x.pts)), rnd);
  const R = balls.map(({ pts, gs }) => { const j = (pts - 1) * 3; return (Math.hypot(lat[j], lat[j + 1], lat[j + 2]) * s + unit) * gs; });
  // `grow: { from: k }`: the pile grows out of pile k in place. It takes k's place (no slot
  // of its own in the side-by-side row), and its first spheres are k's spheres
  const growFrom = balls.map((x, b) => {
    const f = Math.round(Number(x.grow?.from ?? -1));
    return x.grow && f >= 0 && f < b && balls[f].n > 1 && x.n > 1 ? f : -1;
  });
  const slotOf = (b) => { let f = b; while (growFrom[f] >= 0) f = growFrom[f]; return f; };
  // the side-by-side row: only the piles that take a slot, each as wide as the widest pile
  // that grows in its place; `gaps` are the spaces between these neighbours, in order
  const row = balls.map((x, b) => b).filter((b) => growFrom[b] < 0);
  const wR = row.map((b) => Math.max(...balls.map((x, j) => (slotOf(j) === b ? R[j] : 0))));
  const gaps = o.gaps || [], A = Math.min(Math.max(0, row.indexOf(slotOf(Math.max(0, Math.min(NB - 1, o.anchor ?? 0))))), Math.max(0, row.length - 1)), rx = new Array(row.length).fill(0);
  for (let q = A + 1; q < row.length; q++) rx[q] = rx[q - 1] + wR[q - 1] + (gaps[q - 1] ?? 2) + wR[q];
  for (let q = A - 1; q >= 0; q--) rx[q] = rx[q + 1] - wR[q + 1] - (gaps[q] ?? 2) - wR[q];
  const rest = o.rest !== false;
  // a pile's place: side by side (no `at`); `at: [x, y, z]` exactly; `at: x` or `[x, z]` on
  // the floor; `at: { beside: k, side (1: right, -1: left), gap (1), z (0) }` on the floor
  // beside pile k (T1's day kept beside the day read out)
  const C = new Array(NB).fill(null);
  const floorY = (b, y) => (rest ? FLOOR_Y + R[b] : y);
  const place = (b, depth = 0) => {
    if (C[b]) return C[b];
    const x = balls[b], a = x.at;
    if (growFrom[b] >= 0 && a == null) { const c = place(growFrom[b], depth + 1); return (C[b] = [c[0], floorY(b, c[1]), c[2]]); }
    if (Array.isArray(a) && a.length >= 3) return (C[b] = a.slice(0, 3).map(Number));
    if (Array.isArray(a)) return (C[b] = [Number(a[0]) || 0, floorY(b, 0), Number(a[1]) || 0]);
    if (typeof a === 'number') return (C[b] = [a, floorY(b, 0), 0]);
    if (a && typeof a === 'object' && a.beside != null && depth < NB) {
      const k = Math.max(0, Math.min(NB - 1, Math.round(Number(a.beside)))), c = place(k, depth + 1);
      const side = a.side === 'left' || Number(a.side) < 0 ? -1 : 1, gap = Number(a.gap ?? 1);
      return (C[b] = [c[0] + side * (R[k] + gap + R[b]), floorY(b, c[1]), c[2] + Number(a.z ?? 0)]);
    }
    const q = row.indexOf(slotOf(b));
    return (C[b] = [rx[Math.max(0, q)], floorY(b, 0), 0]);
  };
  for (let b = 0; b < NB; b++) place(b);

  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const disposables = [];

  // a ball of one: the marble (a real sphere) and its glint from far
  const marbles = [];
  balls.forEach((x, b) => {
    if (x.n !== 1) return;
    const sg = new SphereGeometry(rad, 96, 64);
    const sm = new ShaderMaterial({ vertexShader: UNIT_VERT, fragmentShader: UNIT_FRAG, uniforms: { uColor: { value: colorOf(x.color) } } });
    const m = new Mesh(sg, sm);
    m.position.set(C[b][0], C[b][1], C[b][2]); m.scale.setScalar(1e-4); m.visible = false;
    const gu = { uRad: { value: rad }, uViewH: { value: 1080 }, uShow: { value: 0 }, uColor: { value: colorOf(x.color) } };
    const gg = new BufferGeometry(); gg.setAttribute('position', new BufferAttribute(new Float32Array(C[b]), 3));
    const gm = new ShaderMaterial({ vertexShader: GLINT_VERT, fragmentShader: GLINT_FRAG, uniforms: gu, transparent: true, depthWrite: false, blending: AdditiveBlending });
    const glint = new Points(gg, gm);
    glint.frustumCulled = false;
    const gvp = new Vector4();
    glint.onBeforeRender = (renderer) => { renderer.getCurrentViewport(gvp); gu.uViewH.value = gvp.w || 1080; };
    g.add(m); g.add(glint); marbles.push({ b, m, gu });
    disposables.push(sg, sm, gg, gm);
  });

  // the piles: one point per sphere, pile after pile
  const piles = balls.map((x, b) => b).filter((b) => balls[b].n > 1);
  const total = piles.reduce((acc, b) => acc + balls[b].pts, 0);
  const pos = new Float32Array(total * 3), seed = new Float32Array(total), rank = new Float32Array(total), which = new Float32Array(total), oldA = new Float32Array(total);
  const end = new Array(NB).fill(0), begin = new Array(NB).fill(0);
  const TILT = new Matrix4().makeRotationFromEuler(new Euler(0.37, 0.61, 0.23)), tv = new Vector3();
  let q = 0;
  const growK = new Array(NB).fill(0);
  for (const b of piles) {
    // a pile of thousands is jittered more, so its rows do not beat against the pixel grid
    const n = balls[b].pts, gs = balls[b].gs, jit = unit * gs * Math.min(0.24, 0.12 + 0.05 * Math.max(0, Math.log10(n / 800)));
    begin[b] = q;
    // a pile grown from pile f (the same sphere size): its first spheres are f's own, at f's
    // offsets from the centre, so they stand where f's stood while the new ones gather
    const f = growFrom[b], same = f >= 0 && Math.abs(balls[f].gs - gs) < 1e-6 && end[f] > begin[f];
    const nOld = same ? Math.min(n, end[f] - begin[f]) : 0;
    growK[b] = same ? nOld / n : 0;
    for (let j = 0; j < n; j++, q++) {
      if (j < nOld) {
        const p0 = begin[f] + j;
        for (let c = 0; c < 3; c++) pos[q * 3 + c] = C[b][c] + pos[p0 * 3 + c] - C[f][c];
        seed[q] = seed[p0]; oldA[q] = 1;
      } else {
        tv.set(lat[j * 3], lat[j * 3 + 1], lat[j * 3 + 2]).multiplyScalar(s * gs).applyMatrix4(TILT);
        pos[q * 3] = C[b][0] + tv.x + gauss(rnd) * jit;
        pos[q * 3 + 1] = C[b][1] + tv.y + gauss(rnd) * jit;
        pos[q * 3 + 2] = C[b][2] + tv.z + gauss(rnd) * jit;
        seed[q] = rnd();
      }
      rank[q] = j / n; which[q] = b;
    }
    end[b] = q;
  }
  const fromPos = new Float32Array(total * 3), fromDir = new Float32Array(total * 3);
  {
    let q0 = 0;
    for (const b of piles) {
      const m = balls[b].merge, n = balls[b].pts, gs = balls[b].gs;
      if (m && Array.isArray(m.copiesAt) && m.copiesAt.length) {
        const N = m.copiesAt.length;
        for (let j = 0; j < n; j++) {
          const k = j % N, i = Math.floor(j / N), cc = m.copiesAt[k];
          tv.set(lat[i * 3], lat[i * 3 + 1], lat[i * 3 + 2]).multiplyScalar(s * gs).applyMatrix4(TILT);
          const qq = q0 + j;
          fromPos[qq * 3] = cc[0] + tv.x; fromPos[qq * 3 + 1] = cc[1] + tv.y; fromPos[qq * 3 + 2] = cc[2] + tv.z;
          const l = tv.length() || 1;
          fromDir[qq * 3] = tv.x / l; fromDir[qq * 3 + 1] = tv.y / l; fromDir[qq * 3 + 2] = tv.z / l;
        }
      }
      q0 += n;
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setAttribute('aFrom', new BufferAttribute(fromPos, 3));
  geo.setAttribute('aFromDir', new BufferAttribute(fromDir, 3));
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1));
  geo.setAttribute('aK', new BufferAttribute(rank, 1));
  geo.setAttribute('aBall', new BufferAttribute(which, 1));
  geo.setAttribute('aOld', new BufferAttribute(oldA, 1));
  geo.setDrawRange(0, 0);
  const showT = new Array(MAXB).fill(-1), hideT = new Array(MAXB).fill(-1), growing = new Array(MAXB).fill(0);
  const pad = (arr, f) => Array.from({ length: MAXB }, (_, i) => (i < arr.length ? arr[i] : f()));
  const mat = new ShaderMaterial({
    vertexShader: LINEUP_VERT, fragmentShader: LINEUP_FRAG, depthTest: true, depthWrite: true,
    uniforms: {
      uTime: { value: 0 }, uGrow: { value: Number(o.grow ?? 3.2) }, uReach: { value: Number(o.reach ?? 3) }, uRad: { value: rad },
      uViewH: { value: 1080 }, uMaxPt: { value: 256 }, uShell: { value: 10 * unit },
      uShowT: { value: showT }, uHideT: { value: hideT },
      uR: { value: pad(R, () => 0) },
      uGs: { value: pad(balls.map((x) => x.gs), () => 1) },
      uCenter: { value: pad(C.map((c) => new Vector3(c[0], c[1], c[2])), () => new Vector3()) },
      uColor: { value: pad(balls.map((x) => colorOf(x.color)), () => new Color()) },
      uCome: { value: pad(balls.map((x) => (Array.isArray(x.from) ? new Vector3(Number(x.from[0]) || 0, Number(x.from[1]) || 0, Number(x.from[2]) || 0) : new Vector3())), () => new Vector3()) },
      uMerge: { value: pad(balls.map((x) => (x.merge ? 1 : 0)), () => 0) },
      uFromColor: { value: pad(balls.map((x) => colorOf(x.merge ? balls[x.merge.from]?.color : x.color)), () => new Color()) },
      uMergeAt: { value: Number(o.mergeAt ?? 2.4) },
      uGrowing: { value: growing },
      uGrowK: { value: pad(growK, () => 0) },
      uGrowOff: { value: pad(C.map((c, b) => (growFrom[b] >= 0 && growK[b] > 0 ? new Vector3(C[growFrom[b]][0] - c[0], C[growFrom[b]][1] - c[1], C[growFrom[b]][2] - c[2]) : new Vector3())), () => new Vector3()) },
      uLight: { value: new Vector3(-6, 9, 7).normalize() },
    },
  });
  const pts = new Points(geo, mat); pts.frustumCulled = false;
  const vp = new Vector4();
  let maxPt = 0;
  pts.onBeforeRender = (renderer) => {
    renderer.getCurrentViewport(vp); mat.uniforms.uViewH.value = vp.w || 1080;
    if (!maxPt) { const gl = renderer.getContext(); const r = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE); maxPt = (r && r[1]) || 64; mat.uniforms.uMaxPt.value = maxPt; }
  };
  g.add(pts);
  disposables.push(geo, mat);

  // labels: numbers with units, at a fixed size, hung above each pile once it stands
  const labels = [];
  balls.forEach((x, b) => {
    if (!x.label) return;
    const l = kit.label.make(String(x.label), { px: LABEL.px, color: P.tick, align: 'center', hang: -1.1 });
    l.position.set(C[b][0], C[b][1] + (x.n === 1 ? rad : R[b]), C[b][2]);
    l.userData.show = 0; l.userData.ball = b;
    g.add(l); labels.push(l);
  });

  const name = String(o.name);
  const st = stage.stepper(name);
  let now = 0, step = 0;
  let armed = false, armedAt = 0;
  let doneAt = -1, doneCbs = [];
  const GROW = () => mat.uniforms.uGrow.value + 1.6;
  const shown = (b) => showT[b] >= 0 && hideT[b] < 0;
  const show = (b, t) => { showT[b] = t + Math.max(0, Number(balls[b]?.wait ?? 0)); hideT[b] = -1; growing[b] = 0; };
  const hide = (b, t) => { if (shown(b)) hideT[b] = t; };
  // a numbered step can name its piles (`sets: { "5": [2, 4] }`): a slide's frontmatter
  // `steps:` carries numbers only, so an array step works only from <StageSteps>
  const sets = o.sets && typeof o.sets === 'object' ? o.sets : {};
  const wants = (b) => { const sel = Array.isArray(step) ? step : sets[step]; return Array.isArray(sel) ? sel.map(Number).includes(b) : b < step; };
  // a grown pile handing back to the pile it grew from (a step back): b → f, at b's hide end
  const handBack = new Array(MAXB).fill(-1);
  const go = (k) => {
    step = k;
    if (armed) return;
    // a pile that grows out of f in place, when f stands now and goes on this step: f's
    // spheres become its first spheres in the same frame, so nothing flies apart
    const hand = balls.map((x, b) => { const f = growFrom[b]; return f >= 0 && growK[b] > 0 && wants(b) && !shown(b) && shown(f) && !wants(f); });
    for (let b = 0; b < NB; b++) {
      if (wants(b) || !shown(b)) continue;
      if (hand.some((h, j) => h && growFrom[j] === b)) continue;     // handed over below, not flown apart
      hide(b, now);
      // a grown pile going back: its earlier spheres glide back onto f's place, and f stands there when they land
      const f = growFrom[b];
      handBack[b] = growing[b] && f >= 0 && wants(f) && !shown(f) ? f : -1;
    }
    for (let b = 0; b < NB; b++) {
      if (!wants(b) || shown(b) || handBack.includes(b)) continue;
      show(b, now);
      if (hand[b]) { const f = growFrom[b]; growing[b] = 1; showT[b] = now; showT[f] = -1; hideT[f] = -1; }
    }
  };
  const settles = () => Math.max(GROW(), mat.uniforms.uMergeAt.value + 2.8);
  let labelsMoving = false;
  const busy = () => armed || labelsMoving || doneCbs.length > 0
    || showT.some((s0, b) => s0 >= 0 && (hideT[b] >= 0 || now - s0 < settles()));
  const value = () => balls.reduce((a, x, b) => (shown(b) ? a + x.n : a), 0);
  const api = o.assemble === false ? { busy, value } : {
    busy, value,
    // a flight toward the station: what stands flies apart, and stays out until the arrival
    arm() { armed = true; armedAt = now; for (let b = 0; b < NB; b++) hide(b, now); },
    // the arrival (and `c`): every pile up to the step gathers again
    assemble(t, onDone) {
      now = t; armed = false;
      for (let b = 0; b < NB; b++) { if (wants(b)) { if (!shown(b)) show(b, t); } else hide(b, t); }
      if (onDone) doneCbs.push(onDone);
      doneAt = t + GROW();
    },
  };
  kit.register(name, { type: TYPE, api });
  return {
    group: g, labels, api,
    update(t) {
      const dt = Math.min(Math.max(t - now, 0), 0.1);
      now = t; mat.uniforms.uTime.value = t;
      if (st.fresh) { st.fresh = false; go(st.step ?? 0); }
      if (armed && t - armedAt > Number(o.armWait ?? 6)) { armed = false; for (let b = 0; b < NB; b++) if (wants(b)) show(b, t); }
      if (doneCbs.length && t >= doneAt) { const cbs = doneCbs; doneCbs = []; for (const cb of cbs) cb(); }
      let count = 0;
      for (let b = 0; b < NB; b++) {
        if (hideT[b] >= 0 && t - hideT[b] > 1.2) {
          showT[b] = -1; hideT[b] = -1; growing[b] = 0;
          const f = handBack[b];
          handBack[b] = -1;
          // standing at once: a show time far enough back that every sphere has gathered (never below 0: a negative time means hidden)
          if (f >= 0 && wants(f) && !shown(f)) { showT[f] = Math.max(0, t - GROW() - 1); hideT[f] = -1; }
        }
        if (showT[b] >= 0) count = Math.max(count, end[b]);
      }
      geo.setDrawRange(0, count);
      for (const { b, m, gu } of marbles) {
        const k = showT[b] < 0 ? 0 : hideT[b] >= 0 ? 1 - Math.min(1, (t - hideT[b]) / 0.6) : Math.min(1, Math.max(0, (t - showT[b]) / 0.9));
        const e = k * k * (3 - 2 * k);
        m.scale.setScalar(Math.max(e, 1e-4)); m.visible = e > 0.001;
        gu.uShow.value = e;
      }
      labelsMoving = false;
      for (const l of labels) {
        const b = l.userData.ball;
        const want = shown(b) && t - showT[b] > 1.2 ? 1 : 0;
        const v = l.userData.show + Math.sign(want - l.userData.show) * Math.min(Math.abs(want - l.userData.show), dt / 0.8);
        l.userData.show = v;
        if (l.userData.show !== want) labelsMoving = true;
      }
      kit.label.shade(labels, 1);
    },
    dispose() { st.off(); kit.unregister(name); for (const d of disposables) d.dispose(); },
  };
}
