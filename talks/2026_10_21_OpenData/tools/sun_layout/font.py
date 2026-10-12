"""How wide the stage draws a name: makeLabel (slidev-addon-stage, stage/labels.js) sets
each line in Space Grotesk 500 at `px` (sun.js's names: 44) with a hair space between its
letters, on a canvas `ceil(text · (1 + letterSpacing / 2)) + px` wide and 1.5 px tall, so a
line's sprite is that canvas at the name's height. The widths come from the font the deck loads (the
@fontsource files, read here with the standard library: a WOFF is zlib'd tables). Space
Grotesk has no hair space; the browser takes it from its fallback, 1/16 em in the shots'
Chromium. Checked against Chromium's measureText: within 0.5 % (FAIR, short, 2.5 %)."""
import struct, zlib
from pathlib import Path

PX = 44                 # sun.js's NAME_PX
HAIR = 1 / 16           # a hair space, in em
SUBSETS = ('latin', 'latin-ext')


def _tables(path):
    b = path.read_bytes()
    assert b[:4] == b'wOFF', f'{path}: not a WOFF'
    n = struct.unpack('>H', b[12:14])[0]
    out = {}
    for k in range(n):
        tag, off, comp, orig, _ = struct.unpack('>4sIIII', b[44 + 20 * k:64 + 20 * k])
        d = b[off:off + comp]
        out[tag.decode()] = zlib.decompress(d) if comp < orig else d
    return out


def _advances(path):
    """Each character's advance, in em (the Windows Unicode cmap, format 4)."""
    t = _tables(path)
    upm = struct.unpack('>H', t['head'][18:20])[0]
    nh = struct.unpack('>H', t['hhea'][34:36])[0]
    adv = struct.unpack('>' + 'Hh' * nh, t['hmtx'][:4 * nh])[::2]
    c = t['cmap']
    subs = [struct.unpack('>HHI', c[4 + 8 * k:12 + 8 * k]) for k in range(struct.unpack('>H', c[2:4])[0])]
    off = next(o for p, e, o in subs if (p, e) == (3, 1))
    seg = struct.unpack('>H', c[off + 6:off + 8])[0] // 2
    arr = lambda at: struct.unpack(f'>{seg}H', c[at:at + 2 * seg])
    ends, starts, deltas = arr(off + 14), arr(off + 16 + 2 * seg), arr(off + 16 + 4 * seg)
    ro_at = off + 16 + 6 * seg; ros = arr(ro_at)
    m = {}
    for k in range(seg):
        for ch in range(starts[k], min(ends[k], 0xFFFE) + 1):
            if ros[k] == 0: gid = (ch + deltas[k]) & 0xFFFF
            else:
                a = ro_at + 2 * k + ros[k] + 2 * (ch - starts[k])
                gid = struct.unpack('>H', c[a:a + 2])[0]
                gid = (gid + deltas[k]) & 0xFFFF if gid else 0
            if gid: m[chr(ch)] = adv[min(gid, nh - 1)] / upm
    return m


def fontsource(talk):
    """The @fontsource/space-grotesk files, from the talk's node_modules or the repo's."""
    for d in (talk, *talk.parents):
        f = d / 'node_modules' / '@fontsource' / 'space-grotesk' / 'files'
        if f.is_dir(): return f
    raise FileNotFoundError('@fontsource/space-grotesk: run pnpm install')


class Font:
    def __init__(self, talk, weight=500):
        files = fontsource(Path(talk).resolve())
        self.adv = {}
        for sub in reversed(SUBSETS):     # latin wins where both have a letter, as its unicode-range does
            self.adv.update(_advances(files / f'space-grotesk-{sub}-{weight}-normal.woff'))

    def text(self, s):
        """The line's width on makeLabel's canvas, in px."""
        miss = [ch for ch in s if ch not in self.adv]
        assert not miss, f'not in Space Grotesk: {miss}'
        return PX * (sum(self.adv[ch] for ch in s) + HAIR * max(0, len(s) - 1))

    def sprite(self, s, spacing=0.06):
        """The line's sprite width, in sprite heights."""
        import math
        return (math.ceil(self.text(s) * (1 + spacing * 0.5)) + PX) / (1.5 * PX)
