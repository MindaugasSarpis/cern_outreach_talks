# Video Discovery (`videos:discover`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A stdlib-only `scripts/discover_videos.py` that queries CERN CDS Videos, NASA Image & Video Library, the djangoplicity sites (ESO/Hubble/Webb/NOIRLab) and Wikimedia Commons by keyword and prints candidate clips + paste-ready `[[videos]]` manifest snippets.

**Architecture:** One flat script with per-source adapter functions returning a normalized `Candidate` dataclass; adapters take an injectable `fetch` callable so tests run offline against recorded JSON fixtures. A `ThreadPoolExecutor` runs one job per (source-site × keyword) with per-job error isolation. Spec: `docs/superpowers/specs/2026-07-16-video-discovery-design.md`.

**Tech Stack:** Python ≥3.11 stdlib only (`urllib`, `json`, `tomllib`, `argparse`, `unittest`). No new entries in `env.yaml`.

## Global Constraints

- stdlib only — no `requests`, no pytest, no new `env.yaml` dependencies.
- Python ≥ 3.11 (`tomllib`, `X | None` unions).
- Suggested clip filenames must be slugified **lowercase** (repo convention).
- Report-only tool: never downloads media.
- Offline tests: `python3 -m unittest discover -s tests -v` must pass with no network. Live tests only run with `DISCOVER_LIVE=1`.
- All work happens at the repo root `/home/mindaugas_wsl/outreach_talks`. Commit after every task; do NOT push (remote is named `github`, pushes only on user request).
- Recorded probe responses (source for fixtures) live at
  `/tmp/claude-1001/-home-mindaugas-wsl-outreach-talks/95172970-c0fa-47f4-9bc1-e95c5924561a/scratchpad/probes/`
  (recorded live 2026-07-16). If that directory is gone, re-record with the curl commands in Task 4 — and know that fresh recordings may change the literal values asserted in tests.

---

### Task 1: Candidate dataclass + pure text helpers

**Files:**
- Create: `scripts/discover_videos.py`
- Create: `tests/test_discover_videos.py`

**Interfaces:**
- Produces: `Candidate` (dataclass, fields below), `slugify_name(title: str, download_url: str) -> str`, `strip_html(text: str) -> str`, `parse_hms(s: str) -> float | None`. All later tasks import these via the `dv` module alias.

- [ ] **Step 1: Write the failing tests**

Create `tests/test_discover_videos.py`:

```python
"""Tests for scripts/discover_videos.py (offline; fixtures under tests/fixtures/).

Live-network smoke tests are opt-in: DISCOVER_LIVE=1 python3 -m unittest discover -s tests -v
"""
from __future__ import annotations

import contextlib
import io
import json
import os
import sys
import tempfile
import tomllib
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

import discover_videos as dv

FIXTURES = Path(__file__).resolve().parent / "fixtures"


class HelpersTest(unittest.TestCase):
    def test_slugify_basic(self):
        self.assertEqual(
            dv.slugify_name("Time-lapse of exoplanet Beta Pictoris d",
                            "https://cdn.eso.org/videos/ultra_hd/eso2609b.mp4"),
            "time_lapse_of_exoplanet_beta_pictoris_d.mp4")

    def test_slugify_keeps_extension_and_transliterates(self):
        self.assertEqual(
            dv.slugify_name("Vilniaus dūmų kamera",
                            "https://upload.wikimedia.org/x/Wilson_chamber.webm"),
            "vilniaus_dumu_kamera.webm")

    def test_slugify_defaults(self):
        self.assertEqual(dv.slugify_name("", "https://x/y"), "clip.mp4")

    def test_strip_html(self):
        self.assertEqual(dv.strip_html("HL-LHC.<br>\n<br>\n0:00 Slide &amp; 1"),
                         "HL-LHC. 0:00 Slide & 1")

    def test_parse_hms(self):
        self.assertEqual(dv.parse_hms("00:47:14"), 2834.0)
        self.assertEqual(dv.parse_hms("90"), 90.0)
        self.assertIsNone(dv.parse_hms(""))


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: `ModuleNotFoundError: No module named 'discover_videos'`

- [ ] **Step 3: Write the implementation**

Create `scripts/discover_videos.py`:

```python
#!/usr/bin/env python3
"""Discover open-licensed outreach video candidates from public archives.

Queries CERN CDS Videos, the NASA Image & Video Library, the
djangoplicity sites (ESO, ESA/Hubble, ESA/Webb, NOIRLab) and Wikimedia
Commons by keyword, then prints a report of candidate clips plus a
paste-ready [[videos]] manifest snippet per new candidate. Report-only:
nothing is downloaded.

Usage (from repo root):
    pnpm videos:discover -- "cloud chamber" --limit 5
    python3 scripts/discover_videos.py "cloud chamber" lhc --source cds,nasa --json

Design: docs/superpowers/specs/2026-07-16-video-discovery-design.md
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import tomllib
import unicodedata
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
USER_AGENT = (
    "outreach-talks-videos-discover/1.0 "
    "(CERN outreach slide decks; mailto:mindaugassarpis@gmail.com)"
)
TIMEOUT_S = 15.0


@dataclass
class Candidate:
    source: str            # "cds" | "nasa" | "eso" | "hubble" | "webb" | "noirlab" | "commons"
    id: str                # source-native identifier
    title: str
    date: str              # ISO-ish date string, "" if unknown
    duration_s: float | None
    resolution: str | None  # "1920x1080" where available
    license: str
    credit: str | None
    page_url: str
    download_url: str
    in_registry: bool = False


def slugify_name(title: str, download_url: str) -> str:
    """Lowercase ASCII slug + the download URL's extension (default .mp4)."""
    ext = Path(urllib.parse.urlparse(download_url).path).suffix.lower() or ".mp4"
    ascii_title = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "_", ascii_title.lower()).strip("_")
    return (slug or "clip") + ext


