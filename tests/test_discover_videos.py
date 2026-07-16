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


if __name__ == "__main__":
    unittest.main()
