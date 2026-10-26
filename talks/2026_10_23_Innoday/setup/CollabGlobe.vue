<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { collab, T, sampleFrame, placeAlongRays } from './globe.js'
import { places } from './afterCover.js'

// <CollabGlobe src="figures/lhcb_collaboration.jpg"> numbers </CollabGlobe>, slide 11 (owner,
// 21 Oct: "Slide 11 is a bit of a step back"; the main session took "Photo → globe of
// institutes"). The collaboration photo shows first, full frame (T.hold); then it dissolves into
// its grains, as the opener's last frame does (WebTakeover: a copy of the photo lets go over the
// world, where each grain stands on its pixel's line of sight), and the grains fly onto a slowly
// turning globe of grains (setup/globe.js, the `collab` station): the coastlines faint, the
// institutes bright points, Vilnius a little brighter. The slot (the numbers) comes in on dark
// space beside the globe once the grains have left the photo, so it never covers the photo's
// LHCb banner; mounted then, so its <Count>s count as it comes in. Everything runs on the
// world's clock (globe.js `elapsed`), the copy too.
// The photo holds until the slide's click (owner, 22 Oct: "can we do on click transfer to the
// globe view? I might stay for a minute or so on the photo"; the slide has `clicks: 1`); an
// arrival at the click already (back from slide 12) goes on at once. The recorders
// (window.__rec: the plates, the PPTX's takes) do not wait, so a plate holds the photo T.hold
// as before and the click under it shows the formed globe.
// Without a world (no WebGL, reduced motion, a boot slower than 8 s) the photo holds T.hold and
// fades to the stage's still of this slide (the globe); on the plate layer (v0.8.2) the same,
// once the plate plays. Printed: no photo, the numbers over the still. Elsewhere (overview,
// presenter previews): the photo and the numbers.
const props = defineProps({
  src: { type: String, default: 'figures/lhcb_collaboration.jpg' },
  grains: { type: Number, default: 100000 },   // at tier 0; fewer on a lower tier
  near: { type: Number, default: 7 },
  far: { type: Number, default: 21 },
  gain: { type: Number, default: 1.45 },   // 100k grains carry the photo's light
})
const { $renderContext, $frontmatter, $page, $clicks } = useSlideContext()
const nav = useNav()
const print = computed(() => !!nav.isPrintMode?.value)
const url = computed(() => (props.src.startsWith('/') || /^https?:/.test(props.src)) ? props.src : import.meta.env.BASE_URL + props.src)
const live = computed(() => $renderContext?.value === 'slide' && !print.value)
const root = ref(null)
const still = ref(true)
const fading = ref(false)
const nums = ref(!live.value)
const overlay = ref(null)
const box = ref({ left: 0, top: 0, width: 0, height: 0 })
const gen = ref(0)

let run = 0, raf = 0, gl = null, timers = [], unwatch = null
const later = (ms, fn) => timers.push(setTimeout(fn, ms))
const clear = () => { timers.forEach(clearTimeout); timers = []; cancelAnimationFrame(raf); unwatch?.(); unwatch = null }

// the click that lets the photo go (true), or this run is over (false)
const clicked = () => (($clicks?.value ?? $clicks) || 0) >= 1 || !!window.__rec
function untilClick(id) {
  if (clicked()) return Promise.resolve(true)
  return new Promise((resolve) => {
    unwatch?.()
    const stop = watch(() => $clicks?.value, () => {
      if (id !== run) { stop(); return resolve(false) }
      if (clicked()) { stop(); if (unwatch === off) unwatch = null; resolve(true) }
    })
    const off = () => { stop(); resolve(false) }
    unwatch = off
  })
}

// the photo, decoded once the cover is behind (afterCover.js), and its grains once per tier
let loading = null
const load = () => (loading ||= new Promise((resolve) => places.when(resolve)).then(async () => {
  try { const img = new Image(); img.src = url.value; await img.decode(); return img } catch (e) { console.warn('CollabGlobe:', e); return null }
}))
const SHARE = [1, 0.7, 0.45, 0.3]
let sampled = null
const sampleFor = (img, tier) => {
  if (!sampled || sampled.tier !== tier) sampled = { tier, s: sampleFrame(img, { n: Math.round(props.grains * SHARE[Math.min(3, tier)]) }) }
  return sampled.s
}

