// The stage's look, trimmed in two places v0.11 has no option for (owner, 10 Nov: "maybe a bit less graininess a
// bit more fidelity, now some parts look like through a fog"). Both go through the handle the stage leaves on its
// canvas (`canvas.field.__space`), once per material: a stage built again is trimmed again. The rest of the look
// is the `stage:` block's `palette` and `options` (deck.md and takes.md, the same two lines).
//
// 1. The ground's two glows, lowered. The stage paints two soft glows of the accent colour on its ground, upper
//    right and lower left; on a projector they read as haze over the dark. This scales the ground quad's `uGlow`.
//    The accent itself stays, for the shells, the links and the labels that take it.
// 2. The dust nearest the camera, capped. A grain of the ground is drawn at 12 / depth times its size, so one that
//    drifts within a unit of the camera is a soft disc 80 px across in a 1080p take: a blot of haze crossing the
//    picture. The depth is clamped at NEAR in the dust's vertex shader, so no grain draws larger than one NEAR
//    units away does (about 20 px). If a later release words that line differently, the dust stays as it ships.
const GLOW = 0.35
const NEAR = 3.5
const DEPTH = 'max(-mv.z, 0.1)'   // slidev-addon-stage v0.11, stage/shaders/passes.glsl.js, RENDER_VERT

function trim() {
  const space = document.querySelector('canvas.field')?.__space
  const ground = space?.scene?.children.find((c) => c.renderOrder === -1000)
  const glow = ground?.material?.uniforms?.uGlow?.value
  if (!glow) return false
  if (!ground.material.userData.glowTrimmed) {
    glow.multiplyScalar(GLOW)
    ground.material.userData.glowTrimmed = true
  }
  const dust = space.field?.material
  if (dust && !dust.userData.nearCapped) {
    if (dust.vertexShader?.includes(DEPTH)) {
      dust.vertexShader = dust.vertexShader.replace(DEPTH, `max(-mv.z, ${NEAR.toFixed(1)})`)
      dust.needsUpdate = true
    }
    dust.userData.nearCapped = true
  }
  return true
}

export function installLook() {
  if (typeof document === 'undefined') return
  // every frame until the stage is up, then once a second for a stage built again (a lost context, a new tier)
  const first = () => { if (trim()) setInterval(trim, 1000); else requestAnimationFrame(first) }
  requestAnimationFrame(first)
}
