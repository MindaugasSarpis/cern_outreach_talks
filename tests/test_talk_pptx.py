"""talk pptx NAME (the deck as a PPTX of the stage's per-slide takes, on the talk's videos release)
and ready's pptx step. The toolkit's recorder, `slidev-videos` (pull, pptx), ffprobe and gh are fakes."""
from __future__ import annotations

import json
import os
import time
from pathlib import Path

import pytest

from conftest import fake_bin, sh, talk
from test_talk_cli import SKIPS, TALK, counted, gh_listing, od_worktree, path_with, talk_cli  # noqa: F401  (fixtures)

ASSET = f"{TALK}.pptx"
URL = f"https://github.com/o/r/releases/download/videos-t/{ASSET}"

# node <slidev-stage-record> <site> <out> args...: one line of argv per run, and a take of the slides
# $REC_SLIDES names (else 1 2 3): NN.mp4 holding $REC_TAKE, a segment each in index.json
FAKE_RECORDER = ('echo "$*" >> "$REC_ARGS_OUT"\nout="$3"\nmkdir -p "$out"\nsegs=""\n'
                 'for n in ${REC_SLIDES:-1 2 3}; do f=$(printf "%02d.mp4" $n); printf "${REC_TAKE:-take}" > "$out/$f"\n'
                 '  segs="$segs${segs:+, }{\\"slide\\": $n, \\"clicks\\": 0, \\"file\\": \\"$f\\", \\"seconds\\": 11}"\ndone\n'
                 'echo "{\\"fps\\": 50, \\"hold\\": 8, \\"segments\\": [$segs]}" > "$out/index.json"\necho "$n file(s)"\n')
STAGE_RECORD = "# else if (a === '--max') ...; else if (a === '--clicks') ...; else if (a === '--skip-clips') ...\n"
# slidev-videos: --version, `pptx --help` (exit $SV_PPTX_HELP, else 0), pull, and pptx writing --out and its --json
FAKE_SV = r'''echo "$*" >> "$SV_LOG"
case "$1" in
  --version) echo "slidev-videos 0.8.3" ;;
  pptx)
    if [ "$2" = --help ]; then exit ${SV_PPTX_HELP:-0}; fi
    [ -n "$SV_PPTX_FAIL" ] && { echo "ffmpeg failed" >&2; exit 1; }
    out=""; prev=""
    for a in "$@"; do [ "$prev" = --out ] && out="$a"; prev="$a"; done
    head -c 1234 /dev/zero > "$out"
    echo "slide 1 ... 3"
    echo '{"command": "pptx", "ok": true, "slides": 3, "segments": 3, "bytes": 1234, "skipped": [], "profile": {"cap": "6M"}, "encoder": "nvenc"}' ;;
  pull) exit ${SV_PULL_EXIT:-0} ;;
esac
'''
# gh: one line of argv per call; `release view` exits $GH_VIEW (else 0), `release upload` $GH_UPLOAD (else 0)
FAKE_GH = r'''echo "$*" >> "$GH_LOG"
case "$1 $2" in
  "release view") exit ${GH_VIEW:-0} ;;
  "release upload") exit ${GH_UPLOAD:-0} ;;
esac
'''
# ffprobe -v error -show_entries format=duration -of csv=p=0 FILE: long.mp4 is 253.4 s, any other 40 s
FAKE_FFPROBE = 'for a in "$@"; do f="$a"; done\ncase "$f" in *long.mp4) echo 253.4 ;; *) echo 40.0 ;; esac\n'


def lines(p: Path) -> list[list[str]]:
    return [x.split() for x in p.read_text().splitlines()] if p.exists() else []


