#!/usr/bin/env python3
"""Bake the CMS Higgs-to-four-lepton open-data example into data/h4l.json.

Source: CERN Open Data record 5500, "Higgs-to-four-lepton analysis example
using 2011-2012 data" (DOI 10.7483/OPENDATA.CMS.JKB8.RR42, GPL-3.0-only as the
record states), through its GitHub repository cms-opendata-analyses/
HiggsExample20112012 at commit c05c526a. The 18 histogram files of rootfiles/
(about 1.2 MB) are combined exactly as Level2/M4Lnormdatall.cc does: the
m4l "low" histograms (37 bins of 3 GeV, 70-181 GeV) of 4mu, 4e and 2mu2e,
Monte Carlo scaled by lumi x cross section x scale factor / events, data
summed. Output: per-bin counts for 2011 and 2012 data and the expected ZZ,
Z/gamma* + X, ttbar and m_H = 125 GeV Higgs, with a significance of this
sample alone (about 2 sigma, as the record says of this simplified analysis).

Needs uproot (not in the outreach_talks env): run it with a separate env, e.g.

    python -m venv /tmp/h4l && /tmp/h4l/bin/pip install uproot awkward
    /tmp/h4l/bin/python bake/h4l.py --cached DIR      # DIR holds the 18 .root files
    /tmp/h4l/bin/python bake/h4l.py                   # fetch them into a temp dir first
    /tmp/h4l/bin/python bake/h4l.py --cached DIR --check

Deterministic: no random numbers, no timestamps.
"""
from __future__ import annotations

import argparse
import math
import tempfile
import urllib.request
from pathlib import Path
from statistics import NormalDist

import numpy as np

from common import emit, json_bytes, sha256

SCRIPT = "h4l.py"
COMMIT = "c05c526a6b75e6963ea2d75cf2fde49c2cf416ed"
RAW = f"https://raw.githubusercontent.com/cms-opendata-analyses/HiggsExample20112012/{COMMIT}/rootfiles/"
UA = "outreach-talks-data-kit/1.0 (bake/h4l.py)"

LUMI = {"12": 11580.0, "11": 2330.0}            # pb^-1 (M4Lnormdatall.cc l.76-77)
SF_ZZ, SF_TT11, SF_DY = 1.386, 0.11, 1.12
CH = ("mass4mu_8TeV_low", "mass4e_8TeV_low", "mass2mu2e_8TeV_low")
# (file, scale, channels) for each expected component, as in the macro
MC = {
    "zz": [("ZZ4mu12", LUMI["12"] * 0.077 * SF_ZZ / 1499064, [CH[0]]),
           ("ZZ4e12", LUMI["12"] * 0.077 * SF_ZZ / 1499093, [CH[1]]),
           ("ZZ2mu2e12", LUMI["12"] * 0.18 * SF_ZZ / 1497445, [CH[2]]),
           ("ZZ4mu11", LUMI["11"] * 0.067 * SF_ZZ / 1447136, [CH[0]]),
           ("ZZ4e11", LUMI["11"] * 0.067 * SF_ZZ / 1493308, [CH[1]]),
           ("ZZ2mu2e11", LUMI["11"] * 0.15 * SF_ZZ / 1479879, [CH[2]])],
    "higgs": [("HZZ12", LUMI["12"] * 0.0065 / 299973, list(CH)),
              ("HZZ11", LUMI["11"] * 0.0057 / 299683, list(CH))],
    "ttbar": [("TTBar12", LUMI["12"] * 200.0 / 6423106, list(CH)),
              ("TTBar11", LUMI["11"] * 177.31 * SF_TT11 / 9771205, list(CH))],
    "dy": [("DY50TuneZ12", LUMI["12"] * 2955.0 * SF_DY / 29426492, list(CH)),
           ("DY1012", LUMI["12"] * 10.742 * SF_DY / 6462290, list(CH)),
           ("DY50TuneZ11", LUMI["11"] * 2475.0 * SF_DY / 36408225, list(CH)),
           ("DY1011", LUMI["11"] * 9507.0 * SF_DY / 39909640, list(CH))],
}
DATA = {"12": [("DoubleMu12", [CH[0], CH[2]]), ("DoubleE12", [CH[1]])],
        "11": [("DoubleMu11", [CH[0], CH[2]]), ("DoubleE11", [CH[1]])]}
FILES = sorted({f for v in MC.values() for f, _, _ in v} | {f for v in DATA.values() for f, _ in v})


def fetch(dirpath: Path) -> None:
    for f in FILES:
        req = urllib.request.Request(RAW + f + ".root", headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=60) as r:
            (dirpath / f"{f}.root").write_bytes(r.read())


def year_of(name: str) -> str:
    return name[-2:]


