# The landing page generator as deploy.yml ran it inline until 2026-10-21 (the assemble job,
# "Write index.html"), kept verbatim: tests/test_site_index.py checks that scripts/site_index.py
# writes the same page for a site without a PPTX. Run from the checkout root, site/ beside it.
import html, pathlib, re, tomllib
# the link text is the talk's label (date and name) from talk-labels.toml, keyed by
# its slug (the directory name without its date), else its directory name; newest
# first by that text
f = pathlib.Path("talk-labels.toml")
labels = tomllib.loads(f.read_text()).get("labels", {}) if f.is_file() else {}
talks = [d.name for d in pathlib.Path("talks").iterdir() if (pathlib.Path("site") / d.name / "index.html").is_file()]
slug = lambda n: re.sub(r"^\d{4}_\d{2}_\d{2}_", "", n)
rows = sorted(((str(labels.get(slug(n)) or n), n) for n in talks), reverse=True)
items = [f'<li><a href="./{n}/">{html.escape(label)}</a></li>' for label, n in rows]
page = ("<!doctype html><html lang=lt><meta charset=utf-8>"
        "<meta name=viewport content='width=device-width,initial-scale=1'>"
        "<title>Paskaitos ir pranešimai</title>"
        "<style>:root{color-scheme:light dark;--fg:#1d1f24;--line:#e5e7eb;--link:#1d4ed8;--bg:#fff}"
        "@media(prefers-color-scheme:dark){:root{--fg:#e5e7eb;--line:#2a2f3a;--link:#93c5fd;--bg:#0f1115}}"
        "body{font-family:system-ui,sans-serif;background:var(--bg);color:var(--fg);max-width:46rem;margin:3.5rem auto;padding:0 1rem;line-height:1.4}"
        "h1{font-size:1.6rem;font-weight:650;margin:0 0 1.5rem}ul{list-style:none;padding:0;margin:0}"
        "li{padding:.85rem 0;border-top:1px solid var(--line)}li:last-child{border-bottom:1px solid var(--line)}"
        "a{color:var(--link);font-weight:700;font-size:1.08rem;text-decoration:none;overflow-wrap:anywhere}a:hover{text-decoration:underline}</style>"
        "<h1>Paskaitos ir pranešimai</h1><ul>" + "".join(items) + "</ul>")
pathlib.Path("site/index.html").write_text(page + "\n")
# a renamed talk's old address ([redirects] old dir = new dir) sends the browser on to
# the new one, its #/N slide kept; never indexed, and never over a talk that is built
import json
redirects = tomllib.loads(f.read_text()).get("redirects", {}) if f.is_file() else {}
for old, new in redirects.items():
    if not re.fullmatch(r"\w+", old) or not re.fullmatch(r"\w+", str(new)):
        print(f"::warning::redirect {old!r} = {new!r} is not two directory names; skipped"); continue
    if (pathlib.Path("site") / old).exists() or not (pathlib.Path("site") / new / "index.html").is_file():
        print(f"::warning::redirect {old} -> {new} skipped (the old one is built, or the new one is not)"); continue
    to = f"../{new}/"
    (pathlib.Path("site") / old).mkdir()
    (pathlib.Path("site") / old / "index.html").write_text(
        "<!doctype html><html><meta charset=utf-8><meta name=robots content=noindex>"
        f"<link rel=canonical href='{html.escape(to)}'>"
        f"<meta http-equiv=refresh content='0; url={html.escape(to)}'>"
        f"<title>{html.escape(new)}</title>"
        f"<script>location.replace({json.dumps(to)} + location.search + location.hash)</script>"
        f"<p><a href='{html.escape(to)}'>{html.escape(new)}</a></p>\n")
    print(f"redirect {old}/ -> {new}/")
