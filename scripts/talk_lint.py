#!/usr/bin/env python3
"""Lint a talk: language, wording, density, sources, timing and fact citations.

Usage:
    python3 scripts/talk_lint.py <talk-dir | talk name> [--release] [--json] [--facts PATH]
    pnpm talk lint <talk> [--release] [--json]

Read-only and deterministic (stdlib, well under a second per deck). Each
finding has a code, a severity, the file and line, and the slide number as
Slidev counts it (hidden slides are not counted).

  CYRILLIC       error    Cyrillic letters in any talk file
  LHCB-UPPER     error    'LHCb' inside text the stage kit (or the talk's CSS) sets
                          uppercase: cover title, subtitle and .mt-md byline,
                          section title and its line, .kicker. Wrap it in a class
                          the talk's CSS sets to text-transform: none
  EMOJI-HEADING  warning  emoji in a heading
  SLOP-*         warning  'X, not Y' (English decks); stock phrases ("Here's the
                          thing", "Let that sink in", PHRASES); data that 'tells'
                          or 'whispers'; banned words: cosmos, journey, unlock,
                          delve, tapestry, unleash, embark, realm, game-changer,
                          mind-blowing, paradigm shift, testament to (BANNED). On
                          screen; phrases and banned words also in the notes
  WORDS          warning  more than 60 words on screen (backup slides excepted)
  FONT-SMALL     warning  a talk CSS or inline font size under 18 px outside
                          .src, .credit and .k
  NO-SRC         warning  a content slide without a .src line (15 words or more,
                          or a number on it). With `sources: notes` in the
                          headmatter (the deck keeps its sources in the
                          notes) a 'Sources:' / 'Šaltiniai:' line in the
                          slide's notes is asked for instead
  CHECK          warning  an open mark left in the deck below the headmatter
                          (OPEN_MARKS): [CHECK…], [PATIKSLINTI…] (a question
                          for the owner), [ASR…] (a quote from an automatic
                          transcript, not re-listened yet), [TODO…]; an error
                          with --release
  CHECK-OPTIONAL warning  an open mark the deck calls optional, right after
                          the mark, in the notes (or another comment):
                          [CHECK, optional: …], [PATIKSLINTI, neprivaloma: …];
                          a warning with --release too. On screen it is a
                          CHECK: Slidev shows the bracket as it is
  TIME-OVER      error    the timed notes ('(~N min)', '(N min)', '(m:ss)', dot
                          or comma decimals) plus clip lengths (manifest trim,
                          else public/video-frames/index.json) exceed the
                          headmatter duration by more than 5%
  TIME-NODUR     warning  no `duration` in the headmatter (a 'N-minute' phrase
                          in `info` or the first notes is used meanwhile)
  FACT-UNKNOWN   error    a cited fact id (<!-- facts: a, b -->) not in the bank
  FACT-UNUSABLE  error    a cited fact whose verdict is not confirmed/corrected
  FACT-NOTES     warning  the facts comment is the slide's last comment, so
                          Slidev shows it as the speaker notes
  SLIDE-REF      warning  'slide N' / 'skaidrė N' past the last slide
  LT-ENGLISH     warning  (lt decks) English UI words: Part, Thank you, Questions
  LT-QUOTES      warning  (lt decks) straight or English quotes instead of „…“
  LT-DECIMAL     warning  (lt decks) a decimal point instead of a comma
  LT-THOUSANDS   warning  (lt decks) digits not grouped with a no-break or thin
                          space (12 639), or grouped with a comma
  LT-WORD        warning  (lt decks) a word the talks avoid (LT_WORDS), on
                          screen or in the notes

A deck is Lithuanian when its headmatter says `lang: lt` (or `htmlAttrs:
{lang: lt}`), else when its text is. Em dashes are fine in Lithuanian and
are not flagged anywhere.

Exit 0 with no errors (warnings allowed), 1 with errors, 2 on a usage error.
--json prints one JSON object on stdout and the human report on stderr.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import facts as factsbank           # noqa: E402
import talk_deck as td              # noqa: E402

MAX_WORDS = 60
MIN_PX = 18.0
SMALL_OK = ("src", "credit", "k")          # classes allowed below MIN_PX
NON_CONTENT = {"cover", "section", "statement", "quote", "fact", "intro", "end", "center-bkg", "iframe"}
BANNED = ("cosmos", "journey", "unlock", "unlocks", "unlocked", "unlocking", "delve", "delves",
          "tapestry", "unleash", "unleashes", "embark", "embarks", "realm", "game-changer",
          "game changer", "mind-blowing", "paradigm shift", "testament to")
PHRASES = ("here's the thing", "here is the thing", "let that sink in", "make no mistake",
           "buckle up", "at the end of the day", "it's worth noting", "needless to say",
           "in today's fast-paced", "the best part?")
ANTHRO = re.compile(r"\b(?:the\s+)?(data|numbers?|plots?|histograms?|peaks?|signals?|detectors?|charts?|figures?)\s+"
                    r"(tells?|whispers?|speaks?|wants?|knows?|decides?|remembers?|refuses?|insists?|screams?|"
                    r"sings?|dreams?|begs?|hides?|loves?|hates?)\b", re.I)
NOT_Y = re.compile(r"\b[\w’']+(?:\s+[\w’']+){0,5},\s+not\s+(?:a\s+|an\s+|the\s+)?[\w’']+", re.I)
CYRILLIC = re.compile(r"[Ѐ-ԯⷠ-ⷿꙀ-ꚟ]+")
EMOJI = re.compile("[\U0001F000-\U0001FAFF☀-➿⬅-⭕⌚⌛⏩-⏺️]")
LT_LETTERS = re.compile(r"[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]")
LT_ENGLISH = re.compile(r"\b(Part|Thank you|Thanks|Questions?|Q&A)\b(?![\w-])")
SLIDE_REF = re.compile(r"\b(?:slides?|skaidr\w*)\s+(\d{1,3})\b", re.I)
OPEN_MARKS = ("CHECK", "PATIKSLINTI", "ASR", "TODO")     # [CHECK], [ASR: re-listen], …: still to settle
OPEN_MARK = re.compile(r"\[(?:%s)\b" % "|".join(OPEN_MARKS))
# [CHECK, optional: …], [PATIKSLINTI, neprivaloma: …]: a question the talk can go without
OPTIONAL_MARK = re.compile(r"\[(?:%s)\b[\s,;:(–—-]{0,3}(?i:optional|neprivalom\w*)\b" % "|".join(OPEN_MARKS))
SOURCES = ("slides", "notes")                            # headmatter `sources:` where a slide's sources are
NOTES_SRC = re.compile(r"(?im)^[ \t]*(?:[-*•][ \t]*)?(?:sources?|šaltin(?:is|iai)|references?)"
                       r"(?:[ \t]*\([^)\n]*\))?[ \t]*:")
LHCB = re.compile(r"LHCb")

LT_WORDS = {   # Lithuanian words with a meaning the talk does not want
    "kolaborant": "'kolaborantai' means collaborators with an occupier; say 'kolaboracijos nariai'",
}


@dataclass(frozen=True)
class Ctx:
    """The element a CSS rule styles: layout, tag, classes, the classes and
    tags of the elements it must sit inside, and the section's 'h1 + p'."""
    layout: str | None = None
    tag: str | None = None
    classes: frozenset = frozenset()
    adjacent: bool = False
    ancestors: tuple = ()          # ((tag or None, frozenset(classes)), ...)


