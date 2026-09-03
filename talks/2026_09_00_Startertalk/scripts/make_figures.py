#!/usr/bin/env python3
"""Scripted SVG figures for the "Pentaquarks at LHCb" Startertalk deck.

Run with a python that has matplotlib (e.g. the `lecture` conda env):

    python3 scripts/make_figures.py

Writes public/figures/{pc_thresholds,lhcb_lumi,lambda_b_decay}.svg.
Deterministic: fixed svg.hashsalt, no embedded date, seeded nothing (no
random data). Transparent background, light ink, dark-slide accent colours.
"""
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Rectangle  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "public" / "figures"

# ---- style ---------------------------------------------------------------
INK = "#e6e6e6"
MUTED = "#a8a8a8"
FAINT = "#6b6b6b"
BLUE = "#3987e5"    # P_c states (J/psi p)
ORANGE = "#d95926"  # P_cs states (J/psi Lambda)
AQUA = "#199e70"
YELLOW = "#c98500"

plt.rcParams.update({
    "svg.hashsalt": "startertalk-2026",
    "svg.fonttype": "none",
    "font.family": "sans-serif",
    "font.sans-serif": ["Helvetica Neue", "Helvetica", "Arial", "DejaVu Sans"],
    "font.size": 15,
    "mathtext.fontset": "dejavusans",
    "text.color": INK,
    "axes.edgecolor": MUTED,
    "axes.labelcolor": INK,
    "axes.titlecolor": INK,
    "xtick.color": INK,
    "ytick.color": INK,
    "axes.facecolor": "none",
    "figure.facecolor": "none",
    "savefig.facecolor": "none",
    "savefig.transparent": True,
    "axes.spines.top": False,
    "axes.spines.right": False,
    "axes.linewidth": 1.0,
})


def save(fig, name):
    OUT.mkdir(parents=True, exist_ok=True)
    fig.savefig(OUT / name, format="svg", bbox_inches="tight",
                metadata={"Date": None, "Creator": None})
    plt.close(fig)
    print("wrote", OUT / name)


# ---- PDG masses (MeV) ---------------------------------------------------
M = {
    "Sigma_c": 2453.97,       # Σc(2455)++
    "Sigma_c*": 2518.41,      # Σc(2520)++
    "D0": 1864.84,
    "D*0": 2006.85,
    "Xi_c+": 2467.71,
    "Lambda_b": 5619.60,
    "J/psi": 3096.90,
    "p": 938.27,
    "K": 493.68,
    "Lambda": 1115.68,
}


def thr(a, b):
    """Two-body threshold, rounded half-up to one decimal (avoids float .x5 flips)."""
    s = Decimal(str(M[a])) + Decimal(str(M[b]))
    return float(s.quantize(Decimal("0.1"), rounding=ROUND_HALF_UP))


THRESHOLDS = {
    # label, value, family (which row it belongs to)
    "ΣcD̄":   (thr("Sigma_c", "D0"),   "c"),
    "Σc*D̄":  (thr("Sigma_c*", "D0"),  "c"),
    "ΣcD̄*":  (thr("Sigma_c", "D*0"),  "c"),
    "Σc*D̄*": (thr("Sigma_c*", "D*0"), "c"),
    "ΞcD̄":   (thr("Xi_c+", "D0"),     "s"),
    "ΞcD̄*":  (thr("Xi_c+", "D*0"),    "s"),
}

# LHCb results: (name, mass, width, nearest threshold key)
PC_NARROW = [
    ("Pc(4312)⁺", 4311.9, 9.8,  "ΣcD̄"),
    ("Pc(4440)⁺", 4440.3, 20.6, "ΣcD̄*"),
    ("Pc(4457)⁺", 4457.3, 6.4,  "ΣcD̄*"),
]
PC_BROAD = ("Pc(4380)⁺", 4380.0, 205.0)
PCS = [
    (r"$\mathrm{P}_{\psi s}^{\Lambda}(4338)^0$", 4338.2, 7.0,  "ΞcD̄"),
    ("Pcs(4459)⁰",                                4458.8, 17.3, "ΞcD̄*"),
]


