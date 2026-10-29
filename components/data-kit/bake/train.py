#!/usr/bin/env python3
"""Bake the classifiers of Talk 4 (numpy only) into data/train-*.json.

  train-perceptron.json  the course's 200 points (Lecture 11, figures/src/perceptron.py:
                         default_rng(11), 100 around (0,0) and 100 around (2,2), unit
                         spread; simulated), the sigmoid neuron trained by gradient
                         descent (eta 0.5, 1000 epochs) with every epoch's weights,
                         the best threshold on x1 alone, the loss grid over (w1, w2)
                         at the fitted b with the path, the loss with b profiled at
                         each (w1, w2) (lossProfile) and the train/test split
  train-ring.json        the course's 600-point ring set (ml_two_class.py, seed 16;
                         simulated): the line's accuracy, the 2-4-1 network
                         (Lecture 16, figures/src/ml.py) with test accuracy, AUC
                         and a score grid for the bent boundary
  train-d0.json          the record 401 classifier (ml.py `leakage`): label = mass in
                         1845-1885 MeV/c^2, inputs log PT, log TAU, log IPCHI2;
                         majority / neuron / 2-4-1 network test accuracies, and
                         with the mass added; score grids over (log10 IPCHI2, TAU)
  d0-score.f32           the honest network's score per candidate (NaN for TAU <= 0)
  train-rare.json        the rare-signal arithmetic of Lecture 16

    python3 bake/train.py [--cached D0_KPi.csv]
    python3 bake/train.py --check

The two course data sets are regenerated from their seeds and checked against
the course's own figures (the ring set byte for byte against ml_two_class.csv).
Deterministic: full-batch gradient descent, fixed seeds, no timestamps.
"""
from __future__ import annotations

import argparse
import hashlib
from pathlib import Path

import numpy as np

import json

from common import DATA, course_file, emit, f32_bytes, json_bytes, sha256

SCRIPT = "train.py"

SRC_COURSE = {
    "title": "CERN lessons on data analysis, Lectures 11 and 16 (course data sets, simulated)",
    "url": "https://github.com/MindaugasSarpis/CERN_lessons_on_data_analysis",
    "doi": "", "record": None, "file": "figures/src/perceptron.py; lectures/workbook/docs/data/ml_two_class.py",
    "fileBytes": None, "checksum": None, "licence": "course material (generated data)", "retrieved": "2026-10-29",
    "note": "Regenerated here from the course's seeds; every number is simulated.",
}
SRC_401 = {
    "title": "LHCb event file for real measurement", "url": "https://opendata.cern.ch/record/401",
    "doi": "10.7483/OPENDATA.LHCb.E7EJ.JUWR", "record": 401, "file": "MasterclassData.root (via the course's D0_KPi.csv)",
    "fileBytes": 1_289_541, "checksum": "sha256:8694a2ed518472b02994629154de3077fdff4aef1065691fa13ae9f6b23b039b",
    "licence": "CC0-1.0 (record page)", "retrieved": "2026-10-29",
    "note": "Classifier recomputed with the course's Lecture 16 recipe (figures/src/ml.py, leakage).",
}
RING_SHA = "cc54cbfe7840e5dfa4de65de46ab1763c30d93809bf30e0d0e222f5a9d5ec188"


def sig(z):
    return 1 / (1 + np.exp(-z))


def ce(y, p):
    p = np.clip(p, 1e-12, 1 - 1e-12)
    return float(-np.mean(y * np.log(p) + (1 - y) * np.log(1 - p)))


# ============================================================ the perceptron
def course_points():
    rng = np.random.default_rng(11)
    X = np.vstack([rng.normal((0, 0), 1, (100, 2)), rng.normal((2, 2), 1, (100, 2))])
    return X, np.repeat([0, 1], 100)


def train_logistic(X, y, eta, epochs, w=None, b=0.0):
    """perceptron.py `_train`: entry k is the state after k updates."""
    w = np.zeros(X.shape[1]) if w is None else np.array(w, float)
    hist = []
    for _ in range(epochs + 1):
        z = X @ w + b
        p = sig(z)
        hist.append((float(np.mean(np.logaddexp(0, z) - y * z)), float(np.mean((p > 0.5) == y)), w.copy(), float(b)))
        w = w - eta * X.T @ (p - y) / len(y)
        b = b - eta * np.mean(p - y)
    return hist