# Text the stage kit sets uppercase (slidev-addon-stage styles/index.css).
KIT_UPPER = [
    Ctx("cover", "h1"), Ctx("cover", "h2"), Ctx("cover", None, frozenset({"mt-md"})),
    Ctx("section", "h1"), Ctx("section", "p", adjacent=True), Ctx("section", None, frozenset({"sub"})),
    Ctx("statement", None, frozenset({"mt-md"})), Ctx(None, None, frozenset({"kicker"})),
]


@dataclass
class Finding:
    code: str
    severity: str
    message: str
    file: str
    line: int | None = None
    slide: int | None = None


class Lint:
    def __init__(self, talk: Path, release: bool, facts_path: Path):
        self.talk = talk
        self.release = release
        self.facts_path = facts_path
        self.deck = td.parse_deck(talk / "deck.md")
        self.findings: list[Finding] = []
        self.css = self._load_css()
        self.upper = self._contexts("uppercase")
        self.keep = self._contexts("none")
        self.lang = self._lang()
        self.sources = self._sources()
        self.timing: dict = {}

    # ---------------------------------------------------------------- utils
    def add(self, code, severity, message, file="deck.md", line=None, slide=None):
        self.findings.append(Finding(code, severity, message, file, line, slide))

    def at(self, s: td.Slide, offset: int, code, severity, message):
        self.add(code, severity, message, "deck.md", s.line_at(offset), s.number)

    def _load_css(self):
        rules = []
        for f in sorted((self.talk / "styles").glob("*.css")) if (self.talk / "styles").is_dir() else []:
            rules += css_rules(f.read_text(encoding="utf-8"), f.relative_to(self.talk).as_posix(), 1)
        for m in re.finditer(r"<style\b[^>]*>([\s\S]*?)</style\s*>", self.deck.text, re.I):
            line = self.deck.text.count("\n", 0, m.start(1)) + 1
            rules += css_rules(m.group(1), "deck.md", line)
        return rules

    def _lang(self) -> str:
        hm = self.deck.headmatter
        attrs = hm.get("htmlAttrs") if isinstance(hm.get("htmlAttrs"), dict) else {}
        lang = hm.get("lang") or attrs.get("lang")
        if lang:
            return str(lang).lower()[:2]
        words = lt = 0
        for s in self.deck.visible:
            for w in td.WORD.findall(td.screen_text(s.body) + " " + s.notes):
                words += 1
                lt += bool(LT_LETTERS.search(w))
        return "lt" if words and lt / words >= 0.08 else "en"

    def _sources(self) -> str:
        val = self.deck.headmatter.get("sources")
        if val is None:
            return "slides"
        if str(val).strip().lower() in SOURCES:
            return str(val).strip().lower()
        self.add("NO-SRC", "warning", f"headmatter `sources: {val}` is neither slides nor notes; read as slides",
                 "deck.md", 1)
        return "slides"

    # --------------------------------------------------------------- checks
    def run(self):
        self.check_cyrillic()
        self.check_css_sizes()
        bank = self._bank()
        n_visible = len(self.deck.visible)
        for s in self.deck.slides:
            if s.number is None:
                continue
            body = s.body
            screen = td.screen_text(body, markers=True)
            text = td.screen_text(body, ("src", "credit"))
            self.check_upper(s, screen)
            self.check_headings(s, screen)
            self.check_slop(s, text)
            self.check_words_and_sources(s, text)
            self.check_inline_sizes(s)
            self.check_marks(s, n_visible)
            self.check_facts(s, bank)
            if self.lang == "lt":
                self.check_lt(s, text)
        self.check_timing()
        self.findings.sort(key=lambda f: (f.file != "deck.md", f.file, f.line or 0, f.code))
        return self

    def check_cyrillic(self):
        for f in td.talk_files(self.talk):
            try:
                text = f.read_text(encoding="utf-8")
            except (UnicodeDecodeError, OSError):
                continue
            rel = f.relative_to(self.talk).as_posix()
            hits = 0
            for n, line in enumerate(text.splitlines(), 1):
                m = CYRILLIC.search(line)
                if not m:
                    continue
                hits += 1
                if hits <= 20:
                    s = self.deck.slide_of_line(n) if rel == "deck.md" else None
                    self.add("CYRILLIC", "error", f"Cyrillic text {m.group(0)!r}", rel, n, s.number if s else None)
            if hits > 20:
                self.add("CYRILLIC", "error", f"{hits - 20} more lines with Cyrillic", rel)

    def check_css_sizes(self):
        for r in self.css:
            for m in re.finditer(r"font-size\s*:\s*([\d.]+)px", r.decls):
                px = float(m.group(1))
                if px >= MIN_PX:
                    continue
                parts = [p.strip() for p in r.selector.split(",")]
                bad = [p for p in parts if not any(re.search(rf"\.{c}(?![\w-])", p) for c in SMALL_OK)]
                if bad:
                    self.add("FONT-SMALL", "warning",
                             f"{px:g}px on {', '.join(bad)} (floor {MIN_PX:g}px outside .src, .credit, .k)",
                             r.file, r.line)

    def check_inline_sizes(self, s: td.Slide):
        for el in td.elements(s.body):
            m = re.search(r"font-size\s*:\s*([\d.]+)px", el.style)
            if m and float(m.group(1)) < MIN_PX and not el.classes & set(SMALL_OK):
                self.at(s, el.start, "FONT-SMALL", "warning", f"inline font-size {m.group(1)}px on <{el.tag}>")

    def _contexts(self, transform: str):
        out = list(KIT_UPPER) if transform == "uppercase" and td.is_stage(self.deck) else []
        for r in self.css:
            if re.search(rf"text-transform\s*:\s*{transform}\b", r.decls):
                for part in r.selector.split(","):
                    c = selector_context(part)
                    if c:
                        out.append(c)
        return out

    def check_upper(self, s: td.Slide, screen: str):
        upper, keep = self.upper, self.keep
        if not upper:
            return
        layout = s.layout
        els = td.elements(s.body)

        def inside(a, b, anc):
            return all(any(e.start < a and e.end >= b and (t is None or t == e.tag) and c <= e.classes for e in els)
                       for t, c in anc)

        def matches(c: Ctx, tag, classes, a, b):
            return (not c.adjacent and (c.layout is None or c.layout == layout) and (c.tag is None or c.tag == tag)
                    and c.classes <= classes and inside(a, b, c.ancestors))

        def kept(tag, classes, a, b):       # the talk's CSS sets this element back to text-transform: none
            return any(matches(c, tag, classes, a, b) for c in keep)

        regions = []           # (start, end, what)
        for el in els:
            c = next((c for c in upper if matches(c, el.tag, el.classes, el.start, el.end)), None)
            if c and not kept(el.tag, el.classes, el.start, el.end):
                regions.append((el.inner_start, el.inner_end, describe(c.layout, c.tag or el.tag, c.classes)))
        first_h1_end = None
        for m in re.finditer(r"(?m)^(#{1,6})[ \t]+(.+)$", screen):
            tag = f"h{len(m.group(1))}"
            if tag == "h1" and first_h1_end is None:
                first_h1_end = m.end()
            c = next((c for c in upper if not c.classes and matches(c, tag, frozenset(), m.start(), m.end())), None)
            if c and not kept(tag, frozenset(), m.start(), m.end()):
                regions.append((m.start(2), m.end(2), describe(c.layout, tag, c.classes)))
        if first_h1_end is not None and any(c.adjacent and (c.layout is None or c.layout == layout) for c in upper):
            p = re.search(r"\S[\s\S]*?(?=\n[ \t]*\n|\Z)", screen[first_h1_end:])
            if p:
                regions.append((first_h1_end + p.start(), first_h1_end + p.end(), f"{layout} line under the title"))
        protected = [(el.start, el.end) for el in els
                     if any(c.classes and matches(c, el.tag, el.classes, el.start, el.end) for c in keep)]
        seen = set()
        for a, b, what in regions:
            for m in LHCB.finditer(screen, a, b):
                if m.start() in seen or any(x <= m.start() < y for x, y in protected):
                    continue
                seen.add(m.start())
                self.at(s, m.start(), "LHCB-UPPER", "error",
                        f"'LHCb' in the {what} renders as 'LHCB'; wrap it in a class with "
                        f"text-transform: none (e.g. <span class=\"nc\">LHCb</span> and html[data-stage] .nc {{ text-transform: none }})")

    def check_headings(self, s: td.Slide, screen: str):
        for m in re.finditer(r"(?m)^#{1,6}[ \t]+(.+)$", screen):
            e = EMOJI.search(m.group(1))
            if e:
                self.at(s, m.start(), "EMOJI-HEADING", "warning", f"emoji {e.group(0)!r} in a heading")
        for el in td.elements(s.body):
            if re.fullmatch(r"h[1-6]", el.tag):
                e = EMOJI.search(screen[el.inner_start:el.inner_end])
                if e:
                    self.at(s, el.start, "EMOJI-HEADING", "warning", f"emoji {e.group(0)!r} in a heading")

    def check_slop(self, s: td.Slide, text: str):
        if self.lang != "lt":
            for m in NOT_Y.finditer(text):
                self.at(s, m.start(), "SLOP-NOT", "warning", f"'X, not Y' construction: {squash(m.group(0))!r}")
        for m in ANTHRO.finditer(text):
            self.at(s, m.start(), "SLOP-ANTHRO", "warning", f"data given a will: {squash(m.group(0))!r}")
        notes = s.content[s.notes_offset:] if s.notes_offset >= 0 else ""
        for where, src, base in (("", text, 0), ("notes: ", notes, max(s.notes_offset, 0))):
            low = src.lower().replace("’", "'")
            for ph in PHRASES:
                for m in re.finditer(re.escape(ph), low):
                    self.at(s, base + m.start(), "SLOP-PHRASE", "warning", f"{where}stock phrase {ph!r}")
            for w in BANNED:
                for m in re.finditer(rf"(?<![\w-]){re.escape(w)}(?![\w-])", low):
                    self.at(s, base + m.start(), "SLOP-WORD", "warning", f"{where}banned word {w!r}")

    def check_words_and_sources(self, s: td.Slide, text: str):
        n = td.count_words(text)
        backup = "backup" in s.classes
        if n > MAX_WORDS and not backup:
            self.add("WORDS", "warning", f"{n} words on screen (at most {MAX_WORDS})", "deck.md", s.content_line, s.number)
        is_video = bool(td.VIDEO.search(s.body))
        if s.layout not in NON_CONTENT and not is_video and (n >= 15 or (n >= 3 and re.search(r"\d", text))):
            if any("src" in el.classes for el in td.elements(s.body)):
                return
            in_notes = NOTES_SRC.search(s.notes)
            if self.sources == "notes":
                if not in_notes:
                    label = "Šaltiniai:" if self.lang == "lt" else "Sources:"
                    self.add("NO-SRC", "warning", f"content slide ({n} words) without a '{label}' line in its notes "
                             "(the headmatter says sources: notes)", "deck.md", s.content_line, s.number)
            else:
                self.add("NO-SRC", "warning", f"content slide ({n} words) without a .src line"
                         + (f"; its notes have a '{squash(in_notes.group(0))}' line, so if the deck keeps its "
                            "sources there, say `sources: notes` in the headmatter" if in_notes else ""),
                         "deck.md", s.content_line, s.number)

    def check_marks(self, s: td.Slide, n_visible: int):
        hidden = td.comment_spans(s.content)                # the notes and any other comment: not on screen
        for m in OPEN_MARK.finditer(s.content):
            block = re.match(r"\[[^\]]{0,300}\]?", s.content[m.start():]).group(0)
            optional = OPTIONAL_MARK.match(s.content, m.start())
            if optional and any(a <= m.start() < b for a, b in hidden):
                self.at(s, m.start(), "CHECK-OPTIONAL", "warning", f"optional question: {squash(block)[:110]!r}")
            else:
                self.at(s, m.start(), "CHECK", "error" if self.release else "warning",
                        f"open check{' on screen (optional only in the notes or a comment)' if optional else ''}: "
                        f"{squash(block)[:110]!r}")
        for m in SLIDE_REF.finditer(s.content):
            if int(m.group(1)) > n_visible:
                self.at(s, m.start(), "SLIDE-REF", "warning",
                        f"{m.group(0)!r} but the deck has {n_visible} slides")

    def _bank(self):
        if not self.facts_path.is_file():
            return None
        entries, _ = factsbank.load_bank(self.facts_path)
        return factsbank.by_id(entries)

    def check_facts(self, s: td.Slide, bank):
        cites = list(factsbank.CITE_RE.finditer(s.content))
        if not cites:
            return
        if s.notes.lower().startswith(("facts:", "fact:")):
            self.at(s, s.notes_offset, "FACT-NOTES", "warning",
                    "the facts comment is the slide's last comment, so Slidev shows it as the notes; put it above the notes")
        if bank is None:
            self.at(s, cites[0].start(), "FACT-UNKNOWN", "warning", f"no facts bank at {self.facts_path}")
            return
        for m in cites:
            for fid in factsbank.cited_ids(m.group(0)):
                e = bank.get(fid)
                if e is None:
                    self.at(s, m.start(), "FACT-UNKNOWN", "error", f"fact {fid!r} is not in the bank")
                elif e.get("verdict") not in factsbank.USABLE:
                    self.at(s, m.start(), "FACT-UNUSABLE", "error", f"fact {fid!r} is {e.get('verdict')}")

    def check_lt(self, s: td.Slide, text: str):
        for stem, why in LT_WORDS.items():
            for m in re.finditer(rf"(?i)\b{stem}\w*", s.content):
                self.at(s, m.start(), "LT-WORD", "warning", why)
        for m in LT_ENGLISH.finditer(text):
            self.at(s, m.start(), "LT-ENGLISH", "warning", f"English {m.group(0)!r} on a Lithuanian slide")
        for m in re.finditer(r"\"[^\"\n]*\"|\"|“[^„“”\n]*”", text):
            self.at(s, m.start(), "LT-QUOTES", "warning", "use „…“ quotes in Lithuanian, not " + repr(m.group(0)[:20]))
        for m in re.finditer(r"(?<![\w.,:/#-])\d+\.\d+(?![\w.]|\.\d)", text):
            self.at(s, m.start(), "LT-DECIMAL", "warning", f"decimal comma in Lithuanian: {m.group(0).replace('.', ',')} not {m.group(0)}")
        for m in re.finditer(r"(?<![\w.,:/#-])\d{1,3}(?:,\d{3})+(?![\d,]|\.\d)", text):
            self.at(s, m.start(), "LT-THOUSANDS", "warning",
                    f"{m.group(0)!r} reads as a decimal in Lithuanian; group with a no-break or thin space")
        for m in re.finditer(r"(?<![\w.,:/#-])\d{5,}(?![\w.,])", text):
            self.at(s, m.start(), "LT-THOUSANDS", "warning", f"group the digits of {m.group(0)} with a no-break or thin space")
        for m in re.finditer(r"(?<![\w.,:/#-])\d{1,3}(?: \d{3})+(?![\d])", text):
            self.at(s, m.start(), "LT-THOUSANDS", "warning",
                    f"{m.group(0)!r} groups with a plain space, which can break across lines; use &nbsp; or a thin space")

    def check_timing(self):
        clips = td.clip_durations(self.talk)
        per, total, untimed = [], 0.0, 0
        for s in self.deck.visible:
            t = td.slide_time(s, clips)
            total += t.minutes
            untimed += not t.timed
            per.append({"slide": s.number, "minutes": round(t.minutes, 2), "clip": t.clip,
                        "clip_seconds": t.clip_seconds, "clip_source": t.clip_source})
        dur, where = td.deck_duration(self.deck)
        self.timing = {"total_minutes": round(total, 2), "duration_minutes": dur, "duration_source": where,
                       "limit_minutes": round(dur * 1.05, 2) if dur else None,
                       "untimed_slides": untimed, "slides": per}
        if where != "headmatter duration":
            msg = "no `duration` in the headmatter (e.g. duration: 30min)"
            if dur:
                msg += f"; using {dur:g} min {where}"
            self.add("TIME-NODUR", "warning", msg, "deck.md", 1)
        if dur and total > dur * 1.05:
            clip_min = sum((p["clip_seconds"] or 0) for p in per) / 60
            self.add("TIME-OVER", "error",
                     f"{total:.1f} min of timed notes and clips ({clip_min:.1f} min of clips) for a {dur:g}-min slot "
                     f"(limit {dur * 1.05:.1f})", "deck.md", 1)

    # --------------------------------------------------------------- report
    def report(self) -> dict:
        errors = sum(f.severity == "error" for f in self.findings)
        warnings = len(self.findings) - errors
        counts = {}
        for f in self.findings:
            counts[f.code] = counts.get(f.code, 0) + 1
        return {"talk": self.talk.name, "path": str(self.talk), "lang": self.lang, "release": self.release,
                "ok": errors == 0, "errors": errors, "warnings": warnings, "counts": counts,
                "slides": len(self.deck.visible), "timing": {k: v for k, v in self.timing.items() if k != "slides"},
                "findings": [asdict(f) for f in self.findings]}

    def human(self) -> str:
        lines = []
        for f in self.findings:
            where = f"{f.file}:{f.line}" if f.line else f.file
            sl = f"slide {f.slide}" if f.slide else ""
            lines.append(f"{where:<22} {sl:<9} {'E' if f.severity == 'error' else 'W'} {f.code:<14} {f.message}")
        t = self.timing
        dur = f"{t['duration_minutes']:g} min ({t['duration_source']})" if t.get("duration_minutes") else "no duration"
        r = self.report()
        lines.append(f"{self.talk.name}: {r['slides']} slides, lang {self.lang}, timed {t['total_minutes']:.1f} min "
                     f"against {dur}, {t['untimed_slides']} slides untimed")
        lines.append(f"{r['errors']} error(s), {r['warnings']} warning(s)"
                     + (" — " + ", ".join(f"{k} {v}" for k, v in sorted(r["counts"].items())) if r["counts"] else ""))
        return "\n".join(lines)


