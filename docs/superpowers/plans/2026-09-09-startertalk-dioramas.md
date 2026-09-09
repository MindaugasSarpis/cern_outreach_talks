# Startertalk dioramas Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the date × mass × lane chart under the Startertalk deck with a path of seven built scenes (dioramas), and give the deck a paper-page opening, two new physics slides (missing neutrals; six quarks), tighter text and a de-slopped voice.

**Architecture:** The three.js scene keeps its ambient GPGPU particle field, camera spring, HUD stops and scrim; it stops laying hadrons out by year and mass and instead builds stations from a hand-written `public/data/space.json`, one builder per object type in a new module `components/hadron-space/dioramas.js`. Pentaquark records still come from `hadrons.json` (trimmed to the ten states the talk names) and are placed by the `states` station. Slides address stations and states by id in `space.at`, exactly as before.

**Tech Stack:** Slidev 52 (Vue 3), three.js (already a dependency of the components), matplotlib (figures), Python 3.11 (data), Playwright Chromium with SwiftShader (screenshots, `~/slidev-videos/.tmp/st-all.mjs`).

**Spec:** `docs/superpowers/specs/2026-09-09-startertalk-dioramas-design.md` (sections 2–4 are the requirements; the earlier spec `2026-09-09-startertalk-hadron-space-design.md` still governs HUD, stops, scrim, `asof`, `dim`).

## Global Constraints

- Physics on screen and in notes must be sourced (arXiv id / journal / PDG 2024); numbers only from the research brief in `docs/superpowers/plans/2026-09-09-startertalk-dioramas-research.md` (written in Task 8) or already in the deck.
- Voice: plain, direct; no antithesis titles, no fragments as slogans, no "X: Y" headline tics, no anthropomorphic verbs, no praise adjectives; British spelling; ≤ 40 words on screen for the cut slides, ≤ 60 elsewhere; one claim per slide.
- Frontmatter contract unchanged: `space: {at, dist, yaw, pitch, stops, asof, dim}`, `clicks` = `stops.length`; `at` is a station id, a state id or `[x, y, z]`.
- Fallback unchanged: without WebGL2 float render targets the component shows the static gradient; the deck must still build and read.
- No videos; no changes to the theme, to other talks, or to the WoP hero's behaviour (the shared shader gains one uniform that defaults to zero).
- Every visual change is verified with headless SwiftShader screenshots (`st-all.mjs`); every commit leaves `pnpm build` green in the talk dir.
- Commands run from `/home/mindaugas_wsl/outreach_talks/talks/2026_09_00_Startertalk` unless stated; Python is `~/micromamba/envs/outreach_talks/bin/python`.

---

## File map

| File | Responsibility |
|---|---|
| `talks/2026_09_00_Startertalk/public/data/space.json` (new) | The seven stations and their objects; camera `look` per station |
| `talks/2026_09_00_Startertalk/public/figures/papers/zweig_th401_p1.png` (new) | Page 1 of CERN-TH-401 rendered from the CDS PDF (record 352337) |
| `talks/2026_09_00_Startertalk/scripts/fetch_zweig.sh` (new) | Documents the CDS record and renders the page with mutool when the PDF is present |
| `talks/2026_09_00_Startertalk/scripts/check_space.mjs` (new) | Validates `space.json` and that every `space.at` / stop id in `deck.md` resolves |
| `components/hadron-space/dioramas.js` (new) | `buildStation(station, ctx)` → `{ group, anchors, update(t), setDim(k) }`; one builder per object type |
| `components/hadron-space/space.js` (modify) | Drops the chart layout; loads stations; poses by station; gather target; per-frame `update` |
| `components/particle-hero/shaders/passes.glsl.js` (modify) | `uGather` term in `VEL_FRAG` |
| `components/HadronSpace.vue` (modify) | Fetches `space.json` too; passes it to `createSpace` |
| `talks/2026_09_00_Startertalk/scripts/hadrons.py` (modify) | Output only the ten states the talk names; no lanes |
| `talks/2026_09_00_Startertalk/deck.md` (modify) | Poses, paper slide, two new slides, cuts, editorial pass |
| `talks/2026_09_00_Startertalk/styles/index.css` (modify) | `.quote-hero` for the paper slide |
| `CLAUDE.md`, both specs (modify) | Document the station model |

---

### Task 1: Station data and its checker

**Files:**
- Create: `talks/2026_09_00_Startertalk/public/data/space.json`
- Create: `talks/2026_09_00_Startertalk/scripts/check_space.mjs`

**Interfaces:**
- Produces: `space.json` schema `{ "stations": [ { id, pos:[x,y,z], look:{dist,yaw,pitch,target?:[x,y,z]}, objects:[ {type, ...} ] } ] }`. Object types and their fields are fixed here and consumed by Task 3:
  - `page`: `{type:"page", src, pos, width, height, yaw}` (src is a URL under `public/`)
  - `text`: `{type:"text", text, pos, height, color?, weight?}` (`text` may hold `\n`)
  - `ring`: `{type:"ring", pos, radius, color?, fadeNear?:number}`
  - `tracks`: `{type:"tracks", pos, tracks:[{points:[[x,y,z],…], color, width?, dashed?, fade?, label?}], pulse?:boolean, nodes?:[{pos,color,size}]}`
  - `spheres`: `{type:"spheres", pos, ids:[...], origin:number, scale:number, rows:{"Pc":z, "Pcs":z}, labels?:boolean}`
  - `planes`: `{type:"planes", pos, planes:[{mass, label, row:"Pc"|"Pcs"}], origin, scale, height, depth}`
  - `cluster`: `{type:"cluster", pos, radius, quarks:[{flavour:"c"|"u"|"d"|"cbar", pos:[x,y,z]}], shell?:boolean, spin?:number, label?}`
  - `molecule`: `{type:"molecule", pos, separation, a:{radius, quarks}, b:{radius, quarks}, link?:boolean, label?}`
  - `grid`: `{type:"grid", pos, from, to, step, fadeAlong:"x"}`
  - `bar`: `{type:"bar", pos, length, label}` (the 1 fm scale bar)
- `check_space.mjs` exits non-zero on any unknown type, missing field, duplicate station id, or a `space.at`/`stops` id in `deck.md` that is neither a station id, a state id in `hadrons.json`, a named pose (`wide`, `origin`, `future`) nor an `[x,y,z]` array.

- [ ] **Step 1: Write the checker (it is the test for the data)**

```js
// talks/2026_09_00_Startertalk/scripts/check_space.mjs
// Validate public/data/space.json and every space.at / stops id in deck.md.
// Usage: node scripts/check_space.mjs   (from the talk dir; exit 1 on any problem)
import { readFileSync } from 'node:fs';
const space = JSON.parse(readFileSync('public/data/space.json', 'utf8'));
const hadrons = JSON.parse(readFileSync('public/data/hadrons.json', 'utf8'));
const deck = readFileSync('deck.md', 'utf8');
const problems = [];
const REQUIRED = {
  page: ['src', 'pos', 'width', 'height'], text: ['text', 'pos', 'height'], ring: ['pos', 'radius'],
  tracks: ['pos', 'tracks'], spheres: ['pos', 'ids', 'origin', 'scale', 'rows'], planes: ['pos', 'planes', 'origin', 'scale', 'height', 'depth'],
  cluster: ['pos', 'radius', 'quarks'], molecule: ['pos', 'separation', 'a', 'b'], grid: ['pos', 'from', 'to', 'step'], bar: ['pos', 'length', 'label'],
};
const ids = new Set();
for (const st of space.stations) {
  if (!st.id || ids.has(st.id)) problems.push(`station id missing or duplicate: ${st.id}`);
  ids.add(st.id);
  if (!Array.isArray(st.pos) || st.pos.length !== 3) problems.push(`${st.id}: pos must be [x,y,z]`);
  if (!st.look || typeof st.look.dist !== 'number') problems.push(`${st.id}: look.dist missing`);
  for (const o of st.objects || []) {
    const req = REQUIRED[o.type];
    if (!req) { problems.push(`${st.id}: unknown object type ${o.type}`); continue; }
    for (const k of req) if (o[k] === undefined) problems.push(`${st.id}/${o.type}: missing ${k}`);
    if (o.type === 'spheres') for (const id of o.ids) if (!hadrons.states.find((s) => s.id === id)) problems.push(`${st.id}/spheres: unknown state ${id}`);
    if (o.type === 'page' && !o.src.startsWith('/figures/')) problems.push(`${st.id}/page: src must start with /figures/`);
  }
}
const stateIds = new Set(hadrons.states.map((s) => s.id));
const named = new Set(['wide', 'origin', 'future']);
const resolves = (at) => at.startsWith('[') || ids.has(at) || stateIds.has(at) || named.has(at);
for (const m of deck.matchAll(/^\s*at:\s*([^\n#]+)/gm)) { const at = m[1].trim(); if (!resolves(at)) problems.push(`deck space.at does not resolve: ${at}`); }
for (const m of deck.matchAll(/space:\s*\{[^}]*\bat:\s*([^,}\n]+)/g)) { const at = m[1].trim(); if (!resolves(at)) problems.push(`deck inline space.at does not resolve: ${at}`); }
for (const m of deck.matchAll(/stops:\s*\[([^\]]*)\]/g)) for (const id of m[1].split(',').map((s) => s.trim()).filter(Boolean)) if (!stateIds.has(id)) problems.push(`deck stop is not a state id: ${id}`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`space.json ok: ${space.stations.length} stations, ${space.stations.reduce((n, s) => n + (s.objects || []).length, 0)} objects; deck poses resolve`);
```

