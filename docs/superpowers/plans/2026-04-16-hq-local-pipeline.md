# HQ Local Pipeline + New Video Propagation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a third asset tier — visually-lossless venue masters that live only on the presenter's laptop — and bring 14 newly added Drive clips into the editAI talk's manifest, encoding pipeline, and slides.

**Architecture:** A new `encode-hq` subcommand in `scripts/videos.py` writes visually-lossless HEVC files (CRF 16, scaled to `long_edge_px`, never upscaled) into `videos/hq/`, exposed to Slidev via a `public/videos-hq → ../../videos/hq` symlink that `encode-hq` creates idempotently on first run. The old `link-hq` and `publish-hq` subcommands are removed because HQ files are local-only by definition. `VideoPlayer.vue`'s `hq` prop falls back through three steps: local HQ → local web → remote web release.

**Tech Stack:** Python 3 (`scripts/videos.py`), Vue 3 + Slidev (`components/VideoPlayer.vue`), TOML manifests, `ffmpeg` / `rclone` / `gh` shelling out via `subprocess`.

**Spec:** `docs/superpowers/specs/2026-04-16-hq-local-pipeline-design.md`

**Conventions for this plan:**
- This codebase has no test suite for `videos.py` or for the deck. Verification is by running the actual command and inspecting the output, not by unit tests. The user verifies UI changes by eye in their own dev server (do not start Playwright).
- All paths in the plan are absolute from the repo root `/Users/mindaugas/Work/writing/talks/Outreach_Talks/`.
- All `pnpm` and `python3` commands inside `talks/2026_04_28_editAI/` assume the `outreach_talks` conda env is active (`conda activate outreach_talks`). The env provides `node`, `pnpm`, `ffmpeg`, `rclone`, `gh`.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `scripts/videos.py` | Modify | Add `hq-visually-lossless` profile constant, `_hq_profile_args()` helper, `_encode_one_hq()` function, `cmd_encode_hq()`, `encode-hq` subparser. Remove `cmd_link_hq`, `cmd_publish_hq`, `link-hq` subparser, `publish-hq` subparser, `HQ_LINK_DIR` constant. Add `HQ_DIR = TALK / "videos" / "hq"` constant. |
| `components/VideoPlayer.vue` | Modify | Replace single-step error fallback with three-step chain when `hq=true`. Drop `VITE_VIDEO_RELEASE_HQ`, `RELEASE_HQ`, `REMOTE_BASE_HQ`, `remoteBase` computed. |
| `talks/2026_04_28_editAI/package.json` | Modify | Add `videos:encode-hq`, remove `videos:link-hq` and `videos:publish-hq`. |
| `talks/2026_04_28_editAI/videos/manifest.toml` | Modify | Append 14 new `[[videos]]` entries. |
| `talks/2026_04_28_editAI/deck.md` | Modify | Replace 10 `layout: image` GIF slides with `<VideoPlayer>` loops. Append 4 placeholder slides at the end. |
| `talks/2026_04_28_editAI/.env` | Modify | Remove `VITE_VIDEO_RELEASE_HQ` line (no longer used). |
| `talks/2026_04_28_editAI/videos/raw/` | Populate (via `pnpm videos:sync`) | Source originals — unchanged structurally. |
| `talks/2026_04_28_editAI/videos/hq/` | Created (by `videos:encode-hq`) | New gitignored output dir. Already covered by existing root `.gitignore` line `**/videos/raw/`? **No** — root gitignore only matches `**/videos/raw/`. Need to extend it or rely on the existing `**/public/videos-hq/` line plus a new `**/videos/hq/` line. |
| `.gitignore` | Modify | Add `**/videos/hq/` so the new HQ output dir is never committed. |
| `talks/2026_04_28_editAI/public/videos-hq` | Symlink | Created idempotently by `videos:encode-hq` (target: `../../videos/hq`). Already gitignored via existing `**/public/videos-hq/` line. |

---

## Task 1 — Extend `.gitignore` for the new HQ output directory

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/.gitignore`

- [ ] **Step 1: Inspect current `.gitignore`**

Run: `cat /Users/mindaugas/Work/writing/talks/Outreach_Talks/.gitignore`

Expected current contents (verbatim):

```
node_modules
__pycache__/

.DS_Store
.vscode

dist/
**/public/videos/
**/public/videos-hq/
**/videos/raw/
```

- [ ] **Step 2: Add `**/videos/hq/` line**

Edit `/Users/mindaugas/Work/writing/talks/Outreach_Talks/.gitignore`. Replace the line `**/videos/raw/` with the two-line block:

```
**/videos/raw/
**/videos/hq/
```

- [ ] **Step 3: Verify it parses**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks && git check-ignore -v talks/2026_04_28_editAI/videos/hq/foo.mp4`

Expected: a line like `.gitignore:10:**/videos/hq/	talks/2026_04_28_editAI/videos/hq/foo.mp4` (line number may differ).

