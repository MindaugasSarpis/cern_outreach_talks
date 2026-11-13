<script setup>
// <QuarkRecipes />: the six quarks in the Standard Model's frame, then the recipes one after another (owner,
// 5 Nov 2026: "a frame of all SM quarks, and then how they form baryons and mesons, with different combinations
// (like an active slide, many of them)"; "just t quark doesn't hadronize").
//
// 10 Nov (the owner: "maybe a bit less pastel colors, make them volumetric, propagating in the 3d space (but
// within slide) and then the pentaquark in the very front full screen"): the frame stays flat at the left (sharp
// text); the hadrons are a small three.js scene of their own over the right of the slide. Each quark is a glowing
// ball (a hot core, a turbulent body, a rim; an antiquark a bright shell round a dark middle) in its flavour's
// colour; it leaves its cell in the frame and flies into the depth to its hadron, which forms inside a
// faint bag, takes its name and drifts towards the camera while the whole set turns a little, so the depths read.
// Mesons, then baryons; then the set falls back and dims, the five quarks of P_c⁺ (u u d c c̄) gather in the
// middle and the pentaquark comes forward until it fills the screen. Runs once on entering (~32 s) and holds;
// off the live slide (overview, print, the presenter's preview, no WebGL) it shows its last frame as a picture
// (public/figures/recipes_end.jpg).
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useIsSlideActive, useNav, useSlideContext } from '@slidev/client'
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, SphereGeometry, ShaderMaterial, AdditiveBlending,
  Color, Vector3, Sprite, SpriteMaterial, CanvasTexture, MeshPhysicalMaterial, PMREMGenerator, DirectionalLight,
  AmbientLight, ACESFilmicToneMapping, BackSide, FrontSide,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { createInterior } from './interiors.js'
import { heartbeat } from './heartbeat.js'

// 10 Nov, later (the owner: "a bit too colorful, make photorealistic"): deeper, natural colours on lit, glossy
// balls; `ui` a lighter tone of each for the letters in the frame.
// 12 Nov (the owner: "too colorful, need to be a bit more blue, dark blue, see through, photo realistic"): every
// flavour a dark blue glass ball, the six told apart by a step of hue inside blue (cyan to indigo) and by the
// letter each carries; no red, amber, green or violet. See makeQuark for the glass.
const FLAV = {
  u: { name: 'up', col: '#1c50b4', ui: '#8fbcf5', cell: [0, 0] },
  c: { name: 'charm', col: '#12779c', ui: '#86d2ec', cell: [1, 0] },
  t: { name: 'top', col: '#3a4660', ui: '#8c9ab3', cell: [2, 0] },
  d: { name: 'down', col: '#102a7c', ui: '#7f9fe6', cell: [0, 1] },
  s: { name: 'strange', col: '#17506f', ui: '#7fbbdc', cell: [1, 1] },
  b: { name: 'bottom', col: '#282c92', ui: '#9a9ee8', cell: [2, 1] },
}
// the frame: cells 92 px, 10 px apart, from (56, 128), on the 980 × 551 slide
const W = 980, H = 551.25
const CX = 56, CY = 128, CELL = 92, GAP = 10
const cellCentre = (q) => { const [i, j] = FLAV[q].cell; return [CX + i * (CELL + GAP) + CELL / 2, CY + j * (CELL + GAP) + 38] }

// quark content: a lower-case letter, '~' before it for the antiquark; [name, content, screen x, screen y, depth]
const MESONS = [
  ['π<sup>+</sup>', 'u ~d', 480, 128, 15], ['K<sup>+</sup>', 'u ~s', 568, 112, 20], ['D<sup>0</sup>', 'c ~u', 656, 138, 15],
  ['J/ψ', 'c ~c', 744, 112, 20], ['B<sup>+</sup>', 'u ~b', 832, 138, 15], ['Υ', 'b ~b', 912, 118, 20],
]
const BARYONS = [
  ['p', 'u u d', 500, 296, 15], ['n', 'u d d', 600, 276, 20], ['Λ', 'u d s', 700, 300, 15], ['Ω<sup>−</sup>', 's s s', 800, 276, 20],
  ['Λ<sub>c</sub><sup>+</sup>', 'u d c', 895, 300, 16], ['Ξ<sub>cc</sub><sup>++</sup>', 'u c c', 640, 410, 19], ['Λ<sub>b</sub><sup>0</sup>', 'u d b', 780, 410, 17],
]
const PENTA = ['P<sub>c</sub><sup>+</sup>', 'u u d c ~c']
const FOV = 40
const tanH = Math.tan((FOV / 2) * Math.PI / 180)
// a slide point at a depth from the camera (the camera at the origin, looking down −z)
const at = (x, y, depth) => {
  const nx = (x / W) * 2 - 1, ny = 1 - (y / H) * 2
  return new Vector3(nx * depth * tanH * (W / H), ny * depth * tanH, -depth)
}

