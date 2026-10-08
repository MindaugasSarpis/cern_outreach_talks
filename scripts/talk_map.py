#!/usr/bin/env python3
"""The map of a talk: one line per slide, numbered as Slidev numbers them.

Usage:
    python3 scripts/talk_map.py <talk-dir | talk name> [--json]
    pnpm talk map <talk> [--json]

Columns: slide number, deck.md line, title, layout, clicks, the `space.at`
pose (a dot where the slide keeps the previous pose), the clip a
VideoPlayer plays, and minutes (timed notes plus the clip's length, as
talk_lint.py counts them). So "slide 14" resolves without reading the deck.

Exit 0, or 2 on a usage error. --json prints one JSON object on stdout.
"""
from __future__ import annotations

import argparse
import html
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import talk_deck as td              # noqa: E402

V_CLICK = re.compile(r"\bv-click\b(?!s)|<v-click\b(?!s)")
V_CLICKS = re.compile(r"<v-clicks\b[^>]*>([\s\S]*?)</v-clicks>")


def title_of(s: td.Slide) -> str:
    text = td.screen_text(s.body, ("src", "credit"), markers=True)
    heads = [m.group(2).strip() for m in re.finditer(r"(?m)^(#{1,6})[ \t]+(.+)$", text)]
    h1 = [m.group(1).strip() for m in re.finditer(r"(?m)^#[ \t]+(.+)$", text)]
    if s.layout == "cover" and len(h1) >= 2:
        t = h1[1]
    elif heads:
        t = heads[0]
    else:
        for el in td.elements(s.body):
            if re.fullmatch(r"h[1-6]", el.tag) or "kicker" in el.classes:
                t = text[el.inner_start:el.inner_end]
                break
        else:
            vm = td.VIDEO.search(s.body)
            first = next((ln.strip() for ln in td.screen_text(s.body, ("src", "credit")).splitlines() if ln.strip()), "")
            prop = re.search(r"<[A-Z]\w*\b[^>]*?\s(?:title|q)=\"([^\"]+)\"", re.sub(r"<!--[\s\S]*?-->", "", s.body))
            if not first and vm:
                return f"[clip] {vm.group(1)}"
            t = first or (prop.group(1).replace("|", " ") if prop else "")   # a component's title prop (ParticleHero, QuizCard)
    t = re.sub(r"\*+|`|(?<![\w])_+|_+(?![\w])", "", t)        # emphasis, not the _ inside names
    t = html.unescape(re.sub(r"\s+", " ", t)).strip()
    return t[:70] + ("…" if len(t) > 70 else "")


def clicks_of(s: td.Slide):
    fm = s.frontmatter.get("clicks")
    if isinstance(fm, int):
        return fm
    body = re.sub(r"<!--[\s\S]*?-->", "", s.body)
    n = len(V_CLICK.findall(body))
    for m in V_CLICKS.finditer(body):
        n += len(re.findall(r"(?m)^\s*(?:[-*+]|\d+\.)\s|<li\b", m.group(1)))
    return n


def build(talk: Path) -> dict:
    deck = td.parse_deck(talk / "deck.md")
    clips = td.clip_durations(talk)
    rows, total = [], 0.0
    for s in deck.visible:
        t = td.slide_time(s, clips)
        total += t.minutes
        at = td.frontmatter_at(s)
        rows.append({
            "slide": s.number, "line": s.start_line, "title": title_of(s), "layout": s.layout,
            "clicks": clicks_of(s), "at": at, "video": t.clip,
            "minutes": round(t.minutes, 2) if t.timed else None,
        })
    dur, where = td.deck_duration(deck)
    hidden = [s.start_line for s in deck.slides if s.number is None]
    return {"talk": talk.name, "path": str(talk), "slides": rows, "hidden_slide_lines": hidden,
            "total_minutes": round(total, 2), "duration_minutes": dur, "duration_source": where}


def fmt_at(at) -> str:
    if at is None:
        return "·"
    if isinstance(at, list):
        return "[" + ", ".join(f"{v:g}" if isinstance(v, (int, float)) else str(v) for v in at) + "]"
    return str(at)


def human(m: dict) -> str:
    lines = [f"{'#':>3} {'line':>5}  {'title':<46} {'layout':<9} {'clk':>3} {'at':<18} {'clip':<24} {'min':>5}"]
    for r in m["slides"]:
        mins = f"{r['minutes']:.2f}" if r["minutes"] is not None else "-"
        lines.append(f"{r['slide']:>3} {r['line']:>5}  {r['title'][:46]:<46} {r['layout'][:9]:<9} {r['clicks']:>3} "
                     f"{fmt_at(r['at'])[:18]:<18} {(r['video'] or '')[:24]:<24} {mins:>5}")
    dur = f"{m['duration_minutes']:g} min ({m['duration_source']})" if m["duration_minutes"] else "no duration set"
    lines.append(f"{m['talk']}: {len(m['slides'])} slides, {m['total_minutes']:.1f} min timed, {dur}"
                 + (f"; hidden slides at lines {', '.join(map(str, m['hidden_slide_lines']))}" if m["hidden_slide_lines"] else ""))
    return "\n".join(lines)


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="talk_map.py", description="One line per slide of a talk.")
    ap.add_argument("talk", help="talk directory, or a talk name under talks/")
    ap.add_argument("--json", action="store_true", help="one JSON object on stdout")
    try:
        args = ap.parse_args(argv)
    except SystemExit as exc:
        return 2 if exc.code else 0
    try:
        talk = td.resolve_talk(args.talk)
    except td.UsageError as exc:
        print(f"talk_map: {exc}", file=sys.stderr)
        return 2
    m = build(talk)
    if args.json:
        print(json.dumps(m, ensure_ascii=False, indent=1))
        print(human(m), file=sys.stderr)
    else:
        print(human(m))
    return 0


if __name__ == "__main__":
    sys.exit(main())
