<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { onSlideEnter, onSlideLeave, useSlideContext } from '@slidev/client'
import { sampleFrame, placeAlongRays, makeGrains, setPositions } from './takeover.js'

// <WebTakeover src="figures/opener_last.jpg" />, on the slide after the opener.
// The opener ends on the cosmic web; this slide opens on that same last frame,
// so nothing changes when the clip goes. Under it the world is already made of
// the frame's grains, each on its pixel's line of sight from the camera, so
// the picture can dissolve into them: the voids first, the filaments last. The
// next slide moves the camera and the picture turns out to have depth.
// Printed, in the overview and without the world it is the still frame.
const props = defineProps({
  src: { type: String, default: 'figures/opener_last.jpg' },
  grains: { type: Number, default: 140000 },
  near: { type: Number, default: 14 },
  far: { type: Number, default: 46 },
  ms: { type: Number, default: 2600 },     // the dissolve
  hold: { type: Number, default: 450 },    // the still frame before it starts
  size: { type: Number, default: 0.4 },
  gain: { type: Number, default: 0.24 },   // grains add up: dense knots must not burn white
  gamma: { type: Number, default: 1.0 },   // density ~ brightness^gamma
})
const { $renderContext, $frontmatter } = useSlideContext()
const url = computed(() => (props.src.startsWith('/') || /^https?:/.test(props.src)) ? props.src : import.meta.env.BASE_URL + props.src)
const live = computed(() => $renderContext?.value === 'slide')
const root = ref(null)
const still = ref(true)          // the still frame shows until the world can take over
const overlay = ref(null)        // the dissolving copy, fixed over the slide
const box = ref({ left: 0, top: 0, width: 0, height: 0 })

let img = null, sample = null, raf = 0, run = 0, gl = null
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
const ease = (u) => u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2

async function takeOver() {
  const id = ++run
  still.value = true
  const s = stage()
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
  pts.material.uniforms.uPixelRatio.value = s.h.dpr || 1
  pts.material.uniforms.uReveal.value = 0
  setPositions(pts, placeAlongRays(sample, s.camera, box.value, s.canvas.getBoundingClientRect(), { near: props.near, far: props.far }))
  still.value = false
  await new Promise((r) => setTimeout(r, props.hold))
  if (id !== run) return
  const t0 = performance.now()
  const step = (now) => {
    if (id !== run) return
    const u = Math.min(1, (now - t0) / props.ms)
    const e = ease(u)
    drawCopy(-0.1 + 1.25 * e)
    pts.material.uniforms.uReveal.value = Math.min(1, e * 1.25)
    if (u < 1) raf = requestAnimationFrame(step)
    else stopGl()
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
  float a = smoothstep(uT - 0.06, uT + 0.06, th);
  float edge = 1.0 - min(1.0, abs(th - uT) / 0.06);         // a pixel lights up as it lets go
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

onSlideEnter(() => { if (live.value) takeOver() })
onSlideLeave(() => { run++; cancelAnimationFrame(raf); stopGl(); still.value = true })
onUnmounted(() => { run++; cancelAnimationFrame(raf); gl?.getExtension('WEBGL_lose_context')?.loseContext(); gl = null })
</script>

<template>
  <div ref="root" class="web-takeover">
    <img v-if="still" class="takeover-still" :src="url" alt="Kosminis tinklas — paskutinis įžanginio vaizdo klipo kadras" />
    <Teleport to="body">
      <canvas v-if="live" ref="overlay" class="takeover-copy" aria-hidden="true"
        :style="{ left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' }"></canvas>
    </Teleport>
  </div>
</template>

<style>
.web-takeover { position: absolute; inset: 0; pointer-events: none; }
.web-takeover .takeover-still { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.takeover-copy { position: fixed; z-index: 40; pointer-events: none; opacity: 0; transition: opacity 0.35s ease; }
</style>
