"""Read a talk directory the way Slidev does: headmatter, slides, notes, timing.

Shared by talk_lint.py and talk_map.py (stdlib only, Python >= 3.11). The
slide split follows @slidev/parser: a line starting with `---` ends a slide;
if the next line is not blank (and the line is not `----`), the lines up to
the next `---` are that slide's frontmatter; fenced code is skipped. The
speaker notes are the last HTML comment when it ends the slide. A slide with
`hide: true` or `disabled: true` is dropped from the numbering, as Slidev
drops it from the deck.

Frontmatter is read by a small YAML subset (block mappings and sequences,
flow `{}`/`[]`, block scalars, plain and quoted scalars), enough for what
decks carry; anything it cannot read stays a string.
"""
from __future__ import annotations

import json
import os
import re
import tomllib
from dataclasses import dataclass, field
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class UsageError(Exception):
    """A bad argument: the caller exits 2."""


# --------------------------------------------------------------------------
# Talk directories

def resolve_talk(arg: str, root: Path = ROOT) -> Path:
    """A talk directory from a path, or from a name under <root>/talks
    (exact, else a unique case-insensitive substring)."""
    p = Path(arg).expanduser()
    if p.is_dir() and (p / "deck.md").is_file():
        return p.resolve()
    if p.is_dir():
        raise UsageError(f"{arg}: no deck.md in this directory")
    talks = sorted(d for d in (root / "talks").glob("*") if (d / "deck.md").is_file())
    name = Path(arg).name.lower()
    exact = [d for d in talks if d.name.lower() == name]
    if exact:
        return exact[0].resolve()
    hits = [d for d in talks if name in d.name.lower()]
    if len(hits) == 1:
        return hits[0].resolve()
    if not hits:
        raise UsageError(f"{arg}: no such talk directory or talk name under {root / 'talks'}")
    raise UsageError(f"{arg}: ambiguous, matches " + ", ".join(d.name for d in hits))


# --------------------------------------------------------------------------
# A YAML subset for frontmatter

def _strip_comment(s: str) -> str:
    quote = None
    for i, ch in enumerate(s):
        if quote:
            if ch == quote:
                quote = None
        elif ch in "'\"":
            quote = ch
        elif ch == "#" and (i == 0 or s[i - 1] in " \t"):
            return s[:i].rstrip()
    return s.rstrip()


_INT = re.compile(r"^[-+]?\d+$")
_FLOAT = re.compile(r"^[-+]?(\d+\.\d*|\.\d+|\d+)([eE][-+]?\d+)?$")


def _scalar(s: str):
    s = s.strip()
    if not s:
        return None
    if len(s) >= 2 and s[0] == s[-1] and s[0] in "'\"":
        body = s[1:-1]
        if s[0] == "'":
            return body.replace("''", "'")
        return body.replace('\\"', '"').replace("\\n", "\n").replace("\\\\", "\\")
    low = s.lower()
    if low in ("true", "yes", "on"):
        return True
    if low in ("false", "no", "off"):
        return False
    if low in ("null", "~"):
        return None
    if _INT.match(s):
        return int(s)
    if _FLOAT.match(s):
        return float(s)
    return s


class _Flow:
    """Recursive descent over a flow collection: { a: 1, b: [2, 3] }."""

    def __init__(self, s: str):
        self.s, self.i = s, 0

    def ws(self):
        while self.i < len(self.s) and self.s[self.i] in " \t\n":
            self.i += 1

    def value(self):
        self.ws()
        ch = self.s[self.i] if self.i < len(self.s) else ""
        if ch == "{":
            return self.mapping()
        if ch == "[":
            return self.sequence()
        return _scalar(self.plain())

    def plain(self, key: bool = False) -> str:
        self.ws()
        if self.i < len(self.s) and self.s[self.i] in "'\"":
            q = self.s[self.i]
            j = self.s.find(q, self.i + 1)
            j = len(self.s) - 1 if j < 0 else j
            out = self.s[self.i:j + 1]
            self.i = j + 1
            return out
        start = self.i
        while self.i < len(self.s):
            ch = self.s[self.i]
            if ch in ",]}":
                break
            if ch == ":" and (self.i + 1 == len(self.s) or self.s[self.i + 1] in " \t,]}") and key:
                break
            self.i += 1
        return self.s[start:self.i].strip()

    def mapping(self):
        out = {}
        self.i += 1
        while True:
            self.ws()
            if self.i >= len(self.s) or self.s[self.i] == "}":
                self.i += 1
                return out
            k = _scalar(self.plain(key=True))
            self.ws()
            v = None
            if self.i < len(self.s) and self.s[self.i] == ":":
                self.i += 1
                v = self.value()
            out[str(k)] = v
            self.ws()
            if self.i < len(self.s) and self.s[self.i] == ",":
                self.i += 1

    def sequence(self):
        out = []
        self.i += 1
        while True:
            self.ws()
            if self.i >= len(self.s) or self.s[self.i] == "]":
                self.i += 1
                return out
            out.append(self.value())
            self.ws()
            if self.i < len(self.s) and self.s[self.i] == ",":
                self.i += 1


