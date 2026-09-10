import { CanvasTexture, LinearFilter, Sprite, SpriteMaterial } from 'three';
import { subscriptSegments } from './particles.js';

// Text sprites for the hadron space. Both draw to a canvas once and hang the
// texture on a Sprite (always camera-facing, drawn without depth so a label
// never sinks into the scene it names).

// One-line, uppercase, tracked label (axis ticks, station names, track ends).
// worldH: sprite height in world units.
export function makeLabel(text, { px = 44, color = '#8b97a6', weight = 600, worldH = 0.6, letterSpacing = 0.12, upper = true } = {}) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  // particle names get their flavour as a subscript (Λb⁰, Σc⁺, Pc(4312)⁺): drawn
  // smaller and lower, the rest tracked with hair spaces
  const segs = subscriptSegments(upper ? text.toUpperCase() : text)
    .map((g) => ({ t: g.sub ? g.t : g.t.split('').join(String.fromCharCode(8202)), sub: g.sub }));
  const total = segs.reduce((w, g) => w + measure(ctx, g, px, weight), 0);
  const w = Math.ceil(total * (1 + letterSpacing * 0.5)) + px;
  c.width = w; c.height = Math.ceil(px * 1.5);
  ctx.fillStyle = color; ctx.textBaseline = 'middle';
  drawSegments(ctx, segs, px / 2, c.height / 2, px, weight);
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter; tex.generateMipmaps = false;
  const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 0.9 });
  const s = new Sprite(mat);
  s.scale.set(worldH * (c.width / c.height), worldH, 1);
  return s;
}

// Multi-line, mixed-case text (the paper quotation, station notes). `height`
// is the height of one line in world units; `pos` is the top-left corner.
export function makeText(text, { height = 0.5, color = '#f2f5f9', weight = 500, px = 40, lineHeight = 1.3 } = {}) {
  const lines = String(text).split('\n');
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const segLines = lines.map((l) => subscriptSegments(l));
  const w = Math.ceil(Math.max(...segLines.map((segs) => segs.reduce((acc, g) => acc + measure(ctx, g, px, weight), 0)))) + px;
  c.width = w; c.height = Math.ceil(px * lineHeight * lines.length + px * 0.5);
  ctx.fillStyle = color; ctx.textBaseline = 'top';
  segLines.forEach((segs, i) => drawSegments(ctx, segs, px / 2, px * 0.25 + i * px * lineHeight, px, weight, 'top'));
  const tex = new CanvasTexture(c); tex.minFilter = LinearFilter; tex.generateMipmaps = false;
  const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 0.95 });
  const s = new Sprite(mat);
  const worldH = height * lines.length * lineHeight;
  s.scale.set(worldH * (c.width / c.height), worldH, 1);
  s.center.set(0, 1);   // anchor at the top-left so `pos` is where the first line starts
  return s;
}

// ---- text with subscripts ---------------------------------------------------
const SUB_SCALE = 0.64;        // subscript glyph size, as a fraction of the main size
const SUB_DROP = 0.28;         // how far below the main baseline the subscript sits, in main-size units
const FONT = '"Space Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

function measure(ctx, g, px, weight) {
  ctx.font = `${weight} ${g.sub ? Math.round(px * SUB_SCALE) : px}px ${FONT}`;
  return ctx.measureText(g.t).width;
}

// draw the segments left to right from (x, y); `baseline` 'middle' (labels) or 'top' (text)
function drawSegments(ctx, segs, x, y, px, weight, baseline = 'middle') {
  for (const g of segs) {
    const size = g.sub ? Math.round(px * SUB_SCALE) : px;
    ctx.font = `${weight} ${size}px ${FONT}`;
    const dy = g.sub ? px * (baseline === 'top' ? SUB_DROP + (1 - SUB_SCALE) * 0.55 : SUB_DROP) : 0;
    ctx.fillText(g.t, x, y + dy);
    x += ctx.measureText(g.t).width;
  }
}
