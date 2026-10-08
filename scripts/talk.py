#!/usr/bin/env python3
"""One command per step of a talk's life, the same for the owner and for agents.

    pnpm talk <verb> [args]      from the repo root or a worktree's root
    talk <verb> [args]           from anywhere, with scripts/talk linked into ~/.local/bin

  new NAME [--title T] [--stage PALETTE] [--lang lt|en] [--duration MIN] [--broadcast]
                  a worktree .claude/worktrees/<slug> on branch talk/<slug> from
                  origin/main, the scaffold (scripts/new_talk.py), pnpm install
  open NAME       print the talk's worktree; make one from origin/main if it has none
  list            the talks: title, language, toolkit pin, worktrees
  status          every worktree: branch, talks it changes, ahead/behind origin/main,
                  dirty files; the last deploys and the last Pages run
  dev NAME        pnpm dev in the talk (more args after --)
  build NAME      build into /tmp/talk-<slug>/site (base /; --pages: the Pages base)
  check NAME      videos:check, stage:check with the talk's own types, build
  shots NAME      slidev-stage-shots of that build into talks/<t>/shots/
  review NAME     check, then shots --changed --sheet
  lint NAME       scripts/talk_lint.py      facts ...   scripts/facts.py
  map NAME        scripts/talk_map.py
  ready NAME      before the venue: lint --release, check, shots, videos:preflight,
                  venue --dry-run (and the safe-area check for a broadcast talk)
  record NAME     slidev-stage-record of the build: one MP4 per slide
  safe NAME       slidev-stage-safe of the build: the TV safe area
  deploy NAME     only when the owner asked: from the talk's worktree, push HEAD to
                  main, watch the Pages run, check the URL; --dry-run checks only
  doctor          tool versions, and which pnpm a bare shell runs
  bump-toolkit vX.Y.Z [--talk NAME ... | --active]
                  move the talks' addon pins, env.yaml and the scaffolder together

Every verb takes --json: one JSON object on stdout, human text on stderr
(through pnpm add -s, `pnpm -s talk status --json`, or pnpm prints its own
banner on stdout). Exit 0 ok, 1 problems found, 2 usage error. NAME is any case-insensitive part
of a talk directory's name ("opendata", "karjer"); without it, the talk is
the one the current directory is in, or the only one the worktree changes.
Talks resolve from the git worktree the command runs in, else the main checkout.
"""
from __future__ import annotations

import argparse
import datetime as dt
import fcntl
import functools
import hashlib
import json
import os
import re
import shlex
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
sys.dont_write_bytecode = True      # no __pycache__ left in the checkouts it runs from
import new_talk  # noqa: E402  (NAME_RE, REPO, PAGES, worktree_slug: one source for names and URLs)

# The conda env carries node, pnpm and the NVENC ffmpeg. A bare shell here finds
# a Windows pnpm shim first and a static ffmpeg that crashes on HTTPS.
ENV_BIN = Path(os.environ.get("TALK_ENV_BIN", Path.home() / "micromamba/envs/outreach_talks/bin"))
TMP = Path(os.environ.get("TALK_TMP", "/tmp"))
SHOTS_LOCK = Path("/tmp/slidev-stage-shots.lock")   # every headless browser run on this machine takes it
REPO_NAME = new_talk.REPO.split("/")[1]
STAGE_BINS = {"shots": "slidev-stage-shots", "record": "slidev-stage-record", "safe": "slidev-stage-safe"}
DELEGATES = {"lint": "talk_lint.py", "facts": "facts.py", "map": "talk_map.py"}
PASSTHROUGH = {"dev", "build", "shots", "record", "safe"}   # extra args go to the tool
SHA_RE = re.compile(r"^[0-9a-f]{7,40}$")
TAG_RE = re.compile(r"^v\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$")
PIN_RE = re.compile(r'("slidev-addon-(?:videos|stage)"\s*:\s*"github:MindaugasSarpis/slidev-videos#)([^"&]+)')
ENV_PIN_RE = re.compile(r"(slidev-videos @ git\+https://github\.com/MindaugasSarpis/slidev-videos@)([^\"'\s]+)")
REF_RE = re.compile(r'^(ADDONS_REF\s*=\s*")([^"]+)(")', re.M)
TYPE_RE = re.compile(r"registerBuilder\(\s*['\"]([\w:-]+)['\"]")


class UsageError(Exception):
    """Exit 2: the command line is wrong (bad name, ambiguous talk, missing tool)."""

    def __init__(self, msg: str, **data):
        super().__init__(msg)
        self.data = data


class Out:
    """--json: the result object alone on stdout, everything else on stderr."""

    json = False

    def say(self, *a) -> None:          # progress, hints, warnings
        print(*a, file=sys.stderr, flush=True)

    def show(self, *a) -> None:         # a verb's primary human output (a path, a table)
        print(*a, file=sys.stderr if self.json else sys.stdout, flush=True)

    def child_stdout(self):
        return sys.stderr.fileno() if self.json else None


OUT = Out()


# ---------------------------------------------------------------- processes

def tool_env(extra: dict | None = None) -> dict:
    env = os.environ.copy()
    if ENV_BIN.is_dir():
        env["PATH"] = f"{ENV_BIN}{os.pathsep}{env.get('PATH', '')}"
    env.update(extra or {})
    return env


def which(name: str, env: dict | None = None) -> str | None:
    return shutil.which(name, path=(env or tool_env())["PATH"])


def run(cmd: list, cwd: Path | None = None, env: dict | None = None, capture: bool = False,
        timeout: float | None = None, quiet: bool = False, stdin=None) -> subprocess.CompletedProcess:
    cmd = [str(c) for c in cmd]
    if not quiet:
        OUT.say("$ " + shlex.join(cmd) + (f"   # in {cwd}" if cwd else ""))
    try:
        if capture:
            return subprocess.run(cmd, cwd=cwd, env=env, capture_output=True, text=True, timeout=timeout, stdin=stdin)
        return subprocess.run(cmd, cwd=cwd, env=env, stdout=OUT.child_stdout(), timeout=timeout, stdin=stdin)
    except FileNotFoundError:
        return subprocess.CompletedProcess(cmd, 127, "", f"{cmd[0]}: not found")
    except subprocess.TimeoutExpired:
        return subprocess.CompletedProcess(cmd, 124, "", f"timed out after {timeout:.0f} s")


def git(args: list, cwd: Path, timeout: float = 60) -> subprocess.CompletedProcess:
    return run(["git", *args], cwd=cwd, capture=True, timeout=timeout, quiet=True)


def git_out(args: list, cwd: Path) -> str | None:
    r = git(args, cwd)
    return r.stdout.rstrip() if r.returncode == 0 else None     # porcelain lines start with a space


# ---------------------------------------------------------------- repo, worktrees, talks

@dataclass
class Repo:
    main: Path      # the main checkout; it stays on main
    common: Path    # the .git directory every worktree shares
    here: Path      # the checkout talks resolve from: the current worktree, else main

    @property
    def in_worktree(self) -> bool:
        return self.here.resolve() != self.main.resolve()


@dataclass
class Worktree:
    path: Path
    head: str
    branch: str | None
    main: bool
    prunable: bool


def invocation_dir() -> Path:
    # pnpm runs scripts from the package root and keeps the caller's directory in INIT_CWD
    return Path(os.environ.get("INIT_CWD") or os.getcwd())


def find_repo(cwd: Path) -> Repo:
    common = git_out(["rev-parse", "--path-format=absolute", "--git-common-dir"], SCRIPTS)
    if not common:
        raise UsageError(f"{SCRIPTS} is not in a git checkout")
    common_p = Path(common).resolve()
    here = main = common_p.parent
    if cwd.is_dir():
        top = git_out(["rev-parse", "--show-toplevel"], cwd)
        theirs = git_out(["rev-parse", "--path-format=absolute", "--git-common-dir"], cwd)
        if top and theirs and Path(theirs).resolve() == common_p:
            here = Path(top).resolve()
    return Repo(main=main, common=common_p, here=here)


