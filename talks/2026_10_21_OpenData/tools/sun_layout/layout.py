"""Slide 12's sun of named clusters (setup/sun.js: a `sun` whose items have a `label`),
modelled as sun.js draws it, so its layout can be searched (anneal.py) and checked
(report.py) without a browser: the items turned about `axis` on the unit sphere and
stretched to the ellipsoid `squash`, seen from the slide's pose (fov 50, 16:9); each
name standing outward from the pile on the screen, just off its cluster's rim, held by
its edge or corner on that side, at a fixed size on the screen.

The sun comes from public/data/space.json and the pose from deck.md (the `space:` of the
slide whose <Grains :set> turns the sun on), the names' widths from the font (font.py),
the vignette from the deck's stage options. What sun.js does with a name (its pitch, its
anchor, its size for depth, its px) is copied below and in font.py: change them together.

A layout is the items' ends on the unit sphere (E, one row an item) and `g`: the axis
(tilt toward the camera, side, and which way it turns), the squash and the camera's
target and distance. It is scored over the time the slide is up: a name reads when it
is in the frame, off the role box, not under a nearer name or cluster, nearer its own
cluster than any other, its cluster not behind a pile, and out of the vignette's dark
(the stage's finish darkens the frame toward its edges, by `vignette` at the corners:
a name there comes out grey however bright it is drawn)."""
import json, re
from pathlib import Path
import numpy as np
from font import Font

TALK = Path(__file__).resolve().parents[2]
FOV = np.radians(50); ASP = 16 / 9; TH = np.tan(FOV / 2)

# as sun.js draws a name
PITCH = 0.8            # a line's pitch in a stack, in sprite heights
RIM = 1.15             # its anchor from its cluster's middle, in the cloud's radius (0.36 of the width)
SIZE = (0.95, 1.1)     # how much larger in front, smaller behind
SPACING = 0.06         # makeLabel's letterSpacing

# when: a sample every half second over the time the slide may be up, the first
# minute counting most (the rays still grow over the first 3 s)
TS = np.arange(0.0, 80.01, 0.5)
WT = np.where(TS < 3, 0.5, np.where(TS <= 65, 1.0, 0.6))
GAP = (0.03, 0.012)    # the room each name keeps round its text (screen units), so two never read as one
OWN = 0.05             # a name is nearer its own cluster's rim than any other's by this much
FILL = (0.86, 0.8)     # and the sun spans this share of the frame's width and height
BRIGHT = (0.7, 0.9)    # a name reads fully where the vignette leaves this much of its light, not at all below the first


def flow(s):
    """A YAML flow mapping as the deck writes them ({ at: [1, 2, 3], dist: 4 }), as JSON."""
    j = re.sub(r'([{,]\s*)([A-Za-z_][\w-]*)\s*:', r'\1"\2":', s)
    j = re.sub(r':\s*([A-Za-z_][\w.-]*)\s*(?=[,}\]])', r': "\1"', j)
    return json.loads(j)


def number(v):
    return f'{round(float(v), 2):g}'


