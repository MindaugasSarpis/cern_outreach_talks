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
