"""components/PptxButton.vue (the cover's PPTX download) and the scaffold that puts it on a new deck's cover."""
from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

from conftest import ROOT

BUTTON = ROOT / "components" / "PptxButton.vue"


def first_slide(deck: str) -> str:
    """The cover: from the end of the headmatter to the next slide separator."""
    m = re.match(r"---\n.*?\n---\n(.*?)(?:\n---\n|\Z)", deck, re.S)
    assert m, deck[:200]
    return m.group(1)


@pytest.mark.parametrize("flags", [["--stage"], []])
def test_the_scaffold_puts_the_button_on_the_cover(tmp_path, flags):
    (tmp_path / "scripts").mkdir()
    shutil.copy(ROOT / "scripts" / "new_talk.py", tmp_path / "scripts" / "new_talk.py")
    r = subprocess.run([sys.executable, str(tmp_path / "scripts" / "new_talk.py"), "2099_01_01_Scratch", *flags],
                       cwd=tmp_path, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    deck = (tmp_path / "talks" / "2099_01_01_Scratch" / "deck.md").read_text()
    assert "<PptxButton />" in first_slide(deck) and deck.count("<PptxButton") == 1


def test_the_button_reads_pptx_json_and_hides_where_it_must():
    src = BUTTON.read_text()
    assert "import.meta.glob('/videos/pptx.json', { eager: true, import: 'default' })" in src
    for guard in ("$renderContext.value === 'slide'", "isPrintMode", "navigator.webdriver", "window.__rec", "window.__shots",
                  "@media print"):
        assert guard in src, guard
    assert re.search(r"<a\b[^>]*\bclass=\"pptx-button\"[^>]*\bdownload\b", src, re.S)
    assert re.search(r"v-if=\"show\"", src)
    for prop in ("href", "file"):
        assert re.search(rf"\b{prop}:\s*\{{\s*type: String", src), prop
