#!/usr/bin/env python3
"""Talk-owned data for Data2Peak (fix2:data2peak), from the kit bake's own outputs in public/dk/.

Writes two files into public/dk/ (the kit's manifest does not list them yet: notes/kit-requests.md):

  t2.json               - `falling`: toys.json's falling toy (seed 1540) redrawn on the series' mass
                          axis. The kit bake draws it on 1.45-1.75 GeV in 30 bins; the shape
                          exp(k (m - lo)/L) depends only on the share of the range, so the map
                          m' = 1816 + (m - 1.45) x 320 MeV/c2 per GeV keeps every count, every z and
                          every alarm: 30 bins of 3.2 MeV/c2 on 1 816-1 912 MeV/c2, the series' range.
                          Only the x values move (edges, alarmAt, roll values, the curve sets).
                        - `first186`: rows 1-186 of record 401 (file order) that fall in the three
                          bands (1820-1840, 1850-1880, 1890-1910 MeV/c2), counted in 10 MeV/c2 bins
                          from 1 820 (slide 14's coarse picture: 139 rows).
  t2-falling-big.f32    - falling-big.f32 (the toy grown to 3 500 rows, file order) under the same map,
                          one float32 column M in MeV/c2 (a dk-hist reads it with cols ['M'], bin 3.2).

Every value is checked to land in the same bin the kit's builder gives the GeV value
(Math.floor((v - lo) / bin) on the float32 value), and the window of slide 12 to hold exactly the
alarm bin. Run from the talk directory: python3 -I bake/remap.py [--check]
"""
import argparse
import array
import json
import math
import struct
import sys
from pathlib import Path

DK = Path(__file__).resolve().parent.parent / "public" / "dk"
G_LO, G_HI, G_BIN = 1.45, 1.75, 0.01
M_LO, M_HI = 1816.0, 1912.0
SCALE = (M_HI - M_LO) / (G_HI - G_LO)          # 320 MeV/c2 per GeV
M_BIN = 3.2                                     # (M_HI - M_LO) / 30, the deck's literal `bin: 3.2`
NB = 30
BANDS = [(1820.0, 1840.0), (1850.0, 1880.0), (1890.0, 1910.0)]
COARSE_LO, COARSE_BIN, COARSE_NB = 1820.0, 10.0, 9


def f32(x):
    return struct.unpack("<f", struct.pack("<f", x))[0]


def to_mev(g):
    return M_LO + (g - G_LO) * SCALE


def bin_of(v, lo, b):
    return math.floor((v - lo) / b)


def mev_value(g32):
    """A float32 MeV value that the builder bins where it bins the float32 GeV value g32."""
    want = bin_of(g32, G_LO, G_BIN)
    m = f32(to_mev(g32))
    if bin_of(m, M_LO, M_BIN) == want:
        return m, want
    centre = M_LO + (want + 0.5) * M_BIN
    for _ in range(64):     # step one float32 ulp at a time toward the bin's centre
        bits = struct.unpack("<I", struct.pack("<f", m))[0]
        bits += 1 if centre > m else -1
        m = struct.unpack("<f", struct.pack("<I", bits))[0]
        if bin_of(m, M_LO, M_BIN) == want:
            return m, want
    raise SystemExit(f"cannot place {g32} in bin {want}")


