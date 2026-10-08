"""scripts/talk.py: name matching, the --json contract, exit codes, worktrees, deploy refusals.

Run with pytest from the repo root (`python3 -m pytest tests`). Everything
happens in throwaway repos under pytest's tmp_path; deploy is only ever run
with --dry-run, against a bare origin on disk.
"""
from __future__ import annotations

import importlib.util
import json
import re
import subprocess
import sys
from pathlib import Path

import pytest

from conftest import ROOT, fake_bin, sh, talk

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
    assert code == 2 and "is 2026_10_00_OpenData's, not 2026_10_00_Innoday's" in obj["error"]


def other_worktree(repo, env, name, branch, edits: dict[str, str]):
    """A linked worktree `name` on `branch` from origin/main, with `edits` (path: text) committed."""
    wt = repo / ".claude" / "worktrees" / name
    sh(["git", "worktree", "add", "-q", wt, "-b", branch, "origin/main", "--no-track"], repo, env)
    for path, text in edits.items():
        (wt / path).parent.mkdir(parents=True, exist_ok=True)
        (wt / path).write_text(text)
    if edits:
        sh(["git", "add", *edits], wt, env)
        sh(["git", "commit", "-q", "-m", f"{name}: edits"], wt, env)
    return wt


ALL_TALKS = ["2026_04_28_editAI", "2026_10_00_Innoday", "2026_10_00_OpenData"]


def test_a_branch_changing_several_talks_is_none_of_theirs(repo, env, tmp_path):
    # tooling that gives every talk its notes file (on top of origin/main, so deploy would pass
    # the rebase check), and a branch that changes two talks' decks
    tools = other_worktree(repo, env, "tools-branch", "chore/tools", {f"talks/{t}/CLAUDE.md": "# notes\n" for t in ALL_TALKS})
    both = other_worktree(repo, env, "both", "feat/both", {f"talks/{t}/deck.md": "# changed\n" for t in ALL_TALKS[1:]})
    code, obj, _ = talk(repo, "status", "--no-fetch", env=env)
    rows = {Path(r["path"]).name: r for r in obj["worktrees"]}
    assert rows["tools-branch"]["talks"] == [] and rows["tools-branch"]["notes"] == ALL_TALKS
    assert rows["both"]["talks"] == ALL_TALKS[1:]
    code, obj, _ = talk(repo, "deploy", "opendata", "--dry-run", "--skip-ready", env=env)
    assert code == 2 and "no worktree of its own" in obj["error"]
    code, obj, _ = talk(tools, "deploy", "editai", "--dry-run", "--skip-ready", cwd=tools, env=env)
    assert code == 2 and "is not 2026_04_28_editAI's own: it changes no talk (only the notes of 3)" in obj["error"]
    code, obj, _ = talk(both, "deploy", "innoday", "--dry-run", "--skip-ready", cwd=both, env=env)
    assert code == 2 and "it changes 2026_10_00_Innoday, 2026_10_00_OpenData" in obj["error"]
    code, obj, _ = talk(repo, "open", "opendata", "--no-install", env=env)
    assert code == 0 and obj["created"] is True and obj["worktree"] == str(repo / ".claude" / "worktrees" / "opendata")
    code, obj, _ = talk(repo, "list", env=env)
    assert {t["slug"]: [Path(w).name for w in t["worktrees"]] for t in obj["talks"]} == \
        {"editai": [], "innoday": [], "opendata": ["opendata"]}
    # a worktree not named after the talk is its own when it changes that talk alone, or is on talk/<slug>
    # (or, with nothing else changed, the notes of that talk alone)
    other_worktree(repo, env, "inno-work", "feat/inno", {"talks/2026_10_00_Innoday/deck.md": "# mine\n"})
    other_worktree(repo, env, "inno-notes", "docs/inno", {"talks/2026_10_00_Innoday/CLAUDE.md": "# notes\n"})
    other_worktree(repo, env, "edit-work", "talk/editai", {})
    code, obj, _ = talk(repo, "list", env=env)
    assert {t["slug"]: sorted(Path(w).name for w in t["worktrees"]) for t in obj["talks"]} == \
        {"editai": ["edit-work"], "innoday": ["inno-notes", "inno-work"], "opendata": ["opendata"]}


def test_session_never_opens_a_tooling_worktree(repo, tmux):
    env, calls, _ = tmux
    other_worktree(repo, env, "tools-branch", "chore/tools", {f"talks/{t}/CLAUDE.md": "# notes\n" for t in ALL_TALKS})
    code, obj, err = talk(repo, "session", "editai", "--no-install", "--dry-run", env=env)
    assert code == 0, err
    assert obj["dir"] == str(repo / ".claude" / "worktrees" / "editai") and obj["would_create"] is True


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


# ---------------------------------------------------------------- settings: environment > env file > defaults

