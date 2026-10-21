<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext, useNav } from '@slidev/client'
import { sampleFrame, placeAlongRays, makeGrains, setPositions, setTargets } from './takeover.js'
import { funnelSeq } from './funnel.js'

// <WebTakeover src="figures/opener_last.jpg" />, on the slide after the opener.
// The opener ends on the cosmic web; this slide opens on that same last frame,
// so nothing changes when the clip goes. Under it the world is already made of
// the frame's grains, each on its pixel's line of sight from the camera, so
// the picture can dissolve into them: the voids first, the filaments last. The
// next slide moves the camera and the grains fly into the funnel (funnel.js
// funnelSeq): the funnel is hidden while the web stands here, and the step from
// here to the next slide plays the prologue.
// Printed, in the overview and without the world it is the still frame.
const props = defineProps({
  src: { type: String, default: 'figures/opener_last.jpg' },
  grains: { type: Number, default: 280000 },   // a frame lit all over (a galaxy disk) needs the density
  near: { type: Number, default: 14 },
  far: { type: Number, default: 46 },
  ms: { type: Number, default: 3200 },     // the dissolve
  hold: { type: Number, default: 450 },    // the still frame before it starts
  size: { type: Number, default: 0.45 },
  gain: { type: Number, default: 1.3 },    // grains add up; 140k grains at 0.85 left a lit-all-over frame at a fifth of its light
  gamma: { type: Number, default: 1.0 },   // density ~ brightness^gamma
})
const { $renderContext, $frontmatter, $page } = useSlideContext()
const nav = useNav()
const url = computed(() => (props.src.startsWith('/') || /^https?:/.test(props.src)) ? props.src : import.meta.env.BASE_URL + props.src)
const live = computed(() => $renderContext?.value === 'slide')
const root = ref(null)
const still = ref(true)          // the still frame shows until the world can take over
const fading = ref(false)        // … or until the plate does (below)
const overlay = ref(null)        // the dissolving copy, fixed over the slide
const box = ref({ left: 0, top: 0, width: 0, height: 0 })

let img = null, sample = null, raf = 0, run = 0, gl = null
// the copy's WebGL context lives only while it dissolves: a second context beside the
// world's the rest of the talk raises the odds of a context loss on a phone. A released
// context cannot be had again from the same canvas, so each takeover gets a new one.
const gen = ref(0)
const ready = new Promise((resolve) => {
  if (typeof Image === 'undefined') return resolve(null)
  img = new Image()
  img.decoding = 'async'
  img.onload = () => resolve(img)
  img.onerror = () => resolve(null)
  img.src = url.value
})

function stage() {
  const rootEl = document.querySelector('.stage')
  const canvas = rootEl?.querySelector('canvas')
  const api = rootEl?.__space, h = canvas?.__space
  const camera = h?.composer?.passes?.[0]?.camera
  if (!api || !h?.scene || !camera) return null
  return { api, h, camera, canvas }
}
const frame = () => new Promise((r) => requestAnimationFrame(() => r()))

// the world mounts with the deck and may not be up yet (a reload on this slide)
async function waitStage(id) {
  for (let i = 0; i < 80; i++) {
    const s = stage()
    if (s || id !== run) return s
    await new Promise((r) => setTimeout(r, 100))
  }
  return null
}

// v0.8.2's plate layer (html[data-stage-layer="plate"], set with the `slidev-stage:fallback`
// event): no world, but this slide's recorded plate plays under it, from this same frame
// dissolving into grains: the still goes at once, as it does under the world's copy. Under the
// `living` and `still` layers (no plate) it stays. Older stages never set the attribute.
const plated = () => document.documentElement.dataset.stageLayer === 'plate'

