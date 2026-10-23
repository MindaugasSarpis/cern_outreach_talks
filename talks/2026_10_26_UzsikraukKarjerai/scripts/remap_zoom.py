"""Time-remap the NFTMC → cosmic web zoom to a short clip.

The speed (source seconds per output second) is given at keyframes in output
time, interpolated in log space with a cosine ease, integrated, and scaled so
the clip ends on the source frame the takeover starts from. Each output frame
averages the source frames under a 180° shutter (motion blur at speed).

python3 -I scripts/remap_zoom.py ../../videos/raw/spaceengine/nftmc_zoom.mp4 ../../videos/raw/vilnius_zoom.mp4
(in pnpm talk render; --plan prints where the stages land). No audio.
"""
import subprocess, sys, numpy as np

SRC_FPS, OUT_FPS = 60, 50
W, H = 1920, 1080
END_SRC = 253.42          # Innoday's cut: 253.40-253.43 s matches opener_last.jpg
HOLD = 1.0                # the web held still at the end, seconds
RUN = 19.0                # the moving part, seconds
SHUTTER = 0.5
MAX_BLEND = 24

# (output time, speed ×): Saulėtekis read for a moment, Vilnius and the Earth's
# globe slowed so they read, quick through the dark stretches, the whole galaxy
# slowed for its second, the web slowing to a stop.
KEYS = [(0.0, 1.2), (1.0, 2.5), (2.5, 6), (3.8, 8), (4.5, 6.5), (5.2, 6),
        (5.6, 20), (6.4, 14), (6.8, 10), (7.3, 10), (7.6, 7), (8.0, 7),
        (8.4, 30), (8.8, 30), (9.2, 55), (9.9, 45), (10.4, 15), (12.0, 14), (12.5, 7), (13.6, 7),
        (14.0, 55), (14.3, 55), (14.9, 9), (17.4, 2.5), (19.0, 0.4)]


def speed(u):
    ts, vs = zip(*KEYS)
    i = np.clip(np.searchsorted(ts, u, side='right') - 1, 0, len(ts) - 2)
    t0, t1 = np.array(ts)[i], np.array(ts)[i + 1]
    a = np.clip((u - t0) / (t1 - t0), 0, 1)
    a = (1 - np.cos(np.pi * a)) / 2
    lv = np.log(np.array(vs))
    return np.exp(lv[i] * (1 - a) + lv[i + 1] * a)


def src_map():
    u = np.linspace(0, RUN, 20001)
    v = speed(u)
    s = np.concatenate([[0], np.cumsum((v[1:] + v[:-1]) / 2 * np.diff(u))])
    s *= END_SRC / s[-1]
    return u, s


def plan():
    u, s = src_map()
    for b in (3, 30, 78, 135, 195, 228, 250, END_SRC):
        print(f'source {b:7.2f} s at output {np.interp(b, s, u):5.2f} s')
    print('speed at the ends', np.gradient(s, u)[[0, -1]].round(2))


def main(src, out):
    u, s = src_map()
    n_run = int(round(RUN * OUT_FPS))
    n = int(round((RUN + HOLD) * OUT_FPS))
    half = SHUTTER / OUT_FPS / 2
    last = int(round(END_SRC * SRC_FPS))
    jobs = []
    for k in range(n):
        if k >= n_run - 1:
            jobs.append([last]); continue
        uk = k / OUT_FPS
        a = np.interp(max(uk - half, 0), u, s) * SRC_FPS
        b = np.interp(min(uk + half, RUN), u, s) * SRC_FPS
        lo, hi = int(round(a)), max(int(round(b)), int(round(a)))
        idx = np.arange(lo, hi + 1)
        if len(idx) > MAX_BLEND:
            idx = np.unique(np.round(np.linspace(lo, hi, MAX_BLEND)).astype(int))
        jobs.append(list(np.minimum(idx, last)))
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-t', f'{END_SRC + 0.1}',
                            '-map', '0:v:0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                           stdout=subprocess.PIPE, bufsize=W * H * 3 * 4)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
                            '-s', f'{W}x{H}', '-r', str(OUT_FPS), '-i', '-',
                            '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-profile:v', 'high',
                            '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                            '-colorspace', 'bt709', '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    need = {}
    for k, idx in enumerate(jobs):
        for i in idx:
            need.setdefault(i, []).append(k)
    acc = {}
    nxt = 0
    fsize = W * H * 3
    for i in range(last + 1):
        buf = dec.stdout.read(fsize)
        if len(buf) < fsize:
            sys.exit(f'source ended at frame {i}, wanted {last}')
        if i not in need:
            continue
        f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).astype(np.float32)
        for k in need[i]:
            if k in acc:
                acc[k][0] += f; acc[k][1] += 1
            else:
                acc[k] = [f.copy(), 1]
        while nxt < n and nxt in acc and acc[nxt][1] == len(jobs[nxt]):
            img = acc.pop(nxt)
            enc.stdin.write(np.clip(img[0] / img[1] + 0.5, 0, 255).astype(np.uint8).tobytes())
            nxt += 1
    dec.stdout.close(); dec.kill()
    enc.stdin.close(); enc.wait()
    if nxt != n:
        sys.exit(f'wrote {nxt} of {n} frames')
    print(f'{out}: {n} frames, {n / OUT_FPS:.2f} s')


if __name__ == '__main__':
    if '--plan' in sys.argv:
        plan()
    else:
        main(sys.argv[1], sys.argv[2])
