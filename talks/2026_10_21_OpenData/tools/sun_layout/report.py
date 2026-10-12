"""How a named sun's layout reads over the time the slide is up: how many names plainly
read in each five seconds, and when each one does not, and why. The layout is the one in
space.json and deck.md, or anneals' results (the best first).

  python3 report.py [result.json …] [--name vilnius] [--png sheet.png --at 3,20,40,60]

--png draws the layout at those times (clusters, names, piles, the role box; needs
matplotlib): a name boxed red does not read then."""
import argparse, json
import numpy as np
from layout import Sun, score, metrics, readable, project, TS, ASP, TH

a = argparse.ArgumentParser()
a.add_argument('runs', nargs='*'); a.add_argument('--name', default='vilnius')
a.add_argument('--png'); a.add_argument('--at', default='3,15,30,45,60,75')
args = a.parse_args()
sun = Sun(args.name)
WHY = [('off the frame', lambda m: m['inf'] <= 0.97), ('over the role', lambda m: m['role'] >= 0.01),
       ('under a nearer one', lambda m: m['ll'] + m['lc'] >= 0.05), ('behind the pile', lambda m: m['pileB'] >= 0.1),
       ('by another cluster', lambda m: m['amb'] >= 0.5), ('over a pile', lambda m: m['lp'] >= 0.05),
       ('in the vignette', lambda m: m['bright'] < 0.8)]


def show(title, E, g):
    d = score(sun, E, g, detail=True); r = d['readable']; m = d['m']
    # (the names gather over the first 3 s)
    print(f'{title}: score {d["score"]:.4f}; names reading, the fewest in each 5 s from 3 s:')
    print('  ' + ' '.join(f'{int(r[(TS >= max(t, 3)) & (TS < t + 5)].min())}' for t in range(0, 80, 5)))
    ok = readable(m)
    for i in np.flatnonzero(sun.named):
        bad = TS[~ok[:, i] & (TS >= 3)]
        if not len(bad): continue
        # the stretches it does not read, and the first reason in each
        cuts = np.flatnonzero(np.diff(bad) > 0.75)
        spans = [(bad[s], bad[e]) for s, e in zip(np.r_[0, cuts + 1], np.r_[cuts, len(bad) - 1])]
        why = lambda t: next((w for w, f in WHY if f(m)[np.searchsorted(TS, t), i]), '?')
        print(f'  {sun.lines[i][0]!r:24} ' + ', '.join(f'{a:g}–{b:g} s {why(a)}' for a, b in spans))


def draw(path, E, g, ts):
    import matplotlib; matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    from matplotlib.patches import Circle, Rectangle
    m = metrics(sun, E, g, np.array(ts)); G = m['G']; ok = readable(m)
    cols = 3; rows = (len(ts) + cols - 1) // cols
    fig, axs = plt.subplots(rows, cols, figsize=(cols * 6.4, rows * 3.6), facecolor='black', squeeze=False)
    R0 = sun.role
    for n, t in enumerate(ts):
        ax = axs.flat[n]; ax.set_facecolor('black')
        ax.set_xlim(-ASP, ASP); ax.set_ylim(-1, 1); ax.set_aspect('equal'); ax.set_xticks([]); ax.set_yticks([])
        ax.add_patch(Rectangle((R0[0], R0[2]), R0[1] - R0[0], R0[3] - R0[2], fill=False, ec='#4466aa'))
        for at, R in sun.piles:
            q = project((sun.C + at)[None], G['cam'])
            ax.add_patch(Circle((q[0][0], q[1][0]), R / (q[2][0] * TH), color='#b8862b', zorder=5))
        z = G['z'][n]
        for i in np.argsort(-z):
            x, y, rc = G['x'][n, i], G['y'][n, i], G['rc'][n, i]
            front = z[i] < G['pz']; al = 1.0 if front else 0.5
            ax.plot([G['px'], x], [G['py'], y], color='#ffe3a8', alpha=0.3 * al, lw=0.8, zorder=6 if front else 4)
            ax.add_patch(Circle((x, y), rc, color='white' if sun.named[i] else '#ffc05a', alpha=0.8 * al, zorder=6 if front else 4))
            if sun.named[i]:
                lx, ly, hw, hh = G['lx'][n, i], G['ly'][n, i], G['hw'][n, i], G['hh'][n, i]
                ax.add_patch(Rectangle((lx - hw, ly - hh), 2 * hw, 2 * hh, fill=False, ec='#88aaff' if ok[n, i] else 'red', lw=0.8, zorder=7))
                ax.text(lx, ly, ' / '.join(sun.lines[i]), color='white', fontsize=5, ha='center', va='center', zorder=8, alpha=al)
        ax.set_title(f't = {t:g} s', color='white', fontsize=8)
    plt.tight_layout(); plt.savefig(path, dpi=110, facecolor='black')


layouts = [(f'{p} (seed {(r := json.load(open(p)))["seed"]})', np.array(r['E']), r['g']) for p in args.runs] or [('now', *sun.layout())]
layouts.sort(key=lambda l: -score(sun, l[1], l[2]))          # the best first
for title, E, g in layouts: show(title, E, g)
if args.png: draw(args.png, *layouts[0][1:], [float(t) for t in args.at.split(',')])
