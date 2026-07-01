# NVENC Video Pipeline + Rendering Acceleration — Design Spec

**Status:** Approved (author, 2026-07-01) · **Date:** 2026-07-01 · **Branch:** `feat/nvenc-video-pipeline`
**Owner:** Mindaugas Šarpis

> Repo-wide upgrade to the shared `scripts/videos.py` (used by every talk) plus a
> new `scripts/render_lib.py`. Optimizes four axes the author asked for: **encode
> speed** (NVENC on the RTX 5080), **web delivery** (H.264 instead of HEVC),
> **masters + workflow ergonomics**, and **video rendering** (parallel frames →
> NVENC). Existing talks (`editAI`, `Sceptics`) keep working unchanged.

---

## 1. Environment facts (verified 2026-07-01)

- **GPU:** NVIDIA RTX 5080 (Blackwell), 16 GB, driver 595.79, visible under WSL2.
- **ffmpeg:** conda-forge **8.0.1** in env `outreach_talks`. Ships `h264_nvenc`,
  `hevc_nvenc`, `av1_nvenc`, plus `libsvtav1`/`libaom-av1` and vaapi/qsv.
- **NVENC runtime:** all three (`h264_nvenc`, `hevc_nvenc`, `av1_nvenc`) **encode
  successfully at runtime under WSL2** (tested with `-f lavfi testsrc2 -f null`).
- **CPU:** 16 cores. `libx265 preset slow` ≈ 41 fps on a *trivial* 1080p synthetic
  clip (far slower on real footage / 4K) — the bottleneck NVENC removes.
- **Rendering today:** per-talk matplotlib scripts (e.g. `talks/2026_05_11_Sceptics/
  scripts/orbital_animation.py`) using matplotlib's slow `FFMpegWriter`
  (~5 min/1080p, ~20 min/4K).

## 2. Decisions locked (2026-07-01, via brainstorming)

1. **Web tier = H.264** via `h264_nvenc` — universal browser/device playback;
   fixes the current HEVC-for-web liability. (AV1 considered, deferred: not
   universally supported on older devices.)
2. **HQ masters = HEVC** via `hevc_nvenc` at high quality (`-cq 18 -preset p7
   -tune hq`) — visually lossless at venue distance, encodes in seconds.
3. **NVENC is the default encoder; CPU (libx264/libx265) is the graceful
   fallback** when NVENC is unavailable (CI, non-NVIDIA machines). Detected at
   runtime; overridable per-video.
4. **Backward compatible:** existing manifests/profiles keep working; NVENC is a
   drop-in quality-target change, not a schema break.
5. **Rendering:** a reusable `scripts/render_lib.py` (parallel frame gen → raw
   pipe → NVENC), with `orbital_animation.py` refactored onto it as the reference.

## 3. Architecture

`scripts/videos.py` gains an **encoder-abstraction layer**: profiles are defined
as *quality targets* (cq/crf, audio, scale, motion), and a small builder emits
the concrete ffmpeg args for the selected encoder (`nvenc` or `cpu`). Encoder
selection: per-video `encoder` field → else runtime auto-detect (`nvenc` if a
one-shot NVENC probe succeeds, else `cpu`). `scripts/render_lib.py` is a
standalone module talks import from their own render scripts.

```
manifest [[videos]] --profile/--encoder-->  videos.py
                                              |  _select_encoder()  (nvenc|cpu, memoized probe)
                                              |  _profile_args(profile, encoder, long_edge)
                                              v
                          ffmpeg (h264_nvenc web / hevc_nvenc master, or libx264/libx265)
render script --frame_fn--> render_lib.render() --parallel frames--> ffmpeg rawvideo -> nvenc -> .mp4
```

## 4. NVENC availability + fallback

```python
import functools

@functools.lru_cache(maxsize=1)
def nvenc_available() -> bool:
    """True iff h264_nvenc actually encodes on this machine (compiled-in != runtime)."""
    if not shutil.which("ffmpeg"):
        return False
    probe = subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error",
         "-f", "lavfi", "-i", "testsrc2=size=256x144:rate=30:duration=1",
         "-c:v", "h264_nvenc", "-f", "null", "-"],
        capture_output=True,
    )
    return probe.returncode == 0


def select_encoder(entry_encoder: str | None) -> str:
    """Per-video override wins; else auto (nvenc if available, else cpu)."""
    if entry_encoder in ("nvenc", "cpu"):
        return entry_encoder
    return "nvenc" if nvenc_available() else "cpu"
```

A once-per-run log line states which encoder was chosen (and why, if it fell back).

## 5. Profiles (quality targets → per-encoder args)

Profiles carry a quality target; the builder maps to NVENC or CPU flags.
`{LONG_EDGE}` substituted at encode time. Common web scale/faststart identical to
today. NVENC rate control is constant-quality VBR: `-rc vbr -cq N -b:v 0`.

| profile | tier | NVENC cq | CPU crf | audio |
|---|---|---|---|---|
| `standard` | web H.264 | 23 | 21 (x264) | aac 128k |
| `standard-tight` | web H.264 | 27 | 24 (x264) | aac 128k |
| `silent-loop` | web H.264 | 25 | 23 (x264) | none (`-an`) |
| `high-motion` | web H.264 | 20 | 19 (x264) | aac 192k |
| `hq-visually-lossless` | master HEVC | 18 | 16 (x265, `-tune grain`) | copy |
| `remux` | copy | — | — | copy |

**Concrete arg builders:**

