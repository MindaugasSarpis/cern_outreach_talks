#!/usr/bin/env python3
"""Video asset pipeline: sync, encode, publish, check.

Reads videos/manifest.toml as the source of truth. Raws live in videos/raw/;
encoded web copies are written to public/videos/ and published to a
long-lived GitHub Release (default tag: videos). Raw masters can also be
exposed as public/videos-hq/ (symlink) and published to the `videos-hq`
release for HQ playback.

Subcommands:
    sync     rclone mirror raw files from the configured remote
    encode   ffmpeg raw -> web, per the profile in manifest.toml (idempotent)
    publish  gh release upload web files, clobbering existing assets
    check    sanity check: orphans, missing, over-budget, slide-ref mismatches
"""
from __future__ import annotations

import argparse
import re
import shutil
import subprocess
import sys
import tomllib
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass
from pathlib import Path

# Talk root = current working directory (a talks/<name>/ dir in the monorepo).
# Monorepo root is located by walking up from TALK looking for outreach.toml.
TALK = Path.cwd().resolve()
MANIFEST = TALK / "videos" / "manifest.toml"
RAW_DIR = TALK / "videos" / "raw"
WEB_DIR = TALK / "public" / "videos"
HQ_DIR = TALK / "videos" / "hq"
HQ_LINK_DIR = TALK / "public" / "videos-hq"
SLIDES_DIR = TALK
# Back-compat alias: some logging still references REPO.
REPO = TALK


def _find_monorepo_root(start: Path) -> Path | None:
    for p in [start, *start.parents]:
        if (p / "outreach.toml").exists():
            return p
    return None


def _load_global_defaults() -> dict:
    root = _find_monorepo_root(TALK)
    if not root:
        return {}
    global_cfg = root / "outreach.toml"
    try:
        with global_cfg.open("rb") as f:
            return tomllib.load(f).get("defaults", {})
    except OSError:
        return {}


def _auto_release_tag(prefix: str) -> str:
    slug = TALK.name.lower().replace("_", "-")
    return f"{prefix}-{slug}"

# ---------------------------------------------------------------------------
# Encoding profiles
# ---------------------------------------------------------------------------
#
# Common flags across re-encode profiles:
#   -c:v libx265          HEVC for ~40% size win over H.264 at equal quality
#   -tag:v hvc1           Safari-compatible tag for HEVC-in-MP4
#   -preset slow          encode once, watch many times
#   -pix_fmt yuv420p      universal chroma subsampling
#   -vf scale=...         cap long edge at 1920, keep aspect, even dimensions
#   -movflags +faststart  move MOOV atom to file start so browsers stream
#
# `remux` is special: `-c copy` streams the original bits through losslessly
# and just rewrites the container with +faststart. Zero quality change.

PROFILES: dict[str, list[str]] = {
    "remux": [
        "-c", "copy",
        "-movflags", "+faststart",
    ],
    "standard": [
        "-c:v", "libx265", "-tag:v", "hvc1",
        "-preset", "slow", "-crf", "24",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-c:a", "aac", "-b:a", "128k", "-ac", "2",
        "-movflags", "+faststart",
    ],
    "silent-loop": [
        "-c:v", "libx265", "-tag:v", "hvc1",
        "-preset", "slow", "-crf", "26",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-an",
        "-movflags", "+faststart",
    ],
    "standard-tight": [
        "-c:v", "libx265", "-tag:v", "hvc1",
        "-preset", "slow", "-crf", "27",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-c:a", "aac", "-b:a", "128k", "-ac", "2",
        "-movflags", "+faststart",
    ],
    "high-motion": [
        "-c:v", "libx265", "-tag:v", "hvc1",
        "-preset", "slow", "-crf", "22",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-c:a", "aac", "-b:a", "192k", "-ac", "2",
        "-movflags", "+faststart",
    ],
    "hq-visually-lossless": [
        "-c:v", "libx265", "-tag:v", "hvc1",
        "-preset", "slow", "-crf", "16",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-c:a", "copy",
        "-movflags", "+faststart",
    ],
}