- [ ] **Step 2: Run it before the data exists to see it fail**

Run: `node scripts/check_space.mjs`
Expected: exits 1 with `ENOENT … space.json`.

- [ ] **Step 3: Write the station data**

Coordinates: the path runs along +x; 1 fm = 3 units inside the interiors station; the states axis maps mass to x as `(m − origin) × scale` with `origin: 4400`, `scale: 0.04` (100 MeV = 4 units).

```json
{
  "stations": [
    {
      "id": "paper", "pos": [0, 0, 0],
      "look": { "target": [3.6, 3.0, 0], "dist": 12, "yaw": -12, "pitch": 4 },
      "objects": [
        { "type": "page", "src": "/figures/papers/zweig_th401_p1.png", "pos": [0, 3.0, 0], "width": 6.0, "height": 8.49, "yaw": 8 },
        { "type": "text", "text": "“Baryons can now be constructed from quarks by using\nthe combinations (qqq), (qqqqq̄), etc., while mesons\nare made out of (qq̄), (qqq̄q̄), etc.”", "pos": [8.6, 4.4, 0.4], "height": 0.5, "color": "#f2f5f9", "weight": 500 },
        { "type": "text", "text": "Gell-Mann, Phys. Lett. 8 (1964) 214", "pos": [8.6, 2.9, 0.4], "height": 0.36, "color": "#8b97a6" },
        { "type": "cluster", "pos": [8.6, 0.6, 0.4], "radius": 1.5, "spin": 0.12, "quarks": [
          { "flavour": "u", "pos": [0.55, 0.25, 0] }, { "flavour": "u", "pos": [-0.5, 0.35, 0.2] }, { "flavour": "d", "pos": [0, -0.55, -0.1] },
          { "flavour": "c", "pos": [0.1, 0.05, 0.55] }, { "flavour": "cbar", "pos": [-0.3, -0.2, -0.55] } ] }
      ]
    },
    {
      "id": "theta", "pos": [16, 1, -5],
      "look": { "dist": 8, "yaw": -40, "pitch": 6 },
      "objects": [
        { "type": "ring", "pos": [0, 0, 0], "radius": 0.9, "color": "#7dd3fc", "fadeNear": 6 },
        { "type": "text", "text": "Θ⁺(1540) · 2003 · not confirmed", "pos": [0, -1.6, 0], "height": 0.4, "color": "#8b97a6" }
      ]
    },
    {
      "id": "decay", "pos": [30, 0, 2],
      "look": { "target": [2.4, 0, 0], "dist": 10, "yaw": -24, "pitch": 7 },
      "objects": [
        { "type": "tracks", "pos": [0, 0, 0], "pulse": true,
          "nodes": [ { "pos": [0, 0, 0], "color": "#f2f5f9", "size": 0.16 }, { "pos": [2.6, -0.6, 0], "color": "#3987e5", "size": 0.26 } ],
          "tracks": [
            { "points": [[-4, 0, 0], [0, 0, 0]], "color": "#f2f5f9", "width": 2, "label": "Λb⁰" },
            { "points": [[0, 0, 0], [4.2, 3.2, 0.5]], "color": "#f2f5f9", "width": 2, "label": "K⁻" },
            { "points": [[0, 0, 0], [2.6, -0.6, 0]], "color": "#3987e5", "width": 3, "label": "Pc⁺" },
            { "points": [[2.6, -0.6, 0], [5.6, 0.9, -0.4]], "color": "#3987e5", "width": 2, "label": "J/ψ" },
            { "points": [[2.6, -0.6, 0], [5.3, -2.7, 0.3]], "color": "#3987e5", "width": 2, "label": "p" },
            { "points": [[0, 0, 0], [2.4, -1.9, -1.6]], "color": "#d95926", "width": 1.5, "dashed": true, "fade": 0.5, "label": "Λ*" },
            { "points": [[2.4, -1.9, -1.6], [5.0, -3.1, -1.9]], "color": "#d95926", "width": 1.5, "dashed": true, "fade": 0.5 },
            { "points": [[2.4, -1.9, -1.6], [5.2, -1.0, -2.6]], "color": "#d95926", "width": 1.5, "dashed": true, "fade": 0.5 }
          ] }
      ]
    },
    {
      "id": "states", "pos": [46, 0, -3],
      "look": { "target": [0, 0, -1.5], "dist": 9, "yaw": -22, "pitch": 6 },
      "objects": [
        { "type": "planes", "pos": [0, 0, 0], "origin": 4400, "scale": 0.04, "height": 1.6, "depth": 2.4,
          "planes": [ { "mass": 4317.5, "label": "Σc⁺D̄⁰", "row": "Pc" }, { "mass": 4459.5, "label": "Σc⁺D̄*⁰", "row": "Pc" },
                      { "mass": 4337.4, "label": "Ξc⁺D⁻", "row": "Pcs" }, { "mass": 4477.3, "label": "Ξc⁰D̄*⁰", "row": "Pcs" } ] },
        { "type": "spheres", "pos": [0, 0, 0], "origin": 4400, "scale": 0.04, "rows": { "Pc": 0, "Pcs": -3 }, "labels": true,
          "ids": ["Pc(4380)", "Pc(4450)", "Pc(4312)", "Pc(4440)", "Pc(4457)", "Pc(4337)", "Pcs(4459)", "Pcs(4338)"] },
        { "type": "text", "text": "4300", "pos": [-4.0, -1.1, 0.6], "height": 0.3, "color": "#8b97a6" },
        { "type": "text", "text": "4400 MeV", "pos": [0, -1.1, 0.6], "height": 0.3, "color": "#8b97a6" },
        { "type": "text", "text": "4500", "pos": [4.0, -1.1, 0.6], "height": 0.3, "color": "#8b97a6" },
        { "type": "text", "text": "J/ψ p", "pos": [-5.6, 0, 0], "height": 0.4, "color": "#a9b6c4" },
        { "type": "text", "text": "J/ψ Λ", "pos": [-5.6, 0, -3], "height": 0.4, "color": "#a9b6c4" }
      ]
    },
    {
      "id": "interiors", "pos": [64, 0, 0],
      "look": { "dist": 16, "yaw": -30, "pitch": 10 },
      "objects": [
        { "type": "molecule", "pos": [-4.5, 0, 0], "separation": 6.0, "link": true, "label": "two hadrons",
          "a": { "radius": 1.6, "quarks": [ { "flavour": "c", "pos": [0, 0.5, 0] }, { "flavour": "u", "pos": [-0.5, -0.35, 0.1] }, { "flavour": "d", "pos": [0.5, -0.35, -0.1] } ] },
          "b": { "radius": 1.3, "quarks": [ { "flavour": "cbar", "pos": [-0.35, 0.05, 0] }, { "flavour": "u", "pos": [0.4, -0.1, 0.05] } ] } },
        { "type": "cluster", "pos": [5.0, 0, 0], "radius": 1.9, "shell": true, "spin": 0.15, "label": "one hadron", "quarks": [
          { "flavour": "c", "pos": [0.1, 0.55, 0.2] }, { "flavour": "cbar", "pos": [-0.55, 0.1, -0.2] }, { "flavour": "u", "pos": [0.55, -0.15, -0.25] },
          { "flavour": "u", "pos": [-0.1, -0.55, 0.3] }, { "flavour": "d", "pos": [0.05, 0.0, -0.6] } ] },
        { "type": "bar", "pos": [-7.0, -2.8, 0], "length": 3.0, "label": "1 fm" }
      ]
    },
    {
      "id": "neutrals", "pos": [82, 0, -2],
      "look": { "target": [3.0, 0, 0], "dist": 11, "yaw": -18, "pitch": 6 },
      "objects": [
        { "type": "tracks", "pos": [0, 0, 0],
          "nodes": [ { "pos": [0, 0, 0], "color": "#f2f5f9", "size": 0.16 }, { "pos": [2.6, 0.9, 0], "color": "#d95926", "size": 0.2 }, { "pos": [2.6, -0.9, 0], "color": "#3987e5", "size": 0.2 } ],
          "tracks": [
            { "points": [[-4, 0, 0], [0, 0, 0]], "color": "#f2f5f9", "width": 2, "label": "Λb⁰" },
            { "points": [[0, 0, 0], [4.6, 2.6, 0]], "color": "#f2f5f9", "width": 2, "label": "K⁻" },
            { "points": [[0, 0, 0], [2.6, 0.9, 0]], "color": "#d95926", "width": 3, "label": "Σc⁺" },
            { "points": [[0, 0, 0], [2.6, -0.9, 0]], "color": "#3987e5", "width": 3, "label": "D̄*⁰" },
            { "points": [[2.6, 0.9, 0], [5.6, 1.7, 0]], "color": "#d95926", "width": 2, "label": "Λc⁺" },
            { "points": [[2.6, 0.9, 0], [4.8, 0.25, 0.9]], "color": "#d95926", "width": 1.5, "dashed": true, "fade": 0.35, "label": "π⁰ not seen" },
            { "points": [[2.6, -0.9, 0], [5.6, -1.7, 0]], "color": "#3987e5", "width": 2, "label": "D̄⁰" },
            { "points": [[2.6, -0.9, 0], [4.8, -0.3, -0.9]], "color": "#3987e5", "width": 1.5, "dashed": true, "fade": 0.35, "label": "π⁰ / γ not seen" }
          ] },
        { "type": "cluster", "pos": [10.5, 0.5, 0], "radius": 2.1, "shell": true, "spin": 0.1, "label": "six quarks", "quarks": [
          { "flavour": "c", "pos": [0.2, 0.6, 0.2] }, { "flavour": "u", "pos": [-0.6, 0.3, -0.1] }, { "flavour": "d", "pos": [0.6, -0.1, -0.3] },
          { "flavour": "c", "pos": [-0.2, -0.6, 0.3] }, { "flavour": "u", "pos": [0.1, 0.0, -0.7] }, { "flavour": "d", "pos": [-0.1, 0.05, 0.7] } ] }
      ]
    },
    {
      "id": "future", "pos": [98, 0, 0],
      "look": { "dist": 10, "yaw": -30, "pitch": 6 },
      "objects": [ { "type": "grid", "pos": [0, -1.5, 0], "from": -8, "to": 10, "step": 2, "fadeAlong": "x" } ]
    }
  ]
}
```

