"""scripts/site_index.py: the Pages landing page (deploy.yml's assemble job) and its PPTX links.

The generator used to be inline Python in deploy.yml; tests/fixtures/site_index_legacy.py keeps it
verbatim, and a site without a PPTX must come out byte for byte as it did.
"""
from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

from conftest import ROOT

LEGACY = ROOT / "tests" / "fixtures" / "site_index_legacy.py"
SCRIPT = ROOT / "scripts" / "site_index.py"
LABELS = """[labels]
Innoday = "2026_10_23_Innoday"
OpenData = "2026_10_21_Open_Data_Award"
Sceptics = "2026_05_11_Skeptikai"

[redirects]
2026_09_00_Startertalk = "2026_09_15_Startertalk"
2026_01_01_Gone = "2026_01_01_NeverBuilt"
2026_10_23_Innoday = "2026_10_21_OpenData"
"bad name" = "2026_10_21_OpenData"
"""
BUILT = ["2026_10_23_Innoday", "2026_10_21_OpenData", "2026_05_11_Sceptics", "2026_09_15_Startertalk", "2026_12_01_Unlabelled"]


def tree(root: Path, labels: str = LABELS, built=BUILT, unbuilt=("2027_01_01_NotYet",)) -> Path:
    for t in [*built, *unbuilt]:
        (root / "talks" / t).mkdir(parents=True)
    for t in built:
        (root / "site" / t).mkdir(parents=True)
        (root / "site" / t / "index.html").write_text(f"<p>{t}</p>\n")
    (root / "site" / ".talk-status").mkdir(parents=True)
    (root / "talk-labels.toml").write_text(labels)
    return root


def run(cmd: list, cwd: Path) -> subprocess.CompletedProcess:
    r = subprocess.run([sys.executable, *map(str, cmd)], cwd=cwd, capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    return r


def site_files(root: Path) -> dict[str, str]:
    return {str(p.relative_to(root / "site")): p.read_text() for p in sorted((root / "site").rglob("*")) if p.is_file()}


def pptx_json(root: Path, t: str, **over) -> None:
    (root / "talks" / t / "videos").mkdir(parents=True, exist_ok=True)
    data = {"asset": f"{t}.pptx", "url": f"https://github.com/o/r/releases/download/videos-x/{t}.pptx",
            "bytes": 640 * 1024 * 1024, **over}
    (root / "talks" / t / "videos" / "pptx.json").write_text(json.dumps(data))


@pytest.mark.parametrize("labels", [LABELS, "", None])
def test_without_a_pptx_the_page_is_what_the_inline_generator_wrote(tmp_path, labels):
    old, new = tree(tmp_path / "old", labels or ""), tree(tmp_path / "new", labels or "")
    if labels is None:
        (old / "talk-labels.toml").unlink()
        (new / "talk-labels.toml").unlink()
    a = run([LEGACY], old)
    b = run([SCRIPT, "site"], new)
    assert site_files(old) == site_files(new) and a.stdout == b.stdout
    if labels:
        assert "redirect 2026_09_00_Startertalk/ -> 2026_09_15_Startertalk/" in b.stdout
        assert (new / "site" / "2026_09_00_Startertalk" / "index.html").is_file()


def test_the_repos_own_labels_and_talks_come_out_as_before(tmp_path):
    talks = sorted(p.name for p in (ROOT / "talks").iterdir() if (p / "package.json").is_file())
    old, new = (tree(tmp_path / x, (ROOT / "talk-labels.toml").read_text(), talks, ()) for x in ("old", "new"))
    run([LEGACY], old)
    run([SCRIPT, "site"], new)
    assert site_files(old) == site_files(new)


def test_a_talk_with_a_pptx_gets_the_download_on_the_right(tmp_path):
    root = tree(tmp_path / "t")
    pptx_json(root, "2026_10_23_Innoday")
    pptx_json(root, "2027_01_01_NotYet")                         # not built: no row at all
    run([SCRIPT, "site"], root)
    page = (root / "site" / "index.html").read_text()
    url = "https://github.com/o/r/releases/download/videos-x/2026_10_23_Innoday.pptx"
    assert ('<li><a href="./2026_10_23_Innoday/">2026_10_23_Innoday</a>'
            f'<a class=pptx href="{url}" download>PPTX · 640 MB</a></li>') in page
    assert '<li><a href="./2026_10_21_OpenData/">2026_10_21_Open_Data_Award</a></li>' in page
    assert page.count("class=pptx") == 1 and "NotYet" not in page
    assert ".pptx{" in page and "margin-left:auto" in page          # the style comes with the first PPTX


@pytest.mark.parametrize("over, why", [
    ({"url": "javascript:alert(1)"}, "url is not a GitHub release download"),
    ({"url": "https://example.com/x.pptx"}, "url is not a GitHub release download"),
    ({"bytes": "big"}, "has no size"),
])
def test_a_pptx_json_that_does_not_hold_up_is_left_out_with_a_warning(tmp_path, over, why):
    root = tree(tmp_path / "t")
    pptx_json(root, "2026_10_23_Innoday", **over)
    r = run([SCRIPT, "site"], root)
    assert "class=pptx" not in (root / "site" / "index.html").read_text()
    assert f"::warning::2026_10_23_Innoday: videos/pptx.json {why}" in r.stdout


def test_an_unreadable_pptx_json_is_a_warning_not_a_failed_deploy(tmp_path):
    root = tree(tmp_path / "t")
    (root / "talks" / "2026_10_23_Innoday" / "videos").mkdir()
    (root / "talks" / "2026_10_23_Innoday" / "videos" / "pptx.json").write_text("<<<<<<< HEAD\n")
    r = run([SCRIPT, "site"], root)
    assert "::warning::2026_10_23_Innoday: videos/pptx.json is unreadable" in r.stdout
    assert '<a href="./2026_10_23_Innoday/">' in (root / "site" / "index.html").read_text()


def test_sizes_read_as_mb_then_gb():
    sys.path.insert(0, str(ROOT / "scripts"))
    import site_index
    assert site_index.human(640 * 1024 * 1024) == "640 MB"
    assert site_index.human(int(1.5 * 1024 ** 3)) == "1.5 GB"
    assert site_index.human(300 * 1024) == "1 MB"


def test_the_deploy_workflow_runs_the_script():
    wf = (ROOT / ".github" / "workflows" / "deploy.yml").read_text()
    assert "python3 scripts/site_index.py site" in wf and "python3 - <<" not in wf