def test_config_defaults(tmp_path, monkeypatch):
    monkeypatch.setattr(talk_cli, "TOOLKIT_LOCK", tmp_path / "no-toolkit.lock")
    main = tmp_path / "root" / "outreach_talks"
    c = talk_cli.resolve_config({"HOME": str(tmp_path / "home"), "PATH": ""}, main)
    assert c["OUTREACH_ROOT"] == str(tmp_path / "root")
    assert c["SLIDEV_VIDEOS_DIR"] == str(tmp_path / "root" / "slidev-videos")
    assert c["OUTREACH_STATE"] == str(tmp_path / "home" / ".local" / "state" / "outreach_talks")
    assert c["RENDER_LOCK"] == str(tmp_path / "home" / ".local" / "state" / "outreach_talks" / "render.lock")
    assert c["RENDER_BACKEND"] == "local" and c["OUTREACH_ENV_BIN"] is None
    assert c.path == tmp_path / "home" / ".config" / "outreach_talks" / "env"
    assert all(not v.startswith(("environment", str(c.path))) for v in c.sources.values())


def test_config_file_under_the_environment(tmp_path):
    f = tmp_path / "env"
    f.write_text("# written by bootstrap\n"
                 "export OUTREACH_STATE='/srv/state'\n"
                 "RENDER_BACKEND=slurm   # a comment\n"
                 'SLIDEV_VIDEOS_DIR="~/sv"\n'
                 "RENDER_SRUN_ARGS='-p gpu --time=30'\n"
                 "SLIDEV_STAGE_GL=d3d12\n")
    environ = {"HOME": str(tmp_path), "PATH": "", "OUTREACH_CONFIG": str(f), "OUTREACH_STATE": "/from/env"}
    c = talk_cli.resolve_config(environ, tmp_path / "ot")
    assert c["OUTREACH_STATE"] == "/from/env" and c.sources["OUTREACH_STATE"] == "environment"
    assert c["RENDER_BACKEND"] == "slurm" and c.sources["RENDER_BACKEND"] == str(f)
    assert c["SLIDEV_VIDEOS_DIR"] == str(tmp_path / "sv")            # "..." expands ~
    assert c["RENDER_SRUN_ARGS"] == "-p gpu --time=30"               # '...' is literal
    assert c.file["SLIDEV_STAGE_GL"] == "d3d12"
    # on a cluster the builds go where the compute nodes see them
    assert c["TALK_TMP"] == str(tmp_path / ".cache" / "talk-builds")


def test_config_env_bin_and_the_shared_lock(tmp_path, monkeypatch):
    lock = tmp_path / "slidev-stage-shots.lock"
    lock.touch()
    monkeypatch.setattr(talk_cli, "TOOLKIT_LOCK", lock)
    conda = tmp_path / "conda"
    (conda / "bin").mkdir(parents=True)
    (conda / "bin" / "pnpm").touch()
    c = talk_cli.resolve_config({"HOME": str(tmp_path), "PATH": "", "CONDA_PREFIX": str(conda)}, tmp_path / "ot")
    assert c["OUTREACH_ENV_BIN"] == str(conda / "bin")
    assert c["RENDER_LOCK"] == str(lock)              # where the stage tools' lock exists, one queue
    mm = tmp_path / "micromamba" / "envs" / "outreach_talks" / "bin"
    mm.mkdir(parents=True)
    c = talk_cli.resolve_config({"HOME": str(tmp_path), "PATH": ""}, tmp_path / "ot")
    assert c["OUTREACH_ENV_BIN"] == str(mm)


def test_config_verb_reports_sources_and_passes_the_file_on(repo, env, tmp_path):
    cf = tmp_path / "config" / "env"
    cf.parent.mkdir()
    cf.write_text("RENDER_BACKEND=condor\nSLIDEV_STAGE_GL=llvmpipe\nPLAYWRIGHT_BROWSERS_PATH=/big/disk/pw\n")
    env = dict(env)
    del env["RENDER_BACKEND"]
    code, obj, _ = talk(repo, "config", env=env)
    assert code == 0 and obj["exists"] is True
    assert obj["values"]["RENDER_BACKEND"] == "condor" and obj["sources"]["RENDER_BACKEND"] == str(cf)
    assert obj["values"]["OUTREACH_STATE"] == env["OUTREACH_STATE"]
    assert obj["passed"] == {"SLIDEV_STAGE_GL": "llvmpipe", "PLAYWRIGHT_BROWSERS_PATH": "/big/disk/pw"}
    assert obj["gl"] == {"SLIDEV_STAGE_GL": "llvmpipe"}


# ---------------------------------------------------------------- render: srun, condor_run, or the lock

def path_with(d, env):
    return {**env, "PATH": f"{d}:/usr/bin:/bin"}


@pytest.mark.parametrize("bins, want", [({"sbatch"}, "slurm"), ({"condor_submit"}, "condor"),
                                        ({"sbatch", "condor_submit"}, "slurm"), (set(), "local")])
