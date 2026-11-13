# The takes

Three of the deck's slides play a clip that was recorded from this talk's own stage: the data slide (10), the
globe (13) and the finale (16). The scenes are the slides of `takes.md`, one per slide; their code is
`setup/takes/` and the detector's data is `takes/data/`. Neither is in the deck's site: `setup/main.ts` loads
`setup/takes/index.js` only when `VITE_TAKES` is set, and `takes/build.sh` sets it.

| takes.md | Scene | Clip |
| --- | --- | --- |
| 2 · data | LHCb whole, a collision, its grains arcing out and landing as the 2019 histogram, the fit drawn, the three peaks lit | `data2019d.mp4` (slide 10) |
| 3 · collision | LHCb's point cloud, a collision, its particles going through the detector, the camera drawing back | `finale_h.mp4`, to 13.6 s |
| 4 · globe | the globe forms on Europe, Vilnius, Nagoya and Tokyo light, the strand is drawn, the globe turns east as the camera comes in | `globeb.mp4` (slide 13) |
| 5 · world | the Earth with Japan in the middle, the camera drawing back, the grains gathering into the cover's pentaquark | `finale_h.mp4`, from 12.0 s |

## Build, record, cut

From the worktree root, with the env's `bin` first on PATH. Recordings are heavy renders: one at a time, each
under the lock.

```sh
# 1. the takes' site (about 1 min)
rm -rf /tmp/talk-tokyo/takes && talks/2026_11_18_Tokyo/takes/build.sh

# 2. the four takes (cd talks/2026_11_18_Tokyo; N, HOLD and MAX from the table below)
flock /tmp/slidev-stage-shots.lock node node_modules/slidev-addon-stage/bin/record.mjs \
  /tmp/talk-tokyo/takes OUT --slides N --fps 50 --size 1920x1080 --hold HOLD --max MAX --clicks none
```

| Take | `--slides` | `--hold` | `--max` | Kept as (worktree root, gitignored) |
| --- | --- | --- | --- | --- |
| data | 2, at `--size 3840x2160` | 50 | 52 | `videos/takes/tokyo_data_take.mp4` |
| collision | 3 | 38 | 40 | `videos/takes/tokyo_collision_take.mp4` |
| globe | 4 | 66 | 68 | `videos/takes/tokyo_globe_tour.mp4` |
| world | 6 (5 is an empty slide before it, 12 Nov) | 52 | 54 | `videos/takes/tokyo_finale_world.mp4` (12 Nov: the long hold is the loop's source) |

```sh
# 3. the cuts, into videos/raw/ (worktree root)
X='-c:v libx264 -preset slow -crf 17 -maxrate 9500k -bufsize 19M -x264-params aq-mode=3:aq-strength=1.1 -pix_fmt yuv420p -r 50'   # the web encode itself (13 Nov)
# the data take is recorded at 3840x2160 (--size 3840x2160 --hold 38 --max 40) and taken down to 1080p here, so its grains are fine (13 Nov)
ffmpeg -ss 3.8 -t 34.2 -i videos/takes/tokyo_data_take.mp4 -an -vf scale=1920:1080:flags=lanczos ${=X} SCRATCH/data_silent.mp4
# the loop after it (12 s: the take's 38-50 s, its last second cross-faded into 37-38 s); the take's hold is 50, max 52
ffmpeg -ss 38 -t 12 -i videos/takes/tokyo_data_take.mp4 -ss 37 -t 1 -i videos/takes/tokyo_data_take.mp4 -an -filter_complex "[0:v]scale=1920:1080:flags=lanczos,fps=50,setpts=PTS-STARTPTS[a];[1:v]scale=1920:1080:flags=lanczos,fps=50,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=1:offset=11,format=yuv420p[v]" -map "[v]" ${=X} videos/raw/data_loopb.mp4
python3 -I talks/2026_11_18_Tokyo/videos/clips/data_swoosh.py SCRATCH/data.wav     # the clip's sound (13 Nov)
# its loudness to -16 LUFS (preflight's target): measure SCRATCH/data.wav (ffmpeg -af loudnorm=print_format=json) and give the difference as G
ffmpeg -i SCRATCH/data_silent.mp4 -i SCRATCH/data.wav -map 0:v -map 1:a -c:v copy -af volume=${G}dB -c:a aac -b:a 192k -shortest videos/raw/data2019d.mp4
ffmpeg -ss 4.4 -t 20.6 -i videos/takes/tokyo_globe_tour.mp4 -an ${=X} videos/raw/globeb.mp4
# its loop (36 s: the take's 25-61 s, the last second cross-faded into 24-25 s)
ffmpeg -ss 25 -t 36 -i videos/takes/tokyo_globe_tour.mp4 -ss 24 -t 1 -i videos/takes/tokyo_globe_tour.mp4 -an -filter_complex "[0:v]fps=50,setpts=PTS-STARTPTS[a];[1:v]fps=50,setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=1:offset=35,format=yuv420p[v]" -map "[v]" ${=X} videos/raw/globe_loop.mp4
talks/2026_11_18_Tokyo/videos/finale/segments.sh SCRATCH "$PWD" "$OUTREACH_ENV_BIN"     # finale_h.mp4 (32 s, with its sound) and finale_loop.mp4 (30 s)

# 4. encode (profile remux: the raws are copied)
pnpm talk render -- pnpm -C talks/2026_11_18_Tokyo videos:encode -- --only data2019d.mp4 globeb.mp4 finale_h.mp4 finale_loop.mp4
```

Look at each take on a contact sheet before cutting it (`ffmpeg -i TAKE -vf "fps=1,scale=480:-1,tile=6x5"
-frames:v 1 sheet.jpg`): of the first four takes of 10 Nov, two were wrong (below).

The raws are these cuts, not on gdrive: never a plain `videos:sync` here.

## What depends on what

- **Slide 10's axis and names** are HTML over the clip's last frame (`.spec-axis`, `.spec-names` in
  `styles/index.css`), placed on the data take's last camera pose (`takes.md` slide 2, the path's 19.5 s
  entry). Move that pose and the labels have to move with it: 4250 MeV is at x = 201.6 slide units, 1.6406
  units per MeV, the axis line at y = 360.