def _inline(s: str):
    s = s.strip()
    if s[:1] in "{[":
        try:
            return _Flow(s).value()
        except IndexError:
            return s
    return _scalar(s)


_KEY = re.compile(r"""^(?P<key>"[^"]*"|'[^']*'|[^\s:#'"][^:#]*?)\s*:(?:\s+(?P<rest>.*)|\s*)$""")


def _indent(line: str) -> int:
    return len(line) - len(line.lstrip(" "))


def parse_yaml(text: str) -> dict:
    """Frontmatter as a dict; {} when it is not a mapping."""
    lines = text.replace("\t", "  ").splitlines()
    try:
        value, _ = _block(lines, 0, _first_indent(lines, 0))
    except (ValueError, IndexError):
        return {}
    return value if isinstance(value, dict) else {}


def _first_indent(lines, i):
    while i < len(lines) and not _strip_comment(lines[i]).strip():
        i += 1
    return _indent(lines[i]) if i < len(lines) else 0


def _skip_blank(lines, i):
    while i < len(lines) and not _strip_comment(lines[i]).strip():
        i += 1
    return i


def _block(lines, i, indent):
    i = _skip_blank(lines, i)
    if i >= len(lines):
        return None, i
    if lines[i].lstrip().startswith("- ") or lines[i].strip() == "-":
        return _seq(lines, i, indent)
    return _map(lines, i, indent)


def _map(lines, i, indent):
    out = {}
    while True:
        i = _skip_blank(lines, i)
        if i >= len(lines) or _indent(lines[i]) != indent:
            return out, i
        line = _strip_comment(lines[i]).strip()
        m = _KEY.match(line)
        if not m:
            return out, i
        key = m.group("key").strip("'\"")
        rest = (m.group("rest") or "").strip()
        i += 1
        if rest[:1] in ("|", ">"):
            body, i = _block_scalar(lines, i, indent, fold=rest[0] == ">")
            out[key] = body
        elif rest[:1] in ("{", "[") and rest.count(rest[0]) > rest.count("}" if rest[0] == "{" else "]"):
            # a flow collection over several lines
            parts = [rest]
            while i < len(lines):
                parts.append(_strip_comment(lines[i]).strip())
                i += 1
                joined = " ".join(parts)
                if joined.count("{") <= joined.count("}") and joined.count("[") <= joined.count("]"):
                    break
            out[key] = _inline(" ".join(parts))
        elif rest:
            out[key] = _inline(rest)
        else:
            j = _skip_blank(lines, i)
            if j < len(lines) and _indent(lines[j]) > indent:
                out[key], i = _block(lines, j, _indent(lines[j]))
            elif j < len(lines) and _indent(lines[j]) == indent and lines[j].lstrip().startswith("- "):
                out[key], i = _seq(lines, j, indent)
            else:
                out[key] = None


