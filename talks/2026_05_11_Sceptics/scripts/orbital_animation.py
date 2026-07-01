"""Render rotating hydrogen-like orbital surfaces for the Sceptics deck.

Replaces the third-party orbital-viewer iframe (broken on Mac) with a
predictable, embeddable MP4. Frames are rendered in parallel across all CPU
cores and piped straight into an NVENC encode (see ../../../scripts/render_lib.py),
so this is far faster than the old matplotlib FFMpegWriter path.

    python3 scripts/orbital_animation.py            # 1920x1080
    python3 scripts/orbital_animation.py --hires    # 3840x2160

Output: videos/raw/orbitals.mp4 (~20 s, 30 fps, HEVC master).
Then: pnpm videos:encode  ->  public/videos/orbitals.mp4 (H.264 web).

Shows |Y_lm|^2 surfaces for l=0..3, m=0 (s, p_z, d_z^2, f_z^3) rotating
around the z-axis. Lobe color follows the sign of the wavefunction: blue
for positive, red for negative.
"""
from __future__ import annotations

import argparse
import os
import sys

import numpy as np

# render_lib lives in the monorepo-root scripts/ dir (three levels up).
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", "scripts"))
import render_lib  # noqa: E402

ORBITALS: list[tuple[str, int, int]] = [
    ("1s", 0, 0),
    ("2p", 1, 0),
    ("3d", 2, 0),
    ("4f", 3, 0),
]

BLUE = np.array([0.25, 0.55, 1.00, 1.0])
RED = np.array([1.00, 0.35, 0.35, 1.0])

# Per-worker state, populated once per process by _init_worker().
_FIG = None
_AX = None
_SURFACES: list | None = None
_FRAMES_PER_ORB: int = 0


def orbital_surface(l: int, m: int, n_phi: int = 96, n_theta: int = 48):
    """Compute surface vertices and per-vertex sign for |Y_lm|^2."""
    # SciPy >= 1.17 removed sph_harm. Its replacement sph_harm_y(n, m, polar,
    # azimuthal) swaps the argument order AND angle roles vs the old
    # sph_harm(m, n, azimuthal, polar) — handle both.
    try:
        from scipy.special import sph_harm_y

        def _Ylm(azi, pol):
            return sph_harm_y(l, m, pol, azi)
    except ImportError:  # SciPy < 1.15
        from scipy.special import sph_harm

        def _Ylm(azi, pol):
            return sph_harm(m, l, azi, pol)

    phi = np.linspace(0.0, 2.0 * np.pi, n_phi)        # azimuthal [0, 2pi]
    theta = np.linspace(1e-3, np.pi - 1e-3, n_theta)  # polar [0, pi]
    PHI, THETA = np.meshgrid(phi, theta)
    Y = _Ylm(PHI, THETA)
    # m=0 spherical harmonics are real; take the real part to be safe.
    Yr = np.real(Y)
    R = Yr ** 2
    R_max = R.max()
    if R_max > 0:
        R = R / R_max
    X = R * np.sin(THETA) * np.cos(PHI)
    Yc = R * np.sin(THETA) * np.sin(PHI)
    Z = R * np.cos(THETA)
    return X, Yc, Z, Yr


def face_colors(sign_vertex: np.ndarray) -> np.ndarray:
    """plot_surface wants facecolors of shape (rows-1, cols-1, 4)."""
    sign_face = sign_vertex[:-1, :-1]
    rgba = np.empty(sign_face.shape + (4,))
    rgba[sign_face >= 0] = BLUE
    rgba[sign_face < 0] = RED
    return rgba


def _init_worker(figsize, dpi, frames_per_orb) -> None:
    """Per-process setup: Agg backend, precomputed surfaces, one reusable 3D figure."""
    global _FIG, _AX, _SURFACES, _FRAMES_PER_ORB
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    _SURFACES = []
    for label, l, m in ORBITALS:
        X, Yc, Z, sign = orbital_surface(l, m)
        _SURFACES.append((label, X, Yc, Z, face_colors(sign)))
    _FIG = plt.figure(figsize=figsize, facecolor="black", dpi=dpi)
    _AX = _FIG.add_subplot(111, projection="3d", facecolor="black")
    _FRAMES_PER_ORB = frames_per_orb


def _frame(i: int) -> np.ndarray:
    """Render frame i -> (H, W, 3) uint8 RGB."""
    label, X, Yc, Z, fc = _SURFACES[min(i // _FRAMES_PER_ORB, len(_SURFACES) - 1)]
    angle = (i % _FRAMES_PER_ORB) * (360.0 / _FRAMES_PER_ORB)
    extent = float(np.max(np.abs([X, Yc, Z])))
    _AX.clear()
    _AX.set_facecolor("black")
    _AX.plot_surface(
        X, Yc, Z,
        facecolors=fc,
        rstride=1, cstride=1,
        antialiased=True, linewidth=0,
        shade=False,
    )
    _AX.view_init(elev=18, azim=angle)
    try:
        _AX.set_box_aspect([1, 1, 1])
    except (AttributeError, ValueError):
        pass
    _AX.set_axis_off()
    _AX.set_xlim(-extent, extent)
    _AX.set_ylim(-extent, extent)
    _AX.set_zlim(-extent, extent)
    _AX.text2D(
        0.5, 0.92, label,
        transform=_AX.transAxes, color="white",
        fontsize=46, ha="center", fontweight="bold",
    )
    _FIG.canvas.draw()
    buf = np.asarray(_FIG.canvas.buffer_rgba())  # (H, W, 4) uint8
    return np.ascontiguousarray(buf[..., :3])


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--hires", action="store_true",
                        help="Render at 3840x2160 instead of 1920x1080")
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--seconds-per-orbital", type=float, default=5.0)
    parser.add_argument("-o", "--output", default="videos/raw/orbitals.mp4")
    args = parser.parse_args()

    figsize = (38.4, 21.6) if args.hires else (19.2, 10.8)
    dpi = 100
    frames_per_orb = int(round(args.fps * args.seconds_per_orbital))
    total_frames = frames_per_orb * len(ORBITALS)

    print(f"Rendering {total_frames} frames @ {args.fps} fps across cores -> {args.output}")
    out, (w, h), enc = render_lib.render(
        _frame, total_frames, args.fps, args.output,
        codec="hevc", cq=16,
        initializer=_init_worker, initargs=(figsize, dpi, frames_per_orb),
    )
    print(f"Done: {out} ({w}x{h}, {enc}). Next: pnpm videos:encode")


if __name__ == "__main__":
    main()