def worktrees(repo: Repo) -> list[Worktree]:
    out = git_out(["worktree", "list", "--porcelain"], repo.main) or ""
    res, cur = [], {}
    for line in out.splitlines() + [""]:
        if not line:
            if cur:
                p = Path(cur["worktree"])
                res.append(Worktree(p, cur.get("HEAD", ""), cur.get("branch", "").removeprefix("refs/heads/") or None,
                                    p.resolve() == repo.main.resolve(), "prunable" in cur))
            cur = {}
            continue
        key, _, val = line.partition(" ")
        cur[key] = val
    return res


def talks_in(root: Path) -> list[str]:
    d = root / "talks"
    if not d.is_dir():
        return []
    return sorted(p.name for p in d.iterdir()
                  if p.is_dir() and new_talk.NAME_RE.match(p.name) and ((p / "deck.md").exists() or (p / "package.json").exists()))


def wt_slug(talk: str) -> str:
    return new_talk.worktree_slug(talk)


def norm(s: str) -> str:
    return re.sub(r"[\s_\-]+", "", s.lower())


def match_talk(query: str, names: list[str]) -> str:
    """Case-insensitive part of a directory name; an exact name or slug wins."""
    q = norm(query)
    if not q:
        raise UsageError("empty talk name", candidates=names)
    exact = [n for n in names if q in (norm(n), norm(n[11:]))]
    if len(exact) == 1:
        return exact[0]
    hits = [n for n in names if q in norm(n)]
    if len(hits) == 1:
        return hits[0]
    if not hits:
        raise UsageError(f"no talk matches {query!r}", candidates=names)
    raise UsageError(f"{query!r} matches {len(hits)} talks; say which", candidates=hits)


def porcelain_paths(text: str) -> list[str]:
    paths = []
    for line in text.splitlines():
        if len(line) > 3:
            paths.append(line[3:].split(" -> ")[-1].strip('"'))
    return paths


@functools.lru_cache(maxsize=None)
def talks_touched(wt: Path, base: str = "origin/main") -> list[str]:
    """Talk directories a worktree changes: its commits since the merge base, plus its working tree."""
    paths = (git_out(["diff", "--name-only", f"{base}...HEAD", "--", "talks/"], wt) or "").splitlines()
    paths += porcelain_paths(git_out(["status", "--porcelain", "--", "talks/"], wt) or "")
    names = {p.split("/")[1] for p in paths if p.startswith("talks/") and p.count("/") >= 1}
    return sorted(n for n in names if new_talk.NAME_RE.match(n))


def owners(repo: Repo, talk: str) -> list[Worktree]:
    """Linked worktrees that are the talk's: named after it, or changing it."""
    slug = wt_slug(talk)
    res = []
    for w in worktrees(repo):
        if w.main or w.prunable or not w.path.is_dir():
            continue
        if w.path.name == slug or talk in talks_touched(w.path):
            res.append(w)
    res.sort(key=lambda w: w.path.name != slug)   # the one named after the talk first
    return res


def default_talk(repo: Repo, cwd: Path) -> str | None:
    try:
        rel = cwd.resolve().relative_to((repo.here / "talks").resolve())
        if rel.parts:
            return rel.parts[0]
    except ValueError:
        pass
    if repo.in_worktree:
        touched = talks_touched(repo.here)
        if len(touched) == 1:
            return touched[0]
    return None


def resolve_talk(repo: Repo, name: str | None, cwd: Path) -> tuple[str, Path]:
    names = talks_in(repo.here)
    if name is None:
        talk = default_talk(repo, cwd)
        if not talk:
            raise UsageError("which talk? name one (any part of its directory name)", candidates=names)
    else:
        talk = match_talk(name, names)
    return talk, repo.here / "talks" / talk


def headmatter(deck: Path) -> tuple[dict, str]:
    """Top-level scalar keys of the deck's headmatter, and its raw text."""
    try:
        text = deck.read_text(encoding="utf-8")
    except OSError:
        return {}, ""
    m = re.match(r"---\r?\n(.*?)\r?\n---", text, re.S)
    if not m:
        return {}, ""
    keys = {}
    for line in m.group(1).splitlines():
        kv = re.match(r"^([\w-]+):\s*(.*?)\s*(?:#.*)?$", line)
        if kv and kv.group(2):
            keys[kv.group(1)] = kv.group(2).strip("'\"")
    return keys, m.group(1)


def read_json(p: Path) -> dict:
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def addon_pin(pkg: dict) -> str | None:
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    spec = deps.get("slidev-addon-videos") or deps.get("slidev-addon-stage") or ""
    return spec.split("#", 1)[1].split("&", 1)[0] if "#" in spec else None


def talk_info(root: Path, talk: str) -> dict:
    d = root / "talks" / talk
    pkg = read_json(d / "package.json")
    keys, raw = headmatter(d / "deck.md")
    deps = {**pkg.get("dependencies", {}), **pkg.get("devDependencies", {})}
    return {
        "name": talk,
        "slug": wt_slug(talk),
        "date": talk[:10].replace("_", "-"),
        "title": keys.get("title"),
        "description": pkg.get("description"),
        "lang": keys.get("lang"),
        "duration": keys.get("duration"),
        "stage": "slidev-addon-stage" in deps,
        "broadcast": bool(re.search(r"^\s*look:\s*['\"]?broadcast", raw, re.M) or re.search(r"\bgrain:\s*0\b", raw)),
        "pin": addon_pin(pkg),
        "url": f"{new_talk.PAGES}/{talk}/",
    }


def upcoming(talk: str, today: dt.date | None = None) -> bool:
    """Dated today or later, or not dated yet (a 00 month or day)."""
    y, m, d = (int(x) for x in talk[:10].split("_"))
    if m == 0 or d == 0:
        return True
    try:
        return dt.date(y, m, d) >= (today or dt.date.today())
    except ValueError:
        return True


# ---------------------------------------------------------------- builds and the stage bins

SKIP_DIRS = {"node_modules", "dist", "dist-portable", "shots", ".scratch", ".wf", ".git"}


def fingerprint(root: Path, talk: str) -> str:
    """What a build depends on, by path, size and mtime: the talk, theme, components, lockfile."""
    h = hashlib.sha1()
    for base in (root / "talks" / talk, root / "theme", root / "components"):
        for dirpath, dirnames, filenames in os.walk(base):      # the talk's components symlink is not followed
            dirnames[:] = sorted(d for d in dirnames if d not in SKIP_DIRS)
            for f in sorted(filenames):
                p = Path(dirpath) / f
                try:
                    st = p.lstat()
                except OSError:
                    continue
                h.update(f"{p.relative_to(root)}\0{st.st_size}\0{st.st_mtime_ns}\n".encode())
    for f in ("pnpm-lock.yaml", "package.json"):
        try:
            st = (root / f).stat()
            h.update(f"{f}\0{st.st_size}\0{st.st_mtime_ns}\n".encode())
        except OSError:
            pass
    return h.hexdigest()


def build_dir(talk: str) -> Path:
    return TMP / f"talk-{wt_slug(talk)}"


def installed(root: Path, talkdir: Path) -> bool:
    return (root / "node_modules").is_dir() and (talkdir / "node_modules").is_dir()


def do_build(repo: Repo, talk: str, pages: bool = False, extra: list | None = None) -> tuple[int, dict]:
    d = repo.here / "talks" / talk
    out = build_dir(talk) / "site"
    base = f"/{REPO_NAME}/{talk}/" if pages else "/"
    data = {"talk": talk, "out": str(out), "base": base}
    if not installed(repo.here, d):
        data["error"] = f"not installed: run `pnpm install` in {repo.here}"
        OUT.say(f"error: {data['error']}")
        return 1, data
    env = tool_env({"VITE_VIDEOS_LOCAL_FIRST": "1"})   # clips from public/videos first, not GitHub
    pnpm = which("pnpm", env)
    if not pnpm:
        data["error"] = "pnpm not found"
        return 1, data
    if out.exists():
        shutil.rmtree(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    t0 = time.monotonic()
    r = run([pnpm, "build", "--base", base, "--out", out, *(extra or [])], cwd=d, env=env)
    data["seconds"] = round(time.monotonic() - t0, 1)
    meta_path = build_dir(talk) / "build.json"
    if r.returncode == 0 and (out / "index.html").exists():
        meta = {"talk": talk, "root": str(repo.here), "head": git_out(["rev-parse", "HEAD"], repo.here),
                "fingerprint": fingerprint(repo.here, talk), "base": base,
                "built_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")}
        meta_path.write_text(json.dumps(meta, indent=2) + "\n")
        return 0, data
    meta_path.unlink(missing_ok=True)
    data["error"] = f"build failed (exit {r.returncode})"
    return 1, data


