#!/usr/bin/env python3
"""The facts bank: research/facts.jsonl, one checked claim per line.

Search it before researching anything; add what a research or verify run
confirmed, so the next talk starts from it. Schema and verdicts:
research/README.md.

Usage (from anywhere; the bank is found from this script's checkout):
    python3 scripts/facts.py search touchscreen [--json] [--limit 10]
    python3 scripts/facts.py touchscreen               # same as search
    python3 scripts/facts.py show gave-touch-stumpe-1972 [--json]
    python3 scripts/facts.py add --claim-en "..." --source-url https://... \\
        --verdict confirmed --verified-on 2026-10-08 --verified-by "the owner" \\
        [--id slug] [--claim-lt "..."] [--value 89] [--unit contracts] \\
        [--as-of 2025] [--quote "..."] [--used-in 2026_10_00_Innoday]
    python3 scripts/facts.py add --from-json new.jsonl  # one object, a list, or JSON lines; - for stdin
    python3 scripts/facts.py add --from-json run.json --loose --verified-by "..."  # a research run's facts
    python3 scripts/facts.py check [--json]             # schema, ids, public sources, citations in talks

--facts PATH reads another bank (tests). Every verb takes --json: one JSON
object on stdout, human text on stderr. Exit 0 ok, 1 problems found (no
match, invalid entry, failed check), 2 usage error.
"""
from __future__ import annotations

import argparse
import datetime as dt
import ipaddress
import json
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
BANK = ROOT / "research" / "facts.jsonl"

FIELDS = ("id", "claim_en", "claim_lt", "value", "unit", "as_of", "source_url",
          "quote", "verdict", "verified_on", "verified_by", "used_in")
VERDICTS = ("confirmed", "corrected", "unverified", "refuted")
USABLE = ("confirmed", "corrected")            # what a deck may cite
ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
AS_OF_RE = re.compile(r"^\d{4}(?:-\d{2}(?:-\d{2})?)?$")
CITE_RE = re.compile(r"<!--\s*facts?\s*:\s*([\s\S]*?)-->")

# Hosts that are private or behind a login: a claim sourced there cannot be
# checked by the audience, and the repo is public.
PRIVATE_HOSTS = (
    "drive.google.com", "docs.google.com", "mail.google.com", "calendar.google.com",
    "photos.google.com", "keep.google.com", "chat.google.com", "meet.google.com",
    "sharepoint.com", "onedrive.live.com", "1drv.ms", "outlook.office.com",
    "outlook.live.com", "outlook.office365.com", "teams.microsoft.com",
    "localhost", "claude.ai",
)


# --------------------------------------------------------------------------
# Validation

def public_url_problem(url) -> str | None:
    """None when `url` is a public http(s) page, else why not."""
    if not isinstance(url, str) or not url.strip():
        return "source_url is missing"
    if url != url.strip() or re.search(r"\s", url):
        return "source_url holds whitespace (one URL per fact)"
    try:
        parts = urlsplit(url)
    except ValueError:
        return "source_url does not parse"
    if parts.scheme not in ("http", "https"):
        return f"source_url must be http(s), not {parts.scheme or 'a bare path'}"
    host = (parts.hostname or "").lower()
    if not host:
        return "source_url has no host"
    if parts.username or parts.password or "@" in parts.netloc:
        return "source_url carries credentials"
    if any(host == h or host.endswith("." + h) for h in PRIVATE_HOSTS):
        return f"source_url is private or behind a login ({host})"
    if host.endswith((".local", ".internal", ".lan")):
        return f"source_url is a local host ({host})"
    try:
        ip = ipaddress.ip_address(host)
        if ip.is_private or ip.is_loopback or ip.is_link_local:
            return f"source_url is a private address ({host})"
    except ValueError:
        pass
    return None