def perceptron():
    X, y = course_points()
    h = train_logistic(X, y, 0.5, 1000)
    ts = np.sort(X[:, 0])
    right = np.array([int(np.sum((X[:, 0] > t) == y)) for t in ts])
    ib = int(np.argmax(right))
    loss, acc, w, b = h[-1]
    right_line = int(np.sum((X @ w + b > 0) == y))
    # loss grid over (w1, w2) at the fitted b, with the path of every epoch
    g1 = np.linspace(-0.5, 3.5, 101)
    g2 = np.linspace(-0.5, 3.5, 101)
    W1, W2 = np.meshgrid(g1, g2)
    Z = X[:, 0][None, None, :] * W1[..., None] + X[:, 1][None, None, :] * W2[..., None] + b
    L = np.mean(np.logaddexp(0, Z) - y * Z, axis=-1)
    path_loss = []
    for (_, _, wk, _) in h:
        z = X @ wk + b
        path_loss.append(float(np.mean(np.logaddexp(0, z) - y * z)))
    # train / test split (perceptron.py `_split`)
    perm = np.random.default_rng(11).permutation(200)
    tr, te = perm[:150], perm[150:]
    m, s = X[tr].mean(0), X[tr].std(0)
    _, _, wz, bz = train_logistic((X[tr] - m) / s, y[tr], 0.5, 1000)[-1]
    ws = wz / s
    bs = bz - np.sum(wz * m / s)
    acc_tr = float(np.mean((X[tr] @ ws + bs > 0) == y[tr]))
    acc_te = float(np.mean((X[te] @ ws + bs > 0) == y[te]))
    accs = []
    for seed in range(20):
        pm = np.random.default_rng(seed).permutation(200)
        a, c = pm[:150], pm[150:]
        mm, ss = X[a].mean(0), X[a].std(0)
        _, _, wz2, bz2 = train_logistic((X[a] - mm) / ss, y[a], 0.5, 1000)[-1]
        accs.append(float(np.mean((((X[c] - mm) / ss) @ wz2 + bz2 > 0) == y[c])))
    accs = np.array(accs)
    mean = accs.mean()
    band = np.sqrt(mean * (1 - mean) / 50)
    role = np.zeros(200, int)
    role[te] = 1
    return {
        "about": ("The course's 200 points (simulated: default_rng(11), class 0 around (0,0), class 1 around (2,2), "
                  "unit spread). A sigmoid neuron trained by full-batch gradient descent, eta 0.5, from w = (0,0), "
                  "b = 0; epochs[k] = [loss, accuracy, w1, w2, b] after k updates. The best threshold on x1 alone, "
                  "and the line after 1000 epochs. lossGrid: mean cross-entropy over (w1, w2) at the final b, "
                  "z[j*nx + i] at w1 = x[i], w2 = y[j]; path = (w1, w2, loss at the final b) per epoch. "
                  "split: perceptron.py `_split` (150 train / 50 test, inputs standardised on the train rows)."),
        "points": {"x": np.round(X, 5), "label": y, "splitRole": role, "splitRoleNames": ["train", "test"]},
        "threshold": {"x1": float(ts[ib]), "right": int(right[ib]), "of": 200},
        "line": {"w": w, "b": b, "right": right_line, "of": 200, "loss": loss, "accuracy": acc},
        "bayes": {"w": [2.0, 2.0], "b": -4.0, "why": "log odds of two unit Gaussians at (0,0) and (2,2): 2 x1 + 2 x2 - 4"},
        "epochs": [[e[0], e[1], e[2][0], e[2][1], e[3]] for e in h],
        "after1": {"w": h[1][2], "b": h[1][3], "loss": h[1][0], "accuracy": h[1][1], "right": int(round(h[1][1] * 200)),
                   "of": 200, "start": {"loss": h[0][0], "accuracy": h[0][1],
                                        "note": "w = (0, 0), b = 0: every point scores 0.5, loss ln 2; accuracy counts p > 0.5"}},
        "lossStart": h[0][0], "lossEnd": h[-1][0],
        "lossGrid": {"x": [float(g1[0]), float(g1[-1]), len(g1)], "y": [float(g2[0]), float(g2[-1]), len(g2)],
                     "b": b, "z": np.round(L, 5).ravel(), "min": [float(W1.ravel()[np.argmin(L)]), float(W2.ravel()[np.argmin(L)])],
                     "path": [[e[2][0], e[2][1], pl] for e, pl in zip(h, path_loss)]},
        "lossProfile": loss_profile(X, y, h),
        "split": {"train": acc_tr, "test": acc_te, "testErr": float(np.sqrt(acc_te * (1 - acc_te) / 50)),
                  "nTrain": 150, "nTest": 50, "w": ws, "b": bs,
                  "seeds20": accs, "mean20": mean, "band": band,
                  "bandWhy": "binomial sd at the mean accuracy for 50 test points, as the course draws it"},
        "source": SRC_COURSE,
    }