def strip_html(text: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", text))).strip()


def parse_hms(s: str) -> float | None:
    """'00:47:14' -> 2834.0; '90' -> 90.0; junk/empty -> None."""
    try:
        nums = [float(p) for p in s.strip().split(":")]
    except ValueError:
        return None
    total = 0.0
    for n in nums:
        total = total * 60 + n
    return total
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py
git commit -m "feat(discover): Candidate dataclass and text helpers"
```

---

### Task 2: TOML manifest-snippet emission

**Files:**
- Modify: `scripts/discover_videos.py` (append)
- Modify: `tests/test_discover_videos.py` (append test class)

**Interfaces:**
- Consumes: `Candidate`, `slugify_name` from Task 1.
- Produces: `fmt_duration(seconds: float | None) -> str` ("4:07" / "?"), `toml_snippet(c: Candidate) -> str` (a parseable `[[videos]]` block ending in one trailing newline).

- [ ] **Step 1: Write the failing test** (append to `tests/test_discover_videos.py` before the `__main__` guard; all later test classes are appended the same way)

```python
class TomlSnippetTest(unittest.TestCase):
    def test_snippet_round_trips_and_escapes(self):
        c = dv.Candidate(source="eso", id="eso2609b",
                         title='Beta "Pictoris" time-lapse',
                         date="2026-07-15", duration_s=247.0, resolution="3840x2160",
                         license="CC BY 4.0", credit="ESO/B. Sutlieff",
                         page_url="https://www.eso.org/public/videos/eso2609b/",
                         download_url="https://cdn.eso.org/videos/ultra_hd/eso2609b.mp4")
        snippet = dv.toml_snippet(c)
        video = tomllib.loads(snippet)["videos"][0]
        self.assertEqual(video["name"], "beta_pictoris_time_lapse.mp4")
        self.assertEqual(video["profile"], "standard")
        self.assertIn('Beta "Pictoris" time-lapse', video["notes"])
        self.assertIn("4:07", video["notes"])
        self.assertIn("CC BY 4.0", video["notes"])
        self.assertIn("credit: ESO/B. Sutlieff", video["notes"])
        self.assertIn("https://www.eso.org/public/videos/eso2609b/", video["notes"])

    def test_fmt_duration(self):
        self.assertEqual(dv.fmt_duration(247.0), "4:07")
        self.assertEqual(dv.fmt_duration(None), "?")
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `AttributeError: module 'discover_videos' has no attribute 'toml_snippet'`

- [ ] **Step 3: Write the implementation** (append to `scripts/discover_videos.py`)

```python
def fmt_duration(seconds: float | None) -> str:
    if seconds is None:
        return "?"
    m, s = divmod(int(round(seconds)), 60)
    return f"{m}:{s:02d}"


def toml_snippet(c: Candidate) -> str:
    """Paste-ready [[videos]] block for a candidate.

    notes is emitted via json.dumps: JSON string escaping is a subset of
    TOML basic-string escaping, so the output is always valid TOML.
    """
    bits = [c.title]
    if c.duration_s is not None:
        bits.append(fmt_duration(c.duration_s))
    bits.append(f"Source: {c.source} {c.id}")
    bits.append(c.license)
    if c.credit:
        bits.append(f"credit: {c.credit}")
    bits.append(c.page_url)
    notes = ". ".join(b.strip().rstrip(".") for b in bits if b and b.strip()) + "."
    return (
        "[[videos]]\n"
        f'name    = "{slugify_name(c.title, c.download_url)}"\n'
        'profile = "standard"   # default guess; adjust per clip\n'
        f"notes   = {json.dumps(notes)}\n"
    )
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py
git commit -m "feat(discover): TOML manifest snippet emission"
```

---

### Task 3: Registry matching + dedupe

**Files:**
- Modify: `scripts/discover_videos.py` (append)
- Modify: `tests/test_discover_videos.py` (append test class)

**Interfaces:**
- Consumes: `Candidate`, `slugify_name`, `REPO_ROOT`.
- Produces: `load_registry_stems(repo_root: Path = REPO_ROOT) -> set[str]` (lowercased filename stems from `/videos/shared.toml` + all `talks/*/videos/manifest.toml`), `mark_in_registry(candidates: list[Candidate], stems: set[str]) -> None` (sets `.in_registry` in place), `dedupe(candidates: list[Candidate]) -> list[Candidate]` (first occurrence per `download_url` wins).

- [ ] **Step 1: Write the failing test** (append)

```python
class RegistryTest(unittest.TestCase):
    def _repo(self, tmp):
        root = Path(tmp)
        (root / "videos").mkdir(parents=True)
        (root / "videos" / "shared.toml").write_text(
            '[[videos]]\nname = "cern_overview_short.mp4"\n', encoding="utf-8")
        talk = root / "talks" / "demo" / "videos"
        talk.mkdir(parents=True)
        (talk / "manifest.toml").write_text(
            '[[videos]]\nname = "skylapse.mp4"\n', encoding="utf-8")
        return root

    def _cand(self, cid, title, url):
        return dv.Candidate(source="x", id=cid, title=title, date="",
                            duration_s=None, resolution=None, license="",
                            credit=None, page_url="", download_url=url)

    def test_load_registry_stems(self):
        with tempfile.TemporaryDirectory() as tmp:
            stems = dv.load_registry_stems(self._repo(tmp))
        self.assertEqual(stems, {"cern_overview_short", "skylapse"})

    def test_mark_in_registry_by_slug_and_url(self):
        cands = [
            self._cand("1", "Skylapse", "http://h/other.mp4"),        # slug match
            self._cand("2", "Different name", "http://h/SKYLAPSE.mp4"),  # url-stem match
            self._cand("3", "Brand new", "http://h/new.mp4"),
        ]
        dv.mark_in_registry(cands, {"skylapse"})
        self.assertEqual([c.in_registry for c in cands], [True, True, False])

    def test_dedupe_by_download_url(self):
        a = self._cand("1", "A", "http://same.mp4")
        b = self._cand("2", "B", "http://same.mp4")
        self.assertEqual(dv.dedupe([a, b]), [a])
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `AttributeError: ... no attribute 'load_registry_stems'`

- [ ] **Step 3: Write the implementation** (append)

```python
def load_registry_stems(repo_root: Path = REPO_ROOT) -> set[str]:
    """Lowercased stems of every clip name already in shared + talk manifests."""
    stems: set[str] = set()
    manifests = [repo_root / "videos" / "shared.toml"]
    manifests += sorted(repo_root.glob("talks/*/videos/manifest.toml"))
    for path in manifests:
        if not path.exists():
            continue
        data = tomllib.loads(path.read_text(encoding="utf-8"))
        for video in data.get("videos", []):
            name = video.get("name")
            if name:
                stems.add(Path(name).stem.lower())
    return stems


def mark_in_registry(candidates: list[Candidate], stems: set[str]) -> None:
    for c in candidates:
        slug_stem = Path(slugify_name(c.title, c.download_url)).stem
        url_stem = Path(urllib.parse.urlparse(c.download_url).path).stem.lower()
        c.in_registry = slug_stem in stems or url_stem in stems


def dedupe(candidates: list[Candidate]) -> list[Candidate]:
    seen: set[str] = set()
    out: list[Candidate] = []
    for c in candidates:
        if c.download_url not in seen:
            seen.add(c.download_url)
            out.append(c)
    return out
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 10 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py
git commit -m "feat(discover): registry matching and URL dedupe"
```

---

### Task 4: Fixtures, HTTP helper, CDS adapter

**Files:**
- Create: `tests/fixtures/cds_lhc.json`, `tests/fixtures/nasa_search_mars.json`, `tests/fixtures/nasa_collection_mars.json`, `tests/fixtures/eso_d2d_page1.json`, `tests/fixtures/commons_cloud_chamber.json`
- Modify: `scripts/discover_videos.py` (append)
- Modify: `tests/test_discover_videos.py` (append helper + test class)

**Interfaces:**
- Consumes: `Candidate`, `strip_html`, `parse_hms`.
- Produces: `http_get_json(url: str, timeout: float = TIMEOUT_S) -> object`, `CDS_API` constant, `search_cds(keyword: str, limit: int = 5, include_lectures: bool = False, fetch=http_get_json) -> list[Candidate]`. Test-side: `fixture_fetch(mapping: dict[str, str | dict]) -> callable` used by Tasks 5–7.

- [ ] **Step 1: Materialize the recorded fixtures**

The probe responses were recorded live on 2026-07-16 into the scratchpad. Trim them into deterministic single-item fixtures:

```bash
SCRATCH=/tmp/claude-1001/-home-mindaugas-wsl-outreach-talks/95172970-c0fa-47f4-9bc1-e95c5924561a/scratchpad/probes
mkdir -p tests/fixtures
python3 - "$SCRATCH" <<'EOF'
import json, sys
from pathlib import Path
src, dst = Path(sys.argv[1]), Path("tests/fixtures")
d = json.loads((src / "cds.json").read_text())
d["hits"]["hits"] = d["hits"]["hits"][:1]          # keep only recid 3016316
(dst / "cds_lhc.json").write_text(json.dumps(d, indent=1))
n = json.loads((src / "nasa_search.json").read_text())
n["collection"]["items"] = n["collection"]["items"][:1]   # keep only the Mars Chopper item
(dst / "nasa_search_mars.json").write_text(json.dumps(n, indent=1))
(dst / "nasa_collection_mars.json").write_text((src / "nasa_collection.json").read_text())
e = json.loads((src / "eso_d2d.json").read_text())
e["Collections"] = e["Collections"][:1]            # keep only eso2609b
e["Next"] = None
(dst / "eso_d2d_page1.json").write_text(json.dumps(e, indent=1))
(dst / "commons_cloud_chamber.json").write_text((src / "commons.json").read_text())
EOF
ls -la tests/fixtures/
```

Expected: five .json files, each non-empty and < 300 KB.

Provenance (only needed if the scratchpad is gone — fresh recordings may shift the literals asserted below):

```bash
curl -s "https://videos.cern.ch/api/records/?q=lhc&size=2" -H "Accept: application/json" -o cds.json
curl -s "https://images-api.nasa.gov/search?q=mars&media_type=video&page_size=2" -o nasa_search.json
curl -s "$(python3 -c "import json;print(json.load(open('nasa_search.json'))['collection']['items'][0]['href'].replace(' ','%20'))")" -o nasa_collection.json
curl -s "https://www.eso.org/public/videos/d2d/" -o eso_d2d.json
curl -s "https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=cloud%20chamber%20filetype:video&gsrnamespace=6&gsrlimit=2&prop=imageinfo&iiprop=url%7Csize%7Cextmetadata&iiextmetadatafilter=LicenseShortName%7CUsageTerms%7CArtist%7CDateTimeOriginal&format=json" -o commons.json
```

- [ ] **Step 2: Write the failing tests** (append; `fixture_fetch` goes right after the `FIXTURES = ...` line near the top of the test file)

```python
def fixture_fetch(mapping):
    """Offline fetch stub: first URL-substring match wins.

    Values are fixture filenames (str) or inline response objects (dict).
    """
    def fetch(url, timeout=15.0):
        for fragment, value in mapping.items():
            if fragment in url:
                if isinstance(value, str):
                    return json.loads((FIXTURES / value).read_text(encoding="utf-8"))
                return value
        raise AssertionError(f"unexpected URL fetched: {url}")
    return fetch
```

```python
class CdsTest(unittest.TestCase):
    def test_lectures_filtered_by_default(self):
        fetch = fixture_fetch({"videos.cern.ch/api/records": "cds_lhc.json"})
        self.assertEqual(dv.search_cds("lhc", limit=5, fetch=fetch), [])

    def test_parses_record_with_lectures_included(self):
        fetch = fixture_fetch({"videos.cern.ch/api/records": "cds_lhc.json"})
        cands = dv.search_cds("lhc", limit=5, include_lectures=True, fetch=fetch)
        self.assertEqual(len(cands), 1)
        c = cands[0]
        self.assertEqual(c.source, "cds")
        self.assertEqual(c.id, "3016316")
        self.assertEqual(c.title, "HL-LHC/HE-LHC")
        self.assertEqual(c.date, "2018-11-16")
        self.assertEqual(c.duration_s, 2834.0)
        self.assertEqual(c.resolution, "1920x1080")
        self.assertEqual(c.license, "CERN")
        self.assertEqual(c.credit, "CERN")
        self.assertEqual(c.page_url, "https://videos.cern.ch/record/3016316")
        self.assertTrue(c.download_url.startswith("https://videos.cern.ch/api/files/"))
        self.assertIn("LECTURES-VIDEO-2025-16059-001.mp4", c.download_url)
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `AttributeError: ... no attribute 'search_cds'`

- [ ] **Step 4: Write the implementation** (append)

```python
def http_get_json(url: str, timeout: float = TIMEOUT_S) -> object:
    req = urllib.request.Request(
        url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


CDS_API = "https://videos.cern.ch/api/records/"


def search_cds(keyword: str, limit: int = 5, include_lectures: bool = False,
               fetch=http_get_json) -> list[Candidate]:
    """CERN CDS Videos (Invenio). Lecture recordings are dropped by default.

    The filter is client-side (over-fetch, then check metadata.category):
    `-category:LECTURES` inside `q` makes the endpoint return an HTML
    error page (verified live 2026-07-16).
    """
    size = limit if include_lectures else max(limit * 5, 25)
    url = CDS_API + "?" + urllib.parse.urlencode(
        {"q": keyword, "size": size, "sort": "-date"})
    data = fetch(url)
    out: list[Candidate] = []
    for hit in data.get("hits", {}).get("hits", []):
        meta = hit.get("metadata", {})
        if meta.get("type") != "VIDEO":
            continue
        if not include_lectures and meta.get("category") == "LECTURES":
            continue
        master = next(
            (f for f in meta.get("_files", [])
             if f.get("context_type") == "master" and f.get("content_type") == "mp4"),
            None)
        if master is None:
            continue
        download = (master.get("links") or {}).get("self", "")
        if not download:
            continue
        tags = master.get("tags") or {}
        resolution = None
        if tags.get("width") and tags.get("height"):
            resolution = f"{tags['width']}x{tags['height']}"
        licenses = meta.get("license") or []
        license_str = ", ".join(
            l.get("license", "") for l in licenses if l.get("license")
        ) or "CERN (copyright.web.cern.ch)"
        recid = str(meta.get("recid") or hit.get("id", ""))
        duration_raw = meta.get("duration") or ""
        out.append(Candidate(
            source="cds",
            id=recid,
            title=strip_html(str((meta.get("title") or {}).get("title", ""))),
            date=str(meta.get("date") or meta.get("publication_date") or ""),
            duration_s=parse_hms(duration_raw) if duration_raw else None,
            resolution=resolution,
            license=license_str,
            credit=(meta.get("copyright") or {}).get("holder"),
            page_url=f"https://videos.cern.ch/record/{recid}",
            download_url=download,
        ))
        if len(out) >= limit:
            break
    return out
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 12 tests.

- [ ] **Step 6: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py tests/fixtures/
git commit -m "feat(discover): HTTP helper, recorded fixtures, CDS Videos adapter"
```

---

### Task 5: NASA adapter

**Files:**
- Modify: `scripts/discover_videos.py` (append)
- Modify: `tests/test_discover_videos.py` (append test class)

**Interfaces:**
- Consumes: `Candidate`, `http_get_json`, `fixture_fetch`, fixtures from Task 4.
- Produces: `NASA_API` constant, `_nasa_best_asset(urls: list[str]) -> str | None`, `search_nasa(keyword: str, limit: int = 5, fetch=http_get_json) -> list[Candidate]`.

- [ ] **Step 1: Write the failing tests** (append)

```python
class NasaTest(unittest.TestCase):
    def test_parses_search_and_resolves_orig_asset(self):
        fetch = fixture_fetch({
            "images-api.nasa.gov/search": "nasa_search_mars.json",
            "collection.json": "nasa_collection_mars.json",
        })
        cands = dv.search_nasa("mars", limit=5, fetch=fetch)
        self.assertEqual(len(cands), 1)
        c = cands[0]
        self.assertEqual(c.source, "nasa")
        self.assertEqual(c.title, "NASA Chopper Ready for a Spin on Mars")
        self.assertEqual(c.date, "2019-06-06")
        self.assertEqual(c.credit, "JPL")
        self.assertIn("Public domain", c.license)
        self.assertEqual(
            c.download_url,
            "http://images-assets.nasa.gov/video/JPL-20190606-TECHf-0001-Mars%20Chopper"
            "%20Ready%20for%20a%20Spin%20on%20Mars/JPL-20190606-TECHf-0001-Mars%20Chopper"
            "%20Ready%20for%20a%20Spin%20on%20Mars~orig.mp4")
        self.assertNotIn(" ", c.download_url)
        self.assertNotIn(" ", c.page_url)

    def test_best_asset_preference(self):
        self.assertEqual(dv._nasa_best_asset(["a~large.mp4", "a~orig.mp4", "a.vtt"]),
                         "a~orig.mp4")
        self.assertEqual(dv._nasa_best_asset(["a.srt", "b.mp4"]), "b.mp4")
        self.assertIsNone(dv._nasa_best_asset(["a.jpg"]))
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `AttributeError: ... no attribute 'search_nasa'`

- [ ] **Step 3: Write the implementation** (append)

```python
NASA_API = "https://images-api.nasa.gov/search"


def _nasa_best_asset(urls: list[str]) -> str | None:
    mp4s = [u for u in urls if u.lower().endswith(".mp4")]
    for marker in ("~orig", "~large", "~medium", "~small"):
        for u in mp4s:
            if marker in u:
                return u
    return mp4s[0] if mp4s else None


def search_nasa(keyword: str, limit: int = 5, fetch=http_get_json) -> list[Candidate]:
    """NASA Image & Video Library. Asset URLs contain spaces -> quoted."""
    url = NASA_API + "?" + urllib.parse.urlencode(
        {"q": keyword, "media_type": "video", "page_size": limit})
    data = fetch(url)
    out: list[Candidate] = []
    for item in data.get("collection", {}).get("items", [])[:limit]:
        d = (item.get("data") or [{}])[0]
        href = item.get("href", "")
        if not href:
            continue
        assets = fetch(urllib.parse.quote(href, safe=":/"))
        if not isinstance(assets, list):
            continue
        best = _nasa_best_asset([u for u in assets if isinstance(u, str)])
        if not best:
            continue
        nasa_id = d.get("nasa_id", "")
        out.append(Candidate(
            source="nasa",
            id=nasa_id,
            title=d.get("title", ""),
            date=(d.get("date_created") or "")[:10],
            duration_s=None,
            resolution=None,
            license="Public domain (NASA media guidelines)",
            credit=d.get("center"),
            page_url="https://images.nasa.gov/details/" + urllib.parse.quote(nasa_id),
            download_url=urllib.parse.quote(best, safe=":/~"),
        ))
    return out
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 14 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py
git commit -m "feat(discover): NASA Image & Video Library adapter"
```

---

### Task 6: djangoplicity (d2d) adapter

**Files:**
- Modify: `scripts/discover_videos.py` (append)
- Modify: `tests/test_discover_videos.py` (append test class)

**Interfaces:**
- Consumes: `Candidate`, `strip_html`, `http_get_json`, `fixture_fetch`, `eso_d2d_page1.json`.
- Produces: `DJANGOPLICITY_SITES: dict[str, str]` (keys `eso`, `hubble`, `webb`, `noirlab`), `_d2d_best_resource(item: dict) -> tuple[str | None, str | None]`, `search_djangoplicity(keyword: str, limit: int = 5, pages: int = 5, site: str = "eso", fetch=http_get_json) -> list[Candidate]`. One call handles ONE site — the CLI (Task 9) enumerates sites so each gets its own error isolation.

- [ ] **Step 1: Write the failing tests** (append)

```python
class DjangoplicityTest(unittest.TestCase):
    def test_parses_real_feed_item(self):
        fetch = fixture_fetch({"eso.org/public/videos/d2d": "eso_d2d_page1.json"})
        cands = dv.search_djangoplicity("beta pictoris", limit=5, pages=3,
                                        site="eso", fetch=fetch)
        self.assertEqual(len(cands), 1)
        c = cands[0]
        self.assertEqual(c.source, "eso")
        self.assertEqual(c.id, "eso2609b")
        self.assertEqual(c.date, "2026-07-15")
        self.assertEqual(c.download_url, "https://cdn.eso.org/videos/ultra_hd/eso2609b.mp4")
        self.assertEqual(c.resolution, "3840x2160")
        self.assertEqual(c.license, "Creative Commons Attribution 4.0 International License")
        self.assertEqual(c.page_url, "https://www.eso.org/public/videos/eso2609b/")
        self.assertEqual(c.credit, "ESO/B. Sutlieff, M. Bonse et al.")

    def test_no_keyword_match(self):
        fetch = fixture_fetch({"eso.org/public/videos/d2d": "eso_d2d_page1.json"})
        self.assertEqual(
            dv.search_djangoplicity("plasma wakefield", site="eso", fetch=fetch), [])

    def _page(self, next_url, item_id, title):
        return {"Count": 2, "Next": next_url, "Collections": [{
            "ID": item_id, "Title": title, "Description": "<p>desc</p>",
            "Credit": "ESO", "Rights": "CC BY 4.0",
            "PublicationDate": "2026-01-01T00:00:00Z",
            "ReferenceURL": f"https://www.eso.org/public/videos/{item_id}/",
            "Assets": [{"MediaType": "Video", "Resources": [
                {"ResourceType": "Original", "Dimensions": [1920.0, 1080.0],
                 "URL": f"https://cdn.eso.org/videos/{item_id}.mp4"}]}],
        }]}

    def test_walks_pages_until_limit_or_exhausted(self):
        page1 = self._page("https://www.eso.org/public/videos/d2d/?page=2",
                           "esoA", "Galaxy spin")
        page2 = self._page(None, "esoB", "Nebula flight")
        fetch = fixture_fetch({"page=2": page2, "d2d": page1})
        hits = dv.search_djangoplicity("nebula", limit=5, pages=5, site="eso", fetch=fetch)
        self.assertEqual([c.id for c in hits], ["esoB"])
        self.assertEqual(
            dv.search_djangoplicity("nebula", limit=5, pages=1, site="eso", fetch=fetch),
            [])

    def test_best_resource_prefers_original_then_area(self):
        item = {"Assets": [{"MediaType": "Video", "Resources": [
            {"ResourceType": "Preview", "Dimensions": [1280.0, 720.0], "URL": "http://x/p.m4v"},
            {"ResourceType": "Original", "Dimensions": [3840.0, 2160.0], "URL": "http://x/o.mp4"},
            {"ResourceType": "Thumbnail", "Dimensions": [220.0, 140.0], "URL": "http://x/t.jpg"},
        ]}]}
        self.assertEqual(dv._d2d_best_resource(item), ("http://x/o.mp4", "3840x2160"))
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `AttributeError: ... no attribute 'search_djangoplicity'`

- [ ] **Step 3: Write the implementation** (append)

```python
DJANGOPLICITY_SITES = {
    "eso": "https://www.eso.org/public/videos/d2d/",
    "hubble": "https://esahubble.org/videos/d2d/",
    "webb": "https://esawebb.org/videos/d2d/",
    "noirlab": "https://noirlab.edu/public/videos/d2d/",
}
_VIDEO_EXTS = (".mp4", ".m4v", ".mov", ".webm")


def _d2d_best_resource(item: dict) -> tuple[str | None, str | None]:
    """(download_url, 'WxH') of the best video rendition: Original wins,
    then largest pixel area."""
    best_url, best_dims, best_score = None, None, -1.0
    for asset in item.get("Assets") or []:
        if asset.get("MediaType") != "Video":
            continue
        for res in asset.get("Resources") or []:
            url = res.get("URL") or ""
            if Path(urllib.parse.urlparse(url).path).suffix.lower() not in _VIDEO_EXTS:
                continue
            dims = res.get("Dimensions") or []
            area = float(dims[0]) * float(dims[1]) if len(dims) == 2 else 0.0
            score = area + (1e12 if res.get("ResourceType") == "Original" else 0.0)
            if score > best_score:
                best_score = score
                best_url = url
                best_dims = f"{int(dims[0])}x{int(dims[1])}" if len(dims) == 2 else None
    return best_url, best_dims


def search_djangoplicity(keyword: str, limit: int = 5, pages: int = 5,
                         site: str = "eso", fetch=http_get_json) -> list[Candidate]:
    """One djangoplicity site's d2d feed (newest-first; no server-side
    search) — walk up to `pages` pages and keyword-filter client-side."""
    kw = keyword.lower()
    out: list[Candidate] = []
    url: str | None = DJANGOPLICITY_SITES[site]
    for _ in range(pages):
        if not url:
            break
        data = fetch(url)
        for item in data.get("Collections") or []:
            text = (item.get("Title", "") + " "
                    + strip_html(item.get("Description") or "")).lower()
            if kw not in text:
                continue
            download, resolution = _d2d_best_resource(item)
            if not download:
                continue
            out.append(Candidate(
                source=site,
                id=item.get("ID", ""),
                title=item.get("Title", ""),
                date=(item.get("PublicationDate") or "")[:10],
                duration_s=None,
                resolution=resolution,
                license=item.get("Rights") or "CC BY 4.0",
                credit=strip_html(item.get("Credit") or "") or None,
                page_url=item.get("ReferenceURL") or "",
                download_url=download,
            ))
            if len(out) >= limit:
                return out
        url = data.get("Next")
    return out
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 18 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py
git commit -m "feat(discover): djangoplicity d2d feed adapter (ESO/Hubble/Webb/NOIRLab)"
```

---

### Task 7: Wikimedia Commons adapter

**Files:**
- Modify: `scripts/discover_videos.py` (append)
- Modify: `tests/test_discover_videos.py` (append test class)

**Interfaces:**
- Consumes: `Candidate`, `strip_html`, `http_get_json`, `fixture_fetch`, `commons_cloud_chamber.json`.
- Produces: `COMMONS_API` constant, `search_commons(keyword: str, limit: int = 5, fetch=http_get_json) -> list[Candidate]`.

- [ ] **Step 1: Write the failing tests** (append)

```python
class CommonsTest(unittest.TestCase):
    def test_parses_results_ordered_by_search_rank(self):
        fetch = fixture_fetch({"commons.wikimedia.org": "commons_cloud_chamber.json"})
        cands = dv.search_commons("cloud chamber", limit=5, fetch=fetch)
        self.assertEqual(len(cands), 2)
        first, second = cands
        self.assertEqual(first.title, "Wilson chamber")
        self.assertEqual(first.id, "113180907")
        self.assertEqual(first.resolution, "1920x1080")
        self.assertAlmostEqual(first.duration_s, 62.936, places=3)
        self.assertEqual(first.license, "CC BY 4.0")
        self.assertEqual(
            first.download_url,
            "https://upload.wikimedia.org/wikipedia/commons/5/5c/Wilson_chamber.webm")
        self.assertEqual(
            first.page_url,
            "https://commons.wikimedia.org/wiki/File:Wilson_chamber.webm")
        self.assertEqual(second.title, "Cloud Chamber")
        self.assertEqual(second.license, "CC BY 3.0")

    def test_limit(self):
        fetch = fixture_fetch({"commons.wikimedia.org": "commons_cloud_chamber.json"})
        self.assertEqual(
            len(dv.search_commons("cloud chamber", limit=1, fetch=fetch)), 1)
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `AttributeError: ... no attribute 'search_commons'`

- [ ] **Step 3: Write the implementation** (append)

```python
COMMONS_API = "https://commons.wikimedia.org/w/api.php"


def search_commons(keyword: str, limit: int = 5, fetch=http_get_json) -> list[Candidate]:
    """Wikimedia Commons file search. Results are often webm/ogv — fine,
    the pipeline's encode step re-encodes anything ffmpeg can read."""
    params = {
        "action": "query", "format": "json",
        "generator": "search",
        "gsrsearch": f"{keyword} filetype:video",
        "gsrnamespace": 6, "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "iiextmetadatafilter": "LicenseShortName|UsageTerms|Artist|DateTimeOriginal",
    }
    data = fetch(COMMONS_API + "?" + urllib.parse.urlencode(params))
    pages = (data.get("query") or {}).get("pages") or {}
    out: list[Candidate] = []
    for page in sorted(pages.values(), key=lambda p: p.get("index", 0)):
        infos = page.get("imageinfo") or []
        if not infos:
            continue
        ii = infos[0]
        meta = ii.get("extmetadata") or {}

        def ext(key: str) -> str | None:
            return strip_html(str((meta.get(key) or {}).get("value", ""))) or None

        resolution = None
        if ii.get("width") and ii.get("height"):
            resolution = f"{ii['width']}x{ii['height']}"
        title = re.sub(r"^File:", "", page.get("title", ""))
        out.append(Candidate(
            source="commons",
            id=str(page.get("pageid", "")),
            title=Path(title).stem,
            date=ext("DateTimeOriginal") or "",
            duration_s=float(ii["duration"]) if ii.get("duration") else None,
            resolution=resolution,
            license=ext("LicenseShortName") or ext("UsageTerms")
                    or "unknown — check file page",
            credit=ext("Artist"),
            page_url=ii.get("descriptionurl") or "",
            download_url=ii.get("url") or "",
        ))
        if len(out) >= limit:
            break
    return out
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 20 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py
git commit -m "feat(discover): Wikimedia Commons adapter"
```

---

### Task 8: Report rendering

**Files:**
- Modify: `scripts/discover_videos.py` (append)
- Modify: `tests/test_discover_videos.py` (append test class)

**Interfaces:**
- Consumes: `Candidate`, `fmt_duration`, `toml_snippet`.
- Produces: `SOURCE_LABELS: dict[str, str]`, `D2D_SOURCES: tuple`, `render_report(candidates: list[Candidate], pages: int) -> str`. Warnings are NOT part of the report — the spec routes them to stderr (Task 9's `main` prints them).

- [ ] **Step 1: Write the failing tests** (append)

```python
class ReportTest(unittest.TestCase):
    def test_report_groups_flags_and_snippets(self):
        fresh = dv.Candidate(source="eso", id="eso1", title="Nebula flight",
                             date="2026-07-15", duration_s=83.0, resolution="3840x2160",
                             license="CC BY 4.0", credit="ESO", page_url="http://p1",
                             download_url="http://d1.mp4")
        known = dv.Candidate(source="cds", id="123", title="LHC overview",
                             date="2019-01-01", duration_s=None, resolution=None,
                             license="CERN", credit=None, page_url="http://p2",
                             download_url="http://d2.mp4", in_registry=True)
        report = dv.render_report([fresh, known], pages=5)
        self.assertIn("== ESO (newest 5 feed pages only", report)
        self.assertIn("[already in registry]", report)
        self.assertIn("download: http://d1.mp4", report)
        self.assertIn("nebula_flight.mp4", report)   # snippet emitted for fresh
        self.assertNotIn("lhc_overview.mp4", report)  # none for the known clip
        self.assertIn("1:23", report)

    def test_report_empty(self):
        self.assertEqual(dv.render_report([], pages=5), "No candidates found.")
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `AttributeError: ... no attribute 'render_report'`

- [ ] **Step 3: Write the implementation** (append)

```python
SOURCE_LABELS = {
    "cds": "CERN CDS Videos",
    "nasa": "NASA Image & Video Library",
    "eso": "ESO",
    "hubble": "ESA/Hubble",
    "webb": "ESA/Webb",
    "noirlab": "NOIRLab",
    "commons": "Wikimedia Commons",
}
D2D_SOURCES = ("eso", "hubble", "webb", "noirlab")


def render_report(candidates: list[Candidate], pages: int) -> str:
    lines: list[str] = []
    by_source: dict[str, list[Candidate]] = {}
    for c in candidates:
        by_source.setdefault(c.source, []).append(c)
    for source, label in SOURCE_LABELS.items():
        group = by_source.get(source)
        if not group:
            continue
        if source in D2D_SOURCES:
            label += f" (newest {pages} feed pages only — raise --pages for deeper history)"
        lines.append(f"== {label} ==")
        for c in sorted(group, key=lambda c: c.date, reverse=True):
            flag = "  [already in registry]" if c.in_registry else ""
            lines.append(f"* {c.title}{flag}")
            details = [x for x in (
                c.date or None,
                fmt_duration(c.duration_s) if c.duration_s is not None else None,
                c.resolution,
                c.license,
            ) if x]
            lines.append(f"    {' | '.join(details)}")
            lines.append(f"    page:     {c.page_url}")
            lines.append(f"    download: {c.download_url}")
        lines.append("")
    fresh = [c for c in candidates if not c.in_registry]
    if fresh:
        lines.append("== Manifest snippets "
                     "(paste into videos/manifest.toml or /videos/shared.toml) ==")
        lines.append("")
        for c in fresh:
            lines.append(toml_snippet(c))
    if not candidates:
        lines.append("No candidates found.")
    return "\n".join(lines)
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 22 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py
git commit -m "feat(discover): grouped report with manifest snippets"
```

---

### Task 9: CLI orchestration

**Files:**
- Modify: `scripts/discover_videos.py` (append)
- Modify: `tests/test_discover_videos.py` (append test class)

**Interfaces:**
- Consumes: every adapter (`search_cds`, `search_nasa`, `search_djangoplicity`, `search_commons`), `dedupe`, `mark_in_registry`, `load_registry_stems`, `render_report`.
- Produces: `build_jobs(keywords, sources, limit, pages, include_lectures) -> list[tuple[str, callable]]`, `main(argv: list[str] | None = None) -> int`, `__main__` guard. Job labels are `f"{source}:{keyword}"` with djangoplicity expanded per site (`eso:kw`, …). Adapters are looked up as module globals at call time so `mock.patch.object` works.

- [ ] **Step 1: Write the failing tests** (append)

```python
class CliTest(unittest.TestCase):
    def _cand(self, **kw):
        base = dict(source="nasa", id="x", title="T", date="2026-01-01",
                    duration_s=None, resolution=None, license="PD",
                    credit=None, page_url="http://p", download_url="http://d.mp4")
        base.update(kw)
        return dv.Candidate(**base)

    def test_build_jobs_enumerates_sources_per_keyword(self):
        jobs = dv.build_jobs(["a"], {"cds", "nasa", "djangoplicity", "commons"},
                             5, 5, False)
        labels = sorted(label for label, _ in jobs)
        self.assertEqual(labels, sorted(
            ["cds:a", "nasa:a", "eso:a", "hubble:a", "webb:a", "noirlab:a",
             "commons:a"]))

    def test_main_isolates_failing_source(self):
        with mock.patch.object(dv, "search_cds", side_effect=RuntimeError("boom")), \
             mock.patch.object(dv, "search_nasa", return_value=[self._cand()]), \
             mock.patch.object(dv, "load_registry_stems", return_value=set()):
            out_buf, err_buf = io.StringIO(), io.StringIO()
            with contextlib.redirect_stdout(out_buf), contextlib.redirect_stderr(err_buf):
                rc = dv.main(["kw", "--source", "cds,nasa"])
        self.assertEqual(rc, 0)
        self.assertIn("WARN cds:kw", err_buf.getvalue())   # warnings go to stderr
        self.assertIn("* T", out_buf.getvalue())           # report stays on stdout

    def test_main_fails_when_all_sources_fail(self):
        with mock.patch.object(dv, "search_cds", side_effect=RuntimeError("boom")), \
             mock.patch.object(dv, "load_registry_stems", return_value=set()):
            with contextlib.redirect_stderr(io.StringIO()):
                rc = dv.main(["kw", "--source", "cds"])
        self.assertEqual(rc, 1)

    def test_main_json_output(self):
        with mock.patch.object(dv, "search_nasa", return_value=[self._cand()]), \
             mock.patch.object(dv, "load_registry_stems", return_value=set()):
            buf = io.StringIO()
            with contextlib.redirect_stdout(buf):
                rc = dv.main(["kw", "--source", "nasa", "--json"])
        self.assertEqual(rc, 0)
        data = json.loads(buf.getvalue())
        self.assertEqual(data[0]["download_url"], "http://d.mp4")
        self.assertFalse(data[0]["in_registry"])

    def test_main_rejects_unknown_source(self):
        with self.assertRaises(SystemExit):
            with contextlib.redirect_stderr(io.StringIO()):
                dv.main(["kw", "--source", "bogus"])
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `python3 -m unittest discover -s tests -v`
Expected: FAIL — `AttributeError: ... no attribute 'build_jobs'`

- [ ] **Step 3: Write the implementation** (append)

```python
VALID_SOURCES = {"cds", "nasa", "djangoplicity", "commons"}


def build_jobs(keywords: list[str], sources: set[str], limit: int, pages: int,
               include_lectures: bool) -> list[tuple[str, object]]:
    """One (label, thunk) per source-site x keyword. Adapters are resolved
    as module globals at call time so tests can patch them."""
    jobs: list[tuple[str, object]] = []
    for kw in keywords:
        if "cds" in sources:
            jobs.append((f"cds:{kw}",
                         lambda kw=kw: search_cds(kw, limit, include_lectures)))
        if "nasa" in sources:
            jobs.append((f"nasa:{kw}", lambda kw=kw: search_nasa(kw, limit)))
        if "djangoplicity" in sources:
            for site in DJANGOPLICITY_SITES:
                jobs.append((f"{site}:{kw}",
                             lambda kw=kw, site=site: search_djangoplicity(
                                 kw, limit, pages, site)))
        if "commons" in sources:
            jobs.append((f"commons:{kw}", lambda kw=kw: search_commons(kw, limit)))
    return jobs


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="videos:discover",
        description="Search open-licensed archives for outreach video candidates.",
        epilog='Example: pnpm videos:discover -- "cloud chamber" --limit 3')
    ap.add_argument("keywords", nargs="+", help="search keywords (each queried everywhere)")
    ap.add_argument("--source", default="cds,nasa,djangoplicity,commons",
                    help="comma-separated subset of: cds,nasa,djangoplicity,commons")
    ap.add_argument("--limit", type=int, default=5,
                    help="max results per source per keyword (default 5)")
    ap.add_argument("--pages", type=int, default=5,
                    help="d2d feed pages to walk per djangoplicity site (default 5)")
    ap.add_argument("--include-lectures", action="store_true",
                    help="keep CDS LECTURES category (excluded by default)")
    ap.add_argument("--json", action="store_true", dest="as_json",
                    help="emit candidates as JSON instead of the report")
    args = ap.parse_args(argv)

    sources = {s.strip() for s in args.source.split(",") if s.strip()}
    unknown = sources - VALID_SOURCES
    if unknown or not sources:
        ap.error(f"unknown --source value(s): {', '.join(sorted(unknown)) or '(empty)'}")

    jobs = build_jobs(args.keywords, sources, args.limit, args.pages,
                      args.include_lectures)
    candidates: list[Candidate] = []
    warnings: list[str] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fn): label for label, fn in jobs}
        for fut in as_completed(futures):
            label = futures[fut]
            try:
                candidates.extend(fut.result())
            except Exception as exc:  # per-job isolation: one bad source can't kill the run
                warnings.append(f"{label}: {type(exc).__name__}: {exc}")

    for w in warnings:
        print(f"WARN {w}", file=sys.stderr)
    if jobs and len(warnings) == len(jobs):
        print("All sources failed.", file=sys.stderr)
        return 1

    candidates = dedupe(candidates)
    mark_in_registry(candidates, load_registry_stems())

    if args.as_json:
        print(json.dumps([asdict(c) for c in candidates], indent=2))
        return 0
    print(render_report(candidates, args.pages))
    return 0


