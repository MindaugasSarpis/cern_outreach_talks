#!/usr/bin/env python3
"""Fetch a photo with its licence and credit from CERN's CDS or Wikimedia Commons.

Usage:
    python3 scripts/photo_fetch.py cds:CERN-PHOTO-202204-062-1 [--size large|original]
    python3 scripts/photo_fetch.py commons:File:CERN_Computer_Center_02.jpg [--width 2400]
    python3 scripts/photo_fetch.py <ref> --dry-run      # the plan and what photos.toml records; no request
    python3 scripts/photo_fetch.py <ref> --record       # also add the entry to assets/photos/photos.toml
    python3 scripts/photo_fetch.py <ref> --browser      # CDS through Chromium (bot check), plus the record JSON
    python3 scripts/photo_fetch.py --check              # validate assets/photos/photos.toml

A ref is cds:<ID>, commons:File:<name>, or the record URL of either. The
file lands in assets/photos/<name>.<ext> (--out, --name), named after the
photos.toml entry when there is one; image files are not committed until
the owner picks them.

CDS: the licence, photographer and record number come from
https://cds.cern.ch/images/<ID>, which CDS serves without its Anubis bot
check, and the file from /images/<ID>/file?size=large (1440 px; --size
original for the full file). The record pages and record JSON
(/record/<n>?of=recjson) sit behind the bot check: --browser fetches all of
it through Chromium (scripts/cds_fetch.mjs, playwright-chromium from the
repo's node_modules or $PLAYWRIGHT_PATH). Commons: the API's imageinfo and
extmetadata, a thumbnail of at most --width px. Requests back off on 429
and 5xx (Retry-After honoured) and identify themselves with the repo's
GitHub URL, never an e-mail address.

--json prints one JSON object on stdout. Exit 0 ok, 1 fetch or check
failed, 2 usage error.
"""
from __future__ import annotations

import argparse
import datetime as dt
import html
import json
import os
import re
import shutil
import struct
import subprocess
import sys
import time
import tomllib
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = ROOT / "assets" / "photos"
BANK = PHOTOS / "photos.toml"
REPO_URL = "https://github.com/MindaugasSarpis/cern_outreach_talks"
UA = f"cern_outreach_talks-photo_fetch/1.0 (+{REPO_URL})"
BROWSER_UA = ("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128 Safari/537.36 "
              f"cern_outreach_talks-photo_fetch (+{REPO_URL})")
assert "@" not in UA + BROWSER_UA, "the User-Agent names the repo, never an e-mail address"
KEYS = ("subject", "file", "source_url", "licence", "credit", "verified_on", "px")
CDS_ID = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{2,80}$")


class UsageError(Exception):
    pass


# --------------------------------------------------------------------------
# Refs

def parse_ref(ref: str) -> tuple[str, str]:
    """('cds', ID) or ('commons', 'File:Name_with_underscores')."""
    r = ref.strip()
    m = re.match(r"^https?://cds\.cern\.ch/images/([^/?#]+)", r)
    if m:
        r = "cds:" + m.group(1)
    m = re.match(r"^https?://commons\.wikimedia\.org/wiki/(File:[^?#]+)", r)
    if m:
        r = "commons:" + urllib.parse.unquote(m.group(1))
    if r.lower().startswith("file:"):
        r = "commons:" + r
    kind, _, ident = r.partition(":")
    kind = kind.lower()
    if kind == "cds" and CDS_ID.match(ident):
        return "cds", ident
    if kind == "commons" and re.match(r"^File:.+\.\w{3,4}$", ident, re.I):
        return "commons", "File:" + ident[5:].replace(" ", "_")
    raise UsageError(f"{ref!r}: expected cds:<ID> or commons:File:<name> (or their record URLs)")


def record_url(kind: str, ident: str) -> str:
    if kind == "cds":
        return f"https://cds.cern.ch/images/{ident}"
    return "https://commons.wikimedia.org/wiki/" + urllib.parse.quote(ident, safe=":_(),-.!'")


def slug(s: str) -> str:
    s = re.sub(r"\.\w{3,4}$", "", s.split(":")[-1])
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60]


# --------------------------------------------------------------------------
# photos.toml

def load_bank(path: Path = BANK) -> list[dict]:
    if not path.is_file():
        return []
    return tomllib.loads(path.read_text(encoding="utf-8")).get("photo", [])


def recorded(kind: str, ident: str, path: Path = BANK) -> dict | None:
    for p in load_bank(path):
        try:
            if parse_ref(p.get("source_url", "")) == (kind, ident):
                return p
        except UsageError:
            continue
    return None


