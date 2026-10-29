# Facts Data1Trigger needs that the bank lacks (draft:data1trigger, 29 Oct)

Each stays off the slides and out of the Message lines until filed.

- `lhcb-hlt1-selections`: what LHCb's first software filter selected in Run 3 (tracks with
  large momentum across the beam, tracks that point away from the collision, muons: signs
  of a short-lived heavy particle). Source: LHCb, "Allen: a high-level trigger on GPUs for
  LHCb", Comput. Softw. Big Sci. 4 (2020) 7 (arXiv:1912.09161), or the LHCb Run 3
  Starterkit dataflow page (https://lhcb-starterkit-run3.docs.cern.ch/first-analysis-steps/dataflow).
  Slide 8 (notes) and slide 13 (notes: two of the row's numbers are the kind the filters
  looked at).
- `lhcb-record401-run1-trigger`: which trigger or stream record 401's sample came from
  (the masterclass guide says "randomly collected"; a no-bias or minimum-bias stream would
  mean it passed no physics filter). Source: CERN Open Data record 401
  (https://opendata.cern.ch/record/401) and the LHCb masterclass guide
  (https://opendata.cern.ch/docs/lhcb-masterclass). Slide 13 (caveat).
- `lhcb-crossing-24506-event` (optional): the cover crossing's own numbers (run 133488,
  event 2028034058, 237 good tracks). Source: CERN Open Data record 24506 and
  components/lhc-opening/event.json. Only if the cover ever shows a number (it shows none).
