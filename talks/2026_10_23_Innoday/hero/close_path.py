"""The camera path of „Ačiū“ (slide 30), for the deck's frontmatter.

  python3 talks/2026_10_23_Innoday/hero/close_path.py [--step 1.5] [--probe 12.6,38.5] [--ring]

The stage runs a path through its keys at a constant pace per segment (a centripetal
Catmull-Rom, eased only at the first and last key), so a slow landing and a pull-out
that gathers speed need keys close together: every --step seconds, and every 0.35 s
over the pull-out to the ring. Owner, 20-21 Oct: "see the huge scale of lhcb, maybe then
go to first person view at eye level lhcb filling the screen"; "look at it side on from
the middle. From where that person stands. It can be me, 183cm in height"; "don't need
to rush to zoom out"; "On the detector slide (second to last) we want to really reveal
the vast scale of it"; "can show the accelerator as well, so this doesn't look isolated
... panning out at the very last second to full accelerator and then ačiū appears".
Seconds of the slide (the music's second file: the arrival at 17,5, the second climax
42-44, its fade from 51):

  0-2      the clip's last view, held (path[0], hero/lis_pose.py)
  2-5.5    out of the module's end (the stage's own first segment)
  5.5-17.5 the crane down and round to eye level (1,71 m), side on, LHCb filling the frame
           from side to side; LHCb's collision crosses on the music's arrival
  17.5-33  a slow drift back at eye level while the collisions come ever faster and merge
           into the glow (40 million a second), and then
  33-54    without a pause (owner, 22 Oct: "The zoomout to FCC should be slow and
           continuous"; it took 5 s before) the pull-out to the LHC: LHCb shrinks to
           its point on the ring (`ring` in space.json, setup/emblems.js) as the ring
           fades in round it, the emblems ride along to the top of the frame; it stops
           straight above the map (owner, 22 Oct, with CERN's FCC map: "can you use
           something like this?"), north up, the LHC and the whole FCC in frame, Point 8
           marked. 0,6 s later (54,6 s; the pull-out ~35 s on the wall clock at the camera's rate 0,6) a collision in the FCC's middle, and „Ačiū“ and the
           flag out of it.

Poses: position = at + dist (sin yaw cos pitch, sin pitch, cos yaw cos pitch), as
slidev-addon-stage places its camera. The last leg goes in log distance, the target
moving with the distance, so LHCb leaves the frame's middle at an even pace. With
--probe it prints the camera's distance from the flag's anchor at those seconds
(LisTakeover's colAt and embAt) and from the vertex (the ring's `near`/`far`).
"""
import argparse
import math

A = (9.54, -483.06, 0.96)   # the flag's anchor (LisTakeover's `anchor`)
V = (0.0, -480.0, 0.0)      # the vertex: the `thanks` station's origin, Point 8 on the ring
EYE = -484.67               # 1,71 m above the floor (y -6,72 at the station: LHCb's -5,6 m) at 1,2 units a metre


def pose_of(cam, at):
    d = [c - a for c, a in zip(cam, at)]
    r = math.sqrt(sum(v * v for v in d))
    return dict(at=tuple(at), dist=r, yaw=math.degrees(math.atan2(d[0], d[2])), pitch=math.degrees(math.asin(d[1] / r)))


STILL = dict(at=(9.54, -483.362, 0.96), dist=2.236, yaw=-90.0, pitch=-29.74)
OUT = dict(at=(9.6, -482.0, 0.8), dist=7.0, yaw=-80.0, pitch=4.0)
# owner, 22 Oct: "first zoom out untill you reach the eye level, so lhcb is full frame side to
# side, then slowly move out until the beams run at full speed, only then zoom out to lhc fcc"
SIDE = pose_of((12.5, EYE, 16.5), (12.5, -481.2, 0.0))   # eye level, side on, LHCb filling the frame's width (28 units for its ~26)
BACK = pose_of((12.5, EYE + 0.4, 23.5), (12.5, -481.0, 0.0))   # the slow drift back at eye level, as the collisions merge into the glow
RING = dict(at=(-18.33, -480.0, 43.373), dist=191.56, yaw=-34.22, pitch=89.0)   # the accelerator complex (`ring` in space.json) straight from above, north up, the LHC and the whole FCC (hero/ring_map.py prints it)

