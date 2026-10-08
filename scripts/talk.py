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
  build NAME      build into $TALK_TMP/talk-<slug>/site (base /; --pages: the Pages base)
  check NAME      videos:check, stage:check with the talk's own types, build
  shots NAME      slidev-stage-shots of that build into talks/<t>/shots/
  review NAME     check, then shots --changed --sheet
  lint NAME       scripts/talk_lint.py
  facts ...       scripts/facts.py, everything after `facts` passed as it is
  map NAME        scripts/talk_map.py
  ready NAME      before the venue: lint --release, check, shots, videos:preflight,
                  venue --dry-run (and the safe-area check for a broadcast talk)
  record NAME     slidev-stage-record of the build: one MP4 per slide
  safe NAME       slidev-stage-safe of the build: the TV safe area
  deploy NAME     only when the owner asked: from the talk's worktree, ready (unless
                  ready already passed this commit), then push the commit ready passed
                  to main, watch the Pages run, check the URL; --dry-run checks only
  render -- CMD   run CMD in the render slot: srun on Slurm, condor_run on HTCondor,
                  else under the machine's render lock
  pin [NAME] REF  both addon pins of one talk to a toolkit tag, then pnpm install,
                  in the talk's own worktree
  session NAME|tools|scheduler
                  a Claude session in its own window of the tmux session "talks"
  sessions        the windows of "talks" and each one's line in the status file
  config          the settings talk resolved, and where each came from
  doctor          tool versions, and which pnpm a bare shell runs
  bump-toolkit vX.Y.Z [--talk NAME ... | --active]
                  move the talks' addon pins, env.yaml and the scaffolder together

Every verb takes --json: one JSON object on stdout, human text on stderr
(through pnpm add -s, `pnpm -s talk status --json`, or pnpm prints its own
banner on stdout). Exit 0 ok, 1 problems found, 2 usage error. NAME is any case-insensitive part
of a talk directory's name ("opendata", "karjer"); without it, the talk is
the one the current directory is in, or the only one the worktree changes.
Talks resolve from the git worktree the command runs in, else the main checkout.
A talk's own worktree (what open, session, deploy and pin use) is named after the talk,
is on its talk/<slug> branch, or changes that talk and no other. The talks' CLAUDE.md
files count only where nothing else in talks/ changed: a branch that edits every talk's
notes is none of theirs.
What builds, checks and tools print goes to $OUTREACH_STATE/logs/<slug>-<verb>-<sha>.log;
the terminal gets a summary and the log's path.

Settings come from the environment, then ~/.config/outreach_talks/env (KEY=VALUE
lines; scripts/bootstrap.sh writes it), then defaults: `talk config` shows them.
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
import tempfile
import time
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from pathlib import Path
from typing import Mapping

SCRIPTS = Path(__file__).resolve().parent
sys.path.insert(0, str(SCRIPTS))
sys.dont_write_bytecode = True      # no __pycache__ left in the checkouts it runs from
import new_talk  # noqa: E402  (NAME_RE, REPO, PAGES, worktree_slug: one source for names and URLs)

REPO_NAME = new_talk.REPO.split("/")[1]
STAGE_BINS = {"shots": "slidev-stage-shots", "record": "slidev-stage-record", "safe": "slidev-stage-safe"}
DELEGATES = {"lint": "talk_lint.py", "facts": "facts.py", "map": "talk_map.py"}
PASSTHROUGH = {"dev", "build", "shots", "record", "safe", "render"}   # extra args go to the tool
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


# ---------------------------------------------------------------- settings
# One resolver for everything that differs between machines: the environment
# first, then ~/.config/outreach_talks/env ($OUTREACH_CONFIG elsewhere; KEY=VALUE
# lines that scripts/bootstrap.sh writes), then the defaults below. Every
# KEY=VALUE in that file also reaches the tools talk runs (SLIDEV_STAGE_GL,
# PLAYWRIGHT_BROWSERS_PATH, ...) unless the environment has it already.

# The stage tools' own lock. Where it exists, sessions on this machine already
# queue on it (the toolkit's shots and hand-run `flock` calls), so the render
# lock defaults to it and every headless run here keeps one queue.
TOOLKIT_LOCK = Path("/tmp/slidev-stage-shots.lock")
CONFIG_KEYS = ("OUTREACH_ROOT", "SLIDEV_VIDEOS_DIR", "OUTREACH_STATE", "OUTREACH_ENV_BIN", "RENDER_BACKEND",
               "RENDER_LOCK", "RENDER_GPUS", "RENDER_SRUN_ARGS", "TALK_TMP")
# the stage launcher's knobs: talk passes them to shots, record, safe and render as they are
GL_KEYS = ("SLIDEV_STAGE_GL", "SLIDEV_STAGE_MESA_D3D12", "SLIDEV_STAGE_CHROMIUM_ARGS", "SLIDEV_STAGE_CHROMIUM_ENV")
BACKENDS = ("slurm", "condor", "local")


@dataclass
class Config:
    values: dict
    sources: dict
    path: Path
    file: dict = field(default_factory=dict)

    def __getitem__(self, key: str) -> str | None:
        return self.values.get(key)

    def path_of(self, key: str) -> Path | None:
        v = self.values.get(key)
        return Path(v) if v else None


def config_file(environ: Mapping[str, str]) -> Path:
    return Path(environ.get("OUTREACH_CONFIG") or Path(environ.get("HOME") or Path.home()) / ".config/outreach_talks/env")


def read_env_file(path: Path, environ: Mapping[str, str] | None = None) -> dict:
    """KEY=VALUE lines, `export` allowed; '...' is literal, "..." and bare values expand ~ and $VAR."""
    environ = os.environ if environ is None else environ
    home = environ.get("HOME") or str(Path.home())

    def expand(v: str) -> str:
        v = re.sub(r"\$\{(\w+)\}|\$(\w+)", lambda m: environ.get(m.group(1) or m.group(2), m.group(0)), v)
        return home + v[1:] if v == "~" or v.startswith("~/") else v
    out = {}
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return out
    for line in text.splitlines():
        m = re.match(r"\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$", line)
        if not m:
            continue
        v = m.group(2).strip()
        if len(v) >= 2 and v[0] == v[-1] == "'":
            out[m.group(1)] = v[1:-1]
            continue
        if len(v) >= 2 and v[0] == v[-1] == '"':
            v = v[1:-1]
        else:
            v = re.sub(r"\s+#.*$", "", v)
        out[m.group(1)] = expand(v)
    return out


def detect_backend(environ: Mapping[str, str]) -> str:
    path = environ.get("PATH", "")
    if shutil.which("sbatch", path=path):
        return "slurm"
    if shutil.which("condor_submit", path=path):
        return "condor"
    return "local"


def default_env_bin(environ: Mapping[str, str], home: Path) -> tuple[str | None, str]:
    conda = environ.get("CONDA_PREFIX")
    if conda and (Path(conda) / "bin" / "pnpm").exists():
        return str(Path(conda) / "bin"), "the active conda env ($CONDA_PREFIX)"
    guess = home / "micromamba" / "envs" / "outreach_talks" / "bin"
    if guess.is_dir():
        return str(guess), "bootstrap's default prefix"
    return None, "none found: tools come from PATH"


def resolve_config(environ: Mapping[str, str], main: Path) -> Config:
    """`main` is the outreach_talks main checkout; OUTREACH_ROOT defaults to the directory holding it."""
    path = config_file(environ)
    file = read_env_file(path, environ)
    values, sources = {}, {}
    home = Path(environ.get("HOME") or Path.home())

    def pick(key: str, default, why: str = "default") -> str | None:
        if environ.get(key):
            values[key], sources[key] = environ[key], "environment"
        elif file.get(key):
            values[key], sources[key] = file[key], str(path)
        else:
            d = default() if callable(default) else default
            if isinstance(d, tuple):
                d, why = d
            values[key], sources[key] = (str(d) if d is not None else None), why
        return values[key]

    root = Path(pick("OUTREACH_ROOT", main.parent, "default: the directory holding outreach_talks"))
    pick("SLIDEV_VIDEOS_DIR", root / "slidev-videos", "default: beside outreach_talks")
    state = Path(pick("OUTREACH_STATE", home / ".local" / "state" / "outreach_talks"))
    pick("OUTREACH_ENV_BIN", lambda: default_env_bin(environ, home))
    backend = pick("RENDER_BACKEND", lambda: (detect_backend(environ), "detected (sbatch, condor_submit on PATH)"))
    pick("RENDER_LOCK", lambda: (TOOLKIT_LOCK, "default: the stage tools' lock, which exists here")
         if TOOLKIT_LOCK.exists() else state / "render.lock")
    pick("RENDER_GPUS", "auto")
    pick("RENDER_SRUN_ARGS", "")
    # a build has to be where the render runs: /tmp on one machine, the shared filesystem on a cluster
    pick("TALK_TMP", lambda: tempfile.gettempdir() if backend == "local"
         else (root / ".cache" / "talk-builds", "default on a cluster: shared with the compute nodes"))
    return Config(values, sources, path, file)


