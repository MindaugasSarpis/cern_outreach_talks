"""pnpm-lock.yaml keeps the subpath of a GitHub tarball (`#path:/packages/stage`).

A pnpm 10.33 reinstall (Innoday's v0.8.2 pin, 5c93455) rewrote the older toolkit
tarballs' resolutions without `path: /packages/stage` (and without `gitHosted`):
three talks installed the slidev-videos repo root as slidev-addon-stage and their
builds failed on Pages (fixed on main, e3a23df). `lock_subpath_problems` finds
such a block; `talk check` (so review and ready) and `talk pin` run it. A block
without `gitHosted` alone is sound: pnpm 10.33 writes new ones so (c456add's at
e3a23df built), so only the missing path counts.
"""
from __future__ import annotations

import importlib.util
import sys

from conftest import ROOT

spec = importlib.util.spec_from_file_location("talk_cli_lock", ROOT / "scripts" / "talk.py")
talk_cli = importlib.util.module_from_spec(spec)
sys.path.insert(0, str(ROOT / "scripts"))
sys.modules["talk_cli_lock"] = talk_cli     # dataclasses look the module up while it loads
spec.loader.exec_module(talk_cli)

URL = "https://codeload.github.com/MindaugasSarpis/slidev-videos/tar.gz/"
A, B = "2705aa12bb93093f2015dc25913bf27ed4c21563", "c456adda54554e5dbc6ed7346b89a1810a74a72a"


def lock(stage_res_a: str, videos_res_a: str) -> str:
    return f"""lockfileVersion: '9.0'

importers:

  talks/x:
    devDependencies:
      slidev-addon-stage:
        specifier: github:MindaugasSarpis/slidev-videos#{A}&path:/packages/stage
        version: {URL}{A}#path:/packages/stage(@slidev/cli@52.14.2)

packages:

  '@slidev/cli@52.14.2':
    resolution: {{integrity: sha512-x}}

  slidev-addon-stage@{URL}{A}#path:/packages/stage:
    resolution: {stage_res_a}
    version: 0.5.1
    hasBin: true

  slidev-addon-stage@{URL}{B}#path:/packages/stage:
    resolution: {{gitHosted: true, integrity: sha512-b, path: /packages/stage, tarball: {URL}{B}}}
    version: 0.5.2

  slidev-addon-videos@{URL}{A}:
    resolution: {videos_res_a}
    version: 0.8.1

snapshots:

  slidev-addon-stage@{URL}{A}#path:/packages/stage(@slidev/cli@52.14.2):
    dependencies:
      three: 0.170.0
"""


GOOD_STAGE = f"{{gitHosted: true, integrity: sha512-a, path: /packages/stage, tarball: {URL}{A}}}"
GOOD_VIDEOS = f"{{gitHosted: true, integrity: sha512-a, tarball: {URL}{A}}}"
BAD_STAGE = f"{{integrity: sha512-a, tarball: {URL}{A}}}"      # as pnpm 10.33 rewrote it
BAD_VIDEOS = f"{{integrity: sha512-a, tarball: {URL}{A}}}"


def test_a_sound_lockfile_has_no_problems():
    assert talk_cli.lock_subpath_problems(lock(GOOD_STAGE, GOOD_VIDEOS)) == []


def test_a_subpath_tarball_without_its_path_is_named():
    probs = talk_cli.lock_subpath_problems(lock(BAD_STAGE, GOOD_VIDEOS))
    assert [(p["package"], p["missing"]) for p in probs] == [
        (f"slidev-addon-stage@{URL}{A}#path:/packages/stage", "path: /packages/stage"),
    ]
    assert all(p["line"] > 0 for p in probs)


def test_a_tarball_without_githosted_alone_is_sound():
    # as pnpm 10.33 writes a new block: no gitHosted, the path kept
    stage = f"{{integrity: sha512-a, path: /packages/stage, tarball: {URL}{A}}}"
    assert talk_cli.lock_subpath_problems(lock(stage, BAD_VIDEOS)) == []


def test_snapshots_and_importers_are_not_read_as_packages():
    # their keys carry the same #path: but no resolution of their own
    text = lock(GOOD_STAGE, GOOD_VIDEOS)
    assert "snapshots:" in text and talk_cli.lock_subpath_problems(text) == []


def test_the_repo_lockfile_keeps_every_subpath():
    path = ROOT / "pnpm-lock.yaml"
    assert talk_cli.lock_subpath_problems(path.read_text(encoding="utf-8")) == []


# ---- the command and the workflow

from conftest import talk  # noqa: E402

GOOD = f"""lockfileVersion: '9.0'

packages:

  slidev-addon-stage@{URL}{B}#path:/packages/stage:
    resolution: {{integrity: sha512-b, path: /packages/stage, tarball: {URL}{B}}}
    version: 0.5.2
"""


def test_talk_lock_names_a_block_that_lost_its_subpath(repo, env):
    (repo / "pnpm-lock.yaml").write_text(lock(BAD_STAGE, GOOD_VIDEOS))
    code, obj, err = talk(repo, "lock", env=env)
    assert code == 1 and obj["ok"] is False
    assert [p["missing"] for p in obj["problems"]] == ["path: /packages/stage"]
    assert "pnpm-lock.yaml:" in err and "git checkout origin/main -- pnpm-lock.yaml" in err
    (repo / "pnpm-lock.yaml").write_text(GOOD)
    code, obj, _ = talk(repo, "lock", env=env)
    assert code == 0 and obj["ok"] is True and obj["problems"] == []


def test_the_deploy_workflow_checks_the_lockfile_before_any_build():
    wf = (ROOT / ".github" / "workflows" / "deploy.yml").read_text()
    plan, rest = wf.split("\n  build:\n", 1)
    assert "python3 scripts/talk.py lock" in plan        # in the plan job, which every build needs
    assert "python3 scripts/talk.py lock" not in rest
    assert plan.index("python3 scripts/talk.py lock") < plan.index("id: talks")
    assert "needs: plan" in rest.split("\n  assemble:\n", 1)[0]
