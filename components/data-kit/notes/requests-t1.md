# Requests from t1 (dk-glow, dk-trigger, dk-lineup, dk-ground)

1. **check.mjs** (owner: core): for a `dk-glow`,
   - warn when the deck's headmatter lacks `plugins: [lhcb]`;
   - warn when `of` names no `detector` object in the space;
   - warn when no detector names the same `src` (default `lhcb`).
   Why: dk-glow fetches `stage-data/lhcb-grains.bin`, which the build serves only when
   the deck names that src. Without it, dk-glow warns in the console and draws nothing.
2. **check.mjs** (owner: core): for a `dk-ground`, suggest `"enterable": true` when it is
   missing. Why: stage:check's `camera-inside-form` cannot see the kit's registration
   flag, so every floor slide warns.
3. **README "Install it in a deck"** (owner: core): a deck that draws the crossing adds
   `lhc-collision` to the `stage:check --types` list (lab 1 does). It must also pass
   palette colours to `lhc-collision` (`tone`, `muonTone`, `splashTone`, `bunchColor`),
   because its defaults are gold (`components/lhc-opening/collision.js:256-257`).
4. **Crossing.vue + slideNav.js** (bible §4, components row; no owner named in the kit
   tasks): lift MasterTalk's into the kit. Lab 1 has a lab-only stand-in,
   `talks/2026_00_00_DataLab1/setup/Crossing.vue`. Note that a component called
   `LabCrossing` breaks the build (unplugin-icons resolves it as the `la` icon set), so
   pick a component name whose first word is no icon-set prefix.
5. **style.js** (owner: core): a palette detector preset, e.g.
   `export function detectorParts(p) { return { preset: 'lhcb', velo: { alpha: 0.25 }, pipe: { alpha: 0 }, magnet: { color: p.accent, alpha: 0.25 }, rich1: { color: p.accent }, rich2: { color: p.accent }, hcal: { color: p.accent } }; }`,
   and a README line telling each T1/T4 deck to write its result into the detector object's
   `parts` (space.json is JSON, so a deck copies the literal; in classic the accent is
   `#7dd3fc`). Why: the engine's lhcb PART_COLORS paint the pipe, magnet, RICH and HCAL in
   royal and navy blues (#5b93ff, #7fa9ff, #8fb6ff), off the series' light-blue crowd (review
   of lab 1, slides 2-3). Lab 1 and `glow.js`'s header carry the literal for now.
6. **README** (owner: core), the t1 sections, to match the code after the review fix (29 Oct):
   - dk-trigger table: replace the `buffer` row with
     `| buffer | none | { at, len (8), r (3.2), grains (6000), hold (3), step (3), spin (0.08), alpha (0.7) }: from step step, parked packets (grains / per knots of per grains) on a prolate-spheroid shell round the lane, len long and r wide, never inside it, turning as one at spin rad/s; packets in its span move hold times slower and, while the buffer is on, ride out onto the shell and back |`
   - add rows `| knot | 0.1 | one packet's spread across the lane (σ; 1.6× along it): small keeps a dense lane reading as many packets |`
     and `| minPx | 0 | a floor on a grain's size in px (900-high frame) for a wide shot; 0 keeps the series size |`.
   - the example: `"grains": 33000, "lane": 0.7, "knot": 0.08, "packets": 1800, "per": 14,` …
     `"buffer": { "at": 49, "len": 12, "r": 4.5, "grains": 6000, "hold": 3 }, "ours": [13, 14, 34, 70, 70]`.
   - dk-glow: after "Steps", add "The fronts and the glow are the crowd (light blue, lifted by
     alpha); only the sparkle of hits is white. Put the detector in the palette (item 5)."
   Why: the README is core's file, so lane t1 did not edit it.
