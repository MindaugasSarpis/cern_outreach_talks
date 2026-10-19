#!/usr/bin/env python3
"""Crop the fetched LHCb paper figures for the hadron-space stop HUD.

Run by scripts/fetch_figures.sh after the downloads; safe to run alone.

Two steps, both deterministic and idempotent:

1. Panel picks: a few of the paper PNGs are multi-panel plates and only one
   panel is the state under discussion. PANELS gives the fractional box.
2. For every paper PNG (the `_crop.png` outputs excluded), trim the white
   margin — bounding box of pixels with any channel < 245, plus a 12 px pad —
   cap the width at MAX_W, and write `<name>_crop.png` beside the original.

The untrimmed originals stay for reference.
"""
from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops

DIR = Path(__file__).resolve().parent.parent / "public" / "figures" / "papers"
THRESHOLD = 245     # a pixel is "ink" if any channel is darker than this
PAD = 12            # px of white kept around the ink
MAX_W = 1600        # px; wider crops are downscaled (LANCZOS), aspect kept

# name -> (left, top, right, bottom) as fractions of the source size.
PANELS = {
    # Fig. 6 of PRL 115 (2015) 072001: (a) Pc(4450)+ Argand, (b) Pc(4380)+.
    "LHCb-PAPER-2015-029_DoubleArgand-final.png": (0.0, 0.0, 0.505, 1.0),
}


def on_white(im: Image.Image) -> Image.Image:
    """RGB copy with any transparency flattened onto white."""
    if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
        rgba = im.convert("RGBA")
        bg = Image.new("RGBA", rgba.size, (255, 255, 255, 255))
        return Image.alpha_composite(bg, rgba).convert("RGB")
    return im.convert("RGB")


def ink_box(im: Image.Image) -> tuple[int, int, int, int] | None:
    """Bounding box of everything that is not near-white, padded."""
    r, g, b = on_white(im).split()
    darkest = ImageChops.darker(ImageChops.darker(r, g), b)   # min channel
    box = darkest.point(lambda v: 255 if v < THRESHOLD else 0).getbbox()
    if not box:
        return None
    l, t, r_, b_ = box
    return (max(0, l - PAD), max(0, t - PAD),
            min(im.width, r_ + PAD), min(im.height, b_ + PAD))


def crop_one(src: Path) -> Path:
    im = Image.open(src)
    frac = PANELS.get(src.name)
    if frac:
        w, h = im.size
        im = im.crop((round(frac[0] * w), round(frac[1] * h),
                      round(frac[2] * w), round(frac[3] * h)))
    box = ink_box(im)
    if box:
        im = im.crop(box)
    if im.width > MAX_W:
        im = im.resize((MAX_W, round(im.height * MAX_W / im.width)), Image.LANCZOS)
    out = src.with_name(src.stem + "_crop.png")
    on_white(im).save(out, optimize=True)
    return out


def main() -> int:
    srcs = sorted(p for p in DIR.glob("*.png") if not p.stem.endswith("_crop"))
    for src in srcs:
        out = crop_one(src)
        with Image.open(src) as a, Image.open(out) as b:
            print(f"{src.name:<62} {a.size[0]}x{a.size[1]} -> {b.size[0]}x{b.size[1]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