def check_bank(path: Path = BANK) -> list[str]:
    try:
        photos = load_bank(path)
    except tomllib.TOMLDecodeError as exc:
        return [f"{path.name}: not TOML ({exc})"]
    errs, files = [], set()
    for i, p in enumerate(photos, 1):
        name = p.get("file", f"entry {i}")
        missing = [k for k in KEYS if k not in p]
        extra = [k for k in p if k not in KEYS]
        if missing:
            errs.append(f"{name}: missing {', '.join(missing)}")
        if extra:
            errs.append(f"{name}: unknown keys {', '.join(extra)}")
        if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*\.(?:jpg|png)$", str(p.get("file", ""))):
            errs.append(f"{name}: file must be a slug ending .jpg or .png")
        if name in files:
            errs.append(f"{name}: listed twice")
        files.add(name)
        try:
            parse_ref(str(p.get("source_url", "")))
        except UsageError:
            errs.append(f"{name}: source_url is not a CDS /images/ or Commons File: record")
        if not re.match(r"^\d{4}-\d{2}-\d{2}$", str(p.get("verified_on", ""))):
            errs.append(f"{name}: verified_on must be YYYY-MM-DD")
        px = p.get("px")
        if not (isinstance(px, list) and len(px) == 2 and all(isinstance(v, int) and v > 0 for v in px)):
            errs.append(f"{name}: px must be [width, height]")
        for k in ("subject", "licence", "credit"):
            if not str(p.get(k, "")).strip():
                errs.append(f"{name}: {k} is empty")
    return errs


def toml_entry(e: dict) -> str:
    q = lambda s: json.dumps(str(s), ensure_ascii=False)
    return ("[[photo]]\n" + "".join(f"{k} = {q(e[k])}\n" for k in KEYS if k != "px")
            + f"px = [{e['px'][0]}, {e['px'][1]}]\n")


def append_entry(e: dict, path: Path = BANK) -> bool:
    if any(p.get("file") == e["file"] for p in load_bank(path)):
        return False
    text = path.read_text(encoding="utf-8") if path.is_file() else ""
    path.write_text(text.rstrip("\n") + "\n\n" + toml_entry(e), encoding="utf-8")
    return True


# --------------------------------------------------------------------------
# HTTP with backoff

def http_get(url: str, attempts: int = 5, accept: str = "*/*") -> tuple[bytes, dict]:
    delay = 2.0
    for n in range(attempts):
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": accept})
        try:
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read(), dict(r.headers)
        except urllib.error.HTTPError as exc:
            if exc.code not in (429, 500, 502, 503, 504) or n == attempts - 1:
                raise
            ra = exc.headers.get("Retry-After") if exc.headers else None
            wait = float(ra) if ra and ra.isdigit() else delay
        except urllib.error.URLError:
            if n == attempts - 1:
                raise
            wait = delay
        print(f"  retry in {wait:.0f} s: {url}", file=sys.stderr)
        time.sleep(min(wait, 120))
        delay *= 2
    raise RuntimeError("unreachable")


def image_size(data: bytes) -> list[int] | None:
    """[width, height] from a PNG or JPEG header."""
    if data[:8] == b"\x89PNG\r\n\x1a\n" and len(data) >= 24:
        return list(struct.unpack(">II", data[16:24]))
    if data[:2] == b"\xff\xd8":
        i = 2
        while i + 9 < len(data):
            if data[i] != 0xFF:
                i += 1
                continue
            marker = data[i + 1]
            if marker in (0xD8, 0x01) or 0xD0 <= marker <= 0xD7:
                i += 2
                continue
            seg = struct.unpack(">H", data[i + 2:i + 4])[0]
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7, 0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack(">HH", data[i + 5:i + 9])
                return [w, h]
            i += 2 + seg
    return None


EXT = {"image/jpeg": ".jpg", "image/png": ".png", "image/tiff": ".tif", "image/webp": ".webp"}


# --------------------------------------------------------------------------
# CDS

