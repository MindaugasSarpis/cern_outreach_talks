"""scripts/talk.py: name matching, the --json contract, exit codes, worktrees, deploy refusals.

Run with pytest from the repo root (`python3 -m pytest tests`). Everything
happens in throwaway repos under pytest's tmp_path; deploy is only ever run
with --dry-run, against a bare origin on disk.
"""
from __future__ import annotations

import importlib.util
import json
import subprocess
import sys

import pytest

from conftest import ROOT, sh, talk

spec = importlib.util.spec_from_file_location("talk_cli", ROOT / "scripts" / "talk.py")
talk_cli = importlib.util.module_from_spec(spec)
sys.path.insert(0, str(ROOT / "scripts"))
sys.modules["talk_cli"] = talk_cli          # dataclasses look the module up while it loads
spec.loader.exec_module(talk_cli)

NAMES = ["2026_04_28_editAI", "2026_10_00_Innoday", "2026_10_00_OpenData", "2027_03_01_InnodayRetro"]


# ---------------------------------------------------------------- matching

@pytest.mark.parametrize("query, want", [
    ("opendata", "2026_10_00_OpenData"),
    ("OPEN", "2026_10_00_OpenData"),
    ("open-data", "2026_10_00_OpenData"),        # - and _ do not count
    ("edit", "2026_04_28_editAI"),
    ("innoday", "2026_10_00_Innoday"),           # the exact name part beats InnodayRetro
    ("retro", "2027_03_01_InnodayRetro"),
    ("2026_10_00_OpenData", "2026_10_00_OpenData"),
])
def test_match_talk(query, want):
    assert talk_cli.match_talk(query, NAMES) == want


def test_match_talk_ambiguous_lists_candidates():
    with pytest.raises(talk_cli.UsageError) as e:
        talk_cli.match_talk("2026_10", NAMES)
    assert e.value.data["candidates"] == ["2026_10_00_Innoday", "2026_10_00_OpenData"]


def test_match_talk_none():
    with pytest.raises(talk_cli.UsageError, match="no talk matches"):
        talk_cli.match_talk("zzz", NAMES)


def test_upcoming():
    import datetime as dt
    today = dt.date(2026, 10, 8)
    assert talk_cli.upcoming("2026_10_26_UzsikraukKarjerai", today)
    assert talk_cli.upcoming("2026_10_00_OpenData", today)          # not dated yet
    assert not talk_cli.upcoming("2026_09_10_WorldOfParticles", today)


# ---------------------------------------------------------------- the --json contract and exit codes

def test_list_is_one_json_object(repo, env):
    code, obj, _ = talk(repo, "list", env=env)
    assert code == 0
    assert obj["verb"] == "list" and obj["ok"] is True and obj["exit"] == 0
    assert [t["name"] for t in obj["talks"]] == ["2026_04_28_editAI", "2026_10_00_Innoday", "2026_10_00_OpenData"]
    od = next(t for t in obj["talks"] if t["slug"] == "opendata")
    assert od["stage"] is True and od["pin"].startswith("640eaa5")


def test_human_text_goes_to_stderr(repo, env):
    r = subprocess.run([sys.executable, repo / "scripts" / "talk.py", "status", "--no-fetch", "--json"],
                       cwd=repo, env=env, capture_output=True, text=True)
    json.loads(r.stdout)                        # stdout is exactly one object
    assert "main checkout" in r.stderr          # the table went to stderr


@pytest.mark.parametrize("args, needle", [
    (["nosuchverb"], "invalid choice"),
    (["status", "--bogus"], "unrecognized arguments"),
    (["new", "badname"], "YYYY_MM_DD_Name"),
    (["map", "2026_10"], "matches 2 talks"),
    (["map", "zzz"], "no talk matches"),
    (["lint", "opendata"], "not installed on this branch"),
    (["facts", "search", "lhcb"], "not installed on this branch"),
    (["bump-toolkit", "640eaa5"], "bare commit"),
])
def test_usage_errors_exit_2(repo, env, args, needle):
    code, obj, _ = talk(repo, *args, env=env)
    assert code == 2
    assert obj["ok"] is False and obj["exit"] == 2 and needle in obj["error"]


@pytest.mark.parametrize("args, want", [
    (["facts", "--json", "search", "x"], ["--json", "search", "x"]),
    (["facts", "--facts", "/tmp/x.jsonl", "search", "y"], ["--facts", "/tmp/x.jsonl", "search", "y"]),
    (["facts", "--facts=/tmp/x.jsonl", "search", "y"], ["--facts=/tmp/x.jsonl", "search", "y"]),
    (["facts", "-h"], ["-h"]),
    (["facts", "search", "x", "--json"], ["search", "x", "--json"]),
    (["--json", "facts", "search", "x"], ["search", "x", "--json"]),
    (["--", "facts", "--limit", "3", "search", "x"], ["--limit", "3", "search", "x"]),
    (["--json", "facts", "search", "--", "-x"], ["search", "--json", "--", "-x"]),
])
def test_facts_passes_everything_through(repo, env, args, want):
    (repo / "scripts" / "facts.py").write_text("import json, sys\nprint(json.dumps({'argv': sys.argv[1:]}))\n")
    r = subprocess.run([sys.executable, repo / "scripts" / "talk.py", *args], cwd=repo, env=env,
                       capture_output=True, text=True)
    assert r.returncode == 0, r.stderr
    assert json.loads(r.stdout) == {"argv": want}         # facts.py's own object, alone on stdout