def test_detect_backend(tmp_path, bins, want):
    for b in bins:
        fake_bin(tmp_path / "bin", b, "exit 0\n")
    (tmp_path / "bin").mkdir(exist_ok=True)
    assert talk_cli.detect_backend({"PATH": str(tmp_path / "bin")}) == want


@pytest.mark.parametrize("sinfo, gres", [("gpu:a100:4\n(null)\n", ["--gres=gpu:1"]), ("(null)\n", [])])
def test_render_on_slurm(repo, env, tmp_path, sinfo, gres):
    b = tmp_path / "bin"
    fake_bin(b, "sbatch", "exit 0\n")
    fake_bin(b, "sinfo", f"printf '{sinfo}'\n")
    e = path_with(b, env)
    del e["RENDER_BACKEND"]                      # detected from sbatch on PATH
    e["RENDER_SRUN_ARGS"] = "-p render --time=20"
    code, obj, _ = talk(repo, "render", "--dry-run", "--", "pnpm", "videos:encode", "--", "--only", "a.mp4", env=e)
    assert code == 0 and obj["backend"] == "slurm" and obj["lock"] is None
    assert obj["argv"] == ["srun", *gres, "-p", "render", "--time=20", "pnpm", "videos:encode", "--", "--only", "a.mp4"]
    code, obj, _ = talk(repo, "render", "--dry-run", "--no-gpu", "--", "true", env=e)
    assert obj["argv"] == ["srun", "-p", "render", "--time=20", "true"]


def test_render_on_htcondor(repo, env, tmp_path):
    b = tmp_path / "bin"
    fake_bin(b, "condor_submit", "exit 0\n")
    fake_bin(b, "condor_status", "printf '0\\n2\\n'\n")
    e = path_with(b, env)
    del e["RENDER_BACKEND"]
    code, obj, _ = talk(repo, "render", "--dry-run", "--", "node", "shots.mjs", "a b", env=e)
    assert code == 0 and obj["backend"] == "condor"
    assert obj["argv"] == ["condor_run", "-a", "request_gpus = 1", "-a", "getenv = True", "node shots.mjs 'a b'"]


def test_render_runs_the_job_and_logs_it(repo, env, tmp_path):
    b = tmp_path / "bin"
    fake_bin(b, "sbatch", "exit 0\n")
    fake_bin(b, "sinfo", "exit 1\n")
    # srun: drop its own options, run the rest; say which slot the job saw
    fake_bin(b, "srun", 'while [ "${1#-}" != "$1" ]; do shift; done\necho "slot=$TALK_RENDER_SLOT"\nexec "$@"\n')
    e = path_with(b, env)
    del e["RENDER_BACKEND"]
    code, obj, err = talk(repo, "render", "--", "sh", "-c", "for i in $(seq 300); do echo line $i; done; echo 'error: boom'; exit 3",
                          env=e)
    assert code == 1 and obj["tool_exit"] == 3 and obj["backend"] == "slurm"
    log = (tmp_path / "state" / "logs").glob("outreach-render-*.log")
    text = next(log).read_text()
    assert "slot=slurm" in text and "line 300" in text and "error: boom" in text
    assert obj["log"].endswith(".log") and obj["summary"]["error_lines"] == 1
    assert "line 150" not in err and len(err) < 3000          # the terminal gets a summary


def test_render_local_holds_the_lock(repo, env, tmp_path):
    lock = tmp_path / "render.lock"
    probe = ("import fcntl, os\nf = open(os.environ['SLIDEV_STAGE_SHOTS_LOCKED'], 'a')\n"
             "print('slot', os.environ['TALK_RENDER_SLOT'])\n"
             "try:\n    fcntl.flock(f, fcntl.LOCK_EX | fcntl.LOCK_NB); print('lock FREE')\n"
             "except BlockingIOError:\n    print('lock HELD')\n")
    code, obj, _ = talk(repo, "render", "--", sys.executable, "-c", probe, env=env)
    assert code == 0 and obj["backend"] == "local" and obj["lock"] == str(lock)
    lines = next((tmp_path / "state" / "logs").glob("outreach-render-*.log")).read_text().splitlines()
    assert "slot local" in lines and "lock HELD" in lines
    # inside the slot already (talk render calling talk): no second lock, no srun
    code, obj, _ = talk(repo, "render", "--dry-run", "--", "true", env={**env, "TALK_RENDER_SLOT": "local"})
    assert obj["argv"] == ["true"] and obj["lock"] is None and "already in" in obj["note"]


# ---------------------------------------------------------------- the stage tools get the GL settings

