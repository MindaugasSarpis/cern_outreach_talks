"""facts.py: schema, public sources, search, the add/show/check verbs, and the committed bank.

python3 -m unittest discover -s tests
"""
import io
import json
import shutil
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "scripts"))
import facts as fx      # noqa: E402

FIX = HERE / "fixtures" / "facts.jsonl"


def good(**kw):
    e = {"id": "lhc-circumference", "claim_en": "The LHC ring is 26 659 m round.", "claim_lt": None,
         "value": 26659, "unit": "m", "as_of": "2026", "source_url": "https://home.cern/science/accelerators/large-hadron-collider/",
         "quote": None, "verdict": "confirmed", "verified_on": "2026-10-07", "verified_by": "test", "used_in": []}
    e.update(kw)
    return e


def run(*argv):
    out, err = io.StringIO(), io.StringIO()
    with redirect_stdout(out), redirect_stderr(err):
        rc = fx.main(list(argv))
    return rc, out.getvalue(), err.getvalue()


class Schema(unittest.TestCase):
    def test_good_entry(self):
        self.assertEqual(fx.validate(good()), [])

    def test_bad_entries(self):
        self.assertTrue(any("slug" in e for e in fx.validate(good(id="Not A Slug"))))
        self.assertTrue(any("unknown keys" in e for e in fx.validate(good(note="x"))))
        e = good()
        del e["quote"]
        self.assertTrue(any("missing keys" in x for x in fx.validate(e)))
        self.assertTrue(any("verdict" in x for x in fx.validate(good(verdict="maybe"))))
        self.assertTrue(any("as_of" in x for x in fx.validate(good(as_of="Oct 2026"))))
        self.assertTrue(any("verified_on is required" in x for x in fx.validate(good(verified_on=None))))
        self.assertEqual(fx.validate(good(verdict="unverified", verified_on=None, verified_by=None)), [])

    def test_public_sources(self):
        for url in ("https://drive.google.com/file/d/x", "https://docs.google.com/document/d/x",
                    "https://mail.google.com/mail/u/0", "https://calendar.google.com/x",
                    "http://localhost:3030/", "http://192.168.1.4/a", "file:///home/x.pdf",
                    "https://user:pw@example.org/", "https://a.example.org/x https://b.example.org/y",
                    "https://x.sharepoint.com/sites/a", "", None):
            self.assertIsNotNone(fx.public_url_problem(url), url)
        for url in ("https://home.cern/about", "http://web.archive.org/web/2022/https://x.org/",
                    "https://arxiv.org/abs/2106.07701", "https://www.vu.lt/en/all-news/x"):
            self.assertIsNone(fx.public_url_problem(url), url)


class Search(unittest.TestCase):
    def setUp(self):
        self.entries = [
            good(id="gave-touch-stumpe-1972", claim_en="In 1972 Bent Stumpe proposed a capacitive touch screen."),
            good(id="lhcb-vilnius", claim_en="Dr Šarpis leads LHCb Vilnius.", claim_lt="LHCb Vilnius grupė"),
            good(id="cern-founding", claim_en="CERN was founded in 1954."),
        ]

    def test_rank_and_fold(self):
        hits = fx.search(self.entries, ["touchscreen"])
        self.assertEqual([e["id"] for _, e in hits], ["gave-touch-stumpe-1972"])
        self.assertEqual([e["id"] for _, e in fx.search(self.entries, ["sarpis"])], ["lhcb-vilnius"])
        self.assertEqual([e["id"] for _, e in fx.search(self.entries, ["grupe"])], ["lhcb-vilnius"])
        both = fx.search(self.entries, ["1954", "cern"])
        self.assertEqual(both[0][1]["id"], "cern-founding")

    def test_slugify_and_dupes(self):
        self.assertEqual(fx.slugify("The LHC is 27 km round", set()), "lhc-27-km-round")
        self.assertEqual(fx.slugify("The LHC is 27 km round", {"lhc-27-km-round"}), "lhc-27-km-round-2")
        a = good(id="a", claim_en="CERN signed 89 knowledge transfer contracts in the year 2025 alone")
        b = good(id="b", claim_en="CERN signed 89 knowledge transfer contracts in the year 2025")
        self.assertEqual([(x, y) for x, y, _ in fx.near_duplicates([a, b])], [("a", "b")])

    def test_cited_ids(self):
        self.assertEqual(fx.cited_ids("x <!-- facts: a-1, b-2 c --> y <!--fact: d-->"), ["a-1", "b-2", "c", "d"])

    def test_page_key(self):
        k = fx.page_key
        self.assertEqual(k("https://www.cerncourier.com/a/touch/"), k("http://cerncourier.com/a/touch#top"))
        self.assertNotEqual(k("https://cerncourier.com/?p=1"), k("https://cerncourier.com/?p=2"))
        self.assertEqual(k("https://home.cern"), "home.cern/")

    def test_same_page_usable_only(self):
        a = good(id="a", source_url="https://cerncourier.com/a/touch/")
        b = good(id="b", source_url="https://cerncourier.com/a/touch", verified_by="another run")
        c = good(id="c", source_url="https://cerncourier.com/a/touch", verdict="refuted")
        d = good(id="d", source_url="https://home.cern/")
        self.assertEqual({k: [e["id"] for e in v] for k, v in fx.same_page([a, b, c, d]).items()},
                         {"cerncourier.com/a/touch": ["a", "b"]})


