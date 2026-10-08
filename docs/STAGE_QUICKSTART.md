# Stage quickstart

The part of `slidev-addon-stage` a new talk needs, in one read. The package
README is the reference for everything else; read the copy that matches the
talk's pin, `talks/<t>/node_modules/slidev-addon-stage/README.md`. Items marked
**from v0.6** are being built on the slidev-videos branches `feat/shots-v2`,
`feat/broadcast` and `fix/stage-addon`; until a talk is bumped to v0.6 they are
not in its `node_modules`. After the release a talk moves with
`pnpm talk bump-toolkit v0.6.0 --talk <name> --dry-run`, then without
`--dry-run`.

## Start

```bash
pnpm talk new 2026_11_05_Venue --stage blue     # worktree, branch, scaffold, install
pnpm talk open venue                            # prints the worktree path
pnpm talk dev venue                             # http://localhost:3030
```

Palettes: `classic` (Startertalk), `blue`, `ember`. Pick one the other live
talks are not using, and a hero form of the talk's own, and write both into the
Brief.

## Headmatter

```yaml
---
theme: ../../theme
colorSchema: dark
routerMode: hash             # deep links survive a refresh on Pages
aspectRatio: 16/9
addons: [slidev-addon-videos, slidev-addon-stage]
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-<talk>
  fit: cover
  transition: dust           # clips arrive and leave as grains (needs pnpm videos:frames)
  dust: '#5b93ff'            # the palette's accent, so clip grains match the world's
stage:
  space: data/space.json     # under public/
  palette: blue
  sound: true                # or { hum, flight, clip, level }; false is silent
  options: { reach: 12 }     # engine numbers: nebula, streak, bloom, density, dustSize, grain, aberration, flight: [min, max] …
layout: cover
space: { at: wide }
---
```

The addon mounts the world and the halo layer itself: no `global-top.vue` or
`global-bottom.vue` in the talk. Headmatter `options` win over the palette's
look. Keep `canvasWidth` at the default 980; the kit is sized for it.

## Poses

Every slide steers the camera from its frontmatter; a slide without `space`
keeps the previous pose.

```yaml
space: { at: decay, dist: 13, yaw: -30, pitch: 8, dim: 0.2, sway: 1 }
```

- `at`: a station id, an anchor id (an object with an `id`), a named pose from
  `space.json` `poses`, or `[x, y, z]`. `wide` resolves to the hero station.
- `dist`, `yaw`, `pitch` (degrees) place the camera relative to `at`; the
  default is the station's `look`. `sway` is the idle yaw swing (default 2.5;
  use 1 or less while text is up).
- `dim` is how far the world steps back behind the slide: 0.15 by default on
  cover, section, statement, fact and quote layouts, 0.6 on content slides,
  0.2–0.35 where the picture is the world itself.
- A pose whose target is within `options.reach` (default 12) of a station is
  *at* it: what builds itself there is born scattered and gathers on arrival.
  `c` builds it again.
- An object appears right of the frame centre when its x is larger than the
  pose target's x. Flights take 1.4–4.5 s by distance.
- Give a video slide a pose too: the world rests under a covering clip, and
  when the clip breaks into dust the camera is already flying.

## The space file

`public/data/space.json`: `hero`, optional `poses`, and `stations[]`, each with
`id`, `pos`, `look { target, dist, yaw, pitch, sway }`, `gather` (the dust's
pull, default 0.25), `pulse` (seconds between outward shoves) and `objects[]`.
Forms of grains that build themselves: `galaxy`, `collider`, `constellation`.
Diagram types (`orbs`, `ring`, `bar`, `tracks`, `page`, `text`, `label`, `grid`)
read as a diagram standing in the scene; the house style is grains. With
`plugins: [hadron]`: `pentaquark`, `cluster`, `molecule`, `spheres`, `planes`
and particle names with subscripts. Fields per type are in the README table.
Run `pnpm talk check <t>` after editing this file or any `space:`.

## The builder contract

A talk-owned form is a builder registered from `setup/main.ts` before the stage
boots. Write `main.ts` as a plain function; the README's `defineAppSetup` import
from `@slidev/types` breaks the build because the talk does not depend on it:

```ts
import { registerBuilder } from 'slidev-addon-stage'
import { installGrains } from './grains.js'

export default ({ app }) => {
  installGrains(registerBuilder)        // registerBuilder('lineup', build, { fields: ['pos', 'balls'] })
}
```

- `registerBuilder(type, (object, ctx) => result, { fields })`. `fields` are the
  keys the checker requires.
- `ctx`: `{ palette, records, anisotropy, asset(src), helpers }`. `asset()`
  resolves `/figures/…` against the Pages base; an absolute path 404s there.
- `result`: `{ group, labels?, anchors?, update?(t, camPos), api?, pixelRatio?,
  dispose? }`. `t` is the engine clock (seconds, frame step clamped to 1/12 s),
  not wall time; time every animation on it.
- `api: { arm(), assemble(now, onDone) }` makes the object build itself on
  arrival. Always call `onDone`, also when there is nothing to animate, or the
  arrival never completes.