function stage() {
  const rootEl = document.querySelector('.stage')
  if (rootEl?.dataset.stageFallback) return null
  const canvas = rootEl?.querySelector('canvas')
  const api = rootEl?.__space, h = canvas?.__space
  const camera = h?.composer?.passes?.[0]?.camera
  if (!api || !h?.scene || !camera) return null
  return { api, h, camera, canvas }
}
const frame = () => new Promise((r) => requestAnimationFrame(() => r()))
async function waitStage(id) {
  for (let i = 0; i < 80; i++) {
    const s = stage()
    if (s || id !== run) return s
    if (document.querySelector('.stage')?.dataset.stageFallback) return null   // no world will come
    await new Promise((r) => setTimeout(r, 100))
  }
  return null
}
// v0.8.2's plate layer: as WebTakeover's (resolves 'playing', 'held', 'none' or null)
const plated = () => document.documentElement.dataset.stageLayer === 'plate'
function untilPlate(id) {
  return new Promise((resolve) => {
    const html = document.documentElement
    let mo = null
    const done = (v) => { mo?.disconnect(); mo = null; resolve(v) }
    const check = () => {
      if (id !== run) return done(null)
      if (html.dataset.stageLayer !== 'plate') return done('none')
      const st = html.dataset.stagePlate
      if (st === 'playing' || st === 'held') done(st)
    }
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (id !== run) return done(null)
      mo = new MutationObserver(check)
      mo.observe(html, { attributes: true, attributeFilter: ['data-stage-layer', 'data-stage-plate'] })
      check()
    }))
  })
}

// no world to dissolve into: the photo holds until the click, then fades to what is under it
async function wallClock(id) {
  const waited = !clicked()
  if (!(await untilClick(id)) || id !== run) return
  const h = waited ? 0.15 : T.hold   // after a click the photo goes at once
  later(h * 1000, () => { if (id === run) fading.value = true })
  later((h + 0.9) * 1000, () => { if (id === run) still.value = false })
  later((h + T.nums) * 1000, () => { if (id === run) nums.value = true })
}

async function takeOver() {
  const id = ++run
  clear()
  still.value = true; fading.value = false; nums.value = false
  collab.pending = true
  try {
    if (plated()) {
      collab.pending = false
      const st = await untilPlate(id)
      if (id !== run) return
      if (st === 'held') { still.value = false; nums.value = true; return }
      return wallClock(id)
    }
    const s = await waitStage(id)
    places.flip()   // past the cover: the photo and the globe's data may load now (after an await: untracked)
    const img = s ? await load() : null
    const g = collab.inst
    const ok = s && img && g && await g.ready
    if (id !== run || !live.value) return
    if (!ok) { collab.pending = false; return wallClock(id) }
    const slide = root.value?.closest('#slide-content') || root.value?.closest('.slidev-slide-content')
    if (!slide) { collab.pending = false; return wallClock(id) }
    const r = slide.getBoundingClientRect()
    box.value = { left: r.left, top: r.top, width: r.width, height: r.height }
    const copy = startGl(img)
    if (copy) drawCopy(-0.1)
    // the camera stands exactly at this slide's pose, under the photo
    await frame()
    if (id !== run) return
    const sp = $frontmatter?.value?.space ?? $frontmatter?.space
    if (sp) s.api.setPose(sp, { immediate: true })
    await frame(); await frame()
    if (id !== run) return
    const sample = sampleFor(img, s.h.tier ?? 0)
    s.camera.updateMatrixWorld()
    const pos = placeAlongRays(sample, s.camera, box.value, s.canvas.getBoundingClientRect(), { near: props.near, far: props.far })
    if (!g.prime(sample, pos, s.camera.position.clone(), { gain: props.gain })) { stopGl(); releaseGl(); collab.pending = false; return wallClock(id) }
    // the world rests (not busy) while the photo waits for the click
    collab.pending = false
    const waited = !clicked()
    if (!(await untilClick(id)) || id !== run) return
    g.start(waited ? T.hold - 0.15 : 0)   // after a click the photo goes at once
    collab.pending = false
    // the copy over the world now shows the photo exactly: the still can go (without a copy
    // it stays, and fades as the grains light)
    if (copy) still.value = false
    let copyDone = !copy
    const step = () => {
      if (id !== run) return
      let e = g.elapsed()
      if (e < 0) e = 1e9   // finished (or finished early): everything at its end
      const u = Math.min(1, Math.max(0, (e - T.hold) / T.dissolve))
      if (!copyDone) {
        drawCopy(-0.1 + 1.25 * u)
        if (u >= 1) { copyDone = true; stopGl(); later(400, () => { if (id === run) releaseGl() }) }
      }
      if (!copy && e >= T.hold) fading.value = true
      if (!copy && e >= T.hold + T.dissolve) still.value = false
      if (e >= T.hold + T.nums) nums.value = true
      if (!copyDone || !nums.value || still.value) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
  } finally {
    if (id === run) collab.pending = false
  }
}

// ---- the dissolving copy (from WebTakeover.vue): one quad, the photo as a texture ------
const VS = `attribute vec2 p; varying vec2 vUv; uniform vec4 uFit;
void main() { vUv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5) * uFit.xy + uFit.zw; gl_Position = vec4(p, 0.0, 1.0); }`
const FS = `precision highp float;
varying vec2 vUv; uniform sampler2D uImg; uniform float uT;
float hash(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec3 c = texture2D(uImg, vUv).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float n = hash(floor(gl_FragCoord.xy / 2.0));            // grains of two pixels
  float th = mix(n, sqrt(l), 0.45);                         // the dark first, the lights last
  float lit = smoothstep(0.04, 0.22, l);
  float a = mix(1.0 - smoothstep(-0.1, 0.55, uT), smoothstep(uT - 0.06, uT + 0.06, th), lit);
  float edge = (1.0 - min(1.0, abs(th - uT) / 0.06)) * lit;  // a pixel lights a little as it lets go
  vec3 rgb = c * a + c * edge * 0.6 + vec3(0.55, 0.65, 1.0) * edge * l * 0.25;
  gl_FragColor = vec4(rgb, a);
}`
function startGl(image) {
  const cv = overlay.value
  if (!cv) return false
  const dpr = Math.min(devicePixelRatio || 1, 2)
  cv.width = Math.round(box.value.width * dpr); cv.height = Math.round(box.value.height * dpr)
  if (!gl) {
    gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false })
    if (!gl) return false
    const sh = (t, src) => { const o = gl.createShader(t); gl.shaderSource(o, src); gl.compileShader(o); return o }
    const prog = gl.createProgram()
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog)
    gl.useProgram(prog)
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.__u = { t: gl.getUniformLocation(prog, 'uT'), fit: gl.getUniformLocation(prog, 'uFit') }
  }
  const ar = box.value.width / box.value.height, ir = image.naturalWidth / image.naturalHeight
  const sx = ar < ir ? ar / ir : 1, sy = ar < ir ? 1 : ir / ar
  gl.uniform4f(gl.__u.fit, sx, sy, (1 - sx) / 2, (1 - sy) / 2)
  gl.viewport(0, 0, cv.width, cv.height)
  cv.style.opacity = '1'
  return true
}
function drawCopy(t) {
  if (!gl) return
  gl.uniform1f(gl.__u.t, t)
  gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}
