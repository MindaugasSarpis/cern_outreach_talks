#!/usr/bin/env python3
"""The zooming swoosh under slide 2's CERN clip (owner, 10 Nov: "Had have zooming swoosh here").

cern_overview_short.mp4 (11.24 s, silent): the Earth comes in (0-2.3 s), Europe holds with CERN's
box (2.5-4.5 s), the camera dives through the clouds onto Geneva (4.5-6.8 s), the LHC is drawn
(7-11 s). The sound follows that: a soft rising rush as the Earth comes in, the big swoosh on the
dive (a band of noise sweeping up into the clouds and down onto the ground, a low rumble under it,
moving from left to right), then nothing while the ring is drawn.

    python3 swoosh.py OUT.wav      # 48 kHz stereo, 11.24 s

Then: ffmpeg -i cern_overview_short.mp4 -i OUT.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k
-shortest videos/raw/cern_overview_swoosh.mp4 (the manifest's notes).
"""
import sys
import wave

import numpy as np
from scipy.signal import butter, sosfilt

SR = 48000
DUR = 11.24
rng = np.random.default_rng(7)
t = np.arange(int(SR * DUR)) / SR


def bump(t, t0, t1, t2, rise=2.0, fall=2.0):
    """0 before t0, up to 1 at t1 (power `rise`), back to 0 at t2 (power `fall`)."""
    a = np.clip((t - t0) / (t1 - t0), 0, 1) ** rise
    b = np.clip((t2 - t) / (t2 - t1), 0, 1) ** fall
    return np.where(t < t1, a, b)


def swept_band(noise, centre, q=1.4, block=256):
    """Noise through a band-pass whose centre (Hz, per sample) moves; filtered in short blocks
    with the filter state carried over, so the sweep is smooth."""
    out = np.zeros_like(noise)
    zi = None
    for i in range(0, len(noise), block):
        c = float(np.mean(centre[i:i + block]))
        lo, hi = c / (1 + 1 / (2 * q)), c * (1 + 1 / (2 * q))
        sos = butter(2, [max(lo, 30), min(hi, SR / 2 - 100)], btype='band', fs=SR, output='sos')
        if zi is None or zi.shape[0] != sos.shape[0]:
            zi = np.zeros((sos.shape[0], 2))
        out[i:i + block], zi = sosfilt(sos, noise[i:i + block], zi=zi)
    return out


def channel(seed_shift):
    n = rng.standard_normal(len(t))
    # pink-ish: white noise tilted down
    n = sosfilt(butter(1, 1400, btype="low", fs=SR, output="sos"), n) * 2 + n * 0.35
    n = sosfilt(butter(2, 90, btype="high", fs=SR, output="sos"), n)
    # the approach: a soft rush rising as the Earth fills the frame
    c1 = 260 + 900 * bump(t, 0.0, 2.1, 3.0, 1.5, 1.0)
    a1 = 0.28 * bump(t, 0.0, 1.9, 3.2, 1.6, 1.4)
    # the dive: up into the clouds, down onto the ground
    c2 = 220 + 2600 * bump(t, 4.2, 5.25 + seed_shift, 7.0, 1.8, 1.3)
    a2 = 1.0 * bump(t, 4.0, 5.3 + seed_shift, 7.4, 2.2, 1.6)
    s = swept_band(n, c1) * a1 + swept_band(n, c2, q=1.1) * a2
    return s


left, right = channel(-0.06), channel(0.06)
# a low rumble under the dive, the same in both ears
rum = sosfilt(butter(2, [32, 90], btype='band', fs=SR, output='sos'), rng.standard_normal(len(t)))
rum *= 1.1 * bump(t, 4.3, 5.6, 7.6, 1.6, 1.8)
# the dive moves from left to right across the frame
pan = np.clip((t - 4.4) / 2.6, 0, 1)
L = left * (1.1 - 0.5 * pan) + rum
R = right * (0.6 + 0.5 * pan) + rum
# a gentle fade at both ends, then peak-normalise (the encode's loudnorm sets the level)
edge = np.clip(t / 0.05, 0, 1) * np.clip((DUR - t) / 0.3, 0, 1)
x = np.stack([L, R], 1) * edge[:, None]
x /= np.max(np.abs(x)) / 0.89
pcm = (x * 32767).astype('<i2')
with wave.open(sys.argv[1], 'wb') as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print(sys.argv[1], f'{DUR} s, peak -1 dBFS')