# legs: (t0, t1, from, to, slope at the start, slope at the end, kind), slopes in units of
# the leg's average pace (1: the average; 0: at rest); 'log': the distance in log space
LEGS = [
    (2.0, 5.5, STILL, OUT, 0.0, 1.0, 'lin'),     # (the stage's own segment: for --probe only)
    (5.5, 17.5, OUT, SIDE, 1.0, 0.06, 'lin'),
    (17.5, 33.0, SIDE, BACK, 0.15, 2.0, 'lin'),
    (33.0, 54.0, BACK, RING, 0.25, 0.0, 'log'),   # its start's pace the drift's end's (~1 unit/s): one move
]
END = LEGS[-1][1]


def hermite(s, m0, m1):
    return (s ** 3 - 2 * s ** 2 + s) * m0 + (-2 * s ** 3 + 3 * s ** 2) + (s ** 3 - s ** 2) * m1


def lerp(a, b, e):
    return a + (b - a) * e


def mix(p, q, e):
    return dict(at=tuple(lerp(a, b, e) for a, b in zip(p['at'], q['at'])),
                **{k: lerp(p[k], q[k], e) for k in ('dist', 'yaw', 'pitch')})


def mix_log(p, q, e):
    # the distance grows geometrically; the target and the heading move with it
    d = math.exp(lerp(math.log(p['dist']), math.log(q['dist']), e))
    f = (d - p['dist']) / (q['dist'] - p['dist'])
    return dict(at=tuple(lerp(a, b, f) for a, b in zip(p['at'], q['at'])), dist=d,
                yaw=lerp(p['yaw'], q['yaw'], e), pitch=lerp(p['pitch'], q['pitch'], e))


def pose(t):
    if t <= 2.0:
        return STILL
    for t0, t1, p, q, m0, m1, kind in LEGS:
        if t0 <= t <= t1:
            e = hermite((t - t0) / (t1 - t0), m0, m1)
            return mix_log(p, q, e) if kind == 'log' else mix(p, q, e)
    return RING


def camera(p):
    y, c = math.radians(p['yaw']), math.radians(p['pitch'])
    return tuple(a + p['dist'] * d for a, d in zip(p['at'], (math.sin(y) * math.cos(c), math.sin(c), math.cos(y) * math.cos(c))))


def num(v):
    v = 0.0 if abs(v) < 5e-4 else v   # never '-0'
    return f'{v:.3f}'.rstrip('0').rstrip('.')


def fmt(t, p):
    a = ', '.join(num(v) for v in p['at'])
    return f"    - [{num(t)}, {{ at: [{a}], dist: {num(p['dist'])}, yaw: {num(p['yaw'])}, pitch: {num(p['pitch'])} }}]"


if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('--step', type=float, default=1.5)
    ap.add_argument('--fine', type=float, default=0.35, help='the key spacing over the pull-out to the ring')
    ap.add_argument('--probe', default='')
    x = ap.parse_args()
    times = [0, 2.0, 5.5]
    t = 5.5
    while True:
        t = round(t + (x.fine if t >= LEGS[-1][0] - 1e-6 else x.step), 3)
        if t >= END - 0.05:
            break
        if t > LEGS[-1][0] and times[-1] < LEGS[-1][0]:
            times.append(LEGS[-1][0])
            t = LEGS[-1][0]
            continue
        times.append(t)
    times.append(END)
    for t in times:
        print(fmt(t, OUT if t == 5.5 else pose(t)))
    for s in [float(v) for v in x.probe.split(',') if v]:
        c = camera(pose(s))
        print(f'# t {s:g} s: the camera {math.dist(c, A):.2f} units from the anchor, {math.dist(c, V):.2f} from the vertex')