- [ ] **Step 4: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add .gitignore
git commit -m "Ignore videos/hq/ output directory

The new HQ encode tier writes visually-lossless masters into
talks/<name>/videos/hq/. These are local-only and must not be tracked.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 2 — Add `hq-visually-lossless` profile to `scripts/videos.py`

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/scripts/videos.py`

- [ ] **Step 1: Add `HQ_DIR` constant next to existing path constants**

Edit `scripts/videos.py`. Find this block (currently around lines 30–37):

```python
TALK = Path.cwd().resolve()
MANIFEST = TALK / "videos" / "manifest.toml"
RAW_DIR = TALK / "videos" / "raw"
WEB_DIR = TALK / "public" / "videos"
HQ_LINK_DIR = TALK / "public" / "videos-hq"
SLIDES_DIR = TALK
# Back-compat alias: some logging still references REPO.
REPO = TALK
```

Replace with:

```python
TALK = Path.cwd().resolve()
MANIFEST = TALK / "videos" / "manifest.toml"
RAW_DIR = TALK / "videos" / "raw"
WEB_DIR = TALK / "public" / "videos"
HQ_DIR = TALK / "videos" / "hq"
HQ_LINK_DIR = TALK / "public" / "videos-hq"
SLIDES_DIR = TALK
# Back-compat alias: some logging still references REPO.
REPO = TALK
```

- [ ] **Step 2: Add the `hq-visually-lossless` profile to the `PROFILES` dict**

Find the `PROFILES: dict[str, list[str]] = {` block (currently around line 78). After the closing `},` of the `"high-motion"` entry but before the closing `}` of the dict, insert:

```python
    "hq-visually-lossless": [
        "-c:v", "libx265", "-tag:v", "hvc1",
        "-preset", "slow", "-crf", "16",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-c:a", "copy",
        "-movflags", "+faststart",
    ],
```

- [ ] **Step 3: Verify the file still parses**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks && python3 -c "import ast; ast.parse(open('scripts/videos.py').read())" && echo OK`

Expected: `OK`

- [ ] **Step 4: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add scripts/videos.py
git commit -m "Add hq-visually-lossless profile and HQ_DIR constant

CRF 16 HEVC, audio stream-copied, scaled to long_edge_px (no upscale).
Used by the upcoming encode-hq subcommand.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 3 — Add `_encode_one_hq()` and `cmd_encode_hq()` to `scripts/videos.py`

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/scripts/videos.py`

- [ ] **Step 1: Add `_ensure_hq_symlink()` helper**

Find the existing `cmd_link_hq` function (currently around line 430). **Above it**, insert this helper:

```python
def _ensure_hq_symlink() -> None:
    """Make public/videos-hq a symlink to videos/hq (idempotent).

    If the path already exists as a symlink to the correct target, do nothing.
    If it exists as a different symlink, replace it.
    If it exists as a real file or directory, raise — user must remove it.
    """
    HQ_DIR.mkdir(parents=True, exist_ok=True)
    target = HQ_DIR.resolve()
    if HQ_LINK_DIR.is_symlink():
        if HQ_LINK_DIR.resolve() == target:
            return
        HQ_LINK_DIR.unlink()
    elif HQ_LINK_DIR.exists():
        raise RuntimeError(
            f"{HQ_LINK_DIR} exists and is not a symlink; remove it manually."
        )
    HQ_LINK_DIR.parent.mkdir(parents=True, exist_ok=True)
    HQ_LINK_DIR.symlink_to(target, target_is_directory=True)
