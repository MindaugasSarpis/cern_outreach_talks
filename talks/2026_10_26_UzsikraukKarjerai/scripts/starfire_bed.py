"""Scott Buckley's „Starfire“ (CC BY 4.0) for the whole deck (the owner, 24 Oct: "Can we use
Scott Buckley starfire for the entire deck? … the starfire starts with the second slide and
everything is coherently connected, what's important is to time the collision in the LHCb right
for the finale, so on click maybe we fade out and time to that accent like in innoday talk").

Two files from the master (scottbuckley.com.au/library/starfire, 5:41):

- public/audio/starfire_bed.m4a, about 17 min, from slide 2 to the click into the close: the
  track's opening and first rise (0:00-2:39.9) and its second half after the drop (3:06.9-5:00.9),
  in turn, the opening again from 0:12.8, until the talk is safely covered. Every join is a
  one-bar equal-power cross-fade on the track's own bar grid (80 bpm, a bar of 3.0005 s, anchored
  on the 2:54.85 downbeat), so the meter runs on through it. The 2:42.85-2:54.85 build and its
  downbeat are left out: the finale is the only place they are heard. Under the speech its
  sections are ridden toward one loudness (a slow gain, 70 % of the way, at most ±8 dB), then the
  whole is set to -16 LUFS.
- public/audio/starfire_finale.m4a, the track from 2:42.85 to its end at the master's gain
  -0,5 dB (as Innoday's close files): the four bars that build into the downbeat, which
  <Soundtrack drop> on the close lands on LHCb's collision; then the track's second half under
  the close and the credits, ending with the track.

python3 -I scripts/starfire_bed.py Starfire.mp3 public/audio
(in pnpm talk render; ffmpeg on PATH)
"""
import subprocess, sys, numpy as np

SR = 48000
BAR = 3.0005
DOWNBEAT = 174.85                 # 2:54.85, measured (Innoday's close)
LEAD = 4                          # bars of build before it in the finale file
BED_MIN = 16.5 * 60               # the bed's length at least
g = lambda k: DOWNBEAT + k * BAR  # a bar line of the track, k bars from the downbeat
# (in, out) on the grid: the opening and first rise; the second half; the opening again
FIRST = (0.0, g(-5))              # to 2:39.85, a bar before the build the finale opens on
SECOND = (g(4), g(42))            # 3:06.85-5:00.87
AGAIN = (g(-54), g(-5))           # 0:12.82-2:39.85


def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '2', '-ar', str(SR),
                          '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)


def encode(x, out, kbps=160):
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ac', '2', '-ar', str(SR),
                          '-i', '-', '-c:a', 'aac', '-b:a', f'{kbps}k', '-movflags', '+faststart', out],
                         stdin=subprocess.PIPE)
    p.communicate(np.ascontiguousarray(x, np.float32).tobytes())
    if p.returncode:
        sys.exit(f'ffmpeg failed on {out}')


def loudness(path_or_x):
    """Integrated loudness (LUFS) by ffmpeg's ebur128."""
    if isinstance(path_or_x, str):
        args, inp = ['-i', path_or_x], None
    else:
        args, inp = ['-f', 'f32le', '-ac', '2', '-ar', str(SR), '-i', '-'], np.ascontiguousarray(path_or_x, np.float32).tobytes()
    r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', *args, '-af', 'ebur128', '-f', 'null', '-'],
                       input=inp, capture_output=True)
    line = [l for l in r.stderr.decode().splitlines() if l.strip().startswith('I:')][-1]
    return float(line.split()[1])


def ride(x):
    """A slow gain toward one loudness: 70 % of the way, at most ±8 dB, over ~8 s."""
    hop = SR // 10
    n = len(x) // hop
    b = x[:n * hop].reshape(n, hop, 2)
    lvl = 10 * np.log10(np.mean(b ** 2, axis=(1, 2)) + 1e-10)
    from scipy.ndimage import gaussian_filter1d
    lvl = gaussian_filter1d(lvl, 40)           # sigma 4 s
    target = np.median(lvl[lvl > lvl.max() - 40])
    gain = gaussian_filter1d(np.clip(0.7 * (target - lvl), -8, 8), 20)
    gs = np.interp(np.arange(len(x)) / hop, np.arange(n) + 0.5, gain)
    return x * (10 ** (gs / 20))[:, None]


def main(master, outdir):
    m = decode(master)
    sec = lambda a, b: m[int(round(a * SR)):int(round(b * SR))]
    xf = int(round(BAR * SR))
    up = np.sin(np.linspace(0, np.pi / 2, xf))[:, None]
    down = np.cos(np.linspace(0, np.pi / 2, xf))[:, None]
    # the joins' bar of overlap is the bar after each out point and the bar before each in point
    parts = [FIRST, SECOND]
    while sum(b - a for a, b in parts) - BAR * (len(parts) - 1) < BED_MIN:
        parts.append(AGAIN if parts[-1] is SECOND else SECOND)
    bed = sec(parts[0][0], parts[0][1] + BAR / 2)
    for a, b in parts[1:]:
        nxt = sec(a - BAR / 2, b + BAR / 2)
        bed = np.concatenate([bed[:-xf], bed[-xf:] * down + nxt[:xf] * up, nxt[xf:]])
    bed = bed[:-int(BAR / 2 * SR)]
    fade = int(6 * SR)
    bed[-fade:] *= np.cos(np.linspace(0, np.pi / 2, fade))[:, None]
    bed = ride(bed)
    bed *= 10 ** ((-16.0 - loudness(bed)) / 20)
    peak = np.abs(bed).max()
    if peak > 0.89:                            # -1 dBFS: a soft limit on the rare overshoot
        bed = np.tanh(bed / 0.89) * 0.89
    encode(bed, f'{outdir}/starfire_bed.m4a')
    print(f'starfire_bed.m4a {len(bed) / SR / 60:.2f} min, {len(parts)} parts:',
          ', '.join(f'{a:.2f}-{b:.2f}' for a, b in parts), f'{loudness(outdir + "/starfire_bed.m4a"):.1f} LUFS')
    fin = sec(DOWNBEAT - LEAD * BAR, len(m) / SR) * 10 ** (-0.5 / 20)
    encode(fin, f'{outdir}/starfire_finale.m4a')
    print(f'starfire_finale.m4a from {DOWNBEAT - LEAD * BAR:.2f} s, {len(fin) / SR:.1f} s, the downbeat {LEAD * BAR:.3f} s in')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