def test_stage_tools_get_the_gl_settings(repo, env, tmp_path):
    b = tmp_path / "bin"
    fake_bin(b, "node", 'env | grep -E "^(SLIDEV_STAGE_|TALK_RENDER_SLOT|PLAYWRIGHT)" | sort > "$NODE_ENV_OUT"\n'
                        'echo "renderer: ANGLE (fake)"\n')
    stage = tmp_path / "stage-bin"
    fake_bin(stage, "slidev-stage-record", "\n")
    site = tmp_path / "tmp" / "talk-opendata" / "site"
    site.mkdir(parents=True)
    (site / "index.html").write_text("<html></html>\n")
    cf = tmp_path / "config" / "env"
    cf.parent.mkdir()
    cf.write_text("SLIDEV_STAGE_GL=d3d12\nSLIDEV_STAGE_MESA_D3D12='/opt/mesa'\nSLIDEV_STAGE_CHROMIUM_ARGS=--from-file\n")
    e = {**path_with(b, env), "SLIDEV_STAGE_BIN": str(stage), "SLIDEV_STAGE_CHROMIUM_ARGS": "--use-angle=gl --x",
         "SLIDEV_STAGE_CHROMIUM_ENV": "MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA", "NODE_ENV_OUT": str(tmp_path / "node.env")}
    code, obj, _ = talk(repo, "record", "opendata", "--no-build", env=e)
    assert code == 0, obj
    seen = dict(l.split("=", 1) for l in (tmp_path / "node.env").read_text().splitlines())
    assert seen["SLIDEV_STAGE_GL"] == "d3d12" and seen["SLIDEV_STAGE_MESA_D3D12"] == "/opt/mesa"
    assert seen["SLIDEV_STAGE_CHROMIUM_ARGS"] == "--use-angle=gl --x"          # the environment wins
    assert seen["SLIDEV_STAGE_CHROMIUM_ENV"] == "MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA"
    assert seen["TALK_RENDER_SLOT"] == "local" and seen["SLIDEV_STAGE_SHOTS_LOCKED"] == str(tmp_path / "render.lock")
    assert obj["gl"]["SLIDEV_STAGE_GL"] == "d3d12" and obj["render"]["backend"] == "local"
    assert obj["summary"]["first"] == ["renderer: ANGLE (fake)"]


# ---------------------------------------------------------------- logs: the terminal gets a summary

def test_summarize():
    text = "\x1b[32mvite v6\x1b[0m\n" + "".join(f"chunk {i}\n" for i in range(50)) + \
        "(!) Some chunks are larger than 500 kB\n0 errors so far\nError: Cannot find module 'x'\n"
    s = talk_cli.summarize(text, ok=False, tail=3)
    assert s["lines"] == 54 and s["error_lines"] == 1 and s["warning_lines"] == 1
    assert s["first"] == ["Error: Cannot find module 'x'", "(!) Some chunks are larger than 500 kB"]
    assert s["tail"] == ["(!) Some chunks are larger than 500 kB", "0 errors so far", "Error: Cannot find module 'x'"]
    assert "tail" not in talk_cli.summarize(text, ok=True)


def installed_tree(repo):
    (repo / "node_modules").mkdir(exist_ok=True)
    (repo / "talks" / "2026_10_00_OpenData" / "node_modules").mkdir(exist_ok=True)


def test_build_output_goes_to_the_log(repo, env, tmp_path):
    installed_tree(repo)
    b = tmp_path / "bin"
    fake_bin(b, "pnpm", 'for i in $(seq 400); do echo "transforming module $i"; done\n'
                        'echo "warning: a big chunk" >&2\necho "error: [vite] could not resolve ./x.js" >&2\nexit 1\n')
    code, obj, err = talk(repo, "build", "opendata", env=path_with(b, env))
    assert code == 1 and obj["error"].startswith("build failed")
    sha = sh(["git", "rev-parse", "--short=12", "HEAD"], repo, env).stdout.strip()
    log = tmp_path / "state" / "logs" / f"opendata-build-{sha}.log"
    assert obj["log"] == str(log) and "transforming module 400" in log.read_text()
    assert obj["summary"]["error_lines"] == 1 and obj["summary"]["warning_lines"] == 1
    assert obj["summary"]["first"][0] == "error: [vite] could not resolve ./x.js"
    assert "transforming module 200" not in err and str(log) in err


LINT_FAKE = """import json, sys
findings = [{"code": "W%d" % i, "severity": "warning", "message": "warn %d" % i, "file": "deck.md", "line": i, "slide": 1}
            for i in range(40)]
findings.append({"code": "NO-SRC", "severity": "error", "message": "a number with no source", "file": "deck.md",
                 "line": 99, "slide": 7})
print("\\n".join("human report line %d" % i for i in range(120)), file=sys.stderr)
print(json.dumps({"ok": False, "errors": 1, "warnings": 40, "counts": {"NO-SRC": 1, "W": 40}, "findings": findings}))
sys.exit(1)
"""