```

- [ ] **Step 2: Add `_encode_one_hq()` worker**

Below `_ensure_hq_symlink()` and still above `cmd_link_hq`, insert:

```python
def _encode_one_hq(entry: VideoEntry, force: bool, default_long_edge: int) -> tuple[VideoEntry, str, int, int]:
    """HQ counterpart of _encode_one. Writes to videos/hq/<name>.

    Profile selection (driven by the existing per-video `profile` field):
      - remux       → stream-copy (already web-friendly, no scale needed)
      - silent-loop → hq-visually-lossless + -an (strip audio)
      - everything else → hq-visually-lossless

    Returns (entry, status, raw_size, hq_size). status in {skipped, ok, missing, failed}.
    """
    raw = RAW_DIR / entry.name
    hq = HQ_DIR / entry.name
    if not raw.exists():
        return entry, "missing", 0, 0
    raw_size = raw.stat().st_size
    if hq.exists() and not force and hq.stat().st_mtime >= raw.stat().st_mtime:
        return entry, "skipped", raw_size, hq.stat().st_size

    if entry.profile == "remux":
        ff_args = _profile_args("remux", default_long_edge)
    else:
        long_edge = entry.long_edge_px or default_long_edge
        ff_args = _profile_args("hq-visually-lossless", long_edge)
        if entry.profile == "silent-loop":
            ff_args = ff_args + ["-an"]

    tmp = hq.with_name(f"{hq.stem}.partial{hq.suffix}")
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-nostdin", "-loglevel", "error",
        "-i", str(raw),
        *ff_args,
        str(tmp),
    ]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError:
        # Audio-codec mismatches are the most common failure with `-c:a copy`.
        # Auto-retry once with re-encoded AAC. Drop -an (silent-loop already
        # had -an above; harmless duplicate is overwritten by the retry path).
        tmp.unlink(missing_ok=True)
        if "-c:a" in ff_args and "copy" in ff_args:
            retry_args = []
            i = 0
            while i < len(ff_args):
                if ff_args[i] == "-c:a" and i + 1 < len(ff_args) and ff_args[i + 1] == "copy":
                    retry_args.extend(["-c:a", "aac", "-b:a", "256k", "-ac", "2"])
                    i += 2
                else:
                    retry_args.append(ff_args[i])
                    i += 1
            cmd_retry = [
                "ffmpeg", "-y", "-hide_banner", "-nostdin", "-loglevel", "error",
                "-i", str(raw),
                *retry_args,
                str(tmp),
            ]
            try:
                subprocess.run(cmd_retry, check=True)
            except subprocess.CalledProcessError as e:
                tmp.unlink(missing_ok=True)
                print(f"  ! ffmpeg HQ failed for {entry.name} (retry also failed): {e}", file=sys.stderr)
                return entry, "failed", raw_size, 0
        else:
            print(f"  ! ffmpeg HQ failed for {entry.name}", file=sys.stderr)
            return entry, "failed", raw_size, 0
    tmp.replace(hq)
    return entry, "ok", raw_size, hq.stat().st_size
```

- [ ] **Step 3: Add `cmd_encode_hq()` subcommand handler**

Below `_encode_one_hq()` and still above `cmd_link_hq`, insert:

```python
def cmd_encode_hq(args: argparse.Namespace) -> int:
    defaults, videos = load_manifest()
    if args.only:
        wanted = set(args.only)
        videos = [v for v in videos if v.name in wanted]
        if not videos:
            print(f"error: no manifest entries match {args.only}", file=sys.stderr)
            return 2

    if not shutil.which("ffmpeg"):
        print("error: ffmpeg not installed. brew install ffmpeg", file=sys.stderr)
        return 2
    HQ_DIR.mkdir(parents=True, exist_ok=True)
    _ensure_hq_symlink()

    default_long_edge = int(defaults.get("long_edge_px", 1920))
    print(f"HQ-encoding {len(videos)} video(s). raw -> {HQ_DIR.relative_to(REPO)} (long edge: {default_long_edge}px)")

    # Remuxes can run in parallel; full encodes serially (CPU-bound).
    remuxes = [v for v in videos if v.profile == "remux"]
    encodes = [v for v in videos if v.profile != "remux"]

    total_raw = 0
    total_hq = 0
    failed: list[str] = []

    def report(entry, status, raw_size, hq_size):
        nonlocal total_raw, total_hq
        total_raw += raw_size
        total_hq += hq_size
        if status == "missing":
            print(f"  - {entry.name}: MISSING in raw/")
            failed.append(entry.name)
        elif status == "failed":
            print(f"  x {entry.name}: FAILED")
            failed.append(entry.name)
        elif status == "skipped":
            print(f"  = {entry.name}: skipped (up to date, {human_size(hq_size)})")
        else:
            delta = raw_size - hq_size
            sign = "-" if delta >= 0 else "+"
            pct = (abs(delta) / raw_size * 100) if raw_size else 0
            print(
                f"  + {entry.name}: hq "
                f"[{human_size(raw_size)} -> {human_size(hq_size)}, {sign}{pct:.0f}%]"
            )

    if remuxes:
        with ThreadPoolExecutor(max_workers=4) as pool:
            futures = [pool.submit(_encode_one_hq, v, args.force, default_long_edge) for v in remuxes]
            for fut in as_completed(futures):
                report(*fut.result())

    for v in encodes:
        report(*_encode_one_hq(v, args.force, default_long_edge))

    print()
    print(f"Total raw: {human_size(total_raw)}")
    print(f"Total hq:  {human_size(total_hq)}")
    if failed:
        print()
        print(f"FAILED: {len(failed)} file(s): {', '.join(failed)}")
        return 1
    return 0
```

- [ ] **Step 4: Wire `encode-hq` into the argparse subparsers**

Find the `main()` function (currently around line 513). Find this block:

```python
    p_phq = sub.add_parser("publish-hq", help="upload raw masters to the `videos-hq` GH Release")
    p_phq.add_argument("--dry-run", action="store_true")
    p_phq.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_phq.add_argument("--force", action="store_true", help="re-upload even if remote size matches")
    p_phq.set_defaults(func=cmd_publish_hq)
