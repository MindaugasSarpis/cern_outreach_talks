# Authoring details

The long form of what the root CLAUDE.md sums up: a talk's commands, the video
player, the shared hero and quiz components, the stage, aspect ratio and
embedded sites.
Moved here from the root CLAUDE.md on 2026-10-08; `docs/claude-md-split.md`
says where every other paragraph went. A talk's own notes are in
`talks/<name>/CLAUDE.md`.

## Commands in a talk

Run from inside a talk directory:

```bash
pnpm dev / build / build:portable / export
pnpm videos:sync        # rclone manifest-listed raws -> <repo>/videos/raw/
pnpm videos:encode      # ffmpeg raw -> public/videos/ (1080p H.264, -16 LUFS)
pnpm videos:publish     # -> talk release videos-<talk>   (-- --prune drops unlisted assets)
pnpm videos:pull        # release -> public/videos/       (-- --include-shared for offline builds)
pnpm videos:check       # manifest vs files vs slide refs; library refs reported as inherited
pnpm videos:preflight   # VENUE LINT — probe what each ref will serve (codec/size/bitrate/audio/loudness)
pnpm videos:clean       # delete local files whose remote copy is verified (dry-run; -- --yes)
pnpm venue              # pull --include-shared -> preflight -> build:portable -> <talk>-venue.zip
```

From the repo root: `pnpm videos:check-all`, `pnpm new-talk <YYYY_MM_DD_Name>`.
`slidev-videos discover <keywords>` (any dir) searches open archives for clips.

## Videos (slidev-videos)

- **Library clips** come from the package registry `src/slidev_videos/shared.toml`
  (43 clips) on release `MindaugasSarpis/slidev-videos@videos-shared`. Decks
  reference them by name; manifests never list them. Promote a clip there
  (encode in the package repo, publish, bump the tag) when a second deck
  needs it; keep venue clips and chart renders talk-owned.
  Library clips are full length (since 2026-09-09); a deck that wants a
  shorter cut lists the clip in its own manifest with `trim = ["m:ss", "m:ss"]`
  and encodes/publishes to its own release, which wins the chain.
- **Player**: `<VideoPlayer src="name.mp4" [muted] [loop] [:controls="false"] [:autoplay="false"] [:volume="0.7"] />`.
  Chain: own release -> shared release -> local `public/videos/` (dev mode
  local-first). Config in headmatter `videos: {repo, release, fit}`;
  old decks use `fit: contain`, WoP `fit: cover`. Keys: `p`, `+`, `-`.
  Slidev's overview grid and next-slide preview render a placeholder, not a
  `<video>`.
- **Policy** (since 2026-07-18): web tier only, ≤1920 H.264 ≤10 Mbps,
  AAC, -16 LUFS; `videos:preflight` enforces it. No HQ tier.
- **Renames** (2026-09-08 migration): see the package README's rename table.
- **Sliding attach window (v0.3.3).** A player carries its `<source>` only
  while its slide is live, one of the next three (look-ahead: attached early
  with `preload="auto"` so the clip buffers while the current slide is up, in
  dev AND production) or the one just passed; everything else is detached and
  `load()`ed empty. Chrome caps the media elements loaded per page (~10 on
  desktop) and past the cap a `load()` silently never completes — with every
  visited clip left attached, WoP froze from its 9th clip on, web and offline
  alike (2026-09-09). Earlier, production relied on `<link rel="preload"
  as="video">`, which Chrome rejects, so clips started cold (2026-09-07).
  Authoring consequence: put a non-video slide (cover) in front of a heavy
  opener so it gets a head start; the first slide itself can never be warmed.
- `videos:check` greps `VideoPlayer src="..."`, so keep that attribute syntax.

## ParticleHero (live hero slides) and QuizCard

```html
<ParticleHero mode="galaxy" kicker="Part I" title="From Saulėtekis|to the edge of|the Universe" corner-br="I / III" />
<ParticleHero mode="proton" sound counter kicker="World of Particles" title="Ačiū"
  sub="Questions?|c, or a click on the proton: one more collision" />
<QuizCard n="1" total="9" q="How fast…?" :options="['A…','B…','C…']" :answer="1" fact="One line shown on reveal." />
```

The CERN-lessons landing hero (live three.js particle scene, Space Grotesk
uppercase title) as a full-bleed slide, in three `mode`s
(`components/particle-hero/core.js`): `proton` (the probed sphere: beam
pulses along the fibers, eruptions inside — the landing), `galaxy` (a
spinning spiral disc), `collider` (a ring; two bunches cross at the top and
bottom interaction points twice a lap and erupt there). While the slide is
active: pointer stirs the field, a click shoves it and fires a collision,
`c` fires one now. `counter` shows a running tally; `sound` plays a
synthesised crack + thump (`particle-hero/sound.js`) for the presenter-
triggered collisions only. `'|'` breaks lines. Full-bleed like VideoPlayer —
no h1 on the slide. The scene runs only on the active slide and only in the
live `slide`/`presenter` render contexts (the overview grid gets the static
gradient card); without WebGL2 float render targets or under reduced
motion the static card is what you get.