@pytest.fixture
def tools(repo, env, tmp_path):
    b = tmp_path / "bin"
    fake_bin(b, "node", FAKE_RECORDER)
    fake_bin(b, "slidev-videos", FAKE_SV)
    fake_bin(b, "gh", FAKE_GH)
    fake_bin(b, "ffprobe", FAKE_FFPROBE)
    fake_bin(tmp_path / "stage-bin", "slidev-stage-record", STAGE_RECORD)
    site = tmp_path / "tmp" / "talk-opendata" / "site"
    site.mkdir(parents=True)
    (site / "index.html").write_text("<html></html>\n")
    (repo / "videos.toml").write_text('[defaults]\nrepo = "o/r"\n')
    d = repo / "talks" / TALK
    (d / "videos.toml").write_text('[defaults]\nrelease_tag = "videos-t"\n')
    (d / "deck.md").write_text((d / "deck.md").read_text() + '\n---\n\n<VideoPlayer src="long.mp4" />\n\n---\n\n<VideoPlayer\n  src="short.mp4" muted />\n')
    (d / "public" / "videos").mkdir(parents=True)
    for n in ("long.mp4", "short.mp4"):
        (d / "public" / "videos" / n).write_text("a clip")
    return {**path_with(b, env), "SLIDEV_STAGE_BIN": str(tmp_path / "stage-bin"), "REC_ARGS_OUT": str(tmp_path / "rec.args"),
            "SV_LOG": str(tmp_path / "sv.log"), "GH_LOG": str(tmp_path / "gh.log")}


def pptx(repo, env, *args):
    return talk(repo, "pptx", "opendata", "--no-build", *args, env=env)


def test_pptx_records_builds_uploads_and_writes_pptx_json(repo, tools, tmp_path):
    code, obj, err = pptx(repo, tools)
    assert code == 0, err
    work = tmp_path / "tmp" / "talk-opendata" / "pptx"
    rec, out, deck = work / "rec", work / ASSET, repo / "talks" / TALK / "deck.md"
    sv = lines(tmp_path / "sv.log")
    assert sv[0] == ["pptx", "--help"] and ["pull", "--include-shared"] in sv
    assert [x for x in sv if x[:1] == ["pptx"]][-1] == ["pptx", str(rec), "--deck", str(deck), "--out", str(out), "--json"]
    # the world at 25 fps; a clip slide is not filmed (--skip-clips: the PPTX gets the clip itself), so
    # --max is the settle's 120 s whatever the clips' lengths
    assert lines(tmp_path / "rec.args") == [[str(tmp_path / "stage-bin" / "slidev-stage-record"), str(tmp_path / "tmp" / "talk-opendata" / "site"),
                                             str(rec), "--fps", "25", "--hold", "8", "--clicks", "all", "--max", "120", "--skip-clips"]]
    assert lines(tmp_path / "gh.log") == [["release", "view", "videos-t", "--repo", "o/r"],
                                          ["release", "upload", "videos-t", str(out), "--clobber", "--repo", "o/r"]]
    data = json.loads((repo / "talks" / TALK / "videos" / "pptx.json").read_text())
    recorded_at = data.pop("recorded_at")
    assert data == {"fingerprint": talk_cli.take_fingerprint(repo, TALK), "asset": ASSET, "repo": "o/r", "tag": "videos-t",
                    "url": URL, "bytes": 1234, "slides": 3, "segments": 3, "deck_slides": 3, "skipped": [],
                    "fps": 25, "hold": 8, "max": 120, "cap": "6M", "cli": "slidev-videos 0.8.3"}
    assert recorded_at == json.loads((rec / "take.json").read_text())["recorded_at"]
    assert obj["url"] == URL and obj["recorded"] is True and obj["uploaded"] is True and obj["out"] == str(out)
    assert "commit it" in err and "videos/pptx.json" in err


def test_pptx_keeps_a_current_take_and_records_a_stale_one_again(repo, tools, tmp_path):
    assert pptx(repo, tools)[0] == 0
    code, obj, err = pptx(repo, tools)
    assert code == 0 and obj["recorded"] is False and len(lines(tmp_path / "rec.args")) == 1, err
    assert "current" in err
    (repo / "talks" / TALK / "videos" / "pptx.json").write_text("{}")      # its own json is no part of the take
    assert pptx(repo, tools)[1]["recorded"] is False
    deck = repo / "talks" / TALK / "deck.md"
    deck.write_text(deck.read_text() + "\n---\n\n# one more\n")
    code, obj, _ = pptx(repo, tools)
    assert code == 0 and obj["recorded"] is True and len(lines(tmp_path / "rec.args")) == 2
    code, obj, _ = pptx(repo, tools, "--rerecord")
    assert code == 0 and obj["recorded"] is True and len(lines(tmp_path / "rec.args")) == 3
    code, obj, _ = pptx(repo, tools, "--", "--hold", "4")                  # other recorder flags: another take
    assert code == 0 and obj["recorded"] is True and lines(tmp_path / "rec.args")[-1][-2:] == ["--hold", "4"]


