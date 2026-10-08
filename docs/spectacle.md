# Spectacle

Devices that make a talk in this house style spectacular, each tied to what
it carries and to the engine piece it uses. They come from an idea panel run
on 7 October 2026 over the three October talks (cinema, data as matter,
sound and rhythm, the audience, broadcast), where each idea was checked
against the engine's source by a second agent. Only ideas that the engine can
carry are kept here; ideas that need outside infrastructure (a phone relay
server, a second-screen site) are left out.

Status words used below:

- **today**: works on the pinned engine (640eaa5 / v0.5) with headmatter,
  slide frontmatter or a talk-owned component or builder.
- **engine change**: needs a change in `slidev-addon-stage`, a release and a
  pin bump; usually a talk-local fallback exists.

The quality bar in [talk-quality.md](talk-quality.md) still rules: every
device has to carry a sentence on its slide, and a new mechanic is tried on
one sparse and one dense slide before it spreads.

## Principles

1. Spectacle carries the message. The owner's strongest praise went to
   slides where the world was the argument ("Looks impressive", "The first
   slide is super nice"); the strongest complaints to world objects that
   meant nothing ("the space doesn't bear any meaning").
2. One big move per part of the talk. Between the moves the camera rests
   and the text reads.
3. Contrast is the cheapest effect: a held dark frame, a hush, a lone grain.
   They cost nothing to render.
4. The cover holds something back and the close shows the whole route.
5. Sound is a continuous low hum with a few marked events, never a
   soundtrack competing with speech ("the sound should be a continuous low
   humm").
6. On a stream, fine moving grains and film grain turn to grey mush at about
   2.5 Mbps. Broadcast devices use fewer, larger, brighter grains (see the
   broadcast look in [STAGE_QUICKSTART.md](STAGE_QUICKSTART.md)).
7. Numbers in the world are real and sourced, baked into JSON with their
   source, and cited by fact id on their slide (`docs/talk-quality.md` §5).

## Openings

**Cold open.** The room walks in on soft dust and the faint nebula, no form,
no title. One click: the hum swells, the camera pushes in from far out over
about nine seconds, the hero form gathers, the title rises with
`data-space-assembled`. Carries the premise before it is spoken: everything
after this is made of the same grains. Uses `setPose`, the forms' arm and
assemble, the cover CSS keyed on `data-space-assembled`, `startHum`.
Status: engine change (skip the 0.6 s auto-assembly, a per-pose `seconds`,
trigger from the cover's first click so it works from the presenter
window). Risk: the long streaking flight is the heaviest of the talk; call
`holdQuality()` or lower `streak`. Fallback: start the push-in after a delay.

**A document breaks into grains.** A scanned proposal or paper on the slide
dissolves into dust on a click, and the form it describes gathers in the
world. Carries "it started on one sheet". Uses the videos addon's dust
overlay (`getOverlay().leave({ image, rect, … })` takes any same-origin
image), `stir`/`tint` through the transition announce, and `assemble()`.
Status: today, as a talk-local `<DustFigure>` component (about 60 lines).
Put the slide before it more than `reach` away from the station, or the form
is already whole when the click comes.

**Match cut from a clip into the world.** A clip whose last frames show a
form the world also has (a zoom-out ending on a galaxy) hands over to the
live world at a matched pose, and the talk flies on from there. Carries
continuity between footage and story. Uses the player's `cover` and
`transition` events, `setPose(match, { immediate: true })` while the clip
covers the world, and `assemble()` as it leaves. Status: today for the cut;
the crane flight after it needs per-pose `seconds` (engine change). Present
from the venue build, where the leaving sheet reads the live frame.

## Scale and numbers

**One grain, one unit.** Fix a unit for the whole talk (one sphere is one
terabyte) and keep every pile at its true size while the camera pulls back,
so what came before is seen shrinking into the new scale. Carries orders of
magnitude by eye. Uses talk-owned `lineup`-style builders (OpenData's
`setup/grains.js`) stepped by `<Grains>`, counted by `<Count>`. Status:
today. Say the ratio in words too: a volume ratio reads as its cube root in
width.

**Lights out.** Before the first pile, the dust, nebula and film grain fade
to nothing and one grain hangs alone in the dark; the next slide brings the
world back. Carries the unit, the only thing on screen. Uses the field gain,
the background quad's nebula and glow, and the finish pass's grain.
Status: today as a talk-local `<Lights :field="0" />` that eases those
uniforms through the `__space` probe handle and restores them on leave
(keeps the pin); a `setField(k)` in the engine is the clean version.

**Dolly zoom.** The open-data ball holds its size while the world behind it
rushes up (field of view narrowing as the camera pulls back). Carries "what
is open stays; what is recorded grows". Status: engine change (per-pose
`fov` and `seconds`, point sizes scaled with the projection so grains do not
thin out). Risk: the heaviest frame in any talk; step quality down on the
slide before. Fallback: the plain pull-back.

**Powers of ten, heard.** On a long flight between slides that carry a
`scale` in metres, one wood-block tick per factor of ten, timed to the
eased flight. Carries a journey of 10^41 that nobody can picture but anyone
can count. Uses the `flight` event's seconds and distance. Status: engine
change in `Stage.vue` and `sound.js`; ticks span about 330 Hz to 1.2 kHz,
since a low pitch vanishes on laptops.

## Data as matter

**A histogram that is a heap of grains.** One grain per candidate, stacked
in their mass bins, arriving in a seeded order; a peak builds itself out of
noise. A cut step blows most of the grains back into dust and the survivors
re-stack, the move a physicist makes. Carries a real result from public data
(a HEPData table, a CC0 open-data file). Uses a talk-owned `spectrum`
builder (about 250 lines: rank by `gl_VertexID`, draw range for the count,
a keep flag per step) with the PLACE/FRAG helpers. Status: today, talk-owned.
Keep size near 0.5 and alpha low: 16 grains deep burn white under bloom.
The notes say whose histogram it is.

**Count the real thing.** The world's counts are baked from the source
(portal API, HEPData, a CSV) by a script that writes JSON with a source
block (title, URL or DOI, retrieved, licence, recipe) and a `--cached` mode,
the `scripts/hadrons.py` pattern. `<Count>` and the builder read the same
value, so the grains, the spoken number and the citation cannot drift.
Status: today for the bake; a check that compares `<Count :to>` with the
JSON needs slide-body parsing in the checker.

**One grain opens into many.** The camera dives into a single grain, which
bursts into its parts at their real sizes (one terabyte into the requests
that make it up). Carries a change of unit made visible, and an exact sum.
Status: today, talk-owned (the grain is its own object at a fixed spot, a
`burst` start, a streams object from it). Clamp `gl_PointSize`: at dive
distance near grains reach hundreds of pixels.

**Pairs that annihilate.** Gold and blue grains meet in pairs and vanish as
two grains of light; a small remainder survives and gathers into a knot.
Carries why anything exists at all. Uses a talk-owned `pairs` builder (the
TV talk has one). Status: today. Say the ratio is symbolic; the real one is
about one in a billion.

**Matter against antimatter in data.** The same pairing done with real
B± → three-hadron candidates from a public open-data record, cell by cell
on a coarse Dalitz grid, so the published local asymmetries glow as a
surplus. Status: today, but L effort: an uproot selection at build time and
a `dalitz` builder; cells must be coarse or fluctuations light up everywhere.

**A network built from grains.** A proposal's diagram becomes a graph of
grain nodes with flowing links, then a globe of grains placed where people
live, revealed by year. Carries one sheet of paper to billions of users.
Uses a GPU `graph` builder and a `globe` builder (about 200 lines each; data
fetched through `ctx.asset`). Status: today, talk-owned, L effort. Do not
build it on `constellation`: its strings join only neighbours and it moves
every grain in JavaScript each frame.

**A touch panel as a grid of grains.** Lines across and lines down; a touch
lights one of each. Carries how the panel read a finger, from its real
geometry, with no labels. Uses a talk-owned `wires` builder (about 120
lines, the streams shader pattern). Status: today. Name the panel and year
only as CERN's own account does.

**People as a globe.** One grain per member of a collaboration or
organisation, placed on their institutes, then the handful in one country
lit. Carries personal and huge at once. Uses the `globe` builder with a
highlight step. Status: today, talk-owned; check whether the count is by
institute location or nationality.

## Sound and silence

**A hush.** The hum ducks and the dust holds its breath for a second
before one line lands. Carries "this is the moment". Status: engine change
(duck the bed; scale both the velocity and the position step so grains
freeze with their velocities kept). On a stream, floor the hush with quiet
noise: digital silence looks like a dropped feed.

**Five voices become one chord.** Silence, then as five clouds gather into a
five-quark form, five glides converge on one chord, with the station's pulse
as a heartbeat. Carries the five-quark idea by ear; a natural applause
moment. Status: engine change (`converge()` in `sound.js`, a `pulse` event,
voices projected through the camera for pan). `c` replays it.

**Forty million a second, slowed down.** Clicks timed to the collider's
meetings accelerate until they fuse into a tone; every few hundred clicks a
bell and a gold flush mark what is kept. Carries a rate the ear hears
directly. Uses the collider's lap (meetings at `n·lap/2` on the engine
clock), `tint()`. Status: engine change in `Stage.vue` and `sound.js`; say
in the notes that "one in four hundred" is by bytes, so the bell is an
illustration.

