#!/usr/bin/env python3
"""Bake CERN Open Data record 401 (LHCb D0 -> K-pi+) into the data-kit files.

Input: the course's D0_KPi.csv, the four filled branches of the record's
MasterclassData.root written out by the course's root_to_csv.py (values, row
order and float32 precision unchanged; checked against the ROOT file with
uproot on 2026-10-29: all 91 583 x 4 values equal). The script refuses a CSV
whose sha256 does not start 25c3c972 or that does not have 91 583 rows.

Outputs (data/, each listed in data/manifest.json with its shape and meaning):

  d0.f32 / d0.json   the 91 583 candidates (M, PT, TAU in ps, IPCHI2) and row 1
  d0-hist.json       2 MeV mass histograms (all, IPchi2 < 9, the fit range)
  d0-means.json      the mass mean in shrinking and moved windows
  d0-fit.json        Gaussian + line binned chi2 fit, its logged iterations,
                     pulls, window stability, the PDG gap, the mass and
                     momentum scale shifts, row 1's P(signal)
  d0-chi2.json       the chi2 landscape over (mu, width), the minimiser path,
                     the Delta chi2 = 1 and 4 contours, the 1D slice in mu
  d0-psig.f32        P(signal) per candidate, file order
  d0-z.f32 / d0-significance.json   file-order significance z(k), 5 sigma line
  d0-flat.json       the 14 flat bins 1816-1844 MeV and three spread estimates
  d0-cuts.json       IPchi2 < 9 and TAU counts
  d0-tau.json        decay-time histograms (window / sidebands) and the
                     unbinned lifetime fit with IPchi2 < 9, the plot's subtraction
  d0-select.json     the 120 selections (cut parameters and the fitted peak)

    python3 bake/d0.py                    # read the course CSV, write data/
    python3 bake/d0.py --cached D0_KPi.csv
    python3 bake/d0.py --check            # recompute, compare, exit 1 on a difference

Deterministic: numpy and scipy, fixed seeds, no timestamps (d0-checks.json: two passes).
"""
from __future__ import annotations

import argparse
import itertools
from pathlib import Path

import numpy as np
from scipy.optimize import brentq, curve_fit, minimize_scalar
from scipy.stats import norm

from common import course_file, emit, f32_bytes, json_bytes, sha256

SCRIPT = "d0.py"
N_ROWS = 91_583
CSV_SHA_PREFIX = "25c3c972"

SOURCE = {
    "title": "LHCb event file for real measurement",
    "url": "https://opendata.cern.ch/record/401",
    "doi": "10.7483/OPENDATA.LHCb.E7EJ.JUWR",
    "record": 401,
    "file": "MasterclassData.root",
    "fileBytes": 1_289_541,
    "checksum": "sha256:8694a2ed518472b02994629154de3077fdff4aef1065691fa13ae9f6b23b039b "
                "(adler32:2ebf133a as the portal lists it)",
    "licence": "CC0-1.0 (record page; the portal API record carries no licence field)",
    "retrieved": "2026-10-29",
    "note": ("Read through the course's D0_KPi.csv (sha256 25c3c97299ea844f27308fde20a00ecaa87580868f3c767d7ade5621c1505136, "
             "3 926 142 B), the four filled branches D0_MM, D0_PT, D0_TAU, D0_MINIPCHI2 of DecayTree, 91 583 entries; "
             "checked equal to the ROOT file value for value on 2026-10-29. Rows are D0 candidates: the portal's "
             "53 948 counts events. runNumber, eventNumber and GpsTime are zero in the file, so the data-taking "
             "year cannot be read from it."),
}

# PDG 2026 (pdglive S032): m(D0) = 1864.84 +- 0.04 MeV, tau = 0.4103 +- 0.0010 ps.
M_PDG, M_PDG_ERR = 1864.84, 0.04
M_PDG_COURSE_ERR = 0.05            # the older edition the course quotes
TAU_PDG = 0.4103                   # ps
M_K, M_PI = 493.677, 139.57039     # MeV/c^2 (PDG)

# The course fit (Lecture 10 / 14): 45 bins of 2 MeV on 1820-1910 MeV/c^2.
LO, HI, BW = 1820.0, 1910.0, 2.0
REF = 1865.0                        # pivot of the straight line

# T2's counted background: window and sidebands, b = 3/4 x N_sidebands.
WIN = (1850.0, 1880.0)
SBS = ((1820.0, 1840.0), (1890.0, 1910.0))
ALPHA = (WIN[1] - WIN[0]) / sum(h - l for l, h in SBS)      # 30 / 40 = 0.75

IPCUT = 9.0
SEED = 401


# ======================================================================= read
def read(path: Path):
    digest = sha256(path)
    if not digest.startswith(CSV_SHA_PREFIX):
        raise SystemExit(f"{path}: sha256 {digest[:8]}... is not the course CSV ({CSV_SHA_PREFIX}...)")
    d = np.loadtxt(path, delimiter=",", skiprows=1)
    if d.shape != (N_ROWS, 4):
        raise SystemExit(f"{path}: shape {d.shape}, expected ({N_ROWS}, 4)")
    # The CSV holds float32 values written with str(); round-trip them to float32
    # so every number below uses exactly the file's values.
    d = d.astype(np.float32).astype(np.float64)
    M, PT, TAU_NS, IP = d.T
    missing = TAU_NS == -100
    TAU = np.where(missing, np.nan, TAU_NS * 1000.0)      # ps
    return dict(M=M, PT=PT, TAU=TAU, TAU_NS=TAU_NS, IP=IP, missing=missing,
                csv_sha=digest, csv_bytes=path.stat().st_size)


# ===================================================================== model
def edges(lo=LO, hi=HI, bw=BW):
    return np.arange(lo, hi + 1e-9, bw)


def model(x, p):
    """Counts per 2 MeV bin: Gaussian of n_sig candidates + straight line."""
    n, mu, s, a, b = p
    return n * BW / (s * np.sqrt(2 * np.pi)) * np.exp(-0.5 * ((x - mu) / s) ** 2) + a + b * (x - REF)


def jac(x, p):
    n, mu, s, a, b = p
    G = np.exp(-0.5 * ((x - mu) / s) ** 2)
    k = BW / (s * np.sqrt(2 * np.pi))
    S = n * k * G
    return np.column_stack([k * G, S * (x - mu) / s ** 2, S * ((x - mu) ** 2 / s ** 3 - 1 / s),
                            np.ones_like(x), x - REF])


def course_model(x, n, mu, s, a, b):
    return model(x, (n, mu, s, a, b))


def binned(mass, lo=LO, hi=HI):
    e = edges(lo, hi)
    c, _ = np.histogram(mass, bins=e)
    x = 0.5 * (e[:-1] + e[1:])
    err = np.sqrt(np.maximum(c, 1))
    return x, c, err


def course_fit(mass, lo=LO, hi=HI):
    """The course's peak_fit (figures/src/concepts.py): curve_fit, Neyman errors."""
    x, c, err = binned(mass, lo, hi)
    p0 = [0.23 * len(mass), 1865.0, 8.0, c[:5].mean(), 0.0]
    p, cov = curve_fit(course_model, x, c, p0=p0, sigma=err, absolute_sigma=True)
    chi2 = float((((c - model(x, p)) / err) ** 2).sum())
    return p, np.sqrt(np.diag(cov)), chi2, len(x) - 5, cov


