#!/usr/bin/env python3
"""Bake the seeded toys of Talk 2 (simulated, never data) into data/toys.json.

  flat      Poisson re-rolls of 14 bins at the level of the 14 real flat bins
            (d0-flat.json: 1 460.8 a bin), for dk-hist {resample}
  falling   a falling spectrum of 140 entries on 1.45-1.75 GeV in 30 bins,
            re-rolled 20 times, the bin where a 2 sigma alarm fires in each
            roll; then the most alarming roll grown to 3 500 entries
  tail      normal-tail numbers: beyond 1, 3 and 5 sigma, the bell's expected
            grains out of 300 000, 1 in 3.5 million; 1 - 0.95^20

    python3 bake/toys.py
    python3 bake/toys.py --check

Every sample is drawn with numpy's default_rng and the seed written next to it.
The falling spectrum stands in for the Theta+ story (an illustration with the
same shape of argument, not the LEPS data). `--cached` is accepted for symmetry
with the other bakes and ignored: toys.py reads only data/d0-flat.json.
"""
from __future__ import annotations

import argparse
import json

import numpy as np
from scipy.stats import norm, poisson

from common import DATA, emit, json_bytes

SCRIPT = "toys.py"
SEED_FLAT = 1461
SEED_FALL = 1540
N_FLAT_ROLLS = 24
FALL = dict(lo=1.45, hi=1.75, bins=30, slope=-3.2, n=140, rolls=20, big=3500)
ALARM_Z = 2.0

SOURCE = {
    "title": "Seeded toy samples (simulated)",
    "url": "", "doi": "", "record": None, "file": "bake/toys.py", "fileBytes": None, "checksum": None,
    "licence": "CC0-1.0 (generated)", "retrieved": None,
    "note": "Simulated with numpy.random.default_rng; seeds are given with each sample. The flat level comes from record 401 (d0-flat.json).",
}


def local_z(n, mu):
    """One-sided Poisson significance of n entries where mu are expected:
    p = P(N >= n | mu), z = Phi^-1(1 - p); 0 when n <= mu."""
    n = np.asarray(n)
    p = poisson.sf(n - 1, mu)
    z = norm.isf(np.clip(p, 1e-300, 1.0))
    return np.where(n > mu, z, 0.0)


