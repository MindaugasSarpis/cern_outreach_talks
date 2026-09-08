# slidev-videos Migration + World of Particles Reel — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace this repo's private video pipeline, player and shared registry with the `slidev-videos` package and its shared library, de-duplicate clips across releases, and finish the World of Particles deck as a video-only reel on the new workflow.

**Architecture:** Two repos. `~/slidev-videos` (package, editable-installed as `slidev-videos` 0.1.0 from that checkout, so Python edits are live) gains nine library clips, a full local raw bank, the `discover` subcommand, and tag v0.3.0. `~/outreach_talks` loses `scripts/videos.py`, `components/VideoPlayer.vue`, `videos/shared.toml`, `outreach.toml` and the `.env` files; it gains one root `videos.toml`, one per talk, addon headmatter, and rewritten manifests. Release cleanup happens last.

**Tech Stack:** Python 3.11+ CLI (`slidev-videos`), Slidev 52 addon (`slidev-addon-videos`), pnpm 10 workspace, ffmpeg (libx264 for the library; NVENC available via `~/micromamba/envs/outreach_talks/bin/ffmpeg`), rclone (`~/micromamba/envs/outreach_talks/bin/rclone`, remote `gdrive:` read-only), `gh`.

**Spec:** `docs/superpowers/specs/2026-09-08-slidev-videos-migration-design.md` (§1–§10).

## Global Constraints

- Web tier policy: H.264, long edge ≤ 1920, ≤ 10 Mbps, AAC audio, −16 LUFS ± 2 LU (spec §2, verified by `slidev-videos preflight`).
- Library names: lowercase snake_case, no resolution/codec suffixes (package policy §5.2).
- Package library encodes use `encoder = "cpu"` (package `videos.toml`); outreach talk encodes may use NVENC.
- Git remote in this clone is `origin` (memory note; CLAUDE.md says `github`). Package repo remote is `origin`.
- Commit trailer on every commit:
  ```
  Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4
  ```
- Never delete or prune `videos-2026-09-10-worldofparticles` in this plan (spec §6).
- gdrive is read-only; never attempt uploads or deletes there.
- Tool paths: `RCLONE=~/micromamba/envs/outreach_talks/bin/rclone`; for NVENC encodes prefix `PATH=~/micromamba/envs/outreach_talks/bin:$PATH`.

---

## Part A — package repo (`~/slidev-videos`)

### Task 1: Nine new library entries in `shared.toml`

**Files:**
- Modify: `~/slidev-videos/src/slidev_videos/shared.toml`
- Test: `~/slidev-videos/tests/test_shared_registry.py` (create)

**Interfaces:**
- Produces: library names `lhcb_aciu.mp4 standard_model.mp4 beyond_cmb.mp4 mars_surface.mp4 atoms.mp4 blue_ghost_lunar_orbit.mp4 saturn_v_launch_nasa.mp4 cmb_sonification_drone.mp4 mountain.mp4` used by Tasks 2, 3, 8, 10.

- [ ] **Step 1: Write the failing test**

```python
# ~/slidev-videos/tests/test_shared_registry.py
"""shared.toml: names are unique snake_case, profiles valid, the 2026-09-08 outreach promotions present."""
import re
import tomllib

from slidev_videos import config, pipeline

SNAKE = re.compile(r"^[a-z0-9_]+\.(mp4|webm)$")

PROMOTED_2026_09_08 = {
    "lhcb_aciu.mp4", "standard_model.mp4", "beyond_cmb.mp4", "mars_surface.mp4",
    "atoms.mp4", "blue_ghost_lunar_orbit.mp4", "saturn_v_launch_nasa.mp4",
    "cmb_sonification_drone.mp4", "mountain.mp4",
}


def _entries():
    with config.shared_registry_path().open("rb") as f:
        return tomllib.load(f)["videos"]


def test_names_unique_and_snake_case():
    names = [v["name"] for v in _entries()]
    assert len(names) == len(set(names))
    bad = [n for n in names if not SNAKE.match(n)]
    assert bad == []


def test_profiles_valid():
    bad = [v["name"] for v in _entries() if v["profile"] not in pipeline.PROFILE_NAMES]
    assert bad == []


def test_outreach_promotions_present():
    names = {v["name"] for v in _entries()}
    assert PROMOTED_2026_09_08 <= names
    assert len(names) == 43
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd ~/slidev-videos && python3 -m pytest tests/test_shared_registry.py -q`
Expected: `test_outreach_promotions_present` FAILS (34 names, promotions missing); the other two pass.

- [ ] **Step 3: Add the entries**

Insert under `# --- space / astronomy ---` (after `expansion_funnel.webm`):

```toml
[[videos]]
name    = "mars_surface.mp4"
profile = "standard"
notes   = "Mars surface footage, 0:55, silent (H.264 15 Mbps 1080p source). Source: released/mars_surface.mp4 (outreach, promoted 2026-09-08)"

[[videos]]
name    = "blue_ghost_lunar_orbit.mp4"
profile = "standard"
notes   = "Firefly Blue Ghost lunar orbit footage (raw 1080p H.264 5.7 Mbps). Source: released/blue_ghost_lunar_orbit.mp4 (outreach, promoted 2026-09-08)"

[[videos]]
name    = "saturn_v_launch_nasa.mp4"
profile = "high-motion"
notes   = "Saturn V launch, NASA archival footage with sound, 2:55 (raw 1080p H.264 9.8 Mbps). Source: released/saturn_v_launch_nasa.mp4 (outreach, promoted 2026-09-08)"

[[videos]]
name    = "beyond_cmb.mp4"
profile = "standard"
notes   = "Beyond-the-CMB science reel, silent (H.264 11.6 Mbps 720p source, stays 720p — no upscale). Source: released/beyond_cmb.mp4 (outreach, promoted 2026-09-08)"

[[videos]]
name    = "cmb_sonification_drone.mp4"
profile = "standard"
notes   = "CMB sonification drone render, 1800x1040, with audio. Source: released/cmb_sonification_drone.mp4 (outreach crash-course lineage, promoted 2026-09-08)"
```

Insert under `# --- particle physics ---` (after `cloud_chamber_audio.mp4`):

```toml
[[videos]]
name    = "standard_model.mp4"
profile = "standard"
notes   = "Standard Model overview, 0:23 with audio (2880x1600 9:5 source, scaled to 1920 wide; letterboxes on 16:9). Source: released/sm.mov (outreach, promoted 2026-09-08)"

[[videos]]
name    = "atoms.mp4"
profile = "high-motion"
notes   = "CG zoom into atoms, 1080p (raw HEVC 10.2 Mbps, re-encoded H.264). Source: released/atoms.mov (outreach, promoted 2026-09-08)"
```

Insert under `# --- CERN / LHC / experiments ---` (after `lhcb.mp4`):

```toml
[[videos]]
name    = "lhcb_aciu.mp4"
profile = "standard-tight"
notes   = "LHCb thanks reel in Lithuanian ('Ačiū'), 2:28 with audio — the closer of the Lithuanian crash-course decks. Distinct from the course's English lhcb_thanks. Source: released/lhcb_aciu.mov (2880x1600 HEVC 2.4 GB venue master; outreach, promoted 2026-09-08)"
```

Append at the end of the file:

```toml
# --- outreach lineage (venue-grade B-roll reused across the Lithuanian decks) --

[[videos]]
name    = "mountain.mp4"
profile = "high-motion"
notes   = "Mountain aerial with edited audio, 3:07 — the Yaga 2026-07-18 opener. Raw is 4K30 H.264 207 Mbps + 24-bit PCM (4.9 GB); the web encode transcodes the PCM to AAC. Source: released/mountain.mov (outreach, promoted 2026-09-08)"
```

Also update the header comment line `The 34-entry library` → `The 43-entry library (34 from the 2026-09-03 D3 pass, 9 promoted from outreach_talks on 2026-09-08)`.

- [ ] **Step 4: Run tests**

Run: `cd ~/slidev-videos && python3 -m pytest tests -q`
Expected: all pass (36).

- [ ] **Step 5: Commit**

```bash
cd ~/slidev-videos && git add src/slidev_videos/shared.toml tests/test_shared_registry.py && git commit -m "feat(shared): promote 9 outreach clips into the library (43 entries)

lhcb_aciu (Lithuanian thanks), standard_model, beyond_cmb, mars_surface,
atoms, blue_ghost_lunar_orbit, saturn_v_launch_nasa, cmb_sonification_drone,
mountain. Registry test: unique snake_case names, valid profiles.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 2: Full local raw bank for the library (43 masters)

**Files:**
- Create: `~/slidev-videos/scripts/fetch-shared-raws.sh` (committed: it is the source map of the library)
- Output: `~/slidev-videos/videos/raw/<43 files>` (gitignored)

**Interfaces:**
- Consumes: the 43 names from Task 1.
- Produces: `videos/raw/<name>` for every library entry, which `slidev-videos encode` (Task 3) reads.

- [ ] **Step 1: Write the fetch script**

```bash
#!/usr/bin/env bash
# Populate videos/raw/ with a master for every shared.toml entry.
# Sources are the paths each entry's `notes` records. Idempotent: rclone
# skips size+modtime matches, gh skips existing files (--skip-existing).
# Usage: scripts/fetch-shared-raws.sh   (from the package repo root)
set -euo pipefail
RCLONE="${RCLONE:-$HOME/micromamba/envs/outreach_talks/bin/rclone}"
BASE="gdrive:work/outreach/resources/videos"
RAW="$(cd "$(dirname "$0")/.." && pwd)/videos/raw"
mkdir -p "$RAW"