- [ ] **Step 4: Run the checker; expect only deck-pose failures**

Run: `node scripts/check_space.mjs`
Expected: exits 1 listing `deck space.at does not resolve: quarks-1964`, `J/psi`, `[8.5, 3.2, -8]`… (the deck still carries the old poses; Task 7 fixes them). No station or object errors. If an object error appears, fix the JSON.

- [ ] **Step 5: Commit**

```bash
git add public/data/space.json scripts/check_space.mjs
git commit -m "feat(startertalk): station data for the diorama world + checker"
```

---

### Task 2: Zweig page image and its script

**Files:**
- Create: `talks/2026_09_00_Startertalk/scripts/fetch_zweig.sh`
- Create: `talks/2026_09_00_Startertalk/public/figures/papers/zweig_th401_p1.png`

- [ ] **Step 1: Write the script**

```bash
#!/usr/bin/env bash
# Page 1 of G. Zweig, "An SU(3) model for strong interaction symmetry and its
# breaking", CERN-TH-401, 17 January 1964. Source: CERN Document Server record
# 352337, http://cds.cern.ch/record/352337/files/CERN-TH-401.pdf (public).
# CDS sits behind a browser check for plain HTTP clients, so download the PDF
# in a browser and pass its path; this renders page 1 with mutool.
# Usage: scripts/fetch_zweig.sh /path/to/CERN-TH-401.pdf
set -euo pipefail
PDF="${1:?path to CERN-TH-401.pdf}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/figures/papers/zweig_th401_p1.png"
mutool draw -r 130 -o "$OUT" "$PDF" 1
printf '%s %s\n' "$(basename "$OUT")" "$(du -h "$OUT" | cut -f1)"
```

- [ ] **Step 2: Render the page from the PDF already fetched this session**

Run: `chmod +x scripts/fetch_zweig.sh && scripts/fetch_zweig.sh /tmp/claude-1001/-home-mindaugas-wsl-outreach-talks/71e95d3a-78b5-4d1f-adaa-2682c960f41b/scratchpad/zweig/CERN-TH-401.pdf`
Expected: `zweig_th401_p1.png` written, under 600 kB, 1085 × 1535 px (A4 at 130 dpi). Open it with the Read tool: title line, "aces", "baryon number 1/3", the date "17 January 1964" all legible.

- [ ] **Step 3: Commit**

```bash
git add scripts/fetch_zweig.sh public/figures/papers/zweig_th401_p1.png
git commit -m "feat(startertalk): Zweig CERN-TH-401 page 1 for the paper station"
```

---

### Task 3: Diorama builders

**Files:**
- Create: `components/hadron-space/dioramas.js`

**Interfaces:**
- Consumes: object schemas from Task 1; `makeLabel(text, opts)` exported from `space.js` (Task 4 exports it; until then the builder module defines its own copy with the same signature — see Step 1, `makeLabel` is imported from `./labels.js`, which Task 4 also uses).
- Produces: `export function buildStation(station, ctx)` where `ctx = { states: Map<id, stateRecord>, THREE }` and the return is `{ group: THREE.Group, anchors: Map<id, THREE.Vector3>, update(t, camPos), setDim(k), dispose() }`. `anchors` holds the world position of every state sphere (keyed by state id) and of the station centre (`station.id`). `update` advances pulses, spins and the ring fade. `setDim(k)` fades label sprites by `0.9 * max(0, 1 − k/0.85)`.
- Also produces `components/hadron-space/labels.js` exporting `makeLabel` (moved verbatim from `space.js`) plus `makeText(text, {height, color, weight})` for multi-line text (one canvas, `\n` splits lines, left-aligned, no uppercasing, no tracking).

- [ ] **Step 1: Create `labels.js`**

Move `makeLabel` from `space.js` lines 82–99 unchanged, and add:

```js
// Multi-line, mixed-case text as a sprite (the paper quotation, station notes).
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
```

(`CanvasTexture, LinearFilter, Sprite, SpriteMaterial` imported from `three` at the top of `labels.js`.)

- [ ] **Step 2: Create `dioramas.js` with the builders**

