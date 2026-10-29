#!/usr/bin/env python3
"""d0-peaks.f32: the fitted peak of each of the 120 selections, as values for a dk-hist.

Reads data/d0-select.json (made by d0.py) and writes its selections' fitted mu (MeV/c^2) in
selection order (i = 0 first: the no-cut fit) as little-endian float32, so a deck can draw
the 120 peaks as their own dot histogram on a printed scale (`values: 'd0-peaks.f32',
cols: ['MU'], key: 'MU'`) instead of a magnified row under the mass axis. Run it after
d0.py; --check fails when the file disagrees with d0-select.json. Adopted from lane t5's
lab copy (notes/requests-t5.md, request 6).
"""
from __future__ import annotations

import argparse
import json

import numpy as np

from common import DATA, emit, f32_bytes

SCRIPT = "peaks.py"


def bake() -> tuple[dict, dict]:
    sel = json.loads((DATA / "d0-select.json").read_text(encoding="utf-8"))["selections"]
    mu = np.array([s["mu"] if s.get("mu") is not None else np.nan for s in sel], dtype=np.float32)
    out = {"d0-peaks.f32": f32_bytes(mu)}
    ent = {"d0-peaks.f32": {
        "talks": [5], "shape": [len(sel)], "dtype": "float32 LE",
        "meaning": "fitted peak mu (MeV/c^2) of each of d0-select.json's selections in selection order "
                   "(0 = no cut); for a dk-hist of the peaks with cols ['MU'], key 'MU'"}}
    return out, ent


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args(argv)
    out, ent = bake()
    return emit(SCRIPT, out, ent, a.check)


if __name__ == "__main__":
    raise SystemExit(main())