def validate(e) -> list[str]:
    """Schema problems of one entry (empty when it is valid)."""
    if not isinstance(e, dict):
        return ["not a JSON object"]
    errs = []
    missing = [k for k in FIELDS if k not in e]
    extra = [k for k in e if k not in FIELDS]
    if missing:
        errs.append("missing keys: " + ", ".join(missing))
    if extra:
        errs.append("unknown keys: " + ", ".join(extra))
    fid = e.get("id")
    if not isinstance(fid, str) or not ID_RE.match(fid) or len(fid) > 64:
        errs.append(f"id {fid!r} is not a slug (a-z, 0-9, single dashes, at most 64 characters)")
    if not isinstance(e.get("claim_en"), str) or not e.get("claim_en", "").strip():
        errs.append("claim_en must be a non-empty string")
    for k in ("claim_lt", "unit", "quote", "verified_by"):
        if k in e and e[k] is not None and not isinstance(e[k], str):
            errs.append(f"{k} must be a string or null")
    v = e.get("value")
    if v is not None and (isinstance(v, bool) or not isinstance(v, (int, float, str))):
        errs.append("value must be a number, a string or null")
    a = e.get("as_of")
    if a is not None and (not isinstance(a, str) or not AS_OF_RE.match(a)):
        errs.append(f"as_of {a!r} must be YYYY, YYYY-MM or YYYY-MM-DD")
    p = public_url_problem(e.get("source_url"))
    if p:
        errs.append(p)
    verdict = e.get("verdict")
    if verdict not in VERDICTS:
        errs.append(f"verdict {verdict!r} must be one of {', '.join(VERDICTS)}")
    von = e.get("verified_on")
    if von is not None and (not isinstance(von, str) or not DATE_RE.match(von)):
        errs.append(f"verified_on {von!r} must be YYYY-MM-DD")
    if verdict in ("confirmed", "corrected", "refuted"):
        if not von:
            errs.append(f"verified_on is required for a {verdict} fact")
        if not e.get("verified_by"):
            errs.append(f"verified_by is required for a {verdict} fact")
    used = e.get("used_in")
    if not isinstance(used, list) or not all(isinstance(u, str) and u for u in used):
        errs.append("used_in must be a list of talk directory names")
    return errs


# --------------------------------------------------------------------------
# The bank file

def load_bank(path: Path = BANK) -> tuple[list[dict], list[str]]:
    """(entries, problems): problems name the line; unreadable lines are skipped."""
    entries, problems = [], []
    if not path.is_file():
        return [], [f"{path}: no facts bank"]
    for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        try:
            e = json.loads(line)
        except json.JSONDecodeError as exc:
            problems.append(f"line {n}: not JSON ({exc.msg})")
            continue
        entries.append(e)
        for err in validate(e):
            problems.append(f"line {n} ({e.get('id') if isinstance(e, dict) else '?'}): {err}")
    return entries, problems


def dump_line(e: dict) -> str:
    return json.dumps({k: e.get(k) for k in FIELDS}, ensure_ascii=False)


def write_bank(entries: list[dict], path: Path = BANK) -> None:
    """Sorted by id, so two branches adding facts rarely touch the same lines."""
    path.parent.mkdir(parents=True, exist_ok=True)
    body = "".join(dump_line(e) + "\n" for e in sorted(entries, key=lambda e: e["id"]))
    path.write_text(body, encoding="utf-8")


def by_id(entries: list[dict]) -> dict[str, dict]:
    return {e["id"]: e for e in entries if isinstance(e, dict) and isinstance(e.get("id"), str)}


# --------------------------------------------------------------------------
# Search

def fold(s: str) -> str:
    """Lower case without diacritics: 'Šarpis' and 'sarpis' match."""
    return "".join(c for c in unicodedata.normalize("NFKD", s or "") if not unicodedata.combining(c)).lower()


def search(entries: list[dict], words: list[str]) -> list[tuple[float, dict]]:
    """Entries ranked by term hits over id, claim_en and claim_lt: the number of
    distinct terms found first, then hits (an id hit counts three)."""
    terms = [fold(w) for w in words if w.strip()]
    out = []
    squash = lambda s: re.sub(r"[\s\-]+", "", s)       # 'touchscreen' finds 'touch screen'
    for e in entries:
        fid, en, lt = fold(e.get("id", "")), fold(e.get("claim_en") or ""), fold(e.get("claim_lt") or "")
        found, hits = 0, 0
        for t in terms:
            h = 3 * max(fid.count(t), squash(fid).count(t)) + max(en.count(t), squash(en).count(t)) \
                + max(lt.count(t), squash(lt).count(t))
            if h:
                found += 1
                hits += h
        if found:
            out.append((found + min(hits, 50) / 100, e))
    out.sort(key=lambda x: (-x[0], x[1]["id"]))
    return out


def slugify(text: str, taken: set[str]) -> str:
    stop = {"the", "a", "an", "of", "in", "on", "at", "to", "and", "is", "was", "for", "by", "its", "it", "as", "with", "from"}
    words = [w for w in re.findall(r"[a-z0-9]+", fold(text)) if w not in stop][:6] or ["fact"]
    base = "-".join(words)[:56].strip("-")
    slug, n = base, 2
    while slug in taken:
        slug, n = f"{base}-{n}", n + 1
    return slug


