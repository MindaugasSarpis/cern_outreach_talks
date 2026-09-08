# Migrate outreach_talks onto the `slidev-videos` package — design

**Date:** 2026-09-08 · **Status:** approved in discussion, awaiting spec review ·
**Completes:** follow-up §12 of the package design
(`CERN_lessons_on_data_analysis/docs/superpowers/specs/2026-09-01-video-pipeline-package-design.md`).

## 1. Summary

This repo carries its own copy of the video pipeline (`scripts/videos.py`,
1963 lines), its own `VideoPlayer.vue`, and its own shared registry
(`videos/shared.toml` + the `videos-shared` release on
`MindaugasSarpis/cern_outreach_talks`). Since 2026-09-01 the same pipeline
lives as a package, `MindaugasSarpis/slidev-videos` (Python CLI
`slidev-videos` + npm addon `slidev-addon-videos` + a 34-clip shared library
on that repo's `videos-shared` release). After this migration the outreach
repo holds only decks, theme, content components and thin per-talk config;
every generic clip is served from the package library, once; each talk's own
release holds only clips specific to that talk.

## 2. Goals / non-goals

Goals

- One shared clip library (the package's), used by every talk; no
  duplicated generic clips across outreach releases.
- Local masters of the whole library downloaded once, into the package
  repo's raw bank.
- The outreach repo no longer contains any video-pipeline code or registry.
- All five decks keep building and playing, including the World of
  Particles deck delivered on 2026-09-10.

Non-goals

- Changing the encode policy (stays 1080p H.264, −16 LUFS, no HQ tier).
- Re-encoding delivered talks' own clips (Yaga's `lt_zoom.mov` stays as
  published).
- Touching the course repo.

## 3. Clip mapping

Five decks reference 45 distinct names.

### 3.1 Already in the library (16)

Renamed in decks where the library name differs:

| deck name today | library name |
|---|---|
| cern_video_2019_050_008_1080ph265.mp4 | cern_video_2019_050_008.mp4 |
| cassini.mov | cassini_grand_finale.mp4 |
| perseverence_rover_landing_nasa.mp4 | perseverance_rover_landing_nasa.mp4 |
| cern_footage_2022_013_001_1080p_lhc.mp4 | cern_footage_2022_013_001.mp4 |
| drone_climbing_mountain_2.mp4 | drone_climbing_mountain.mp4 |
| expansion_funnel_h264_1080p.webm | expansion_funnel.webm |

Unchanged: cern_overview_short, voyage_in_to_the_world_of_atoms, lhcb,
cloud_chamber_audio, nasa_mars_mariner_4_pan_audio, qgp_formation,
webb_reel, cern_footage_2024_010_002, cern_footage_2025_014_002,
cern_footage_2024_006_001.

Accepted behaviour change for the delivered decks (editAI, Sceptics, Yaga):
the library copies of cassini, cloud chamber, webb reel, LHC tunnel and
Perseverance are 90 s trims.

### 3.2 Promoted into the library (9)

Generic footage per package policy §5.1. Encoded in the package repo from
the gdrive masters (`gdrive:work/outreach/resources/videos/released/`),
published to the package `videos-shared` release, tagged **v0.3.0**.

| library name | deck name today | raw (released/) | profile |
|---|---|---|---|
| lhcb_aciu.mp4 | lhcb_aciu.mov | lhcb_aciu.mov (2.4 GB, 2880×1600 HEVC, Lithuanian thanks reel) | standard-tight |
| standard_model.mp4 | sm.mov | sm.mov | standard |
| beyond_cmb.mp4 | same | same | standard |
| mars_surface.mp4 | same | same | standard |
| atoms.mp4 | atoms.mov | atoms.mov | high-motion |
| blue_ghost_lunar_orbit.mp4 | same | same | standard |
| saturn_v_launch_nasa.mp4 | same | same | high-motion |
| cmb_sonification_drone.mp4 | same | same | standard |
| mountain.mp4 | mountain.mov | mountain.mov (4.9 GB, 4K30 H.264 + PCM) | high-motion |

`lhcb_aciu` (Lithuanian) and the course's `lhcb_thanks` (English) are
different clips; both may coexist in the library, only `lhcb_aciu` is
added here. The package looks raws up as `videos/raw/<name>`, so a renamed
clip's raw is copied under its library name (`rclone copyto`), and the entry's
`notes` records the source path, as the existing library entries do.

### 3.3 Talk-owned (20)

| talk | owned clips | release |
|---|---|---|
| 2026_04_28_editAI | 14 chart renders (cmb_data, cmb_fit, cmb_power_spectrum_data, cmb_power_spectrum_fit, g2_data, g2_fit, gaussian, gaussian_highstats, higgs_bkg, higgs_data, higgs_sigbkg, z_data, z_fit3, z_alternatives) + mokslo_sala.mov | videos-2026-04-28-editai (re-encoded at 1080p from raws; current contents are the stale HEVC archive) |
| 2026_05_11_Sceptics | g2_data, g2_fit | videos-2026-05-11-sceptics (already there) |
| 2026_07_18_Yaga | lt_zoom.mov | videos-2026-07-18-yaga (already there, kept as published) |
| 2026_09_10_WorldOfParticles | vu_ff_zoom.mp4 | videos-2026-09-10-worldofparticles (already there) |
| 2026_09_00_Startertalk | none | none |

## 4. Package repo changes (`~/slidev-videos`)

1. `src/slidev_videos/shared.toml`: nine new `[[videos]]` entries (§3.2),
   grouped under the existing section headings; `mountain.mp4` and
   `cmb_sonification_drone.mp4` under a new "outreach lineage" heading.
2. Raw bank: `slidev-videos sync` for the names that match the gdrive
   folder, `rclone copyto` for the renamed ones, so
   `~/slidev-videos/videos/raw/` holds a master for every library entry
   (43 files, ~20 GB). This is the "local masters downloaded" deliverable.
   Sources for the 34 existing entries are the paths recorded in their
   `notes` (folders `released/`, `cern/`, `science/`, `cosmology/`, and two
   course-release HEVC copies for `stars_pan_audio` / `hubble`).
3. `slidev-videos encode` (CPU libx264 per the package `videos.toml`),
   `slidev-videos preflight` on the nine new files, `slidev-videos publish`,
   `slidev-videos shared-check`.
4. `discover`: move `scripts/discover_videos.py` (stdlib-only,
   self-contained) to `src/slidev_videos/discover.py`, expose it as the
   `slidev-videos discover` subcommand, move `tests/test_discover_videos.py`
   + `tests/fixtures/` with it. Behaviour unchanged.
5. Player (addon), both ported from the sibling players and shipped in the
   same tag: (a) outside the live `slide`/`presenter` render contexts —
   Slidev's overview grid, the presenter's next-slide preview — render a
   static placeholder instead of a `<video>` (course player behaviour; the
   overview mounts every slide at once, and its copy of the current slide
   re-downloaded the clip being watched); (b) production look-ahead attaches
   the `<source>` early instead of `<link rel="preload" as="video">`, which
   Chrome rejects (outreach fix of 2026-09-07). Smoke-tested.
6. README: add the outreach rename table (§3.1, §3.2) to the shared-library
   section. Bump `pyproject.toml` and `package.json` to 0.3.0, commit, tag
   `v0.3.0`, push.

## 5. Outreach repo changes

### 5.1 Removed

`scripts/videos.py`, `scripts/tests/`, `scripts/discover_videos.py`,
`tests/`, `components/VideoPlayer.vue`, `videos/shared.toml`,
`outreach.toml`, every `talks/*/.env`, `talks/*/public/videos-hq` symlinks
and `talks/*/videos/hq/` dirs.

### 5.2 Kept

`theme/`, `components/` (ParticleHero, ParticleDiagram, …),
`scripts/render_lib.py` (animation rendering is content, not pipeline),
`scripts/new_talk.py` (rewritten, §5.5), `.github/workflows/deploy.yml`
(unchanged: `pnpm install` fetches the addon as a public git dependency).

### 5.3 Added config

Root `videos.toml`:

```toml
[defaults]
repo             = "MindaugasSarpis/cern_outreach_talks"
source_remote    = "gdrive:work/outreach/resources/videos/released"
web_long_edge_px = 1920
long_edge_px     = 1920
max_size_mb      = 200
# shared defaults to MindaugasSarpis/slidev-videos@videos-shared
```

Per talk `talks/<name>/videos.toml`:

```toml
[project]
raw_dir = "../../videos/raw"     # repo-level raw bank, one copy per machine

[defaults]
release_tag = "videos-<talk>"    # explicit; the package derives its default
                                 # from the project dir name too, kept for clarity
```

WorldOfParticles keeps `max_size_mb = 300` in its manifest `[defaults]`.
Manifests are rewritten to list only the owned clips of §3.3, with the
package's profile names (unchanged set) and no `hq_*` / `encoder` keys.

### 5.4 Per-talk `package.json` and deck headmatter

```json
"devDependencies": { "slidev-addon-videos": "github:MindaugasSarpis/slidev-videos#v0.3.0" },
"scripts": {
  "videos:sync": "slidev-videos sync", "videos:encode": "slidev-videos encode",
  "videos:publish": "slidev-videos publish", "videos:pull": "slidev-videos pull",
  "videos:check": "slidev-videos check", "videos:clean": "slidev-videos clean",
  "videos:preflight": "slidev-videos preflight", "venue": "slidev-videos venue"
}
```

Deck headmatter gains:

```yaml
addons:
  - slidev-addon-videos
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-<talk>
  fit: contain          # preserve today's letterboxing (addon default is cover)
```

`shared` is left at the addon's built-in default. Startertalk sets
`release: videos-2026-09-00-startertalk` even though the release does not
exist (the chain falls through to shared with one 404, same as today).

Deck refs are renamed per §3.1/§3.2 with a scripted, exact-match sed.
The decks use only `muted`, `loop` and `:controls="false"`, all addon
props.

Root `package.json`: `videos:check-all` loops `slidev-videos check` over
`talks/*`; `videos:shared:check` and `videos:discover` are removed
(they run from the package repo now); `new-talk` stays.

### 5.5 `scripts/new_talk.py`

Scaffolds the new layout: `videos.toml` (§5.3), `package.json` (§5.4),
headmatter with `addons:` + `videos:`, empty manifest with the policy
comment, `components` symlink, no `.env`, no `videos/hq`, no
`public/videos-hq`. The stale `scripts/new-talk.sh` is deleted.

### 5.6 `env.yaml`, `.gitignore`, docs

- `env.yaml`: add `pip: [ "slidev-videos @ git+https://github.com/MindaugasSarpis/slidev-videos@v0.3.0" ]`
  (and `pip` itself). rclone/ffmpeg/gh stay.
- `.gitignore`: drop `**/videos/hq/` and `**/public/videos-hq`; keep the
  rest (raw bank, web copies, dist, stray-master safety net).
- CLAUDE.md and README.md: the video sections shrink to "install the
  package, day-to-day commands, adding a clip, the rename table, the
  shared library lives in slidev-videos". Layout tree, config layering,
  encoding-profile and VideoPlayer internals sections are replaced by a
  pointer to the package README. The talk list, theme/authoring, iframe,
  aspect-ratio, ParticleHero and deployment sections stay.

## 6. Release cleanup (destructive, on `cern_outreach_talks`)

Done last, after §7 gates pass:

| action | target | why |
|---|---|---|
| delete release | videos-hq-2026-05-11-sceptics | HQ tier retired 2026-07-18 |
| delete release | videos-hq-2026-07-18-yaga | same |
| delete release | videos-shared | superseded by the package library + editAI re-encodes |
| `publish --prune` | videos-2026-04-28-editai | replaces the HEVC archive with the 15 owned 1080p encodes |
| `publish --prune` | videos-2026-05-11-sceptics | drops the 3 now-shared CERN clips |
| `publish --prune` | videos-2026-07-18-yaga | drops everything but lt_zoom.mov |
| **not now** | videos-2026-09-10-worldofparticles | talk on 2026-09-10; prune to vu_ff_zoom.mp4 afterwards (one command, noted in README) |

The gdrive `released/` folder is read-only from this machine and is not
touched.

## 7. Order and verification

1. Package: §4 in order; gate = `preflight` green on the nine new files,
   `shared-check` clean, `pytest` green, tag pushed.
2. Outreach: §5; `pnpm install` at the root picks up the addon.
3. Gates, all from this repo:
   - `slidev-videos check` in every talk: no UNKNOWN REF, no missing owned clip.
   - `slidev-videos preflight` in WorldOfParticles against the deployed
     chain: every served file H.264, ≤1920, ≤10 Mbps, loudness in band.
   - `pnpm build` succeeds for all five talks.
   - Built WoP deck served locally: the opener (`vu_ff_zoom.mp4`, own
     release) and one library clip (`cern_overview_short.mp4`) play; the
     browser console shows no `Video not available`.
   - editAI: `encode` + `publish` of the 15 owned clips, then `check` clean.
4. §6 deletions.
5. Commit and push both repos; confirm the Pages deploy builds.

## 8. Error handling / rollback

- The package tag `v0.2.0` and the existing outreach releases stay intact
  until step 4, so until then every deployed deck keeps working unchanged
  (the deploy only changes when this repo's main is pushed).
- `mountain.mov`'s PCM audio: the web profile transcodes to AAC, and
  `preflight` verifies the served audio codec.
- `lhcb_aciu.mov` is a 2880×1600 HEVC master; the web encode scales to a
  1920 long edge and H.264, verified by `preflight`.
- A rename that misses a ref surfaces as UNKNOWN REF in `check` (gate 3).

## 9. Decisions log

| decision | choice | why |
|---|---|---|
| Home of non-library clips | promote generic, keep talk-specific | package policy §5.1; kills the cross-release duplication without filling the library with matplotlib renders |
| lhcb_aciu vs lhcb_thanks | separate library entries | different clips (Lithuanian vs English) |
| Delivered decks and 90 s trims | accept | archives; one library copy beats per-talk full-length duplicates |
| `discover` | moves into the package | it is pipeline tooling, and the user wants only content here |
| WoP release prune | deferred past 2026-09-10 | no destructive change to a talk's release two days before delivery |
| `fit: contain` in headmatter | yes | preserves the current look; addon default is `cover` |

## 10. World of Particles deck — finished as a video-only reel (added 2026-09-08)

Scope added after design approval: the 2026-09-10 deck is completed on
the new workflow, modelled on lecture 1 of the CERN data-analysis course
("Orientation", reel of 2026-09-08): a landing slide and videos, no text
slides.

- **Landing:** the existing `ParticleHero` cover (slide 1). It also gives
  the opener a buffering head start.
- **Reel:** three acts in the course's order, every clip from the package
  library except the talk's own opener. `fit: cover` (no letterbox bars;
  the reel is the whole screen). Every video slide carries an HTML
  comment naming the clip, as in the course.
  - Act I, from the cosmos: vu_ff_zoom (own, 4:42) · saturn_v_launch_nasa ·
    blue_ghost_lunar_orbit · nasa_mars_mariner_4_pan_audio ·
    perseverance_rover_landing_nasa · cassini_grand_finale · stars_pan_audio ·
    hubble · telescope · webb_reel · milky_way_sim_audio · sdss_universe_zoom ·
    expansion_funnel (muted) · beyond_cmb (muted) · cmb_sonification_drone.
  - Act II, to the quantum: qgp_formation · cern_footage_2015_006_001
    (Standard Model table) · atoms · cloud_chamber_audio.
  - Act III, inside CERN: cern_overview_short · cern_footage_2022_013_001 ·
    atlas_footage_2022_004_002 · atlas_video_2021_001_001 · cms ·
    cern_footage_2022_042_001 · lhcb · cern_footage_2024_006_012 ·
    atlas_video_2023_013_001 · cern_footage_2022_013_006 ·
    cern_footage_2025_048_001 · cern_footage_2024_006_001 · lhcb_aciu (closer).
  - 32 clips, about 33 minutes of footage. Dropped from the current WoP
    deck: cern_video_2019_050_008 (vacuum animation, weakest clip).
- **Own release:** only `vu_ff_zoom.mp4`; the six re-encoded Yaga-lineage
  copies are superseded by library entries and pruned after the talk (§6).
- **Venue notes** (README): `p` play/pause, `+`/`-` volume (sticky),
  `pnpm venue` for the offline bundle.
