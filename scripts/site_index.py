#!/usr/bin/env python3
"""The Pages landing page: site/index.html, one bold line per built talk, and the redirects.

    python3 scripts/site_index.py site        # from the checkout root (deploy.yml's assemble job)

A talk's line is its web link; when the checkout has its videos/pptx.json (written by `pnpm talk
pptx NAME`, committed with the upload), a "PPTX · <size>" download sits on the right of the line,
and with its videos/venue.json ({"url", "bytes"}: the offline venue zip, `pnpm venue`, uploaded to
the talk's release) a "ZIP · <size>" one.
The committed file, never the API: the assemble job has no token, a pull request's build stays
offline, and the file says the asset was uploaded by the run that wrote it. Stdlib only.
"""
from __future__ import annotations

import html
import json
import re
import sys
import tomllib
from pathlib import Path

TITLE = "Paskaitos ir pranešimai"
STYLE = (":root{color-scheme:light dark;--fg:#1d1f24;--line:#e5e7eb;--link:#1d4ed8;--bg:#fff}"
         "@media(prefers-color-scheme:dark){:root{--fg:#e5e7eb;--line:#2a2f3a;--link:#93c5fd;--bg:#0f1115}}"
         "body{font-family:system-ui,sans-serif;background:var(--bg);color:var(--fg);max-width:46rem;margin:3.5rem auto;padding:0 1rem;line-height:1.4}"
         "h1{font-size:1.6rem;font-weight:650;margin:0 0 1.5rem}ul{list-style:none;padding:0;margin:0}"
         "li{padding:.85rem 0;border-top:1px solid var(--line)}li:last-child{border-bottom:1px solid var(--line)}"
         "a{color:var(--link);font-weight:700;font-size:1.08rem;text-decoration:none;overflow-wrap:anywhere}a:hover{text-decoration:underline}")
# only on a page with a download, so a page without one stays what the inline generator wrote
PPTX_STYLE = ("li{display:flex;align-items:baseline;gap:1rem}"
              ".pptx{margin-left:auto;flex:none;font-size:.85rem;font-weight:600;letter-spacing:.04em;white-space:nowrap}"
              ".zip{flex:none;font-size:.85rem;font-weight:600;letter-spacing:.04em;white-space:nowrap}"
              "li>a:first-child+.zip{margin-left:auto}")
RELEASE_URL = re.compile(r"https://github\.com/[\w.-]+/[\w.-]+/releases/download/[^\s\"'<>]+\.pptx")
ZIP_URL = re.compile(r"https://github\.com/[\w.-]+/[\w.-]+/releases/download/[^\s\"'<>]+\.zip")
MB = 1024 * 1024


def slug(name: str) -> str:
    return re.sub(r"^\d{4}_\d{2}_\d{2}_", "", name)


def human(n: int) -> str:
    return f"{max(1, round(n / MB))} MB" if n < 1024 * MB else f"{n / (1024 * MB):.1f} GB"


def asset_link(root: Path, talk: str, file: str = "pptx.json", kind: str = "pptx", pattern: re.Pattern = RELEASE_URL) -> str:
    """The row's download link from talks/<talk>/videos/<file>, or "" (no file, or one that does not hold up: a warning)."""
    p = root / "talks" / talk / "videos" / file
    label = kind.upper()
    if not p.is_file():
        return ""
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        data = None
    if not isinstance(data, dict):
        print(f"::warning::{talk}: videos/{file} is unreadable (a merge conflict?); no {label} link")
        return ""
    url, size = data.get("url"), data.get("bytes")
    if not (isinstance(url, str) and pattern.fullmatch(url)):
        print(f"::warning::{talk}: videos/{file} url is not a GitHub release download; no {label} link")
        return ""
    if not (isinstance(size, int) and not isinstance(size, bool) and size > 0):
        print(f"::warning::{talk}: videos/{file} has no size; no {label} link")
        return ""
    return f'<a class={kind} href="{html.escape(url)}" download>{label} · {human(size)}</a>'


def pptx_link(root: Path, talk: str) -> str:
    return asset_link(root, talk)


def zip_link(root: Path, talk: str) -> str:
    return asset_link(root, talk, "venue.json", "zip", ZIP_URL)


def write_index(site: Path, root: Path) -> None:
    f = root / "talk-labels.toml"
    conf = tomllib.loads(f.read_text()) if f.is_file() else {}
    # the link text is the talk's label (date and name) from talk-labels.toml, keyed by its slug
    # (the directory name without its date), else its directory name; newest first by that text
    labels = conf.get("labels", {})
    talks = [d.name for d in (root / "talks").iterdir() if (site / d.name / "index.html").is_file()]
    rows = sorted(((str(labels.get(slug(n)) or n), n) for n in talks), reverse=True)
    links = {n: pptx_link(root, n) + zip_link(root, n) for _, n in rows}
    items = [f'<li><a href="./{n}/">{html.escape(label)}</a>{links[n]}</li>' for label, n in rows]
    page = ("<!doctype html><html lang=lt><meta charset=utf-8>"
            "<meta name=viewport content='width=device-width,initial-scale=1'>"
            f"<title>{TITLE}</title>"
            f"<style>{STYLE}{PPTX_STYLE if any(links.values()) else ''}</style>"
            f"<h1>{TITLE}</h1><ul>" + "".join(items) + "</ul>")
    (site / "index.html").write_text(page + "\n")
    # a renamed talk's old address ([redirects] old dir = new dir) sends the browser on to the
    # new one, its #/N slide kept; never indexed, and never over a talk that is built
    for old, new in conf.get("redirects", {}).items():
        if not re.fullmatch(r"\w+", old) or not re.fullmatch(r"\w+", str(new)):
            print(f"::warning::redirect {old!r} = {new!r} is not two directory names; skipped")
            continue
        if (site / old).exists() or not (site / new / "index.html").is_file():
            print(f"::warning::redirect {old} -> {new} skipped (the old one is built, or the new one is not)")
            continue
        to = f"../{new}/"
        (site / old).mkdir()
        (site / old / "index.html").write_text(
            "<!doctype html><html><meta charset=utf-8><meta name=robots content=noindex>"
            f"<link rel=canonical href='{html.escape(to)}'>"
            f"<meta http-equiv=refresh content='0; url={html.escape(to)}'>"
            f"<title>{html.escape(new)}</title>"
            f"<script>location.replace({json.dumps(to)} + location.search + location.hash)</script>"
            f"<p><a href='{html.escape(to)}'>{html.escape(new)}</a></p>\n")
        print(f"redirect {old}/ -> {new}/")


def main(argv: list[str] | None = None) -> int:
    args = sys.argv[1:] if argv is None else argv
    if len(args) != 1:
        print("usage: site_index.py SITE_DIR   (from the checkout root)", file=sys.stderr)
        return 2
    write_index(Path(args[0]), Path.cwd())
    return 0


if __name__ == "__main__":
    sys.exit(main())
