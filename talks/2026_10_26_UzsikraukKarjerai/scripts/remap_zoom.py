"""The NFTMC → cosmic web zoom as a 17 s clip (slide 2), from the owner's SpaceEngine edit.

Four stretches of the source, each at its own eased speed, joined by dissolves:
the Google Earth flight out to the clouds, the Earth from space, our galaxy
whole, and the cosmic web slowing to a stop and held. In between, the edit's camera swings left and right by screen widths over
10-20 s (a gentle sway at 1x, a shake when sped up 30-55x: the owner, 23 Oct,
"on speedup it doesn't look good"), so those stretches are dissolved over, not
played. Each output frame averages the source frames under a 180-degree shutter.

Stabilised: from zoom_motion.py's per-frame motion, each stretch's camera path
(x, y, rotation, log scale) is made as smooth as it can be in output time while
staying within BOUND of the real one, each source frame is moved onto it, and
the frame is cropped in just enough (a slowly changing zoom) to hide the edges.
The corridor closes over the last second, so the clip ends on the source's own
frame at 253.42 s, the frame slide 3's still is (public/figures/opener_last.jpg).

python scripts/remap_zoom.py ../../videos/raw/spaceengine/nftmc_zoom.mp4 ../../videos/raw/vilnius_zoom.mp4 --motion ../../videos/raw/spaceengine/nftmc_zoom.motion.npy
(in pnpm talk render; OpenCV for the warp; --plan prints the stretches). No audio.
"""
import subprocess, sys, numpy as np
from scipy.ndimage import gaussian_filter1d, maximum_filter1d

SRC_FPS, OUT_FPS = 60, 50
W, H = 1920, 1080
END_SRC = 253.42
TOTAL, HOLD = 17.0, 1.0
XF = 0.4                  # each dissolve, seconds
SHUTTER = 0.5
MAX_BLEND = 24
BOUND = np.array([70.0, 40.0, 1.5, 0.03])   # px, px, degrees, log scale: the corridor round the real path
# the Sun and inside the galaxy (90.5-94, 127-146) left out on 23 Oct: the review found them the most
# synthetic-looking pictures in the talk and near-black on a stream; the Earth dissolves into the galaxy
# the cloud whiteout after Google Earth's fade (source ~29.5-33 s) and the bright limb toned down: they
# flashed after Vilnius (YAVG 101 -> 156); keyed by source seconds
GAIN = [(28.8, 1.0), (29.8, 0.6), (32.4, 0.62), (37.6, 0.75), (39.6, 0.85), (42.0, 1.0)]
BOUNDS = {0: np.array([50.0, 30.0, 0.8, 0.02]), 1: np.array([50.0, 30.0, 0.8, 0.02])}   # Google Earth's: less crop, sharper
# Google Earth's attribution (its logo and the imagery line under it, burnt into the source until
# its fade to SpaceEngine ends at ~29.9 s) is put back unmoved and uncropped over the moved frame:
# only the letters (a matte of the bright text), so the picture round them stays on the smooth path;
# the burnt-in letters are filled in (inpainted) before the frame is moved, so they do not show twice
ATTRIB = (1480, 940, 30.0)                    # x from, y from, source seconds it lasts
CREDIT_Y = 1016                               # the logo above, the providers' line below: it changes, so matted per frame
CREDIT_ROWS = (1018, 1037)                    # where the providers' letters are
GRID = 1 / 250

# (source from, source to, output seconds, [(stretch seconds, speed x)]): the speeds are
# shapes, scaled so each stretch covers its source span in its time. The web's
# length is what is left of TOTAL, its shape in fractions of it.
STRETCHES = [
    (0.0, 32.4, 5.6, [(0.0, 1.2), (1.0, 2.5), (2.5, 6), (3.8, 8), (4.5, 6.5), (5.2, 6), (5.6, 6)]),   # NFTMC → Vilnius → the clouds
    (37.6, 62.0, 2.7, [(0.0, 10), (1.2, 10), (1.7, 8), (2.7, 8)]),           # the Earth from space (its 95° roll at 32-37 s dissolved over)
    (186.0, 196.0, 3.8, [(0.0, 1.4), (2.2, 1.0), (3.8, 0.5)]),               # the galaxy whole, drifting one way
    (226.0, END_SRC, None, [(0.0, 9), (0.55, 2.5), (1.0, 0.4)]),             # the web, braking to a stop
]


