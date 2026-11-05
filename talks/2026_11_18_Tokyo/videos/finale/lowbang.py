"""The low bang, rendered offline: components/lhc-opening/sound.js (swell, thump,
held drone, four-second fly-out) as a WAV, so a recorded clip carries it on its frames.

usage: lowbang.py OUT.wav DURATION CROSS:FLYOUT:GAIN [CROSS:FLYOUT:GAIN ...]
"""
import sys, wave
import numpy as np

SR = 48000


def ramp_exp(t, t0, t1, a, b):
    """exponential ramp a -> b over [t0, t1], held outside"""
    x = np.clip((t - t0) / max(t1 - t0, 1e-9), 0, 1)
    return a * (b / a) ** x


def ramp_lin(t, t0, t1, a, b):
    x = np.clip((t - t0) / max(t1 - t0, 1e-9), 0, 1)
    return a + (b - a) * x


def target(t, t0, a, b, tc):
    """setTargetAtTime: from a at t0 toward b with time constant tc"""
    return np.where(t < t0, a, b + (a - b) * np.exp(-np.maximum(t - t0, 0) / tc))


def onepole_lp(x, fc):
    """two one-pole low-passes in series, fc per sample (array)"""
    a = 1 - np.exp(-2 * np.pi * fc / SR)
    y1 = np.empty_like(x); y2 = np.empty_like(x)
    s1 = s2 = 0.0
    for i in range(len(x)):
        s1 += a[i] * (x[i] - s1); y1[i] = s1
        s2 += a[i] * (s1 - s2); y2[i] = s2
    return y2


def voice(n, tc, tf, rng):
    t = np.arange(n) / SR
    t0 = tc - 2.6
    # pitch: 36 -> 42 over the run-in, then down to 31 in 0.8 s after the crossing, held from the fly-out
    sub = np.where(t < tc, ramp_lin(t, t0, tc, 36, 42), ramp_lin(t, tc, tc + 0.8, 42, 31))
    sub = np.where(t >= tf, np.interp(tf, t, sub), sub)
    oct_ = 2 * sub
    ph_s = 2 * np.pi * np.cumsum(sub) / SR
    ph_o = 2 * np.pi * np.cumsum(oct_) / SR
    # brown noise low-passed at 140, settling to 90 after the crossing
    w = rng.uniform(-1, 1, n)
    b = np.empty(n); last = 0.0
    for i in range(n):
        last = (last + 0.02 * w[i]) / 1.02; b[i] = last * 3.5
    fc = np.where(t < tc, 140.0, target(t, tc, 140.0, 90.0, 0.3))
    noise = onepole_lp(b, fc)
    # the swell's gain: up over the run-in, settling to 0.45, letting go over four seconds from the fly-out
    g = np.where(t < tc, ramp_exp(t, t0, tc, 1e-4, 0.7), target(t, tc, 0.7, 0.45, 0.4))
    gf = float(np.interp(tf, t, g))
    g = np.where(t >= tf, ramp_exp(t, tf, tf + 4, max(gf, 1e-4), 1e-4), g)
    g = np.where(t < t0, 0, g)
    swell = g * (np.sin(ph_s) + 0.3 * np.sin(ph_o) + 0.5 * noise)
    # the thump: 62 -> 30 Hz in 0.3 s, up in 20 ms, gone by 1.4 s
    th_f = np.where(t < tc, 62, ramp_exp(t, tc, tc + 0.3, 62, 30))
    th_ph = 2 * np.pi * np.cumsum(np.where(t < tc, 0, th_f)) / SR
    th_g = np.where(t < tc, 0, np.where(t < tc + 0.02, ramp_exp(t, tc, tc + 0.02, 1e-4, 0.9), ramp_exp(t, tc + 0.02, tc + 1.4, 0.9, 1e-4)))
    return swell + th_g * np.sin(th_ph)


def main():
    out, dur = sys.argv[1], float(sys.argv[2])
    n = int(dur * SR)
    rng = np.random.default_rng(1)
    mix = np.zeros(n)
    for ev in sys.argv[3:]:
        tc, tf, gain = map(float, ev.split(':'))
        mix += gain * voice(n, tc, tf, rng)
    # the compressor's job, roughly: a soft knee, then -6 dBFS peak
    mix = np.tanh(1.5 * mix) / 1.5
    mix *= 10 ** (-6 / 20) / max(np.abs(mix).max(), 1e-9)
    # fade the last 50 ms
    k = int(0.05 * SR); mix[-k:] *= np.linspace(1, 0, k)
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    with wave.open(out, 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes(np.repeat(pcm[:, None], 2, axis=1).tobytes())


if __name__ == '__main__':
    main()