# "<gdrive folder>/<source name>  <library name>"
MAP='
released/skylapse.mp4                               skylapse.mp4
released/drone_climbing_mountain.mp4                drone_climbing_mountain.mp4
released/nasa_mars_mariner_4_pan_audio.mp4          nasa_mars_mariner_4_pan_audio.mp4
released/webb_reel.mp4                              webb_reel.mp4
released/milky_way_sim_audio.mp4                    milky_way_sim_audio.mp4
released/qgp_formation.mp4                          qgp_formation.mp4
released/voyage_in_to_the_world_of_atoms.mp4        voyage_in_to_the_world_of_atoms.mp4
released/cloud_chamber_audio.mp4                    cloud_chamber_audio.mp4
released/cern_overview_short.mp4                    cern_overview_short.mp4
released/lhcb.mp4                                   lhcb.mp4
released/beyond_cmb.mp4                             beyond_cmb.mp4
released/mars_surface.mp4                           mars_surface.mp4
released/blue_ghost_lunar_orbit.mp4                 blue_ghost_lunar_orbit.mp4
released/saturn_v_launch_nasa.mp4                   saturn_v_launch_nasa.mp4
released/cmb_sonification_drone.mp4                 cmb_sonification_drone.mp4
released/expansion_funnel_h264_1080p.webm           expansion_funnel.webm
released/lhcb_aciu.mov                              lhcb_aciu.mp4
released/sm.mov                                     standard_model.mp4
released/atoms.mov                                  atoms.mp4
released/mountain.mov                               mountain.mp4
science/perseverence_rover_landing_nasa.mp4         perseverance_rover_landing_nasa.mp4
science/telescope.mp4                               telescope.mp4
cosmology/cassini_grand_finale_no_vo.mp4            cassini_grand_finale.mp4
cosmology/sdss_universe_zoom_trim_3.mp4             sdss_universe_zoom.mp4
cern/cern_footage_2015_006_001.mov                  cern_footage_2015_006_001.mp4
cern/cern_footage_2022_013_001_1080p_lhc.mp4        cern_footage_2022_013_001.mp4
cern/atlas_footage_2022_004_002_1080p_shaft.mp4     atlas_footage_2022_004_002.mp4
cern/atlas_video_2021_001_001_1080ph265.mp4         atlas_video_2021_001_001.mp4
cern/cms.mp4                                        cms.mp4
cern/cern_footage_2022_042_001.mov                  cern_footage_2022_042_001.mp4
cern/uploaded_cern_footage_2024_006_012.mp4         cern_footage_2024_006_012.mp4
cern/atlas_video_2023_013_001_1080p_event_display.mp4 atlas_video_2023_013_001.mp4
cern/cern_footage_2022_013_006_1080p_data_center.mp4  cern_footage_2022_013_006.mp4
cern/cern_footage_2025_048_001.mp4                  cern_footage_2025_048_001.mp4
cern/cern_footage_2025_049_001.mp4                  cern_footage_2025_049_001.mp4
cern/cern_video_2015_024_001_1080p.mp4              cern_video_2015_024_001.mp4
cern/cern_footage_2024_006_001.mp4                  cern_footage_2024_006_001.mp4
cern/cern_video_2025_029_001_1080p.mp4              cern_video_2025_029_001.mp4
cern/cern_video_2019_050_008_1080ph265.mp4          cern_video_2019_050_008.mp4
cern/cern_footage_2025_014_002.mp4                  cern_footage_2025_014_002.mp4
cern/cern_footage_2024_010_002.mp4                  cern_footage_2024_010_002.mp4
'
while read -r src dst; do
  [[ -z "${src:-}" ]] && continue
  echo "== $dst  <-  $src"
  "$RCLONE" copyto "$BASE/$src" "$RAW/$dst" --progress
done <<< "$MAP"

# Two clips have no Drive original; the course's archived release copy is the raw.
COURSE=MindaugasSarpis/CERN_lessons_on_data_analysis
for pair in "Stars_Pan_Audio.mp4 stars_pan_audio.mp4" "Hubble.mp4 hubble.mp4"; do
  set -- $pair
  if [[ ! -f "$RAW/$2" ]]; then
    echo "== $2  <-  course release videos/$1"
    gh release download videos -R "$COURSE" -p "$1" -O "$RAW/$2"
  fi
done

echo; echo "raw bank: $(ls "$RAW" | wc -l) files, $(du -sh "$RAW" | cut -f1)"
```

- [ ] **Step 2: Run it (long: ~15 GB)**

Run: `cd ~/slidev-videos && chmod +x scripts/fetch-shared-raws.sh && scripts/fetch-shared-raws.sh 2>&1 | tail -5`
Expected last line: `raw bank: 43 files, ~15G`.

- [ ] **Step 3: Verify every library entry has a raw**

Run:
```bash
cd ~/slidev-videos && python3 - <<'EOF'
import tomllib, pathlib
names = {v["name"] for v in tomllib.load(open("src/slidev_videos/shared.toml","rb"))["videos"]}
have = {p.name for p in pathlib.Path("videos/raw").iterdir()}
print("missing:", sorted(names - have)); print("extra:", sorted(have - names))
EOF
```
Expected: `missing: []` and `extra: []`.

- [ ] **Step 4: Commit the script**

```bash
cd ~/slidev-videos && git add scripts/fetch-shared-raws.sh && git commit -m "chore(shared): fetch-shared-raws.sh — the library's raw source map, one command to a full local bank

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 3: Encode, preflight and publish the nine new library clips

**Files:**
- Output: `~/slidev-videos/public/videos/<9 files>` (gitignored); release `videos-shared` on `MindaugasSarpis/slidev-videos` gains 9 assets.

**Interfaces:**
- Consumes: raws from Task 2.
- Produces: the 9 names resolvable at `https://github.com/MindaugasSarpis/slidev-videos/releases/download/videos-shared/<name>`.

- [ ] **Step 1: Encode only the nine**

Run:
```bash
cd ~/slidev-videos && slidev-videos encode --only lhcb_aciu.mp4 standard_model.mp4 beyond_cmb.mp4 mars_surface.mp4 atoms.mp4 blue_ghost_lunar_orbit.mp4 saturn_v_launch_nasa.mp4 cmb_sonification_drone.mp4 mountain.mp4 2>&1 | tail -20
```
Expected: nine `ok` lines, no `FAILED`; `mountain.mp4` and `lhcb_aciu.mp4` take the longest (CPU libx264). Note: `mountain.mp4` may exceed `max_size_mb` 200 as a warning — accepted if ≤ 10 Mbps (preflight decides).

- [ ] **Step 2: Preflight the nine local files**

Run: `cd ~/slidev-videos && slidev-videos preflight --only lhcb_aciu.mp4 standard_model.mp4 beyond_cmb.mp4 mars_surface.mp4 atoms.mp4 blue_ghost_lunar_orbit.mp4 saturn_v_launch_nasa.mp4 cmb_sonification_drone.mp4 mountain.mp4 2>&1 | tail -15`
Expected: every line `OK` (h264, ≤1920, ≤10 Mbps, aac or no audio, loudness within ±2 LU). If one fails, re-encode it with `--force --only <name>` after adjusting its profile in shared.toml, and re-run.

- [ ] **Step 3: Publish and re-check**

Run:
```bash
cd ~/slidev-videos && slidev-videos publish --only lhcb_aciu.mp4 standard_model.mp4 beyond_cmb.mp4 mars_surface.mp4 atoms.mp4 blue_ghost_lunar_orbit.mp4 saturn_v_launch_nasa.mp4 cmb_sonification_drone.mp4 mountain.mp4 2>&1 | tail -12
gh release view videos-shared -R MindaugasSarpis/slidev-videos --json assets -q '.assets|length'
```
Expected: 9 uploads; asset count `43`.

- [ ] **Step 4: shared-check**

Run: `cd ~/slidev-videos && slidev-videos shared-check 2>&1 | tail -5`
Expected: no `BAD PROFILE`, release reachable (UNUSED SHARED lines are informational here: the package repo has no `talks/`).

---

### Task 4: Move `discover` into the package

**Files:**
- Create: `~/slidev-videos/src/slidev_videos/discover.py` (moved from `~/outreach_talks/scripts/discover_videos.py`)
- Create: `~/slidev-videos/tests/test_discover.py` (moved from `~/outreach_talks/tests/test_discover_videos.py`), `~/slidev-videos/tests/fixtures/*.json` (moved)
- Modify: `~/slidev-videos/src/slidev_videos/pipeline.py` (`main()`), `~/slidev-videos/README.md` (Day to day)

**Interfaces:**
- Produces: `slidev-videos discover <keywords> [--source ...] [--limit N] [--json]` with the exact behaviour of the old script (`discover.main(argv: list[str] | None) -> int`).

- [ ] **Step 1: Move the files (git-tracked move across repos = copy + later delete in Task 9)**

```bash
cp ~/outreach_talks/scripts/discover_videos.py ~/slidev-videos/src/slidev_videos/discover.py
cp ~/outreach_talks/tests/test_discover_videos.py ~/slidev-videos/tests/test_discover.py
mkdir -p ~/slidev-videos/tests/fixtures && cp ~/outreach_talks/tests/fixtures/*.json ~/slidev-videos/tests/fixtures/
```

- [ ] **Step 2: Repoint the test import**

In `~/slidev-videos/tests/test_discover.py` replace the two lines

```python
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

import discover_videos as dv
```
with
```python
from slidev_videos import discover as dv
```
and change the module docstring's first line to `"""Tests for slidev_videos.discover (offline; fixtures under tests/fixtures/).`

- [ ] **Step 3: Run the moved tests to see they pass unchanged**

Run: `cd ~/slidev-videos && python3 -m pytest tests/test_discover.py -q`
Expected: all pass (same count as `cd ~/outreach_talks && python3 -m pytest tests -q` reports before deletion).

- [ ] **Step 4: Wire the subcommand**

In `~/slidev-videos/src/slidev_videos/pipeline.py`, `main()`, immediately after `parser = argparse.ArgumentParser(...)` and before `sub = parser.add_subparsers(...)` add:

```python
    # `discover` is a self-contained archive search (CDS/NASA/ESO/Commons);
    # it needs no project, so it bypasses videos.toml discovery entirely.
    raw_argv = list(sys.argv[1:] if argv is None else argv)
    if raw_argv[:1] == ["discover"]:
        from . import discover
        return discover.main(raw_argv[1:])
```

and add a help-only stub so it shows in `--help`:

