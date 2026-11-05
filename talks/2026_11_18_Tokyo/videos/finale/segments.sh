#!/usr/bin/env bash
# The Tokyo finale's segments (5 Nov 2026). Sources: Užsikrauk karjerai's close (slide 16) and cover (slide 1,
# plate) recorded with `pnpm talk record`, Tokyo's vilnius_back raw, and the 5 Nov globe take with Tokyo.
set -euo pipefail
S=$1; W=$2; F=$3; cd "$S/fin"
ENC=(-c:v libx264 -preset slow -crf 14 -pix_fmt yuv420p -r 50 -an)
# (crop's iw/ih stay at their first value when scale changes the frame size: z(t) is written out)
# A: LHCb at eye level, the collision crosses at 19.0 (8.0 here); from 7.6 the camera pushes into the flash (580, 466)
"$F/ffmpeg" -v error -y -ss 11 -t 9 -i "$S/karjera_close/16.mp4" -vf "scale=w='trunc(1920*(1+if(gt(t,7.6),pow((t-7.6)/1.4,2)*3,0))/2)*2':h=-2:eval=frame:flags=bicubic,crop=1920:1080:x='580*((1+if(gt(t,7.6),pow((t-7.6)/1.4,2)*3,0))-1)':y='466*((1+if(gt(t,7.6),pow((t-7.6)/1.4,2)*3,0))-1)'" "${ENC[@]}" A.mp4
# B: the cover's flash and the pentaquark gathering; from 5.0 it shrinks to a point at (1590, 520) and goes
"$F/ffmpeg" -v error -y -ss 3.6 -t 6.4 -i "$S/karjera_cover/01-plate.mp4" -f lavfi -i color=c=black:s=1920x1080:r=50:d=6.4 -filter_complex "[0:v]scale=w='trunc(1920*if(gt(t,5.0),max(0.03,1-pow((t-5.0)/1.4,1.5)),1)/2)*2':h=-2:eval=frame,fade=t=out:st=5.6:d=0.8[s];[1:v][s]overlay=x='1590-1590*w/1920':y='520-520*h/1080':eval=frame:shortest=1[v]" -map "[v]" "${ENC[@]}" B.mp4
# C: the space shot home, 1.5x
"$F/ffmpeg" -v error -y -i "$W/videos/raw/vilnius_back.mp4" -vf "setpts=PTS/1.5,fps=50" "${ENC[@]}" C.mp4
# D: the globe take (globe.mp4's raw: Vilnius, along the strand to Japan, centred on Tokyo, out to the whole Earth)
"$F/ffmpeg" -v error -y -i "$W/videos/raw/globe.mp4" -vf "fps=50" "${ENC[@]}" D.mp4
for f in A B C D; do echo "$f $("$F/ffprobe" -v error -show_entries format=duration -of csv=p=0 $f.mp4)"; done
# Then (in $S/fin): python3 -I lowbang.py bang.wav 45.02 8.0:11.9:1 (one low bang: the swell from 5.4 s, the thump
# on the crossing at 8.0, the drone letting go at 11.9 as the pentaquark has formed), and the join:
#   ffmpeg -i A.mp4 -i B.mp4 -i C.mp4 -i D.mp4 -i bang.wav -filter_complex "[0:v][1:v]xfade=transition=fadewhite:
#   duration=0.5:offset=8.5[ab];[ab][2:v]xfade=transition=fade:duration=0.6:offset=14.3[abc];[abc][3:v]xfade=
#   transition=fade:duration=0.3:offset=22.02,format=yuv420p[v]" -map "[v]" -map 4:a -c:v libx264 -preset slow
#   -crf 14 -r 50 -c:a aac -b:a 192k -shortest videos/raw/finale.mp4