`QuizCard` is the audience quiz in the same visual language: one question,
three tiles. Keys while active: `1`–`3` point at a tile, `Enter` or a click
reveals (correct tile lights, others dim, fact fades in, a 2D-canvas
burst), `r` resets. None of these clash with Slidev's navigation keys.

WoP uses them as act cards (galaxy / proton / collider), an interactive
finale (proton, sound, counter) and nine backup quiz slides after it.
Verify visually with headless Chromium (`--use-gl=angle --use-angle=swiftshader
--enable-unsafe-swiftshader` renders WebGL2 with float targets) — see the
shot script pattern in the 2026-09-08 migration plan.

## The stage (slidev-addon-stage)

Moved from "The stage (Innoday, and talks after it)". The bullets about
Innoday's own stations (with how a form is born scattered and gathers when
the camera arrives, `c`, and `stage.sound`) and its own pieces went to
`talks/2026_10_00_Innoday/CLAUDE.md`; the ffmpeg note went to the root's
"This workstation".

Startertalk's world is packaged as **`slidev-addon-stage`**
(`$SLIDEV_VIDEOS_DIR/packages/stage`, in the sibling `../slidev-videos`;
README there is the reference): the same
engine with its colours, object types, poses and numbers made the deck's to
set. Startertalk itself still runs on `components/HadronSpace.vue` and
`components/hadron-space/`; it has not been moved onto the package (that
wants a before/after screenshot comparison of all its slides). New talks use
the package.

- **Headmatter only.** `addons: [slidev-addon-videos, slidev-addon-stage]`
  and a `stage:` block (`space`, `palette`, `plugins`, `sound`, `options`).
  The addon mounts the world and the halo layer itself: no `global-top.vue` /
  `global-bottom.vue` in the talk. The addon's components are `Stage`,
  `StagePanel`, `StageHalo`, `StageHero`, so they do not clash with the
  symlinked `components/` (`HadronSpace`, `SpacePanel`, `HaloLayer`,
  `ParticleHero`).
- **Palette.** `blue` for Innoday: ultramarine dust, `#5b93ff` accent, a
  nebula behind the dust. `videos.dust` is set to the same accent so the
  clips' grains match the world's. CSS reads `--stage-*`.
- **Slides** steer the camera exactly as in Startertalk (`space: { at, dist,
  yaw, pitch, dim }`). **Pictures and numbers only** (the owner, 2026-10-10):
  a slide carries no title, kicker, statement, caption or credit, the cover
  included; a number may stand, its unit too (a `.unit` span beside a
  `<Count>`). Licence credits go in tiny print in a `.credits` block on the
  last slide; none for CERN's material. The rest goes to the notes, sources too
  (`pnpm talk lint`: TEXT). For the delivered decks, the addon's CSS kit supplies the type: cover as kicker
  / title / subtitle / byline (`# Innoday`, `# Title`, `## …`, `.mt-md`),
  section as a kicker and a large line low on the left (`# Part I` and a
  paragraph), cards, `.src`, `.world-caption`. A talk's own
  `styles/index.css` overrides it.
- **Clips** arrive and leave as particles (`videos.transition: dust`). The
  grains take their colours from `public/video-frames/` — `pnpm
  videos:frames`, committed with the deck (5 strips, 1.3 MB for Innoday);
  without a strip a clip fades. A clip gathers on a plane standing off in
  the world and flies to the frame; leaving, it breaks up past the camera and
  leaves its colours in the dust for a few seconds. A clip that opens on
  black arrives as its first lit frame and plays from there
  (`videos.dustFrom: start` keeps the opening). Give a video slide a `space:` pose too: the
  world rests under a covering clip, and when the clip breaks into dust the
  camera is already flying to that pose.
- **Check and look.** `pnpm stage:check`; `pnpm build --base / && pnpm
  stage:shots` photographs every slide into `shots/` (needs
  `playwright-chromium` in the workspace).
- Both addons and the CLI are pinned to slidev-videos `v0.4.0`: the talk's
  `package.json`, `scripts/new_talk.py` (`ADDONS_REF`) and env.yaml's pip
  entry move together on a release. The `frames` subcommand is new in 0.4.0;
  an env made before it needs `pip install -U` of that entry. The older talks
  stay on `#v0.3.3`: they use `cut`, which 0.4.0 does not change.

## Aspect ratio and canvas

The scienced theme's typography (`text-4xl` h1, `text-3xl` h2, etc.) is
calibrated against Slidev's default `canvasWidth = 980`. Slidev
transform-scales the slide to fit the viewport, so the deck visually
fills any venue at any resolution — `canvasWidth` only affects the
unscaled grid the theme is calibrated for, raster-asset alignment,
and PDF export pixel resolution.

**Rule of thumb: don't set `canvasWidth` in deck frontmatter.** Leave
it at Slidev's default 980. Then theme proportions match the CERN
lessons reference exactly.

