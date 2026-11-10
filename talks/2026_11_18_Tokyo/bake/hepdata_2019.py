#!/usr/bin/env python3
"""HEPData ins1728691 Table 1 -> public/data/jpsip-2019-all.json.

Source: LHCb, Phys. Rev. Lett. 122, 222001 (2019), HEPData record ins1728691, "Table 1":
m(J/psi p) of all Lb -> J/psi p K- candidates (no m(Kp) cut). Same format as Karjera's
jpsip-2019.json (Table 2), plus "errors" and any further value column (e.g. a fit) by name.

hepdata.net sits behind a Cloudflare browser check, so a script fetch usually gets a challenge
page. Then download the CSV in a browser:
    https://www.hepdata.net/download/table/ins1728691/Table%201/1/csv
and run
    python3 bake/hepdata_2019.py ~/Downloads/HEPData-ins1728691-v1-Table_1.csv
"""
import csv, io, json, re, sys, urllib.request
from pathlib import Path

URL = "https://www.hepdata.net/download/table/ins1728691/Table%201/1/csv"
OUT = Path(__file__).resolve().parent.parent / "public/data/jpsip-2019-all.json"


def load(arg):
    if arg:
        return Path(arg).read_text()
    req = urllib.request.Request(URL, headers={"User-Agent": "outreach-talks-bake/1.0"})
    try:
        text = urllib.request.urlopen(req, timeout=30).read().decode()
    except Exception as e:  # 403 from the bot check
        sys.exit(f"fetch failed ({e}); download {URL} in a browser and pass its path")
    if text.lstrip().startswith("<"):
        sys.exit(f"got an HTML (bot-check) page; download {URL} in a browser and pass its path")
    return text


def main():
    text = load(sys.argv[1] if len(sys.argv) > 1 else None)
    doi = re.search(r"doi:\s*(10\.17182/\S+/t\d+)", text) or re.search(r"doi:\s*(10\.17182/\S+)", text)
    rows = [r for r in csv.reader(io.StringIO("\n".join(
        l for l in text.splitlines() if l.strip() and not l.startswith("#"))))]
    head, body = rows[0], [[float(v) for v in r] for r in rows[1:] if r and r[0][:1] not in "$"]
    lo_i = next(i for i, h in enumerate(head) if h.strip().endswith("LOW"))
    hi_i = next(i for i, h in enumerate(head) if h.strip().endswith("HIGH"))
    vals = [i for i in range(hi_i + 1, len(head))]
    errs = [i for i in vals if re.search(r"stat|err|\+|-$", head[i], re.I)]
    ys = [i for i in vals if i not in errs]
    los, his = [r[lo_i] for r in body], [r[hi_i] for r in body]
    widths = {round(h - l, 6) for l, h in zip(los, his)}
    gaps = [his[k] - los[k + 1] for k in range(len(body) - 1) if abs(his[k] - los[k + 1]) > 1e-6]
    assert len(widths) == 1 and not gaps, f"bins not uniform: widths {widths}, gaps {gaps[:5]}"
    bw = widths.pop()
    out = {"source": "LHCb, Phys. Rev. Lett. 122, 222001 (2019); HEPData ins1728691, Table 1 (all candidates), "
                     f"doi:{doi.group(1) if doi else '[CHECK doi]'}",
           "unit": "MeV", "lo": los[0], "hi": his[-1], "bin": int(bw) if bw == int(bw) else bw,
           "counts": [round(r[ys[0]]) for r in body]}
    if errs:
        out["errors"] = [round(abs(r[errs[0]]), 3) for r in body]
    for i in ys[1:]:  # e.g. a fit curve
        key = re.sub(r"[^a-z0-9]+", "_", head[i].lower()).strip("_") or f"col{i}"
        out["fit" if "fit" in key and "fit" not in out else key] = [r[i] for r in body]
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(out, ensure_ascii=False))
    c = out["counts"]
    print(f"{len(c)} bins of {bw} MeV, {out['lo']}-{out['hi']} MeV, total {sum(c)}; columns {head}")
    for target in (4312, 4440, 4457):  # local maxima within +-8 MeV
        k0 = [k for k in range(len(c)) if abs(los[k] + bw / 2 - target) <= 8]
        k = max(k0, key=lambda k: c[k]) if k0 else None
        if k is not None:
            print(f"  near {target}: max at {los[k] + bw / 2} MeV ({c[k]})")
    print("wrote", OUT)


if __name__ == "__main__":
    main()
