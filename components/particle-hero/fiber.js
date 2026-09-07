import {
  Group, Mesh, BufferGeometry, BufferAttribute, ShaderMaterial,
  AdditiveBlending, Vector3,
} from 'three';
import { NOISE } from './shaders/noise.glsl.js';
import { FORM_END } from './world.js';

// Three glowing "data-link fiber" ribbons in 3D. Each spans a fixed far-world
// point uA to a core node uB (updated per frame as the core rotates), so the
// fibers visibly feed the core. The ribbon offsets perpendicular to both the
// curve tangent and the view ray (view-space billboard), so it never turns
// edge-on while the camera orbits. Pulses travel t:0→1, i.e. toward the core.
// uIntro fades the fibers in around FORM_END — before that the core nodes are
// still flying to their seats, so a fiber would visibly anchor to empty space.

const VERT = /* glsl */ `
uniform vec3 uA, uB;
uniform float uTime, uAmp, uFreq, uSeed, uWidth;
varying float vT, vSide;
varying vec3 vWorld;
${NOISE}
vec3 curve(float t) {
  vec3 p = mix(uA, uB, t);
  // envelope pins both ends (hard at the core end so it lands on the node)
  float env = smoothstep(0.0, 0.2, t) * smoothstep(1.0, 0.85, t);
  p.y += snoise(vec3(t * uFreq, uTime * 0.12, uSeed)) * uAmp * env;
  p.x += snoise(vec3(t * uFreq * 0.7, uTime * 0.09, uSeed + 31.7)) * uAmp * 0.35 * env;
  p.z += snoise(vec3(t * uFreq * 0.55, uTime * 0.10, uSeed + 77.3)) * uAmp * 0.6 * env;
  return p;
}
void main() {
  float t = position.x;
  float side = position.y;
  vec3 p = curve(t);
  vWorld = p;
  vec4 mvP = modelViewMatrix * vec4(p, 1.0);
  vec3 tanV = normalize((modelViewMatrix * vec4(curve(min(t + 0.004, 1.0)), 1.0)).xyz
                      - (modelViewMatrix * vec4(curve(max(t - 0.004, 0.0)), 1.0)).xyz);
  vec3 viewDir = normalize(mvP.xyz);
  vec3 offV = cross(tanV, viewDir);
  float ol = length(offV);
  offV = ol < 1e-3 ? vec3(0.0, 1.0, 0.0) : offV / ol; // head-on fallback
  vT = t;
  vSide = side;
  gl_Position = projectionMatrix * vec4(mvP.xyz + offV * side * uWidth, 1.0);
}`;

const FRAG = /* glsl */ `
uniform float uTime, uPulseSpeed, uPhase, uBaseAlpha, uBurstStart, uIntro;
uniform vec3 uPointer;
varying float vT, vSide;
varying vec3 vWorld;
void main() {
  float core = exp(-vSide * vSide * 9.0);
  float glow = exp(-vSide * vSide * 2.0) * 0.35;
  float p = fract(uTime * uPulseSpeed + uPhase);
  float d = abs(vT - p);
  d = min(d, 1.0 - d);
  float pulse = exp(-(d * d) / 0.0009);
  // hover burst: one-shot pulse from the far end toward the core
  float bp = (uTime - uBurstStart) * 0.55;
  if (bp >= 0.0 && bp <= 1.15) {
    float bd = vT - bp;
    pulse += exp(-(bd * bd) / 0.0011) * 1.3;
  }
  vec3 toP = vWorld - uPointer;
  float near = exp(-dot(toP, toP) / 6.0) * 0.6;
  float ends = smoothstep(0.0, 0.06, vT) * smoothstep(1.0, 0.985, vT);
  float b = (uBaseAlpha + near) * (core + glow) * ends * (1.0 + pulse * 2.6) * uIntro;
  vec3 col = mix(vec3(0.35, 0.62, 0.78), vec3(1.0), clamp(pulse * 0.8 + near * 0.3, 0.0, 1.0));
  gl_FragColor = vec4(col * b, b);
}`;

