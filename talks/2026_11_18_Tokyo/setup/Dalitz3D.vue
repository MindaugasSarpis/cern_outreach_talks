<script setup>
// <Dalitz3D />: LHCb's 2019 Dalitz plot of Λb⁰ → J/ψ p K⁻, built up in 3D (the owner, 10 Nov: "on the next slide
// dynamically build up a dalitz plot in 3D space from 2019 result"). The data: the paper's Dalitz-plot figure
// (PRL 122 (2019) 222001, CC BY 4.0) digitised from its colours into 200 × 200 cells (public/data/dalitz-2019.json,
// bake/dalitz_digitise.py; counts approximate, ~252 000 in all against the paper's ~246 000), drawn here as
// 100 × 100 columns (2 × 2 cells averaged). Seen first from above, as the paper draws it, the candidates fall in
// and the cells light up; then the plot tilts and the columns rise to their counts (height as the square root,
// so the many small cells still show beside the Λ(1520) ridge), the bands of the P_c(4312)⁺ and of the
// P_c(4440)⁺ with the P_c(4457)⁺ light up across it with their names, and it turns slowly. Runs once on
// entering (~16 s) and holds; off the live slide, or without WebGL, its end as a picture
// (public/figures/dalitz_end.jpg).
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, BoxGeometry, MeshLambertMaterial, InstancedMesh,
  Object3D, Color, Vector3, AmbientLight, DirectionalLight, BufferGeometry, BufferAttribute, Points, ShaderMaterial,
  AdditiveBlending, PlaneGeometry, MeshBasicMaterial, LineSegments, LineBasicMaterial, InstancedBufferAttribute,
} from 'three'
import DZ from '../public/data/dalitz-2019.json'

const W = 980, H = 551.25, FOV = 34
const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const gl = ref(true)
const still = computed(() => !live.value || !gl.value)
const stillSrc = `${import.meta.env.BASE_URL}figures/dalitz_end.jpg`
const labels = reactive([])
const leads = reactive([])            // a thin line from a name down to what it names: { x1, y1, x2, y2, op }

// the plot in the world: m²(Kp) 2…6.5 along x, m²(J/ψp) 16…26.5 along −z (far is up, seen from above)
const XL = 2, XH = 6.5, YL = 16, YH = 26.5
const SX = 9 / (XH - XL), SZ = 9 / (YH - YL)
const wx = (m2) => (m2 - (XL + XH) / 2) * SX
const wz = (m2) => -(m2 - (YL + YH) / 2) * SZ
const NX = 100, NY = 100, BX = DZ.x.bin * 2, BY = DZ.y.bin * 2
const HK = 0.19                       // height per √count
// the P_c bands, lit when the names come in: their rows in m²(J/ψ p), the P_c(4312)⁺ and, 1.5 columns apart and
// so one band at this binning, the P_c(4440)⁺ with the P_c(4457)⁺; only where m²(K p) ≥ 3.61 GeV² (m(Kp) >
// 1.9 GeV, the paper's own cut: below it the Λ* ridges cover them), to the kinematic edge.
// The bands' columns are lit by colour only: every height is the count, a band's as any other's.
const BANDS = [[18.52, 18.73], [19.57, 19.99]], BAND_KP = 3.61
const LIT = new Color(1.2, 1.2, 1.2), LIT_K = 0.85   // toward a white a little over 1: Lambert's shade dulls a plain one

const root = ref(null), cv = ref(null)
let renderer, scene, camera, world, bars, sparks, raf = 0, t0 = 0, running = false
let cells = []                        // { i, j, n, h, x, z, first, band }