def _seq(lines, i, indent):
    out = []
    while True:
        i = _skip_blank(lines, i)
        if i >= len(lines) or _indent(lines[i]) != indent or not lines[i].lstrip().startswith("-"):
            return out, i
        item = _strip_comment(lines[i])[indent + 1:]
        rest = item.strip()
        if rest and _KEY.match(rest) and not rest.startswith(("{", "[", "'", '"')):
            # "- key: value" opens a mapping indented past the dash
            sub = [" " * (indent + 2) + rest]
            j = i + 1
            while j < len(lines) and (not lines[j].strip() or _indent(lines[j]) > indent):
                sub.append(lines[j])
                j += 1
            value, _ = _map(sub, 0, indent + 2)
            out.append(value)
            i = j
        elif rest:
            out.append(_inline(rest))
            i += 1
        else:
            j = _skip_blank(lines, i + 1)
            if j < len(lines) and _indent(lines[j]) > indent:
                value, i = _block(lines, j, _indent(lines[j]))
                out.append(value)
            else:
                out.append(None)
                i += 1


def _block_scalar(lines, i, indent, fold):
    body = []
    while i < len(lines) and (not lines[i].strip() or _indent(lines[i]) > indent):
        body.append(lines[i])
        i += 1
    while body and not body[-1].strip():
        body.pop()
    pad = min((_indent(b) for b in body if b.strip()), default=0)
    text = [b[pad:] for b in body]
    if fold:
        return re.sub(r"(?<!\n)\n(?!\n)", " ", "\n".join(text)) + "\n", i
    return "\n".join(text) + "\n", i


# --------------------------------------------------------------------------
# Slides

@dataclass
class Slide:
    index: int                    # 0-based position in the file
    number: int | None            # 1-based as Slidev numbers it; None when hidden
    start_line: int               # 1-based line of the opening `---` (or 1)
    content_line: int             # 1-based line where the content starts
    end_line: int                 # 1-based last line of the slide
    frontmatter: dict = field(default_factory=dict)
    content: str = ""             # everything after the frontmatter, notes included
    notes: str = ""               # the speaker notes (last comment when it ends the slide)
    notes_offset: int = -1        # offset of the notes comment in `content`, -1 if none

    @property
    def hidden(self) -> bool:
        return bool(self.frontmatter.get("hide") or self.frontmatter.get("disabled"))

    @property
    def layout(self) -> str:
        return str(self.frontmatter.get("layout") or ("cover" if self.index == 0 else "default"))

    @property
    def body(self) -> str:
        """Content without the notes comment."""
        return self.content[:self.notes_offset] if self.notes_offset >= 0 else self.content

    @property
    def classes(self) -> set[str]:
        return set(str(self.frontmatter.get("class") or "").split())

    def line_at(self, offset: int) -> int:
        """1-based file line of a character offset into `content`."""
        return self.content_line + self.content.count("\n", 0, max(offset, 0))


@dataclass
class Deck:
    path: Path
    text: str
    headmatter: dict
    slides: list[Slide]

    @property
    def visible(self) -> list[Slide]:
        return [s for s in self.slides if s.number is not None]

    def slide_of_line(self, line: int) -> Slide | None:
        for s in self.slides:
            if s.start_line <= line <= s.end_line:
                return s
        return None


_NOTE = re.compile(r"<!--([\s\S]*?)-->")


def parse_deck(path: Path) -> Deck:
    text = path.read_text(encoding="utf-8")
    lines = text.split("\n")
    raw: list[tuple[int, int, int, int]] = []   # (start, content_start, end, fm_end) as 0-based line idx
    start = content_start = 0
    fm: tuple[int, int] | None = None
    fms: dict[int, tuple[int, int]] = {}

    def cut(end: int):
        nonlocal start, content_start
        if start == end:
            return
        raw.append((start, content_start, end))
        start = content_start = end + 1

    i = 0
    while i < len(lines):
        line = lines[i].rstrip()
        if line.startswith("---"):
            cut(i)
            nxt = lines[i + 1] if i + 1 < len(lines) else None
            if line[3:4] != "-" and nxt is not None and nxt.strip():
                start = i
                j = i + 1
                while j < len(lines) and lines[j].rstrip() != "---":
                    j += 1
                fms[i] = (i + 1, j)
                i = j
                content_start = i + 1
        elif line.lstrip().startswith("```"):
            fence = re.match(r"^\s*`+", line).group(0).strip()
            j = i + 1
            while j < len(lines) and not lines[j].lstrip().startswith(fence):
                j += 1
            if j != len(lines):
                i = j
        i += 1
    if start <= len(lines) - 1:
        cut(len(lines))

    slides: list[Slide] = []
    number = 0
    headmatter: dict = {}
    for idx, (s, cs, e) in enumerate(raw):
        fm_span = fms.get(s)
        front = parse_yaml("\n".join(lines[fm_span[0]:fm_span[1]])) if fm_span else {}
        if idx == 0:
            headmatter = front
        content = "\n".join(lines[cs:e])
        slide = Slide(index=idx, number=None, start_line=s + 1, content_line=cs + 1,
                      end_line=max(e, s + 1), frontmatter=front, content=content)
        comments = list(_NOTE.finditer(content))
        if comments and comments[-1].end() >= len(content.rstrip()):
            slide.notes = comments[-1].group(1).strip()
            slide.notes_offset = comments[-1].start()
        if not slide.hidden:
            number += 1
            slide.number = number
        slides.append(slide)
    return Deck(path=path, text=text, headmatter=headmatter, slides=slides)