@functools.lru_cache(maxsize=None)
def cfg() -> Config:
    r = subprocess.run(["git", "rev-parse", "--path-format=absolute", "--git-common-dir"], cwd=SCRIPTS,
                       capture_output=True, text=True)
    main = Path(r.stdout.strip()).resolve().parent if r.returncode == 0 and r.stdout.strip() else SCRIPTS.parent
    return resolve_config(os.environ, main)


def env_bin() -> Path | None:
    p = cfg().path_of("OUTREACH_ENV_BIN")
    return p if p and p.is_dir() else None


# ---------------------------------------------------------------- processes

def tool_env(extra: dict | None = None) -> dict:
    """What every tool talk runs gets: the env file's settings under the environment's,
    the resolved settings, and the env's bin first on PATH (node, pnpm, the NVENC ffmpeg;
    a bare shell may find a Windows pnpm shim and a static ffmpeg that crashes on HTTPS)."""
    c = cfg()
    env = dict(c.file)
    env.update(os.environ)
    for k in CONFIG_KEYS:
        if c[k] is not None:
            env.setdefault(k, c[k])
    b = env_bin()
    if b:
        rest = [p for p in env.get("PATH", "").split(os.pathsep) if p and Path(p) != b]
        env["PATH"] = os.pathsep.join([str(b), *rest])
    env.update(extra or {})
    return env


def which(name: str, env: dict | None = None) -> str | None:
    return shutil.which(name, path=(env or tool_env())["PATH"])


ANSI_RE = re.compile(r"\x1b\[[0-9;?]*[A-Za-z]")
ERR_RE = re.compile(r"(?i:\b(errors?|failed|failure|fatal|exception|traceback|cannot|not found)\b)|\w+Error\b|ERR_|ERR!|✖|✗")
NO_ERR_RE = re.compile(r"\b(0|no) (errors?|problems?|failed|failures?)\b|^\s*[\w ]*errors?:\s*$", re.I)  # "page errors:" heads a list
WARN_RE = re.compile(r"\bwarn(ing)?s?\b|\(!\)|⚠", re.I)


class Log:
    """One file per verb run, $OUTREACH_STATE/logs/<slug>-<verb>-<sha>.log: what the tools print
    goes there, the terminal gets a summary. Made on the first command that writes to it."""

    def __init__(self):
        self.ctx: tuple | None = None
        self.path: Path | None = None
        self.f = None

    def begin(self, root: Path, slug: str, verb: str) -> None:
        if self.ctx is None:             # deploy's ready writes into deploy's log
            self.ctx = (root, slug, verb)

    def open(self):
        if self.f or not self.ctx:
            return self.f
        root, slug, verb = self.ctx
        sha = git_out(["rev-parse", "--short=12", "HEAD"], root) or "nosha"
        d = Path(cfg()["OUTREACH_STATE"]) / "logs"
        d.mkdir(parents=True, exist_ok=True)
        self.path = d / f"{slug}-{verb}-{sha}.log"
        open(self.path, "w").close()
        self.f = open(self.path, "a", encoding="utf-8", buffering=1)      # O_APPEND: children and we never overwrite
        self.f.write(f"# talk {verb} {slug} at {sha} in {root}, {dt.datetime.now().isoformat(timespec='seconds')}\n")
        OUT.say(f"log: {self.path}")
        return self.f

    def write(self, text: str) -> None:
        if self.open():
            self.f.write(text if text.endswith("\n") else text + "\n")


LOG = Log()


def clip(line: str, n: int = 200) -> str:
    return line if len(line) <= n else line[:n - 1] + "…"


def summarize(text: str, ok: bool, first: int = 5, tail: int = 15, keep: str | None = None) -> dict:
    """Counts and the first problem lines of a tool's output; its last lines when it failed.
    `keep` matches lines that always belong in the summary (a renderer string)."""
    lines = [ANSI_RE.sub("", l).rstrip() for l in text.splitlines()]
    lines = [l for l in lines if l.strip()]
    errs = [l for l in lines if ERR_RE.search(l) and not NO_ERR_RE.search(l)]
    warns = [l for l in lines if l not in errs and WARN_RE.search(l)]
    kept = [l for l in lines if keep and re.search(keep, l)][:3]
    s = {"lines": len(lines), "error_lines": len(errs), "warning_lines": len(warns),
         "first": [clip(l) for l in dict.fromkeys(kept + errs + warns)][:first + len(kept)]}
    if not ok:
        s["tail"] = [clip(l) for l in lines[-tail:]]
    return s


def say_summary(s: dict | None, indent: str = "    ") -> None:
    if not s:
        return
    for l in s.get("first", []):
        OUT.say(indent + l)
    if s.get("tail"):
        OUT.say(f"{indent}-- last {len(s['tail'])} lines:")
        for l in s["tail"]:
            if l not in s.get("first", []):
                OUT.say(indent + l)


def run(cmd: list, cwd: Path | None = None, env: dict | None = None, capture: bool = False,
        timeout: float | None = None, quiet: bool = False, stdin=None, log: bool = False) -> subprocess.CompletedProcess:
    """log=True: the child's stdout and stderr go to the verb's log, and come back as .stdout."""
    cmd = [str(c) for c in cmd]
    if not quiet:
        OUT.say("$ " + shlex.join(cmd) + (f"   # in {cwd}" if cwd else ""))
    f = LOG.open() if log and not capture else None
    try:
        if capture:
            return subprocess.run(cmd, cwd=cwd, env=env, capture_output=True, text=True, timeout=timeout, stdin=stdin)
        if f:
            f.write(f"\n$ {shlex.join(cmd)}" + (f"   # in {cwd}" if cwd else "") + "\n")
            start = LOG.path.stat().st_size
            try:
                r = subprocess.run(cmd, cwd=cwd, env=env, stdout=f, stderr=subprocess.STDOUT, timeout=timeout,
                                   stdin=stdin if stdin is not None else subprocess.DEVNULL)
            finally:
                with open(LOG.path, encoding="utf-8", errors="replace") as fh:
                    fh.seek(start)
                    out = fh.read()
            f.write(f"# exit {r.returncode}\n")
            return subprocess.CompletedProcess(cmd, r.returncode, out, "")
        return subprocess.run(cmd, cwd=cwd, env=env, stdout=OUT.child_stdout(), timeout=timeout, stdin=stdin)
    except FileNotFoundError:
        if f:
            f.write(f"# {cmd[0]}: not found\n")
        return subprocess.CompletedProcess(cmd, 127, f"{cmd[0]}: not found", f"{cmd[0]}: not found")
    except subprocess.TimeoutExpired:
        if f:
            f.write(f"# timed out after {timeout:.0f} s\n")
        return subprocess.CompletedProcess(cmd, 124, f"timed out after {timeout:.0f} s", f"timed out after {timeout:.0f} s")


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


NOTES_RE = re.compile(r"^talks/[^/]+/CLAUDE\.md$")


@functools.lru_cache(maxsize=None)
def talks_touched(wt: Path, base: str = "origin/main", notes: bool = False) -> list[str]:
    """Talk directories a worktree changes: its commits since the merge base, plus its working tree.
    A talk's notes file (talks/<t>/CLAUDE.md) counts only with notes=True: a branch that edits
    every talk's notes (docs, tooling) does not change the talks."""
    paths = (git_out(["diff", "--name-only", f"{base}...HEAD", "--", "talks/"], wt) or "").splitlines()
    paths += porcelain_paths(git_out(["status", "--porcelain", "--", "talks/"], wt) or "")
    names = {p.split("/")[1] for p in paths
             if p.startswith("talks/") and p.count("/") >= 1 and (notes or not NOTES_RE.match(p))}
    return sorted(n for n in names if new_talk.NAME_RE.match(n))