class Sun:
    """One named sun as space.json and deck.md have it now."""

    def __init__(self, name='vilnius', talk=TALK):
        self.name, self.talk = name, Path(talk)
        self.space_path, self.deck_path = self.talk / 'public' / 'data' / 'space.json', self.talk / 'deck.md'
        self.space = json.loads(self.space_path.read_text())
        found = [(st, o) for st in self.space['stations'] for o in st['objects'] if o.get('type') == 'sun' and o.get('name') == name]
        assert len(found) == 1, f'{len(found)} suns named {name} in space.json'
        st, o = found[0]
        self.o = o
        self.C = np.array(st['pos'], float) + np.array(o.get('pos', [0, 0, 0]), float)   # its middle, in the world
        self.piles = [(np.array(p[:3], float), p[3]) for p in o.get('piles', [[0, 0, 0, o.get('pileR', 1.9)]])]
        w = o.get('w', 6); h = w * o.get('aspect', 0.625)
        self.rc = 0.36 * min(w, h)                     # a cloud's radius (sun.js: 0.36 of a plot's size)
        self.lh = o.get('labelH', 0.04)
        self.turn = o.get('turn', 72)
        k = o.get('keepOut', [-2, -2, -2, -2])        # the role box: screen −1…1, x then y
        self.role = (k[0] * ASP - 0.02, k[1] * ASP + 0.02, k[2] - 0.02, k[3] + 0.02)
        items = o['items']
        self.named = np.array([bool(it.get('label')) for it in items])
        self.lines = [it['label'].split('\n') if it.get('label') else [] for it in items]
        f = Font(self.talk)
        # each name's widest line, and its lines, in sprite heights (0 for an empty place)
        self.wide = np.array([max((f.sprite(l, SPACING) for l in L), default=0) for L in self.lines])
        self.nlines = np.array([len(L) for L in self.lines])
        self.deck = self.deck_path.read_text()
        self.pose_line, self.pose = self._pose()
        # the stage's vignette (its headmatter's options, else the stage's default)
        head = self.deck.split('\n---\n', 1)[0] if self.deck.startswith('---\n') else ''
        v = re.search(r'^\s*options:.*\bvignette:\s*([0-9.]+)', head, re.M)
        self.vignette = float(v.group(1)) if v else 0.3

    def _pose(self):
        lines = self.deck.split('\n')
        on = [i for i, l in enumerate(lines) if l.startswith('<Grains') and re.search(rf'[{{,]\s*{self.name}: 1\s*[,}}]', l)]
        assert len(on) == 1, f'{len(on)} slides turn {self.name} on'
        i = on[0]
        while i > 0 and not lines[i].startswith('space: {'): i -= 1
        # its own: only the closing --- of the slide's frontmatter lies between
        assert lines[i].startswith('space: {') and lines[i:on[0]].count('---') == 1, f'no space: on the slide that turns {self.name} on'
        return i, flow(lines[i][len('space: '):])

    def layout(self):
        """The layout now: E and g."""
        sq = self.o.get('squash', [24, 12, 9, 9])
        at = np.array([it.get('at', [0, 0, 0]) for it in self.o['items']], float)
        E = at / np.stack([np.full(len(at), sq[0]), np.where(at[:, 1] > 0, sq[1], sq[3]), np.full(len(at), sq[2])], 1)
        k = np.array(self.o.get('axis', [0, 1, 0]), float); k /= np.linalg.norm(k)
        d = 1 if k[1] >= 0 else -1; k = k * d
        p = self.pose
        g = dict(tilt=float(np.degrees(np.arctan2(k[2], k[1]))), side=float(np.degrees(np.arcsin(k[0]))), dir=d,
                 sx=sq[0], syu=sq[1], sz=sq[2], syd=sq[3], tx=p['at'][0], ty=p['at'][1], D=p['dist'])
        return E, g

    def items_at(self, E, g):
        """The items' `at` (from the sun's middle, as the turn starts) for space.json."""
        return [[round(float(v), 2) for v in r] for r in squash(E[None], g)[0]]

    def write(self, E, g):
        """Put a layout into space.json (the axis, the squash, each item's `at`) and deck.md
        (the slide's target and distance); everything else as it was."""
        o = self.o
        o['axis'] = [round(float(v), 4) for v in axis_of(g)]
        o['squash'] = [round(float(g[k]), 2) for k in ('sx', 'syu', 'sz', 'syd')]
        for it, a in zip(o['items'], self.items_at(E, g)): it['at'] = a
        self.space_path.write_text(json.dumps(self.space, indent=1, ensure_ascii=False) + '\n')
        p = dict(self.pose); p['at'] = [g['tx'], g['ty'], p['at'][2]]; p['dist'] = g['D']
        val = lambda v: '[' + ', '.join(number(x) for x in v) + ']' if isinstance(v, list) else number(v) if isinstance(v, (int, float)) else str(v)
        line = 'space: { ' + ', '.join(f'{k}: {val(v)}' for k, v in p.items()) + ' }'
        lines = self.deck.split('\n'); lines[self.pose_line] = line
        self.deck_path.write_text('\n'.join(lines))
        return line


# ---- the geometry -------------------------------------------------------------------------

def axis_of(g):
    a, s = np.radians(g['tilt']), np.radians(g['side'])
    k = np.array([np.sin(s), np.cos(a) * np.cos(s), np.sin(a) * np.cos(s)])
    return g['dir'] * k / np.linalg.norm(k)


def squash(V, g):
    S = V.copy()
    S[..., 0] *= g['sx']; S[..., 2] *= g['sz']
    S[..., 1] *= np.where(V[..., 1] > 0, g['syu'], g['syd'])
    return S


