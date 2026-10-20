#!/usr/bin/env bash
# Fetch the hadron-space stop figures from the LHCb public results pages.
# Usage: scripts/fetch_figures.sh   (from the talk dir). Idempotent.
set -euo pipefail
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/figures/papers"; mkdir -p "$OUT"
BASE=https://lhcbproject.web.cern.ch/Publications/p
get() { # paper figname
  local f="$OUT/$1_$2.png"
  [[ -s "$f" ]] || curl -sSL "$BASE/Directory_$1/hidef_$2.png" -o "$f"
  printf '%-52s %s\n' "$(basename "$f")" "$(du -h "$f" | cut -f1)"
}

get LHCb-PAPER-2015-029 mjpsip-default        # Pc(4380), Pc(4450): m(J/psi p) fit projection
get LHCb-PAPER-2019-014 mjpsip-spectrum-all   # Pc(4312): Run 1+2 m(J/psi p)
get LHCb-PAPER-2019-014 mjpsip2x3             # Pc(4440), Pc(4457): three-peak fits
get LHCb-PAPER-2021-018 Fig2e                 # Pc(4337): m(J/psi p) in Bs -> J/psi p pbar
get LHCb-PAPER-2020-039 Fig3b                 # Pcs(4459): m(J/psi Lambda)
get LHCb-PAPER-2022-031 Fig3a                 # Pcs(4338): m(J/psi Lambda)
get LHCb-PAPER-2015-029 DoubleArgand-final    # Pc(4450): Argand diagram, panel (a)
get LHCb-PAPER-2015-029 dlz                   # slide 8: the paper's Dalitz plot
get LHCb-PAPER-2019-014 mjpsip-spectrum-19    # Pc(4457): m(J/psi p), m(Kp) > 1.9 GeV
get LHCb-PAPER-2019-014 pentaquarks_nominal_fit_and_thresholds  # Pc(4440): fit + thresholds

python3 "$(dirname "$0")/crop_figures.py"
get LHCb-PAPER-2019-014 weight                # cos(theta_Pc) weight function, Fig. 4 (the Λ* slide)
get LHCb-PAPER-2019-014 mkp-spectrum          # m(Kp): the Λ* landscape (the Λ* slide)
get LHCb-PAPER-2019-014 Dalitz_plot_pc        # m²(Kp) vs m²(J/ψ p), Runs 1–2
