import {
  Group, Points, BufferGeometry, BufferAttribute,
  ShaderMaterial, AdditiveBlending, Vector3,
} from 'three';
import { CORE_CENTER, CORE_RADIUS } from './world.js';
import { NOISE } from './shaders/noise.glsl.js';

// Particle-sphere core: a dense twinkling shell of points on a fibonacci
// sphere (a fraction scattered inside for volume), self-rotating on two axes
// with different periods and "breathing" via radial simplex noise. Additive
// blending makes the silhouette naturally brighter, so it reads as a sphere
// without any connecting geometry.
//
// Assembly intro: each particle starts as a dim speck at aStart (scattered
// through the surrounding volume), launches after aDelay, arcs to its seat
// over aDur (perpendicular aSwirl bends the path), and pops white on
// landing. Delay + duration spreads put the last landing at ~FORM_END
// (world.js).
//
// flashAt(node) starts a ripple: particles near the hit point flare with a
// distance-proportional delay, so fiber-burst arrivals visibly splash across
// the sphere surface (aFlash holds each particle's flash time; step() gates
// scheduled-in-the-future flashes).

const NODE_VERT = /* glsl */ `
uniform float uTime, uPixelRatio;
attribute float aSeed, aFlash, aDelay, aDur;
attribute vec3 aStart, aSwirl;
varying float vAlpha;
${NOISE}
void main() {
  // gather: launch after aDelay, fly for aDur along an arc — the straight
  // start→seat path plus a perpendicular swirl strongest mid-flight, so the
  // sphere condenses out of the surrounding dust instead of beaming in
  float f = clamp((uTime - aDelay) / aDur, 0.0, 1.0);
  float e = f * f * (3.0 - 2.0 * f);
  vec3 p = mix(aStart, position, e) + aSwirl * sin(e * 3.14159265);
  p *= 1.0 + snoise(normalize(position) * 1.6 + vec3(0.0, uTime * 0.13, 0.0)) * 0.05 * e;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.75 + 0.25 * sin(uTime * (0.6 + aSeed * 1.7) + aSeed * 40.0);
  float flash = step(aFlash, uTime) * exp(-(uTime - aFlash) * 2.2);
  float sinceLand = uTime - (aDelay + aDur);
  float land = step(0.0, sinceLand) * exp(-sinceLand * 3.0);
  float size = mix(34.0, 54.0, fract(aSeed * 5.71));
  gl_PointSize = uPixelRatio * (size * mix(0.5, 1.0, e) + flash * 30.0 + land * 22.0) / max(-mv.z, 0.1);
  vAlpha = (0.65 + 0.35 * tw) * (0.85 + flash * 2.4 + land * 1.6) * mix(0.4, 1.0, e);
}`;

const NODE_FRAG = /* glsl */ `
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.08, d) * vAlpha;
  vec3 col = mix(vec3(0.45, 0.72, 0.88), vec3(1.0), smoothstep(0.6, 1.6, vAlpha));
  gl_FragColor = vec4(col * a, a);
}`;

