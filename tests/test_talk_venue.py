"""talk venue NAME (the offline venue zip on the talk's videos release, videos/venue.json for the site's ZIP
link), ready's venue step, and deploy building the zip when it is missing or stale (owner, 13 Nov 2026:
"always build zip and make it available …, but to also clear previous versions from tmp").
The videos CLI and gh are fakes."""
from __future__ import annotations

import json
from pathlib import Path

import pytest

from conftest import fake_bin, sh, talk
from test_talk_cli import READY_SKIPS, SKIPS, TALK, counted, od_worktree, path_with, talk_cli  # noqa: F401  (fixtures)

ASSET = f"{TALK}-venue.zip"
URL = f"https://github.com/o/r/releases/download/videos-t/{ASSET}"

# slidev-videos: `venue` (in the talk's directory) writes dist-portable/ and <dir>-venue.zip of $SV_ZIP_BYTES,
# or fails with $SV_VENUE_FAIL; --version
FAKE_SV = r'''echo "$*" >> "$SV_LOG"
case "$1" in
  --version) echo "slidev-videos 0.12.1" ;;
  venue)
    [ "$2" = --dry-run ] && { echo "(dry run) would zip"; exit 0; }
    [ -n "$SV_VENUE_FAIL" ] && { echo "build:portable failed" >&2; exit 1; }
    n=$(basename "$PWD"); mkdir -p dist-portable; echo "<html>" > dist-portable/index.html
    head -c ${SV_ZIP_BYTES:-4321} /dev/zero > "$n-venue.zip"; echo "Done: $n-venue.zip" ;;
esac
'''
# gh: one line of argv per call; `release view … --json assets` prints $GH_ASSETS; `release upload` exits $GH_UPLOAD
FAKE_GH = r'''echo "$*" >> "$GH_LOG"
case "$1 $2" in
  "release view") [ -n "$GH_ASSETS" ] && cat "$GH_ASSETS"; exit 0 ;;
  "release upload") exit ${GH_UPLOAD:-0} ;;
esac
'''


def lines(p: Path) -> list[list[str]]:
    return [x.split() for x in p.read_text().splitlines()] if p.exists() else []


@pytest.fixture
def tools(od_worktree, counted, tmp_path):
    env, _ = counted
    b = tmp_path / "bin"
    fake_bin(b, "slidev-videos", FAKE_SV)
    fake_bin(b, "gh", FAKE_GH)
    (od_worktree / "videos.toml").write_text('[defaults]\nrepo = "o/r"\n')
    d = od_worktree / "talks" / TALK
    (d / "videos.toml").write_text('[defaults]\nrelease_tag = "videos-t"\n')
    (d / "public" / "videos").mkdir(parents=True)
    (d / "public" / "videos" / "clip.mp4").write_bytes(b"x" * 11)
    (od_worktree / ".gitignore").write_text(".claude/worktrees/\n__pycache__/\npublic/videos/\n")
    sh(["git", "add", "-A"], od_worktree, env)
    sh(["git", "commit", "-q", "-m", "videos.toml"], od_worktree, env)
    return {**path_with(b, env), "SV_LOG": str(tmp_path / "sv.log"), "GH_LOG": str(tmp_path / "gh.log")}


def work(tmp_path) -> Path:
    return tmp_path / "tmp" / "talk-opendata" / "venue"


def venue(wt, env, *args):
    return talk(wt, "venue", "opendata", *args, cwd=wt, env=env)


def listing(tmp_path, env, **assets) -> dict:
    p = tmp_path / "assets.json"
    p.write_text(json.dumps({"assets": [{"name": n, "size": s} for n, s in assets.items()]}))
    return {**env, "GH_ASSETS": str(p)}


