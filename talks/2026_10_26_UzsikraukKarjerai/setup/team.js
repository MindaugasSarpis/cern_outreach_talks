import {
  Group, Points, ShaderMaterial, BufferGeometry, BufferAttribute, Vector3, Vector4, DynamicDrawUsage,
} from 'three'
import { makeRing, mulberry32 } from './ring.js'
import { makeBeam } from './beam.js'
import { state, listen, tick, waiting, material, PLACE, smooth } from './grains.js'

// „Ačiū“ (slide 17, station `team`): the LHCb Vilnius group's portraits of
// grains running round a gold beam, OpenData's `portraits` builder copied from
// its setup/grains.js with ring.js and beam.js (verbatim), on this talk's one
// bus. Changed from OpenData's, for the cover's fly-in and the frames between:
//   - the pictures are fetched and turned into grains only once `faces` below
//     has flipped (or the step goes above 0), each decoded off the main thread
//     and built in a task of its own, a frame apart;
//   - the group is drawn only while it is shown (and in the world's first
//     frames, with one hidden grain, so the faces' shader compiles at boot);
//   - busy while a shown ring still waits for a face.
// The sparks and the beam draw through this talk's PLACE (its shallow twinkle,
// its 48 px cap and near-camera fade).

// `faces`: a one-way latch (Innoday's setup/afterCover.js, cut down). It flips
// 1.2 s after a clip covers the screen and still does (the overview clip on
// slide 2, under which the world rests), on the step to slide 3 or later, or at
// once for a page opened past the cover. So the 15 decodes never land in the
// cover's fly-in, and the faces are there long before slide 17.
const faces = (() => {
  let on = false
  const fns = new Set()
  return {
    when(fn) { if (on) { fn(); return () => {} } fns.add(fn); return () => fns.delete(fn) },
    flip() {
      if (on) return
      on = true
      for (const fn of [...fns]) { fns.delete(fn); try { fn() } catch (e) { console.warn('portraits:', e) } }
    },
  }
})()
const slideOf = (path) => Number((/^\/(?:presenter\/)?(\d+)/.exec(path || '') || [])[1] || 1)

export function armTeam(router) {
  if (typeof window === 'undefined') return
  if (slideOf(location.hash.slice(1)) > 1) return faces.flip()
  let timer = 0
  const onCover = (e) => {
    clearTimeout(timer)
    if (e.detail?.covered && e.detail.fit !== 'contain') timer = setTimeout(() => faces.flip(), 1200)
  }
  window.addEventListener('slidev-videos:cover', onCover)
  faces.when(() => { clearTimeout(timer); window.removeEventListener('slidev-videos:cover', onCover) })
  router?.beforeEach?.((to) => { if (slideOf(to.path) >= 3) faces.flip() })
}