# --------------------------------------------------------------------------
# On-screen text, with line numbers kept: masked spans become spaces.

TAG = re.compile(r"""</?[A-Za-z][\w:.-]*(?:\s+[^\s=/>]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*/?>""")
VOID = {"img", "br", "hr", "input", "meta", "link", "source", "area", "col", "embed", "wbr"}
_CLASS = re.compile(r"""\bclass\s*=\s*(?:"([^"]*)"|'([^']*)')""")
_STYLE = re.compile(r"""\bstyle\s*=\s*(?:"([^"]*)"|'([^']*)')""")


@dataclass
class Element:
    tag: str
    classes: frozenset
    start: int          # offset of `<`
    inner_start: int    # offset after the start tag
    inner_end: int      # offset of the closing tag (== inner_start for void tags)
    end: int            # offset after the closing tag
    style: str = ""


def elements(text: str) -> list[Element]:
    """HTML elements in a slide, matched by a tag stack (markdown is passed over)."""
    out: list[Element] = []
    stack: list[tuple[str, frozenset, int, int, str]] = []
    for m in TAG.finditer(_blank(text, comment_spans(text))):
        raw = m.group(0)
        name = re.match(r"</?([A-Za-z][\w:.-]*)", raw).group(1)
        lname = name.lower()
        if raw.startswith("</"):
            for k in range(len(stack) - 1, -1, -1):
                if stack[k][0] == lname:
                    tag, cls, st, ist, sty = stack[k]
                    out.append(Element(tag, cls, st, ist, m.start(), m.end(), sty))
                    del stack[k:]
                    break
            continue
        cm = _CLASS.search(raw)
        cls = frozenset((cm.group(1) or cm.group(2) or "").split()) if cm else frozenset()
        sm = _STYLE.search(raw)
        sty = (sm.group(1) or sm.group(2) or "") if sm else ""
        if raw.endswith("/>") or lname in VOID:
            out.append(Element(lname, cls, m.start(), m.end(), m.end(), m.end(), sty))
        else:
            stack.append((lname, cls, m.start(), m.end(), sty))
    for tag, cls, st, ist, sty in stack:
        out.append(Element(tag, cls, st, ist, len(text), len(text), sty))
    out.sort(key=lambda e: e.start)
    return out


def comment_spans(text: str) -> list[tuple[int, int]]:
    return [(m.start(), m.end()) for m in _NOTE.finditer(text)]


def _blank(text: str, spans) -> str:
    """Replace each span by spaces, keeping newlines, so offsets and lines hold."""
    if not spans:
        return text
    chars = list(text)
    for a, b in spans:
        for k in range(a, min(b, len(chars))):
            if chars[k] != "\n":
                chars[k] = " "
    return "".join(chars)


_FENCE = re.compile(r"^(\s*)(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\2[^\n]*$", re.M)
_BLOCKS = re.compile(r"<(style|script)\b[\s\S]*?</\1\s*>", re.I)
_MD_IMAGE = re.compile(r"!\[[^\]]*\]\([^)]*\)")
_MD_LINK_URL = re.compile(r"(?<=\])\([^)\s]*(?:\s+\"[^\"]*\")?\)")
_MD_ATTR = re.compile(r"\{[.#][^}\n]*\}")
_MUSTACHE = re.compile(r"\{\{[\s\S]*?\}\}")


