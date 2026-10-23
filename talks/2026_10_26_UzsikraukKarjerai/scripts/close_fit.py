"""Slide 20's close (close_lhc_fcc.mp4, Innoday's close_home.mp4) fitted for TV: the 23 Oct review.

Post-processing only; the scene that rendered the clip belongs to Innoday and is not touched.
Four fixes, each from measurements of the source (1080p50, silent, BT.709 tv range):

1. The black dip between the SciFi flag and the LHCb point cloud is cut. The flag's
   luminance holds a plateau (mean ~75/255 at 1.8-2.1 s), then falls as the camera
   pulls back; the dip bottoms out at ~0.3 (4.6-5.3 s) and the point cloud arrives at
   ~5.46 s. The outgoing flag is kept until its mean falls below DIP_OUT of the plateau
   (~2.46 s), then dissolves over XF_FRAMES into the point cloud from its arrival
   (first frame after the dip at >= ARRIVE_LUM). Frame 0 passes through bit-exact.
2. Over the climb to the map (from FIT_T0, where the frame's border is black) the picture
   is scaled and moved, eased in over FIT_EASE, so that by the end the LHC ring, the FCC
   ring and the LHCb logo sit inside the TV safe box (x 96-1824, y 108-800). The source
   frame's own edges are feathered to black as it shrinks, so the map's lines fade out
   instead of ending at a hard edge.
3. From ENH_T0 to ENH_T1 a masked boost comes in over the map: thin structures (the
   top-hat over a 13 px opening, so glows and the flag are left alone) are thickened by
   a 5 px grey dilation and lifted on a square-root curve (dim lake/border dashes ~15 ->
   ~60, coastlines ~45 -> ~110, the rings ~200 -> ~225), capped at 245 so the rings do not
   blow out. The logo itself is excluded.
4. The upside-down copy of "LHCb" with the red slash under the logo is removed: the logo
   is tracked every frame (normalised cross-correlation of its top-hat against the last
   frame's logo, multi-scale), and the box below its baseline is filled with a grey
   opening of itself (the glow stays, the strokes go). NB: the official LHCb logo has
   this mirrored "LHCb" and red slash as part of its design; --keep-mirror skips step 4.

python scripts/close_fit.py [SRC] [OUT]      (defaults: ../../videos/raw/innoday/close_home.mp4 ->
                                              ../../videos/raw/close_lhc_fcc.mp4, the deck's raw; run with --keep-mirror)
  --plan          measure and print the cut, the track and the fit; write nothing
  --stills DIR --at 2400,2859   write the processed source frames as PNGs, no video
Run under `pnpm talk render --`. Needs numpy and OpenCV (opencv-python-headless).
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from multiprocessing import Pool
from pathlib import Path

import cv2
import numpy as np

W, H = 1920, 1080
FPS = 50
FRAME = W * H * 3 // 2            # one yuv420p frame
END = 2860                        # the old cut: 0:00-0:57.2, frames 0..2859

# 1. the dip
DIP_OUT = 0.85                    # the flag dissolves once its mean falls below this x plateau
ARRIVE_LUM = 1.0                  # the point cloud has arrived at this mean luminance (of 255)
XF_FRAMES = 25                    # the dissolve, 0.5 s

# 2. the fit
FIT_T0, FIT_EASE = 38.0, 5.0      # s (source); smootherstep from FIT_T0 to FIT_T0 + FIT_EASE
SAFE = (96, 108, 1824, 800)       # x0, y0, x1, y1
SAFE_PAD = 10                     # px (output) left inside the safe box
FEATHER = 90                      # px (source) of edge fade at the full fit

# 3. the map boost
ENH_T0, ENH_T1 = 42.0, 46.0       # s (source); smoothstep
GAMMA = 0.5                       # the lift on thin structures
CAP = 245.0                       # max channel after the lift, unless it was brighter already
TOE = (3.0, 11.0)                 # no lift below the first, full lift above the second (noise floor)

# 4. the logo
LOGO_TPL = (278, 72, 488, 142)    # the logo (above its baseline) in the source's last frame
COPY_REL = (-12, 69, 224, 142)    # the mirrored copy relative to LOGO_TPL's corner, at scale 1
LOGO_FROM = 2040                  # the logo fades in at ~2043 (40.86 s)
NCC_OK = 0.6

ROOT = Path(__file__).resolve().parents[3]


def smoothstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3 - 2 * x)


def smootherstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * x * (x * (6 * x - 15) + 10)


# ---------- YUV (BT.709, tv range) <-> RGB float ----------

def yuv_planes(buf):
    a = np.frombuffer(buf, np.uint8)
    y = a[:W * H].reshape(H, W)
    u = a[W * H:W * H * 5 // 4].reshape(H // 2, W // 2)
    v = a[W * H * 5 // 4:].reshape(H // 2, W // 2)
    return y, u, v


def yuv_to_rgb(buf):
    y, u, v = yuv_planes(buf)
    yl = (y.astype(np.float32) - 16) * (255 / 219)
    pb = (cv2.resize(u, (W, H), interpolation=cv2.INTER_LINEAR).astype(np.float32) - 128) * (255 / 224)
    pr = (cv2.resize(v, (W, H), interpolation=cv2.INTER_LINEAR).astype(np.float32) - 128) * (255 / 224)
    r = yl + 1.5748 * pr
    b = yl + 1.8556 * pb
    g = (yl - 0.2126 * r - 0.0722 * b) / 0.7152
    return np.clip(np.dstack([r, g, b]), 0, 255)


def rgb_to_yuv(rgb):
    rgb = np.clip(rgb, 0, 255).astype(np.float32)
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    yl = 0.2126 * r + 0.7152 * g + 0.0722 * b
    y = 16 + yl * (219 / 255)
    cb = (b - yl) / 1.8556
    cr = (r - yl) / 1.5748
    cb = 128 + cv2.resize(cb, (W // 2, H // 2), interpolation=cv2.INTER_AREA) * (224 / 255)
    cr = 128 + cv2.resize(cr, (W // 2, H // 2), interpolation=cv2.INTER_AREA) * (224 / 255)
    out = [np.clip(np.rint(p), 0, 255).astype(np.uint8).ravel() for p in (y, cb, cr)]
    return np.concatenate(out).tobytes()


def luma_mean(buf):
    """Mean luminance of a yuv420p frame, on a 0-255 scale (full range)."""
    y = np.frombuffer(buf, np.uint8, count=W * H)
    return (float(y.mean()) - 16) * 255 / 219


def decode(src, n, start=0, fmt='yuv420p'):
    cmd = ['ffmpeg', '-v', 'error', '-i', str(src), '-map', '0:v:0']
    if start:
        cmd += ['-vf', f"select=gte(n\\,{start})", '-vsync', '0']
    cmd += ['-frames:v', str(n), '-f', 'rawvideo', '-pix_fmt', fmt, '-']
    size = FRAME if fmt == 'yuv420p' else W * H * (1 if fmt == 'gray' else 3)
    p = subprocess.Popen(cmd, stdout=subprocess.PIPE, bufsize=size * 4)
    while True:
        b = p.stdout.read(size)
        if len(b) < size:
            break
        yield b
    p.stdout.close()
    p.wait()


# ---------- measurements ----------

def measure_cut(src):
    lum = np.array([luma_mean(b) for b in decode(src, 400)])
    pk = 50 + int(np.argmax(lum[50:160]))
    plateau = lum[pk]
    a0 = pk + int(np.argmax(lum[pk:] < DIP_OUT * plateau))
    dmin = a0 + int(np.argmin(lum[a0:a0 + 200]))
    b0 = dmin + int(np.argmax(lum[dmin:] >= ARRIVE_LUM))
    return dict(plateau=plateau, plateau_frame=pk, a0=a0, dip_min=float(lum[dmin]), dip_min_frame=dmin,
                b0=b0, lum=lum)


KTH = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (21, 21))
KTH_HALF = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))


def tophat(g, k=KTH):
    return cv2.morphologyEx(g.astype(np.float32), cv2.MORPH_TOPHAT, k)


def ncc_valid(img, t, r):
    th, tw = t.shape
    mu = cv2.boxFilter(img, -1, (tw, th), normalize=True, anchor=(0, 0), borderType=cv2.BORDER_CONSTANT)
    mu2 = cv2.boxFilter(img * img, -1, (tw, th), normalize=True, anchor=(0, 0), borderType=cv2.BORDER_CONSTANT)
    sd = np.sqrt(np.maximum(mu2 - mu * mu, 0))[:r.shape[0], :r.shape[1]]
    r = r.copy()
    r[(sd < 3) | ~np.isfinite(r)] = -1
    return r


def match(img, tpl, scales, roi=None):
    """Best (ncc, scale, x, y) of tpl in img (both top-hat float32), x/y in img coords."""
    x0 = y0 = 0
    if roi is not None:
        x0, y0, x1, y1 = roi
        x0, y0 = max(0, x0), max(0, y0)
        img = img[y0:min(img.shape[0], y1), x0:min(img.shape[1], x1)]
    best = (-1.0, 1.0, 0, 0)
    for s in scales:
        t = cv2.resize(tpl, None, fx=s, fy=s, interpolation=cv2.INTER_AREA if s < 1 else cv2.INTER_LINEAR)
        if t.shape[0] >= img.shape[0] or t.shape[1] >= img.shape[1] or t.shape[0] < 5:
            continue
        r = ncc_valid(img, t, cv2.matchTemplate(img, t, cv2.TM_CCOEFF_NORMED))
        _, m, _, loc = cv2.minMaxLoc(r)
        if m > best[0]:
            best = (m, s, loc[0] + x0, loc[1] + y0)
    return best


def track_logo(src, last_gray):
    """Per frame from LOGO_FROM to END-1: (x, y, scale, ncc) of the logo's template box."""
    x0, y0, x1, y1 = LOGO_TPL
    tpl_full = tophat(last_gray)[y0:y1, x0:x1]
    tpl_half = tophat(cv2.resize(last_gray, (W // 2, H // 2), interpolation=cv2.INTER_AREA), KTH_HALF)[y0 // 2:y1 // 2, x0 // 2:x1 // 2]
    rows, prev = [], None
    for k, b in enumerate(decode(src, END - LOGO_FROM, LOGO_FROM, 'gray')):
        g = np.frombuffer(b, np.uint8).reshape(H, W)
        if prev is None or prev[3] < NCC_OK:
            half = tophat(cv2.resize(g, (W // 2, H // 2), interpolation=cv2.INTER_AREA), KTH_HALF)
            m, s, x, y = match(half, tpl_half, np.arange(0.5, 1.45, 0.03))
            if m >= NCC_OK:          # refine at full resolution
                cand = (2 * x, 2 * y, s)
            else:
                rows.append((np.nan, np.nan, np.nan, m))
                prev = rows[-1]
                continue
        else:
            cand = prev[:3]
        cx, cy, cs = cand
        roi = (int(cx) - 40, int(cy) - 40, int(cx + (x1 - x0) * cs) + 40, int(cy + (y1 - y0) * cs) + 40)
        gt = tophat(g[max(0, roi[1]):roi[3], max(0, roi[0]):roi[2]])
        m, s, x, y = match(gt, tpl_full, cs + np.arange(-0.03, 0.031, 0.005))
        rows.append((x + max(0, roi[0]), y + max(0, roi[1]), s, m))
        prev = rows[-1]
    tr = np.array(rows, float)
    ok = tr[:, 3] >= NCC_OK
    if not ok.any():
        raise SystemExit('logo: no confident match')
    # smooth the confident stretch (5-frame centred mean), extrapolate before it linearly
    first = int(np.argmax(ok))
    for c in range(3):
        col = tr[:, c].copy()
        idx = np.where(ok)[0]
        col = np.interp(np.arange(len(col)), idx, col[idx])
        pad = np.pad(col, 2, mode='edge')
        sm = np.convolve(pad, np.ones(5) / 5, mode='valid')
        if first > 0:
            v = (sm[first + 10] - sm[first]) / 10
            sm[:first] = sm[first] - v * (first - np.arange(first))
        tr[:, c] = sm
    return tr, first


def rings_bbox(rgb, logo_box):
    """FCC ring (orange dashes) and LHC ring (white loop) bounding boxes in an RGB frame."""
    f = rgb.astype(np.int16)
    r, g, b = f[..., 0], f[..., 1], f[..., 2]
    orange = ((r > 140) & (g > 50) & (g < 190) & (b < 110) & (r - b > 90)).astype(np.uint8)
    lx0, ly0, lx1, ly1 = logo_box
    orange[max(0, ly0):ly1, max(0, lx0):lx1] = 0
    n, lab, st, _ = cv2.connectedComponentsWithStats(orange, 8)
    keep = np.zeros(n, bool)
    keep[1:] = st[1:, 4] >= 6
    ys, xs = np.nonzero(keep[lab])
    fcc = (int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())) if len(xs) else None
    v, s = f.max(2), f.max(2) - f.min(2)
    white = cv2.dilate(((v > 150) & (s < 70)).astype(np.uint8), np.ones((7, 7), np.uint8))
    n, lab, st, _ = cv2.connectedComponentsWithStats(white, 8)
    best = None
    for k in range(1, n):
        x, y, w, h, a = st[k]
        if w > 60 and h > 60 and a < 0.3 * w * h and (best is None or w * h > best[2] * best[3]):
            best = (x, y, w, h)
    lhc = (int(best[0] + 3), int(best[1] + 3), int(best[0] + best[2] - 4), int(best[1] + best[3] - 4)) if best else None
    return fcc, lhc


# ---------- the per-frame work (pool workers) ----------

G = {}


def init(params):
    G.update(params)


def logo_boxes(i):
    """(logo box, copy box) in source px for source frame i, or None."""
    k = i - LOGO_FROM
    tr = G['track']
    if k < 0 or k >= len(tr):
        return None
    x, y, s, _ = tr[k]
    lw, lh = LOGO_TPL[2] - LOGO_TPL[0], LOGO_TPL[3] - LOGO_TPL[1]
    logo = (x, y, x + lw * s, y + lh * s)
    cx0, cy0, cx1, cy1 = COPY_REL
    copy = (x + cx0 * s, y + cy0 * s, x + cx1 * s, y + cy1 * s)
    return logo, copy


def remove_copy(rgb, i):
    lb = logo_boxes(i)
    if lb is None or G['keep_mirror']:
        return rgb
    _, (x0, y0, x1, y1) = lb
    s = G['track'][i - LOGO_FROM][2]
    k = int(max(7, 27 * s)) | 1
    m = 2 * k
    X0, Y0 = int(max(0, np.floor(x0) - m)), int(max(0, np.floor(y0) - m))
    X1, Y1 = int(min(W, np.ceil(x1) + m)), int(min(H, np.ceil(y1) + m))
    if X1 - X0 < 4 or Y1 - Y0 < 4:
        return rgb
    roi = rgb[Y0:Y1, X0:X1]
    ker = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (k, k))
    fill = cv2.morphologyEx(roi, cv2.MORPH_OPEN, ker)
    fill = cv2.GaussianBlur(fill, (0, 0), max(1.0, 2.5 * s))
    yy, xx = np.mgrid[Y0:Y1, X0:X1].astype(np.float32)
    fe = max(2.0, 6 * s)
    mx = np.clip(np.minimum(xx - x0, x1 - xx) / fe + 0.5, 0, 1)
    my = np.clip((y1 - yy) / fe + 0.5, 0, 1) * (yy >= y0)        # sharp at the baseline, soft below
    mask = (mx * my)[..., None]
    rgb = rgb.copy()
    rgb[Y0:Y1, X0:X1] = roi * (1 - mask) + np.minimum(roi, fill) * mask
    return rgb


K_OPEN = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (13, 13))
K_DIL = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))


def enhance(rgb, i, w):
    if w <= 0:
        return rgb
    base = cv2.morphologyEx(rgb, cv2.MORPH_OPEN, K_OPEN)
    det = rgb - base
    detd = cv2.dilate(det, K_DIL)
    vd = detd.max(2)
    lift = 255 * np.power(np.maximum(vd, 1e-3) / 255, GAMMA) / np.maximum(vd, 1e-3)
    t = np.clip((vd - TOE[0]) / (TOE[1] - TOE[0]), 0, 1)
    gain = 1 + t * (lift - 1)
    wmap = np.full((H, W), w, np.float32)
    lb = logo_boxes(i)
    if lb is not None:                          # leave the logo as it is
        (x0, y0, x1, y1), _ = lb
        pad = 20
        yy, xx = np.ogrid[0:H, 0:W]
        dx = np.maximum(np.maximum(x0 - pad - xx, xx - x1 - pad), 0)
        dy = np.maximum(np.maximum(y0 - pad - yy, yy - y1 - pad), 0)
        wmap *= np.clip(np.hypot(dx, dy) / 30, 0, 1).astype(np.float32)
    new = base + det + wmap[..., None] * (detd * gain[..., None] - det)
    vin, vout = rgb.max(2), new.max(2)
    lim = np.maximum(vin, CAP)
    sc = np.where(vout > lim, lim / np.maximum(vout, 1e-3), 1.0)
    return new * sc[..., None]


def fit(rgb, w):
    if w <= 0:
        return rgb
    S, C, T = G['fit_scale'], G['fit_c'], G['fit_t']
    sc = 1 + w * (S - 1)
    fe = w * FEATHER
    if fe >= 1:
        ramp_x = np.clip(np.minimum(np.arange(W), W - 1 - np.arange(W)) / fe, 0, 1)
        ramp_y = np.clip(np.minimum(np.arange(H), H - 1 - np.arange(H)) / fe, 0, 1)
        rgb = rgb * smoothstep(np.outer(ramp_y, ramp_x)).astype(np.float32)[..., None]
    if sc < 0.97:
        rgb = cv2.GaussianBlur(rgb, (0, 0), 0.5 * np.sqrt(1 / sc ** 2 - 1))
    tx = (1 - sc) * C[0] + w * (T[0] - C[0])
    ty = (1 - sc) * C[1] + w * (T[1] - C[1])
    M = np.float32([[sc, 0, tx], [0, sc, ty]])
    return cv2.warpAffine(rgb, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)


def weights(i):
    t = i / FPS
    return float(smootherstep((t - FIT_T0) / FIT_EASE)), float(smoothstep((t - ENH_T0) / (ENH_T1 - ENH_T0)))


def process_rgb(i, rgb):
    wf, we = weights(i)
    rgb = remove_copy(rgb, i)
    rgb = enhance(rgb, i, we)
    return fit(rgb, wf)


def work(job):
    i, buf = job
    if i < G['proc_from']:
        return buf
    return rgb_to_yuv(process_rgb(i, yuv_to_rgb(buf)))


# ---------- main ----------

def plan(src, keep_mirror):
    print('measuring the dip ...', flush=True)
    cut = measure_cut(src)
    a0, b0 = cut['a0'], cut['b0']
    print(f"flag plateau {cut['plateau']:.1f} at frame {cut['plateau_frame']}; "
          f"dissolve out from frame {a0} ({a0 / FPS:.2f} s, mean {cut['lum'][a0]:.1f}); "
          f"dip floor {cut['dip_min']:.2f} at {cut['dip_min_frame']} ({cut['dip_min_frame'] / FPS:.2f} s); "
          f"point cloud from frame {b0} ({b0 / FPS:.2f} s, mean {cut['lum'][b0]:.2f})")
    last = next(decode(src, 1, END - 1, 'rgb24'))
    last = np.frombuffer(last, np.uint8).reshape(H, W, 3)
    print('tracking the logo ...', flush=True)
    track, first = track_logo(src, cv2.cvtColor(last, cv2.COLOR_RGB2GRAY))
    print(f'logo: confident from frame {LOGO_FROM + first} ({(LOGO_FROM + first) / FPS:.2f} s); '
          f'ncc min/median over the confident stretch '
          f'{np.nanmin(track[first:, 3]):.2f}/{np.nanmedian(track[first:, 3]):.2f}')
    for k in range(0, len(track), 100):
        x, y, s, m = track[k]
        print(f'  frame {LOGO_FROM + k} ({(LOGO_FROM + k) / FPS:.2f} s): x {x:.0f} y {y:.0f} scale {s:.3f} ncc {m:.2f}')
    lx, ly, ls, _ = track[-1]
    logo_box = (int(lx), int(ly), int(lx + (LOGO_TPL[2] - LOGO_TPL[0]) * ls), int(ly + (LOGO_TPL[3] - LOGO_TPL[1]) * ls))
    copy_box = (int(lx + COPY_REL[0] * ls), int(ly + COPY_REL[1] * ls), int(lx + COPY_REL[2] * ls), int(ly + COPY_REL[3] * ls))
    fcc, lhc = rings_bbox(last, copy_box)
    print(f'last frame: logo {logo_box}, FCC ring {fcc}, LHC ring {lhc}')
    boxes = [logo_box, fcc, lhc]
    bx0 = min(b[0] for b in boxes) - 8
    by0 = min(b[1] for b in boxes) - 8
    bx1 = max(b[2] for b in boxes) + 8
    by1 = max(b[3] for b in boxes) + 8
    sx0, sy0, sx1, sy1 = SAFE[0] + SAFE_PAD, SAFE[1] + SAFE_PAD, SAFE[2] - SAFE_PAD, SAFE[3] - SAFE_PAD
    S = min((sx1 - sx0) / (bx1 - bx0), (sy1 - sy0) / (by1 - by0))
    C = ((bx0 + bx1) / 2, (by0 + by1) / 2)
    T = ((sx0 + sx1) / 2, (sy0 + sy1) / 2)
    print(f'content box {bx0, by0, bx1, by1} -> scale {S:.3f}, centre {C} -> {T}; '
          f'lands at x {T[0] + (bx0 - C[0]) * S:.0f}-{T[0] + (bx1 - C[0]) * S:.0f}, '
          f'y {T[1] + (by0 - C[1]) * S:.0f}-{T[1] + (by1 - C[1]) * S:.0f}')
    n_out = END - (b0 - a0)
    print(f'output: {n_out} frames ({n_out / FPS:.2f} s); cut {b0 - a0} frames ({(b0 - a0) / FPS:.2f} s); '
          f'source frame i >= {b0} plays at output frame i - {b0 - a0}')
    return dict(a0=a0, b0=b0, track=track, fit_scale=S, fit_c=C, fit_t=T, keep_mirror=keep_mirror,
                proc_from=int(FIT_T0 * FPS), n_out=n_out)


def frames_out(src, P):
    """(source index or (out_idx, in_idx, alpha), yuv bytes) in output order."""
    a0, b0 = P['a0'], P['b0']
    held = {}
    for i, b in enumerate(decode(src, END)):
        if i < a0:
            yield i, b
        elif i < a0 + XF_FRAMES:
            held[i] = b
        elif i < b0:
            continue
        elif i < b0 + XF_FRAMES:
            k = i - b0
            alpha = float(smoothstep((k + 1) / (XF_FRAMES + 1)))
            o = np.frombuffer(held.pop(a0 + k), np.uint8).astype(np.float32)
            n = np.frombuffer(b, np.uint8).astype(np.float32)
            yield i, np.clip(np.rint(o * (1 - alpha) + n * alpha), 0, 255).astype(np.uint8).tobytes()
        else:
            yield i, b


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('src', nargs='?', default=ROOT / 'videos/raw/innoday/close_home.mp4', type=Path)
    ap.add_argument('out', nargs='?', default=ROOT / 'videos/raw/close_lhc_fcc.mp4', type=Path)
    ap.add_argument('--plan', action='store_true')
    ap.add_argument('--keep-mirror', action='store_true')
    ap.add_argument('--stills')
    ap.add_argument('--at', default='')
    ap.add_argument('--workers', type=int, default=max(1, (os.cpu_count() or 4) - 2))
    a = ap.parse_args([x for x in sys.argv[1:] if x != '--'])

    P = plan(a.src, a.keep_mirror)
    if a.plan:
        return
    if a.stills:
        init(P)
        os.makedirs(a.stills, exist_ok=True)
        for i in sorted(int(x) for x in a.at.split(',') if x):
            b = next(decode(a.src, 1, i))
            rgb = process_rgb(i, yuv_to_rgb(b)) if i >= P['proc_from'] else yuv_to_rgb(b)
            o = i - (P['b0'] - P['a0']) if i >= P['b0'] else i
            path = os.path.join(a.stills, f'src{i:04d}_out{o:04d}.png')
            cv2.imwrite(path, cv2.cvtColor(np.clip(rgb, 0, 255).astype(np.uint8), cv2.COLOR_RGB2BGR))
            print(path)
        return

    enc = subprocess.Popen(
        # the colour tags go on the INPUT: on the output side ffmpeg auto-inserts a scaler that
        # converts the untagged raw frames from BT.601 to BT.709 (a ~1.4 level shift in Y)
        ['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'yuv420p', '-s', f'{W}x{H}',
         '-r', str(FPS), '-colorspace', 'bt709', '-color_range', 'tv', '-i', '-', '-an',
         '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
         '-movflags', '+faststart', str(a.out)], stdin=subprocess.PIPE)
    n = 0
    with Pool(a.workers, initializer=init, initargs=(P,)) as pool:
        batch = []
        def flush():
            nonlocal n
            for out in pool.map(work, batch):
                enc.stdin.write(out)
                n += 1
            batch.clear()
        for job in frames_out(a.src, P):
            batch.append(job)
            if len(batch) >= 4 * a.workers:
                flush()
                if n % 500 < 4 * a.workers:
                    print(f'  {n} frames', flush=True)
        flush()
    enc.stdin.close()
    if enc.wait() != 0:
        raise SystemExit('ffmpeg failed')
    print(f'wrote {a.out}: {n} frames ({n / FPS:.2f} s)')
    if n != P['n_out']:
        raise SystemExit(f'expected {P["n_out"]} frames')


if __name__ == '__main__':
    main()