```

Immediately **above** that block, insert:

```python
    p_ehq = sub.add_parser("encode-hq", help="ffmpeg raw -> videos/hq/ (visually-lossless venue masters, local-only)")
    p_ehq.add_argument("--force", action="store_true", help="re-encode even if up to date")
    p_ehq.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_ehq.set_defaults(func=cmd_encode_hq)
```

(The `publish-hq` block will be removed in Task 4. Doing it in two steps keeps each diff focused.)

- [ ] **Step 5: Verify the file still parses**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks && python3 -c "import ast; ast.parse(open('scripts/videos.py').read())" && echo OK`

Expected: `OK`

- [ ] **Step 6: Verify the new subcommand is registered**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && python3 ../../scripts/videos.py --help 2>&1 | head -25`

Expected: the help output lists `encode-hq` among the available subcommands.

- [ ] **Step 7: Verify `encode-hq` accepts its flags**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && python3 ../../scripts/videos.py encode-hq --help`

Expected: help text mentioning `--force` and `--only`.

- [ ] **Step 8: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add scripts/videos.py
git commit -m "Add encode-hq subcommand for visually-lossless venue masters

encode-hq writes HEVC CRF 16 files into videos/hq/, scaled to long_edge_px
(no upscaling). Auto-creates the public/videos-hq symlink to videos/hq/
on first run. Audio is stream-copied where possible, with a single
auto-retry to AAC 256k if -c:a copy fails on a weird codec. Per-video
profile field still drives behaviour: remux → remux, silent-loop → -an.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 4 — Remove `cmd_link_hq`, `cmd_publish_hq`, and their subparsers from `scripts/videos.py`

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/scripts/videos.py`

- [ ] **Step 1: Delete the `cmd_link_hq` function and its banner comment**

Find and delete this entire block (currently around lines 426–441):

```python
# ---------------------------------------------------------------------------
# link-hq — expose videos/raw/ at public/videos-hq/ for local HQ playback
# ---------------------------------------------------------------------------

def cmd_link_hq(_: argparse.Namespace) -> int:
    HQ_LINK_DIR.parent.mkdir(parents=True, exist_ok=True)
    if HQ_LINK_DIR.is_symlink() or HQ_LINK_DIR.exists():
        if HQ_LINK_DIR.is_symlink():
            HQ_LINK_DIR.unlink()
        else:
            print(f"error: {HQ_LINK_DIR} exists and is not a symlink; remove it manually.",
                  file=sys.stderr)
            return 2
    HQ_LINK_DIR.symlink_to(RAW_DIR.resolve(), target_is_directory=True)
    print(f"linked {HQ_LINK_DIR.relative_to(REPO)} -> {RAW_DIR.relative_to(REPO)}")
    return 0
```

- [ ] **Step 2: Delete the `cmd_publish_hq` function and its banner comment**

Find and delete this entire block (currently around lines 444–506):

```python
# ---------------------------------------------------------------------------
# publish-hq — upload raw masters to a separate GH Release
# ---------------------------------------------------------------------------

def cmd_publish_hq(args: argparse.Namespace) -> int:
    ... (full function body) ...
```

(Delete from the `# -----` banner above the function through the function's closing `return subprocess.call(cmd)`.)

- [ ] **Step 3: Delete the `link-hq` and `publish-hq` subparser registrations**

In `main()`, find and delete:

```python
    p_lhq = sub.add_parser("link-hq", help="symlink videos/raw/ -> public/videos-hq/ for local HQ playback")
    p_lhq.set_defaults(func=cmd_link_hq)

    p_phq = sub.add_parser("publish-hq", help="upload raw masters to the `videos-hq` GH Release")
    p_phq.add_argument("--dry-run", action="store_true")
    p_phq.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_phq.add_argument("--force", action="store_true", help="re-upload even if remote size matches")
    p_phq.set_defaults(func=cmd_publish_hq)
```

- [ ] **Step 4: Verify the file still parses**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks && python3 -c "import ast; ast.parse(open('scripts/videos.py').read())" && echo OK`

Expected: `OK`

- [ ] **Step 5: Verify the removed subcommands are gone**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && python3 ../../scripts/videos.py --help 2>&1`

Expected: help output **does not** list `link-hq` or `publish-hq`. Does list `encode-hq`.

- [ ] **Step 6: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add scripts/videos.py
git commit -m "Remove link-hq and publish-hq subcommands

HQ assets are now local-only and the symlink is created automatically
by encode-hq. There is no remote HQ release any more.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 5 — Update talk's `package.json` scripts

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI/package.json`

- [ ] **Step 1: Replace the `videos:link-hq` and `videos:publish-hq` lines**

Open `talks/2026_04_28_editAI/package.json`. Find this block:

```json
    "videos:check": "python3 ../../scripts/videos.py check",
    "videos:link-hq": "python3 ../../scripts/videos.py link-hq",
    "videos:publish-hq": "python3 ../../scripts/videos.py publish-hq"