def by_eye(x, c):
    """Start values a person reads off the histogram: the tallest bin, the level
    of the five outer bins on each side, and the full width at half height."""
    level = 0.5 * (c[:5].mean() + c[-5:].mean())
    i = int(np.argmax(c))
    h = c[i] - level
    half = level + h / 2
    # walk out from the peak to the half-height crossings, linear between bins
    l = i
    while c[l] > half:
        l -= 1
    r = i
    while c[r] > half:
        r += 1
    xl = x[l] + (half - c[l]) / (c[l + 1] - c[l]) * (x[l + 1] - x[l])
    xr = x[r - 1] + (half - c[r - 1]) / (c[r] - c[r - 1]) * (x[r] - x[r - 1])
    fwhm = xr - xl
    width = fwhm / (2 * np.sqrt(2 * np.log(2)))
    mu = float(x[i])
    n = h * width * np.sqrt(2 * np.pi) / BW
    return dict(mu=mu, fwhm=float(fwhm), width=float(width), level=float(level), height=float(h),
                p0=[float(n), mu, float(width), float(level), 0.0])


def lm(x, c, err, p0, max_iter=200):
    """Levenberg-Marquardt (Marquardt's diagonal scaling, lambda x10 / /10),
    logging every accepted step. Returns the log and the final covariance."""
    p = np.array(p0, float)
    lam = 1e-3

    def state(p):
        r = (c - model(x, p)) / err
        return r, -jac(x, p) / err[:, None]

    r, J = state(p)
    chi2 = float(r @ r)
    log = [dict(iter=0, p=p.tolist(), chi2=chi2, lam=lam)]
    tries = 0
    while len(log) <= max_iter and tries < 400:
        tries += 1
        A = J.T @ J
        g = J.T @ r
        step = np.linalg.solve(A + lam * np.diag(np.diag(A)), -g)
        pn = p + step
        if pn[2] <= 0:
            lam *= 10
            continue
        rn, Jn = state(pn)
        chi2n = float(rn @ rn)
        if chi2n < chi2:
            drop = chi2 - chi2n
            p, r, J, chi2 = pn, rn, Jn, chi2n
            lam /= 10
            log.append(dict(iter=len(log), p=p.tolist(), chi2=chi2, lam=lam))
            if drop < 1e-10 * chi2:
                break
        else:
            lam *= 10
            if lam > 1e12:
                break
    cov = np.linalg.inv(J.T @ J)
    return log, cov


# ------------------------------------------------------- profile chi2 surface
def profile(x, c, err, mus, sigmas):
    """chi2 minimised over (n_sig, a, b), which enter linearly, on a grid of
    (mu, width). Returns chi2[len(sigmas), len(mus)] and the linear parameters."""
    w = 1 / err
    MU, SG = np.meshgrid(mus, sigmas)                # [ny, nx]
    G = BW / (SG[..., None] * np.sqrt(2 * np.pi)) * np.exp(-0.5 * ((x - MU[..., None]) / SG[..., None]) ** 2)
    X = np.stack([G, np.broadcast_to(np.ones_like(x), G.shape), np.broadcast_to(x - REF, G.shape)], -1)
    Xw = X * w[:, None]
    yw = c * w
    A = np.einsum("...ki,...kj->...ij", Xw, Xw)
    bvec = np.einsum("...ki,k->...i", Xw, yw)
    beta = np.linalg.solve(A, bvec[..., None])[..., 0]
    res = yw - np.einsum("...ki,...i->...k", Xw, beta)
    return (res ** 2).sum(-1), beta


def profile_point(x, c, err, mu, s):
    chi2, _ = profile(x, c, err, np.array([mu]), np.array([s]))
    return float(chi2[0, 0])


