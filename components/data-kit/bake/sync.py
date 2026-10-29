#!/usr/bin/env python3
"""Copy the data-kit files a deck needs into <talk dir>/public/dk/.

The talk's number comes from its directory name (2026_00_00_Data3Fit -> 3,
2026_00_00_DataLab3 -> 3) or from --talk; data/manifest.json says which talks
load each file. --all copies every file (the lab decks prototype any form).
Files are copied only when their bytes differ; nothing is deleted, and files in
public/dk/ that the manifest does not know are listed so they can be removed by hand.
A filtered dk-manifest.json goes along, so a deck can see what it was given.

    python3 bake/sync.py --to talks/2026_00_00_Data3Fit
    python3 bake/sync.py --to talks/2026_00_00_DataLab1 --all
    python3 bake/sync.py --to DIR --check     # exit 1 if DIR/public/dk is out of date
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

from common import DATA, MANIFEST, json_bytes


def talk_number(d: Path) -> int | None:
    m = re.search(r"Data(?:Lab)?(\d)", d.name)
    return int(m.group(1)) if m else None


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--to", required=True, action="append", help="talk directory (repeatable)")
    ap.add_argument("--talk", type=int, help="talk number, when the directory name does not say")
    ap.add_argument("--all", action="store_true", help="copy every file in the manifest")
    ap.add_argument("--check", action="store_true", help="report what would change and exit 1 if anything would")
    a = ap.parse_args(argv)
    files = json.loads(MANIFEST.read_text(encoding="utf-8"))["files"]
    stale = 0
    for to in a.to:
        d = Path(to).resolve()
        if not (d / "package.json").is_file() and not (d / "deck.md").is_file():
            raise SystemExit(f"{d}: not a talk directory")
        n = a.talk or talk_number(d)
        if not a.all and n is None:
            raise SystemExit(f"{d}: cannot tell the talk number; pass --talk N or --all")
        want = sorted(k for k, v in files.items() if a.all or n in v.get("talks", []))
        missing = [k for k in want if not (DATA / k).is_file()]
        if missing:
            raise SystemExit(f"data/ lacks {missing}: run the bakes first")
        dst = d / "public" / "dk"
        if not a.check:
            dst.mkdir(parents=True, exist_ok=True)
        changed, total = [], 0
        sub = {"about": "Copied by components/data-kit/bake/sync.py; see components/data-kit/data/manifest.json.",
               "files": {k: files[k] for k in want}}
        payload = {k: (DATA / k).read_bytes() for k in want}
        payload["dk-manifest.json"] = json_bytes(sub)
        for k, b in payload.items():
            total += len(b)
            t = dst / k
            if not t.is_file() or t.read_bytes() != b:
                changed.append(k)
                if not a.check:
                    t.write_bytes(b)
        extra = sorted(p.name for p in dst.glob("*") if p.is_file() and p.name not in payload) if dst.is_dir() else []
        label = "all" if a.all else f"talk {n}"
        verb = "would update" if a.check else "updated"
        print(f"{d.name} ({label}): {len(payload)} files, {total / 1e6:.2f} MB; {verb} {len(changed)}"
              + (f": {', '.join(changed)}" if changed and len(changed) <= 8 else ""))
        if extra:
            print(f"  not from the kit (left in place): {', '.join(extra)}")
        stale += bool(changed)
    return 1 if a.check and stale else 0


if __name__ == "__main__":
    raise SystemExit(main())
