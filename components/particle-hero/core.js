import {
  Group, Points, BufferGeometry, BufferAttribute,
  ShaderMaterial, AdditiveBlending, Vector3,
} from 'three';
import { CORE_CENTER, CORE_RADIUS } from './world.js';
import { NOISE } from './shaders/noise.glsl.js';

// The hero's "core": a dense twinkling cloud of points that assembles out of
// the surrounding dust and then lives as one of three VARIANTS (the deck's
// act cards pick one each):
//
//   sphere  — the landing's particle sphere (fibonacci shell + a scattered
//             interior), self-rotating on two axes, "breathing" via radial
//             simplex noise. The "proton being probed".
//   galaxy  — a two-armed spiral disc with a central bulge, tilted toward the
//             camera and slowly spinning about its own axis.
//   ring    — a collider: a thin torus of points, held still, with two bright
//             BUNCHES racing around it in opposite directions (shader-driven
//             from each point's ring angle) so they cross twice a lap.
//
// Assembly intro: each particle starts as a dim speck at aStart (scattered
// through the surrounding volume), launches after aDelay, arcs to its seat
// over aDur (perpendicular aSwirl bends the path), and pops white on
// landing. Delay + duration spreads put the last landing at ~FORM_END
// (world.js). The intro is variant-agnostic — a galaxy condensing out of
// dust reads exactly right.
//
// flashAt(node) starts a ripple: particles near the hit point flare with a
// distance-proportional delay, so fiber-burst arrivals (sphere) and bunch
// crossings (ring) visibly splash across the structure.