```python
    sub.add_parser("discover", help="search open archives (CDS/NASA/ESO/Hubble/Webb/NOIRLab/Commons) for clips; prints [[videos]] snippets")
```

In `discover.py` change `prog="videos:discover"` to `prog="slidev-videos discover"` and the epilog example to `'Example: slidev-videos discover "cloud chamber" --limit 3'`.

- [ ] **Step 5: Write a test for the wiring**

Append to `~/slidev-videos/tests/test_discover.py`:

```python
class TestCliWiring(unittest.TestCase):
    def test_pipeline_main_routes_discover_without_project(self):
        from slidev_videos import pipeline
        with mock.patch("slidev_videos.discover.main", return_value=7) as m:
            self.assertEqual(pipeline.main(["discover", "cloud", "--limit", "1"]), 7)
        m.assert_called_once_with(["cloud", "--limit", "1"])
```

Run: `cd ~/slidev-videos && python3 -m pytest tests -q`
Expected: all pass. Also `slidev-videos --help | grep discover` prints the stub line, and `cd /tmp && slidev-videos discover --help` works without a `videos.toml`.

- [ ] **Step 6: README "Day to day" line + commit**

Add to the README `## Day to day` block: `    slidev-videos discover "cloud chamber" lhc --source cds,nasa   # find new clips; prints [[videos]] snippets`.

```bash
cd ~/slidev-videos && git add -A src tests README.md && git commit -m "feat(cli): discover subcommand — archive search moved from outreach_talks (tests + fixtures with it)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 4b: Addon player — overview placeholder + working production look-ahead

**Files:**
- Modify: `~/slidev-videos/components/VideoPlayer.vue`, `~/slidev-videos/scripts/smoke-example.mjs`, `~/slidev-videos/README.md`

**Interfaces:**
- Produces: a `VideoPlayer` that renders `<div class="video-placeholder">` (no `<video>`) whenever Slidev's `$renderContext` is not `slide`/`presenter` (overview grid, next-slide preview, print), and that attaches the `<source>` of the next 3 slides' clips early in production as well as dev.

- [ ] **Step 1: Placeholder outside the live views (ported from the course player)**

In `VideoPlayer.vue` change
```js
const { $page } = useSlideContext()
```
to
```js
const { $page, $renderContext } = useSlideContext()
// Only the real slide (and the presenter's main view) gets a <video>. The
// overview / next-slide preview render a static placeholder instead: the
// overview mounts every slide at once, so a video-heavy deck would put ~30
// media elements on the machine, and its copy of the CURRENT slide is
// "active" too, so it re-downloaded the clip being watched.
const isLive = computed(() => $renderContext.value === 'slide' || $renderContext.value === 'presenter')
```
(`useSlideContext` is called once at that spot; if the file already destructures it earlier, merge into the existing call.)

In the template, wrap everything inside the root `div.video-player`:
```html
    <div v-if="!isLive" class="video-placeholder">
      <svg class="video-placeholder-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor" /></svg>
      <span class="video-status">{{ src }}</span>
    </div>
    <template v-else>
      …existing status divs, <video>, and the volume-badge Transition, unchanged…
    </template>
```
Append to `<style scoped>`:
```css
.video-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: white;
}
.video-placeholder .video-status {
  position: static;
  padding: 0;
}
.video-placeholder-icon {
  width: 4rem;
  height: 4rem;
  opacity: 0.6;
}
```

- [ ] **Step 2: Production look-ahead — attach the source, drop `<link rel=preload>`**

Replace the block from the comment `// Look-ahead preload for upcoming slides' videos:` down to `onUnmounted(removePreload)` (inclusive) with:

```js
// Look-ahead preload for the next PRELOAD_AHEAD slides' videos: attach the
// <source> early and let the element buffer (preload="auto"), in dev AND in
// production. Production used to warm the browser cache with
// <link rel="preload" as="video"> instead — Chrome rejects that `as` value
// ("<link rel=preload> uses an unsupported `as` value") and fetches nothing,
// so deployed decks started every clip cold (found on the deployed World of
// Particles deck, 2026-09-07). Placeholder instances (overview) have no
// <video>, so the warm is a no-op there.
const PRELOAD_AHEAD = 3
const { currentPage } = useNav()

const isUpcoming = computed(() => {
  const here = $page?.value
  const now = currentPage?.value
  if (!here || !now) return false
  const distance = here - now
  return distance > 0 && distance <= PRELOAD_AHEAD
})

watch(isUpcoming, (warm) => {
  if (!warm || warmed.value || hasBeenActive.value || !isLive.value) return
  warmed.value = true
  status.value = 'loading'
  nextTick(() => videoRef.value?.load())
}, { immediate: true })
```
(`const { $page, $renderContext } = useSlideContext()` from Step 1 must sit above this block.)

- [ ] **Step 3: Smoke assertions**

In `scripts/smoke-example.mjs`:

a) Replace the two lines
```js
const preloads = await page.evaluate(() => [...document.querySelectorAll('link[rel="preload"][as="video"]')].map(l => l.href))
check('no shared-release preload when shared: false', !preloads.some(u => u.includes('slidev-videos')), preloads.join(','))
```
with
```js
const links = await page.evaluate(() => document.querySelectorAll('link[rel="preload"][as="video"]').length)
check('no <link rel=preload as=video> (Chrome rejects it)', links === 0, `links=${links}`)
```

b) Immediately after `await page.goto(\`http://localhost:${port}/\`, { waitUntil: 'load' })` (slide 1, before `await goto(2)`), add:
```js
// PROD look-ahead: slide 2 is within 3 slides of slide 1, so its clip must be
// requested while slide 1 is still up.
for (let i = 0; i < 100 && !mediaRequests.includes(expected); i++) await new Promise((r) => setTimeout(r, 100))
check('prod look-ahead requests the next clip before its slide is active', mediaRequests.includes(expected), mediaRequests.join(','))
```

c) Before `// --- Slidev navigation keys are untouched` add:
```js
// --- overview grid renders placeholders, not <video> elements --------------
await press('o')
await page.waitForFunction(() => document.querySelectorAll('.video-placeholder').length >= 2, null, { timeout: 10000 }).catch(() => {})
const ov = await page.evaluate(() => ({ ph: document.querySelectorAll('.video-placeholder').length, vids: document.querySelectorAll('video').length }))
check('overview shows placeholders instead of videos', ov.ph >= 2 && ov.vids <= 1, `placeholders=${ov.ph} videos=${ov.vids}`)
await press('Escape')
await page.waitForFunction(() => document.querySelectorAll('.video-placeholder').length === 0, null, { timeout: 10000 }).catch(() => {})
```

Run: `cd ~/slidev-videos && pnpm build:example >/dev/null && pnpm smoke`
Expected: `SMOKE PASS` including the three new checks.

- [ ] **Step 4: README**

In `## The player`, after the **Playback** paragraph add:
`**Overview and previews.** In Slidev's overview grid (\`o\`) and the presenter's next-slide preview the player renders a static placeholder, not a \`<video>\`: the overview mounts every slide at once, and its copy of the current slide would otherwise re-download the clip being watched.`
Also change "The three slides ahead are preloaded." to "The three slides ahead are preloaded (the \`<source>\` is attached early, in dev and production alike)."

- [ ] **Step 5: Commit**

```bash
cd ~/slidev-videos && git add components/VideoPlayer.vue scripts/smoke-example.mjs README.md && git commit -m "feat(player): overview/preview placeholder instead of <video>; production look-ahead attaches the source (drop <link rel=preload as=video>)

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 5: README rename table, version 0.3.0, tag, push

**Files:**
- Modify: `~/slidev-videos/README.md`, `~/slidev-videos/pyproject.toml`, `~/slidev-videos/package.json`

- [ ] **Step 1: README**

Replace both `v0.2.0` in `## Install` with `v0.3.0`. After the `## videos.toml (project root)` section's manifest example add:

```markdown
## The shared library

`src/slidev_videos/shared.toml` lists 43 clips served from this repo's
`videos-shared` release. Consumers reference them by name; `check` reports
them as inherited. `scripts/fetch-shared-raws.sh` rebuilds the local raw
bank (`videos/raw/`, ~15 GB) from the Drive masters.

Names changed when the outreach decks moved onto the library (2026-09-08):

| old name (outreach decks) | library name |
|---|---|
| cern_video_2019_050_008_1080ph265.mp4 | cern_video_2019_050_008.mp4 |
| cassini.mov | cassini_grand_finale.mp4 (90 s trim) |
| perseverence_rover_landing_nasa.mp4 | perseverance_rover_landing_nasa.mp4 (1:40–3:10 trim) |
| cern_footage_2022_013_001_1080p_lhc.mp4 | cern_footage_2022_013_001.mp4 (90 s trim) |
| drone_climbing_mountain_2.mp4 | drone_climbing_mountain.mp4 |
| expansion_funnel_h264_1080p.webm | expansion_funnel.webm |
| lhcb_aciu.mov | lhcb_aciu.mp4 |
| sm.mov | standard_model.mp4 |
| atoms.mov | atoms.mp4 |
| mountain.mov | mountain.mp4 |
```

- [ ] **Step 2: Bump versions**

`pyproject.toml`: `version = "0.3.0"`. `package.json`: `"version": "0.3.0"`.

- [ ] **Step 3: Full test run, commit, tag, push**

```bash
cd ~/slidev-videos && python3 -m pytest tests -q && git add -A && git commit -m "chore: v0.3.0 — 43-clip library, discover subcommand, outreach rename table

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4" && git tag v0.3.0 && git push origin main --tags
```
Expected: push succeeds; `gh run list -R MindaugasSarpis/slidev-videos -L 1` shows CI starting.

---

## Part B — outreach repo (`~/outreach_talks`)

### Task 6: `videos.toml` files and rewritten manifests

**Files:**
- Create: `videos.toml` (root), `talks/<each of 5>/videos.toml`
- Modify: `talks/<each of 5>/videos/manifest.toml`
- Delete: `outreach.toml`

**Interfaces:**
- Produces: project discovery for `slidev-videos` from inside any talk dir; `release_tag` per talk (`videos-2026-04-28-editai`, `videos-2026-05-11-sceptics`, `videos-2026-07-18-yaga`, `videos-2026-09-10-worldofparticles`, `videos-2026-09-00-startertalk`).

