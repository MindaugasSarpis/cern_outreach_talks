import {
  Group, Points, LineSegments, BufferGeometry, BufferAttribute,
  ShaderMaterial, AdditiveBlending, Vector3,
} from 'three';
import { CORE_CENTER, CORE_RADIUS } from './world.js';

// Collision events for the cover's "proton being probed" twist. Ported from
// the lessons landing (landing/src/collisions.js), where events flash out in
// the ambient field; here every event erupts from INSIDE the core sphere — a
// vertex flashes near the centre and a spray of curved tracks (charged tracks
// bending as if in a solenoid field) races outward through the shell, then
// fades. Tracks are long enough to clear CORE_RADIUS so they visibly pierce
// the sphere. Events are no longer self-timed: sim.js calls spawnAt() when a
// beam pulse arrives along a fiber, so beam → arrival → eruption reads as one
// sequence. EVENTS pooled slots share one LineSegments draw call; each spawn
// re-rolls that slot's track directions/curvatures and re-uploads its range.
//
// Vertex layout: position.x = t along the track (0→1), position.y = event
// slot index (indexes the uOrigin/uStart uniform arrays — dynamic uniform
// indexing is legal in vertex shaders).

const EVENTS = 3;

const TRACK_VERT = /* glsl */ `
uniform vec3 uOrigin[${EVENTS}];
uniform float uStart[${EVENTS}];
attribute vec3 aDir, aBend;
attribute float aLen, aSeedT;
varying float vT, vStart, vSeed;
void main() {
  int ei = int(position.y + 0.5);
  float s = position.x * aLen;
  vec3 p = uOrigin[ei] + aDir * s + aBend * (s * s);
  vT = position.x; vStart = uStart[ei]; vSeed = aSeedT;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`;

const TRACK_FRAG = /* glsl */ `
uniform float uTime;
varying float vT, vStart, vSeed;
void main() {
  float age = uTime - vStart;
  if (age < 0.0 || age > 3.0) discard;
  // tracks race outward (~0.7s) behind a bright head, then the event fades
  float grow = clamp(age * 1.4, 0.0, 1.0);
  float draw = 1.0 - smoothstep(grow - 0.05, grow, vT);
  float head = exp(-((vT - grow) * (vT - grow)) / 0.002) * step(age * 1.4, 1.2);
  float fade = exp(-max(age - 0.7, 0.0) * 1.1);
  float tail = mix(1.0, 0.35, vT) * mix(0.7, 1.0, vSeed);
  float b = (1.0 * tail + head * 1.6) * draw * fade;
  vec3 col = mix(vec3(0.38, 0.62, 0.80), vec3(1.0), clamp(head + 0.15, 0.0, 1.0));
  gl_FragColor = vec4(col * b, b);
}`;

const FLASH_VERT = /* glsl */ `
uniform float uTime, uPixelRatio;
uniform vec3 uOrigin[${EVENTS}];
uniform float uStart[${EVENTS}];
varying float vA;
void main() {
  int ei = int(position.x + 0.5);
  float age = uTime - uStart[ei];
  vec4 mv = modelViewMatrix * vec4(uOrigin[ei], 1.0);
  gl_Position = projectionMatrix * mv;
  float flare = step(0.0, age) * exp(-age * 2.4);
  gl_PointSize = uPixelRatio * (170.0 * flare + 1.0) / max(-mv.z, 0.1);
  vA = flare * 2.2;
}`;

const FLASH_FRAG = /* glsl */ `
varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.04, d) * vA;
  vec3 col = mix(vec3(0.55, 0.78, 0.92), vec3(1.0), clamp(vA, 0.0, 1.0));
  gl_FragColor = vec4(col * a, a);
}`;

