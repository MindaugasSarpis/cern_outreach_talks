#!/usr/bin/env bash
# The opener's last frame, for the slide after it (<WebTakeover>): the frame
# the clip ends on becomes the world's grains. Run after the opener changes:
#   pnpm takeover:frame [public/videos/<clip>.mp4]
# The clip must end on its picture (no fade to black): the takeover starts
# from exactly this frame.
set -euo pipefail
clip="${1:-public/videos/vu_ff_zoom.mp4}"
out="public/figures/opener_last.jpg"
[ -f "$clip" ] || { echo "no clip at $clip (pnpm videos:pull first)"; exit 1; }
ffmpeg -v error -y -sseof -0.08 -i "$clip" -update 1 -frames:v 1 -q:v 2 "$out"
y=$(ffmpeg -v error -i "$out" -vf "signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=-" -f null - | sed -n 's/.*YAVG=//p' | head -1)
echo "$out from $clip (mean luma ${y:-?} of 255)"
awk -v y="${y:-0}" 'BEGIN { if (y < 12) { print "warning: the last frame is nearly black — does the clip fade out?"; exit 0 } }'