def test_lint_prints_counts_and_the_first_findings(repo, env, tmp_path):
    (repo / "scripts" / "talk_lint.py").write_text(LINT_FAKE)
    r = subprocess.run([sys.executable, repo / "scripts" / "talk.py", "lint", "opendata"], cwd=repo, env=env,
                       capture_output=True, text=True)
    assert r.returncode == 1
    out = r.stdout.splitlines()
    assert out[0].startswith("deck.md:99 slide 7 E NO-SRC")              # errors first
    assert len(out) == 17 and "1 error(s), 40 warning(s)" in out[-2] and "26 more" in out[-1]
    assert "human report line" not in r.stdout + r.stderr
    code, obj, _ = talk(repo, "lint", "opendata", env=env)
    assert code == 1 and len(obj["findings"]) == 41 and obj["log"].endswith(".log")   # the delegate's object, + log
    assert "human report line 119" in open(obj["log"]).read()


# ---------------------------------------------------------------- deploy runs ready once

COUNTING_LINT = """import json, os, sys
open(os.environ["LINT_COUNT"], "a").write("x")
print(json.dumps({"ok": True, "errors": 0, "warnings": 0, "counts": {}, "findings": []}))
"""


@pytest.fixture
def counted(od_worktree, env, tmp_path):
    (od_worktree / "scripts" / "talk_lint.py").write_text(COUNTING_LINT)
    sh(["git", "add", "scripts/talk_lint.py"], od_worktree, env)
    commit_change(od_worktree, env)
    count = tmp_path / "lint.count"
    return {**env, "LINT_COUNT": str(count)}, (lambda: len(count.read_text()) if count.exists() else 0)


SKIPS = ["--skip", "check", "--skip", "shots"]
READY_SKIPS = ["--ready-skip", "check", "--ready-skip", "shots"]


def test_deploy_reuses_the_ready_that_passed_this_commit(od_worktree, counted):
    env, runs = counted
    code, obj, err = talk(od_worktree, "ready", "opendata", *SKIPS, cwd=od_worktree, env=env)
    assert code == 0 and runs() == 1, err
    stamp = json.loads(open(obj["stamp"]).read())
    assert stamp["ok"] is True and stamp["skip"] == ["check", "shots"]
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", *READY_SKIPS, cwd=od_worktree, env=env)
    assert code == 0 and runs() == 1, err                 # not run a second time
    assert obj["ready"]["reused"] is True and obj["would_push"] == stamp["sha"]
    code, obj, _ = talk(od_worktree, "deploy", "opendata", "--dry-run", *READY_SKIPS, "--rerun-ready",
                        cwd=od_worktree, env=env)
    assert code == 0 and runs() == 2
    code, obj, _ = talk(od_worktree, "status", "--no-fetch", cwd=od_worktree, env=env)
    assert obj["deploys"] == [] and [r["sha"] for r in obj["ready"]] == [stamp["sha"]]


def test_deploy_runs_ready_once_without_a_stamp(od_worktree, counted):
    env, runs = counted
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", *READY_SKIPS, cwd=od_worktree, env=env)
    assert code == 0 and runs() == 1, err
    assert obj["ready"]["ready"] is True and "reused" not in obj["ready"]


RESTORING_LINT = """import json, os, subprocess, sys
open(os.environ["LINT_COUNT"], "a").write("x")
subprocess.run(["git", "checkout", "--", "deck.md"], cwd=sys.argv[1], check=True)      # the edit is gone
print(json.dumps({"ok": True, "errors": 0, "warnings": 0, "counts": {}, "findings": []}))
"""


def test_ready_does_not_stamp_edits_dropped_while_it_ran(od_worktree, counted):
    env, runs = counted
    (od_worktree / "scripts" / "talk_lint.py").write_text(RESTORING_LINT)
    sh(["git", "commit", "-q", "-am", "a lint that restores deck.md"], od_worktree, env)
    deck = od_worktree / "talks" / "2026_10_00_OpenData" / "deck.md"
    deck.write_text(deck.read_text() + "uncommitted, checked, then dropped\n")
    code, obj, err = talk(od_worktree, "ready", "opendata", *SKIPS, cwd=od_worktree, env=env)
    assert code == 0 and obj["ready"] is True and runs() == 1, err
    assert "stamp" not in obj and obj["not_stamped"] == "uncommitted changes when ready started"
    assert "not stamped" in err and not list((od_worktree.parent.parent.parent / ".git" / "talk-status").glob("*"))
    assert sh(["git", "status", "--porcelain"], od_worktree, env).stdout == ""      # clean now, at the same HEAD
    code, obj, err = talk(od_worktree, "deploy", "opendata", "--dry-run", *READY_SKIPS, cwd=od_worktree, env=env)
    assert code == 0 and runs() == 2 and "reused" not in obj["ready"], err        # so deploy runs ready itself
    code, obj, _ = talk(od_worktree, "ready", "opendata", *SKIPS, cwd=od_worktree, env=env)
    assert code == 0 and obj["stamp"]                                               # clean at both ends: stamped


