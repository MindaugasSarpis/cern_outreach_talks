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
