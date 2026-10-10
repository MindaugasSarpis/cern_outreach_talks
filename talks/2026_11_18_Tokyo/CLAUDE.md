# Lithuania and Japan: the bilateral project (talks/2026_11_18_Tokyo)

The notes for this talk. Sessions read this file first, then the root
CLAUDE.md. Keep it current: Status after each deploy, Decisions as the owner
makes them, Figures as they are checked. The repo is public: private context
(mail, contacts, drafts the owner shared) goes to
~/.local/share/outreach_talks/briefs/tokyo.md, never here.

## Brief

Private context (sources, people, budget): `~/.local/share/outreach_talks/briefs/tokyo.md`.

- Event: introduction of the Lithuanian–Japanese bilateral research project
  (Vilnius University LHCb group and Nagoya University theory) at the
  Embassy of the Republic of Lithuania in Japan, Tokyo. Project details
  (name, funders, dates, meetings) stay in the private brief until the owner
  says they may be shown: the site and its speaker notes are public.
- Date and slot: 2026-11-18; 15 min assumed, time of day TBC
- Venue and screen: embassy room; 16:9 projector or TV assumed (TBC)
- Audience: ambassadors and dignitaries, no physics background; Japanese and
  Lithuanian guests
- Language: English for slides and notes (`lang: en`); spoken English (TBC)
- Look: slidev-addon-stage, classic palette (TBC); the same particle effects
  as the other stage talks; pictures and numbers only, no words on screen
- Story: the particle stage → what quarks are → what pentaquarks are → the
  project. Startertalk (hadron space) as inspiration, much more generic and
  schematic. Must be very impressive.
- Takeaway (draft): Lithuania and Japan together are solving one of the open
  puzzles of matter, five quarks bound together, and training young
  scientists while doing it.
- Banned: fundraising amounts unless the owner says; unchecked citation counts.

Open questions: sent to the owner 2026-10-10 (see Decisions for the defaults).

## Status

- Branch `talk/tokyo`, worktree `.claude/worktrees/tokyo` (`pnpm talk open tokyo`)
- URL: https://mindaugassarpis.github.io/cern_outreach_talks/2026_11_18_Tokyo/
- 2026-10-10: deck draft done on the defaults: 11 slides, 14.25 min, lint
  0/0, `talk check` ok. Next: shots and a sheet review (`pnpm talk review
  tokyo`), then the owner's answers to the Brief questions.
- Not deployed yet. `pnpm talk deploy` records each deploy in
  `.git/talk-status/tokyo.json`; `pnpm talk status` shows it.

## Arc

| # | Station | Picture | On screen | Spoken | Min |
|---|---|---|---|---|---|
| 1 | hero | five quarks fly in, the hum | | thanks; who I am; what follows | 1 |
| 2 | lhc | the collider of grains | 27 km LHC | the LHC; Lithuania and Japan at CERN | 1.25 |
| 2b | lhc | clip lhcb.mp4 | | LHCb, my experiment | 0.8 |
| 3 | atom | grain cloud, bright point | | atoms are empty; the nucleus | 1 |
| 4 | nucleus | protons and neutrons, strings | | the strong force | 0.75 |
| 5 | proton | u u d | 1 % | quarks; never alone; mass from energy | 1.5 |
| 6 | families | meson and baryon | | the two recipes | 1.25 |
| 7 | paper | Gell-Mann, Zweig, passages | 1964 | five quarks allowed on paper | 1.5 |
| 8 | lhcb | 2019 spectrum, pentaquark | 2015, 2019 | the discovery | 1.75 |
| 9 | interiors | molecule and compact ball | | the open question | 1.5 |
| 10 | project | two teams, one pentaquark | (dates once confirmed) | the project | 2 |
| 11 | hero | the pentaquark again | | close | 0.5 |

Total 14.8 min of 15 (numbers carry one word each; see Decisions).

## Figures

Every number on a slide, with its source. Search the facts bank first
(`pnpm talk facts search <words>`); cite its ids in the slide notes as
`<!-- facts: id1, id2 -->`.

| Value | Claim | Source (URL) | Accessed | Fact id | OK / CHECK |
| ----- | ----- | ------------ | -------- | ------- | ---------- |
| 27 km | LHC ring 26,659 m | home.cern | 2026-10-10 | cern-lhc-size-cost | OK |
| 1 % | quark masses ≈1 % of proton mass | BNL / PRL 121 212001 | | proton-mass-quarks-1-percent | OK |
| 1964 | Gell-Mann, Zweig papers | Phys. Lett. 8 214; CERN-TH-401 | | quark-model-1964-papers | OK |
| 2015, 2019 | LHCb pentaquarks | home.cern; lhcb-outreach | | lhcb-pentaquark-2015/-2019 | OK |

