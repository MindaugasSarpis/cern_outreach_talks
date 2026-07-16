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


if __name__ == "__main__":
    unittest.main()
