# Data2Peak: facts needed

Claims the outline wanted that the bank (research/facts.jsonl) lacks. Each stays off the
slides and out of the notes until it is filed (`pnpm talk facts add`); the deck draft
(29 Oct) works without them.

| id (proposed) | claim | source | where it would go |
| --- | --- | --- | --- |
| `higgs-atlas-2012-global-5p1-sigma` | ATLAS's 2012 excess near 126 GeV has a global significance of 5.1 σ over 110-600 GeV (the look-elsewhere effect), against 5.9 σ local | ATLAS, PLB 716 (2012) 1, arXiv:1207.7214 (abstract and section 9) | slide 16 notes: local against global, tying back to slide 11; the sentence is cut until filed |
| `d0-peak-5sigma-sideband-error-worked` | with the side bands' own Poisson error in the background (variance b + (¾)² N_side) the window excess ends at 104.2 σ, and stays above 5 from candidate 227 in file order | bake/d0.py over CERN Open Data record 401 (computed 2026-10-29 for the outline; needs a bake key in d0-significance.json) | slides 13-14 caveats, only if 104 σ is said |
| `lhcb-record401-run1-trigger` | record 401's candidates passed LHCb's Run 1 trigger (hardware first stage, then software), not the all-software Run 3 trigger talk 1 shows | CERN Open Data record 401 and the LHCb masterclass guide (the portal), LHCb trigger papers for Run 1 | slide 1 caveat; today the caveat rests on `lhcb-record401-year` (Run 1 data) and `lhcb-upgrade1-trigger` (Run 3 trigger) |
| `record401-mass-preselection-window` | the file's candidates are concentrated in about 1 813-1 915 MeV/c² (the preselection's mass window), so 2 MeV bins outside it read as dips | CERN Open Data record 401 (the file; bake/d0.py could count the bins) and its preselection description | slide 5 caveat; today it says only "preselected with loose criteria" |
