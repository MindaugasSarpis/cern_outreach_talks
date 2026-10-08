---
name: talk-videos
description: Use when a talk in ~/outreach_talks needs a video clip found, added, trimmed, encoded, published or checked (VideoPlayer slides, videos/manifest.toml, the dust transition's frame strips, the talk's GitHub release, the venue preflight). The clip workflow with the slidev-videos CLI's real commands, and the one flag combination that deletes release assets.
---

# Clips in a talk

Policy since 2026-07-18: every clip plays the 1080p H.264 web tier (at most
1920 px, 10 Mbps), audio at -16 LUFS. The CLI is `slidev-videos` (the
editable install every session shares); talks wrap it as `pnpm videos:*`.
Run the commands inside the talk directory with the env first on PATH, or
NVENC and HTTPS input fail (the bare `~/.local/bin/ffmpeg` crashes on HTTPS):

```bash
export PATH=~/micromamba/envs/outreach_talks/bin:$PATH
```

## 1. Reuse before you search

- The library: `src/slidev_videos/shared.toml` in the slidev-videos checkout
  the CLI is installed from (`~/slidev-videos`; read it, never edit it from a
  talk session). A library clip is referenced by name and never listed in a
  talk manifest.
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
pnpm videos:encode                       # -- --only name.mp4 for one clip
pnpm videos:frames                       # strips for transition: dust; commit public/video-frames/
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