# ======================================================================= bake
def bake(src: Path):
    D = read(src)
    M, PT, TAU, IP, missing = D["M"], D["PT"], D["TAU"], D["IP"], D["missing"]
    n = len(M)
    out, ent, summary = {}, {}, {}

    # ---------------------------------------------------------- d0.f32 / json
    arr = np.column_stack([M, PT, TAU, IP]).astype("<f4")
    out["d0.f32"] = f32_bytes(arr)
    row1 = dict(M=float(arr[0, 0]), PT=float(arr[0, 1]), TAU=float(arr[0, 2]), IPCHI2=float(arr[0, 3]))
    src_block = dict(SOURCE)
    out["d0.json"] = json_bytes({
        "n": n, "cols": ["M", "PT", "TAU", "IPCHI2"],
        "units": {"M": "MeV/c^2", "PT": "MeV/c", "TAU": "ps (CSV ns x 1000; NaN where the CSV has -100)",
                  "IPCHI2": "dimensionless (chi2 of the impact parameter to the primary vertex)"},
        "layout": "little-endian float32, row-major, n rows x 4 columns in file order",
        "row1": row1, "missingTau": int(missing.sum()),
        "ranges": {"M": [float(M.min()), float(M.max())], "PT": [float(PT.min()), float(PT.max())],
                   "TAU": [float(np.nanmin(TAU)), float(np.nanmax(TAU))], "IPCHI2": [float(IP.min()), float(IP.max())]},
        "source": dict(src_block, csv={"file": "D0_KPi.csv", "bytes": D["csv_bytes"], "sha256": D["csv_sha"]}),
    })
    ent["d0.f32"] = dict(talks=[1, 2, 3, 4, 5], shape=[n, 4], dtype="float32 LE",
                         meaning="record 401 candidates in file order: M MeV/c2, PT MeV/c, TAU ps (NaN = missing), IPCHI2")
    ent["d0.json"] = dict(talks=[1, 2, 3, 4, 5], shape="object",
                          meaning="d0.f32's header: n, cols, units, row 1, value ranges, source block")

    # --------------------------------------------------------- histograms
    lo_all = 2 * np.floor(M.min() / 2)
    hi_all = 2 * np.ceil(M.max() / 2)
    e_all = np.arange(lo_all, hi_all + 1e-9, 2.0)
    h_all, _ = np.histogram(M, e_all)
    h_ip, _ = np.histogram(M[IP < IPCUT], e_all)
    row1_bin = int(np.searchsorted(e_all, M[0], side="right") - 1)
    x45, c45, err45 = binned(M)
    in_range = int(((M >= LO) & (M < HI)).sum())

    # ------------------------------------------------------------- the fit
    eye = by_eye(x45, c45)
    log, cov = lm(x45, c45, err45, eye["p0"])
    p = np.array(log[-1]["p"])
    perr = np.sqrt(np.diag(cov))
    chi2 = log[-1]["chi2"]
    ndf = len(x45) - 5
    pc, pcerr, chi2c, _, _ = course_fit(M)
    assert np.allclose(p, pc, rtol=1e-6, atol=1e-6), (p, pc)
    assert np.allclose(perr, pcerr, rtol=1e-4), (perr, pcerr)
    pulls = (c45 - model(x45, p)) / err45
    peak_height = p[0] * BW / (p[2] * np.sqrt(2 * np.pi))

    # window stability: the same 45-bin fit with the range moved by 4 MeV
    stab = []
    for d in (-4.0, 4.0):
        q, qe, qc, qn, _ = course_fit(M, LO + d, HI + d)
        stab.append(dict(range=[LO + d, HI + d], mu=q[1], muErr=qe[1], width=q[2], chi2=qc, ndf=qn,
                         shift=q[1] - p[1]))
    # also the 4 MeV narrower and wider ranges (both ends)
    for d in (-4.0, 4.0):
        lo, hi = LO - d, HI + d
        q, qe, qc, qn, _ = course_fit(M, lo, hi)
        stab.append(dict(range=[lo, hi], mu=q[1], muErr=qe[1], width=q[2], chi2=qc, ndf=qn,
                         shift=q[1] - p[1]))

    # the PDG gap in sigma
    gap = M_PDG - p[1]
    gaps = {
        "unrounded": dict(gap=gap, muErr=perr[1], pdgErr=M_PDG_ERR, z=gap / np.hypot(perr[1], M_PDG_ERR)),
        "rounded": dict(gap=0.37, muErr=0.10, pdgErr=M_PDG_ERR, z=0.37 / np.hypot(0.10, M_PDG_ERR)),
        "courseUnrounded": dict(gap=gap, muErr=perr[1], pdgErr=M_PDG_COURSE_ERR,
                                z=gap / np.hypot(perr[1], M_PDG_COURSE_ERR)),
        "courseRounded": dict(gap=0.37, muErr=0.10, pdgErr=M_PDG_COURSE_ERR,
                              z=0.37 / np.hypot(0.10, M_PDG_COURSE_ERR)),
        "statOnly": dict(gap=gap, muErr=perr[1], pdgErr=0.0, z=gap / perr[1]),
    }

    # the mass-scale shift that closes the gap, checked by refitting
    k = M_PDG / p[1]
    qk, qke, *_ = course_fit(M * k)
    # how a momentum scale moves the K-pi mass: (dM/M) / (dp/p)
    lim = (M_PDG ** 2 - M_K ** 2 - M_PI ** 2) / M_PDG ** 2       # daughters far faster than their mass
    pstar = np.sqrt((M_PDG ** 2 - (M_K + M_PI) ** 2) * (M_PDG ** 2 - (M_K - M_PI) ** 2)) / (2 * M_PDG)
    eK, ePi = np.sqrt(M_K ** 2 + pstar ** 2), np.sqrt(M_PI ** 2 + pstar ** 2)
    rest = pstar ** 2 / (eK * ePi)                                  # D0 at rest
    rng = np.random.default_rng(SEED)
    sel = (M > WIN[0]) & (M < WIN[1])
    pts = PT[sel]
    pts = pts[rng.permutation(len(pts))[:20000]]
    eta = rng.uniform(2.0, 5.0, len(pts))                           # LHCb acceptance, simulated
    phi = rng.uniform(0, 2 * np.pi, len(pts))
    ct = rng.uniform(-1, 1, len(pts))
    ph2 = rng.uniform(0, 2 * np.pi, len(pts))
    st = np.sqrt(1 - ct ** 2)
    pK_rest = pstar * np.column_stack([st * np.cos(ph2), st * np.sin(ph2), ct])
    pD = np.column_stack([pts * np.cos(phi), pts * np.sin(phi), pts * np.sinh(eta)])
    ED = np.sqrt(M_PDG ** 2 + (pD ** 2).sum(1))
    beta = pD / ED[:, None]
    gam = ED / M_PDG

    def boost(p3, E):
        bp = (beta * p3).sum(1)
        b2 = (beta ** 2).sum(1)
        coef = (gam - 1) * bp / b2 + gam * E
        return p3 + coef[:, None] * beta, gam * (E + bp)

    pK, EK = boost(pK_rest, np.full(len(pts), eK))
    pP, EP = boost(-pK_rest, np.full(len(pts), ePi))
    dM2 = 2 * ((pK ** 2).sum(1) * EP / EK + (pP ** 2).sum(1) * EK / EP - 2 * (pK * pP).sum(1))
    lab = dM2 / (2 * M_PDG ** 2)
    scale = dict(
        massFactor=k, massShiftPct=(k - 1) * 100, refitMu=qk[1], refitMuErr=qke[1],
        dMoverM_per_dpOverp={"ultraRelativistic": lim, "D0AtRest": rest,
                             "simulatedLab": dict(mean=float(lab.mean()), sd=float(lab.std()),
                                                  n=len(pts), seed=SEED,
                                                  how="PT from window candidates, eta uniform 2-5, isotropic decay (simulated angles)")},
        momentumShiftPct=(k - 1) * 100 / lab.mean(),
        momentumShiftPctUltraRel=(k - 1) * 100 / lim,
    )

    # P(signal) per candidate and row 1
    def parts(m):
        S = p[0] * BW / (p[2] * np.sqrt(2 * np.pi)) * np.exp(-0.5 * ((m - p[1]) / p[2]) ** 2)
        B = np.maximum(p[3] + p[4] * (m - REF), 1e-9)
        return S, B
    S, B = parts(M)
    psig = S / (S + B)
    out["d0-psig.f32"] = f32_bytes(psig)
    ent["d0-psig.f32"] = dict(talks=[3, 4], shape=[n], dtype="float32 LE",
                              meaning="P(signal) = S/(S+B) per candidate from the Gaussian+line fit (d0-fit.json), file order; "
                                      "outside 1820-1910 the fitted line is extrapolated and S is negligible")
    S1, B1 = parts(M[0])
    row1_info = dict(M=row1["M"], offset=M[0] - p[1], offsetWidths=(M[0] - p[1]) / p[2],
                     S=S1, B=B1, psig=S1 / (S1 + B1), bin=[float(e_all[row1_bin]), float(e_all[row1_bin + 1])],
                     ipPass=bool(IP[0] < IPCUT))
    psig_hist = np.histogram(M, e_all, weights=psig)[0]

    out["d0-hist.json"] = json_bytes({
        "about": "2 MeV histograms of the K-pi mass, one count per candidate. counts[i] covers [lo + 2i, lo + 2i + 2).",
        "lo": lo_all, "hi": hi_all, "bin": 2.0, "unit": "MeV/c^2",
        "counts": h_all, "countsIp9": h_ip, "psigSum": np.round(psig_hist, 3),
        "fitRange": {"lo": LO, "hi": HI, "bins": 45, "counts": c45, "n": in_range},
        "row1": {"bin": row1_bin, "edges": row1_info["bin"]},
        "n": n, "source": SOURCE,
    })
    ent["d0-hist.json"] = dict(talks=[1, 2, 3, 5], shape="object",
                               meaning="2 MeV mass histograms over the full range (all, IPchi2 < 9, sum of P(signal)), the 45-bin fit range, row 1's bin")

    # ------------------------------------------------------------ window means
    means = []
    for lo, hi in [(None, None), (1840, 1890), (1850, 1880), (1855, 1875)]:
        m = M if lo is None else M[(M > lo) & (M < hi)]
        means.append(dict(window=None if lo is None else [lo, hi], n=len(m), mean=m.mean(),
                          meanErr=m.std(ddof=1) / np.sqrt(len(m))))
    out["d0-means.json"] = json_bytes({
        "about": "Mean of M over all candidates and inside open windows lo < M < hi (MeV/c^2). "
                 "meanErr is sd/sqrt(n), which ignores that the background shifts the mean.",
        "means": means,
        "centredOnFit": {"about": ("The same means in windows centred on the fitted 1864.47 (d0-fit.json mu, rounded as "
                                   "the deck draws it), half-widths 25 / 15 / 10 / 5 MeV/c^2. nClosed and meanClosed use "
                                   "lo <= M <= hi, as dk-hist's {window} does."),
                         "centre": CENTRE_FIT, "windows": window_means(M, CENTRE_FIT, CENTRE_HALF)},
        "narrow1865": window_means(M, 1865.0, [5.0])[0],
        "pdg": {"m": M_PDG, "err": M_PDG_ERR, "edition": "PDG 2026 (pdglive S032)"},
        "source": SOURCE,
    })
    ent["d0-means.json"] = dict(talks=[3], shape="object",
                                meaning="window means of M (all, 1840-1890, 1850-1880, 1855-1875; centred on the fitted "
                                        "1864.47 with half-widths 25/15/10/5; 1860-1870) and PDG")

    # ------------------------------------------------------------- chi2 grid
    nx = ny = 121
    hx, hy = 0.8, 0.8                                       # MeV: about 8 errors each way
    mus = np.linspace(p[1] - hx, p[1] + hx, nx)
    sgs = np.linspace(p[2] - hy, p[2] + hy, ny)
    # keep the start of the path inside the grid
    mus = np.linspace(min(mus[0], eye["mu"] - 0.1), max(mus[-1], eye["mu"] + 0.1), nx)
    sgs = np.linspace(min(sgs[0], eye["width"] - 0.1), max(sgs[-1], eye["width"] + 0.1), ny)
    grid, _ = profile(x45, c45, err45, mus, sgs)
    cmin = chi2
    assert grid.min() >= cmin - 1e-6, (grid.min(), cmin)
    path = []
    for L in log:
        q = L["p"]
        path.append([q[1], q[2], profile_point(x45, c45, err45, q[1], q[2]) - cmin, L["chi2"] - cmin])

    def contour(level, npts=180):
        pts_ = []
        for th in np.linspace(0, 2 * np.pi, npts, endpoint=False):
            dx, dy = np.cos(th) * perr[1], np.sin(th) * perr[2]
            f = lambda r: profile_point(x45, c45, err45, p[1] + r * dx, p[2] + r * dy) - cmin - level
            r = brentq(f, 0.0, 10.0 * np.sqrt(level) + 5)
            pts_.append([p[1] + r * dx, p[2] + r * dy])
        return pts_

    c1, c4 = contour(1.0), contour(4.0)
    # 1D slice in mu, profiled over the width as well
    smu = np.linspace(p[1] - 0.5, p[1] + 0.5, 101)

    def prof_mu(m):
        r = minimize_scalar(lambda s: profile_point(x45, c45, err45, m, s), bounds=(p[2] - 1.5, p[2] + 1.5),
                            method="bounded", options={"xatol": 1e-7})
        return r.fun
    sl = np.array([prof_mu(m) for m in smu]) - cmin
    lo1 = brentq(lambda m: prof_mu(m) - cmin - 1, p[1] - 0.5, p[1])
    hi1 = brentq(lambda m: prof_mu(m) - cmin - 1, p[1], p[1] + 0.5)
    # the same in the width
    def prof_s(s):
        r = minimize_scalar(lambda m: profile_point(x45, c45, err45, m, s), bounds=(p[1] - 1.5, p[1] + 1.5),
                            method="bounded", options={"xatol": 1e-7})
        return r.fun
    slo = brentq(lambda s: prof_s(s) - cmin - 1, p[2] - 0.6, p[2])
    shi = brentq(lambda s: prof_s(s) - cmin - 1, p[2], p[2] + 0.6)

    out["d0-chi2.json"] = json_bytes({
        "about": ("chi2(mu, width) of the 45-bin Gaussian+line fit, minimised over n_sig and the line at each node "
                  "(profile). z holds chi2 - chi2min, row-major: z[j*nx + i] at x[i] = mu, y[j] = width (MeV/c^2). "
                  "path is the logged Levenberg-Marquardt iterations of d0-fit.json as [mu, width, profile dchi2, "
                  "dchi2 of the iterate itself]; the ball rides the profile surface. contours are closed polylines "
                  "[mu, width] at dchi2 = 1 and 4. slice: chi2 - chi2min against mu with the width also profiled; "
                  "its dchi2 = 1 crossings are the mu error."),
        "x": [float(mus[0]), float(mus[-1]), nx], "y": [float(sgs[0]), float(sgs[-1]), ny],
        "xName": "mu", "yName": "width", "unit": "MeV/c^2",
        "z": np.round(grid - cmin, 4).ravel(), "zmaxGrid": float((grid - cmin).max()),
        "min": [p[1], p[2]], "chi2min": cmin, "ndf": ndf,
        "path": path,
        "contours": {"1": c1, "4": c4},
        "slice": {"x": smu, "z": np.round(sl, 5), "cross": [lo1, hi1], "halfWidth": 0.5 * (hi1 - lo1)},
        "sliceWidth": {"cross": [slo, shi], "halfWidth": 0.5 * (shi - slo)},
        "pdgOnSlice": pdg_on_slice(prof_mu, cmin, smu, sl),
        "source": SOURCE,
    })
    ent["d0-chi2.json"] = dict(talks=[3], shape=f"grid {nx}x{ny} + path + contours + slice",
                               meaning="dk-landscape src: chi2 bowl over (mu, width), minimiser path, dchi2 = 1/4 rings, 1D slice, "
                                       "dchi2 at PDG 1864.84 +- 0.04 on the slice")

    fit = {
        "about": ("Binned chi2 fit of M in 45 bins of 2 MeV on 1820-1910 MeV/c^2, model n_sig x 2 MeV x Gauss(mu, width) "
                  "+ a + b (m - 1865) per bin, errors sqrt(max(count, 1)) (the course's fit, Lecture 10/14). "
                  "Minimised by Levenberg-Marquardt from start values read off the histogram by eye; every accepted "
                  "step is logged (for dk-curve). Same minimum as scipy curve_fit from the course's start values."),
        "model": {"f": "gauss+poly1", "params": ["nSig", "mu", "width", "a", "b"], "pivot": REF, "bin": BW,
                  "perBin": "nSig*bin/(width*sqrt(2pi))*exp(-(m-mu)^2/(2 width^2)) + a + b*(m - pivot)"},
        "range": [LO, HI], "bins": 45, "nInRange": in_range,
        "start": eye,
        "iterations": [dict(iter=L["iter"], p=L["p"], chi2=L["chi2"]) for L in log],
        "params": dict(nSig=p[0], mu=p[1], width=p[2], a=p[3], b=p[4]),
        "errors": dict(nSig=perr[0], mu=perr[1], width=perr[2], a=perr[3], b=perr[4]),
        "cov": cov, "chi2": chi2, "ndf": ndf, "chi2ndf": chi2 / ndf, "pValue": float(1 - __import__("scipy").stats.chi2.cdf(chi2, ndf)),
        "peakHeight": peak_height,
        "bins45": {"x": x45, "counts": c45, "err": err45, "model": model(x45, p), "pull": pulls},
        "stability": stab,
        "pdg": {"m": M_PDG, "err": M_PDG_ERR, "edition": "PDG 2026 (pdglive S032)", "courseErr": M_PDG_COURSE_ERR},
        "gap": gaps,
        "scale": scale,
        "row1": row1_info,
        "source": SOURCE,
    }
    out["d0-fit.json"] = json_bytes(fit)
    ent["d0-fit.json"] = dict(talks=[2, 3, 4, 5], shape="object",
                              meaning="the mass fit: start values, logged iterations (dk-curve params), result, pulls, "
                                      "window stability, PDG gap in sigma, mass/momentum scale shift, row 1 P(signal)")

    # ------------------------------------------------- file-order significance
    on = ((M > WIN[0]) & (M < WIN[1])).astype(np.int64)
    off = np.zeros(n, np.int64)
    for l, h in SBS:
        off |= ((M > l) & (M < h)).astype(np.int64)
    Non, Noff = np.cumsum(on), np.cumsum(off)
    b = ALPHA * Noff
    with np.errstate(divide="ignore", invalid="ignore"):
        z = np.where(b > 0, (Non - b) / np.sqrt(b), np.nan)
    above = np.nan_to_num(z, nan=0.0) > 5
    first = int(np.argmax(above)) + 1
    below = np.where(~above)[0]
    stays = int(below[-1]) + 2 if len(below) else 1
    out["d0-z.f32"] = f32_bytes(z)
    ent["d0-z.f32"] = dict(talks=[2], shape=[n], dtype="float32 LE",
                           meaning="z(k) = (N_on - b)/sqrt(b), b = 3/4 N_sidebands, after the first k candidates in file order (NaN while b = 0)")
    sig = {
        "about": ("Candidates read in file order (not time order). N_on counts 1850 < M < 1880, N_off counts "
                  "1820 < M < 1840 or 1890 < M < 1910 (MeV/c^2); the background expected in the window is "
                  "b = (30/40) N_off, z = (N_on - b)/sqrt(b). k is 1-based."),
        "window": WIN, "sidebands": SBS, "alpha": ALPHA,
        "firstAbove5": dict(k=first, on=int(Non[first - 1]), off=int(Noff[first - 1]), z=z[first - 1]),
        "staysAbove5From": dict(k=stays, on=int(Non[stays - 1]), off=int(Noff[stays - 1]), z=z[stays - 1]),
        "final": dict(k=n, on=int(Non[-1]), off=int(Noff[-1]), b=b[-1], z=z[-1]),
        "at": {str(kk): dict(on=int(Non[kk - 1]), off=int(Noff[kk - 1]), z=z[kk - 1])
               for kk in (100, 1000, 10000, n)},
        "line5sigma": line_5sigma(int(Noff[-1]), int(Non[-1])),
        "source": SOURCE,
    }
    out["d0-significance.json"] = json_bytes(sig)
    ent["d0-significance.json"] = dict(talks=[2], shape="object", meaning="file-order significance: where z first passes 5 and from where it stays above 5; "
                                                                           "the 5 sigma line (b + 5 sqrt b)/15 a bin as a dk-curve set")

    # ------------------------------------------------------------- flat bins
    ef = np.arange(1816.0, 1844.0 + 1e-9, 2.0)
    cf, _ = np.histogram(M, ef)
    xi = np.arange(len(cf))
    sl_, ic_ = np.polyfit(xi, cf, 1)
    resid = cf - (sl_ * xi + ic_)
    flat = {
        "about": ("14 bins of 2 MeV on 1816-1844 MeV/c^2, below the peak. Three estimates of the bin-to-bin spread: "
                  "raw sd (ddof 1); sd of the residuals about a straight line (ddof 2); sd of neighbour differences "
                  "/ sqrt(2) (ddof 1). A 14-bin spread is itself uncertain by about 1/sqrt(2 x 13) = 19 %."),
        "edges": ef, "counts": cf, "mean": cf.mean(), "sqrtMean": np.sqrt(cf.mean()),
        "spread": {"raw": cf.std(ddof=1), "detrended": resid.std(ddof=2),
                   "neighbourDiff": np.diff(cf).std(ddof=1) / np.sqrt(2)},
        "slopePerBin": sl_, "spreadUncertainty": 1 / np.sqrt(2 * (len(cf) - 1)),
        "source": SOURCE,
    }
    out["d0-flat.json"] = json_bytes(flat)
    ent["d0-flat.json"] = dict(talks=[2], shape="object", meaning="the 14 flat bins 1816-1844: counts, mean, sqrt(mean), three spread estimates")

    # ------------------------------------------------------------------- cuts
    tau_pos = np.nan_to_num(TAU, nan=-1.0) > 0
    cuts = {
        "about": "Counts of candidates. TAU missing = the CSV's -100 (NaN in d0.f32).",
        "n": n, "tauMissing": int(missing.sum()), "tauNonPositive": int((~missing & ~tau_pos).sum()),
        "tauPositive": int(tau_pos.sum()),
        "ip9": int((IP < IPCUT).sum()), "ip9TauPositive": int(((IP < IPCUT) & tau_pos).sum()),
        "ip9TauKnown": int(((IP < IPCUT) & ~missing).sum()),
        "ip9AmongMissingTau": int(((IP < IPCUT) & missing).sum()),
        "ipCut": IPCUT, "row1Ip": float(IP[0]),
        "source": SOURCE,
    }
    out["d0-cuts.json"] = json_bytes(cuts)
    ent["d0-cuts.json"] = dict(talks=[3, 4], shape="object", meaning="IPchi2 < 9 counts with and without the TAU-missing rows; TAU > 0 count")

    # ------------------------------------------------------- decay time, fit
    tau_doc = lifetime(M, TAU, IP, tau_pos)
    tau_doc["plotSubtract"] = plot_subtract(M, TAU)
    out["d0-tau.json"] = json_bytes(tau_doc)
    ent["d0-tau.json"] = dict(talks=[3], shape="object",
                              meaning="decay-time histograms in the window and sidebands (0.25 and 0.1 ps bins, with and "
                                      "without IPchi2 < 9), sideband-subtracted counts, the unbinned lifetime fit and its scans; "
                                      "plotSubtract: what dk-hist {subtract} leaves of the first 2 000 (and of all) in its seeded order")

    # ------------------------------------------------------- 120 selections
    out["d0-select.json"] = json_bytes(selections(M, PT, TAU, D["TAU_NS"], IP, missing, arr))
    ent["d0-select.json"] = dict(talks=[5], shape="120 selections",
                                 meaning="6 x 5 x 4 selections as cuts on d0.f32 columns (PT >, IPCHI2 <, TAU >) with the fitted peak of each; "
                                         "the counts of selections 0 and 119; how many peaks lie near selection 0's")

    summary.update(mu=p[1], muErr=perr[1], width=p[2], widthErr=perr[2], chi2=chi2, ndf=ndf, nRange=in_range,
                   iters=len(log) - 1, eye=eye, psig1=row1_info["psig"], first=first, stays=stays,
                   gap=gaps["unrounded"]["z"], scale=scale["massShiftPct"], mom=scale["momentumShiftPct"])
    summary["fitStart"] = fit_start(fit, x45, c45, err45)
    return out, ent, summary