if __name__ == "__main__":
    sys.exit(main())
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 27 tests.

- [ ] **Step 5: Commit**

```bash
git add scripts/discover_videos.py tests/test_discover_videos.py
git commit -m "feat(discover): CLI with parallel per-source jobs and error isolation"
```

---

### Task 10: Wiring, live smoke test, docs

**Files:**
- Modify: `package.json` (repo root — add script)
- Modify: `CLAUDE.md` (repo-root commands section)
- Modify: `tests/test_discover_videos.py` (append live-smoke class)

**Interfaces:**
- Consumes: everything.
- Produces: `pnpm videos:discover` wiring; opt-in `LiveSmokeTest`.

- [ ] **Step 1: Add the live smoke test** (append)

```python
@unittest.skipUnless(os.environ.get("DISCOVER_LIVE") == "1",
                     "live network smoke test; set DISCOVER_LIVE=1 to run")
class LiveSmokeTest(unittest.TestCase):
    def test_each_source_returns_candidates(self):
        self.assertTrue(dv.search_cds("lhc", limit=2, include_lectures=True))
        self.assertTrue(dv.search_nasa("mars", limit=2))
        self.assertTrue(dv.search_djangoplicity("nebula", limit=1, pages=2, site="eso"))
        self.assertTrue(dv.search_commons("cloud chamber", limit=2))
```