def test_venue_builds_the_zip_in_tmp_uploads_it_and_writes_venue_json(od_worktree, tools, tmp_path):
    code, obj, err = venue(od_worktree, tools)
    assert code == 0, err
    d = od_worktree / "talks" / TALK
    zip_ = work(tmp_path) / ASSET
    assert zip_.stat().st_size == 4321
    assert not (d / ASSET).exists() and not (d / "dist-portable").exists()       # the talk's tree keeps no copy
    assert lines(tmp_path / "sv.log")[0] == ["venue"]
    up = [x for x in lines(tmp_path / "gh.log") if x[:2] == ["release", "upload"]]
    assert up == [["release", "upload", "videos-t", str(zip_), "--clobber", "--repo", "o/r"]]
    vj = json.loads((d / "videos" / "venue.json").read_text())
    head = sh(["git", "rev-parse", "--short", "HEAD"], od_worktree, tools).stdout.strip()
    assert vj["url"] == URL and vj["bytes"] == 4321 and vj["asset"] == ASSET and vj["tag"] == "videos-t"
    assert vj["built_from"] == head and vj["clips"] == {"clip.mp4": 11}
    assert vj["fingerprint"] == talk_cli.venue_fingerprint(od_worktree, TALK)
    assert obj["uploaded"] is True and obj["url"] == URL


def test_venue_keeps_only_the_newest_zip_in_tmp(od_worktree, tools, tmp_path):
    w = work(tmp_path)
    w.mkdir(parents=True)
    (w / "old-venue.zip").write_bytes(b"old")
    (w / "dist-portable").mkdir()
    code, _, err = venue(od_worktree, {**tools, "SV_VENUE_FAIL": "1"})
    assert code == 1 and (w / "old-venue.zip").exists()                           # a failed build clears nothing
    code, obj, err = venue(od_worktree, tools)
    assert code == 0, err
    assert sorted(p.name for p in w.iterdir()) == [ASSET]
    assert obj["removed"] == [str(w / "dist-portable"), str(w / "old-venue.zip")]


def test_venue_dry_run_and_no_publish(od_worktree, tools, tmp_path):
    code, obj, err = venue(od_worktree, tools, "--dry-run")
    assert code == 0, err
    assert set(obj["plan"]) == {"build", "keep", "upload", "write"} and not (tmp_path / "sv.log").exists()
    code, obj, err = venue(od_worktree, tools, "--no-publish")
    assert code == 0, err
    assert (work(tmp_path) / ASSET).exists() and obj["uploaded"] is False
    assert not [x for x in lines(tmp_path / "gh.log") if x[:2] == ["release", "upload"]]
    assert not (od_worktree / "talks" / TALK / "videos" / "venue.json").exists()


def test_venue_refuses_a_zip_over_githubs_limit(od_worktree, tools, tmp_path):
    code, obj, _ = venue(od_worktree, {**tools, "SV_ZIP_BYTES": "5000", "VENUE_MAX_BYTES": "4999"})
    assert code == 1 and "over" in obj["error"]
    assert not [x for x in lines(tmp_path / "gh.log") if x[:2] == ["release", "upload"]]


def test_venue_needs_a_videos_toml(od_worktree, counted):
    env, _ = counted
    code, obj, err = talk(od_worktree, "venue", "opendata", cwd=od_worktree, env=env)
    assert code == 2 and "videos.toml" in err


# ---------------------------------------------------------------- ready's venue step

def ready_venue(wt, env):
    code, obj, err = talk(wt, "ready", "opendata", *SKIPS, "--skip", "preflight", cwd=wt, env=env)
    return code, next(s for s in obj["steps"] if s["name"] == "venue"), err


def commit_venue_json(wt, env):
    sh(["git", "add", f"talks/{TALK}/videos/venue.json"], wt, env)
    sh(["git", "commit", "-q", "-m", "venue.json"], wt, env)


