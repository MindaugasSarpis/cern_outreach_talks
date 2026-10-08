#!/usr/bin/env bash
# Set a machine up for the talks, from two clones side by side:
#
#   <root>/outreach_talks   (this repo)      <root>/slidev-videos   (the toolkit)
#
# It makes the micromamba env from env.yaml (under $OUTREACH_PREFIX, default
# ~/micromamba; point it at scratch space on a cluster), installs the
# slidev-videos CLI from the checkout beside this repo (pip install -e), runs
# pnpm install in both repos, puts the Playwright browsers and the pnpm store
# on the repos' filesystem when the home directory is elsewhere (the store in
# pnpm's global config too, for a plain pnpm), picks the render backend (Slurm,
# HTCondor or this machine) and the WebGL backend (native NVIDIA, WSL's GPU
# through Mesa d3d12, or llvmpipe), and writes all of it to
# ~/.config/outreach_talks/env, which `pnpm talk` and the skills read.
# Run it again at any time: what is there already is left as it is.
#
#   scripts/bootstrap.sh [--dry-run] [--prefix DIR] [--config FILE] [--redetect]
#                        [--no-env] [--update-env] [--no-install] [--no-browsers]
#                        [--mesa-d3d12]
#
#   --dry-run      print every action and the settings file, change nothing
#   --prefix DIR   micromamba root for the env and its package cache ($OUTREACH_PREFIX)
#   --config FILE  the settings file ($OUTREACH_CONFIG, default ~/.config/outreach_talks/env)
#   --redetect     detected values replace the file's (the file's win otherwise)
#   --no-env       leave the micromamba env and the pip install alone
#   --update-env   bring an existing env up to env.yaml
#   --no-install   no pnpm install, no browsers
#   --no-browsers  no Playwright browser download
#   --mesa-d3d12   WSL only: fetch Mesa with the d3d12 driver into a private prefix
#                  (~250 MB; scripts/mesa-d3d12.sh), so headless Chromium draws on the GPU
#
# It never writes ~/.claude/settings.json or any hook: the permission rules it
# prints at the end are optional, for the owner to add by hand.
# Test hooks: BOOTSTRAP_DXG and BOOTSTRAP_X0 replace /dev/dxg and /tmp/.X11-unix/X0.
set -euo pipefail

DRY=0 REDETECT=0 NO_ENV=0 UPDATE_ENV=0 NO_INSTALL=0 NO_BROWSERS=0 MESA_SETUP=0
PREFIX=${OUTREACH_PREFIX:-$HOME/micromamba}
CONFIG=${OUTREACH_CONFIG:-$HOME/.config/outreach_talks/env}
while [ $# -gt 0 ]; do
  case $1 in
    --dry-run) DRY=1 ;;
    --prefix) PREFIX=${2:?--prefix DIR}; shift ;;
    --prefix=*) PREFIX=${1#*=} ;;
    --config) CONFIG=${2:?--config FILE}; shift ;;
    --config=*) CONFIG=${1#*=} ;;
    --redetect) REDETECT=1 ;;
    --no-env) NO_ENV=1 ;;
    --update-env) UPDATE_ENV=1 ;;
    --no-install) NO_INSTALL=1 ;;
    --no-browsers) NO_BROWSERS=1 ;;
    --mesa-d3d12) MESA_SETUP=1; REDETECT=1 ;;
    -h|--help) sed -n '2,33p' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "bootstrap: unknown option $1 (--help)" >&2; exit 2 ;;
  esac
  shift
done

FAILED=()
step() { printf '\n== %s\n' "$*"; }
note() { printf '   %s\n' "$*"; }
quote() { local a out=(); for a in "$@"; do out+=("$(printf '%q' "$a")"); done; printf '%s' "${out[*]}"; }
act() {     # run a command, or only show it under --dry-run
  if [ "$DRY" = 1 ]; then printf '   would run: %s\n' "$(quote "$@")"; return 0; fi
  printf '   + %s\n' "$(quote "$@")"
  "$@"
}
try() {     # act, and carry on when it fails: the summary lists it
  local what=$1; shift
  act "$@" || { FAILED+=("$what"); printf '   FAILED: %s\n' "$what" >&2; }
}
have() { command -v "$1" >/dev/null 2>&1; }
dev_of() { local p=$1; while [ ! -e "$p" ]; do p=$(dirname "$p"); done; stat -c %d "$p"; }

# ---- where things are
HERE=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
COMMON=$(git -C "$HERE" rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)
MAIN=$HERE
[ -n "$COMMON" ] && MAIN=$(dirname "$COMMON")