def test_pptx_slides_records_those_again_and_keeps_the_rest(repo, tools, tmp_path):
    assert pptx(repo, tools)[0] == 0
    code, obj, err = pptx(repo, {**tools, "REC_SLIDES": "2", "REC_TAKE": "new"}, "--", "--slides", "2-2")
    assert code == 0, err
    rec = tmp_path / "tmp" / "talk-opendata" / "pptx" / "rec"
    args = lines(tmp_path / "rec.args")[-1]
    assert args[2] == str(rec.parent / "rec-part") and args[-2:] == ["--slides", "2-2"]
    assert [(rec / f).read_text() for f in ("01.mp4", "02.mp4", "03.mp4")] == ["take", "new", "take"]
    index = json.loads((rec / "index.json").read_text())
    assert [s["slide"] for s in index["segments"]] == [1, 2, 3]
    # without a whole take to add to, a partial one is refused
    import shutil
    shutil.rmtree(rec)
    code, obj, _ = pptx(repo, tools, "--", "--slides", "2-2")
    assert code == 2 and "--slides" in obj["error"]


def test_pptx_dry_run_does_nothing_and_no_publish_uploads_nothing(repo, tools, tmp_path):
    code, obj, err = pptx(repo, tools, "--dry-run")
    assert code == 0, err
    assert not (tmp_path / "rec.args").exists() and not (tmp_path / "gh.log").exists()
    assert [x for x in lines(tmp_path / "sv.log") if x[:1] != ["--version"]] == [["pptx", "--help"]]
    plan = obj["plan"]
    assert plan["record"].endswith("--max 120 --skip-clips") and plan["upload"].startswith("gh release upload videos-t")
    assert not (repo / "talks" / TALK / "videos" / "pptx.json").exists()
    code, obj, _ = pptx(repo, tools, "--dry-run", "--cap", "4M", "--allow-skips")       # the builder's own flags
    assert obj["plan"]["build"].endswith("--json --cap 4M --allow-skips")
    code, obj, err = pptx(repo, tools, "--no-publish")
    assert code == 0 and obj["uploaded"] is False, err
    assert not (tmp_path / "gh.log").exists() and not (repo / "talks" / TALK / "videos" / "pptx.json").exists()
    assert (tmp_path / "tmp" / "talk-opendata" / "pptx" / ASSET).is_file()


def test_pptx_creates_the_release_when_there_is_none(repo, tools, tmp_path):
    code, obj, err = pptx(repo, {**tools, "GH_VIEW": "1"})
    assert code == 0, err
    assert [x[:2] for x in lines(tmp_path / "gh.log")] == [["release", "view"], ["release", "create"], ["release", "upload"]]


def test_pptx_refuses_a_cli_or_recorder_without_it(repo, tools, tmp_path):
    code, obj, _ = pptx(repo, {**tools, "SV_PPTX_HELP": "2"})
    assert code == 2 and "no `pptx` subcommand" in obj["error"] and "SLIDEV_VIDEOS_DIR" in obj["error"]
    assert not (tmp_path / "rec.args").exists()
    fake_bin(tmp_path / "stage-bin", "slidev-stage-record", "# an older recorder\n")
    code, obj, _ = pptx(repo, tools)
    assert code == 2 and "--max" in obj["error"] and not (tmp_path / "rec.args").exists()
    (tmp_path / "bin" / "slidev-videos").unlink()
    code, obj, _ = pptx(repo, tools)
    assert code == 2 and "slidev-videos is not installed" in obj["error"]


@pytest.mark.parametrize("over, step", [({"SV_PPTX_FAIL": "1"}, "pptx"), ({"GH_UPLOAD": "1"}, "upload"),
                                        ({"SV_PULL_EXIT": "1"}, "pull")])
def test_pptx_failures_write_no_pptx_json(repo, tools, over, step):
    code, obj, _ = pptx(repo, {**tools, **over})
    assert code == 1 and step in obj["error"]
    assert not (repo / "talks" / TALK / "videos" / "pptx.json").exists()


