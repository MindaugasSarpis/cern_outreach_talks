# Where the old root CLAUDE.md went (2026-10-08)

The root CLAUDE.md had grown to 39,264 bytes on `main` (`71fb6f1`), most of
it the history of single talks, and every session and subagent loaded all
of it. It is now about 11.5 KB: what every talk shares. Nothing was dropped.
Each paragraph and top-level bullet of the old file is below, with where it
is now. "Verbatim" means the text is unchanged (a talk's `##` heading moved
one level down under the new file's "Notes moved from the root CLAUDE.md"
heading). Checked by splitting the old file into paragraphs and bullets and
looking each one up in the new files: everything not marked "rewritten" or
"summarised" below is there word for word.

| Old root section | Now |
| ---------------- | --- |
| Intro paragraph | root, rewritten: the 12 KB limit, where notes go |
| House rules (chore/talk-cli) | root, unchanged |
| Project overview, first paragraph | root; the workstation's home-directory path to slidev-videos became `../slidev-videos` / `$SLIDEV_VIDEOS_DIR` |
| Current talks, one bullet per talk | verbatim in each `talks/<name>/CLAUDE.md`; root keeps a one-line table and the `09_00`/`10_00` placeholder rule |
| Environment setup (fresh machine) | root "Setup", summarised (README's "New machine", what the env holds); the conda commands are README's "Without bootstrap" |
| Repo layout tree | root, rewritten: adds env.yaml, `hadron-space/`, `scripts/talk.py` and bootstrap.sh, `docs/authoring.md`, `tests/`, `talks/<name>/CLAUDE.md`, `setup/` and `styles/` |
| Raw bank, Theme, Components | root, verbatim |
| Commands: the talk's command block | `docs/authoring.md` "Commands in a talk", verbatim; root summarises |
| Commands: from the repo root, `discover` | root and `docs/authoring.md`, verbatim |
| Commands: NVENC and the env's PATH prefix | root "This workstation", rewritten: `pnpm talk` puts `$OUTREACH_ENV_BIN` first; encodes through `pnpm talk render` |
| Videos (slidev-videos) | `docs/authoring.md`, verbatim; root "Videos" summarises |
| ParticleHero (live hero slides) and QuizCard | `docs/authoring.md`, verbatim |
| Hadron space: intro, `space.json`, `dioramas.js` / `labels.js` / `space.js` and rendering, frame rule, `HaloLayer.vue`, `HadronSpace.vue`, slide frontmatter | `components/hadron-space/CLAUDE.md`, verbatim |
| Hadron space: `ArgandDiagram.vue` / `LineshapeGallery.vue`, Records, Deck CSS, Koppenburg credit, Overhaul record | `talks/2026_09_00_Startertalk/CLAUDE.md`, verbatim |
| Hadron space: Verify | `talks/2026_09_00_Startertalk/CLAUDE.md`, in chore/talk-cli's wording: `pnpm talk shots startertalk` instead of an untracked script in the workstation's slidev-videos checkout |
| The stage: intro paragraph | `docs/authoring.md` "The stage"; the home-directory path became `$SLIDEV_VIDEOS_DIR/packages/stage`; root "The stage" summarises |
| The stage: Headmatter only, Palette, Slides, Clips, Check and look, the `v0.4.0` pins | `docs/authoring.md`, verbatim |
| The stage: Everything in the world is made of grains; Innoday's own pieces | `talks/2026_10_00_Innoday/CLAUDE.md`, verbatim |
| The stage: ffmpeg here | root "This workstation", rewritten |
| Open data talk (2026_10_00_OpenData) | `talks/2026_10_00_OpenData/CLAUDE.md`, verbatim |
| Užsikrauk karjerai (2026_10_26_UzsikraukKarjerai) | `talks/2026_10_26_UzsikraukKarjerai/CLAUDE.md`, verbatim |
| Slidev gotchas | root, verbatim |
| Slide authoring conventions (inherited theme) | root, verbatim, plus two bullets that point to the moved sections |
| Aspect ratio and canvas | `docs/authoring.md`, verbatim; a root bullet summarises |
| Embedded iframe slides | `docs/authoring.md`, verbatim; a root bullet points there |
| Deployment | root, verbatim, plus `pnpm talk deploy` |
| Git remotes | root, verbatim |

## Merging a branch that still edits the old root file

A branch made before the split (`main` up to `71fb6f1`) that edits the root
CLAUDE.md conflicts there. Keep the split root and carry the branch's edits
to the file the table names. A talk's notes go to its own CLAUDE.md, not
back into the root.

When the split lands on `main` after `main` itself moved on:

```bash
git merge chore/talk-cli                     # stops on CLAUDE.md
git checkout --theirs CLAUDE.md              # the split root
git diff 71fb6f1 HEAD -- CLAUDE.md           # main's edits since the split's base
# re-apply each hunk to the file the table names, then
git add CLAUDE.md talks/*/CLAUDE.md components/hadron-space/CLAUDE.md docs/authoring.md
git commit
```

When an older branch is merged after the split:

```bash
git merge <branch>                           # stops on CLAUDE.md
git checkout --ours CLAUDE.md                # the split root, from main
git diff $(git merge-base HEAD MERGE_HEAD) MERGE_HEAD -- CLAUDE.md   # the branch's edits
# re-apply each hunk to the file the table names, then add and commit as above
```

Check afterwards that the root stays under 12 KB (`wc -c CLAUDE.md`).