- [ ] **Step 1: Root `videos.toml`**

```toml
# Monorepo defaults for slidev-videos (https://github.com/MindaugasSarpis/slidev-videos).
# Each talk has its own videos.toml; this file supplies the [defaults] they
# inherit. Merge order (wins top-down): per-video > talk manifest [defaults]
# > talk videos.toml [defaults] > this file > package built-ins.

[defaults]
repo             = "MindaugasSarpis/cern_outreach_talks"
source_remote    = "gdrive:work/outreach/resources/videos/released"  # ALL lowercase
web_long_edge_px = 1920   # 1080p-class H.264 web tier plays at venues (policy since 2026-07-18)
long_edge_px     = 1920   # HQ tier is opt-in only; keep it at the web width
max_size_mb      = 200    # warn if an encoded web file exceeds this
# shared: defaults to MindaugasSarpis/slidev-videos@videos-shared — the
# package's clip library. Decks reference library clips by name only.
```

- [ ] **Step 2: Per-talk `videos.toml` (one per talk; only `release_tag` differs)**

```toml
# slidev-videos project marker for this talk. Running `slidev-videos` (or
# `pnpm videos:*`) from inside this directory selects the talk as the
# project; ../../videos.toml supplies the shared [defaults].

[project]
raw_dir = "../../videos/raw"   # repo-level raw bank: one copy per machine, every talk

[defaults]
release_tag = "videos-2026-04-28-editai"
```

Write it to each talk with its slug: `videos-2026-04-28-editai`, `videos-2026-05-11-sceptics`, `videos-2026-07-18-yaga`, `videos-2026-09-10-worldofparticles`, `videos-2026-09-00-startertalk`.

- [ ] **Step 3: Manifests**

`talks/2026_04_28_editAI/videos/manifest.toml`:

```toml
# Talk-OWNED clips for the editAI talk: the crash-course chart renders and
# the Mokslo Sala venue clip. Everything else the deck references is a
# slidev-videos library clip (inherited by name; never listed here).
# Profiles: remux | standard | standard-tight | silent-loop | high-motion
# (see the slidev-videos README).

[defaults]
# release_tag comes from videos.toml (videos-2026-04-28-editai).

[[videos]]
name    = "cmb_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "CMB data chart render (matplotlib, 1800x1000 9:5)"

[[videos]]
name    = "cmb_fit.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "CMB fit chart render"

[[videos]]
name    = "cmb_power_spectrum_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "CMB power-spectrum data variant"

[[videos]]
name    = "cmb_power_spectrum_fit.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "CMB power-spectrum fit variant"

[[videos]]
name    = "g2_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "g-2 data chart render"

[[videos]]
name    = "g2_fit.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "g-2 fit chart render"

[[videos]]
name    = "gaussian.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Gaussian fit demo render"

[[videos]]
name    = "gaussian_highstats.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Gaussian fit demo render (high statistics)"

[[videos]]
name    = "higgs_bkg.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Higgs background-only chart render"

[[videos]]
name    = "higgs_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Higgs data chart render"

[[videos]]
name    = "higgs_sigbkg.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Higgs signal+background chart render"

[[videos]]
name    = "z_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Z-boson data chart render"

[[videos]]
name    = "z_fit3.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Z-boson fit chart render"

[[videos]]
name    = "z_alternatives.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Z-boson alternative-models chart render"

[[videos]]
name    = "mokslo_sala.mov"
profile = "high-motion"
used_in = ["deck"]
notes   = "Mokslo Sala venue intro, 2880x1600 (raw 153 Mbps HEVC, 5.1 GB). Web copy scaled to 1920 H.264 on 2026-09-08 (was an HEVC archive encode)."
```

`talks/2026_05_11_Sceptics/videos/manifest.toml`:

```toml
# Talk-OWNED clips for the Sceptics talk. The CERN footage the deck uses is
# slidev-videos library material (inherited by name; never listed here).

[defaults]
# release_tag comes from videos.toml (videos-2026-05-11-sceptics).

[[videos]]
name    = "g2_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Muon g-2 measured-vs-theory chart (1800x1000; letterboxes on 16:9)."

[[videos]]
name    = "g2_fit.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Muon g-2 fit chart (1800x1000; letterboxes on 16:9)."
```

`talks/2026_07_18_Yaga/videos/manifest.toml`:

```toml
# Talk-OWNED clips for the Yaga talk (delivered 2026-07-18). Everything else
# is slidev-videos library material. lt_zoom.mov stays as published (4K web
# copy on the talk release) — the talk is an archive.

[defaults]
# release_tag comes from videos.toml (videos-2026-07-18-yaga).

[[videos]]
name    = "lt_zoom.mov"
profile = "high-motion"
used_in = ["deck"]
notes   = "Lithuanian-labelled cosmic zoom rendered in Resolve, 6:29. Release copy is the 2026-07 4K web encode; not re-encoded (archived talk)."
```

`talks/2026_09_10_WorldOfParticles/videos/manifest.toml`:

```toml
# Talk-OWNED clips for World of Particles (2026-09-10): only the opener.
# The rest of the reel is slidev-videos library material (inherited by name).
#
# After the talk: `pnpm videos:publish -- --prune` drops the six superseded
# Yaga-lineage copies from this release (they now live in the library).

[defaults]
max_size_mb = 300   # vu_ff_zoom: 4:42 of 1080p CG at the high-motion ceiling lands near 260 MB

[[videos]]
name    = "vu_ff_zoom.mp4"
profile = "high-motion"
used_in = ["deck"]
notes   = """\
Opener: cosmic zoom-out from the VU Faculty of Physics building (Google Earth) \
through Vilnius, Earth, the Milky Way and the galaxies to the cosmic web, 4:42 \
with its own audio track. Raw is a 4K60 H.264 254 Mbps Resolve master (9.0 GB) \
on gdrive as vu_ff_zoom.mp4."""
```

`talks/2026_09_00_Startertalk/videos/manifest.toml`: keep the file, replace its content with:

```toml
# Talk-OWNED clips for the Startertalk. None yet: the three clips the deck
# uses are slidev-videos library material (inherited by name).

[defaults]
# release_tag comes from videos.toml (videos-2026-09-00-startertalk).

# [[videos]]
# name    = "example_clip.mp4"
# profile = "standard"
# used_in = ["deck"]
# notes   = "What this clip is and where it came from."
```

- [ ] **Step 4: Delete `outreach.toml`, sanity-run**

```bash
cd ~/outreach_talks && git rm -q outreach.toml
for t in talks/*/; do (cd "$t" && echo "== $t" && slidev-videos check 2>&1 | tail -4); done
```
Expected: the CLI now finds a project in every talk. `check` still reports UNKNOWN REF for the not-yet-renamed deck names (fixed in Tasks 8 and 10) — that is expected at this step; no `error: no videos.toml`.

- [ ] **Step 5: Commit**

```bash
cd ~/outreach_talks && git add -A videos.toml talks/*/videos.toml talks/*/videos/manifest.toml outreach.toml && git commit -m "feat(videos): slidev-videos project config — root + per-talk videos.toml; manifests list owned clips only

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 7: Addon dependency, scripts, headmatter; drop `.env`

**Files:**
- Modify: `talks/*/package.json`, `talks/*/deck.md` (headmatter only), `package.json` (root), `pnpm-lock.yaml`
- Delete: `talks/*/.env`

**Interfaces:**
- Produces: `VideoPlayer` auto-imported from `slidev-addon-videos`; per-deck `videos:` headmatter (`repo`, `release`, `fit`).

- [ ] **Step 1: Per-talk `package.json` scripts + devDependency**

Run this once (it rewrites the five files deterministically):

```bash
cd ~/outreach_talks && python3 - <<'EOF'
import json, pathlib
SCRIPTS = {
  "dev": "slidev deck.md",
  "build": "slidev build deck.md",
  "build:portable": "slidev build deck.md --base ./ --out dist-portable",
  "export": "slidev export deck.md",
  "videos:sync": "slidev-videos sync",
  "videos:encode": "slidev-videos encode",
  "videos:publish": "slidev-videos publish",
  "videos:pull": "slidev-videos pull",
  "videos:check": "slidev-videos check",
  "videos:clean": "slidev-videos clean",
  "videos:preflight": "slidev-videos preflight",
  "venue": "slidev-videos venue",
}
for p in sorted(pathlib.Path("talks").glob("*/package.json")):
    d = json.loads(p.read_text())
    d["scripts"] = SCRIPTS
    d["devDependencies"] = {"slidev-addon-videos": "github:MindaugasSarpis/slidev-videos#v0.3.0"}
    p.write_text(json.dumps(d, indent=2, ensure_ascii=False) + "\n")
    print("rewrote", p)
EOF
```

- [ ] **Step 2: Root `package.json`**

```json
{
  "name": "outreach-talks",
  "private": true,
  "description": "Monorepo of CERN outreach talks (Slidev decks + shared theme; videos via slidev-videos)",
  "scripts": {
    "videos:check-all": "for d in talks/*; do echo \"[$d]\"; (cd \"$d\" && slidev-videos check) || true; done",
    "new-talk": "python3 scripts/new_talk.py"
  },
  "dependencies": {
    "@fontsource/space-grotesk": "^5.2.10",
    "three": "^0.185.1"
  }
}
```

- [ ] **Step 3: Headmatter in the four existing decks (WoP is rewritten in Task 10)**

Insert after the `aspectRatio:` line of each deck's first frontmatter block:

editAI (`talks/2026_04_28_editAI/deck.md`):
```yaml
addons:
  - slidev-addon-videos
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-04-28-editai
  fit: contain