def test_deploy_does_not_trust_a_weaker_or_older_stamp(od_worktree, counted):
    env, runs = counted
    talk(od_worktree, "ready", "opendata", *SKIPS, "--skip", "preflight", cwd=od_worktree, env=env)
    assert runs() == 1
    talk(od_worktree, "deploy", "opendata", "--dry-run", *READY_SKIPS, cwd=od_worktree, env=env)
    assert runs() == 2                                     # the stamp skipped more than deploy does
    commit_change(od_worktree, env, "# again\n")
    talk(od_worktree, "deploy", "opendata", "--dry-run", *READY_SKIPS, cwd=od_worktree, env=env)
    assert runs() == 3                                     # a new commit is checked again


# ---------------------------------------------------------------- pin: one talk, both addons

def test_pin_moves_both_addon_pins_of_one_talk(repo, od_worktree, env):
    code, obj, _ = talk(od_worktree, "pin", "v0.6.0", "--no-install", cwd=od_worktree, env=env)
    assert code == 0 and obj["talk"] == "2026_10_00_OpenData"
    pkg = json.loads((od_worktree / "talks" / "2026_10_00_OpenData" / "package.json").read_text())["devDependencies"]
    assert pkg["slidev-addon-videos"].endswith("#v0.6.0")
    assert pkg["slidev-addon-stage"].endswith("#v0.6.0&path:/packages/stage")
    assert "v0.4.0" in (od_worktree / "env.yaml").read_text()           # the CLI pin is bump-toolkit's
    assert {c["what"] for c in obj["changes"]} == {"slidev-addon-videos", "slidev-addon-stage"}
    code, obj, _ = talk(od_worktree, "pin", "opendata", "640eaa5", cwd=od_worktree, env=env)
    assert code == 2 and "bare commit" in obj["error"]
    code, obj, _ = talk(repo, "pin", "opendata", "v0.6.0", env=env)
    assert code == 2 and "never the main checkout" in obj["error"]


def test_pin_runs_only_in_the_talks_own_worktree(repo, od_worktree, env):
    inno = repo / "talks" / "2026_10_00_Innoday" / "package.json"
    before = inno.read_bytes()
    other = other_worktree(repo, env, "other", "feat/other", {"README.md": "no talk here\n"})
    code, obj, _ = talk(other, "pin", "opendata", "v0.6.0", "--dry-run", cwd=other, env=env)
    assert code == 2 and "(other, feat/other) is not 2026_10_00_OpenData's own: it changes no talk" in obj["error"]
    assert "pnpm talk open opendata" in obj["error"] and obj["candidates"] == [str(od_worktree)]
    code, obj, _ = talk(od_worktree, "pin", "innoday", "v0.6.0", "--dry-run", cwd=od_worktree, env=env)
    assert code == 2 and "is 2026_10_00_OpenData's, not 2026_10_00_Innoday's" in obj["error"]
    assert "pnpm talk open innoday" in obj["error"]
    assert inno.read_bytes() == before
    assert (od_worktree / "talks" / "2026_10_00_Innoday" / "package.json").read_bytes() == before


# ---------------------------------------------------------------- session and sessions, with a fake tmux

FAKE_TMUX = """import json, os, sys
a = sys.argv[1:]
with open(os.environ["TMUX_LOG"], "a") as f:
    f.write(json.dumps({"argv": a, "INIT_CWD": os.environ.get("INIT_CWD"),
                        "npm": sorted(k for k in os.environ if k.startswith("npm_"))}) + "\\n")
if a[0] == "list-windows":
    w = os.environ.get("TMUX_WINDOWS")
    if not w or not os.path.exists(w):
        print("can't find session: talks", file=sys.stderr)
        sys.exit(1)
    print(open(w).read(), end="")
"""


@pytest.fixture
def tmux(env, tmp_path):
    b = tmp_path / "bin"
    fake_bin(b, "tmux", f'exec {sys.executable} {tmp_path / "fake_tmux.py"} "$@"\n')
    (tmp_path / "fake_tmux.py").write_text(FAKE_TMUX)
    log = tmp_path / "tmux.log"
    e = {**path_with(b, env), "TMUX_LOG": str(log), "TMUX_WINDOWS": str(tmp_path / "windows"),
         "SLIDEV_VIDEOS_DIR": str(tmp_path / "slidev-videos"), "INIT_CWD": "/somewhere", "npm_config_x": "1"}
    (tmp_path / "slidev-videos").mkdir()

    def calls():
        return [json.loads(l) for l in log.read_text().splitlines()] if log.exists() else []
    return e, calls, tmp_path / "windows"