def test_ambiguous_name_lists_candidates(repo, env):
    _, obj, _ = talk(repo, "map", "2026_10", env=env)
    assert obj["candidates"] == ["2026_10_00_Innoday", "2026_10_00_OpenData"]


def test_leading_double_dash_from_pnpm(repo, env):
    r = subprocess.run([sys.executable, repo / "scripts" / "talk.py", "--", "list", "--json"],
                       cwd=repo, env=env, capture_output=True, text=True)
    assert r.returncode == 0 and json.loads(r.stdout)["verb"] == "list"


def test_status_flags_main_checkout_off_main(repo, env):
    code, obj, _ = talk(repo, "status", "--no-fetch", env=env)
    assert code == 0
    main = next(w for w in obj["worktrees"] if w["main_checkout"])
    assert main["branch"] == "main" and main["ahead"] == 0 and main["behind"] == 0
    sh(["git", "checkout", "-q", "-b", "wandered"], repo, env)
    code, obj, _ = talk(repo, "status", "--no-fetch", env=env)
    assert code == 1 and "stays on main" in obj["problems"][0]


# ---------------------------------------------------------------- new and open

def test_new_makes_a_worktree_with_the_scaffold(repo, env):
    code, obj, err = talk(repo, "new", "2099_01_01_Scratch", "--stage", "blue", "--lang", "lt", "--broadcast",
                          "--duration", "12", "--no-install", "--no-fetch", env=env)
    assert code == 0, err
    wt = repo / ".claude" / "worktrees" / "scratch"
    assert obj["worktree"] == str(wt) and obj["branch"] == "talk/scratch"
    assert sh(["git", "branch", "--show-current"], wt, env).stdout.strip() == "talk/scratch"
    upstream = sh(["git", "rev-parse", "--abbrev-ref", "talk/scratch@{upstream}"], wt, env, check=False)
    assert upstream.returncode != 0                 # --no-track: a bare `git push` cannot reach main
    d = wt / "talks" / "2099_01_01_Scratch"
    notes = (d / "CLAUDE.md").read_text()
    for section in ("Brief", "Status", "Arc", "Figures", "Talk-owned code", "Decisions", "Verify"):
        assert f"\n## {section}\n" in notes
    deck = (d / "deck.md").read_text()
    for line in ("lang: lt", "duration: 12min", "halo: false", "grain: 0", "aberration: 0", "flight: [2.5, 5]"):
        assert line in deck
    assert (d / "setup" / "main.ts").is_file() and (d / ".gitignore").read_text().count("/\n") == 3
    pkg = json.loads((d / "package.json").read_text())
    assert pkg["scripts"]["build:portable"].startswith("VITE_VIDEOS_LOCAL_FIRST=1 ")
    assert sh(["git", "status", "--porcelain"], repo, env).stdout == ""   # the main checkout is untouched
    code, obj, _ = talk(repo, "new", "2099_01_01_Scratch", "--no-install", "--no-fetch", env=env)
    assert code == 1 and "exists" in obj["error"]


def test_new_refuses_a_talk_that_exists(repo, env):
    code, obj, _ = talk(repo, "new", "2026_10_00_OpenData", "--no-install", "--no-fetch", env=env)
    assert code == 1 and "already exists" in obj["error"]


def test_open_creates_then_finds_the_worktree(repo, env):
    code, obj, _ = talk(repo, "open", "opendata", "--no-install", env=env)
    assert code == 0 and obj["created"] is True and obj["branch"] == "talk/opendata"
    code, obj, _ = talk(repo, "open", "opendata", "--no-install", env=env)
    assert code == 0 and obj["created"] is False and obj["worktree"].endswith("/worktrees/opendata")


# ---------------------------------------------------------------- deploy --dry-run refusals

@pytest.fixture
def od_worktree(repo, env):
    code, obj, err = talk(repo, "open", "opendata", "--no-install", env=env)
    assert code == 0, err
    return repo / ".claude" / "worktrees" / "opendata"


def commit_change(wt, env, text="# changed\n"):
    deck = wt / "talks" / "2026_10_00_OpenData" / "deck.md"
    deck.write_text(deck.read_text() + text)
    sh(["git", "commit", "-q", "-am", "change"], wt, env)


