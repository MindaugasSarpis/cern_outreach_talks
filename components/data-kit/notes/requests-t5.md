# Requests from t5 (dk-pipeline, Talk 5)

## 1. bake: `bake/code.py` → `data/code-lines.json` (owner: bake)

- **What.** A committed, deterministic bake that writes `data/code-lines.json`, plus a
  `manifest.json` entry (talks [5], shape "per script: bytes, sha256, lines, longest, runs",
  meaning "the real line structure of the series' scripts for dk-pipeline's code stage").
  `sync.py` then copies it to Talk 5.
- **Format** (what `pipeline.js` reads): `{ about, scripts: { "<name>": { path, bytes, sha256,
  lines, longest, runs: [[s0, e0, s1, e1, …] per line] } } }`. Each pair is the `[start, end)`
  columns of one non-blank run, with tabs expanded to 4, and the trailing newline does not
  make an empty last line.
- **Scripts:** `root_to_csv.py` (the course's,
  `CERN_lessons_on_data_analysis/lectures/workbook/docs/data/root_to_csv.py`, 1 701 B,
  40 lines) and `d0.py` (the kit's `bake/d0.py`, 718 lines; Talk 5 draws lines 87-208,
  which run from `read` to `lm`). The course repo is not public, so record its path
  as text and keep a copy of only its line structure. That is what lab 5 does.
- **Why.** The code stage has to be drawn from the real files. Lab 5 holds a copy made
  by the script below, and that copy goes stale whenever `d0.py` changes. With
  `--check`, the bake should fail when a script's sha256 no longer matches.
- **The script** lab 5 used (scratchpad `t5/code_lines.py`; adopt it as is):
  `python3 code_lines.py OUT "name=path=shown" …`. It does `re.finditer(r"\S+",
  line.expandtabs(4))` per line, writes compact JSON and adds no timestamps.

## 2. dk-hist `{select}` sweep on the world clock (owner: core, hist.js)

- **What.** A step key that refills through a range of selections by itself, for example
  `{ select: [0, 119], every: 0.15 }`. The step index would be
  `a + floor((t − t0 − lead) / every)` up to `b`, with `busy` until it holds at `b`, and
  a step back lands at once.
- **Why.** Talk 5's "120 refills, then one held" needs 120 refills in about 18 s.
  Today that takes 120 steps in the object (lab 5 has them) and something to advance
  the bus. `setStepLater` chains from a deck can outlive their slide. A sweep that
  follows from the step and world time leaves no state behind.

## 3. dk-hist `{select}`: rescale per selection (owner: core)

- **What.** An option, for example `select.rescale: true` or `peaks.rescale`, that sets
  each refill's y scale to that selection's tallest bin.
- **Why.** The selections keep between 2 803 and 91 534 rows (tallest bin 267 to 3 746).
  At a fixed scale the late selections collapse to a flat band at the bottom, and the
  slide is about where the peak sits, not how many rows survive. Lab 5 does this by hand
  with a per-step `max` (computed from d0.f32 with numpy, 120 values in space.json), and
  it reads well. A built-in option would spare Talk 5 the generated list.

## 4. dk-hist `peaks`: visible ticks (owner: core). Superseded by 6 after review

A fresh-eyes review (29 Oct) judged the zoom-40 row under the mass axis misleading: it
lies across about 1 847-1 866 on the real tick labels, so the room reads a 20 MeV spread
where the true one is 0.43 MeV. Lab 5 no longer uses `peaks`. If core keeps the option,
it should print its own scale (two fixed-size tick labels on its own short line), never
sit under the mass axis at a hidden zoom. The text below is the original request.

## 4 (original). dk-hist `peaks`: visible ticks

- **What.** Draw each fitted peak as a short vertical tick of grains (for example 6-8
  grains, about 0.25 world units), at `OURS` size or brighter. Optionally stack peaks
  that coincide, so the row becomes a small dot plot of the 120 fitted centres.
- **Why.** On the lab slides (7 and 8, dist 20) the row of 120 single grains reads as a
  faint dotted line under 1 860, and 41 of them are almost invisible. The bible wants
  "the spread grows as a row of ticks", and a lone grain is not yet a tick. `zoom` 40
  also makes it a magnified ruler (0.43 MeV of spread shown as 17 MeV), so the notes
  have to say so.

## 5. dk-hist: arrival without replay for a second run (owner: core; optional)

- **What.** A per-object `replay: false`, so that an arrival or `c` shows the step's
  settled state at once instead of refilling it.
- **Why.** In the pipeline's run-2 slide only run 2 should animate. When the slide is
  reached in order, run 1 is already standing (no arrival). When it is opened cold
  (shots, `c`, a jump), run 1 refills together with run 2, so "run 2 lands on run 1"
  cannot be seen. Lab 5's test slide 6 works around this with an `{ lead: 8.5 }` step on
  run 2.

### The script (full text)

