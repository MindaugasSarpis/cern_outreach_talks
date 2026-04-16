# HQ local-encoding tier + new-video propagation

**Date:** 2026-04-16
**Talk:** `talks/2026_04_28_editAI/`
**Touches:** `scripts/videos.py`, `components/VideoPlayer.vue`, talk `package.json`, talk `manifest.toml`, `deck.md`

## Goal

Add a third asset tier — visually-lossless venue masters that live only on the
presenter's laptop — and bring 14 newly added Drive clips into the talk's
manifest, encoding pipeline, and slides.

The HQ tier exists because the venue is a 2880×1600 LED wall and the
existing web tier (capped at ~200 MB and re-encoded for online viewers) is
overkill for online but underkill for the wall. Raw 4K masters are the wrong
shape for venue playback (wrong resolution, oversized files, browser
codec roulette). HQ sits in between: scaled to venue resolution, near-lossless
quality, but never uploaded anywhere.

## Pipeline

Three asset tiers from one source:

```
videos/raw/          (gitignored, rclone-mirrored from Drive)
   │
   ├──► public/videos/      (web encode: HEVC, capped 200MB, → GH Release)
   │
   └──► videos/hq/          (HQ encode: visually-lossless HEVC @ 2880, local-only)
                ▲
                └── public/videos-hq/  (symlink, served by Slidev dev server)
```

`videos/hq/` and `public/videos-hq/` are gitignored and never published.

## Encoding profile

One new universal HQ profile keyed `hq-visually-lossless`:

```
-c:v libx265 -tag:v hvc1
-preset slow -crf 16
-pix_fmt yuv420p
-vf scale='min({LONG_EDGE},iw)':-2
-c:a copy
-movflags +faststart
```

Two automatic adaptations driven by the existing per-video `profile` field —
no new manifest config:

- `profile = "silent-loop"` → HQ run adds `-an`.
- `profile = "remux"` → HQ run is also `-c copy` (source already considered
  web-friendly and small; no re-encode).

Audio fallback: `-c:a copy` works when source audio is container-compatible.
If the first ffmpeg invocation fails for an HQ encode, a single auto-retry is
attempted with `-c:a aac -b:a 256k` for that file.

## CLI / package scripts

`scripts/videos.py`:

- **Add** `encode-hq` subcommand. Same flags as `encode` (`--force`, `--only`).
  Writes to `videos/hq/`. Creates the `public/videos-hq → ../../videos/hq`
  symlink on first run if missing (or stale).
- **Remove** `link-hq` subcommand. Folded into `encode-hq`.
- **Remove** `publish-hq` subcommand. HQ is local-only.

`talks/2026_04_28_editAI/package.json`:

- **Add** `"videos:encode-hq": "python3 ../../scripts/videos.py encode-hq"`.
- **Remove** `videos:link-hq`, `videos:publish-hq`.

## VideoPlayer fallback chain

When `hq=true` (currently: try local `videos-hq/`, fall back to GH Release
`videos-hq-<talk>`):

1. `public/videos-hq/<src>` — venue master, dev-only.
2. `public/videos/<src>` — web copy, dev fallback.
3. `https://github.com/<repo>/releases/download/videos-<talk>/<src>` — web
   copy from GH Release, deployed fallback.

When `hq=false` (default), behavior is unchanged: local web → remote web.

`VITE_VIDEO_RELEASE_HQ` env var and `REMOTE_BASE_HQ` constant are removed
from `components/VideoPlayer.vue`.

## Manifest additions

Append to `talks/2026_04_28_editAI/videos/manifest.toml`:

| Name | Profile | Notes |
|---|---|---|
| `Cassini_Grand_Finale_No_Vo.mp4` | `silent-loop` | "No_Vo" → no audio; loops cleanly |
| `CERN-FOOTAGE-2022-042-001.mov` | `standard` | Documentary B-roll |
| `CERN-FOOTAGE-2026-012-001.mp4` | `standard` | Documentary B-roll |
| `cmb_data.mp4` | `remux` | Chart render, <1 MB |
| `cmb_fit.mp4` | `remux` | Chart render |
| `cmb_power_spectrum.mp4` | `remux` | Chart render |
| `g2_data.mp4` | `remux` | Chart render |
| `g2_fit.mp4` | `remux` | Chart render |
| `gaussian.mp4` | `remux` | Chart render |
| `gaussian_highstats.mp4` | `remux` | Chart render |
| `higgs_bkg.mp4` | `remux` | Chart render |
| `higgs_data.mp4` | `remux` | Chart render |
| `higgs_sigbkg.mp4` | `remux` | Chart render |
| `higgs_signal.mp4` | `remux` | Chart render |

All entries set `used_in = ["deck"]`. If the two `CERN-FOOTAGE-*` clips
exceed the 200 MB web budget after encoding, bump them to `standard-tight`
(CRF 27).

## Deck changes

Two edits to `talks/2026_04_28_editAI/deck.md`:

**(a) Replace 10 GIF slides with VideoPlayer slides.**
For each chart clip whose mp4 now exists in Drive, replace this shape:

```md
---
layout: image
image: /figures/<name>.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="<name>.mp4" loop muted :controls="false" />
```

Affected slides (in deck order): `gaussian`, `gaussian_highstats`, `cmb_data`,
`cmb_fit`, `cmb_power_spectrum`, `g2_data`, `g2_fit`, `higgs_bkg`,
`higgs_sigbkg`, `higgs_data`.

The Z-boson GIF slides (`z_data`, `z_fit3`, `z_alternatives`) are left alone
— no mp4 versions exist yet.

**(b) Append 4 placeholder slides** at the end of the deck — three large
clips with bare `<VideoPlayer>` (default props: controls + audio), and the
orphan `higgs_signal.mp4` (no GIF predecessor in the current deck) as a
silent loop in the chart-clip style so it sits naturally next to the other
Higgs slides once relocated:

```md
---

<VideoPlayer src="CERN-FOOTAGE-2022-042-001.mov" />

---

<VideoPlayer src="CERN-FOOTAGE-2026-012-001.mp4" />

---

<VideoPlayer src="Cassini_Grand_Finale_No_Vo.mp4" />

---

<VideoPlayer src="higgs_signal.mp4" loop muted :controls="false" />
```

The presenter will reposition these into the appropriate sections later.

The original `.gif` files in `public/figures/` are not deleted.

## Execution order

1. Edit `scripts/videos.py`: add `hq-visually-lossless` profile, `_encode_one_hq`
   helper, `encode-hq` subcommand. Remove `link-hq` and `publish-hq`.
2. Edit `talks/2026_04_28_editAI/package.json`: add `videos:encode-hq`,
   remove `videos:link-hq` and `videos:publish-hq`.
3. Edit `components/VideoPlayer.vue`: rework `hq` fallback chain, drop
   `VITE_VIDEO_RELEASE_HQ`.
4. Append 14 entries to `talks/2026_04_28_editAI/videos/manifest.toml`.
5. `pnpm videos:sync && pnpm videos:encode && pnpm videos:encode-hq && pnpm videos:check`.
6. Edit `deck.md`: replace 10 GIF slides; append 3 large-clip slides.
7. `pnpm videos:publish` (web tier only).
8. Optionally delete the now-stale `videos-hq-2026-04-28-editai` GH Release
   if one exists. (User confirms before deletion.)
9. User runs `pnpm dev` and verifies in the browser.

## Out of scope

- Z-boson clips (`z_*.gif` → `.mp4` conversion).
- Removing `public/figures/*.gif` files.
- Wiring the 3 large clips into specific deck sections.
- Backporting HQ encoding behavior to other talks (none exist yet).