# ----------------------------------------------------------------- lifetime
def trunc_exp_nll(tau, t, w, t0, t1):
    """Weighted -log L of an exponential truncated to [t0, t1]."""
    normc = tau * (np.exp(-t0 / tau) - np.exp(-t1 / tau))
    return float(np.sum(w * (t / tau + np.log(normc))))


def wfit(t, w, t0, t1):
    sel = (t >= t0) & (t < t1)
    t, w = t[sel], w[sel]
    r = minimize_scalar(lambda x: trunc_exp_nll(x, t, w, t0, t1), bounds=(0.05, 5.0), method="bounded",
                        options={"xatol": 1e-9})
    tau = r.x
    # sandwich error for a weighted likelihood: V = sum(w^2 s^2) / H^2
    h = 1e-5
    def logf(x):
        return -(t / x) - np.log(x * (np.exp(-t0 / x) - np.exp(-t1 / x)))
    s = (logf(tau + h) - logf(tau - h)) / (2 * h)
    d2 = (logf(tau + h) - 2 * logf(tau) + logf(tau - h)) / h ** 2
    H = -np.sum(w * d2)
    var = np.sum(w ** 2 * s ** 2) / H ** 2
    return dict(tau=tau, err=float(np.sqrt(var)), errNaive=float(1 / np.sqrt(H)), nOn=int((w > 0).sum()),
                nOff=int((w < 0).sum()), nNet=float(w.sum()))