async function takeOver() {
  const id = ++run
  still.value = true; fading.value = false
  if (plated()) { requestAnimationFrame(() => { if (id === run) fading.value = true }); return }
  const s = await waitStage(id)
  const image = await ready
  if (id !== run || !s || !image || !live.value) return
  const slide = root.value?.closest('#slide-content') || root.value?.closest('.slidev-slide-content')
  if (!slide) return
  const r = slide.getBoundingClientRect()
  box.value = { left: r.left, top: r.top, width: r.width, height: r.height }
  if (!startGl(image)) return
  drawCopy(-0.1)
  // the camera stands exactly where this slide's pose puts it, under the copy
  await frame()
  if (id !== run) return
  const sp = $frontmatter?.value?.space ?? $frontmatter?.space
  if (sp) s.api.setPose(sp, { immediate: true })
  await frame(); await frame()
  if (id !== run) return
  // the grains: made once, placed again on every arrival from the camera as it is now
  sample ||= sampleFrame(image, { n: props.grains, gamma: props.gamma })
  let pts = s.h.scene.getObjectByName('takeover-web')
  if (!pts) { pts = makeGrains(sample, { size: props.size, gain: props.gain }); s.h.scene.add(pts) }
  const u0 = pts.material.uniforms
  u0.uReveal.value = 0; u0.uMorph.value = 0; u0.uFade.value = 1; pts.visible = true
  setPositions(pts, placeAlongRays(sample, s.camera, box.value, s.canvas.getBoundingClientRect(), { near: props.near, far: props.far }))
  // under the copy: the web stands alone until its grains make the funnel
  funnelSeq.hide()
  still.value = false
  await new Promise((r) => setTimeout(r, props.hold))
  if (id !== run) return
  const t0 = performance.now()
  const step = (now) => {
    if (id !== run) return
    const u = Math.min(1, (now - t0) / props.ms)
    drawCopy(-0.1 + 1.25 * u)
    pts.material.uniforms.uReveal.value = Math.min(1, u * 1.3)
    if (u < 1) raf = requestAnimationFrame(step)
    else { stopGl(); releaseGl(); prepare(pts) }
  }
  raf = requestAnimationFrame(step)
}