```js
import {
  Group, Mesh, MeshBasicMaterial, PlaneGeometry, TorusGeometry, SphereGeometry, BufferGeometry, BufferAttribute,
  Line, LineSegments, LineBasicMaterial, LineDashedMaterial, TextureLoader, Vector3, DoubleSide, AdditiveBlending, Color,
} from 'three';
import { makeLabel, makeText } from './labels.js';

// Builders for the stations of the Startertalk hadron space (spec
// 2026-09-09-startertalk-dioramas-design.md §2–3). One function per object
// type; buildStation() composes them into a Group placed at station.pos and
// returns the anchors (state spheres, station centre), an update(t, camPos)
// for the small motions, and setDim(k) so labels fade with the scrim.

const QUARK = { c: '#3987e5', cbar: '#3987e5', u: '#e6e9ee', d: '#c9d1da', s: '#d95926' };
const loader = new TextureLoader();
const v = (a) => new Vector3(a[0], a[1], a[2]);

function quarkBall(q, r = 0.42) {
  const m = new Mesh(new SphereGeometry(r, 20, 14), new MeshBasicMaterial({ color: QUARK[q.flavour] || '#e6e9ee', transparent: true, opacity: 0.95 }));
  m.position.copy(v(q.pos));
  if (q.flavour === 'cbar') {                          // antiquark: a thin white rim
    const rim = new Mesh(new SphereGeometry(r * 1.12, 20, 14), new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, side: DoubleSide }));
    m.add(rim);
  }
  return m;
}
function shell(radius, color = '#7dd3fc', opacity = 0.12) {
  return new Mesh(new SphereGeometry(radius, 32, 20), new MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: AdditiveBlending, side: DoubleSide }));
}

const build = {
  page(o) {
    const g = new Group();
    const mat = new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.96, side: DoubleSide });
    loader.load(o.src, (tex) => { mat.map = tex; mat.needsUpdate = true; });
    const m = new Mesh(new PlaneGeometry(o.width, o.height), mat);
    m.rotation.y = (o.yaw || 0) * Math.PI / 180;
    g.add(m);
    // a faint lit halo behind the sheet so it reads as a lit object in the dark
    const halo = new Mesh(new PlaneGeometry(o.width * 1.25, o.height * 1.18), new MeshBasicMaterial({ color: '#7dd3fc', transparent: true, opacity: 0.08, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }));
    halo.position.z = -0.05; halo.rotation.y = m.rotation.y; g.add(halo);
    g.position.copy(v(o.pos));
    return { group: g, labels: [] };
  },
  text(o) {
    const s = makeText(o.text, { height: o.height, color: o.color, weight: o.weight });
    s.position.copy(v(o.pos));
    return { group: s, labels: [s] };
  },
  ring(o) {
    const g = new Group();
    const mat = new MeshBasicMaterial({ color: o.color || '#7dd3fc', transparent: true, opacity: 0.85, blending: AdditiveBlending, depthWrite: false });
    const ring = new Mesh(new TorusGeometry(o.radius, o.radius * 0.07, 12, 64), mat);
    g.add(ring); g.position.copy(v(o.pos));
    const fadeNear = o.fadeNear || 0;
    return { group: g, labels: [], update(t, camPos) {
      ring.rotation.y = t * 0.2;
      if (fadeNear) { const d = camPos.distanceTo(g.getWorldPosition(new Vector3())); mat.opacity = 0.15 + 0.7 * Math.min(1, Math.max(0, (d - fadeNear) / fadeNear)); }
    } };
  },
  tracks(o) {
    const g = new Group(); const labels = []; const pulses = [];
    for (const t of o.tracks) {
      const pts = t.points.map(v);
      const geo = new BufferGeometry().setFromPoints(pts);
      const col = new Color(t.color || '#f2f5f9');
      const mat = t.dashed
        ? new LineDashedMaterial({ color: col, transparent: true, opacity: t.fade ?? 0.9, dashSize: 0.22, gapSize: 0.16, depthWrite: false })
        : new LineBasicMaterial({ color: col, transparent: true, opacity: t.fade ?? 0.9, depthWrite: false });
      const line = new Line(geo, mat); if (t.dashed) line.computeLineDistances();
      g.add(line);
      // a soft glow: a second, wider-looking pass via additive blending
      g.add(new Line(geo.clone(), new LineBasicMaterial({ color: col, transparent: true, opacity: 0.25 * (t.fade ?? 1), blending: AdditiveBlending, depthWrite: false })));
      if (t.label) { const l = makeLabel(t.label, { worldH: 0.34, color: t.color || '#f2f5f9', letterSpacing: 0.04 }); const end = pts[pts.length - 1]; l.position.set(end.x + 0.45, end.y + 0.25, end.z); g.add(l); labels.push(l); }
      if (o.pulse && !t.dashed) pulses.push({ pts, dot: g.add(new Mesh(new SphereGeometry(0.09, 10, 8), new MeshBasicMaterial({ color: col, transparent: true, opacity: 0.9, blending: AdditiveBlending, depthWrite: false }))).children.at(-1) });
    }
    for (const n of o.nodes || []) { const m = new Mesh(new SphereGeometry(n.size, 16, 12), new MeshBasicMaterial({ color: n.color, transparent: true, opacity: 0.95 })); m.position.copy(v(n.pos)); g.add(m); }
    g.position.copy(v(o.pos));
    return { group: g, labels, update(t) {
      // one pulse runs down every solid track in 3 s, staggered by track index
      pulses.forEach((p, i) => { const u = ((t * 0.33 + i * 0.13) % 1); const a = p.pts[0], b = p.pts[p.pts.length - 1]; p.dot.position.lerpVectors(a, b, u); p.dot.material.opacity = 0.9 * Math.sin(Math.PI * u); });
    } };
  },
  spheres(o, ctx) {
    // state markers: filled when observed, hollow otherwise; placed by mass
    const g = new Group(); const labels = []; const anchors = new Map();
    for (const id of o.ids) {
      const s = ctx.states.get(id); if (!s) continue;
      const row = id.startsWith('Pcs') ? 'Pcs' : 'Pc';
      const x = (s.mass - o.origin) * o.scale, z = o.rows[row];
      const hollow = s.status !== 'observed';
      const color = row === 'Pcs' ? '#d95926' : '#3987e5';
      const m = hollow
        ? new Mesh(new TorusGeometry(0.34, 0.05, 10, 40), new MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }))
        : new Mesh(new SphereGeometry(0.34, 20, 14), new MeshBasicMaterial({ color }));
      m.position.set(x, 0, z); g.add(m);
      g.add(Object.assign(shell(0.6, color, 0.18), { position: new Vector3(x, 0, z) }));
      anchors.set(id, new Vector3(x, 0, z));
      if (o.labels) { const l = makeLabel(s.label || id, { worldH: 0.3, color: '#e6e9ee', letterSpacing: 0.04 }); l.position.set(x, 0.75 + (o.ids.indexOf(id) % 2) * 0.32, z); g.add(l); labels.push(l); }
    }
    g.position.copy(v(o.pos));
    return { group: g, labels, anchors };
  },
  planes(o) {
    const g = new Group(); const labels = [];
    for (const p of o.planes) {
      const x = (p.mass - o.origin) * o.scale, z = o.row === 'Pcs' ? -3 : (p.row === 'Pcs' ? -3 : 0);
      const m = new Mesh(new PlaneGeometry(o.depth, o.height), new MeshBasicMaterial({ color: '#7dd3fc', transparent: true, opacity: 0.13, side: DoubleSide, depthWrite: false, blending: AdditiveBlending }));
      m.rotation.y = Math.PI / 2; m.position.set(x, 0, z); g.add(m);
      const l = makeLabel(p.label, { worldH: 0.26, color: '#8b97a6', letterSpacing: 0.04 }); l.position.set(x, o.height / 2 + 0.25, z); g.add(l); labels.push(l);
    }
    g.position.copy(v(o.pos));
    return { group: g, labels };
  },
  cluster(o) {
    const g = new Group(); const labels = []; const balls = new Group();
    for (const q of o.quarks) balls.add(quarkBall(q, 0.42 * (o.radius / 1.9)));
    g.add(balls);
    if (o.shell) g.add(shell(o.radius));
    if (o.label) { const l = makeLabel(o.label, { worldH: 0.4, color: '#f2f5f9', letterSpacing: 0.08 }); l.position.set(0, o.radius + 0.7, 0); g.add(l); labels.push(l); }
    g.position.copy(v(o.pos));
    return { group: g, labels, update(t) { balls.rotation.y = t * (o.spin || 0); balls.rotation.x = Math.sin(t * 0.3) * 0.15; } };
  },
  molecule(o) {
    const g = new Group(); const labels = [];
    const A = new Group(), B = new Group();
    for (const q of o.a.quarks) A.add(quarkBall(q, 0.42)); A.add(shell(o.a.radius)); A.position.x = -o.separation / 2;
    for (const q of o.b.quarks) B.add(quarkBall(q, 0.42)); B.add(shell(o.b.radius)); B.position.x = o.separation / 2;
    g.add(A, B);
    if (o.link) {
      // exchange glow: a faint additive line between the shells, pulsing
      const geo = new BufferGeometry().setFromPoints([new Vector3(-o.separation / 2 + o.a.radius, 0, 0), new Vector3(o.separation / 2 - o.b.radius, 0, 0)]);
      const mat = new LineDashedMaterial({ color: '#7dd3fc', transparent: true, opacity: 0.6, dashSize: 0.3, gapSize: 0.2, blending: AdditiveBlending, depthWrite: false });
      const link = new Line(geo, mat); link.computeLineDistances(); g.add(link);
      g.userData.link = mat;
    }
    if (o.label) { const l = makeLabel(o.label, { worldH: 0.4, color: '#f2f5f9', letterSpacing: 0.08 }); l.position.set(0, Math.max(o.a.radius, o.b.radius) + 0.7, 0); g.add(l); labels.push(l); }
    g.position.copy(v(o.pos));
    return { group: g, labels, update(t) { A.rotation.y = t * 0.12; B.rotation.y = -t * 0.15; if (g.userData.link) g.userData.link.opacity = 0.35 + 0.25 * Math.sin(t * 1.3); } };
  },
  grid(o) {
    const pts = []; const cols = [];
    for (let x = o.from; x <= o.to; x += o.step) { pts.push(x, 0, -8, x, 0, 8); const a = 1 - (x - o.from) / (o.to - o.from); cols.push(a, a, a, a, a, a); }
    for (let z = -8; z <= 8; z += o.step) { pts.push(o.from, 0, z, o.to, 0, z); cols.push(1, 1, 1, 0.05, 0.05, 0.05); }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(new Float32Array(pts), 3));
    geo.setAttribute('color', new BufferAttribute(new Float32Array(cols), 3));
    const m = new LineSegments(geo, new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false }));
    m.position.copy(v(o.pos));
    return { group: m, labels: [] };
  },
  bar(o) {
    const g = new Group();
    const geo = new BufferGeometry().setFromPoints([new Vector3(0, 0, 0), new Vector3(o.length, 0, 0), new Vector3(0, -0.15, 0), new Vector3(0, 0.15, 0), new Vector3(o.length, -0.15, 0), new Vector3(o.length, 0.15, 0)]);
    g.add(new LineSegments(geo, new LineBasicMaterial({ color: '#f2f5f9', transparent: true, opacity: 0.9 })));
    const l = makeLabel(o.label, { worldH: 0.34, color: '#f2f5f9', letterSpacing: 0.04 }); l.position.set(o.length / 2, 0.45, 0); g.add(l);
    g.position.copy(v(o.pos));
    return { group: g, labels: [l] };
  },
};

export function buildStation(station, ctx) {
  const group = new Group(); group.position.copy(v(station.pos));
  const anchors = new Map([[station.id, v(station.pos)]]);
  const labels = []; const updaters = [];
  for (const o of station.objects || []) {
    const b = build[o.type]; if (!b) { console.warn('hadron-space: unknown object type', o.type); continue; }
    const r = b(o, ctx);
    group.add(r.group); labels.push(...(r.labels || []));
    if (r.update) updaters.push(r.update);
    if (r.anchors) for (const [id, p] of r.anchors) anchors.set(id, p.clone().add(v(o.pos)).add(v(station.pos)));
  }
  return {
    group, anchors,
    update(t, camPos) { for (const u of updaters) u(t, camPos); },
    setDim(k) { const op = 0.9 * Math.max(0, 1 - k / 0.85); for (const l of labels) l.material.opacity = op; },
    dispose() { group.traverse((o) => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); }); },
  };
}
```