```
Sceptics: same with `release: videos-2026-05-11-sceptics`. Yaga: `release: videos-2026-07-18-yaga`. Startertalk: `release: videos-2026-09-00-startertalk`.

Also remove `canvasWidth: 2880` from the editAI headmatter? **No** — leave it; it is unrelated to this migration.

- [ ] **Step 4: Delete `.env` files, install, verify the addon links**

```bash
cd ~/outreach_talks && git rm -q talks/*/.env && pnpm install 2>&1 | tail -3
ls -la talks/2026_09_10_WorldOfParticles/node_modules/slidev-addon-videos/components/VideoPlayer.vue
grep -c 'slidev-videos' pnpm-lock.yaml
```
Expected: `VideoPlayer.vue` exists under every talk's `node_modules/slidev-addon-videos/components/`; lockfile references the git dependency (count ≥ 1).

- [ ] **Step 5: Commit**

```bash
cd ~/outreach_talks && git add -A package.json pnpm-lock.yaml talks/*/package.json talks/*/deck.md talks/*/.env && git commit -m "feat(videos): slidev-addon-videos in every talk; videos:* scripts call slidev-videos; .env replaced by headmatter

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 8: Rename deck references to library names (editAI, Sceptics, Yaga, Startertalk)

**Files:**
- Modify: `talks/2026_04_28_editAI/deck.md`, `talks/2026_05_11_Sceptics/deck.md`, `talks/2026_07_18_Yaga/deck.md` (Startertalk uses one renamed clip: `cern_video_2019_050_008_1080ph265.mp4`)

- [ ] **Step 1: Apply the rename table with exact `src="…"` matches**

```bash
cd ~/outreach_talks && for f in talks/2026_04_28_editAI/deck.md talks/2026_05_11_Sceptics/deck.md talks/2026_07_18_Yaga/deck.md talks/2026_09_00_Startertalk/deck.md; do
  sed -i \
    -e 's|src="cern_video_2019_050_008_1080ph265.mp4"|src="cern_video_2019_050_008.mp4"|g' \
    -e 's|src="cassini.mov"|src="cassini_grand_finale.mp4"|g' \
    -e 's|src="perseverence_rover_landing_nasa.mp4"|src="perseverance_rover_landing_nasa.mp4"|g' \
    -e 's|src="cern_footage_2022_013_001_1080p_lhc.mp4"|src="cern_footage_2022_013_001.mp4"|g' \
    -e 's|src="drone_climbing_mountain_2.mp4"|src="drone_climbing_mountain.mp4"|g' \
    -e 's|src="expansion_funnel_h264_1080p.webm"|src="expansion_funnel.webm"|g' \
    -e 's|src="lhcb_aciu.mov"|src="lhcb_aciu.mp4"|g' \
    -e 's|src="sm.mov"|src="standard_model.mp4"|g' \
    -e 's|src="atoms.mov"|src="atoms.mp4"|g' \
    -e 's|src="mountain.mov"|src="mountain.mp4"|g' \
    "$f"; done
git diff --stat
```
Expected: 4 files changed (editAI ~9 lines, Sceptics ~3, Yaga ~8, Startertalk 1).

- [ ] **Step 2: Gate with `check`**

```bash
cd ~/outreach_talks && for t in 2026_04_28_editAI 2026_05_11_Sceptics 2026_07_18_Yaga 2026_09_00_Startertalk; do (cd talks/$t && echo "== $t" && slidev-videos check 2>&1 | grep -E 'UNKNOWN|MISSING|inherited|OK|error' | head -8); done
```
Expected: no `UNKNOWN REF` in any talk. editAI reports its 15 owned entries as on-release-not-local (INFO) or, for `mokslo_sala.mov`, missing-until-Task-12 — acceptable at this step; note it.

- [ ] **Step 3: Commit**

```bash
cd ~/outreach_talks && git add talks/*/deck.md && git commit -m "refactor(decks): reference clips by slidev-videos library names

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 9: Remove the local pipeline, player, registry, tests; scaffolder rewrite; env/gitignore

**Files:**
- Delete: `scripts/videos.py`, `scripts/tests/`, `scripts/discover_videos.py`, `scripts/new-talk.sh`, `tests/`, `components/VideoPlayer.vue`, `videos/shared.toml`, `talks/*/public/videos-hq` (symlinks), `talks/*/videos/hq/`, `talks/*/videos/raw/` (empty local dirs)
- Modify: `scripts/new_talk.py`, `.gitignore`, `env.yaml`

- [ ] **Step 1: Delete**

```bash
cd ~/outreach_talks && git rm -rq scripts/videos.py scripts/tests scripts/discover_videos.py scripts/new-talk.sh tests components/VideoPlayer.vue videos/shared.toml
rm -f talks/*/public/videos-hq; rm -rf talks/*/videos/hq talks/*/videos/raw scripts/__pycache__
grep -rn 'videos.py\|shared.toml\|outreach.toml\|VITE_VIDEO' --exclude-dir=node_modules --exclude-dir=docs --exclude-dir=.git . | grep -v pnpm-lock || echo "no stale references"
```
Expected: the grep prints only hits in `README.md` / `CLAUDE.md` (rewritten in Task 13) — nothing in code or config.

- [ ] **Step 2: `.gitignore`**

Remove the lines `**/public/videos-hq` and `**/videos/hq/`. Keep `**/public/videos/`, `**/videos/raw/`, dist lines and the stray-master safety net.

- [ ] **Step 3: `env.yaml`**

Replace the dependency list with:

```yaml
dependencies:
  - python>=3.11   # tomllib requires 3.11+
  - pip
  - ffmpeg         # encode / remux (NVENC build on this machine)
  - rclone         # videos:sync from gdrive
  - gh             # GitHub Releases
  - nodejs>=20     # runtime for slidev
  - pnpm           # package manager; installs @slidev/cli per-project
  - numpy          # orbital rendering / Manim deps
  - scipy          # spherical harmonics for orbital animation
  - matplotlib     # 3D plotting for orbital animation
  - pip:
      - "slidev-videos @ git+https://github.com/MindaugasSarpis/slidev-videos@v0.3.0"
```
and update the header comment's third line to `#   pnpm install                      # installs all talks' deps (incl. slidev-addon-videos)`.

- [ ] **Step 4: Rewrite `scripts/new_talk.py`**

```python
#!/usr/bin/env python3
"""Scaffold a new talk under talks/<YYYY_MM_DD_Name>/ on the slidev-videos workflow.

Bakes in the standing policy (since 2026-07-18): 1080p H.264 web tier with
loudness normalization, 16:9, library clips inherited by name, no HQ tier.

Usage (from the repo root):
    pnpm new-talk 2026_09_15_SomeVenue [--title "Talk title"] [--aspect 16/9]
    pnpm install        # afterwards, to register the workspace + addon
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
NAME_RE = re.compile(r"^\d{4}_\d{2}_\d{2}_\w+$")
ADDON_SPEC = "github:MindaugasSarpis/slidev-videos#v0.3.0"
REPO = "MindaugasSarpis/cern_outreach_talks"

PNPM_SCRIPTS = {
    "dev": "slidev deck.md",
    "build": "slidev build deck.md",
    "build:portable": "slidev build deck.md --base ./ --out dist-portable",
    "export": "slidev export deck.md",
    "videos:sync": "slidev-videos sync",
    "videos:encode": "slidev-videos encode",
    "videos:publish": "slidev-videos publish",
    "videos:pull": "slidev-videos pull",
    "videos:check": "slidev-videos check",
    "videos:clean": "slidev-videos clean",
    "videos:preflight": "slidev-videos preflight",
    "venue": "slidev-videos venue",
}

VIDEOS_TOML = """\
# slidev-videos project marker for this talk. Running `slidev-videos` (or
# `pnpm videos:*`) from inside this directory selects the talk as the
# project; ../../videos.toml supplies the shared [defaults].

[project]
raw_dir = "../../videos/raw"   # repo-level raw bank: one copy per machine, every talk

[defaults]
release_tag = "videos-{slug}"
"""

MANIFEST = """\
# Talk-OWNED clips only. Clips from the slidev-videos library
# (https://github.com/MindaugasSarpis/slidev-videos, src/slidev_videos/shared.toml)
# are inherited by name — reference them in the deck, never list them here.
#
# POLICY (since 2026-07-18): venues play the 1080p H.264 web tier, loudness
# -16 LUFS. No HQ tier. Run `pnpm videos:preflight` before the talk.
# Profiles: remux | standard | standard-tight | silent-loop | high-motion

[defaults]
# release_tag comes from videos.toml (videos-{slug}).

# [[videos]]
# name    = "example_clip.mp4"
# profile = "standard"
# used_in = ["deck"]
# notes   = "What this clip is and where it came from."
"""

DECK = """\
---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: {aspect}
addons:
  - slidev-addon-videos
videos:
  repo: {repo}
  release: videos-{slug}
  fit: contain
title: {title}
---

# {title}

First slide.

---
layout: section
hideInToc: true
---

# Section

---

<!-- a library clip, inherited by name -->
<VideoPlayer src="cern_overview_short.mp4" />
"""


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("name", help="talk directory name, e.g. 2026_09_15_SomeVenue")
    parser.add_argument("--title", default=None, help="deck title (default: derived from name)")
    parser.add_argument("--aspect", default="16/9", help="slide aspect ratio (default 16/9)")
    args_list = list(sys.argv[1:] if argv is None else argv)
    if args_list[:1] == ["--"]:  # pnpm forwards the -- delimiter verbatim
        del args_list[0]
    args = parser.parse_args(args_list)

    if not NAME_RE.match(args.name):
        print(f"error: {args.name!r} doesn't match YYYY_MM_DD_Name", file=sys.stderr)
        return 2
    talk = ROOT / "talks" / args.name
    if talk.exists():
        print(f"error: {talk} already exists", file=sys.stderr)
        return 2

    title = args.title or args.name[11:].replace("_", " ")
    slug = args.name.lower().replace("_", "-")

    for d in ("public/figures", "public/videos", "videos"):
        (talk / d).mkdir(parents=True)
    (talk / "components").symlink_to("../../components", target_is_directory=True)

    (talk / "package.json").write_text(json.dumps({
        "name": f"talk-{slug}",
        "private": True,
        "description": f"{title} ({args.name[:10]})",
        "scripts": PNPM_SCRIPTS,
        "dependencies": {"@slidev/cli": "^52.14.2"},
        "devDependencies": {"slidev-addon-videos": ADDON_SPEC},
    }, indent=2, ensure_ascii=False) + "\n")
    (talk / "videos.toml").write_text(VIDEOS_TOML.format(slug=slug))
    (talk / "videos" / "manifest.toml").write_text(MANIFEST.format(slug=slug))
    (talk / "deck.md").write_text(DECK.format(title=title, aspect=args.aspect, slug=slug, repo=REPO))

    print(f"Scaffolded {talk.relative_to(ROOT)}/")
    print("Next steps:")
    print("  pnpm install                # register the workspace + addon")
    print(f"  cd talks/{args.name} && pnpm dev")
    print("  # own clips: [[videos]] in videos/manifest.toml, raw in ../../videos/raw/, then")
    print("  #   pnpm videos:encode && pnpm videos:publish")
    print("  # before the talk: pnpm videos:check && pnpm videos:preflight && pnpm venue")
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 5: Smoke the scaffolder in a scratch copy, then discard**

```bash
cd ~/outreach_talks && python3 scripts/new_talk.py 2099_01_01_Scratch --title "Scratch" && cat talks/2099_01_01_Scratch/videos.toml && (cd talks/2099_01_01_Scratch && slidev-videos check | tail -3); rm -rf talks/2099_01_01_Scratch
```
Expected: `videos.toml` has `release_tag = "videos-2099-01-01-scratch"`; `check` finds the project and reports `cern_overview_short.mp4` inherited.

- [ ] **Step 6: Commit**

```bash
cd ~/outreach_talks && git add -A && git commit -m "refactor: drop the in-repo video pipeline, player and registry — slidev-videos owns them