// ---- portraits ----------------------------------------------------------------------
//   { type: portraits, name, pos, size?: 2.4, res?: 120, gain?: 1, labelH?: 0.026,
//     people: [{ src: '/figures/people/x.jpg', name, at: [x, y, z] }, …],
//     motion?: { speed, charge, dashBy, view, title, keepOut, frame, seed, … }, sparks?: 1,
//     beam?: { grains, speed, width, spread, halo, bunches, … } }
// Each photograph is a round disc of grains, one grain per pixel of a res × res
// sampling, in the photo's own colours, with a little relief by brightness.
// Step 1 gathers them (the middle of each face first, the edge last) out of
// a wide swirl; step 0 sends them apart. The name sits under each, at a fixed
// size on screen. The engine's arrival (and `c`) gathers them again.
// With `motion` (its fields in setup/ring.js) the people are bodies on a ring
// through their `at`s: they run round it, push each other away and bump, and
// where two meet a few gold grains fly out of the contact on tracks that wind
// in, the way a collision throws out particles in a magnetic field, and pass
// behind the faces (`sparks` scales how many; 0, none). With `beam` (its fields
// in setup/beam.js) a fine line of gold grains runs round through them, parting
// round every face and closing behind it; a bump throws the beam's grains near it
// out, and they drift back, and the grains caught where two faces touch are lost
// and come back in the line. The beam is injected once the camera has landed: a
// head runs round the ring and lays it. The motion starts over at the homes each
// time they gather. Without it each stays at its `at`.
const PORTRAIT_VERT = /* glsl */ `
attribute float aSeed, aR;
attribute vec3 aCol;
uniform float uTime, uShowT, uHideT, uViewH, uGrain, uPixelRatio;
varying vec3 vCol; varying float vA;
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * x * (x * (x * 6.0 - 15.0) + 10.0); }
void main() {
  float f = 0.0;
  if (uShowT >= 0.0) f = ease((uTime - (uShowT + 0.35 * aR + 0.25 * aSeed)) / 1.1);
  if (uHideT >= 0.0) f = min(f, 1.0 - ease((uTime - uHideT - 0.3 * aSeed) / 1.1));
  if (f <= 0.0) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vA = 0.0; vCol = vec3(0.0); return; }
  vec3 dir = normalize(vec3(hash(aSeed * 3.1), hash(aSeed * 5.7), hash(aSeed * 9.3)) - 0.5 + 1e-4);
  float a = (1.0 - f) * 2.6;
  vec3 far = dir * (4.0 + 7.0 * hash(aSeed * 17.0));
  far = vec3(cos(a) * far.x - sin(a) * far.z, far.y, sin(a) * far.x + cos(a) * far.z);
  vec4 mv = modelViewMatrix * vec4(position + far * (1.0 - f), 1.0);
  gl_Position = projectionMatrix * mv;
  float px = uGrain * projectionMatrix[1][1] * 0.5 * uViewH / max(-mv.z, 1e-3);
  gl_PointSize = clamp(px * 2.3, 1.0, 24.0);   // grains overlap, so a face reads as a photograph, not a dot screen
  // the people are made of the data: a grain arrives as a gold grain of data and takes
  // the photo's colour as it settles
  vCol = mix(vec3(1.0, 0.62, 0.22) * 0.5, aCol, smoothstep(0.55, 1.0, f));
  // a grain smaller than a pixel is drawn a pixel wide, so it gives up its share of light
  vA = mix(0.15, 1.0, f) * min(1.0, px * px * 2.9) * (1.0 - smoothstep(0.82, 1.0, aR));
}`
const PORTRAIT_FRAG = /* glsl */ `
uniform float uGain;
varying vec3 vCol; varying float vA;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = (1.0 - smoothstep(0.2, 0.5, d)) * vA;
  if (a < 0.01) discard;
  gl_FragColor = vec4(vCol * uGain, a);
}`

// the grains thrown out where two portraits meet: a pool reused round and round. Each
// is drawn as a short trail of TRAIL points along its track. uFaces: the m faces as they
// are seen (x, y, the photograph's radius); uSeen: the picture plane they are seen in
// (the title's x, y, and the camera's distance; 0: none)
const TRAIL = 6
const sparkVert = (m) => /* glsl */ `
attribute vec3 aVel;
attribute vec2 aDrift;
attribute float aT0, aLife, aSeed, aSpin, aDrag, aTrail;
uniform float uSize, uAlpha;
uniform vec3 uFaces[${m}], uSeen;
${PLACE}
void main() {
  float age = uTime - aT0 - aTrail * 0.035;
  if (age < 0.0 || age > aLife) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; return; }
  float f = 1.0 - age / aLife, tail = 1.0 - aTrail / ${TRAIL}.0;
  // a charged grain in a field along the line of sight, slowing as it goes (its speed
  // falls as e^(−aDrag t)) and turning the tighter the slower it goes (at aSpin e^(aDrag t)):
  // it leaves the contact almost straight and winds in, as the tracks in a bubble
  // chamber do. Its path, summed in steps (the turn at each is exact)
  vec2 q = vec2(0.0);
  float dt = age / 16.0;
  for (int k = 0; k < 16; k++) {
    float tm = (float(k) + 0.5) * dt, turn = aSpin * (exp(aDrag * tm) - 1.0) / aDrag;
    q += exp(-aDrag * tm) * vec2(cos(turn), sin(turn)) * dt;
  }
  // and the whole burst goes on with the two faces it came from, at their mean velocity
  vec3 p = position + vec3(aVel.x * q.x - aVel.y * q.y + aDrift.x * age, aVel.x * q.y + aVel.y * q.x + aDrift.y * age, aVel.z * (1.0 - exp(-aDrag * age)) / aDrag);
  // a track that winds over a photograph passes behind it: it fades out over the face and
  // in again beyond it, so the burst shows in the gap and round the pair, never on a face.
  // Worked where it is seen, as the ring works its bumps
  vec2 s = uSeen.xy + (p.xy - uSeen.xy) * (uSeen.z > 0.0 ? uSeen.z / max(uSeen.z - p.z, 1.0) : 1.0);
  float shown = 1.0;
  for (int j = 0; j < ${m}; j++) shown *= smoothstep(0.75, 0.97, length(s - uFaces[j].xy) / uFaces[j].z);
  place(p, uSize * (0.6 + 0.6 * aSeed) * mix(0.6, 1.0, tail), uAlpha * f * f * tail * shown, mix(vec3(1.0, 0.62, 0.22), vec3(1.0, 0.92, 0.75), f * tail), aSeed);
}`

