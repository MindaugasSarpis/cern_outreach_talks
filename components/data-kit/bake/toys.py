#!/usr/bin/env python3
"""Bake the seeded toys of Talk 2 (simulated, never data) into data/toys.json.

  flat      Poisson re-rolls of 14 bins at the level of the 14 real flat bins
            (d0-flat.json: 1 460.8 a bin), for dk-hist {resample}
  falling   a falling spectrum of 140 entries on 1.45-1.75 GeV in 30 bins,
            re-rolled 20 times, the bin where a 2 sigma alarm fires in each
            roll; then the most alarming roll grown to 3 500 entries
  tail      normal-tail numbers: beyond 1, 3 and 5 sigma, the bell's expected
            grains out of 300 000, 1 in 3.5 million; 1 - 0.95^20
  falling.curve      the expected count at 140 and 3 500 entries as dk-curve
                     parameter sets (f 'exp')
  falling-big.f32    the 3 500 grown entries as a rows source for dk-hist:
  falling-big.json   roll 2's 140 values first, then the 3 360 added (GeV)

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

from common import DATA, emit, f32_bytes, json_bytes

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
    falling["curve"] = curve_sets(e, shares)
    big = big_rows(e, feat, more, big_vals, cb)

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
    out = {"toys.json": json_bytes(dict(flat=flat_out, falling=falling, tail=tail, source=SOURCE)),
           "falling-big.f32": f32_bytes(big_vals), "falling-big.json": json_bytes(big)}
    ent = {"toys.json": dict(talks=[2], shape="object",
                             meaning="simulated toys: flat-bin Poisson re-rolls, the falling spectrum with its 2 sigma alarms "
                                     "and the 3 500-entry growth, its expectation at 140 and 3 500 entries as dk-curve sets "
                                     "(falling.curve), normal-tail numbers and 1 - 0.95^20"),
           "falling-big.f32": dict(talks=[2], shape=[FALL["big"], 1], dtype="float32 LE",
                                   meaning="the falling spectrum grown to 3 500 entries (simulated, GeV): roll 2's 140 values, "
                                           "then the 3 360 added; a dk-hist rows source (values falling-big.f32, key M)"),
           "falling-big.json": dict(talks=[2], shape="object",
                                    meaning="falling-big.f32's header: n, cols ['M'], units, order, the counts a builder bins")}
    summ = dict(level=level, spread=flat_out["rollSpread"], alarms=len(alarms), feat=feat["roll"], fbin=fb,
                z140=feat["maxZ"], z3500=float(zb[fb]), max3500=float(zb.max()))
    return out, ent, summ


def curve_sets(e, shares):
    """The expected count per bin as a dk-curve 'exp' set: density a exp(slope (x - pivot)) / bin entries per GeV.

    For n entries of the density proportional to exp(k (x - lo)/L) on [lo, lo + L], slope = k/L and
    a = n bin (k/L) / (exp(k) - 1), so a is the expected count of a bin of `bin` at x = lo; dk-curve draws
    density x the hist's bin, the expected count per bin at its centre (the bin integral, `expected140`,
    differs from it by sinh(u)/u - 1 at most, u = slope bin / 2)."""
    lo, hi, nb, k = FALL["lo"], FALL["hi"], FALL["bins"], FALL["slope"]
    L, bw = hi - lo, (hi - lo) / nb
    slope = k / L
    xc = 0.5 * (e[:-1] + e[1:])
    sets, checks = [], {}
    for n in (FALL["n"], FALL["big"]):
        a = n * bw * slope / np.expm1(k)
        at_centre = a * np.exp(slope * (xc - lo))
        exp_bin = n * shares
        sets.append({"a": a, "slope": slope, "pivot": lo, "bin": bw, "n": n})
        checks[str(n)] = dict(maxRelDiff=float(np.max(np.abs(at_centre / exp_bin - 1))),
                              total=float(at_centre.sum()))
    return dict(about=("The toy's own expectation as dk-curve parameter sets (f 'exp': a exp(slope (x - pivot)) per bin "
                       "of `bin` GeV), set 0 for 140 entries and set 1 for 3 500. In a deck: dk-curve with src "
                       "'toys.json', sets ['falling.curve.sets.0', 'falling.curve.sets.1'], f 'exp', range [1.45, 1.75], "
                       "pull false. check: the curve at the bin centres against expected140 / expected3500 (the bin "
                       "integrals)."),
                f="exp", params=["a", "slope"], range=[lo, hi], sets=sets, check=checks)


def big_rows(e, feat, more, big_vals, cb):
    """falling-big.f32's header, and a check that a builder binning the float32 values gets the bake's counts."""
    v32 = np.asarray(big_vals, "<f4").astype(np.float64)
    lo, bw, nb = FALL["lo"], round((FALL["hi"] - FALL["lo"]) / FALL["bins"], 12), FALL["bins"]
    js_bin = np.floor((v32 - lo) / bw).astype(int)       # dk-hist: Math.floor((v - lo) / bin), bin 0.01 as a deck writes it
    c3500 = np.bincount(js_bin[(js_bin >= 0) & (js_bin < nb)], minlength=nb)
    c140 = np.bincount(js_bin[:FALL["n"]][(js_bin[:FALL["n"]] >= 0) & (js_bin[:FALL["n"]] < nb)], minlength=nb)
    return dict(about=("The falling spectrum of toys.json grown to 3 500 entries (simulated): row r < 140 is roll "
                       f"{feat['roll']}'s value r (falling.rolls[{feat['roll']}].values, sorted), rows 140-3 499 are "
                       "bigRoll.extraValues (sorted), all in GeV, rounded to 5 decimals then stored as float32. A dk-hist "
                       "reads it as a rows source: values 'falling-big.f32', key 'M', lo 1.45, hi 1.75, bin 0.01, "
                       "ours false; {n: 140} is roll 2, {n: 3500} the grown set when the rows fill in file order. "
                       "counts140 / counts3500 are what such a builder bins (Math.floor((v - lo) / bin))."),
                n=len(big_vals), cols=["M"], units={"M": "GeV (simulated)"},
                layout="little-endian float32, one column, rows in the order above",
                fromRoll=feat["roll"], nRoll=FALL["n"], nAdded=len(more),
                counts140=c140, counts3500=c3500,
                matchesBake={"140": bool(np.array_equal(c140, feat["counts"])), "3500": bool(np.array_equal(c3500, cb))},
                alarmBin=feat["maxBin"], alarmEdges=[float(e[feat["maxBin"]]), float(e[feat["maxBin"] + 1])],
                source=SOURCE)


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