@dataclass
class VideoEntry:
    name: str
    profile: str
    used_in: list[str]
    notes: str = ""
    long_edge_px: int | None = None  # override for [defaults].long_edge_px


def load_manifest() -> tuple[dict, list[VideoEntry]]:
    with MANIFEST.open("rb") as f:
        data = tomllib.load(f)
    # Merge: talk [defaults] wins over global outreach.toml [defaults].
    defaults = {**_load_global_defaults(), **data.get("defaults", {})}
    defaults.setdefault("release_tag", _auto_release_tag("videos"))
    defaults.setdefault("release_tag_hq", _auto_release_tag("videos-hq"))
    videos = [
        VideoEntry(
            name=v["name"],
            profile=v.get("profile", "remux"),
            used_in=v.get("used_in", []),
            notes=v.get("notes", ""),
            long_edge_px=v.get("long_edge_px"),
        )
        for v in data.get("videos", [])
    ]
    return defaults, videos


def human_size(n: int) -> str:
    for unit in ("B", "KB", "MB", "GB"):
        if n < 1024 or unit == "GB":
            return f"{n:.1f} {unit}" if unit != "B" else f"{n} B"
        n /= 1024  # type: ignore[assignment]
    return f"{n:.1f} GB"


# ---------------------------------------------------------------------------
# sync — pull raw files from Google Drive via rclone
# ---------------------------------------------------------------------------

def cmd_sync(args: argparse.Namespace) -> int:
    defaults, _ = load_manifest()
    remote = defaults.get("source_remote")
    if not remote:
        print("error: [defaults].source_remote not set in manifest.toml", file=sys.stderr)
        return 2
    if not shutil.which("rclone"):
        print("error: rclone not installed. brew install rclone", file=sys.stderr)
        return 2
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    cmd = ["rclone", "sync", remote, str(RAW_DIR), "--progress", "--transfers", "4"]
    if args.dry_run:
        cmd.append("--dry-run")
    print(" ".join(cmd))
    return subprocess.call(cmd)


# ---------------------------------------------------------------------------
# encode — ffmpeg raw -> web per manifest profile
# ---------------------------------------------------------------------------

def _profile_args(profile: str, long_edge: int) -> list[str]:
    return [a.replace("{LONG_EDGE}", str(long_edge)) for a in PROFILES[profile]]


def _encode_one(entry: VideoEntry, force: bool, default_long_edge: int) -> tuple[VideoEntry, str, int, int]:
    """Returns (entry, status, raw_size, web_size). status in {skipped, ok, missing, failed}."""
    raw = RAW_DIR / entry.name
    web = WEB_DIR / entry.name
    if not raw.exists():
        return entry, "missing", 0, 0
    raw_size = raw.stat().st_size
    if web.exists() and not force and web.stat().st_mtime >= raw.stat().st_mtime:
        return entry, "skipped", raw_size, web.stat().st_size

    if entry.profile not in PROFILES:
        print(f"  ! unknown profile {entry.profile!r} for {entry.name}", file=sys.stderr)
        return entry, "failed", raw_size, 0

    long_edge = entry.long_edge_px or default_long_edge
    tmp = web.with_name(f"{web.stem}.partial{web.suffix}")
    cmd = [
        "ffmpeg", "-y", "-hide_banner", "-nostdin", "-loglevel", "error",
        "-i", str(raw),
        *_profile_args(entry.profile, long_edge),
        str(tmp),
    ]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        tmp.unlink(missing_ok=True)
        print(f"  ! ffmpeg failed for {entry.name}: {e}", file=sys.stderr)
        return entry, "failed", raw_size, 0
    tmp.replace(web)
    return entry, "ok", raw_size, web.stat().st_size