- [ ] **Step 3: Syntax check**

Run: `node --input-type=module -e "import('/home/mindaugas_wsl/outreach_talks/components/hadron-space/dioramas.js').then(()=>console.log('ok')).catch(e=>{console.error(e.message);process.exit(1)})"`
Expected: fails only on `three`/`document` resolution outside Vite (`Cannot find package 'three'` is acceptable); any `SyntaxError` is not. If `three` resolves (pnpm hoisting), expect `document is not defined` from `labels.js` only when a builder runs, so `ok`.

- [ ] **Step 4: Commit**

```bash
git add components/hadron-space/dioramas.js components/hadron-space/labels.js
git commit -m "feat(hadron-space): diorama builders (page, text, ring, tracks, spheres, planes, cluster, molecule, grid, bar)"
```

---

### Task 4: Scene rewrite around stations

**Files:**
- Modify: `components/hadron-space/space.js` (lines 10–40 header/POSES, 118–123 states→world, 176–224 hadron points/grid/labels, 226–260 camera, 274–320 frame, 322–363 API)
- Modify: `components/particle-hero/shaders/passes.glsl.js:18-53` (`VEL_FRAG`)

**Interfaces:**
- Consumes: `buildStation` (Task 3); `space.json` shape (Task 1).
- Produces: `createSpace(canvas, container, { data, space, onArrive })` — `space` is the parsed `space.json`. API unchanged in names: `setPose(p, {immediate})`, `setStop(id)`, `setDim(k)`, `setPaused`, `dispose`, `state(id)`, `arrived`, `currentTarget`. `p.at` resolves in this order: `[x,y,z]` → station id (target = station `look.target` offset from `station.pos`, or `station.pos`; defaults `dist/yaw/pitch` from `look`) → state id (anchor from the `states` station, plus the HUD offset `(1.5, −0.35, 0)`) → named pose `wide` (= the `paper` station from far: dist 30, yaw −20, pitch 12), `origin` (= `paper`), `future` (= `future`).

- [ ] **Step 1: Add the gather term to the velocity shader**

In `VEL_FRAG`, after the `uBurst` uniform add `uniform vec4 uGather;   // xyz = world pos; w = strength (station attraction, 0 = off)` and after the burst block add:

```glsl
  // station gather: a wide, gentle pull toward the active diorama
  vec3 toG = uGather.xyz - pos.xyz;
  float dg = length(toG) + 1e-4;
  v += (toG / dg) * uGather.w * exp(-dg * dg / 64.0) * uDt;
```

The WoP hero never sets `uGather`, so its value is zero and its field is unchanged.

- [ ] **Step 2: Rewrite `space.js`**

Replace the file's contents with the following. It keeps the field, camera spring, HUD highlight and guard logic and drops the chart:

```js
import {
  WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera, Mesh, Points, Group,
  PlaneGeometry, BufferGeometry, BufferAttribute, ShaderMaterial, DataTexture,
  WebGLRenderTarget, RGBAFormat, FloatType, HalfFloatType, NearestFilter,
  AdditiveBlending, Vector3, Vector4,
} from 'three';
import { SIM_VERT, COPY_FRAG, VEL_FRAG, POS_FRAG, RENDER_VERT, RENDER_FRAG } from '../particle-hero/shaders/passes.glsl.js';
import { buildStation } from './dioramas.js';

// The hadron space: a path of built scenes (stations) inside the WoP landing's
// ambient particle field, one instance under the whole Startertalk deck
// (global-bottom.vue → HadronSpace.vue). Stations come from
// public/data/space.json (spec 2026-09-09-startertalk-dioramas-design.md);
// state records from public/data/hadrons.json. Slides steer the camera with
// setPose({at: <station id | state id | [x,y,z]>, dist, yaw, pitch}) and light
// a state with setStop(id). The field is pulled gently toward the active
// station (uGather) so volume gathers around the scene in view.

const FIELD_BOUNDS = new Vector3(30, 30, 30);
const FOV = 50, MAX_DT = 1 / 30;
const D2R = Math.PI / 180;
const DEFAULT_POSE = { dist: 9, yaw: -20, pitch: 6 };
const NAMED = { wide: { station: 'paper', dist: 30, yaw: -20, pitch: 12 }, origin: { station: 'paper' }, future: { station: 'future' } };

function pickTexSize(coarse) {
  const cores = navigator.hardwareConcurrency || 4;
  const area = (screen.width || 1280) * (screen.height || 800);
  if (coarse || area < 1e6 || cores <= 4) return 144;
  return 224;
}

export function createSpace(canvas, container, { data, space, onArrive }) {
  const coarse = matchMedia('(pointer: coarse)').matches;
  let renderer;
  try { renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' }); } catch { return null; }
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); return null; }
  const type = renderer.extensions.has('EXT_color_buffer_float') ? FloatType
    : renderer.extensions.has('EXT_color_buffer_half_float') ? HalfFloatType : null;
  if (!type) { renderer.dispose(); return null; }
  const baseDpr = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2);
  renderer.setPixelRatio(baseDpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 400);

  // --- records and stations ---------------------------------------------------
  const byId = new Map(data.states.map((s) => [s.id, { ...s }]));
  const stations = new Map();
  const anchors = new Map();
  for (const st of space.stations) {
    const built = buildStation(st, { states: byId });
    scene.add(built.group);
    stations.set(st.id, { def: st, built });
    for (const [id, p] of built.anchors) anchors.set(id, p);
  }
  for (const [id, s] of byId) if (anchors.has(id)) s.pos = anchors.get(id).clone();

  // --- ambient field (GPGPU, from particle-hero) ------------------------------
  const size = pickTexSize(coarse), count = size * size;
  const rt = () => new WebGLRenderTarget(size, size, { type, format: RGBAFormat, minFilter: NearestFilter, magFilter: NearestFilter, depthBuffer: false, stencilBuffer: false });
  let posA = rt(), posB = rt(), velA = rt(), velB = rt();
  const init = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    init[i * 4] = (Math.random() * 2 - 1) * FIELD_BOUNDS.x;
    init[i * 4 + 1] = (Math.random() * 2 - 1) * FIELD_BOUNDS.y;
    init[i * 4 + 2] = (Math.random() * 2 - 1) * FIELD_BOUNDS.z;
    init[i * 4 + 3] = Math.random();
  }
  const initTex = new DataTexture(init, size, size, RGBAFormat, FloatType); initTex.needsUpdate = true;
  const simScene = new Scene(), simCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new Mesh(new PlaneGeometry(2, 2)); simScene.add(quad);
  const copyMat = new ShaderMaterial({ vertexShader: SIM_VERT, fragmentShader: COPY_FRAG, uniforms: { uSrc: { value: initTex } } });
  const far = new Vector3(999, 999, 999);
  const velMat = new ShaderMaterial({
    vertexShader: SIM_VERT, fragmentShader: VEL_FRAG,
    uniforms: {
      uPos: { value: null }, uVel: { value: null }, uDt: { value: 0 }, uTime: { value: 0 },
      uPointer: { value: far.clone() }, uPointerVel: { value: new Vector3() },
      uImpulse: { value: new Vector4(999, 999, 999, 0) }, uBurst: { value: new Vector4(999, 999, 999, 0) },
      uGather: { value: new Vector4(0, 0, 0, 0) },
    },
  });
  const posMat = new ShaderMaterial({
    vertexShader: SIM_VERT, fragmentShader: POS_FRAG,
    uniforms: { uPos: { value: null }, uVel: { value: null }, uDt: { value: 0 }, uBounds: { value: FIELD_BOUNDS } },
  });
  const pass = (mat, target) => { quad.material = mat; renderer.setRenderTarget(target); renderer.render(simScene, simCam); renderer.setRenderTarget(null); };
  const refs = new Float32Array(count * 3);
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) { const k = j * size + i; refs[k * 3] = (i + 0.5) / size; refs[k * 3 + 1] = (j + 0.5) / size; }
  const fieldGeo = new BufferGeometry(); fieldGeo.setAttribute('position', new BufferAttribute(refs, 3));
  const fieldMat = new ShaderMaterial({
    vertexShader: RENDER_VERT, fragmentShader: RENDER_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uPos: { value: null }, uVel: { value: null }, uSize: { value: 1.7 }, uPixelRatio: { value: baseDpr } },
  });
  const field = new Points(fieldGeo, fieldMat); field.frustumCulled = false;
  scene.add(field);
  pass(copyMat, posA);
  renderer.setRenderTarget(velA); renderer.clear(true, false, false); renderer.setRenderTarget(null);

  // --- stop highlight: a pulsing shell around the lit state -----------------------
  const hi = new Group(); scene.add(hi);
  let hiMesh = null;

  // --- camera spring --------------------------------------------------------------
  let pose = { at: 'wide' };
  const goalPos = new Vector3(), goalLook = new Vector3();
  const curPos = new Vector3(), curLook = new Vector3();
  const fromPos = new Vector3(), fromLook = new Vector3();
  let flightT0 = -1, flightDur = 1.6, arrived = true;
  const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10);
  let firstFrame = true, currentTarget = 'wide', activeStation = 'paper';

  // at → { target, dist, yaw, pitch, station }
  const resolve = (p) => {
    let at = p.at;
    const out = { target: new Vector3(), station: null, dist: p.dist, yaw: p.yaw, pitch: p.pitch };
    if (typeof at === 'string' && NAMED[at]) { const n = NAMED[at]; out.dist ??= n.dist; out.yaw ??= n.yaw; out.pitch ??= n.pitch; at = n.station; }
    if (Array.isArray(at)) { out.target.set(at[0], at[1], at[2]); out.station = nearestStation(out.target); }
    else if (stations.has(at)) {
      const { def } = stations.get(at); const look = def.look || {};
      out.target.set(...def.pos); if (look.target) out.target.add(new Vector3(...look.target));
      out.dist ??= look.dist; out.yaw ??= look.yaw; out.pitch ??= look.pitch; out.station = at;
    } else if (byId.has(at) && byId.get(at).pos) {
      out.target.copy(byId.get(at).pos).add(new Vector3(1.5, -0.35, 0));   // state lands left of centre, above the HUD, clear of the figure
      out.station = nearestStation(out.target);
    } else { out.target.set(...stations.get('paper').def.pos); out.station = 'paper'; }
    out.dist ??= DEFAULT_POSE.dist; out.yaw ??= DEFAULT_POSE.yaw; out.pitch ??= DEFAULT_POSE.pitch;
    return out;
  };
  const nearestStation = (t) => { let best = null, bd = Infinity; for (const [id, s] of stations) { const d = t.distanceTo(new Vector3(...s.def.pos)); if (d < bd) { bd = d; best = id; } } return best; };
  const applyPose = (p, elapsed) => {
    const r = resolve(p);
    const dist = r.dist * (1 + 0.02 * Math.sin(elapsed / 31 * Math.PI * 2));
    const yaw = (r.yaw + 2.5 * Math.sin(elapsed / 46 * Math.PI * 2)) * D2R;
    const pitch = (r.pitch + 1.2 * Math.sin(elapsed / 57 * Math.PI * 2 + 2)) * D2R;
    goalLook.copy(r.target);
    goalPos.set(r.target.x + dist * Math.sin(yaw) * Math.cos(pitch), r.target.y + dist * Math.sin(pitch), r.target.z + dist * Math.cos(yaw) * Math.cos(pitch));
    activeStation = r.station;
  };

  let viewW = 1, viewH = 1;
  function resize() {
    const r = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (w === viewW && h === viewH) return;
    viewW = w; viewH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize();

  let lastT = performance.now(), raf = 0, paused = false, elapsed = 0, disposed = false;
  let guardStage = 0, winFrames = 0, winTime = 0;
  const getDelta = () => { const t = performance.now(); const d = (t - lastT) / 1000; lastT = t; return d; };
  const period = FIELD_BOUNDS.clone().multiplyScalar(2);

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(getDelta(), MAX_DT);
    elapsed += dt;
    resize();

    applyPose(pose, elapsed);
    if (firstFrame) { curPos.copy(goalPos); curLook.copy(goalLook); firstFrame = false; }
    if (flightT0 >= 0) {
      const u = Math.min((elapsed - flightT0) / flightDur, 1);
      const e = smoother(u);
      curPos.lerpVectors(fromPos, goalPos, e); curLook.lerpVectors(fromLook, goalLook, e);
      if (u >= 1) { flightT0 = -1; arrived = true; onArrive?.(currentTarget); }
    } else {
      const k = 1 - Math.exp(-3.0 * dt);
      curPos.lerp(goalPos, k); curLook.lerp(goalLook, k);
    }
    camera.position.copy(curPos); camera.lookAt(curLook); camera.updateMatrixWorld();

    // field: tile the wrap box around the camera; gather toward the active station
    field.position.set(Math.round(curPos.x / period.x) * period.x, Math.round(curPos.y / period.y) * period.y, Math.round(curPos.z / period.z) * period.z);
    const st = stations.get(activeStation);
    if (st) { const c = new Vector3(...st.def.pos).sub(field.position); velMat.uniforms.uGather.value.set(c.x, c.y, c.z, 0.9); }
    velMat.uniforms.uDt.value = dt; velMat.uniforms.uTime.value = elapsed; posMat.uniforms.uDt.value = dt;
    velMat.uniforms.uPos.value = posA.texture; velMat.uniforms.uVel.value = velA.texture; pass(velMat, velB);
    posMat.uniforms.uPos.value = posA.texture; posMat.uniforms.uVel.value = velB.texture; pass(posMat, posB);
    [posA, posB] = [posB, posA]; [velA, velB] = [velB, velA];
    fieldMat.uniforms.uPos.value = posA.texture; fieldMat.uniforms.uVel.value = velA.texture;

    for (const s of stations.values()) s.built.update(elapsed, curPos);
    if (hiMesh) { const k = 1 + 0.12 * Math.sin(elapsed * 3); hiMesh.scale.set(k, k, k); }
    renderer.render(scene, camera);

    if (elapsed > 4 && guardStage < 2) {
      winFrames++; winTime += dt;
      if (winTime >= 2) {
        if (winFrames / winTime < 40) {
          const d = baseDpr * (guardStage === 0 ? 0.7 : 0.5);
          renderer.setPixelRatio(d); fieldMat.uniforms.uPixelRatio.value = d;
          if (guardStage === 1) fieldGeo.setDrawRange(0, Math.floor(count / 2));
          guardStage++;
        }
        winFrames = 0; winTime = 0;
      }
    }
  }
  frame();

  return {
    get currentTarget() { return currentTarget; },
    get arrived() { return arrived; },
    state(id) { return byId.get(id) || null; },
    setPose(p, { immediate = false } = {}) {
      pose = { at: 'wide', ...(p || {}) };
      currentTarget = Array.isArray(pose.at) ? pose.at.join(',') : String(pose.at);
      container.dataset.spaceAt = currentTarget;
      if (immediate || firstFrame) { firstFrame = true; flightT0 = -1; arrived = true; return; }
      fromPos.copy(curPos); fromLook.copy(curLook);
      applyPose(pose, elapsed);
      const d = fromPos.distanceTo(goalPos) + 0.5 * fromLook.distanceTo(goalLook);
      flightDur = Math.min(4.5, Math.max(1.4, 1.1 + d / 12));   // station hops are long: up to 4.5 s
      flightT0 = elapsed; arrived = false;
    },
    setStop(id) {
      if (hiMesh) { hi.remove(hiMesh); hiMesh.geometry.dispose(); hiMesh.material.dispose(); hiMesh = null; }
      const s = id ? byId.get(id) : null;
      if (s && s.pos) {
        hiMesh = new Mesh(new (require('three').SphereGeometry)(0.55, 24, 16), new (require('three').MeshBasicMaterial)({ color: '#ffffff', transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false }));
        hiMesh.position.copy(s.pos); hi.add(hiMesh);
      }
    },
    setDim(d) { const k = Math.min(1, Math.max(0, Number(d) || 0)); for (const s of stations.values()) s.built.setDim(k); },
    setPaused(p) { if (disposed || p === paused) return; paused = p; if (p) cancelAnimationFrame(raf); else { getDelta(); frame(); } },
    dispose() {
      if (disposed) return; disposed = true; cancelAnimationFrame(raf);
      for (const t of [posA, posB, velA, velB]) t.dispose();
      initTex.dispose();
      for (const s of stations.values()) s.built.dispose();
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); });
      quad.geometry.dispose();
      for (const m of [copyMat, velMat, posMat]) m.dispose();
      renderer.dispose(); renderer.forceContextLoss?.();
    },
  };
}
```

Note for the implementer: `setStop` above must not use `require`; import `SphereGeometry, MeshBasicMaterial` at the top of the file with the other three.js names and use them directly. (Written out here so the intent is unambiguous; fix the two `new (require('three').X)` calls to `new X` when typing the file.)

- [ ] **Step 3: Remove the now-unused exports**

`LANE_Z`, `xOfYear`, `yOfMass`, `POSES`, `makeLabel` are no longer exported from `space.js` (`makeLabel` lives in `labels.js`). Run `grep -rn "LANE_Z\|xOfYear\|yOfMass\|POSES" components talks/2026_09_00_Startertalk --include=*.js --include=*.vue --include=*.py` and expect no hits outside `space.js` history.

- [ ] **Step 4: Build to check it compiles (the deck still passes the old data; the component must not throw)**

Task 5 wires the data; until then `space` is `undefined` and `createSpace` would throw on `space.stations`. Do Task 5 before building; this step is `pnpm build` after Task 5 Step 2.

- [ ] **Step 5: Commit**

```bash
git add components/hadron-space/space.js components/particle-hero/shaders/passes.glsl.js
git commit -m "feat(hadron-space): stations replace the date-mass chart; field gathers at the active station"
```