const mulberry32 = (a) => () => {
  a |= 0; a = (a + 0x6D2B79F5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export function addCore(scene, { coarse } = {}) {
  const N = coarse ? 900 : 2200;
  const rand = mulberry32(20260706);

  // Shell: fibonacci sphere + mild radial noise so it reads organic, not
  // gridded. ~18% of particles drop inward for a sense of volume.
  const nodes = [];
  for (let i = 0; i < N; i++) {
    const t = (i + 0.5) / N;
    const y = 1 - 2 * t;
    const rxy = Math.sqrt(Math.max(1 - y * y, 0));
    const phi = i * 2.399963229728653; // golden angle
    let r = CORE_RADIUS * (1 + (rand() - 0.5) * 0.14);
    if (rand() < 0.18) r *= 0.4 + 0.55 * rand();
    nodes.push(new Vector3(Math.cos(phi) * rxy * r, y * r, Math.sin(phi) * rxy * r));
  }

  // Assembly: starts scattered uniformly through the surrounding VOLUME
  // (cbrt → volume-uniform, radius 1.5–9× the core), so the sphere condenses
  // out of ambient dust rather than a neat incoming shell. Each particle has
  // its own launch delay and flight duration, plus a perpendicular swirl
  // vector that arcs its path (applied as sin(πe) in the shader — zero at
  // both ends). Last landing ≈ max delay + max dur ≈ FORM_END (world.js).
  const starts = [];
  const delays = new Float32Array(N);
  const durs = new Float32Array(N);
  const swirls = [];
  const tmpDir = new Vector3();
  for (let i = 0; i < N; i++) {
    const u = rand() * 2 - 1;
    const ph = rand() * Math.PI * 2;
    const rxy = Math.sqrt(Math.max(1 - u * u, 0));
    const sr = CORE_RADIUS * (1.5 + 7.5 * Math.cbrt(rand()));
    starts.push(new Vector3(Math.cos(ph) * rxy * sr, u * sr, Math.sin(ph) * rxy * sr));
    delays[i] = 0.2 + rand() * 1.7;
    durs[i] = 1.3 + rand() * 1.1;
    // swirl ⟂ to the flight direction, scaled to the flight length
    tmpDir.copy(nodes[i]).sub(starts[i]);
    const s = new Vector3(rand() * 2 - 1, rand() * 2 - 1, rand() * 2 - 1).cross(tmpDir);
    if (s.lengthSq() < 1e-6) s.set(0, 1, 0);
    s.normalize().multiplyScalar(tmpDir.length() * (0.12 + rand() * 0.3) * (rand() < 0.5 ? -1 : 1));
    swirls.push(s);
  }

  const nPos = new Float32Array(N * 3);
  const nStart = new Float32Array(N * 3);
  const nSwirl = new Float32Array(N * 3);
  const nSeed = new Float32Array(N);
  const nFlash = new Float32Array(N).fill(-1e3);
  nodes.forEach((p, i) => {
    p.toArray(nPos, i * 3);
    starts[i].toArray(nStart, i * 3);
    swirls[i].toArray(nSwirl, i * 3);
    nSeed[i] = rand();
  });
  const nGeo = new BufferGeometry();
  nGeo.setAttribute('position', new BufferAttribute(nPos, 3));
  nGeo.setAttribute('aStart', new BufferAttribute(nStart, 3));
  nGeo.setAttribute('aSwirl', new BufferAttribute(nSwirl, 3));
  nGeo.setAttribute('aDelay', new BufferAttribute(delays, 1));
  nGeo.setAttribute('aDur', new BufferAttribute(durs, 1));
  nGeo.setAttribute('aSeed', new BufferAttribute(nSeed, 1));
  const nFlashAttr = new BufferAttribute(nFlash, 1);
  nGeo.setAttribute('aFlash', nFlashAttr);
  const nMat = new ShaderMaterial({
    vertexShader: NODE_VERT, fragmentShader: NODE_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) } },
  });
  const pts = new Points(nGeo, nMat);
  pts.frustumCulled = false;

  const group = new Group();
  group.add(pts);
  group.position.copy(CORE_CENTER);
  scene.add(group);

  const RIPPLE_R = CORE_RADIUS * 1.1; // ripple reach across the surface
  const RIPPLE_SPEED = 0.35;          // seconds per world unit of spread

  let lastElapsed = 0;
  const tmp = new Vector3();
  return {
    update(elapsed) {
      lastElapsed = elapsed;
      group.rotation.y = elapsed * 0.06;      // two axes, different periods
      group.rotation.x = elapsed * 0.017;
      group.updateMatrixWorld();
      nMat.uniforms.uTime.value = elapsed;
    },
    // Splash a ripple of flashes outward from a particle (fiber arrivals).
    flashAt(idx) {
      const c = nodes[idx];
      for (let i = 0; i < N; i++) {
        const d = c.distanceTo(nodes[i]);
        if (d < RIPPLE_R) nFlash[i] = Math.max(nFlash[i], lastElapsed + d * RIPPLE_SPEED);
      }
      nFlashAttr.needsUpdate = true;
    },
    // Particle whose (local) direction best matches dir — fiber anchor
    // picking. Radius-weighted so interior particles never win (a fiber
    // anchored inside the shell would visibly pierce it).
    anchorNode(dir) {
      let best = 0, bd = -Infinity;
      nodes.forEach((p, i) => {
        const d = tmp.copy(p).normalize().dot(dir) * Math.min(p.length() / CORE_RADIUS, 1);
        if (d > bd) { bd = d; best = i; }
      });
      return best;
    },
    // Current world position of a particle (rotation applied; breathing
    // ignored — it is a ±5% shader effect, small next to the fiber end fade).
    nodeWorld(idx, out) {
      return out.copy(nodes[idx]).applyMatrix4(group.matrixWorld);
    },
    setPixelRatio(dpr) { nMat.uniforms.uPixelRatio.value = dpr; },
  };
}
