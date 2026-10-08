"""Fixtures for the talk CLI tests: small throwaway repos with the real scripts in them.

Every git call (the tests' and talk.py's) runs with the global and system git
config switched off, so the owner's config, hooks and signing never apply.
"""
from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]
SHA = "640eaa57fbe882a7f995379c25fa86b85c8a4e2d"
REPO_URL = "github:MindaugasSarpis/slidev-videos"


# what talk.py reads from the environment: the tests set their own, or none
CLEARED = ("INIT_CWD", "SLIDEV_STAGE_BIN", "OUTREACH_ROOT", "SLIDEV_VIDEOS_DIR", "RENDER_GPUS", "RENDER_SRUN_ARGS",
           "SLIDEV_STAGE_GL", "SLIDEV_STAGE_MESA_D3D12", "SLIDEV_STAGE_CHROMIUM_ARGS", "SLIDEV_STAGE_CHROMIUM_ENV",
           "TALK_RENDER_SLOT", "SLIDEV_STAGE_SHOTS_LOCKED", "SLURM_JOB_ID", "_CONDOR_JOB_AD", "CONDA_PREFIX", "TMUX")


def git_env(tmp: Path) -> dict:
    """No owner config, state, env or lock leaks in: everything talk.py resolves points under tmp."""
    env = os.environ.copy()
    env.update(GIT_CONFIG_GLOBAL=os.devnull, GIT_CONFIG_NOSYSTEM="1",
               GIT_AUTHOR_NAME="Test", GIT_AUTHOR_EMAIL="test@example.invalid",
               GIT_COMMITTER_NAME="Test", GIT_COMMITTER_EMAIL="test@example.invalid",
               TALK_TMP=str(tmp / "tmp"), OUTREACH_ENV_BIN=str(tmp / "no-env"),
               OUTREACH_CONFIG=str(tmp / "config" / "env"), OUTREACH_STATE=str(tmp / "state"),
               RENDER_BACKEND="local", RENDER_LOCK=str(tmp / "render.lock"))
    for k in CLEARED:
        env.pop(k, None)
    return env


def sh(cmd: list, cwd: Path, env: dict, check: bool = True) -> subprocess.CompletedProcess:
    r = subprocess.run([str(c) for c in cmd], cwd=cwd, env=env, capture_output=True, text=True)
    if check and r.returncode:
        raise AssertionError(f"{cmd} failed ({r.returncode}):\n{r.stdout}\n{r.stderr}")
    return r


def write_talk(root: Path, name: str, ref: str = SHA, stage: bool = True) -> None:
    d = root / "talks" / name
    d.mkdir(parents=True)
    dev = {"slidev-addon-videos": f"{REPO_URL}#{ref}"}
    if stage:
        dev["slidev-addon-stage"] = f"{REPO_URL}#{ref}&path:/packages/stage"
    (d / "package.json").write_text(json.dumps({
        "name": f"talk-{name.lower()}", "private": True, "description": f"{name[11:]} ({name[:10]})",
        "scripts": {"build": "slidev build deck.md"},
        "dependencies": {"@slidev/cli": "^52.14.2"}, "devDependencies": dev,
    }, indent=2) + "\n")
    (d / "deck.md").write_text(f"---\ntitle: {name[11:]}\nlang: en\n---\n\n# {name[11:]}\n")


def seed_tree(root: Path, talks: dict[str, tuple[str, bool]]) -> None:
    (root / "scripts").mkdir(parents=True)
    for f in ("talk.py", "new_talk.py"):
        shutil.copy(ROOT / "scripts" / f, root / "scripts" / f)
    (root / "package.json").write_text('{"name": "outreach-talks", "private": true}\n')
    (root / ".gitignore").write_text(".claude/worktrees/\n__pycache__/\n")
    (root / "env.yaml").write_text('dependencies:\n  - pip:\n'
                                   '      - "slidev-videos @ git+https://github.com/MindaugasSarpis/slidev-videos@v0.4.0"\n')
    for name, (ref, stage) in talks.items():
        write_talk(root, name, ref, stage)


@pytest.fixture
def env(tmp_path):
    return git_env(tmp_path)


@pytest.fixture
def repo(tmp_path, env):
    """A bare origin and its clone (the main checkout) holding three talks."""
    seed = tmp_path / "seed"
    seed_tree(seed, {"2026_10_00_OpenData": (SHA, True), "2026_10_00_Innoday": (SHA, True),
                     "2026_04_28_editAI": ("v0.3.3", False)})
    sh(["git", "init", "-q", "-b", "main"], seed, env)
    sh(["git", "add", "-A"], seed, env)
    sh(["git", "commit", "-q", "-m", "seed"], seed, env)
    sh(["git", "clone", "-q", "--bare", seed, tmp_path / "origin.git"], tmp_path, env)
    sh(["git", "clone", "-q", tmp_path / "origin.git", tmp_path / "main"], tmp_path, env)
    return tmp_path / "main"


def talk(root: Path, *args, cwd: Path | None = None, env: dict) -> tuple[int, dict | None, str]:
    """Run root/scripts/talk.py with --json; the exit code, the parsed object, stderr.
    --json goes first, so a `--` among the args (render's command) keeps the rest to itself."""
    r = subprocess.run([sys.executable, str(root / "scripts" / "talk.py"), "--json", *map(str, args)],
                       cwd=cwd or root, env=env, capture_output=True, text=True)
    obj = json.loads(r.stdout) if r.stdout.strip() else None
    return r.returncode, obj, r.stderr


def fake_bin(d: Path, name: str, body: str) -> Path:
    """An executable shell script `name` in d."""
    d.mkdir(parents=True, exist_ok=True)
    p = d / name
    p.write_text("#!/bin/sh\n" + body.lstrip("\n"))
    p.chmod(0o755)
    return p