def test_session_for_a_talk_starts_the_tmux_session(repo, tmux):
    env, calls, _ = tmux
    env = {**env, "INIT_CWD": str(repo)}
    code, obj, err = talk(repo, "session", "opendata", "--no-install", env=env)
    assert code == 0, err
    wt = repo / ".claude" / "worktrees" / "opendata"
    assert obj["created"] == "session" and obj["window"] == "opendata" and obj["dir"] == str(wt)
    assert obj["command"] == ["claude", "--name", "Talk: OpenData", "--remote-control", "Talk: OpenData"]
    new = calls()[-1]
    a = new["argv"]
    assert a[:7] == ["new-session", "-d", "-s", "talks", "-n", "opendata", "-c"] and a[7] == str(wt)
    assert a[8] == "-e" and a[9].startswith("PATH=")
    assert a[10] == "claude --name 'Talk: OpenData' --remote-control 'Talk: OpenData'"
    assert new["INIT_CWD"] is None and new["npm"] == []      # pnpm's script variables stay out of tmux
    assert obj["attach"] == "tmux attach -t talks:opendata" and wt.is_dir()


def test_session_tools_and_scheduler_add_windows(repo, tmux, tmp_path):
    env, calls, windows = tmux
    windows.write_text("0\topendata\t/x\tclaude\t1\n")
    code, obj, _ = talk(repo, "session", "tools", env=env)
    assert code == 0 and obj["created"] == "window"
    a = calls()[-1]["argv"]
    assert a[:6] == ["new-window", "-d", "-t", "=talks:", "-n", "tools"] and a[7] == str(tmp_path / "slidev-videos")
    assert a[-1] == "claude --name Tools --remote-control Tools"
    code, obj, _ = talk(repo, "session", "scheduler", env=env)
    a = calls()[-1]["argv"]
    assert a[5] == "scheduler" and a[7] == str(repo)
    assert a[-1] == f"claude --name Scheduler --remote-control Scheduler --add-dir {tmp_path / 'slidev-videos'}"


def test_session_already_open_prints_the_attach_command(repo, tmux):
    env, calls, windows = tmux
    windows.write_text("0\tscheduler\t/x\tclaude\t1\n1\ttools\t/y\tclaude\t0\n")
    r = subprocess.run([sys.executable, repo / "scripts" / "talk.py", "session", "tools"], cwd=repo, env=env,
                       capture_output=True, text=True)
    assert r.returncode == 0 and r.stdout.strip() == "tmux attach -t talks:tools"
    assert [c["argv"][0] for c in calls()] == ["list-windows"]          # nothing started
    code, obj, _ = talk(repo, "session", "tools", env={**env, "TMUX": "/tmp/tmux-1/default,1,0"})
    assert obj["existing"] is True and obj["attach"] == "tmux switch-client -t talks:tools"


def test_sessions_lists_windows_with_their_status_lines(repo, tmux, tmp_path):
    env, _, windows = tmux
    windows.write_text("0\tscheduler\t/x\tclaude\t1\n1\topendata\t/y\tclaude\t0\n")
    (tmp_path / "state").mkdir(exist_ok=True)
    (tmp_path / "state" / "status.md").write_text(
        "# status\n"
        "opendata | talk/opendata | 640eaa5 | review round 2 | - | pnpm talk ready opendata\n"
        "innoday | talk/innoday | v0.5.0 | parked | owner: the date | pnpm talk session innoday\n")
    code, obj, err = talk(repo, "sessions", env=env)
    assert code == 0 and obj["running"] is True
    rows = {w["name"]: w for w in obj["windows"]}
    assert rows["opendata"]["status"]["doing"] == "review round 2" and rows["scheduler"]["status"] is None
    assert [s["name"] for s in obj["status_only"]] == ["innoday"]
    windows.unlink()
    code, obj, err = talk(repo, "sessions", env=env)
    assert code == 0 and obj["running"] is False and 'no tmux session "talks"' in err


# ---------------------------------------------------------------- scripts/bootstrap.sh: what it detects and writes

BOOT = ROOT / "scripts" / "bootstrap.sh"


@pytest.fixture
def boot(tmp_path):
    """Run bootstrap.sh against tmp: its own HOME, settings file, prefix and repos root; no /dev/dxg, no X."""
    (tmp_path / "root" / "slidev-videos" / ".git").mkdir(parents=True)
    conf = tmp_path / "home" / ".config" / "outreach_talks" / "env"

    def run(*args, bins=(), extra=None, dry=True):
        b = tmp_path / "bin"
        b.mkdir(exist_ok=True)
        for name, body in bins:
            fake_bin(b, name, body)
        env = {"HOME": str(tmp_path / "home"), "PATH": f"{b}:/usr/bin:/bin", "OUTREACH_ROOT": str(tmp_path / "root"),
               "BOOTSTRAP_DXG": str(tmp_path / "no-dxg"), "BOOTSTRAP_X0": str(tmp_path / "no-x0"), **(extra or {})}
        r = subprocess.run(["bash", BOOT, *(["--dry-run"] if dry else []), "--no-env", "--no-install",
                            "--prefix", tmp_path / "mm", "--config", conf, *args], env=env, capture_output=True, text=True)
        written = dict(re.findall(r"^     \| (\w+)='(.*)'$", r.stdout, re.M))
        return r, written
    return run, conf


