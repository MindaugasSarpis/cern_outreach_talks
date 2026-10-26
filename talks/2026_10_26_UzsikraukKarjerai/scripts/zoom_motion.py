"""Per-frame similarity motion of a clip, for remap_zoom.py's stabiliser: one row a
frame, the motion from the frame before (dx, dy of the frame centre in 1920-wide
pixels, rotation in degrees, scale, RANSAC inliers, tracked points); NaN where
nothing could be tracked. Needs OpenCV (opencv-python-headless; not in the env).

python zoom_motion.py ../../videos/raw/spaceengine/nftmc_zoom.mp4 ../../videos/raw/spaceengine/nftmc_zoom.motion.npy 253.5
"""
import subprocess, sys, numpy as np, cv2

src, out = sys.argv[1], sys.argv[2]
end = float(sys.argv[3]) if len(sys.argv) > 3 else None
W, H = 960, 540
cmd = ['ffmpeg', '-v', 'error', '-i', src]
if end: cmd += ['-t', str(end)]
cmd += ['-map', '0:v:0', '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-']
p = subprocess.Popen(cmd, stdout=subprocess.PIPE, bufsize=W * H * 8)
prev = None
rows = []
while True:
    buf = p.stdout.read(W * H)
    if len(buf) < W * H:
        break
    g = np.frombuffer(buf, np.uint8).reshape(H, W)
    row = [np.nan] * 6
    if prev is not None:
        pts = cv2.goodFeaturesToTrack(prev, 400, 0.01, 12, blockSize=7)
        if pts is not None and len(pts) >= 12:
            nxt, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, pts, None, winSize=(21, 21), maxLevel=3)
            ok = st.ravel() == 1
            if ok.sum() >= 10:
                M, inl = cv2.estimateAffinePartial2D(pts[ok], nxt[ok], method=cv2.RANSAC, ransacReprojThreshold=1.5)
                if M is not None:
                    s = np.hypot(M[0, 0], M[1, 0])
                    a = np.degrees(np.arctan2(M[1, 0], M[0, 0]))
                    # translation of the frame centre, in 1920-wide pixels
                    c = np.array([W / 2, H / 2])
                    moved = M[:, :2] @ c + M[:, 2]
                    dx, dy = (moved - c) * 2
                    row = [dx, dy, a, s, int(inl.sum()), int(ok.sum())]
    rows.append(row)
    prev = g
np.save(out, np.array(rows, float))
print(len(rows), 'frames')
