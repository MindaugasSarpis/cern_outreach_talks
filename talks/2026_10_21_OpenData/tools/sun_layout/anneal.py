"""Search a named sun's layout by annealing (layout.py scores it): each item's direction and
length, the axis, the squash and the camera's target and distance. It starts from the
layout in space.json and deck.md, or with --fresh from rays spread evenly over the
sphere, and writes the best it found as JSON (export.py puts it in place).

  python3 anneal.py out.json [--name vilnius] [--seed 1] [--iters 90000] [--fresh] [--t0 0.01]

A run (90 000 steps) takes some five minutes alone, longer side by side. To retune: a
dozen seeds side by side, from the layout now and --fresh (in the render slot: `pnpm talk
render -- …`), then report.py on their results to pick one (all nine names reading over
the whole 80 s, with the most margin), export.py, a build, and shots across the minute
the slide is up."""
import argparse, json, sys
import numpy as np
from layout import Sun, total, score

a = argparse.ArgumentParser()
a.add_argument('out'); a.add_argument('--name', default='vilnius'); a.add_argument('--seed', type=int, default=1)
a.add_argument('--iters', type=int, default=90000); a.add_argument('--fresh', action='store_true')
a.add_argument('--t0', type=float, default=None, help='the starting temperature (0.03 fresh, 0.01 from the layout now)')
args = a.parse_args()
rng = np.random.default_rng(args.seed)
sun = Sun(args.name)
E, g = sun.layout()
N = len(E)
# the camera stays near the station; the ellipsoid in reason
x0 = sun.C[0]
BOUNDS = dict(tilt=(15, 50), side=(-40, 40), sx=(7, 20), syu=(4, 13), syd=(2.5, 10), sz=(5, 12.5),
              D=(20, 34), tx=(x0 - 7, x0 + 7), ty=(-3, 7))


def spread(n):
    """n directions spread evenly over the sphere (a golden spiral), a little shaken."""
    i = np.arange(n) + 0.5
    yv = 1 - 2 * i / n
    r = np.sqrt(1 - yv * yv); th = np.pi * (3 - np.sqrt(5)) * np.arange(n) + rng.uniform(0, 6.3)
    d = np.stack([r * np.cos(th), yv, r * np.sin(th)], 1) + rng.normal(0, 0.1, (n, 3))
    return (d / np.linalg.norm(d, axis=1, keepdims=True))[rng.permutation(n)]


def length(e):
    """A ray's end, its length kept between half and all of the ellipsoid's."""
    l = np.linalg.norm(e)
    return e / l * np.clip(l, 0.5, 1.0)


if args.fresh:
    E = spread(N) * rng.uniform(0.65, 1.0, N)[:, None]
    g.update(tilt=rng.uniform(25, 50), side=rng.uniform(-20, 20), dir=int(rng.choice([-1, 1])))
for k, (lo, hi) in BOUNDS.items(): g[k] = float(np.clip(g[k], lo, hi))
E = np.array([length(e) for e in E])

T0, T1 = args.t0 if args.t0 is not None else (0.03 if args.fresh else 0.01), 0.0008
cur = total(sun, E, g); best = (cur, E.copy(), dict(g))
for it in range(args.iters):
    T = T0 * (T1 / T0) ** (it / args.iters)
    E2, g2 = E.copy(), dict(g)
    r = rng.uniform()
    if r < 0.6:                                   # move one ray's end
        i = rng.integers(N)
        E2[i] = length(E2[i] + rng.normal(0, 0.12, 3))
    elif r < 0.7:                                 # swap two
        i, j = rng.choice(N, 2, replace=False)
        E2[[i, j]] = E2[[j, i]]
    elif r < 0.73:                                # turn the other way
        g2['dir'] = -g2['dir']
    else:                                         # the axis, the squash or the camera
        k = rng.choice(list(BOUNDS))
        lo, hi = BOUNDS[k]
        g2[k] = float(np.clip(g2[k] + rng.normal(0, 0.06 * (hi - lo)), lo, hi))
    s = total(sun, E2, g2)
    if s > cur or rng.uniform() < np.exp((s - cur) / T):
        E, g, cur = E2, g2, s
        if cur > best[0]: best = (cur, E.copy(), dict(g))
    if it % 5000 == 0: print(json.dumps(dict(it=it, cur=round(cur, 4), best=round(best[0], 4))), file=sys.stderr, flush=True)

s, E, g = best
d = score(sun, E, g, detail=True)
json.dump(dict(score=s, readable_min=int(d['readable'].min()), readable_mean=float(d['readable'].mean()),
               seed=args.seed, fresh=args.fresh, E=E.tolist(), g=g), open(args.out, 'w'))
print(f"{args.out}: score {s:.4f}, names reading at least {int(d['readable'].min())}, on average {d['readable'].mean():.2f}")