def cmd_encode(args: argparse.Namespace) -> int:
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
    WEB_DIR.mkdir(parents=True, exist_ok=True)

    max_mb = defaults.get("max_size_mb", 200)
    default_long_edge = int(defaults.get("long_edge_px", 1920))
    print(f"Encoding {len(videos)} video(s). raw -> {WEB_DIR.relative_to(REPO)} (default long edge: {default_long_edge}px)")

    # Remux jobs are IO-bound and cheap — run them in parallel.
    # Re-encode jobs are CPU-bound — run them one at a time to avoid thrashing.
    remuxes = [v for v in videos if v.profile == "remux"]
    encodes = [v for v in videos if v.profile != "remux"]

    total_raw = 0
    total_web = 0
    failed: list[str] = []
    over_budget: list[tuple[str, int]] = []

    def report(entry, status, raw_size, web_size):
        nonlocal total_raw, total_web
        total_raw += raw_size
        total_web += web_size
        if status == "missing":
            print(f"  - {entry.name}: MISSING in raw/")
            failed.append(entry.name)
        elif status == "failed":
            print(f"  x {entry.name}: FAILED")
            failed.append(entry.name)
        elif status == "skipped":
            print(f"  = {entry.name}: skipped (up to date, {human_size(web_size)})")
        else:
            delta = raw_size - web_size
            sign = "-" if delta >= 0 else "+"
            pct = (abs(delta) / raw_size * 100) if raw_size else 0
            print(
                f"  + {entry.name}: {entry.profile} "
                f"[{human_size(raw_size)} -> {human_size(web_size)}, {sign}{pct:.0f}%]"
            )
            if web_size > max_mb * 1024 * 1024:
                over_budget.append((entry.name, web_size))

    if remuxes:
        with ThreadPoolExecutor(max_workers=4) as pool:
            futures = [pool.submit(_encode_one, v, args.force, default_long_edge) for v in remuxes]
            for fut in as_completed(futures):
                report(*fut.result())

    for v in encodes:
        report(*_encode_one(v, args.force, default_long_edge))

    print()
    print(f"Total raw: {human_size(total_raw)}")
    print(f"Total web: {human_size(total_web)}")
    if total_raw:
        print(f"Saved:     {human_size(total_raw - total_web)} ({(1 - total_web/total_raw)*100:.0f}%)")
    if over_budget:
        print()
        print(f"WARNING: {len(over_budget)} file(s) exceed max_size_mb={max_mb}:")
        for name, size in over_budget:
            print(f"  {name}: {human_size(size)}")
    if failed:
        print()
        print(f"FAILED: {len(failed)} file(s): {', '.join(failed)}")
        return 1
    return 0


# ---------------------------------------------------------------------------
# publish — upload encoded files to GitHub Release
# ---------------------------------------------------------------------------

def cmd_publish(args: argparse.Namespace) -> int:
    defaults, videos = load_manifest()
    tag = defaults.get("release_tag", "videos")
    if not shutil.which("gh"):
        print("error: gh CLI not installed. brew install gh", file=sys.stderr)
        return 2

    if args.only:
        wanted = set(args.only)
        videos = [v for v in videos if v.name in wanted]
        if not videos:
            print(f"error: no manifest entries match {args.only}", file=sys.stderr)
            return 2

    # Ensure release exists.
    existing = subprocess.run(
        ["gh", "release", "view", tag], capture_output=True, text=True
    )
    if existing.returncode != 0:
        print(f"Creating release {tag!r}...")
        subprocess.run(
            ["gh", "release", "create", tag,
             "--title", "Video assets",
             "--notes", "Bulk video assets for slide decks. Managed by scripts/videos.py."],
            check=True,
        )

    # Map remote asset -> size (bytes), so we can skip unchanged files.
    remote_sizes: dict[str, int] = {}
    if not args.force:
        listing = subprocess.run(
            ["gh", "release", "view", tag, "--json", "assets"],
            capture_output=True, text=True,
        )
        if listing.returncode == 0:
            import json
            try:
                for a in json.loads(listing.stdout).get("assets", []):
                    remote_sizes[a["name"]] = a.get("size", -1)
            except (ValueError, KeyError):
                pass

    files = []
    for v in videos:
        web = WEB_DIR / v.name
        if not web.exists():
            print(f"  ! skip {v.name}: not encoded yet")
            continue
        local_size = web.stat().st_size
        if not args.force and remote_sizes.get(v.name) == local_size:
            print(f"  = {v.name}: unchanged ({human_size(local_size)}), skipping")
            continue
        files.append(str(web))

    if not files:
        print("Nothing to upload.")
        return 0

    print(f"Uploading {len(files)} file(s) to release {tag!r}...")
    cmd = ["gh", "release", "upload", tag, *files, "--clobber"]
    if args.dry_run:
        print(" ".join(cmd))
        return 0
    return subprocess.call(cmd)