SBATCH = ("sbatch", "exit 0\n")
NVIDIA_SMI = ("nvidia-smi", "echo 'GPU 0: NVIDIA (fake)'\n")


@pytest.mark.parametrize("bins, want", [
    ([SBATCH, ("sinfo", "printf 'gpu:a100:4\\n(null)\\n'\n")],
     {"RENDER_BACKEND": "slurm", "RENDER_GPUS": "1", "SLIDEV_STAGE_GL": "auto"}),
    ([SBATCH, ("sinfo", "echo '(null)'\n")], {"RENDER_BACKEND": "slurm", "RENDER_GPUS": "0"}),
    ([("condor_submit", "exit 0\n"), ("condor_status", "printf '0\\n2\\n'\n")],
     {"RENDER_BACKEND": "condor", "RENDER_GPUS": "1", "SLIDEV_STAGE_GL": "auto"}),
    ([NVIDIA_SMI], {"RENDER_BACKEND": "local", "SLIDEV_STAGE_GL": "gpu-nvidia"}),
    ([], {"RENDER_BACKEND": "local", "SLIDEV_STAGE_GL": "auto"}),        # no GPU, no X display
])
def test_bootstrap_detects_the_render_backend(boot, bins, want):
    run, conf = boot
    r, written = run(bins=bins)
    assert r.returncode == 0, r.stdout + r.stderr
    assert {k: written.get(k) for k in want} == want
    assert "RENDER_GPUS" in written or want["RENDER_BACKEND"] == "local"
    assert "dry run: nothing was changed" in r.stdout and not conf.exists()


def test_bootstrap_on_wsl_takes_d3d12_only_with_the_mesa_prefix(boot, tmp_path):
    run, _ = boot
    (tmp_path / "dxg").touch()
    (tmp_path / "x0").touch()
    wsl = {"BOOTSTRAP_DXG": str(tmp_path / "dxg"), "BOOTSTRAP_X0": str(tmp_path / "x0")}
    r, written = run(bins=[NVIDIA_SMI], extra=wsl)
    assert written["SLIDEV_STAGE_GL"] == "llvmpipe" and "--mesa-d3d12" in r.stdout
    mesa = tmp_path / "mesa"
    (mesa / "root" / "usr" / "lib64" / "dri").mkdir(parents=True)
    (mesa / "root" / "usr" / "lib64" / "dri" / "d3d12_dri.so").touch()
    r, written = run(bins=[NVIDIA_SMI], extra={**wsl, "SLIDEV_STAGE_MESA_D3D12": str(mesa)})
    assert written["SLIDEV_STAGE_GL"] == "d3d12" and written["SLIDEV_STAGE_MESA_D3D12"] == str(mesa)
    assert written["SLIDEV_STAGE_CHROMIUM_ENV"] == "MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA"


def test_bootstrap_writes_once_and_keeps_the_owners_values(boot, tmp_path):
    run, conf = boot
    r, _ = run(dry=False)
    assert r.returncode == 0, r.stdout + r.stderr
    first = conf.read_text()
    assert f"OUTREACH_ROOT='{tmp_path / 'root'}'" in first and "RENDER_BACKEND='local'" in first
    assert (tmp_path / "home" / ".local" / "state" / "outreach_talks" / "logs").is_dir()
    assert not (tmp_path / "home" / ".claude").exists()                    # never settings or hooks
    assert "permissions" in r.stdout and "pnpm talk session scheduler" in r.stdout
    r, _ = run(dry=False)
    assert "unchanged" in r.stdout and conf.read_text() == first           # idempotent
    conf.write_text(first.replace("SLIDEV_STAGE_GL='auto'", "SLIDEV_STAGE_GL='swiftshader'") + "MY_OWN=1\n")
    r, _ = run(dry=False, bins=[NVIDIA_SMI])
    text = conf.read_text()
    assert "SLIDEV_STAGE_GL='swiftshader'" in text and "MY_OWN=1" in text and "--redetect" in r.stdout
    r, _ = run("--redetect", dry=False, bins=[NVIDIA_SMI])
    assert "SLIDEV_STAGE_GL='gpu-nvidia'" in conf.read_text()
    c = talk_cli.resolve_config({"HOME": str(tmp_path / "home"), "PATH": ""}, tmp_path / "root" / "outreach_talks")
    assert c["OUTREACH_ROOT"] == str(tmp_path / "root") and c.file["SLIDEV_STAGE_GL"] == "gpu-nvidia"
