#!/usr/bin/env bash
# The Tokyo finale (5 Nov 2026, the tidy cut: one direction, outward). Sources: Užsikrauk karjerai's close
# (slide 16) and cover (slide 1, its plate) recorded with `pnpm talk record`, and Tokyo's globe raw.
#   usage: segments.sh SCRATCH WORKTREE ENV_BIN  (takes in SCRATCH/karjera_close, SCRATCH/karjera_cover)
set -euo pipefail
S=$1; W=$2; F=$3; mkdir -p "$S/fin"; cd "$S/fin"
ENC=(-c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -r 50 -an)
# (crop's iw/ih stay at their first value when scale changes the frame size: z(t) is written out)
# A: LHCb at eye level, the collision crosses at 19.0 (8.0 here); from 7.6 the camera pushes into the flash (580, 466)
ZA="(1+if(gt(t,7.6),pow((t-7.6)/1.4,2)*3,0))"
"$F/ffmpeg" -v error -y -ss 11 -t 9 -i "$S/karjera_close/16.mp4" -vf "scale=w='trunc(1920*$ZA/2)*2':h=-2:eval=frame:flags=bicubic,crop=1920:1080:x='580*($ZA-1)':y='466*($ZA-1)'" "${ENC[@]}" A.mp4
# B: the cover's flash and the pentaquark gathering (at 1590, 520); from 5.0 it shrinks to a point that
# travels to where Japan's light stands in the globe's first frame (1000, 610); a soft round mask about
# the pentaquark closes in from 3.9 s, so what shrinks is the particle and its glow, not the frame
K="min(1,max(0,(t-5.0)/1.4))"
Z="max(0.03,1-pow($K,1.5))"
"$F/ffmpeg" -v error -y -ss 3.6 -t 6.4 -i "$S/karjera_cover/01-plate.mp4" -f lavfi -i color=c=black:s=1920x1080:r=50:d=6.4 -filter_complex "[0:v]format=yuva420p,geq=lum='lum(X,Y)':cb='cb(X,Y)':cr='cr(X,Y)':a='255*clip((if(lt(T,3.9),2,max(0.22,2-(T-3.9)*1.6))-hypot(X/W-0.83,(Y/H-0.48)*H/W))/0.12,0,1)',scale=w='trunc(1920*$Z/2)*2':h=-2:eval=frame,fade=t=out:st=5.7:d=0.7:alpha=1[s];[1:v][s]overlay=x='(1590-590*$K)-1590*w/1920':y='(520+90*$K)-520*h/1080':eval=frame:shortest=1[v]" -map "[v]" "${ENC[@]}" B.mp4
# D: the globe raw from 13 s: centred on Japan, its contour the brightest, then out to the whole Earth
"$F/ffmpeg" -v error -y -ss 13 -t 10 -i "$W/videos/raw/globe.mp4" -vf "fps=50" "${ENC[@]}" D.mp4
for f in A B D; do echo "$f $("$F/ffprobe" -v error -show_entries format=duration -of csv=p=0 $f.mp4)"; done
# Then: python3 -I lowbang.py bang.wav 24.0 8.0:11.9:1 (the swell from 5.4 s, the thump on the crossing at 8.0,
# the drone letting go at 11.9 as the pentaquark has formed), and the join:
#   ffmpeg -i A.mp4 -i B.mp4 -i D.mp4 -i bang.wav -filter_complex "[0:v][1:v]xfade=transition=fadewhite:
#   duration=0.5:offset=8.5[ab];[ab][2:v]xfade=transition=fade:duration=0.9:offset=14.0,format=yuv420p[v]"
#   -map "[v]" -map 3:a -c:v libx264 -preset slow -crf 14 -r 50 -c:a aac -b:a 192k -shortest videos/raw/finale.mp4