def screen_text(body: str, drop_classes: tuple[str, ...] = (), markers: bool = False) -> str:
    """The slide's visible text at the same offsets: comments, <style>/<script>,
    fenced code, tags with their attributes, image syntax and link targets
    blanked; elements carrying any of `drop_classes` blanked whole. Markdown
    markers (#, >, list bullets) are blanked too unless `markers`."""
    spans = comment_spans(body)
    spans += [(m.start(), m.end()) for m in _BLOCKS.finditer(body)]
    spans += [(m.start(), m.end()) for m in _FENCE.finditer(body)]
    spans += [(m.start(), m.end()) for m in TAG.finditer(_blank(body, comment_spans(body)))]
    spans += [(m.start(), m.end()) for m in _MD_IMAGE.finditer(body)]
    spans += [(m.start(), m.end()) for m in _MD_LINK_URL.finditer(body)]
    spans += [(m.start(), m.end()) for m in _MD_ATTR.finditer(body)]
    spans += [(m.start(), m.end()) for m in _MUSTACHE.finditer(body)]
    if drop_classes:
        for el in elements(body):
            if el.classes & set(drop_classes):
                spans.append((el.start, el.end))
    out = _blank(body, spans)
    if markers:
        return out
    # markdown markers that are not words
    out = re.sub(r"(?m)^(\s*)(#{1,6}|>|[-*+]|\d+\.)(?=\s)", lambda m: m.group(1) + " " * len(m.group(2)), out)
    return out


WORD = re.compile(r"[^\W_](?:[\w’'-]*[^\W_])?")


def count_words(text: str) -> int:
    return len(WORD.findall(text))


# --------------------------------------------------------------------------
# Timing

NOTE_MIN = re.compile(r"\(\s*(?:~|≈|ca\.?\s*)?\s*(\d+(?:[.,]\d+)?)\s*min\b")
NOTE_MSS = re.compile(r"\((\d{1,2}):([0-5]\d)(?:[.,]\d+)?(?=[\s,;)~]|$)")
VIDEO = re.compile(r"<VideoPlayer\b[^>]*?\bsrc\s*=\s*\"([^\"]+)\"[^>]*>", re.S)


def _seconds(v) -> float | None:
    """'m:ss', 'm:ss.f', 'h:mm:ss' or a number of seconds."""
    if isinstance(v, (int, float)):
        return float(v)
    if not isinstance(v, str):
        return None
    try:
        parts = [float(p) for p in v.strip().split(":")]
    except ValueError:
        return None
    total = 0.0
    for p in parts:
        total = total * 60 + p
    return total


def clip_durations(talk: Path) -> dict[str, tuple[float, str]]:
    """Seconds per clip name: a manifest trim wins, then public/video-frames/index.json."""
    out: dict[str, tuple[float, str]] = {}
    idx = talk / "public" / "video-frames" / "index.json"
    if idx.is_file():
        try:
            for name, c in (json.loads(idx.read_text(encoding="utf-8")).get("clips") or {}).items():
                if isinstance(c, dict) and isinstance(c.get("duration"), (int, float)):
                    out[name] = (float(c["duration"]), "video-frames")
        except (json.JSONDecodeError, OSError):
            pass
    man = talk / "videos" / "manifest.toml"
    if man.is_file():
        try:
            data = tomllib.loads(man.read_text(encoding="utf-8"))
        except (tomllib.TOMLDecodeError, OSError):
            data = {}
        for v in data.get("videos") or []:
            trim = v.get("trim") if isinstance(v, dict) else None
            if isinstance(trim, list) and len(trim) == 2:
                a, b = _seconds(trim[0]), _seconds(trim[1])
                if a is not None and b is not None and b > a:
                    out[v.get("name")] = (b - a, "manifest trim")
    return out


@dataclass
class SlideTime:
    minutes: float
    note_minutes: float
    clip: str | None
    clip_seconds: float | None
    clip_source: str | None      # manifest trim | video-frames | notes | loop | None
    timed: bool


