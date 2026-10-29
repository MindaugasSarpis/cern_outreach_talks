#!/usr/bin/env python3
"""Turn record 401's ROOT file into the four-column CSV the series reads.

CERN Open Data record 401, "LHCb event file for real measurement" (CC0),
DOI 10.7483/OPENDATA.LHCb.E7EJ.JUWR, file MasterclassData.root
(1 289 541 B, sha256 8694a2ed...3b039b). Its DecayTree has 91 583 entries,
one per D0 candidate; four of its branches carry values, written here in
file order as float32, each in numpy's shortest form (str):

  M = D0_MM (MeV/c^2)   PT = D0_PT (MeV/c)   TAU = D0_TAU (ns, -100: none)
  IPCHI2 = D0_MINIPCHI2

Needs uproot 5 (pip install uproot; made with uproot 5.7.7, awkward 2.14.0,
numpy 2.5.4, Python 3.14). The output is D0_KPi.csv, 3 926 142 B, sha256
25c3c972...c1505136, the file bake/d0.py and bake/train.py check for.

  python3 root_to_csv.py MasterclassData.root D0_KPi.csv
"""
import hashlib
import sys

import uproot

BRANCHES = {"M": "D0_MM", "PT": "D0_PT", "TAU": "D0_TAU", "IPCHI2": "D0_MINIPCHI2"}
ROOT_SHA = "8694a2ed518472b02994629154de3077fdff4aef1065691fa13ae9f6b23b039b"
CSV_SHA = "25c3c97299ea844f27308fde20a00ecaa87580868f3c767d7ade5621c1505136"


def sha256(path):
    with open(path, "rb") as f:
        return hashlib.sha256(f.read()).hexdigest()


def convert(src, dst):
    if sha256(src) != ROOT_SHA:
        print(f"warning: {src} is not record 401's file")
    tree = uproot.open(src)["DecayTree"]
    cols = tree.arrays(list(BRANCHES.values()), library="np")
    with open(dst, "w", encoding="ascii", newline="\n") as out:
        out.write(",".join(BRANCHES) + "\n")
        for row in zip(*(cols[b] for b in BRANCHES.values())):
            out.write(",".join(str(v) for v in row) + "\n")
    same = sha256(dst) == CSV_SHA
    verdict = "matches" if same else "differs from"
    print(f"{dst}: {tree.num_entries} rows, sha256 {verdict} 25c3c972")
    return 0 if same else 1


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    sys.exit(convert(sys.argv[1], sys.argv[2]))
