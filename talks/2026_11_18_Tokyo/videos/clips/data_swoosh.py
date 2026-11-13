#!/usr/bin/env python3
"""The sound of slide 12's data clip (its times: the constants below, the clip's own seconds; the paragraph after this
one tells the first version's, of a 24 s clip).

The sound of slide 12's data clip (the owner, 13 Nov: "need low swoosh effect on 12 has to be really astonishing").

data2019.mp4 (35 s since 13 Nov: 11.3 s on the detector first, then what is told here, each second 11.3 s later;
it was 24 s, recorded silent): LHCb appears (0-1 s), a collision in it (the crossing at 2.9 s), its grains arc out
and land as the histogram (to 13 s), the camera flies to the histogram (14.7-19.3 s) while the fit is drawn (15-16.6 s),
the three peaks light (17-18 s), it rests. The sound follows that, all of it low, none of it pitched (the music is under
it):
  0-2.9 s      a sub-bass swell as the beams run in;
  2.9 s        the crossing: a deep thump;
  3-13 s       the grains: a faint trickle of filtered noise, moving left to right, thinning as the histogram fills;
  14.5-19.3 s  the swoosh: a riser (a band of noise opening from 70 Hz to 900 Hz, a sub sine under it swelling from
               34 Hz to 52 Hz) that passes from left to right, loudest at the camera's fastest (17.4 s), and falls to
               a deep landing as the camera arrives (19.3 s: 70 -> 30 Hz, ringing 3.5 s);
  17.0-18.0 s  three soft glints of high noise as the peaks light.

    python3 data_swoosh.py OUT.wav      # 48 kHz stereo, 35 s, peak -2 dBFS

Then: ffmpeg -i <the silent cut> -i OUT.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest
videos/raw/data2019.mp4 (takes/README.md).
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
# the clip's seconds (takes.md slide 2, cut from the take's 1.5 s; 13 Nov)
DUR = 36.5
TC = 12.95                # the crossing: the two bunches meet (read frame by frame, 14 Nov; 15.9 s, used before, is the
                          # debris reaching the first detector plane: the owner, "not on particle collission but on colliison
                          # with first detector plane. It needs to be more expressed and on particle collision and slower")
FILL = (20.5, 31.0)       # the data landing
FLY = (26.0, 31.0)        # the last of the camera's way to the histogram (it moves from 21 s on)
GLINTS = (33.8, 34.25, 34.7)
rng = np.random.default_rng(12)
n = int(SR * DUR)
t = np.arange(n) / SR
sm = lambda x: np.clip(x, 0, 1) ** 2 * (3 - 2 * np.clip(x, 0, 1))
env = lambda a, b, c, d: sm((t - a) / max(b - a, 1e-6)) * (1 - sm((t - c) / max(d - c, 1e-6)))   # up a→b, down c→d
band = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
low = lambda x, fc: sosfilt(butter(2, fc, btype='low', fs=SR, output='sos'), x)
white = lambda: rng.uniform(-1, 1, n)
sine = lambda f: np.sin(2 * np.pi * np.cumsum(f) / SR)
hit = lambda t0, rise, decay: np.where(t < t0, 0, np.exp(-(t - t0) / decay)) * sm((t - t0) / rise)


def sweep(x, f_of_t, q=0.9, step=480):
    """noise through a band-pass whose centre follows f_of_t (in blocks of 10 ms, cross-faded)"""
    out = np.zeros(n)
    win = np.hanning(2 * step)
    for i in range(0, n - 2 * step, step):
        fc = float(f_of_t[i + step])
        lo, hi = max(25.0, fc / (1 + q)), min(SR / 2 - 100, fc * (1 + q))
        out[i:i + 2 * step] += sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x[i:i + 2 * step]) * win
    return out


L = np.zeros(n); R = np.zeros(n)
def add(x, pan=0.5):   # pan: 0 left … 1 right, a number or an array
    p = np.clip(pan, 0, 1) * np.pi / 2
    global L, R
    L += x * np.cos(p); R += x * np.sin(p)

# the opening: the hall's low air while the camera draws back from the detector, past the person
room = (low(white(), 90) * 4 + 0.6 * sine(np.full(n, 41.0)) + 0.3 * sine(np.full(n, 61.5))) * sm(t / 3.0) * (1 - sm((t - (TC - 6.0)) / 3.0)) * (0.55 + 0.45 * sm((t - 3) / 6))
add(0.22 * room)
# the run-in: a swell into the crossing
swell = env(TC - 5.0, TC, TC, TC + 0.5) * (sine(np.interp(t, [TC - 5.0, TC, TC + 1], [32, 44, 31])) + 0.3 * sine(np.interp(t, [TC - 5.0, TC, TC + 1], [64, 88, 62])) + 0.5 * low(white(), 130) * 3)
add(0.6 * swell)
# the crossing (13 Nov, the owner: "collision effect substantial, louder than the music"): the clip's loudest thing by
# far: a hard low hit (62 -> 30 Hz), a body under it falling from 85 Hz to 29 Hz over 2 s and ringing 5 s (the picture
# runs slow), a burst of low noise
add(1.6 * hit(TC, 0.012, 0.8) * sine(np.where(t < TC, 62, 30 + 32 * np.exp(-(t - TC) / 0.2))))
bf = np.where(t < TC, 85, 28 + 57 * np.exp(-(t - TC) / 1.3))     # slower: the fall takes three seconds, the ring nine
add(2.0 * hit(TC, 0.012, 3.0) * (sine(bf) + 0.45 * sine(2 * bf)))
add(1.0 * hit(TC, 0.01, 0.9) * low(white(), 240) * 3)
# the data landing: a faint trickle, left to right, thinning as the histogram fills
f0, f1 = FILL
trickle = band(white(), 1400, 5200) * (0.5 + 0.5 * low(np.abs(white()), 14) * 6) * env(f0, f0 + 2.0, f1 - 4.0, f1)
add(0.03 * trickle, pan=np.interp(t, [f0, f1], [0.35, 0.8]))
# the swoosh: the camera's flight to the histogram
a, b = FLY
top = a + 0.72 * (b - a)
rise = env(a - 0.3, top, top, b + 0.1)
fc = np.interp(t, [a - 0.3, top, b, DUR], [70, 900, 110, 110])
pan = np.interp(t, [a - 0.3, top, b], [0.15, 0.55, 0.85])
add(0.75 * sweep(white(), fc) * rise ** 1.5, pan=pan)
add(0.65 * (sine(np.interp(t, [a - 0.3, top, b], [34, 52, 36])) + 0.35 * sine(np.interp(t, [a - 0.3, top, b], [68, 104, 72]))) * rise)
add(0.4 * low(white(), 160) * 3 * env(a, top + 0.2, top + 0.4, b + 0.8), pan=pan)
# the landing
add(0.8 * hit(b, 0.02, 1.1) * (sine(np.where(t < b, 70, 30 + 40 * np.exp(-(t - b) / 0.5))) + 0.4 * sine(np.where(t < b, 140, 60 + 80 * np.exp(-(t - b) / 0.5)))))
add(0.2 * hit(b, 0.02, 0.35) * low(white(), 220) * 3)
# the peaks
for k, tk in enumerate(GLINTS):
    add(0.05 * band(white(), 3800 + 900 * k, 9000) * hit(tk, 0.01, 0.28), pan=0.4 + 0.15 * k)

mix = np.stack([L, R], 1)
mix = np.tanh(1.2 * mix) / 1.2
mix *= 10 ** (-1.5 / 20) / np.abs(mix).max()
k = int(0.3 * SR); mix[-k:] *= np.linspace(1, 0, k)[:, None]
k = int(0.5 * SR); mix[:k] *= np.linspace(0, 1, k)[:, None]
with wave.open(sys.argv[1], 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
