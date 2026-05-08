"""Render rotating hydrogen-like orbital surfaces for the Sceptics deck.

Replaces the third-party orbital-viewer iframe (broken on Mac) with a
predictable, embeddable MP4. Run from the talk dir:

    python3 scripts/orbital_animation.py            # 1920x1080, ~5 min render
    python3 scripts/orbital_animation.py --hires    # 3840x2160, ~20 min render

Output: videos/raw/orbitals.mp4 (~20 s, 30 fps).
Then: pnpm videos:encode  ->  public/videos/orbitals.mp4

Shows |Y_lm|^2 surfaces for l=0..3, m=0 (s, p_z, d_z^2, f_z^3) rotating
around the z-axis. Lobe color follows the sign of the wavefunction: blue
for positive, red for negative.
"""
from __future__ import annotations

import argparse
import os

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.animation import FFMpegWriter, FuncAnimation
from scipy.special import sph_harm

ORBITALS: list[tuple[str, int, int]] = [
    ("1s",   0, 0),
    ("2p",   1, 0),
    ("3d",   2, 0),
    ("4f",   3, 0),
]

BLUE = np.array([0.25, 0.55, 1.00, 1.0])
RED = np.array([1.00, 0.35, 0.35, 1.0])


def orbital_surface(l: int, m: int, n_phi: int = 96, n_theta: int = 48):
    """Compute surface vertices and per-vertex sign for |Y_lm|^2."""
    phi = np.linspace(0.0, 2.0 * np.pi, n_phi)
    theta = np.linspace(1e-3, np.pi - 1e-3, n_theta)
    PHI, THETA = np.meshgrid(phi, theta)
    Y = sph_harm(m, l, PHI, THETA)
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

    print("Precomputing surfaces...")
    surfaces = []
    for label, l, m in ORBITALS:
        X, Yc, Z, sign = orbital_surface(l, m)
        surfaces.append((label, X, Yc, Z, face_colors(sign)))
        print(f"  {label}: l={l}, m={m}, extent={float(np.max(np.abs([X, Yc, Z]))):.3f}")

    fig = plt.figure(figsize=figsize, facecolor="black", dpi=dpi)
    ax = fig.add_subplot(111, projection="3d", facecolor="black")

    def update(frame: int) -> None:
        idx = min(frame // frames_per_orb, len(ORBITALS) - 1)
        label, X, Yc, Z, fc = surfaces[idx]
        angle = (frame % frames_per_orb) * (360.0 / frames_per_orb)
        extent = float(np.max(np.abs([X, Yc, Z])))
        ax.clear()
        ax.set_facecolor("black")
        ax.plot_surface(
            X, Yc, Z,
            facecolors=fc,
            rstride=1, cstride=1,
            antialiased=True, linewidth=0,
            shade=False,
        )
        ax.view_init(elev=18, azim=angle)
        try:
            ax.set_box_aspect([1, 1, 1])
        except AttributeError:
            pass  # matplotlib < 3.3
        ax.set_axis_off()
        ax.set_xlim(-extent, extent)
        ax.set_ylim(-extent, extent)
        ax.set_zlim(-extent, extent)
        ax.text2D(
            0.5, 0.92, label,
            transform=ax.transAxes, color="white",
            fontsize=46, ha="center", fontweight="bold",
        )

    anim = FuncAnimation(fig, update, frames=total_frames, blit=False)
    writer = FFMpegWriter(fps=args.fps, codec="h264", bitrate=12000)

    out_path = args.output
    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    print(f"Rendering {total_frames} frames @ {args.fps} fps -> {out_path}")
    anim.save(out_path, writer=writer, savefig_kwargs={"facecolor": "black"})
    print(f"Done. Next: pnpm videos:encode")


if __name__ == "__main__":
    main()