const { $renderContext } = useSlideContext()
const nav = useNav()
const active = useIsSlideActive()
const live = computed(() => ['slide', 'presenter'].includes($renderContext?.value) && !nav.isPrintMode?.value)
const stillSrc = `${import.meta.env.BASE_URL}figures/recipes_end.jpg`
const gl = ref(true)                      // false: no WebGL here, the picture stands in
const still = computed(() => !live.value || !gl.value)

const frameIn = ref(0)
const topDim = ref(false)
const phase = ref('Quarks: six flavours')
const frameOut = ref(false)
const labels = reactive([])               // { html, x, y, size, op, cls }

const root = ref(null), cv = ref(null)
let renderer, scene, camera, world, raf = 0, t0 = 0, timers = [], hadrons = [], running = false

// ---- the balls --------------------------------------------------------------------------------------------
let glowTex = null
function glowTexture() {
  if (glowTex) return glowTex
  const c = document.createElement('canvas'); c.width = c.height = 128
  const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64)
  r.addColorStop(0, 'rgba(255,255,255,0.9)'); r.addColorStop(0.25, 'rgba(255,255,255,0.35)'); r.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = r; g.fillRect(0, 0, 128, 128)
  glowTex = new CanvasTexture(c)
  return glowTex
}
const sphere = new SphereGeometry(1, 48, 32)