def _tokens(s: str) -> set[str]:
    return set(re.findall(r"[a-z0-9]+", fold(s)))


def near_duplicates(entries: list[dict], threshold: float = 0.85) -> list[tuple[str, str, float]]:
    toks = [(e["id"], _tokens(e.get("claim_en", ""))) for e in entries if isinstance(e, dict) and "id" in e]
    out = []
    for i in range(len(toks)):
        for j in range(i + 1, len(toks)):
            a, b = toks[i][1], toks[j][1]
            if len(a) < 6 or len(b) < 6:
                continue
            jac = len(a & b) / len(a | b)
            if jac >= threshold:
                out.append((toks[i][0], toks[j][0], round(jac, 2)))
    return out


def cited_ids(text: str) -> list[str]:
    """Fact ids a deck cites with <!-- facts: id1, id2 -->."""
    ids = []
    for m in CITE_RE.finditer(text):
        ids += [x for x in re.split(r"[\s,;]+", m.group(1).strip()) if x]
    return ids


# --------------------------------------------------------------------------
# CLI

def _out(args, obj: dict, human: str) -> None:
    if args.json:
        print(json.dumps(obj, ensure_ascii=False, indent=1))
        if human:
            print(human, file=sys.stderr)
    elif human:
        print(human)


def _fmt(e: dict) -> str:
    head = f"{e['id']}  [{e.get('verdict')}" + (f", as of {e['as_of']}" if e.get("as_of") else "") + "]"
    lines = [head, "  " + (e.get("claim_en") or "")]
    if e.get("claim_lt"):
        lines.append("  LT: " + e["claim_lt"])
    lines.append("  " + (e.get("source_url") or ""))
    return "\n".join(lines)


def cmd_search(args) -> int:
    entries, _ = load_bank(args.facts)
    hits = search(entries, args.words)
    shown = hits[: args.limit] if args.limit else hits
    human = "\n\n".join(_fmt(e) for _, e in shown) or f"no fact matches {' '.join(args.words)!r}"
    if len(hits) > len(shown):
        human += f"\n\n({len(hits) - len(shown)} more; --limit 0 shows all)"
    _out(args, {"query": args.words, "count": len(hits),
                "results": [dict(e, score=round(s, 2)) for s, e in shown]},
         human if not args.json else f"{len(hits)} match(es)")
    return 0 if hits else 1


def cmd_show(args) -> int:
    entries, _ = load_bank(args.facts)
    ids = by_id(entries)
    e = ids.get(args.id)
    if e is None:
        pref = [k for k in ids if k.startswith(args.id)]
        e = ids[pref[0]] if len(pref) == 1 else None
        if e is None:
            msg = f"no fact {args.id!r}" + (f"; did you mean: {', '.join(pref[:8])}" if pref else "")
            _out(args, {"fact": None, "error": msg}, msg)
            return 1
    if args.json:
        _out(args, {"fact": e}, "")
    else:
        print(_fmt(e))
        for k in ("value", "unit", "quote", "verified_on", "verified_by", "used_in"):
            if e.get(k) not in (None, "", []):
                print(f"  {k}: {e[k]}")
    return 0


def _value(s: str | None):
    if s is None:
        return None
    try:
        return int(s)
    except ValueError:
        try:
            return float(s)
        except ValueError:
            return s


def _from_json(src: str) -> list:
    text = sys.stdin.read() if src == "-" else Path(src).read_text(encoding="utf-8")
    text = text.strip()
    if not text:
        return []
    try:
        data = json.loads(text)
        return data if isinstance(data, list) else [data]
    except json.JSONDecodeError:
        return [json.loads(line) for line in text.splitlines() if line.strip()]


_VERDICT_ALIASES = {"unverifiable": "unverified", "unconfirmed": "unverified", "likely": "unverified",
                    "verified": "confirmed", "true": "confirmed", "wrong": "refuted", "false": "refuted"}