function makeSparks(N, seed, pr, ring) {
  const V = N * TRAIL
  const pos = new Float32Array(V * 3), vel = new Float32Array(V * 3), drift = new Float32Array(V * 2), t0 = new Float32Array(V).fill(-1e6)
  const life = new Float32Array(V).fill(1), sd = new Float32Array(V), spin = new Float32Array(V), drag = new Float32Array(V).fill(1)
  const trail = Float32Array.from({ length: V }, (_, v) => v % TRAIL)
  const geo = new BufferGeometry()
  const names = { position: [pos, 3], aVel: [vel, 3], aDrift: [drift, 2], aT0: [t0, 1], aLife: [life, 1], aSeed: [sd, 1], aSpin: [spin, 1], aDrag: [drag, 1] }
  for (const [name, [arr, k]] of Object.entries(names)) geo.setAttribute(name, new BufferAttribute(arr, k).setUsage(DynamicDrawUsage))
  geo.setAttribute('aTrail', new BufferAttribute(trail, 1))
  const faces = Array.from({ length: ring.n }, () => new Vector3(0, 0, 1))
  const mat = material(sparkVert(ring.n), { uPixelRatio: pr, uSize: { value: 1.9 }, uAlpha: { value: 1.3 },
    uFaces: { value: faces }, uSeen: { value: new Vector3(ring.title.x, ring.title.y, ring.view === Infinity ? 0 : ring.view) } })
  const points = new Points(geo, mat); points.frustumCulled = false
  let k = 0, rnd = mulberry32(seed), dirty = false
  return {
    points, mat, faces,
    reset() { rnd = mulberry32(seed); t0.fill(-1e6); k = 0; dirty = true },
    burst(h, gain, cm = [0, 0]) {
      // sideways out of the contact, into the gap between the two faces both ways, a
      // little in and out of the plane; a harder bump throws more of them, faster. Half
      // turn one way and half the other, as opposite charges do. They leave nearly
      // straight, so they clear the gap before they wind in: gold added over a
      // photograph's light background does not show
      const m = Math.round(Math.min(36, 4 + 36 * h.v) * gain)
      for (let c = 0; c < m; c++, k = (k + 1) % N) {
        const side = rnd() < 0.5 ? -1 : 1, sp = (1.4 + 2.2 * rnd()) * (0.5 + h.v)
        const across = (rnd() - 0.5) * 0.5, out = (rnd() - 0.5) * 0.6
        const w = (rnd() < 0.5 ? -1 : 1) * (0.5 + 1.1 * rnd()), g = 1 + 0.6 * rnd()
        const vx = (h.tx * side + h.nx * across) * sp, vy = (h.ty * side + h.ny * across) * sp, vz = out * sp
        const L = 1.4 + 1.0 * rnd(), seed = rnd()
        for (let q = k * TRAIL; q < (k + 1) * TRAIL; q++) {
          vel[q * 3] = vx; vel[q * 3 + 1] = vy; vel[q * 3 + 2] = vz; drift[q * 2] = cm[0]; drift[q * 2 + 1] = cm[1]
          pos[q * 3] = h.x; pos[q * 3 + 1] = h.y; pos[q * 3 + 2] = h.z + 0.1
          t0[q] = h.t; life[q] = L; sd[q] = seed; spin[q] = w; drag[q] = g
        }
      }
      dirty = true
    },
    flush() {
      if (!dirty) return
      for (const name of Object.keys(names)) geo.attributes[name].needsUpdate = true
      dirty = false
    },
  }
}