def lifetime(M, TAU, IP, tau_pos):
    on = (M > WIN[0]) & (M < WIN[1])
    off = np.zeros_like(on)
    for l, h in SBS:
        off |= (M > l) & (M < h)
    t = np.nan_to_num(TAU, nan=-1.0)
    res = {
        "about": ("Decay time t in ps of candidates with TAU > 0. Window 1850 < M < 1880, sidebands 1820-1840 and "
                  "1890-1910 MeV/c^2, background in the window = 0.75 x sidebands (the mass background is close to "
                  "linear, so the two sidebands centred on the window average to it). hist*: counts per bin; "
                  "net = on - 0.75 off."),
        "window": WIN, "sidebands": SBS, "alpha": ALPHA, "ipCut": IPCUT, "pdgTau": TAU_PDG, "pdgCTauMicron": 122.9,
    }
    hists = {}
    for name, bw, hi in (("h025", 0.25, 5.0), ("h010", 0.1, 5.0)):
        e = np.arange(0.0, hi + 1e-9, bw)
        for cut_name, cut in (("all", tau_pos), ("ip9", tau_pos & (IP < IPCUT))):
            a = np.histogram(t[cut & on], e)[0]
            b = np.histogram(t[cut & off], e)[0]
            hists[f"{name}_{cut_name}"] = dict(edges=e, on=a, off=b, net=a - ALPHA * b,
                                               err=np.sqrt(a + ALPHA ** 2 * b))
    res["hist"] = hists
    res["counts"] = {c: dict(on=int((cut & on).sum()), off=int((cut & off).sum()))
                     for c, cut in (("all", tau_pos), ("ip9", tau_pos & (IP < IPCUT)))}

    # unbinned weighted fit: +1 for window candidates, -0.75 for sideband candidates
    def fit_set(cut, t0, t1):
        sel = cut & (on | off)
        w = np.where(on[sel], 1.0, -ALPHA)
        return wfit(t[sel], w, t0, t1)

    T1 = 5.0
    scan_t0 = [0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 1.0]
    scan = {"ip9": [], "all": []}
    for t0 in scan_t0:
        scan["ip9"].append(dict(t0=t0, t1=T1, **fit_set(tau_pos & (IP < IPCUT), t0, T1)))
        scan["all"].append(dict(t0=t0, t1=T1, **fit_set(tau_pos, t0, T1)))
    ipscan = []
    for ipc in (2.0, 4.0, 9.0, 16.0, 25.0):
        ipscan.append(dict(ipCut=ipc, **fit_set(tau_pos & (IP < ipc), 0.5, T1)))
    t1scan = [dict(t1=t1, **fit_set(tau_pos & (IP < IPCUT), 0.5, t1)) for t1 in (2.5, 3.5, 5.0, 10.0)]
    T0 = 0.5
    main = fit_set(tau_pos & (IP < IPCUT), T0, T1)
    # binned cross-check on the net 0.1 ps histogram over the same range
    hb = hists["h010_ip9"]
    xc = 0.5 * (hb["edges"][:-1] + hb["edges"][1:])
    m = (xc > T0) & (xc < T1) & (hb["err"] > 0)
    f = lambda x, N, tau: N * np.exp(-x / tau)
    pb, cb = curve_fit(f, xc[m], hb["net"][m], p0=[hb["net"][m][0] * np.exp(T0 / 0.41), 0.41],
                       sigma=hb["err"][m], absolute_sigma=True)
    chi2b = float((((hb["net"][m] - f(xc[m], *pb)) / hb["err"][m]) ** 2).sum())
    res["fit"] = dict(
        model=("exp(-t/tau) / (tau (exp(-t0/tau) - exp(-t1/tau))) on t0 <= t < t1, maximised as a weighted "
               "likelihood with w = +1 (window) and -0.75 (sidebands): sideband subtraction done candidate by candidate. "
               "Error from the sandwich formula sum(w^2 s^2)/H^2 (errNaive = 1/sqrt(H) ignores the subtraction)."),
        acceptance=("Not modelled. The file's decay times start at 0.150 ps (a pre-selection cut) and the efficiency "
                    "rises over the first few tenths of a ps, so the fit starts at t0 = 0.5 ps where the scan in t0 "
                    "has flattened; the truncated exponential is unaffected by a cut at t0 because an exponential is "
                    "memoryless. The upper end t1 = 5 ps (12 lifetimes) only removes the long tail, where D0s from "
                    "B decays that survive IPchi2 < 9 dominate."),
        t0=T0, t1=T1, ipCut=IPCUT, **main,
        binnedCheck=dict(tau=pb[1], err=float(np.sqrt(cb[1, 1])), chi2=chi2b, ndf=int(m.sum()) - 2),
        caveat=("Statistical error only. D0s from B decays with IPchi2 < 9 remain and pull tau up; the t0 and "
                "IPchi2 scans below show the size of these effects. This is a teaching fit, not LHCb's measurement."),
    )
    res["scanT0"] = scan
    res["scanIp"] = ipscan
    res["scanT1"] = t1scan
    res["source"] = SOURCE
    return res


