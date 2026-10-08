---
name: talk-videos
description: Use when a talk in the outreach_talks repo needs a video clip found, added, trimmed, encoded, published or checked (VideoPlayer slides, videos/manifest.toml, the dust transition's frame strips, the talk's GitHub release, the venue preflight). The clip workflow with the slidev-videos CLI's real commands, and the one flag combination that deletes release assets.
---

# Clips in a talk

Policy since 2026-07-18: every clip plays the 1080p H.264 web tier (at most
1920 px, 10 Mbps), audio at -16 LUFS. The CLI is `slidev-videos`, the
editable install of the slidev-videos checkout that every session shares
(`$SLIDEV_VIDEOS_DIR`, by default `../slidev-videos` beside this repo);
talks wrap it as `pnpm videos:*`. Run the commands inside the talk
directory. Encodes need the env's ffmpeg (NVENC, HTTPS input):
`pnpm talk doctor` names the ffmpeg, node and pnpm a command gets and flags
a wrong one. Encodes and frame strips are renders: they go through
`pnpm talk render -- <command>`, which queues them with the other sessions'
renders.

## 1. Reuse before you search

- The library: `src/slidev_videos/shared.toml` in the slidev-videos checkout
  the CLI is installed from (`$SLIDEV_VIDEOS_DIR`; read it, never edit it
  from a talk session). A library clip is referenced by name and never
  listed in a talk manifest.
- Other talks: `grep -n 'name' talks/*/videos/manifest.toml`. A clip that a
  second talk wants belongs in the library, not in a second release copy.

## 2. Discover

```bash
slidev-videos discover "cloud chamber" lhc --limit 3        # CDS, NASA, ESO/Hubble/Webb/NOIRLab, Commons
slidev-videos discover "lhcb detector" --source cds --json  # candidates as JSON
```

It prints `[[videos]]` snippets with source and licence. Check the licence
on the record itself before using a clip.

## 3. Manifest and raw

Add the clip to `talks/<t>/videos/manifest.toml` (talk-owned clips only):

```toml
[[videos]]
name    = "lhc_tunnel_cut.mp4"
profile = "standard"            # remux | standard | standard-tight | silent-loop | high-motion
used_in = ["deck"]
trim    = ["0:12", "0:32"]      # a shorter cut of a long clip
notes   = """Source record, licence, credit line, and why this cut."""
```

A shorter cut of a library clip is listed the same way under the talk's
manifest; its encode on the talk's release wins the player's chain. Get the
raw with `pnpm videos:sync` (from the gdrive `released/` folder into
`<repo>/videos/raw/`) or `slidev-videos fetch <url> --name <name>` (yt-dlp,
appends a manifest entry).

## 4. Encode, frames, publish

```bash
pnpm talk render -- pnpm videos:encode   # add -- --only name.mp4 for one clip
pnpm talk render -- pnpm videos:frames   # strips for transition: dust; commit public/video-frames/
pnpm videos:publish -- --dry-run         # what would be uploaded
pnpm videos:publish                      # to the talk's release videos-<talk>
```

**Never combine `--only` with `--prune`.** On the current CLI,
`publish --only X --prune` deletes every other asset of the talk's release
(v0.6 refuses the combination). `--prune` alone drops assets the manifest no
longer lists; run it only after the talk, with `--dry-run` first (from v0.6
it also needs `--yes`). `videos:frames -- --prune` only drops strips of clips
the deck no longer references.

## 5. On the slide

```html
<VideoPlayer src="lhc_tunnel_cut.mp4" muted />
```

- Keep the `src="…"` attribute syntax; `videos:check` greps for it.
- Give the clip slide a `space:` pose: the world rests under the clip and is
  already flying when the clip breaks into dust.
- Put a non-video slide before a heavy opener so the clip buffers.
- The clip's length counts in the timing gate: state it in the notes and trim
  anything longer than the story needs. Innoday's 4:42 opener played untrimmed.

## 6. Check before the talk

```bash
pnpm videos:check                       # manifest against files and slide refs
pnpm videos:preflight                   # what each ref serves: codec, size, bitrate, audio, loudness
pnpm talk ready <t>                     # includes preflight and venue --dry-run
pnpm venue                              # the offline bundle <talk>-venue.zip, for the venue laptop
```

`videos:preflight -- --no-loudness` is the quick version while iterating.

## Hand-off

After an encode, a publish or new frame strips (`docs/talk-quality.md` §8):
write Status, with the clips and the release they are on, and Decisions in
`talks/<t>/CLAUDE.md`, commit the talk's files by path, and update this
session's line in `$OUTREACH_STATE/status.md`
(`name | branch | toolkit pin | doing | blocked on | next`):

```bash
python3 -I .claude/skills/talk-quality/status_line.py <slug> --doing "…" --blocked "…" --next "…"
```
