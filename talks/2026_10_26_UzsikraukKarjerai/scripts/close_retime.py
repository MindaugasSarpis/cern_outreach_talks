"""The close (slide 16) tightened (the owner, 24 Oct: "can we improve slide 16 somehow?"): from
close_fit.py's close_lhc_fcc.mp4, the stretch where the detector only glows evenly and then
shrinks into the climb to the map (24-44 s) plays in 10 s, its speed eased from 1x up to 2,5x
and back (a cubic Hermite with unit slopes at both ends, so nothing jolts); the rest is
frame for frame. Everything up to 24 s keeps its time, so LHCb's first collision at 16,36 s,
where <Soundtrack drop> lands Starfire's downbeat, does not move; after 44 s the clip runs
10 s earlier (the labels' <ClipCue> times are moved by 10 s). Where a source time falls
between frames the two are blended (a short motion blur at the fast part).

python3 -I scripts/close_retime.py ../../videos/raw/close_lhc_fcc.mp4 ../../videos/raw/close_quick.mp4
"""
import subprocess, sys, numpy as np

W, H, FPS = 1920, 1080, 50
A, B, OUT = 24.0, 44.0, 10.0          # source A-B plays in OUT seconds


def src_time(u):
    if u <= A:
        return u
    if u >= A + OUT:
        return u - OUT + (B - A)
    x = (u - A) / OUT
    h00, h10, h01, h11 = 2 * x**3 - 3 * x**2 + 1, x**3 - 2 * x**2 + x, -2 * x**3 + 3 * x**2, x**3 - x**2
    return h00 * A + h10 * OUT + h01 * B + h11 * OUT


def main(src, out):
    n_src = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v',
                                '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', src],
                               capture_output=True, text=True, check=True).stdout.strip())
    n_out = int(round((n_src / FPS - (B - A) + OUT) * FPS))
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                           stdout=subprocess.PIPE, bufsize=W * H * 3 * 4)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}',
                            '-r', str(FPS), '-i', '-', '-an', '-c:v', 'libx264', '-preset', 'slow', '-crf', '12',
                            '-maxrate', '9500k', '-bufsize', '19000k', '-profile:v', 'high', '-pix_fmt', 'yuv420p',
                            '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
                            '-movflags', '+faststart', out], stdin=subprocess.PIPE)
    fs = W * H * 3
    frames, have = {}, -1

    def get(i):
        nonlocal have
        i = min(i, n_src - 1)
        while have < i:
            buf = dec.stdout.read(fs)
            if len(buf) < fs:
                sys.exit(f'source ended at frame {have + 1}')
            have += 1
            frames[have] = np.frombuffer(buf, np.uint8)
        return frames[i]

    for k in range(n_out):
        s = src_time(k / FPS) * FPS
        i0 = int(np.floor(s)); a = s - i0
        f0 = get(i0)
        if a < 0.02:
            img = f0
        else:
            img = np.clip(f0 * (1 - a) + get(i0 + 1) * a + 0.5, 0, 255).astype(np.uint8)
        for j in [j for j in frames if j < i0]:
            del frames[j]
        enc.stdin.write(img.tobytes())
    dec.stdout.close(); dec.kill()
    enc.stdin.close(); enc.wait()
    print(f'{out}: {n_out} frames, {n_out / FPS:.2f} s (from {n_src})')


if __name__ == '__main__':
    main(sys.argv[1], sys.argv[2])