function grid() {
  const out = []
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    let s = 0
    for (let dj = 0; dj < 2; dj++) for (let di = 0; di < 2; di++) s += DZ.counts[2 * j + dj]?.[2 * i + di] || 0
    const n = s / 4
    if (n <= 0) continue
    const mx = DZ.x.lo + (i + 0.5) * BX, my = DZ.y.lo + (j + 0.5) * BY
    const x = wx(mx), z = wz(my), band = mx >= BAND_KP && BANDS.some(([lo, hi]) => my > lo && my < hi)
    // when its first candidate lands, as a share F of all of them: P(none by F) = exp(−n F), drawn once
    const first = -Math.log(1 - Math.random() * 0.999) / Math.max(n, 0.2)
    out.push({ i, j, n, h: Math.sqrt(n) * HK, x, z, first, band })
  }
  return out
}
// colour by log count, as the paper's scale: pale blue at 1, blue at ~10, near white at the top (no gold)
const C0 = new Color('#1f4fd6'), C1 = new Color('#2f8bff'), C2 = new Color('#7fe0ff'), C3 = new Color('#ffffff')
function colourOf(n) {
  const u = Math.min(1, Math.log10(Math.max(n, 1)) / Math.log10(160))
  const c = new Color()
  if (u < 0.45) c.copy(C0).lerp(C1, u / 0.45)
  else if (u < 0.8) c.copy(C1).lerp(C2, (u - 0.45) / 0.35)
  else c.copy(C2).lerp(C3, (u - 0.8) / 0.2)
  return c
}

const SPARK_V = /* glsl */ `
attribute vec3 aFrom; attribute vec3 aTo; attribute float aT0;
uniform float uTime, uScale;
varying float vA;
void main() {
  float age = uTime - aT0;
  float u = clamp(age / 0.7, 0.0, 1.0);
  vec3 p = mix(aFrom, aTo, u * u);
  vA = (age < 0.0 || age > 1.2) ? 0.0 : (u < 1.0 ? 0.9 : 1.0 - (age - 0.7) / 0.5);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uScale * (u < 1.0 ? 2.6 : 4.0) * (30.0 / -mv.z);
}`
const SPARK_F = /* glsl */ `
varying float vA;
void main() { float d = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, d) * vA; gl_FragColor = vec4(vec3(0.75, 0.92, 1.0) * a, a); }`
const NSP = 2400
let cdf = []
function pick() {
  const r = Math.random() * cdf[cdf.length - 1]
  let lo = 0, hi = cdf.length - 1
  while (lo < hi) { const m = (lo + hi) >> 1; if (cdf[m] < r) lo = m + 1; else hi = m }
  return cells[lo]
}