def _text(fragment: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", fragment))).strip()


def is_bot_check(page: str) -> bool:
    return "About this image" not in page and bool(re.search(r"anubis|techaro|proof-of-work", page, re.I))


def parse_cds_page(page: str) -> dict:
    """Title, photographer, dates, licence text, record number and size links of /images/<ID>."""
    out = {}
    m = re.search(r"<h1[^>]*>([\s\S]*?)</h1>", page)
    out["title"] = _text(m.group(1)) if m else None
    m = re.search(r"Photographer:\s*<span[^>]*>([\s\S]*?)</span>", page)
    out["photographer"] = _text(m.group(1)) if m else None
    m = re.search(r"Taken:\s*<span[^>]*>([\s\S]*?)</span>", page)
    out["taken"] = _text(m.group(1)) if m else None
    m = re.search(r"<h3>\s*Licen[cs]e\s*</h3>\s*([\s\S]*?)(?=<h3|</div>)", page, re.I)
    out["licence_text"] = _text(m.group(1)) if m else None
    m = re.search(r"https?://cds\.cern\.ch/record/(\d+)", page)
    out["recid"] = m.group(1) if m else None
    out["sizes"] = {s: h for s, h in re.findall(r'data-size="(\w+)"\s+href="([^"]+)"', page)}
    return out


def cds_licence(text: str | None) -> tuple[str, str | None]:
    """(licence as stated, holder) from the CDS licence paragraph."""
    t = text or ""
    holder = None
    m = re.search(r"©\s*([^.,;]+?)(?:\s*(?:,|Some rights|All rights|Licen|$))", t)
    if m:
        holder = m.group(1).strip()
    cc = re.search(r"CC[- ]?(BY(?:-(?:SA|NC|ND))*)[- ]?(\d\.\d)", t, re.I)
    if cc:
        return f"CC {cc.group(1).upper()} {cc.group(2)}", holder
    if re.search(r"CC0|public domain", t, re.I):
        return "CC0" if "CC0" in t else "Public domain", holder
    if holder and holder.upper() == "CERN" and re.search(r"non-commercial", t, re.I):
        return "CERN terms (non-commercial)", holder
    if holder:
        return f"© {holder}, all rights reserved", holder
    return (t or "unknown: read the record page"), holder


def person(name: str | None) -> str | None:
    """'Brice, Maximilien' -> 'Maximilien Brice'."""
    if not name:
        return None
    first = name.split(";")[0].strip()
    if "," in first:
        last, given = [x.strip() for x in first.split(",", 1)]
        return f"{given} {last}".strip()
    return first


def cds_credit(licence: str, holder: str | None, photographer: str | None) -> str:
    who = person(photographer)
    if holder and holder.upper() != "CERN":
        return f"Image: {holder}"
    base = f"Photo: {who}/CERN" if who else "Image: CERN"
    return base + (f", {licence}" if licence.startswith("CC") else "")


def browser_fetch(pages=(), texts=(), saves=()) -> dict:
    """Run scripts/cds_fetch.mjs: pages -> HTML, texts -> innerText, saves -> files."""
    node = shutil.which("node")
    if not node:
        raise RuntimeError("--browser needs node on PATH (the outreach_talks env has it)")
    env = dict(os.environ)
    if not env.get("PLAYWRIGHT_PATH"):
        found = find_playwright()
        if found:
            env["PLAYWRIGHT_PATH"] = str(found)
    env["CDS_FETCH_UA"] = BROWSER_UA
    args = [node, str(Path(__file__).with_name("cds_fetch.mjs"))]
    for u in pages:
        args += ["--page", u]
    for u in texts:
        args += ["--text", u]
    for u, p in saves:
        args += ["--save", u, str(p)]
    r = subprocess.run(args, capture_output=True, text=True, env=env, timeout=600)
    if r.returncode != 0:
        raise RuntimeError("cds_fetch.mjs failed: " + (r.stderr.strip() or r.stdout.strip())[-400:])
    return json.loads(r.stdout)


def find_playwright() -> Path | None:
    """playwright-chromium in this checkout's node_modules, else the main checkout's."""
    roots = [ROOT]
    try:
        common = subprocess.run(["git", "-C", str(ROOT), "rev-parse", "--git-common-dir"],
                                capture_output=True, text=True, timeout=10).stdout.strip()
        if common:
            roots.append((ROOT / common).resolve().parent)
    except (OSError, subprocess.SubprocessError):
        pass
    for r in roots:
        for cand in [r / "node_modules" / "playwright-chromium",
                     *sorted((r / "node_modules" / ".pnpm").glob("playwright-chromium@*/node_modules/playwright-chromium"), reverse=True)]:
            if (cand / "package.json").is_file():
                return cand
    return None


def fetch_cds(ident: str, size: str, out_dir: Path, name: str, browser: bool) -> dict:
    page_url = record_url("cds", ident)
    file_url = f"https://cds.cern.ch/images/{ident}/file?size={size}"
    recjson = None
    if browser:
        got = browser_fetch(pages=[page_url])
        page = got["pages"][page_url]
    else:
        page = http_get(page_url, accept="text/html")[0].decode("utf-8", "replace")
    if is_bot_check(page):
        raise RuntimeError(f"CDS answered {page_url} with its bot check; retry with --browser")
    meta = parse_cds_page(page)
    if not meta.get("title") and not meta.get("licence_text"):
        raise RuntimeError(f"{page_url}: no image record found (wrong ID?)")
    if browser and meta.get("recid"):
        rj = f"https://cds.cern.ch/record/{meta['recid']}?of=recjson"
        tmp = out_dir / f".{name}.download"
        got = browser_fetch(texts=[rj], saves=[(file_url, tmp)])
        try:
            recjson = json.loads(got["texts"][rj])
        except (KeyError, json.JSONDecodeError):
            recjson = None
        data = tmp.read_bytes()
        ctype = got["saved"][file_url].get("contentType", "")
        tmp.unlink()
    else:
        data, headers = http_get(file_url, accept="image/*")
        ctype = headers.get("Content-Type", "")
    licence, holder = cds_licence(meta.get("licence_text"))
    if recjson:
        flat = json.dumps(recjson, ensure_ascii=False)
        cc = re.search(r"CC[- ]?BY(?:-(?:SA|NC|ND))*[- ]?\d\.\d", flat)
        if cc and not licence.startswith("CC"):
            licence, _ = cds_licence(cc.group(0))
    return {"data": data, "ctype": ctype, "record": page_url, "file_url": file_url,
            "subject": meta.get("title") or ident, "licence": licence,
            "credit": cds_credit(licence, holder, meta.get("photographer")),
            "meta": {k: v for k, v in meta.items() if k != "sizes"}, "recjson": bool(recjson)}


# --------------------------------------------------------------------------
# Commons

def commons_api(title: str, width: int) -> str:
    q = {"action": "query", "format": "json", "prop": "imageinfo", "titles": title, "maxlag": "5",
         "iiprop": "url|size|mime|extmetadata", "iiurlwidth": str(width)}
    return "https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(q)


def fetch_commons(title: str, width: int) -> dict:
    api = commons_api(title, width)
    info = json.loads(http_get(api, accept="application/json")[0])
    pages = (info.get("query") or {}).get("pages") or {}
    page = next(iter(pages.values()), {})
    if "imageinfo" not in page:
        raise RuntimeError(f"Commons has no file {title!r}")
    ii = page["imageinfo"][0]
    em = ii.get("extmetadata") or {}
    g = lambda k: _text((em.get(k) or {}).get("value", ""))
    licence = g("LicenseShortName") or "unknown: read the record page"
    if re.fullmatch(r"(?i)public domain|pd.*", licence):
        licence = "Public domain"
    artist = g("Artist") or g("Credit") or "unknown author"
    lic_txt = "public domain" if licence == "Public domain" else licence
    url = ii.get("thumburl") if ii.get("thumburl") and (ii.get("width") or 0) > width else ii.get("url")
    data, headers = http_get(url, accept="image/*")
    return {"data": data, "ctype": headers.get("Content-Type", ii.get("mime", "")),
            "record": ii.get("descriptionurl") or record_url("commons", title), "file_url": url,
            "subject": g("ImageDescription")[:200] or title[5:],
            "licence": licence, "credit": f"Photo: {artist}, {lic_txt}, via Wikimedia Commons",
            "meta": {"artist": artist, "date": g("DateTimeOriginal")[:40], "api": api}}


# --------------------------------------------------------------------------
# CLI

def plan(kind: str, ident: str, args) -> dict:
    rec = recorded(kind, ident)
    if kind == "cds":
        reqs = [record_url("cds", ident), f"https://cds.cern.ch/images/{ident}/file?size={args.size}"]
        if args.browser:
            reqs.append("https://cds.cern.ch/record/<record number>?of=recjson (through Chromium)")
    else:
        reqs = [commons_api(ident, args.width), "the thumbnail or original URL the API returns"]
    return {"ref": f"{kind}:{ident}", "record": record_url(kind, ident), "would_request": reqs,
            "user_agent": BROWSER_UA if args.browser else UA, "recorded": rec}


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="photo_fetch.py", description=__doc__.split("\n\n")[0])
    ap.add_argument("ref", nargs="?", help="cds:<ID> | commons:File:<name> | a record URL")
    ap.add_argument("--name", help="file name without extension (default: from photos.toml or the ref)")
    ap.add_argument("--out", type=Path, default=PHOTOS, help=f"directory (default {PHOTOS})")
    ap.add_argument("--size", default="large", choices=("large", "original", "medium"), help="CDS size")
    ap.add_argument("--width", type=int, default=2400, help="Commons: largest width to fetch")
    ap.add_argument("--browser", action="store_true", help="CDS through Chromium, with the record JSON")
    ap.add_argument("--dry-run", action="store_true", help="print the plan; make no request")
    ap.add_argument("--record", action="store_true", help="add the entry to photos.toml")
    ap.add_argument("--check", action="store_true", help="validate photos.toml and exit")
    ap.add_argument("--json", action="store_true", help="one JSON object on stdout")
    try:
        args = ap.parse_args(argv)
    except SystemExit as exc:
        return 2 if exc.code else 0

    def emit(obj, human):
        if args.json:
            print(json.dumps(obj, ensure_ascii=False, indent=1))
            print(human, file=sys.stderr)
        else:
            print(human)

    if args.check:
        errs = check_bank()
        n = len(load_bank()) if not any("not TOML" in e for e in errs) else 0
        emit({"ok": not errs, "photos": n, "errors": errs},
             "\n".join(errs + [f"{n} photos, {len(errs)} problem(s)"]))
        return 1 if errs else 0
    if not args.ref:
        print("photo_fetch.py: a ref (cds:<ID> or commons:File:<name>) or --check is needed", file=sys.stderr)
        return 2
    try:
        kind, ident = parse_ref(args.ref)
    except UsageError as exc:
        print(f"photo_fetch.py: {exc}", file=sys.stderr)
        return 2
    if args.browser and kind != "cds":
        print("photo_fetch.py: --browser is for CDS only", file=sys.stderr)
        return 2

    if args.dry_run:
        p = plan(kind, ident, args)
        rec = p["recorded"]
        lines = [f"{p['ref']}  (dry run: no request made)", f"record: {p['record']}"]
        lines += [f"would request: {u}" for u in p["would_request"]]
        lines.append(f"User-Agent: {p['user_agent']}")
        if rec:
            lines += [f"recorded in photos.toml as {rec['file']} ({rec['verified_on']}):",
                      f"  licence: {rec['licence']}", f"  credit:  {rec['credit']}", f"  px:      {rec['px']}"]
        else:
            lines.append("not in photos.toml: licence and credit will be read from the record")
        emit(p, "\n".join(lines))
        return 0

    rec = recorded(kind, ident)
    name = args.name or (re.sub(r"\.\w+$", "", rec["file"]) if rec else slug(ident))
    args.out.mkdir(parents=True, exist_ok=True)
    try:
        got = fetch_cds(ident, args.size, args.out, name, args.browser) if kind == "cds" else fetch_commons(ident, args.width)
    except (urllib.error.URLError, RuntimeError, OSError, json.JSONDecodeError) as exc:
        emit({"ok": False, "ref": f"{kind}:{ident}", "error": str(exc)}, f"photo_fetch.py: {exc}")
        return 1
    ctype = got["ctype"].split(";")[0].strip().lower()
    if not ctype.startswith("image/"):
        emit({"ok": False, "ref": f"{kind}:{ident}", "error": f"got {ctype or 'no content type'}, not an image"},
             f"photo_fetch.py: {got['file_url']} returned {ctype or 'no content type'}, not an image")
        return 1
    ext = EXT.get(ctype, ".bin")
    path = args.out / f"{name}{ext}"
    path.write_bytes(got["data"])
    px = image_size(got["data"]) or [0, 0]
    entry = {"subject": rec["subject"] if rec else got["subject"], "file": path.name,
             "source_url": rec["source_url"] if rec else got["record"], "licence": got["licence"],
             "credit": got["credit"], "verified_on": dt.date.today().isoformat(), "px": px}
    notes = []
    if rec and (rec["licence"] != got["licence"]):
        notes.append(f"licence differs from photos.toml ({rec['licence']!r}); check the record by eye")
    if ext not in (".jpg", ".png"):
        notes.append(f"{ext} is not for slides: convert to JPEG (and photos.toml wants .jpg or .png)")
    added = append_entry(entry) if args.record and ext in (".jpg", ".png") else False
    human = "\n".join([f"saved {path} ({px[0]}x{px[1]}, {len(got['data']) // 1024} KB)",
                       f"licence: {entry['licence']}", f"credit:  {entry['credit']}"]
                      + (["added to photos.toml"] if added else [] if not args.record else ["already in photos.toml"])
                      + notes + ([] if args.record else ["", toml_entry(entry).rstrip()]))
    emit({"ok": True, "ref": f"{kind}:{ident}", "path": str(path), "entry": entry, "recorded": added,
          "notes": notes, "meta": got.get("meta")}, human)
    return 0


if __name__ == "__main__":
    sys.exit(main())
