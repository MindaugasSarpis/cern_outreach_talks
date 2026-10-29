# Facts needed by data4learn (draft, 29 Oct 2026)

Each stays off the slide (and out of the notes) until it is filed in research/facts.jsonl.

1. **Amendment to `perceptron-course-worked`** (slide 5, and slide 6's count "from 150").
   - Claim: on the course's 200 simulated points, the sigmoid neuron with all weights at
     zero scores every point 0.5 (mean cross-entropy ln 2 = 0.693); after one gradient
     update (learning rate 0.5) its line x₁ + x₂ = 0 (w₁ 0.259, w₂ 0.255, b 0) gets 150 of
     200 right (accuracy 0.75, loss 0.510), worse than the best single threshold's 177.
   - Source: components/data-kit/data/train-perceptron.json `epochs[0]` and `epochs[1]`
     (bake/train.py, from the course's figures/src/perceptron.py, numpy default_rng(11)).
   - Use: slide 5's notes would then say that this first line is worse than the hand cut,
     150 of 200 against 177.

2. **The decay-time floor of record 401's candidates** (slide 2's Caveats, notes only).
   - Claim: the file's shortest positive decay time is 0.1500006 ps (91 531 candidates with
     TAU > 0, none under 0.150 ps), so candidates that lived shorter were removed before the
     file was written, by the data's own selection.
   - Source: components/data-kit/data/d0.f32 (bake/d0.py, from the course CSV D0_KPi.csv,
     column TAU); the selection that set it (the stripping line's decay-time requirement)
     still needs a citation, from the record 401 page or the masterclass guide
     (opendata.cern.ch/docs/lhcb-masterclass).
   - Use: the slide's notes say the floor is the data's own selection; with no filed fact the
     sentence stays in Caveats and goes on no slide.
