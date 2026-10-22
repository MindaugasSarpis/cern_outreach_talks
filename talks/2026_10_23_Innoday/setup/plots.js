import { Group, Mesh, PlaneGeometry, MeshBasicMaterial, TextureLoader, SRGBColorSpace, AdditiveBlending } from 'three'

// Unused since 21 Oct: slide 12 is a sun of the same plots (setup/sun.js, the
// owner: "Slide 12 can be more dynamic"), which draws each plot as below. Kept
// registered so the floating cards come back by putting `plot` objects in the
// `results` station again.
//
// LHCb's result plots on slide 12, the way OpenData draws its plots (its
// setup/sun.js; owner, 13 Oct: "papers should be more resolved, a really nice
// way of this was in opendata talk"): a picture of light on black
// (scripts/plots_dark.py) on an unlit plane drawn additively, so its black is
// the world's and its lines stay sharp: no key light, paper tint or halo, as
// the engine's `page` has. The ink sits just under the bloom's threshold (a
// luminance of 0.8), so it does not glow. The cards must not overlap on the
// screen anywhere along the slide's path (additive lines would cross): the
// layout in public/data/space.json was searched for that.
//
//   { type: plot, src: '/figures/lhcb/res_*.jpg', pos, height: 2.4, yaw: 0, opacity: 0.95, fade: 0.8 }
//
// The plane takes the picture's aspect once it has loaded, and fades in over
// `fade` seconds on the world's clock; `busy` until every picture has arrived
// and faded in, so the shots and stills wait for them.

function buildPlot(o, ctx) {
  const g = new Group()
  const h = o.height ?? 2.4, peak = o.opacity ?? 0.95, fade = o.fade ?? 0.8
  const mat = new MeshBasicMaterial({ transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false, depthTest: true, color: 0xffffff })   // front side only: every other slide sees the cards from behind
  const mesh = new Mesh(new PlaneGeometry(1, 1), mat)
  mesh.visible = false   // never a blank white plane before its picture
  mesh.rotation.y = ((o.yaw || 0) * Math.PI) / 180
  mesh.scale.set(h, h, 1)
  g.add(mesh)
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0)
  let loading = true, shownAt = -1, now = 0, alive = true
  new TextureLoader().load(ctx.asset ? ctx.asset(o.src) : o.src, (tex) => {
    loading = false
    if (!alive) { tex.dispose(); return }
    tex.colorSpace = SRGBColorSpace; tex.anisotropy = ctx.anisotropy || 4
    mat.map = tex; mat.needsUpdate = true
    const im = tex.image
    if (im?.width) mesh.scale.set(h * im.width / im.height, h, 1)
    shownAt = now; mesh.visible = true
  }, undefined, () => { loading = false; console.warn('stage: plot failed', o.src) })
  return {
    group: g, labels: [],
    api: { busy: () => loading || (shownAt >= 0 && now - shownAt < fade) },
    update(t) {
      now = t
      if (shownAt < 0) return
      const k = Math.min(1, Math.max(0, (t - shownAt) / fade))
      mat.opacity = peak * k * k * (3 - 2 * k)
    },
    dispose() { alive = false; mat.map?.dispose(); mat.dispose(); mesh.geometry.dispose() },
  }
}

export function installPlots(registerBuilder) {
  registerBuilder('plot', buildPlot, { fields: ['src', 'pos'] })
}
