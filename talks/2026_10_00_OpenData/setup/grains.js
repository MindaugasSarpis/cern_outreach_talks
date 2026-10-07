import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, AdditiveBlending, Color, Vector3,
} from 'three'

// This talk's own forms of grains, drawn the way the engine draws its galaxy
// and collider (slidev-addon-stage, stage/forms.js): points of light, added
// together, no surfaces, no labels.
//
//   volume   a ball of grains, one grain per terabyte. It grows in steps
//            (`steps: [1, 800, 55000]`): a step adds the grains it needs, and
//            they fly in from the dust, the inner ones first, so the ball is
//            seen growing. The density is fixed, so the radius goes as the
//            cube root of the count and the volume reads as the amount.
//   streams  grains running from one point to others along arcs, each arc
//            ending in a small cluster that gathers when its stream starts:
//            data leaving the open store for the people who use it.
//
// The slides drive both through `setGrains(name, step)` (the <Grains> slide
// component calls it when its slide becomes the current one). The last step
// of every name is kept, so a form built after the call still starts right.

const BUS = 'opendata:grains'
const state = new Map()

export function setGrains(name, step) {
  if (state.get(name) === step) return
  state.set(name, step)
  window.dispatchEvent(new CustomEvent(BUS, { detail: { name, step } }))
}
function listen(name, fn) {
  const h = (e) => { if (e.detail?.name === name) fn(e.detail.step) }
  window.addEventListener(BUS, h)
  return () => window.removeEventListener(BUS, h)
}

const rgb = (hex) => { const c = new Color(hex); return [c.r, c.g, c.b] }
const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += Math.random(); return (s - 2) / 1.2 }

// A grain's twinkle, size from distance, and the engine's linear-light point.
const PLACE = /* glsl */ `
uniform float uTime, uPixelRatio;
varying vec3 vColor; varying float vAlpha;
void place(vec3 p, float size, float alpha, vec3 color, float seed) {
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.72 + 0.28 * sin(uTime * (1.1 + seed * 2.3) + seed * 40.0);
  gl_PointSize = uPixelRatio * size * tw * (72.0 / max(-mv.z, 0.1));
  vColor = color;
  vAlpha = alpha * tw;
}
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
`
const FRAG = /* glsl */ `
varying vec3 vColor; varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.04, 0.5, d)) * vAlpha;
  gl_FragColor = vec4(pow(vColor * a, vec3(2.2)), 1.0);
}`

function material(vertexShader, uniforms) {
  return new ShaderMaterial({
    vertexShader, fragmentShader: FRAG, transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: Math.min(devicePixelRatio || 1, 2) }, ...uniforms },
  })
}

// ---- volume -------------------------------------------------------------------------
//   { type: volume, name, pos, steps: [n0, n1, …], scale?: 0.1, color?, core?, size?: 1, alpha?: 0.5,
//     fade?: 0 … 1 (how much the alpha drops as the count grows), spin?: 1 }
// Grain j sits at radius scale·∛(j + u) in a random direction: the first n
// grains always fill a ball of radius scale·∛n evenly, whatever n is.
const VOLUME_VERT = /* glsl */ `
attribute float aSeed;
uniform float uFrom, uTo, uT0, uGrow, uScale, uSize, uAlpha, uSpin, uFade, uReach, uLone;
uniform vec3 uColor, uCore;
${PLACE}
void main() {
  float j = float(gl_VertexID);
  float lo = min(uFrom, uTo), hi = max(uFrom, uTo);
  float f;                       // 0 adrift … 1 in place
  float show = 1.0;
  if (j < lo) f = 1.0;
  else if (j >= hi) { f = 0.0; show = 0.0; }
  else if (uTo > uFrom) {
    // growing: the inner grains set out first, each takes 1.6 s to arrive
    float k = (j - uFrom) / max(uTo - uFrom, 1.0);
    float start = uT0 + uGrow * (0.78 * pow(k, 0.8) + 0.22 * aSeed);
    f = ease((uTime - start) / 1.6);
    show = step(start, uTime);
  } else {
    // shrinking: the grains past the new count scatter and go out
    f = 1.0 - ease((uTime - uT0) / 1.1);
    show = f;
  }
  vec3 home = position;
  float r = length(home);
  // the ball turns, the inside a little faster
  float w = uTime * uSpin * (0.035 + 0.05 / (1.0 + r / max(uScale * 20.0, 0.1)));
  float c = cos(w), s = sin(w);
  home = vec3(c * home.x - s * home.z, home.y, s * home.x + c * home.z);
  // adrift: out along the grain's own direction, well beyond the ball, swirling in as it comes
  float rr = max(r, 1e-3);
  vec3 dir = home / rr;
  vec3 side = normalize(cross(dir, vec3(0.0, 1.0, 0.0)) + 1e-4);
  float R = uScale * pow(max(max(uTo, uFrom), 1.0), 1.0 / 3.0);
  float reach = (uReach + R) * (0.8 + 1.4 * hash(aSeed * 91.0));
  vec3 far = dir * (rr + reach) + side * reach * 0.6 * (hash(aSeed * 17.0) - 0.5)
           + vec3(0.0, reach * 0.5 * (hash(aSeed * 53.0) - 0.5), 0.0);
  float a = (1.0 - f) * 2.2;
  vec3 drift = vec3(cos(a) * far.x - sin(a) * far.z, far.y, sin(a) * far.x + cos(a) * far.z);
  vec3 p = mix(drift, home, f);
  // brighter, warmer towards the middle; fainter as the ball holds more
  float inner = exp(-2.5 * r / max(R, 1e-3));
  vec3 color = mix(uColor, uCore, 0.55 * inner + 0.25 * hash(aSeed * 7.0));
  float n = mix(uFrom, uTo, ease((uTime - uT0) / (uTo > uFrom ? uGrow + 1.6 : 1.1)));
  float dense = 1.0 / (1.0 + uFade * log(1.0 + n / 800.0));
  // a ball of a handful of grains: each is drawn large, so one terabyte can be pointed at
  float lone = exp(-n / 10.0);
  float alpha = uAlpha * dense * mix(0.25, 1.0, f) * show * (1.0 + 0.8 * lone);
  float size = uSize * (0.75 + 0.8 * hash(aSeed * 31.0)) * (1.0 + 2.0 * (1.0 - f)) * (1.0 + uLone * lone);
  if (alpha <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; return; }
  place(p, size, alpha, color, aSeed);
}`