// glass: the ball is see-through in its middle and dense at its edge, as a sphere of tinted glass is. Three's
// physical material has one opacity for the whole surface, so its alpha is scaled here by the view angle:
// `uCore` of it where the surface faces the camera, all of it at the grazing edge.
function glass(mat, core) {
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uCore = { value: core }
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform float uCore;')
      .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
        { float qf = 1.0 - clamp(abs(dot(normalize(normal), normalize(vViewPosition))), 0.0, 1.0);
          diffuseColor.a *= mix(uCore, 1.0, qf * qf); }`)
  }
  mat.customProgramCacheKey = () => 'qr-glass'
  return mat
}
function makeQuark(q, anti) {
  // a ball of dark blue glass under a cool studio light: a polished clear coat that mirrors the room, the body
  // tinted and see-through (the far wall drawn first, darker, then the near one), a faint light of its own so it
  // does not go black against the dark. An antiquark is the same glass nearly emptied: a thin bright shell.
  const col = new Color(FLAV[q].col)
  const base = anti ? 0.5 : 0.92
  const back = new Mesh(sphere, glass(new MeshPhysicalMaterial({
    color: col.clone().multiplyScalar(anti ? 0.25 : 0.45), roughness: 0.3, metalness: 0, side: BackSide,
    envMapIntensity: 0.25, emissive: col, emissiveIntensity: anti ? 0.02 : 0.05, transparent: true, opacity: 0, depthWrite: false,
  }), anti ? 0.15 : 0.55))
  const m = new Mesh(sphere, glass(new MeshPhysicalMaterial({
    color: anti ? col.clone().multiplyScalar(0.5) : col, roughness: 0.08, metalness: 0, side: FrontSide,
    clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: anti ? 1.0 : 0.6, ior: 1.5, specularIntensity: 1,
    emissive: col, emissiveIntensity: anti ? 0.03 : 0.07, transparent: true, opacity: 0, depthWrite: false,
  }), anti ? 0.08 : 0.3))
  back.renderOrder = 0; m.renderOrder = 1
  const glow = new Sprite(new SpriteMaterial({ map: glowTexture(), color: col, transparent: true, blending: AdditiveBlending, depthWrite: false, opacity: 0 }))
  glow.scale.setScalar(3.0)
  const g = new Group(); g.add(glow); g.add(back); g.add(m)
  return { g, m, back, glow, q, anti, base }
}
const SHELL_V = /* glsl */ `
varying vec3 vN, vV;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`
const SHELL_F = /* glsl */ `
uniform float uOp;
varying vec3 vN, vV;
void main() {
  float f = clamp(dot(normalize(vN), normalize(vV)), 0.0, 1.0);
  float edge = pow(1.0 - f, 4.0);
  // a glass skin: its edge catches the light, its face nearly clear, a soft highlight up and to the left
  float hl = pow(max(dot(normalize(vN), normalize(vec3(-0.45, 0.6, 0.65))), 0.0), 40.0);
  float a = uOp * (0.65 * edge + 0.03 + 0.5 * hl);
  gl_FragColor = vec4(vec3(0.62, 0.8, 1.0) * a, a);
}`
function makeBag() {
  // the hadron's skin: a thin glass shell that only shows where it catches the light
  return new Mesh(sphere, new ShaderMaterial({
    vertexShader: SHELL_V, fragmentShader: SHELL_F, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uOp: { value: 0 } },
  }))
}

// ---- the hadrons ------------------------------------------------------------------------------------------
const ease = (x) => { x = Math.min(Math.max(x, 0), 1); return x * x * (3 - 2 * x) }
const easeIO = (x) => { x = Math.min(Math.max(x, 0), 1); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2 }
function offsets(n) {
  if (n === 2) return [[-0.62, 0.08, 0.15], [0.62, -0.08, -0.15]]
  if (n === 3) return [0, 1, 2].map((i) => { const a = -Math.PI / 2 + (2 * Math.PI * i) / 3; return [Math.cos(a) * 0.72, Math.sin(a) * 0.72, (i - 1) * 0.25] })
  return [[-0.85, 0.55, 0.3], [-0.95, -0.6, -0.25], [0.05, -0.15, -0.65], [0.85, 0.55, 0.15], [0.8, -0.65, 0.35]]
}
function makeHadron([name, content, x, y, depth], kind) {
  const qs = content.split(' ').map((s) => ({ q: s.replace('~', ''), anti: s.startsWith('~') }))
  const home = at(x, y, depth)
  const R = kind === 'penta' ? 0.5 : 0.36                     // a quark's radius, world units
  const g = new Group(); g.position.copy(home); world.add(g)
  const bag = makeBag(); bag.scale.setScalar(R * (qs.length === 2 ? 2.6 : qs.length === 3 ? 2.75 : 3.75)); g.add(bag)
  const off = offsets(qs.length).map((v) => new Vector3(...v).multiplyScalar(R * (qs.length === 5 ? 2.15 : 1.55)))
  const quarks = qs.map((o, k) => {
    const b = makeQuark(o.q, o.anti); b.g.scale.setScalar(R); world.add(b.g)
    return { ...b, off: off[k], from: at(...cellCentre(o.q), 9), seed: Math.random() * 6.28 }
  })
  return {
    name, kind, g, bag, quarks, home, depth, born: -1, R,
    label: qs.map((o) => (o.anti ? `<span class="bar">${o.q}</span>` : o.q)).join(''),
    drift: new Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.03, 0.05 + Math.random() * 0.04),
    fade: 1,
  }
}

// ---- the timeline (seconds from the start) ------------------------------------------------------------------
const FLY = 1.3
const T_MES = 3.4, T_BAR = 11.2, T_PENTA = 20.4, T_FRONT = 24.0
let pq = null
// 13 Nov (the owner: "Slide 7 pentaquark has to be much more substantial, now the letters are also jittery, the sphere
// should be dynamic, not just round … slide 7 something like 14"): as the pentaquark comes to the front the five glass
// balls give way to slide 14's compact particle (setup/interiors.js): five balls of grains with hot cores, each on its
// own loop, in a skin that ripples. `pin` is that form; PIN its size against the glass particle's.
let pin = null
const PIN = 0.72
function schedule() {
  hadrons.forEach((h, i) => {
    if (h.kind === 'meson') h.born = T_MES + 0.6 + (i) * 0.95
    else if (h.kind === 'baryon') h.born = T_BAR + 0.6 + (i - MESONS.length) * 0.95
  })
  pq.born = T_PENTA + 0.4
}

function update(t) {
  const camYaw = 0.07 * Math.sin(t * 0.12) + (t > T_PENTA ? -0.05 * ease((t - T_PENTA) / 3) : 0)
  world.rotation.y = camYaw
  world.rotation.x = 0.03 * Math.sin(t * 0.09)
  const back = ease((t - T_PENTA) / 2.5)                       // the set falls back as the pentaquark comes
  const front = easeIO((t - T_FRONT) / 4.2)                    // the pentaquark comes to the front
  labels.length = 0
  for (const h of hadrons) {
    const age = h.born < 0 ? -1 : t - h.born
    const isP = h.kind === 'penta'
    // the hadron's centre: home, drifting towards the camera; the set pushed back and dimmed at the end
    const p = h.home.clone()
    if (!isP && age > 0) p.addScaledVector(h.drift, Math.min(age, 30))
    if (!isP) p.z -= 9 * back
    if (isP) {
      // from the middle at depth 13 to the very front: the pentaquark fills the screen
      const near = at(W * 0.58, H * 0.48, 4.9)
      p.lerp(near, front)
    }
    h.g.position.copy(p)
    const dim = isP ? 1 - ease((front - 0.25) / 0.5) : (1 - 0.8 * back) * (1 - 0.9 * front)
    const formed = ease((age - FLY) / 0.6)
    h.bag.material.uniforms.uOp.value = formed * dim * (isP ? 0.7 : 0.6)
    h.bag.rotation.y = t * 0.2
    h.quarks.forEach((qb, k) => {
      // each quark flies from its cell in the frame (near the camera) along an arc into its place, then moves
      // a little about it, the hadron turning slowly
      const u = easeIO(age / FLY)
      const spin = (isP ? 0.45 * t - 0.3 * front * (t - T_FRONT) : 0.6 * t) + h.depth
      // the small ones turn mostly in the screen's plane, so a pair never hides one behind the other
      const o = qb.off.clone().applyAxisAngle(isP ? Y_AXIS : SPIN_AXIS, spin).applyAxisAngle(X_AXIS, 0.3 * Math.sin(t * 0.4 + k))
      o.multiplyScalar(1 + 0.06 * Math.sin(t * 1.7 + qb.seed))
      const target = p.clone().add(o)
      const pos = qb.from.clone().lerp(target, u)
      pos.y += Math.sin(Math.PI * u) * 1.2
      qb.g.position.copy(world.worldToLocal ? pos : pos)
      const vis = age < 0 ? 0 : Math.min(1, age / 0.25)
      qb.m.material.opacity = qb.base * vis * dim
      qb.back.material.opacity = qb.base * vis * dim
      qb.glow.material.opacity = 0.07 * vis * dim
      qb.m.rotation.y = t * 0.3 + qb.seed
      // the quark's letter on its ball
      if (vis > 0.05) {
        const s = project(qb.g, h.R)
        if (s && s.size > 5) labels.push({ html: qb.anti ? `<span class="bar">${qb.q}</span>` : qb.q, x: s.x, y: s.y, size: Math.min(s.size * 0.95, isP ? 120 : 26), op: vis * dim, cls: 'ql' })
      }
    })
    // the hadron's name and content under it, once formed
    if (formed > 0.02) {
      const s = project(h.g, h.R * (h.quarks.length === 2 ? 2.6 : 2.75))
      if (s) {
        if (isP) {
          const big = 2.4
          // under the particle while it forms; top left, large, once it is in front
          if (front < 0.5) labels.push({ html: `<span class="n">${h.name}</span><span class="c">${h.label}</span>`, x: s.x, y: s.y + s.size + 8, size: 24, op: formed * (1 - 2 * front), cls: 'hl' })
          else labels.push({ html: `<span class="n">${h.name}</span><span class="c">${h.label}</span>`, x: 64, y: 48, size: 22 * big, op: Math.min(1, (front - 0.5) * 3), cls: 'hl left' })
        } else labels.push({ html: `<span class="n">${h.name}</span><span class="c">${h.label}</span>`, x: s.x, y: s.y + s.size + 6, size: Math.max(18, Math.min(24, 300 / h.depth)), op: formed * dim, cls: 'hl' })
      }
    }
  }
  // glass is see-through: the far balls are drawn first, the near ones over them
  // the pentaquark in grains, in front
  if (pin) {
    const fr = easeIO((t - T_FRONT) / 4.2), k = ease((fr - 0.25) / 0.5)
    pin.points.position.copy(pq.g.position)
    pin.points.visible = k > 0.001
    pin.uniforms.uAlpha.value = 0.8 * k
    pin.move(t)
    if (k > 0.05) {
      pin.points.updateMatrixWorld()
      pin.centres.forEach((c, i) => {
        tmp.copy(c); pin.points.localToWorld(tmp)
        const d = -tmp.z; if (d < 0.3) return
        const v = tmp.clone().project(camera), f = pin.quarks[i]
        const size = (pin.radius * PIN / (d * tanH)) * (H / 2)
        labels.push({ html: f === 'cbar' ? '<span class="bar">c</span>' : f, x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, size: Math.min(size * 0.8, 130), op: k, cls: 'ql' })
      })
    }
  }
  for (const qb of hadrons.flatMap((h) => h.quarks)) qb.g.renderOrder = qb.g.position.z
}
const tmp = new Vector3()
const Y_AXIS = new Vector3(0, 1, 0), X_AXIS = new Vector3(1, 0, 0), SPIN_AXIS = new Vector3(0.18, 0.3, 1).normalize()
function project(obj, r) {
  obj.getWorldPosition(tmp)
  const d = -tmp.z
  if (d < 0.3) return null
  const v = tmp.clone().project(camera)
  return { x: (v.x + 1) / 2 * W, y: (1 - v.y) / 2 * H, size: (r / (d * tanH)) * (H / 2) }
}

// ---- running ----------------------------------------------------------------------------------------------
function build() {
  if (renderer) return true
  try {
    renderer = new WebGLRenderer({ canvas: cv.value, antialias: true, alpha: true, premultipliedAlpha: true, powerPreference: 'high-performance' })
  } catch (e) { gl.value = false; return false }
  cv.value.addEventListener('webglcontextlost', onLost); cv.value.addEventListener('webglcontextrestored', onRestored)
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = ACESFilmicToneMapping; renderer.toneMappingExposure = 0.8
  scene = new Scene(); world = new Group(); scene.add(world)
  const pm = new PMREMGenerator(renderer)
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
  pm.dispose()
  const key = new DirectionalLight('#e6efff', 2.6); key.position.set(-5, 6, 8); scene.add(key)
  const rim = new DirectionalLight('#8fb8ff', 1.6); rim.position.set(6, 2, -6); scene.add(rim)
  scene.add(new AmbientLight('#9fc0ff', 0.14))
  camera = new PerspectiveCamera(FOV, W / H, 0.1, 200)
  hadrons = [...MESONS.map((m) => makeHadron(m, 'meson')), ...BARYONS.map((b) => makeHadron(b, 'baryon'))]
  pq = makeHadron([...PENTA, W * 0.6, H * 0.5, 13], 'penta'); hadrons.push(pq)
  // (13 Nov, the owner: "also needs to be better resolved": two and a half times the grains at well under two thirds the
  // size, so each ball is made of fine points and not of soft discs)
  // (14 Nov, the owner: "better resolve, I don't like the fuzzyness but the overall view is good": the same picture from
  // hard-edged points (`crisp`), more of them and smaller)
  pin = createInterior({ kind: 'spread', quark: 0.78, grains: 32000, shell: 52000, size: 0.6, alpha: 0, display: true, crisp: true })
  pin.points.scale.setScalar(PIN); pin.points.renderOrder = 1e4; pin.points.visible = false
  world.add(pin.points)
  schedule()
  resize()
  return true
}
function resize() {
  if (!renderer || !root.value) return
  const r = root.value.getBoundingClientRect()
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const w = Math.max(2, Math.round(r.width * dpr)), h = Math.max(2, Math.round(r.height * dpr))
  if (cv.value.width !== w || cv.value.height !== h) renderer.setSize(w, h, false)
  if (pin) pin.uniforms.uPixelRatio.value = h / 900   // the grains' size follows the picture's height, as on the stage
}
function frame(now) {
  if (!running) return
  const t = (now - t0) / 1000
  resize()
  update(t)
  renderer.render(scene, camera)
  raf = requestAnimationFrame(frame)
}
const later = (s, fn) => timers.push(setTimeout(fn, s * 1000))
function start() {
  stop()
  if (!build()) return
  frameIn.value = 0; topDim.value = false; frameOut.value = false; phase.value = 'Quarks: six flavours'
  for (let i = 1; i <= 6; i++) later(0.3 + i * 0.16, () => { frameIn.value = i })
  later(2.6, () => { topDim.value = true })
  later(T_MES, () => { phase.value = 'Mesons: a quark and an antiquark' })
  later(T_BAR, () => { phase.value = 'Baryons: three quarks' })
  later(T_PENTA, () => { phase.value = 'Pentaquark: five quarks' })
  later(T_FRONT + 0.6, () => { frameOut.value = true })
  // 13 Nov: a heartbeat as the pentaquark fills the screen; 14 Nov (the owner: "delay to hearbear 5s, also do 4 slow (ar
  // slightly slowing) hearbeats"): 8 s after it starts forward, four of them, 1.3 s apart at first and each gap an eighth longer
  later(T_FRONT + 8.0, () => { if ($renderContext?.value === 'slide') heartbeat(0.9, 4, 1.3, 1.12) })
  t0 = performance.now(); running = true
  raf = requestAnimationFrame(frame)
}
function stop() {
  running = false; cancelAnimationFrame(raf); raf = 0
  timers.forEach(clearTimeout); timers = []
}
// 12 Nov (the owner: "it's not refreshable for some reason"): leaving the slide used to end the renderer with
// forceContextLoss(), and the next start() made a new renderer on the same <canvas>. A canvas keeps its one
// WebGL context for life, so that renderer drew into a lost context: an empty slide on every visit after the
// first, and after a reload whenever Slidev reported the slide inactive for a moment before it settled. Now the
// renderer is kept while the component lives: leaving stops the clock and clears the picture, coming back
// replays from the top on the same renderer; the context is given up only when the component is unmounted.
// A context the browser takes away (a GPU reset) is asked back, and the picture stands in until it returns.
function clear() {
  if (!renderer) return
  for (const h of hadrons) { h.bag.material.uniforms.uOp.value = 0; for (const q of h.quarks) { q.m.material.opacity = 0; q.back.material.opacity = 0; q.glow.material.opacity = 0 } }
  labels.length = 0
  if (pin) { pin.uniforms.uAlpha.value = 0; pin.points.visible = false }
  try { renderer.render(scene, camera) } catch { /* the context is gone */ }
}
function dispose() {
  stop()
  if (!renderer) return
  cv.value?.removeEventListener('webglcontextlost', onLost); cv.value?.removeEventListener('webglcontextrestored', onRestored)
  scene.traverse((o) => { o.material?.dispose?.() })
  scene.environment?.dispose?.()
  renderer.dispose(); renderer.forceContextLoss?.(); renderer = null
}
function onLost(e) { e.preventDefault(); stop(); gl.value = false }
function onRestored() { gl.value = true; if (active.value && live.value) requestAnimationFrame(() => start()) }
watch([active, live], ([on, isLive]) => {
  if (on && isLive) requestAnimationFrame(() => { if (active.value && live.value) start() })
  else { stop(); clear() }
})
onMounted(() => { if (active.value && live.value) start() })
onBeforeUnmount(dispose)
</script>

<template>
  <div ref="root" class="qr" :class="{ still, out: frameOut }">
    <canvas v-show="!still" ref="cv" class="qr-gl" />
    <img v-if="still" class="qr-still" :src="stillSrc" alt="The six quarks and the hadrons made of them; the pentaquark P_c⁺ (u u d c c̄) in front" />
    <template v-if="!still">
      <!-- the frame: up, charm, top over down, strange, bottom -->
      <div class="qr-frame" :style="{ left: CX - 12 + 'px', top: CY - 12 + 'px', width: 3 * CELL + 2 * GAP + 24 + 'px', height: 2 * CELL + GAP + 24 + 'px' }" />
      <template v-for="(f, q, n) in FLAV" :key="q">
        <div class="qr-cell" :class="{ on: frameIn > n, dim: q === 't' && topDim }"
          :style="{ left: CX + f.cell[0] * (CELL + GAP) + 'px', top: CY + f.cell[1] * (CELL + GAP) + 'px', width: CELL + 'px', height: CELL + 'px', '--col': f.ui }">
          <span class="sym">{{ q }}</span><span class="nm">{{ f.name }}</span>
        </div>
      </template>
      <div class="qr-topnote" :class="{ on: topDim }" :style="{ left: CX + 'px', top: CY + 2 * CELL + GAP + 22 + 'px' }">top decays before it can bind</div>
      <div v-for="(l, i) in labels" :key="i" :class="l.cls" :style="l.cls === 'ql'
        ? { transform: `translate(${l.x}px, ${l.y}px) translate(-50%, -50%) scale(${(l.size / 48).toFixed(4)})`, fontSize: '48px', opacity: l.op }
        : { transform: `translate(${l.x}px, ${l.y}px) translate(${l.cls.includes('left') ? '0' : '-50%'}, 0)`, fontSize: l.size + 'px', opacity: l.op }" v-html="l.html" />
      <div class="cap qr-cap">{{ phase }}</div>
    </template>
  </div>
</template>

<style scoped>
.qr { position: absolute; inset: 0; pointer-events: none; font-family: "Helvetica Neue", Helvetica, Arial, "Liberation Sans", sans-serif; }
.qr-gl { position: absolute; inset: 0; width: 100%; height: 100%; }
.qr-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.qr-frame { position: absolute; border: 1px solid rgba(159, 216, 255, 0.35); border-radius: 12px; background: rgba(3, 5, 12, 0.6); transition: opacity 1.2s ease; }
.qr-cell {
  position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
  border-radius: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  opacity: 0; transform: scale(0.85); transition: opacity 0.5s ease, transform 0.5s ease, filter 0.8s ease;
}
.qr-cell.on { opacity: 1; transform: none; }
.qr-cell.dim { opacity: 0.32; filter: grayscale(1); }
.qr-cell .sym { font-size: 42px; font-weight: 700; line-height: 1; color: var(--col); }
.qr-cell .nm { font-size: 18px; color: #e3efff; letter-spacing: 0.03em; }
.qr-topnote { position: absolute; font-size: 18px; color: #9fb4c8; opacity: 0; transition: opacity 0.8s ease; }
.qr-topnote.on { opacity: 1; }
/* the frame steps aside as the pentaquark fills the screen */
.qr.out .qr-frame, .qr.out .qr-cell.on, .qr.out .qr-topnote.on { opacity: 0; transition: opacity 1.2s ease; }
.ql { position: absolute; left: 0; top: 0; transform-origin: 50% 50%; will-change: transform; font-weight: 700; color: #fff; line-height: 1; text-shadow: 0 0 6px rgba(0, 0, 0, 0.95), 0 0 2px rgba(0, 0, 0, 1); white-space: nowrap; }
.hl { position: absolute; left: 0; top: 0; display: flex; flex-direction: column; align-items: center; white-space: nowrap; line-height: 1.1; }
.hl.left { align-items: flex-start; }
.hl :deep(.n) { font-weight: 600; color: #f2f8ff; text-shadow: 0 0 8px rgba(0, 0, 0, 0.9); }
.hl :deep(.c) { margin-top: 0.3em; font-size: max(18px, 0.8em); color: #9fd8ff; letter-spacing: 0.08em; text-shadow: 0 0 8px rgba(0, 0, 0, 0.9); }
/* the antiquark's bar, drawn over its letter (an overline sat far above the letter at large sizes) */
:deep(.bar) { position: relative; display: inline-block; }
/* 12 Nov (the owner: "antiquarks formatted weird, bar is too close"): the bar stood on the letters' tops and ran into the
   stems of b and d; it stands clear of them now */
:deep(.bar)::before { content: ''; position: absolute; left: 0.06em; right: 0.06em; top: -0.17em; height: 0.07em; background: currentColor; border-radius: 0.04em; }
.qr-cap { max-width: 330px; }
</style>