class Cli(unittest.TestCase):
    def setUp(self):
        self.dir = Path(tempfile.mkdtemp())
        (self.dir / "research").mkdir()
        (self.dir / "talks" / "t1").mkdir(parents=True)
        self.bank = self.dir / "research" / "facts.jsonl"
        shutil.copy(FIX, self.bank)

    def tearDown(self):
        shutil.rmtree(self.dir)

    def test_search_show(self):
        rc, out, _ = run("search", "byte", "--facts", str(self.bank), "--json")
        self.assertEqual(rc, 0)
        self.assertEqual(json.loads(out)["results"][0]["id"], "en-known-fact")
        rc, out, _ = run("byte", "--facts", str(self.bank))            # a bare word searches
        self.assertEqual(rc, 0)
        self.assertIn("en-known-fact", out)
        self.assertEqual(run("search", "zzzz", "--facts", str(self.bank))[0], 1)
        rc, out, _ = run("show", "en-known", "--facts", str(self.bank), "--json")   # unique prefix
        self.assertEqual((rc, json.loads(out)["fact"]["id"]), (0, "en-known-fact"))
        self.assertEqual(run("show", "nope", "--facts", str(self.bank))[0], 1)

    def test_add_flags_and_refusals(self):
        rc, out, _ = run("add", "--facts", str(self.bank), "--claim-en", "CERN was founded in 1954.",
                         "--source-url", "https://home.cern/about/who-we-are/our-history", "--value", "1954",
                         "--as-of", "1954-09-29", "--verified-by", "test", "--used-in", "t1", "--json")
        self.assertEqual(rc, 0, out)
        added = json.loads(out)["added"]
        self.assertEqual(added, ["cern-founded-1954"])
        lines = self.bank.read_text(encoding="utf-8").splitlines()
        ids = [json.loads(x)["id"] for x in lines]
        self.assertEqual(ids, sorted(ids))
        e = {x["id"]: x for x in map(json.loads, lines)}["cern-founded-1954"]
        self.assertEqual((e["value"], e["verdict"]), (1954, "confirmed"))
        self.assertTrue(e["verified_on"])
        # private source, duplicate id
        self.assertEqual(run("add", "--facts", str(self.bank), "--claim-en", "x", "--source-url",
                             "https://drive.google.com/file/d/abc", "--verified-by", "t")[0], 1)
        self.assertEqual(run("add", "--facts", str(self.bank), "--id", "en-known-fact", "--claim-en", "x",
                             "--source-url", "https://home.cern/", "--verified-by", "t")[0], 1)
        self.assertEqual(run("add", "--facts", str(self.bank), "--claim-en", "x")[0], 2)

    def test_add_from_json_loose(self):
        src = self.dir / "run.json"
        src.write_text(json.dumps([
            {"id": "lt-test", "claim": "Old wording", "corrected_claim": "New wording, corrected.",
             "verdict": "corrected", "source_url": "https://drive.google.com/x",
             "evidence_url": "https://home.cern/x ; https://other.org", "date": "2018-01-08", "confidence": "high"},
        ]), encoding="utf-8")
        self.assertEqual(run("add", "--facts", str(self.bank), "--from-json", str(src))[0], 1)   # strict: unknown keys
        rc, out, _ = run("add", "--facts", str(self.bank), "--from-json", str(src), "--loose",
                         "--verified-by", "a run", "--json")
        self.assertEqual(rc, 0, out)
        e = {x["id"]: x for x in map(json.loads, self.bank.read_text(encoding="utf-8").splitlines())}["lt-test"]
        self.assertEqual((e["claim_en"], e["source_url"], e["as_of"]), ("New wording, corrected.", "https://home.cern/x", "2018-01-08"))
        self.assertIn("confidence", json.loads(out)["notes"][0])

    def test_check(self):
        rc, out, _ = run("check", "--facts", str(self.bank), "--json")
        rep = json.loads(out)
        self.assertEqual((rc, rep["ok"], rep["facts"]), (0, True, 3))
        (self.dir / "talks" / "t1" / "deck.md").write_text("<!-- facts: lt-unverified-fact, ghost -->\n", encoding="utf-8")
        with self.bank.open("a", encoding="utf-8") as f:
            f.write(self.bank.read_text(encoding="utf-8").splitlines()[0] + "\n")
        rc, out, _ = run("check", "--facts", str(self.bank), "--json")
        errs = json.loads(out)["errors"]
        self.assertEqual(rc, 1)
        self.assertTrue(any("duplicate id" in e for e in errs))
        self.assertTrue(any("unknown fact 'ghost'" in e for e in errs))
        self.assertTrue(any("verdict unverified" in e for e in errs))


    def test_same_page_show_and_check(self):
        rc, out, _ = run("show", "lt-known-fact", "--facts", str(self.bank), "--json")
        self.assertEqual(json.loads(out)["same_page"], [])          # the other home.cern fact is unverified
        new = self.dir / "new.jsonl"
        new.write_text(json.dumps(good(id="cern-page-fact", source_url="https://www.home.cern", verified_by="run b")),
                       encoding="utf-8")
        self.assertEqual(run("add", "--facts", str(self.bank), "--from-json", str(new))[0], 0)
        self.assertIn("same page: cern-page-fact", run("show", "lt-known-fact", "--facts", str(self.bank))[1])
        rc, out, _ = run("check", "--facts", str(self.bank), "--json")
        runs = [w for w in json.loads(out)["warnings"] if "checked by 2 runs" in w]
        self.assertEqual(rc, 0)
        self.assertEqual(len(runs), 1)
        self.assertTrue(runs[0].endswith("cern-page-fact, lt-known-fact"), runs[0])
        # one re-check of both clears it
        new.write_text(json.dumps(good(id="cern-page-fact", source_url="https://home.cern/", verified_by="test")),
                       encoding="utf-8")
        self.assertEqual(run("add", "--facts", str(self.bank), "--from-json", str(new), "--replace")[0], 0)
        rc, out, _ = run("check", "--facts", str(self.bank), "--json")
        self.assertFalse([w for w in json.loads(out)["warnings"] if " runs; " in w])


class CommittedBank(unittest.TestCase):
    def test_bank_is_valid(self):
        entries, problems = fx.load_bank(fx.BANK)
        self.assertEqual(problems, [])
        self.assertGreaterEqual(len(entries), 228)
        ids = [e["id"] for e in entries]
        self.assertEqual(len(ids), len(set(ids)))
        self.assertEqual(ids, sorted(ids))

    def test_touchscreen_entry(self):
        entries, _ = fx.load_bank(fx.BANK)
        top = [e for _, e in fx.search(entries, ["touchscreen"])[:5]]
        stumpe = [e for e in top if "Stumpe" in e["claim_en"] and "1972" in e["claim_en"]]
        self.assertTrue(stumpe)
        self.assertTrue(stumpe[0]["source_url"].startswith("https://"))

    def test_no_private_data(self):
        text = fx.BANK.read_text(encoding="utf-8")
        for needle in ("@gmail", "drive.google", "docs.google", "mail.google", "calendar.google"):
            self.assertNotIn(needle, text)


if __name__ == "__main__":
    unittest.main()