const NODE_VERT = /* glsl */ `
uniform float uTime, uPixelRatio, uBunch, uOmega, uPhase, uGain;
attribute float aSeed, aFlash, aDelay, aDur, aAngle;
attribute vec3 aStart, aSwirl;
varying float vAlpha;
${NOISE}
float angd(float a, float b) { return mod(a - b + 3.14159265, 6.2831853) - 3.14159265; }
void main() {
  // gather: launch after aDelay, fly for aDur along an arc — the straight
  // start→seat path plus a perpendicular swirl strongest mid-flight, so the
  // structure condenses out of the surrounding dust instead of beaming in
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
  // collider bunches: two packets at +ωt and −ωt around the ring; they meet
  // at angle 0 and π every π/ω seconds (sim.js fires the eruptions there)
  float dA = angd(aAngle, uTime * uOmega + uPhase);
  float dB = angd(aAngle, -uTime * uOmega + uPhase);
  float bunch = uBunch * e * (exp(-dA * dA / 0.012) + exp(-dB * dB / 0.012));
  float size = mix(34.0, 54.0, fract(aSeed * 5.71)) * uGain;
  gl_PointSize = uPixelRatio * (size * mix(0.5, 1.0, e) + flash * 30.0 + land * 22.0 + bunch * 46.0) / max(-mv.z, 0.1);
  vAlpha = (0.65 + 0.35 * tw) * (0.85 * uGain + flash * 2.4 + land * 1.6 + bunch * 3.0) * mix(0.4, 1.0, e);
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

export const RING_RADIUS = CORE_RADIUS * 1.6;    // collider major radius (local units)
export const RING_OMEGA = 1.6;                   // rad/s, bunch angular speed
// Bunches sit at ±ωt + PHASE, so they meet at ring angle PHASE and PHASE+π:
// with the ring's tilt those are the top and bottom of the ellipse on screen,
// clear of the title on the left.
export const RING_IP_PHASE = Math.PI / 2;
const GALAXY_RADIUS = CORE_RADIUS * 1.9;

// Seats for N particles in the variant's shape, plus each seat's angle around
// the vertical axis (the ring shader needs it; harmless elsewhere).
function layout(variant, N, rand) {
  const nodes = [];
  const angles = new Float32Array(N);
  if (variant === 'galaxy') {
    const R = GALAXY_RADIUS, ARMS = 2, WIND = 3.1;
    for (let i = 0; i < N; i++) {
      if (rand() < 0.16) {
        // central bulge: a squashed ball
        const br = R * 0.2 * Math.cbrt(rand());
        const v = rand() * 2 - 1, ph = rand() * Math.PI * 2;
        const rxy = Math.sqrt(Math.max(1 - v * v, 0));
        nodes.push(new Vector3(Math.cos(ph) * rxy * br, v * br * 0.6, Math.sin(ph) * rxy * br));
        angles[i] = ph;
        continue;
      }
      const r = R * (0.12 + 0.88 * Math.sqrt(rand()));
      const arm = (i % ARMS) * (2 * Math.PI / ARMS);
      // log-spiral arm; a squared spread keeps most particles near the arm
      // while a few stragglers fill the inter-arm space
      const s = rand() * 2 - 1;
      const th = arm + WIND * Math.log(r / (R * 0.12)) + s * Math.abs(s) * 0.75;
      const y = (rand() - 0.5) * 0.36 * R * Math.exp(-2.2 * r / R);
      nodes.push(new Vector3(Math.cos(th) * r, y, Math.sin(th) * r));
      angles[i] = th;
    }
  } else if (variant === 'ring') {
    const TUBE = 0.14;
    for (let i = 0; i < N; i++) {
      const th = rand() * Math.PI * 2;
      const ph = rand() * Math.PI * 2;
      const tr = TUBE * Math.sqrt(rand());
      const rr = RING_RADIUS + tr * Math.cos(ph);
      nodes.push(new Vector3(Math.cos(th) * rr, tr * Math.sin(ph), Math.sin(th) * rr));
      angles[i] = th;
    }
  } else {
    // Shell: fibonacci sphere + mild radial noise so it reads organic, not
    // gridded. ~18% of particles drop inward for a sense of volume.
    for (let i = 0; i < N; i++) {
      const t = (i + 0.5) / N;
      const y = 1 - 2 * t;
      const rxy = Math.sqrt(Math.max(1 - y * y, 0));
      const phi = i * 2.399963229728653; // golden angle
      let r = CORE_RADIUS * (1 + (rand() - 0.5) * 0.14);
      if (rand() < 0.18) r *= 0.4 + 0.55 * rand();
      nodes.push(new Vector3(Math.cos(phi) * rxy * r, y * r, Math.sin(phi) * rxy * r));
      angles[i] = phi;
    }
  }
  return { nodes, angles };
}

export function addCore(scene, { coarse, variant = 'sphere' } = {}) {
  const N = coarse ? 900 : 2200;
  const rand = mulberry32(20260706);
  const { nodes, angles } = layout(variant, N, rand);

  // Assembly: starts scattered uniformly through the surrounding VOLUME
  // (cbrt → volume-uniform, radius 1.5–9× the core), so the shape condenses
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
  nGeo.setAttribute('aAngle', new BufferAttribute(angles, 1));
  const nFlashAttr = new BufferAttribute(nFlash, 1);
  nGeo.setAttribute('aFlash', nFlashAttr);
  const nMat = new ShaderMaterial({
    vertexShader: NODE_VERT, fragmentShader: NODE_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) },
      uBunch: { value: variant === 'ring' ? 1 : 0 }, uOmega: { value: RING_OMEGA }, uPhase: { value: RING_IP_PHASE },
      uGain: { value: variant === 'galaxy' ? 1.45 : 1.0 },   // the disc is sparser per pixel than the shell
    },
  });
  const pts = new Points(nGeo, nMat);
  pts.frustumCulled = false;

  const group = new Group();
  group.add(pts);
  group.position.copy(CORE_CENTER);
  scene.add(group);

  const RIPPLE_R = variant === 'sphere' ? CORE_RADIUS * 1.1 : CORE_RADIUS * 1.4;
  const RIPPLE_SPEED = 0.35;          // seconds per world unit of spread

  let lastElapsed = 0;
  const tmp = new Vector3();
  return {
    variant,
    update(elapsed) {
      lastElapsed = elapsed;
      if (variant === 'galaxy') {
        // spin about the disc's own axis (Y, applied first in XYZ order),
        // then tilt toward the camera so the disc reads as an oblique spiral
        group.rotation.set(1.02, elapsed * 0.05, 0.28);
      } else if (variant === 'ring') {
        // held still so the interaction points stay put; only the bunches move
        group.rotation.set(1.12, 0.0, 0.22);
      } else {
        group.rotation.y = elapsed * 0.06;      // two axes, different periods
        group.rotation.x = elapsed * 0.017;
      }
      group.updateMatrixWorld();
      nMat.uniforms.uTime.value = elapsed;
    },
    // Splash a ripple of flashes outward from a particle.
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
    // Particle closest to a LOCAL point (ring interaction points, galaxy centre).
    nearestNode(local) {
      let best = 0, bd = Infinity;
      nodes.forEach((p, i) => {
        const d = p.distanceToSquared(local);
        if (d < bd) { bd = d; best = i; }
      });
      return best;
    },
    // Current world position of a particle (rotation applied; breathing
    // ignored — it is a ±5% shader effect, small next to the fiber end fade).
    nodeWorld(idx, out) {
      return out.copy(nodes[idx]).applyMatrix4(group.matrixWorld);
    },
    // LOCAL point → world (rotation + centre applied).
    localToWorld(local, out) {
      return out.copy(local).applyMatrix4(group.matrixWorld);
    },
    setPixelRatio(dpr) { nMat.uniforms.uPixelRatio.value = dpr; },
  };
}