conf_get() {   # KEY's value in the settings file, quotes stripped; empty if none
  [ -f "$CONFIG" ] || return 0
  sed -n -E "s/^[[:space:]]*(export[[:space:]]+)?$1=(.*)$/\\2/p" "$CONFIG" | tail -n 1 \
    | sed -E "s/^'(.*)'\$/\\1/; s/^\"(.*)\"\$/\\1/"
}
KEYS=()
declare -A VALS=() FROM=()
# setting KEY DETECTED [why]: the environment, then the file, then what was detected
# (--redetect: detection before the file). An empty result writes nothing.
setting() {
  local k=$1 d=${2:-} why=${3:-detected} v=${!1:-} src=environment f
  f=$(conf_get "$k")
  if [ -z "$v" ]; then
    if [ -n "$f" ] && { [ "$REDETECT" = 0 ] || [ -z "$d" ]; }; then v=$f src=file
    else v=$d src=$why; fi
  fi
  [ -n "$f" ] && [ "$src" = file ] && [ -n "$d" ] && [ "$f" != "$d" ] && \
    note "$k: kept $f from $CONFIG (detected $d; --redetect takes it)"
  [ -z "$v" ] && return 0
  KEYS+=("$k"); VALS[$k]=$v FROM[$k]=$src
  printf -v "$k" '%s' "$v"
}

step "repos"
setting OUTREACH_ROOT "$(dirname "$MAIN")" "default: the directory holding outreach_talks"
setting SLIDEV_VIDEOS_DIR "$OUTREACH_ROOT/slidev-videos" "default: beside outreach_talks"
note "outreach_talks: $MAIN"
note "slidev-videos:  $SLIDEV_VIDEOS_DIR"
if [ ! -d "$SLIDEV_VIDEOS_DIR/.git" ] && [ ! -f "$SLIDEV_VIDEOS_DIR/.git" ]; then
  note "no slidev-videos checkout there; clone it beside this repo first:"
  note "  git clone https://github.com/MindaugasSarpis/slidev-videos $(quote "$SLIDEV_VIDEOS_DIR")"
  [ "$DRY" = 1 ] || exit 1
fi
setting OUTREACH_STATE "$HOME/.local/state/outreach_talks" "default"
act mkdir -p "$OUTREACH_STATE/logs"

# ---- the machine: render backend, GPUs, WebGL
step "render backend"
DXG=${BOOTSTRAP_DXG:-/dev/dxg}
X0=${BOOTSTRAP_X0:-/tmp/.X11-unix/X0}
WSL=0; { [ -e "$DXG" ] || [ -n "${WSL_DISTRO_NAME:-}" ]; } && WSL=1
DISPLAY_OK=0; { [ -n "${DISPLAY:-}" ] || [ -e "$X0" ]; } && DISPLAY_OK=1
NVIDIA=0; have nvidia-smi && nvidia-smi -L >/dev/null 2>&1 && NVIDIA=1
if have sbatch; then RB=slurm; elif have condor_submit; then RB=condor; else RB=local; fi
setting RENDER_BACKEND "$RB"
GPUS=
case $RENDER_BACKEND in
  slurm) GPUS=0; sinfo -h -o %G 2>/dev/null | grep -q gpu && GPUS=1 ;;
  condor) GPUS=0; condor_status -af TotalGpus 2>/dev/null | awk '$1+0 > 0 { f = 1 } END { exit !f }' && GPUS=1 ;;
esac
[ -n "$GPUS" ] && setting RENDER_GPUS "$GPUS"
for k in RENDER_LOCK RENDER_SRUN_ARGS SLIDEV_STAGE_CHROMIUM_ARGS; do setting "$k" "" ""; done
case $RENDER_BACKEND in
  slurm) note "renders: srun$([ "${RENDER_GPUS:-0}" = 1 ] && echo ' --gres=gpu:1')${RENDER_SRUN_ARGS:+ $RENDER_SRUN_ARGS} (pnpm talk render)" ;;
  condor) note "renders: condor_run$([ "${RENDER_GPUS:-0}" = 1 ] && echo ' with request_gpus = 1') (pnpm talk render)" ;;
  *) LOCK=${RENDER_LOCK:-$OUTREACH_STATE/render.lock}
     # where the stage tools' own lock exists, talk queues on it too: one queue per machine
     [ -z "${RENDER_LOCK:-}" ] && [ -e /tmp/slidev-stage-shots.lock ] && LOCK=/tmp/slidev-stage-shots.lock
     note "renders: one at a time under $LOCK (pnpm talk render)" ;;
esac