def ease_speed(keys, t):
    ts, vs = map(np.array, zip(*keys))
    i = np.clip(np.searchsorted(ts, t, side='right') - 1, 0, len(ts) - 2)
    a = np.clip((t - ts[i]) / (ts[i + 1] - ts[i]), 0, 1)
    a = (1 - np.cos(np.pi * a)) / 2
    return np.exp(np.log(vs[i]) * (1 - a) + np.log(vs[i + 1]) * a)


def layout():
    """Each stretch: (start in output, length, local time grid, source time on it)."""
    fixed = sum(d for _, _, d, _ in STRETCHES if d)
    web = (TOTAL - HOLD) - fixed + XF * (len(STRETCHES) - 1)
    out, t0 = [], 0.0
    for a, b, d, keys in STRETCHES:
        if d is None:
            d = web
            keys = [(f * d, v) for f, v in keys]
        t = np.linspace(0, d, 4001)
        v = ease_speed(keys, t)
        s = np.concatenate([[0], np.cumsum((v[1:] + v[:-1]) / 2 * np.diff(t))])
        s = a + s * (b - a) / s[-1]
        out.append((t0, d, t, s))
        t0 += d - XF
    return out


def plan():
    for (a, b, *_), (t0, d, t, s) in zip(STRETCHES, layout()):
        print(f'source {a:6.1f}-{b:6.1f} s at output {t0:5.2f}-{t0 + d:5.2f} s, {(b - a) / d:4.1f}x on average')


def stabilise(motion, lay, n_src):
    """Per stretch, per source frame in it: the move onto the smooth path and the crop zoom."""
    m = np.load(motion)[:n_src]
    v = np.nan_to_num(m[:, :4].copy())
    v[:, 3] = np.log(np.where(np.isfinite(m[:, 3]) & (m[:, 3] > 0), m[:, 3], 1.0))
    bad = ~np.isfinite(m[:, 0]) | (m[:, 4] < 20) | (np.abs(m[:, 0]) > 150) | (np.abs(m[:, 2]) > 3)
    v[bad] = 0.0                                 # a cut or nothing to track: take it as still
    corners = np.array([[0, 0], [W, 0], [0, H], [W, H]], float) - [W / 2, H / 2]
    res = []
    for j, (t0, d, t, s) in enumerate(lay):
        i0, i1 = int(np.floor(s[0] * SRC_FPS)), min(n_src - 1, int(np.ceil(s[-1] * SRC_FPS)))
        idx = np.arange(i0, i1 + 1)
        C = np.cumsum(v[idx], 0)
        ti = np.interp(idx / SRC_FPS, s, t)
        g = np.arange(0, d + GRID / 2, GRID)
        taper = np.ones_like(g)
        if j == len(lay) - 1:                    # the corridor closes over the last second
            e = np.clip((d - 0.2 - g) / 1.0, 0, 1)
            taper = e * e * (3 - 2 * e)
        D = np.zeros_like(C)
        for k in range(4):
            c = np.interp(g, ti, C[:, k])
            bnd = BOUNDS.get(j, BOUND)[k] * taper
            p = c.copy()
            for _ in range(600):                 # as smooth as the corridor allows, over ~0.4 s
                p = np.clip(gaussian_filter1d(p, 4, mode='nearest'), c - bnd, c + bnd)
            B = BOUNDS.get(j, BOUND)[k]
            D[:, k] = np.clip(np.interp(ti, g, p) - C[:, k], -B, B) * np.interp(ti, g, taper)
        need = np.ones(len(idx))
        for n, dd in enumerate(D):
            ang = np.radians(dd[2]); sc = np.exp(dd[3])
            R = sc * np.array([[np.cos(ang), -np.sin(ang)], [np.sin(ang), np.cos(ang)]])
            for z in np.arange(1.0, 1.3, 0.0025):
                q = np.linalg.solve(R, (corners / z - dd[:2]).T).T
                if (np.abs(q[:, 0]) <= W / 2).all() and (np.abs(q[:, 1]) <= H / 2).all():
                    break
            need[n] = z
        zg = gaussian_filter1d(maximum_filter1d(np.interp(g, ti, need), int(1.2 / GRID)), 0.3 / GRID, mode='nearest')
        zg = 1 + (zg - 1) * taper
        zoom = np.maximum(np.interp(ti, g, zg), need)
        res.append(dict(zip(idx.tolist(), zip(D, zoom))))
    return res


