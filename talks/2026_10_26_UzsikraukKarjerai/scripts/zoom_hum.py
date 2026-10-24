"""A low hum under the zoom (slide 2), in place of zoom_swoosh.py's whoosh (the owner, 24 Oct:
"the swoosh is not nice, too high, maybe some low hum on the zoomout"): a drone on about
41 Hz with its first harmonics (so a small speaker still carries it) and a low rumble, nothing
above about 400 Hz. It is there from the first frame, swells as the zoom runs fast and through
each warp, its pitch gliding up a fourth at full warp, and dies away as the web settles.
Starfire starts over it on the same slide (<Soundtrack start>). Writes a 48 kHz stereo WAV of
the clip's length; loudness is set at the mux.

python3 -I scripts/zoom_hum.py OUT.wav
"""
import sys, wave, numpy as np
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from remap_zoom import layout, TOTAL, HOLD, warp_w

SR = 48000


def smooth(x, sec):
    k = max(3, int(sec * SR) | 1)
    h = np.hanning(k)
    from scipy.signal import fftconvolve
    return fftconvolve(x, h / h.sum(), mode='same')


def lowpass(x, fc):
    """Two one-pole low-passes in series (a gentle 12 dB/octave)."""
    a = np.exp(-2 * np.pi * fc / SR)
    from scipy.signal import lfilter
    for _ in range(2):
        x = lfilter([1 - a], [1, -a], x)
    return x


def main(out):
    RUN = TOTAL - HOLD
    n = int(TOTAL * SR)
    t = np.arange(n) / SR
    sp = np.zeros(n)
    for t0, d, tt, ss in layout():
        inside = (t >= t0) & (t <= t0 + d)
        sp[inside] = np.maximum(sp[inside], np.interp(t[inside] - t0, tt, np.gradient(ss, tt)))
    w = smooth(warp_w(sp), 0.6)
    lv = smooth(np.log1p(sp) / np.log1p(sp.max()), 1.2)
    # a steady bed that swells with the speed and the warp
    env = 0.45 + 0.25 * lv + 0.30 * w
    env *= np.clip(t / 1.5, 0, 1) ** 2 * np.clip((RUN + 0.5 - t) / 3.5, 0, 1) ** 1.5
    f0 = 41.2 * 2 ** (5 / 12 * w)                 # E1, up to A1 at full warp
    chans = []
    rng = np.random.default_rng(41)
    for c, det in ((0, 0.0), (1, 0.35)):         # the right a third of a hertz sharp: a slow beat
        ph = 2 * np.pi * np.cumsum(f0 + det) / SR
        tone = (np.sin(ph) + 0.55 * np.sin(2 * ph + 0.3) + 0.30 * np.sin(3 * ph + 0.9)
                + 0.14 * np.sin(4 * ph + 1.7) + 0.06 * np.sin(5 * ph + 2.1))
        rumble = lowpass(rng.standard_normal(n), 110) * 9.0 * (0.3 + 0.7 * np.maximum(lv, w))
        chans.append((tone + rumble) * env)
    st = np.stack(chans, 1)
    st *= 0.5 / np.abs(st).max()                  # peak -6 dBFS; loudness is set at the mux
    pcm = (st * 32767).astype('<i2')
    with wave.open(out, 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes(pcm.tobytes())
    print(out, f'{n / SR:.2f} s')


if __name__ == '__main__':
    main(sys.argv[1])