# --------------------------------------------------------------- selections
PT_CUTS = [0, 2800, 3000, 3200, 3500, 4000]           # keep PT above (MeV/c)
IP_CUTS = [np.inf, 50, 20, 10, 5]                      # keep IPCHI2 below
TAU_CUTS_NS = [-np.inf, 0.0002, 0.0003, 0.0005]       # keep TAU above (ns, as the course)


def selections(M, PT, TAU, TAU_NS, IP, missing, arr):
    keep_rows = ~missing
    rows = []
    f32 = arr.astype(np.float64)
    for i, (cpt, cip, ctau) in enumerate(itertools.product(PT_CUTS, IP_CUTS, TAU_CUTS_NS)):
        keep = keep_rows & (PT > cpt) & (IP < cip) & (TAU_NS > ctau)
        ctau_ps = ctau * 1000.0 if np.isfinite(ctau) else -np.inf
        # the same selection on d0.f32's columns (TAU in ps), as a builder applies it
        k2 = (~np.isnan(f32[:, 2])) & (f32[:, 1] > cpt) & (f32[:, 3] < cip) & (f32[:, 2] > ctau_ps)
        assert np.array_equal(keep, k2), f"selection {i}: f32 columns disagree with the CSV"
        p, e, chi2, ndf, _ = course_fit(M[keep])
        rows.append(dict(i=i, pt=cpt, ip=None if not np.isfinite(cip) else cip,
                         tau=None if not np.isfinite(ctau_ps) else ctau_ps, n=int(keep.sum()),
                         mu=p[1], muErr=e[1], width=p[2], chi2=chi2, ndf=ndf,
                         zPdg=abs(p[1] - M_PDG) / np.hypot(e[1], M_PDG_ERR)))
    mus = np.array([r["mu"] for r in rows])
    order = np.argsort(mus, kind="stable")
    plain = next(r for r in rows if r["pt"] == 0 and r["ip"] is None and r["tau"] is None)
    return {
        "about": ("6 x 5 x 4 = 120 selections of candidates (the course's Lecture 14): keep PT > pt (MeV/c), "
                  "IPCHI2 < ip (null = no cut), TAU > tau (ps; null = no cut), rows with missing TAU always dropped. "
                  "Each is fitted with the course's 45-bin Gaussian+line fit. A builder applies selection i to "
                  "d0.f32 as: !isNaN(TAU) && PT > pt && IPCHI2 < (ip ?? Infinity) && TAU > (tau ?? -Infinity). "
                  "zPdg uses PDG 2026 (+-0.04)."),
        "cuts": {"pt": PT_CUTS, "ip": [None if not np.isfinite(c) else c for c in IP_CUTS],
                 "tau": [None if not np.isfinite(c) else c * 1000.0 for c in TAU_CUTS_NS]},
        "order": "i = 20 x iPT + 4 x iIP + iTAU (itertools.product order)",
        "selections": rows,
        "sortedByMu": order,
        "min": rows[int(order[0])], "max": rows[int(order[-1])], "noCuts": plain,
        "spread": float(mus.max() - mus.min()),
        "counts": {"0": rows[0]["n"], "119": rows[119]["n"]},
        "nearSel0": near_sel0(rows),
        "source": SOURCE,
    }