function stopGl() { if (overlay.value) overlay.value.style.opacity = '0' }
function releaseGl() { gl?.getExtension('WEBGL_lose_context')?.loseContext(); gl = null; gen.value++ }

onSlideEnter(() => { if (live.value) takeOver() })
const here = () => nav.currentSlideNo?.value === ($page?.value ?? $page)
const onRebuilt = () => { if (live.value && here()) takeOver() }
const onFallback = () => { if (plated()) onRebuilt() }
onMounted(() => {
  window.addEventListener('slidev-stage:rebuilt', onRebuilt)
  window.addEventListener('slidev-stage:fallback', onFallback)
  if (live.value && here()) takeOver()
})
onSlideLeave(() => {
  const id = ++run
  clear(); stopGl()
  setTimeout(() => { if (id === run) releaseGl() }, 400)
  collab.pending = false
  // left before the globe formed: it stands whole
  collab.inst?.finish()
})
onUnmounted(() => {
  window.removeEventListener('slidev-stage:rebuilt', onRebuilt)
  window.removeEventListener('slidev-stage:fallback', onFallback)
  run++; clear(); releaseGl()
})
</script>

<template>
  <div ref="root" class="collab-globe">
    <img v-if="still && !print" class="collab-still" :class="{ fading }" :src="url" alt="LHCb kolaboracija LHCb urve po LHCb ženklu, 2022 m. birželio kolaboracijos savaitė" />
    <div v-if="nums || print" class="collab-nums"><slot /></div>
    <Teleport to="body">
      <canvas v-if="live" :key="gen" ref="overlay" class="collab-copy" aria-hidden="true"
        :style="{ left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' }"></canvas>
    </Teleport>
  </div>
</template>

<style>
.collab-globe { position: absolute; inset: 0; pointer-events: none; }
.collab-globe .collab-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.9s ease; }
.collab-globe .collab-still.fading { opacity: 0; }
.collab-copy { position: fixed; z-index: 40; pointer-events: none; opacity: 0; transition: opacity 0.35s ease; }
</style>
