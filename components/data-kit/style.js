// The series constants (bible §3, "Look"): one file, so five decks built by five
// hands look like one series. No talk overrides these; a builder reads them
// through `kit.style`. Colours are roles over the deck's palette (classic), never
// literals: the crowd is the accent (light blue), the selected is fg (white), axis
// grains are dim. Never gold.

// ---- grains ---------------------------------------------------------------------
// The grain size every dk form draws one candidate at (GRAIN_GLSL place() size:
// px = frameScale · size · 72 / distance), and our grain's (row 1, bible §2).
export const GRAIN = 1.25;
export const OURS = 2.5;
// The seed every placement, order and toy starts from unless an object gives its
// own (record 401: the series' one dataset).
export const SEED = 401;
// Our grain: row 1 of record 401 (index 0 in d0.f32), in every talk.
export const OURS_ROW = 0;

// ---- the floor and the plot frame ---------------------------------------------------
// The one floor every histogram and heap stands on (dk-ground draws it): the
// plane y = FLOOR_Y in a station's frame, mass running to +x.
export const FLOOR_Y = 0;
// The mass axis: world units per MeV/c², the series' range and bin. A dk-hist on
// mass (no `width` of its own) is drawn at this scale, so every peak plot in every
// talk has the same peak in the same place and the same size. The range is 1 816-1 912
// (the owner's decision, 29 Oct): record 401's stripping window (about 1 813-1 915)
// leaves the outer bins of 1 810-1 920 half empty, and they read as dips. 48 bins of 2.
export const MASS = { scale: 0.25, lo: 1816, hi: 1912, bin: 2 };
// A histogram's height in world units, unless an object gives `height`.
export const HEIGHT = 11;
// The tick spacing on the mass axis (MeV/c²); other axes take `ticks` or a nice step.
export const TICK_MASS = 20;

// ---- labels ---------------------------------------------------------------------
// Tick numbers and the one axis caption: fixed-size world labels (label.js). px is
// the font size on a 1080-high frame. The house floor is 18 px on the 980-wide canvas
// (docs/talk-quality.md §9), whose 16:9 frame is 551 high: 18 × 1080 / 551 = 35.3, so 36
// on a 1080 frame is the floor no label goes under, and the size every tick takes (29 Oct,
// the series check: 24 drew 12 px ticks, and T3/T4 set `tickPx: 36` on their own).
export const LABEL = { px: 36, minPx: 36, captionPx: 36 };

// ---- colour roles over the palette ------------------------------------------------
// crowd: every candidate, background, the unselected. sel: kept, signal, inside the
// cut. axis: axis grains only. tick: tick numbers. name: the axis caption (the
// palette's fill, #9fd8ff in classic: the bible's name colour).
export function roles(p) {
  return {
    crowd: p.accent,
    sel: p.fg,
    axis: p.dim,
    tick: p.ink || p.fg,
    name: p.fill || p.text || p.accent,
  };
}

// ---- brightness --------------------------------------------------------------------
// One grain's alpha so that a column reads as a column of light blue and not as a
// white bar under the bloom: dense stacks dim each grain, a sparse plot shows each
// grain whole. `perColumn`: grains in the tallest column now. Fixed size, varying
// alpha: the grain stays the series grain at every density.
export function alphaFor(perColumn) {
  // the fragment writes (colour · alpha)^2.2 in linear light: a lone grain at ~1 is whole,
  // and a few overlapping grains at ~0.4 make a column a mid light blue (tuned on the
  // D⁰ peak, 3 746 grains in its tallest column, seen from 25 units: lab 2, 29 Oct)
  const k = Math.max(1, perColumn);
  return Math.min(1.5, Math.max(0.3, 1.3 * Math.pow(60 / k, 0.25)));
}

// ---- numbers -----------------------------------------------------------------------
// Ticks and counts: digits grouped from 4 with a narrow no-break space, as
// <StageCount lang="en"> writes them.
export function fmt(v, decimals = 0) {
  const s = Number(v).toFixed(decimals);
  const [i, d] = s.split('.');
  const neg = i.startsWith('-');
  const digits = neg ? i.slice(1) : i;
  const grouped = digits.length >= 4 ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : digits;
  return (neg ? '-' : '') + grouped + (d ? '.' + d : '');
}

// ---- the detector in the series' colours ------------------------------------------
// The engine's lhcb plugin paints the pipe, magnet, RICH and HCAL in its own royal and
// navy blues. A T1/T4 deck writes this object (classic: accent #7dd3fc) into its
// detector object's `parts` in space.json (JSON, so the deck copies the literal; print
// it with `node -e "import('./components/data-kit/style.js').then(s => console.log(JSON.stringify(s.detectorParts({accent:'#7dd3fc'}))))"`).
// Since 30 Oct every part takes the palette's `dust` (classic #4d8cb8), one step deeper
// than the crowd: dk-glow's light-blue fronts, the hits and our white ring are then the only
// bright things in the detector (T1 request 16; with the accent the front ran over grains of
// its own colour and the VELO read as a white blob). The old accent look: `detectorParts(p, 'accent')`.
export function detectorParts(p, look = 'dust') {
  if (look === 'accent') {
    return {
      preset: 'lhcb', velo: { alpha: 0.25 }, pipe: { alpha: 0 }, magnet: { color: p.accent, alpha: 0.25 },
      rich1: { color: p.accent }, rich2: { color: p.accent }, hcal: { color: p.accent },
    };
  }
  const c = p.dust ?? p.accent;
  return {
    preset: 'lhcb',
    velo: { color: c, alpha: 0.25 },
    pipe: { alpha: 0 },
    rich1: { color: c }, ut: { color: c }, magnet: { color: c, alpha: 0.25 }, scifi: { color: c },
    rich2: { color: c }, ecal: { color: c }, hcal: { color: c }, muon: { color: c },
  };
}
