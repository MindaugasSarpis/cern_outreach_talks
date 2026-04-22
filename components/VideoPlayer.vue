<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { useIsSlideActive } from '@slidev/client'

// Per-talk config injected via Vite env (see each talk's package.json scripts):
//   VITE_VIDEO_REPO     e.g. "MindaugasSarpis/cern_outreach_talks"
//   VITE_VIDEO_RELEASE  e.g. "videos-2026-04-28-editai"
const REPO    = import.meta.env.VITE_VIDEO_REPO    || 'MindaugasSarpis/cern_outreach_talks'
const RELEASE = import.meta.env.VITE_VIDEO_RELEASE || 'videos'
const REMOTE_BASE = `https://github.com/${REPO}/releases/download/${RELEASE}`

const props = defineProps({
  src:      { type: String, required: true },
  fallback: { type: String, default: '' },
  autoplay: { type: Boolean, default: false },
  loop:     { type: Boolean, default: false },
  muted:    { type: Boolean, default: false },
  controls: { type: Boolean, default: true },
  // Serve the visually-lossless venue master instead of the web-encoded copy.
  // Played only from public/videos-hq/<src> (symlink to videos/hq/). Populate
  // with `pnpm videos:encode-hq` or `gh release download videos-hq-<talk>
  // -D videos/hq/`. If the HQ file is missing the chain falls back to the
  // web copy (local public/videos/, then the web GH Release).
  hq:       { type: Boolean, default: false },
})

// Three-step fallback chain when hq=true: hqLocal → webLocal → webRemote.
// Two-step when hq=false: webLocal → webRemote.
const base = computed(() => import.meta.env.BASE_URL || '/')
const hqLocalSrc = computed(() => `${base.value}videos-hq/${props.src}`)
const webLocalSrc = computed(() => `${base.value}videos/${props.src}`)
const webRemoteSrc = computed(() => props.fallback || `${REMOTE_BASE}/${props.src}`)
const localSrc = computed(() => props.hq ? hqLocalSrc.value : webLocalSrc.value)

const videoRef = ref(null)
const sourceRef = ref(null)
const currentSrc = ref(localSrc.value)
const status = ref('idle')
const isActive = useIsSlideActive()
const hasBeenActive = ref(false)

const mimeType = computed(() => {
  const ext = props.src.split('.').pop()?.toLowerCase()
  if (ext === 'webm') return 'video/webm'
  return 'video/mp4'
})

// --- Custom controls state ---
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const isMuted = ref(true)
const progressPercent = computed(() => duration.value ? (currentTime.value / duration.value) * 100 : 0)
const controlsVisible = ref(false)

function formatTime(s) {
  if (!isFinite(s)) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function onTimeUpdate() {
  const v = videoRef.value
  if (!v) return
  currentTime.value = v.currentTime
  duration.value = v.duration || 0
  playing.value = !v.paused
  isMuted.value = v.muted
}

function togglePlay() {
  const v = videoRef.value
  if (!v) return
  if (v.paused) {
    v.play().catch(() => {})
  } else {
    v.pause()
  }
  playing.value = !v.paused
}

function toggleMute() {
  const v = videoRef.value
  if (!v) return
  v.muted = !v.muted
  isMuted.value = v.muted
}

function seek(e) {
  const v = videoRef.value
  if (!v || !duration.value) return
  const rect = e.currentTarget.getBoundingClientRect()
  const ratio = (e.clientX - rect.left) / rect.width
  v.currentTime = ratio * duration.value
}

function showControls() {
  controlsVisible.value = true
}
function hideControls() {
  controlsVisible.value = false
}

// --- Fallback chain ---
let switching = false
function onError() {
  if (switching || !hasBeenActive.value) return
  const chain = props.hq
    ? [hqLocalSrc.value, webLocalSrc.value, webRemoteSrc.value]
    : [webLocalSrc.value, webRemoteSrc.value]
  const idx = chain.indexOf(currentSrc.value)
  if (idx === -1 || idx === chain.length - 1) {
    status.value = 'error'
    return
  }
  switching = true
  status.value = 'loading'
  currentSrc.value = chain[idx + 1]
  nextTick(() => {
    videoRef.value?.load()
    switching = false
  })
}

function syncPlayback() {
  const video = videoRef.value
  if (!video) return
  if (isActive.value) {
    if (!hasBeenActive.value) {
      hasBeenActive.value = true
      status.value = 'loading'
      nextTick(() => videoRef.value?.load())
    }
    video.currentTime = 0
    video.muted = true
    video.play().then(() => {
      if (!props.muted) video.muted = false
    }).catch(() => {})
  } else {
    video.pause()
    video.muted = true
    video.currentTime = 0
  }
}

watch(isActive, syncPlayback, { immediate: true })

function onLoaded() {
  status.value = 'ready'
  duration.value = videoRef.value?.duration || 0
  syncPlayback()
}

onMounted(() => {
  sourceRef.value?.addEventListener('error', onError)
  syncPlayback()
})

</script>

<template>
  <div class="video-player" @mouseenter="controls && showControls()" @mouseleave="controls && hideControls()" @click="controls && togglePlay()">
    <div v-if="status === 'loading' || status === 'idle'" class="video-status">Loading video&hellip;</div>
    <div v-if="status === 'error'" class="video-status video-error">
      Video not available: <code>{{ src }}</code>
    </div>
    <video
      ref="videoRef"
      :loop="loop"
      muted
      playsinline
      webkit-playsinline
      preload="none"
      @loadeddata="onLoaded"
      @error="onError"
      @timeupdate="onTimeUpdate"
      @play="playing = true"
      @pause="playing = false"
      :class="{ 'video-ready': status === 'ready' }"
    >
      <source ref="sourceRef" :src="hasBeenActive ? currentSrc : ''" :type="mimeType" />
    </video>
    <div v-if="controls && status === 'ready'" class="custom-controls" :class="{ visible: controlsVisible }" @click.stop>
      <button class="ctrl-btn" @click="togglePlay">{{ playing ? '⏸' : '▶' }}</button>
      <span class="ctrl-time">{{ formatTime(currentTime) }} / {{ formatTime(duration) }}</span>
      <div class="ctrl-progress" @click="seek">
        <div class="ctrl-progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <button class="ctrl-btn" @click="toggleMute">{{ isMuted ? '🔇' : '🔊' }}</button>
    </div>
  </div>
</template>

<style scoped>
.video-player {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  cursor: pointer;
}
.video-player video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  pointer-events: none;
}
.video-player video.video-ready {
  opacity: 1;
  pointer-events: auto;
}
.video-status {
  position: absolute;
  padding: 2rem;
  opacity: 0.6;
  font-size: 0.9rem;
  color: white;
}
.video-error {
  color: #ef4444;
  opacity: 1;
}

/* Custom controls — always spans full width of the slide */
.custom-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  opacity: 0;
  transition: opacity 0.3s;
  cursor: default;
}
.custom-controls.visible {
  opacity: 1;
}
.ctrl-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  line-height: 1;
}
.ctrl-btn:hover {
  opacity: 0.8;
}
.ctrl-time {
  color: rgba(255,255,255,0.8);
  font-size: 18px;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
  min-width: 120px;
}
.ctrl-progress {
  flex: 1;
  height: 8px;
  background: rgba(255,255,255,0.25);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
}
.ctrl-progress-fill {
  height: 100%;
  background: white;
  border-radius: 4px;
  transition: width 0.1s linear;
}
</style>