def camera(sun, g):
    p = sun.pose
    T = np.array([g['tx'], g['ty'], p['at'][2]], float)
    yaw, pitch = np.radians(p.get('yaw', 0)), np.radians(p.get('pitch', 0))
    eye = T + g['D'] * np.array([np.sin(yaw) * np.cos(pitch), np.sin(pitch), np.cos(yaw) * np.cos(pitch)])
    f = (T - eye) / g['D']
    rt = np.cross(f, [0, 1, 0]); rt /= np.linalg.norm(rt)
    return eye, f, rt, np.cross(rt, f)


def project(P, cam):
    """On the screen: x in screen units (the height's, so −16/9…16/9), y (−1…1), and depth."""
    eye, f, rt, up = cam
    q = P - eye
    z = q @ f
    return (q @ rt) / (z * TH), (q @ up) / (z * TH), z


def stand(E, g, turn, ts):
    """Where each item stands at each time, from the sun's middle: [t, item, xyz]."""
    k = axis_of(g)
    a = 2 * np.pi / turn * ts[:, None, None]
    c, s = np.cos(a), np.sin(a)
    V = E[None] * c + np.cross(k, E)[None] * s + (E @ k)[None, :, None] * k * (1 - c)
    return squash(V, g)


def ov(a0, a1, b0, b1):
    return np.clip(np.minimum(a1, b1) - np.maximum(a0, b0), 0, None)