Removes scripts/videos.py, discover_videos.py (moved to the package),
VideoPlayer.vue, videos/shared.toml, HQ symlinks; new_talk.py scaffolds the
slidev-videos layout; env.yaml installs the CLI from the v0.3.0 tag.

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 10: World of Particles deck — video-only reel

**Files:**
- Modify: `talks/2026_09_10_WorldOfParticles/deck.md` (full rewrite)

**Interfaces:**
- Consumes: library names (Tasks 1, 3), `vu_ff_zoom.mp4` on the talk release, `ParticleHero` component.

- [ ] **Step 1: Write the deck**

```markdown
---
theme: ../../theme
colorSchema: dark
transition: fade
routerMode: hash
aspectRatio: 16/9
addons:
  - slidev-addon-videos
videos:
  repo: MindaugasSarpis/cern_outreach_talks
  release: videos-2026-09-10-worldofparticles
  fit: cover
title: World of Particles
info: |
  World of Particles — opening lecture of the open course, 2026-09-10.
  A video-only reel modelled on lecture 1 of "Best Research and Data
  Analysis Practices from CERN": a landing slide, then three acts —
  from the cosmos, to the quantum, inside CERN. Every clip except the
  opener is a slidev-videos library clip; the venue plays the 1080p
  H.264 web tier. Keys on a video slide: p play/pause, + / - volume.
# Slidev defaults slide 1 to the cover layout, which traps a full-bleed
# component in its bottom content strip — force the plain layout.
layout: default
---

<!-- Landing — the CERN-lessons hero (live particle sphere, "proton being
     probed"). Full-bleed, no h1. While this slide is up the player's
     look-ahead buffers the opener and the two clips after it. -->
<ParticleHero
  kicker="Dr. Mindaugas Šarpis"
  title="World of|Particles"
  sub="Opening lecture of the open course · VU Faculty of Physics|10 September 2026"
  corner-tr="Autumn 2026"
  corner-br="Lecture 1"
/>

<!--
Speaker: welcome, one sentence on what the course is, then dim the lights
and advance. The reel runs without talk-over; pick it up between acts.
Act I — from the cosmos (15 clips, ~17 min) · Act II — to the quantum
(4 clips, ~3 min) · Act III — inside CERN (13 clips, ~11 min).
-->

---

<!-- Act I · opener: zoom-out from the VU Faculty of Physics roof through
     Vilnius, Earth, the Milky Way and the galaxies to the cosmic web (4:42,
     own audio). Talk-owned; the only clip not from the library. -->
<VideoPlayer src="vu_ff_zoom.mp4" />

---

<!-- Act I · leaving Earth: Saturn V launch, NASA archival, with sound (2:55) -->
<VideoPlayer src="saturn_v_launch_nasa.mp4" />

---

<!-- Act I · the Moon: Firefly Blue Ghost in lunar orbit -->
<VideoPlayer src="blue_ghost_lunar_orbit.mp4" />

---

<!-- Act I · 1965: Mariner 4 — the first data from another planet (0:20) -->
<VideoPlayer src="nasa_mars_mariner_4_pan_audio.mp4" />

---

<!-- Act I · Mars: Perseverance parachute descent and touchdown (1:30 trim) -->
<VideoPlayer src="perseverance_rover_landing_nasa.mp4" />

---

<!-- Act I · Saturn: Cassini Grand Finale ring dive, no voice-over (1:30 trim) -->
<VideoPlayer src="cassini_grand_finale.mp4" />

---

<!-- Act I · the stars: starfield pan with ambient audio (0:20) -->
<VideoPlayer src="stars_pan_audio.mp4" />

---

<!-- Act I · Hubble in orbit (0:33) -->
<VideoPlayer src="hubble.mp4" />

---

<!-- Act I · a telescope under the night sky (0:40) -->
<VideoPlayer src="telescope.mp4" />

---

<!-- Act I · the deep universe: JWST image reel (1:30 trim) -->
<VideoPlayer src="webb_reel.mp4" />

---

<!-- Act I · our galaxy: Milky Way formation simulation, with audio (1:01) -->
<VideoPlayer src="milky_way_sim_audio.mp4" />

---

<!-- Act I · the SDSS map — a universe drawn from a dataset (0:30) -->
<VideoPlayer src="sdss_universe_zoom.mp4" />

---

<!-- Act I · the Big Bang: cosmic expansion funnel (0:30, silent) -->
<VideoPlayer src="expansion_funnel.webm" muted />

---

<!-- Act I · the oldest light: beyond the CMB (silent) -->
<VideoPlayer src="beyond_cmb.mp4" muted />

---

<!-- Act I · the CMB as sound — the act ends on data -->
<VideoPlayer src="cmb_sonification_drone.mp4" />

---

<!-- Act II · the primordial soup: quark-gluon plasma formation (0:33) -->
<VideoPlayer src="qgp_formation.mp4" />

---

<!-- Act II · the Standard Model table builds up (CERN-FOOTAGE-2015-006-001, 0:34) -->
<VideoPlayer src="cern_footage_2015_006_001.mp4" />

---

<!-- Act II · zoom into atoms (CG) -->
<VideoPlayer src="atoms.mp4" />

---

<!-- Act II · particles made visible: cloud chamber, with audio (1:30 trim) -->
<VideoPlayer src="cloud_chamber_audio.mp4" />

---

<!-- Act III · CERN from the air (0:11) -->
<VideoPlayer src="cern_overview_short.mp4" />

---

<!-- Act III · the real LHC tunnel, travelling shot (CERN-FOOTAGE-2022-013-001, 1:30 trim) -->
<VideoPlayer src="cern_footage_2022_013_001.mp4" />

---

<!-- Act III · descending the ATLAS shaft (ATLAS-FOOTAGE-2022-004-002, 0:29, 3:2 → cover) -->
<VideoPlayer src="atlas_footage_2022_004_002.mp4" />

---

<!-- Act III · ATLAS detector overview (ATLAS-VIDEO-2021-001-001, 0:49) -->
<VideoPlayer src="atlas_video_2021_001_001.mp4" />

---

<!-- Act III · CMS (0:30) -->
<VideoPlayer src="cms.mp4" />

---

<!-- Act III · LHCb 3D fly-in, a human for scale (CERN-FOOTAGE-2022-042-001, 0:56) -->
<VideoPlayer src="cern_footage_2022_042_001.mp4" />

---

<!-- Act III · LHCb reel, with audio (0:47) -->
<VideoPlayer src="lhcb.mp4" />

---

<!-- Act III · collision burst in the beam pipe (CERN-FOOTAGE-2024-006-012, 0:27) -->
<VideoPlayer src="cern_footage_2024_006_012.mp4" />

---

<!-- Act III · a collision as data: ATLAS event display (ATLAS-VIDEO-2023-013-001, 0:30) -->
<VideoPlayer src="atlas_video_2023_013_001.mp4" />

---

<!-- Act III · the data centre and the tape robot (CERN-FOOTAGE-2022-013-006, 1:30 trim) -->
<VideoPlayer src="cern_footage_2022_013_006.mp4" />

---

<!-- Act III · the Worldwide LHC Computing Grid globe (CERN-FOOTAGE-2025-048-001, 0:23) -->
<VideoPlayer src="cern_footage_2025_048_001.mp4" />

---

<!-- Act III · the future: FCC map aerial (CERN-FOOTAGE-2024-006-001, 0:18) -->
<VideoPlayer src="cern_footage_2024_006_001.mp4" />

---

<!-- Closer · LHCb fly-through ending on "Ačiū" — thanks, in Lithuanian (2:28) -->
<VideoPlayer src="lhcb_aciu.mp4" />
```

- [ ] **Step 2: Gate with `check`**

Run: `cd ~/outreach_talks/talks/2026_09_10_WorldOfParticles && slidev-videos check 2>&1 | tail -12`
Expected: 32 refs; `vu_ff_zoom.mp4` owned (on release); 31 `inherited from shared`; no UNKNOWN REF.

- [ ] **Step 3: Commit**

