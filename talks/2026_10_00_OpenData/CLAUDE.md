# Opening LHCb's data (talks/2026_10_00_OpenData)

The notes for this talk: Claude Code reads this file when it works in the
talk's directory, and the root CLAUDE.md holds what every talk shares. Keep it
current (Status, Decisions, Figures). The repo is public: nothing private here.

## Notes moved from the root CLAUDE.md (2026-10-08)

From the root's list of current talks:

- `talks/2026_10_00_OpenData/` — "Opening LHCb's data", a 6½-minute award talk
  (LHCb Vilnius nominated for an open data award). On the packaged stage, pinned
  to slidev-videos `efacca2` (feat/broadcast), plus two talk-owned builders. Date placeholder `10_00`. See
  "Open data talk" below.

### Open data talk (2026_10_00_OpenData)

One world; one sphere is one terabyte. The hero is the engine's `collider`
(cover, the collisions slide, the close); the `store` station holds the
talk's own forms; `thesis` is a gold five-node `constellation` (the
pentaquark of Dominykas Stonkus's BSc project), at [12, -40, 24]: out of
every other pose's frame (at y = -30 its scattered nodes still showed as
specks on the exabyte slide in most loads) and never the nearest station for
the far-back scale poses.

- **Talk-owned builders** (`setup/grains.js`, registered from `setup/main.ts`;
  `stage:check` runs with `--types lineup,streams`):
  - `lineup` `{ name, pos, balls: [{ n, color, label }], unit, anchor, gaps, grow, reach, glow, labelH }`:
    piles of one and the same sphere side by side along x (1, 800, 4 000
    gold = open; 100 000 blue = LHCb since 2010; 1 000 000 steel = the LHC's
    exabyte), each pile the first n points of a face-centred cubic
    lattice taken shell by shell, so the first n always make a ball. Piles keep
    their size: the slides pull the camera back (dist 0.75 → 37.5 → 73.5, then in to 8.7 for Run 1)
    and what came before is seen shrinking into the new scale (the owner's ask,
    2026-10-07: a single ball per step "looked the same after zooming out").
    Every sphere is metal in one studio light (the `METAL` GLSL chunk:
    reflections of a drawn studio, Schlick Fresnel, contact shadow inside a
    pile); a pile seen from afar is shaded as one satin ball (`HEAP`: a heap
    of small polished balls has no single mirror highlight) (owner,
    2026-10-08: "washed out … photorealistic"). A standing pile draws only
    its skin: spheres more than 6 units inside it or facing away are culled
    in the vertex shader. The impostor's frame is built round the ray to the
    sphere, and the lattice is turned once (Euler 0.37, 0.61, 0.23) so no
    row points at a camera. A ball of one is a
    sphere mesh in that metal; piles are sphere impostors (a point
    sprite shaded as a ball, writing its own depth via gl_FragDepth, sized
    from the projection and the current viewport, clamped to the GPU's
    ALIASED_POINT_SIZE_RANGE), jittered more as piles grow so rows do not beat
    against the pixel grid. A step k shows balls 0..k, a step [i, j, …]
    exactly those (`scale: [0, 3]`); `${name}:labels` (0/1) shows constant-screen-size labels
    (`sizeAttenuation: false`), the single sphere's above it.
  - `streams` `{ name, pos, from, to: [{ pos, lift, node }], grains, node, nodeRadius, speed }`:
    grains along quadratic arcs, an end cluster that gathers when its stream
    starts (`node: false` where a form of its own stands, e.g. the pentaquark);
    a stopped stream fades out over 1.2 s.
  - Slides drive them with `<Grains :set="{ scale: 3, 'scale:labels': 1, world: 8 }" />`
    (fires on slide enter; the last step per name is kept for forms built
    later) and count with `<Count name :from :to />`. Arrival at `store` (and
    `c`) regathers the piles; `onDone` is always called, on the engine clock.
