#!/usr/bin/env python3
"""The 2019 pentaquark peaks, fitted (the owner, 10 Nov: "we want to have a peak from the fit").

Data: HEPData ins1728691 (LHCb, PRL 122 (2019) 222001), Table 3: the cos(theta_Pc)-weighted m(J/psi p)
distribution of Lambda_b -> J/psi p K- candidates (the paper's Fig. 6 / supplementary CDS3c), 2 MeV bins.
Model, as the paper's: three relativistic Breit-Wigner amplitudes added incoherently (P-wave-free, a mass-
dependent width left out: a constant width, a fair picture of narrow states) over a polynomial background
(Chebyshev, order 6), fitted in 4250-4600 MeV by least squares with the table's errors.

    python3 -I bake/fit_2019.py TABLE3.csv takes/data/jpsip-2019-fit.json [check.png]

The JSON: the data (centre, value, error) in the window, the fit sampled every 0.5 MeV (total, background,
each peak), the fitted masses and widths with their errors, and the paper's values beside them.
"""
import csv, json, sys
import numpy as np
from scipy.optimize import curve_fit

LO, HI = 4250.0, 4600.0
PAPER = [('Pc(4312)+', 4311.9, 0.7, 9.8, 2.7), ('Pc(4440)+', 4440.3, 1.3, 20.6, 4.9), ('Pc(4457)+', 4457.3, 0.6, 6.4, 2.0)]


def read(path):
    rows = []
    with open(path) as f:
        for r in csv.reader(l for l in f if not l.startswith('#')):
            if len(r) < 5: continue
            try: rows.append([float(x) for x in r[:5]])
            except ValueError: continue
    a = np.array(rows)
    return a[:, 0], a[:, 3], np.abs(a[:, 4])


def bw(m, M, G):
    # relativistic Breit-Wigner intensity, peak-normalised
    return (M * G) ** 2 / ((m * m - M * M) ** 2 + (M * G) ** 2)


def model(m, *p):
    x = (m - (LO + HI) / 2) / ((HI - LO) / 2)
    bg = np.polynomial.chebyshev.chebval(x, p[9:])
    return bg + sum(p[3 * k] * bw(m, p[3 * k + 1], p[3 * k + 2]) for k in range(3))


def main():
    m, y, e = read(sys.argv[1])
    sel = (m > LO) & (m < HI)
    m, y, e = m[sel], y[sel], np.where(e[sel] > 0, e[sel], 1.0)
    p0 = []
    for _, M, _, G, _ in PAPER: p0 += [250.0, M, G]
    p0 += [y.mean(), 50.0, -50.0, 0.0, 0.0, 0.0, 0.0]
    lo = [0, 4295, 2, 0, 4425, 4, 0, 4450, 1] + [-np.inf] * 7
    hi = [5000, 4330, 40, 5000, 4452, 60, 5000, 4470, 30] + [np.inf] * 7
    p, cov = curve_fit(model, m, y, p0=p0, sigma=e, absolute_sigma=True, bounds=(lo, hi), maxfev=40000)
    err = np.sqrt(np.diag(cov))
    chi2 = float(np.sum(((y - model(m, *p)) / e) ** 2)); ndf = len(m) - len(p)
    xs = np.arange(LO, HI + 0.01, 0.5)
    bg = model(xs, *([0] * 9 + list(p[9:])))
    peaks = [p[3 * k] * bw(xs, p[3 * k + 1], p[3 * k + 2]) for k in range(3)]
    out = {
        'source': 'LHCb, Phys. Rev. Lett. 122, 222001 (2019); HEPData ins1728691, Table 3 (cos θ_Pc-weighted), '
                  'doi:10.17182/hepdata.89271.v1/t3. Fit here: three relativistic Breit-Wigners over a Chebyshev '
                  'polynomial (order 6), 4250-4600 MeV (bake/fit_2019.py)',
        'unit': 'MeV', 'lo': LO, 'hi': HI, 'bin': 2.0,
        'data': [[round(a, 1), round(b, 2), round(c, 2)] for a, b, c in zip(m, y, e)],
        'fit': {'x0': LO, 'dx': 0.5, 'total': [round(v, 2) for v in model(xs, *p)], 'background': [round(v, 2) for v in bg],
                'peaks': [[round(v, 2) for v in pk] for pk in peaks]},
        'states': [{'name': n, 'mass': round(float(p[3 * k + 1]), 1), 'mass_err': round(float(err[3 * k + 1]), 1),
                    'width': round(float(p[3 * k + 2]), 1), 'width_err': round(float(err[3 * k + 2]), 1),
                    'paper_mass': M, 'paper_width': G} for k, (n, M, _, G, _) in enumerate(PAPER)],
        'chi2_ndf': [round(chi2, 1), ndf],
    }
    json.dump(out, open(sys.argv[2], 'w'), separators=(',', ':'))
    for s in out['states']: print(s)
    print('chi2/ndf', chi2, ndf)
    if len(sys.argv) > 3:
        import matplotlib; matplotlib.use('Agg'); import matplotlib.pyplot as plt
        plt.figure(figsize=(10, 5)); plt.errorbar(m, y, e, fmt='.', color='k', ms=3)
        plt.plot(xs, model(xs, *p), 'r'); plt.plot(xs, bg, 'b--')
        for pk in peaks: plt.plot(xs, bg + pk, ':')
        plt.savefig(sys.argv[3], dpi=90)


main()