# ====================================================== the 2-4-1 network
def train_net(X, y, H, seed=0, eta=1.0, steps=5000):
    """ml.py `train`: full-batch gradient descent, one hidden layer of H sigmoid units."""
    rng = np.random.default_rng(seed)
    V, c = rng.normal(0, 1, (H, X.shape[1])), np.zeros(H)
    w, b = rng.normal(0, 1, H), 0.0
    for _ in range(steps):
        h = sig(X @ V.T + c)
        yhat = sig(h @ w + b)
        d = (yhat - y) / len(y)
        dh = np.outer(d, w) * h * (1 - h)
        w -= eta * h.T @ d
        b -= eta * d.sum()
        V -= eta * dh.T @ X
        c -= eta * dh.sum(axis=0)
    return V, c, w, b


def predict(p, X):
    return sig(sig(X @ p[0].T + p[1]) @ p[2] + p[3])


def train_neuron(X, y, eta=1.0, steps=5000):
    w, b = np.zeros(X.shape[1]), 0.0
    for _ in range(steps):
        yhat = sig(X @ w + b)
        w -= eta * X.T @ (yhat - y) / len(y)
        b -= eta * np.mean(yhat - y)
    return w, b


def auc_pairs(y, s):
    s1, s0 = s[y == 1], s[y == 0]
    return float((s1[:, None] > s0[None, :]).mean())


def ring_make():
    """ml_two_class.py `make` (seed 16), written the way the course writes the CSV."""
    rng = np.random.default_rng(16)
    cloud = rng.normal(0.0, 0.6, (300, 2))
    angle = rng.uniform(0.0, 2 * np.pi, 300)
    radius = rng.normal(2.0, 0.35, 300)
    ring = np.column_stack([radius * np.cos(angle), radius * np.sin(angle)])
    x = np.vstack([cloud, ring]) * np.array([1.0, 10.0]) + np.array([5.0, 30.0])
    label = np.concatenate([np.ones(300, int), np.zeros(300, int)])
    order = rng.permutation(600)
    x, label = x[order], label[order]
    text = "x1,x2,label\n" + "".join(f"{a:.3f},{b_:.2f},{l}\n" for (a, b_), l in zip(x, label))
    return text


