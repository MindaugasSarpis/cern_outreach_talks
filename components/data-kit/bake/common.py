"""Shared helpers of the data-kit bakes: output, --check and the manifest.

Every bake script builds all of its outputs in memory as bytes, then either
writes them to ../data/ (and refreshes its own entries in data/manifest.json)
or, with --check, compares them with the committed files and exits 1 on a
difference. Floats in JSON are rounded to 9 significant digits so that a
check does not trip on the last bit of a BLAS sum, and compared with a relative
tolerance of 1e-8; float32 arrays are compared exactly first and then with a
relative tolerance of 1e-6.

No timestamps are written. The only dates are the `retrieved` fields of the
source blocks, which are constants in each script (the day the source was read).
"""
from __future__ import annotations

import hashlib
import json
import math
import sys
from pathlib import Path

import numpy as np

KIT = Path(__file__).resolve().parent.parent          # components/data-kit
DATA = KIT / "data"
MANIFEST = DATA / "manifest.json"

# The course checkout that holds the converted CSV of record 401 sits next to
# outreach_talks on the owner's machine. Elsewhere pass --cached PATH (or make
# the CSV with the course's root_to_csv.py from the record's ROOT file).
COURSE_DATA_REL = Path("lectures/workbook/docs/data")


def course_file(name: str) -> Path:
    """Locate a course data file: the sibling course checkout of this machine."""
    for base in KIT.parents:
        c = base / "CERN_lessons_on_data_analysis" / COURSE_DATA_REL / name
        if c.is_file():
            return c
    raise SystemExit(f"cannot find the course file {name}; pass --cached PATH")


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# --------------------------------------------------------------------- JSON
def clean(o, sig: int = 9):
    """numpy -> python, floats rounded to `sig` significant digits, NaN -> None."""
    if isinstance(o, dict):
        return {str(k): clean(v, sig) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [clean(v, sig) for v in o]
    if isinstance(o, np.ndarray):
        return clean(o.tolist(), sig)
    if isinstance(o, (np.integer,)):
        return int(o)
    if isinstance(o, (np.bool_, bool)):
        return bool(o)
    if isinstance(o, (float, np.floating)):
        x = float(o)
        if not math.isfinite(x):
            return None
        if x == 0:
            return 0.0
        return float(f"{x:.{sig}g}")
    return o


def _scalar(o) -> bool:
    return not isinstance(o, (dict, list))


def _dump(o, level: int) -> str:
    pad, pad1 = " " * level, " " * (level + 1)
    if isinstance(o, dict):
        if not o:
            return "{}"
        items = [f"{pad1}{json.dumps(k, ensure_ascii=False)}: {_dump(v, level + 1)}" for k, v in o.items()]
        return "{\n" + ",\n".join(items) + "\n" + pad + "}"
    if isinstance(o, list):
        if all(_scalar(v) for v in o):              # numbers and strings stay on one line
            return json.dumps(o, ensure_ascii=False, separators=(",", ":"))
        if all(isinstance(v, list) and all(_scalar(w) for w in v) for v in o):
            rows = [pad1 + json.dumps(v, ensure_ascii=False, separators=(",", ":")) for v in o]
            return "[\n" + ",\n".join(rows) + "\n" + pad + "]"
        return "[\n" + ",\n".join(pad1 + _dump(v, level + 1) for v in o) + "\n" + pad + "]"
    return json.dumps(o, ensure_ascii=False)


def json_bytes(obj) -> bytes:
    """JSON with one key a line and every list of scalars on one line."""
    return (_dump(clean(obj), 0) + "\n").encode("utf-8")


def f32_bytes(arr) -> bytes:
    a = np.ascontiguousarray(np.asarray(arr, dtype="<f4"))
    return a.tobytes()


# ------------------------------------------------------------------ compare
def _num_equal(a, b, rtol=1e-8, atol=1e-12, path="") -> list[str]:
    diffs = []
    if isinstance(a, dict) and isinstance(b, dict):
        for k in sorted(set(a) | set(b)):
            if k not in a or k not in b:
                diffs.append(f"{path}/{k}: only in {'new' if k in a else 'committed'}")
            else:
                diffs += _num_equal(a[k], b[k], rtol, atol, f"{path}/{k}")
    elif isinstance(a, list) and isinstance(b, list):
        if len(a) != len(b):
            diffs.append(f"{path}: length {len(a)} != {len(b)}")
        else:
            for i, (x, y) in enumerate(zip(a, b)):
                diffs += _num_equal(x, y, rtol, atol, f"{path}[{i}]")
                if len(diffs) > 20:
                    break
    elif isinstance(a, (int, float)) and isinstance(b, (int, float)) and not isinstance(a, bool):
        if not math.isclose(a, b, rel_tol=rtol, abs_tol=atol):
            diffs.append(f"{path}: {b} -> {a}")
    elif a != b:
        diffs.append(f"{path}: {str(b)[:60]} -> {str(a)[:60]}")
    return diffs


def compare(name: str, new: bytes) -> list[str]:
    path = DATA / name
    if not path.is_file():
        return [f"{name}: not committed"]
    old = path.read_bytes()
    if old == new:
        return []
    if name.endswith(".json"):
        d = _num_equal(json.loads(new), json.loads(old), path=name)
        return d
    if name.endswith(".f32"):
        a, b = np.frombuffer(new, "<f4"), np.frombuffer(old, "<f4")
        if a.shape != b.shape:
            return [f"{name}: {b.size} -> {a.size} values"]
        ok = np.isclose(a, b, rtol=1e-6, atol=1e-9, equal_nan=True)
        if ok.all():
            return []
        i = int(np.argmin(ok))
        return [f"{name}: {int((~ok).sum())} values differ, first at {i}: {b[i]} -> {a[i]}"]
    return [f"{name}: bytes differ"]


# ----------------------------------------------------------------- manifest
def load_manifest() -> dict:
    if MANIFEST.is_file():
        return json.loads(MANIFEST.read_text(encoding="utf-8"))
    return {}


def manifest_bytes(script: str, entries: dict) -> bytes:
    m = load_manifest()
    files = {k: v for k, v in m.get("files", {}).items() if v.get("by") != script}
    for name, e in entries.items():
        files[name] = dict(e, by=script)
    out = {
        "about": ("Data files of components/data-kit, made by the scripts in bake/. "
                  "Each entry: the script that writes it, the talks that load it "
                  "(bake/sync.py copies those into talks/<t>/public/dk/), its shape and meaning. "
                  "Decks load them at runtime with ctx.asset('/dk/<file>')."),
        "files": {k: files[k] for k in sorted(files)},
    }
    return json_bytes(out)


def emit(script: str, outputs: dict[str, bytes], entries: dict, check: bool) -> int:
    """Write (or with check=True compare) every output and this script's manifest entries."""
    missing = [k for k in outputs if k not in entries]
    assert not missing, f"outputs without a manifest entry: {missing}"
    if check:
        diffs = []
        for name, b in outputs.items():
            diffs += compare(name, b)
        m = load_manifest().get("files", {})
        for name, e in entries.items():
            want = clean(dict(e, by=script))
            if m.get(name) != want:
                diffs.append(f"manifest.json: entry {name} differs")
        stale = [k for k, v in m.items() if v.get("by") == script and k not in entries]
        diffs += [f"manifest.json: stale entry {k}" for k in stale]
        if diffs:
            print(f"{script} --check: {len(diffs)} difference(s)")
            for d in diffs[:60]:
                print("  ", d)
            return 1
        print(f"{script} --check: {len(outputs)} files match")
        return 0
    DATA.mkdir(parents=True, exist_ok=True)
    for name, b in outputs.items():
        (DATA / name).write_bytes(b)
        print(f"wrote data/{name} ({len(b):,} B)")
    MANIFEST.write_bytes(manifest_bytes(script, entries))
    return 0


def done(code: int) -> None:
    sys.exit(code)


# ------------------------------------------------- the kit's seeded order (rng.js)
# A port of components/data-kit/rng.js, so a bake can say what a builder draws in
# the series' own order (dk-hist fills a rows source in the reverse of order(n, 401,
# row 0)). Checked against rng.js under node on 2026-10-29: the same ranks and draws.
_M32 = 0xFFFFFFFF


def mulberry32(seed: int):
    """rng.js mulberry32: a generator of floats in [0, 1), bit for bit as the JS one."""
    a = (int(seed) & _M32) or 0x9E3779B9

    def nxt() -> float:
        nonlocal a
        a = (a + 0x6D2B79F5) & _M32
        t = ((a ^ (a >> 15)) * (1 | a)) & _M32
        t = ((t + (((t ^ (t >> 7)) * (61 | t)) & _M32)) & _M32) ^ t
        return ((t ^ (t >> 14)) & _M32) / 4294967296.0
    return nxt


def series_order(n: int, seed: int, ours: int | None = 0) -> np.ndarray:
    """rng.js order(n, seed, ours): rank[row] of a seeded Fisher-Yates shuffle, ours last."""
    rnd = mulberry32(seed)
    perm = list(range(n))
    for i in range(n - 1, 0, -1):
        j = int(math.floor(rnd() * (i + 1)))
        perm[i], perm[j] = perm[j], perm[i]
    rank = np.empty(n, np.int64)
    rank[np.asarray(perm)] = np.arange(n)
    if ours is not None and 0 <= ours < n:
        r = rank[ours]
        rank[rank > r] -= 1
        rank[ours] = n - 1
    return rank