- Story (owner, 2026-10-08): what LHCb is (cavern photograph), how much data
  it takes (40 MHz; 1 TB; LHCb's 100 PB), what it finds (76 of 86 new LHC
  hadrons; the 2019 pentaquark spectrum, white on transparent), the LHC's
  exabyte ("one of the largest datasets in science"; CERN claims "the largest
  scientific data archive" in HEP), then open (800 TB, 4 PB) and its uses.
- Photographs, not renders, for what is real: slide 3 the detector in its
  cavern (`lhcb_detector_2024.jpg`, © CERN · M. Brice), slide 4 a Run 3
  event display (`lhcb_event_run3.jpg`, © CERN / LHCb); the credit stays on
  the slide (CERN's terms).
- The deck sets `stage.palette.bg: '#000206'` (the engine feeds bg to the
  ground as raw linear colour, so the blue palette's navy lifted every black
  to ~rgb(10,16,33): the "washed out" look) and `stage.options`: `reach: 20`
  (the exabyte pose targets x = 5.59, 14.4 from the store station, and must
  still count as *at* it), `nebula 0.12, dustGain 1.0, exposure 1.1,
  vignette 0.7, grain 0.012, aberration 0, bloom 0.42`.
- The finds slide (76 of 86, the 2019 fit) is opaque (`.finds` paints the
  bg): the scrim is a gradient, so even `dim: 1` left the 100 PB pile
  glowing through the transparent plot. Space Grotesk has no "≠": write it
  in words.
- **Figures** (owner, 2026-10-08): "55 PB open" was dropped (the group's LMT
  applications use ~55 PB for LHCb's *total* data); the open pile is the
  public "over 4 PB" of Run 1 + Run 2 through the Ntupling Service (LHCb
  outreach, 3 Mar 2026). The 600 PB pile is labelled HL-LHC on the owner's
  word; it was dropped in the 2026-10-08 rework (the public "600 PB" is
  CERN's Run 3 figure for all experiments). A number lives in the `lineup`
  balls in `public/data/space.json`, the slide's `<Count :to>`, and the pose maths.
- **Kick-off clip** (slide 2, after the cover so it buffers): `lhcb.mp4`, the
  LHCb detector in 3D with music, as this talk's own 39 s cut of the library
  clip (`trim = ["0:08", "0:47.1"]` in `videos/manifest.toml`, raw gdrive
  `released/lhcb.mp4`, on release `videos-2026-10-00-opendata`, which wins the
  chain by name). The library copy opens on 8 s of dark tunnel (mean
  brightness under the player's `DARK`, 0.07) and ends on black, so the
  default `dustFrom: lit` gathers the grains into a black frame and a clip
  left after its end breaks up as black. The cut opens on the shafts above
  the cavern (white CG on black, drawn by the grains with `videos.dustFrom:
  start`) and ends at 47.1 s, as the music fades and before the picture does.
  After re-encoding: `pnpm videos:frames` (commit `public/video-frames/`),
  `videos:publish`, `videos:preflight`.
- Slides carry main points only (owner, 2026-10-08: "people will not read it,
  I will just say it"); what they leave out is in the notes under "Say:".
  No `.src` footers on the slides either ("don't need the sources"): each
  slide's sources are a "Sources:" line in its notes.
- `vite.config.ts` excludes `slidev-addon-stage` and `three` from
  pre-bundling, else `slidev dev` has two builder registries (the world never
  sees `lineup`/`streams`) and two copies of three.
- Streams on the store station: `world` (8 anonymous users, on the 4 PB
  slide), `vilnius` (3: the Z → μμ analysis, the course, the masterclass) and
  `dominykas` (1, ends at the `thesis` pentaquark, alone on the climax slide);
  the Dominykas slide is the last content slide, the close follows.
- Verify with the shots tool from feat/shots-v2 (`bin/shots.mjs dist <out>
  --sheet --size 1600x900`): it settles each slide on the engine clock and
  takes the shared render lock itself.