def own_talks(wt: Path) -> list[str]:
    """The talks a worktree changes, for telling whose it is: talks_touched, or, where it has
    changed nothing but notes so far, the talks whose notes it changed."""
    return talks_touched(wt) or talks_touched(wt, notes=True)


def owns(path: Path, branch: str | None, talk: str) -> bool:
    """The worktree is the talk's own: named after it, on its talk/<slug> branch, or changing
    that talk and no other (own_talks). A branch that changes several talks (tooling, a toolkit
    move, every talk's notes) is none of theirs, so open, session, deploy and pin never pick it."""
    slug = wt_slug(talk)
    return path.name == slug or branch == f"talk/{slug}" or own_talks(path) == [talk]


def owners(repo: Repo, talk: str) -> list[Worktree]:
    """Linked worktrees that are the talk's own (owns)."""
    slug = wt_slug(talk)
    res = [w for w in worktrees(repo)
           if not (w.main or w.prunable or not w.path.is_dir()) and owns(w.path, w.branch, talk)]
    res.sort(key=lambda w: (w.path.name != slug, w.branch != f"talk/{slug}"))   # the one named after the talk first
    return res


def default_talk(repo: Repo, cwd: Path) -> str | None:
    try:
        rel = cwd.resolve().relative_to((repo.here / "talks").resolve())
        if rel.parts:
            return rel.parts[0]
    except ValueError:
        pass
    if repo.in_worktree:
        touched = own_talks(repo.here)
        if len(touched) == 1:
            return touched[0]
        named = [t for t in talks_in(repo.here) if wt_slug(t) == repo.here.name]
        if len(named) == 1 and not touched:         # the talk's own worktree, nothing changed yet
            return named[0]
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
    return Path(cfg()["TALK_TMP"]) / f"talk-{wt_slug(talk)}"


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
    LOG.begin(repo.here, wt_slug(talk), "build")
    t0 = time.monotonic()
    r = run([pnpm, "build", "--base", base, "--out", out, *(extra or [])], cwd=d, env=env, log=True)
    data["seconds"] = round(time.monotonic() - t0, 1)
    ok = r.returncode == 0 and (out / "index.html").exists()
    data["summary"] = summarize(r.stdout, ok)
    if LOG.path:
        data["log"] = str(LOG.path)
    meta_path = build_dir(talk) / "build.json"
    if ok:
        meta = {"talk": talk, "root": str(repo.here), "head": git_out(["rev-parse", "HEAD"], repo.here),
                "fingerprint": fingerprint(repo.here, talk), "base": base,
                "built_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")}
        meta_path.write_text(json.dumps(meta, indent=2) + "\n")
        return 0, data
    meta_path.unlink(missing_ok=True)
    data["error"] = f"build failed (exit {r.returncode})"
    say_summary(data["summary"])
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


# ---------------------------------------------------------------- the render slot

def proc_locks_held_by_ancestor(lock: Path) -> bool:
    """An ancestor of this process holds a flock on `lock` (a run started inside `flock <lock> ...`)."""
    try:
        ino = lock.stat().st_ino
        text = Path("/proc/locks").read_text()
    except OSError:
        return False
    holders = set()
    for line in text.splitlines():
        parts = line.split()
        if len(parts) > 5 and parts[1] == "FLOCK" and "->" not in parts:
            if parts[5].rsplit(":", 1)[-1] == str(ino):
                holders.add(int(parts[4]))
    pid = os.getppid()
    for _ in range(64):
        if pid in holders:
            return True
        try:
            stat = Path(f"/proc/{pid}/stat").read_text()
            pid = int(stat.rsplit(")", 1)[1].split()[1])
        except (OSError, ValueError, IndexError):
            return False
        if pid <= 1:
            return False
    return False