```python
#!/usr/bin/env python3
"""code-lines.json: the real line structure of the series' scripts, for dk-pipeline's code stage.

For each script: its bytes, sha256, line count and, per line, the character columns of its
non-blank runs ([start, end) pairs; tabs expanded to 4), so a deck draws each line as a row of
grains with its true indent, its true length and its true gaps between words. Deterministic,
no timestamps. Proposed for components/data-kit/bake/code.py (request t5).
"""
import hashlib, json, re, sys
from pathlib import Path

def runs(line):
    line = line.expandtabs(4).rstrip("\n")
    out = []
    for m in re.finditer(r"\S+", line):
        out += [m.start(), m.end()]
    return out

def main(out, *specs):
    scripts = {}
    for spec in specs:
        name, path, shown = spec.split("=", 2)
        b = Path(path).read_bytes()
        lines = b.decode("utf-8").split("\n")
        if lines and lines[-1] == "":
            lines = lines[:-1]
        scripts[name] = {"path": shown, "bytes": len(b), "sha256": hashlib.sha256(b).hexdigest(),
                         "lines": len(lines), "longest": max(len(l.expandtabs(4)) for l in lines),
                         "runs": [runs(l) for l in lines]}
    doc = {"about": "Per script and per line, the [start, end) columns of the non-blank runs (tabs as 4). "
                    "dk-pipeline's code stage draws one grain row per line from these: indent, length and word gaps true.",
           "scripts": scripts}
    Path(out).write_text(json.dumps(doc, separators=(",", ":")) + "\n", encoding="utf-8")
    print(out, {k: (v["lines"], v["bytes"]) for k, v in scripts.items()})

if __name__ == "__main__":
    main(*sys.argv[1:])
```

## 6. bake: `d0-peaks.f32`, the 120 fitted peaks as values (owner: bake)

- **What.** `data/d0-peaks.f32`: 120 little-endian float32, the fitted μ (MeV/c²) of
  `d0-select.json`'s selections in selection order (i = 0 first, so row 0 is the no-cut fit,
  1 864.47), plus a manifest entry (talks [5], shape [120], meaning "fitted peak of each of
  the 120 selections, for a dk-hist of the peaks with `cols: ['MU']`, `key: 'MU'`").
  `--check` should fail if it disagrees with d0-select.json.
- **Why.** Lab 5 slide 9 draws the 120 peaks as their own dk-hist (lo 1 864.15, hi
  1 864.75, bin 0.025, 6 × 3.2 units, ticks 1 864.2 / 1 864.4 / 1 864.6, dist 7) instead of a
  magnified row under the mass axis. It reads as a dot histogram on a printed scale. The lab
  holds a temporary copy written with numpy from d0-select.json (`check.mjs` warns
  not-in-manifest).

## 7. dk-hist: run 2 takes over run 1 grain by grain (owner: core, hist.js)

- **What.** An object field such as `over: '<dk-hist name>'`: as each grain of this hist
  lands, the grain of the same row in the named hist (same values, seed, ours, so the same
  slot) fades to 0 alpha (or to `overAlpha`) over about 0.3 s, at that grain's own landing
  time. A step back restores it in 0.35 s. All on the world clock from the step state, as the
  rest of hist.js. It needs a per-grain alpha (or a gone time, as dk-heap's `claim`) on the
  run-1 morph.
- **Why.** Review finding 1 (high): run 2 (crowd) landing on run 1 (sel) gave a pale grey,
  not light blue, so "run 2 lands grain for grain" had nothing to see. Lab 5 now steps run 1
  to a ghost on the run-2 slide (per-step `alpha` 0.72 → 0.12, a 1.2 s fade before run 2's
  first grains land). That reads: slide 5 shows the light-blue fill rising inside the grey
  ghost, slide 6 is plainly light blue next to slide 4's white. But the whole of run 1 dims
  at once. With `over`, the plot would turn from white to light blue bin by bin with no
  change of shape, which is the proof the bible asks for.

## 8. dk-hist: clamp grains to the bin range; landing front glow (owner: core, hist.js)

- **What.** (a) Clamp each grain's x to [lo, hi] (the jitter or the morph's spread puts a
  few grains left of the first bin, at about 1 810-1 812 on the axis line, lab 5 slides
  4-6). (b) During a long `from` fill, the grains arriving at a column's top converge on the
  same few points and, added up and bloomed, draw a bright white line along the fill front
  (lab 5 slide 5). White means selected in this series; the front should stay in the
  hist's own tone (for example cap a landing grain's alpha, or spread the landing points
  over the last row's height).
- **Why.** Review finding 11 (low) and my own reading of the frozen landing frame.

## 9. engine or kit label: tick labels bloom at close range (owner: core / engine)

- **What.** The fixed-size tick-label sprites get a white halo from the post bloom at
  hero distances (dist about 20; slides 5-6) and none at dist 25 (slide 7). Either exclude
  the label sprites from bloom or draw them at the dim tick colour so they look the same at
  every distance.
- **Why.** Review finding 11 (low): tick style differs between poses.