- [ ] **Step 2: Verify offline suite still passes and live smoke works**

Run: `python3 -m unittest discover -s tests -v`
Expected: `OK`, 27 tests + 1 skipped.

Run: `DISCOVER_LIVE=1 python3 -m unittest tests.test_discover_videos.LiveSmokeTest -v`
Expected: `OK`, 1 test (network required; if a single archive is down, note it and move on — don't fail the task for an external outage, but say so in the commit/summary).

- [ ] **Step 3: Wire pnpm script**

In root `package.json`, add to `"scripts"` (after `"videos:shared:check"`):

```json
"videos:discover": "python3 scripts/discover_videos.py"
```

- [ ] **Step 4: Document in CLAUDE.md**

In the `## Commands` section, "From repo root:" fenced block, add after the `videos:shared:check` line:

```
pnpm videos:discover -- <kw>…   # search open archives (CDS/NASA/ESO/Hubble/Webb/NOIRLab/Commons)
                                # for new clips; prints report + [[videos]] snippets
```

- [ ] **Step 5: End-to-end run**

```bash
pnpm videos:discover -- "cloud chamber" --limit 3
```

Expected: a report with at least the Commons section (Wilson chamber / Cloud Chamber files), WARN lines only if an archive is down, and a manifest-snippets section with lowercase `name = "..."` entries.

```bash
pnpm videos:discover -- skylapse --source commons --limit 2
```

Expected: any hit whose stem matches `skylapse` is flagged `[already in registry]` (Yaga manifest owns `skylapse.mp4`); zero hits is also acceptable — then the report says "No candidates found."

- [ ] **Step 6: Commit**

```bash
git add package.json CLAUDE.md tests/test_discover_videos.py
git commit -m "feat(discover): pnpm videos:discover wiring, live smoke test, docs"
```