def test_ready_venue_step_says_when_the_zip_is_missing_current_or_stale(od_worktree, tools, tmp_path):
    code, step, err = ready_venue(od_worktree, tools)
    assert code == 0 and step["ok"] is True, err
    assert step["zip"]["current"] is False and step["warnings"] == ["no venue zip yet (pnpm talk venue opendata)"]
    assert venue(od_worktree, tools)[0] == 0
    commit_venue_json(od_worktree, tools)
    env = listing(tmp_path, tools, **{ASSET: 4321, "clip.mp4": 11})
    code, step, err = ready_venue(od_worktree, env)
    assert step["zip"]["current"] is True and step["warnings"] == [], err
    env = listing(tmp_path, tools, **{ASSET: 4321, "clip.mp4": 12})
    assert ready_venue(od_worktree, env)[1]["warnings"] == [
        "clip.mp4 on release videos-t is 12 bytes, the zip has 11 (pnpm talk venue opendata)"]
    env = listing(tmp_path, tools, **{"clip.mp4": 11})
    assert ready_venue(od_worktree, env)[1]["warnings"] == [f"{ASSET} is not on release videos-t (pnpm talk venue opendata)"]
    env = listing(tmp_path, tools, **{ASSET: 4321, "clip.mp4": 11})
    deck = od_worktree / "talks" / TALK / "deck.md"
    deck.write_text(deck.read_text() + "\n---\n\n# one more slide\n")
    assert ready_venue(od_worktree, env)[1]["warnings"] == [
        "stale: the talk changed since the zip was built (pnpm talk venue opendata)"]


# ---------------------------------------------------------------- deploy builds what is missing

def test_deploy_dry_run_says_it_would_build_the_zip(od_worktree, tools, tmp_path):
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", "--skip-ready", cwd=od_worktree, env=tools)
    assert code == 0, err
    assert obj["zip"]["would_build"] is True and obj["zip"]["why"] == ["no venue zip yet (pnpm talk venue opendata)"]
    assert not (tmp_path / "sv.log").exists()


def test_deploy_builds_and_commits_the_zip_before_ready(od_worktree, tools, tmp_path):
    before = sh(["git", "rev-parse", "HEAD"], od_worktree, tools).stdout.strip()
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", *READY_SKIPS, "--build-zip",
                          cwd=od_worktree, env=tools)
    assert code == 0, err
    assert obj["zip"]["uploaded"] is True
    log = sh(["git", "log", "--format=%s", f"{before}..HEAD"], od_worktree, tools).stdout.split("\n")[0]
    assert log == "chore(opendata): the venue zip, built from " + before[:7]
    assert sh(["git", "status", "--porcelain"], od_worktree, tools).stdout == ""
    head = sh(["git", "rev-parse", "HEAD"], od_worktree, tools).stdout.strip()
    assert obj["would_push"] == head and obj["ready"]["ready"] is True          # ready checked the commit with the zip
    env = listing(tmp_path, tools, **{ASSET: 4321, "clip.mp4": 11})
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", *READY_SKIPS, cwd=od_worktree, env=env)
    assert code == 0 and obj["zip"] == {"current": True}, err                    # current now: nothing built


def test_deploy_without_the_zip(od_worktree, tools, tmp_path):
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", "--skip-ready", "--no-zip",
                          cwd=od_worktree, env=tools)
    assert code == 0 and obj["zip"] == {"skipped": "--no-zip"}, err


def test_deploy_stops_when_the_zip_fails(od_worktree, tools, tmp_path):
    before = sh(["git", "rev-parse", "HEAD"], od_worktree, tools).stdout.strip()
    code, obj, _ = talk(od_worktree, "deploy", "opendata", "--dry-run", "--skip-ready", "--build-zip",
                        cwd=od_worktree, env={**tools, "SV_VENUE_FAIL": "1"})
    assert code == 1 and "venue zip" in obj["error"] and "--no-zip" in obj["error"]
    assert sh(["git", "rev-parse", "HEAD"], od_worktree, tools).stdout.strip() == before
