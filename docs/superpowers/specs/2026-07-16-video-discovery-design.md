# Video discovery (`videos:discover`) — design

Date: 2026-07-16
Status: approved

## Context

The monorepo's video pipeline (`scripts/videos.py`) manages clips that are
already chosen: it syncs raws from gdrive, encodes web/HQ tiers, and
publishes to GH Releases, all driven by `videos/manifest.toml` files and
the shared registry `/videos/shared.toml`. Nothing in the repo helps find
NEW open-licensed outreach footage. Talks like `2026_07_18_Yaga` are
video-first decks, so sourcing candidate clips is a recurring manual chore.

## Goal

A standalone discovery tool that queries open-licensed public video
archives by keyword and reports candidate clips — title, date, duration,
license, credit, page + download URLs — plus a paste-ready `[[videos]]`
manifest snippet per candidate. The user curates, downloads chosen raws to
the gdrive `released/` folder, and runs the normal pipeline.

## Non-goals

- No automatic downloading of media (report-only; URLs are printed).
- No new runtime dependencies — stdlib only (`urllib`, `json`, `tomllib`),
  matching `videos.py` conventions.
- No content-level dedup against existing clips (only name/title
  heuristics; flagged, not hidden).
- No integration into `videos.py` — discovery is a separate concern from
  the encode/publish pipeline and lives in its own script.

## Interface

New file `scripts/discover_videos.py`, wired as a root-level pnpm script:

```
pnpm videos:discover -- <keyword>... [options]

--source cds,nasa,djangoplicity,commons   subset of sources (default: all)
--limit N            max results per source per keyword (default 5)
--pages N            d2d feed pages to walk per djangoplicity site (default 5)
--include-lectures   keep CDS LECTURES category (excluded by default)
--json               machine-readable output instead of the report
```

`--source djangoplicity` enables all four djangoplicity sites at once;
per-candidate output reports the concrete site (`eso`, `hubble`, `webb`,
`noirlab`). `--limit` caps results per source per keyword after any
client-side filtering.

Each keyword is queried against every enabled source; results are merged
and deduped by download URL. Sources are fetched in parallel with
`ThreadPoolExecutor` (same pattern as `videos.py`), 15 s timeout per
request, descriptive `User-Agent` header (Wikimedia API policy requires
one).

## Sources (endpoints verified live 2026-07-16)

| Source | Endpoint | Search | License |
|---|---|---|---|
| CERN CDS Videos | `https://videos.cern.ch/api/records/?q=…` (Invenio JSON) | server-side | © CERN, free for educational/informational use |
| NASA Image & Video Library | `https://images-api.nasa.gov/search?q=…&media_type=video` | server-side | Public domain (NASA media guidelines) |
| djangoplicity family: ESO, ESA/Hubble, ESA/Webb, NOIRLab | `https://www.eso.org/public/videos/d2d/`, `https://esahubble.org/videos/d2d/`, `https://esawebb.org/videos/d2d/`, `https://noirlab.edu/public/videos/d2d/` (Data2Dome JSON) | **client-side** — feeds are newest-first, no search param | CC BY 4.0 |
| Wikimedia Commons | `https://commons.wikimedia.org/w/api.php` `action=query&generator=search`, `gsrnamespace=6`, `filetype:video`, `prop=imageinfo&iiprop=url\|extmetadata` | server-side | per-file, from `extmetadata` (`LicenseShortName`, `UsageTerms`) |

Source-specific behavior:

- **CDS**: raw keyword hits are dominated by lecture recordings (736 of
  ~880 in the probe), so the LECTURES category is excluded by default via
  the Invenio query syntax; `--include-lectures` restores it. Asset URLs
  come from the record's file links (prefer highest-resolution mp4).
- **NASA**: each hit's `collection.json` is fetched to resolve the actual
  mp4 rendition (prefer `~orig`, fall back to largest available).
- **djangoplicity**: the d2d feed is walked up to `--pages` pages per
  site, filtering `Title` + `Description` (HTML-stripped) client-side
  against the keyword. The report notes that these sources only cover
  recent releases at the default depth. Video renditions come from the
  item's `Assets`/`Resources` list (prefer largest mp4).
- **Commons**: results are often `webm`/`ogv`; that's acceptable — the
  pipeline's `encode` step re-encodes any ffmpeg-readable input to web
  H.264. The report prints the container so the user isn't surprised.

## Normalization

```python
@dataclass
class Candidate:
    source: str          # "cds" | "nasa" | "eso" | "hubble" | "webb" | "noirlab" | "commons"
    id: str              # source-native identifier
    title: str
    date: str            # ISO date where available
    duration_s: float | None
    resolution: str | None   # "1920x1080" where available
    license: str
    credit: str | None
    page_url: str
    download_url: str
```

Dedupe key: `download_url`. Candidates whose slugified filename or title
case-insensitively matches a `name` in `/videos/shared.toml` or any
`talks/*/videos/manifest.toml` are flagged **"already in registry"** in
the report rather than dropped (title matching is heuristic).

## Output

Default: a compact report grouped by source, newest first — title, date,
duration, resolution, license, page URL, download URL — followed by a
"manifest snippets" section with one paste-ready block per NEW candidate:

```toml
[[videos]]
name    = "beta_pictoris_d_timelapse.mp4"   # slugified lowercase (repo convention)
profile = "standard"                         # default guess; adjust per clip
notes   = """\
Time-lapse of exoplanet Beta Pictoris d orbiting its host star. \
Source: ESO eso2609b, CC BY 4.0, credit: ESO/..."""
```

`--json` emits the candidate list as JSON for scripting.

## Error handling

Each source adapter is independently wrapped: on failure (timeout, HTTP
error, schema surprise) it prints a one-line warning to stderr and the
remaining sources still report. Exit code is non-zero only when every
enabled source fails. No retries in v1.

## Testing

`tests/test_discover_videos.py` using stdlib `unittest` (no pytest in
`env.yaml`; stays dep-free):

- Parser tests for each source adapter against recorded real API
  responses stored as JSON fixtures under `tests/fixtures/`.
- Unit tests for slugify, dedupe, registry matching, and TOML snippet
  emission (including TOML-escaping of quotes/backslashes in titles).
- A live-network smoke test that hits each real endpoint, opt-in via
  `DISCOVER_LIVE=1`, skipped by default.

Run: `python3 -m unittest discover -s tests`.

## Wiring

Root `package.json` gains:

```json
"videos:discover": "python3 scripts/discover_videos.py"
```