function buildVolume(o, ctx) {
  const steps = (o.steps || [1]).map((n) => Math.max(0, Math.round(n)))
  const N = Math.max(1, Math.min(1_200_000, Math.max(...steps)))
  const scale = o.scale ?? 0.1
  const pos = new Float32Array(N * 3), seed = new Float32Array(N)
  for (let j = 0; j < N; j++) {
    const r = scale * Math.cbrt(j + Math.random())
    const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z)
    pos[j * 3] = r * q * Math.cos(ph); pos[j * 3 + 1] = r * z; pos[j * 3 + 2] = r * q * Math.sin(ph)
    seed[j] = Math.random()
  }
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  geo.setAttribute('aSeed', new BufferAttribute(seed, 1))
  const mat = material(VOLUME_VERT, {
    uFrom: { value: 0 }, uTo: { value: 0 }, uT0: { value: 0 }, uGrow: { value: o.grow ?? 3.2 },
    uScale: { value: scale }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.5 },
    uSpin: { value: o.spin ?? 1 }, uFade: { value: o.fade ?? 0.18 }, uReach: { value: o.reach ?? 4 }, uLone: { value: o.lone ?? 7 },
    uColor: { value: new Color(...rgb(o.color || ctx.palette.accent)) },
    uCore: { value: new Color(...rgb(o.core || '#ffffff')) },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)

  const u = mat.uniforms
  let now = 0, step = -1
  let busyUntil = -1, pending = null   // a change under way, and the count asked for meanwhile
  let armed = false, armedAt = 0       // the engine armed us: a flight is bringing the camera here
  let doneAt = -1, doneCbs = []        // onDone of every assembly asked for, called together when the last one ends
  const countOf = (k) => (k < 0 ? 0 : steps[Math.min(k, steps.length - 1)])
  const GROW = () => u.uGrow.value + 1.6, SHRINK = 1.1
  // a change from a settled count (uFrom === uTo) to `to`
  const start = (to, from = u.uTo.value) => {
    u.uFrom.value = from; u.uTo.value = to; u.uT0.value = now
    busyUntil = to === from ? -1 : now + (to > from ? GROW() : SHRINK)
  }
  const go = (k, { instant = false } = {}) => {
    step = k
    const to = countOf(k)
    if (instant) { u.uFrom.value = u.uTo.value = to; busyUntil = -1; pending = null; return }
    if (armed) return                                 // the arrival grows it (assemble)
    if (busyUntil >= 0) { pending = to; return }      // let the change under way finish first
    if (to !== u.uTo.value) start(to)
  }
  const off = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', off)               // the engine disposes materials, never calls a builder's dispose
  // opened mid-talk: the step is known, the ball builds itself when the engine assembles the opening station (0.6 s), else at 1 s
  if (state.has(o.name)) { step = state.get(o.name); armed = true; armedAt = -5 }

  // `c` (and an arrival from elsewhere) grows the ball again from nothing
  const api = o.assemble === false ? undefined : {
    // a flight toward the station: what stands scatters, and stays out until the arrival
    arm() {
      armed = true; armedAt = now; pending = null
      if (busyUntil < 0 && u.uTo.value > 0) start(0)
      else { u.uFrom.value = u.uTo.value = 0; busyUntil = -1 }
    },
    assemble(t, onDone) {
      now = t; armed = false; pending = null
      start(countOf(step), 0)
      if (onDone) doneCbs.push(onDone)
      doneAt = t + GROW()                             // engine clock; never sooner than a full growth, so an empty ball does not end the station's assembly
    },
  }
  return {
    group: g, labels: [], api, pixelRatio: u.uPixelRatio,
    update(t) {
      now = t; u.uTime.value = t
      if (busyUntil >= 0 && t >= busyUntil) {
        busyUntil = -1
        u.uFrom.value = u.uTo.value                   // settled: lone, dense and the drift reach follow the count shown
        if (pending != null) { const p = pending; pending = null; if (p !== u.uTo.value) start(p) }
      }
      if (armed && t - armedAt > 6) { armed = false; start(countOf(step), 0) }   // the flight was turned away: show it anyway
      if (doneCbs.length && t >= doneAt) { const cbs = doneCbs; doneCbs = []; for (const cb of cbs) cb() }
      geo.setDrawRange(0, Math.max(u.uFrom.value, u.uTo.value))   // grains past the count are never drawn (gl_VertexID counts from 0)
    },
    dispose: off,
  }
}