def build_current(repo: Repo, talk: str) -> bool:
    meta = read_json(build_dir(talk) / "build.json")
    return (meta.get("root") == str(repo.here) and meta.get("base") == "/"
            and meta.get("fingerprint") == fingerprint(repo.here, talk)
            and (build_dir(talk) / "site" / "index.html").exists())


def stage_bin(kind: str, talkdir: Path) -> Path | None:
    """$SLIDEV_STAGE_BIN first, then the talk's installed slidev-addon-stage, then
    another talk's in the same checkout (the bins photograph any built deck)."""
    name = STAGE_BINS[kind]
    dirs = [Path(os.environ["SLIDEV_STAGE_BIN"])] if os.environ.get("SLIDEV_STAGE_BIN") else []
    dirs.append(talkdir / "node_modules" / "slidev-addon-stage" / "bin")
    dirs += sorted(talkdir.parent.glob("*/node_modules/slidev-addon-stage/bin"), reverse=True)
    for b in dirs:
        for cand in (b / name, b / f"{kind}.mjs", b / f"{kind}.js"):
            if cand.is_file():
                return cand
        rel = read_json(b.parent / "package.json").get("bin", {}).get(name)
        if rel and (b.parent / rel).is_file():
            return b.parent / rel
    return None


class ShotsLock:
    """The machine-wide lock every headless browser run takes (flock(1) and flock(2) agree)."""

    def __enter__(self):
        self.f = open(SHOTS_LOCK, "a")
        try:
            fcntl.flock(self.f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            OUT.say(f"waiting for {SHOTS_LOCK} (another headless run) ...")
            fcntl.flock(self.f, fcntl.LOCK_EX)
        return self

    def __exit__(self, *exc):
        fcntl.flock(self.f, fcntl.LOCK_UN)
        self.f.close()


def ensure_build(repo: Repo, talk: str, no_build: bool, rebuild: bool) -> tuple[int, dict | None]:
    site = build_dir(talk) / "site"
    if no_build:
        if not (site / "index.html").exists():
            return 1, {"error": f"no build at {site}: drop --no-build"}
        return 0, None
    if rebuild or not build_current(repo, talk):
        return do_build(repo, talk)
    OUT.say(f"the build at {site} is current")
    return 0, None


def run_stage_bin(repo: Repo, kind: str, talk: str, args: list, *, no_build=False, rebuild=False) -> tuple[int, dict]:
    d = repo.here / "talks" / talk
    data: dict = {"talk": talk}
    b = stage_bin(kind, d)
    if not b:
        raise UsageError(f"{STAGE_BINS[kind]} is not installed: set SLIDEV_STAGE_BIN to a slidev-videos "
                         f"packages/stage/bin, or install the talk")
    data["bin"] = str(b)
    code, built = ensure_build(repo, talk, no_build, rebuild)
    if built:
        data["build"] = built
    if code:
        data.setdefault("error", (built or {}).get("error", "build failed"))
        return code, data
    node = which("node")
    if not node:
        data["error"] = "node not found"
        return 1, data
    with ShotsLock():
        # the stage tools lock for themselves unless told the lock is held already
        r = run([node, b, build_dir(talk) / "site", *args], cwd=d, env=tool_env({"SLIDEV_STAGE_SHOTS_LOCKED": str(SHOTS_LOCK)}))
    data["tool_exit"] = r.returncode
    # shots exits 2 on bad arguments (safe's 2 is "could not check"); any other failure is 1
    return (0 if r.returncode == 0 else 2 if (r.returncode, kind) == (2, "shots") else 1), data


def supports(binfile: Path, flag: str) -> bool:
    try:
        return f"'{flag}'" in binfile.read_text() or f'"{flag}"' in binfile.read_text()
    except OSError:
        return False


def do_shots(repo: Repo, talk: str, *, slides=None, changed=False, sheet=False, out=None,
             no_build=False, rebuild=False, extra: list | None = None) -> tuple[int, dict]:
    d = repo.here / "talks" / talk
    b = stage_bin("shots", d)
    outdir = Path(out) if out else d / "shots"
    args = [outdir]
    if slides:
        args += ["--slides", slides]
    for flag, on in (("--changed", changed), ("--sheet", sheet)):
        if on:
            if b and supports(b, flag):
                args.append(flag)
            else:
                OUT.say(f"warning: this slidev-stage-shots has no {flag} (SLIDEV_STAGE_BIN gives the new one); going without")
    # the settling shots tool writes <out>/shots.ndjson itself; the first one wants --json
    report = outdir / "shots.ndjson"
    if b and not supports(b, "--changed") and supports(b, "--json") and "--json" not in (extra or []):
        report = outdir / "report.json"
        args += ["--json", report]
    started = time.time()
    code, data = run_stage_bin(repo, "shots", talk, args + list(extra or []), no_build=no_build, rebuild=rebuild)
    data["out"] = str(outdir)
    if report.exists() and report.stat().st_mtime >= started:      # this run's, not an old one
        data["report"] = str(report)
    return code, data


# ---------------------------------------------------------------- steps for check / review / ready

def step(name: str, cmd: list | None, cwd: Path, env: dict | None = None, skip: str | None = None) -> dict:
    if skip:
        OUT.say(f"-- {name}: skipped ({skip})")
        return {"name": name, "ok": True, "skipped": skip}
    OUT.say(f"-- {name}")
    t0 = time.monotonic()
    r = run(cmd, cwd=cwd, env=env or tool_env())
    res = {"name": name, "ok": r.returncode == 0, "exit": r.returncode, "seconds": round(time.monotonic() - t0, 1),
           "cmd": shlex.join(str(c) for c in cmd)}
    if r.returncode == 127:
        res["error"] = f"{cmd[0]} not found"
    return res


def stage_types(d: Path) -> list[str]:
    """The talk's own object types: registerBuilder('x', ...) in setup/, plus --types in its stage:check."""
    types = set()
    if (d / "setup").is_dir():
        for p in (d / "setup").rglob("*"):
            if p.suffix in (".js", ".mjs", ".ts", ".vue") and p.is_file():
                types.update(TYPE_RE.findall(p.read_text(encoding="utf-8", errors="replace")))
    script = read_json(d / "package.json").get("scripts", {}).get("stage:check", "")
    m = re.search(r"--types[=\s]+([\w:,-]+)", script)
    if m:
        types.update(t for t in m.group(1).split(",") if t)
    return sorted(types)


def do_check(repo: Repo, talk: str, pages: bool = False) -> tuple[int, dict]:
    d = repo.here / "talks" / talk
    env = tool_env()
    info = talk_info(repo.here, talk)
    steps = []
    sv = which("slidev-videos", env)
    if (d / "videos.toml").exists():
        steps.append(step("videos:check", [sv or "slidev-videos", "check"], d, env))
    types = stage_types(d) if info["stage"] else []
    if info["stage"]:
        pnpm = which("pnpm", env) or "pnpm"
        steps.append(step("stage:check", [pnpm, "exec", "slidev-stage-check", ".", *(["--types", ",".join(types)] if types else [])], d, env))
    OUT.say("-- build")
    code, b = do_build(repo, talk, pages=pages)
    steps.append({"name": "build", "ok": code == 0, **b})
    ok = all(s["ok"] for s in steps)
    return (0 if ok else 1), {"talk": talk, "types": types, "steps": steps, "site": b.get("out")}


def delegate_script(repo: Repo, verb: str) -> Path | None:
    for root in (repo.here, SCRIPTS.parent):
        p = root / "scripts" / DELEGATES[verb]
        if p.is_file():
            return p
    return None


def run_delegate(repo: Repo, verb: str, args: list, capture_json: bool = False) -> tuple[int, dict | None]:
    """lint / facts / map live in their own scripts; the JSON object is theirs."""
    script = delegate_script(repo, verb)
    if not script:
        raise UsageError(f"`{verb}` is not installed on this branch (scripts/{DELEGATES[verb]} comes with feat/facts-lint)")
    want_json = OUT.json or capture_json
    cmd = [sys.executable, script, *args, *(["--json"] if want_json and "--json" not in args else [])]
    if capture_json:
        r = run(cmd, cwd=repo.here, env=tool_env(), capture=True)
        if r.stderr:
            sys.stderr.write(r.stderr)
        try:
            return r.returncode, json.loads(r.stdout) if r.stdout.strip() else None
        except ValueError:
            sys.stderr.write(r.stdout)
            return r.returncode, None
    r = subprocess.run([str(c) for c in cmd], cwd=repo.here, env=tool_env())   # its stdout is ours
    return r.returncode, None


# ---------------------------------------------------------------- github

def on_github(repo: Repo) -> bool:
    url = git_out(["remote", "get-url", "origin"], repo.main) or ""
    return "github.com" in url and which("gh") is not None


def gh_json(args: list, cwd: Path, timeout: float = 20):
    r = run(["gh", *args], cwd=cwd, capture=True, timeout=timeout, quiet=True)
    if r.returncode != 0:
        return None, (r.stderr or r.stdout).strip().splitlines()[-1:] or [f"gh exit {r.returncode}"]
    try:
        return json.loads(r.stdout), None
    except ValueError:
        return None, ["gh printed no JSON"]


RUN_FIELDS = "databaseId,headSha,status,conclusion,url,event,createdAt,displayTitle"


def last_pages_run(repo: Repo) -> dict:
    if not on_github(repo):
        return {"error": "origin is not on GitHub, or gh is missing"}
    data, err = gh_json(["run", "list", "--workflow", "deploy.yml", "-L", "1", "--json", RUN_FIELDS], repo.main)
    if err:
        return {"error": err[0] if err else "gh failed"}
    return data[0] if data else {}


def http_status(url: str, timeout: float = 15) -> int:
    try:
        with urllib.request.urlopen(urllib.request.Request(url, method="GET"), timeout=timeout) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except (urllib.error.URLError, OSError):
        return 0


# ---------------------------------------------------------------- verbs

def cmd_new(repo: Repo, a, extra) -> tuple[int, dict]:
    if not new_talk.NAME_RE.match(a.name):
        raise UsageError(f"{a.name!r} is not YYYY_MM_DD_Name")
    slug = wt_slug(a.name)
    wt = repo.main / ".claude" / "worktrees" / slug
    branch = f"talk/{slug}"
    data = {"talk": a.name, "worktree": str(wt), "branch": branch, "url": f"{new_talk.PAGES}/{a.name}/"}
    if wt.exists():
        data["error"] = f"{wt} exists: `pnpm talk open {slug}`"
        OUT.say(f"error: {data['error']}")
        return 1, data
    if git(["rev-parse", "--verify", "--quiet", f"refs/heads/{branch}"], repo.main).returncode == 0:
        data["error"] = f"branch {branch} exists: `pnpm talk open {slug}`"
        OUT.say(f"error: {data['error']}")
        return 1, data
    if not a.no_fetch:
        r = git(["fetch", "--quiet", "origin"], repo.main, timeout=60)
        if r.returncode:
            OUT.say(f"warning: git fetch failed ({r.stderr.strip()[:200]}); using the {a.base} this clone has")
    if git(["cat-file", "-e", f"{a.base}:talks/{a.name}"], repo.main).returncode == 0:
        data["error"] = f"talks/{a.name} already exists on {a.base}: `pnpm talk open {slug}`"
        OUT.say(f"error: {data['error']}")
        return 1, data
    r = run(["git", "worktree", "add", wt, "-b", branch, a.base, "--no-track"], cwd=repo.main, capture=True)
    if r.returncode:
        data["error"] = f"git worktree add failed: {r.stderr.strip()}"
        OUT.say(f"error: {data['error']}")
        return 1, data
    scaffold = [sys.executable, wt / "scripts" / "new_talk.py", a.name, "--lang", a.lang]
    if a.title:
        scaffold += ["--title", a.title]
    if a.stage:
        scaffold += ["--stage", a.stage]
    if a.duration:
        scaffold += ["--duration", str(a.duration)]
    if a.broadcast:
        scaffold.append("--broadcast")
    if a.aspect:
        scaffold += ["--aspect", a.aspect]
    r = run(scaffold, cwd=wt, capture=True)
    OUT.say((r.stdout + r.stderr).rstrip())
    if r.returncode:
        data["error"] = f"scaffold failed (exit {r.returncode}); the worktree stays at {wt}"
        return 1, data
    data["installed"] = False
    if not a.no_install:
        code = install(wt)
        data["installed"] = code == 0
        if code:
            data["error"] = f"pnpm install failed in {wt}; rerun it there"
            return 1, data
    OUT.show(str(wt))
    OUT.say(f"\nNext: cd {wt}\n  talks/{a.name}/CLAUDE.md: ask the owner the Brief questions, write the answers there\n"
            f"  pnpm talk dev {slug}")
    return 0, data


def install(wt: Path) -> int:
    env = tool_env()
    pnpm = which("pnpm", env)
    if not pnpm:
        OUT.say("error: pnpm not found")
        return 1
    # Never prompt (agents have no TTY, and a prompt there exits 0 having done nothing).
    return run([pnpm, "install", "--config.confirm-modules-purge=false"], cwd=wt, env=env, stdin=subprocess.DEVNULL).returncode


def known_talks(repo: Repo) -> dict[str, list[str]]:
    """Every talk any checkout has, and where: worktree paths, or 'origin/main'."""
    where: dict[str, list[str]] = {}
    for w in [Worktree(repo.here, "", None, False, False)] + worktrees(repo):
        if w.path.is_dir():
            for t in talks_in(w.path):
                where.setdefault(t, [])
                if str(w.path) not in where[t]:
                    where[t].append(str(w.path))
    for line in (git_out(["ls-tree", "--name-only", "origin/main", "talks/"], repo.main) or "").splitlines():
        t = line.split("/")[-1]
        if new_talk.NAME_RE.match(t):
            where.setdefault(t, []).append("origin/main")
    return where


def cmd_open(repo: Repo, a, extra) -> tuple[int, dict]:
    where = known_talks(repo)
    talk = match_talk(a.name, sorted(where))
    found = owners(repo, talk)
    data = {"talk": talk}
    if found:
        w = found[0]
        data.update(worktree=str(w.path), branch=w.branch, created=False, others=[str(o.path) for o in found[1:]])
        for o in found[1:]:
            OUT.say(f"also changed in {o.path} ({o.branch})")
        OUT.show(str(w.path))
        return 0, data
    slug = wt_slug(talk)
    wt = repo.main / ".claude" / "worktrees" / slug
    branch = f"talk/{slug}"
    if git(["cat-file", "-e", f"origin/main:talks/{talk}"], repo.main).returncode != 0:
        data["error"] = f"talks/{talk} is in no worktree of its own and not on origin/main ({', '.join(where[talk])})"
        OUT.say(f"error: {data['error']}")
        return 1, data
    if git(["rev-parse", "--verify", "--quiet", f"refs/heads/{branch}"], repo.main).returncode == 0:
        r = run(["git", "worktree", "add", wt, branch], cwd=repo.main, capture=True)
    else:
        r = run(["git", "worktree", "add", wt, "-b", branch, "origin/main", "--no-track"], cwd=repo.main, capture=True)
    if r.returncode:
        data["error"] = f"git worktree add failed: {r.stderr.strip()}"
        OUT.say(f"error: {data['error']}")
        return 1, data
    data.update(worktree=str(wt), branch=branch, created=True, installed=False)
    if not a.no_install:
        data["installed"] = install(wt) == 0
    OUT.show(str(wt))
    return (0 if a.no_install or data["installed"] else 1), data


def cmd_list(repo: Repo, a, extra) -> tuple[int, dict]:
    where = known_talks(repo)
    here_talks = set(talks_in(repo.here))
    rows = []
    for t in sorted(where):
        root = repo.here if t in here_talks else Path(next((p for p in where[t] if p != "origin/main"), str(repo.here)))
        info = talk_info(root, t) if (root / "talks" / t).is_dir() else {"name": t, "slug": wt_slug(t)}
        info["where"] = where[t]
        info["worktrees"] = [str(w.path) for w in owners(repo, t)]
        rows.append(info)
    for r in rows:
        flags = " ".join(x for x in (r.get("lang") or "", "stage" if r.get("stage") else "", "broadcast" if r.get("broadcast") else "") if x)
        wts = ", ".join(Path(w).name for w in r["worktrees"])
        OUT.show(f"{r['name']:<34} {(r.get('description') or r.get('title') or '')[:48]:<48} {flags:<16} "
                 f"{(r.get('pin') or '')[:10]:<10} {wts}")
    return 0, {"talks": rows}


def cmd_status(repo: Repo, a, extra) -> tuple[int, dict]:
    if not a.no_fetch:
        r = git(["fetch", "--quiet", "origin"], repo.main, timeout=20)
        if r.returncode:
            OUT.say("warning: git fetch failed (offline?); ahead/behind is against the origin/main this clone last saw")
    problems, rows = [], []
    for w in worktrees(repo):
        row = {"path": str(w.path), "branch": w.branch, "head": w.head[:12], "main_checkout": w.main}
        if w.prunable or not w.path.is_dir():
            row["missing"] = True
            rows.append(row)
            continue
        counts = git_out(["rev-list", "--left-right", "--count", "origin/main...HEAD"], w.path)
        if counts:
            behind, ahead = (int(x) for x in counts.split())
            row.update(ahead=ahead, behind=behind)
        dirty = porcelain_paths(git_out(["status", "--porcelain"], w.path) or "")
        row.update(dirty=len(dirty), dirty_files=dirty[:12], talks=talks_touched(w.path))
        if w.main and w.branch != "main":
            problems.append(f"the main checkout is on {w.branch or 'a detached HEAD'}; it stays on main "
                            f"(work in a worktree: pnpm talk open <name>)")
        rows.append(row)
    deploys = []
    sd = repo.common / "talk-status"
    if sd.is_dir():
        deploys = [read_json(p) for p in sorted(sd.glob("*.json"))]
    pages = last_pages_run(repo)
    for r in rows:
        name = "main checkout" if r["main_checkout"] else Path(r["path"]).name
        if r.get("missing"):
            OUT.show(f"{name:<22} missing (git worktree prune)")
            continue
        ab = f"ahead {r.get('ahead', '?')}, behind {r.get('behind', '?')}"
        OUT.show(f"{name:<22} {r['branch'] or '(detached)':<28} {ab:<22} dirty {r['dirty']:<4} {' '.join(r['talks'])}")
    for d in deploys:
        OUT.show(f"deploy  {d.get('talk')}: {'deployed' if d.get('deployed') else 'NOT deployed'} {d.get('sha', '')[:12]} "
                 f"{d.get('finished_at', '')} {d.get('url', '')}")
    if pages.get("error"):
        OUT.show(f"pages   unknown ({pages['error']})")
    elif pages:
        OUT.show(f"pages   {pages.get('status')} {pages.get('conclusion') or ''} {pages.get('headSha', '')[:12]} "
                 f"{pages.get('createdAt', '')} {pages.get('url', '')}")
    for p in problems:
        OUT.say(f"problem: {p}")
    return (1 if problems else 0), {"worktrees": rows, "deploys": deploys, "pages": pages, "problems": problems}


def cmd_dev(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, d = resolve_talk(repo, a.name, invocation_dir())
    if not installed(repo.here, d):
        raise UsageError(f"not installed: run `pnpm install` in {repo.here}")
    env = tool_env()
    r = run([which("pnpm", env) or "pnpm", "dev", *extra], cwd=d, env=env)
    return (0 if r.returncode in (0, 130) else 1), {"talk": talk, "tool_exit": r.returncode}


def cmd_build(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, _ = resolve_talk(repo, a.name, invocation_dir())
    return do_build(repo, talk, pages=a.pages, extra=extra)


def cmd_check(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, _ = resolve_talk(repo, a.name, invocation_dir())
    code, data = do_check(repo, talk, pages=a.pages)
    report_steps(data["steps"])
    return code, data


def report_steps(steps: list) -> None:
    for s in steps:
        state = "FAILED" if not s["ok"] else ("skipped" if s.get("skipped") else "ok")
        OUT.show(f"{s['name']:<14} {state}" + (f"  ({s['seconds']} s)" if s.get("seconds") is not None else "")
                 + (f"  {s['error']}" if s.get("error") else "") + (f"  {s['skipped']}" if s.get("skipped") else ""))


def cmd_shots(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, _ = resolve_talk(repo, a.name, invocation_dir())
    return do_shots(repo, talk, slides=a.slides, changed=a.changed, sheet=a.sheet, out=a.out,
                    no_build=a.no_build, rebuild=a.rebuild, extra=extra)


def cmd_review(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, _ = resolve_talk(repo, a.name, invocation_dir())
    code, check = do_check(repo, talk)
    steps = list(check["steps"])
    shots = None
    if any(s["name"] == "build" and s["ok"] for s in steps):
        OUT.say("-- shots (changed slides, contact sheet)")
        scode, shots = do_shots(repo, talk, changed=True, sheet=True, no_build=True)
        steps.append({"name": "shots", "ok": scode == 0, **{k: v for k, v in shots.items() if k != "talk"}})
    else:
        steps.append({"name": "shots", "ok": False, "skipped": "no build"})
    report_steps(steps)
    ok = all(s["ok"] for s in steps)
    return (0 if ok else 1), {"talk": talk, "steps": steps, "shots": (shots or {}).get("out")}


def cmd_delegate(repo: Repo, a, extra) -> tuple[int, dict | None]:
    if a.verb == "facts":
        code, _ = run_delegate(repo, "facts", list(a.rest))
        return code, None
    _, d = resolve_talk(repo, a.name, invocation_dir())
    args = [str(d)] + (["--release"] if getattr(a, "release", False) else [])
    code, _ = run_delegate(repo, a.verb, args)
    return code, None


def cmd_ready(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, d = resolve_talk(repo, a.name, invocation_dir())
    skip = set(a.skip or [])
    unknown = skip - {"lint", "check", "shots", "preflight", "venue", "safe"}
    if unknown:
        raise UsageError(f"--skip takes lint, check, shots, preflight, venue, safe (not {', '.join(sorted(unknown))})")
    info = talk_info(repo.here, talk)
    env = tool_env()
    steps = []
    if "lint" in skip:
        steps.append(step("lint", None, d, skip="--skip lint"))
    elif not delegate_script(repo, "lint"):
        steps.append({"name": "lint", "ok": False, "error": "not installed on this branch (feat/facts-lint); --skip lint to go without"})
    else:
        OUT.say("-- lint --release")
        code, obj = run_delegate(repo, "lint", [str(d), "--release"], capture_json=True)
        steps.append({"name": "lint", "ok": code == 0, "exit": code, "report": obj})
    built = False
    if "check" in skip:
        steps.append(step("check", None, d, skip="--skip check"))
    else:
        code, check = do_check(repo, talk)
        steps += [dict(s, name=f"check/{s['name']}") for s in check["steps"]]
        built = any(s["name"] == "build" and s["ok"] for s in check["steps"])
    if "shots" in skip:
        steps.append(step("shots", None, d, skip="--skip shots"))
    elif "check" not in skip and not built:
        steps.append({"name": "shots", "ok": False, "skipped": "no build"})
    else:
        OUT.say("-- shots (every slide)")
        try:
            code, shots = do_shots(repo, talk, no_build=built)
            steps.append({"name": "shots", "ok": code == 0, **{k: v for k, v in shots.items() if k != "talk"}})
        except UsageError as e:
            steps.append({"name": "shots", "ok": False, "error": str(e)})
    sv = which("slidev-videos", env) or "slidev-videos"
    has_videos = (d / "videos.toml").exists()
    steps.append(step("preflight", [sv, "preflight"], d, env,
                      skip="--skip preflight" if "preflight" in skip else (None if has_videos else "no videos.toml")))
    steps.append(step("venue", [sv, "venue", "--dry-run"], d, env,
                      skip="--skip venue" if "venue" in skip else (None if has_videos else "no videos.toml")))
    if info["broadcast"] or a.safe:
        if "safe" in skip:
            steps.append(step("safe", None, d, skip="--skip safe"))
        elif not stage_bin("safe", d):
            steps.append({"name": "safe", "ok": True, "skipped": "slidev-stage-safe not installed (SLIDEV_STAGE_BIN)"})
        else:
            OUT.say("-- safe area")
            code, sd = run_stage_bin(repo, "safe", talk, ["--broadcast"] if info["broadcast"] else [], no_build=built)
            steps.append({"name": "safe", "ok": code == 0, **{k: v for k, v in sd.items() if k != "talk"}})
    report_steps(steps)
    ok = all(s["ok"] for s in steps)
    OUT.say(f"\n{talk}: " + ("ready" if ok else "NOT ready"))
    return (0 if ok else 1), {"talk": talk, "ready": ok, "steps": steps}


def cmd_stage(repo: Repo, a, extra) -> tuple[int, dict]:
    """record / safe: the stage package's bins against the talk's build."""
    talk, d = resolve_talk(repo, a.name, invocation_dir())
    args = list(extra)
    if a.verb == "record":
        args = [Path(a.out) if a.out else d / "shots" / "record", *args]
    elif talk_info(repo.here, talk)["broadcast"] and "--broadcast" not in args:
        args.append("--broadcast")      # the rules for a picture that goes to air
    code, data = run_stage_bin(repo, a.verb, talk, args, no_build=a.no_build, rebuild=a.rebuild)
    return code, data


def deploy_worktree(repo: Repo, talk: str) -> Path:
    """The talk's own worktree: this one if it is named after the talk or changes it."""
    found = owners(repo, talk)
    if repo.in_worktree:
        if repo.here.name == wt_slug(talk) or talk in talks_touched(repo.here):
            return repo.here
        branch = git_out(["branch", "--show-current"], repo.here)
        raise UsageError(f"this worktree ({branch}) does not change {talk}; deploy from the talk's own worktree",
                         candidates=[str(w.path) for w in found])
    if len(found) == 1:
        return found[0].path
    if not found:
        raise UsageError(f"{talk} has no worktree of its own; deploy runs from one (`pnpm talk open {wt_slug(talk)}`), "
                         f"never from the main checkout")
    raise UsageError(f"{talk} is changed in {len(found)} worktrees; run deploy from the one to ship",
                     candidates=[str(w.path) for w in found])


def cmd_deploy(repo: Repo, a, extra) -> tuple[int, dict]:
    where = talks_in(repo.here) if repo.in_worktree else sorted(known_talks(repo))
    talk = match_talk(a.name, where) if a.name else default_talk(repo, invocation_dir())
    if not talk:
        raise UsageError("which talk? deploy NAME")
    wt = deploy_worktree(repo, talk)
    data = {"talk": talk, "worktree": str(wt), "dry_run": a.dry_run, "url": f"{new_talk.PAGES}/{talk}/"}

    def fail(msg: str, code: int = 1, **more) -> tuple[int, dict]:
        data.update(error=msg, **more)
        OUT.say(f"error: {msg}")
        return code, data

    if wt.resolve() == repo.main.resolve():
        return fail("deploy never runs from the main checkout")
    dirty = porcelain_paths(git_out(["status", "--porcelain"], wt) or "")
    if dirty:
        return fail(f"{wt} has uncommitted changes; commit them or set them aside first", dirty=dirty[:20])
    r = git(["fetch", "--quiet", "origin", "main"], wt, timeout=60)
    if r.returncode:
        if not a.dry_run:
            return fail(f"git fetch origin main failed: {r.stderr.strip()[:300]}")
        OUT.say("warning: git fetch failed; checking against the origin/main this clone last saw")
    rebase = [f"git -C {wt} rebase origin/main",
              "# a pnpm-lock.yaml conflict: take main's and reinstall, never merge it by hand",
              f"git -C {wt} checkout origin/main -- pnpm-lock.yaml && (cd {wt} && pnpm install) "
              f"&& git -C {wt} add pnpm-lock.yaml && git -C {wt} rebase --continue"]
    if git(["merge-base", "--is-ancestor", "origin/main", "HEAD"], wt).returncode != 0:
        OUT.say("HEAD is not on top of origin/main. Rebase first:\n  " + "\n  ".join(rebase))
        return fail("origin/main is not an ancestor of HEAD", rebase=rebase)
    sha = git_out(["rev-parse", "HEAD"], wt)
    ahead = int(git_out(["rev-list", "--count", "origin/main..HEAD"], wt) or 0)
    data.update(sha=sha, ahead=ahead)
    if ahead == 0:
        OUT.say(f"origin/main already has {sha[:12]}; nothing to push")
        data["pushed"] = False
        return 0, data
    talks = sorted({p.split("/")[1] for p in (git_out(["diff", "--name-only", "origin/main..HEAD"], wt) or "").splitlines()
                    if p.startswith("talks/") and "/" in p[6:]})
    data["talks_changed"] = talks
    others = [t for t in talks if t != talk]
    if others:
        OUT.say(f"note: these commits also change {', '.join(others)}")
    if not a.skip_ready:
        OUT.say(f"-- ready {talk}")
        sub = Repo(main=repo.main, common=repo.common, here=wt)
        code, ready = cmd_ready(sub, argparse.Namespace(name=talk, skip=a.ready_skip, safe=False), [])
        data["ready"] = ready
        if code:
            return fail(f"{talk} is not ready (fix it, or --skip-ready when the owner says so)")
    lock_path = repo.common / "talk-deploy.lock"
    with open(lock_path, "a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            OUT.say("waiting for another deploy to finish ...")
            fcntl.flock(lock, fcntl.LOCK_EX)
        # main may have moved while ready ran or the lock was held
        git(["fetch", "--quiet", "origin", "main"], wt, timeout=60)
        if git(["merge-base", "--is-ancestor", "origin/main", "HEAD"], wt).returncode != 0:
            OUT.say("origin/main moved meanwhile. Rebase first:\n  " + "\n  ".join(rebase))
            return fail("origin/main moved and is no longer an ancestor of HEAD", rebase=rebase)
        push = ["git", "push", "origin", "HEAD:main"]
        if a.dry_run:
            r = run(["git", "push", "--dry-run", "--porcelain", "origin", "HEAD:main"], cwd=wt, capture=True, timeout=60)
            data["push_check"] = (r.stdout + r.stderr).strip().splitlines()[-3:]
            if r.returncode:
                return fail("git push --dry-run failed", push=shlex.join(push))
            OUT.say(f"dry run: would run `{shlex.join(push)}` in {wt} ({ahead} commit{'s' * (ahead != 1)}, {sha[:12]}), "
                    f"watch the Pages run and check {data['url']}")
            data.update(pushed=False, would_push=sha)
            return 0, data
        r = run(push, cwd=wt, timeout=120)
        if r.returncode:
            return fail(f"git push failed (exit {r.returncode})")
        data["pushed"] = True
    return watch_deploy(repo, wt, talk, sha, data)


def watch_deploy(repo: Repo, wt: Path, talk: str, sha: str, data: dict) -> tuple[int, dict]:
    started = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
    record = {"talk": talk, "slug": wt_slug(talk), "sha": sha, "url": data["url"], "pushed_at": started, "deployed": False}
    try:
        if not on_github(repo):
            record["error"] = "gh missing or origin not on GitHub: the Pages run was not watched"
            return 1, data
        run_ = None
        deadline = time.monotonic() + 300
        while time.monotonic() < deadline and not run_:
            runs, _ = gh_json(["run", "list", "--workflow", "deploy.yml", "--branch", "main", "-L", "10", "--json", RUN_FIELDS], wt)
            run_ = next((x for x in runs or [] if x.get("headSha") == sha), None)
            if not run_:
                time.sleep(5)
        if not run_:
            record["error"] = "no Pages run for this commit appeared within 5 min"
            return 1, data
        record.update(run_id=run_["databaseId"], run_url=run_["url"])
        OUT.say(f"watching {run_['url']}")
        run(["gh", "run", "watch", str(run_["databaseId"]), "--interval", "10"], cwd=wt, timeout=1800)
        view, err = gh_json(["run", "view", str(run_["databaseId"]), "--json", "status,conclusion,jobs"], wt)
        jobs = {j["name"]: j.get("conclusion") for j in (view or {}).get("jobs", [])}
        record.update(run_conclusion=(view or {}).get("conclusion"),
                      talk_build=jobs.get(f"build {talk}"), pages_deploy=jobs.get("deploy"))
        failed_others = [n[6:] for n, c in jobs.items() if n.startswith("build ") and c == "failure" and n != f"build {talk}"]
        if failed_others:
            record["other_talks_failed"] = failed_others
            OUT.say(f"warning: the run is red because {', '.join(failed_others)} failed to build")
        if record["talk_build"] != "success" or record["pages_deploy"] != "success":
            record["error"] = f"{talk} build: {record['talk_build']}, Pages deploy: {record['pages_deploy']}"
            return 1, data
        code = 0
        for _ in range(24):          # Pages can lag the deploy job by a little
            code = http_status(data["url"])
            if code == 200:
                break
            time.sleep(5)
        record["http"] = code
        if code != 200:
            record["error"] = f"{data['url']} answers {code or 'nothing'}"
            return 1, data
        record["deployed"] = True
        OUT.say(f"deployed: {data['url']} ({sha[:12]}, {run_['url']})")
        return 0, data
    finally:
        record["finished_at"] = dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")
        sd = repo.common / "talk-status"
        sd.mkdir(exist_ok=True)
        (sd / f"{record['slug']}.json").write_text(json.dumps(record, indent=2) + "\n")
        data["status"] = record
        if record.get("error"):
            OUT.say(f"error: {record['error']} (not deployed)")


def version_of(cmd: list, env: dict, timeout: float = 20) -> str | None:
    r = run(cmd, env=env, capture=True, timeout=timeout, quiet=True, stdin=subprocess.DEVNULL)
    if r.returncode != 0:
        return None
    text = (r.stdout or r.stderr).strip().splitlines()
    return text[0].strip() if text else ""


def cmd_doctor(repo: Repo, a, extra) -> tuple[int, dict]:
    env = tool_env()
    bare = shutil.which("pnpm")
    problems, warnings, tools = [], [], {}

    def tool(name: str, cmd: list, required: bool = False) -> dict:
        path = which(cmd[0], env)
        info = {"path": path, "version": version_of([path, *cmd[1:]], env) if path else None}
        tools[name] = info
        if not path and required:
            problems.append(f"{name} not found")
        elif not path:
            warnings.append(f"{name} not found")
        return info

    tools["python"] = {"path": sys.executable, "version": sys.version.split()[0]}
    if sys.version_info < (3, 11):
        problems.append("python 3.11 or newer is needed")
    tool("git", ["git", "--version"], required=True)
    tools["env_bin"] = {"path": str(ENV_BIN), "present": ENV_BIN.is_dir()}
    if not ENV_BIN.is_dir():
        warnings.append(f"{ENV_BIN} is missing: tools come from the bare PATH")
    pn = tool("pnpm", ["pnpm", "--version"], required=True)
    node = tool("node", ["node", "--version"], required=True)
    if node.get("version") and int(re.sub(r"\D", "", node["version"].split(".")[0]) or 0) < 20:
        problems.append(f"node {node['version']} is too old (20 or newer)")
    tools["pnpm_bare"] = {"path": bare, "version": version_of([bare, "--version"], os.environ.copy()) if bare else None}
    if bare and bare.startswith("/mnt/"):
        warnings.append(f"a bare shell runs the Windows pnpm shim {bare} ({tools['pnpm_bare']['version']}); "
                        f"`pnpm talk` and `talk` put {ENV_BIN} first")
    ff = tool("ffmpeg", ["ffmpeg", "-hide_banner", "-version"])
    m = re.match(r"ffmpeg version (\S+)", ff.get("version") or "")
    if m:
        ff["version"] = m.group(1)
    if ff.get("path") and "/.local/bin/" in ff["path"]:
        warnings.append(f"ffmpeg is the static build at {ff['path']}: it crashes on HTTPS input")
    elif ff.get("path"):
        enc = run([ff["path"], "-hide_banner", "-encoders"], env=env, capture=True, timeout=20, quiet=True)
        ff["nvenc"] = "h264_nvenc" in (enc.stdout or "")
    gh = tool("gh", ["gh", "--version"])
    if gh.get("path"):
        auth = run([gh["path"], "auth", "status"], env=env, capture=True, timeout=20, quiet=True)
        gh["auth"] = auth.returncode == 0
        if not gh["auth"]:
            warnings.append("gh is not logged in: status and deploy cannot see the Pages runs")
    tool("rclone", ["rclone", "version"])
    sv = tool("slidev-videos", ["slidev-videos", "--help"])
    if sv.get("path"):
        sv["version"] = version_of([sv["path"], "--version"], env) or "installed (no --version)"
        helptext = run([sv["path"], "--help"], env=env, capture=True, timeout=20, quiet=True).stdout or ""
        if re.search(r"\bdoctor\b", helptext):
            OUT.say("-- slidev-videos doctor")
            r = run([sv["path"], "doctor"], env=env)
            sv["doctor"] = r.returncode
            if r.returncode:
                warnings.append("slidev-videos doctor found problems")
    pkg = read_json(repo.here / "package.json")
    tools["packageManager"] = pkg.get("packageManager")
    shots_bin = os.environ.get("SLIDEV_STAGE_BIN")
    tools["SLIDEV_STAGE_BIN"] = shots_bin
    if shots_bin and not Path(shots_bin).is_dir():
        warnings.append(f"SLIDEV_STAGE_BIN={shots_bin} is not a directory")
    # a worktree installed by another pnpm major is reinstalled from scratch on its next install
    major = (pn.get("version") or "").split(".")[0]
    for w in worktrees(repo):
        m = re.search(r"^packageManager:\s*pnpm@(\S+)", (w.path / "node_modules" / ".modules.yaml").read_text()
                      if (w.path / "node_modules" / ".modules.yaml").is_file() else "", re.M)
        if m and major and m.group(1).split(".")[0] != major:
            warnings.append(f"{w.path} was installed by pnpm {m.group(1)}; the next install there (pnpm {pn['version']}) "
                            f"starts from scratch")
    for name in ("python", "git", "pnpm", "pnpm_bare", "node", "ffmpeg", "gh", "rclone", "slidev-videos"):
        t = tools.get(name) or {}
        OUT.show(f"{name:<14} {t.get('version') or 'missing':<28} {t.get('path') or ''}")
    for w in warnings:
        OUT.say(f"warning: {w}")
    for p in problems:
        OUT.say(f"problem: {p}")
    return (1 if problems else 0), {"tools": tools, "warnings": warnings, "problems": problems}


def cmd_bump(repo: Repo, a, extra) -> tuple[int, dict]:
    ref = a.ref
    if SHA_RE.match(ref) and not a.allow_sha:
        raise UsageError(f"{ref} looks like a bare commit; pin a release tag (vX.Y.Z), or pass --allow-sha")
    if not SHA_RE.match(ref) and not TAG_RE.match(ref):
        raise UsageError(f"{ref!r} is not a release tag vX.Y.Z")
    if a.talk and a.active:
        raise UsageError("--talk or --active, not both")
    root = repo.here
    names = talks_in(root)
    scaffold = root / "scripts" / "new_talk.py"
    m = REF_RE.search(scaffold.read_text()) if scaffold.is_file() else None
    current = m.group(2) if m else None
    if a.talk:
        talks = sorted({match_talk(t, names) for t in a.talk})
    elif a.active:
        # upcoming talks made on the current toolkit: on the stage, or pinned where the scaffolder is
        talks = [t for t in names if upcoming(t) and (talk_info(root, t)["stage"] or talk_info(root, t)["pin"] == current)]
    else:
        talks = []
    changes, files = [], {}

    def edit(path: Path, regex: re.Pattern, what) -> None:
        if not path.is_file():
            return
        text = files.get(path) or path.read_text(encoding="utf-8")
        found = False

        def sub(mm: re.Match) -> str:
            nonlocal found
            found = True
            if mm.group(2) != ref:
                changes.append({"file": str(path.relative_to(root)), "what": what(mm) if callable(what) else what,
                                "before": mm.group(2), "after": ref})
            return mm.group(1) + ref + (mm.group(3) if mm.re.groups >= 3 else "")
        new = regex.sub(sub, text)
        if found:
            files[path] = new

    for t in talks:
        edit(root / "talks" / t / "package.json", PIN_RE, lambda mm: mm.group(1).split('"')[1])
    if (root / "env.yaml").is_file():
        edit(root / "env.yaml", ENV_PIN_RE, "pip slidev-videos")
    if scaffold.is_file():
        edit(scaffold, REF_RE, "ADDONS_REF")
    for path, text in files.items():
        if path.suffix == ".json":
            json.loads(text)          # still JSON
    written = []
    if not a.dry_run:
        changed_files = {c["file"] for c in changes}
        for path, text in files.items():
            if str(path.relative_to(root)) in changed_files:
                path.write_text(text, encoding="utf-8")
                written.append(str(path.relative_to(root)))
    skipped = [t for t in names if t not in talks]
    data = {"ref": ref, "dry_run": a.dry_run, "root": str(root), "talks": talks, "changes": changes,
            "written": written, "untouched_talks": skipped}
    if not a.talk and not a.active:
        data["note"] = "no talks named: only env.yaml and the scaffolder (--active or --talk NAME for talks)"
    OUT.say(f"{len(changes)} pin{'s' * (len(changes) != 1)} to move to {ref}" + (" (dry run)" if a.dry_run else ""))
    if written:
        OUT.say("next: pnpm install (the lockfile follows the pins), then pnpm talk check <talk> for each")
    if not OUT.json:
        print(json.dumps(data, indent=2))      # the diff is this verb's human output too
        data["_printed"] = True
    return 0, data


# ---------------------------------------------------------------- command line

class Parser(argparse.ArgumentParser):
    def __init__(self, *a, **kw):
        kw.setdefault("allow_abbrev", False)     # a tool's --clicks must not be read as a prefix of ours
        super().__init__(*a, **kw)

    def error(self, message):
        raise UsageError(message)


def build_parser() -> argparse.ArgumentParser:
    p = Parser(prog="talk", description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="verb", metavar="verb", parser_class=Parser)

    def verb(name: str, help: str, talk: bool = True) -> argparse.ArgumentParser:
        sp = sub.add_parser(name, help=help, description=help)
        if talk:
            sp.add_argument("name", nargs="?", help="any part of the talk directory's name")
        return sp

    sp = verb("new", "a worktree on talk/<slug> from origin/main, the scaffold, pnpm install", talk=False)
    sp.add_argument("name", help="YYYY_MM_DD_Name")
    sp.add_argument("--title")
    sp.add_argument("--stage", nargs="?", const="classic", choices=sorted(new_talk.PALETTES), metavar="PALETTE")
    sp.add_argument("--lang", default="en", choices=new_talk.LANGS)
    sp.add_argument("--duration", type=int, metavar="MIN")
    sp.add_argument("--broadcast", action="store_true")
    sp.add_argument("--aspect")
    sp.add_argument("--base", default="origin/main", help="start point (default origin/main)")
    sp.add_argument("--no-install", action="store_true")
    sp.add_argument("--no-fetch", action="store_true")
    sp = verb("open", "print the talk's worktree; make one from origin/main if it has none", talk=False)
    sp.add_argument("name")
    sp.add_argument("--no-install", action="store_true")
    verb("list", "the talks, their pins and worktrees", talk=False)
    sp = verb("status", "every worktree and the last Pages run", talk=False)
    sp.add_argument("--no-fetch", action="store_true")
    verb("dev", "pnpm dev in the talk (more args after --)")
    sp = verb("build", "build into /tmp/talk-<slug>/site")
    sp.add_argument("--pages", action="store_true", help="the Pages base /<repo>/<talk>/ instead of /")
    sp = verb("check", "videos:check, stage:check, build")
    sp.add_argument("--pages", action="store_true")
    sp = verb("shots", "slidev-stage-shots of the build into talks/<t>/shots/")
    sp.add_argument("--slides")
    sp.add_argument("--changed", action="store_true")
    sp.add_argument("--sheet", action="store_true")
    sp.add_argument("--out")
    sp.add_argument("--no-build", action="store_true", help="use the build that is there")
    sp.add_argument("--rebuild", action="store_true")
    verb("review", "check, then shots --changed --sheet")
    sp = verb("lint", "scripts/talk_lint.py")
    sp.add_argument("--release", action="store_true")
    sp = verb("facts", "scripts/facts.py search|add|show|check ...", talk=False)
    sp.add_argument("rest", nargs=argparse.REMAINDER)
    verb("map", "scripts/talk_map.py")
    sp = verb("ready", "lint --release, check, shots, videos:preflight, venue --dry-run")
    sp.add_argument("--skip", action="append", metavar="STEP", help="lint, check, shots, preflight, venue, safe")
    sp.add_argument("--safe", action="store_true", help="run the safe-area check even if the talk is not marked broadcast")
    for name, what in (("record", "slidev-stage-record: one MP4 per slide"), ("safe", "slidev-stage-safe: the TV safe area")):
        sp = verb(name, what)
        sp.add_argument("--no-build", action="store_true")
        sp.add_argument("--rebuild", action="store_true")
        if name == "record":
            sp.add_argument("--out")
    sp = verb("deploy", "only when the owner asked: push the talk's worktree HEAD to main, watch Pages, check the URL")
    sp.add_argument("--dry-run", action="store_true")
    sp.add_argument("--skip-ready", action="store_true")
    sp.add_argument("--ready-skip", action="append", metavar="STEP", help="pass --skip STEP to ready")
    verb("doctor", "tool versions, and which pnpm a bare shell runs", talk=False)
    sp = verb("bump-toolkit", "move addon pins, env.yaml and the scaffolder to a toolkit release", talk=False)
    sp.add_argument("ref", help="vX.Y.Z")
    sp.add_argument("--talk", nargs="+", metavar="NAME")
    sp.add_argument("--active", action="store_true", help="upcoming talks on the current toolkit")
    sp.add_argument("--dry-run", action="store_true")
    sp.add_argument("--allow-sha", action="store_true")
    return p


VERBS = {
    "new": cmd_new, "open": cmd_open, "list": cmd_list, "status": cmd_status, "dev": cmd_dev,
    "build": cmd_build, "check": cmd_check, "shots": cmd_shots, "review": cmd_review,
    "lint": cmd_delegate, "facts": cmd_delegate, "map": cmd_delegate, "ready": cmd_ready,
    "record": cmd_stage, "safe": cmd_stage, "deploy": cmd_deploy, "doctor": cmd_doctor, "bump-toolkit": cmd_bump,
}


def split_json_flag(argv: list[str]) -> list[str]:
    """--json anywhere before a `--` belongs to talk itself."""
    cut = argv.index("--") if "--" in argv else len(argv)
    head = [x for x in argv[:cut] if x != "--json"]
    if len(head) != cut:
        OUT.json = True
    return head + argv[cut:]


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    if argv[:1] == ["--"]:           # pnpm forwards the -- delimiter verbatim
        del argv[0]
    if "facts" in argv[:1] or argv[:2] == ["--json", "facts"]:
        # facts.py has flags of its own: they all pass through, --json too
        cut = argv.index("facts") + 1
        argv = split_json_flag(argv[:cut]) + argv[cut:]
        OUT.json = OUT.json or "--json" in argv[cut:]
    else:
        argv = split_json_flag(argv)
    verb = next((x for x in argv if not x.startswith("-")), None)
    result: dict = {"verb": verb}
    try:
        parser = build_parser()
        if verb == "facts":
            a, extra = parser.parse_args(argv), []
        else:
            a, extra = parser.parse_known_args(argv)
        if not a.verb:
            parser.print_help(sys.stderr)
            raise UsageError("name a verb")
        if extra[:1] == ["--"]:
            extra = extra[1:]
        elif "--" in extra:
            extra.remove("--")
        if extra and a.verb not in PASSTHROUGH:
            raise UsageError(f"unrecognized arguments: {' '.join(extra)}")
        repo = find_repo(invocation_dir())
        code, data = VERBS[a.verb](repo, a, extra)
        if data is None:             # a delegate printed its own result
            return code if code in (0, 1, 2) else 1
        printed = data.pop("_printed", False)
        result.update(data)
        result.update(ok=code == 0, exit=code)
    except UsageError as e:
        OUT.say(f"error: {e}")
        if e.data.get("candidates"):
            OUT.say("  " + "\n  ".join(e.data["candidates"]))
        code, printed = 2, False
        result.update(e.data)
        result.update(ok=False, exit=2, error=str(e))
    except KeyboardInterrupt:
        code, printed = 130, False
        result.update(ok=False, exit=130, error="interrupted")
    if OUT.json and not printed:
        print(json.dumps(result, ensure_ascii=False, default=str))
    return code


if __name__ == "__main__":
    sys.exit(main())