def loosen(e: dict, defaults: dict) -> tuple[dict, list[str]]:
    """Map a research run's fact (claim, source, evidence_url, corrected_claim,
    date, confidence...) onto the bank schema; returns (entry, dropped keys)."""
    out = {k: e.get(k) for k in FIELDS if k in e}
    verdict = str(e.get("verdict") or defaults.get("verdict") or "unverified").lower()
    out["verdict"] = _VERDICT_ALIASES.get(verdict, verdict)
    if not out.get("claim_en"):
        out["claim_en"] = (e.get("corrected_claim") if out["verdict"] == "corrected" else None) or e.get("claim")
    for k in ("evidence_url", "source_url", "source", "url"):      # the first public page named
        m = re.search(r"https?://[^\s;,)\]]+", str(e.get(k) or ""))
        if m and not public_url_problem(m.group(0).rstrip(".")):
            out["source_url"] = m.group(0).rstrip(".")
            break
    if not out.get("as_of") and e.get("date"):
        dates = re.findall(r"\d{4}(?:-\d{2}(?:-\d{2})?)?", str(e["date"]))
        out["as_of"] = dates[-1] if dates else None
    for k, v in defaults.items():
        if out.get(k) in (None, "", []):
            out[k] = v
    known = set(FIELDS) | {"claim", "corrected_claim", "evidence_url", "source", "url", "date"}
    return out, sorted(k for k in e if k not in known)


def cmd_add(args) -> int:
    entries, problems = load_bank(args.facts)
    if problems and args.facts.is_file():
        print("the bank has problems; fix them first (facts.py check):\n  " + "\n  ".join(problems[:10]), file=sys.stderr)
        return 1
    ids = by_id(entries)
    if args.from_json:
        try:
            new = _from_json(args.from_json)
        except (OSError, json.JSONDecodeError) as exc:
            print(f"--from-json: {exc}", file=sys.stderr)
            return 2
    else:
        if not args.claim_en or not args.source_url:
            print("add needs --claim-en and --source-url (or --from-json)", file=sys.stderr)
            return 2
        new = [{
            "id": args.id, "claim_en": args.claim_en, "claim_lt": args.claim_lt,
            "value": _value(args.value), "unit": args.unit, "as_of": args.as_of,
            "source_url": args.source_url, "quote": args.quote, "verdict": args.verdict,
            "verified_on": args.verified_on or (dt.date.today().isoformat() if args.verdict != "unverified" else None),
            "verified_by": args.verified_by, "used_in": args.used_in or [],
        }]
    added, errors, notes = [], [], []
    taken = set(ids)
    defaults = {"verified_by": args.verified_by, "verified_on": args.verified_on or dt.date.today().isoformat(),
                "used_in": args.used_in or []}
    for e in new:
        if not isinstance(e, dict):
            errors.append({"id": None, "errors": ["not a JSON object"]})
            continue
        if args.loose:
            e, dropped = loosen(e, {k: v for k, v in defaults.items() if v})
            if dropped:
                notes.append(f"{e.get('id')}: dropped keys {', '.join(dropped)}")
        e = {k: e.get(k, [] if k == "used_in" else None) for k in FIELDS} | {k: v for k, v in e.items() if k not in FIELDS}
        if not e.get("id"):
            e["id"] = slugify(e.get("claim_en") or "", taken)
        errs = validate(e)
        if e["id"] in taken and not args.replace:
            errs.append(f"id {e['id']!r} exists (show it with: facts.py show {e['id']}; --replace overwrites)")
        if errs:
            errors.append({"id": e["id"], "errors": errs})
            continue
        ids[e["id"]] = e
        taken.add(e["id"])
        added.append(e["id"])
    if added and not args.dry_run:
        write_bank(list(ids.values()), args.facts)
    human = "\n".join(
        [f"added {i}" + (" (dry run)" if args.dry_run else "") for i in added]
        + [f"refused {x['id']}: " + "; ".join(x["errors"]) for x in errors] + notes)
    _out(args, {"added": added, "errors": errors, "notes": notes, "dry_run": args.dry_run,
                "bank": str(args.facts)}, human)
    return 1 if errors else 0


