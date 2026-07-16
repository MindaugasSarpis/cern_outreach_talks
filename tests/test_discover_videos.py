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


if __name__ == "__main__":
    unittest.main()