// ---- streams ------------------------------------------------------------------------
//   { type: streams, name, pos, from: [x,y,z], to: [{ pos, lift?, node?: false }, …],
//     grains?: 2200 per stream, node?: 900 grains per end cluster, nodeRadius?: 0.45,
//     speed?: 0.11 (laps a second), color?, spread?: 0.08 }
// Step k shows the first k streams; a stream that starts gathers its end
// cluster over two seconds while its first grains are on the way.
const MAXS = 12
const STREAMS_VERT = /* glsl */ `
attribute float aSeed, aIdx, aKind;   // stream index; 0 a grain on the way, 1 a grain of the end cluster
attribute vec3 aEnd, aCtl, aOff;
uniform vec3 uFrom;
uniform float uShowT[${MAXS}];
uniform float uHideT[${MAXS}];
uniform float uBackT[${MAXS}];
uniform float uSpeed, uSize, uAlpha, uNodeR;
uniform vec3 uColor, uWhite;
${PLACE}
void main() {
  int i = int(aIdx + 0.5);
  float t0 = uShowT[i];
  float since = t0 < 0.0 ? -1.0 : uTime - t0;
  // a stream that is stopped fades out over 1.2 s, its grains still running
  float h = uHideT[i];
  float on = (since < 0.0 ? 0.0 : 1.0) * (h < 0.0 ? smoothstep(0.0, 1.2, uTime - uBackT[i]) : 1.0 - smoothstep(0.0, 1.2, uTime - h));
  vec3 p; float alpha; float size;
  if (aKind < 0.5) {
    // along a quadratic arc; a grain leaves only once its stream has started
    float s = fract(aSeed * 7.31 + uSpeed * uTime);
    float lead = since * uSpeed;                 // only grains that have left since the stream started
    float started = step(s, lead) + step(1.0, lead);
    vec3 a = mix(uFrom, aCtl, s), b = mix(aCtl, aEnd, s);
    p = mix(a, b, s) + aOff * (0.4 + sin(s * 3.14159));
    float ends = smoothstep(0.0, 0.06, s) * (1.0 - smoothstep(0.9, 1.0, s));
    alpha = uAlpha * ends * on * min(started, 1.0);
    size = uSize * (0.7 + 0.7 * hash(aSeed * 13.0));
  } else {
    // the end cluster: grains gather from around the end over two seconds and keep orbiting
    float f = ease(since / 2.2);
    float w = uTime * (0.25 + 0.4 * hash(aSeed * 5.0));
    vec3 o = aOff * uNodeR;
    vec3 home = aEnd + vec3(cos(w) * o.x - sin(w) * o.z, o.y, sin(w) * o.x + cos(w) * o.z);
    vec3 far = aEnd + normalize(aOff + 1e-4) * uNodeR * (5.0 + 6.0 * hash(aSeed * 3.0));
    p = mix(far, home, f);
    alpha = uAlpha * 1.3 * on * mix(0.2, 1.0, f);
    size = uSize * (0.9 + 0.9 * hash(aSeed * 29.0));
  }
  vec3 color = mix(uColor, uWhite, 0.35 * hash(aSeed * 41.0) + (aKind > 0.5 ? 0.25 : 0.0));
  if (alpha <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; return; }
  place(p, size, alpha, color, aSeed);
}`