def slide_time(slide: Slide, clips: dict[str, tuple[float, str]]) -> SlideTime:
    """Minutes a slide takes: its '(~N min)' notes plus its clip. A clip's length
    comes from the manifest trim or the frames index, else from the '(m:ss)' in
    its notes; a looping clip adds nothing (the speaker talks over it). On a
    slide without a clip, '(m:ss)' notes count as they are."""
    notes = slide.notes
    note_min = sum(float(x.replace(",", ".")) for x in NOTE_MIN.findall(notes))
    mss = [int(a) * 60 + int(b) for a, b in NOTE_MSS.findall(notes)]
    vm = VIDEO.search(slide.body)
    clip = vm.group(1) if vm else None
    clip_s = src = None
    if clip:
        tag = vm.group(0)
        # a clip's length may also sit in a comment above the player (WoP)
        any_mss = [int(a) * 60 + int(b) for c in _NOTE.findall(slide.content) for a, b in NOTE_MSS.findall(c)]
        if re.search(r"\sloop\b", tag):
            src = "loop"
        elif clip in clips:
            clip_s, src = clips[clip]
        elif any_mss:
            clip_s, src = float(any_mss[0]), "notes"
    elif mss:
        note_min += sum(mss) / 60
    minutes = note_min + (clip_s or 0) / 60
    timed = bool(NOTE_MIN.search(notes) or mss or clip_s)
    return SlideTime(round(minutes, 3), round(note_min, 3), clip, clip_s, src, timed)


_DUR = re.compile(r"^\s*(?:(\d+(?:\.\d+)?)\s*h)?\s*(?:(\d+(?:\.\d+)?)\s*(?:m|min|mins|minutes)?)?\s*(?:(\d+)\s*s)?\s*$", re.I)
_DUR_TEXT = re.compile(r"(\d+(?:[.,]\d+)?|\d*½)(?:\s*-\s*|\s+)minutes?\b|(\d+(?:[.,]\d+)?|\d*½)-minute\b", re.I)


def parse_duration(v) -> float | None:
    """Minutes from headmatter `duration`: 30, '30min', '1h30min', '6:30' (m:ss)."""
    if isinstance(v, bool) or v is None:
        return None
    if isinstance(v, (int, float)):
        return float(v)
    s = str(v).strip()
    if ":" in s:
        sec = _seconds(s)
        return sec / 60 if sec else None
    m = _DUR.match(s)
    if not m or not any(m.groups()):
        return None
    h, mins, secs = (float(g) if g else 0.0 for g in m.groups())
    return h * 60 + mins + secs / 60


def _num(s: str) -> float:
    if s.endswith("½"):
        return (float(s[:-1]) if s[:-1] else 0) + 0.5
    return float(s.replace(",", "."))


def deck_duration(deck: Deck) -> tuple[float | None, str | None]:
    """(minutes, where it came from): headmatter `duration`, else a 'N-minute'
    phrase in the headmatter `info`, else in the first slide's notes."""
    d = parse_duration(deck.headmatter.get("duration"))
    if d:
        return d, "headmatter duration"
    for where, text in (("headmatter info", str(deck.headmatter.get("info") or "")),
                        ("first slide notes", deck.slides[0].notes if deck.slides else "")):
        m = _DUR_TEXT.search(text)
        if m:
            return _num(m.group(1) or m.group(2)), f"inferred from {where}"
    return None, None


# --------------------------------------------------------------------------
# Small helpers

def frontmatter_at(slide: Slide):
    sp = slide.frontmatter.get("space")
    return sp.get("at") if isinstance(sp, dict) else None


def is_stage(deck: Deck) -> bool:
    addons = deck.headmatter.get("addons") or []
    return isinstance(addons, list) and any("slidev-addon-stage" in str(a) for a in addons)


def talk_files(talk: Path):
    """Text files of a talk (deck, styles, setup, data, notes, manifests)."""
    skip_dirs = {"node_modules", "dist", "dist-portable", "shots", ".git", "videos-hq"}
    exts = {".md", ".css", ".js", ".ts", ".mjs", ".vue", ".json", ".toml", ".yaml", ".yml", ".txt", ".py", ".html", ".svg"}
    for dirpath, dirnames, filenames in os.walk(talk):      # symlinked dirs (components/) are not followed
        here = Path(dirpath)
        rel = here.relative_to(talk).parts
        dirnames[:] = sorted(d for d in dirnames if d not in skip_dirs and not (rel == ("public",) and d == "videos"))
        for name in sorted(filenames):
            p = here / name
            if not p.is_symlink() and p.suffix.lower() in exts:
                yield p