def test_pptx_film_clips_films_every_clip_slide_whole(repo, tools, tmp_path):
    code, obj, err = pptx(repo, tools, "--film-clips")
    assert code == 0, err
    # every clip slide whole: --max past the longest clip (253.4 s) by the settle's 60 s
    assert lines(tmp_path / "rec.args")[-1][3:] == ["--fps", "25", "--hold", "8", "--clicks", "all", "--max", "314"]
    assert json.loads((repo / "talks" / TALK / "videos" / "pptx.json").read_text())["max"] == 314
    # the recorder's own --fps wins (the plates look fine at 25; 50 when asked)
    code, obj, _ = pptx(repo, tools, "--dry-run", "--", "--fps", "50")
    rec = obj["plan"]["record"].split()
    assert rec.count("--fps") == 1 and rec[rec.index("--fps") + 1] == "50" and rec[-1] == "50"
    assert json.loads((repo / "talks" / TALK / "videos" / "pptx.json").read_text())["fps"] == 25


def test_pptx_refuses_a_recorder_that_cannot_skip_clips(repo, tools, tmp_path):
    fake_bin(tmp_path / "stage-bin", "slidev-stage-record", "# else if (a === '--max') ...: v0.8.3\n")
    code, obj, _ = pptx(repo, tools)
    assert code == 2 and not (tmp_path / "rec.args").exists()
    assert "--skip-clips" in obj["error"] and "SLIDEV_STAGE_BIN" in obj["error"] and "--film-clips" in obj["error"]
    code, obj, err = pptx(repo, tools, "--film-clips")
    assert code == 0, err


def test_pptx_max_without_clips_and_with_a_clip_of_unknown_length(repo, tools, tmp_path):
    d = repo / "talks" / TALK
    (d / "public" / "videos" / "long.mp4").unlink()                    # not pulled: its length is unknown
    code, obj, err = pptx(repo, tools, "--dry-run", "--film-clips")
    assert obj["max"] == 600 and obj["unknown_clips"] == ["long.mp4"] and "long.mp4" in err
    code, obj, err = pptx(repo, tools, "--dry-run")                    # left to the clips: their lengths do not matter
    assert obj["max"] == 120 and "long.mp4" not in err
    (d / "deck.md").write_text("---\ntitle: x\n---\n\n# no clips\n")
    code, obj, _ = pptx(repo, tools, "--dry-run", "--film-clips")
    assert obj["max"] == 120 and obj["clips"] == {}
    code, obj, _ = pptx(repo, tools, "--dry-run", "--", "--max", "90")      # the recorder's own --max wins
    assert "--max 90" in obj["plan"]["record"] and "--max 120" not in obj["plan"]["record"]


def test_take_fingerprint_is_the_plates_one_and_leaves_out_pptx_json(repo):
    assert talk_cli.plates_fingerprint is talk_cli.take_fingerprint
    before = talk_cli.take_fingerprint(repo, TALK)
    (repo / "talks" / TALK / "videos").mkdir()
    (repo / "talks" / TALK / "videos" / "pptx.json").write_text('{"a": 1}')
    assert talk_cli.take_fingerprint(repo, TALK) == before


# ---------------------------------------------------------------- ready's pptx step

def pptx_json(wt, **over):
    d = wt / "talks" / TALK
    (d / "videos").mkdir(exist_ok=True)
    data = {"fingerprint": talk_cli.take_fingerprint(wt, TALK), "asset": ASSET, "repo": "o/r", "tag": "videos-t",
            "url": URL, "bytes": 7, "slides": 3, **over}
    (d / "videos" / "pptx.json").write_text(json.dumps(data))
    return d


def ready_pptx(wt, env, *more):
    code, obj, err = talk(wt, "ready", "opendata", *SKIPS, "--skip", "preflight", "--skip", "venue", *more, cwd=wt, env=env)
    return code, next(s for s in obj["steps"] if s["name"] == "pptx"), err


def test_ready_pptx_step_is_skipped_without_pptx_json(od_worktree, counted):
    env, _ = counted
    code, step, _ = ready_pptx(od_worktree, env)
    assert code == 0 and step == {"name": "pptx", "ok": True, "skipped": "no pptx"}