export function addFibers(scene) {
  const S = 240;
  const pos = new Float32Array((S + 1) * 2 * 3);
  for (let i = 0; i <= S; i++) {
    const t = i / S;
    pos[i * 6 + 0] = t; pos[i * 6 + 1] = 1;
    pos[i * 6 + 3] = t; pos[i * 6 + 4] = -1;
  }
  const idx = [];
  for (let i = 0; i < S; i++) {
    const a = i * 2;
    idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));
  geo.setIndex(idx);

  const group = new Group();
  const make = (cfg) => {
    const mat = new ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
      uniforms: {
        uA: { value: cfg.A.clone() }, uB: { value: new Vector3() },
        uTime: { value: 0 }, uAmp: { value: cfg.amp }, uFreq: { value: cfg.freq },
        uSeed: { value: cfg.seed }, uWidth: { value: cfg.width },
        uPulseSpeed: { value: cfg.pulseSpeed }, uPhase: { value: cfg.phase },
        uBaseAlpha: { value: cfg.baseAlpha }, uBurstStart: { value: -1e3 },
        uIntro: { value: 0 },
        uPointer: { value: new Vector3(999, 999, 999) },
      },
    });
    const mesh = new Mesh(geo, mat);
    mesh.frustumCulled = false;
    group.add(mesh);
    return { mat, cfg };
  };

  // Three approach azimuths so orbiting reveals depth. anchorDir is the
  // preferred core-surface direction (local space) for the near end.
  const fibers = [
    make({ A: new Vector3(-34, 10, -8), anchorDir: new Vector3(-0.55, 0.55, -0.2).normalize(),
      amp: 1.6, freq: 2.1, seed: 7.3, width: 0.07, pulseSpeed: 0.10, phase: 0.0, baseAlpha: 0.5 }),
    make({ A: new Vector3(-30, -12, 6), anchorDir: new Vector3(-0.65, -0.5, 0.4).normalize(),
      amp: 2.0, freq: 1.6, seed: 42.0, width: 0.09, pulseSpeed: 0.06, phase: 0.55, baseAlpha: 0.34 }),
    make({ A: new Vector3(6, -4, -34), anchorDir: new Vector3(0.15, -0.25, -0.95).normalize(),
      amp: 1.8, freq: 1.8, seed: 19.1, width: 0.08, pulseSpeed: 0.075, phase: 0.3, baseAlpha: 0.4 }),
  ];
  scene.add(group);

  let lastElapsed = 0;
  let burstIdx = 0;
  const BURST_SPEED = 0.55; // must match the shader's bp rate
  return {
    // getAnchor(fiberIdx, anchorDir, out) fills the current world position of
    // the fiber's core node — supplied by sim.js (closure over core).
    update(elapsed, pointerWorld, getAnchor) {
      lastElapsed = elapsed;
      const x = Math.min(Math.max((elapsed - (FORM_END - 1.0)) / 2.2, 0), 1);
      const intro = x * x * (3 - 2 * x); // smoothstep: fade in as the core settles
      fibers.forEach(({ mat, cfg }, i) => {
        getAnchor(i, cfg.anchorDir, mat.uniforms.uB.value);
        mat.uniforms.uTime.value = elapsed;
        mat.uniforms.uIntro.value = intro;
        mat.uniforms.uPointer.value.copy(pointerWorld);
      });
    },
    // one-shot pulse toward the core, alternating fibers; the caller schedules
    // core.flashAt when it arrives (arriveIn seconds).
    burst() {
      const i = burstIdx;
      burstIdx = (burstIdx + 1) % fibers.length;
      fibers[i].mat.uniforms.uBurstStart.value = lastElapsed;
      return { fiberIdx: i, anchorDir: fibers[i].cfg.anchorDir, arriveIn: 1 / BURST_SPEED };
    },
  };
}
