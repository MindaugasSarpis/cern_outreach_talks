#!/usr/bin/env python3
"""Scripted SVG figures for the "Pentaquarks at LHCb" Startertalk deck.

Run with a python that has matplotlib (e.g. the `outreach_talks` conda env):

    python3 scripts/make_figures.py

Writes to public/figures/:

    argand_schematic.svg          Breit-Wigner Argand circle + lineshape (2015 criterion)
    hadron_molecule.svg           the three pictures of a pentaquark at one 1 fm scale
    hadron_compact.svg
    hadron_hadrocharmonium.svg
    hadron_pictures_2.svg         molecule vs compact, label-free (question slide)
    lineshapes_cusp_vs_pole.svg   threshold cusp vs Breit-Wigner at the Pc(4312)+ mass
    dalitz_schematic.svg          Lb -> J/psi p K- Dalitz plane with Lambda* and Pc bands
    lambda_b_decay.svg            the two decay paths
    pc_thresholds.svg             threshold ladder (PDG 2024, charge-consistent pairs)
    lhcb_lumi.svg                 recorded luminosity bar chart

Deterministic: fixed svg.hashsalt, no embedded date, no random data.
Transparent background, light ink, dark-slide accent colours.

Set PREVIEW_DIR=<dir> to also write a 150 dpi PNG of every figure over a
dark slide background (for checking legibility); the SVGs are unaffected.
"""
import os
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import Arc, Circle, Rectangle  # noqa: E402

OUT = Path(__file__).resolve().parent.parent / "public" / "figures"
PREVIEW_DIR = os.environ.get("PREVIEW_DIR")

# ---- style ---------------------------------------------------------------
INK = "#e6e6e6"
MUTED = "#a8a8a8"
FAINT = "#6b6b6b"
BLUE = "#3987e5"    # P_c states (J/psi p), charm quarks
ORANGE = "#d95926"  # P_cs states (J/psi Lambda), Lambda* bands, diquark brackets
AQUA = "#199e70"
YELLOW = "#c98500"
Q_RED, Q_GREEN, Q_BLUE = "#e5484d", "#30a46c", "#3987e5"   # quark "colours" (1964 slide)
SLIDE_BG = "#0b1020"

HBARC = 197.327  # MeV fm

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
    print("wrote", OUT / name)
    if PREVIEW_DIR:
        pdir = Path(PREVIEW_DIR)
        pdir.mkdir(parents=True, exist_ok=True)
        fig.savefig(pdir / (Path(name).stem + ".png"), format="png", dpi=150,
                    bbox_inches="tight", transparent=False, facecolor=SLIDE_BG)
    plt.close(fig)