# ------------------------------------------------------------------ CSS

@dataclass
class Rule:
    selector: str
    decls: str
    file: str
    line: int


def css_rules(text: str, file: str, line0: int) -> list[Rule]:
    """Flat style rules, @media/@supports/@layer opened, @keyframes and @font-face skipped."""
    text = re.sub(r"/\*[\s\S]*?\*/", lambda m: re.sub(r"[^\n]", " ", m.group(0)), text)
    out, i, n = [], 0, len(text)
    while i < n:
        j = text.find("{", i)
        if j < 0:
            break
        sel = text[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            depth += {"{": 1, "}": -1}.get(text[k], 0)
            k += 1
        inner = text[j + 1:k - 1]
        line = line0 + text.count("\n", 0, i + (len(text[i:j]) - len(text[i:j].lstrip())))
        if sel.startswith(("@media", "@supports", "@layer", "@container")):
            out += css_rules(inner, file, line0 + text.count("\n", 0, j + 1))
        elif not sel.startswith("@") and sel:
            out.append(Rule(sel, inner, file, line))
        i = k
    return out


def selector_context(sel: str) -> Ctx | None:
    """The element a selector styles, or None when it styles a whole layout or nothing."""
    sel = re.sub(r"::?[\w-]+(?:\([^)]*\))?", "", sel)
    sel = re.sub(r"\[[^\]]*\]", "", sel)
    sel = re.sub(r"(?<![\w.#-])html(?![\w-])", " ", sel).strip()
    if not sel:
        return None
    layout = None
    m = re.search(r"\.slidev-layout\.([\w-]+)|\.(cover|section|statement|fact|quote|intro)(?![\w-])", sel)
    if m:
        layout = m.group(1) or m.group(2)
    tokens = [t for t in re.split(r"\s*([>+~])\s*|\s+", sel) if t]
    last = tokens[-1]
    adjacent = len(tokens) >= 3 and tokens[-2] == "+" and re.match(r"^h1\b", tokens[-3]) is not None

    def compound(t):
        tm = re.match(r"^([a-zA-Z][\w-]*)", t)
        return (tm.group(1).lower() if tm else None), frozenset(re.findall(r"\.([\w-]+)", t))

    tag, classes = compound(last)
    if "slidev-layout" in classes or (not tag and not classes) or tag in ("html", "body"):
        return None
    ancestors = []
    for t in tokens[:-1] if not adjacent else tokens[:-3]:
        if t in ">+~":
            continue
        at, ac = compound(t)
        ac = ac - {"slidev-layout", "slidev-page", layout or ""}
        if (at and at not in ("html", "body")) or ac:
            ancestors.append((at if at not in ("html", "body") else None, ac))
    return Ctx(layout, tag, classes, adjacent, tuple(ancestors))


def describe(layout, tag, classes) -> str:
    bits = ([layout] if layout else []) + ([tag] if tag else []) + (["." + ".".join(sorted(classes))] if classes else [])
    return " ".join(bits) or "uppercased text"


def squash(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip()


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(prog="talk_lint.py", description="Lint a talk deck (see the module docstring for codes).")
    ap.add_argument("talk", help="talk directory, or a talk name under talks/")
    ap.add_argument("--release", action="store_true",
                    help="venue gate: open marks (" + ", ".join(f"[{m}]" for m in OPEN_MARKS) + ") are errors, "
                    "except optional ones in the notes ([CHECK, optional: …], [PATIKSLINTI, neprivaloma: …])")
    ap.add_argument("--json", action="store_true", help="one JSON object on stdout, the report on stderr")
    ap.add_argument("--facts", type=Path, default=factsbank.BANK, help=f"facts bank (default {factsbank.BANK})")
    try:
        args = ap.parse_args(argv)
    except SystemExit as exc:
        return 2 if exc.code else 0
    try:
        talk = td.resolve_talk(args.talk)
    except td.UsageError as exc:
        print(f"talk_lint: {exc}", file=sys.stderr)
        return 2
    lint = Lint(talk, args.release, args.facts).run()
    if args.json:
        print(json.dumps(lint.report(), ensure_ascii=False, indent=1))
        print(lint.human(), file=sys.stderr)
    else:
        print(lint.human())
    return 0 if lint.report()["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