def test_ready_checks_the_pptx_is_on_the_release_at_its_size(od_worktree, counted, tmp_path):
    env, _ = counted
    pptx_json(od_worktree)
    env, assets = gh_listing(tmp_path, env, ASSET, size=7)
    code, step, err = ready_pptx(od_worktree, env, "--strict-pptx")
    assert code == 0 and step["ok"] is True and step["warnings"] == [], err
    assert (tmp_path / "gh.args").read_text().split() == ["release", "view", "videos-t", "--repo", "o/r", "--json", "assets"]
    assert step["url"] == URL and step["bytes"] == 7 and step["stale"] is False
    assets.write_text(json.dumps({"assets": [{"name": ASSET, "size": 9}]}))
    code, step, _ = ready_pptx(od_worktree, env)
    assert code == 0 and step["ok"] is True
    assert step["warnings"] == [f"{ASSET} on release videos-t is 9 bytes, not the 7 videos/pptx.json records "
                                "(pnpm talk pptx opendata)"]
    assets.write_text(json.dumps({"assets": []}))
    code, step, _ = ready_pptx(od_worktree, env)
    assert step["warnings"] == [f"{ASSET} is not on release videos-t (pnpm talk pptx opendata)"]
    code, step, _ = ready_pptx(od_worktree, env, "--strict-pptx")
    assert code == 1 and step["ok"] is False and step["error"] == "1 warning (--strict-pptx)"
    fake_bin(tmp_path / "bin", "gh", 'echo "gh: not logged in" >&2\nexit 1\n')
    code, step, _ = ready_pptx(od_worktree, env)
    assert step["warnings"] == [f"release videos-t could not be listed (gh): whether {ASSET} is on it is unknown"]


def test_ready_warns_on_a_stale_unreadable_or_oversized_pptx(od_worktree, counted, tmp_path):
    env, _ = counted
    d = pptx_json(od_worktree)
    env, assets = gh_listing(tmp_path, env, ASSET, size=7)
    deck = d / "deck.md"
    deck.write_text(deck.read_text() + "\n---\n\n# one more slide\n")
    code, step, _ = ready_pptx(od_worktree, env)
    assert code == 0 and step["stale"] is True
    assert step["warnings"] == ["stale: the talk changed since the PPTX was recorded (pnpm talk pptx opendata)"]
    t = time.time() + 100
    pptx_json(od_worktree)
    os.utime(deck, (t, t))                                                   # by content, not mtime
    assert ready_pptx(od_worktree, env)[1]["warnings"] == []
    big = 2 * 1024 ** 3
    pptx_json(od_worktree, bytes=big)
    assets.write_text(json.dumps({"assets": [{"name": ASSET, "size": big}]}))
    code, step, _ = ready_pptx(od_worktree, env)
    assert step["warnings"] == [f"{ASSET}: 2048.0 MB, over the 1536 MB a PPTX may take (GitHub's limit is 2 GB an asset)"]
    (d / "videos" / "pptx.json").write_text("<<<<<<< HEAD\n")
    code, step, _ = ready_pptx(od_worktree, env)
    assert code == 0 and step["warnings"] == ["videos/pptx.json is unreadable (a merge conflict, a hand edit?): "
                                              "restore it, or pnpm talk pptx opendata"]


def test_ready_and_deploy_can_skip_the_pptx(od_worktree, counted, tmp_path):
    env, _ = counted
    pptx_json(od_worktree, fingerprint="old")
    sh(["git", "add", "-A"], od_worktree, env)
    sh(["git", "commit", "-q", "-m", "pptx.json"], od_worktree, env)
    code, step, _ = ready_pptx(od_worktree, env, "--skip", "pptx", "--strict-pptx")
    assert code == 0 and step == {"name": "pptx", "ok": True, "skipped": "--skip pptx"}
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", "--ready-skip", "check", "--ready-skip", "shots",
                          "--ready-skip", "pages", "--ready-skip", "pptx", "--rerun-ready", cwd=od_worktree, env=env)
    assert code == 0, err
    assert next(s for s in obj["ready"]["steps"] if s["name"] == "pptx")["skipped"] == "--skip pptx"
