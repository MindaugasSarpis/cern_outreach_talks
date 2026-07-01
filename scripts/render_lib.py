"""Parallel frame rendering -> hardware (NVENC) encode.

Generate animation frames across all CPU cores and pipe them straight into a
single ffmpeg NVENC encode, bypassing matplotlib's slow ``FFMpegWriter`` (which
renders frames serially and shells PNGs through a pipe). On a 16-core box + RTX
GPU this is dramatically faster than ``FuncAnimation(...).save(...)``.

Usage from a talk's render script (see talks/*/scripts/orbital_animation.py)::

    import render_lib
    render_lib.render(
        frame_fn,                 # module-level fn: i -> (H, W, 3) uint8 RGB
        n_frames=600, fps=30,
        out_path="videos/raw/anim.mp4",
        codec="hevc", cq=16,      # near-lossless master; encode step derives web
        initializer=_init, initargs=(...),   # per-worker setup (figure, data)
    )

Contract:
- ``frame_fn`` MUST be a module-level function (picklable) returning an
  ``(H, W, 3)`` uint8 RGB ndarray with the SAME shape for every frame.
- Heavy per-worker setup (matplotlib Figure, precomputed data) belongs in
  ``initializer`` (runs once per worker process), storing into module globals
  the ``frame_fn`` reads.
- Output size is inferred from frame 0 — no need to declare it.
"""
from __future__ import annotations

import os
import shutil
import subprocess
from concurrent.futures import ProcessPoolExecutor

import numpy as np


def _nvenc_ok() -> bool:
    """True iff h264_nvenc actually encodes here (compiled-in != runtime-ok)."""
    if not shutil.which("ffmpeg"):
        return False
    p = subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error",
         "-f", "lavfi", "-i", "testsrc2=size=256x144:rate=30:duration=1",
         "-c:v", "h264_nvenc", "-f", "null", "-"],
        capture_output=True,
    )
    return p.returncode == 0


def _encoder_args(codec: str, cq: int, encoder: str) -> list[str]:
    if codec == "h264":
        if encoder == "nvenc":
            return ["-c:v", "h264_nvenc", "-preset", "p5", "-tune", "hq",
                    "-rc", "vbr", "-cq", str(cq), "-b:v", "0",
                    "-profile:v", "high", "-pix_fmt", "yuv420p"]
        return ["-c:v", "libx264", "-preset", "slow", "-crf", str(cq),
                "-profile:v", "high", "-pix_fmt", "yuv420p"]
    if codec == "hevc":
        if encoder == "nvenc":
            return ["-c:v", "hevc_nvenc", "-tag:v", "hvc1", "-preset", "p7",
                    "-tune", "hq", "-rc", "vbr", "-cq", str(cq), "-b:v", "0",
                    "-pix_fmt", "yuv420p"]
        return ["-c:v", "libx265", "-tag:v", "hvc1", "-preset", "slow",
                "-crf", str(cq), "-pix_fmt", "yuv420p"]
    raise ValueError(f"unknown codec {codec!r} (use 'hevc' or 'h264')")


def render(frame_fn, n_frames, fps, out_path, *, codec="hevc", cq=16,
           encoder=None, workers=None, initializer=None, initargs=()):
    """Render ``n_frames`` in parallel and encode to ``out_path``.

    Returns ``(out_path, (width, height), encoder)``. ``encoder`` is the one
    actually used ("nvenc" or "cpu" after the availability probe).
    """
    if n_frames <= 0:
        raise ValueError("n_frames must be > 0")
    encoder = encoder or ("nvenc" if _nvenc_ok() else "cpu")
    workers = workers or os.cpu_count() or 4
    out_path = str(out_path)
    os.makedirs(os.path.dirname(os.path.abspath(out_path)) or ".", exist_ok=True)

    window = max(2, workers * 2)
    proc = None
    rc = 0
    with ProcessPoolExecutor(max_workers=workers,
                             initializer=initializer, initargs=initargs) as ex:
        futures: dict[int, object] = {}
        next_submit = 0

        def fill():
            nonlocal next_submit
            while len(futures) < window and next_submit < n_frames:
                futures[next_submit] = ex.submit(frame_fn, next_submit)
                next_submit += 1

        fill()

        def take(i):
            frame = np.ascontiguousarray(futures.pop(i).result(), dtype=np.uint8)
            fill()
            return frame

        # Frame 0 first — learn the exact pixel size for ffmpeg's -s.
        first = take(0)
        if first.ndim != 3 or first.shape[2] != 3:
            raise ValueError(f"frame_fn must return (H,W,3) uint8, got {first.shape}")
        h, w = first.shape[:2]

        proc = subprocess.Popen(
            ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error",
             "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{w}x{h}", "-r", str(fps),
             "-i", "-", *_encoder_args(codec, cq, encoder),
             "-movflags", "+faststart", out_path],
            stdin=subprocess.PIPE,
        )
        try:
            proc.stdin.write(first.tobytes())
            for i in range(1, n_frames):
                frame = take(i)
                if frame.shape[:2] != (h, w):
                    raise ValueError(
                        f"frame {i} shape {frame.shape[:2]} != frame 0 {(h, w)}"
                    )
                proc.stdin.write(frame.tobytes())
        finally:
            proc.stdin.close()
            rc = proc.wait()

    if rc != 0:
        raise RuntimeError(f"ffmpeg exited {rc} encoding {out_path}")
    return out_path, (w, h), encoder
