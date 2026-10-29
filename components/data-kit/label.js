// Fixed-size world labels: tick numbers and the one axis caption (bible §3:
// "fixed-size world labels of at least 18 px, upper: false"). The engine's
// makeLabel draws the text once on a canvas; here its sprite keeps one share of the
// frame's height whatever the camera's distance, so a tick number is as legible
// from 40 units as from 8, and never grows into a headline when the camera dives.
//
//   const l = fixedLabel(stage, '1 860', { px: 22, color: roles.tick, align: 'center', hang: 1 })
//   group.add(l); labels.push(l)        // labels fade with the slide's scrim (setDim)
//   l.userData.show = 0..1               // the form's own fade, multiplied in each frame
//
// px is the font size on a 1080-high frame (the recorded size); the same share of the
// frame on any screen. Never under LABEL.minPx (18). `align` (left | center | right)
// and `hang` (0 centred on the point, 1 hanging below it, 2.2 one label-height lower
// still) place it round its anchor in screen space, so a label under an axis stays
// under it at every distance.
import { LABEL } from './style.js';

const FRAME = 1080;
const RES = 64;            // canvas font size: crisp at the sizes a label is shown at

export function fixedLabel(stage, text, { px = LABEL.px, color = '#f2f5f9', align = 'center', hang = 0, weight = 500, opacity = 0.9 } = {}) {
  const size = Math.max(LABEL.minPx, px);
  const s = stage.makeLabel(String(text), { px: RES, color, weight, worldH: 1, letterSpacing: 0.02, upper: false });
  const aspect = s.scale.x / s.scale.y;
  s.material.sizeAttenuation = false;
  s.material.needsUpdate = true;
  s.material.opacity = 0;
  s.center.set(align === 'left' ? 0 : align === 'right' ? 1 : 0.5, 0.5 + hang);
  // the sprite's canvas is 1.5 font sizes high (makeLabel)
  const frac = (1.5 * size) / FRAME;
  s.userData.show = 1;
  s.userData.peak = opacity;
  s.renderOrder = 10;
  s.onBeforeRender = (renderer, scene, camera) => {
    // without size attenuation a sprite's NDC height is scale.y · P[1][1]; NDC spans 2
    const p5 = camera.projectionMatrix.elements[5] || 1;
    let ws = 1;
    if (s.parent) { const e = s.parent.matrixWorld.elements; ws = Math.hypot(e[4], e[5], e[6]) || 1; }
    const h = (2 * frac) / p5 / ws;
    if (Math.abs(s.scale.y - h) > 1e-6) { s.scale.set(h * aspect, h, 1); s.updateMatrixWorld(); }
  };
  return s;
}

// Each frame: a label's opacity = the scrim's (setDim writes userData.dimOp) × the
// form's own show × its peak.
export function shade(labels, show) {
  for (const l of labels) {
    const dim = l.userData.dimOp ?? 0.9;
    const op = (dim / 0.9) * l.userData.peak * Math.max(0, Math.min(1, show * (l.userData.show ?? 1)));
    l.material.opacity = op;
    l.visible = op > 0.004;
  }
}

// nice tick values over [lo, hi], about `count` of them
export function niceTicks(lo, hi, count = 5) {
  const span = hi - lo;
  if (!(span > 0)) return [lo];
  const raw = span / Math.max(1, count);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw) || 10 * mag;
  const out = [];
  for (let v = Math.ceil(lo / step - 1e-9) * step; v <= hi + 1e-9; v += step) out.push(Number(v.toFixed(10)));
  return out;
}