def fig_thresholds():
    fig, ax = plt.subplots(figsize=(11.5, 5.4))
    Y_PC, Y_PCS = 1.4, 0.0
    ax.set_xlim(4250, 4550)
    ax.set_ylim(-1.55, 2.75)
    ax.set_yticks([Y_PC, Y_PCS])
    ax.set_yticklabels([r"$J/\psi\,p$", r"$J/\psi\,\Lambda$"], fontsize=19)
    ax.set_xlabel("mass (MeV)", fontsize=17)
    ax.tick_params(axis="x", labelsize=16)
    ax.tick_params(axis="y", length=0)
    ax.spines["left"].set_visible(False)

    # threshold lines; Σc-family labels along the top, Ξc-family labels along the bottom
    for label, (x, fam) in THRESHOLDS.items():
        col = MUTED if fam == "c" else ORANGE
        # each line stops short of its own label so the text stays clean
        if fam == "c":
            ax.vlines(x, -1.55, 2.18, color=col, ls=(0, (4, 3)), lw=1.2, alpha=0.9, zorder=1)
            ax.text(x, 2.68, f"{label}\n{x:.1f}", ha="center", va="top", fontsize=14.5,
                    color=col, linespacing=1.15, zorder=3)
        else:
            ax.vlines(x, -0.92, 2.75, color=col, ls=(0, (4, 3)), lw=1.2, alpha=0.9, zorder=1)
            ax.text(x, -1.02, f"{label}\n{x:.1f}", ha="center", va="top", fontsize=14.5,
                    color=col, linespacing=1.15, zorder=3)

    def band(x, w, y, col, alpha, h=0.34):
        ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h, facecolor=col,
                               edgecolor="none", alpha=alpha, zorder=2))

    # broad P_c(4380): faint wide band
    name, x, w = PC_BROAD
    band(x, w, Y_PC, BLUE, 0.13, h=0.42)
    ax.text(x, Y_PC + 0.32, f"{name}\nbroad, Γ ≈ {w:.0f} MeV", ha="center", va="bottom",
            fontsize=13.5, color=MUTED, linespacing=1.15)

    # narrow P_c: band = width, filled marker = mass, label with distance to threshold
    for i, (name, x, w, key) in enumerate(PC_NARROW):
        band(x, w, Y_PC, BLUE, 0.45)
        ax.plot([x], [Y_PC], marker="o", ms=9, color=BLUE, mec=INK, mew=1.2, zorder=4)
        d = x - THRESHOLDS[key][0]
        txt = f"{name}\n{d:+.1f} MeV"
        if name.startswith("Pc(4440)"):
            ax.text(x, Y_PC - 0.32, txt, ha="center", va="top", fontsize=14.5,
                    color=INK, linespacing=1.15)
        else:
            ax.text(x, Y_PC + 0.32, txt, ha="center", va="bottom", fontsize=14.5,
                    color=INK, linespacing=1.15)

    for name, x, w, key in PCS:
        band(x, w, Y_PCS, ORANGE, 0.45)
        ax.plot([x], [Y_PCS], marker="o", ms=9, color=ORANGE, mec=INK, mew=1.2, zorder=4)
        d = x - THRESHOLDS[key][0]
        ax.text(x, Y_PCS - 0.30, f"{name}\n{d:+.1f} MeV", ha="center", va="top",
                fontsize=14.5, color=INK, linespacing=1.15)

    save(fig, "pc_thresholds.svg")


def fig_lumi():
    labels = ["Runs 1–2\n2011–18", "2024", "2025", "2026"]
    vals = [9.0, 9.6, 11.8, 5.3]
    cols = [BLUE, ORANGE, ORANGE, ORANGE]
    fig, ax = plt.subplots(figsize=(9.0, 5.0))
    xs = range(len(vals))
    ax.bar(xs, vals, width=0.58, color=cols, edgecolor="none", zorder=2)
    for x, v in zip(xs, vals):
        ax.text(x, v + 0.25, f"{v:.1f}", ha="center", va="bottom", fontsize=19, color=INK)
    ax.set_xticks(list(xs))
    ax.set_xticklabels(labels, fontsize=17)
    ax.set_ylabel("integrated luminosity (fb⁻¹)", fontsize=17)
    ax.set_ylim(0, 18.5)
    ax.set_yticks([0, 5, 10, 15])
    ax.tick_params(axis="y", labelsize=16)
    ax.yaxis.grid(True, color=FAINT, lw=0.6, alpha=0.5, zorder=0)
    ax.set_axisbelow(True)

    # bracket over the three Run 3 years
    yb = 13.9
    ax.plot([0.7, 0.7, 3.3, 3.3], [yb - 0.4, yb, yb, yb - 0.4], color=INK, lw=1.3)
    ax.text(2.0, yb + 0.3, f"Run 3 (2024–26) = {sum(vals[1:]):.1f} fb⁻¹", ha="center",
            va="bottom", fontsize=18, color=INK)
    # note on the first bar
    ax.annotate("2019 pentaquark analysis:\nthis 9 fb⁻¹ sample", xy=(0, 9.0), xytext=(-0.35, 16.6),
                ha="left", va="center", fontsize=15, color=MUTED, linespacing=1.2,
                arrowprops=dict(arrowstyle="-", color=MUTED, lw=1.0, shrinkA=14, shrinkB=22))
    save(fig, "lhcb_lumi.svg")