def ring():
    text = ring_make()
    digest = hashlib.sha256(text.encode()).hexdigest()
    assert digest == RING_SHA, f"ring set regenerated with sha256 {digest[:8]}, course file is {RING_SHA[:8]}"
    d = np.array([[float(v) for v in line.split(",")] for line in text.strip().split("\n")[1:]])
    X, y = d[:, :2], d[:, 2]
    idx = np.random.default_rng(0).permutation(600)
    tr, va, te = idx[:360], idx[360:480], idx[480:]
    mu, sd = X[tr].mean(0), X[tr].std(0)
    Z = (X - mu) / sd
    w, b = train_neuron(Z[tr], y[tr])
    acc = lambda s, rows: float(np.mean((s > 0.5) == y[rows]))
    line_tr = acc(sig(Z[tr] @ w + b), tr)
    p = train_net(Z[tr], y[tr], 4)
    s_te = predict(p, Z[te])
    TP = int(np.sum((s_te > 0.5) & (y[te] == 1)))
    FP = int(np.sum((s_te > 0.5) & (y[te] == 0)))
    gx = np.linspace(1.0, 9.0, 121)
    gy = np.linspace(-10.0, 70.0, 121)
    GX, GY = np.meshgrid(gx, gy)
    G = (np.column_stack([GX.ravel(), GY.ravel()]) - mu) / sd
    score = predict(p, G)
    role = np.zeros(600, int)
    role[va], role[te] = 1, 2
    return {
        "about": ("The course's two-class ring set (ml_two_class.py, seed 16; simulated): class 1 a cloud of 300, "
                  "class 0 a ring of 300 around it, x1 around 5 and x2 around 30 in different units. Split (seed 0) "
                  "360 train / 120 validation / 120 test, inputs standardised on the train rows. A single sigmoid "
                  "neuron (the line) and a 2-4-1 network (Lecture 16: eta 1, 5000 full-batch steps, seed 0). "
                  "scoreGrid: the network's output on a grid of (x1, x2), z[j*nx + i] at x1 = x[i], x2 = y[j]; "
                  "its 0.5 level is the bent boundary."),
        "points": {"x": X, "label": y.astype(int), "splitRole": role, "splitRoleNames": ["train", "validation", "test"]},
        "scaling": {"mean": mu, "sd": sd},
        "line": {"w": w, "b": b, "trainAccuracy": line_tr, "testAccuracy": acc(sig(Z[te] @ w + b), te),
                 "trainRight": int(round(line_tr * 360)), "nTrain": 360,
                 "testRight": int(round(acc(sig(Z[te] @ w + b), te) * 120)), "nTest": 120,
                 "testAuc": auc_pairs(y[te], sig(Z[te] @ w + b))},
        "net": {"H": 4, "V": p[0], "c": p[1], "w": p[2], "b": p[3],
                "trainAccuracy": acc(predict(p, Z[tr]), tr), "validationAccuracy": acc(predict(p, Z[va]), va),
                "testAccuracy": acc(s_te, te), "testRight": int(round(acc(s_te, te) * 120)), "nTest": 120,
                "testAuc": auc_pairs(y[te], s_te), "testErr": float(np.sqrt(0.95 * 0.05 / 120)),
                "TP": TP, "FP": FP},
        "scoreGrid": {"x": [1.0, 9.0, 121], "y": [-10.0, 70.0, 121], "z": np.round(score, 4)},
        "csvSha256": RING_SHA,
        "source": SRC_COURSE,
    }


# =================================================== record 401 classifier
def d0_classifier(csv: Path):
    if not sha256(csv).startswith("25c3c972"):
        raise SystemExit(f"{csv}: not the course CSV")
    d = np.loadtxt(csv, delimiter=",", skiprows=1)
    n_all = len(d)
    ok = d[:, 2] > 0
    d = d[ok]
    M, PT, TAU, IP = d.T
    y = ((M > 1845) & (M < 1885)).astype(float)
    idx = np.random.default_rng(0).permutation(len(y))
    n_tr = int(0.8 * len(y))
    tr, te = idx[:n_tr], idx[n_tr:]
    res = {"nAll": n_all, "n": len(y), "nLabel1": int(y.sum()), "nTrain": len(tr), "nTest": len(te),
           "majority": float(max(y[te].mean(), 1 - y[te].mean()))}
    logs = np.column_stack([np.log(PT), np.log(TAU), np.log(IP)])
    nets = {}
    for name, F in (("withoutM", logs), ("withM", np.column_stack([logs, M]))):
        mu, sd = F[tr].mean(0), F[tr].std(0)
        Z = (F - mu) / sd
        w, b = train_neuron(Z[tr], y[tr], steps=2000)
        p = train_net(Z[tr], y[tr], 4, steps=5000)
        s = predict(p, Z[te])
        res[name] = dict(neuronW=w, neuronB=b, neuronAccuracy=float(np.mean((sig(Z[te] @ w + b) > 0.5) == y[te])),
                         netAccuracy=float(np.mean((s > 0.5) == y[te])),
                         scaling={"mean": mu, "sd": sd}, net={"V": p[0], "c": p[1], "w": p[2], "b": p[3]})
        nets[name] = (p, mu, sd, Z)
    # two inputs only (the two the picture shows): log IPCHI2 and log TAU
    F2 = logs[:, [2, 1]]
    mu2, sd2 = F2[tr].mean(0), F2[tr].std(0)
    Z2 = (F2 - mu2) / sd2
    p2 = train_net(Z2[tr], y[tr], 4, steps=5000)
    res["twoInputs"] = dict(inputs=["log IPCHI2", "log TAU"], netAccuracy=float(np.mean((predict(p2, Z2[te]) > 0.5) == y[te])),
                            scaling={"mean": mu2, "sd": sd2}, net={"V": p2[0], "c": p2[1], "w": p2[2], "b": p2[3]})
    # score grids over (log10 IPCHI2, TAU in ps)
    gx = np.linspace(-3.0, 4.0, 141)           # log10 IPCHI2
    gt = np.linspace(0.1, 5.0, 99)             # ps
    GX, GT = np.meshgrid(gx, gt)
    lip = GX.ravel() * np.log(10)
    ltau = np.log(GT.ravel() / 1000.0)         # the network's input is log of TAU in ns
    p, mu, sd, Z = nets["withoutM"]
    lpt = float(np.median(np.log(PT[tr])))
    G3 = (np.column_stack([np.full(lip.size, lpt), ltau, lip]) - mu) / sd
    s3 = predict(p, G3)
    G2 = (np.column_stack([lip, ltau]) - mu2) / sd2
    s2 = predict(p2, G2)
    res["scoreGrid"] = {
        "x": [-3.0, 4.0, 141], "y": [0.1, 5.0, 99], "xName": "log10 IPCHI2", "yName": "TAU ps",
        "threeInputsAtMedianLogPT": {"logPT": lpt, "z": np.round(s3, 4)},
        "twoInputs": {"z": np.round(s2, 4)},
        "about": "network output on the grid, z[j*nx + i] at x[i], y[j]; 0.5 is the boundary",
    }
    # the honest network's score for every candidate in file order (NaN where TAU <= 0 or missing)
    full = np.full(n_all, np.nan)
    full[np.where(ok)[0]] = predict(p, Z)
    # test-set membership in file order (1 test, 0 train, -1 not used)
    role = np.full(n_all, -1, np.int8)
    rows = np.where(ok)[0]
    role[rows[tr]] = 0
    role[rows[te]] = 1
    res["testAucWithoutM"] = auc_sample(y[te], predict(p, Z[te]))
    res["testAucWithM"] = auc_sample(y[te], predict(nets["withM"][0], nets["withM"][3][te]))
    # row 1 (file row 0, our grain): the honest networks' scores
    assert ok[0]
    s2_1 = float(predict(p2, Z2[:1])[0])
    res["row1"] = dict(about=("Row 1 (file index 0, our grain): its label (1845 < M < 1885), its role in the split, and the "
                              "honest networks' scores (no mass input). score3 is the three-input network (log PT, log TAU, "
                              "log IPCHI2; `withoutM`), the value d0-score.f32 holds at index 0; score2 the two-input "
                              "network the picture draws (`twoInputs`)."),
                       M=float(M[0]), label=int(y[0]), role=["train", "test"][int(role[0])],
                       score3=float(full[0]), score2=s2_1, side3=int(full[0] > 0.5), side2=int(s2_1 > 0.5))
    res["windowShare"] = window_share(M, y, n_all)
    return res, full, role