def bake():
    flat = json.loads((DATA / "d0-flat.json").read_text(encoding="utf-8"))
    level = float(flat["mean"])
    rng = np.random.default_rng(SEED_FLAT)
    rolls = rng.poisson(level, (N_FLAT_ROLLS, len(flat["counts"])))
    flat_out = dict(
        about=("Poisson re-rolls of 14 bins of 2 MeV at the level of the real flat bins (simulated). "
               "rolls[r][i] is the count of bin i in re-roll r; edges as the real bins."),
        seed=SEED_FLAT, level=level, sqrtLevel=np.sqrt(level), edges=flat["edges"], real=flat["counts"],
        rolls=rolls, rollSpread=float(rolls.std(ddof=1)),
        rollSpreadPerRoll=rolls.std(axis=1, ddof=1),
        relative={"100": 1 / np.sqrt(100), "10000": 1 / np.sqrt(10000), "1461": 1 / np.sqrt(level)},
    )

    # ------------------------------------------------------------ falling
    lo, hi, nb, k = FALL["lo"], FALL["hi"], FALL["bins"], FALL["slope"]
    e = np.linspace(lo, hi, nb + 1)
    L = hi - lo
    cdf = lambda x: (1 - np.exp(k * (x - lo) / L)) / (1 - np.exp(k))      # density ∝ exp(k (x-lo)/L)
    shares = np.diff(cdf(e))
    inv = lambda u: lo + L / k * np.log(1 - u * (1 - np.exp(k)))
    rng = np.random.default_rng(SEED_FALL)
    rolls_f = []
    for r in range(FALL["rolls"]):
        x = np.sort(inv(rng.random(FALL["n"])))
        c = np.histogram(x, e)[0]
        z = local_z(c, FALL["n"] * shares)
        i = int(np.argmax(z))
        rolls_f.append(dict(roll=r, values=np.round(x, 5), counts=c, z=np.round(z, 4), maxBin=i,
                            maxZ=float(z[i]), alarm=bool(z[i] >= ALARM_Z),
                            alarmAt=[float(e[i]), float(e[i + 1])] if z[i] >= ALARM_Z else None))
    alarms = [r for r in rolls_f if r["alarm"]]
    feat = max(rolls_f, key=lambda r: r["maxZ"])
    more = np.sort(inv(rng.random(FALL["big"] - FALL["n"])))
    big_vals = np.concatenate([feat["values"], more])
    cb = np.histogram(big_vals, e)[0]
    zb = local_z(cb, FALL["big"] * shares)
    fb = feat["maxBin"]
    falling = dict(
        about=("A falling spectrum (simulated): density proportional to exp(slope (m - lo)/(hi - lo)) on lo-hi GeV, "
               "30 bins of 10 MeV, 140 entries a roll, 20 rolls drawn one after another from one generator. "
               "z is the one-sided Poisson significance of each bin against its expected count "
               "(p = P(N >= n | expected), z = Phi^-1(1-p)); an alarm fires where z >= 2. The roll with the "
               "largest z is then grown to 3 500 entries by adding 3 360 more from the same generator."),
        model=dict(FALL, kind="exp"), seed=SEED_FALL, edges=np.round(e, 5),
        expected140=np.round(FALL["n"] * shares, 4), expected3500=np.round(FALL["big"] * shares, 3),
        rolls=rolls_f,
        alarms=len(alarms), alarmShare=len(alarms) / FALL["rolls"],
        alarmBins=[r["maxBin"] for r in alarms],
        bigRoll=dict(fromRoll=feat["roll"], bin=fb, binEdges=[float(e[fb]), float(e[fb + 1])],
                     zAt140=feat["maxZ"], zAt3500=float(zb[fb]), maxZAt3500=float(zb.max()),
                     maxBinAt3500=int(np.argmax(zb)), counts=cb, z=np.round(zb, 4),
                     extraValues=np.round(more, 5)),
        bigN=FALL["big"],
    )

    # --------------------------------------------------------------- tail
    tail = dict(
        about="Standard normal tail areas (one-sided unless named), and what a 300 000-grain bell shows.",
        oneSided={str(s): float(norm.sf(s)) for s in (1, 2, 3, 4, 5)},
        twoSided={str(s): float(2 * norm.sf(s)) for s in (1, 2, 3, 5)},
        oneIn5Sigma=float(1 / norm.sf(5)),
        bell300k={str(s): float(300_000 * norm.sf(s)) for s in (1, 2, 3, 5)},
        lookElsewhere={"20looks_p0.05": 1 - 0.95 ** 20,
                       "20looks_2sigmaTwoSided": 1 - (1 - 2 * norm.sf(2)) ** 20,
                       "20looks_2sigmaOneSided": 1 - (1 - norm.sf(2)) ** 20},
    )
    out = {"toys.json": json_bytes(dict(flat=flat_out, falling=falling, tail=tail, source=SOURCE))}
    ent = {"toys.json": dict(talks=[2], shape="object",
                             meaning="simulated toys: flat-bin Poisson re-rolls, the falling spectrum with its 2 sigma alarms "
                                     "and the 3 500-entry growth, normal-tail numbers and 1 - 0.95^20")}
    summ = dict(level=level, spread=flat_out["rollSpread"], alarms=len(alarms), feat=feat["roll"], fbin=fb,
                z140=feat["maxZ"], z3500=float(zb[fb]), max3500=float(zb.max()))
    return out, ent, summ


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cached", help="ignored (toys.py has no external input beyond data/d0-flat.json)")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args(argv)
    out, ent, s = bake()
    print(f"flat level {s['level']:.1f}, re-roll spread {s['spread']:.1f}; falling: {s['alarms']}/20 rolls alarm; "
          f"roll {s['feat']} bin {s['fbin']}: z {s['z140']:.2f} at 140 -> {s['z3500']:.2f} at 3500 (max {s['max3500']:.2f})")
    return emit(SCRIPT, out, ent, a.check)


if __name__ == "__main__":
    raise SystemExit(main())