function build() {
  if (renderer) return true
  try {
    renderer = new WebGLRenderer({ canvas: cv.value, antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch (e) { gl.value = false; return false }
  renderer.setClearColor(0x000000, 0)
  scene = new Scene(); world = new Group(); scene.add(world)
  camera = new PerspectiveCamera(FOV, W / H, 0.1, 200)
  scene.add(new AmbientLight(0xffffff, 0.55))
  const sun = new DirectionalLight(0xffffff, 1.6); sun.position.set(-4, 10, 7); scene.add(sun)
  const rim = new DirectionalLight(0x9fd8ff, 0.6); rim.position.set(6, 4, -8); scene.add(rim)
  cells = grid()
  let acc = 0; cdf = cells.map((c) => (acc += c.n))
  // the floor: the plot's frame, a faint ground and its grid lines
  const floor = new Mesh(new PlaneGeometry(9.3, 9.3), new MeshBasicMaterial({ color: 0x0a1426, transparent: true, opacity: 0.85 }))
  floor.rotation.x = -Math.PI / 2; floor.position.y = -0.005; world.add(floor)
  const lv = []
  for (let m = 2; m <= 6.5 + 1e-6; m += 0.5) lv.push(wx(m), 0, wz(YL), wx(m), 0, wz(YH))
  for (let m = 16; m <= 26 + 1e-6; m += 2) lv.push(wx(XL), 0, wz(m), wx(XH), 0, wz(m))
  const lg = new BufferGeometry(); lg.setAttribute('position', new BufferAttribute(new Float32Array(lv), 3))
  world.add(new LineSegments(lg, new LineBasicMaterial({ color: 0x5f7fa6, transparent: true, opacity: 0.45 })))
  // the columns
  const box = new BoxGeometry(1, 1, 1); box.translate(0, 0.5, 0)
  bars = new InstancedMesh(box, new MeshLambertMaterial({ color: 0xffffff }), cells.length)
  const cols = new Float32Array(cells.length * 3)
  cells.forEach((c, k) => { const col = colourOf(c.n); cols.set([col.r, col.g, col.b], k * 3) })
  bars.instanceColor = new InstancedBufferAttribute(cols, 3)
  world.add(bars)
  // the falling candidates
  const g = new BufferGeometry()
  g.setAttribute('position', new BufferAttribute(new Float32Array(NSP * 3), 3))
  g.setAttribute('aFrom', new BufferAttribute(new Float32Array(NSP * 3), 3))
  g.setAttribute('aTo', new BufferAttribute(new Float32Array(NSP * 3), 3))
  g.setAttribute('aT0', new BufferAttribute(new Float32Array(NSP).fill(-10), 1))
  sparks = new Points(g, new ShaderMaterial({ vertexShader: SPARK_V, fragmentShader: SPARK_F, transparent: true, depthWrite: false, blending: AdditiveBlending, uniforms: { uTime: { value: 0 }, uScale: { value: 1 } } }))
  sparks.frustumCulled = false
  world.add(sparks)
  resize()
  return true
}
function resize() {
  if (!renderer || !root.value) return
  const r = root.value.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr))
  if (cv.value.width !== w || cv.value.height !== h) renderer.setSize(w, h, false)
  if (sparks) sparks.material.uniforms.uScale.value = h / 900
}

const ease = (x) => { x = Math.min(Math.max(x, 0), 1); return x * x * (3 - 2 * x) }
// the timeline (s): the candidates fall 0.5–9 (seen from above, the cells lighting flat); the tilt 6–10; the
// columns rise 7–13; the names and the bands' light at 12.5; then a slow turn
const T_TILT = 6, T_RISE = 7, T_NAME = 12.5
// the P_c names: at m²(K p), m²(J/ψ p); the top of the band's columns there and the name's foot (over the band)
// or head (under it), in world units. On the screen the bands rise to the right through the whole turn, so
// the upper name sits up and left of its line and the lower name down and right of its own (.nw, .se):
// centred on the line, a name's far end met its own band in the turn's left half
const PC = [
  [5.7, 19.82, 0.43, 0.9, 'P<sub>c</sub>(4440)<sup>+</sup>, P<sub>c</sub>(4457)<sup>+</sup>', 'feat nw'],
  [4.3, 18.625, 0.44, -0.05, 'P<sub>c</sub>(4312)<sup>+</sup>', 'feat se'],
]
const dummy = new Object3D()
let nextSpark = 0, lastSpawn = 0
function update(t) {
  const tilt = ease((t - T_TILT) / 4)
  const turn = t > T_RISE ? 0.32 * Math.sin((t - T_RISE) * 0.11) : 0
  // the camera: straight down at first (far up the screen), then 58° from the vertical, a little to the left
  const polar = 0.02 + tilt * 1.0, az = -0.42 * tilt + turn
  // every label stays inside the frame and above the caption (its box starts at y = 460 of 551): from above,
  // through the tilt and round the whole turn (57 s). The coming closer lags the tilt (tilt²), or the plot
  // grows before it foreshortens; the point looked at sits toward the viewer, which lifts the plot in the frame
  const dist = 21.5 - 6.5 * tilt * tilt
  const tgt = new Vector3(-1.2 * tilt, -0.15 * tilt, 1.7 + 0.6 * tilt ** 1.5)
  camera.position.set(tgt.x + dist * Math.sin(polar) * Math.sin(az), tgt.y + dist * Math.cos(polar), tgt.z + dist * Math.sin(polar) * Math.cos(az))
  camera.up.set(0, 1, 0)
  camera.lookAt(tgt)
  // the cells: lit as their candidates arrive, then risen to their counts
  // F: the share of the sample that has landed, 0 → 1 over 0.5–9.5 s; a cell lights when its first candidate
  // does (the dense ridge and band first, the thin edges last) and brightens as its count fills
  const F = Math.min(1, Math.max(0, (t - 0.5) / 9)), rise = ease((t - T_RISE) / 6)
  // nm: the names and the bands' light, 0 → 1 from T_NAME; the colours are painted while either changes
  const nm = ease((t - T_NAME) / 1)
  const paint = F < 1 || !bars.userData.done || bars.userData.nm !== nm
  const cc = bars.instanceColor.array
  cells.forEach((c, k) => {
    const f = F >= c.first ? Math.min(1, F * 1.05) : 0
    if (paint) {
      const col = colourOf(Math.max(1, c.n * F))
      if (c.band && nm > 0) col.lerp(LIT, LIT_K * nm)
      cc[k * 3] = col.r; cc[k * 3 + 1] = col.g; cc[k * 3 + 2] = col.b
    }
    // a cell shows once its first candidates have landed: flat and lit, then risen to its count
    const hh = Math.max(0.006, c.h * rise * f)
    dummy.position.set(c.x, 0, c.z)
    if (f <= 0) dummy.scale.set(0, 0, 0)
    else dummy.scale.set(BX * SX * 0.98, hh, BY * SZ * 0.98)
    dummy.updateMatrix()
    bars.setMatrixAt(k, dummy.matrix)
  })
  bars.instanceMatrix.needsUpdate = true
  if (paint) { bars.instanceColor.needsUpdate = true; bars.userData.done = F >= 1; bars.userData.nm = nm }
  // the falling candidates, at a rate that follows the filling
  const u = sparks.material.uniforms; u.uTime.value = t
  if (t > 0.4 && t < 10) {
    const rate = 260 * (0.3 + Math.sin(Math.PI * Math.min(1, (t - 0.4) / 9.6)))
    const n = Math.min(80, Math.floor((t - lastSpawn) * rate))
    if (n > 0) {
      lastSpawn = t
      const g = sparks.geometry, F = g.attributes.aFrom.array, To = g.attributes.aTo.array, T0 = g.attributes.aT0.array
      for (let s = 0; s < n; s++) {
        const c = pick(), k = nextSpark++ % NSP
        const x = c.x + (Math.random() - 0.5) * BX * SX, z = c.z + (Math.random() - 0.5) * BY * SZ
        F.set([x, 4 + 3 * Math.random(), z], k * 3); To.set([x, c.h * rise + 0.02, z], k * 3); T0[k] = t
      }
      g.attributes.aFrom.needsUpdate = true; g.attributes.aTo.needsUpdate = true; g.attributes.aT0.needsUpdate = true
    }
  }
  // the labels: the axes' names and ticks, the features once risen
  labels.length = 0; leads.length = 0
  const lab = (x, y, z, html, cls, op = 1) => { const p = proj(x, y, z); if (p) labels.push({ ...p, html, cls, op }) }
  for (const m of [2, 3, 4, 5, 6]) lab(wx(m), 0, wz(YL) + 0.35, String(m), 'tick')
  for (const m of [16, 18, 20, 22, 24, 26]) lab(wx(XL) - 0.35, 0, wz(m), String(m), 'tick r')
  // the x axis's name moves out from its ticks as the plot tilts: seen at a low angle the gap between the two
  // rows closes, and in the turn's left half the "4" stood on the name
  lab(0, 0, wz(YL) + 1.0 + 0.7 * tilt * tilt, 'm<sup>2</sup>(K<sup>−</sup> p) &nbsp;[GeV<sup>2</sup>]', 'axis')
  lab(wx(XL) - 1.25, 0, wz(21.2), 'm<sup>2</sup>(J/ψ p)<br>[GeV<sup>2</sup>]', 'axis r')
  if (nm > 0) {
    lab(wx(2.31), 2.25, wz(24.6), 'Λ(1520)', 'feat', nm)
    // the bands are low (their columns stand ~0.4, the Λ(1520) ridge 2.4), so each name is close to its band
    // with a thin line to the band's top: the upper band's name stands over it, the lower band's hangs under
    // it, and neither name covers the other band
    for (const [mx, my, top, at, html, cls] of PC) {
      const x = wx(mx), z = wz(my), a = proj(x, at, z), b = proj(x, top, z)
      lab(x, at, z, html, cls, nm)
      if (a && b) leads.push({ x1: a.x, y1: a.y, x2: b.x, y2: b.y, op: nm })
    }
  }
}
const v3 = new Vector3()
function proj(x, y, z) {
  v3.set(x, y, z); world.localToWorld(v3)
  const v = v3.project(camera)
  if (v.z > 1) return null
  return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H }
}