def cmd_check(args) -> int:
    entries, problems = load_bank(args.facts)
    errors = list(problems)
    warnings = []
    seen = {}
    for e in entries:
        fid = e.get("id") if isinstance(e, dict) else None
        if fid in seen:
            errors.append(f"duplicate id {fid!r}")
        seen[fid] = e
    for a, b, j in near_duplicates(entries):
        warnings.append(f"near-duplicate claims: {a} ~ {b} ({j:.0%} of words shared)")
    talks_dir = args.facts.resolve().parents[1] / "talks"
    talk_names = {d.name for d in talks_dir.glob("*") if d.is_dir()} if talks_dir.is_dir() else set()
    absent: dict[str, int] = {}
    for e in entries:
        for u in (e.get("used_in") or []) if isinstance(e, dict) else []:
            if talk_names and u not in talk_names:
                absent[u] = absent.get(u, 0) + 1
    for u, n in sorted(absent.items()):
        warnings.append(f"used_in names {u!r} ({n} facts), not a directory under talks/ on this checkout")
    for f in sorted(talks_dir.glob("*/research/*.json")) if talks_dir.is_dir() else []:
        warnings.append(f"{f.relative_to(talks_dir.parent)}: a second facts file; import it "
                        f"(facts.py add --from-json {f.name} --loose) and delete it")
    for deck in sorted(talks_dir.glob("*/deck.md")) if talks_dir.is_dir() else []:
        for fid in cited_ids(deck.read_text(encoding="utf-8")):
            e = seen.get(fid)
            if e is None:
                errors.append(f"{deck.parent.name}: cites unknown fact {fid!r}")
            elif e.get("verdict") not in USABLE:
                errors.append(f"{deck.parent.name}: cites {fid!r}, verdict {e.get('verdict')}")
    counts = {v: sum(1 for e in entries if isinstance(e, dict) and e.get("verdict") == v) for v in VERDICTS}
    human = "\n".join([f"error: {x}" for x in errors] + [f"warning: {x}" for x in warnings]
                      + [f"{len(entries)} facts ({', '.join(f'{n} {v}' for v, n in counts.items())}); "
                         f"{len(errors)} error(s), {len(warnings)} warning(s)"])
    _out(args, {"ok": not errors, "facts": len(entries), "verdicts": counts,
                "errors": errors, "warnings": warnings, "bank": str(args.facts)}, human)
    return 1 if errors else 0


def main(argv: list[str] | None = None) -> int:
    argv = list(sys.argv[1:] if argv is None else argv)
    verbs = {"search", "show", "add", "check"}
    lead = []                                          # options given before the verb go after it
    while argv and argv[0].startswith("-") and argv[0] not in ("-h", "--help"):
        lead.append(argv.pop(0))
        if lead[-1] in ("--facts", "--limit") and argv:
            lead.append(argv.pop(0))
    if argv and argv[0] not in verbs and argv[0] not in ("-h", "--help"):
        argv.insert(0, "search")                       # `facts.py touchscreen` searches
    argv = argv[:1] + lead + argv[1:]
    ap = argparse.ArgumentParser(prog="facts.py", description=__doc__.split("\n\n")[0])
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--json", action="store_true", help="one JSON object on stdout")
    common.add_argument("--facts", type=Path, default=BANK, help=f"bank file (default {BANK})")
    sub = ap.add_subparsers(dest="verb", required=True)
    s = sub.add_parser("search", parents=[common], help="rank facts by term hits")
    s.add_argument("words", nargs="+")
    s.add_argument("--limit", type=int, default=10, help="results shown (0: all)")
    s = sub.add_parser("show", parents=[common], help="one fact by id")
    s.add_argument("id")
    s = sub.add_parser("add", parents=[common], help="add a checked fact")
    s.add_argument("--from-json", metavar="FILE", help="a JSON object, a list, or JSON lines; - for stdin")
    s.add_argument("--id")
    s.add_argument("--claim-en")
    s.add_argument("--claim-lt")
    s.add_argument("--value")
    s.add_argument("--unit")
    s.add_argument("--as-of")
    s.add_argument("--source-url")
    s.add_argument("--quote")
    s.add_argument("--verdict", default="confirmed", choices=VERDICTS)
    s.add_argument("--verified-on", help="YYYY-MM-DD (default today)")
    s.add_argument("--verified-by", help="who checked it: the owner, or the run that did")
    s.add_argument("--used-in", action="append", metavar="TALK", help="talk directory name; repeat for more")
    s.add_argument("--loose", action="store_true",
                   help="with --from-json: map a research run's keys (claim, evidence_url, corrected_claim, date) and drop the rest")
    s.add_argument("--replace", action="store_true", help="overwrite an entry with the same id")
    s.add_argument("--dry-run", action="store_true", help="validate only, write nothing")
    sub.add_parser("check", parents=[common], help="validate the bank and the talks' citations")
    try:
        args = ap.parse_args(argv)
    except SystemExit as exc:
        return 2 if exc.code else 0
    return {"search": cmd_search, "show": cmd_show, "add": cmd_add, "check": cmd_check}[args.verb](args)


if __name__ == "__main__":
    sys.exit(main())