```python
# Web H.264
def _web_args(cq, x264_crf, long_edge, audio, encoder):
    scale = ["-vf", f"scale='min({long_edge},iw)':-2"]
    a = ["-an"] if audio is None else ["-c:a", "aac", "-b:a", audio, "-ac", "2"]
    if encoder == "nvenc":
        v = ["-c:v", "h264_nvenc", "-preset", "p5", "-tune", "hq",
             "-rc", "vbr", "-cq", str(cq), "-b:v", "0",
             "-profile:v", "high", "-pix_fmt", "yuv420p"]
    else:
        v = ["-c:v", "libx264", "-preset", "slow", "-crf", str(x264_crf),
             "-profile:v", "high", "-pix_fmt", "yuv420p"]
    return v + scale + a + ["-movflags", "+faststart"]

# HQ master HEVC
def _hq_args(cq, x265_crf, long_edge, encoder):
    scale = ["-vf", f"scale='min({long_edge},iw)':-2"]
    if encoder == "nvenc":
        v = ["-c:v", "hevc_nvenc", "-tag:v", "hvc1", "-preset", "p7", "-tune", "hq",
             "-rc", "vbr", "-cq", str(cq), "-b:v", "0", "-pix_fmt", "yuv420p"]
    else:
        v = ["-c:v", "libx265", "-tag:v", "hvc1", "-preset", "slow",
             "-crf", str(x265_crf), "-tune", "grain", "-pix_fmt", "yuv420p"]
    return v + scale + ["-c:a", "copy", "-movflags", "+faststart"]
```

The audio-copy retry-with-AAC path in `_encode_one_hq` (for masters whose source
audio codec can't be copied) is preserved.

## 6. Manifest schema (additive, backward compatible)

New optional per-`[[videos]]` field: `encoder = "nvenc" | "cpu"` (default: auto).
Everything else unchanged. `[defaults]` may set `encoder` talk-wide. Old manifests
with no `encoder` field work as-is (auto → nvenc where available).

## 7. Ergonomics — `videos:build`

New subcommand `build` = `sync` (if `--sync`) → **render** (run any
`scripts/*_render.py`/hook, optional) → `encode` → `encode-hq` → `check`, with a
single summary. Add `pnpm videos:build` to `new-talk.sh` and (optionally) existing
talks. Per-clip report gains encoder + fps. `--dry-run` supported. No behavior
change to the existing atomic subcommands.

## 8. Rendering — `scripts/render_lib.py`

Reusable module; kills matplotlib's slow writer by (a) generating frames in
parallel across cores and (b) piping raw RGB straight into NVENC.

```python
def render(frame_fn, n_frames, fps, out_path, size, *,
           encoder="nvenc", workers=None, crf_cq=18, pix="rgb24"):
    """frame_fn(i) -> (H,W,3) uint8 RGB ndarray. Frames generated in a process
    pool (workers defaults to os.cpu_count()), fed IN ORDER to a single ffmpeg
    that encodes with hevc_nvenc (master) via -f rawvideo stdin. Falls back to
    libx265 when NVENC is unavailable."""
```

- **Parallelism:** `concurrent.futures.ProcessPoolExecutor`; each worker builds its
  own matplotlib `Figure` (Agg backend) and returns the RGB buffer for frame `i`.
  Results are reordered and streamed to ffmpeg stdin in index order.
- **Encode:** `ffmpeg -f rawvideo -pix_fmt rgb24 -s WxH -r fps -i - <nvenc args> out`.
- **Reference refactor:** `orbital_animation.py` becomes a thin `frame_fn` (the
  `|Y_lm|^2` surface at rotation angle `θ(i)`) + a `render(...)` call. Behavior/
  output equivalent, dramatically faster.
- **Output:** a master (`videos/hq` candidate) or a raw the normal `encode` step
  then web-encodes — render_lib produces the high-quality source; the two-tier
  encode still derives the web copy.

## 9. Verification plan (empirical — real encodes)

1. `nvenc_available()` returns True here; a forced `encoder="cpu"` path also works.
2. Encode one real clip each: web `standard` → output is **h264** (`ffprobe`
   codec_name), plays; master `hq-visually-lossless` → **hevc**; both faster than
   the libx265 baseline (log fps).
3. `remux` unchanged; `silent-loop` strips audio; sizes within `max_size_mb`.
4. CPU fallback: temporarily force `cpu`, confirm libx264/libx265 outputs.
5. `videos:build` runs the chain end-to-end on a talk with ≥1 clip.
6. `render_lib`: render a short test animation; confirm NVENC-encoded mp4, correct
   frame count/fps, and wall-clock well under the matplotlib-writer baseline.
7. Existing talks: `videos:check` in `editAI` + `Sceptics` still passes; a spot
   re-encode produces valid H.264 web files.

## 10. Non-goals
- AV1 web tier (deferred; H.264 chosen for universality).
- Multi-codec `<source>` negotiation in `VideoPlayer` (no player change).
- GH-Release layout / fallback-chain changes.
- The Yaga talk content (separate sub-project; this pipeline is its enabler).

## 11. Open questions
- Whether to flip existing `editAI`/`Sceptics` web encodes to H.264 now or leave
  them (they're HEVC today). Default: leave; re-encode on next `encode` run.
- `videos:build` render-hook convention (naming/discovery of a talk's render
  scripts) — finalize during implementation.

## 12. Change log
- **2026-07-01** — Drafted from brainstorming; NVENC runtime verified; web=H.264,
  masters=hevc_nvenc locked. Approved by author.