function frame(now) {
  if (!running) return
  const t = (now - t0) / 1000
  resize(); update(t); renderer.render(scene, camera)
  raf = requestAnimationFrame(frame)
}
function start() {
  stop()
  if (!build()) return
  lastSpawn = 0; nextSpark = 0; bars.userData.done = false
  sparks.geometry.attributes.aT0.array.fill(-10); sparks.geometry.attributes.aT0.needsUpdate = true
  t0 = performance.now(); running = true
  raf = requestAnimationFrame(frame)
}
function stop() { running = false; cancelAnimationFrame(raf); raf = 0 }
function dispose() {
  stop()
  if (!renderer) return
  scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.() })
  renderer.dispose(); renderer.forceContextLoss?.(); renderer = null
}
// 12 Nov: the renderer is kept while the component lives (as QuarkRecipes.vue, where the owner saw it: "not
// refreshable"). Ending it with forceContextLoss() on leaving left the <canvas> with a lost context, and the
// renderer made on the next visit drew nothing. The context is given up only on unmount.
watch([active, live], ([on, isLive]) => {
  if (on && isLive) requestAnimationFrame(() => { if (active.value && live.value) start() })
  else stop()
})
onMounted(() => { if (active.value && live.value) start() })
onBeforeUnmount(dispose)
</script>

