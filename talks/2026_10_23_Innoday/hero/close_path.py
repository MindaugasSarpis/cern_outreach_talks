"""The camera path of „Ačiū“ (slide 33), for the deck's frontmatter.

  python3 talks/2026_10_23_Innoday/hero/close_path.py [--step 1.0] [--probe 12.5,38]

The stage runs a path through its keys at a constant pace per segment (a centripetal
Catmull-Rom, eased only at the first and last key), so a slow landing and a dolly that
gathers speed need keys close together. This writes them from five poses and an easing
for each leg between them (owner, 20 Oct: "make it even more spectacular? don't need to
rush to zoom out"):

  0-2 s    the clip's last view, held (path[0], hero/lis_pose.py)
  2-5.5    out of the module's end (the stage's own first segment)
  5.5-17.5 the crane down and round to the owner's eye level, slowing to a drift as it
           lands on the music's arrival (the second file's 18 s)
  17.5-31  the eye-level view of the whole detector, drifting 5 degrees round to side
           on while LHCb's collision runs through it
  31-48    the dolly back along the same line to 28 m, slow at both ends

Poses: position = at + dist (sin yaw cos pitch, sin pitch, cos yaw cos pitch), as
slidev-addon-stage places its camera. With --probe it prints the camera's distance from
the flag's anchor at those seconds (LisTakeover's colAt and embAt).
"""
import argparse
import math

A = (9.54, -483.06, 0.96)   # the flag's anchor (LisTakeover's `anchor`)
STILL = dict(at=(9.54, -483.362, 0.96), dist=2.236, yaw=-90.0, pitch=-29.74)
OUT = dict(at=(9.6, -482.0, 0.8), dist=7.0, yaw=-80.0, pitch=4.0)
LAND = dict(at=(13.50, -479.81, 0.55), dist=21.6, yaw=-5.0, pitch=-13.0)    # 18 m from the beam, eye level
SIDE = dict(LAND, yaw=0.0)                                                 # side on from the middle
BACK = dict(at=(13.69, -479.99, 0.33), dist=33.60, yaw=0.0, pitch=-8.0)    # 28 m: the person at the muon wall's foot

# legs: (t0, t1, from, to, slope at the start, slope at the end), slopes in units of the
# leg's average pace (1: the average; 0: at rest)
LEGS = [
    (2.0, 5.5, STILL, OUT, 0.0, 1.0),     # (the stage's own segment: for --probe only)
    (5.5, 17.5, OUT, LAND, 1.0, 0.06),
    (17.5, 31.0, LAND, SIDE, 1.0, 0.0),
    (31.0, 48.0, SIDE, BACK, 0.0, 0.0),
]


def hermite(s, m0, m1):
    return (s ** 3 - 2 * s ** 2 + s) * m0 + (-2 * s ** 3 + 3 * s ** 2) + (s ** 3 - s ** 2) * m1


def mix(p, q, e):
    return dict(at=tuple(a + (b - a) * e for a, b in zip(p['at'], q['at'])),
                **{k: p[k] + (q[k] - p[k]) * e for k in ('dist', 'yaw', 'pitch')})


def pose(t):
    if t <= 2.0:
        return STILL
    for t0, t1, p, q, m0, m1 in LEGS:
        if t0 <= t <= t1:
            return mix(p, q, hermite((t - t0) / (t1 - t0), m0, m1))
    return BACK


def camera(p):
    y, c = math.radians(p['yaw']), math.radians(p['pitch'])
    return tuple(a + p['dist'] * d for a, d in zip(p['at'], (math.sin(y) * math.cos(c), math.sin(c), math.cos(y) * math.cos(c))))


def num(v):
    return f'{v:.3f}'.rstrip('0').rstrip('.')


def fmt(t, p):
    a = ', '.join(num(v) for v in p['at'])
    return f"    - [{t:g}, {{ at: [{a}], dist: {num(p['dist'])}, yaw: {num(p['yaw'])}, pitch: {num(p['pitch'])} }}]"


ap = argparse.ArgumentParser()
ap.add_argument('--step', type=float, default=1.0)
ap.add_argument('--probe', default='')
x = ap.parse_args()

times = [0, 2.0, 5.5]
t = 5.5
while True:
    t = round(t + x.step, 3)
    if t >= 48.0:
        break
    times.append(t)
times.append(48.0)
for t in times:
    print(fmt(t, OUT if t == 5.5 else pose(t)))
for s in [float(v) for v in x.probe.split(',') if v]:
    print(f'# t {s:g} s: the camera {math.dist(camera(pose(s)), A):.2f} units from the anchor')
