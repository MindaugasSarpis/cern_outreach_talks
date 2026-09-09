#!/usr/bin/env python3
"""Build public/data/hadrons.json: the records behind the hadron-space stops.

Output: the ten states the talk names (eight pentaquarks, Θ⁺(1540), the 1964
landmark). Dates and masses of the LHC states are read from Patrick
Koppenburg's "List of hadrons observed at the LHC",
https://koppenburg.ch/particles.html (CC BY 4.0; cite LHCb-FIGURE-2021-001
and updates); the presenter's record fields come from OVERRIDES below. The
scene itself no longer draws his chart (spec 2026-09-09-startertalk-dioramas).

    python3 scripts/hadrons.py            # fetch + write
    python3 scripts/hadrons.py --cached page.html
    python3 scripts/hadrons.py --check    # also assert the invariants

Deterministic: rows keep the page's order; no timestamps are written.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import urllib.request
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

URL = "https://koppenburg.ch/particles.html"
OUT = Path(__file__).resolve().parent.parent / "public" / "data" / "hadrons.json"

LANES = [
    {"key": "pentaquark", "label": "pentaquarks  q q q q q̄", "z": 0.0},
    {"key": "hidden-heavy", "label": "tetraquarks  c c̄ q q̄", "z": -3.2},
    {"key": "open-flavour", "label": "tetraquarks  open flavour", "z": -6.4},
    {"key": "fully-heavy", "label": "tetraquarks  c c̄ c c̄", "z": -9.6},
    {"key": "baryon", "label": "baryons  q q q", "z": -12.8},
    {"key": "meson", "label": "mesons  q q̄", "z": -16.0},
]

MONTHS = {m: i for i, m in enumerate(
    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], 1)}

GREEK = {
    "Lambda": "Λ", "Xi": "Ξ", "Sigma": "Σ", "Omega": "Ω", "chi": "χ", "psi": "ψ",
    "Upsilon": "Υ", "eta": "η", "phi": "φ", "Theta": "Θ", "pi": "π", "rho": "ρ",
}
SUP = str.maketrans("0123456789+-*", "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻*")
SUB = str.maketrans("0123456789", "₀₁₂₃₄₅₆₇₈₉")


class Table(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tables, self.row, self.cell, self.links = [], None, None, []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "table":
            self.tables.append([])
        elif tag == "tr":
            self.row = []
        elif tag in ("td", "th"):
            self.cell, self.links = [], []
        elif tag == "a" and self.cell is not None and a.get("href"):
            self.links.append(a["href"])

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.row is not None and self.cell is not None:
            self.row.append(("".join(self.cell).strip(), list(self.links)))
            self.cell = None
        elif tag == "tr" and self.tables and self.row is not None:
            self.tables[-1].append(self.row)
            self.row = None

    def handle_data(self, data):
        if self.cell is not None:
            self.cell.append(data)


def tex_to_text(s: str) -> str:
    """Hadron-name LaTeX → plain text (bars, Greek, sub/superscripts)."""
    t = s.strip().strip("$")
    t = re.sub(r"\\bar\{([^}]*)\}", lambda m: "".join(c + "\u0304" for c in m.group(1)), t)
    t = re.sub(r"\\([A-Za-z]+)", lambda m: GREEK.get(m.group(1), m.group(1)), t)
    t = re.sub(r"\^\{([^}]*)\}", lambda m: m.group(1).translate(SUP), t)
    t = re.sub(r"\^(.)", lambda m: m.group(1).translate(SUP), t)
    t = re.sub(r"_\{([^}]*)\}", lambda m: m.group(1).translate(SUB) if m.group(1).isdigit() else m.group(1), t)
    t = re.sub(r"_(.)", lambda m: m.group(1).translate(SUB) if m.group(1).isdigit() else m.group(1), t)
    return t.replace("{", "").replace("}", "").replace(" ", "")


def make_id(name_tex: str) -> str:
    """Stable id: subscript c c̄ collapsed to c, bars and charges dropped."""
    t = name_tex.strip().strip("$")
    t = t.replace(r"c\bar{c}", "c").replace(r"b\bar{b}", "b")
    t = re.sub(r"\\bar\{([^}]*)\}", r"\1", t)
    t = re.sub(r"\^\{[^}]*\}|\^.", "", t)          # charge / superscripts
    t = re.sub(r"\\([A-Za-z]+)", lambda m: GREEK.get(m.group(1), m.group(1)), t)
    t = t.replace("_{", "").replace("_", "").replace("{", "").replace("}", "").replace(" ", "")
    return t


def parse_mass(s: str) -> tuple[float | None, float | None]:
    s = s.replace("{", "").replace("}", "").replace("\\pm", "±")
    m = re.search(r"([\d.]+)\s*(?:±\s*([\d.]+))?", s)
    if not m:
        return None, None
    v = float(m.group(1))
    e = float(m.group(2)) if m.group(2) else None
    if v < 100:          # a GeV value slipped through
        v *= 1000
        e = e * 1000 if e else e
    return v, e


def parse_date(s: str) -> tuple[str, float]:
    m = re.match(r"(\d{1,2})\s+([A-Za-z]{3})\w*\s+(\d{4})", s.strip())
    if not m:
        y = int(re.search(r"\d{4}", s).group(0))
        return f"{y}-07-01", y + 0.5
    d = date(int(m.group(3)), MONTHS[m.group(2)[:3]], int(m.group(1)))
    return d.isoformat(), d.year + (d.timetuple().tm_yday - 1) / 365.0


def lane_for(quarks_tex: str) -> str:
    q = quarks_tex.strip().strip("$").replace("(", "").replace(")", "")
    anti = len(re.findall(r"\\bar\{[udscbq]\}", q))
    plain = q
    plain = re.sub(r"\\bar\{[udscbq]\}", "", plain)
    n = anti + len(re.findall(r"[udscbq]", plain))
    heavy_pair = ("c\\bar{c}" in q) or ("b\\bar{b}" in q)
    if n <= 2:
        return "meson"
    if n == 3:
        return "baryon"
    if n >= 5:
        return "pentaquark"
    letters = re.findall(r"[udscbq]", q)
    if letters and all(c in "cb" for c in letters):
        return "fully-heavy"
    return "hidden-heavy" if heavy_pair else "open-flavour"


def status_for(note: str, ref: str) -> str:
    n = (note + " " + ref).lower()
    if any(k in n for k in ("superseded", "later resolved", "not confirmed", "retracted")):
        return "superseded"
    if "evidence" in n or re.search(r"\b[34](\.\d)?\s*σ", n) or "sigma" in n and "5" not in n:
        return "evidence"
    return "observed"


ADDITIONS = [
    dict(id="Pcs(4459)", name_tex=r"$P_{c\bar{c}s}(4459)^0$", mass=4458.8, mass_err=2.9,
         quarks=r"$c\bar{c}sud$", date="2020-12-18", experiment="LHCb",
         ref="Sci. Bull. 66 (2021) 1278", arxiv="https://arxiv.org/abs/2012.10380",
         note="Evidence, 3.1σ; Ξb⁻ → J/ψ Λ K⁻", status="evidence"),
    dict(id="Pc(4337)", name_tex=r"$P_{c\bar{c}}(4337)^+$", mass=4337.0, mass_err=1.5,
         quarks=r"$c\bar{c}uud$", date="2021-08-10", experiment="LHCb",
         ref="Phys. Rev. Lett. 128 (2022) 062001", arxiv="https://arxiv.org/abs/2108.04720",
         note="Evidence, 3.1–3.7σ; Bs⁰ → J/ψ p p̄", status="evidence"),
]

LANDMARKS = [
    dict(id="quarks-1964", name="quark model", mass=0.0, mass_err=None, quarks="",
         date="1964-01-01", experiment="theory", lane="pentaquark", status="observed",
         ref="Gell-Mann, Phys. Lett. 8 (1964) 214; Zweig, CERN-TH-401, 412", arxiv="",
         note="Quarks proposed; qqqq̄ and qqqqq̄ states mentioned in the same paper", marker="star"),
    dict(id="J/psi", name="J/ψ", mass=3096.9, mass_err=0.006, quarks=r"$c\bar{c}$",
         date="1974-11-11", experiment="BNL, SLAC", lane="meson", status="observed",
         ref="Phys. Rev. Lett. 33 (1974) 1404; 1406", arxiv="", note=""),
    dict(id="Theta(1540)", name="Θ⁺(1540)", mass=1540.0, mass_err=10.0, quarks="uudds̄",
         date="2003-01-01", experiment="LEPS", lane="pentaquark", status="superseded",
         ref="Phys. Rev. Lett. 91 (2003) 012002", arxiv="", note="Not confirmed by later experiments (PDG 2008)"),
    dict(id="X(3872)", name="X(3872)", mass=3871.65, mass_err=0.06, quarks=r"$c\bar{c}u\bar{u}$",
         date="2003-09-01", experiment="Belle", lane="hidden-heavy", status="observed",
         ref="Phys. Rev. Lett. 91 (2003) 262001", arxiv="https://arxiv.org/abs/hep-ex/0309032", note=""),
    dict(id="Z(4430)", name="Z(4430)⁺", mass=4478.0, mass_err=17.0, quarks=r"$c\bar{c}u\bar{d}$",
         date="2007-08-01", experiment="Belle", lane="hidden-heavy", status="observed",
         ref="Phys. Rev. Lett. 100 (2008) 142001", arxiv="https://arxiv.org/abs/0708.1790",
         note="Confirmed by LHCb, Phys. Rev. Lett. 112 (2014) 222002"),
    dict(id="Zc(3900)", name="Zc(3900)⁺", mass=3887.1, mass_err=2.6, quarks=r"$c\bar{c}u\bar{d}$",
         date="2013-03-01", experiment="BESIII, Belle", lane="hidden-heavy", status="observed",
         ref="Phys. Rev. Lett. 110 (2013) 252001; 252002", arxiv="https://arxiv.org/abs/1303.5949", note=""),
]


# Presenter's record for each state the camera stops at. Koppenburg's table
# carries a mass and a date; a seminar HUD needs the width, the significance,
# the channel and the paper's own uncertainty split, so these are written out
# per state from the LHCb papers. `status_year` / `note_year` are the year a
# status or note first became true: a slide with `space.asof: 2015` renders
# `status_before` instead, so the 2015 stop does not announce the 2019 split.
OVERRIDES = {
    "Pc(4380)": dict(
        mass=4380, mass_err=8, mass_text="4380 ± 8 ± 29", width_text="205 ± 18 ± 86",
        significance="9σ", channel="Λb⁰ → J/ψ p K⁻",
        status="candidate", status_year=2019, status_before="observed",
        note="neither confirmed nor excluded by the 2019 fit", note_year=2019,
        ref="PRL 115 (2015) 072001"),
    "Pc(4450)": dict(
        mass=4449.8, mass_err=1.7, mass_text="4449.8 ± 1.7 ± 2.5", width_text="39 ± 5 ± 19",
        significance="12σ", channel="Λb⁰ → J/ψ p K⁻",
        status="superseded", status_year=2019, status_before="observed",
        note="resolved into Pc(4440)⁺ and Pc(4457)⁺ in 2019", note_year=2019,
        ref="PRL 115 (2015) 072001"),
    "Pc(4312)": dict(
        mass=4311.9, mass_err=0.7, mass_text="4311.9 ± 0.7", width_text="9.8 ± 2.7",
        significance="7.3σ", channel="Λb⁰ → J/ψ p K⁻", note="",
        ref="PRL 122 (2019) 222001"),
    "Pc(4440)": dict(
        mass=4440.3, mass_err=1.3, mass_text="4440.3 ± 1.3", width_text="20.6 ± 4.9",
        significance="two peaks over one: 5.4σ", channel="Λb⁰ → J/ψ p K⁻",
        note="Pc(4450)⁺ resolved", ref="PRL 122 (2019) 222001"),
    "Pc(4457)": dict(
        mass=4457.3, mass_err=0.6, mass_text="4457.3 ± 0.6", width_text="6.4 ± 2.0",
        significance="two peaks over one: 5.4σ", channel="Λb⁰ → J/ψ p K⁻",
        note="Pc(4450)⁺ resolved", ref="PRL 122 (2019) 222001"),
    "Pc(4337)": dict(
        mass=4337, mass_err=7, mass_text="4337 (+7 −4) (+2 −2)",
        width_text="29 (+26 −12) (+14 −14)", significance="3.1–3.7σ",
        channel="Bs⁰ → J/ψ p p̄", note="no Pc(4312)⁺ signal in this channel",
        ref="PRL 128 (2022) 062001"),
    "Pcs(4459)": dict(
        mass_text="4458.8 ± 2.9 (+4.7 −1.1)", width_text="17.3 ± 6.5 (+8.0 −5.7)",
        significance="3.1σ", channel="Ξb⁻ → J/ψ Λ K⁻",
        note="two overlapping peaks not excluded"),
    "Pcs(4338)": dict(
        mass_err=0.7, mass_text="4338.2 ± 0.7 ± 0.4", width_text="7.0 ± 1.2 ± 1.3",
        significance="> 15σ", channel="B⁻ → J/ψ Λ p̄",
        note="J = 1/2; positive parity excluded at 90% CL",
        ref="PRL 131 (2023) 031901"),
    "Theta(1540)": dict(
        status="not confirmed",
        date_text="2003", mass_text="1540 ± 10", significance="4.6σ (LEPS)",
        channel="γn → K⁺K⁻n",
        note="absent in the high-statistics CLAS, Belle and BaBar data; PDG 2008",
        ref="PRL 91 (2003) 012002"),   # the HUD prefixes the experiment
}

# Journal abbreviations, so the HUD reference line matches the slides' footers.
_SHORT_REF = {
    "Phys. Rev. Lett.": "PRL",
    "Phys. Lett. B": "PLB",
    "Phys. Rev. D": "PRD",
    "Sci. Bull.": "Sci. Bull.",
}


def short_ref(ref: str) -> str:
    for long, short in _SHORT_REF.items():
        if long in ref:
            return ref.replace(long, short)
    return ref


def label_html(state: dict) -> str:
    """'Pc(4312)⁺' -> 'P<sub>c</sub>(4312)⁺' so the HUD name reads as printed."""
    m = re.match(r"^P(cs|c)(\(.*)$", state.get("label", ""))
    return f"P<sub>{m.group(1)}</sub>{m.group(2)}" if m else ""


def build(html: str) -> dict:
    p = Table()
    p.feed(html)
    table = max(p.tables, key=len)
    states = []
    for row in table[1:]:
        cells = [c[0] for c in row]
        links = [l for c in row for l in c[1]]
        if len(cells) < 7:
            continue
        mass, err = parse_mass(cells[3])
        if mass is None:
            continue
        iso, yf = parse_date(cells[5])
        note = cells[7] if len(cells) > 7 else ""
        arxiv = next((l for l in links if "arxiv.org" in l), "")
        states.append(dict(
            id=make_id(cells[2]), name_tex=cells[2].strip(), name=tex_to_text(cells[2]),
            label=tex_to_text(cells[2].replace(r"c\bar{c}", "c")) if cells[2].strip().startswith("$P_") else tex_to_text(cells[2]),
            mass=mass, mass_err=err, quarks=cells[4].strip().strip("$"),
            date=iso, year_frac=round(yf, 3), experiment=cells[1].strip(),
            ref=cells[6].strip(), arxiv=arxiv, note=re.sub(r"\$([^$]*)\$", lambda m: tex_to_text(m.group(0)), note.strip()),
            lane=lane_for(cells[4]), status=status_for(note, cells[6]), origin="lhc",
        ))
    for a in ADDITIONS:
        iso, yf = parse_date_iso(a["date"])
        states.append(dict(
            id=a["id"], name_tex=a["name_tex"], name=tex_to_text(a["name_tex"]), label=tex_to_text(a["name_tex"].replace(r"c\bar{c}", "c")),
            mass=a["mass"], mass_err=a["mass_err"], quarks=a["quarks"].strip("$"),
            date=iso, year_frac=round(yf, 3), experiment=a["experiment"], ref=a["ref"],
            arxiv=a["arxiv"], note=a["note"], lane=lane_for(a["quarks"]), status=a["status"],
            origin="addition",
        ))
    for l in LANDMARKS:
        iso, yf = parse_date_iso(l["date"])
        states.append(dict(
            id=l["id"], name_tex=l["name"], name=l["name"], label=l["name"], mass=l["mass"], mass_err=l["mass_err"],
            quarks=l["quarks"].strip("$"), date=iso, year_frac=round(yf, 3),
            experiment=l["experiment"], ref=l["ref"], arxiv=l["arxiv"], note=l["note"],
            lane=l["lane"], status=l["status"], origin="pre-lhc", marker=l.get("marker", "dot"),
        ))
    for s in states:
        s.update(OVERRIDES.get(s["id"], {}))
        s["ref"] = short_ref(s["ref"])
        lh = label_html(s)
        if lh:
            s["label_html"] = lh
    # The scene draws stations, not Koppenburg's chart: keep only the records the
    # talk names (eight pentaquarks, Θ⁺(1540), the 1964 landmark).
    KEEP = set(PENTAQUARKS) | {"Theta(1540)", "quarks-1964"}
    states = [s for s in states if s["id"] in KEEP]
    return {
        "source": {
            "title": "List of hadrons observed at the LHC",
            "author": "P. Koppenburg (LHCb collaboration)",
            "url": URL,
            "cite": "LHCb-FIGURE-2021-001 and updates",
            "licence": "CC BY 4.0",
            "lhc_states": sum(1 for s in states if s["origin"] == "lhc"),
        },
        "figures": FIGURES,
        "states": states,
    }


def parse_date_iso(iso: str) -> tuple[str, float]:
    d = date.fromisoformat(iso)
    return d.isoformat(), d.year + (d.timetuple().tm_yday - 1) / 365.0


# Stop figures: the paper's own projection with the state, served from public/.
# `see` is the presenter's pointer — the one feature in that plot that IS the
# state; each was written against the cropped PNG, not the paper's caption.
FIG = "figures/papers/"
FIGURES = {
    "Pc(4380)": dict(
        src=FIG + "LHCb-PAPER-2015-029_mjpsip-default_crop.png",
        caption="LHCb, PRL 115 (2015) 072001 · m(J/ψ p), fit projection",
        see="The broad magenta hump centred near 4.38 GeV is Pc(4380)⁺; the narrow blue spike beside it is Pc(4450)⁺."),
    "Pc(4450)": dict(
        src=FIG + "LHCb-PAPER-2015-029_DoubleArgand-final_crop.png",
        caption="LHCb, PRL 115 (2015) 072001 · Argand diagram, Pc(4450)⁺, six bins of m(J/ψ p)",
        see="The six fitted points run anticlockwise round the red circle: the phase of Pc(4450)⁺ turning through the peak."),
    "Pc(4312)": dict(
        src=FIG + "LHCb-PAPER-2019-014_mjpsip-spectrum-all_crop.png",
        caption="LHCb, PRL 122 (2019) 222001 · m(J/ψ p), Runs 1–2",
        see="The small narrow bump at 4.31 GeV, low on the rising edge under the big 4.45 peak, is Pc(4312)⁺."),
    "Pc(4440)": dict(
        src=FIG + "LHCb-PAPER-2019-014_pentaquarks_nominal_fit_and_thresholds_crop.png",
        caption="LHCb, PRL 122 (2019) 222001 · fit with three narrow states and the Σc⁺D̄⁽*⁾⁰ thresholds",
        see="The magenta curve along the bottom, and the left half of the red double peak above it, is Pc(4440)⁺."),
    "Pc(4457)": dict(
        src=FIG + "LHCb-PAPER-2019-014_mjpsip-spectrum-19_crop.png",
        caption="LHCb, PRL 122 (2019) 222001 · m(J/ψ p) for m(Kp) > 1.9 GeV",
        see="In the inset, the tall spike just past 4.45 GeV, on the shoulder of the 4.44 bump, is Pc(4457)⁺."),
    "Pc(4337)": dict(
        src=FIG + "LHCb-PAPER-2021-018_Fig2e_crop.png",
        caption="LHCb, PRL 128 (2022) 062001 · m(J/ψ p) in Bs⁰ → J/ψ p p̄",
        see="The hatched teal peak at 4.34 GeV, and the bump it puts in the red fit above it, is Pc(4337)⁺."),
    "Pcs(4459)": dict(
        src=FIG + "LHCb-PAPER-2020-039_Fig3b_crop.png",
        caption="LHCb, Sci. Bull. 66 (2021) 1278 · m(J/ψ Λ) in Ξb⁻ → J/ψ Λ K⁻",
        see="The narrow filled cyan block at 4.46 GeV, and the spike it makes in the red fit, is Pcs(4459)⁰."),
    "Pcs(4338)": dict(
        src=FIG + "LHCb-PAPER-2022-031_Fig3a_crop.png",
        caption="LHCb, PRL 131 (2023) 031901 · m(J/ψ Λ) in B⁻ → J/ψ Λ p̄",
        see="At the right edge, near 4.34 GeV, the magenta peak that the grey no-pentaquark fit misses is Pcs(4338)⁰."),
}

PENTAQUARKS = ["Pc(4380)", "Pc(4450)", "Pc(4312)", "Pc(4440)", "Pc(4457)", "Pcs(4459)", "Pc(4337)", "Pcs(4338)"]


def check(data: dict) -> None:
    ids = {s["id"] for s in data["states"]}
    missing = [p for p in PENTAQUARKS if p not in ids]
    assert not missing, f"pentaquarks missing: {missing}"
    assert len(data["states"]) == 10, [s["id"] for s in data["states"]]
    for f in data["figures"].values():
        assert (OUT.parent.parent / f["src"]).is_file(), f["src"]
        assert f.get("see"), f"figure without a 'see' line: {f['src']}"
    by_id = {s["id"]: s for s in data["states"]}
    for p in PENTAQUARKS:
        for key in ("mass_text", "width_text", "significance", "channel"):
            assert by_id[p].get(key), f"{p}: missing {key}"
        assert by_id[p].get("label_html"), f"{p}: missing label_html"
    print(f"ok: {data['source']['lhc_states']} LHC states, {len(data['states'])} total, "
          f"{len(PENTAQUARKS)} pentaquark ids present")


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--cached", help="parse this saved HTML instead of fetching")
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args(argv)
    if args.cached:
        html = Path(args.cached).read_text(encoding="utf-8", errors="ignore")
    else:
        with urllib.request.urlopen(URL, timeout=30) as r:
            html = r.read().decode("utf-8", errors="ignore")
    data = build(html)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"wrote {OUT.relative_to(OUT.parents[3])}: {len(data['states'])} states")
    if args.check:
        check(data)
    return 0


if __name__ == "__main__":
    sys.exit(main())