Open: provenance and licence of `GellMannPhoto.png`, `ZweigPhoto.png` and
the two passage scans (copied from Startertalk, not in photos.toml). If a
licence asks for a credit, it goes in tiny print on the close slide.

## Talk-owned code

Files of this talk's own (setup/, styles/, vite.config.ts) and what each does.
A piece a second talk needs moves to the shared kit instead of being copied.

## Decisions

The owner's decisions, dated, newest last.

- 2026-10-10 (Scheduler defaults, owner to confirm): stage palette classic,
  `lang: en`, 15 min, 16:9.
- 2026-10-10: toolkit pinned to v0.7.0 (both addons).
- 2026-10-10: cover stripped to the stage alone; the title lives only in the
  page `title:` headmatter.
- 2026-10-10: Brief questions sent; defaults used until answered are those
  in the message (15 min talk + Q&A separate, projector 16:9, English, no
  people photos without consent, classic palette).
- 2026-10-10 (house rule, main 51f4c3e): credits a licence requires go in
  tiny print on the last slide only; CERN material needs none. Nothing else
  on screen but numbers.
- 2026-10-10 (owner: "Go ahead, also take elements from startertalk (like
  gell mann and zweig papers / photos)"): AFK protocol. Built on the Brief
  defaults: 15 min, 16:9, English, classic palette, no faces of living team
  members. Reused from Startertalk: the 1964 paper station (Gell-Mann and
  Zweig portraits and passages, the five-quark cluster), the hero pentaquark,
  the molecule-vs-compact pair, the LHCb 2019 J/ψp spectrum. Undo: drop the
  stations from `public/data/space.json` and their slides.
- 2026-10-10: only shipped stage forms (collider, constellation, the hadron
  plugin's pentaquark/cluster/molecule, page, tracks); no talk-owned builder,
  so no new world mechanic needs the two-slide prototype. The project slide
  is two constellations (the Vilnius team, cyan; the Japanese team, rose)
  with lit tracks into a pentaquark between them, not a geographic map
  (the constellation's nodes orbit, so a map would need a new builder).
  Alternative: a globe builder with Vilnius, CERN and Nagoya, prototyped
  first.
- 2026-10-10: on-screen numbers are 27 km, 1 %, 1964, 2015, 2019,
  (`.num` in `styles/index.css`, #e8f6ff). Everything
  else is in the notes.

- 2026-10-10 (owner rule, main 8c7fd47, then "fewer words so I can adapt to
  the audience; these slides are not lecture slides", via the Scheduler):
  one word under each number (27 km LHC, 1 % mass, 1964 quarks, 2015
  discovery, 2019 precision); world
  names only where the picture needs them: Gell-Mann, Zweig, Vilnius
  University, Nagoya University. Everything else is narrated. The opener is
  the pentaquark picture alone (no title or section slides).
- 2026-10-10 (AFK, "complete everything"): added the library clip lhcb.mp4
  (0:47, the LHCb detector in 3D with music) after the LHC slide, so the
  embassy sees the real detector once; the LHC slide drops to 1.25 min.
  Undo: delete the clip slide and `public/video-frames/lhcb*`.
- 2026-10-10: three sheet reviews by subagents (busy, meaning, legibility,
  framing); fixes in a22923a, c7f7d1c, 8f987b2.

- 2026-10-10 (Scheduler, owner AFK): nothing sourced only from the owner's
  own mail or Drive goes into the deck, its notes or this file, because the
  Pages site and the notes are public. The project slide shows the two teams
  and the pentaquark with no dates; the project's name, funders, dates and
  the Nagoya meeting wait for the owner's yes (question 5). The page title
  no longer carries the project acronym. Earlier commits on `talk/tokyo`
  (66cec05 … bae5c35) still hold those details in history; whether to
  rewrite the branch is the owner's call.

## Verify

```bash
pnpm talk check tokyo     # videos:check, stage:check, a build into /tmp/talk-tokyo/site
pnpm talk review tokyo    # check, then shots of the changed slides and a contact sheet
pnpm talk ready tokyo     # before the venue: lint --release, check, shots, preflight, venue --dry-run
```