```

Replace with:

```json
    "videos:check": "python3 ../../scripts/videos.py check",
    "videos:encode-hq": "python3 ../../scripts/videos.py encode-hq"
```

(Note the trailing comma after `videos:check` is removed because `videos:encode-hq` is the last entry.)

- [ ] **Step 2: Verify JSON is valid**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks && python3 -c "import json; json.load(open('talks/2026_04_28_editAI/package.json'))" && echo OK`

Expected: `OK`

- [ ] **Step 3: Verify pnpm sees the new script**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && pnpm run 2>&1 | grep -E "videos:" || true`

Expected: lines for `videos:sync`, `videos:encode`, `videos:publish`, `videos:check`, `videos:encode-hq`. **No** `videos:link-hq` or `videos:publish-hq`.

- [ ] **Step 4: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add talks/2026_04_28_editAI/package.json
git commit -m "Replace videos:link-hq + videos:publish-hq with videos:encode-hq

Mirrors the script-level rename in scripts/videos.py.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 6 — Rework `VideoPlayer.vue` HQ fallback chain

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/components/VideoPlayer.vue`
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI/.env`

- [ ] **Step 1: Update the `<script setup>` block**

Open `components/VideoPlayer.vue`. Replace lines 5–14 (the env vars and base constants block):

```javascript
// Per-talk config injected via Vite env (see each talk's package.json scripts):
//   VITE_VIDEO_REPO         e.g. "MindaugasSarpis/cern_outreach_talks"
//   VITE_VIDEO_RELEASE      e.g. "videos-2026-04-28-editai"
//   VITE_VIDEO_RELEASE_HQ   e.g. "videos-hq-2026-04-28-editai"
const REPO        = import.meta.env.VITE_VIDEO_REPO       || 'MindaugasSarpis/cern_outreach_talks'
const RELEASE     = import.meta.env.VITE_VIDEO_RELEASE    || 'videos'
const RELEASE_HQ  = import.meta.env.VITE_VIDEO_RELEASE_HQ || 'videos-hq'
const REMOTE_BASE    = `https://github.com/${REPO}/releases/download/${RELEASE}`
const REMOTE_BASE_HQ = `https://github.com/${REPO}/releases/download/${RELEASE_HQ}`
```

with:

```javascript
// Per-talk config injected via Vite env (see each talk's package.json scripts):
//   VITE_VIDEO_REPO     e.g. "MindaugasSarpis/cern_outreach_talks"
//   VITE_VIDEO_RELEASE  e.g. "videos-2026-04-28-editai"
const REPO    = import.meta.env.VITE_VIDEO_REPO    || 'MindaugasSarpis/cern_outreach_talks'
const RELEASE = import.meta.env.VITE_VIDEO_RELEASE || 'videos'
const REMOTE_BASE = `https://github.com/${REPO}/releases/download/${RELEASE}`
```

- [ ] **Step 2: Replace the `hq` prop docstring**

Find the `hq` prop definition (currently around lines 22–25):

```javascript
  // Serve the untouched raw master instead of the web-encoded copy.
  // Local: public/videos-hq/<src> (symlink to videos/raw/ — run `pnpm videos:link-hq`).
  // Deployed: fetched from the `videos-hq` GH Release.
  hq:       { type: Boolean, default: false },
```

Replace with:

```javascript
  // Serve the visually-lossless venue master instead of the web-encoded copy.
  // Local dev: public/videos-hq/<src> (symlink to videos/hq/ — run
  //   `pnpm videos:encode-hq`).
  // Deployed: HQ is local-only, so this falls back transparently to the web
  //   copy (local public/videos/, then GH Release).
  hq:       { type: Boolean, default: false },
