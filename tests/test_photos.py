"""photo_fetch.py without the network: refs, CDS page and licence parsing, image sizes, photos.toml, --dry-run.

python3 -m unittest discover -s tests
"""
import io
import json
import socket
import struct
import sys
import unittest
import zlib
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path
from unittest import mock

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "scripts"))
import photo_fetch as pf    # noqa: E402


def png(w, h):
    raw = b"".join(b"\x00" + b"\x00\x00\x00" * w for _ in range(h))
    chunk = lambda t, d: struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d))
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)) \
        + chunk(b"IDAT", zlib.compress(raw)) + chunk(b"IEND", b"")


def jpeg_header(w, h):
    sof = b"\xff\xc0" + struct.pack(">HBHHB", 11, 8, h, w, 1) + b"\x01\x11\x00"
    app0 = b"\xff\xe0" + struct.pack(">H", 16) + b"JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00"
    return b"\xff\xd8" + app0 + sof + b"\xff\xd9"


class Refs(unittest.TestCase):
    def test_parse(self):
        self.assertEqual(pf.parse_ref("cds:CERN-PHOTO-202204-062-1"), ("cds", "CERN-PHOTO-202204-062-1"))
        self.assertEqual(pf.parse_ref("https://cds.cern.ch/images/CERN-MI-0807031-01/file?size=large"),
                         ("cds", "CERN-MI-0807031-01"))
        self.assertEqual(pf.parse_ref("commons:File:First Web Server.jpg"), ("commons", "File:First_Web_Server.jpg"))
        self.assertEqual(pf.parse_ref("https://commons.wikimedia.org/wiki/File:Bron_-_CERMEP_-_Salle_du_scanner_TEP-CT_de_2010,_vue_d%27ensemble.jpg"),
                         ("commons", "File:Bron_-_CERMEP_-_Salle_du_scanner_TEP-CT_de_2010,_vue_d'ensemble.jpg"))
        for bad in ("cds:", "flickr:123", "commons:Category:CERN", "cds:../../etc"):
            with self.assertRaises(pf.UsageError):
                pf.parse_ref(bad)

    def test_user_agent_names_the_repo(self):
        for ua in (pf.UA, pf.BROWSER_UA):
            self.assertIn("github.com/MindaugasSarpis/cern_outreach_talks", ua)
            self.assertNotIn("@", ua)


class Parsing(unittest.TestCase):
    def test_cds_page(self):
        m = pf.parse_cds_page((HERE / "fixtures" / "cds_image_page.html").read_text(encoding="utf-8"))
        self.assertEqual(m["recid"], "2806314")
        self.assertEqual(m["photographer"], "Brice, Maximilien")
        lic, holder = pf.cds_licence(m["licence_text"])
        self.assertEqual((lic, holder), ("CERN terms (non-commercial)", "CERN"))
        self.assertEqual(pf.cds_credit(lic, holder, m["photographer"]), "Photo: Maximilien Brice/CERN")

    def test_cds_licences(self):
        self.assertEqual(pf.cds_licence("© CERN, Licence: CC-BY-SA-4.0")[0], "CC BY-SA 4.0")
        self.assertEqual(pf.cds_credit("CC BY 4.0", "CERN", "Hertzog, Samuel Joseph"), "Photo: Samuel Joseph Hertzog/CERN, CC BY 4.0")
        lic, holder = pf.cds_licence("© MARS Bioimaging Limited")
        self.assertEqual(lic, "© MARS Bioimaging Limited, all rights reserved")
        self.assertEqual(pf.cds_credit(lic, holder, "Butler, Anthony"), "Image: MARS Bioimaging Limited")

    def test_bot_check(self):
        self.assertTrue(pf.is_bot_check("<html><script src='/.within.website/x/cmd/anubis/'></script></html>"))
        self.assertFalse(pf.is_bot_check((HERE / "fixtures" / "cds_image_page.html").read_text(encoding="utf-8")))

    def test_image_size(self):
        self.assertEqual(pf.image_size(png(3, 2)), [3, 2])
        self.assertEqual(pf.image_size(jpeg_header(1440, 1002)), [1440, 1002])
        self.assertIsNone(pf.image_size(b"GIF89a"))


class Bank(unittest.TestCase):
    def test_committed_bank(self):
        self.assertEqual(pf.check_bank(), [])
        photos = pf.load_bank()
        self.assertGreaterEqual(len(photos), 20)
        self.assertTrue(pf.recorded("cds", "CERN-PHOTO-202204-062-1"))

    def test_toml_entry_round_trip(self):
        import tomllib
        e = {"subject": 'A "quoted" subject', "file": "x-1.jpg", "source_url": "https://cds.cern.ch/images/X-1",
             "licence": "CC BY 4.0", "credit": "Photo: A/CERN, CC BY 4.0", "verified_on": "2026-10-08", "px": [10, 20]}
        self.assertEqual(tomllib.loads(pf.toml_entry(e))["photo"][0], e)


class DryRun(unittest.TestCase):
    def test_no_request(self):
        def refuse(*a, **k):
            raise AssertionError("dry run touched the network")
        out = io.StringIO()
        with mock.patch.object(socket, "create_connection", refuse), mock.patch.object(socket.socket, "connect", refuse), \
                mock.patch.object(pf.urllib.request, "urlopen", refuse), redirect_stdout(out), redirect_stderr(io.StringIO()):
            rc = pf.main(["cds:CERN-PHOTO-202204-062-1", "--dry-run", "--json"])
        self.assertEqual(rc, 0)
        p = json.loads(out.getvalue())
        self.assertEqual(p["recorded"]["licence"], "CERN terms (non-commercial)")
        self.assertEqual(p["recorded"]["credit"], "Photo: Maximilien Brice/CERN")
        self.assertNotIn("@", p["user_agent"])

    def test_usage(self):
        with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
            self.assertEqual(pf.main([]), 2)
            self.assertEqual(pf.main(["flickr:1"]), 2)
            self.assertEqual(pf.main(["commons:File:A.jpg", "--browser", "--dry-run"]), 2)


if __name__ == "__main__":
    unittest.main()
