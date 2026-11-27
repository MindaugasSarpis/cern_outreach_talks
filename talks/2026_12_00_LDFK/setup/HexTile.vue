<script setup lang="ts">
// One hexagonal photo tile with thickness: a stack of clipped layers behind the
// face, each a little further back, inside a preserve-3d box. clip-path flattens
// an element's own children, so every layer is clipped on its own and the box
// that holds them is not.
//
//   <HexTile who="ruta" :size="84" />          a person from setup/team.ts
//   <HexTile photo="x.jpg" label="Name" />     any photo in public/team/
//   <HexTile open />                           an outlined empty place
import { computed } from 'vue'
import { byId } from './team'

const props = withDefaults(defineProps<{
  who?: string
  photo?: string
  label?: string
  size?: number
  lead?: boolean
  dim?: boolean
  open?: boolean
  back?: boolean
  depth?: number
}>(), { size: 100, depth: 9 })

const m = computed(() => (props.who ? byId[props.who] : undefined))
const name = computed(() => props.label ?? m.value?.name ?? '')
const file = computed(() => props.photo ?? m.value?.photo)
const src = computed(() => (file.value ? `${import.meta.env.BASE_URL}team/${file.value}` : ''))
// a person's own framing of the photo (setup/team.ts: pos, zoom)
const frame = computed(() => {
  const pos = m.value?.pos
  const zoom = m.value?.zoom
  return {
    ...(pos ? { objectPosition: pos } : {}),
    ...(zoom && zoom !== 1 ? { transform: `scale(${zoom})`, transformOrigin: pos ?? '50% 22%' } : {}),
  }
})
const isLead = computed(() => props.lead || !!m.value?.lead)
const layers = computed(() => Array.from({ length: props.depth }, (_, i) => i + 1))
</script>

<template>
  <div class="hx" :class="{ lead: isLead && !back, dim, open }" :style="{ '--w': `${size}px` }">
    <i class="hx-shadow" />
    <i v-for="n in layers" :key="n" class="hx-side" :style="{ transform: `translateZ(${-n * 2.6}px)` }" />
    <div class="hx-face">
      <template v-if="!open">
        <span v-if="src" class="hx-img hx-crop"><img :src="src" :alt="name" :style="frame"></span>
        <span v-else class="hx-img hx-initial">{{ name.slice(0, 1) }}</span>
        <i class="hx-gloss" />
        <span v-if="name" class="hx-name">{{ name }}</span>
      </template>
      <span v-else class="hx-plus">+</span>
    </div>
  </div>
</template>

<style scoped>
.hx {
  --hex: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
  --rim: 3px;
  position: relative;
  flex: none;
  width: var(--w);
  height: calc(var(--w) * 0.866);
  transform-style: preserve-3d;
}
.hx > * { position: absolute; inset: 0; }

.hx-shadow {
  inset: 8% -6% -18% -6%;
  transform: translateZ(-30px);
  background: radial-gradient(closest-side, rgba(0, 4, 16, 0.6), rgba(0, 4, 16, 0) 100%);
}
.hx-side {
  clip-path: var(--hex);
  background: linear-gradient(180deg, #1b4f86, #0a2244 55%, #06142b);
}
.hx-face {
  clip-path: var(--hex);
  background: linear-gradient(150deg, #e6f4ff 0%, #7cc4f5 30%, #2b6cb0 62%, #0d2b55 100%);
}
.hx.lead .hx-face { background: linear-gradient(150deg, #ffffff 0%, #c9e8ff 40%, #7cc4f5 100%); }

.hx-img {
  position: absolute;
  inset: var(--rim);
  width: calc(100% - 2 * var(--rim));
  height: calc(100% - 2 * var(--rim));
  object-fit: cover;
  object-position: 50% 22%;
  clip-path: var(--hex);
}
/* the photo sits in a clipped box of its own, so a zoomed photo stays inside the hexagon */
.hx-crop { overflow: hidden; }
.hx-crop img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 22%; }
.hx-initial {
  display: grid;
  place-items: center;
  background: linear-gradient(160deg, #123a6b, #071b38);
  color: #cfe8ff;
  font-size: calc(var(--w) * 0.34);
}
/* the bevel: light from the upper left, shade at the lower right, a dark foot for the name */
.hx-gloss {
  position: absolute;
  inset: var(--rim);
  clip-path: var(--hex);
  background:
    linear-gradient(180deg, rgba(3, 12, 30, 0) 50%, rgba(3, 12, 30, 0.82) 100%),
    linear-gradient(140deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 30%, rgba(0, 0, 0, 0) 68%, rgba(0, 0, 0, 0.34) 100%);
}
.hx-name {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 13%;
  text-align: center;
  font-size: calc(var(--w) * 0.13);  /* 14 px at a 108 px tile: the deck's type floor */
  line-height: 1;
  letter-spacing: 0;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
}

.hx.dim .hx-img { filter: grayscale(1) brightness(0.6); }
.hx.dim .hx-face { background: linear-gradient(150deg, #5b6b80, #233246); }
.hx.dim .hx-side { background: #0a1424; }
.hx.dim .hx-name { color: #b9c6d6; }

.hx.open .hx-side { display: none; }
.hx.open .hx-face { background: rgba(125, 211, 252, 0.55); }
.hx.open .hx-face::before {
  content: '';
  position: absolute;
  inset: 2px;
  clip-path: var(--hex);
  background: rgba(4, 16, 40, 0.92);
}
.hx-plus {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: calc(var(--w) * 0.36);
  line-height: 1;
  color: rgba(186, 230, 253, 0.9);
}
</style>