def bake(d: Path):
    import uproot                                     # only this script needs it
    hist = lambda f, h: uproot.open(d / f"{f}.root")[f"demo/{h}"]
    h0 = hist("DoubleMu12", CH[0])
    edges = h0.axis().edges()
    nb = len(edges) - 1
    comp = {k: {"11": np.zeros(nb), "12": np.zeros(nb)} for k in MC}
    for k, items in MC.items():
        for f, s, chans in items:
            for h in chans:
                comp[k][year_of(f)] += s * hist(f, h).values()
    data = {"11": np.zeros(nb), "12": np.zeros(nb)}
    for y, items in DATA.items():
        for f, chans in items:
            for h in chans:
                data[y] += hist(f, h).values()
    bkg = {y: comp["zz"][y] + comp["dy"][y] + comp["ttbar"][y] for y in ("11", "12")}
    n = data["11"] + data["12"]
    b = bkg["11"] + bkg["12"]
    s = comp["higgs"]["11"] + comp["higgs"]["12"]
    x = 0.5 * (edges[:-1] + edges[1:])

    # significance of this sample alone, two ways
    def lnL(mu):
        lam = b + mu * s
        m = lam > 0
        return float(np.sum(n[m] * np.log(lam[m]) - lam[m]))
    mus = np.linspace(0, 5, 5001)
    ll = np.array([lnL(m) for m in mus])
    i = int(np.argmax(ll))
    q0 = max(0.0, 2 * (ll[i] - ll[0]))
    win = (x > 121) & (x < 131)                      # the bins centred at 122.5, 125.5, 128.5 GeV
    nw, bw, sw = float(n[win].sum()), float(b[win].sum()), float(s[win].sum())
    p = 1 - sum(math.exp(-bw) * bw ** k / math.factorial(k) for k in range(int(nw)))   # P(N >= nw | bw)
    zwin = NormalDist().inv_cdf(1 - p) if p < 0.5 else 0.0
    shas = {f: sha256(d / f"{f}.root")[:16] for f in FILES}
    out = {
        "about": ("CMS H -> ZZ -> 4 leptons open-data example (record 5500), the Level 2 plot: 4mu + 4e + 2mu2e "
                  "candidates in 37 bins of 3 GeV on 70-181 GeV, data counts for 2011 (7 TeV, 2.33 fb^-1) and "
                  "2012 (8 TeV, 11.58 fb^-1), expected events per bin from simulation scaled as M4Lnormdatall.cc "
                  "(ZZ, Z/gamma* + X, ttbar; the Higgs at m_H = 125 GeV). The significance here is this simplified "
                  "sample alone: a binned Poisson likelihood ratio of b + mu s against b (asymptotic, z = sqrt(q0)), "
                  "and a counting check in the three bins 121-130 GeV. Not CMS's published 5.0 sigma."),
        "edges": edges, "x": x, "unit": "GeV",
        "data": {"2011": data["11"].astype(int), "2012": data["12"].astype(int), "all": n.astype(int)},
        "expected": {
            "zz": {"2011": comp["zz"]["11"], "2012": comp["zz"]["12"]},
            "dy": {"2011": comp["dy"]["11"], "2012": comp["dy"]["12"]},
            "ttbar": {"2011": comp["ttbar"]["11"], "2012": comp["ttbar"]["12"]},
            "higgs": {"2011": comp["higgs"]["11"], "2012": comp["higgs"]["12"]},
            "background": {"2011": bkg["11"], "2012": bkg["12"], "all": b},
        },
        "totals": {"data2011": int(data["11"].sum()), "data2012": int(data["12"].sum()),
                   "background": float(b.sum()), "higgs": float(s.sum())},
        "significance": {"muHat": float(mus[i]), "q0": q0, "z": math.sqrt(q0),
                         "window": {"range": [121.0, 130.0], "observed": nw, "background": bw, "higgs": sw,
                                    "pValue": p, "z": zwin}},
        "files": shas,
        "source": {"title": "Higgs-to-four-lepton analysis example using 2011-2012 data",
                   "url": "https://opendata.cern.ch/record/5500", "doi": "10.7483/OPENDATA.CMS.JKB8.RR42",
                   "record": 5500, "file": f"github.com/cms-opendata-analyses/HiggsExample20112012@{COMMIT[:8]} rootfiles/ (18 files)",
                   "fileBytes": int(sum((d / f'{f}.root').stat().st_size for f in FILES)), "checksum": "per file in `files` (sha256, first 16 hex)",
                   "licence": "GPL-3.0-only (record 5500's licence field)", "retrieved": "2026-10-29",
                   "note": "A strongly simplified reimplementation of CMS, PLB 716 (2012) 30 (the record's own words)."},
    }
    return out


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cached", help="directory with the 18 .root files of rootfiles/")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args(argv)
    try:
        import uproot  # noqa: F401
    except ImportError:
        print("h4l.py needs uproot + awkward (not in the outreach_talks env); see the docstring")
        return 2
    if a.cached:
        res = bake(Path(a.cached))
    else:
        with tempfile.TemporaryDirectory() as t:
            fetch(Path(t))
            res = bake(Path(t))
    sg = res["significance"]
    print(f"h4l: data 2011 {res['totals']['data2011']}, 2012 {res['totals']['data2012']}, background "
          f"{res['totals']['background']:.2f}, higgs {res['totals']['higgs']:.2f}; z {sg['z']:.2f} (mu {sg['muHat']:.2f}); "
          f"window {sg['window']['observed']:.0f} vs {sg['window']['background']:.2f}: z {sg['window']['z']:.2f}")
    out = {"h4l.json": json_bytes(res)}
    ent = {"h4l.json": dict(talks=[2], shape="37 bins",
                            meaning="CMS record 5500 4-lepton mass: 2011 and 2012 data counts, expected ZZ / DY / ttbar / Higgs per bin, this sample's own significance")}
    return emit(SCRIPT, out, ent, a.check)


if __name__ == "__main__":
    raise SystemExit(main())
