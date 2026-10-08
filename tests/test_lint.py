"""talk_lint.py, talk_map.py and the deck parser on two small fixture talks.

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
import talk_deck as td      # noqa: E402
import talk_lint            # noqa: E402
import talk_map             # noqa: E402

FIX = HERE / "fixtures"
LT = FIX / "lt_talk"
EN = FIX / "en_talk"
NOTES = FIX / "notes_src_talk"
BANK = FIX / "facts.jsonl"


def lint(talk, release=False):
    return talk_lint.Lint(talk, release, BANK).run()


def codes(lt, code):
    return [f for f in lt.findings if f.code == code]


class DeckParser(unittest.TestCase):
    def test_slides_frontmatter_notes(self):
        d = td.parse_deck(EN / "deck.md")
        self.assertEqual(len(d.slides), 6)
        self.assertEqual([s.number for s in d.slides], [1, None, 2, 3, 4, 5])
        self.assertEqual(d.headmatter["duration"], "10min")
        self.assertEqual(d.slides[0].layout, "cover")
        self.assertTrue(d.slides[1].hidden)
        self.assertTrue(d.slides[2].notes.startswith("Speaker (~2 min)"))
        self.assertIn("not a slide separator", d.slides[2].content)     # fenced --- skipped

    def test_flow_mapping(self):
        d = td.parse_deck(LT / "deck.md")
        self.assertEqual(d.slides[2].frontmatter["space"], {"at": "hero", "dist": 12})
        self.assertEqual(d.headmatter["addons"], ["slidev-addon-videos", "slidev-addon-stage"])

    def test_yaml_subset(self):
        y = td.parse_yaml("a: 1\nb: { x: [1, 2.5, 'q'], y: true }  # c\ninfo: |\n  two\n  lines\nlist:\n  - one\n  - k: v\n")
        self.assertEqual(y["a"], 1)
        self.assertEqual(y["b"], {"x": [1, 2.5, "q"], "y": True})
        self.assertEqual(y["info"], "two\nlines\n")
        self.assertEqual(y["list"], ["one", {"k": "v"}])

    def test_durations(self):
        self.assertEqual(td.parse_duration("30min"), 30)
        self.assertEqual(td.parse_duration("1h30min"), 90)
        self.assertEqual(td.parse_duration("6:30"), 6.5)
        self.assertEqual(td.parse_duration(12), 12)
        self.assertIsNone(td.parse_duration("soon"))


class LithuanianFixture(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.l = lint(LT)

    def test_lang(self):
        self.assertEqual(self.l.lang, "lt")

    def test_cyrillic(self):
        f = codes(self.l, "CYRILLIC")
        self.assertEqual(len(f), 1)
        self.assertEqual((f[0].severity, f[0].slide), ("error", 3))

    def test_lhcb_uppercase(self):
        hits = sorted((f.slide, f.line) for f in codes(self.l, "LHCB-UPPER"))
        # the cover byline, the section title, the kicker; the cover title's <span class="nc"> is fine
        self.assertEqual([s for s, _ in hits], [1, 2, 3])
        byline = codes(self.l, "LHCB-UPPER")[0]
        self.assertIn(".mt-md", byline.message)
        self.assertEqual(byline.severity, "error")

    def test_check_warning_then_error(self):
        # [CHECK …] and [PATIKSLINTI …] on slide 3, [ASR …] on slide 5; the headmatter's
        # info, which names [PATIKSLINTI], is not a mark
        found = codes(self.l, "CHECK")
        self.assertEqual([(f.slide, f.line) for f in found], [(3, 50), (3, 51), (5, 72)])
        self.assertEqual({f.severity for f in found}, {"warning"})
        self.assertIn("[PATIKSLINTI: ar tikrai 5600 tonų?]", found[1].message)
        self.assertIn("[ASR: re-listen]", found[2].message)
        self.assertEqual([f.severity for f in codes(lint(LT, release=True), "CHECK")], ["error"] * 3)

    def test_optional_mark_stays_a_warning(self):
        # [PATIKSLINTI, neprivaloma: …] on slide 5 is a question the talk can go without
        for release in (False, True):
            found = codes(lint(LT, release=release), "CHECK-OPTIONAL")
            self.assertEqual([(f.slide, f.line, f.severity) for f in found], [(5, 73, "warning")])
            self.assertIn("[PATIKSLINTI, neprivaloma: ar paminėti, kas pakvietė]", found[0].message)

    def test_optional_pattern(self):
        opt = lambda s: bool(talk_lint.OPTIONAL_MARK.search(s))
        self.assertTrue(all(map(opt, ("[CHECK, optional: x]", "[PATIKSLINTI, neprivaloma: …]",
                                      "[PATIKSLINTI (neprivaloma) kas?]", "[CHECK optional]", "[TODO, Optional: poza]"))))
        self.assertFalse(any(map(opt, ("[CHECK: is it optional?]", "[CHECK the optional part]",
                                       "[PATIKSLINTI: privaloma]", "[PATIKSLINTI]", "optional [CHECK]"))))

    def test_open_marks_pattern(self):
        hit = lambda s: bool(talk_lint.OPEN_MARK.search(s))
        self.assertTrue(all(map(hit, ("[CHECK]", "[CHECK: masė]", "[PATIKSLINTI, neprivaloma: …]",
                                      "09:53 [ASR]", "[TODO poza]"))))
        self.assertFalse(any(map(hit, ("[CHECKED]", "[ASRS]", "[check]", "CHECK:", "[Patikslinta]"))))

    def test_timing_over(self):
        t = self.l.timing
        # 0.5 + 0.5 + 3 + 1 (manifest trim wins over the frames index and the notes) + 2.5
        self.assertAlmostEqual(t["total_minutes"], 7.5)
        self.assertEqual(t["duration_minutes"], 5)
        self.assertEqual(len(codes(self.l, "TIME-OVER")), 1)
        self.assertEqual(codes(self.l, "TIME-NODUR"), [])

    def test_facts(self):
        self.assertEqual([f.message for f in codes(self.l, "FACT-UNKNOWN")], ["fact 'lt-missing-fact' is not in the bank"])
        self.assertEqual(len(codes(self.l, "FACT-UNUSABLE")), 1)

    def test_lithuanian_typography(self):
        self.assertTrue(any("6,8" in f.message for f in codes(self.l, "LT-DECIMAL")))
        self.assertEqual(len(codes(self.l, "LT-QUOTES")), 1)
        self.assertTrue(any("26 659" in f.message for f in codes(self.l, "LT-THOUSANDS")))
        self.assertEqual([f.slide for f in codes(self.l, "LT-ENGLISH")], [5])

    def test_other_checks(self):
        self.assertEqual([f.slide for f in codes(self.l, "EMOJI-HEADING")], [3])
        self.assertEqual([f.slide for f in codes(self.l, "NO-SRC")], [3])
        small = codes(self.l, "FONT-SMALL")
        self.assertEqual(len(small), 1)
        self.assertIn(".card p", small[0].message)

    def test_cli_exit_and_json(self):
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            rc = talk_lint.main([str(LT), "--json", "--facts", str(BANK)])
        self.assertEqual(rc, 1)
        rep = json.loads(out.getvalue())
        self.assertFalse(rep["ok"])
        self.assertEqual(rep["lang"], "lt")
        self.assertIn("LHCB-UPPER", rep["counts"])
        self.assertIn("error(s)", err.getvalue())


class CleanFixture(unittest.TestCase):
    def test_no_errors(self):
        l = lint(EN)
        errors = [f for f in l.findings if f.severity == "error"]
        self.assertEqual(errors, [], [(f.code, f.message) for f in errors])
        self.assertEqual(l.lang, "en")
        # cover 1 + 2 + the clip's 0:30 from its comment + 1.5 over a loop (the loop adds nothing) + 0.5;
        # the hidden slide's 5 min do not count
        self.assertAlmostEqual(l.timing["total_minutes"], 5.5)
        self.assertEqual(codes(l, "SLIDE-REF"), [])

    def test_exit_zero(self):
        with redirect_stdout(io.StringIO()):
            self.assertEqual(talk_lint.main([str(EN), "--facts", str(BANK)]), 0)

    def test_release_with_an_optional_check(self):
        # the deck's only mark is [CHECK, optional: …]: --release still passes
        l = lint(EN, release=True)
        self.assertEqual([f.code for f in l.findings if f.severity == "error"], [])
        self.assertEqual([f.slide for f in codes(l, "CHECK-OPTIONAL")], [2])
        with redirect_stdout(io.StringIO()):
            self.assertEqual(talk_lint.main([str(EN), "--release", "--facts", str(BANK)]), 0)

    def test_optional_mark_on_screen_is_an_open_check(self):
        # Slidev shows a bracket in the slide text as it is, so 'optional' only counts in the notes or a comment
        with tempfile.TemporaryDirectory() as d:
            talk = Path(d) / "en_talk"
            shutil.copytree(EN, talk)
            deck = (talk / "deck.md").read_text(encoding="utf-8")
            deck = deck.replace("<div class=\"mt-md\">A. Speaker",
                                "Run 3 started in 2022 [CHECK, optional: the month]\n\n"
                                "<!-- [TODO, optional: a photo of the cavern] -->\n\n<div class=\"mt-md\">A. Speaker")
            (talk / "deck.md").write_text(deck, encoding="utf-8")
            l = lint(talk, release=True)
            self.assertEqual([(f.slide, f.line, f.severity) for f in codes(l, "CHECK")], [(1, 17, "error")])
            self.assertIn("on screen", codes(l, "CHECK")[0].message)
            self.assertEqual([(f.slide, f.line) for f in codes(l, "CHECK-OPTIONAL")], [(1, 19), (2, 55)])
            with redirect_stdout(io.StringIO()):
                self.assertEqual(talk_lint.main([str(talk), "--release", "--facts", str(BANK)]), 1)

    def test_usage_errors(self):
        with redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
            self.assertEqual(talk_lint.main([]), 2)
            self.assertEqual(talk_lint.main([str(FIX / "no_such_talk")]), 2)


class SourcesInNotes(unittest.TestCase):
    def lint_text(self, deck: str):
        with tempfile.TemporaryDirectory() as d:
            (Path(d) / "deck.md").write_text(deck, encoding="utf-8")
            return lint(Path(d))

    def test_notes_mode(self):
        # `sources: notes`: 'Sources:', 'Šaltiniai:' and a .src footer all do; slide 5 has none
        l = lint(NOTES)
        self.assertEqual(l.sources, "notes")
        found = codes(l, "NO-SRC")
        self.assertEqual([f.slide for f in found], [5])
        self.assertEqual(found[0].severity, "warning")
        self.assertIn("'Sources:' line in its notes", found[0].message)

    def test_default_mode_names_the_choice(self):
        l = self.lint_text((NOTES / "deck.md").read_text(encoding="utf-8").replace("sources: notes\n", ""))
        self.assertEqual(l.sources, "slides")
        found = codes(l, "NO-SRC")
        self.assertEqual([f.slide for f in found], [2, 3, 5])
        self.assertIn("its notes have a 'Sources:' line, so if the deck keeps its sources there, "
                      "say `sources: notes` in the headmatter", found[0].message)
        self.assertIn("'Šaltiniai:' line", found[1].message)
        self.assertNotIn("sources: notes", found[2].message)       # slide 5's notes have no source line

    def test_unknown_value(self):
        l = self.lint_text((NOTES / "deck.md").read_text(encoding="utf-8").replace("sources: notes", "sources: footer"))
        found = codes(l, "NO-SRC")
        self.assertEqual([(f.line, f.slide) for f in found][0], (1, None))
        self.assertIn("neither slides nor notes", found[0].message)
        self.assertEqual([f.slide for f in found[1:]], [2, 3, 5])

    def test_notes_source_pattern(self):
        hit = lambda s: bool(talk_lint.NOTES_SRC.search(s))
        self.assertTrue(all(map(hit, ("Sources: a · b", "x\nSource: CERN", "Šaltiniai: home.cern",
                                      "  - Šaltinis: lrt.lt", "References (checked 2026-10-08): arXiv"))))
        self.assertFalse(any(map(hit, ("The source for 600 PB is open.", "Sources say so", "Resources: none"))))


class Map(unittest.TestCase):
    def test_rows(self):
        m = talk_map.build(EN)
        self.assertEqual([r["slide"] for r in m["slides"]], [1, 2, 3, 4, 5])
        self.assertEqual(m["slides"][0]["title"], "Inside the detector")
        self.assertEqual(m["slides"][1]["title"], "What LHCb measures")
        self.assertEqual(m["slides"][2]["video"], "zoom.mp4")
        self.assertEqual(m["slides"][2]["minutes"], 0.5)
        self.assertEqual(m["hidden_slide_lines"], [23])
        lt = talk_map.build(LT)
        self.assertEqual(lt["slides"][2]["at"], "hero")
        self.assertEqual(lt["slides"][3]["minutes"], 1.0)


if __name__ == "__main__":
    unittest.main()
