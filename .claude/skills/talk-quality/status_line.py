#!/usr/bin/env python3
"""This session's line in the shared status file, written at a step boundary.

One line per session in $OUTREACH_STATE/status.md, the board the Scheduler
and `pnpm talk sessions` read:

    name | branch | toolkit pin | doing | blocked on | next

`name` is the talk's slug (`opendata` for talks/2026_10_00_OpenData, as
`pnpm talk list --json` reports it; also the session's tmux window), or
`tools` or `scheduler`. The branch is read from git in the current
directory and the pin from the talk's package.json; fields not given keep
their last value. A `|` inside a value becomes `/`, an empty value `-`.

Usage (from the root of the talk's worktree, which the paths below assume):
    python3 -I .claude/skills/talk-quality/status_line.py opendata \\
        --doing "review round 2" --blocked "-" --next "pnpm talk ready opendata"
    python3 -I .claude/skills/talk-quality/status_line.py --show [name]
    python3 -I .claude/skills/talk-quality/status_line.py --remove opendata

$OUTREACH_STATE comes from the environment, else from
~/.config/outreach_talks/env, else ~/.local/state/outreach_talks.
Exit 0 ok, 1 --show found no line for that name, 2 usage error.
"""
from __future__ import annotations

import argparse
import fcntl
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path

FIELDS = ("name", "branch", "pin", "doing", "blocked", "next")
NAME_RE = re.compile(r"^[a-z0-9][a-z0-9-]*$")
TALK_RE = re.compile(r"^\d{4}_\d{2}_\d{2}_\w+$")
PIN_RE = re.compile(r'"slidev-addon-(?:videos|stage)"\s*:\s*"github:[^"#]+#([^"&]+)')


def state_dir() -> Path:
    value = os.environ.get("OUTREACH_STATE")
    conf = Path.home() / ".config/outreach_talks/env"
    if not value and conf.is_file():
        for line in conf.read_text(encoding="utf-8").splitlines():
            m = re.match(r"\s*(?:export\s+)?OUTREACH_STATE=(.*)$", line)
            if m:
                value = m.group(1).strip().strip("'\"")
    return Path(os.path.expandvars(os.path.expanduser(value))) if value else Path.home() / ".local/state/outreach_talks"


def git(*args: str) -> str:
    r = subprocess.run(["git", *args], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else ""


def slug(talk_dir: str) -> str:
    """As scripts/new_talk.py worktree_slug: 2026_10_00_OpenData -> opendata."""
    return (talk_dir[11:] if TALK_RE.match(talk_dir) else talk_dir).lower().replace("_", "-")


def toolkit_pin(name: str, talk: Path | None) -> str:
    if talk is None:
        top = git("rev-parse", "--show-toplevel")
        found = [d for d in sorted(Path(top).glob("talks/*")) if slug(d.name) == name] if top else []
        talk = found[0] if found else None
    pkg = talk / "package.json" if talk else None
    if not pkg or not pkg.is_file():
        return ""
    pins = [p[:7] if re.fullmatch(r"[0-9a-f]{40}", p) else p for p in PIN_RE.findall(pkg.read_text(encoding="utf-8"))]
    return "/".join(dict.fromkeys(pins))


def clean(value: str | None) -> str:
    value = " ".join((value or "").replace("|", "/").split())
    return value or "-"


def parse(line: str) -> dict | None:
    parts = [p.strip() for p in line.split("|")]
    if len(parts) != len(FIELDS) or not NAME_RE.match(parts[0]):
        return None
    return dict(zip(FIELDS, parts))


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="status_line.py", description=__doc__.split("\n\n")[0])
    ap.add_argument("name", nargs="?", help="the talk's slug, tools or scheduler")
    ap.add_argument("--doing")
    ap.add_argument("--blocked", help="what this session waits on; - for nothing")
    ap.add_argument("--next", help="the next command or step")
    ap.add_argument("--branch", help="default: git branch --show-current here")
    ap.add_argument("--pin", help="default: the addon pins in the talk's package.json")
    ap.add_argument("--talk", type=Path, help="the talk directory, when the name does not find it")
    ap.add_argument("--show", action="store_true", help="print the file, or the named line")
    ap.add_argument("--remove", action="store_true", help="drop the named line (a closed session)")
    try:
        a = ap.parse_args(argv)
    except SystemExit as exc:
        return 2 if exc.code else 0
    if a.name and not NAME_RE.match(a.name):
        print(f"status_line: {a.name!r} is not a slug (lowercase letters, digits and dashes)", file=sys.stderr)
        return 2
    if not a.show and not a.name:
        print("status_line: name the session (the talk's slug, tools or scheduler)", file=sys.stderr)
        return 2
    path = state_dir() / "status.md"
    if a.show:
        lines = path.read_text(encoding="utf-8").splitlines() if path.is_file() else []
        if a.name:
            lines = [l for l in lines if (parse(l) or {}).get("name") == a.name]
        print("\n".join(lines) or f"status_line: no line{' for ' + a.name if a.name else 's'} in {path}", file=sys.stdout if lines else sys.stderr)
        return 0 if lines or not a.name else 1
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path.with_name("status.md.lock"), "a") as lock:
        fcntl.flock(lock, fcntl.LOCK_EX)          # sessions write at their own step boundaries
        lines = path.read_text(encoding="utf-8").splitlines() if path.is_file() else []
        mine = [i for i, l in enumerate(lines) if (parse(l) or {}).get("name") == a.name]
        old = parse(lines[mine[0]]) if mine else {}
        written = None
        if not a.remove:
            head = git("rev-parse", "--short", "HEAD")
            branch = a.branch or git("branch", "--show-current") or (f"detached {head}" if head else old.get("branch"))
            pin = a.pin or toolkit_pin(a.name, a.talk) or old.get("pin")
            row = {"name": a.name, "branch": branch, "pin": pin}
            for k in ("doing", "blocked", "next"):
                row[k] = getattr(a, k) if getattr(a, k) is not None else old.get(k)
            written = " | ".join(clean(row[k]) for k in FIELDS)
        # the line keeps its place; a new session's line goes last
        out = [written if i == mine[0] else l for i, l in enumerate(lines) if i not in mine[1:]] if mine else lines + [written]
        out = [l for l in out if l is not None]
        fd, tmp = tempfile.mkstemp(dir=path.parent, prefix=".status.")
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write("".join(l + "\n" for l in out))
        os.replace(tmp, path)
    print(written or f"removed {a.name} from {path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
