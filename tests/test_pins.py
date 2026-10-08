"""`talk bump-toolkit`: the talks' addon pins, env.yaml's pip entry and the
scaffolder's ADDONS_REF move together, and only to release tags."""
from __future__ import annotations

import json

import pytest

from conftest import SHA, seed_tree, sh, talk

TALKS = {
    "2099_10_00_Stage": (SHA, True),          # upcoming, on the stage: --active
    "2099_11_05_Plain": ("v0.4.0", False),    # upcoming, pinned where the scaffolder is: --active
    "2099_12_01_Older": ("v0.3.3", False),    # upcoming, but on an older toolkit on purpose
    "2020_01_01_PastStage": (SHA, True),      # delivered: never --active
}


@pytest.fixture
def tree(tmp_path, env):
    root = tmp_path / "tree"
    seed_tree(root, TALKS)
    sh(["git", "init", "-q", "-b", "main"], root, env)
    return root


def pins(root, name):
    deps = json.loads((root / "talks" / name / "package.json").read_text())["devDependencies"]
    return {k: v.split("#", 1)[1] for k, v in deps.items()}


def snapshot(root):
    return {p: p.read_bytes() for p in root.rglob("*") if p.is_file() and ".git" not in p.parts
            and "__pycache__" not in p.parts}


def test_dry_run_prints_the_diff_and_writes_nothing(tree, env):
    before = snapshot(tree)
    code, obj, _ = talk(tree, "bump-toolkit", "v0.6.0", "--active", "--dry-run", env=env)
    assert code == 0 and obj["dry_run"] is True and obj["written"] == []
    assert obj["talks"] == ["2099_10_00_Stage", "2099_11_05_Plain"]
    files = sorted({c["file"] for c in obj["changes"]})
    assert files == ["env.yaml", "scripts/new_talk.py", "talks/2099_10_00_Stage/package.json",
                     "talks/2099_11_05_Plain/package.json"]
    stage = [c for c in obj["changes"] if c["file"] == "talks/2099_10_00_Stage/package.json"]
    assert {(c["what"], c["before"], c["after"]) for c in stage} == {
        ("slidev-addon-videos", SHA, "v0.6.0"), ("slidev-addon-stage", SHA, "v0.6.0")}
    assert snapshot(tree) == before


def test_bump_rewrites_both_pins_env_and_scaffolder(tree, env):
    code, obj, _ = talk(tree, "bump-toolkit", "v0.6.0", "--talk", "stage", env=env)
    assert code == 0 and obj["talks"] == ["2099_10_00_Stage"]
    assert pins(tree, "2099_10_00_Stage") == {"slidev-addon-videos": "v0.6.0", "slidev-addon-stage": "v0.6.0&path:/packages/stage"}
    assert pins(tree, "2020_01_01_PastStage")["slidev-addon-stage"].startswith(SHA)    # untouched
    assert "slidev-videos@v0.6.0" in (tree / "env.yaml").read_text()
    assert 'ADDONS_REF = "v0.6.0"' in (tree / "scripts" / "new_talk.py").read_text()
    assert sorted(obj["written"]) == ["env.yaml", "scripts/new_talk.py", "talks/2099_10_00_Stage/package.json"]
    code, obj, _ = talk(tree, "bump-toolkit", "v0.6.0", "--talk", "stage", env=env)
    assert code == 0 and obj["changes"] == []                                           # idempotent


def test_without_talks_only_env_and_scaffolder_move(tree, env):
    code, obj, _ = talk(tree, "bump-toolkit", "v0.6.0", "--dry-run", env=env)
    assert code == 0 and obj["talks"] == [] and "note" in obj
    assert sorted({c["file"] for c in obj["changes"]}) == ["env.yaml", "scripts/new_talk.py"]


@pytest.mark.parametrize("ref", [SHA, SHA[:7]])
def test_bare_shas_need_allow_sha(tree, env, ref):
    code, obj, _ = talk(tree, "bump-toolkit", ref, "--active", "--dry-run", env=env)
    assert code == 2 and "--allow-sha" in obj["error"]
    code, obj, _ = talk(tree, "bump-toolkit", ref, "--active", "--dry-run", "--allow-sha", env=env)
    assert code == 0 and obj["changes"]


@pytest.mark.parametrize("ref", ["latest", "0.6.0", "v0.6"])
def test_refs_that_are_not_tags(tree, env, ref):
    code, obj, _ = talk(tree, "bump-toolkit", ref, "--dry-run", env=env)
    assert code == 2 and "vX.Y.Z" in obj["error"]


def test_talk_and_active_together(tree, env):
    code, obj, _ = talk(tree, "bump-toolkit", "v0.6.0", "--talk", "stage", "--active", env=env)
    assert code == 2