```

- [ ] **Step 3: Replace the source-derivation computeds**

Find this block (currently around lines 28–31):

```javascript
const baseDir = computed(() => props.hq ? 'videos-hq' : 'videos')
const remoteBase = computed(() => props.hq ? REMOTE_BASE_HQ : REMOTE_BASE)
const localSrc = computed(() => `${import.meta.env.BASE_URL || '/'}${baseDir.value}/${props.src}`)
const remoteSrc = computed(() => props.fallback || `${remoteBase.value}/${props.src}`)
```

Replace with:

```javascript
// Three-step fallback chain when hq=true: hqLocal → webLocal → webRemote.
// Two-step when hq=false: webLocal → webRemote.
const base = computed(() => import.meta.env.BASE_URL || '/')
const hqLocalSrc = computed(() => `${base.value}videos-hq/${props.src}`)
const webLocalSrc = computed(() => `${base.value}videos/${props.src}`)
const webRemoteSrc = computed(() => props.fallback || `${REMOTE_BASE}/${props.src}`)
const localSrc = computed(() => props.hq ? hqLocalSrc.value : webLocalSrc.value)
```

- [ ] **Step 4: Replace the `onError` handler**

Find this block (currently around lines 47–61):

```javascript
let switching = false
function onError() {
  if (switching || !hasBeenActive.value) return
  if (currentSrc.value === localSrc.value) {
    switching = true
    status.value = 'loading'
    currentSrc.value = remoteSrc.value
    nextTick(() => {
      videoRef.value?.load()
      switching = false
    })
  } else {
    status.value = 'error'
  }
}
```

Replace with:

```javascript
let switching = false
function onError() {
  if (switching || !hasBeenActive.value) return
  // Walk the fallback chain: hqLocal (if hq) → webLocal → webRemote → error.
  const chain = props.hq
    ? [hqLocalSrc.value, webLocalSrc.value, webRemoteSrc.value]
    : [webLocalSrc.value, webRemoteSrc.value]
  const idx = chain.indexOf(currentSrc.value)
  if (idx === -1 || idx === chain.length - 1) {
    status.value = 'error'
    return
  }
  switching = true
  status.value = 'loading'
  currentSrc.value = chain[idx + 1]
  nextTick(() => {
    videoRef.value?.load()
    switching = false
  })
}
```

- [ ] **Step 5: Drop `VITE_VIDEO_RELEASE_HQ` from the talk's `.env`**

Open `talks/2026_04_28_editAI/.env`. Replace:

```
VITE_VIDEO_REPO=MindaugasSarpis/cern_outreach_talks
VITE_VIDEO_RELEASE=videos-2026-04-28-editai
VITE_VIDEO_RELEASE_HQ=videos-hq-2026-04-28-editai
```

with:

```
VITE_VIDEO_REPO=MindaugasSarpis/cern_outreach_talks
VITE_VIDEO_RELEASE=videos-2026-04-28-editai
```

- [ ] **Step 6: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add components/VideoPlayer.vue talks/2026_04_28_editAI/.env
git commit -m "VideoPlayer: 3-step fallback chain for hq prop

When hq=true: try public/videos-hq/, fall back to public/videos/ then to
the web GH Release. HQ assets are now local-only so the deployed deck
silently degrades to the web copy. Drops VITE_VIDEO_RELEASE_HQ.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 7 — Append 14 new entries to the talk's `manifest.toml`

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI/videos/manifest.toml`

- [ ] **Step 1: Append the 14 entries**

Open `talks/2026_04_28_editAI/videos/manifest.toml`. After the existing `Milky_Way_Sim_Audio.mp4` block (current last lines), append:

```toml

[[videos]]
name    = "Cassini_Grand_Finale_No_Vo.mp4"
profile = "silent-loop"
used_in = ["deck"]
notes   = "Cassini Grand Finale, no voiceover; loops silently"

[[videos]]
name    = "CERN-FOOTAGE-2022-042-001.mov"
profile = "standard"
used_in = ["deck"]
notes   = "CERN documentary B-roll (2022)"

[[videos]]
name    = "CERN-FOOTAGE-2026-012-001.mp4"
profile = "standard"
used_in = ["deck"]
notes   = "CERN documentary B-roll (2026)"

[[videos]]
name    = "cmb_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "CMB data chart render"

[[videos]]
name    = "cmb_fit.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "CMB fit chart render"

[[videos]]
name    = "cmb_power_spectrum.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "CMB power-spectrum chart render"

[[videos]]
name    = "g2_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "g-2 data chart render"

[[videos]]
name    = "g2_fit.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "g-2 fit chart render"

[[videos]]
name    = "gaussian.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Gaussian fit demo render"

[[videos]]
name    = "gaussian_highstats.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Gaussian fit demo render (high statistics)"

[[videos]]
name    = "higgs_bkg.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Higgs background-only chart render"

[[videos]]
name    = "higgs_data.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Higgs data chart render"

[[videos]]
name    = "higgs_sigbkg.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Higgs signal+background chart render"

[[videos]]
name    = "higgs_signal.mp4"
profile = "remux"
used_in = ["deck"]
notes   = "Higgs signal-only chart render"
```

- [ ] **Step 2: Verify TOML parses**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks && python3 -c "import tomllib; d=tomllib.load(open('talks/2026_04_28_editAI/videos/manifest.toml','rb')); print(len(d['videos']), 'entries')"`

Expected: `15 entries`

- [ ] **Step 3: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add talks/2026_04_28_editAI/videos/manifest.toml
git commit -m "Add 14 new clips to editAI manifest

3 large CERN/Cassini clips (standard / silent-loop) plus 11 small
chart-render mp4s (remux). All marked used_in=[\"deck\"]; placement is
done in the deck.md edits.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 8 — Sync, encode (web), encode (HQ), and check

**Files:**
- Populates: `talks/2026_04_28_editAI/videos/raw/`, `talks/2026_04_28_editAI/public/videos/`, `talks/2026_04_28_editAI/videos/hq/`
- Creates symlink: `talks/2026_04_28_editAI/public/videos-hq → ../../videos/hq`

- [ ] **Step 1: Activate conda env**

Run: `conda activate outreach_talks` (or open a shell where the `outreach_talks` env is active). Verify with:

```bash
which ffmpeg && which rclone && which pnpm
```

Expected: three paths inside `~/miniconda3/envs/outreach_talks/bin/` (or equivalent).

- [ ] **Step 2: Sync new originals from Drive**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && pnpm videos:sync`