- **The deck's `globe` station** (`public/data/space.json`: dist 8.3, `tour: [[0, 104, 44]]`) is the globe
  take's end, so a back-step or a jump onto slide 13 (`recorded: clip`) and the slide after rest on the
  same view the clip ends on. The take's station (`takes/data/space.json`) holds the whole turn: the globe
  forms on Europe (`tour` from `[40, 50]`: Vilnius left of the middle, Tokyo just inside the right limb),
  holds until the strand is drawn (7.5 s), and turns east to `[104, 44]` by 19.5 s, the seconds counted
  from the photo sequence's start (`tourFrom: cue`), so the turn and the slide's camera path share a clock.
- **`finale_loop.mp4`** begins on the frame after `finale_h.mp4`'s last (the world take's 21.0 s): a new finale
  cut means a new loop, which `segments.sh` makes with it. The last page plays the loop.
- **`public/figures/finale_end.jpg`** (`<CloseStill>`, not in the deck since 12 Nov) is the finale clip's last frame. After a new cut:
  `ffmpeg -sseof -0.1 -i videos/raw/finale_h.mp4 -frames:v 1 -q:v 2 talks/2026_11_18_Tokyo/public/figures/finale_end.jpg`.
- **The histogram's data** is `takes/data/jpsip-2019-fit.json`, made by `bake/fit_2019.py` from HEPData
  ins1728691, Table 3 (LHCb, PRL 122 (2019) 222001).
- **The look** (`palette`, `options`) is two lines of `takes.md`'s headmatter: keep them as `deck.md`'s.
  `setup/look.js` (the ground's glows, the dust nearest the camera) is in both builds. A change of the look
  means all four takes again, and the deck's plates (`pnpm talk record tokyo --plates`).
- **The finale's cut times** (`videos/finale/segments.sh`): the collision take's crossing is at 5.4 s and its
  detector fades from 14.5 s (`takes.md` slide 3: `delay`, `fade-at`); the world take's grains leave the globe
  6.5 s in and the pentaquark has formed by 12 s (the `finale` station's `pq`). The sound's thump and the
  drone's end follow those.

## Four things that cost a take

- The detector's and the globe's data load behind `setup/afterCover.js`'s `places` latch, which the deck opens
  once its cover is behind. The recorder reaches the data take from slide 1, where the latch would still be
  shut: `installTakes` opens it at once (`places.flip()`), since `takes.md` has no cover to keep clear.
  Without it the data take records an empty hall.
- The histogram fills only when its station is arrived at from another slide. A page opened directly on the
  data take shows no histogram; the recorder arrives from the slide before, which is what the take needs.
- The takes' stations file holds two globes, the `globe` station's and the `finale` station's, and the stage
  builds both. Each is kept by its `name` (`collab.all` in `setup/globe.js`), and `<CollabGlobe globe="…">`
  starts the one it names (`globe` by default). With one slot for "the globe", the last one built took the
  other's photograph: the globe take showed the finale's Earth on Japan, standing still.
- The globe's turn (`tourFrom: cue`) and the pentaquark (`pq.at`) count their seconds from the cue: the moment
  the camera sets out for the station from another slide (the stage's `arm`), or the moment `<CollabGlobe>`
  starts the photo's sequence. Not from the stage's `assemble`: on a slide with a `space.path` that comes at
  the path's end, which put the pentaquark 19 s into a 24 s take.
