#!/usr/bin/env python3
"""Starfire for the Tokyo finale with a breath before its arrival (13 Nov; the owner: "breath sounds like a good idea, but
needs to be implemented smoothly"). The level eases down on a raised cosine from 12.9 s to a third at 14.1 s, holds, and
is back within 60 ms on the arrival at 14.3 s; set sample by sample (the first try stepped a frame at a time over 0.15 s).
  usage: starfire_breath.py IN.wav OUT.wav   (48 kHz 16-bit stereo, the file from its 1.72 s)"""
import sys, wave
import numpy as np
A, B, C, LOW = 12.9, 14.1, 14.3, 0.33
w = wave.open(sys.argv[1]); sr, ch = w.getframerate(), w.getnchannels()
x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float64).reshape(-1, ch)
t = np.arange(len(x)) / sr
g = np.ones(len(x))
m = (t >= A) & (t < B); g[m] = LOW + (1 - LOW) * 0.5 * (1 + np.cos(np.pi * (t[m] - A) / (B - A)))
g[(t >= B) & (t < C)] = LOW
m = (t >= C) & (t < C + 0.06); g[m] = LOW + (1 - LOW) * 0.5 * (1 - np.cos(np.pi * (t[m] - C) / 0.06))
o = wave.open(sys.argv[2], 'w'); o.setnchannels(ch); o.setsampwidth(2); o.setframerate(sr)
o.writeframes(np.clip(x * g[:, None], -32768, 32767).astype(np.int16).tobytes())