# ---- PDG 2024 masses (MeV) ----------------------------------------------
M = {
    "Sigma_c+": 2452.65,      # Σc(2455)⁺
    "Sigma_c*+": 2517.4,      # Σc(2520)⁺
    "Xi_c+": 2467.71,
    "Xi_c0": 2470.44,
    "D0": 1864.84,
    "D-": 1869.66,
    "D*0": 2006.85,
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


# Charge-consistent pairs: the J/ψ p (uud) row against Σc⁺ D̄⁽*⁾⁰, the J/ψ Λ (uds)
# row against Ξc D̄⁽*⁾. key: (label, value, family)
THRESHOLDS = {
    "Sc+D0":   (r"$\Sigma_c^+\bar{D}^0$",        thr("Sigma_c+", "D0"),   "c"),
    "Sc*+D0":  (r"$\Sigma_c(2520)^+\bar{D}^0$",  thr("Sigma_c*+", "D0"),  "c"),
    "Sc+D*0":  (r"$\Sigma_c^+\bar{D}^{*0}$",     thr("Sigma_c+", "D*0"),  "c"),
    "Sc*+D*0": (r"$\Sigma_c(2520)^+\bar{D}^{*0}$", thr("Sigma_c*+", "D*0"), "c"),
    "Xc+D-":   (r"$\Xi_c^+ D^-$",                thr("Xi_c+", "D-"),      "s"),
    "Xc0D*0":  (r"$\Xi_c^0\bar{D}^{*0}$",        thr("Xi_c0", "D*0"),     "s"),
}
# the isospin partner of Ξc⁺D⁻, drawn as a fainter tick without a label
THRESHOLD_TICKS = {
    "Xc0D0": (r"$\Xi_c^0\bar{D}^0$", thr("Xi_c0", "D0"), "s"),
}

# LHCb results: (name, mass, width, nearest threshold key)
PC_NARROW = [
    (r"$P_c(4312)^+$", 4311.9, 9.8,  "Sc+D0"),
    (r"$P_c(4440)^+$", 4440.3, 20.6, "Sc+D*0"),
    (r"$P_c(4457)^+$", 4457.3, 6.4,  "Sc+D*0"),
]
PC_BROAD = (r"$P_c(4380)^+$", 4380.0, 205.0)
PC_EVIDENCE = (r"$P_c(4337)^+$", 4337.0, 29.0)          # Bs0 -> J/psi p pbar, 2021
PCS = [
    (r"$P_{cs}(4338)^0$", 4338.2, 7.0,  "Xc+D-"),
    (r"$P_{cs}(4459)^0$", 4458.8, 17.3, "Xc0D*0"),
]


# =========================================================================
# quark_model_singlets.svg — meson / baryon / tetraquark / pentaquark
# =========================================================================
def fig_singlets():
    panels = [
        ("qq̄  meson", "qq"),
        ("qqq  baryon", "qqq"),
        ("qqq̄q̄  tetraquark", "qqaa"),
        ("qqqqq̄  pentaquark", "qqqqa"),
    ]
    cols = [Q_RED, Q_GREEN, Q_BLUE]
    fig, axes = plt.subplots(1, 4, figsize=(11, 3.6))
    fig.subplots_adjust(left=0.01, right=0.99, top=0.98, bottom=0.2, wspace=0.05)
    for ax, (label, content) in zip(axes, panels):
        ax.set_xlim(-1, 1)
        ax.set_ylim(-1, 1)
        ax.set_aspect("equal")
        ax.axis("off")
        n = len(content)
        if n == 2:
            pts = [(-0.40, 0.0), (0.40, 0.0)]
        else:
            ang = np.deg2rad(90 + 360 * np.arange(n) / n)
            pts = [(0.52 * np.cos(a), 0.52 * np.sin(a)) for a in ang]
        for k, ((x, y), kind) in enumerate(zip(pts, content)):
            anti = kind == "a"
            ax.add_patch(Circle((x, y), 0.30, facecolor=cols[k % 3],
                                edgecolor=INK if anti else "none",
                                lw=2.5 if anti else 0, zorder=2))
            ax.text(x, y - 0.02, "q̄" if anti else "q", ha="center", va="center",
                    fontsize=17, color=INK, zorder=3)
        ax.text(0, -1.02, label, ha="center", va="top", fontsize=19, color=INK,
                clip_on=False)
    save(fig, "quark_model_singlets.svg")


# =========================================================================
# argand_schematic.svg — Breit-Wigner Argand circle and lineshape
# =========================================================================
def fig_argand():
    M0, G = 4449.8, 39.0          # LHCb 2015, Pc(4450)+
    m = np.linspace(M0 - 2 * G, M0 + 2 * G, 1000)

    def amp(mm):
        return (G / 2) / (M0 - mm - 1j * G / 2)

    A = amp(m)
    edges = np.linspace(M0 - G, M0 + G, 7)               # six bins of width Γ/3
    centres = 0.5 * (edges[:-1] + edges[1:])
    Ab = amp(centres)

    fig, (al, ar) = plt.subplots(1, 2, figsize=(11, 4.6),
                                 gridspec_kw={"width_ratios": [1, 1.3], "wspace": 0.22})
    # ---- left: Argand circle
    al.set_xlim(-0.62, 0.62)
    al.set_ylim(-0.08, 1.12)
    al.set_aspect("equal")
    al.set_xticks([])
    al.set_yticks([])
    al.set_xlabel("Re A", fontsize=20)
    al.set_ylabel("Im A", fontsize=20)
    al.plot(A.real, A.imag, color=MUTED, lw=1.2, zorder=1)
    for i in range(len(Ab) - 1):
        al.annotate("", xy=(Ab[i + 1].real, Ab[i + 1].imag), xytext=(Ab[i].real, Ab[i].imag),
                    arrowprops=dict(arrowstyle="-|>", color=BLUE, lw=1.6, mutation_scale=16,
                                    shrinkA=7, shrinkB=7), zorder=2)
    al.plot(Ab.real, Ab.imag, ls="none", marker="o", ms=11, color=BLUE, mec=INK, mew=1.2,
            zorder=3)
    al.text(Ab[0].real, Ab[0].imag - 0.09, "m < M", ha="center", va="top", fontsize=18)
    al.text(0.0, 1.0 + 0.04, "m = M", ha="center", va="bottom", fontsize=18)
    al.text(Ab[-1].real, Ab[-1].imag - 0.09, "m > M", ha="center", va="top", fontsize=18)

    # ---- right: |A|^2 with the six bins
    I = np.abs(A) ** 2
    I /= I.max()
    for i in range(6):
        ar.axvspan(edges[i], edges[i + 1], color=MUTED, alpha=0.10 if i % 2 == 0 else 0.22,
                   lw=0, zorder=0)
    ar.plot(m, I, color=BLUE, lw=2.4, zorder=2)
    ar.axvline(M0, color=MUTED, ls=(0, (4, 3)), lw=1.2, zorder=1)
    ar.text(M0 + 1.5, 1.02, "M", ha="left", va="bottom", fontsize=18)
    ar.set_xlim(m[0], m[-1])
    ar.set_ylim(0, 1.12)
    ar.set_yticks([])
    ar.tick_params(axis="x", labelsize=18)
    ar.set_xlabel("m(J/ψ p) (MeV)", fontsize=20)
    ar.set_ylabel("|A|²", fontsize=20)

    fig.suptitle("schematic Breit–Wigner, M = 4450, Γ = 39 MeV; not the LHCb data",
                 fontsize=17, color=ORANGE, y=0.99)
    save(fig, "argand_schematic.svg")


# =========================================================================
# hadron_*.svg — the three pictures of a pentaquark at one 1 fm scale
# =========================================================================
def _panel(ax):
    ax.set_xlim(-3, 3)
    ax.set_ylim(-3, 3)
    ax.set_aspect("equal")
    ax.axis("off")
    # 1 fm scale bar top-left: the top band is empty in every panel, the
    # bottom band carries the captions (they collided with a bottom-left bar).
    ax.plot([-2.75, -1.75], [2.35, 2.35], color=INK, lw=2, solid_capstyle="butt")
    ax.plot([-2.75, -2.75], [2.27, 2.43], color=INK, lw=2)
    ax.plot([-1.75, -1.75], [2.27, 2.43], color=INK, lw=2)
    ax.text(-2.25, 2.48, "1 fm", ha="center", va="bottom", fontsize=17, color=INK)


def _quark(ax, x, y, letter, r=0.18, anti=False, charm=False, letters=True, fs=14):
    col = BLUE if charm else INK
    ax.add_patch(Circle((x, y), r, facecolor=col, edgecolor="white" if anti else "none",
                        lw=1.8 if anti else 0, zorder=4))
    if letters:
        ax.text(x, y - 0.01, letter, ha="center", va="center", fontsize=fs,
                color=INK if charm else SLIDE_BG, zorder=5, fontweight="bold")


def _footer(fig):
    fig.text(0.5, 0.01, "sizes schematic; only the 1 fm bar is to scale",
             ha="center", va="bottom", fontsize=14, color=FAINT)


def draw_molecule(ax, letters=True, labels=True, title=None):
    _panel(ax)
    cs, cd = (-0.9, 0.0), (0.9, 0.0)
    # Σc⁺ (c u d)
    ax.add_patch(Circle(cs, 0.45, facecolor="none", edgecolor=MUTED, ls=(0, (3, 2)), lw=1.3,
                        zorder=3))
    for (dx, dy), q in zip([(0, 0.2), (-0.19, -0.12), (0.19, -0.12)], "cud"):
        _quark(ax, cs[0] + dx, cs[1] + dy, q, charm=(q == "c"), letters=letters)
    # D̄⁰ (c̄ u)
    ax.add_patch(Circle(cd, 0.40, facecolor="none", edgecolor=MUTED, ls=(0, (3, 2)), lw=1.3,
                        zorder=3))
    _quark(ax, cd[0] - 0.17, cd[1] + 0.05, "c̄", charm=True, anti=True, letters=letters)
    _quark(ax, cd[0] + 0.17, cd[1] - 0.05, "u", letters=letters)
    # exchange between the two hadrons
    ax.plot([cs[0] + 0.45, cd[0] - 0.40], [0, 0], color=MUTED, ls=(0, (3, 2)), lw=1.3, zorder=2)
    if labels:
        ax.text(0, 0.72, "ρ, ω, σ exchange\n(π only with a D̄*)", ha="center", va="bottom",
                fontsize=15.5, color=MUTED, linespacing=1.15)
        ax.text(cs[0], -0.62, r"$\Sigma_c^+$", ha="center", va="top", fontsize=17, color=INK)
        ax.text(cd[0], -0.57, r"$\bar{D}^0$", ha="center", va="top", fontsize=17, color=INK)
        # Two short lines only: three lines reached the 1 fm bar at y = −2.42.
        ax.text(0, -1.30,
                r"$r \approx \hbar c/\sqrt{2\mu E_B} \approx 1.8$ fm" + "\n"
                r"deuteron: 2.2 MeV, $r \approx 4.3$ fm",
                ha="center", va="top", fontsize=15.5, color=MUTED, linespacing=1.3)
    ax.set_title(title if title is not None else r"hadronic molecule  $\Sigma_c^+\,\bar{D}^0$",
                 fontsize=19, color=INK, pad=4)


def draw_compact(ax, letters=True, labels=True, title=None):
    _panel(ax)
    R, r, rq = 0.5, 0.30, 0.17
    ax.add_patch(Circle((0, 0), R, facecolor="none", edgecolor=INK, lw=1.4, zorder=3))
    # c̄ at the top; [cu] lower left, [ud] lower right
    angs = {"c̄": 90, "c": 162, "u1": 234, "u2": 306, "d": 18}
    for key, a in angs.items():
        x, y = r * np.cos(np.deg2rad(a)), r * np.sin(np.deg2rad(a))
        q = key[0]
        _quark(ax, x, y, q, r=rq, charm=(q == "c"), anti=(key == "c̄"), letters=letters, fs=13)
    if labels:
        # diquark brackets: thin orange arcs hugging each pair, outside the hadron
        # (with the labels only: the question slide's panel must not show the clustering)
        for a0, a1 in ((162 - 22, 234 + 22), (306 - 22, 18 + 22 + 360)):
            ax.add_patch(Arc((0, 0), 2 * 0.62, 2 * 0.62, theta1=a0, theta2=a1, color=ORANGE,
                             lw=1.6, zorder=3))
        ax.text(0.68 * np.cos(np.deg2rad(198)), 0.68 * np.sin(np.deg2rad(198)) - 0.02, "[cu]",
                ha="right", va="center", fontsize=16, color=ORANGE)
        ax.text(0.68 * np.cos(np.deg2rad(342)), 0.68 * np.sin(np.deg2rad(342)) - 0.02, "[ud]",
                ha="left", va="center", fontsize=16, color=ORANGE)
        ax.text(0, -1.45, "colour–spin forces\nthe size of an ordinary hadron",
                ha="center", va="top", fontsize=15.5, color=MUTED, linespacing=1.25)
    ax.set_title(title if title is not None else r"compact  $[cu][ud]\,\bar{c}$",
                 fontsize=19, color=INK, pad=4)


def draw_hadrocharmonium(ax, title=None):
    _panel(ax)
    ax.add_patch(Circle((0, 0), 0.9, facecolor=BLUE, edgecolor=BLUE, alpha=0.10, lw=0, zorder=2))
    ax.add_patch(Circle((0, 0), 0.9, facecolor="none", edgecolor=BLUE, alpha=0.5, lw=1.0,
                        ls=(0, (3, 2)), zorder=2))
    # three light quarks smeared in the cloud
    for a, q in zip((100, 220, 340), "uud"):
        x, y = 0.6 * np.cos(np.deg2rad(a)), 0.6 * np.sin(np.deg2rad(a))
        ax.add_patch(Circle((x, y), 0.14, facecolor=INK, edgecolor="none", alpha=0.55, zorder=3))
        ax.text(x, y - 0.01, q, ha="center", va="center", fontsize=12, color=SLIDE_BG,
                fontweight="bold", zorder=4)
    # the cc̄ core
    ax.add_patch(Circle((0, 0), 0.22, facecolor=BLUE, edgecolor="none", zorder=4))
    ax.text(0, -0.01, "cc̄", ha="center", va="center", fontsize=14, color=INK,
            fontweight="bold", zorder=5)
    ax.annotate("χc0 or ψ(2S)", xy=(0.16, -0.16), xytext=(1.05, -0.95), fontsize=16,
                color=INK, ha="left", va="center",
                arrowprops=dict(arrowstyle="-", color=MUTED, lw=1.0, shrinkA=2, shrinkB=2))
    ax.text(0, 1.02, "light-quark cloud (uud)", ha="center", va="bottom", fontsize=16,
            color=BLUE)
    ax.text(0, -1.45, "QCD van der Waals force", ha="center", va="top", fontsize=16,
            color=MUTED)
    ax.set_title(title if title is not None else "hadrocharmonium", fontsize=16, color=INK,
                 pad=4)


def fig_pictures():
    for name, draw in (("hadron_molecule.svg", draw_molecule),
                       ("hadron_compact.svg", draw_compact),
                       ("hadron_hadrocharmonium.svg", draw_hadrocharmonium)):
        fig, ax = plt.subplots(figsize=(4.2, 4.2))
        fig.subplots_adjust(left=0.02, right=0.98, top=0.92, bottom=0.07)
        draw(ax)
        _footer(fig)
        save(fig, name)

    fig, (a1, a2) = plt.subplots(1, 2, figsize=(9, 4.2))
    fig.subplots_adjust(left=0.02, right=0.98, top=0.92, bottom=0.07, wspace=0.05)
    draw_molecule(a1, letters=False, labels=False, title="two hadrons")
    draw_compact(a2, letters=False, labels=False, title="one hadron")
    _footer(fig)
    save(fig, "hadron_pictures_2.svg")


# =========================================================================
# lineshapes_cusp_vs_pole.svg — threshold cusp vs Breit-Wigner below it
# =========================================================================
def fig_lineshapes():
    m_th = thr("Sigma_c+", "D0")                              # 4317.5
    mu = M["Sigma_c+"] * M["D0"] / (M["Sigma_c+"] + M["D0"])  # 1059.4 MeV
    a = -1.0 / HBARC                                          # a = -1 fm in MeV^-1
    m = np.linspace(4280, 4360, 1600)
    k = np.where(m >= m_th, np.sqrt(2 * mu * np.abs(m - m_th)) + 0j,
                 1j * np.sqrt(2 * mu * np.abs(m_th - m)))
    cusp = np.abs(1.0 / (-1.0 / a - 1j * k)) ** 2
    cusp /= cusp.max()
    Mbw, Gbw = 4311.9, 9.8
    bw = 1.0 / ((m - Mbw) ** 2 + Gbw ** 2 / 4)
    bw /= bw.max()

    fig, ax = plt.subplots(figsize=(11, 4.6))
    ax.plot(m, cusp, color=ORANGE, lw=2.4, zorder=3)
    ax.plot(m, bw, color=BLUE, lw=2.4, zorder=3)
    # Labelled on the curves, not in a legend box: an upper-left legend ran into
    # both the Breit-Wigner peak and the 5.6 MeV arrow above it.
    ax.text(4336, 0.50, "threshold cusp,\nno bound state", ha="left", va="bottom",
            fontsize=19, color=ORANGE, linespacing=1.25)
    ax.text(4283, 0.72, "Breit–Wigner at the\n" + r"$P_c(4312)^+$ mass",
            ha="left", va="bottom", fontsize=19, color=BLUE, linespacing=1.25)
    ax.axvline(m_th, color=MUTED, ls=(0, (4, 3)), lw=1.3, zorder=1)
    ax.text(m_th + 1.2, 0.62, r"$\Sigma_c^+\bar{D}^0$  " + f"{m_th:.1f}", ha="left", va="center",
            fontsize=18, color=MUTED)
    ax.annotate("", xy=(m_th, 1.06), xytext=(Mbw, 1.06),
                arrowprops=dict(arrowstyle="<->", color=INK, lw=1.3, mutation_scale=12,
                                shrinkA=0, shrinkB=0))
    ax.text(0.5 * (m_th + Mbw), 1.09, "5.6 MeV", ha="center", va="bottom", fontsize=14,
            color=INK)
    ax.set_xlim(4280, 4360)
    ax.set_ylim(0, 1.25)
    ax.set_yticks([])
    ax.tick_params(axis="x", labelsize=18)
    ax.set_xlabel("m(J/ψ p) (MeV)", fontsize=20)
    ax.set_ylabel("intensity (arb.)", fontsize=20)
    ax.set_title("schematic lineshapes: a cusp peaks at the threshold, a pole below it",
                 fontsize=17, color=ORANGE, pad=8)
    save(fig, "lineshapes_cusp_vs_pole.svg")


# =========================================================================
# dalitz_schematic.svg — Λb⁰ → J/ψ p K⁻ Dalitz plane
# =========================================================================
def fig_dalitz():
    Mb, mpsi, mp, mK = (M["Lambda_b"] / 1e3, M["J/psi"] / 1e3, M["p"] / 1e3, M["K"] / 1e3)
    s = np.linspace((mK + mp) ** 2, (Mb - mpsi) ** 2, 800)
    rs = np.sqrt(s)
    Ep = (s + mp ** 2 - mK ** 2) / (2 * rs)
    Epsi = (Mb ** 2 - s - mpsi ** 2) / (2 * rs)
    pp = np.sqrt(np.clip(Ep ** 2 - mp ** 2, 0, None))
    ppsi = np.sqrt(np.clip(Epsi ** 2 - mpsi ** 2, 0, None))
    ylo = (Ep + Epsi) ** 2 - (pp + ppsi) ** 2
    yhi = (Ep + Epsi) ** 2 - (pp - ppsi) ** 2

    fig, ax = plt.subplots(figsize=(7.2, 6.2))
    ax.fill_between(s, ylo, yhi, color=FAINT, alpha=0.25, lw=0, zorder=1)
    ax.plot(np.r_[s, s[::-1], s[0]], np.r_[ylo, yhi[::-1], ylo[0]], color=INK, lw=1.2, zorder=4)

    # Λ* bands (vertical), half-width m·Γ in GeV², drawn at least 0.06 GeV² wide
    lam = [("Λ(1520)", 1.5195, 0.0156), ("Λ(1690)", 1.690, 0.070),
           ("Λ(1820)", 1.820, 0.080), ("Λ(2100)", 2.100, 0.200)]
    for i, (name, mass, gam) in enumerate(lam):
        x0 = mass ** 2
        hw = max(mass * gam, 0.06)
        sel = (s >= x0 - hw) & (s <= x0 + hw)
        ax.fill_between(s[sel], ylo[sel], yhi[sel], color=ORANGE, alpha=0.35, lw=0, zorder=2)
        ax.text(x0, 26.55 + (0.55 if i % 2 else 0.0), name, ha="center", va="bottom",
                fontsize=14, color=ORANGE)

    # pentaquark bands (horizontal), drawn half-width 0.12 GeV² (≈ ×10 the real widths)
    pcs = [(r"$P_c(4312)^+$", 18.592, 18.59), (r"$P_c(4440)^+$", 19.716, 19.42),
           (r"$P_c(4457)^+$", 19.868, 20.25)]
    xr = 6.55
    for name, y0, ylab in pcs:
        lo, hi = np.maximum(y0 - 0.12, ylo), np.minimum(y0 + 0.12, yhi)
        ax.fill_between(s, lo, hi, where=lo < hi, color=BLUE, alpha=0.55, lw=0, zorder=3)
        # leader from the band's right end to a label at the right edge
        xe = s[lo < hi].max()
        ax.plot([xe, xr - 0.05], [y0, ylab], color=BLUE, lw=0.9, zorder=3)
        ax.text(xr, ylab, name, ha="left", va="center", fontsize=15, color=BLUE)
    ax.text(xr, 18.05, "widths\nexaggerated ×10", ha="left", va="top", fontsize=13,
            color=MUTED, linespacing=1.2)

    ax.set_xlim(1.8, 7.75)
    ax.set_ylim(15.6, 27.6)
    ax.set_xticks([2, 3, 4, 5, 6, 7])
    ax.set_yticks([16, 18, 20, 22, 24, 26])
    ax.tick_params(labelsize=15)
    ax.set_xlabel("m²(K⁻p) (GeV²)", fontsize=17)
    ax.set_ylabel("m²(J/ψ p) (GeV²)", fontsize=17)
    save(fig, "dalitz_schematic.svg")


# =========================================================================
# pc_thresholds.svg — the threshold ladder
# =========================================================================
def fig_thresholds():
    fig, ax = plt.subplots(figsize=(12, 5.6))
    Y_PC, Y_PCS = 1.4, 0.0
    ax.set_xlim(4250, 4550)
    ax.set_ylim(-1.55, 2.75)
    ax.set_yticks([Y_PC, Y_PCS])
    ax.set_yticklabels([r"$J/\psi\,p$", r"$J/\psi\,\Lambda$"], fontsize=21)
    ax.set_xlabel("mass (MeV)", fontsize=17)
    ax.tick_params(axis="x", labelsize=17)
    ax.tick_params(axis="y", length=0)
    ax.spines["left"].set_visible(False)

    # threshold lines: Σc-family (J/ψ p row) labelled along the top and spanning the
    # frame; Ξc-family (J/ψ Λ row) labelled along the bottom and kept below the J/ψ p row
    for key, (label, x, fam) in THRESHOLDS.items():
        col = MUTED if fam == "c" else ORANGE
        if fam == "c":
            ax.vlines(x, -1.55, 2.18, color=col, ls=(0, (4, 3)), lw=1.2, alpha=0.9, zorder=1)
            ax.text(x, 2.72, f"{label}\n{x:.1f}", ha="center", va="top", fontsize=16,
                    color=col, linespacing=1.15, zorder=3)
        else:
            ax.vlines(x, -0.92, 0.62, color=col, ls=(0, (4, 3)), lw=1.2, alpha=0.9, zorder=1)
            ax.text(x, -1.02, f"{label}\n{x:.1f}", ha="center", va="top", fontsize=16,
                    color=col, linespacing=1.15, zorder=3)
    for key, (label, x, fam) in THRESHOLD_TICKS.items():
        ax.vlines(x, -0.92, 0.62, color=ORANGE, ls=(0, (2, 3)), lw=1.0, alpha=0.4, zorder=1)

    def band(x, w, y, col, alpha, h=0.34):
        ax.add_patch(Rectangle((x - w / 2, y - h / 2), w, h, facecolor=col,
                               edgecolor="none", alpha=alpha, zorder=2))

    # broad P_c(4380): faint wide band
    name, x, w = PC_BROAD
    band(x, w, Y_PC, BLUE, 0.13, h=0.42)
    ax.text(x, Y_PC + 0.32, f"{name}, broad, candidate", ha="center", va="bottom",
            fontsize=15, color=MUTED, linespacing=1.15)

    # narrow P_c: band = width, filled marker = mass, label with distance to threshold
    for name, x, w, key in PC_NARROW:
        band(x, w, Y_PC, BLUE, 0.45)
        ax.plot([x], [Y_PC], marker="o", ms=9, color=BLUE, mec=INK, mew=1.2, zorder=4)
        d = x - THRESHOLDS[key][1]
        txt = f"{name}\n{d:+.1f} MeV"
        if "4440" in name:
            ax.text(x, Y_PC - 0.32, txt, ha="center", va="top", fontsize=17,
                    color=INK, linespacing=1.15)
        else:
            ax.text(x, Y_PC + 0.32, txt, ha="center", va="bottom", fontsize=17,
                    color=INK, linespacing=1.15)

    # P_c(4337)+: evidence only, hollow marker, no charm-baryon–antimeson threshold nearby
    name, x, w = PC_EVIDENCE
    band(x, w, Y_PC, BLUE, 0.20)
    ax.plot([x], [Y_PC], marker="o", ms=9, mfc="none", mec=BLUE, mew=2, zorder=4)
    ax.text(x, Y_PC - 0.32,
            f"{name} · evidence · " + r"$B_s^0 \to J/\psi\,p\,\bar{p}$" + "\nabove ΣcD̄, not below",
            ha="center", va="top", fontsize=14, color=MUTED, linespacing=1.15)

    for name, x, w, key in PCS:
        band(x, w, Y_PCS, ORANGE, 0.45)
        ax.plot([x], [Y_PCS], marker="o", ms=9, color=ORANGE, mec=INK, mew=1.2, zorder=4)
        d = x - THRESHOLDS[key][1]
        ax.text(x, Y_PCS - 0.30, f"{name}\n{d:+.1f} MeV", ha="center", va="top",
                fontsize=17, color=INK, linespacing=1.15)

    save(fig, "pc_thresholds.svg")


# =========================================================================
# lhcb_lumi.svg — recorded luminosity
# =========================================================================
def fig_lumi():
    labels = ["Runs 1–2\n2011–18", "2024", "2025", "2026"]
    # 2024 = 9.56 fb⁻¹ (LHCb, Comput. Softw. Big Sci. 9 (2025) 15); bars at one decimal
    vals = [9.0, 9.6, 11.8, 5.3]
    cols = [BLUE, ORANGE, ORANGE, ORANGE]
    fig, ax = plt.subplots(figsize=(9.5, 5.2))
    fig.subplots_adjust(bottom=0.16)
    xs = range(len(vals))
    ax.bar(xs, vals, width=0.58, color=cols, edgecolor="none", zorder=2)
    for x, v in zip(xs, vals):
        ax.text(x, v + 0.25, f"{v:.1f}", ha="center", va="bottom", fontsize=20, color=INK)
    ax.set_xticks(list(xs))
    ax.set_xticklabels(labels, fontsize=17)
    ax.set_ylabel("recorded luminosity (fb⁻¹)", fontsize=17)
    ax.set_ylim(0, 18.5)
    ax.set_yticks([0, 5, 10, 15])
    ax.tick_params(axis="y", labelsize=16)
    ax.yaxis.grid(True, color=FAINT, lw=0.6, alpha=0.5, zorder=0)
    ax.set_axisbelow(True)

    # bracket over the three Run 3 years
    yb = 13.9
    ax.plot([0.7, 0.7, 3.3, 3.3], [yb - 0.4, yb, yb, yb - 0.4], color=INK, lw=1.3)
    ax.text(2.0, yb + 0.3, f"Run 3 pp 2024–26: {sum(vals[1:]):.1f} fb⁻¹", ha="center",
            va="bottom", fontsize=19, color=INK)
    # note on the first bar
    ax.annotate("every result since 2019:\nthis 9 fb⁻¹", xy=(0, 9.0), xytext=(-0.42, 16.4),
                ha="left", va="center", fontsize=16, color=MUTED, linespacing=1.2,
                arrowprops=dict(arrowstyle="-", color=MUTED, lw=1.0, shrinkA=16, shrinkB=22))
    # Sources are on the slide footer; the 2024 value is a presenter check (speaker note).
    save(fig, "lhcb_lumi.svg")


# =========================================================================
# lambda_b_decay.svg — the two decay paths
# =========================================================================
def fig_decay():
    fig, (a1, a2) = plt.subplots(1, 2, figsize=(10.5, 4.6))
    fig.subplots_adjust(left=0.01, right=0.99, top=0.9, bottom=0.03, wspace=0.12)
    for ax in (a1, a2):
        ax.set_xlim(0, 10)
        ax.set_ylim(0, 5)
        ax.axis("off")
    FS, FQ, FT = 22, 16, 18

    def arrow(ax, p0, p1, col, lw=2.2, ls="-", to_vertex=False):
        ax.annotate("", xy=p1, xytext=p0,
                    arrowprops=dict(arrowstyle="-|>", color=col, lw=lw, linestyle=ls,
                                    mutation_scale=16, shrinkA=0, shrinkB=9 if to_vertex else 0))

    def vtx(ax, p, col):
        ax.plot([p[0]], [p[1]], marker="o", ms=8, color=col, mec=INK, mew=1.0, zorder=5)

    def lab(ax, x, y, s, col=INK, ha="center", fs=FS):
        ax.text(x, y, s, ha=ha, va="center", fontsize=fs, color=col)

    LB = r"$\Lambda_b^0$"
    # --- left: pentaquark path ---
    v1, v2 = (3.2, 2.5), (6.6, 2.0)
    lab(a1, 0.2, 2.55, LB, ha="left")
    lab(a1, 0.2, 1.95, "udb", MUTED, ha="left", fs=FQ)
    arrow(a1, (1.3, 2.5), v1, INK, to_vertex=True)
    arrow(a1, v1, (6.4, 4.3), INK)
    lab(a1, 6.6, 4.3, "K⁻", ha="left")
    lab(a1, 7.75, 4.3, "sū", MUTED, ha="left", fs=FQ)
    arrow(a1, v1, v2, BLUE, lw=3.0, to_vertex=True)
    lab(a1, 4.9, 1.5, r"$P_c^+$", BLUE)
    lab(a1, 4.9, 0.95, "cc̄uud", MUTED, fs=FQ)
    arrow(a1, v2, (9.0, 3.2), BLUE)
    lab(a1, 9.15, 3.2, "J/ψ", ha="left")
    lab(a1, 9.15, 2.65, "cc̄", MUTED, ha="left", fs=FQ)
    arrow(a1, v2, (9.0, 0.9), BLUE)
    lab(a1, 9.15, 0.9, "p", ha="left")
    lab(a1, 9.15, 0.35, "uud", MUTED, ha="left", fs=FQ)
    vtx(a1, v1, INK)
    vtx(a1, v2, BLUE)
    a1.set_title("pentaquark path: peak in m(J/ψ p)", fontsize=FT, color=BLUE, pad=8)

    # --- right: conventional Λ* path ---
    w1, w2 = (3.2, 2.5), (6.6, 2.0)
    lab(a2, 0.2, 2.55, LB, ha="left")
    lab(a2, 0.2, 1.95, "udb", MUTED, ha="left", fs=FQ)
    arrow(a2, (1.3, 2.5), w1, INK, to_vertex=True)
    arrow(a2, w1, (6.4, 4.3), INK)
    lab(a2, 6.6, 4.3, "J/ψ", ha="left")
    lab(a2, 8.05, 4.3, "cc̄", MUTED, ha="left", fs=FQ)
    arrow(a2, w1, w2, ORANGE, lw=3.0, to_vertex=True)
    lab(a2, 4.9, 1.5, "Λ*", ORANGE)
    lab(a2, 4.9, 0.95, "uds", MUTED, fs=FQ)
    arrow(a2, w2, (9.0, 3.2), ORANGE)
    lab(a2, 9.15, 3.2, "p", ha="left")
    lab(a2, 9.15, 2.65, "uud", MUTED, ha="left", fs=FQ)
    arrow(a2, w2, (9.0, 0.9), ORANGE)
    lab(a2, 9.15, 0.9, "K⁻", ha="left")
    lab(a2, 9.15, 0.35, "sū", MUTED, ha="left", fs=FQ)
    vtx(a2, w1, INK)
    vtx(a2, w2, ORANGE)
    a2.set_title("Λ* path: peak in m(K⁻p)", fontsize=FT, color=ORANGE, pad=8)

    save(fig, "lambda_b_decay.svg")


def print_threshold_table():
    """Threshold table for the backup slide (inputs: PDG 2024 masses in M)."""
    print("thresholds (MeV), PDG 2024, charge-consistent pairs:")
    rows = [(k, v, fam) for k, (_, v, fam) in THRESHOLDS.items()]
    rows += [(k, v, fam) for k, (_, v, fam) in THRESHOLD_TICKS.items()]
    for key, v, fam in sorted(rows, key=lambda r: r[1]):
        print(f"  {key:8s} {v:7.1f}   row {'J/psi p' if fam == 'c' else 'J/psi Lambda'}")
    print("offsets to the nearest threshold (MeV):")
    for name, x, w, key in PC_NARROW + PCS:
        print(f"  {name:22s} {x:7.1f}  Γ {w:5.1f}   {x - THRESHOLDS[key][1]:+.1f}  ({key})")


if __name__ == "__main__":
    print_threshold_table()
    fig_argand()
    fig_pictures()
    fig_lineshapes()
    fig_dalitz()
    fig_thresholds()
    fig_lumi()
    fig_decay()