Per-venue knobs (in deck frontmatter):
- `aspectRatio` — `9/5` for the editAI LED wall, `16/9` for projectors.

Video resolution is not a per-venue knob any more: every clip is a
1080p-class H.264 web encode (policy since 2026-07-18) and Slidev scales
the slide, so `long_edge_px` stays at the root `videos.toml` default.

Reference setups:
- `2026_04_28_editAI` — 2.5 × 4.5 m LED wall, 2880×1600, **9:5**. `aspectRatio: 9/5`.
- `2026_05_11_Sceptics` — 4K projector, 3840×2160, **16:9**. `aspectRatio: 16/9`.
- `2026_09_10_WorldOfParticles` — 16:9 projector; video-only reel, `fit: cover`.

With `fit: contain` (the old decks) mismatched clips letterbox inside
the slide — expected; `fit: cover` (WoP) fills the frame and crops. The
`VideoPlayer` itself is `position: absolute; inset: 0` (full-bleed),
so video slides should not also have an h1 — the video covers it. Add
descriptive copy on the preceding/following slide instead.

## Embedded iframe slides

A naive `<iframe class="absolute inset-0 w-full h-full" />` renders the
embedded site at the slide's canvas size (~980×552 with default
`canvasWidth`). Slidev then transform-scales the slide ~4× to hit a 4K
screen, so the embedded UI ends up oversized and pixelated.

Trick: oversize the iframe DOM by 2× and `transform: scale(0.5)` it
back. The embedded site sees a ~1960×1104 viewport (UI sizes itself
properly), and the outer Slidev scale lands at native 4K crisp:

```html
<div class="absolute inset-0 overflow-hidden bg-black">
  <iframe
    src="..."
    class="absolute top-0 left-0 border-0"
    style="width: 200%; height: 200%; transform: scale(0.5); transform-origin: top left;"
    allow="fullscreen"
    scrolling="no"
  ></iframe>
</div>
```

Bump to `300%` / `scale(0.333)` for higher-DPI sites; `400%` / `scale(0.25)`
shrinks UI dramatically (good only for sites where the UI is incidental).

## Facts, lint and the map

**Before any research, search the facts bank:** `python3 scripts/facts.py
search <words>` (`pnpm talk facts <words>`) over `research/facts.jsonl`,
290 checked public claims. Research only what it lacks, and add what a run
confirms (`facts.py add`, `research/README.md`). Photos with checked
licences are in `assets/photos/photos.toml`. Before handing a deck back,
run `python3 scripts/talk_lint.py talks/<name>` (`pnpm talk lint`).

`talk_lint.py` is the deck lint (`talk_deck.py` parses the deck); the photos in
`assets/photos/photos.toml` are fetched by `photo_fetch.py`.

Stdlib Python from the repo root; a talk is its directory or a unique part of
its name; `--json` on all of them:

```bash
python3 scripts/facts.py search touchscreen   # rank research/facts.jsonl; show <id>; add …; check
python3 scripts/facts.py add --from-lane talks/<name>/research/*.json   # file a research run's lanes (--dry-run first)
python3 scripts/talk_lint.py talks/<name>     # exit 1 on errors; --release makes open marks errors
python3 scripts/talk_map.py talks/<name>      # slide number, title, layout, clicks, pose, clip, minutes
python3 scripts/photo_fetch.py cds:<ID>       # or commons:File:<name>; --dry-run, --record, --check
python3 -I scripts/talk_copy.py talks/<name>  # the copy packet for an unslop pass (docs/unslop-lt.md for Lithuanian)
```

The lint's timing gate sums `(~N min)`, `(N min)` and `(m:ss)` in the notes
(dot or comma decimals) plus clip lengths (manifest `trim`, else
`public/video-frames/index.json`) against the headmatter `duration`
(`duration: 30min`) plus 5%. 'LHCb' where the stage kit uppercases it
(cover title, subtitle and `.mt-md`, section title, `.kicker`) is an error:
wrap it in a class the talk's CSS sets to `text-transform: none`. Cite
facts in a deck with `<!-- facts: id1, id2 -->` above the speaker notes;
the lint checks they exist and are confirmed or corrected. A content slide
wants a `.src` line; a deck that keeps its sources in the notes says
`sources: notes` in the headmatter, and the lint then asks for a
`Sources:` (or `Šaltiniai:`) line in that slide's notes instead.
Open marks are `[CHECK…]`, `[PATIKSLINTI…]` (a question for the owner),
`[ASR…]` (a quote from an automatic transcript, not re-listened yet) and
`[TODO…]`, anywhere below the headmatter: warnings, errors with `--release`.
A question the talk can go without says so right after the mark,
`[CHECK, optional: …]` or `[PATIKSLINTI, neprivaloma: …]`, and stays a
warning with `--release` (`CHECK-OPTIONAL`) in the notes or another
comment; in the slide text it is an open check like the others, since
Slidev shows the bracket. Settle each and delete the mark; the headmatter
`info` may name them.