Expected: rclone progress lines, then exit 0. After completion, `videos/raw/` should contain 15 files (1 existing + 14 new).

Verify: `ls /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI/videos/raw/ | wc -l` → `15`

- [ ] **Step 3: Encode the web tier**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && pnpm videos:encode`

Expected: report lines for each video. The two large CERN clips will be re-encoded with `standard` (HEVC CRF 24); chart clips will be remuxed (near-instant). Check exit 0.

If a `WARNING: N file(s) exceed max_size_mb=200` line appears for either CERN clip, edit that entry's `profile` from `standard` to `standard-tight` in `manifest.toml`, then re-run `pnpm videos:encode --force --only <name>`.

- [ ] **Step 4: Encode the HQ tier**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && pnpm videos:encode-hq`

Expected: report lines for each video. The two CERN clips and Milky_Way will go through full HEVC CRF 16 encode (slow); the rest are remuxes. Check exit 0.

Verify the symlink was created: `readlink /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI/public/videos-hq`

Expected output (path will differ slightly): `/Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI/videos/hq`

- [ ] **Step 5: Run consistency check**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && pnpm videos:check`

Expected: lines like `UNUSED MANIFEST: <name>` for the 14 new clips, because they aren't yet referenced in `deck.md`. **This is expected at this point** — Task 9 wires them into the deck and the next `videos:check` should come back clean.

- [ ] **Step 6: No commit at this stage**

These are pipeline outputs, not source — they're gitignored. Move to Task 9.

---

## Task 9 — Replace 10 GIF slides in `deck.md` with VideoPlayer loops

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI/deck.md`

- [ ] **Step 1: Replace the 10 GIF slides**

Open `talks/2026_04_28_editAI/deck.md`. The current file (lines 28–85) contains 10 image-layout slides. Replace each one as follows.

**Replace lines 28–31 (`gaussian.gif`):**

```md
---
layout: image
image: /figures/gaussian.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="gaussian.mp4" loop muted :controls="false" />
```

**Replace lines 33–37 (`gaussian_highstats.gif`):**

```md
---
layout: image
image: /figures/gaussian_highstats.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="gaussian_highstats.mp4" loop muted :controls="false" />
```

**Replace lines 39–43 (`cmb_data.gif`):**

```md
---
layout: image
image: /figures/cmb_data.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="cmb_data.mp4" loop muted :controls="false" />
```

**Replace lines 45–49 (`cmb_fit.gif`):**

```md
---
layout: image
image: /figures/cmb_fit.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="cmb_fit.mp4" loop muted :controls="false" />
```

**Replace lines 51–55 (`cmb_power_spectrum.gif`):**

```md
---
layout: image
image: /figures/cmb_power_spectrum.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="cmb_power_spectrum.mp4" loop muted :controls="false" />
```

**Replace lines 57–61 (`g2_data.gif`):**

```md
---
layout: image
image: /figures/g2_data.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="g2_data.mp4" loop muted :controls="false" />
```

**Replace lines 63–67 (`g2_fit.gif`):**

```md
---
layout: image
image: /figures/g2_fit.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="g2_fit.mp4" loop muted :controls="false" />
```

**Replace lines 69–73 (`higgs_bkg.gif`):**

```md
---
layout: image
image: /figures/higgs_bkg.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="higgs_bkg.mp4" loop muted :controls="false" />
```

**Replace lines 75–79 (`higgs_sigbkg.gif`):**

```md
---
layout: image
image: /figures/higgs_sigbkg.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="higgs_sigbkg.mp4" loop muted :controls="false" />
```

**Replace lines 81–85 (`higgs_data.gif`):**

```md
---
layout: image
image: /figures/higgs_data.gif
backgroundSize: contain
---
```

with:

```md
---

<VideoPlayer src="higgs_data.mp4" loop muted :controls="false" />
```

The Z-boson slides at lines 87–103 (`z_data.gif`, `z_fit3.gif`, `z_alternatives.gif`) **stay as-is** — no mp4 versions exist yet.