<template>
  <div ref="root" class="dz" :class="{ still }">
    <canvas v-show="!still" ref="cv" class="dz-gl" />
    <img v-if="still" class="dz-still" :src="stillSrc" alt="LHCb 2019: the Dalitz plot of Λb⁰ → J/ψ p K⁻ in 3D, the Λ(1520) ridge and the P_c bands" />
    <template v-if="!still">
      <svg class="dz-leads"><line v-for="(l, i) in leads" :key="i" :x1="l.x1" :y1="l.y1" :x2="l.x2" :y2="l.y2" :opacity="l.op" /></svg>
      <div v-for="(l, i) in labels" :key="i" :class="['dl', l.cls]" :style="{ transform: `translate(${l.x}px, ${l.y}px)`, opacity: l.op }" v-html="l.html" />
    </template>
  </div>
</template>

<style scoped>
.dz { position: absolute; inset: 0; pointer-events: none; font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif; }
.dz-gl { position: absolute; inset: 0; width: 100%; height: 100%; }
.dz-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.dz-leads { position: absolute; left: 0; top: 0; width: 100%; height: 100%; overflow: visible; }
.dz-leads line { stroke: #e8f6ff; stroke-width: 1; }
.dl { position: absolute; left: 0; top: 0; white-space: nowrap; line-height: 1.15; text-shadow: 0 0 6px rgba(0, 0, 0, 0.95); }
.dl.tick { font-size: 18px; color: #c9dcf0; translate: -50% -50%; }
.dl.tick.r { translate: -100% -50%; }
.dl.axis { font-size: 19px; color: #e8f6ff; font-weight: 500; translate: -50% -50%; text-align: center; }
.dl.axis.r { translate: -100% -50%; text-align: right; }
.dl.feat { font-size: 20px; color: #ffffff; font-weight: 600; translate: -50% -100%; padding: 3px 8px; border-radius: 5px; background: rgba(3, 5, 12, 0.6); }
.dl.feat.nw { translate: -92% -100%; }
.dl.feat.se { translate: -8% 0; }
</style>
