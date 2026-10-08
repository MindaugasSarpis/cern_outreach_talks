#!/usr/bin/env python3
"""The facts of talk-research-gaps lane files, as one JSON list for
`pnpm talk facts add --from-json -`.

A lane file (talks/<t>/research/<lane>.json) is {lane, slides, topic, status,
facts: [...], notes, open_questions}; the bank takes only the facts, so a lane
file given to `facts add --from-json` directly is refused. Empty strings
become null (the bank refuses as_of "" and verified_on ""), keys the bank does
not know are dropped with a note on stderr, and images.json is skipped (its
photos go through scripts/photo_fetch.py --record).

Usage (from the worktree root):
    python3 -I .claude/skills/talk-research/lane_facts.py talks/<t>/research/*.json \\
        | pnpm -s talk facts add --from-json - --dry-run
    python3 -I .claude/skills/talk-research/lane_facts.py <lane files> --id <id> [--id <id>]

Exit 0 ok, 1 a file was skipped or an --id was not found (the rest is still
printed), 2 usage error.
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

# The bank's keys, as scripts/facts.py FIELDS.
FIELDS = ("id", "claim_en", "claim_lt", "value", "unit", "as_of", "source_url",
          "quote", "verdict", "verified_on", "verified_by", "used_in")


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(prog="lane_facts.py", description=__doc__.split("\n\n")[0])
    ap.add_argument("files", nargs="+", type=Path, help="lane files; images.json is skipped")
    ap.add_argument("--id", action="append", dest="ids", metavar="ID", help="only this fact; repeat for more")
    try:
        args = ap.parse_args(argv)
    except SystemExit as exc:
        return 2 if exc.code else 0
    out, problems = [], 0
    for f in args.files:
        if f.name == "images.json":
            continue
        try:
            lane = json.loads(f.read_text(encoding="utf-8"))
        except (OSError, ValueError) as exc:
            print(f"lane_facts: {f}: {exc}; not filed", file=sys.stderr)
            problems += 1
            continue
        facts = lane.get("facts") if isinstance(lane, dict) else None
        if not isinstance(facts, list):
            print(f"lane_facts: {f}: no facts list (not a lane file?); not filed", file=sys.stderr)
            problems += 1
            continue
        for fact in facts:
            if not isinstance(fact, dict):
                continue
            extra = sorted(k for k in fact if k not in FIELDS)
            if extra:
                print(f"lane_facts: {f.name} {fact.get('id')}: dropped keys {', '.join(extra)}", file=sys.stderr)
            out.append({k: (None if fact[k] == "" else fact[k]) for k in FIELDS if k in fact})
    if args.ids:
        found = {e.get("id") for e in out}
        for missing in [i for i in args.ids if i not in found]:
            print(f"lane_facts: no fact {missing!r} in these lane files", file=sys.stderr)
            problems += 1
        out = [e for e in out if e.get("id") in args.ids]
    print(json.dumps(out, ensure_ascii=False))
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