---

### Task 5: Component wiring and data trim

**Files:**
- Modify: `components/HadronSpace.vue:24-30` (header comment), `:111-125` (`boot`)
- Modify: `talks/2026_09_00_Startertalk/scripts/hadrons.py` (`build()` tail, `check()`, `LANES`)

**Interfaces:**
- Consumes: `createSpace(canvas, container, { data, space, onArrive })` (Task 4).
- Produces: `public/data/hadrons.json` with `states` = the eight pentaquarks + `Theta(1540)` + `quarks-1964` only, no `lanes` key; the HUD still reads `label_html`, `mass_text`, … unchanged.

- [ ] **Step 1: Fetch both JSON files in `HadronSpace.vue`**

Replace the fetch in `boot()`:

```js
    const base = import.meta.env.BASE_URL || '/'
    const url = (p) => base.replace(/\/?$/, '/') + p
    const [r1, r2] = await Promise.all([fetch(url(props.src)), fetch(url('data/space.json'))])
    data.value = await r1.json()
    const spaceDef = await r2.json()
    space = createSpace(canvas.value, root.value, { data: data.value, space: spaceDef, onArrive: () => { arrived.value = true } })
```

Update the header comment: `at: paper | theta | decay | states | interiors | neutrals | future | <state id> | wide | origin | [x, y, z]`; a slide without `space` keeps the previous pose; `public/data/space.json` describes the stations.

- [ ] **Step 2: Trim `hadrons.py` output**

In `build()`, after the OVERRIDES loop, keep only the talk's states and drop `lanes`:

```python
    KEEP = set(PENTAQUARKS) | {"Theta(1540)", "quarks-1964"}
    states = [s for s in states if s["id"] in KEEP]
```

and in the returned dict delete the `"lanes": LANES,` entry (keep `LANES` in the file only if `lane_for` still uses it for the `lane` field; it does, so leave the constant). In `check()` delete the two `lanes` assertions and the `len(pq) == 6` assertion; replace with `assert len(data["states"]) == 10, [s["id"] for s in data["states"]]`. Update the module docstring's first paragraph: "Records for the ten states the talk names (eight pentaquarks, Θ⁺(1540), the 1964 landmark), built from Koppenburg's table plus the OVERRIDES."

Run: `~/micromamba/envs/outreach_talks/bin/python scripts/hadrons.py --check --cached /tmp/claude-1001/-home-mindaugas-wsl-outreach-talks/f25c0d74-691a-4596-827e-243030707bfa/scratchpad/koppenburg.html`
Expected: `ok: … 10 total, 8 pentaquark ids present` and `public/data/hadrons.json` has ten states and no `lanes`.

- [ ] **Step 3: Build**

Run: `pnpm build --out dist 2>&1 | grep -E 'error|✓ built'`
Expected: `✓ built`. Then `node scripts/check_space.mjs` still fails only on the deck's old poses.

- [ ] **Step 4: Commit**

```bash
git add components/HadronSpace.vue scripts/hadrons.py public/data/hadrons.json
git commit -m "feat(startertalk): HadronSpace loads the station file; records trimmed to the talk's ten states"
```

---

### Task 6: First render of the stations

**Files:**
- Modify: `talks/2026_09_00_Startertalk/deck.md` (poses only, in this task)

- [ ] **Step 1: Re-point every `space.at` to a station or state**

Edit the frontmatter of each slide (slide numbers as of commit `8798d58`):

| Slide | New `space` |
|---|---|
| 1 cover | `at: wide` |
| 2 1964 | `at: paper` |
| 3 Θ⁺ | `at: theta, dist: 8, yaw: -40, pitch: 6, stops: [Theta(1540)]` (clicks 1) |
| 4 one hadron or two | `at: interiors, dist: 22, yaw: -40, pitch: 12` |
| 5 why charm | `at: decay, dist: 16, yaw: -50, pitch: 10` |
| 6 section | `at: decay, dist: 13, yaw: -30, pitch: 8` |
| 7 Λb decay | `at: decay` |
| 8 amplitude analysis | `at: decay, yaw: -8` |
| 9 2015 | `at: states, asof: 2015, stops: [Pc(4380), Pc(4450)]` (clicks 2) |
| 10 2019 | `at: states, yaw: -22, stops: [Pc(4312), Pc(4440), Pc(4457)]` (clicks 3) |
| 11 thresholds | `at: states, dist: 10, yaw: -14, stops: [Pc(4337)]` (clicks 1) |
| 12 strange partners | `at: states, yaw: -26, pitch: 8, stops: [Pcs(4459), Pcs(4338)]` (clicks 2) |
| 13 section | `at: interiors, dist: 16, yaw: -30, pitch: 10` |
| 14 molecule | `at: [59.5, 0, 0], dist: 9, yaw: -20, pitch: 6` |
| 15 compact | `at: [69, 0, 0], dist: 9, yaw: 15, pitch: 6` |
| 16 cusp | `at: interiors, dist: 14, yaw: 30, pitch: 10` |
| 17 table | `at: interiors, dist: 15, yaw: 45, pitch: 12` |
| 18 section Run 3 | `at: future` |
| 19 Run 3 | `at: future, yaw: -20` |
| 20 programme | `at: future, yaw: -10` |
| 21 fact | `at: future, pitch: 14, dist: 12` |
| 22 thank you | `at: wide` |
| 23–26 backups | no `space` (keep previous) |

The two new slides of Task 8 use `at: neutrals` and `at: neutrals, yaw: 20` (target on the six-quark cluster: `at: [92.5, 0.5, -2], dist: 8, yaw: 10, pitch: 6`).

- [ ] **Step 2: Checker passes**

Run: `node scripts/check_space.mjs`
Expected: `space.json ok: 7 stations, … objects; deck poses resolve`.

- [ ] **Step 3: Build and screenshot every slide and stop**

```bash
rm -rf dist && pnpm build --out dist 2>&1 | grep -E 'error|✓ built'
S=/tmp/claude-1001/-home-mindaugas-wsl-outreach-talks/71e95d3a-78b5-4d1f-adaa-2682c960f41b/scratchpad
rm -rf $S/st-dio && mkdir -p $S/st-dio && cd ~/slidev-videos && CLICKS='{"3":1,"9":2,"10":3,"11":1,"12":2}' node .tmp/st-all.mjs ~/outreach_talks/talks/2026_09_00_Startertalk/dist $S/st-dio 26 2>&1 | tail -1
```

Then Read `$S/st-dio/02.png` (the Zweig page and quotation visible, legible at the pose), `07.png` (decay tracks and labels), `09-c2.png` (a state sphere lit, HUD record and plot), `13.png` (both interiors in view), `19.png` (future grid), `05.png` and `16.png` (scrim keeps the text legible over the scenes). Adjust `look`/`pos` values in `space.json` or the slide poses until every scene is framed and nothing collides with the slide text; re-run the build and the shots after each change. Record the final values in `space.json` only (not in the plan).

- [ ] **Step 4: Commit**

```bash
git add deck.md public/data/space.json
git commit -m "content(startertalk): slides address the stations; framing tuned from renders"
```

---

### Task 7: The paper slide

**Files:**
- Modify: `talks/2026_09_00_Startertalk/deck.md` (slide 2)
- Modify: `talks/2026_09_00_Startertalk/styles/index.css`

- [ ] **Step 1: CSS for the quotation**

Append to `styles/index.css`:

```css
/* The 1964 slide: the Zweig page and the quark cluster are in the world; the
   slide carries Gell-Mann's sentence only, set large, right of centre so the
   page stays in view. */
.quote-hero { position: absolute; right: 6%; top: 24%; width: 46%; font-size: 26px; line-height: 1.35; font-weight: 500; color: #f2f5f9; }
.quote-hero .who { display: block; margin-top: 14px; font-size: 15px; font-weight: 400; color: #8b97a6; letter-spacing: 0.04em; }
```

- [ ] **Step 2: Rewrite slide 2**

Replace the body of slide 2 (title through its speaker note) with:

```md
# 1964: five quarks are allowed

<div class="quote-hero">“Baryons can now be constructed from quarks by using the combinations (qqq), (qqqqq̄), etc., while mesons are made out of (qq̄), (qqq̄q̄), etc.”<span class="who">Gell-Mann, Phys. Lett. 8 (1964) 214 · Zweig, CERN-TH-401, 17 January 1964 (the page behind)</span></div>

<!--
Speaker: the page floating in the world is page 1 of Zweig's CERN report
TH-401, dated 17 January 1964 (CERN Document Server record 352337): three
"aces" with baryon number 1/3, hence fractional charge. Gell-Mann's letter
(Phys. Lett. 8 (1964) 214, received 4 January 1964) has the sentence on
screen: five-quark baryons are there from the first paper, in the same
sentence as qqq. The rule in 1964 was baryon number: the triplet carries
B = 1/3, so a baryon is qqq plus any number of qq̄ pairs. Colour came later
(Greenberg, PRL 13 (1964) 598; Han and Nambu, Phys. Rev. 139 (1965) B1006).
Neither paper says whether a five-quark state binds, or how narrow it would
be. Point at the five spheres drifting into one cluster below the quotation:
that object is what the next fifty years failed to find. (~1.25 min)
-->
```

