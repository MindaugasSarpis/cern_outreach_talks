#!/usr/bin/env bash
# The Tokyo finale. 10 Nov, the owner: "Reimagine the finale … Use the LHCb collision, use the world rendered, maybe
# the world turns into a pentaquark when zoomed out and then thank you appears in japanese and lithuanian"; then
# (deployed 13472fd) "The finale is nice, just need a smoother transition from the collision (maybe show more of it,
# particles propagating through detector)". Two takes, both recorded from takes.md (takes/README.md has the build
# and record commands), outward all the way:
#   B  videos/takes/tokyo_collision_take.mp4, takes.md slide 3: LHCb's point cloud (`detp`) at eye level, its 2012
#      collision crossing at 5.4 s, the debris lighting the detector as it passes, the crossings coming faster,
#      then the camera drawing back as the detector fades (from 14.5 s).
#   C  videos/takes/tokyo_finale_world.mp4, takes.md slide 5: Japan close, the camera drawing back to the whole
#      Earth, its grains gathering into the cover's pentaquark (from 6.5 s).
# The join: B from 1.5 s (the crossing at 3.9 s of the cut) to its dark, dissolving over 1.6 s into C from 1.0 s at
# 12.0 s; C runs 18 s: 30 s in all. The sound is the shared opening's low bang (lowbang.py): the swell, the thump
# on the crossing at 3.9 s, the drone held until the pentaquark has formed (23 s) and let go. The thanks are the
# slide's. After a new cut, slide 17's still: takes/README.md, "What depends on what".
#   usage: segments.sh SCRATCH WORKTREE ENV_BIN
set -euo pipefail
S=$1; W=$2; F=$3; mkdir -p "$S/fin"; cd "$S/fin"
python3 -I "$W/talks/2026_11_18_Tokyo/videos/finale/lowbang.py" bang.wav 30.0 3.9:23.0:1
"$F/ffmpeg" -v error -y -ss 1.5 -t 13.6 -i "$W/videos/takes/tokyo_collision_take.mp4" -ss 1.0 -t 18 -i "$W/videos/takes/tokyo_finale_world.mp4" -i bang.wav \
  -filter_complex "[0:v]fps=50,format=yuv420p,setpts=PTS-STARTPTS[b];[1:v]fps=50,format=yuv420p,setpts=PTS-STARTPTS[c];[b][c]xfade=transition=fade:duration=1.6:offset=12.0,format=yuv420p[v]" \
  -map "[v]" -map 2:a -c:v libx264 -preset slow -crf 14 -r 50 -c:a aac -b:a 192k -shortest "$W/videos/raw/finale.mp4"
"$F/ffprobe" -v error -show_entries format=duration -of csv=p=0 "$W/videos/raw/finale.mp4"
