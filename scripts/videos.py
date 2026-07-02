#!/usr/bin/env python3
"""Video asset pipeline: sync, encode, publish, check, encode-hq, publish-hq.

Reads videos/manifest.toml as the source of truth. Raws live in videos/raw/;
encoded web copies are written to public/videos/ and published to a
long-lived GitHub Release (default tag: videos-<talk>). A separate
visually-lossless HQ tier is encoded into videos/hq/ for venue playback
and can be published to a parallel release (default tag: videos-hq-<talk>)
so any machine can `gh release download` the venue masters instead of
re-encoding them.

A monorepo-wide shared registry at /videos/shared.toml declares clips
that live in a shared GH Release and are inherited by talks at runtime
(via VideoPlayer's fallback chain). Per-talk commands (sync, encode,
publish, pull) operate ONLY on talk-owned clips; shared clips are not
downloaded or re-encoded when working on a specific talk. The `check`
command treats slide refs satisfied by the shared registry as OK.

Subcommands:
    sync           rclone mirror raw files from the configured remote
    encode         ffmpeg raw -> public/videos/ (web tier, idempotent)
    publish        gh release upload web files, clobbering existing assets
    pull           gh release download web files -> public/videos/
    check          sanity check: orphans, missing, over-budget, slide-ref mismatches
    encode-hq      ffmpeg raw -> videos/hq/ (visually-lossless venue masters)
    publish-hq     gh release upload HQ files to the parallel release
    pull-hq        gh release download HQ files -> videos/hq/
    shared-check   sanity-check the shared registry (run from repo root)
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
# TWO CODECS BY TIER — this is deliberate:
#   WEB tier (standard / standard-tight / silent-loop / high-motion) is
#   encoded H.264 (libx264). The web tier is the fallback that plays in
#   arbitrary DEPLOYED browsers (GH Pages, remote viewers). HEVC does NOT
#   hardware-decode there — Firefox has no HEVC at all, and Chrome only where
#   the OS ships a decoder — so an HEVC "web" clip stalls or fails. H.264 High
#   is hardware-decoded on essentially every device made in the last decade.
#   Each web profile also carries a -maxrate/-bufsize ceiling so a high-motion
#   clip can't balloon past what a normal connection streams, and scales to
#   web_long_edge_px (default 1920) — the venue width is an HQ concern.
#
#   HQ tier (`hq-visually-lossless`) stays HEVC (libx265): it is played
#   LOCALLY at the venue on a machine that hardware-decodes HEVC (macOS), so
#   the ~40% HEVC size win at equal quality is pure upside there.
#
# Common flags:
#   -c:v libx264 -profile:v high   web: universal hardware decode
#   -maxrate/-bufsize              web: cap peak bitrate so it streams
#   -c:v libx265 -tag:v hvc1       HQ: HEVC with Safari-compatible tag
#   -preset slow                   encode once, watch many times
#   -pix_fmt yuv420p               universal chroma subsampling
#   -vf scale=...                  cap long edge, keep aspect, even dimensions
#   -movflags +faststart           move MOOV atom to file start so it streams
#
# `remux` is special: `-c copy` streams the original bits through losslessly
# and just rewrites the container with +faststart. Zero quality change — use
# it only when the source is ALREADY a web-friendly H.264 (or low-bitrate
# HEVC that you accept won't play in Firefox).

PROFILES: dict[str, list[str]] = {
    "remux": [
        "-c", "copy",
        "-movflags", "+faststart",
    ],
    "standard": [
        "-c:v", "libx264", "-profile:v", "high",
        "-preset", "slow", "-crf", "23",
        "-maxrate", "6M", "-bufsize", "12M",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-c:a", "aac", "-b:a", "128k", "-ac", "2",
        "-movflags", "+faststart",
    ],
    "silent-loop": [
        "-c:v", "libx264", "-profile:v", "high",
        "-preset", "slow", "-crf", "24",
        "-maxrate", "5M", "-bufsize", "10M",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-an",
        "-movflags", "+faststart",
    ],
    "standard-tight": [
        "-c:v", "libx264", "-profile:v", "high",
        "-preset", "slow", "-crf", "26",
        "-maxrate", "3500k", "-bufsize", "7M",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-c:a", "aac", "-b:a", "128k", "-ac", "2",
        "-movflags", "+faststart",
    ],
    "high-motion": [
        "-c:v", "libx264", "-profile:v", "high",
        "-preset", "slow", "-crf", "22",
        "-maxrate", "8M", "-bufsize", "16M",
        "-pix_fmt", "yuv420p",
        "-vf", "scale='min({LONG_EDGE},iw)':-2",
        "-c:a", "aac", "-b:a", "192k", "-ac", "2",
        "-movflags", "+faststart",
    ],
    "hq-visually-lossless": [
        "-c:v", "libx265", "-tag:v", "hvc1",
        "-preset", "slow", "-crf", "16", "-tune", "grain",
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
    # Venue/HQ width override for [defaults].long_edge_px. Drives the HQ tier
    # and is CAPPED to web_long_edge_px for the web tier (a venue clip encoded
    # at 3840 still ships a 1920 web copy).
    long_edge_px: int | None = None
    # Override HQ CRF per-video. hq-visually-lossless uses CRF 16 by default
    # (transparent at viewing distance); lower for more detail, higher for
    # smaller files. Useful for sources whose raw bitrate is too high for
    # browser decode, where a CRF 20 re-encode plays smoothly without visible
    # quality loss for the audience.
    hq_crf: int | None = None
    # When true, HQ tier hard-links the raw file instead of re-encoding and
    # pull-hq sources this file from [defaults].source_remote rather than the
    # parallel GH Release. Use for files whose raw is already a pixel-perfect
    # master and/or whose encoded HQ would exceed the 2 GB release asset cap.
    hq_from_raw: bool = False


def _videos_from_data(data: dict) -> list[VideoEntry]:
    return [
        VideoEntry(
            name=v["name"],
            profile=v.get("profile", "remux"),
            used_in=v.get("used_in", []),
            notes=v.get("notes", ""),
            long_edge_px=v.get("long_edge_px"),
            hq_crf=v.get("hq_crf"),
            hq_from_raw=v.get("hq_from_raw", False),
        )
        for v in data.get("videos", [])
    ]


def load_manifest() -> tuple[dict, list[VideoEntry]]:
    with MANIFEST.open("rb") as f:
        data = tomllib.load(f)
    # Merge: talk [defaults] wins over global outreach.toml [defaults].
    defaults = {**_load_global_defaults(), **data.get("defaults", {})}
    defaults.setdefault("release_tag", _auto_release_tag("videos"))
    return defaults, _videos_from_data(data)


def load_shared_manifest() -> tuple[dict, list[VideoEntry]]:
    """Load /videos/shared.toml from the monorepo root.

    Returns ({}, []) if the file is absent. The shared registry declares
    clips inherited from a shared GH Release; talks reference them in
    decks but don't keep local raws/encodes.
    """
    root = _find_monorepo_root(TALK)
    if not root:
        return {}, []
    shared = root / "videos" / "shared.toml"
    if not shared.exists():
        return {}, []
    with shared.open("rb") as f:
        data = tomllib.load(f)
    defaults = {**_load_global_defaults(), **data.get("defaults", {})}
    return defaults, _videos_from_data(data)


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

    # default_long_edge is the WEB cap (web_long_edge_px, typically 1920). A
    # per-video long_edge_px is a venue/HQ override — honor it only when it
    # would make the web copy SMALLER, never larger than the web cap.
    long_edge = min(entry.long_edge_px or default_long_edge, default_long_edge)
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


def _run_encode_batch(
    videos: list[VideoEntry],
    worker,
    force: bool,
    default_long_edge: int,
    label: str,
    max_mb: int | None = None,
) -> int:
    """Shared driver for cmd_encode and cmd_encode_hq.

    Splits remux (parallel) from re-encode (serial) jobs, prints per-video
    reports, and returns 0 on success / 1 on any failure.
    """
    remuxes = [v for v in videos if v.profile == "remux"]
    encodes = [v for v in videos if v.profile != "remux"]

    total_raw = 0
    total_out = 0
    failed: list[str] = []
    over_budget: list[tuple[str, int]] = []

    def report(entry, status, raw_size, out_size):
        nonlocal total_raw, total_out
        total_raw += raw_size
        total_out += out_size
        if status == "missing":
            print(f"  - {entry.name}: MISSING in raw/")
            failed.append(entry.name)
        elif status == "failed":
            print(f"  x {entry.name}: FAILED")
            failed.append(entry.name)
        elif status == "skipped":
            print(f"  = {entry.name}: skipped (up to date, {human_size(out_size)})")
        else:
            delta = raw_size - out_size
            sign = "-" if delta >= 0 else "+"
            pct = (abs(delta) / raw_size * 100) if raw_size else 0
            print(
                f"  + {entry.name}: {label} "
                f"[{human_size(raw_size)} -> {human_size(out_size)}, {sign}{pct:.0f}%]"
            )
            if max_mb is not None and out_size > max_mb * 1024 * 1024:
                over_budget.append((entry.name, out_size))

    if remuxes:
        with ThreadPoolExecutor(max_workers=4) as pool:
            futures = [pool.submit(worker, v, force, default_long_edge) for v in remuxes]
            for fut in as_completed(futures):
                report(*fut.result())

    for v in encodes:
        report(*worker(v, force, default_long_edge))

    print()
    print(f"Total raw:    {human_size(total_raw)}")
    print(f"Total {label + ':':8s} {human_size(total_out)}")
    if total_raw:
        print(f"Saved:        {human_size(total_raw - total_out)} ({(1 - total_out/total_raw)*100:.0f}%)")
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
    # The web tier caps at web_long_edge_px (default 1920), NOT the venue
    # long_edge_px — the web copy is a browser fallback, not the venue master,
    # so it never needs the venue's native width. long_edge_px drives the HQ
    # tier only (see cmd_encode_hq).
    web_long_edge = int(defaults.get("web_long_edge_px", 1920))
    max_mb = defaults.get("max_size_mb", 200)
    print(f"Encoding {len(videos)} video(s). raw -> {WEB_DIR.relative_to(TALK)} (web long edge: {web_long_edge}px)")
    return _run_encode_batch(videos, _encode_one, args.force, web_long_edge, label="web", max_mb=max_mb)


# ---------------------------------------------------------------------------
# publish — upload encoded files to GitHub Release
# ---------------------------------------------------------------------------

def _remote_asset_sizes(tag: str) -> dict[str, int] | None:
    """Return {asset_name: size_bytes} for a release, or None if not found."""
    listing = subprocess.run(
        ["gh", "release", "view", tag, "--json", "assets"],
        capture_output=True, text=True,
    )
    if listing.returncode != 0:
        return None
    import json
    try:
        return {a["name"]: a.get("size", -1) for a in json.loads(listing.stdout).get("assets", [])}
    except (ValueError, KeyError):
        return {}


def _publish_tier(
    videos: list[VideoEntry],
    src_dir: Path,
    tag: str,
    release_title: str,
    release_notes: str,
    force: bool,
    dry_run: bool,
    prune: bool = False,
    protected: set[str] | None = None,
) -> int:
    """Upload encoded files to a GH Release.

    `protected` is a set of asset names that --prune must NEVER delete.
    Used when a talk's release tag coincides with the shared release tag —
    pruning by talk-manifest membership alone would erase shared assets that
    other talks depend on.
    """
    protected = protected or set()
    if not shutil.which("gh"):
        print("error: gh CLI not installed. brew install gh", file=sys.stderr)
        return 2

    # Ensure release exists.
    existing = subprocess.run(
        ["gh", "release", "view", tag], capture_output=True, text=True
    )
    if existing.returncode != 0:
        print(f"Creating release {tag!r}...")
        subprocess.run(
            ["gh", "release", "create", tag,
             "--title", release_title,
             "--notes", release_notes],
            check=True,
        )

    # Map remote asset -> size (bytes) for skip + prune.
    remote_sizes = _remote_asset_sizes(tag) or {}

    files = []
    for v in videos:
        src = src_dir / v.name
        if not src.exists():
            print(f"  ! skip {v.name}: not encoded yet")
            continue
        local_size = src.stat().st_size
        if not force and remote_sizes.get(v.name) == local_size:
            print(f"  = {v.name}: unchanged ({human_size(local_size)}), skipping")
            continue
        files.append(str(src))

    uploaded = 0
    if files:
        print(f"Uploading {len(files)} file(s) to release {tag!r}...")
        cmd = ["gh", "release", "upload", tag, *files, "--clobber"]
        if dry_run:
            print(" ".join(cmd))
        else:
            rc = subprocess.call(cmd)
            if rc != 0:
                return rc
        uploaded = len(files)

    if prune:
        wanted = {v.name for v in videos}
        orphans = [n for n in remote_sizes if n not in wanted and n not in protected]
        protected_skipped = sorted(
            n for n in remote_sizes if n not in wanted and n in protected
        )
        for name in protected_skipped:
            print(f"  ~ {name}: protected (in shared registry), skipping prune")
        for name in orphans:
            print(f"  - {name}: deleting from release {tag!r} (not in manifest)")
            if dry_run:
                continue
            rc = subprocess.call(
                ["gh", "release", "delete-asset", tag, name, "--yes"]
            )
            if rc != 0:
                return rc

    if not files and not prune:
        print("Nothing to upload.")
    return 0


def _pull_tier(
    videos: list[VideoEntry],
    dst_dir: Path,
    tag: str,
    force: bool,
    dry_run: bool,
    prune: bool = False,
    protected: set[str] | None = None,
) -> int:
    """Download release files into a local dir.

    `protected` is a set of filenames that --prune must NEVER delete locally
    (used to keep shared-registry overlap files in place when the talk's
    public/videos/ tree was populated for a previous architecture).
    """
    protected = protected or set()
    if not shutil.which("gh"):
        print("error: gh CLI not installed. brew install gh", file=sys.stderr)
        return 2

    dst_dir.mkdir(parents=True, exist_ok=True)
    remote_sizes = _remote_asset_sizes(tag)
    if remote_sizes is None:
        print(f"error: release {tag!r} not found", file=sys.stderr)
        return 2

    wanted = {v.name for v in videos}
    to_fetch: list[str] = []
    for v in videos:
        if v.name not in remote_sizes:
            print(f"  ! {v.name}: not in release {tag!r}")
            continue
        dst = dst_dir / v.name
        if not force and dst.exists() and dst.stat().st_size == remote_sizes[v.name]:
            print(f"  = {v.name}: up to date ({human_size(dst.stat().st_size)})")
            continue
        to_fetch.append(v.name)

    for name in to_fetch:
        print(f"  + {name}: downloading ({human_size(remote_sizes[name])})")
        if dry_run:
            continue
        rc = subprocess.call([
            "gh", "release", "download", tag,
            "--pattern", name, "--dir", str(dst_dir), "--clobber",
        ])
        if rc != 0:
            return rc

    if prune:
        for existing in dst_dir.iterdir():
            if not existing.is_file():
                continue
            if existing.name in wanted:
                continue
            if existing.name.endswith(".partial.mp4") or existing.name.endswith(".partial.mov"):
                continue
            if existing.name in protected:
                print(f"  ~ {existing.name}: protected (in shared registry), skipping prune")
                continue
            print(f"  - {existing.name}: pruning local (not in manifest)")
            if not dry_run:
                existing.unlink()

    return 0


def _filter_videos(videos: list[VideoEntry], only: list[str] | None) -> list[VideoEntry] | int:
    if not only:
        return videos
    wanted = set(only)
    filtered = [v for v in videos if v.name in wanted]
    if not filtered:
        print(f"error: no manifest entries match {only}", file=sys.stderr)
        return 2
    return filtered


def _shared_protect(tier_tag: str, *, hq: bool) -> set[str]:
    """Names that prune must skip when this release tag overlaps with shared.

    Returns a set if the talk's release tag matches the shared release tag for
    the given tier, otherwise empty (talk-only release; nothing to protect).
    """
    shared_defaults, shared_videos = load_shared_manifest()
    if not shared_videos:
        return set()
    key = "release_tag_hq" if hq else "release_tag"
    shared_tag = shared_defaults.get(key)
    if not shared_tag or shared_tag != tier_tag:
        return set()
    return {v.name for v in shared_videos}


def cmd_publish(args: argparse.Namespace) -> int:
    defaults, videos = load_manifest()
    filtered = _filter_videos(videos, args.only)
    if isinstance(filtered, int):
        return filtered
    tag = defaults.get("release_tag", "videos")
    return _publish_tier(
        filtered, WEB_DIR,
        tag=tag,
        release_title="Video assets",
        release_notes="Bulk video assets for slide decks. Managed by scripts/videos.py.",
        force=args.force, dry_run=args.dry_run, prune=args.prune,
        protected=_shared_protect(tag, hq=False),
    )


def cmd_publish_hq(args: argparse.Namespace) -> int:
    defaults, videos = load_manifest()
    filtered = _filter_videos(videos, args.only)
    if isinstance(filtered, int):
        return filtered
    # Entries flagged hq_from_raw live on the raws gdrive remote, not on the
    # release. Skip them here; pull-hq rclones them from source_remote.
    to_publish = [v for v in filtered if not v.hq_from_raw]
    skipped = [v.name for v in filtered if v.hq_from_raw]
    for name in skipped:
        print(f"  ~ {name}: hq_from_raw — served from source_remote, not the release")
    tag = defaults.get("release_tag_hq", _auto_release_tag("videos-hq"))
    return _publish_tier(
        to_publish, HQ_DIR,
        tag=tag,
        release_title="Video assets (HQ)",
        release_notes="Visually-lossless venue masters. Run scripts/videos.py publish-hq to update.",
        force=args.force, dry_run=args.dry_run, prune=args.prune,
        protected=_shared_protect(tag, hq=True),
    )


def cmd_pull(args: argparse.Namespace) -> int:
    defaults, videos = load_manifest()
    filtered = _filter_videos(videos, args.only)
    if isinstance(filtered, int):
        return filtered
    tag = defaults.get("release_tag", _auto_release_tag("videos"))
    return _pull_tier(
        filtered, WEB_DIR,
        tag=tag,
        force=args.force, dry_run=args.dry_run, prune=args.prune,
        protected=_shared_protect(tag, hq=False),
    )


def cmd_pull_hq(args: argparse.Namespace) -> int:
    defaults, videos = load_manifest()
    filtered = _filter_videos(videos, args.only)
    if isinstance(filtered, int):
        return filtered
    _ensure_hq_symlink()

    # hq_from_raw entries come from source_remote via rclone; the rest come
    # from the parallel GH Release.
    from_raw = [v for v in filtered if v.hq_from_raw]
    from_release = [v for v in filtered if not v.hq_from_raw]

    rc = _pull_tier(
        from_release, HQ_DIR,
        tag=defaults.get("release_tag_hq", _auto_release_tag("videos-hq")),
        force=args.force, dry_run=args.dry_run,
        # Defer prune to after the rclone pass so hq_from_raw files aren't
        # flagged as orphans by the release-tier pull.
        prune=False,
    )
    if rc != 0:
        return rc

    if from_raw:
        source_remote = defaults.get("source_remote")
        if not source_remote:
            print("error: hq_from_raw entries present but [defaults].source_remote not set", file=sys.stderr)
            return 2
        if not shutil.which("rclone"):
            print("error: rclone not installed. brew install rclone", file=sys.stderr)
            return 2
        for v in from_raw:
            src = f"{source_remote.rstrip('/')}/{v.name}"
            dst = HQ_DIR / v.name
            print(f"  + {v.name}: rclone from {src} (hq_from_raw)")
            if args.dry_run:
                continue
            cmd = ["rclone", "copyto", src, str(dst), "--progress"]
            rc = subprocess.call(cmd)
            if rc != 0:
                return rc

    if args.prune:
        wanted = {v.name for v in filtered}
        protected_names = _shared_protect(
            defaults.get("release_tag_hq", _auto_release_tag("videos-hq")), hq=True,
        )
        for existing in HQ_DIR.iterdir():
            if not existing.is_file():
                continue
            if existing.name in wanted:
                continue
            if existing.name.endswith(".partial.mp4") or existing.name.endswith(".partial.mov"):
                continue
            if existing.name in protected_names:
                print(f"  ~ {existing.name}: protected (in shared registry), skipping prune")
                continue
            print(f"  - {existing.name}: pruning local (not in manifest)")
            if not args.dry_run:
                existing.unlink()

    return 0


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
    _, shared_videos = load_shared_manifest()
    manifest_names = {v.name for v in videos}
    shared_names = {v.name for v in shared_videos}
    raw_files = {p.name for p in RAW_DIR.glob("*") if p.is_file() and not p.name.startswith(".")}
    web_files = {p.name for p in WEB_DIR.glob("*") if p.is_file() and not p.name.startswith(".")}
    refs = _slide_references()

    problems = 0

    # Manifest entries that are missing a raw.
    for name in sorted(manifest_names - raw_files):
        print(f"  MISSING RAW:      {name}")
        problems += 1

    # Raw / web files not declared by the talk OR the shared registry.
    # Shared-overlap files in public/videos/ are valid talk overrides; they're
    # only flagged if they're absent from both manifests.
    for name in sorted(raw_files - manifest_names - shared_names):
        print(f"  ORPHAN RAW:       {name}")
        problems += 1

    for name in sorted(web_files - manifest_names - shared_names):
        print(f"  ORPHAN WEB:       {name}")
        problems += 1

    # Slide references not satisfied by the talk manifest OR the shared registry.
    for name in sorted(set(refs) - manifest_names - shared_names):
        where = ", ".join(sorted(set(refs[name])))
        print(f"  UNKNOWN REF:      {name}  (in {where})")
        problems += 1

    # Manifest entries referenced nowhere.
    for v in videos:
        if v.name not in refs:
            print(f"  UNUSED MANIFEST:  {v.name}")
            problems += 1

    # Informational: deck refs satisfied ONLY by the shared registry
    # (i.e., not also in the talk manifest). Clips that appear in both are
    # talk-owned with a shared-registry duplicate, not inherited.
    inherited = sorted((set(refs) & shared_names) - manifest_names)
    duplicated = sorted(manifest_names & shared_names)

    if problems == 0:
        owned = len(manifest_names)
        print(
            f"OK: {owned} talk-owned, {len(inherited)} inherited from shared, "
            f"{len(refs)} referenced, all consistent."
        )
        if inherited:
            print("  inherited from shared:")
            for name in inherited:
                print(f"    - {name}")
        if duplicated:
            print("  also in shared registry (talk currently owns):")
            for name in duplicated:
                print(f"    - {name}")
        return 0
    print(f"\n{problems} issue(s) found.")
    return 1


def cmd_shared_check(_: argparse.Namespace) -> int:
    """Sanity-check /videos/shared.toml. Run from the monorepo root.

    Validates that all shared entries have valid profiles, that the shared
    release tag is reachable, and surfaces deck refs across all talks that
    are satisfied by the shared registry.
    """
    root = _find_monorepo_root(TALK)
    if not root:
        print("error: not inside a monorepo (no outreach.toml found)", file=sys.stderr)
        return 2

    shared_path = root / "videos" / "shared.toml"
    if not shared_path.exists():
        print(f"error: {shared_path} not found", file=sys.stderr)
        return 2

    with shared_path.open("rb") as f:
        data = tomllib.load(f)
    defaults = {**_load_global_defaults(), **data.get("defaults", {})}
    videos = _videos_from_data(data)
    shared_names = {v.name for v in videos}

    problems = 0

    # Profile sanity.
    for v in videos:
        if v.profile not in PROFILES:
            print(f"  BAD PROFILE:      {v.name} -> {v.profile!r}")
            problems += 1

    # Cross-talk reference scan: are these clips actually used?
    used_in_talks: dict[str, list[str]] = {}
    for talk_dir in sorted((root / "talks").glob("*")):
        if not talk_dir.is_dir():
            continue
        for md in talk_dir.rglob("*.md"):
            try:
                text = md.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for m in VIDEO_REF_RE.finditer(text):
                if m.group(1) in shared_names:
                    used_in_talks.setdefault(m.group(1), []).append(talk_dir.name)

    unused = sorted(shared_names - set(used_in_talks))
    for name in unused:
        print(f"  UNUSED SHARED:    {name}  (not referenced by any talk)")
        # Not an error — a shared registry is allowed to hold spare clips.

    # Release reachability (best-effort; gh may be unavailable).
    tag = defaults.get("release_tag")
    if tag and shutil.which("gh"):
        sizes = _remote_asset_sizes(tag)
        if sizes is None:
            print(f"  RELEASE MISSING:  {tag}  (cannot reach via gh)")
            problems += 1
        else:
            missing_assets = sorted(shared_names - set(sizes))
            for name in missing_assets:
                print(f"  MISSING ASSET:    {name}  (declared in shared.toml, not on release {tag})")
                problems += 1

    print()
    print(f"Shared registry: {len(videos)} clip(s), release_tag = {tag!r}")
    if used_in_talks:
        print(f"Referenced by talks ({sum(len(v) for v in used_in_talks.values())} ref(s)):")
        for name, talks_list in sorted(used_in_talks.items()):
            print(f"  {name}: {', '.join(sorted(set(talks_list)))}")
    if problems == 0:
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
      - hq_from_raw → hard-link raw straight into videos/hq/ (no re-encode)
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

    if entry.hq_from_raw:
        if hq.exists() or hq.is_symlink():
            hq.unlink()
        try:
            import os
            os.link(raw, hq)
        except OSError:
            shutil.copy2(raw, hq)
        return entry, "ok", raw_size, raw_size

    if entry.profile == "remux":
        ff_args = _profile_args("remux", default_long_edge)
    else:
        long_edge = entry.long_edge_px or default_long_edge
        ff_args = _profile_args("hq-visually-lossless", long_edge)
        if entry.hq_crf is not None:
            for i, arg in enumerate(ff_args):
                if arg == "-crf" and i + 1 < len(ff_args):
                    ff_args[i + 1] = str(entry.hq_crf)
                    break
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
    # No over_budget warning: HQ files are local-only and expected to be large.
    print(f"HQ-encoding {len(videos)} video(s). raw -> {HQ_DIR.relative_to(TALK)} (long edge: {default_long_edge}px)")
    return _run_encode_batch(videos, _encode_one_hq, args.force, default_long_edge, label="hq")


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
    p_pub.add_argument("--prune", action="store_true", help="delete release assets not in manifest")
    p_pub.set_defaults(func=cmd_publish)

    p_pull = sub.add_parser("pull", help="download web files from GH Release")
    p_pull.add_argument("--dry-run", action="store_true")
    p_pull.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_pull.add_argument("--force", action="store_true", help="re-download even if local size matches")
    p_pull.add_argument("--prune", action="store_true", help="delete local files not in manifest")
    p_pull.set_defaults(func=cmd_pull)

    p_chk = sub.add_parser("check", help="sanity-check manifest vs raw/web/slides")
    p_chk.set_defaults(func=cmd_check)

    p_ehq = sub.add_parser("encode-hq", help="ffmpeg raw -> videos/hq/ (visually-lossless venue masters)")
    p_ehq.add_argument("--force", action="store_true", help="re-encode even if up to date")
    p_ehq.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_ehq.set_defaults(func=cmd_encode_hq)

    p_phq = sub.add_parser("publish-hq", help="upload HQ files to the parallel GH Release")
    p_phq.add_argument("--dry-run", action="store_true")
    p_phq.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_phq.add_argument("--force", action="store_true", help="re-upload even if remote size matches local")
    p_phq.add_argument("--prune", action="store_true", help="delete release assets not in manifest")
    p_phq.set_defaults(func=cmd_publish_hq)

    p_pull_hq = sub.add_parser("pull-hq", help="download HQ files from the parallel GH Release")
    p_pull_hq.add_argument("--dry-run", action="store_true")
    p_pull_hq.add_argument("--only", nargs="+", metavar="NAME", help="limit to named file(s)")
    p_pull_hq.add_argument("--force", action="store_true", help="re-download even if local size matches")
    p_pull_hq.add_argument("--prune", action="store_true", help="delete local files not in manifest")
    p_pull_hq.set_defaults(func=cmd_pull_hq)

    p_shared = sub.add_parser("shared-check", help="sanity-check /videos/shared.toml (run from monorepo root)")
    p_shared.set_defaults(func=cmd_shared_check)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    sys.exit(main())