Since the quotation now lives in the world as well as on the slide, keep the world text sprite but drop the on-slide `.src` line; the `who` line carries both citations. Remove the `quark_model_singlets.svg` image from the slide (the cluster in the world replaces it); leave the SVG on disk for the PDF export note in the References backup? No: delete `public/figures/quark_model_singlets.svg` and its `fig_singlets()` call in `make_figures.py` `main()` (keep the function for history is not needed; remove it).

- [ ] **Step 3: Build, shoot slide 2, read it**

Run the build and `CLICKS='{}' node .tmp/st-all.mjs … 2` (two slides), Read `02.png`: the page is readable as a typewritten sheet, the quotation is right of it, nothing overlaps.

- [ ] **Step 4: Commit**

```bash
git add deck.md styles/index.css scripts/make_figures.py
git rm public/figures/quark_model_singlets.svg
git commit -m "content(startertalk): the 1964 slide starts from the paper page"
```

---

### Task 8: Research brief for the two new slides

**Files:**
- Create: `docs/superpowers/plans/2026-09-09-startertalk-dioramas-research.md`

The research workflow `startertalk-dioramas-research` (run id `wf_2def701c-351`, launched 2026-09-09 23:50) returns `{ final: { slides: [paper, neutrals, hexaquarks], paper_page, dropped }, stats }`.

- [ ] **Step 1: Save the brief**

Write the workflow's `final` object as readable markdown: one section per slide with `title`, `message`, `on_screen`, `notes`, `sources`; a section `paper_page`; a section `dropped (unverified)`. Every number in `on_screen` and `notes` must have a source in `sources`; delete any that does not.

- [ ] **Step 2: Sanity-check three anchor facts against PDG 2024 yourself**

Σc(2455)⁺ → Λc⁺ π⁰ ≈ 100%; D*(2007)⁰ → D⁰ π⁰ (64.7 ± 0.9)% and D⁰ γ (35.3 ± 0.9)%; D*(2010)⁻ → D̄⁰ π⁻ (67.7 ± 0.5)%. If the brief disagrees, the brief is wrong: fix it and note the correction.

- [ ] **Step 3: Commit**

```bash
git add docs/superpowers/plans/2026-09-09-startertalk-dioramas-research.md
git commit -m "docs(plan): sourced brief for the missing-neutrals and six-quark slides"
```

---

### Task 9: Two new slides

**Files:**
- Modify: `talks/2026_09_00_Startertalk/deck.md` (insert after "What tells them apart", before the Run 3 section)

- [ ] **Step 1: Insert the slides**

Use the brief's `on_screen` and `notes` verbatim, typeset as:

```md
---
space: { at: neutrals }
---

# Where the neutrals go missing

<div class="row stage">
<div class="card card-primary pad-tight col-50">

## Σ<sub>c</sub>⁺ D̄*⁰ always decays with a neutral

<brief.neutrals.on_screen, as two or three sentences, ≤ 40 words>

</div>
</div>

<div class="caption mt-sm"><one sentence from the brief on recovery by kinematic overconstraints; LHCb Vilnius: work in progress></div>

<div class="src"><two references from brief.neutrals.sources></div>

<!--
Speaker: <brief.neutrals.notes> (~1.25 min)
-->

---
space: { at: [92.5, 0.5, -2], dist: 8, yaw: 10, pitch: 6 }
---

# Six quarks

<div class="row stage">
<div class="card card-accent pad-tight col-50">

## The deuteron is the hexaquark we know

<brief.hexaquarks.on_screen, ≤ 40 words>

</div>
</div>

<div class="src"><two references from brief.hexaquarks.sources></div>

<!--
Speaker: <brief.hexaquarks.notes> (~1.0 min)
-->
```

The angle brackets are filled from the brief; nothing else is invented. The world carries the decay tracks (neutrals) and the six-quark cluster, so no figure is placed on the slide.

- [ ] **Step 2: Checker, build, shoot the two slides**

Run: `node scripts/check_space.mjs` → ok. Build; shoot 20 slides (`… 20`) and Read `18.png`, `19.png`: card ≤ 40 words, tracks visible right of the card, the dashed "not seen" tracks and their labels legible, the six-quark cluster framed on slide 19.

- [ ] **Step 3: Commit**

```bash
git add deck.md
git commit -m "content(startertalk): missing neutrals in Σc D̄* channels; six quarks"
```

---

### Task 10: Text cuts and editorial pass

**Files:**
- Modify: `talks/2026_09_00_Startertalk/deck.md` (slides 3, 5, 12, 20, 25 and every note)

- [ ] **Step 1: Cut the five slides to ≤ 40 words on screen**

Target wording (final unless the editorial pass in Step 2 improves it):

- Slide 3 card: `Θ⁺(1540), uudds̄: seen by LEPS in 2003 and by about ten experiments after it, absent from the high-statistics data of CLAS, Belle and BaBar. PDG 2008 dropped it from the Listings.` (34 words) Delete the second paragraph; its point is in the notes.
- Slide 5 card: `Charmed hadrons are heavy, so a pair moves slowly and a weak force can bind it, as a proton and a neutron bind in the deuteron. The threshold is known to a fraction of an MeV.` (37 words) Delete the third paragraph.
- Slide 12: keep the two card headings; cut each card to three bullets: Pcs(4459)⁰: `Ξb⁻ → J/ψ Λ K⁻, Runs 1–2` / `3.1σ` / `19 MeV below Ξc⁰D̄*⁰`; Pcs(4338)⁰: `B⁻ → J/ψ Λ p̄` / `> 15σ, amplitude analysis, J = 1/2` / `at the Ξc⁺D⁻ threshold`. Caption unchanged.
- Slide 20: channel lines cut to one line each: item 1 `Λb⁰ → J/ψ p K⁻, Runs 1–3`; item 2 `Λb⁰ → J/ψ Ξ⁻ K⁺ · Ωb⁻ → J/ψ Ξ⁰ K⁻ · B⁻ → J/ψ Ξ⁻ Λ̄`; item 3 `Λb⁰ → Σc⁽*⁾⁺⁺ D⁽*⁾⁻ K⁻ · ηc p · Λb⁰ → J/ψ p π⁻ · Bs⁰ → J/ψ p p̄`. The removed clauses (molecule ordering, predicted names, what each channel tests) move into the notes, where most already are.
- Slide 25 (backup): six bullets cut to one line each; the yields and papers stay in the notes.

- [ ] **Step 2: Editorial workflow over every slide and note**

Run a Workflow (ultracode) with one editor per slide batch (1–7, 8–13, 14–19, 20–28) briefed with the owner's voice rules and the unslop contract (`~/.claude/skills/unslop/references/core-contract.md`): each returns exact `old → new` spans for on-screen text and notes; a second agent per batch refutes each edit (meaning preserved, no new fact, no new pattern). Apply the surviving edits with a script that asserts each `old` matches exactly once.

- [ ] **Step 3: Word counts and build**

Run: `python3 - <<'EOF'` counting words per slide outside `<!-- -->` and outside `<div class="src">`: print any slide over 60 (or over 40 for slides 3, 5, 12, 20, 25 and the two new ones). Fix overs. Build; `node scripts/check_space.mjs`.

- [ ] **Step 4: Commit**

```bash
git add deck.md
git commit -m "content(startertalk): shorter cards, editorial pass over every slide and note"
```

---

### Task 11: Fact-check, full render, docs, push

**Files:**
- Modify: `CLAUDE.md` (Hadron space section), both specs
- Modify: `talks/2026_09_00_Startertalk/deck.md` (fixes from the fact-check)

- [ ] **Step 1: Fact-check workflow on the changed slides**

Re-run the `startertalk-factcheck` script (session scripts dir) with the batch list reduced to slides 2, 3, 5, 12, 18, 19, 20, 25 and the physics lens; apply confirmed fixes with exact-match replacements.

- [ ] **Step 2: Full screenshot pass**

Build; `CLICKS='{"3":1,"9":2,"10":3,"11":1,"12":2}' node .tmp/st-all.mjs … 28`; make three contact sheets; Read them. Check: no frame overflows; every station framed; the scrim keeps text legible at every pose; every stop shows record, plot and `see` line; the Zweig page is a readable sheet on slide 2.

- [ ] **Step 3: Docs**

`CLAUDE.md` "Hadron space (Startertalk)": replace the coordinate description with the station model (ids, `space.json`, `check_space.mjs`, `at` resolution order); note the `uGather` uniform. Append to the dioramas spec a short "As built" paragraph with the final station positions. Mark the old spec's sections 2–3 as superseded (one line at the top of each).

- [ ] **Step 4: Commit and push**

```bash
git add -A talks/2026_09_00_Startertalk components CLAUDE.md docs
git commit -m "content(startertalk): the hadron space as a path of dioramas — paper page, decay tracks, states, interiors, missing neutrals, six quarks"
git push origin main
```

Send the owner the three contact sheets.