# =========================================================== deck numbers
# Added 2026-10-29 (lane kit-bake): numbers the T3, T2 and T5 outlines cite. They live
# here, below lm(), so that d0.py lines 87-208 (read to lm, the stretch T5's code stage
# draws) keep their line numbers.
CENTRE_FIT = 1864.47                # the fitted mu as the deck draws it (d0-fit.json 1864.4724)
CENTRE_HALF = [25.0, 15.0, 10.0, 5.0]
PDG_BAND = [M_PDG - M_PDG_ERR, M_PDG, M_PDG + M_PDG_ERR]
# lab 3's decay-time plot (talks/2026_00_00_DataLab3/public/data/space.json, object "tau")
TAU_PLOT = dict(key="TAU", lo=0.0, hi=5.0, bin=0.25, grains=70_000, budget=300_000, seed=SEED, ours=0,
                win=WIN, sb=SBS, n=2000)


def window_means(M, centre, halves):
    rows = []
    for h in halves:
        lo, hi = centre - h, centre + h
        m = M[(M > lo) & (M < hi)]
        mc = M[(M >= lo) & (M <= hi)]
        rows.append(dict(halfWidth=h, window=[lo, hi], n=len(m), mean=m.mean(), meanErr=m.std(ddof=1) / np.sqrt(len(m)),
                         nClosed=len(mc), meanClosed=mc.mean()))
    return rows


def pdg_on_slice(prof_mu, cmin, smu, sl):
    """Delta chi2 of the profiled slice (width, n_sig and the line refitted) at PDG and its +-0.04 edges."""
    d = [float(prof_mu(m) - cmin) for m in PDG_BAND]
    return dict(about=("chi2 - chi2min on the 1D slice in mu (width profiled too) at PDG 2026's 1864.84 and its edges "
                       "1864.80 / 1864.88, each minimised afresh (not read off the slice grid). sqrt(dchi2) is how many "
                       "of our statistical errors each value lies from the fitted mu. interp: linear on the slice grid."),
                m=PDG_BAND, dchi2=d, nErrors=[float(np.sqrt(v)) for v in d],
                interp=[float(np.interp(m, smu, sl)) for m in PDG_BAND])


def line_5sigma(noff, non):
    """The level a bin of the window would need for the window to sit exactly 5 sigma over its counted background."""
    b = ALPHA * noff
    nb = int(round((WIN[1] - WIN[0]) / BW))
    total = b + 5 * np.sqrt(b)
    level = total / nb
    return dict(about=("T2's close: the counted background in the window 1850-1880 is b = 0.75 x N_off (all 91 583 "
                       "candidates); a window holding b + 5 sqrt(b) would be exactly 5 sigma, (N_on - b)/sqrt(b) = 5. "
                       "Spread evenly over its 15 bins of 2 MeV that is `level` a bin. set is a dk-curve parameter set: "
                       "f 'flat', a = level per bin of 2 MeV, drawn over range."),
                nOff=noff, alpha=ALPHA, b=b, sqrtB=np.sqrt(b), total=total, bins=nb, level=level,
                zCheck=(total - b) / np.sqrt(b), nOn=non, onPerBin=non / nb,
                f="flat", range=list(WIN), set={"a": level, "bin": BW})