def loss_profile(X, y, h, lo=-0.6, hi=3.4, n=101):
    """Mean cross-entropy over (w1, w2) with b at its best for each pair (Newton on the convex 1D loss in b).

    The grid steps 0.04 from -0.6, so w = (0, 0) is a node; path[k] = [w1, w2, profiled loss, best b] at epoch k's
    weights, so a ball on the surface stands on the path. `readout` emulates dk-landscape's bilinear Dat on this grid
    at the path's first and last point (readout 'chi2' with no chi2min: the grid's minimum plus Delta)."""
    g = np.linspace(lo, hi, n)
    W1, W2 = np.meshgrid(g, g)

    def best_b(z, b0):
        b = np.array(b0, float)
        for _ in range(60):
            q = sig(z + b[..., None])
            g1 = np.mean(q - y, axis=-1)
            g2 = np.mean(q * (1 - q), axis=-1)
            b = b - g1 / np.maximum(g2, 1e-12)
        q = sig(z + b[..., None])
        assert np.abs(np.mean(q - y, axis=-1)).max() < 1e-10
        return b

    def loss(z, b):
        zz = z + b[..., None]
        return np.mean(np.logaddexp(0, zz) - y * zz, axis=-1)

    Z = X[:, 0][None, None, :] * W1[..., None] + X[:, 1][None, None, :] * W2[..., None]
    B = best_b(Z, np.zeros(W1.shape))
    L = loss(Z, B)
    WP = np.array([[e[2][0], e[2][1]] for e in h])
    ZP = WP @ X.T
    BP = best_b(ZP, np.zeros(len(WP)))
    LP = loss(ZP, BP)
    logged = np.array([e[0] for e in h])
    assert np.all(LP <= logged + 1e-12)
    zr = np.round(L, 5)

    def dat(x, yv):                                     # landscape.js Dat, plus the grid's minimum
        D = zr.ravel() - zr.min()
        fi = min(n - 1.0001, max(0.0, (x - lo) / (hi - lo) * (n - 1)))
        fj = min(n - 1.0001, max(0.0, (yv - lo) / (hi - lo) * (n - 1)))
        i, j = int(np.floor(fi)), int(np.floor(fj))
        u, v = fi - i, fj - j
        a, b_, c, e = D[j * n + i], D[j * n + i + 1], D[(j + 1) * n + i + 1], D[(j + 1) * n + i]
        return float(zr.min() + (1 - v) * ((1 - u) * a + u * b_) + v * ((1 - u) * e + u * c))

    im = int(np.argmin(L))
    return {"about": ("lossProfile: mean cross-entropy of the course's 200 points over (w1, w2), b profiled (set to its "
                      "best) at each node, as T3's chi2 bowl profiles n_sig. z[j*nx + i] at w1 = x[i], w2 = y[j]; "
                      "path[k] = [w1, w2, profiled loss, best b] at the weights after k updates (the logged training "
                      "loss, epochs[k][0], lies on or above it). dk-landscape: src 'train-perceptron.json', key "
                      "'lossProfile', readout 'chi2' (with no chi2min the readout is the loss itself)."),
            "x": [lo, hi, n], "y": [lo, hi, n], "xName": "w1", "yName": "w2", "z": zr.ravel(),
            "gridMin": {"w": [float(W1.ravel()[im]), float(W2.ravel()[im])], "loss": float(L.ravel()[im])},
            "path": [[float(w[0]), float(w[1]), float(l), float(b)] for w, l, b in zip(WP, LP, BP)],
            "start": {"w": [0.0, 0.0], "loss": float(LP[0]), "bBest": float(BP[0]), "ln2": float(np.log(2))},
            "end": {"w": WP[-1].tolist(), "loss": float(LP[-1]), "bBest": float(BP[-1]), "bTrained": h[-1][3],
                    "loggedLoss": float(logged[-1]), "gap": float(logged[-1] - LP[-1])},
            "readout": {"start": dat(*WP[0]), "end": dat(*WP[-1])}}