function buildStreams(o, ctx) {
  const to = (o.to || []).slice(0, MAXS)
  const per = Math.round(o.grains ?? 2200), node = Math.round(o.node ?? 900)
  const nodeOf = (d) => (d.node === false ? 0 : node)
  const N = to.reduce((a, d) => a + per + nodeOf(d), 0)
  const from = o.from || [0, 0, 0]
  const seed = new Float32Array(N), idx = new Float32Array(N), kind = new Float32Array(N)
  const end = new Float32Array(N * 3), ctl = new Float32Array(N * 3), off = new Float32Array(N * 3), pos = new Float32Array(N * 3)
  const spread = o.spread ?? 0.08
  let n = 0
  to.forEach((d, i) => {
    const e = d.pos || [0, 0, 0]
    const mid = [(from[0] + e[0]) / 2, (from[1] + e[1]) / 2, (from[2] + e[2]) / 2]
    const len = Math.hypot(e[0] - from[0], e[1] - from[1], e[2] - from[2])
    const c = [mid[0], mid[1] + (d.lift ?? 0.32) * len, mid[2]]
    for (let k = 0; k < per + nodeOf(d); k++, n++) {
      seed[n] = Math.random(); idx[n] = i; kind[n] = k < per ? 0 : 1
      end.set(e, n * 3); ctl.set(c, n * 3); pos.set(e, n * 3)
      if (k < per) off.set([gauss() * spread * len * 0.1, gauss() * spread * len * 0.1, gauss() * spread * len * 0.1], n * 3)
      else {
        const z = 2 * Math.random() - 1, ph = Math.random() * Math.PI * 2, q = Math.sqrt(1 - z * z), r = Math.cbrt(Math.random())
        off.set([r * q * Math.cos(ph), r * z * 0.8, r * q * Math.sin(ph)], n * 3)
      }
    }
  })
  const geo = new BufferGeometry()
  geo.setAttribute('position', new BufferAttribute(pos, 3))
  for (const [k, a, s] of [['aSeed', seed, 1], ['aIdx', idx, 1], ['aKind', kind, 1], ['aEnd', end, 3], ['aCtl', ctl, 3], ['aOff', off, 3]]) geo.setAttribute(k, new BufferAttribute(a, s))
  const showT = new Array(MAXS).fill(-1), hideT = new Array(MAXS).fill(-1), backT = new Array(MAXS).fill(-100)
  const mat = material(STREAMS_VERT, {
    uFrom: { value: new Vector3(from[0], from[1], from[2]) }, uShowT: { value: showT }, uHideT: { value: hideT }, uBackT: { value: backT },
    uSpeed: { value: o.speed ?? 0.11 }, uSize: { value: o.size ?? 1 }, uAlpha: { value: o.alpha ?? 0.55 },
    uNodeR: { value: o.nodeRadius ?? 0.45 },
    uColor: { value: new Color(...rgb(o.color || ctx.palette.accent)) }, uWhite: { value: new Color(1, 0.97, 0.9) },
  })
  const pts = new Points(geo, mat); pts.frustumCulled = false
  const g = new Group(); g.add(pts)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)

  let now = 0
  // step k: the first k streams run; those starting now leave a quarter second
  // apart, those stopping fade out (and start afresh if asked for again)
  const go = (k, { instant = false } = {}) => {
    let fresh = 0
    for (let i = 0; i < MAXS; i++) {
      const running = showT[i] >= 0 && hideT[i] < 0
      const fading = showT[i] >= 0 && hideT[i] >= 0 && now - hideT[i] < 1.2
      if (i < k && !running) {
        // still on its way out: take it back, fading in from the brightness it has now
        // (1 - S(x) = S(1.2 - x) for this smoothstep, so the fade-in starts where the fade-out was)
        if (fading && !instant) { backT[i] = 2 * now - hideT[i] - 1.2; hideT[i] = -1 }
        else { showT[i] = instant ? now - 60 : now + 0.25 * fresh++; hideT[i] = -1; backT[i] = -100 }
      } else if (i >= k && running) {
        if (instant || showT[i] > now) showT[i] = -1      // not started yet: nothing to fade
        else hideT[i] = now
      }
    }
  }
  const off2 = listen(o.name, (k) => go(k))
  mat.addEventListener('dispose', off2)
  if (state.has(o.name)) go(state.get(o.name), { instant: true })
  return {
    group: g, labels: [], pixelRatio: mat.uniforms.uPixelRatio,
    update(t) { now = t; mat.uniforms.uTime.value = t },
    dispose: off2,
  }
}

export function installGrains(registerBuilder) {
  registerBuilder('volume', buildVolume, { fields: ['pos', 'name', 'steps'] })
  registerBuilder('streams', buildStreams, { fields: ['pos', 'name', 'from', 'to'] })
}
