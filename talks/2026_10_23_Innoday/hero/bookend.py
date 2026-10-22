"""The close's flight home (slide 30, close_home.mp4): the recorded close up to the
accelerator map, then out to the whole Earth and down into Vilnius (the opener's own
flight, nftmc_zoom_web.mp4, run backwards), landing on NFTMC from above, where the take's
„Ačiū“ collision, lifted off the map, crosses on Starfire's peak.

  python talks/2026_10_23_Innoday/hero/bookend.py TAKE OPENER OUT [--stills DIR --at t1,t2,...]

TAKE: the slide-30 take of the live close at 22efcef (slidev-stage-record, 50 fps; recorded at
3840×2160 and taken down to 1920×1080 here, so the grains are finer, owner: "could we get
better resolved sharper pointcloud?"). OPENER: public/videos/nftmc_zoom_web.mp4. Owner, 22 Oct,
on the Scheduler's proposal (the title promises „…ir atgal“; the close ended on the LHC ring):
"Go ahead and do it"; on the first cut (a fade): "shouldn't there be world zooming out and so
on to Vilnius?".

Times (s of the clip; the music is the slide's <Soundtrack>, its `drop` on V_HIT):
  0-57      the take: the module, LHCb at eye level, the pull-out to the LHC and the FCC
  57.4-62.5 the map flies away into the Earth's lit side as the Earth comes up round it
  62.5-76.5 down into Vilnius: the opener's first 56 s backwards (4x), landing on NFTMC; the
            picture settles to the deck's dark ground over the last seconds
  76.5-94.5 the take's „Ačiū“ collision over Vilnius (its bunches from 76.5, the crossing on
            V_HIT, Starfire's 2:54.85 downbeat), the word and the flag, held
"""
import argparse, subprocess, sys
import numpy as np
from PIL import Image
from scipy.ndimage import maximum_filter, gaussian_filter

W, H, FPS = 1920, 1080, 50
T_STILL = (56.95, 57.95)   # the take: the camera stands still over the map
T_CROSS = 61.2             # the take: the word's collision crosses
V_HIT = 79.8               # the clip: the crossing, on Starfire's peak (the music's 2:54.85: the Soundtrack's `drop` brings it here)
SHIFT = V_HIT - T_CROSS    # the take's word, later in the clip
V_OUT0, V_OUT1 = 57.4, 62.5   # the map away, the Earth up (owner, on the 28 s dive: "Make this going back to vilnius quicker": 14 s)
V_LAND = V_HIT - (T_CROSS - T_STILL[1])   # NFTMC reached as the word's bunches come in
KNEE = 4.0

ap = argparse.ArgumentParser()
ap.add_argument('take'); ap.add_argument('opener'); ap.add_argument('out')
ap.add_argument('--dive-span', type=float, default=56.0)   # the dive file: the opener's first this many s, backwards
ap.add_argument('--dive', required=True)   # the opener's first EARTH_T s backwards, 60 fps (dive.sh: 4 s pieces through ffmpeg's reverse)
ap.add_argument('--stills', default=''); ap.add_argument('--at', default='')
ap.add_argument('--earth-t', type=float, default=47.0)   # the opener: the Earth's lit limb filling the frame's left (from ~56 s a red galaxy band crosses it; the whole disk, ~64 s, is a dark crescent)
ap.add_argument('--geneva', default='0.22,0.52')   # where the map goes down in that frame (shares of width, height): the lit side's middle (no coastline reads there)
ap.add_argument('--gain', type=float, default=0.30)
ap.add_argument('--sat', type=float, default=0.55)
x = ap.parse_args()
EARTH_T = x.earth_t
GX, GY = (float(v) for v in x.geneva.split(','))