def window_share(M, y, n_all):
    """How much of the label-1 window (1845 < M < 1885) the mass fit calls background."""
    from scipy.stats import norm
    fit = json.loads((DATA / "d0-fit.json").read_text(encoding="utf-8"))
    q = fit["params"]
    lo, hi = 1845.0, 1885.0
    piv, bw = fit["model"]["pivot"], fit["model"]["bin"]
    S = q["nSig"] * (norm.cdf((hi - q["mu"]) / q["width"]) - norm.cdf((lo - q["mu"]) / q["width"]))
    Bg = (q["a"] * (hi - lo) + q["b"] * 0.5 * ((hi - piv) ** 2 - (lo - piv) ** 2)) / bw
    n_win = int(y.sum())
    return dict(about=("The label-1 window 1845 < M < 1885 MeV/c^2 against the mass fit of d0-fit.json (Gaussian + line "
                       "on all 91 583 candidates): sig and bkg are the fitted signal and line integrated over the window; "
                       "nWindow counts the classifier's rows (TAU > 0) in it. backgroundShare = 1 - sig / nWindow. "
                       "boundShare uses the whole fitted signal (nSig, over 1820-1910) instead: a lower bound."),
                window=[lo, hi], nWindow=n_win, nRows=int(len(y)), sig=float(S), bkg=float(Bg), fitTotal=float(S + Bg),
                backgroundShare=float(1 - S / n_win), nSigAll=q["nSig"], boundShare=float(1 - q["nSig"] / n_win),
                bkgAtLeast=float(n_win - q["nSig"]))


def auc_sample(y, s):
    """AUC from ranks (Mann-Whitney), ties counted half."""
    order = np.argsort(s, kind="mergesort")
    r = np.empty(len(s))
    r[order] = np.arange(1, len(s) + 1)
    # average ranks over ties
    vals, inv, cnt = np.unique(s, return_inverse=True, return_counts=True)
    sums = np.bincount(inv, weights=r)
    r = (sums / cnt)[inv]
    n1, n0 = int(y.sum()), int((1 - y).sum())
    return float((r[y == 1].sum() - n1 * (n1 + 1) / 2) / (n1 * n0))