```bash
cd ~/outreach_talks && git add talks/2026_09_10_WorldOfParticles/deck.md && git commit -m "feat(wop): video-only reel — landing + 32 clips in three acts, all but the opener from the slidev-videos library

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 11: editAI re-encode of its owned clips into its own release

**Files:**
- Output: `videos/raw/` (repo bank) gains 15 raws; `talks/2026_04_28_editAI/public/videos/` gains 15 encodes; release `videos-2026-04-28-editai` is replaced by them (`--prune` removes the HEVC archive's other 16 assets).

- [ ] **Step 1: Sync raws into the repo bank (mokslo_sala.mov is 5.1 GB)**

Run: `cd ~/outreach_talks/talks/2026_04_28_editAI && PATH=~/micromamba/envs/outreach_talks/bin:$PATH slidev-videos sync 2>&1 | tail -3 && ls ../../videos/raw | wc -l`
Expected: 15 files in `videos/raw/`.

- [ ] **Step 2: Encode (NVENC via the env ffmpeg) and preflight locally**

```bash
cd ~/outreach_talks/talks/2026_04_28_editAI && PATH=~/micromamba/envs/outreach_talks/bin:$PATH slidev-videos encode 2>&1 | tail -18
PATH=~/micromamba/envs/outreach_talks/bin:$PATH slidev-videos preflight 2>&1 | tail -20
```
Expected: 15 encodes; preflight `OK` for every owned clip. The 14 remux chart renders are tiny H.264 renders — if preflight flags one as non-H.264, switch that entry to `profile = "standard"` in the manifest and re-encode `--force --only <name>`.

- [ ] **Step 3: Publish with prune (destructive to the archive — approved in spec §6)**

```bash
cd ~/outreach_talks/talks/2026_04_28_editAI && slidev-videos publish --prune --dry-run 2>&1 | tail -25
```
Expected dry run: 15 uploads/skips, 16 deletions (beyond_cmb, cassini.mov, cern_overview_short, cern_video_2019_050_008_1080ph265, cloud_chamber_audio, cmb_sonification_drone, drone_climbing_mountain_2, expansion_funnel_h264_1080p.webm, lhcb, lhcb_aciu.mov, mars_surface, nasa_mars_mariner_4_pan_audio, qgp_formation, sm.mov, voyage_in_to_the_world_of_atoms, webb_reel). Then run it for real:

```bash
slidev-videos publish --prune 2>&1 | tail -5
gh release view videos-2026-04-28-editai -R MindaugasSarpis/cern_outreach_talks --json assets -q '.assets|length'
```
Expected: `15`.

- [ ] **Step 4: Commit manifest tweaks if any**

```bash
cd ~/outreach_talks && git status --short && git add -A talks/2026_04_28_editAI/videos && git commit -m "chore(editai): owned clips re-encoded at 1080p and published; archive assets pruned" --allow-empty -q -m "
Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 12: Verification gates — check-all, builds, WoP preflight, WoP playback smoke

**Files:**
- Create (scratch, not committed): `/tmp/claude-1001/-home-mindaugas-wsl-outreach-talks/f25c0d74-691a-4596-827e-243030707bfa/scratchpad/wop-smoke.mjs`

- [ ] **Step 1: `check` in every talk**

Run: `cd ~/outreach_talks && pnpm videos:check-all 2>&1 | grep -E '^\[|UNKNOWN|MISSING|error' `
Expected: five headers, no UNKNOWN/MISSING/error lines.

- [ ] **Step 2: Build every talk**

Run: `cd ~/outreach_talks && for d in talks/*/; do (cd "$d" && pnpm build --out dist >/dev/null 2>&1 && echo "OK  $d" || echo "FAIL $d"); done`
Expected: five `OK`. On FAIL, rerun that talk's `pnpm build` and read the error (a missing component import means the addon did not link — re-run `pnpm install`).

- [ ] **Step 3: WoP preflight against the deployed chain (local `public/videos/` is empty, so every ref resolves to a release URL)**

Run: `cd ~/outreach_talks/talks/2026_09_10_WorldOfParticles && slidev-videos preflight 2>&1 | tail -40`
Expected: 32 lines, all `OK`; sources are `…/cern_outreach_talks/releases/download/videos-2026-09-10-worldofparticles/vu_ff_zoom.mp4` for the opener and `…/slidev-videos/releases/download/videos-shared/<name>` for the other 31.

- [ ] **Step 4: Playback smoke on the built WoP deck**

