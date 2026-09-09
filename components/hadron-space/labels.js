import { CanvasTexture, LinearFilter, Sprite, SpriteMaterial } from 'three';

// Text sprites for the hadron space. Both draw to a canvas once and hang the
// texture on a Sprite (always camera-facing, drawn without depth so a label
// never sinks into the scene it names).

// One-line, uppercase, tracked label (axis ticks, station names, track ends).
// worldH: sprite height in world units.
export function makeLabel(text, { px = 44, color = '#8b97a6', weight = 600, worldH = 0.6, letterSpacing = 0.12, upper = true } = {}) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const font = `${weight} ${px}px "Space Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.font = font;
  const spaced = (upper ? text.toUpperCase() : text).split('').join(String.fromCharCode(8202)); // hair spaces ≈ tracking
  const w = Math.ceil(ctx.measureText(spaced).width * (1 + letterSpacing * 0.5)) + px;
  c.width = w; c.height = Math.ceil(px * 1.5);
  ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'middle';
  ctx.fillText(spaced, px / 2, c.height / 2);
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
  const font = `${weight} ${px}px "Space Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.font = font;
  const w = Math.ceil(Math.max(...lines.map((l) => ctx.measureText(l).width))) + px;
  c.width = w; c.height = Math.ceil(px * lineHeight * lines.length + px * 0.5);
  ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'top';
  lines.forEach((l, i) => ctx.fillText(l, px / 2, px * 0.25 + i * px * lineHeight));
  const tex = new CanvasTexture(c); tex.minFilter = LinearFilter; tex.generateMipmaps = false;
  const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 0.95 });
  const s = new Sprite(mat);
  const worldH = height * lines.length * lineHeight;
  s.scale.set(worldH * (c.width / c.height), worldH, 1);
  s.center.set(0, 1);   // anchor at the top-left so `pos` is where the first line starts
  return s;
}