# ---------------------------------------------------------------------------
# check — sanity: orphans, missing, slide refs
# ---------------------------------------------------------------------------

VIDEO_REF_RE = re.compile(r'VideoPlayer\s+src="([^"]+)"')


def _slide_references() -> dict[str, list[str]]:
    """Walk slides and return {filename: [slide_files_that_reference_it]}."""
    refs: dict[str, list[str]] = {}
    for md in SLIDES_DIR.rglob("*.md"):
        try:
            text = md.read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        for m in VIDEO_REF_RE.finditer(text):
            refs.setdefault(m.group(1), []).append(md.name)
    return refs


def cmd_check(_: argparse.Namespace) -> int:
    _, videos = load_manifest()
    manifest_names = {v.name for v in videos}
    raw_files = {p.name for p in RAW_DIR.glob("*") if p.is_file() and not p.name.startswith(".")}
    web_files = {p.name for p in WEB_DIR.glob("*") if p.is_file() and not p.name.startswith(".")}
    refs = _slide_references()

    problems = 0

    # Manifest entries that are missing a raw.
    for name in sorted(manifest_names - raw_files):
        print(f"  MISSING RAW:      {name}")
        problems += 1

    # Raw files not in the manifest.
    for name in sorted(raw_files - manifest_names):
        print(f"  ORPHAN RAW:       {name}")
        problems += 1

    # Web files not in the manifest (stale encodes).
    for name in sorted(web_files - manifest_names):
        print(f"  ORPHAN WEB:       {name}")
        problems += 1

    # Slide references with no manifest entry.
    for name in sorted(set(refs) - manifest_names):
        where = ", ".join(sorted(set(refs[name])))
        print(f"  UNKNOWN REF:      {name}  (in {where})")
        problems += 1

    # Manifest entries referenced nowhere.
    for v in videos:
        if v.name not in refs:
            print(f"  UNUSED MANIFEST:  {v.name}")
            problems += 1

    if problems == 0:
        print(f"OK: {len(manifest_names)} videos, {len(refs)} referenced, all consistent.")
        return 0
    print(f"\n{problems} issue(s) found.")
    return 1


# ---------------------------------------------------------------------------
# encode-hq — ffmpeg raw -> videos/hq/ (visually-lossless venue masters)
# ---------------------------------------------------------------------------

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
    result = subprocess.run(cmd, capture_output=True)
    if result.returncode != 0:
        tmp.unlink(missing_ok=True)
        stderr_text = result.stderr.decode("utf-8", errors="replace")
        codec_failure = (
            "-c:a" in ff_args
            and "copy" in ff_args
            and ("codec" in stderr_text.lower() or "audio" in stderr_text.lower())
        )
        if not codec_failure:
            sys.stderr.write(stderr_text)
            print(f"  ! ffmpeg HQ failed for {entry.name}", file=sys.stderr)
            return entry, "failed", raw_size, 0
        # Audio-codec mismatch with -c:a copy. Retry once with AAC.
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
        retry_result = subprocess.run(cmd_retry, capture_output=True)
        if retry_result.returncode != 0:
            tmp.unlink(missing_ok=True)
            sys.stderr.write(retry_result.stderr.decode("utf-8", errors="replace"))
            print(f"  ! ffmpeg HQ failed for {entry.name} (AAC retry also failed)", file=sys.stderr)
            return entry, "failed", raw_size, 0
    tmp.replace(hq)
    return entry, "ok", raw_size, hq.stat().st_size


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
    # Note: no over_budget warning here. HQ files are local-only and expected
    # to be large; the max_size_mb cap only applies to the web tier.
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