def warp(f, d, z):
    import cv2
    ang = np.radians(d[2]); sc = np.exp(d[3]) * z
    A = np.array([[sc * np.cos(ang), -sc * np.sin(ang)], [sc * np.sin(ang), sc * np.cos(ang)]])
    c = np.array([W / 2, H / 2])
    M = np.hstack([A, (c + z * d[:2] - A @ c)[:, None]])
    return cv2.warpAffine(f, M, (W, H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)


def logo_matte(src):
    """The fixed logo's letters: bright in every frame of the Google Earth part (the
    picture behind them changes, so its per-pixel minimum is dark), grown and softened."""
    import cv2
    x0, y0, end = ATTRIB
    w, h = W - x0, CREDIT_Y - y0
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', src, '-t', str(end - 1.0), '-map', '0:v:0',
                        '-vf', f'fps=4,crop={w}:{h}:{x0}:{y0},format=gray', '-f', 'rawvideo', '-'],
                       capture_output=True, check=True)
    lo = np.frombuffer(p.stdout, np.uint8).reshape(-1, h, w).min(axis=0)
    m = np.zeros((H, W), np.float32)
    m[y0:CREDIT_Y, x0:] = (lo > 170).astype(np.float32)
    return m


def text_matte(raw, logo):
    """The logo, and the credit line's bright letters in this frame, as a soft 0-1 matte."""
    import cv2
    x0 = ATTRIB[0]
    m = logo.copy()
    r0, r1 = CREDIT_ROWS
    lit = (raw[r0:r1, x0:].mean(axis=2) > 200).astype(np.uint8)
    n, lab, st, _ = cv2.connectedComponentsWithStats(lit, connectivity=8)
    keep = np.zeros(n, bool)
    keep[1:] = (st[1:, cv2.CC_STAT_HEIGHT] <= 17) & (st[1:, cv2.CC_STAT_AREA] < 300)   # letters, not white roofs
    m[r0:r1, x0:] = keep[lab].astype(np.float32)
    m = cv2.dilate(m, np.ones((5, 5), np.uint8))
    return cv2.GaussianBlur(m, (0, 0), 1.5)[..., None]


def frames_of(t0, d, t, s, uk):
    """The source frames under output time uk's shutter in one stretch."""
    half = SHUTTER / OUT_FPS / 2
    a = np.interp(max(uk - t0 - half, 0), t, s) * SRC_FPS
    b = np.interp(min(uk - t0 + half, d), t, s) * SRC_FPS
    lo, hi = int(round(a)), max(int(round(b)), int(round(a)))
    idx = np.arange(lo, hi + 1)
    if len(idx) > MAX_BLEND:
        idx = np.unique(np.round(np.linspace(lo, hi, MAX_BLEND)).astype(int))
    return idx


