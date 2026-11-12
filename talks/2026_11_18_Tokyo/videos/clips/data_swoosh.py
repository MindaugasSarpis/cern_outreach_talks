#!/usr/bin/env python3
"""The sound of slide 12's data clip (the owner, 13 Nov: "need low swoosh effect on 12 has to be really astonishing").

data2019.mp4 (24 s, recorded silent): LHCb appears (0-1 s), a collision in it (the crossing at 2.9 s), its grains arc out
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

    python3 data_swoosh.py OUT.wav      # 48 kHz stereo, 24 s, peak -2 dBFS

Then: ffmpeg -i <the silent cut> -i OUT.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest
videos/raw/data2019.mp4 (takes/README.md).
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 24.0
rng = np.random.default_rng(12)
n = int(SR * DUR)
t = np.arange(n) / SR
sm = lambda x: np.clip(x, 0, 1) ** 2 * (3 - 2 * np.clip(x, 0, 1))
env = lambda a, b, c, d: sm((t - a) / max(b - a, 1e-6)) * (1 - sm((t - c) / max(d - c, 1e-6)))   # up a→b, down c→d
band = lambda x, lo, hi: sosfilt(butter(2, [lo, hi], btype='band', fs=SR, output='sos'), x)
low = lambda x, fc: sosfilt(butter(2, fc, btype='low', fs=SR, output='sos'), x)
white = lambda: rng.uniform(-1, 1, n)
sine = lambda f: np.sin(2 * np.pi * np.cumsum(f) / SR)


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

# the run-in and the crossing
swell = env(0.2, 2.9, 2.9, 3.6) * (sine(np.interp(t, [0, 2.9, 4], [34, 42, 31])) + 0.3 * sine(np.interp(t, [0, 2.9, 4], [68, 84, 62])) + 0.5 * low(white(), 130) * 3)
add(0.5 * swell)
th = np.where(t < 2.9, 0, np.exp(-(t - 2.9) / 0.45)) * sm((t - 2.9) / 0.015) * sine(np.where(t < 2.9, 60, 30 + 34 * np.exp(-(t - 2.9) / 0.12)))
add(0.9 * th)
# the grains
trickle = band(white(), 1400, 5200) * (0.5 + 0.5 * low(np.abs(white()), 14) * 6) * env(3.0, 5.0, 9.0, 13.2)
add(0.035 * trickle, pan=np.interp(t, [3, 13], [0.35, 0.8]))
# the swoosh
rise = env(14.5, 17.4, 17.4, 19.4)
fc = np.interp(t, [14.5, 17.4, 19.3, 24], [70, 900, 110, 110])
air = sweep(white(), fc) * rise ** 1.5
pan = np.interp(t, [14.5, 17.4, 19.3], [0.15, 0.55, 0.85])
add(0.9 * air, pan=pan)
sub = sine(np.interp(t, [14.5, 17.4, 19.3], [34, 52, 36])) * rise + 0.35 * sine(np.interp(t, [14.5, 17.4, 19.3], [68, 104, 72])) * rise
add(0.8 * sub)
rumble = low(white(), 160) * 3 * env(14.8, 17.6, 17.8, 20.0)
add(0.45 * rumble, pan=pan)
# the landing
ta = 19.3
land = np.where(t < ta, 0, np.exp(-(t - ta) / 1.1)) * sm((t - ta) / 0.02) * (sine(np.where(t < ta, 70, 30 + 40 * np.exp(-(t - ta) / 0.5))) + 0.4 * sine(np.where(t < ta, 140, 60 + 80 * np.exp(-(t - ta) / 0.5))))
add(1.0 * land)
add(0.25 * low(white(), 220) * 3 * np.where(t < ta, 0, np.exp(-(t - ta) / 0.35)) * sm((t - ta) / 0.02))
# the peaks
for k, tk in enumerate([17.05, 17.5, 17.85]):
    g = np.where(t < tk, 0, np.exp(-(t - tk) / 0.28)) * sm((t - tk) / 0.01)
    add(0.06 * band(white(), 3800 + 900 * k, 9000) * g, pan=0.4 + 0.15 * k)

mix = np.stack([L, R], 1)
mix = np.tanh(1.3 * mix) / 1.3
mix *= 10 ** (-2 / 20) / np.abs(mix).max()
k = int(0.3 * SR); mix[-k:] *= np.linspace(1, 0, k)[:, None]
with wave.open(sys.argv[1], 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
    f.writeframes((np.clip(mix, -1, 1) * 32767).astype('<i2').tobytes())
