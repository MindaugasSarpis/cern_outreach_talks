#!/usr/bin/env bash
# Page 1 of G. Zweig, "An SU(3) model for strong interaction symmetry and its
# breaking", CERN-TH-401, 17 January 1964. Source: CERN Document Server record
# 352337, http://cds.cern.ch/record/352337/files/CERN-TH-401.pdf (public).
# CDS sits behind a browser check for plain HTTP clients, so download the PDF
# in a browser and pass its path; this renders page 1 with mutool.
# Usage: scripts/fetch_zweig.sh /path/to/CERN-TH-401.pdf
set -euo pipefail
PDF="${1:?path to CERN-TH-401.pdf}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/figures/papers/zweig_th401_p1.png"
mutool draw -r 130 -o "$OUT" "$PDF" 1
printf '%s %s\n' "$(basename "$OUT")" "$(du -h "$OUT" | cut -f1)"
