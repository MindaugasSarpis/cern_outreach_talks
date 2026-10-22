"""The close's bookend: the recorded close (take) up to the ring, then a dissolve into NFTMC
from above (the opener's first frame, graded to the deck's black ground) with the take's
„Ačiū“ collision lifted off the map (frame minus the still ring) and added over it.

  python talks/2026_10_23_Innoday/hero/bookend.py TAKE BG OUT [--stills DIR --at t1,t2,...]

TAKE: the slide-30 take (slidev-stage-record, 1080p50, the live close at 22efcef); BG: the first
frame of public/videos/nftmc_zoom_web.mp4 (ffmpeg -i … -frames:v 1 nftmc0.png). Owner, 22 Oct,
on the Scheduler's proposal (the title promises „…ir atgal“; the close ended on the LHC ring):
"Go ahead and do it".
"""
import argparse, subprocess, sys
import numpy as np
from PIL import Image
from scipy.ndimage import maximum_filter, gaussian_filter

W, H, FPS = 1920, 1080, 50
T_PLATE = 57.6          # the ring, still, before the word's collision (camera stops ~57.0)
T_D0, T_D1 = 57.4, 59.2  # the dissolve ring -> Vilnius
KNEE = 4.0              # the layer's noise floor (8-bit levels, per channel)

ap = argparse.ArgumentParser()
ap.add_argument('take'); ap.add_argument('bg'); ap.add_argument('out')
ap.add_argument('--stills', default=''); ap.add_argument('--at', default='')
ap.add_argument('--gain', type=float, default=0.30)   # the photo's exposure
ap.add_argument('--sat', type=float, default=0.55)
x = ap.parse_args()


def frames(t0, t1=None):
    args = ['ffmpeg', '-v', 'error', '-ss', f'{t0:.3f}', '-i', x.take]
    if t1 is not None: args += ['-t', f'{t1 - t0:.3f}']
    args += ['-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    p = subprocess.Popen(args, stdout=subprocess.PIPE, bufsize=W * H * 3 * 4)
    n = W * H * 3
    while True:
        b = p.stdout.read(n)
        if len(b) < n: break
        yield np.frombuffer(b, np.uint8).reshape(H, W, 3)
    p.wait()


def one(t):
    return next(frames(t)).astype(np.float32)


# the graded photo: darker, less colour, a cool cast, a vignette toward the deck's black
bg = np.asarray(Image.open(x.bg).convert('RGB').resize((W, H), Image.LANCZOS)).astype(np.float32) / 255
lum = bg @ np.array([0.2126, 0.7152, 0.0722], np.float32)
bg = lum[..., None] + (bg - lum[..., None]) * x.sat
bg = bg ** 1.25 * x.gain * np.array([0.92, 0.98, 1.08], np.float32)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
r = np.hypot((xx - W / 2) / (W / 2), (yy - H / 2) / (H / 2))
bg *= (1 - 0.55 * np.clip((r - 0.45) / 0.9, 0, 1) ** 1.6)[..., None]
bg = bg * 255

# the ring, still, without what moves over it (the beams, the word's bunches arriving): each
# pixel's least over the second the camera stands still
plate = None
for f in frames(56.95, 57.95):
    plate = f.astype(np.float32) if plate is None else np.minimum(plate, f)
# the beams round the LHC ring (the top of the frame, x 700-985, y 20-335: never where the word
# and the flag form, y 476 on): masked, wherever they ran in the still second or the hold
def spread(t0, t1):
    lo = hi = None
    for f in frames(t0, t1):
        g = f.astype(np.int16).sum(2)
        lo = g if lo is None else np.minimum(lo, g); hi = g if hi is None else np.maximum(hi, g)
    return hi - lo
# what the map's own animation adds over the still in that second (the dashed rings' flow,
# twinkles), a little spread: taken off the layer too, so no dash of the old map survives
floor = None
for f in frames(56.95, 57.95):
    r = f.astype(np.float32) - plate
    floor = r if floor is None else np.maximum(floor, r)
floor = maximum_filter(floor, size=(3, 3, 1)) * 1.5
box = np.zeros((H, W), bool); box[10:345, 680:995] = True
moving = (np.maximum(spread(56.9, 57.95), spread(69.6, 72.9)) > 36) & box
mask = maximum_filter(moving, size=11)
keep = 1 - gaussian_filter(mask.astype(np.float32), 2.0)
print(f'masked {mask.mean() * 100:.2f} % of the frame', file=sys.stderr)


def smooth(a, b, t):
    s = np.clip((t - a) / (b - a), 0, 1); return s * s * (3 - 2 * s)


def compose(f, t):
    f = f.astype(np.float32)
    if t < T_D0: return f
    layer = np.clip(f - plate - floor - KNEE, 0, None) * keep[..., None]
    a = smooth(T_D0, T_D1, t)
    out = (1 - a) * f + a * (bg + layer)
    return out


if x.stills:
    import os
    os.makedirs(x.stills, exist_ok=True)
    for s in x.at.split(','):
        t = float(s)
        Image.fromarray(np.clip(compose(one(t), t), 0, 255).astype(np.uint8)).save(f'{x.stills}/t{t:05.2f}.png')
    Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).save(f'{x.stills}/bg.png')
    Image.fromarray((mask * 255).astype(np.uint8)).save(f'{x.stills}/mask.png')
    sys.exit(0)

enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-maxrate', '10M', '-bufsize', '20M', '-g', '50',
                        '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                        '-movflags', '+faststart', '-an', x.out], stdin=subprocess.PIPE)
for i, f in enumerate(frames(0)):
    t = i / FPS
    enc.stdin.write(np.clip(compose(f, t), 0, 255).astype(np.uint8).tobytes() if t >= T_D0 else f.tobytes())
enc.stdin.close(); enc.wait()
print('frames', i + 1, file=sys.stderr)