- `html[data-space-assembled]` is set while no assembly runs; the kit's cover
  title waits for it. The container carries `data-space-at-station`.
- Until v0.6, a talk with its own builders needs `vite.config.ts` with
  `optimizeDeps: { exclude: ['slidev-addon-stage', 'three'] }` (two module
  copies otherwise give two registries in `slidev dev`), and `stage:check`
  needs `--types <names>`. **From v0.6** the addon ships that config, the
  registry is shared through `globalThis`, and the checker finds talk types by
  itself.
- Slides set a builder's step through a talk component (OpenData's
  `<Grains :set="{ open: 2 }" />` fires on slide enter; the last step per name
  is kept for forms built later). **From v0.6** `<StageCount>` replaces the
  per-talk `Count.vue` copies (lt and en number formats, print guard).

## Kit CSS

Keyed on `html[data-stage]`; a talk's `styles/index.css` overrides it. Colours
come in as `--stage-bg`, `--stage-fg`, `--stage-dim`, `--stage-accent` (and
`-rgb` triplets).

| Where | Markup | Size (canvas px) |
|---|---|---|
| Cover | `# kicker` · `# Title` · `## subtitle` · `<div class="mt-md">byline</div>` | 12.5 uppercase · 66 uppercase · 12 uppercase · 11 uppercase |
| Section | `# Part I` then a paragraph | 12.5 kicker · 44 uppercase |
| Content | `# Title` | 42 |
| Statement, fact | `# …` (+ a paragraph on fact) | 56 · 64 + 26 |
| Cards | `<div class="card"><h2>…</h2><p>…</p></div>` | 22 heading · 20 body, max 60ch |
| Captions | `.caption`, `.quote-line`, `.world-caption` | 20 · 22 |
| Quotes | `.quote-hero` (`.wide`), `.who` inside | 26 · 15 |
| Layout | `.row` + `.col-40` … `.col-60`, `.two-col`, `.three-col`, `.stage-area` (max 340 px high), `.plate` | |
| Labels | `.kicker` | 12.5 uppercase |
| Source | `.src`, one line per slide | 12 at 70 % |

The uppercase contexts turn "LHCb" into "LHCB". Wrap such names in a span with
`text-transform: none`. The small cover and kicker sizes are below the
broadcast floor; a TV talk overrides them (below).

## Review commands

```bash
pnpm talk check <t>      # videos:check + stage:check + a build into /tmp/talk-<slug>/site
pnpm talk review <t>     # check + build + shots --changed --sheet
pnpm talk shots <t>      # shots only (slidev-stage-shots; see pnpm talk shots --help)
pnpm talk map <t>        # number, title, layout, clicks, space.at, clip, minutes
pnpm talk lint <t>       # language, slop, type floor, sources, timing, fact ids
```

- Builds for shots go to `/tmp/talk-<slug>/site` with `--base /` and
  `VITE_VIDEOS_LOCAL_FIRST=1`, never into the talk's `dist/`.
- Headless runs share the CPU with other sessions. Wrap any direct run in
  `flock /tmp/slidev-stage-shots.lock …` and keep runs to a few slides while
  iterating.
- `pnpm talk shots` finds the shots tool in `$SLIDEV_STAGE_BIN`, else in the
  talk's `node_modules/slidev-addon-stage/bin`. To use the new tool before the
  talk is bumped, point `SLIDEV_STAGE_BIN` at a slidev-videos checkout's
  `packages/stage/bin` on `feat/shots-v2`.
- **From v0.6** the shots tool settles each slide instead of waiting a fixed
  time, and adds `--sheet` (one labelled contact sheet), `--changed`,
  `--slides`, `--clicks all|last|none`, `--burst N --every s`, `--probe` (fps
  and engine seconds per wall second; run it first when shots are slow),
  `--draft`, `--jobs`, `--seed`. It writes one NDJSON line per frame (slide,
  click, png, station, renderer, dpr, overflowPx, pageErrors, textBoxes with
  fontPx, lumMean and lumVar, wordsOnScreen) and exits 0 clean, 3 on overflow
  or page errors, 1 on a crash. Read the contact sheet and the NDJSON, not
  single PNGs.

## The broadcast look

A talk that is filmed or streamed (about 2.5 Mbps, slides shrunk to about two
thirds of the frame) drops the per-frame noise and raises the type. Today, in
the headmatter:

```yaml
stage:
  halo: false
  options: { grain: 0, aberration: 0, dustSize: 3, density: 0.6, streak: 0.4, nebula: 0.3, bloom: 0.45, flight: [2.5, 5] }
```

Lift the ground from `blue`'s near-black (about `#0a0f1f`) or use `ember`, so
dark gradients do not band. Type on the 980 canvas: readable text 37 px or more
(49 is better), headlines 72–92, kickers 24 or more, at most two lines of about
28 characters; text inside x 98–882, y 55–408, with the logo and name-super
corners clear. **From v0.6**: `look: broadcast` replaces the options block,
`slidev-stage-safe <site> --broadcast` reports the smallest font and any text
outside the safe box, and `pnpm talk record <t>` writes per-slide MP4s and
text-free plates through `slidev-stage-record`. The checklist is the
`talk-broadcast` skill.
