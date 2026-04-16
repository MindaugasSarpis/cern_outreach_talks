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
  // Local dev: public/videos-hq/<src> (symlink to videos/hq/ — run
  //   `pnpm videos:encode-hq`).
  // Deployed: HQ is local-only, so this falls back transparently to the web
  //   copy (local public/videos/, then GH Release).
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

let switching = false
function onError() {
  if (switching || !hasBeenActive.value) return
  // Walk the fallback chain: hqLocal (if hq) → webLocal → webRemote → error.
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
    // First activation: attach source and start loading
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
  syncPlayback()
}

onMounted(() => {
  // Source error events don't bubble to <video> on iOS Safari.
  // Attach error listener directly on the <source> DOM element.
  sourceRef.value?.addEventListener('error', onError)
  // The immediate watcher above may fire before refs are populated —
  // re-run once refs exist so the initially-active slide actually loads.
  syncPlayback()
})
</script>

<template>
  <div class="video-player">
    <div v-if="status === 'loading' || status === 'idle'" class="video-status">Loading video&hellip;</div>
    <div v-if="status === 'error'" class="video-status video-error">
      Video not available: <code>{{ src }}</code>
    </div>
    <video
      ref="videoRef"
      :loop="loop"
      :controls="controls"
      muted
      playsinline
      webkit-playsinline
      preload="none"
      @loadeddata="onLoaded"
      @error="onError"
      :class="{ 'video-ready': status === 'ready' }"
    >
      <source ref="sourceRef" :src="hasBeenActive ? currentSrc : ''" :type="mimeType" />
    </video>
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
}
.video-player video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* keep in layout so iOS Safari loads it, but hide visually until ready */
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
</style>

<style>
/* Chromium sizes the native media-controls panel to the video's intrinsic
   resolution (e.g. 1920px for 1080p) rather than the element's CSS width,
   so on the 2880px-wide venue canvas the control bar sits centered at
   roughly half width. Force it to span the full element. */
video::-webkit-media-controls-enclosure,
video::-webkit-media-controls-panel {
  width: 100%;
  max-width: none;
}
</style>