export function addCollisions(scene, { coarse } = {}) {
  const TRACKS = coarse ? 9 : 14;
  const SEGS = 22;
  const VPT = SEGS * 2;                    // verts per track (line segments)
  const VPE = TRACKS * VPT;                // verts per event slot
  const V = EVENTS * VPE;

  // Static: t + slot index packed into position. Dynamic: dir/bend/len/seed,
  // re-rolled per spawn for the spawning slot only.
  const pos = new Float32Array(V * 3);
  const dir = new Float32Array(V * 3).fill(1);
  const bend = new Float32Array(V * 3);
  const len = new Float32Array(V).fill(1);
  const seedT = new Float32Array(V);
  for (let e = 0; e < EVENTS; e++) {
    for (let k = 0; k < TRACKS; k++) {
      for (let s = 0; s < SEGS; s++) {
        const v = e * VPE + k * VPT + s * 2;
        pos[v * 3] = s / SEGS; pos[v * 3 + 1] = e;
        pos[v * 3 + 3] = (s + 1) / SEGS; pos[v * 3 + 4] = e;
      }
    }
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  const dirAttr = new BufferAttribute(dir, 3);
  const bendAttr = new BufferAttribute(bend, 3);
  const lenAttr = new BufferAttribute(len, 1);
  const seedAttr = new BufferAttribute(seedT, 1);
  geo.setAttribute('aDir', dirAttr);
  geo.setAttribute('aBend', bendAttr);
  geo.setAttribute('aLen', lenAttr);
  geo.setAttribute('aSeedT', seedAttr);

  const origins = Array.from({ length: EVENTS }, () => new Vector3(999, 999, 999));
  const startTimes = new Array(EVENTS).fill(-1e3);
  const trackMat = new ShaderMaterial({
    vertexShader: TRACK_VERT, fragmentShader: TRACK_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uOrigin: { value: origins }, uStart: { value: startTimes } },
  });
  const lines = new LineSegments(geo, trackMat);
  lines.frustumCulled = false;

  const fPos = new Float32Array(EVENTS * 3);
  for (let e = 0; e < EVENTS; e++) fPos[e * 3] = e;
  const fGeo = new BufferGeometry();
  fGeo.setAttribute('position', new BufferAttribute(fPos, 3));
  const flashMat = new ShaderMaterial({
    vertexShader: FLASH_VERT, fragmentShader: FLASH_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 }, uOrigin: { value: origins }, uStart: { value: startTimes },
      uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) },
    },
  });
  const flashes = new Points(fGeo, flashMat);
  flashes.frustumCulled = false;

  const group = new Group();
  group.add(lines, flashes);
  scene.add(group);

  const tmpA = new Vector3(), tmpB = new Vector3();

  let slot = 0;

  // origin: world point the event erupts from. Callers pass a point inside
  // the core (sim.js: a small random offset from CORE_CENTER).
  const spawn = (elapsed, origin) => {
    const e = slot;
    slot = (slot + 1) % EVENTS;
    origins[e].copy(origin);
    startTimes[e] = elapsed;
    for (let k = 0; k < TRACKS; k++) {
      const u = Math.random() * 2 - 1;
      const ph = Math.random() * Math.PI * 2;
      const rxy = Math.sqrt(Math.max(1 - u * u, 0));
      tmpA.set(Math.cos(ph) * rxy, u, Math.sin(ph) * rxy);          // track direction
      tmpB.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
        .cross(tmpA);
      if (tmpB.lengthSq() < 1e-6) tmpB.set(0, 1, 0);
      const L = CORE_RADIUS * 1.9 + Math.random() * CORE_RADIUS * 1.8; // clears the shell
      tmpB.normalize().multiplyScalar((Math.random() * 0.6) / L); // curvature ⟂ dir
      const seed = Math.random();
      for (let v = e * VPE + k * VPT, end = v + VPT; v < end; v++) {
        tmpA.toArray(dir, v * 3);
        tmpB.toArray(bend, v * 3);
        len[v] = L;
        seedT[v] = seed;
      }
    }
    dirAttr.needsUpdate = true;
    bendAttr.needsUpdate = true;
    lenAttr.needsUpdate = true;
    seedAttr.needsUpdate = true;
  };

  return {
    update(elapsed) {
      trackMat.uniforms.uTime.value = elapsed;
      flashMat.uniforms.uTime.value = elapsed;
    },
    // Erupt now from `origin` (world). Returns the stored origin so the caller
    // can kick the particle field there.
    spawnAt(elapsed, origin) {
      spawn(elapsed, origin);
      return origins[(slot + EVENTS - 1) % EVENTS];
    },
    setPixelRatio(dpr) { flashMat.uniforms.uPixelRatio.value = dpr; },
  };
}
