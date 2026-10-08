# Opening LHCb's data (talks/2026_10_00_OpenData)

The notes for this talk: Claude Code reads this file when it works in the
talk's directory, and the root CLAUDE.md holds what every talk shares. Keep it
current (Status, Decisions, Figures). The repo is public: nothing private here.

## Notes moved from the root CLAUDE.md (2026-10-08)

From the root's list of current talks:

- `talks/2026_10_00_OpenData/` — "Opening LHCb's data", a 6½-minute award talk
  (LHCb Vilnius nominated for an open data award). On the packaged stage, pinned
  like the Innoday branch to slidev-videos `640eaa5` (feat/effects-v2) for the
  grain forms, plus two talk-owned builders. Date placeholder `10_00`. See
  "Open data talk" below.

### Open data talk (2026_10_00_OpenData)

One world; one sphere is one terabyte. The hero is the engine's `collider`
(cover, the collisions slide, the close); the `store` station holds the
talk's own forms; `thesis` is a gold five-node `constellation` (the
pentaquark of Dominykas Stonkus's BSc project), moved out to z = 24 so the
far-back scale poses stay nearest the store.

- **Talk-owned builders** (`setup/grains.js`, registered from `setup/main.ts`;
  `stage:check` runs with `--types lineup,streams`):
  - `lineup` `{ name, pos, balls: [{ n, color, label }], unit, anchor, gaps, grow, reach, glow, labelH }`:
    piles of one and the same sphere side by side along x (1, 800, 4 000
    gold; 600 000 blue, the HL-LHC), each pile the first n points of a face-centred cubic
    lattice taken shell by shell, so the first n always make a ball. Piles keep
    their size: the slides pull the camera back (dist 0.75 → 8.7 → 18.1 → 50.1)
    and what came before is seen shrinking into the new scale (the owner's ask,
    2026-10-07: a single ball per step "looked the same after zooming out").
    A ball of one is the engine's marble; piles are sphere impostors (a point
    sprite shaded as a lit ball, writing its own depth via gl_FragDepth, sized
    from the projection and the current viewport, clamped to the GPU's
    ALIASED_POINT_SIZE_RANGE), jittered more as piles grow so rows do not beat
    against the pixel grid, highlights dropped below ~10 px. Step k shows balls
    0..k; `${name}:labels` (0/1) shows constant-screen-size labels
    (`sizeAttenuation: false`), the single sphere's above it.
  - `streams` `{ name, pos, from, to: [{ pos, lift, node }], grains, node, nodeRadius, speed }`:
    grains along quadratic arcs, an end cluster that gathers when its stream
    starts (`node: false` where a form of its own stands, e.g. the pentaquark);
    a stopped stream fades out over 1.2 s.
  - Slides drive them with `<Grains :set="{ scale: 3, 'scale:labels': 1, world: 8 }" />`
    (fires on slide enter; the last step per name is kept for forms built
    later) and count with `<Count name :from :to />`. Arrival at `store` (and
    `c`) regathers the piles; `onDone` is always called, on the engine clock.
- The deck sets `stage.options.reach: 20`: the 600 PB pose targets x = 5.48,
  14.5 from the store station, and must still count as *at* it.
- **Figures** (owner, 2026-10-08): "55 PB open" was dropped (the group's LMT
  applications use ~55 PB for LHCb's *total* data); the open pile is the
  public "over 4 PB" of Run 1 + Run 2 through the Ntupling Service (LHCb
  outreach, 3 Mar 2026). The 600 PB pile is labelled HL-LHC on the owner's
  word, its source still to be added (the public "600 PB" is CERN's Run 3
  figure for all experiments). A number lives in the `lineup` balls in
  `public/data/space.json`, the slide's `<Count :to>`, and the pose maths.
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
- Streams on the store station: `world` (8 anonymous users, "Anyone can take
  it"), `vilnius` (3: the Z → μμ analysis, the course, the masterclass) and
  `dominykas` (1, ends at the `thesis` pentaquark, alone on the climax slide);
  the Dominykas slide is the last content slide, the close follows.
- Under SwiftShader the 600 000-sphere pile renders at ~7 fps (1280×720), so
  flights and gathers run slow (dt clamp); shoot with `--wait 34000`.