MESA=${SLIDEV_STAGE_MESA_D3D12:-$(conf_get SLIDEV_STAGE_MESA_D3D12)}
MESA=${MESA:-$HOME/.local/share/mesa-d3d12}
if [ "$MESA_SETUP" = 1 ]; then
  if [ "$WSL" = 1 ]; then try "Mesa d3d12 prefix" bash "$HERE/scripts/mesa-d3d12.sh" "$MESA"
  else note "--mesa-d3d12 is for WSL (/dev/dxg); skipped"; fi
fi
mesa_ok() { [ -f "$MESA/root/usr/lib64/dri/d3d12_dri.so" ]; }
GL='' CENV=''
if [ "$WSL" = 1 ]; then
  if mesa_ok || { [ "$DRY" = 1 ] && [ "$MESA_SETUP" = 1 ]; }; then
    GL=d3d12
    [ "$NVIDIA" = 1 ] && CENV="MESA_D3D12_DEFAULT_ADAPTER_NAME=NVIDIA"     # else Mesa may take an integrated GPU
  else
    GL=llvmpipe
    note "WSL's GPU (/dev/dxg) needs Mesa with the d3d12 driver, which this system lacks; to draw on it,"
    note "rerun with --mesa-d3d12 (~250 MB into $MESA). Until then: llvmpipe."
  fi
  [ "$DISPLAY_OK" = 1 ] || { GL=auto; note "no X display (DISPLAY, $X0): both need WSLg's; auto falls back to SwiftShader"; }
elif [ "$NVIDIA" = 1 ]; then GL=gpu-nvidia
elif [ "$RENDER_BACKEND" != local ]; then
  GL=auto; note "WebGL: auto, the compute node decides (native NVIDIA, llvmpipe with an X display, else SwiftShader)"
elif [ "$DISPLAY_OK" = 1 ]; then GL=llvmpipe
else GL=auto; note "no X display: llvmpipe needs one (xvfb-run gives one); auto falls back to SwiftShader"
fi
setting SLIDEV_STAGE_GL "$GL"
[ "${SLIDEV_STAGE_GL:-}" = d3d12 ] && setting SLIDEV_STAGE_MESA_D3D12 "$MESA"
setting SLIDEV_STAGE_CHROMIUM_ENV "$CENV"
if [ "$SLIDEV_STAGE_GL" = auto ]; then note "WebGL: SLIDEV_STAGE_GL=auto, the best the launcher reaches"
else note "WebGL: SLIDEV_STAGE_GL=$SLIDEV_STAGE_GL, forced: a run that cannot reach it fails (auto falls through)"; fi

# ---- the env
step "env (micromamba, $PREFIX)"
setting OUTREACH_ENV_BIN "$PREFIX/envs/outreach_talks/bin" "default: under the prefix"
ENV_BIN=$OUTREACH_ENV_BIN
MM=$(command -v micromamba || true)
[ -z "$MM" ] && [ -x "$PREFIX/bin/micromamba" ] && MM=$PREFIX/bin/micromamba
if [ "$NO_ENV" = 1 ]; then
  note "--no-env: env left as it is"
elif [ -x "$ENV_BIN/python" ] && [ "$UPDATE_ENV" = 0 ]; then
  note "env there: $ENV_BIN (--update-env brings it up to env.yaml)"
else
  if [ -z "$MM" ]; then
    case $(uname -m) in x86_64) PLAT=linux-64 ;; aarch64) PLAT=linux-aarch64 ;; *) PLAT= ;; esac
    if [ -z "$PLAT" ]; then FAILED+=("micromamba: no build for $(uname -m)")
    else
      act mkdir -p "$PREFIX"
      try "micromamba download" sh -c "curl -fsSL https://micro.mamba.pm/api/micromamba/$PLAT/latest | tar -xj -C $(quote "$PREFIX") bin/micromamba"
      MM=$PREFIX/bin/micromamba
    fi
  fi
  if [ -n "$MM" ]; then
    if [ -x "$ENV_BIN/python" ]; then
      try "env update" "$MM" install -y -r "$PREFIX" -n outreach_talks -f "$MAIN/env.yaml"
    elif [ "$ENV_BIN" = "$PREFIX/envs/outreach_talks/bin" ]; then
      try "env create" "$MM" create -y -r "$PREFIX" -n outreach_talks -f "$MAIN/env.yaml"
    else
      FAILED+=("OUTREACH_ENV_BIN=$ENV_BIN has no python and is not under $PREFIX")
    fi
  fi
fi