// ---- the dissolving copy: one quad, the frame as a texture ----------------------
const VS = `attribute vec2 p; varying vec2 vUv; uniform vec4 uFit;
void main() { vUv = vec2(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5) * uFit.xy + uFit.zw; gl_Position = vec4(p, 0.0, 1.0); }`
const FS = `precision highp float;
varying vec2 vUv; uniform sampler2D uImg; uniform float uT; uniform vec2 uRes;
float hash(vec2 q) { return fract(sin(dot(q, vec2(127.1, 311.7))) * 43758.5453); }
void main() {
  vec3 c = texture2D(uImg, vUv).rgb;
  float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
  float n = hash(floor(gl_FragCoord.xy / 2.0));            // grains of two pixels
  float th = mix(n, sqrt(l), 0.55);                         // the voids go first, the filaments last
  float lit = smoothstep(0.04, 0.22, l);
  // the dark of the frame lets go evenly, so black becomes the world's ground without speckle;
  // what is lit breaks into grains, the faint first, the knots last
  float a = mix(1.0 - smoothstep(-0.1, 0.55, uT), smoothstep(uT - 0.06, uT + 0.06, th), lit);
  float edge = (1.0 - min(1.0, abs(th - uT) / 0.06)) * lit;  // a pixel lights up as it lets go
  vec3 rgb = c * a + c * edge * 0.9 + vec3(0.55, 0.65, 1.0) * edge * l * 0.35;
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
    gl.__u = { t: gl.getUniformLocation(prog, 'uT'), fit: gl.getUniformLocation(prog, 'uFit'), res: gl.getUniformLocation(prog, 'uRes') }
  }
  // cover: the part of the frame the slide shows
  const ar = box.value.width / box.value.height, ir = image.naturalWidth / image.naturalHeight
  const sx = ar < ir ? ar / ir : 1, sy = ar < ir ? 1 : ir / ar
  gl.uniform4f(gl.__u.fit, sx, sy, (1 - sx) / 2, (1 - sy) / 2)
  gl.uniform2f(gl.__u.res, cv.width, cv.height)
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

// where the grains go in the funnel: worked out once, while the web stands (or at the
// step, if it comes before the dissolve ends)
function prepare(pts) {
  if (!pts || pts.userData.targets || !sample) return
  const tg = funnelSeq.targets(sample.uv, sample.n, box.value.width / Math.max(1, box.value.height))
  if (tg) setTargets(pts, tg)
}

onSlideEnter(() => { if (live.value) takeOver() })
// a new world (the stage rebuilds after a lost WebGL context) has no grains of the web: on
// this slide, take over again
const onRebuilt = () => { if (live.value && nav.currentSlideNo?.value === ($page?.value ?? $page)) takeOver() }
// the plate layer can come after the slide's arrival (the stage decides its fallback late)
const onFallback = () => { if (plated()) onRebuilt() }
onMounted(() => {
  window.addEventListener('slidev-stage:rebuilt', onRebuilt)
  window.addEventListener('slidev-stage:fallback', onFallback)
  if (live.value && nav.currentSlideNo?.value === ($page?.value ?? $page)) takeOver()
})
onSlideLeave(() => {
  // (the still stays hidden: shown again as the slide fades out, it stood over the grains
  // as they left; the next arrival shows it before anything else)
  const id = ++run; cancelAnimationFrame(raf); stopGl()
  setTimeout(() => { if (id === run) releaseGl() }, 400)   // after the copy's fade
  // left before the dissolve finished: the world keeps its grains, whole
  const p = stage()?.h.scene.getObjectByName('takeover-web')
  if (p) p.material.uniforms.uReveal.value = 1
})
onUnmounted(() => { window.removeEventListener('slidev-stage:rebuilt', onRebuilt); window.removeEventListener('slidev-stage:fallback', onFallback); run++; cancelAnimationFrame(raf); releaseGl() })
// The funnel does not exist before the web's grains make it (owner, 13 Oct: not
// floating on the cover): hidden on every slide before this one, hidden here (takeOver),
// made on the step from here to the next slide (the prologue), whole on any other
// arrival after it. The live slide drives it; a window without one (the presenter's)
// lets its own instances do the hiding and showing. The grains are drawn only here and
// while they fly; elsewhere they would be 280 000 points nobody sees but every frame
// draws. Hidden, not removed, so going back finds them.
let last = nav.currentSlideNo?.value
onMounted(() => { if (live.value) funnelSeq.drivers++ })
onUnmounted(() => { if (live.value) funnelSeq.drivers-- })
watch(() => nav.currentSlideNo?.value, (n) => {
  const prev = last; last = n
  const at = $page?.value ?? $page
  funnelSeq.at = at
  const p = stage()?.h.scene.getObjectByName('takeover-web')
  if (live.value || !funnelSeq.drivers) {
    if (n < at) funnelSeq.hide()
    else if (n > at) {
      if (live.value && n === at + 1 && prev === at && p) { prepare(p); funnelSeq.play(p.userData.targets ? p : null) }
      else funnelSeq.show()
    }
  }
  if (p) p.visible = n === at || (n === at + 1 && funnelSeq.web === p)
}, { immediate: true })
</script>

<template>
  <div ref="root" class="web-takeover">
    <img v-if="still" class="takeover-still" :class="{ fading }" :src="url" alt="Paskutinis įžanginio vaizdo klipo kadras" />
    <Teleport to="body">
      <canvas v-if="live" :key="gen" ref="overlay" class="takeover-copy" aria-hidden="true"
        :style="{ left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' }"></canvas>
    </Teleport>
  </div>
</template>

<style>
.web-takeover { position: absolute; inset: 0; pointer-events: none; }
.web-takeover .takeover-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease; }
.web-takeover .takeover-still.fading { opacity: 0; }
html.print .web-takeover .takeover-still { opacity: 1; }
.takeover-copy { position: fixed; z-index: 40; pointer-events: none; opacity: 0; transition: opacity 0.35s ease; }
</style>