**The count sings.** Each grain landing ticks; above a few hundred a second
the ticks become a roar; the pitch rises a fifth per factor of ten. Carries
orders of magnitude heard as steps. Status: talk-owned, after the engine has
one master bus with a limiter (an engine change everything else in this
section also wants: a correctly set limiter, levels for bed, motion and
stingers, presenter control).

**Clips break into dust, and so does their sound.** A leaving clip's audio
fades with the dust (an equal-power fade over the leave), and its strongest
spectral peaks linger as quiet sines for a few seconds. Status: the fade is
one line in the player; the lingering sound needs `videos:frames` to store
peaks (engine and CLI change).

## Closings

**The whole route in one frame.** The close pulls back to a pose that shows
every station at once, with every stream still running, and the names below.
Carries the talk's map, revealed at the end. Uses one `[x, y, z]` pose
beyond `reach` of any station (nothing re-arms) and the kept `<Grains>`
steps. Status: today; a six-second crane needs per-pose `seconds`. At long
distances grains fall under a pixel: check the frame in shots.

**Follow one grain.** The one time the camera follows something instead of
going somewhere: a single grain carried from the store to the person it
reaches. Status: engine change (live anchors that a builder can move; a
generic `anchors` field for the checker). Make it two slides, and start the
grain when the camera arrives, not on slide enter.