// the beam's grains, where beam.js puts them; they show and go with the faces
const BEAM_VERT = /* glsl */ `
attribute float aSeed, aGlow;
uniform float uSize, uAlpha, uShowT, uHideT;
${PLACE}
void main() {
  float on = uShowT < 0.0 ? 0.0 : uHideT < 0.0 ? 1.0 : 1.0 - smoothstep(0.0, 1.0, uTime - uHideT);
  float a = uAlpha * aGlow * on;
  if (a <= 0.003) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); gl_PointSize = 1.0; vColor = vec3(0.0); vAlpha = 0.0; return; }
  // gold, paler where it glows: the injection's head, a grain thrown out
  vec3 color = mix(vec3(1.0, 0.62, 0.22), vec3(1.0, 0.9, 0.7), min(1.0, 0.5 * (aGlow - 1.0)) + 0.2 * hash(aSeed * 7.0));
  place(position, uSize * (0.7 + 0.6 * hash(aSeed * 13.0)), a, color, aSeed);
}`

function buildPortraits(o, ctx) {
  const size = o.size ?? 2.4, res = Math.round(o.res ?? 120)
  const people = o.people || []
  const g = new Group()
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  // one group per person, at their `at`: the motion moves the group, the grains sit in it
  const homes = people.map((person) => person.at || [0, 0, 0])
  const nodes = homes.map((at) => { const node = new Group(); node.position.set(at[0], at[1], at[2]); g.add(node); return node })
  const showT = { value: -1 }, hideT = { value: -1 }, viewH = { value: 1080 }, pr = { value: Math.min(devicePixelRatio || 1, 2) }
  const uni = { uTime: { value: 0 }, uShowT: showT, uHideT: hideT, uViewH: viewH, uGrain: { value: size / res },
    uPixelRatio: pr, uGain: { value: o.gain ?? 0.8 } }
  const mat = new ShaderMaterial({ vertexShader: PORTRAIT_VERT, fragmentShader: PORTRAIT_FRAG, uniforms: uni,
    transparent: true, depthWrite: false, depthTest: true })
  const vp = new Vector4()
  const base = (import.meta.env?.BASE_URL || '/').replace(/\/$/, '')
  const toLin = (v) => Math.pow(v / 255, 2.2)
  const labels = []
  // the faces' pictures wait for the latch below (not on the cover's fly-in); each is
  // decoded off the main thread and turned into grains in a task of its own, a frame apart
  let built = 0, started = false
  const queue = []
  let draining = false
  const drain = () => {
    const job = queue.shift()
    if (!job) { draining = false; return }
    draining = true
    try { job() } catch (e) { console.warn('portraits:', e) }
    setTimeout(drain, 16)
  }
  const later = (job) => { queue.push(job); if (!draining) drain() }
  const buildFace = (img, n) => {
    const node = nodes[n]
    {
      const c = document.createElement('canvas'); c.width = res; c.height = res
      const cx = c.getContext('2d', { willReadFrequently: true })
      cx.drawImage(img, 0, 0, res, res)
      const px = cx.getImageData(0, 0, res, res).data
      const pos = [], col = [], seed = [], rr = []
      for (let y = 0; y < res; y++) for (let x = 0; x < res; x++) {
        const u = (x + 0.5) / res - 0.5, v = (y + 0.5) / res - 0.5, r = Math.hypot(u, v) * 2
        if (r > 1) continue
        const i = (y * res + x) * 4
        const R = px[i], G = px[i + 1], B = px[i + 2]
        const l = (0.2126 * R + 0.7152 * G + 0.0722 * B) / 255
        pos.push(u * size, -v * size, (l - 0.5) * 0.06 * size + (Math.random() - 0.5) * 0.01 * size)
        col.push(toLin(R), toLin(G), toLin(B))
        seed.push(Math.random()); rr.push(r)
      }
      const geo = new BufferGeometry()
      geo.setAttribute('position', new BufferAttribute(new Float32Array(pos), 3))
      geo.setAttribute('aCol', new BufferAttribute(new Float32Array(col), 3))
      geo.setAttribute('aSeed', new BufferAttribute(new Float32Array(seed), 1))
      geo.setAttribute('aR', new BufferAttribute(new Float32Array(rr), 1))
      const p = new Points(geo, mat); p.frustumCulled = false
      p.onBeforeRender = (renderer) => { renderer.getCurrentViewport(vp); viewH.value = vp.w || 1080 }
      node.add(p)
    }
  }
  const loadAll = () => {
    if (started || typeof Image === 'undefined') return
    started = true
    people.forEach((person, n) => {
      const img = new Image()
      img.decoding = 'async'
      const done = () => { built++ }
      img.onload = () => {
        const ready = img.decode ? img.decode().catch(() => {}) : Promise.resolve()
        ready.then(() => later(() => { try { buildFace(img, n) } finally { done() } }))
      }
      img.onerror = done
      img.src = String(person.src || '').startsWith('/') ? base + person.src : person.src
    })
  }
  people.forEach((person, n) => {
    const node = nodes[n]
    if (person.name && o.labels !== false) {   // labels: false keeps the names off the screen (they are in the notes)
      const make = () => {
        const l = smooth(ctx.helpers.makeLabel(person.name, { px: 64, weight: 500, color: '#dfe6f1', worldH: o.labelH ?? 0.026, letterSpacing: 0.04, upper: false }))
        l.material.sizeAttenuation = false; l.material.opacity = 0
        l.center.set(0.5, 1.25)
        l.position.set(0, -size / 2, 0)
        l.userData.vis = 0
        node.add(l); labels.push(l)
      }
      if (document.fonts?.load) document.fonts.load('500 64px "Space Grotesk"').catch(() => {}).finally(make)
      else make()
    }
  })

  // one hidden grain with the faces' material, drawn in the world's first frames, so its
  // shader compiles at boot with everything else, not as the ring gathers
  {
    const pg = new BufferGeometry()
    pg.setAttribute('position', new BufferAttribute(new Float32Array(3), 3))
    pg.setAttribute('aCol', new BufferAttribute(new Float32Array(3), 3))
    pg.setAttribute('aSeed', new BufferAttribute(new Float32Array(1), 1))
    pg.setAttribute('aR', new BufferAttribute(new Float32Array(1), 1))
    const pp = new Points(pg, mat); pp.frustumCulled = false
    g.add(pp)
  }

  const ring = o.motion && people.length > 1 ? makeRing(homes, { radius: size / 2 * 0.9, ...o.motion }) : null
  const sparks = ring && o.sparks !== 0 ? makeSparks(600, (o.motion.seed ?? 7) + 1, pr, ring) : null
  const photo = size / 2 / (o.motion?.radius ?? size / 2 * 0.9)   // a photograph's radius, of its body's
  if (sparks) { sparks.points.renderOrder = 1; g.add(sparks.points) }   // over the faces: the transparent sort would go by a key frozen at the group's origin
  // the beam: as many grains as the device's budget allows, up to the asked-for count
  const beam = ring && o.beam ? makeBeam(ring, { ...o.beam, grains: Math.min(o.beam.grains ?? 4000, (ctx.budget ?? 300000) / 40) }) : null
  let beamPts = null
  if (beam) {
    const bgeo = new BufferGeometry()
    bgeo.setAttribute('position', new BufferAttribute(new Float32Array(beam.n * 3), 3).setUsage(DynamicDrawUsage))
    bgeo.setAttribute('aGlow', new BufferAttribute(new Float32Array(beam.n), 1).setUsage(DynamicDrawUsage))
    bgeo.setAttribute('aSeed', new BufferAttribute(Float32Array.from({ length: beam.n }, (_, i) => (i * 0.618034) % 1), 1))
    beamPts = new Points(bgeo, material(BEAM_VERT, { uPixelRatio: pr, uSize: { value: o.beam.size ?? 1.3 }, uAlpha: { value: o.beam.alpha ?? 0.95 },
      uShowT: showT, uHideT: hideT }))
    beamPts.frustumCulled = false; beamPts.renderOrder = 1
    g.add(beamPts)
  }
  const moveNodes = () => {
    for (let i = 0; i < nodes.length; i++) { nodes[i].position.set(ring.x[i], ring.y[i], ring.z[i]); nodes[i].rotation.z = ring.a[i] }
  }
  // a bump: the sparks, going on with the pair's mean velocity, and the beam's grains near it thrown out
  const hit = (h) => {
    const v = ring.seen
    sparks?.burst(h, o.sparks ?? 1, [(v.vx[h.i] + v.vx[h.j]) / 2, (v.vy[h.i] + v.vy[h.j]) / 2])
    beam?.kick(h)
  }
  // they gather: the motion starts over from the homes
  const show = (t) => {
    showT.value = t; hideT.value = -1
    if (ring) { ring.reset(t); sparks?.reset(); beam?.reset(t); moveNodes() }
  }

  let now = 0, step = state.has(o.name) ? state.get(o.name) : 0, armed = false, armedAt = 0
  const go = (k) => {
    step = k
    if (k) loadAll()
    if (armed) return
    if (k) { if (showT.value < 0 || hideT.value >= 0) show(now) }
    else if (showT.value >= 0 && hideT.value < 0) hideT.value = now
  }
  const off = listen(o.name, go)
  const offLatch = faces.when(loadAll)
  if (step) loadAll()
  mat.addEventListener('dispose', () => { off(); offLatch() })
  // their slide opened before the world was built (a reload, or a link straight to it):
  // with onEnter nothing else would gather them, so the first frame does
  let late = !!(o.onEnter && step), warm = 3
  // busy (v0.7) while they gather (1.7 s), the ring's drive ramps in (3.3 s) and the beam is
  // injected (its settle, and its head's flare dying), while they break up (1.6 s), a name
  // still fades or a step for later is to come: the ring itself runs on as long as it is seen
  let labelsMoving = false
  const settled = beam ? Math.max(3.3, beam.settle + 0.8) : ring ? 3.3 : 1.7
  const busy = () => labelsMoving || waiting(o.name) || (showT.value >= 0 && (hideT.value >= 0 || now - showT.value < settled))
    || (!!step && built < people.length)
  // onEnter: they gather the moment their slide opens, during the flight, rather than on
  // arrival. The hook stays, answering at once: the engine announces a station as
  // assembled only through its builders' hooks, and the cover's title waits on that
  const api = o.onEnter ? { arm() {}, assemble(t, onDone) { onDone?.() }, busy } : {
    arm() { armed = true; armedAt = now; if (showT.value >= 0 && hideT.value < 0) hideT.value = now },
    assemble(t, onDone) {
      now = t; armed = false
      if (step) show(t); else if (showT.value >= 0 && hideT.value < 0) hideT.value = t
      onDone?.()
    },
    busy,
  }
  return {
    group: g, labels: [], api, frameScale: pr,   // the sparks' and the beam's size (the faces size from uViewH)
    update(t) {
      tick(t)
      now = t; uni.uTime.value = t
      // nothing of the ring is drawn while it is not shown: 15 faces of grains cost every
      // frame otherwise (sun.js does the same)
      g.visible = showT.value >= 0 || late || warm-- > 0
      if (late) { late = false; if (step && showT.value < 0) show(t) }
      if (armed && t - armedAt > 6) { armed = false; go(step) }
      if (hideT.value >= 0 && t - hideT.value > 1.6) { showT.value = -1; hideT.value = -1 }
      if (ring && showT.value >= 0) {
        ring.advance(t, hit, beam ? (st, h) => beam.step(st, h) : null)
        moveNodes(); sparks?.flush()
        if (sparks) { const v = ring.seen; sparks.faces.forEach((f, j) => f.set(v.x[j], v.y[j], v.r[j] * photo)) }
        if (beam) {
          const a = beamPts.geometry.attributes
          beam.write(a.position.array, a.aGlow.array, t)
          a.position.needsUpdate = true; a.aGlow.needsUpdate = true
        }
      }
      if (sparks) sparks.mat.uniforms.uTime.value = t
      if (beamPts) beamPts.material.uniforms.uTime.value = t
      const on = showT.value >= 0 && hideT.value < 0 && t - showT.value > 1.2
      labelsMoving = false
      for (const l of labels) {
        l.userData.vis += ((on ? 1 : 0) - l.userData.vis) * 0.06
        if (Math.abs((on ? 1 : 0) - l.userData.vis) > 0.01) labelsMoving = true
        l.material.opacity = 0.9 * l.userData.vis
        l.visible = l.userData.vis > 0.01
      }
    },
  }
}

export function installTeam(registerBuilder) {
  registerBuilder('portraits', buildPortraits, { fields: ['pos', 'name', 'people'] })
}
