#!/usr/bin/env python3
"""Digitise the 2019 LHCb Dalitz plot of Lb -> J/psi p K- candidates into a count grid.

Source: LHCb, Phys. Rev. Lett. 122, 222001 (2019) (LHCb-PAPER-2019-014), Dalitz-plot
figure, CC BY 4.0; the PNG is the Startertalk's copy
(talks/2026_09_15_Startertalk/public/figures/papers/LHCb-PAPER-2019-014_Dalitz_plot_pc.png).

Each drawn cell's interior median colour is matched to the colour bar (log scale, 1 at the
bar's bottom tick, 10 at the next major tick), giving an approximate integer count; white = 0.
The "LHCb" label's cells are filled from their neighbours. Writes public/data/dalitz-2019.json
and bake/dalitz_check.png (the grid redrawn with the bar's own palette, to compare by eye).

    python3 bake/dalitz_digitise.py [source.png]
"""
import json, sys
from pathlib import Path
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
SRC = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE.parents[2] / \
    "talks/2026_09_15_Startertalk/public/figures/papers/LHCb-PAPER-2019-014_Dalitz_plot_pc.png"
OUT = HERE.parent / "public/data/dalitz-2019.json"

# Calibration, pixel index coordinates, from the minor ticks (fits checked against the labels):
# x: 2.0 GeV^2 at col 119.6, 6.5 at col 970.9 (189.19 px/GeV^2)
# y: 26.5 GeV^2 at row 18.7, 16.0 at row 781.3 (72.63 px/GeV^2)
X0, X1, XLO, XHI = 119.6, 970.9, 2.0, 6.5
Y0, Y1, YHI, YLO = 18.7, 781.3, 26.5, 16.0
NX = NY = 200                       # cells measured: 4.257 px x 3.813 px (FFT of cell edges)
DX_SHIFT, DY_SHIFT = -0.2, +0.5     # cell-edge phase measured against the tick grid, px
# Colour bar: column 985, log10(count) = (781.5 - row) / 344.0 (ticks: 1 at 781.5, 10 at 437.5)
BAR_COL, BAR_TOP, BAR_BOT, ROW1, PX_DECADE = 985, 20, 780, 781.5, 344.0
LHCB_BOX = (745, 856, 110, 149)     # x0, x1, y0, y1 px of the "LHCb" text (+ margin)
TICK_COLS = (121, 156)              # the left axis ticks reach into the frame this far, px
# Kinematic limits (PDG masses): m2(Kp) 2.051-6.364, m2(J/psi p) 16.28-26.27 GeV^2; cells
# wholly outside are 0 (this also drops the bottom axis ticks)
KX, KY = ((0.49368 + 0.93827) ** 2, (5.61960 - 3.09690) ** 2), ((3.09690 + 0.93827) ** 2, (5.61960 - 0.49368) ** 2)

img = np.asarray(Image.open(SRC).convert("RGB")).astype(float)

# Colour bar: discrete palette bands, each with its log10 range
rows = np.arange(BAR_TOP, BAR_BOT + 1)
bar = img[rows, BAR_COL]
bands = []  # (rgb, logv_lo, logv_hi)
start = 0
for i in range(1, len(rows) + 1):
    if i == len(rows) or np.abs(bar[i] - bar[start]).sum() > 0:
        r_hi, r_lo = rows[start], rows[i - 1]  # top row, bottom row
        bands.append((bar[start:i].mean(0), (ROW1 - r_lo - 0.5) / PX_DECADE, (ROW1 - r_hi + 0.5) / PX_DECADE))
        start = i
band_rgb = np.array([b[0] for b in bands])

def band_count(k):
    lo, hi = 10 ** bands[k][1], 10 ** bands[k][2]
    ints = [n for n in range(max(1, int(np.floor(lo))), int(np.ceil(hi)) + 1) if lo - 0.02 * lo <= n <= hi + 0.02 * hi]
    mid = np.sqrt(max(lo, 1.0) * hi)
    return min(ints, key=lambda n: abs(np.log(n / mid))) if ints else int(round(mid))

band_n = np.array([band_count(k) for k in range(len(bands))])

