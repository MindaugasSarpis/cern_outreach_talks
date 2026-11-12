"""Scott Buckley's „Age of Wonder“ (CC BY 4.0) as one bed for the talk, slide 2 to the finale (the owner, 13 Nov:
"the sountrack was just restarted to make the buildup last, it went better in uzsikrauk karjerai"). As that talk's
scripts/starfire_bed.py: the track played forward, and where more length is needed it steps back a whole number of
four-bar phrases and goes on, each join a one-bar equal-power cross-fade on the track's own grid, so the meter runs
through it and it never returns to the opening.

The grid, measured from the track's onsets (autocorrelation, lags of 8 to 96 eighths agree): an eighth 0.36562 s
(82 bpm), 4/4, a bar 2.925 s, a four-bar phrase U = 11.700 s.

The walk (seconds of the master, https://www.scottbuckley.com.au/library/age-of-wonder, 5:51):
  0 → 99.6       the opening
  52.8 → 163.8   back 4 U: the opening's second half again, on into the first swell
  105.3 → 210.6  back 5 U: the swell again, the fall and the rise after it
  105.3 → 210.6  back 9 U, as often as the length asks (a loop of 105 s, the fuller middle)
The last build (3:52 on) is the finale's own file (wonder_close.m4a) and is heard nowhere else.

Under speech the bed's sections are ridden toward one loudness (70 % of the way, at most ±8 dB, over 12 s), then the
whole is set to -16 LUFS (a true peak under -1.5 dBFS).

python3 -I videos/music/wonder_bed.py AgeOfWonder.mp3 public/audio/wonder_bed.m4a   (ffmpeg on PATH)
"""
import subprocess, sys, re
import numpy as np

SR = 48000
BAR = 8 * 0.36562
U = 4 * BAR
MIN_S = 15.5 * 60
WALK = [(0.0, 8 * U + 6.0), (8 * U + 6.0 - 4 * U, 14 * U), (14 * U - 5 * U, 18 * U)]
LOOP = (18 * U - 9 * U, 18 * U)


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def main():
    src, out = sys.argv[1], sys.argv[2]
    x = decode(src)
    n1 = int(BAR * SR)
    k = np.linspace(0, np.pi / 2, n1)[:, None]
    fin, fout = np.sin(k), np.cos(k)
    segs = list(WALK)
    while sum(b - a for a, b in segs) - BAR * (len(segs) - 1) < MIN_S:
        segs.append(LOOP)
    bed = None
    for a, b in segs:
        s = x[int(a * SR):int(b * SR)].copy()
        if bed is None:
            bed = s
        else:
            # the join: the bar before the new section's start over the old one's last bar
            pre = x[int(a * SR) - n1:int(a * SR)]
            bed[-n1:] = bed[-n1:] * fout + pre * fin
            bed = np.concatenate([bed, s])
    # the ride: a slow gain toward the bed's median loudness
    win = int(12 * SR)
    p = np.convolve((bed ** 2).mean(1), np.ones(win) / win, 'same')
    db = 10 * np.log10(np.maximum(p, 1e-9))
    g = np.clip(0.7 * (np.median(db) - db), -8, 8)
    bed *= (10 ** (g / 20))[:, None]
    bed[:int(2 * SR)] *= np.linspace(0, 1, int(2 * SR))[:, None]
    bed[-int(6 * SR):] *= np.linspace(1, 0, int(6 * SR))[:, None]
    tmp = out + '.wav'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-', tmp], input=np.ascontiguousarray(bed, np.float32).tobytes(), check=True)
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', tmp, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=20:print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
    i = float(re.search(r'"input_i" *: *"([-\d.]+)', r)[1]); tp = float(re.search(r'"input_tp" *: *"([-\d.]+)', r)[1])
    gain = min(-16 - i, -1.5 - tp)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', f'volume={gain:.2f}dB', '-c:a', 'aac', '-b:a', '112k', '-movflags', '+faststart', out], check=True)
    subprocess.run(['rm', '-f', tmp])
    print(f'{out}: {len(bed) / SR:.1f} s, {len(segs)} sections, {i:.1f} LUFS before, {gain:+.2f} dB')


main()
