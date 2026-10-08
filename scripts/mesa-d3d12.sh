#!/usr/bin/env bash
# Mesa with the d3d12 Gallium driver in a private prefix, so headless Chromium in
# WSL2 draws WebGL on the Windows GPU (through /dev/dxg) instead of llvmpipe.
# Measured on an RTX 5080 (8 Oct 2026): a 1080p stage frame records in 0.104 s
# against 0.181 s on llvmpipe, at about a seventh of the CPU. AlmaLinux's Mesa
# ships no d3d12 driver, so this fetches Fedora 43's (Mesa 25.3, LLVM 21) and
# unpacks it under PREFIX; nothing is installed system-wide. About 250 MB.
#
#   scripts/mesa-d3d12.sh [PREFIX]       default ~/.local/share/mesa-d3d12
#
# Needs dnf (download only), rpm2archive and network. The stage tools' launcher
# finds the driver at $SLIDEV_STAGE_MESA_D3D12 (bootstrap.sh writes it) and sets
# the variables itself; PREFIX/env-gl.sh has them for a shell. Chromium 147
# (playwright 1.59) reaches it with ANGLE on GL, through WSLg's X server
# (DISPLAY=:0); newer headless shells did not. Never set VK_ICD_FILENAMES: it
# hides Chromium's own SwiftShader, and the fallback with it.
set -euo pipefail
P=${1:-$HOME/.local/share/mesa-d3d12}
for t in dnf rpm2archive tar; do
  command -v "$t" >/dev/null || { echo "mesa-d3d12: needs $t" >&2; exit 1; }
done
mkdir -p "$P/rpms" "$P/root"
cd "$P/rpms"
dnf download --arch x86_64 --setopt=cachedir="$P/cache" --setopt=reposdir=/dev/null \
  --repofrompath=f43u,https://dl.fedoraproject.org/pub/fedora/linux/updates/43/Everything/x86_64/ \
  --repofrompath=f43,https://dl.fedoraproject.org/pub/fedora/linux/releases/43/Everything/x86_64/os/ \
  --repo=f43u --repo=f43 mesa-dri-drivers mesa-libEGL mesa-libGL mesa-filesystem llvm-libs lm_sensors-libs libdisplay-info
cd "$P/root"
for r in "$P"/rpms/*.x86_64.rpm; do rpm2archive - < "$r" | tar xz; done
R="$P/root/usr/lib64"
[ -f "$R/dri/d3d12_dri.so" ] || { echo "mesa-d3d12: no d3d12_dri.so in the packages" >&2; exit 1; }
printf '{"file_format_version":"1.0.0","ICD":{"library_path":"%s/libEGL_mesa.so.0"}}\n' "$R" > "$P/egl_mesa.json"
cat > "$P/env-gl.sh" <<EOT
export LD_LIBRARY_PATH=$R:/usr/lib/wsl/lib
export __EGL_VENDOR_LIBRARY_FILENAMES=$P/egl_mesa.json
export LIBGL_DRIVERS_PATH=$R/dri
export GALLIUM_DRIVER=d3d12
export MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA   # else Mesa may take an integrated GPU first
export DISPLAY=\${DISPLAY:-:0}
EOT
rm -rf "$P/rpms" "$P/cache"
echo "Mesa d3d12 in $P (SLIDEV_STAGE_MESA_D3D12=$P)"
