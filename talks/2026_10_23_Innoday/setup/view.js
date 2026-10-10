import { Vector2 } from 'three'

// The talk's grains are sized to the frame, not in raw pixels. They were sized
// like the engine's forms (pixel ratio × size × 72 / distance, in pixels): right
// on a laptop, but on a phone the slide is ~220 CSS px tall, so each grain
// covered ~4× more of the picture, dense surfaces (the CMB disk, the funnel's
// haze, the takeover's frame) overlapped ~15× more, and their added light ran to
// white (owner's iPhone, 9 Oct; before slidev-videos v0.6.7 it ran past
// half-float to Inf: black). Scaled by the height of the frame being drawn
// against 900 px (the 1600×900 frames the look was approved on), a grain covers
// the same share of the picture on every screen.
export const REF_H = 900
const v = new Vector2()
export function viewScale(renderer) {
  const t = renderer.getRenderTarget()
  return (t ? t.height : renderer.getDrawingBufferSize(v).y) / REF_H
}

// GLSL for a point sprite's size: `ps` is the size the grain should have (it may
// be under a pixel on a small screen); `pointSize(ps)` is what the GPU can draw
// (a pixel at least, the cap at most, both scaled with the frame) and
// `coverage(ps)` dims a sub-pixel grain by the share of its pixel it would cover,
// so the 1 px floor does not brighten a small screen.
export const POINT_GLSL = /* glsl */ `
uniform float uView;
float pointSize(float ps, float cap) { return clamp(ps, 1.0, max(cap * uView, 1.0)); }
float coverage(float ps) { return min(1.0, ps * ps); }
`
