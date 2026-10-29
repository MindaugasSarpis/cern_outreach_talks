#!/bin/sh
# Data1Trigger: give the tape-library cut a dim tail (the motion review of 29 Oct, slides
# 11-12). The clip is a bright white room throughout (mean luma about 140), and the dust it
# breaks into as slide 12 opens flashed white over the dark world. This re-encodes the web
# copy from the raw on the manifest's cut (7.0-19.0 s) with the `standard` profile's
# libx264 settings, and darkens its last 0.6 s to 30 % (a black layer fading in to 0.7
# from 11.4 s). The audio is the existing web copy's (loudness-normalised; the deck plays
# it muted). The manifest has no fade field (notes/kit-requests.md asks for one), so run
# this after every `pnpm videos:encode --force --only cern_footage_2020_042_001_tape_library.mp4`,
# then `pnpm videos:frames --force --only cern_footage_2020_042_001_tape_library.mp4`.
# Run from the talk directory, through the shared render slot:
#   pnpm talk render -- sh talks/2026_00_00_Data1Trigger/videos/dim_tail.sh   (from the worktree root)
set -eu
cd "$(dirname "$0")/.."
NAME=cern_footage_2020_042_001_tape_library.mp4
RAW=../../videos/raw/$NAME
WEB=public/videos/$NAME
TMP=public/videos/${NAME%.mp4}.tail.mp4
[ -f "$RAW" ] || { echo "no raw: $RAW" >&2; exit 1; }
[ -f "$WEB" ] || { echo "no web copy (run pnpm videos:encode first): $WEB" >&2; exit 1; }
ffmpeg -y -hide_banner -nostdin -loglevel error \
  -ss 7 -i "$RAW" -i "$WEB" \
  -filter_complex "[0:v]scale='min(1920,iw)':-2,fps=25[v];color=c=black:s=1920x1080:r=25:d=12,format=rgba,colorchannelmixer=aa=0.7,fade=t=in:st=11.4:d=0.6:alpha=1[k];[v][k]overlay=shortest=1,format=yuv420p[o]" \
  -map "[o]" -map 1:a? -t 12.000 \
  -c:v libx264 -preset slow -crf 23 -profile:v high -pix_fmt yuv420p -maxrate 6M -bufsize 12M \
  -c:a copy -movflags +faststart "$TMP"
mv "$TMP" "$WEB"
echo "dim tail: $WEB"
