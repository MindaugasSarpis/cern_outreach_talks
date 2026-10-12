#!/bin/bash
# Anneal a named sun's layout from many seeds side by side (16 at a time): some from the
# layout now, some fresh; then report.py on all of them, best first, in report.txt.
#   usage: batch.sh <out dir> [from now: 20] [fresh: 12] [steps: 90000] [name: vilnius]
# From the worktree's root, in the render slot:
#   RENDER_SRUN_ARGS="-p gluon_primary --ntasks=1 --cpus-per-task=16" pnpm talk render -- \
#     bash talks/2026_10_21_OpenData/tools/sun_layout/batch.sh <out dir>
export OMP_NUM_THREADS=1 OPENBLAS_NUM_THREADS=1 MKL_NUM_THREADS=1   # one core a run
export OUT=$(realpath -m "$1") IT=${4:-90000} NAME=${5:-vilnius}
W=${2:-20}; F=${3:-12}
mkdir -p "$OUT"
cd "$(dirname "$0")"
run() { python3 anneal.py "$OUT/run_$1.json" --name "$NAME" --seed "$1" --iters "$IT" $2 > "$OUT/run_$1.log" 2>&1; }
export -f run
{ seq 1 "$W"; seq 101 $((100 + F)) | sed 's/$/ --fresh/'; } | xargs -P 16 -L 1 bash -c 'run "$@"' _
python3 report.py --name "$NAME" "$OUT"/run_*.json > "$OUT/report.txt"
echo "done: $OUT/report.txt"