def origin_main(repo, env):
    return sh(["git", "rev-parse", "main"], repo.parent / "origin.git", env).stdout.strip()


def test_deploy_dry_run_refuses_a_dirty_tree(od_worktree, env):
    deck = od_worktree / "talks" / "2026_10_00_OpenData" / "deck.md"
    deck.write_text(deck.read_text() + "uncommitted\n")
    code, obj, _ = talk(od_worktree, "deploy", "opendata", "--dry-run", "--skip-ready", cwd=od_worktree, env=env)
    assert code == 1 and "uncommitted" in obj["error"]
    assert obj["dirty"] == ["talks/2026_10_00_OpenData/deck.md"]


def test_deploy_dry_run_refuses_head_not_on_origin_main(repo, od_worktree, env, tmp_path):
    commit_change(od_worktree, env)
    other = tmp_path / "other"
    sh(["git", "clone", "-q", tmp_path / "origin.git", other], tmp_path, env)
    (other / "README.md").write_text("someone else deployed\n")
    sh(["git", "add", "README.md"], other, env)
    sh(["git", "commit", "-q", "-m", "elsewhere"], other, env)
    sh(["git", "push", "-q", "origin", "main"], other, env)
    before = origin_main(repo, env)
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", "--skip-ready", cwd=od_worktree, env=env)
    assert code == 1 and "not an ancestor" in obj["error"]
    assert any("rebase origin/main" in line for line in obj["rebase"]) and "Rebase first" in err
    assert origin_main(repo, env) == before


def test_deploy_dry_run_passes_and_pushes_nothing(repo, od_worktree, env):
    commit_change(od_worktree, env)
    before = origin_main(repo, env)
    head = sh(["git", "rev-parse", "HEAD"], od_worktree, env).stdout.strip()
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", "--skip-ready", cwd=od_worktree, env=env)
    assert code == 0, err
    assert obj["would_push"] == head and obj["pushed"] is False and obj["ahead"] == 1
    assert obj["push"] == f"git push origin {head}:refs/heads/main"      # the commit itself, not HEAD
    assert origin_main(repo, env) == before
    assert not (repo / ".git" / "talk-status").exists()      # a dry run records nothing


# A lint step that does what a session working beside a background deploy might:
# commit, or leave an edit, while ready runs.
MEANWHILE = """import json, pathlib, subprocess, sys
if {mode!r} == "commit":
    subprocess.run(["git", "commit", "-q", "--allow-empty", "-m", "meanwhile"], check=True)
else:
    pathlib.Path(sys.argv[1], "deck.md").open("a").write("meanwhile\\n")
print(json.dumps({{"ok": True}}))
"""


@pytest.mark.parametrize("mode, needle", [("commit", "HEAD moved"), ("edit", "changed while ready ran")])
def test_deploy_refuses_what_changed_while_ready_ran(repo, od_worktree, env, mode, needle):
    (od_worktree / "scripts" / "talk_lint.py").write_text(MEANWHILE.format(mode=mode))
    sh(["git", "add", "scripts/talk_lint.py"], od_worktree, env)
    commit_change(od_worktree, env)
    head = sh(["git", "rev-parse", "HEAD"], od_worktree, env).stdout.strip()
    before = origin_main(repo, env)
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", "--ready-skip", "check",
                          "--ready-skip", "shots", cwd=od_worktree, env=env)
    assert code == 1, err
    assert obj["ready"]["ready"] is True and obj["sha"] == head
    assert needle in obj["error"] and "would_push" not in obj
    assert origin_main(repo, env) == before


def test_deploy_needs_the_talks_own_worktree(repo, od_worktree, env):
    code, obj, _ = talk(repo, "deploy", "innoday", "--dry-run", "--skip-ready", env=env)
    assert code == 2 and "no worktree of its own" in obj["error"]
    code, obj, _ = talk(od_worktree, "deploy", "innoday", "--dry-run", "--skip-ready", cwd=od_worktree, env=env)
    assert code == 2 and "does not change" in obj["error"]


def test_deploy_with_nothing_new(od_worktree, env):
    code, obj, _ = talk(od_worktree, "deploy", "opendata", "--dry-run", "--skip-ready", cwd=od_worktree, env=env)
    assert code == 0 and obj["ahead"] == 0 and obj["pushed"] is False


def test_bump_toolkit_dry_run_writes_nothing(repo, env):
    pkg = repo / "talks" / "2026_10_00_OpenData" / "package.json"
    before = pkg.read_bytes()
    code, obj, _ = talk(repo, "bump-toolkit", "v0.6.0", "--active", "--dry-run", env=env)
    assert code == 0 and obj["dry_run"] is True and obj["written"] == []
    assert {c["file"] for c in obj["changes"]} >= {"talks/2026_10_00_OpenData/package.json", "env.yaml"}
    assert pkg.read_bytes() == before