def reader(path, t0, t1=None, fps=None):
    args = ['ffmpeg', '-v', 'error', '-ss', f'{t0:.3f}', '-i', path]
    if t1 is not None: args += ['-t', f'{t1 - t0:.3f}']
    vf = [f'scale={W}:{H}:flags=lanczos'] + ([f'fps={fps}'] if fps else [])
    args += ['-vf', ','.join(vf), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']
    p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, bufsize=W * H * 3 * 4)
    n = W * H * 3
    try:
        while True:
            b = p.stdout.read(n)
            if len(b) < n: break
            yield np.frombuffer(b, np.uint8).reshape(H, W, 3)
    finally:
        p.kill()


def one(path, t):
    return next(reader(path, t)).astype(np.float32)


def smooth(a, b, t):
    s = np.clip((t - a) / (b - a), 0, 1); return s * s * (3 - 2 * s)


# the deck's dark ground: the photo darker, less colour, a cool cast, a vignette
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
# the map's edges feathered, so it shrinks away without a frame round it
feather = (smooth(0.0, 0.06, np.minimum(xx / W, 1 - xx / W)) * smooth(0.0, 0.06, np.minimum(yy / H, 1 - yy / H)))[..., None]   # narrow: the logo near the top stays whole
vign = (1 - 0.55 * np.clip((np.hypot((xx - W / 2) / (W / 2), (yy - H / 2) / (H / 2)) - 0.45) / 0.9, 0, 1) ** 1.6)[..., None]
def grade(img, k):
    if k <= 0: return img
    f = img / 255
    lum = f @ np.array([0.2126, 0.7152, 0.0722], np.float32)
    g = lum[..., None] + (f - lum[..., None]) * x.sat
    g = g ** 1.25 * x.gain * np.array([0.92, 0.98, 1.08], np.float32) * vign
    return (1 - k) * img + k * g * 255


# the map, still, without what moves over it: each pixel's least over the still second
plate = None
for f in reader(x.take, *T_STILL):
    plate = f.astype(np.float32) if plate is None else np.minimum(plate, f)
floor = None
for f in reader(x.take, *T_STILL):
    r = f.astype(np.float32) - plate
    floor = r if floor is None else np.maximum(floor, r)
floor = maximum_filter(floor, size=(3, 3, 1)) * 1.5
# … except over the word, the flag and the bunches (the frame's middle): they already flicker
# there in that second, and a floor wiped them (two black holes in the glow; specks in the word)
floor[420:830, 690:1240] = np.minimum(floor[420:830, 690:1240], 12.0)
def spread(t0, t1):
    lo = hi = None
    for f in reader(x.take, t0, t1):
        g = f.astype(np.int16).sum(2)
        lo = g if lo is None else np.minimum(lo, g); hi = g if hi is None else np.maximum(hi, g)
    return hi - lo
box = np.zeros((H, W), bool); box[10:345, 680:995] = True   # the LHC's beams (never where the word forms)
mask = maximum_filter((np.maximum(spread(56.9, 57.95), spread(69.6, 72.9)) > 36) & box, size=11)
keep = (1 - gaussian_filter(mask.astype(np.float32), 2.0))[..., None]


def layer_of(f, t=None):
    L = np.clip(f - plate - floor - KNEE, 0, None) * keep
    # the 4K grains are finer: the campus shows between them, and the word reads as chalk; each
    # pixel at least its close neighbourhood's light, so the letters and stripes read solid
    return np.maximum(L, gaussian_filter(L, sigma=(1.3, 1.3, 0)))


def zoomed(img, s, cx, cy):
    """img scaled by s about (cx, cy) (shares of the frame), that point kept in place; black outside."""
    im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
    w, h = max(1, int(round(W * s))), max(1, int(round(H * s)))
    small = im.resize((w, h), Image.LANCZOS if s < 1 else Image.BICUBIC)
    out = Image.new('RGB', (W, H))
    out.paste(small, (int(round(cx * W - cx * w)), int(round(cy * H - cy * h))))
    return np.asarray(out).astype(np.float32)


