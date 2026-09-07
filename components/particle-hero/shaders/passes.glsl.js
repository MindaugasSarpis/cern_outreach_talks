import { NOISE } from './noise.glsl.js';

// Fullscreen-quad vertex shader shared by all sim passes.
export const SIM_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 1.0); }`;

// Seeds a render target from a DataTexture (initial positions).
export const COPY_FRAG = /* glsl */ `
uniform sampler2D uSrc;
varying vec2 vUv;
void main() { gl_FragColor = texture2D(uSrc, vUv); }`;

// Velocity update: 3D curl drift + cursor wake + hover impulse + damping.
export const VEL_FRAG = /* glsl */ `
uniform sampler2D uPos, uVel;
uniform float uDt, uTime;
uniform vec3 uPointer, uPointerVel;
uniform vec4 uImpulse;   // xyz = world pos; w = strength (hover)
uniform vec4 uBurst;     // xyz = world pos; w = strength (collision event)
varying vec2 vUv;
${NOISE}
// Divergence-free 3D field: curl of a vector potential whose components are
// three domain-offset simplex samples. 12 snoise taps per texel — the texel
// budget (160^2 mobile … 448^2 big desktops) keeps this affordable.
vec3 curl3(vec3 p) {
  const float e = 0.35;
  vec3 ex = vec3(e, 0.0, 0.0), ey = vec3(0.0, e, 0.0), ez = vec3(0.0, 0.0, e);
  vec3 o1 = vec3(31.4, 17.7, 5.3), o2 = vec3(-12.1, 70.8, 43.9);
  float dcdy = snoise(p + o2 + ey) - snoise(p + o2 - ey);
  float dbdz = snoise(p + o1 + ez) - snoise(p + o1 - ez);
  float dadz = snoise(p + ez) - snoise(p - ez);
  float dcdx = snoise(p + o2 + ex) - snoise(p + o2 - ex);
  float dbdx = snoise(p + o1 + ex) - snoise(p + o1 - ex);
  float dady = snoise(p + ey) - snoise(p - ey);
  return vec3(dcdy - dbdz, dadz - dcdx, dbdx - dady) / (2.0 * e);
}
void main() {
  vec4 pos = texture2D(uPos, vUv);
  vec3 v = texture2D(uVel, vUv).xyz;
  // ambient drift
  v += curl3(pos.xyz * 0.11 + vec3(0.0, 0.0, uTime * 0.04)) * 0.7 * uDt;
  // cursor wake: drag particles along the pointer's world velocity
  vec3 toP = pos.xyz - uPointer;
  v += uPointerVel * exp(-dot(toP, toP) / 2.6) * 2.6 * uDt;
  // hover impulse: radial push from the impulse point, decays JS-side (w)
  vec3 toI = pos.xyz - uImpulse.xyz;
  float di = length(toI) + 1e-4;
  v += (toI / di) * uImpulse.w * exp(-di * di / 1.4) * uDt;
  // collision-event burst: wider, softer radial shove from the event vertex
  vec3 toB = pos.xyz - uBurst.xyz;
  float db = length(toB) + 1e-4;
  v += (toB / db) * uBurst.w * exp(-db * db / 9.0) * uDt;
  // frame-rate-independent damping + speed clamp
  v *= exp(-1.6 * uDt);
  float sp = length(v);
  if (sp > 3.0) v *= 3.0 / sp;
  gl_FragColor = vec4(v, 1.0);
}`;

// Position update: integrate + toroidal wrap inside the 3D box uBounds.
export const POS_FRAG = /* glsl */ `
uniform sampler2D uPos, uVel;
uniform float uDt;
uniform vec3 uBounds;
varying vec2 vUv;
void main() {
  vec4 pos = texture2D(uPos, vUv);
  vec3 v = texture2D(uVel, vUv).xyz;
  vec3 p = pos.xyz + v * uDt;
  p = mod(p + uBounds, 2.0 * uBounds) - uBounds;
  gl_FragColor = vec4(p, pos.w);
}`;

// Points: position.xy carries the sim-texture ref UV. Depth fog dims far
// particles — the main volumetric cue once the camera moves in 3D.
export const RENDER_VERT = /* glsl */ `
uniform sampler2D uPos, uVel;
uniform float uSize, uPixelRatio;
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 ref = position.xy;
  vec4 pos = texture2D(uPos, ref);
  vec3 vel = texture2D(uVel, ref).xyz;
  float seed = pos.w;
  vec4 mv = modelViewMatrix * vec4(pos.xyz, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * uPixelRatio * mix(0.5, 1.6, fract(seed * 7.31)) * (12.0 / max(-mv.z, 0.1));
  float sp = clamp(length(vel) * 0.9, 0.0, 1.0);
  vColor = mix(vec3(0.30, 0.55, 0.72), vec3(0.98, 0.99, 1.0), sp);  // dim cyan -> white by speed
  float fog = exp(-0.04 * max(length(mv.xyz) - 6.0, 0.0));
  vAlpha = mix(0.25, 0.9, sp) * mix(0.4, 1.0, fract(seed * 3.17)) * fog;
}`;

export const RENDER_FRAG = /* glsl */ `
varying float vAlpha;
varying vec3 vColor;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.05, d) * vAlpha;
  gl_FragColor = vec4(vColor * a, a);
}`;