def remap_falling(fall):
    out = json.loads(json.dumps(fall))
    out["about"] = ("toys.json's falling toy (simulated, seed 1540) redrawn on the series' mass axis by "
                    "talks/2026_00_00_Data2Peak/bake/remap.py: m' = 1816 + (m - 1.45) x 320 MeV/c2 per GeV, 30 bins "
                    "of 3.2 MeV/c2 on 1 816-1 912 MeV/c2. Counts, z, alarms and rolls are the bake's own; only x "
                    "values move. " + fall.get("about", ""))
    out["model"] = {**fall["model"], "lo": M_LO, "hi": M_HI, "unit": "MeV/c2 (mapped from GeV)"}
    out["edges"] = [round(to_mev(e), 6) for e in fall["edges"]]
    for r in out["rolls"]:
        if r.get("alarmAt"):
            r["alarmAt"] = [round(to_mev(a), 6) for a in r["alarmAt"]]
        if r.get("values"):
            r["values"] = [round(to_mev(v), 4) for v in r["values"]]
    br = out.get("bigRoll") or {}
    for k in ("binEdges",):
        if br.get(k):
            br[k] = [round(to_mev(a), 6) for a in br[k]]
    for k in list(br.keys()):
        if isinstance(br.get(k), list) and k.lower().endswith("values"):
            br[k] = [round(to_mev(v), 4) for v in br[k]]
    cv = out["curve"]
    cv["range"] = [M_LO, M_HI]
    cv["about"] = ("the toy's expectation as dk-curve 'exp' sets on the MeV axis (slope per MeV/c2, pivot 1816, "
                   "bin 3.2): the same a, the same curve per bin as the bake's GeV sets")
    for s in cv["sets"]:
        s["slope"] = round(s["slope"] / SCALE, 10)
        s["pivot"] = M_LO
        s["bin"] = M_BIN
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true", help="rebuild in memory and compare with the files")
    a = ap.parse_args()

    toys = json.loads((DK / "toys.json").read_text())
    big_head = json.loads((DK / "falling-big.json").read_text())
    g = array.array("f"); g.frombytes((DK / "falling-big.f32").read_bytes())
    assert len(g) == big_head["n"] == 3500

    vals, bins = [], []
    for x in g:
        m, b = mev_value(x)
        vals.append(m); bins.append(b)
    for n, key in ((140, "counts140"), (3500, "counts3500")):
        c = [0] * NB
        for b in bins[:n]:
            c[b] += 1
        assert c == big_head[key], (key, c, big_head[key])
    # slide 12's window: inclusive [w0, w1] must hold exactly the alarm bin's rows
    ab = big_head["alarmBin"]
    w0, w1 = M_LO + ab * M_BIN, M_LO + (ab + 1) * M_BIN
    inside = [w0 <= v <= w1 for v in vals]
    if any(i != (b == ab) for i, b in zip(inside, bins)):
        w1 = f32(w1 - 0.01)
        inside = [w0 <= v <= w1 for v in vals]
        assert all(i == (b == ab) for i, b in zip(inside, bins)), "window"
    window = [round(w0, 4), round(w1, 4)]

    d = array.array("f"); d.frombytes((DK / "d0.f32").read_bytes())
    first = [0] * COARSE_NB
    rows = 0
    for r in range(186):
        m = d[4 * r]
        if any(lo < m < hi for lo, hi in BANDS):
            first[bin_of(m, COARSE_LO, COARSE_BIN)] += 1
            rows += 1
    sig = json.loads((DK / "d0-significance.json").read_text())["staysAbove5From"]
    assert sum(first[3:6]) == sig["on"] and sum(first[0:2]) + sum(first[7:9]) == sig["off"], (first, sig)

    out = {
        "about": ("Data2Peak's talk-owned data (bake/remap.py), from the kit bake's toys.json, falling-big.f32, "
                  "d0.f32 and d0-significance.json."),
        "falling": remap_falling(toys["falling"]),
        "growWindow": window,
        "first186": first,
        "first186About": ("rows 1-186 of record 401 in file order that fall in 1820-1840, 1850-1880 or 1890-1910 "
                          f"MeV/c2 ({rows} rows), counted in 10 MeV/c2 bins from 1 820: window {sum(first[3:6])} = "
                          f"staysAbove5From.on, side bands {sum(first[0:2]) + sum(first[7:9])} = staysAbove5From.off. "
                          "A dk-hist reads it with src 't2.json', key 'first186', lo 1820, bin 10."),
        "source": {"by": "talks/2026_00_00_Data2Peak/bake/remap.py",
                   "from": ["public/dk/toys.json", "public/dk/falling-big.f32", "public/dk/d0.f32",
                            "public/dk/d0-significance.json"],
                   "licence": "CC0-1.0 (record 401) and generated (the toy)"},
    }
    text = json.dumps(out, indent=1, ensure_ascii=False) + "\n"
    blob = struct.pack(f"<{len(vals)}f", *vals)
    if a.check:
        ok = (DK / "t2.json").read_text() == text and (DK / "t2-falling-big.f32").read_bytes() == blob
        print("remap: up to date" if ok else "remap: STALE (run bake/remap.py)")
        return 0 if ok else 1
    (DK / "t2.json").write_text(text)
    (DK / "t2-falling-big.f32").write_bytes(blob)
    print(f"remap: t2.json (first186 {first}, window {window}), t2-falling-big.f32 ({len(vals)} rows)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