def rare():
    n, s, recall, fpr = 100_000, 100, 0.90, 0.01
    TP = recall * s
    FP = fpr * (n - s)
    return {"about": "Lecture 16: 100 signal rows in 100 000; a classifier with recall 0.90 and 1 % false positives.",
            "n": n, "signal": s, "recall": recall, "fpr": fpr, "TP": TP, "FP": FP,
            "precision": TP / (TP + FP), "accuracy": (TP + (n - s - FP)) / n, "alwaysBackground": (n - s) / n,
            "source": SRC_COURSE}


def bake(csv: Path):
    out, ent = {}, {}
    P = perceptron()
    out["train-perceptron.json"] = json_bytes(P)
    ent["train-perceptron.json"] = dict(talks=[4], shape="object",
                                        meaning="course 200 points, per-epoch (loss, acc, w1, w2, b), threshold vs line, epoch 1 (150/200, loss 0.510), "
                                                "loss grid over (w1,w2) at the final b with path, lossProfile (b profiled) with path, train/test split")
    R = ring()
    out["train-ring.json"] = json_bytes(R)
    ent["train-ring.json"] = dict(talks=[4], shape="object", meaning="600-point ring set, line (train and test accuracy and counts) vs 2-4-1 network, test accuracy and AUC, score grid")
    D, score, role = d0_classifier(csv)
    out["train-d0.json"] = json_bytes(dict(D, about=(
        "Lecture 16's leakage example on record 401: rows with TAU > 0; label 1 if 1845 < M < 1885 MeV/c^2; inputs "
        "log PT, log TAU (TAU in ns as in the CSV), log IPCHI2, standardised on the train rows; split default_rng(0), "
        "80 % train. Neuron: 2000 steps; network: 2-4-1, eta 1, 5000 full-batch steps, seed 0. withM adds M as a "
        "fourth input (leakage: the label is a cut on M). twoInputs: the same network on log IPCHI2 and log TAU only, "
        "the two the picture shows."), source=SRC_401))
    ent["train-d0.json"] = dict(talks=[4], shape="object",
                                meaning="record 401 classifier: majority / neuron / network accuracies, with M added, score grids over (log10 IPCHI2, TAU ps), "
                                        "row 1's scores, the window's background share from the mass fit")
    out["d0-score.f32"] = f32_bytes(score)
    ent["d0-score.f32"] = dict(talks=[4], shape=[len(score)], dtype="float32 LE",
                               meaning="the honest 2-4-1 network's output per candidate in file order (NaN where TAU <= 0 or missing)")
    out["d0-split.f32"] = f32_bytes(role.astype(np.float32))
    ent["d0-split.f32"] = dict(talks=[4], shape=[len(role)], dtype="float32 LE",
                               meaning="classifier role per candidate in file order: 0 train, 1 test, -1 not used (TAU <= 0)")
    out["train-rare.json"] = json_bytes(rare())
    ent["train-rare.json"] = dict(talks=[4], shape="object", meaning="rare-signal arithmetic: precision 8.3 %, accuracy of always-background 99.9 %")
    return out, ent, P, R, D


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cached", help="the course's D0_KPi.csv")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args(argv)
    csv = Path(a.cached) if a.cached else course_file("D0_KPi.csv")
    out, ent, P, R, D = bake(csv)
    print(f"perceptron: threshold {P['threshold']['right']}/200, line {P['line']['right']}/200, loss "
          f"{P['lossStart']:.3f} -> {P['lossEnd']:.3f}, after 1 {np.round(P['after1']['w'], 3)}, end "
          f"{np.round(P['line']['w'], 2)} {P['line']['b']:.2f}; split {P['split']['train']:.3f} / "
          f"{P['split']['test']:.3f}, 20 seeds {P['split']['mean20']:.3f} +- {P['split']['band']:.3f}")
    print(f"ring: line train {R['line']['trainAccuracy']:.3f}; net test {R['net']['testAccuracy']:.3f} "
          f"AUC {R['net']['testAuc']:.4f}")
    print(f"d0: n {D['n']} train {D['nTrain']} test {D['nTest']} majority {D['majority']:.4f} neuron "
          f"{D['withoutM']['neuronAccuracy']:.4f} net {D['withoutM']['netAccuracy']:.4f} with M "
          f"{D['withM']['netAccuracy']:.4f}; two inputs {D['twoInputs']['netAccuracy']:.4f}; AUC {D['testAucWithoutM']:.4f}")
    return emit(SCRIPT, out, ent, a.check)


if __name__ == "__main__":
    raise SystemExit(main())
