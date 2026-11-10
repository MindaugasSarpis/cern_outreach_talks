#!/usr/bin/env bash
# The Tokyo finale (10 Nov 2026; the owner: "Reimagine the finale, now it's not good. Use the LHCb collision, use the
# world rendered, maybe the world turns into a pentaquark when zoomed out and then thank you appears in japanese and
# lithuanian"). Two parts, outward all the way:
#   A  the 5 Nov finale's first 4.7 s (videos/takes/tokyo_finale_5nov.mp4, kept): LHCb at eye level, its collision
#      crossing at 4.0 s, the camera pushing into the white flash (Užsikrauk karjerai's close, slide 16, its take).
#   C  the world, recorded live in this deck (videos/takes/tokyo_finale_world.mp4): the take slide was
#      `space: { at: finale, path: … }` on the `finale` station (public/data/space.json: the collab-globe with
#      `tour` on Japan and `pq`, setup/globe.js), recorded with
#        slidev-stage-record /tmp/talk-tokyo/site DIR --slides 18 --fps 50 --size 1920x1080 --hold 22 --max 24 --clicks none
#      then the take slide was removed from deck.md. Japan close, the camera drawing back to the whole Earth, its
#      grains setting out at 6.5 s and gathering into the cover's pentaquark (u u d c c̄, the colours softened toward
#      the globe's blue), which turns as the camera comes in a little.
# The join: A dissolves through white into C at 4.0 s; C runs 19 s; 23 s in all. The sound is the shared opening's
# low bang (lowbang.py): the swell, the thump on the crossing at 4.0 s, the drone held until the pentaquark has
# formed (15.5 s) and let go. The thanks come up over its last frame on the slide (<AtClipEnd>), not in the clip.
#   usage: segments.sh SCRATCH WORKTREE ENV_BIN
set -euo pipefail
S=$1; W=$2; F=$3; mkdir -p "$S/fin"; cd "$S/fin"
python3 -I "$W/talks/2026_11_18_Tokyo/videos/finale/lowbang.py" bang.wav 23.0 4.0:15.5:1
"$F/ffmpeg" -v error -y -t 4.7 -i "$W/videos/takes/tokyo_finale_5nov.mp4" -t 19 -i "$W/videos/takes/tokyo_finale_world.mp4" -i bang.wav \
  -filter_complex "[0:v]fps=50,format=yuv420p,setpts=PTS-STARTPTS[a];[1:v]fps=50,format=yuv420p,setpts=PTS-STARTPTS[c];[a][c]xfade=transition=fadewhite:duration=0.7:offset=4.0,format=yuv420p[v]" \
  -map "[v]" -map 2:a -c:v libx264 -preset slow -crf 14 -r 50 -c:a aac -b:a 192k -shortest "$W/videos/raw/finale.mp4"
"$F/ffprobe" -v error -show_entries format=duration -of csv=p=0 "$W/videos/raw/finale.mp4"