class RenderLock:
    """The machine's render lock ($RENDER_LOCK; flock(1) and flock(2) agree). A run already in
    the slot (talk render, a stage tool told so, a hand-run `flock <lock> ...`) does not take it again."""

    def __init__(self, path: Path | None = None):
        self.path = Path(path or cfg()["RENDER_LOCK"])
        self.f = None

    def held(self) -> bool:
        return (os.environ.get("TALK_RENDER_SLOT") is not None
                or os.environ.get("SLIDEV_STAGE_SHOTS_LOCKED") == str(self.path)
                or proc_locks_held_by_ancestor(self.path))

    def __enter__(self):
        if self.held():
            return self
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.f = open(self.path, "a")
        try:
            fcntl.flock(self.f, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            OUT.say(f"waiting for {self.path} (another render) ...")
            fcntl.flock(self.f, fcntl.LOCK_EX)
        return self

    def __exit__(self, *exc):
        if self.f:
            fcntl.flock(self.f, fcntl.LOCK_UN)
            self.f.close()


def truthy(v: str | None) -> bool | None:
    v = (v or "").strip().lower()
    return True if v in ("1", "yes", "true", "on") else False if v in ("0", "no", "false", "off") else None


def cluster_gpus(backend: str, env: dict) -> bool:
    """Does the cluster have GPU nodes: a gpu gres in sinfo, TotalGpus in condor_status."""
    if backend == "slurm":
        r = run(["sinfo", "-h", "-o", "%G"], env=env, capture=True, timeout=20, quiet=True)
        return r.returncode == 0 and "gpu" in r.stdout
    if backend == "condor":
        r = run(["condor_status", "-af", "TotalGpus"], env=env, capture=True, timeout=30, quiet=True)
        return r.returncode == 0 and any(x.isdigit() and int(x) > 0 for x in r.stdout.split())
    return False


def render_plan(cmd: list, env: dict, gpu: bool | None = None) -> dict:
    """How the render backend runs `cmd`: {backend, argv, env (added variables), lock, gpu, note}.
    Slurm: srun, with --gres=gpu:1 where the cluster has GPUs, plus $RENDER_SRUN_ARGS.
    HTCondor: condor_run (it writes the submit file, waits for the job and prints its output;
    the job runs in the current directory, so the repos must be on a filesystem the execute
    nodes see), with request_gpus = 1 where the pool has GPUs. Else: the command itself under
    $RENDER_LOCK. Inside the slot already (a job, or talk render calling talk), the command itself."""
    cmd = [str(c) for c in cmd]
    backend = cfg()["RENDER_BACKEND"] or "local"
    if backend not in BACKENDS:
        raise UsageError(f"RENDER_BACKEND={backend}: {', '.join(BACKENDS)} ({cfg().sources['RENDER_BACKEND']})")
    inside = (os.environ.get("TALK_RENDER_SLOT") and "talk render") or (
        backend == "slurm" and os.environ.get("SLURM_JOB_ID") and "a Slurm job") or (
        backend == "condor" and os.environ.get("_CONDOR_JOB_AD") and "an HTCondor job")
    if inside:
        return {"backend": backend, "argv": cmd, "env": {}, "lock": None, "gpu": None, "note": f"already in {inside}"}
    if backend == "local":
        lock = str(cfg()["RENDER_LOCK"])
        return {"backend": "local", "argv": cmd, "lock": lock, "gpu": None,
                "env": {"TALK_RENDER_SLOT": "local", "SLIDEV_STAGE_SHOTS_LOCKED": lock}}
    if gpu is None:
        gpu = truthy(cfg()["RENDER_GPUS"])
    if gpu is None:
        gpu = cluster_gpus(backend, env)
    if backend == "slurm":
        argv = ["srun", *(["--gres=gpu:1"] if gpu else []), *shlex.split(cfg()["RENDER_SRUN_ARGS"] or ""), *cmd]
    else:
        argv = ["condor_run", *(["-a", "request_gpus = 1"] if gpu else []), "-a", "getenv = True", shlex.join(cmd)]
    return {"backend": backend, "argv": argv, "env": {"TALK_RENDER_SLOT": backend}, "lock": None, "gpu": gpu}


def render_run(cmd: list, cwd: Path, env: dict, gpu: bool | None = None) -> tuple[subprocess.CompletedProcess, dict]:
    plan = render_plan(cmd, env, gpu)
    env = {**env, **plan["env"]}
    if plan.get("note"):
        OUT.say(f"render: {plan['note']}")
    if plan["lock"]:
        with RenderLock(Path(plan["lock"])):
            return run(plan["argv"], cwd=cwd, env=env, log=True), plan
    return run(plan["argv"], cwd=cwd, env=env, log=True), plan


def gl_settings(env: dict) -> dict:
    return {k: env[k] for k in GL_KEYS if env.get(k)}


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
    env = tool_env()
    node = which("node", env)
    if not node:
        data["error"] = "node not found"
        return 1, data
    # shots, record and safe queue for the render slot themselves; the GL settings
    # (SLIDEV_STAGE_GL, ..._CHROMIUM_ARGS, ..._CHROMIUM_ENV) reach them through env
    data["gl"] = gl_settings(env)
    LOG.begin(repo.here, wt_slug(talk), kind)
    r, plan = render_run([node, b, build_dir(talk) / "site", *args], d, env)
    data["render"] = {k: plan[k] for k in ("backend", "lock", "gpu") if plan.get(k) is not None}
    data["tool_exit"] = r.returncode
    data["summary"] = summarize(r.stdout, r.returncode == 0, keep=r"\b(renderer|backend)\b|WARNING")
    if LOG.path:
        data["log"] = str(LOG.path)
    say_summary(data["summary"])
    # shots exits 2 on bad arguments (safe's 2 is "could not check"); any other failure is 1
    return (0 if r.returncode == 0 else 2 if (r.returncode, kind) == (2, "shots") else 1), data


def supports(binfile: Path, flag: str) -> bool:
    try:
        return f"'{flag}'" in binfile.read_text() or f'"{flag}"' in binfile.read_text()
    except OSError:
        return False


def do_shots(repo: Repo, talk: str, *, slides=None, changed=False, sheet=False, out=None,
             no_build=False, rebuild=False, extra: list | None = None, quiet_flags: bool = False) -> tuple[int, dict]:
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
            elif not quiet_flags:
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
    r = run(cmd, cwd=cwd, env=env or tool_env(), log=True)
    res = {"name": name, "ok": r.returncode == 0, "exit": r.returncode, "seconds": round(time.monotonic() - t0, 1),
           "cmd": shlex.join(str(c) for c in cmd), "summary": summarize(r.stdout, r.returncode == 0)}
    if LOG.path:
        res["log"] = str(LOG.path)
    if r.returncode == 127:
        res["error"] = f"{cmd[0]} not found"
    if r.returncode:
        say_summary(res["summary"])
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
    """lint / facts / map live in their own scripts; the JSON object is theirs.
    capture_json: run it with --json, its whole output into the log, its object back."""
    script = delegate_script(repo, verb)
    if not script:
        raise UsageError(f"`{verb}` is not installed on this branch (scripts/{DELEGATES[verb]} comes with feat/facts-lint)")
    args = list(args)
    cut = args.index("--") if "--" in args else len(args)
    if (OUT.json or capture_json) and "--json" not in args[:cut]:
        args.insert(cut, "--json")      # before a `--`, where it is still an option
    cmd = [sys.executable, script, *args]
    if capture_json:
        r = run(cmd, cwd=repo.here, env=tool_env(), capture=True)
        LOG.write(f"\n$ {shlex.join(str(c) for c in cmd)}\n{r.stdout}{r.stderr}# exit {r.returncode}")
        try:
            return r.returncode, json.loads(r.stdout) if r.stdout.strip() else None
        except ValueError:
            return r.returncode, None
    r = subprocess.run([str(c) for c in cmd], cwd=repo.here, env=tool_env())   # its stdout is ours
    return r.returncode, None


def lint_digest(obj: dict | None, first: int = 5) -> dict:
    """The counts of a talk_lint report and its first findings, errors first."""
    if not isinstance(obj, dict):
        return {"error": "lint printed no JSON report (see the log)"}
    fs = sorted(obj.get("findings") or [], key=lambda f: f.get("severity") != "error")
    lines = []
    for f in fs[:first]:
        where = f"{f.get('file')}:{f.get('line')}" if f.get("line") else str(f.get("file"))
        sl = f" slide {f['slide']}" if f.get("slide") else ""
        lines.append(clip(f"{where}{sl} {'E' if f.get('severity') == 'error' else 'W'} {f.get('code')} {f.get('message')}"))
    return {"errors": obj.get("errors"), "warnings": obj.get("warnings"), "counts": obj.get("counts"),
            "findings_total": len(fs), "first": lines}


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
        LOG.begin(wt, slug, "new")
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
    LOG.begin(wt, wt.name, "install")
    # Never prompt (agents have no TTY, and a prompt there exits 0 having done nothing).
    r = run([pnpm, "install", "--config.confirm-modules-purge=false"], cwd=wt, env=env, stdin=subprocess.DEVNULL, log=True)
    if r.returncode:
        say_summary(summarize(r.stdout, False))
    return r.returncode


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


def open_worktree(repo: Repo, name: str, no_install: bool = False, dry_run: bool = False) -> tuple[int, dict]:
    """The talk's worktree, made from origin/main (or its talk/<slug> branch) when it has none."""
    where = known_talks(repo)
    talk = match_talk(name, sorted(where))
    found = owners(repo, talk)
    data = {"talk": talk}
    if found:
        w = found[0]
        data.update(worktree=str(w.path), branch=w.branch, created=False, others=[str(o.path) for o in found[1:]])
        for o in found[1:]:
            OUT.say(f"also changed in {o.path} ({o.branch})")
        return 0, data
    slug = wt_slug(talk)
    wt = repo.main / ".claude" / "worktrees" / slug
    branch = f"talk/{slug}"
    if git(["cat-file", "-e", f"origin/main:talks/{talk}"], repo.main).returncode != 0:
        data["error"] = f"talks/{talk} is in no worktree of its own and not on origin/main ({', '.join(where[talk])})"
        OUT.say(f"error: {data['error']}")
        return 1, data
    has_branch = git(["rev-parse", "--verify", "--quiet", f"refs/heads/{branch}"], repo.main).returncode == 0
    add = ["git", "worktree", "add", wt, branch] if has_branch else \
        ["git", "worktree", "add", wt, "-b", branch, "origin/main", "--no-track"]
    if dry_run:
        OUT.say("dry run: would run " + shlex.join(str(x) for x in add))
        data.update(worktree=str(wt), branch=branch, created=False, would_create=True)
        return 0, data
    r = run(add, cwd=repo.main, capture=True)
    if r.returncode:
        data["error"] = f"git worktree add failed: {r.stderr.strip()}"
        OUT.say(f"error: {data['error']}")
        return 1, data
    data.update(worktree=str(wt), branch=branch, created=True, installed=False)
    if not no_install:
        LOG.begin(wt, slug, "open")
        data["installed"] = install(wt) == 0
        if LOG.path:
            data["log"] = str(LOG.path)
    return (0 if no_install or data["installed"] else 1), data


def cmd_open(repo: Repo, a, extra) -> tuple[int, dict]:
    code, data = open_worktree(repo, a.name, a.no_install)
    if data.get("worktree"):
        OUT.show(data["worktree"])
    return code, data


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
        talks = talks_touched(w.path)
        row.update(dirty=len(dirty), dirty_files=dirty[:12], talks=talks,
                   notes=[t for t in talks_touched(w.path, notes=True) if t not in talks])   # their CLAUDE.md only
        if w.main and w.branch != "main":
            problems.append(f"the main checkout is on {w.branch or 'a detached HEAD'}; it stays on main "
                            f"(work in a worktree: pnpm talk open <name>)")
        rows.append(row)
    deploys, readies = [], []
    sd = repo.common / "talk-status"
    if sd.is_dir():
        deploys = [read_json(p) for p in sorted(sd.glob("*.json")) if not p.name.endswith(".ready.json")]
        readies = [read_json(p) for p in sorted(sd.glob("*.ready.json"))]
    pages = last_pages_run(repo)
    for r in rows:
        name = "main checkout" if r["main_checkout"] else Path(r["path"]).name
        if r.get("missing"):
            OUT.show(f"{name:<22} missing (git worktree prune)")
            continue
        ab = f"ahead {r.get('ahead', '?')}, behind {r.get('behind', '?')}"
        notes = f"notes of {len(r['notes'])} talk{'s' * (len(r['notes']) != 1)}" if r["notes"] else ""
        OUT.show(f"{name:<22} {r['branch'] or '(detached)':<28} {ab:<22} dirty {r['dirty']:<4} "
                 + " ".join(r["talks"] + ([notes] if notes else [])))
    for d in readies:
        OUT.show(f"ready   {d.get('talk')}: {'passed' if d.get('ok') else 'FAILED'} {(d.get('sha') or '')[:12]} "
                 f"{d.get('finished_at', '')}" + (f" (skipped {', '.join(d['skip'])})" if d.get("skip") else ""))
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
    return (1 if problems else 0), {"worktrees": rows, "deploys": deploys, "ready": readies, "pages": pages,
                                    "problems": problems}


def cmd_dev(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, d = resolve_talk(repo, a.name, invocation_dir())
    if not installed(repo.here, d):
        raise UsageError(f"not installed: run `pnpm install` in {repo.here}")
    env = tool_env()
    r = run([which("pnpm", env) or "pnpm", "dev", *extra], cwd=d, env=env)
    return (0 if r.returncode in (0, 130) else 1), {"talk": talk, "tool_exit": r.returncode}


def cmd_build(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, _ = resolve_talk(repo, a.name, invocation_dir())
    LOG.begin(repo.here, wt_slug(talk), "build")
    code, data = do_build(repo, talk, pages=a.pages, extra=extra)
    report_steps([{"name": "build", "ok": code == 0, **data}])
    return code, data


def cmd_check(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, _ = resolve_talk(repo, a.name, invocation_dir())
    LOG.begin(repo.here, wt_slug(talk), "check")
    code, data = do_check(repo, talk, pages=a.pages)
    report_steps(data["steps"])
    return code, data


def report_steps(steps: list) -> None:
    """One line per step; what the tools printed is in the log, whose path is printed once."""
    for s in steps:
        state = "FAILED" if not s["ok"] else ("skipped" if s.get("skipped") else "ok")
        sm, notes = s.get("summary") or {}, []
        if s.get("errors") is not None:                       # lint
            notes.append(f"{s['errors']} errors, {s['warnings']} warnings")
        elif sm.get("error_lines") or sm.get("warning_lines"):
            notes.append(f"{sm.get('error_lines', 0)} error / {sm.get('warning_lines', 0)} warning lines")
        OUT.show(f"{s['name']:<14} {state}" + (f"  ({s['seconds']} s)" if s.get("seconds") is not None else "")
                 + (f"  {s['error']}" if s.get("error") else "") + (f"  {s['skipped']}" if s.get("skipped") else "")
                 + "".join(f"  {n}" for n in notes))
    if LOG.path:
        OUT.show(f"{'log':<14} {LOG.path}")


def cmd_shots(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, _ = resolve_talk(repo, a.name, invocation_dir())
    LOG.begin(repo.here, wt_slug(talk), "shots")
    return do_shots(repo, talk, slides=a.slides, changed=a.changed, sheet=a.sheet, out=a.out,
                    no_build=a.no_build, rebuild=a.rebuild, extra=extra)


def cmd_review(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, _ = resolve_talk(repo, a.name, invocation_dir())
    LOG.begin(repo.here, wt_slug(talk), "review")
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
    talk, d = resolve_talk(repo, a.name, invocation_dir())
    args = [str(d)] + (["--release"] if getattr(a, "release", False) else [])
    if a.verb != "lint":
        code, _ = run_delegate(repo, a.verb, args)
        return code, None
    # lint: its report into the log; the terminal gets the counts and the first findings
    LOG.begin(repo.here, wt_slug(talk), "lint")
    code, obj = run_delegate(repo, "lint", args, capture_json=True)
    if not isinstance(obj, dict):
        OUT.say(f"error: lint printed no JSON report; see {LOG.path}")
        return (code or 1), {"talk": talk, "error": "lint printed no JSON report", "log": str(LOG.path)}
    obj["log"] = str(LOG.path)
    if OUT.json:                     # the delegate's own object, with the log's path added
        print(json.dumps(obj, ensure_ascii=False))
        return (code if code in (0, 1, 2) else 1), None
    dg = lint_digest(obj, first=15)
    for line in dg["first"]:
        OUT.show(line)
    more = dg["findings_total"] - len(dg["first"])
    OUT.show(f"{talk}: {dg['errors']} error(s), {dg['warnings']} warning(s)"
             + (" — " + ", ".join(f"{k} {v}" for k, v in sorted((dg["counts"] or {}).items())) if dg["counts"] else ""))
    OUT.show(f"{'... ' + str(more) + ' more; ' if more > 0 else ''}full report: {LOG.path}")
    return code, None


def ready_stamp(repo: Repo, talk: str) -> Path:
    return repo.common / "talk-status" / f"{wt_slug(talk)}.ready.json"


def cmd_ready(repo: Repo, a, extra) -> tuple[int, dict]:
    talk, d = resolve_talk(repo, a.name, invocation_dir())
    skip = set(a.skip or [])
    unknown = skip - {"lint", "check", "shots", "preflight", "venue", "safe"}
    if unknown:
        raise UsageError(f"--skip takes lint, check, shots, preflight, venue, safe (not {', '.join(sorted(unknown))})")
    LOG.begin(repo.here, wt_slug(talk), "ready")
    head0 = git_out(["rev-parse", "HEAD"], repo.here)
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
        dg = lint_digest(obj)
        steps.append({"name": "lint", "ok": code == 0, "exit": code, **dg, "log": str(LOG.path)})
        if code:
            say_summary({"first": dg.get("first", [])})
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
        # the slides that changed since the last shots, where the tool can tell (review shot the rest)
        OUT.say("-- shots (changed slides)")
        try:
            code, shots = do_shots(repo, talk, no_build=built, changed=True, quiet_flags=True)
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
    data = {"talk": talk, "ready": ok, "steps": steps}
    # The stamp: the commit these checks passed, so deploy does not run them again.
    # Only a clean tree whose HEAD did not move is stamped: then the files checked are that commit.
    head = git_out(["rev-parse", "HEAD"], repo.here)
    dirty = porcelain_paths(git_out(["status", "--porcelain"], repo.here) or "")
    if head and head == head0 and not dirty:
        path = ready_stamp(repo, talk)
        path.parent.mkdir(exist_ok=True)
        path.write_text(json.dumps({
            "talk": talk, "slug": wt_slug(talk), "sha": head, "worktree": str(repo.here.resolve()), "ok": ok,
            "skip": sorted(skip), "safe": bool(a.safe), "log": str(LOG.path) if LOG.path else None,
            "finished_at": dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds")}, indent=2) + "\n")
        data["stamp"] = str(path)
    else:
        data["not_stamped"] = "HEAD moved while ready ran" if head != head0 else "uncommitted changes"
    return (0 if ok else 1), data


def cmd_stage(repo: Repo, a, extra) -> tuple[int, dict]:
    """record / safe: the stage package's bins against the talk's build."""
    talk, d = resolve_talk(repo, a.name, invocation_dir())
    args = list(extra)
    if a.verb == "record":
        args = [Path(a.out) if a.out else d / "shots" / "record", *args]
    elif talk_info(repo.here, talk)["broadcast"] and "--broadcast" not in args:
        args.append("--broadcast")      # the rules for a picture that goes to air
    LOG.begin(repo.here, wt_slug(talk), a.verb)
    code, data = run_stage_bin(repo, a.verb, talk, args, no_build=a.no_build, rebuild=a.rebuild)
    return code, data


def not_own(repo: Repo, talk: str) -> str | None:
    """Why this worktree is not the talk's own (owns), or None when it is."""
    branch = git_out(["branch", "--show-current"], repo.here) or None
    if owns(repo.here, branch, talk):
        return None
    this = f"this worktree ({repo.here.name}, {branch or 'detached'})"
    theirs = [t for t in talks_in(repo.here) if owns(repo.here, branch, t)]
    if theirs:
        return f"{this} is {' and '.join(theirs)}'s, not {talk}'s"
    touched, notes = talks_touched(repo.here), talks_touched(repo.here, notes=True)
    return (f"{this} is not {talk}'s own: it changes " + (", ".join(touched) if touched else "no talk")
            + (f" (only the notes of {len(notes)})" if notes and not touched else ""))


def deploy_worktree(repo: Repo, talk: str) -> Path:
    """The talk's own worktree (owns): this one, or the only one there is."""
    found = owners(repo, talk)
    if repo.in_worktree:
        why = not_own(repo, talk)
        if not why:
            return repo.here
        raise UsageError(f"{why}; deploy from the talk's own worktree", candidates=[str(w.path) for w in found])
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
    LOG.begin(wt, wt_slug(talk), "deploy")

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
    ahead = int(git_out(["rev-list", "--count", f"origin/main..{sha}"], wt) or 0)
    data.update(sha=sha, ahead=ahead)
    if ahead == 0:
        OUT.say(f"origin/main already has {sha[:12]}; nothing to push")
        data["pushed"] = False
        return 0, data
    talks = sorted({p.split("/")[1] for p in (git_out(["diff", "--name-only", f"origin/main..{sha}"], wt) or "").splitlines()
                    if p.startswith("talks/") and "/" in p[6:]})
    data["talks_changed"] = talks
    others = [t for t in talks if t != talk]
    if others:
        OUT.say(f"note: these commits also change {', '.join(others)}")
    if not a.skip_ready:
        # ready runs once per commit: when `pnpm talk ready` already passed this one (the
        # stamp it writes), with no more steps skipped than now, it is not run again
        stamp_path = ready_stamp(repo, talk)
        stamp = read_json(stamp_path)
        if (not a.rerun_ready and stamp.get("ok") is True and stamp.get("sha") == sha
                and Path(stamp.get("worktree") or "/nowhere").resolve() == wt.resolve()
                and set(stamp.get("skip") or []) <= set(a.ready_skip or [])):
            OUT.say(f"-- ready: passed {sha[:12]} at {stamp.get('finished_at')} (skipped: "
                    f"{', '.join(stamp.get('skip') or []) or 'nothing'}); not run again (--rerun-ready to)")
            data["ready"] = {"ready": True, "reused": True, "stamp": str(stamp_path),
                             "finished_at": stamp.get("finished_at"), "skip": stamp.get("skip"), "log": stamp.get("log")}
        else:
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
        # ready takes minutes, often in the background: what goes out is the commit it
        # passed, and only if nothing was committed or edited in the worktree meanwhile
        head = git_out(["rev-parse", "HEAD"], wt)
        if head != sha:
            return fail(f"HEAD moved from {sha[:12]} to {(head or '?')[:12]} while ready ran; "
                        f"deploy again, so ready checks the new commit", head=head)
        dirty = porcelain_paths(git_out(["status", "--porcelain"], wt) or "")
        if dirty:
            return fail(f"{wt} changed while ready ran, so the build ready passed is not {sha[:12]}; "
                        f"commit or set the changes aside and deploy again", dirty=dirty[:20])
        # main may have moved while ready ran or the lock was held
        git(["fetch", "--quiet", "origin", "main"], wt, timeout=60)
        if git(["merge-base", "--is-ancestor", "origin/main", sha], wt).returncode != 0:
            OUT.say("origin/main moved meanwhile. Rebase first:\n  " + "\n  ".join(rebase))
            return fail(f"origin/main moved and is no longer an ancestor of {sha[:12]}", rebase=rebase)
        refspec = f"{sha}:refs/heads/main"
        push = ["git", "push", "origin", refspec]
        data["push"] = shlex.join(push)
        if a.dry_run:
            r = run(["git", "push", "--dry-run", "--porcelain", "origin", refspec], cwd=wt, capture=True, timeout=60)
            data["push_check"] = (r.stdout + r.stderr).strip().splitlines()[-3:]
            if r.returncode:
                return fail("git push --dry-run failed")
            OUT.say(f"dry run: would run `{data['push']}` in {wt} ({ahead} commit{'s' * (ahead != 1)}), "
                    f"watch the Pages run and check {data['url']}")
            data.update(pushed=False, would_push=sha)
            return 0, data
        r = run(push, cwd=wt, timeout=120, log=True)
        if r.returncode:
            say_summary(summarize(r.stdout, False))
            return fail(f"git push failed (exit {r.returncode})")
        data["pushed"] = True
    return watch_deploy(repo, wt, talk, sha, data)


def poll_run(wt: Path, run_id: str, talk: str, timeout: float = 1800, every: float = 15) -> dict | None:
    """Wait for a workflow run quietly: each poll goes to the log; the terminal gets a line
    only when the talk's build, the Pages deploy or the run itself changes state."""
    deadline = time.monotonic() + timeout
    shown, view = None, None
    while True:
        v, err = gh_json(["run", "view", run_id, "--json", "status,conclusion,jobs"], wt)
        if v:
            view = v
            jobs = {j["name"]: j.get("conclusion") or j.get("status") for j in v.get("jobs", [])}
            LOG.write(f"# {dt.datetime.now().isoformat(timespec='seconds')} run {v.get('status')} "
                      + json.dumps(jobs, sort_keys=True))
            line = (f"run {v.get('status')}{' ' + v['conclusion'] if v.get('conclusion') else ''}; "
                    f"build {talk}: {jobs.get(f'build {talk}', '-')}; deploy: {jobs.get('deploy', '-')}")
            if line != shown:
                OUT.say("  " + line)
                shown = line
            if v.get("status") == "completed":
                return v
        else:
            LOG.write(f"# gh run view failed: {err}")
        if time.monotonic() > deadline:
            return view
        time.sleep(every)


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
        view = poll_run(wt, str(run_["databaseId"]), talk)
        if not view or view.get("status") != "completed":
            record["error"] = f"the Pages run did not finish within 30 min ({(view or {}).get('status', 'unknown')})"
            return 1, data
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
    c = cfg()
    eb = c.path_of("OUTREACH_ENV_BIN")
    tools["env_bin"] = {"path": str(eb) if eb else None, "present": bool(eb and eb.is_dir()),
                        "source": c.sources.get("OUTREACH_ENV_BIN")}
    if not (eb and eb.is_dir()):
        warnings.append(f"no env bin ({eb or 'OUTREACH_ENV_BIN unset'}): tools come from the bare PATH; "
                        f"scripts/bootstrap.sh makes the env")
    pn = tool("pnpm", ["pnpm", "--version"], required=True)
    node = tool("node", ["node", "--version"], required=True)
    if node.get("version") and int(re.sub(r"\D", "", node["version"].split(".")[0]) or 0) < 20:
        problems.append(f"node {node['version']} is too old (20 or newer)")
    tools["pnpm_bare"] = {"path": bare, "version": version_of([bare, "--version"], os.environ.copy()) if bare else None}
    if bare and bare.startswith("/mnt/"):
        warnings.append(f"a bare shell runs the Windows pnpm shim {bare} ({tools['pnpm_bare']['version']}); "
                        f"`pnpm talk` and `talk` put {eb} first")
    ff = tool("ffmpeg", ["ffmpeg", "-hide_banner", "-version"])
    m = re.match(r"ffmpeg version (\S+)", ff.get("version") or "")
    if m:
        ff["version"] = m.group(1)
    if ff.get("path"):
        if eb and Path(ff["path"]).parent != eb:
            warnings.append(f"ffmpeg is {ff['path']}, not the env's: a static build there may crash on HTTPS input")
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
    sv_dir = c.path_of("SLIDEV_VIDEOS_DIR")
    tools["slidev_videos_dir"] = {"path": str(sv_dir), "present": bool(sv_dir and sv_dir.is_dir())}
    if not (sv_dir and sv_dir.is_dir()):
        warnings.append(f"no slidev-videos checkout at {sv_dir} (SLIDEV_VIDEOS_DIR): clone it beside outreach_talks")
    tools["render"] = {"backend": c["RENDER_BACKEND"], "lock": c["RENDER_LOCK"], **gl_settings(env)}
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
    rd = tools["render"]
    OUT.show(f"{'render':<14} {rd['backend']:<28} lock {rd['lock']}"
             + "".join(f", {k}={v}" for k, v in rd.items() if k.startswith("SLIDEV_")))
    for w in warnings:
        OUT.say(f"warning: {w}")
    for p in problems:
        OUT.say(f"problem: {p}")
    return (1 if problems else 0), {"tools": tools, "warnings": warnings, "problems": problems}


def check_ref(ref: str, allow_sha: bool) -> str:
    """Pins move to release tags; a bare commit only with --allow-sha (both bump-toolkit and pin)."""
    if SHA_RE.match(ref) and not allow_sha:
        raise UsageError(f"{ref} looks like a bare commit; pin a release tag (vX.Y.Z), or pass --allow-sha")
    if not SHA_RE.match(ref) and not TAG_RE.match(ref):
        raise UsageError(f"{ref!r} is not a release tag vX.Y.Z (or a commit, with --allow-sha)")
    return ref


class PinEdit:
    """Pin rewrites in memory: edit() each file, then write() the ones that change."""

    def __init__(self, root: Path, ref: str):
        self.root, self.ref = root, ref
        self.changes: list[dict] = []
        self.files: dict[Path, str] = {}

    def edit(self, path: Path, regex: re.Pattern, what) -> None:
        if not path.is_file():
            return
        text = self.files.get(path) or path.read_text(encoding="utf-8")
        found = False

        def sub(mm: re.Match) -> str:
            nonlocal found
            found = True
            if mm.group(2) != self.ref:
                self.changes.append({"file": str(path.relative_to(self.root)), "what": what(mm) if callable(what) else what,
                                     "before": mm.group(2), "after": self.ref})
            return mm.group(1) + self.ref + (mm.group(3) if mm.re.groups >= 3 else "")
        new = regex.sub(sub, text)
        if found:
            self.files[path] = new

    def write(self, dry_run: bool) -> list[str]:
        for path, text in self.files.items():
            if path.suffix == ".json":
                json.loads(text)          # still JSON
        written = []
        if not dry_run:
            changed_files = {c["file"] for c in self.changes}
            for path, text in self.files.items():
                if str(path.relative_to(self.root)) in changed_files:
                    path.write_text(text, encoding="utf-8")
                    written.append(str(path.relative_to(self.root)))
        return written


def addon_what(mm: re.Match) -> str:
    return mm.group(1).split('"')[1]


def cmd_bump(repo: Repo, a, extra) -> tuple[int, dict]:
    ref = check_ref(a.ref, a.allow_sha)
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
    pe = PinEdit(root, ref)
    for t in talks:
        pe.edit(root / "talks" / t / "package.json", PIN_RE, addon_what)
    if (root / "env.yaml").is_file():
        pe.edit(root / "env.yaml", ENV_PIN_RE, "pip slidev-videos")
    if scaffold.is_file():
        pe.edit(scaffold, REF_RE, "ADDONS_REF")
    written = pe.write(a.dry_run)
    changes = pe.changes
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


def cmd_pin(repo: Repo, a, extra) -> tuple[int, dict]:
    """One talk's two addon pins (slidev-addon-videos, slidev-addon-stage) to a toolkit ref,
    then pnpm install, in the talk's own worktree. bump-toolkit is the release-wide move
    (several talks, env.yaml's CLI pin and the scaffolder); pin touches nothing but the talk."""
    name, ref = (None, a.name) if a.ref is None else (a.name, a.ref)
    if not ref:
        raise UsageError("pin [NAME] REF: a toolkit tag vX.Y.Z (a commit with --allow-sha)")
    check_ref(ref, a.allow_sha)
    if not repo.in_worktree:
        raise UsageError("pin changes a talk's worktree, never the main checkout: `pnpm talk open <name>`, then pin there")
    talk, d = resolve_talk(repo, name, invocation_dir())
    why = not_own(repo, talk)
    if why:
        raise UsageError(f"{why}; pin runs in the talk's own worktree: `pnpm talk open {wt_slug(talk)}`, then pin there",
                         candidates=[str(w.path) for w in owners(repo, talk)])
    data = {"talk": talk, "ref": ref, "dry_run": a.dry_run}
    if SHA_RE.match(ref):
        # pnpm wants the commit pnpm-lock.yaml records; the slidev-videos checkout spells it out
        sv = cfg().path_of("SLIDEV_VIDEOS_DIR")
        full = git_out(["rev-parse", "--verify", "--quiet", f"{ref}^{{commit}}"], sv) if sv and sv.is_dir() else None
        if full:
            ref = data["ref"] = full
        elif len(ref) < 40:
            OUT.say(f"warning: {ref} is not in {sv}; pinning it as given (pnpm asks GitHub)")
    pe = PinEdit(repo.here, ref)
    pe.edit(d / "package.json", PIN_RE, addon_what)
    if not pe.files:
        data["error"] = f"talks/{talk}/package.json has no github: slidev-addon pins (a link: dev loop?)"
        OUT.say(f"error: {data['error']}")
        return 1, data
    written = pe.write(a.dry_run)
    data.update(changes=pe.changes, written=written, installed=False)
    for c in pe.changes:
        OUT.say(f"{c['what']}: {c['before']} -> {c['after']}")
    if not pe.changes:
        OUT.say(f"{talk} is on {ref} already")
        return 0, data
    if a.dry_run:
        OUT.say("dry run: nothing written")
        return 0, data
    if not a.no_install:
        LOG.begin(repo.here, wt_slug(talk), "pin")
        code = install(repo.here)
        data["installed"] = code == 0
        data["log"] = str(LOG.path) if LOG.path else None
        data["lockfile_changed"] = "pnpm-lock.yaml" in porcelain_paths(git_out(["status", "--porcelain"], repo.here) or "")
        if code:
            data["error"] = "pnpm install failed; the pins are written (fix it and run pnpm install again)"
            OUT.say(f"error: {data['error']}")
            return 1, data
    OUT.say(f"next: pnpm talk review {wt_slug(talk)}, then commit talks/{talk}/package.json and pnpm-lock.yaml")
    return 0, data


def cmd_render(repo: Repo, a, extra) -> tuple[int, dict]:
    if not extra:
        raise UsageError("render -- COMMAND [ARGS]: what to run in the render slot")
    cwd = invocation_dir()
    talk = default_talk(repo, cwd)
    LOG.begin(repo.here, wt_slug(talk) if talk else "outreach", "render")
    env = tool_env()
    plan = render_plan(extra, env, a.gpu)
    data = {"backend": plan["backend"], "argv": plan["argv"], "gpu": plan["gpu"], "lock": plan["lock"],
            "cwd": str(cwd), "gl": gl_settings(env)}
    if plan.get("note"):
        data["note"] = plan["note"]
    if a.dry_run:
        OUT.show(("flock " + shlex.quote(plan["lock"]) + " " if plan["lock"] else "") + shlex.join(plan["argv"]))
        return 0, data
    t0 = time.monotonic()
    r, _ = render_run(extra, cwd, env, a.gpu)
    data.update(tool_exit=r.returncode, seconds=round(time.monotonic() - t0, 1),
                summary=summarize(r.stdout, r.returncode == 0), log=str(LOG.path) if LOG.path else None)
    say_summary(data["summary"])
    OUT.show(f"render ({plan['backend']}) {'ok' if r.returncode == 0 else f'FAILED (exit {r.returncode})'}"
             f"  ({data['seconds']} s)  log {data['log']}")
    return (0 if r.returncode == 0 else 1), data


# ---------------------------------------------------------------- sessions: Claude in tmux windows

TMUX_SESSION = "talks"
STATUS_FIELDS = ("name", "branch", "pin", "doing", "blocked", "next")


def session_env() -> dict:
    """tool_env without what pnpm adds for a script run: a tmux server started from here keeps
    its environment for every window, and INIT_CWD there would point talk at the wrong place."""
    env = {k: v for k, v in tool_env().items()
           if not (k.startswith("npm_") or k.startswith("PNPM_SCRIPT") or k in ("INIT_CWD", "TALK_RENDER_SLOT",
                                                                                "SLIDEV_STAGE_SHOTS_LOCKED"))}
    env["PATH"] = os.pathsep.join(p for p in env.get("PATH", "").split(os.pathsep) if "node_modules/.bin" not in p)
    return env


def tmux_windows(tmux: str, env: dict) -> list[dict] | None:
    """The windows of the tmux session "talks"; None when it is not running."""
    fmt = "#{window_index}\t#{window_name}\t#{pane_current_path}\t#{pane_current_command}\t#{window_active}"
    r = run([tmux, "list-windows", "-t", f"={TMUX_SESSION}", "-F", fmt], env=env, capture=True, quiet=True, timeout=15)
    if r.returncode:
        return None
    out = []
    for line in r.stdout.splitlines():
        parts = line.split("\t")
        if len(parts) >= 5:
            out.append({"index": parts[0], "name": parts[1], "path": parts[2], "command": parts[3], "active": parts[4] == "1"})
    return out


def read_status(path: Path) -> dict[str, dict]:
    """$OUTREACH_STATE/status.md: one line per session, name | branch | pin | doing | blocked | next."""
    lines = {}
    try:
        text = path.read_text(encoding="utf-8")
    except OSError:
        return lines
    for line in text.splitlines():
        parts = [x.strip() for x in line.split("|")]
        if len(parts) == len(STATUS_FIELDS) and re.match(r"^[a-z0-9][a-z0-9-]*$", parts[0]):
            lines[parts[0]] = dict(zip(STATUS_FIELDS, parts))
    return lines


def claude_command(display: str, add_dir: str | None = None) -> list[str]:
    cmd = ["claude", "--name", display, "--remote-control", display]
    return cmd + (["--add-dir", add_dir] if add_dir else [])


def cmd_session(repo: Repo, a, extra) -> tuple[int, dict]:
    env = session_env()
    tmux = which("tmux", env)
    if not tmux:
        raise UsageError("tmux is not installed: every session runs in a window of the tmux session \"talks\"")
    key = a.name.strip().lower()
    sv = cfg().path_of("SLIDEV_VIDEOS_DIR")
    data: dict = {"name": key}
    if key in ("tools", "scheduler"):
        if not (sv and sv.is_dir()):
            data["error"] = f"no slidev-videos checkout at {sv} (SLIDEV_VIDEOS_DIR): clone it beside outreach_talks"
            OUT.say(f"error: {data['error']}")
            return 1, data
        if key == "tools":
            win, cwd, cmd = "tools", sv, claude_command("Tools")
        else:
            win, cwd, cmd = "scheduler", repo.main, claude_command("Scheduler", str(sv))
    else:
        code, opened = open_worktree(repo, a.name, a.no_install, dry_run=a.dry_run)
        data.update(opened)
        if code or not opened.get("worktree"):
            return code or 1, data
        talk = opened["talk"]
        win, cwd, cmd = wt_slug(talk), Path(opened["worktree"]), claude_command(f"Talk: {talk[11:]}")
    target = f"{TMUX_SESSION}:{win}"
    attach = f"tmux switch-client -t {target}" if os.environ.get("TMUX") else f"tmux attach -t {target}"
    data.update(window=win, dir=str(cwd), command=cmd, attach=attach)
    windows = tmux_windows(tmux, env)
    if windows is not None and win in [w["name"] for w in windows]:
        data["existing"] = True
        OUT.say(f"{target} is open already")
        OUT.show(attach)
        return 0, data
    common = ["-n", win, "-c", str(cwd), "-e", f"PATH={env['PATH']}", shlex.join(cmd)]
    if windows is None:
        argv = [tmux, "new-session", "-d", "-s", TMUX_SESSION, *common]
    else:
        argv = [tmux, "new-window", "-d", "-t", f"={TMUX_SESSION}:", *common]
    data["tmux"] = argv
    if a.dry_run:
        OUT.say("dry run: would run " + shlex.join(argv))
        return 0, data
    r = run(argv, env=env, capture=True, timeout=20)
    if r.returncode:
        data["error"] = f"tmux failed: {(r.stderr or r.stdout).strip()[:300]}"
        OUT.say(f"error: {data['error']}")
        return 1, data
    data["created"] = "session" if windows is None else "window"
    OUT.say(f"started {shlex.join(cmd)} in {target} ({cwd})")
    OUT.show(attach)
    return 0, data


def cmd_sessions(repo: Repo, a, extra) -> tuple[int, dict]:
    env = session_env()
    tmux = which("tmux", env)
    windows = tmux_windows(tmux, env) if tmux else None
    status_path = Path(cfg()["OUTREACH_STATE"]) / "status.md"
    status = read_status(status_path)
    rows = [{**w, "status": status.get(w["name"])} for w in windows or []]
    names = {w["name"] for w in windows or []}
    status_only = [line for n, line in status.items() if n not in names]

    def fmt(st: dict | None) -> str:
        if not st:
            return "(no line in the status file)"
        return f"{st['doing']} | blocked: {st['blocked']} | next: {st['next']} | {st['branch']} {st['pin']}"
    if windows is None:
        OUT.say(f"no tmux session \"{TMUX_SESSION}\"" + ("" if tmux else " (tmux is not installed)")
                + ": `pnpm talk session <name>` starts one")
    for w in rows:
        OUT.show(f"{w['index'] + ':' + w['name']:<22} {fmt(w['status'])}")
    for st in status_only:
        OUT.show(f"{'-:' + st['name']:<22} {fmt(st)}  (no window)")
    return 0, {"session": TMUX_SESSION, "running": windows is not None, "windows": rows,
               "status_only": status_only, "status_file": str(status_path)}


def cmd_config(repo: Repo, a, extra) -> tuple[int, dict]:
    c = cfg()
    env = tool_env()
    for k in CONFIG_KEYS:
        OUT.show(f"{k:<18} {c[k] if c[k] is not None else '-':<48} {c.sources[k]}")
    passed = {k: v for k, v in c.file.items() if k not in CONFIG_KEYS}
    for k, v in passed.items():
        OUT.show(f"{k:<18} {env.get(k, v):<48} {'environment' if os.environ.get(k) else str(c.path)} (to the tools)")
    OUT.say(f"settings file: {c.path}" + ("" if c.path.is_file() else " (none: scripts/bootstrap.sh writes it)"))
    return 0, {"file": str(c.path), "exists": c.path.is_file(), "values": c.values, "sources": c.sources,
               "passed": passed, "gl": gl_settings(env)}


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
    sp = verb("build", "build into $TALK_TMP/talk-<slug>/site")
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
    sp = verb("deploy", "only when the owner asked: ready, push the commit it passed to main, watch Pages, check the URL")
    sp.add_argument("--dry-run", action="store_true")
    sp.add_argument("--skip-ready", action="store_true")
    sp.add_argument("--ready-skip", action="append", metavar="STEP", help="pass --skip STEP to ready")
    sp.add_argument("--rerun-ready", action="store_true", help="run ready even if it already passed this commit")
    sp = verb("render", "run a command in the render slot: srun, condor_run, or under the render lock", talk=False)
    sp.add_argument("--gpu", dest="gpu", action="store_const", const=True, default=None,
                    help="ask the scheduler for a GPU (default: when the cluster has GPUs; RENDER_GPUS)")
    sp.add_argument("--no-gpu", dest="gpu", action="store_const", const=False)
    sp.add_argument("--dry-run", action="store_true", help="print how it would run")
    sp = verb("pin", "both addon pins of one talk to a toolkit tag, then pnpm install", talk=False)
    sp.add_argument("name", nargs="?", help="the talk (default: the one this worktree changes), then the ref")
    sp.add_argument("ref", nargs="?", help="vX.Y.Z")
    sp.add_argument("--allow-sha", action="store_true", help="a bare commit instead of a tag")
    sp.add_argument("--dry-run", action="store_true")
    sp.add_argument("--no-install", action="store_true")
    sp = verb("session", "a Claude session in a window of the tmux session \"talks\"", talk=False)
    sp.add_argument("name", help="a talk, tools (the slidev-videos checkout) or scheduler")
    sp.add_argument("--no-install", action="store_true", help="when it makes the talk's worktree")
    sp.add_argument("--dry-run", action="store_true", help="print the tmux command")
    verb("sessions", "the windows of the tmux session \"talks\" and their lines in the status file", talk=False)
    verb("config", "the settings talk resolved, and where each came from", talk=False)
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
    "render": cmd_render, "pin": cmd_pin, "session": cmd_session, "sessions": cmd_sessions, "config": cmd_config,
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
    lead = 0
    while argv[lead:lead + 1] == ["--json"]:
        lead += 1
    facts = argv[lead:lead + 1] == ["facts"]
    if facts:
        # facts.py has options of its own, before its verb or after it (--json, --facts, -h):
        # everything after `facts` is its, verbatim; a --json in there is talk's too
        rest = argv[lead + 1:]
        cut = rest.index("--") if "--" in rest else len(rest)
        OUT.json = lead > 0 or "--json" in rest[:cut]
        verb = "facts"
    else:
        argv = split_json_flag(argv)
        verb = next((x for x in argv if not x.startswith("-")), None)
    result: dict = {"verb": verb}
    try:
        parser = build_parser()
        if facts:
            a, extra = argparse.Namespace(verb="facts", rest=rest), []
        else:
            a, extra = parser.parse_known_args(argv)
        if not a.verb:
            parser.print_help(sys.stderr)
            raise UsageError("name a verb")
        if extra[:1] == ["--"]:
            extra = extra[1:]
        elif "--" in extra and a.verb != "render":     # a render's command keeps its own --
            extra.remove("--")
        if extra and a.verb not in PASSTHROUGH:
            raise UsageError(f"unrecognized arguments: {' '.join(extra)}")
        repo = find_repo(invocation_dir())
        code, data = VERBS[a.verb](repo, a, extra)
        if data is None:             # a delegate printed its own result
            return code if code in (0, 1, 2) else 1
        printed = data.pop("_printed", False)
        result.update(data)
        if LOG.path:
            result.setdefault("log", str(LOG.path))
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
