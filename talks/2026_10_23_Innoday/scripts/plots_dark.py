#!/usr/bin/env python3
"""LHCb's result plots as light on black, for slide 12's `plot`s (setup/plots.js).

The plots are drawn additively, as OpenData's are (its setup/sun.js): their
black is the world's, and the ink is light. Each paper's figure (black ink on
white, cropped: public/figures/lhcb/res_*.png) is turned over in lightness with
its hue kept (HLS L' = 1 - L: c' = c + 1 - max - min), the ground pushed to
pure black, white ink set at OpenData's #e8ecf4 (under the bloom's threshold:
lines stay sharp), a saturated colour too dark on black lifted toward white,
hairlines thickened (3x3 max: on screen a plot is drawn some 2-3x smaller than
its pixels), then saved 1280 wide as JPEG.

    python3 scripts/plots_dark.py            # every public/figures/lhcb/res_*.png
    python3 scripts/plots_dark.py res_rk.png # one

CC BY 4.0 asks that changes be indicated: the credit on the last slide says
"apkarpyti, perspalvinti".
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

DIR = Path(__file__).resolve().parent.parent / "public/figures/lhcb"
INK = np.array([0xE8, 0xEC, 0xF4]) / 255
WIDTH = 1280
LUMA = np.array([0.2126, 0.7152, 0.0722])


def dark(src: Path, out: Path) -> tuple[int, int]:
    im = np.asarray(Image.open(src).convert("RGB")).astype(np.float32) / 255
    mx, mn = im.max(2, keepdims=True), im.min(2, keepdims=True)
    inv = np.clip(im + (1 - mx - mn), 0, 1)
    inv = np.where(inv.max(2, keepdims=True) < 0.06, 0, inv)       # a pure black ground
    # a saturated colour (pure blue: Pc(4312), the Σc D̄⁰ line) is dim on black: lift
    # it toward white until its luminance is 0.45 of its chroma's worth
    chroma = inv.max(2, keepdims=True) - inv.min(2, keepdims=True)
    y = (inv * LUMA).sum(2, keepdims=True)
    want = 0.45 * chroma
    a = np.clip((want - y) / np.maximum(1 - y, 1e-3), 0, 1)
    inv = inv + (1 - inv) * a
    inv *= INK
    img = Image.fromarray((inv * 255 + 0.5).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))
    img = img.resize((WIDTH, round(img.height * WIDTH / img.width)), Image.LANCZOS)
    img.save(out, quality=90)
    return img.size


def main() -> None:
    names = sys.argv[1:] or sorted(p.name for p in DIR.glob("res_*.png"))
    for n in names:
        src = DIR / n
        out = src.with_suffix(".jpg")
        w, h = dark(src, out)
        print(f"{out.relative_to(DIR.parent.parent.parent)}  {w}x{h}  {out.stat().st_size // 1024} KB")


if __name__ == "__main__":
    main()
