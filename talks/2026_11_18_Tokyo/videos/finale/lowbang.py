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
    if not BOOM:
        return swell + th_g * np.sin(th_ph)
    # --boom (Tokyo, 12 Nov; the owner: "on slide 17 the collision more dramatic, timed on a low sound"): a larger hit on
    # the crossing, one a room's speakers carry: a body from 95 Hz down to 38 Hz with its octave, ringing for 2.6 s, and a
    # burst of low noise in its first half second
    # (13 Nov, the owner: "finale collision has to be slow-mo low sound, more substantial": the hit as slow as the
    # picture, falling from 80 Hz to 29 Hz over 2 s and ringing for 6 s, its noise a second and a half long)
    bf = np.where(t < tc, 80, ramp_exp(t, tc, tc + 2.0, 80, 29))
    bph = 2 * np.pi * np.cumsum(np.where(t < tc, 0, bf)) / SR
    bg = np.where(t < tc, 0, np.where(t < tc + 0.012, ramp_exp(t, tc, tc + 0.012, 1e-4, 1.0), ramp_exp(t, tc + 0.012, tc + 12.0, 1.0, 2e-3)))
    ng = np.where(t < tc, 0, ramp_exp(t, tc, tc + 3.5, 0.8, 1e-4))
    boom = bg * (np.sin(bph) + 0.45 * np.sin(2 * bph)) + ng * onepole_lp(b, np.full(n, 220.0)) * 2.0
    # 13 Nov (the owner: "the colission sound has to be much more substantial, louder"): a crack over it (a burst of mid
    # noise, 140 Hz to 1.6 kHz) and a body an octave up, so it carries on a room's speakers; the swell under it lower
    crack = np.where(t < tc, 0, np.where(t < tc + 0.004, ramp_exp(t, tc, tc + 0.004, 1e-4, 1.0), ramp_exp(t, tc + 0.004, tc + 0.6, 1.0, 1e-4))) * (onepole_lp(b, np.full(n, 1600.0)) - onepole_lp(b, np.full(n, 140.0))) * 6.0
    mf = np.where(t < tc, 170, ramp_exp(t, tc, tc + 0.9, 170, 58))
    mid = np.where(t < tc, 0, np.where(t < tc + 0.008, ramp_exp(t, tc, tc + 0.008, 1e-4, 1.0), ramp_exp(t, tc + 0.008, tc + 1.6, 1.0, 1e-4))) * np.sin(2 * np.pi * np.cumsum(np.where(t < tc, 0, mf)) / SR)
    # (13 Nov: a 0.45 s breath before the hit was tried here and in the music, and taken out the same day: the owner heard it
    # as "sounds jitters, quiets down, then the low sound is heard, then volume increases")
    # 13 Nov, evening: the breath again, smoothly (the owner: "breath sounds like a good idea, but needs to be implemented
    # smoothly"): the swell eases down on a raised cosine over 1.2 s to a third, 0.2 s before the hit
    u = np.clip((t - (tc - 1.4)) / 1.2, 0, 1)
    swell = swell * np.where(t < tc, 0.33 + 0.67 * 0.5 * (1 + np.cos(np.pi * u)), 1.0)
    # 13 Nov, evening (the owner: "the collission should be a low longer sound"): the crack and the upper body are out,
    # the low body rings 12 s (6 s) and its low noise 3.5 s (1.5 s)
    # 14 Nov (the owner: "the low sound could be without vibration, a bit smoother"): the vibration was three low voices
    # close in pitch beating against each other (the swell's 42 to 31 Hz, the thump's 62 to 30 Hz, the body's 80 to 29 Hz),
    # low noise under them, and the soft clipper on a mix that loud. Now one voice after the crossing: a sine gliding
    # from 64 Hz to 34 Hz over 3 s and staying there, a little of its octave, up in 60 ms, ringing 20 s; the swell is
    # gone 0.3 s after the crossing, no thump, no noise, and the mix is not clipped (main)
    sf = np.where(t < tc, 64, ramp_exp(t, tc, tc + 3.0, 64, 34))
    sph = 2 * np.pi * np.cumsum(np.where(t < tc, 0, sf)) / SR
    sg = np.where(t < tc, 0, np.where(t < tc + 0.06, 0.5 * (1 - np.cos(np.pi * (t - tc) / 0.06)), ramp_exp(t, tc + 0.06, tc + 20.0, 1.0, 2e-3)))
    smooth = sg * (np.sin(sph) + 0.22 * np.sin(2 * sph))
    swell = swell * np.where(t < tc, 1.0, np.exp(-np.maximum(t - tc, 0) / 0.08))
    return 0.3 * swell + 1.0 * smooth


BOOM = '--boom' in sys.argv
if BOOM:
    sys.argv.remove('--boom')
# --beat=SECONDS (13 Nov, the owner: "when pentaquark appears, a sound of a single heartbeat loud and slow"): one
# heartbeat there, two low thumps 0.46 s apart (setup/heartbeat.js is the same voice, live)
BEAT = [float(a.split('=')[1]) for a in sys.argv if a.startswith('--beat=')]
sys.argv = [a for a in sys.argv if not a.startswith('--beat=')]


def beat(n, at):
    t = np.arange(n) / SR
    out = np.zeros(n)
    for t0, f0, f1, dur, g in [(at, 58, 36, 0.42, 1.0), (at + 0.46, 66, 42, 0.32, 0.72)]:
        f = np.where(t < t0, f0, ramp_exp(t, t0, t0 + dur * 0.6, f0, f1))
        ph = 2 * np.pi * np.cumsum(np.where(t < t0, 0, f)) / SR
        env = np.where(t < t0, 0, np.where(t < t0 + 0.014, ramp_exp(t, t0, t0 + 0.014, 1e-4, g), ramp_exp(t, t0 + 0.014, t0 + dur, g, 1e-4)))
        out += env * (np.sin(ph) + 0.38 * np.sin(2 * ph))
    return out


def main():
    out, dur = sys.argv[1], float(sys.argv[2])
    n = int(dur * SR)
    rng = np.random.default_rng(1)
    mix = np.zeros(n)
    for ev in sys.argv[3:]:
        tc, tf, gain = map(float, ev.split(':'))
        mix += gain * voice(n, tc, tf, rng)
    for at in BEAT:
        mix += 2.2 * beat(n, at)
    # the compressor's job, roughly: a soft knee, then -6 dBFS peak
    if not BOOM:
        mix = np.tanh(1.5 * mix) / 1.5
    mix *= 10 ** ((-2 if BOOM else -6) / 20) / max(np.abs(mix).max(), 1e-9)
    # fade the last 50 ms
    k = int(0.05 * SR); mix[-k:] *= np.linspace(1, 0, k)
    pcm = (np.clip(mix, -1, 1) * 32767).astype('<i2')
    with wave.open(out, 'wb') as f:
        f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR)
        f.writeframes(np.repeat(pcm[:, None], 2, axis=1).tobytes())


if __name__ == '__main__':
    main()