## The room

**You are a detector.** Cosmic-ray muons cross the room at their real rate
(about one per square centimetre per minute at sea level, PDG cosmic-ray
review) as streaks of grains with a tick each, and a counter running since
the talk began. Carries an invisible, real rain made visible at its true
randomness; no phones, no network. Uses a talk-owned `rain` builder
re-centred on the camera each frame, `warmAudio()` for a talk-owned tick
voice. Status: today. The caption says it is a simulation at the measured
rate.

**A guess before each reveal.** About every 90 seconds a question with three
answers over the world; the right one forms out of the dust and the world
acts on the reveal. Carries a stake for the viewer. Uses a transparent
`StageQuiz` (QuizCard's keys 1–3, Enter, r) with answer clusters placed in
`space.json` above the tiles, an `:auto` reveal timer for recordings. Status:
today, talk-owned. Avoid the `c` key.

**The room picks.** Three options as nodes of a gold form; each press of
1–3 (or a show of hands the speaker counts) swells a node, and the camera
flies to the winner. Carries a market choice, followed by the real outcome.
Status: today with keys, through a talk-owned `poll` builder. A live phone
vote needs a relay outside the engine and is not covered here.

**Clap on three.** The laptop microphone hears the room clap; a sharp
coincidence fires a big collision spray, a ragged one only sparks. Carries
coincidence in time as the way detectors tell an event from noise. Uses
`getUserMedia` without voice processing, onset detection, and a talk-owned
copy of the collider with a `fire()` step. Status: today. Grant microphone
access for the venue origin in rehearsal; a key fires the same spray if the
mic fails.

**A survey that becomes the world.** A one-question anonymous form sent to
the audience beforehand, baked into counts; each answer is a colour in a
galaxy of exactly N grains, and the speaker's own path is one of them.
Status: today, talk-owned (`crowd` builder, a bake script). For minors:
aggregate counts only, no free text, the organiser's consent rules.

## Broadcast

**Faces condense out of the dust.** Photos of real people at each step,
built as sheets of grains that gather when the camera arrives and scatter on
the next flight. Carries real people, what a teenage audience watches. Uses
a `sheet` builder (a grid of points sampling an image, with arm and
assemble), sharing the clip overlay's luminance-as-alpha. Status: today,
talk-owned. A face needs about 120 cells across to read on a phone; consent
and credits first.

**Lower thirds from the dust.** The speaker's name and role arrive the way
everything else does: a DOM lower third with a dust border inside the
title-safe box. Uses `StageHalo` on a `.halo` element and the kit's rise.
Status: today. Ask the broadcaster first whether they add their own.

**A recorded master.** Every slide recorded frame by frame at the
broadcaster's 50 Hz, with text-free plates for the editor, in the broadcast
look. Carries the talk exactly as designed on any screen. Status: from v0.6,
`pnpm talk record <t>` (`slidev-stage-record`); the manual path is an OBS
capture on a machine with a GPU. Checklist: the `talk-broadcast` skill.