def plot_subtract(M32, T32, cfg=TAU_PLOT):
    """What dk-hist {subtract} leaves on lab 3's decay-time plot, in the plot's own seeded order.

    A port of hist.js setupGrains and layout (rows mode, split, subtract): the grains are the rows with a finite
    TAU inside the window or a sideband (closed intervals, as cutTest 'in'); the fill order is the reverse of
    rng.js order(91 583, 401, row 0); {n: k} shows the first k; {subtract} drops every sideband grain, and in each
    bin pairs the sideband grains whose pick (the third draw per grain of mulberry32(401 x 31 + 7)) is below
    30/40 with window grains at the same share of the way up the column. The count readout is the counted
    window grains, including the few whose decay time is off the drawn 0-5 ps."""
    from common import mulberry32, series_order
    n_all = len(M32)
    inw = (M32 >= cfg["win"][0]) & (M32 <= cfg["win"][1])
    insb = np.zeros(n_all, bool)
    for l, h in cfg["sb"]:
        insb |= (M32 >= l) & (M32 <= h)
    keep = np.where(np.isfinite(T32) & (inw | insb))[0]
    budget = max(1000, min(cfg["budget"], cfg["grains"]))
    unit = max(1, int(np.ceil(len(keep) / budget)))
    rank = series_order(n_all, cfg["seed"], cfg["ours"])
    rows = keep if unit == 1 else keep[(rank[keep] % unit == 0) | (keep == cfg["ours"])]
    N = len(rows)
    fill = np.argsort(-rank[rows], kind="stable")            # grain indices, first to land first
    rnd = mulberry32(cfg["seed"] * 31 + 7)
    pick = np.empty(N)
    for i in range(N):
        rnd(); rnd(); pick[i] = rnd()                         # jx, jz, pick
    nb = int(round((cfg["hi"] - cfg["lo"]) / cfg["bin"]))
    b_all = np.floor((T32[rows] - cfg["lo"]) / cfg["bin"]).astype(np.int64)
    w_all = inw[rows]
    scale = (cfg["win"][1] - cfg["win"][0]) / sum(h - l for l, h in cfg["sb"])

    def state(n_show):
        shown = fill[:min(N, int(np.ceil(n_show / unit)))]
        inb = (b_all[shown] >= 0) & (b_all[shown] < nb)
        slot = np.zeros(N, np.int64)
        tmp = np.zeros(nb, np.int64)
        for i in shown:                                       # pre-subtraction slots, in fill order
            if 0 <= b_all[i] < nb:
                slot[i] = tmp[b_all[i]]
                tmp[b_all[i]] += 1
        counted = np.zeros(N, bool)
        counted[shown] = True
        paired = np.zeros(N, bool)
        wins = [[] for _ in range(nb)]
        sbs = [[] for _ in range(nb)]
        for i in np.sort(shown):                              # hist.js walks the grains in index order
            b = b_all[i]
            if w_all[i]:
                if 0 <= b < nb:
                    wins[b].append(i)
            else:
                counted[i] = False
                if 0 <= b < nb and pick[i] < scale:
                    sbs[b].append(i)
        npairs = 0
        for b in range(nb):
            w = sorted(wins[b], key=lambda q: slot[q])
            sb = sorted(sbs[b], key=lambda q: slot[q])
            k_ = min(len(sb), len(w))
            for k in range(k_):
                x = (k + 0.5) * len(w) / k_ - 0.5
                i = w[min(len(w) - 1, int(np.floor(x + 0.5)))]   # JS Math.round
                if paired[i]:
                    continue
                paired[i] = True
                counted[i] = False
                npairs += 1
        nw = int(w_all[shown].sum())
        left = int(counted.sum())
        drawn = int((counted & (b_all >= 0) & (b_all < nb)).sum())
        return dict(nShown=len(shown) * unit, nWindow=nw, nSidebands=len(shown) - nw,
                    nWindowDrawn=int((w_all[shown] & inb).sum()), nSidebandsDrawn=int((~w_all[shown] & inb).sum()),
                    nSidebandsPicked=int(sum(len(x) for x in sbs)), pairs=npairs, left=left * unit, leftDrawn=drawn * unit,
                    countedBackground=float(scale * (len(shown) - nw)),
                    leftCounted=float(nw - scale * (len(shown) - nw)))

    return dict(about=("Lab 3's decay-time plot (`plot`) as dk-hist draws it: its grains are the rows with a finite TAU in "
                       "the window or a sideband, filled in the reverse of the series order (rng.js order(91 583, 401, "
                       "row 0)). {subtract} drops every sideband grain and pairs, bin by bin, the sideband grains whose "
                       "pick is below 30/40 with window grains. nShown, nWindow, nSidebands: the grains shown before it; "
                       "pairs: the window grains taken; left: the count readout after it (window grains still counted, "
                       "including those off the drawn 0-5 ps); leftDrawn: those standing in the columns; leftCounted: "
                       "nWindow - 0.75 nSidebands, the statistical subtraction the pairing stands for."),
                plot={k: (list(v) if isinstance(v, tuple) else v) for k, v in cfg.items()},
                grains=N, unit=unit, keep=len(keep), scale=scale,
                first2000=state(cfg["n"]), all=state(N * unit))


def near_sel0(rows):
    mu0 = rows[0]["mu"]
    d = np.abs(np.array([r["mu"] for r in rows]) - mu0)
    out = dict(about=("How many of the 120 fitted peaks lie within +-h of selection 0's (no cuts, TAU-missing rows "
                      "dropped); selection 0 itself is counted. h = 0.10 (the rounded error), 0.0965 (the series fit's "
                      "error, d0-fit.json), and selection 0's own muErr."),
               mu0=mu0, muErr0=rows[0]["muErr"], of=len(rows))
    out["within"] = {"0.10": int((d <= 0.10).sum()), "0.0965": int((d <= 0.0965).sum()),
                     "muErr0": int((d <= rows[0]["muErr"]).sum())}
    return out


def fit_start(fit, x45, c45, err45):
    """chi2 at the start values, as logged and as dk-curve's readout computes it (density at the bin centre x bin)."""
    p0 = fit["iterations"][0]["p"]
    nS, mu, w, a, b = p0
    dens = nS * np.exp(-0.5 * ((x45 - mu) / w) ** 2) / (w * np.sqrt(2 * np.pi)) + (a + b * (x45 - REF)) / BW
    c2 = float((((c45 - dens * BW) / err45) ** 2).sum())
    logged = float(fit["iterations"][0]["chi2"])
    assert abs(c2 - logged) < 1e-6 * logged, (c2, logged)
    return dict(about="chi2 of the 45-bin fit at the start values read off the histogram (d0-fit.json iterations[0]); "
                      "curveReadout recomputes it as dk-curve's live readout does (sum of pulls squared, model at the bin "
                      "centre x 2 MeV).", p=p0, chi2=logged, curveReadout=c2, chi2End=float(fit["chi2"]))


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cached", help="the course's D0_KPi.csv (default: the course checkout next to outreach_talks)")
    ap.add_argument("--check", action="store_true", help="recompute and compare with data/, exit 1 on a difference")
    a = ap.parse_args(argv)
    src = Path(a.cached) if a.cached else course_file("D0_KPi.csv")
    out, ent, s = bake(src)
    # a second pass from scratch (the CSV read again, every fit redone): the outputs must be the same bytes
    out2, _, _ = bake(src)
    differ = sorted(k for k in out if out[k] != out2[k])
    if differ:
        raise SystemExit(f"two passes differ: {differ}")
    import hashlib
    digests = [hashlib.sha256(o["d0-fit.json"]).hexdigest() for o in (out, out2)]
    out["d0-checks.json"] = json_bytes({
        "about": ("Checks on the bake itself. fitStart: chi2 at the fit's start values. rerun: d0.py runs bake() twice "
                  "from scratch in one process and refuses to write unless every output is byte-identical; sha256 is "
                  "d0-fit.json's digest from each pass. `d0.py --check`, run later as its own process, recomputes it "
                  "and fails on any difference. The digest holds for this file, code and package versions "
                  "(numpy, scipy, Python): notes/bake.md names the versions it was made with."),
        "fitStart": s["fitStart"],
        "rerun": {"file": "d0-fit.json", "bytes": len(out["d0-fit.json"]), "passes": 2, "sha256": digests,
                  "same": digests[0] == digests[1], "short": digests[0][:8]},
        "source": SOURCE,
    })
    ent["d0-checks.json"] = dict(talks=[3, 5], shape="object",
                                 meaning="chi2 at the fit's start values; sha256 of d0-fit.json from two passes of the bake")
    print(f"mu {s['mu']:.4f} +- {s['muErr']:.4f}, width {s['width']:.4f} +- {s['widthErr']:.4f}, "
          f"chi2 {s['chi2']:.2f}/{s['ndf']}, {s['nRange']} in range, {s['iters']} iterations from "
          f"FWHM {s['eye']['fwhm']:.2f}; P(sig) row 1 {s['psig1']:.4f}; z>5 first {s['first']}, stays {s['stays']}; "
          f"gap {s['gap']:.3f} sigma; mass shift {s['scale']:.4f} %, momentum {s['mom']:.4f} %")
    return emit(SCRIPT, out, ent, a.check)


if __name__ == "__main__":
    raise SystemExit(main())
