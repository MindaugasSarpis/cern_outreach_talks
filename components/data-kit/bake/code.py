#!/usr/bin/env python3
"""code-lines.json: the real line structure of the series' scripts, for dk-pipeline's code stage.

For each script: its bytes, sha256, line count and, per line, the character columns of its
non-blank runs ([start, end) pairs; tabs expanded to 4), so a deck draws each line as a row of
grains with its true indent, its true length and its true gaps between words. Only the line
structure is kept, never the text (the course repository is not public). Deterministic, no
timestamps. Adopted from lane t5's lab script (notes/requests-t5.md, request 1).

    python3 bake/code.py            # write data/code-lines.json and its manifest entry
    python3 bake/code.py --check    # exit 1 when a script changed (sha256) or the output differs
"""
from __future__ import annotations

import argparse
import hashlib
import re
from pathlib import Path

from common import KIT, course_file, emit

SCRIPT = "code.py"


def runs(line: str) -> list[int]:
    line = line.expandtabs(4).rstrip("\n")
    out: list[int] = []
    for m in re.finditer(r"\S+", line):
        out += [m.start(), m.end()]
    return out


def structure(path: Path, shown: str) -> dict:
    b = path.read_bytes()
    lines = b.decode("utf-8").split("\n")
    if lines and lines[-1] == "":
        lines = lines[:-1]
    return {"path": shown, "bytes": len(b), "sha256": hashlib.sha256(b).hexdigest(), "lines": len(lines),
            "longest": max(len(l.expandtabs(4)) for l in lines), "runs": [runs(l) for l in lines]}


def bake() -> tuple[dict, dict]:
    import json
    scripts = {
        "root_to_csv.py": structure(course_file("root_to_csv.py"),
                                    "CERN_lessons_on_data_analysis: lectures/workbook/docs/data/root_to_csv.py"),
        "d0.py": structure(KIT / "bake" / "d0.py", "components/data-kit/bake/d0.py"),
    }
    doc = {"about": "Per script and per line, the [start, end) columns of the non-blank runs (tabs as 4). "
                    "dk-pipeline's code stage draws one grain row per line from these: indent, length and word gaps true.",
           "scripts": scripts}
    # compact, as dk-pipeline reads it (the runs are long integer lists)
    out = {"code-lines.json": (json.dumps(doc, separators=(",", ":")) + "\n").encode("utf-8")}
    ent = {"code-lines.json": {
        "talks": [5], "shape": "per script: path, bytes, sha256, lines, longest, runs",
        "meaning": "the real line structure of the series' scripts (course root_to_csv.py, the kit's bake/d0.py) "
                   "for dk-pipeline's code stage; no source text"}}
    return out, ent


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args(argv)
    out, ent = bake()
    return emit(SCRIPT, out, ent, a.check)


if __name__ == "__main__":
    raise SystemExit(main())
