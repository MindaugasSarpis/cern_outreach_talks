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
# 12.0 s; C runs 20 s (to the take's 21.0 s, two seconds after its camera has come to rest): 32 s in all. The sound is the shared opening's low bang (lowbang.py): the swell, the thump
# on the crossing at 3.9 s, the drone held until the pentaquark has formed (23 s) and let go. The thanks are the
# slide's. After a new cut, slide 17's still: takes/README.md, "What depends on what".
# 12 Nov (the owner: "Slide 17 should continue playing"): the world take is recorded with a 52 s hold (54 s), and
# finale_loop.mp4 is cut from what follows the finale's last frame: the take's 21.0 to 51.0 s, the pentaquark
# turning with the camera at rest, its last 2 s cross-faded into the take's 19.0 to 21.0 s, so the loop's end runs
# into its own beginning and its first frame is the one after finale.mp4's last. 30 s, no sound. <ClipLoop> and
# the last page play it.
# 13 Nov (the owner: "now it's a bit blocky"): the clips were 1080p already; the blocks were the web encode's (NVENC, cq 25,
# at most 8 Mbit/s) in the dark between the grains. The cuts are now encoded here once, at the web tier's ceiling (x264 slow,
# crf 17, at most 9.5 Mbit/s, aq-mode 3, which spends bits on dark flat areas), and the manifest's profile is `remux`.
#   usage: segments.sh SCRATCH WORKTREE ENV_BIN
set -euo pipefail
S=$1; W=$2; F=$3; mkdir -p "$S/fin"; cd "$S/fin"
# 13 Nov (the owner: "finale collision has to be slow-mo low sound, more substantial"; then "18 collision happens to fast,
# look at uzsikrauk karjerai has to be timed"): the take (takes.md slide 3) has a 16 s build-up, the camera coming round
# and in on the standing detector, the crossing at its 17.0 s, then its own slow motion (`freeze`). B runs 28.1 s from
# 1.0 s; the two bunches meet at 14.3 s of the cut (read frame by frame, 14 Nov; 18.1 s, used before, is the debris
# reaching the first detector plane), and the hit and the music's arrival are both put there (deck.md, the finale's
# <StageSoundtrack drop>);
# B dissolves over 1.6 s at 26.5 s into C from 1.0 s (20 s): 46.5 s. The pentaquark has formed by 37.5 s. The hit is on
# 14.3 s, long and low (lowbang.py --boom), the drone let go at 35.5 s, one heartbeat at 37.3 s as the pentaquark stands.
python3 -I "$W/talks/2026_11_18_Tokyo/videos/finale/lowbang.py" bang.wav 46.5 14.3:37.5:1 --boom
"$F/ffmpeg" -v error -y -ss 1.0 -t 28.1 -i "$W/videos/takes/tokyo_collision_take.mp4" -ss 1.0 -t 20 -i "$W/videos/takes/tokyo_finale_world.mp4" -i bang.wav \
  -filter_complex "[0:v]fps=50,format=yuv420p,setpts=PTS-STARTPTS[b];[1:v]fps=50,format=yuv420p,setpts=PTS-STARTPTS[c];[b][c]xfade=transition=fade:duration=1.6:offset=26.5,format=yuv420p[v]" \
  -map "[v]" -map 2:a -c:v libx264 -preset slow -crf 17 -maxrate 9500k -bufsize 19M -x264-params aq-mode=3:aq-strength=1.1 -pix_fmt yuv420p -r 50 -c:a aac -b:a 192k -t 46.5 "$W/videos/raw/finalec.mp4"
"$F/ffprobe" -v error -show_entries format=duration -of csv=p=0 "$W/videos/raw/finalec.mp4"
T="$W/videos/takes/tokyo_finale_world.mp4"
"$F/ffmpeg" -v error -y -ss 21.0 -t 30 -i "$T" -ss 19.0 -t 2 -i "$T" \
  -filter_complex "[0:v]fps=50,format=yuv420p,setpts=PTS-STARTPTS[a];[1:v]fps=50,format=yuv420p,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=2:offset=28,format=yuv420p[v]" \
  -map "[v]" -an -c:v libx264 -preset slow -crf 17 -maxrate 9500k -bufsize 19M -x264-params aq-mode=3:aq-strength=1.1 -pix_fmt yuv420p -r 50 "$W/videos/raw/finale_loop.mp4"
"$F/ffprobe" -v error -show_entries format=duration -of csv=p=0 "$W/videos/raw/finale_loop.mp4"