earth = one(x.opener, EARTH_T)
nftmc = one(x.opener, 0.0)
# the dive: read forward through the reversed opener, frame by frame as the clip needs them
class Dive:
    def __init__(self): self.it, self.k, self.f = None, -1, None
    def at(self, r):
        want = max(0, int(round(r * 60)))
        if x.stills: return one(x.dive, want / 60)
        if self.it is None or want < self.k: self.it, self.k = reader(x.dive, 0), -1
        while self.k < want:
            nxt = next(self.it, None)
            if nxt is None: break
            self.f, self.k = nxt, self.k + 1
        return self.f.astype(np.float32)
dive = Dive()


def dive_t(V):
    u = np.clip((V - V_OUT1) / (V_LAND - V_OUT1), 0, 1)
    # leave the Earth gently, run, and slow into the campus (the opener eases out of it too)
    e = u * u * (3 - 2 * u) * 0.35 + u * 0.65
    return EARTH_T * (1 - e)


def compose(V, take_frame):
    if V < V_OUT0:
        return take_frame
    if V < V_OUT1:
        # the map (its word taken out) flies away into Geneva as the Earth comes up round it
        f = take_frame
        m = f - layer_of(f) if take_frame is not None else plate
        a = smooth(V_OUT0, V_OUT1, V)
        s_map = np.exp(np.log(0.02) * a)          # 1 -> 1/50, in log distance
        s_earth = np.exp(np.log(6.0) * (1 - a))   # 6x -> 1, about Geneva
        mp = zoomed(m * feather, s_map, GX, GY)
        ea = zoomed(earth, s_earth, GX, GY)
        # the complex goes as the clouds come (owner: "The complex should fade out as soon as
        # clouds appear"): gone by ~58.1 s, as the first clouds show, the Earth up by ~59.5 s
        return mp * (1 - smooth(0.0, 0.05, a)) + ea * smooth(0.03, 0.3, a)
    if V < V_LAND:
        img = dive.at(x.dive_span - dive_t(V))
        return grade(img, smooth(V_LAND - 3.0, V_LAND, V))
    # landed: NFTMC, dark, and the take's word over it
    base = grade(nftmc, 1.0)
    t = V - SHIFT
    if t > 73 - 1 / FPS: t = 73 - 1 / FPS
    return base + layer_of(take_at(t), t)


class Seq:
    """a video read forward, frame by frame, at FPS"""
    def __init__(self, path): self.path, self.it, self.k, self.f = path, None, -1, None
    def at(self, t):
        want = int(round(t * FPS))
        if x.stills: return one(self.path, want / FPS)
        if self.it is None or want < self.k: self.it, self.k = reader(self.path, want / FPS), want - 1
        while self.k < want:
            nxt = next(self.it, None)
            if nxt is None: break
            self.f, self.k = nxt, self.k + 1
        return self.f.astype(np.float32)
word_take = Seq(x.take)
take_at = word_take.at


V_END = 73 - 1 / FPS + SHIFT + 3.0   # the word held 3 s past the take's end

if x.stills:
    import os
    os.makedirs(x.stills, exist_ok=True)
    for s in x.at.split(','):
        V = float(s)
        tf = take_at(V) if V < 73 else None
        Image.fromarray(np.clip(compose(V, tf), 0, 255).astype(np.uint8)).save(f'{x.stills}/v{V:06.2f}.png')
    sys.exit(0)

enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-maxrate', '10M', '-bufsize', '20M', '-g', '50',
                        '-pix_fmt', 'yuv420p', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                        '-movflags', '+faststart', '-an', x.out], stdin=subprocess.PIPE)
take = reader(x.take, 0)
n = int(round(V_END * FPS))
for i in range(n):
    V = i / FPS
    tf = next(take, None) if V < 73 else None
    if tf is not None and V < V_OUT0:
        enc.stdin.write(tf.tobytes()); continue
    out = compose(V, tf.astype(np.float32) if tf is not None else None)
    enc.stdin.write(np.clip(out, 0, 255).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait()
print('frames', n, file=sys.stderr)
