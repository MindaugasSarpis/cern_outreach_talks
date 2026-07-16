#!/usr/bin/env python3
"""Discover open-licensed outreach video candidates from public archives.

Queries CERN CDS Videos, the NASA Image & Video Library, the
djangoplicity sites (ESO, ESA/Hubble, ESA/Webb, NOIRLab) and Wikimedia
Commons by keyword, then prints a report of candidate clips plus a
paste-ready [[videos]] manifest snippet per new candidate. Report-only:
nothing is downloaded.

Usage (from repo root):
    pnpm videos:discover -- "cloud chamber" --limit 5
    python3 scripts/discover_videos.py "cloud chamber" lhc --source cds,nasa --json

Design: docs/superpowers/specs/2026-07-16-video-discovery-design.md
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
import tomllib
import unicodedata
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import asdict, dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
USER_AGENT = (
    "outreach-talks-videos-discover/1.0 "
    "(CERN outreach slide decks; mailto:mindaugassarpis@gmail.com)"
)
TIMEOUT_S = 15.0


@dataclass
class Candidate:
    source: str            # "cds" | "nasa" | "eso" | "hubble" | "webb" | "noirlab" | "commons"
    id: str                # source-native identifier
    title: str
    date: str              # ISO-ish date string, "" if unknown
    duration_s: float | None
    resolution: str | None  # "1920x1080" where available
    license: str
    credit: str | None
    page_url: str
    download_url: str
    in_registry: bool = False


def slugify_name(title: str, download_url: str) -> str:
    """Lowercase ASCII slug + the download URL's extension (default .mp4)."""
    ext = Path(urllib.parse.urlparse(download_url).path).suffix.lower() or ".mp4"
    ascii_title = unicodedata.normalize("NFKD", title).encode("ascii", "ignore").decode()
    slug = re.sub(r"[^a-z0-9]+", "_", ascii_title.lower()).strip("_")
    return (slug or "clip") + ext