def soft(v, a, b):
    t = np.clip((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t)


def vignette(sun, x, y):
    """What the stage's finish leaves of the light at a point of the screen."""
    r2 = (x / (2 * ASP)) ** 2 + (y / 2) ** 2
    return 1 - sun.vignette * soft(2 * r2, 0.15, 0.75)


def geometry(sun, E, g, ts=TS):
    """Per time and item: its cluster's middle, radius and depth on the screen, and its
    name's text box (its middle and half sizes)."""
    cam = camera(sun, g)
    P = sun.C + stand(E, g, sun.turn, ts)
    x, y, z = project(P, cam)
    rc = sun.rc / (z * TH)
    pc = project((sun.C + sun.piles[0][0])[None], cam); px, py, pz = pc[0][0], pc[1][0], pc[2][0]
    # outward from the pile on the screen; the anchor on that side of the rim, the name held
    # by its edge or corner there (the way out mapped onto the square's rim)
    dx, dy = x - px, y - py
    d = np.hypot(dx, dy) + 1e-9
    ux, uy = dx / d, dy / d
    m = np.maximum(np.abs(ux), np.abs(uy))
    sx, sy = ux / m, uy / m
    ax, ay = x + ux * rc * RIM, y + uy * rc * RIM
    s = np.clip(np.sqrt(np.linalg.norm(sun.C - cam[0]) / np.linalg.norm(P - cam[0], axis=-1)), *SIZE)
    Hs = sun.lh / TH * s                                     # a sprite's height on the screen
    WS = sun.wide[None] * Hs                                 # the stack's sprites: widest, and tall
    HS = (1 + PITCH * (sun.nlines[None] - 1)) * Hs
    hw = np.where(sun.named[None], WS / 2 - Hs / 3, 0)       # the text: less a third of a line at each end,
    hh = np.where(sun.named[None], (HS - 0.4 * Hs) / 2, 0)   # and the room above and below the letters
    lx, ly = ax + 0.5 * sx * WS, ay + 0.5 * sy * HS
    return dict(P=P, x=x, y=y, z=z, rc=rc, px=px, py=py, pz=pz, lx=lx, ly=ly, hw=hw, hh=hh, cam=cam)


def metrics(sun, E, g, ts=TS):
    G = geometry(sun, E, g, ts)
    x, y, z, rc = G['x'], G['y'], G['z'], G['rc']
    lx, ly, hw, hh = G['lx'], G['ly'], G['hw'], G['hh']
    n = E.shape[0]
    A = np.maximum(4 * hw * hh, 1e-6)
    named = sun.named[None, None, :]
    nearer = z[:, None, :] < z[:, :, None]                   # [t, i, j]: j nearer than i
    other = ~np.eye(n, dtype=bool)[None]
    # a name under another (as sun.js counts it, and with the room round each)
    lox = ov((lx - hw)[:, :, None], (lx + hw)[:, :, None], (lx - hw)[:, None, :], (lx + hw)[:, None, :])
    loy = ov((ly - hh)[:, :, None], (ly + hh)[:, :, None], (ly - hh)[:, None, :], (ly + hh)[:, None, :])
    ll = (lox * loy * nearer * other * named).sum(-1) / A
    pw, ph = hw + GAP[0], hh + GAP[1]
    gox = ov((lx - pw)[:, :, None], (lx + pw)[:, :, None], (lx - pw)[:, None, :], (lx + pw)[:, None, :])
    goy = ov((ly - ph)[:, :, None], (ly + ph)[:, :, None], (ly - ph)[:, None, :], (ly + ph)[:, None, :])
    llany = (gox * goy * other * named).sum(-1) / A
    # a name over a cluster (sun.js's box for it: the cloud's radius each way)
    cox = ov((lx - hw)[:, :, None], (lx + hw)[:, :, None], (x - rc)[:, None, :], (x + rc)[:, None, :])
    coy = ov((ly - hh)[:, :, None], (ly + hh)[:, :, None], (y - rc)[:, None, :], (y + rc)[:, None, :])
    lc = (cox * coy * nearer * other).sum(-1) / A
    lcany = (cox * coy * other).sum(-1) / A
    # whose name it is: from its text to its own cluster's rim, and to each other's
    bx = np.maximum(np.abs(x[:, None, :] - lx[:, :, None]) - hw[:, :, None], 0)
    by = np.maximum(np.abs(y[:, None, :] - ly[:, :, None]) - hh[:, :, None], 0)
    dr = np.hypot(bx, by) - rc[:, None, :]
    own = np.einsum('tii->ti', dr)
    amb = np.where(other, soft(own[:, :, None] + OWN - dr, 0, OWN), 0).max(-1)
    # clusters over clusters (a disc as the square of its area)
    cr = rc * 0.886; Ac = 4 * cr * cr
    ccx = ov((x - cr)[:, :, None], (x + cr)[:, :, None], (x - cr)[:, None, :], (x + cr)[:, None, :])
    ccy = ov((y - cr)[:, :, None], (y + cr)[:, :, None], (y - cr)[:, None, :], (y + cr)[:, None, :])
    cc = (ccx * ccy * nearer * other).sum(-1) / Ac
    # the piles: behind one a cluster is hidden (its name steps back); a name over one is hard to read
    pileB = np.zeros_like(x); lp = np.zeros_like(x); cpile = np.zeros_like(x)
    for at, R in sun.piles:
        q = project((sun.C + at)[None], G['cam']); qx, qy, qz = q[0][0], q[1][0], q[2][0]
        r = R / (qz * TH) * 0.886
        o = ov(x - rc, x + rc, qx - r, qx + r) * ov(y - rc, y + rc, qy - r, qy + r) / (4 * rc * rc)
        pileB += np.where(z > qz, o, 0)
        cpile += ov(x - cr, x + cr, qx - r, qx + r) * ov(y - cr, y + cr, qy - r, qy + r) / Ac
        lp += ov(lx - hw, lx + hw, qx - r, qx + r) * ov(ly - hh, ly + hh, qy - r, qy + r) / A
    R0 = sun.role
    role = ov(lx - hw, lx + hw, R0[0], R0[1]) * ov(ly - hh, ly + hh, R0[2], R0[3]) / A
    crole = ov(x - cr, x + cr, R0[0], R0[1]) * ov(y - cr, y + cr, R0[2], R0[3]) / Ac
    fx = ASP - 0.07; fy = 0.95
    inf = ov(lx - hw, lx + hw, -fx, fx) * ov(ly - hh, ly + hh, -fy, fy) / A
    cinf = ov(x - cr, x + cr, -ASP, ASP) * ov(y - cr, y + cr, -1, 1) / Ac
    dpile = np.hypot(x - G['px'], y - G['py'])
    rp = sun.piles[0][1] / (G['pz'] * TH)
    # how much of a name's light the vignette leaves, along its text
    bright = np.mean([vignette(sun, lx + k * hw, ly) for k in (-1, -0.5, 0, 0.5, 1)], 0)
    return dict(G=G, ll=ll, llany=llany, lc=lc, lcany=lcany, amb=amb, cc=cc, pileB=pileB, cpile=cpile, lp=lp,
                role=role, crole=crole, inf=inf, cinf=cinf, dpile=dpile, rp=rp, bright=bright)


def reads(m):
    """How well each name reads at each time (0…1): what sun.js lets show, and whether it
    is plainly its own cluster's."""
    return (soft(m['inf'], 0.9, 0.99) * (1 - soft(m['role'], 0.0, 0.04)) * (1 - soft(m['ll'] + m['lc'], 0.02, 0.12))
            * (1 - soft(m['pileB'], 0.05, 0.3)) * (1 - 0.6 * soft(m['lp'], 0.02, 0.15)) * (1 - 0.8 * m['amb'])
            * soft(m['bright'], *BRIGHT))


def readable(m):
    """Each name at each time: does it plainly read?"""
    return ((m['inf'] > 0.97) & (m['role'] < 0.01) & (m['ll'] + m['lc'] < 0.05) & (m['pileB'] < 0.1)
            & (m['amb'] < 0.5) & (m['lp'] < 0.05) & (m['bright'] >= 0.8))


def score(sun, E, g, ts=TS, wt=WT, detail=False):
    m = metrics(sun, E, g, ts)
    G = m['G']; L = sun.named; X = ~sun.named
    good = reads(m)[:, L].mean(1)
    # an empty place shows: in the frame, not behind a pile, not in the role box
    if X.any():
        seen = (soft(m['cinf'], 0.7, 0.95) * (1 - soft(m['pileB'], 0.1, 0.4)) * (1 - soft(m['crole'], 0.0, 0.2)))[:, X]
        good = good * 0.85 + 0.15 * seen.mean(1)
    # what crowds: clusters over one another, a name over any other name or cluster (the
    # nearer one reads, but text over text is busy), a name nearer another's cluster, a
    # cluster in the pile's glow or over a pile (gold on gold reads as one)
    near_pile = soft(m['rp'] * 1.6 + G['rc'] - m['dpile'], 0, 0.15)
    pen = (0.25 * np.minimum(m['cc'], 1).mean(1) + 0.3 * np.minimum(m['llany'][:, L], 1).mean(1)
           + 0.15 * np.minimum(m['lcany'][:, L], 1).mean(1) + 0.3 * m['amb'][:, L].mean(1) + 0.3 * near_pile.mean(1)
           + 0.5 * m['crole'].mean(1) + 0.3 * (1 - m['cinf']).mean(1) + 0.6 * np.minimum(m['cpile'], 1).mean(1))
    # and it fills the slide: the clusters and their names span most of its width and height
    x0 = np.minimum((G['x'] - G['rc']).min(1), (G['lx'] - G['hw'])[:, L].min(1))
    x1 = np.maximum((G['x'] + G['rc']).max(1), (G['lx'] + G['hw'])[:, L].max(1))
    y0 = np.minimum((G['y'] - G['rc']).min(1), (G['ly'] - G['hh'])[:, L].min(1))
    y1 = np.maximum((G['y'] + G['rc']).max(1), (G['ly'] + G['hh'])[:, L].max(1))
    fill = 0.5 * np.minimum(1, (x1 - x0) / (2 * ASP * FILL[0])) + 0.5 * np.minimum(1, (y1 - y0) / (2 * FILL[1]))
    s = good - pen - 0.4 * (1 - fill)
    tot = float((s * wt).sum() / wt.sum())
    if not detail: return tot
    return dict(score=tot, readable=readable(m)[:, L].sum(1), m=m)


def shape(sun, E, g):
    """Keep it a sun: rays to every side on the screen, some in front of the pile and some
    behind, the near ones clearly larger than the far, and every one sweeping round."""
    pen = 0.0
    for t in (3.0, 20.0, 40.0):
        G = geometry(sun, E, g, np.array([t]))
        x, y, z = G['x'][0], G['y'][0], G['z'][0]
        ang = np.sort(np.arctan2(y - G['py'], x - G['px']))
        gap = np.max(np.diff(np.concatenate([ang, ang[:1] + 2 * np.pi])))
        pen += 0.4 * max(0, gap - np.radians(75))
        pen += 0.8 * max(0, abs(np.mean(z < G['pz']) - 0.5) - 0.15)
        pen += 0.5 * max(0, 1.6 - z.max() / z.min())
        # the near clusters large, the far ones not specks (screen units: 450 px a unit at 900p)
        pen += 3 * max(0, 0.085 - G['rc'][0].max()) + 3 * max(0, 0.042 - G['rc'][0].min())
    # none near the axis's poles, where it would only spin on the spot
    pole = np.abs(E @ axis_of(g)) / np.linalg.norm(E, axis=1)
    pen += 0.5 * np.clip(pole - 0.75, 0, None).sum()
    return pen


def total(sun, E, g):
    return score(sun, E, g) - shape(sun, E, g)
