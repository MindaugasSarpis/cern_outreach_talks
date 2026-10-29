#!/usr/bin/env python3
"""Bake the CERN Open Data portal's record counts into data/portal.json, dated.

One HTTP GET of the portal's public search API (https://opendata.cern.ch/api/records/?size=1)
with a plain User-Agent. The total number of records and the facet counts (by
experiment, type and availability) are kept with the date they were read.
Portal counts change: every slide that shows one must carry this date.

    python3 bake/portal.py                    # one live call, write data/portal.json
    python3 bake/portal.py --cached resp.json # parse a saved API response instead
    python3 bake/portal.py --check            # re-derive from the committed api block

The `retrieved` date is the only date written: the local (Vilnius) day of the
live call, or with --cached / --check the date stored with the response (--date
overrides). --cached also takes a portal.json written earlier.
"""
from __future__ import annotations

import argparse
import json
import urllib.request
from datetime import date
from pathlib import Path

from common import DATA, emit, json_bytes

SCRIPT = "portal.py"
URL = "https://opendata.cern.ch/api/records/?size=1"
UA = "outreach-talks-data-kit/1.0 (bake/portal.py)"
FACETS = ("experiment", "type", "availability", "file_type", "collision_energy", "year")


def fetch() -> dict:
    req = urllib.request.Request(URL, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def trim(resp: dict) -> dict:
    """Keep only what the bake uses: the total and the facet buckets."""
    hits = resp.get("hits", {})
    total = hits.get("total")
    if isinstance(total, dict):
        total = total.get("value")
    aggs = {}
    for name, agg in sorted((resp.get("aggregations") or {}).items()):
        b = agg.get("buckets") if isinstance(agg, dict) else None
        if isinstance(b, list):
            aggs[name] = [[x.get("key"), x.get("doc_count")] for x in b if "key" in x]
    return {"total": total, "aggregations": aggs}


def derive(api: dict, retrieved: str) -> dict:
    a = api["aggregations"]
    pick = lambda name: {str(k): v for k, v in a.get(name, [])}
    return {
        "about": ("Record counts of the CERN Open Data portal as its public search API reported them on the "
                  "retrieved date. A record is a portal entry (a dataset, documentation, software, ...), not a file "
                  "or an event. The counts change as records are added."),
        "records": api["total"],
        "byExperiment": pick("experiment"),
        "byType": pick("type"),
        "byAvailability": pick("availability"),
        "api": api,
        "source": {"title": "CERN Open Data portal, search API", "url": URL, "doi": "", "record": None,
                   "file": "", "fileBytes": None, "checksum": None, "licence": "portal metadata (CC0-1.0)",
                   "retrieved": retrieved,
                   "note": "One GET with User-Agent '" + UA + "'; aggregations kept as [key, count] pairs."},
    }


def main(argv=None) -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--cached", help="a saved API response (JSON) or an earlier portal.json")
    ap.add_argument("--date", help="retrieved date for --cached (YYYY-MM-DD)")
    ap.add_argument("--check", action="store_true")
    a = ap.parse_args(argv)
    if a.check and not a.cached:
        old = json.loads((DATA / "portal.json").read_text(encoding="utf-8"))
        api, retrieved = old["api"], old["source"]["retrieved"]
    else:
        resp = json.loads(Path(a.cached).read_text(encoding="utf-8")) if a.cached else fetch()
        # a saved API response, or a portal.json written earlier (its api block)
        api = resp["api"] if "api" in resp else trim(resp)
        retrieved = a.date or (resp["source"]["retrieved"] if "api" in resp else date.today().isoformat())
    data = derive(api, retrieved)
    print(f"portal: {data['records']} records on {retrieved}; by experiment {data['byExperiment']}")
    out = {"portal.json": json_bytes(data)}
    ent = {"portal.json": dict(talks=[5], shape="object",
                               meaning="CERN Open Data portal record count (and by experiment / type / availability) with its date")}
    return emit(SCRIPT, out, ent, a.check)


if __name__ == "__main__":
    raise SystemExit(main())