def strip_html(text: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", text))).strip()


def parse_hms(s: str) -> float | None:
    """'00:47:14' -> 2834.0; '90' -> 90.0; junk/empty -> None."""
    try:
        nums = [float(p) for p in s.strip().split(":")]
    except ValueError:
        return None
    total = 0.0
    for n in nums:
        total = total * 60 + n
    return total


def fmt_duration(seconds: float | None) -> str:
    if seconds is None:
        return "?"
    m, s = divmod(int(round(seconds)), 60)
    return f"{m}:{s:02d}"


def toml_snippet(c: Candidate) -> str:
    """Paste-ready [[videos]] block for a candidate.

    notes is emitted via json.dumps: JSON string escaping is a subset of
    TOML basic-string escaping, so the output is always valid TOML.
    """
    bits = [c.title]
    if c.duration_s is not None:
        bits.append(fmt_duration(c.duration_s))
    bits.append(f"Source: {c.source} {c.id}")
    bits.append(c.license)
    if c.credit:
        bits.append(f"credit: {c.credit}")
    bits.append(c.page_url)
    notes = ". ".join(b.strip().rstrip(".") for b in bits if b and b.strip()) + "."
    return (
        "[[videos]]\n"
        f'name    = "{slugify_name(c.title, c.download_url)}"\n'
        'profile = "standard"   # default guess; adjust per clip\n'
        f"notes   = {json.dumps(notes)}\n"
    )


def load_registry_stems(repo_root: Path = REPO_ROOT) -> set[str]:
    """Lowercased stems of every clip name already in shared + talk manifests."""
    stems: set[str] = set()
    manifests = [repo_root / "videos" / "shared.toml"]
    manifests += sorted(repo_root.glob("talks/*/videos/manifest.toml"))
    for path in manifests:
        if not path.exists():
            continue
        data = tomllib.loads(path.read_text(encoding="utf-8"))
        for video in data.get("videos", []):
            name = video.get("name")
            if name:
                stems.add(Path(name).stem.lower())
    return stems


def mark_in_registry(candidates: list[Candidate], stems: set[str]) -> None:
    for c in candidates:
        slug_stem = Path(slugify_name(c.title, c.download_url)).stem
        url_stem = Path(urllib.parse.urlparse(c.download_url).path).stem.lower()
        c.in_registry = slug_stem in stems or url_stem in stems


def dedupe(candidates: list[Candidate]) -> list[Candidate]:
    seen: set[str] = set()
    out: list[Candidate] = []
    for c in candidates:
        if c.download_url not in seen:
            seen.add(c.download_url)
            out.append(c)
    return out


def http_get_json(url: str, timeout: float = TIMEOUT_S) -> object:
    req = urllib.request.Request(
        url, headers={"User-Agent": USER_AGENT, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.load(resp)


CDS_API = "https://videos.cern.ch/api/records/"


def search_cds(keyword: str, limit: int = 5, include_lectures: bool = False,
               fetch=http_get_json) -> list[Candidate]:
    """CERN CDS Videos (Invenio). Lecture recordings are dropped by default.

    The filter is client-side (over-fetch, then check metadata.category):
    `-category:LECTURES` inside `q` makes the endpoint return an HTML
    error page (verified live 2026-07-16).
    """
    size = limit if include_lectures else max(limit * 5, 25)
    url = CDS_API + "?" + urllib.parse.urlencode(
        {"q": keyword, "size": size, "sort": "-date"})
    data = fetch(url)
    out: list[Candidate] = []
    for hit in data.get("hits", {}).get("hits", []):
        meta = hit.get("metadata", {})
        if meta.get("type") != "VIDEO":
            continue
        if not include_lectures and meta.get("category") == "LECTURES":
            continue
        master = next(
            (f for f in meta.get("_files", [])
             if f.get("context_type") == "master" and f.get("content_type") == "mp4"),
            None)
        if master is None:
            continue
        download = (master.get("links") or {}).get("self", "")
        if not download:
            continue
        tags = master.get("tags") or {}
        resolution = None
        if tags.get("width") and tags.get("height"):
            resolution = f"{tags['width']}x{tags['height']}"
        licenses = meta.get("license") or []
        license_str = ", ".join(
            l.get("license", "") for l in licenses if l.get("license")
        ) or "CERN (copyright.web.cern.ch)"
        recid = str(meta.get("recid") or hit.get("id", ""))
        duration_raw = meta.get("duration") or ""
        out.append(Candidate(
            source="cds",
            id=recid,
            title=strip_html(str((meta.get("title") or {}).get("title", ""))),
            date=str(meta.get("date") or meta.get("publication_date") or ""),
            duration_s=parse_hms(duration_raw) if duration_raw else None,
            resolution=resolution,
            license=license_str,
            credit=(meta.get("copyright") or {}).get("holder"),
            page_url=f"https://videos.cern.ch/record/{recid}",
            download_url=download,
        ))
        if len(out) >= limit:
            break
    return out


NASA_API = "https://images-api.nasa.gov/search"


def _nasa_best_asset(urls: list[str]) -> str | None:
    mp4s = [u for u in urls if u.lower().endswith(".mp4")]
    for marker in ("~orig", "~large", "~medium", "~small"):
        for u in mp4s:
            if marker in u:
                return u
    return mp4s[0] if mp4s else None


def search_nasa(keyword: str, limit: int = 5, fetch=http_get_json) -> list[Candidate]:
    """NASA Image & Video Library. Asset URLs contain spaces -> quoted."""
    url = NASA_API + "?" + urllib.parse.urlencode(
        {"q": keyword, "media_type": "video", "page_size": limit})
    data = fetch(url)
    out: list[Candidate] = []
    for item in data.get("collection", {}).get("items", [])[:limit]:
        d = (item.get("data") or [{}])[0]
        href = item.get("href", "")
        if not href:
            continue
        assets = fetch(urllib.parse.quote(href, safe=":/"))
        if not isinstance(assets, list):
            continue
        best = _nasa_best_asset([u for u in assets if isinstance(u, str)])
        if not best:
            continue
        nasa_id = d.get("nasa_id", "")
        out.append(Candidate(
            source="nasa",
            id=nasa_id,
            title=d.get("title", ""),
            date=(d.get("date_created") or "")[:10],
            duration_s=None,
            resolution=None,
            license="Public domain (NASA media guidelines)",
            credit=d.get("center"),
            page_url="https://images.nasa.gov/details/" + urllib.parse.quote(nasa_id),
            download_url=urllib.parse.quote(best, safe=":/~"),
        ))
    return out


DJANGOPLICITY_SITES = {
    "eso": "https://www.eso.org/public/videos/d2d/",
    "hubble": "https://esahubble.org/videos/d2d/",
    "webb": "https://esawebb.org/videos/d2d/",
    "noirlab": "https://noirlab.edu/public/videos/d2d/",
}
_VIDEO_EXTS = (".mp4", ".m4v", ".mov", ".webm")

COMMONS_API = "https://commons.wikimedia.org/w/api.php"


def search_commons(keyword: str, limit: int = 5, fetch=http_get_json) -> list[Candidate]:
    """Wikimedia Commons file search. Results are often webm/ogv — fine,
    the pipeline's encode step re-encodes anything ffmpeg can read."""
    params = {
        "action": "query", "format": "json",
        "generator": "search",
        "gsrsearch": f"{keyword} filetype:video",
        "gsrnamespace": 6, "gsrlimit": limit,
        "prop": "imageinfo",
        "iiprop": "url|size|extmetadata",
        "iiextmetadatafilter": "LicenseShortName|UsageTerms|Artist|DateTimeOriginal",
    }
    data = fetch(COMMONS_API + "?" + urllib.parse.urlencode(params))
    pages = (data.get("query") or {}).get("pages") or {}
    out: list[Candidate] = []
    for page in sorted(pages.values(), key=lambda p: p.get("index", 0)):
        infos = page.get("imageinfo") or []
        if not infos:
            continue
        ii = infos[0]
        meta = ii.get("extmetadata") or {}

        def ext(key: str) -> str | None:
            return strip_html(str((meta.get(key) or {}).get("value", ""))) or None

        resolution = None
        if ii.get("width") and ii.get("height"):
            resolution = f"{ii['width']}x{ii['height']}"
        title = re.sub(r"^File:", "", page.get("title", ""))
        out.append(Candidate(
            source="commons",
            id=str(page.get("pageid", "")),
            title=Path(title).stem,
            date=ext("DateTimeOriginal") or "",
            duration_s=float(ii["duration"]) if ii.get("duration") else None,
            resolution=resolution,
            license=ext("LicenseShortName") or ext("UsageTerms")
                    or "unknown — check file page",
            credit=ext("Artist"),
            page_url=ii.get("descriptionurl") or "",
            download_url=ii.get("url") or "",
        ))
        if len(out) >= limit:
            break
    return out


def _d2d_best_resource(item: dict) -> tuple[str | None, str | None]:
    """(download_url, 'WxH') of the best video rendition: Original wins,
    then largest pixel area."""
    best_url, best_dims, best_score = None, None, -1.0
    for asset in item.get("Assets") or []:
        if asset.get("MediaType") != "Video":
            continue
        for res in asset.get("Resources") or []:
            url = res.get("URL") or ""
            if Path(urllib.parse.urlparse(url).path).suffix.lower() not in _VIDEO_EXTS:
                continue
            dims = res.get("Dimensions") or []
            area = float(dims[0]) * float(dims[1]) if len(dims) == 2 else 0.0
            score = area + (1e12 if res.get("ResourceType") == "Original" else 0.0)
            if score > best_score:
                best_score = score
                best_url = url
                best_dims = f"{int(dims[0])}x{int(dims[1])}" if len(dims) == 2 else None
    return best_url, best_dims


def search_djangoplicity(keyword: str, limit: int = 5, pages: int = 5,
                         site: str = "eso", fetch=http_get_json) -> list[Candidate]:
    """One djangoplicity site's d2d feed (newest-first; no server-side
    search) — walk up to `pages` pages and keyword-filter client-side."""
    kw = keyword.lower()
    out: list[Candidate] = []
    url: str | None = DJANGOPLICITY_SITES[site]
    for _ in range(pages):
        if not url:
            break
        data = fetch(url)
        for item in data.get("Collections") or []:
            text = (item.get("Title", "") + " "
                    + strip_html(item.get("Description") or "")).lower()
            if kw not in text:
                continue
            download, resolution = _d2d_best_resource(item)
            if not download:
                continue
            out.append(Candidate(
                source=site,
                id=item.get("ID", ""),
                title=item.get("Title", ""),
                date=(item.get("PublicationDate") or "")[:10],
                duration_s=None,
                resolution=resolution,
                license=item.get("Rights") or "CC BY 4.0",
                credit=strip_html(item.get("Credit") or "") or None,
                page_url=item.get("ReferenceURL") or "",
                download_url=download,
            ))
            if len(out) >= limit:
                return out
        url = data.get("Next")
    return out


SOURCE_LABELS = {
    "cds": "CERN CDS Videos",
    "nasa": "NASA Image & Video Library",
    "eso": "ESO",
    "hubble": "ESA/Hubble",
    "webb": "ESA/Webb",
    "noirlab": "NOIRLab",
    "commons": "Wikimedia Commons",
}
D2D_SOURCES = ("eso", "hubble", "webb", "noirlab")


def render_report(candidates: list[Candidate], pages: int) -> str:
    lines: list[str] = []
    by_source: dict[str, list[Candidate]] = {}
    for c in candidates:
        by_source.setdefault(c.source, []).append(c)
    for source, label in SOURCE_LABELS.items():
        group = by_source.get(source)
        if not group:
            continue
        if source in D2D_SOURCES:
            label += f" (newest {pages} feed pages only — raise --pages for deeper history)"
        lines.append(f"== {label} ==")
        for c in sorted(group, key=lambda c: c.date, reverse=True):
            flag = "  [already in registry]" if c.in_registry else ""
            lines.append(f"* {c.title}{flag}")
            details = [x for x in (
                c.date or None,
                fmt_duration(c.duration_s) if c.duration_s is not None else None,
                c.resolution,
                c.license,
            ) if x]
            lines.append(f"    {' | '.join(details)}")
            lines.append(f"    page:     {c.page_url}")
            lines.append(f"    download: {c.download_url}")
        lines.append("")
    fresh = [c for c in candidates if not c.in_registry]
    if fresh:
        lines.append("== Manifest snippets "
                     "(paste into videos/manifest.toml or /videos/shared.toml) ==")
        lines.append("")
        for c in fresh:
            lines.append(toml_snippet(c))
    if not candidates:
        lines.append("No candidates found.")
    return "\n".join(lines)

VALID_SOURCES = {"cds", "nasa", "djangoplicity", "commons"}


def build_jobs(keywords: list[str], sources: set[str], limit: int, pages: int,
               include_lectures: bool) -> list[tuple[str, object]]:
    """One (label, thunk) per source-site x keyword. Adapters are resolved
    as module globals at call time so tests can patch them."""
    jobs: list[tuple[str, object]] = []
    for kw in keywords:
        if "cds" in sources:
            jobs.append((f"cds:{kw}",
                         lambda kw=kw: search_cds(kw, limit, include_lectures)))
        if "nasa" in sources:
            jobs.append((f"nasa:{kw}", lambda kw=kw: search_nasa(kw, limit)))
        if "djangoplicity" in sources:
            for site in DJANGOPLICITY_SITES:
                jobs.append((f"{site}:{kw}",
                             lambda kw=kw, site=site: search_djangoplicity(
                                 kw, limit, pages, site)))
        if "commons" in sources:
            jobs.append((f"commons:{kw}", lambda kw=kw: search_commons(kw, limit)))
    return jobs


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(
        prog="videos:discover",
        description="Search open-licensed archives for outreach video candidates.",
        epilog='Example: pnpm videos:discover -- "cloud chamber" --limit 3')
    ap.add_argument("keywords", nargs="+", help="search keywords (each queried everywhere)")
    ap.add_argument("--source", default="cds,nasa,djangoplicity,commons",
                    help="comma-separated subset of: cds,nasa,djangoplicity,commons")
    ap.add_argument("--limit", type=int, default=5,
                    help="max results per source per keyword (default 5)")
    ap.add_argument("--pages", type=int, default=5,
                    help="d2d feed pages to walk per djangoplicity site (default 5)")
    ap.add_argument("--include-lectures", action="store_true",
                    help="keep CDS LECTURES category (excluded by default)")
    ap.add_argument("--json", action="store_true", dest="as_json",
                    help="emit candidates as JSON instead of the report")
    args = ap.parse_args(argv)

    sources = {s.strip() for s in args.source.split(",") if s.strip()}
    unknown = sources - VALID_SOURCES
    if unknown or not sources:
        ap.error(f"unknown --source value(s): {', '.join(sorted(unknown)) or '(empty)'}")

    jobs = build_jobs(args.keywords, sources, args.limit, args.pages,
                      args.include_lectures)
    candidates: list[Candidate] = []
    warnings: list[str] = []
    with ThreadPoolExecutor(max_workers=8) as pool:
        futures = {pool.submit(fn): label for label, fn in jobs}
        for fut in as_completed(futures):
            label = futures[fut]
            try:
                candidates.extend(fut.result())
            except Exception as exc:  # per-job isolation: one bad source can't kill the run
                warnings.append(f"{label}: {type(exc).__name__}: {exc}")

    for w in warnings:
        print(f"WARN {w}", file=sys.stderr)
    if jobs and len(warnings) == len(jobs):
        print("All sources failed.", file=sys.stderr)
        return 1

    candidates = dedupe(candidates)
    mark_in_registry(candidates, load_registry_stems())

    if args.as_json:
        print(json.dumps([asdict(c) for c in candidates], indent=2))
        return 0
    print(render_report(candidates, args.pages))
    return 0


if __name__ == "__main__":
    sys.exit(main())