- [ ] **Step 2: Verify the deck still parses**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && grep -c '^<VideoPlayer ' deck.md`

Expected: `11` (1 original Milky_Way + 10 new).

- [ ] **Step 3: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add talks/2026_04_28_editAI/deck.md
git commit -m "Replace 10 GIF slides with VideoPlayer loops

The 10 chart slides (gaussian*, cmb_*, g2_*, higgs_bkg/sigbkg/data) now
use the mp4 renders synced from Drive instead of the GIFs in
public/figures/. Configured as silent loops with no controls so they
behave identically to the previous GIFs but render crisply at 2880px.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 10 — Append 4 placeholder slides for unwired clips

**Files:**
- Modify: `/Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI/deck.md`

- [ ] **Step 1: Append the 4 placeholder slides**

At the end of `talks/2026_04_28_editAI/deck.md`, after the current last slide (`z_alternatives.gif`), append exactly:

```md

---

<VideoPlayer src="CERN-FOOTAGE-2022-042-001.mov" />

---

<VideoPlayer src="CERN-FOOTAGE-2026-012-001.mp4" />

---

<VideoPlayer src="Cassini_Grand_Finale_No_Vo.mp4" />

---

<VideoPlayer src="higgs_signal.mp4" loop muted :controls="false" />
```

- [ ] **Step 2: Re-run the consistency check**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && pnpm videos:check`

Expected: `OK: 15 videos, 15 referenced, all consistent.`

If any `UNUSED MANIFEST` lines remain, audit the deck for the missing names and add them.

- [ ] **Step 3: Commit**

```bash
cd /Users/mindaugas/Work/writing/talks/Outreach_Talks
git add talks/2026_04_28_editAI/deck.md
git commit -m "Append 4 placeholder slides for unwired clips

Three large clips (CERN-FOOTAGE-2022-042-001, CERN-FOOTAGE-2026-012-001,
Cassini_Grand_Finale_No_Vo) and the orphan higgs_signal mp4 (no
predecessor GIF in the deck) get bare slides at the end of the deck so
they're visible and pass videos:check. Presenter relocates them later.

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Task 11 — Publish web tier to GitHub Release

**Files:**
- No file edits — invokes `gh release upload`.

- [ ] **Step 1: Confirm `gh` is authenticated**

Run: `gh auth status`

Expected: a "Logged in to github.com" line. If not, run `gh auth login` interactively.

- [ ] **Step 2: Publish**

Run: `cd /Users/mindaugas/Work/writing/talks/Outreach_Talks/talks/2026_04_28_editAI && pnpm videos:publish`

Expected: lines like `= Milky_Way_Sim_Audio.mp4: unchanged ...` for the existing file, and upload progress for each newly encoded one. Final exit 0.

If the release `videos-2026-04-28-editai` does not yet exist, the script will create it automatically.

- [ ] **Step 3: No commit**

This is a publish action, not a source change.

---

## Task 12 — Hand off to user for browser verification

**Files:**
- No edits.

- [ ] **Step 1: Print the verification checklist for the user**

Tell the user (verbatim or paraphrased):

> Pipeline and deck changes are in. Please:
>
> 1. Run `cd talks/2026_04_28_editAI && pnpm dev` and open <http://localhost:3030>.
> 2. Page through to confirm the 10 chart slides (gaussian, cmb_*, g2_*, higgs_bkg/sigbkg/data) loop crisply with no controls.
> 3. Page to the end and confirm the 4 appended slides (CERN-FOOTAGE-2022-042-001.mov, CERN-FOOTAGE-2026-012-001.mp4, Cassini_Grand_Finale_No_Vo.mp4, higgs_signal.mp4) load.
> 4. Optional: change a `<VideoPlayer>` to add the `hq` prop on one slide and verify it serves the larger venue master from `videos-hq/`. Network tab should show a request to `/videos-hq/<name>`.
> 5. Tell me whether to clean up the now-stale `videos-hq-2026-04-28-editai` GitHub Release (created by old `publish-hq` runs). If yes I'll run `gh release delete videos-hq-2026-04-28-editai --yes --cleanup-tag` after your confirmation.

- [ ] **Step 2: Wait for explicit go/no-go from user before deleting the stale GH Release.**

This is a destructive remote operation; do not perform it without confirmation in the same conversation.

---

## Self-Review Notes

- **Spec coverage:** Pipeline shape (Tasks 2–4), encoding profile + audio fallback (Task 3), CLI/scripts (Tasks 3–5), VideoPlayer fallback (Task 6), gitignore for `videos/hq/` (Task 1), manifest additions (Task 7), pipeline run (Task 8), 10 GIF replacements (Task 9), 4 appended placeholders incl. `higgs_signal.mp4` (Task 10), publish web tier (Task 11), user verification + optional GH release cleanup (Task 12). All sections covered.
- **Type/name consistency:** `HQ_DIR`, `HQ_LINK_DIR`, `_encode_one_hq`, `_ensure_hq_symlink`, `cmd_encode_hq`, `hq-visually-lossless` profile name, `hqLocalSrc` / `webLocalSrc` / `webRemoteSrc` Vue computeds — all match across tasks.
- **No placeholders:** Every code/markdown step shows the actual content.