def main(src, out, motion=None):
    lay = layout()
    last = int(round(END_SRC * SRC_FPS))
    n_run = int(round((TOTAL - HOLD) * OUT_FPS))
    n = int(round(TOTAL * OUT_FPS))
    jobs = []                                    # per output frame: [(stretch, source frame, weight)]
    for k in range(n):
        if k >= n_run - 1:
            jobs.append([(len(lay) - 1, last, 1.0)]); continue
        uk = k / OUT_FPS
        parts = []
        for j, (t0, d, t, s) in enumerate(lay):
            if not (t0 - 1e-9 <= uk <= t0 + d):
                continue
            w = 1.0
            if j > 0 and uk < t0 + XF:
                w = min(w, (uk - t0) / XF)
            if j < len(lay) - 1 and uk > t0 + d - XF:
                w = min(w, (t0 + d - uk) / XF)
            w = w * w * (3 - 2 * w)
            if w <= 0:
                continue
            idx = frames_of(t0, d, t, s, uk)
            parts += [(j, int(min(i, last)), w / len(idx)) for i in idx]
        tot = sum(p[2] for p in parts)
        jobs.append([(j, i, w / tot) for j, i, w in parts])
    stab = stabilise(motion, lay, last + 1) if motion else None
    if stab:
        print(f'crop zoom up to {max(z for st in stab for _, z in st.values()):.3f}')
    need = {}
    for k, parts in enumerate(jobs):
        for j, i, w in parts:
            need.setdefault(i, []).append((k, j, w))
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-t', f'{END_SRC + 0.1}',
                            '-map', '0:v:0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                           stdout=subprocess.PIPE, bufsize=W * H * 3 * 4)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                            '-s', f'{W}x{H}', '-r', str(OUT_FPS), '-i', '-',
                            '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-profile:v', 'high',
                            '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                            '-colorspace', 'bt709', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    left = [len(p) for p in jobs]
    logo = logo_matte(src) if stab else None
    acc = {}
    nxt = 0
    fsize = W * H * 3
    for i in range(last + 1):
        buf = dec.stdout.read(fsize)
        if len(buf) < fsize:
            sys.exit(f'source ended at frame {i}, wanted {last}')
        if i not in need:
            continue
        raw = np.frombuffer(buf, np.uint8).reshape(H, W, 3)
        moved = {}
        for k, j, w in need[i]:
            if j not in moved:
                f = raw
                text = stab and i < ATTRIB[2] * SRC_FPS
                if text:
                    mask = text_matte(raw, logo)
                    import cv2
                    hole = (mask[..., 0] > 0.02).astype(np.uint8)
                    x0, y0 = ATTRIB[0], ATTRIB[1] - 20
                    f = raw.copy()
                    f[y0:, x0:] = cv2.inpaint(np.ascontiguousarray(raw[y0:, x0:]), hole[y0:, x0:], 5, cv2.INPAINT_TELEA)
                if stab and i in stab[j]:
                    dd, z = stab[j][i]
                    f = warp(f, dd, z)
                f = f.astype(np.float32)
                gt, gv = zip(*GAIN)
                f = f * float(np.interp(i / SRC_FPS, gt, gv))
                if text:
                    f = f * (1 - mask) + raw.astype(np.float32) * mask
                moved[j] = f
            acc[k] = acc[k] + moved[j] * w if k in acc else moved[j] * w
            left[k] -= 1
        while nxt < n and left[nxt] == 0:
            enc.stdin.write(np.clip(acc.pop(nxt) + 0.5, 0, 255).astype(np.uint8).tobytes())
            nxt += 1
    dec.stdout.close(); dec.kill()
    enc.stdin.close(); enc.wait()
    if nxt != n:
        sys.exit(f'wrote {nxt} of {n} frames')
    print(f'{out}: {n} frames, {n / OUT_FPS:.2f} s')


if __name__ == '__main__':
    if '--plan' in sys.argv:
        plan()
    else:
        mo = sys.argv[sys.argv.index('--motion') + 1] if '--motion' in sys.argv else None
        main(sys.argv[1], sys.argv[2], mo)
