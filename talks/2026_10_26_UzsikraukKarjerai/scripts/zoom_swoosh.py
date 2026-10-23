"""A soft swoosh under the zoom: band-passed noise whose loudness and pitch follow
the clip's speed (remap_zoom.py's STRETCHES), so it rises as the zoom runs fast,
swells through each dissolve and dies away as the web settles. Writes a 48 kHz
stereo WAV of the clip's length.

python3 -I scripts/zoom_swoosh.py OUT.wav
"""
import sys, wave, numpy as np
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from remap_zoom import layout, TOTAL, HOLD, XFS

SR = 48000
BLOCK = 256


def biquad_bp(x, f0, q, zi):
    """One band-pass biquad block (RBJ, constant peak gain) with state zi."""
    w = 2 * np.pi * f0 / SR
    al = np.sin(w) / (2 * q)
    b0, b2 = al, -al
    a0, a1, a2 = 1 + al, -2 * np.cos(w), 1 - al
    b0, b2, a1, a2 = b0 / a0, b2 / a0, a1 / a0, a2 / a0
    y = np.empty_like(x)
    x1, x2, y1, y2 = zi
    for i, v in enumerate(x):
        o = b0 * v + b2 * x2 - a1 * y1 - a2 * y2
        x2, x1, y2, y1 = x1, v, y1, o
        y[i] = o
    zi[:] = (x1, x2, y1, y2)
    return y


def main(out):
    RUN = TOTAL - HOLD
    n = int(TOTAL * SR)
    t = np.arange(n) / SR
    sp = np.zeros(n)
    for j, (t0, d, tt, ss) in enumerate(layout()):
        inside = (t >= t0) & (t <= t0 + d)
        v = np.interp(t[inside] - t0, tt, np.gradient(ss, tt))
        sp[inside] = np.maximum(sp[inside], v)
        if j:                                    # a dissolve jumps far: give it a swell
            sp += 25 * np.exp(-0.5 * ((t - t0 - XFS[j - 1] / 2) / (0.25 + XFS[j - 1] / 3)) ** 2)
    lv = np.log1p(sp) / np.log1p(sp.max())     # 0..1, the felt speed
    k = int(0.35 * SR)                         # smooth it: the swoosh breathes, it does not twitch
    lv = np.convolve(lv, np.hanning(k) / np.hanning(k).sum(), mode='same')
    env = lv ** 1.6
    env *= np.clip(t / 0.8, 0, 1) * np.clip((RUN + 0.4 - t) / 2.5, 0, 1)
    f0 = 260 + 2200 * lv ** 1.3                # from a low rush to an airy hiss
    rng = np.random.default_rng(23)
    chans = []
    for c in range(2):
        x = rng.standard_normal(n)
        y = np.zeros(n)
        zi = np.zeros(4)
        for a in range(0, n, BLOCK):
            b = min(n, a + BLOCK)
            y[a:b] = biquad_bp(x[a:b], f0[a:b].mean(), 0.9, zi)
        chans.append(y * env)
    st = np.stack(chans, 1)
    st *= 0.5 / np.abs(st).max()               # peak −6 dBFS; loudness is set at the mux
    pcm = (st * 32767).astype('<i2')
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    print(out, f'{n / SR:.2f} s')


if __name__ == '__main__':
    main(sys.argv[1])