```js
// wop-smoke.mjs — serve dist/, open slides 2 and 3, assert the player picked a release URL and can play.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { chromium } from 'playwright-chromium';

const DIST = process.argv[2];
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };
const srv = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (p === '/') p = '/index.html';
  try { await stat(join(DIST, p)); } catch { p = '/index.html'; }
  res.setHeader('Content-Type', MIME[extname(p)] || 'application/octet-stream');
  res.end(await readFile(join(DIST, p)));
}).listen(8765);

const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
for (const [n, expect] of [[2, 'videos-2026-09-10-worldofparticles/vu_ff_zoom.mp4'], [3, 'videos-shared/saturn_v_launch_nasa.mp4']]) {
  await page.goto(`http://localhost:8765/#/${n}`);
  await page.waitForFunction(() => document.querySelector('video')?.currentSrc, null, { timeout: 30000 });
  const info = await page.evaluate(() => { const v = document.querySelector('video'); return { src: v.currentSrc, ready: v.readyState, err: v.error?.code ?? null }; });
  const ok = info.src.endsWith(expect) && info.err === null;
  console.log(ok ? 'OK  ' : 'FAIL', `slide ${n}`, info);
  if (!ok) process.exitCode = 1;
  const na = await page.locator('text=Video not available').count();
  if (na) { console.log('FAIL "Video not available" on slide', n); process.exitCode = 1; }
}
// Overview grid: 32 video slides must render placeholders, not <video> elements.
const vidsBefore = await page.evaluate(() => document.querySelectorAll('video').length);
await page.keyboard.press('o');
await page.waitForFunction(() => document.querySelectorAll('.video-placeholder').length >= 30, null, { timeout: 15000 }).catch(() => {});
const ov = await page.evaluate(() => ({ ph: document.querySelectorAll('.video-placeholder').length, vids: document.querySelectorAll('video').length }));
const ovOk = ov.ph >= 30 && ov.vids === vidsBefore;   // overview adds placeholders, not one more <video>
console.log(ovOk ? 'OK  ' : 'FAIL', 'overview', { ...ov, vidsBefore });
if (!ovOk) process.exitCode = 1;
await browser.close(); srv.close();
```

Run:
```bash
cd ~/outreach_talks/talks/2026_09_10_WorldOfParticles && pnpm build --out dist >/dev/null && NODE_PATH=~/slidev-videos/node_modules node /tmp/claude-1001/-home-mindaugas-wsl-outreach-talks/f25c0d74-691a-4596-827e-243030707bfa/scratchpad/wop-smoke.mjs "$PWD/dist"
```
Expected: `OK slide 2` with the talk-release URL, `OK slide 3` with the shared-release URL, `OK overview` with ≥30 placeholders and no extra `<video>`; no "Video not available". (Playwright's chromium is already installed for the package repo's smoke test; `NODE_PATH` reuses it.)

- [ ] **Step 5: Clean build outputs**

Run: `cd ~/outreach_talks && rm -rf talks/*/dist && git status --short`
Expected: clean tree (dist is gitignored anyway).

---

### Task 13: Docs — README.md and CLAUDE.md

**Files:**
- Modify: `README.md` (full rewrite), `CLAUDE.md` (video sections replaced)

- [ ] **Step 1: `README.md`**

```markdown
# CERN Outreach Talks

Monorepo of [Slidev](https://sli.dev) decks for CERN outreach talks.
Shared theme and content components at the root; each talk is a pnpm
workspace under `talks/<name>/`. Videos are handled by the
[slidev-videos](https://github.com/MindaugasSarpis/slidev-videos) package
(CLI + `VideoPlayer` addon + the shared clip library); this repo holds
only decks and per-talk config.

## Talks

| Date       | Path                                   | Deployed |
| ---------- | -------------------------------------- | -------- |
| 2026-04-28 | `talks/2026_04_28_editAI/`             | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_04_28_editAI/) |
| 2026-05-11 | `talks/2026_05_11_Sceptics/`           | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_05_11_Sceptics/) |
| 2026-07-18 | `talks/2026_07_18_Yaga/`               | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_07_18_Yaga/) |
| 2026-09-10 | `talks/2026_09_10_WorldOfParticles/`   | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_09_10_WorldOfParticles/) |
| TBD        | `talks/2026_09_00_Startertalk/`        | [link](https://mindaugassarpis.github.io/cern_outreach_talks/2026_09_00_Startertalk/) |

Index of all talks: https://mindaugassarpis.github.io/cern_outreach_talks/

## Setup from scratch

```bash
git clone <this-repo> && cd outreach_talks
conda env create -f env.yaml     # nodejs, pnpm, python, ffmpeg, rclone, gh + the slidev-videos CLI
conda activate outreach_talks
pnpm install                     # every talk's deps, incl. the slidev-addon-videos player
cd talks/2026_09_10_WorldOfParticles && pnpm dev     # http://localhost:3030
```

No videos live in git. Empty `public/videos/` and `videos/raw/` dirs are
normal: clips stream from GitHub Releases, and everything is
re-fetchable (`pnpm videos:pull`, `pnpm videos:sync`).

## The policy (since 2026-07-18)

- Venues play the **1080p H.264 web tier** (no 4K/HEVC masters — they froze at Yaga).
- Audio is **loudness-normalized to −16 LUFS**; set the venue volume once.
  On a video slide `p` toggles play/pause, `+`/`-` step the volume and
  the level sticks for the rest of the deck.
- `pnpm videos:preflight` before every talk.

## Starting a new talk

```bash
pnpm new-talk 2026_09_15_SomeVenue --title "My talk"   # from the repo root
pnpm install
```

Don't clone an old talk directory; the scaffold carries the current
layout (`videos.toml`, addon headmatter, empty manifest).

## Videos

**Library clips** (CERN/LHC footage, space B-roll, science sims) are
listed in the package's
[`shared.toml`](https://github.com/MindaugasSarpis/slidev-videos/blob/main/src/slidev_videos/shared.toml)
and served from its `videos-shared` release. Reference them by name and
nothing else is needed:

```md
<VideoPlayer src="cern_overview_short.mp4" />
<VideoPlayer src="expansion_funnel.webm" muted />
```

**Talk-owned clips** (venue footage, chart renders): add a `[[videos]]`
entry to `talks/<name>/videos/manifest.toml`, put the raw on the gdrive
`released/` folder or straight into the repo raw bank `videos/raw/`, then

```bash
pnpm videos:sync        # raws listed in the manifest -> <repo>/videos/raw/
pnpm videos:encode      # ffmpeg -> public/videos/ (H.264 1080p, loudnorm)
pnpm videos:publish     # -> the talk's GitHub Release (videos-<talk>)
pnpm videos:check       # manifest / files / slide refs consistent?
```

Finding new clips: `slidev-videos discover "cloud chamber" lhc` searches
CDS, NASA, ESO/Hubble/Webb/NOIRLab and Wikimedia Commons and prints
manifest snippets.

## Before the talk

```bash
pnpm videos:check
pnpm videos:preflight    # probes what each slide will actually serve: codec, size, bitrate, audio, loudness
pnpm venue               # offline bundle <talk>-venue.zip (RUN_ME.txt inside)
```

## After the talk

```bash
pnpm videos:clean            # dry run: what is safe to delete locally and why
pnpm videos:clean -- --yes
pnpm videos:publish -- --prune   # drop release assets the manifest no longer lists
```

World of Particles: run `pnpm videos:publish -- --prune` in its talk dir
after 2026-09-10 to drop the six superseded Yaga-lineage copies.

## Deploying

`git push origin main` — the Pages workflow builds every talk and the index.

## More detail

- [CLAUDE.md](CLAUDE.md) — repo conventions, theme, authoring, gotchas.
- slidev-videos README — CLI, profiles, player props, `videos.toml`.
- `docs/superpowers/specs/2026-09-08-slidev-videos-migration-design.md` — why things are laid out this way.
```

- [ ] **Step 2: `CLAUDE.md` edits**

1. `## Project overview` paragraph: replace "Shared theme, components, and video pipeline live at the repo root" with "Shared theme and content components live at the repo root; the video pipeline, the `VideoPlayer` addon and the shared clip library are the external package `slidev-videos` (`~/slidev-videos` on this machine, editable-installed)". In the talk list, replace editAI's "Its GH Release doubles as the shared release." with "Owns the 14 chart renders + mokslo_sala on its release." and the WoP bullet's last sentence with "Video-only reel: landing + 32 clips, all library clips except the opener `vu_ff_zoom.mp4`."
2. `## Environment setup`: after `pnpm install` add the comment `# the slidev-videos CLI comes from env.yaml's pip entry; the addon from pnpm`.
3. `## Repo layout`: replace the tree with

```
/
├── videos.toml                   # slidev-videos [defaults] for every talk (repo, source remote, 1080p policy)
├── pnpm-workspace.yaml           # workspace: talks/*
├── theme/                        # shared Slidev theme (@slidev/theme-scienced fork)
├── components/                   # shared Vue components (ParticleHero, ParticleDiagram, …)
├── scripts/new_talk.py           # scaffolder;  scripts/render_lib.py — animation rendering
├── videos/raw/                   # RAW BANK: originals for every talk (gitignored)
└── talks/<name>/
    ├── deck.md                   # Slidev entry — theme: ../../theme, addons: [slidev-addon-videos], videos: {repo, release, fit}
    ├── videos.toml               # project marker: raw_dir=../../videos/raw, release_tag
    ├── package.json              # slidev + slidev-addon-videos + videos:* scripts (slidev-videos <cmd>)
    ├── components/ -> ../../components   (symlink; required for auto-import)
    ├── public/figures/           # images, gifs
    ├── public/videos/            # encoded web copies (gitignored)
    └── videos/manifest.toml      # talk-OWNED clips only (library clips are inherited by name)
```
   Delete the `**Raw bank (since 2026-09-07).**` paragraph and replace with: `**Raw bank.** Originals live once per machine in `<repo>/videos/raw/`; every talk's `videos.toml` points `raw_dir` there.`
4. Delete these sections entirely: `## Config layering (video pipeline)`, `## Shared video registry`, `## VideoPlayer` (keep its `**Look-ahead buffering.**` paragraph by moving it into the new Videos section below), `## Encoding profiles`, `## Portable/offline bundle`.
5. Replace `## Commands` with:

````markdown
## Commands

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
- **Player**: `<VideoPlayer src="name.mp4" [muted] [loop] [:controls="false"] [:autoplay="false"] [:volume="0.7"] />`.
  Chain: own release -> shared release -> local `public/videos/` (dev mode
  local-first). Config in headmatter `videos: {repo, release, fit}`;
  old decks use `fit: contain`, WoP `fit: cover`. Keys: `p`, `+`, `-`.
- **Policy** (since 2026-07-18): web tier only, ≤1920 H.264 ≤10 Mbps,
  AAC, -16 LUFS; `videos:preflight` enforces it. No HQ tier.
- **Renames** (2026-09-08 migration): see the package README's rename table.
- **Look-ahead buffering.** The player attaches the next three slides' clips
  early so they buffer during the current slide; put a non-video slide
  (the cover) in front of a heavy opener.
- `videos:check` greps `VideoPlayer src="..."`, so keep that attribute syntax.
````

6. `## Git remotes`: change to "This clone's GitHub remote is `origin`; some clones name it `github`. Check `git remote -v`."

- [ ] **Step 3: Consistency grep and commit**

```bash
cd ~/outreach_talks && grep -n 'videos.py\|shared.toml\|outreach.toml\|VITE_VIDEO\|videos-hq\|encode-hq' README.md CLAUDE.md
```
Expected: only the intentional mention of the package `shared.toml` path in both files. Then:

```bash
git add README.md CLAUDE.md && git commit -m "docs: README + CLAUDE.md for the slidev-videos workflow

Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01KgTfmScm4qSxT7WPuLk9n4"
```

---

### Task 14: Release cleanup on `cern_outreach_talks` (spec §6; WoP excluded)

- [ ] **Step 1: Prune Sceptics and Yaga to their owned clips (dry run, then real)**

```bash
cd ~/outreach_talks/talks/2026_05_11_Sceptics && slidev-videos publish --prune --dry-run 2>&1 | tail -8 && slidev-videos publish --prune 2>&1 | tail -3
cd ~/outreach_talks/talks/2026_07_18_Yaga && slidev-videos publish --prune --dry-run 2>&1 | tail -14 && slidev-videos publish --prune 2>&1 | tail -3
gh release view videos-2026-05-11-sceptics -R MindaugasSarpis/cern_outreach_talks --json assets -q '[.assets[].name]'
gh release view videos-2026-07-18-yaga -R MindaugasSarpis/cern_outreach_talks --json assets -q '[.assets[].name]'
```
Expected: Sceptics `["g2_data.mp4","g2_fit.mp4"]`; Yaga `["lt_zoom.mov"]`. Note: `publish` skips uploading files that are not local when the remote size matches nothing local — if it instead tries to upload a missing local file, run `slidev-videos pull` first in that talk, then `publish --prune`.

- [ ] **Step 2: Delete the three retired releases**

```bash
for r in videos-hq-2026-05-11-sceptics videos-hq-2026-07-18-yaga videos-shared; do gh release delete "$r" -R MindaugasSarpis/cern_outreach_talks --yes --cleanup-tag; done
gh release list -R MindaugasSarpis/cern_outreach_talks
```
Expected: remaining releases: `videos-2026-04-28-editai` (15), `videos-2026-05-11-sceptics` (2), `videos-2026-07-18-yaga` (1), `videos-2026-09-10-worldofparticles` (untouched, 9).

- [ ] **Step 3: Re-run preflight for WoP and editAI to prove nothing depended on the deleted releases**

```bash
cd ~/outreach_talks/talks/2026_09_10_WorldOfParticles && slidev-videos preflight --no-loudness 2>&1 | grep -c OK
cd ~/outreach_talks/talks/2026_04_28_editAI && slidev-videos preflight --no-loudness 2>&1 | grep -cE 'FAIL|error|not found'
```
Expected: `32` and `0`.

---

### Task 15: Push, deploy, post-deploy verification

- [ ] **Step 1: Push**

Run: `cd ~/outreach_talks && git status --short && git push origin main && gh run watch -R MindaugasSarpis/cern_outreach_talks $(gh run list -R MindaugasSarpis/cern_outreach_talks -L 1 --json databaseId -q '.[0].databaseId') --exit-status`
Expected: clean tree before push; the Pages workflow completes `success`.

- [ ] **Step 2: Deployed WoP deck serves the right URLs**

```bash
curl -s https://mindaugassarpis.github.io/cern_outreach_talks/2026_09_10_WorldOfParticles/ | grep -o '<title>[^<]*' 
curl -sI https://github.com/MindaugasSarpis/slidev-videos/releases/download/videos-shared/lhcb_aciu.mp4 | head -1
curl -sI https://github.com/MindaugasSarpis/cern_outreach_talks/releases/download/videos-2026-09-10-worldofparticles/vu_ff_zoom.mp4 | head -1
```
Expected: title `World of Particles`; both HEADs `302` (release redirect).

- [ ] **Step 3: Run the Task 12 smoke against the deployed URL**

Edit the smoke script's `page.goto` base to `https://mindaugassarpis.github.io/cern_outreach_talks/2026_09_10_WorldOfParticles/` (skip the local server) and run it. Expected: `OK slide 2`, `OK slide 3`.

---

## Self-review notes

- Spec coverage: §3 → Tasks 1, 8, 10; §4 → Tasks 1–5 (4b: player fixes); §5.1 → Task 9; §5.3 → Task 6; §5.4 → Task 7; §5.5 → Task 9; §5.6 → Tasks 9, 13; §6 → Tasks 11, 14; §7 → Tasks 3, 12, 15; §10 → Task 10.
- Ordering: library publish (Task 3) precedes any deck rename (8, 10); editAI re-encode (11) precedes deleting outreach `videos-shared` (14); WoP release never pruned.
- Names used consistently: `slidev-videos`, `slidev-addon-videos`, `videos-2026-09-10-worldofparticles`, `MindaugasSarpis/slidev-videos@videos-shared`.
