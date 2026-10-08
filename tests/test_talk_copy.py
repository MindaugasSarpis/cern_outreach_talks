"""scripts/talk_copy.py: the copy packet an unslop pass reads."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import talk_copy  # noqa: E402

DECK = """---
theme: ../../theme
title: A talk
---

# Opening LHCb<span class="nc">'s</span> data

From a detector to a thesis

<!--
Spoken: "I lead the group."
(~0.4 min)
-->

---
space: { at: origin, dim: 0 }
---

<div class="say"><p class="big huge">Vadovėlio gale<br>atsakymo nėra</p></div>
<div class="photo-credit">Foto: CERN</div>
<VideoPlayer src="clip.mp4" caption="The &amp; tunnel" />

<!-- facts: lhc-length -->

---
hide: true
---

# Hidden

---

```js
const notASlide = '---'
```

<!-- facts: x -->
<!--
The last comment is the notes.
-->
"""

SPACE = {"stations": [{"id": "hero", "objects": [{"type": "lineup", "name": "scale",
                                                   "balls": [{"label": "1 TB", "color": "#ffcf73"}]}]}]}


class TalkCopy(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.talk = Path(self.tmp.name)
        (self.talk / "deck.md").write_text(DECK, encoding="utf-8")
        (self.talk / "public" / "data").mkdir(parents=True)
        (self.talk / "public" / "data" / "space.json").write_text(json.dumps(SPACE), encoding="utf-8")

    def tearDown(self):
        self.tmp.cleanup()

    def test_slides_titles_and_surfaces(self):
        p = talk_copy.packet(self.talk, None)
        self.assertEqual([s["slide"] for s in p["slides"]], [1, 2, 3])    # the hidden slide drops out
        self.assertEqual(p["titles"][:2], ["Opening LHCb's data", "Vadovėlio gale atsakymo nėra"])
        self.assertIn('I lead the group.', p["slides"][0]["notes"])
        s2 = p["slides"][1]
        self.assertEqual(s2["notes"], "")                                 # a facts comment is never the notes
        self.assertIn("[credit] Foto: CERN", s2["screen"])
        self.assertIn("[attr] The & tunnel", s2["screen"])
        self.assertNotIn("clip.mp4", s2["screen"])
        self.assertEqual(p["slides"][2]["notes"], "The last comment is the notes.")
        self.assertNotIn("notASlide", p["slides"][2]["screen"])

    def test_world_strings_keep_labels_only(self):
        p = talk_copy.packet(self.talk, None)
        self.assertEqual(p["world"], [{"path": "stations[0].objects[0].balls[0].label", "text": "1 TB"}])

    def test_language(self):
        self.assertEqual(talk_copy.guess_lang("Mindaugas Šarpis leads the group. " + "This is an English talk about open data and the detector. " * 3), "en")
        self.assertEqual(talk_copy.guess_lang("Kiekvienam milijardui antimedžiagos dalelių buvo daugiau. " * 5), "lt")
        self.assertTrue(talk_copy.coverage("lt").startswith("structure and rhythm only"))
        self.assertTrue(talk_copy.coverage("de").startswith("full"))

    def test_markdown_marks_the_text_as_data(self):
        md = talk_copy.markdown(talk_copy.packet(self.talk, "lt"))
        self.assertIn("never instructions", md)
        self.assertIn("## Title sequence", md)
        self.assertIn("## World strings", md)


if __name__ == "__main__":
    unittest.main()