def fig_decay():
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(10.5, 4.2))
    for ax in (a1, a2):
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 5)
        ax.axis("off")

    def arrow(ax, p0, p1, col, lw=2.2, ls="-", to_vertex=False):
        ax.annotate("", xy=p1, xytext=p0,
                    arrowprops=dict(arrowstyle="-|>", color=col, lw=lw, linestyle=ls,
                                    mutation_scale=16, shrinkA=0, shrinkB=9 if to_vertex else 0))

    def vtx(ax, p, col):
        ax.plot([p[0]], [p[1]], marker="o", ms=8, color=col, mec=INK, mew=1.0, zorder=5)

    def lab(ax, x, y, s, col=INK, ha="center", fs=19):
        ax.text(x, y, s, ha=ha, va="center", fontsize=fs, color=col)

    # --- left: pentaquark path ---
    v1, v2 = (3.2, 2.5), (6.6, 2.0)
    lab(a1, 0.2, 2.5, "Λb⁰", ha="left", fs=19)
    lab(a1, 0.2, 1.95, "udb", MUTED, ha="left", fs=13.5)
    arrow(a1, (1.3, 2.5), v1, INK, to_vertex=True)
    arrow(a1, v1, (6.4, 4.3), INK)
    lab(a1, 6.6, 4.3, "K⁻", ha="left", fs=19)
    lab(a1, 7.75, 4.3, "s ū", MUTED, ha="left", fs=13.5)
    arrow(a1, v1, v2, BLUE, lw=3.0, to_vertex=True)
    lab(a1, 4.9, 1.55, "Pc⁺", BLUE, fs=19)
    lab(a1, 4.9, 1.05, "c c̄ u u d", MUTED, fs=13.5)
    arrow(a1, v2, (9.0, 3.2), BLUE)
    lab(a1, 9.15, 3.2, "J/ψ", ha="left", fs=19)
    lab(a1, 9.15, 2.7, "c c̄", MUTED, ha="left", fs=13.5)
    arrow(a1, v2, (9.0, 0.9), BLUE)
    lab(a1, 9.15, 0.9, "p", ha="left", fs=19)
    lab(a1, 9.15, 0.4, "uud", MUTED, ha="left", fs=13.5)
    vtx(a1, v1, INK)
    vtx(a1, v2, BLUE)
    a1.set_title("pentaquark path: peak in m(J/ψ p)", fontsize=16.5, color=BLUE, pad=6)

    # --- right: conventional Λ* path ---
    w1, w2 = (3.2, 2.5), (6.6, 2.0)
    lab(a2, 0.2, 2.5, "Λb⁰", ha="left", fs=19)
    lab(a2, 0.2, 1.95, "udb", MUTED, ha="left", fs=13.5)
    arrow(a2, (1.3, 2.5), w1, INK, to_vertex=True)
    arrow(a2, w1, (6.4, 4.3), INK)
    lab(a2, 6.6, 4.3, "J/ψ", ha="left", fs=19)
    lab(a2, 8.05, 4.3, "c c̄", MUTED, ha="left", fs=13.5)
    arrow(a2, w1, w2, ORANGE, lw=3.0, to_vertex=True)
    lab(a2, 4.9, 1.55, "Λ*", ORANGE, fs=19)
    lab(a2, 4.9, 1.05, "uds", MUTED, fs=13.5)
    arrow(a2, w2, (9.0, 3.2), ORANGE)
    lab(a2, 9.15, 3.2, "p", ha="left", fs=19)
    arrow(a2, w2, (9.0, 0.9), ORANGE)
    lab(a2, 9.15, 0.9, "K⁻", ha="left", fs=19)
    vtx(a2, w1, INK)
    vtx(a2, w2, ORANGE)
    a2.set_title("conventional path: peaks in m(p K⁻)", fontsize=16.5, color=ORANGE, pad=6)

    fig.text(0.5, 0.02, "same final state J/ψ p K⁻ — the two paths interfere, so the fit must model both",
             ha="center", va="bottom", fontsize=15.5, color=MUTED)
    save(fig, "lambda_b_decay.svg")


if __name__ == "__main__":
    for k, (v, _) in THRESHOLDS.items():
        print(f"{k:8s} {v:.1f}")
    fig_thresholds()
    fig_lumi()
    fig_decay()