wx, hy = (X1 - X0) / NX, (Y1 - Y0) / NY
counts = np.zeros((NY, NX), int)          # row 0 = top of the picture (y = 26.5)
masked = np.zeros((NY, NX), bool)
gray = (np.ptp(img, axis=2) < 12) & (img.sum(2) < 600)   # the LHCb label's black/grey ink
tick = np.zeros(gray.shape, bool)                         # the left ticks: grey ink at the left edge
tick[:, TICK_COLS[0]:TICK_COLS[1]] = gray[:, TICK_COLS[0]:TICK_COLS[1]]
tick = tick | np.roll(tick, 1, 0) | np.roll(tick, -1, 0)  # and their anti-aliased rows
bot = np.zeros(gray.shape, bool); bot[758:781] = gray[758:781]      # the bottom ticks
tick |= bot | np.roll(bot, 1, 1) | np.roll(bot, -1, 1)
ticked = np.zeros((NY, NX), bool)
for j in range(NY):
    cy = Y0 + (j + 0.5) * hy + DY_SHIFT
    r0, r1 = int(round(cy - 1)), int(round(cy + 1)) + 1
    for i in range(NX):
        cx = X0 + (i + 0.5) * wx + DX_SHIFT
        c0, c1 = int(round(cx - 1)), int(round(cx + 1)) + 1
        bx0, bx1, by0, by1 = LHCB_BOX
        if bx0 <= cx <= bx1 and by0 <= cy <= by1 and gray[r0 - 2:r1 + 2, c0 - 2:c1 + 2].any():
            masked[j, i] = True
            continue
        x_lo, y_lo = XLO + i * (XHI - XLO) / NX, YHI - (j + 1) * (YHI - YLO) / NY
        if x_lo + (XHI - XLO) / NX < KX[0] or x_lo > KX[1] or y_lo + (YHI - YLO) / NY < KY[0] or y_lo > KY[1]:
            continue
        keep = ~tick[r0:r1, c0:c1].ravel()
        if keep.sum() < 3:
            ticked[j, i] = True
            continue
        med = np.median(img[r0:r1, c0:c1].reshape(-1, 3)[keep], axis=0)
        if med.min() >= 254.5:      # white: empty (count 1 is (253,253,253))
            continue
        k = int(np.argmin(((band_rgb - med) ** 2).sum(1)))
        counts[j, i] = band_n[k]

# Fill the label's cells with the mean of unmasked neighbours (5x5)
for j, i in zip(*np.where(masked)):
    nb = counts[max(0, j - 2):j + 3, max(0, i - 2):i + 3][~masked[max(0, j - 2):j + 3, max(0, i - 2):i + 3]]
    counts[j, i] = int(round(nb.mean())) if nb.size else 0
# Cells under a left tick: the mean of the unticked cells above and below in the same column
for j, i in zip(*np.where(ticked)):
    nb = [counts[jj, i] for jj in (j - 2, j - 1, j + 1, j + 2) if 0 <= jj < NY and not ticked[jj, i]]
    counts[j, i] = int(round(np.mean(nb))) if nb else 0

# Zero cells wholly outside the Dalitz boundary (light grey anti-aliasing of the ticks reads as 1)
MLB, MK, MP, MPSI = 5.61960, 0.49368, 0.93827, 3.09690
def yrange(x):  # m2(J/psi p) limits at m2(Kp) = x
    rx = np.sqrt(x); ep = (x - MK**2 + MP**2) / (2 * rx); es = (MLB**2 - x - MPSI**2) / (2 * rx)
    pp, ps = np.sqrt(np.maximum(ep**2 - MP**2, 0)), np.sqrt(np.maximum(es**2 - MPSI**2, 0))
    return (ep + es) ** 2 - (pp + ps) ** 2, (ep + es) ** 2 - (pp - ps) ** 2
outside = 0
for j, i in zip(*np.where(counts > 0)):
    xs = np.clip(XLO + (i + np.linspace(0, 1, 6)) * (XHI - XLO) / NX, KX[0], KX[1])
    ylo, yhi = yrange(xs); c_lo = YHI - (j + 1) * (YHI - YLO) / NY; c_hi = c_lo + (YHI - YLO) / NY
    if not np.any((yhi >= c_lo) & (ylo <= c_hi)):
        outside += counts[j, i]; counts[j, i] = 0
grid = counts[::-1]                 # y outer from y lo = 16 upward, x inner
OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps({
    "source": "LHCb, Phys. Rev. Lett. 122, 222001 (2019), Fig. (Dalitz plot of Λb → J/ψ p K⁻ candidates), "
              "CC BY 4.0; digitised from the figure's colours (log scale), counts approximate",
    "x": {"name": "m²(Kp)", "unit": "GeV²", "lo": XLO, "bin": (XHI - XLO) / NX, "n": NX},
    "y": {"name": "m²(J/ψp)", "unit": "GeV²", "lo": YLO, "bin": (YHI - YLO) / NY, "n": NY},
    "counts": grid.tolist(), "total": int(grid.sum())}, ensure_ascii=False, separators=(",", ":")))

# Check image: each cell drawn with the bar colour for its count, same pixel size as the source
lut_log = np.array([(b[1] + b[2]) / 2 for b in bands])
chk = np.full((NY, NX, 3), 255, np.uint8)
nz = counts > 0
k = np.abs(lut_log[None, :] - np.log10(np.maximum(counts[nz], 1))[:, None]).argmin(1)
chk[nz] = band_rgb[k].astype(np.uint8)
Image.fromarray(chk).resize((int(X1 - X0), int(Y1 - Y0)), Image.NEAREST).save(HERE / "dalitz_check.png")

print(f"bands {len(bands)}; cells nonzero {int(nz.sum())}; label cells {int(masked.sum())}; tick cells {int(ticked.sum())}; zeroed outside the boundary {outside}; total {int(grid.sum())}; max {grid.max()}")
print("wrote", OUT)