step "slidev-videos CLI (pip install -e)"
if [ "$NO_ENV" = 1 ]; then note "--no-env: skipped"
elif [ -x "$ENV_BIN/python" ] || [ "$DRY" = 1 ]; then
  have_sv=$("$ENV_BIN/python" -c 'import os, slidev_videos; print(os.path.realpath(slidev_videos.__file__))' 2>/dev/null || true)
  case $have_sv in
    "$(realpath -m "$SLIDEV_VIDEOS_DIR")"/*) note "editable install of $SLIDEV_VIDEOS_DIR there" ;;
    *) try "pip install -e slidev-videos" "$ENV_BIN/python" -m pip install -q -e "$SLIDEV_VIDEOS_DIR" ;;
  esac
else FAILED+=("no env python at $ENV_BIN: the slidev-videos CLI is not installed"); fi

# ---- browsers and the pnpm store on the repos' filesystem
step "filesystem"
ROOTDEV=$(dev_of "$OUTREACH_ROOT")
PW=${PLAYWRIGHT_BROWSERS_PATH:-$(conf_get PLAYWRIGHT_BROWSERS_PATH)}
if [ -n "$PW" ]; then setting PLAYWRIGHT_BROWSERS_PATH "$PW"
elif [ "$(dev_of "$HOME/.cache/ms-playwright")" = "$ROOTDEV" ]; then note "browsers: ~/.cache/ms-playwright, on the repos' filesystem"
else setting PLAYWRIGHT_BROWSERS_PATH "$OUTREACH_ROOT/.cache/ms-playwright" "the home directory is on another filesystem"
fi
STORE=${npm_config_store_dir:-$(conf_get npm_config_store_dir)}
if [ -n "$STORE" ]; then setting npm_config_store_dir "$STORE"
else
  CUR=
  [ -x "$ENV_BIN/pnpm" ] && CUR=$(cd "$MAIN" && "$ENV_BIN/pnpm" store path 2>/dev/null </dev/null || true)
  CUR=${CUR:-${XDG_DATA_HOME:-$HOME/.local/share}/pnpm/store}
  if [ "$(dev_of "$CUR")" = "$ROOTDEV" ]; then note "pnpm store: $CUR, on the repos' filesystem"
  elif [ -f "$MAIN/node_modules/.modules.yaml" ]; then
    note "pnpm store: $CUR is on another filesystem, but node_modules was installed from it; moving"
    note "the store reinstalls everything: set npm_config_store_dir in $CONFIG by hand to do it"
  else setting npm_config_store_dir "$OUTREACH_ROOT/.cache/pnpm-store" "the home directory is on another filesystem"
  fi
fi
# plain pnpm (the owner's shell, `pnpm install` in a session window) does not read the settings
# file: the store goes into pnpm's own global config too, or it installs from another store
if [ -n "${VALS[npm_config_store_dir]:-}" ]; then
  WANT=${VALS[npm_config_store_dir]}
  if [ -x "$ENV_BIN/pnpm" ]; then
    G=$(cd "$HOME" && env -u npm_config_store_dir "$ENV_BIN/pnpm" config get store-dir --location=global </dev/null 2>/dev/null || true)
    case $G in
      "$WANT") note "pnpm's global store-dir: $WANT" ;;
      ''|undefined) try "pnpm global store-dir" env -u npm_config_store_dir "$ENV_BIN/pnpm" config set store-dir "$WANT" --location=global ;;
      *) note "pnpm's global store-dir is $G, not $WANT: a plain pnpm uses $G; make the two agree by hand" ;;
    esac
  else note "no pnpm in $ENV_BIN yet: run bootstrap again once the env is made, to give plain pnpm the store"
  fi
fi

# ---- the settings file
step "settings ($CONFIG)"
NEW=$(
  if [ -f "$CONFIG" ]; then
    grep -v -E "^[[:space:]]*(export[[:space:]]+)?($(IFS='|'; echo "${KEYS[*]}"))=" "$CONFIG" || true
  else
    printf '%s\n' "# outreach_talks settings, written by scripts/bootstrap.sh; KEY=VALUE, read by" \
      "# \`pnpm talk\` (the environment wins over this file) and passed on to the tools it runs." \
      "# A shell loads it with: set -a; . ~/.config/outreach_talks/env; set +a"
  fi
  for k in "${KEYS[@]}"; do v=${VALS[$k]}; printf "%s='%s'\n" "$k" "${v//\'/\'\\\'\'}"; done
)
for k in "${KEYS[@]}"; do printf '   %-26s %-52s %s\n' "$k" "${VALS[$k]}" "${FROM[$k]}"; done
if [ -f "$CONFIG" ] && [ "$NEW" = "$(cat "$CONFIG")" ]; then note "unchanged"
elif [ "$DRY" = 1 ]; then note "would write:"; printf '%s\n' "$NEW" | sed 's/^/     | /'
else mkdir -p "$(dirname "$CONFIG")"; printf '%s\n' "$NEW" > "$CONFIG"; note "written"; fi

# ---- installs
export PLAYWRIGHT_BROWSERS_PATH="${PLAYWRIGHT_BROWSERS_PATH:-}" npm_config_store_dir="${npm_config_store_dir:-}"
[ -z "$PLAYWRIGHT_BROWSERS_PATH" ] && unset PLAYWRIGHT_BROWSERS_PATH
[ -z "$npm_config_store_dir" ] && unset npm_config_store_dir
step "pnpm install"
if [ "$NO_INSTALL" = 1 ]; then note "--no-install: skipped"
else
  for d in "$MAIN" "$SLIDEV_VIDEOS_DIR"; do
    [ -f "$d/package.json" ] || continue
    try "pnpm install in $d" env PATH="$ENV_BIN:$PATH" pnpm --dir "$d" install --frozen-lockfile \
      --config.confirm-modules-purge=false </dev/null
  done
fi

step "browsers (headless Chromium for the stage tools)"
if [ "$NO_INSTALL" = 1 ] || [ "$NO_BROWSERS" = 1 ]; then note "skipped"
else
  seen=" "
  for cli in "$MAIN"/node_modules/.pnpm/playwright-core@*/node_modules/playwright-core/cli.js \
             "$SLIDEV_VIDEOS_DIR"/node_modules/.pnpm/playwright-core@*/node_modules/playwright-core/cli.js; do
    [ -f "$cli" ] || continue
    ver=${cli#*playwright-core@}; ver=${ver%%/*}
    case $seen in *" $ver "*) continue ;; esac
    seen="$seen$ver "
    # a stuck unzip must not hang the whole run (seen with node 26 and playwright 1.59)
    try "playwright $ver headless shell" timeout 900 env PATH="$ENV_BIN:$PATH" node "$cli" install --only-shell chromium
  done
  [ "$seen" = " " ] && note "no playwright-core in node_modules yet (pnpm install first)"
  shells=$(ls -d "${PLAYWRIGHT_BROWSERS_PATH:-$HOME/.cache/ms-playwright}"/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell 2>/dev/null || true)
  for s in $shells; do
    miss=$(ldd "$s" 2>/dev/null | awk '/not found/ { print $1 }' | tr '\n' ' ')
    [ -n "$miss" ] && note "$s misses system libraries: $miss(the admins install them; playwright install-deps needs root)"
  done