# ---------------------------------------------------------------------------
# publish-hq — upload raw masters to a separate GH Release
# ---------------------------------------------------------------------------

def cmd_publish_hq(args: argparse.Namespace) -> int:
    defaults, videos = load_manifest()
    tag = defaults.get("release_tag_hq", "videos-hq")
    if not shutil.which("gh"):
        print("error: gh CLI not installed. brew install gh", file=sys.stderr)
        return 2

    if args.only:
        wanted = set(args.only)
        videos = [v for v in videos if v.name in wanted]

    existing = subprocess.run(
        ["gh", "release", "view", tag], capture_output=True, text=True
    )
    if existing.returncode != 0:
        print(f"Creating release {tag!r}...")
        subprocess.run(
            ["gh", "release", "create", tag,
             "--title", "HQ raw video assets",
             "--notes", "Unencoded raw masters. Managed by scripts/videos.py publish-hq."],
            check=True,
        )

    remote_sizes: dict[str, int] = {}
    if not args.force:
        listing = subprocess.run(
            ["gh", "release", "view", tag, "--json", "assets"],
            capture_output=True, text=True,
        )
        if listing.returncode == 0:
            import json
            try:
                for a in json.loads(listing.stdout).get("assets", []):
                    remote_sizes[a["name"]] = a.get("size", -1)
            except (ValueError, KeyError):
                pass

    files = []
    for v in videos:
        raw = RAW_DIR / v.name
        if not raw.exists():
            print(f"  ! skip {v.name}: missing in videos/raw/")
            continue
        size = raw.stat().st_size
        if not args.force and remote_sizes.get(v.name) == size:
            print(f"  = {v.name}: unchanged ({human_size(size)})")
            continue
        files.append(str(raw))

    if not files:
        print("Nothing to upload.")
        return 0

    print(f"Uploading {len(files)} raw master(s) to release {tag!r}...")
    cmd = ["gh", "release", "upload", tag, *files, "--clobber"]
    if args.dry_run:
        print(" ".join(cmd))
        return 0
    return subprocess.call(cmd)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_sync = sub.add_parser("sync", help="rclone raw files from Drive")
    p_sync.add_argument("--dry-run", action="store_true")
    p_sync.set_defaults(func=cmd_sync)

    p_enc = sub.add_parser("encode", help="ffmpeg raw -> web")
    p_enc.add_argument("--force", action="store_true", help="re-encode even if up to date")
    p_enc.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_enc.set_defaults(func=cmd_encode)

    p_pub = sub.add_parser("publish", help="upload web files to GH Release")
    p_pub.add_argument("--dry-run", action="store_true")
    p_pub.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_pub.add_argument("--force", action="store_true", help="re-upload even if remote size matches local")
    p_pub.set_defaults(func=cmd_publish)

    p_chk = sub.add_parser("check", help="sanity-check manifest vs raw/web/slides")
    p_chk.set_defaults(func=cmd_check)

    p_lhq = sub.add_parser("link-hq", help="symlink videos/raw/ -> public/videos-hq/ for local HQ playback")
    p_lhq.set_defaults(func=cmd_link_hq)

    p_ehq = sub.add_parser("encode-hq", help="ffmpeg raw -> videos/hq/ (visually-lossless venue masters, local-only)")
    p_ehq.add_argument("--force", action="store_true", help="re-encode even if up to date")
    p_ehq.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_ehq.set_defaults(func=cmd_encode_hq)

    p_phq = sub.add_parser("publish-hq", help="upload raw masters to the `videos-hq` GH Release")
    p_phq.add_argument("--dry-run", action="store_true")
    p_phq.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_phq.add_argument("--force", action="store_true", help="re-upload even if remote size matches")
    p_phq.set_defaults(func=cmd_publish_hq)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