fi

# ---- what is left for the owner
step "next"
if [ "$DRY" = 0 ] && [ -x "$ENV_BIN/python" ]; then
  OUTREACH_CONFIG=$CONFIG "$ENV_BIN/python" "$MAIN/scripts/talk.py" config 2>&1 | sed 's/^/   /' || true
fi
cat <<EOF
   Claude: run \`claude\` once and /login. Remote Control is per session: \`pnpm talk session\`
   starts each one with --remote-control, under its name, so the phone app lists it.
   Sessions run on this (login or dev) node, renders go through \`pnpm talk render\`;
   compute nodes may have no internet. The three kinds of session, each in a window
   of the tmux session "talks":

     cd $(quote "$MAIN")
     pnpm talk session scheduler      # coordinates; in outreach_talks with --add-dir slidev-videos
     pnpm talk session tools          # the toolkit, in $(quote "$SLIDEV_VIDEOS_DIR")
     pnpm talk session <talk>         # one per active talk (pnpm talk list); makes its worktree
     tmux attach -t talks

   Optional, by hand: permission rules for ~/.claude/settings.json ("permissions": {"allow": [...]}).
   This script never writes that file or any hook.
     "Bash(pnpm talk *)", "Bash(pnpm -s talk *)", "Bash(talk *)",
     "Bash(git -C $MAIN worktree add *)", "Bash(git -C $SLIDEV_VIDEOS_DIR worktree add *)",
     "Bash(tmux list-windows *)"$(case $RENDER_BACKEND in slurm) printf ', "Bash(squeue *)", "Bash(sinfo *)"' ;; condor) printf ', "Bash(condor_q *)", "Bash(condor_status *)"' ;; esac)
EOF
if [ ${#FAILED[@]} -gt 0 ]; then
  printf '\nFAILED:\n'; printf '  %s\n' "${FAILED[@]}"
  exit 1
fi
[ "$DRY" = 1 ] && printf '\ndry run: nothing was changed\n'
exit 0
