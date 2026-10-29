// dk-trigger: the data lane out of the detector (bible §5 Talk 1, "The gates"). One
// packet of grains is one bunch crossing, running along x. At an active gate the packets
// the gate drops burst into dust that never returns, and a gate that `shrink`s keeps a
// packet but drops most of its bytes (Turbo). A disc of grains round the lane is the
// buffer. One packet, ours, is white and moves by steps.
//
// Lifted from MasterTalk's setup/route.js:32-177 `stream` and ported to v0.11
// (GRAIN_GLSL, stepper, eventLatch, seeded, palette colours). Generalised from 2 gates
// to 4, each with its own `keep` and `shrink`. MasterTalk's second keep of 0.06 is
// gone: it had no source, and no gate here has a default keep. A gate's numbers come
// from the deck, where the facts are.
//
// New beyond the lift:
// - When a gate fires, the packets it drops downstream burst too, on a wave from the
//   gate (MasterTalk's only burst what crossed after it). So the lane past the gate
//   empties at once: "96.7 % of the lane bursts to dust".
// - Empty crossings are fainter packets of a few grains, which no gate keeps.
// - The buffer holds packets: a slowly turning shell of parked packets round the lane.
//   Packets that reach it slow down (`hold`), ride out onto the shell, turn with it and
//   come back to the lane at its far end.
// - The collapse: the kept packets fold into one turning ball.
//
//   { "type": "dk-trigger", "name": "trg", "pos": [0, 0, 0], "grains": 24000,
//     "from": 13, "to": 115, "lane": 1.1, "speed": 7, "packets": 640, "per": 20, "empty": 0.25,
//     "gates": [{ "x": 30, "keep": 0.0333 }, { "x": 63, "keep": 1, "shrink": 0.075 }],
//     "buffer": { "at": 48, "len": 9, "r": 3.2, "grains": 6000, "hold": 3 },
//     "ours": [13, 14, 27, 44, 70], "glide": 3.5 }
//
// Fields (lengths in the object's frame, along +x):
// - from, to (-27, 75): the lane's ends. Packets fade in after `from` and out before `to`.
// - lane (1.1): the lane's radius. speed (7) is in units a second.
// - packets (340) × per (22) grains. seed (401). knot (0.1): one packet's spread across
//   the lane (σ, units; 1.6× along it). A small knot keeps a dense lane reading as many
//   packets, not merged clouds.
// - empty (0.25): the share of crossings with no collision (40 MHz of crossings against
//   about 30 MHz non-empty). They are fainter and fewer-grained, and every gate drops them.
// - gates: up to 4 entries {x, keep (1), shrink (1), ring (600), step (2 + its index)}.
//   `step` is the step that fires it (so a buffer step can stand between two gates). `keep` is the share of
//   non-empty packets the gate passes. `shrink` is the share of a kept packet's grains
//   (bytes) that go on; the rest burst. keep × shrink is the gate's byte ratio. Put
//   sourced numbers here only: the bible's 1 in 30 for HLT1, and a byte ratio such as
//   30/400 for HLT2 + Turbo (4 TB/s → 10 GB/s overall, after the ×30 of HLT1).
// - buffer: {at, len (8), r (3.2), grains (6000), hold (3), step (3), spin (0.08), alpha
//   (0.7)}. From step `step`, parked packets (grains / per of them, each a knot of `per`
//   grains) sit on a shell round the lane, a prolate spheroid `len` long and r wide (never
//   inside it), and the shell turns slowly (spin rad/s). Packets in its span move `hold`
//   times slower and, while the buffer is on, ride out onto the shell and back.
// - ours: the white packet's place per step, by step index. Each entry is a number (x on
//   the lane), [x, y, z], or { at, fold, glide, lag }. With fold the packet folds into its
//   core grain: our row (T1's close). glide (3.5) is in seconds. `lag` (0) holds a step
//   forward to this step for that many seconds: the gate it fires and our glide start
//   then (a slide whose camera flies in fires its gate once the camera has landed). Its
//   core is the series' OURS size. Past a shrinking gate it loses the same share of
//   grains, and keeps the loss: a step back holds it where it stands, never gliding it
//   upstream through a gate.
// - collapse (the last gate's step + 1): the step at which the kept packets (past the last active gate)
//   fold into a ball. ball: {at: [x, y, z] (beyond `to`, on the lane), r (2.2), spin (0.12)}.
//   The rest fade.
// - size (GRAIN), alpha (0.9). minPx (0): a floor on a grain's size in px (on a 900-high
//   frame), so a wide shot never draws the lane in 1-px grains. 0 keeps the series size.
//
// Steps: 0 hidden · 1 runs · 1 + k gates 1..k on (or each gate's `step`) · `collapse`. A
// step forward fires a gate now (after its step's `lag`). A jump of more than one step
// shows the gates before it as long on; a jump from a lane that was not running (0 or 1,
// a slide opened directly) still fires the step's own gate, after its lag, so the burst
// plays on arrival. The buffer fills from the lane on a step forward to it: each parked
// packet rides out to its slot, staggered over about 2.5 s. A step back turns the gate
// off: what it dropped stays dust, and new crossings pass.
// Each gate's on and off times go through eventLatch, and they reset once the last
// burst packet has left the lane.
// api.value(): the share of bytes the active gates pass (Π keep·shrink). busy while
// showing or hiding, while ours glides, during a gate's burst wave, and while
// collapsing.
import { Group, Color, Vector3 } from 'three';
import { GRAIN, OURS, SEED, roles } from './style.js';
import { mulberry32, gauss } from './rng.js';

export const TYPE = 'dk-trigger';
export const FIELDS = ['pos', 'name', 'grains'];
export const OWNER = 't1';
export const files = () => [];

export function install(stage, kit) {
  stage.registerBuilder(TYPE, (o, ctx) => buildTrigger(o, ctx, stage, kit), { fields: FIELDS, enterable: true });
}

const OFF = 1e9;
const MAXG = 4;

// the lane in time-length: the buffer's span takes `hold` times as long to cross
const LANE_GLSL = /* glsl */ `
uniform float uFrom, uTo, uSpeed, uLt, uB0, uB1, uHold, uBufR, uLane, uBufSpin, uBufOn;
float xOf(float s) {
  float s0 = uB0 - uFrom, s1 = s0 + uHold * (uB1 - uB0);
  if (s < s0) return uFrom + s;
  if (s < s1) return uB0 + (s - s0) / uHold;
  return uB1 + (s - s1);
}
float sOf(float x) {
  float s0 = uB0 - uFrom;
  if (x < uB0) return x - uFrom;
  if (x < uB1) return s0 + (x - uB0) * uHold;
  return s0 + uHold * (uB1 - uB0) + (x - uB1);
}
// a packet's place at x: in the buffer (while it is on) it rides out onto the shell of
// parked packets, a prolate spheroid round the lane, turns with it, and comes back
vec3 laneAt(float x, vec3 ctr, vec3 jit, float sq) {
  float hl = 0.5 * (uB1 - uB0), u = (x - uB0 - hl) / max(hl, 1e-3);
  float shell = uBufR * sqrt(max(0.0, 1.0 - u * u));
  float bump = uBufOn * step(abs(u), 1.0);
  float r0 = length(ctr.yz);
  float a0 = r0 > 1e-4 ? atan(ctr.z, ctr.y) : 0.0;
  float rr = mix(r0, max(r0, shell), bump);
  float an = a0 + bump * (x - uB0) * uHold / uSpeed * uBufSpin;
  return vec3(x, rr * cos(an), rr * sin(an)) + jit * sq;
}`;
// a floor on a grain's size: minPx (px on a 900-high frame) at this distance
const SIZE_GLSL = /* glsl */ `
uniform float uMinPx;
float sizeAt(vec3 p, float s) {
  if (uMinPx <= 0.0) return s;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  return max(s, uMinPx * max(-mv.z, 0.1) / 72.0);
}`;

let VERTS = null;
function verts(stage) {
  if (VERTS) return VERTS;
  const G = stage.GRAIN_GLSL;
  const PACKET = G + SIZE_GLSL + LANE_GLSL + /* glsl */ `
attribute vec3 aCtr, aJit, aBall;
attribute vec4 aKeep;
attribute float aPhase, aSeed, aCore, aEmpty;
uniform float uShow, uAlpha, uSize, uNG, uWave, uCollT, uUnT, uCedeT, uBallR, uSpin, uKeptX, uEmptyA;
uniform float uGX[${MAXG}], uGShrink[${MAXG}];
uniform float uGOn0, uGOn1, uGOn2, uGOn3, uGOff0, uGOff1, uGOff2, uGOff3;
uniform vec3 uBallC, uColor;
float onOf(int k) { return k == 0 ? uGOn0 : k == 1 ? uGOn1 : k == 2 ? uGOn2 : uGOn3; }
float offOf(int k) { return k == 0 ? uGOff0 : k == 1 ? uGOff1 : k == 2 ? uGOff2 : uGOff3; }
// a kept packet's look past a shrinking gate: its grains pack by the cube root of the
// share kept (the same bytes per volume), and only a hard shrink (Turbo's 1 in 13) packs
// to half and is lifted, so it still reads as a knot; 0.75 is drawn as 0.75
float packOf(float g) { float c = clamp((0.6 - g) / 0.525, 0.0, 1.0); return mix(pow(max(g, 1e-3), 0.3333), 0.5, c); }
float gainOf(float g) { return mix(1.0, 1.7, clamp((0.6 - g) / 0.525, 0.0, 1.0)); }
void main() {
  if (uShow < 0.01) { hide(); return; }
  // an empty crossing: a few grains of a fainter packet
  if (aEmpty > 0.5 && aCore < 0.5 && hash(aSeed * 3.7) > 0.35) { hide(); return; }
  bool coll = uCollT < 1e8;
  bool un = coll && uUnT < 1e8;                               // the ball unfolding back into the lane (a step back)
  float tt = coll && !un ? min(uTime, uCollT) : uTime;
  float s = mod(tt * uSpeed + aPhase * uLt, uLt);
  float x = xOf(s);
  // in the ball: kept by every active gate, past ball.from, at the moment of the collapse
  float member = 0.0;
  if (coll) {
    float xc = xOf(mod(uCollT * uSpeed + aPhase * uLt, uLt));
    member = aEmpty < 0.5 && xc >= uKeptX ? 1.0 : 0.0;
    for (int k = 0; k < ${MAXG}; k++) {
      if (float(k) >= uNG) break;
      if (onOf(k) > 1e8 || offOf(k) < 1e8 || xc <= uGX[k]) continue;
      if (aKeep[k] < 0.5) member = 0.0;
      else if (uGShrink[k] < 0.999 && aCore < 0.5 && hash(aSeed * 31.0 + float(k) * 7.0) >= uGShrink[k]) member = 0.0;
    }
  }
  float sq = 1.0, dust = -1.0, dx = 0.0, gain = 1.0;
  for (int k = 0; k < ${MAXG}; k++) {
    if (float(k) >= uNG) break;
    float on = onOf(k);
    if (on > 1e8) continue;
    float off = offOf(k), gx = uGX[k], sg = sOf(gx);
    if (s <= sg) continue;                                   // not at this gate yet
    float shrinks = step(uGShrink[k], 0.999);
    float drop = aKeep[k] < 0.5 ? 1.0 : (shrinks > 0.5 && aCore < 0.5 && hash(aSeed * 31.0 + float(k) * 7.0) >= uGShrink[k] ? 1.0 : 0.0);
    float age = (s - sg) / uSpeed, crossed = tt - age;
    float pk = mix(1.0, packOf(uGShrink[k]), shrinks), gk = mix(1.0, gainOf(uGShrink[k]), shrinks);
    if (crossed > on && crossed < off) {
      if (drop > 0.5) { dust = age; dx = gx; break; }       // burst at the gate as it crossed
      sq *= pk;                                             // the kept bytes pack tighter
      gain *= gk;
    } else if (crossed <= on && tt > on) {
      // it was past the gate when the gate fired: the wave from the gate reaches it
      float sOn = s - (tt - on) * uSpeed;
      if (sOn > sg) {
        float xOn = xOf(sOn), tw = on + (xOn - gx) / uWave;
        if (tt > tw) {
          if (drop > 0.5) { dust = tt - tw; dx = xOf(sOn + (tw - on) * uSpeed); break; }
          sq *= pk;
          gain *= gk;
        }
      }
    }
  }
  float a = gain * uAlpha * uShow * mix(1.0, uEmptyA, aEmpty) * smoothstep(0.0, 2.0, x - uFrom) * (1.0 - smoothstep(uTo - 3.0, uTo, x));
  vec3 p;
  if (dust >= 0.0) {
    if (dust > 5.5) { hide(); return; }
    vec3 q = laneAt(dx, aCtr, aJit, 1.0);
    vec3 dir = normalize(vec3(aJit.x, q.y - 0.0, q.z) + vec3(0.0001, 0.0002, 0.0));
    p = q + dir * dust * 1.3 + vec3(dust * 0.45, dust * 0.3, 0.0);
    a *= 0.95 * exp(-dust * 0.9);                            // the dust lingers a second or two: the burst reads
  } else p = laneAt(x, aCtr, aJit, sq);
  if (coll) {
    // kc: how far the collapse got (frozen at the step back while the ball unfolds);
    // back: how far the unfolding has got (the lane runs on underneath, so the grains
    // fly out to where their packets are now)
    float kc = (un ? uUnT : uTime) - uCollT;
    float back = un ? ease((uTime - uUnT) / 2.0) : 0.0;
    if (member < 0.5) a *= mix(1.0 - smoothstep(0.0, 0.8, kc), 1.0, back);
    else {
      float e = ease((kc - 0.6 * hash(aSeed * 5.0)) / 2.2) * (1.0 - back);
      vec3 b = uBallC + turnY(aBall * uBallR, uSpin * uTime);
      a = mix(a, gain * uAlpha * uShow, e);                  // in the ball, no lane-end fade
      p = mix(p, b, e);
      if (uCedeT < 1e8) a *= 1.0 - smoothstep(0.0, 1.2, uTime - uCedeT);   // a dk-pipeline pile took over
    }
  }
  if (a <= 0.002) { hide(); return; }
  place(p, sizeAt(p, uSize) * (aCore > 0.5 ? 1.15 : 1.0), a, uColor, aSeed);
}`;
  const RING = G + SIZE_GLSL + /* glsl */ `
attribute float aSeed, aGate;
uniform float uShow, uSize, uCollT, uUnT;
uniform float uGOn0, uGOn1, uGOn2, uGOn3, uGOff0, uGOff1, uGOff2, uGOff3;
uniform vec3 uColor;
void main() {
  if (uShow < 0.01) { hide(); return; }
  int k = int(aGate + 0.5);
  float on = k == 0 ? uGOn0 : k == 1 ? uGOn1 : k == 2 ? uGOn2 : uGOn3;
  float off = k == 0 ? uGOff0 : k == 1 ? uGOff1 : k == 2 ? uGOff2 : uGOff3;
  float lit = on > 1e8 ? 0.0 : smoothstep(0.0, 1.0, uTime - on) * (off > 1e8 ? 1.0 : 1.0 - smoothstep(0.0, 1.0, uTime - off));
  float fire = on > 1e8 || off < 1e8 ? 0.0 : exp(-max(uTime - on, 0.0) * 2.0) * step(on, uTime);
  float a = uShow * (0.25 + 0.3 * lit + 0.6 * fire) * (0.6 + 0.4 * hash(aSeed * 5.0));
  if (uCollT < 1e8) a *= uUnT < 1e8 ? mix(1.0 - smoothstep(0.0, 0.8, uUnT - uCollT), 1.0, smoothstep(0.0, 0.8, uTime - uUnT)) : 1.0 - smoothstep(0.0, 0.8, uTime - uCollT);
  if (a <= 0.002) { hide(); return; }
  place(position, sizeAt(position, uSize), a, uColor, aSeed);
}`;
  // the buffer: parked packets on a shell round the lane, turning as one (position.x is
  // along the lane, aR the radius, aA the angle: the knots stay knots as it turns)
  const BUF = G + SIZE_GLSL + /* glsl */ `
attribute float aSeed, aR, aA, aKnot;
attribute vec3 aBall;
uniform float uShow, uOn, uSize, uAlpha, uSpin, uBufT, uLane, uCollT, uUnT, uCedeT, uBufFold, uBallR, uBallSpin;
uniform vec3 uColor, uBallC;
void main() {
  // filling (uBufT set): each parked packet rides out from the lane to its slot in turn
  float e = uBufT < 1e8 ? ease((uTime - uBufT - 2.2 * hash(aKnot * 13.1 + 0.37)) / 0.9) : 1.0;
  float v = uShow * (uBufT < 1e8 ? e : uOn);
  // ball.buffer: the parked packets fold into the collapse's ball too (and unfold back to their slots)
  bool fold = uBufFold > 0.5 && uCollT < 1e8;
  float ef = 0.0;
  if (fold) {
    bool un = uUnT < 1e8;
    float kc = (un ? uUnT : uTime) - uCollT;
    ef = ease((kc - 0.6 * hash(aSeed * 5.0)) / 2.2) * (un ? 1.0 - ease((uTime - uUnT) / 2.0) : 1.0);
    v = uShow;
    if (uCedeT < 1e8) v *= 1.0 - smoothstep(0.0, 1.2, uTime - uCedeT);
  }
  if (v < 0.01) { hide(); return; }
  float ang = aA + uTime * uSpin, rr = mix(min(uLane, aR) * 0.5, aR, e);
  vec3 p = vec3(position.x, cos(ang) * rr, sin(ang) * rr);
  if (fold) p = mix(p, uBallC + turnY(aBall * uBallR, uBallSpin * uTime), ef);
  place(p, sizeAt(p, uSize), uAlpha * v * (0.75 + 0.25 * hash(aSeed * 3.0)), uColor, aSeed);
}`;
  const OURSV = G + SIZE_GLSL + /* glsl */ `
attribute float aSeed, aCore;
uniform float uShow, uSize, uBig, uShrink, uPack, uFold, uOursV;
uniform vec3 uAt, uColor;
void main() {
  float v = uShow * uOursV;
  if (v < 0.01) { hide(); return; }
  if (aCore > 0.5) { place(uAt, sizeAt(uAt, uBig), 1.5 * v, uColor, aSeed); return; }
  float keep = hash(aSeed * 31.0) < uShrink ? 1.0 : 0.0;
  float a = v * (1.0 - uFold) * keep;
  if (a <= 0.002) { hide(); return; }
  vec3 p = uAt + position * (1.0 + 0.15 * sin(uTime * 2.0 + aSeed * 6.0)) * (1.0 - uFold) * uPack;
  place(p, sizeAt(p, uSize), a, uColor, aSeed);
}`;
  VERTS = { PACKET, RING, BUF, OURSV };
  return VERTS;
}

function buildTrigger(o, ctx, stage, kit) {
  const P = roles(ctx.palette);
  const V = verts(stage);
  const g = new Group();
  g.position.set(o.pos?.[0] || 0, o.pos?.[1] || 0, o.pos?.[2] || 0);
  const name = String(o.name);
  const seed = o.seed ?? SEED;
  const rnd = mulberry32(seed * 101 + 9);
  const from = Number(o.from ?? -27), to = Number(o.to ?? 75), lane = Number(o.lane ?? 1.1), speed = Number(o.speed ?? 7);
  const gates = (o.gates || []).slice(0, MAXG).map((x, k) => ({
    x: Number(x.x), keep: Number(x.keep ?? 1), shrink: Number(x.shrink ?? 1), ring: Number(x.ring ?? 600), step: Math.round(Number(x.step ?? 2 + k)),
    off: (Array.isArray(x.off) ? x.off : x.off != null ? [x.off] : []).map((v) => Math.round(Number(v))),
  }));
  const NG = gates.length;
  const B = o.buffer || null;
  const bLen = B ? Number(B.len ?? 8) : 0;
  const b0 = B ? Number(B.at) - bLen / 2 : to + 1000, b1 = B ? Number(B.at) + bLen / 2 : to + 1000;
  const hold = B ? Math.max(1, Number(B.hold ?? 3)) : 1;
  const Lt = B ? (b0 - from) + hold * (b1 - b0) + (to - b1) : to - from;
  const sOf = (x) => (x < b0 ? x - from : x < b1 ? (b0 - from) + (x - b0) * hold : (b0 - from) + hold * (b1 - b0) + (x - b1));
  // the budget: packets thin first
  const per = Math.max(3, Math.round(Number(o.per ?? 22)));
  const ringN = gates.reduce((a, x) => a + x.ring, 0), bufN = B ? Math.round(Number(B.grains ?? 6000)) : 0;
  const budget = Math.min(ctx.budget ?? 300000, Number(o.grains ?? 1e9));
  let packets = Math.max(10, Math.round(Number(o.packets ?? 340)));
  const fixed = ringN + bufN + 2 * per;
  if (packets * per + fixed > budget) packets = Math.max(10, Math.floor((budget - fixed) / per));
  const emptyShare = Number(o.empty ?? 0.25);
  const knot = Number(o.knot ?? 0.1);

  const frameScale = { value: 1 };
  const shared = {
    uPixelRatio: frameScale, uShow: { value: 0 }, uCollT: { value: OFF }, uUnT: { value: OFF }, uMinPx: { value: Number(o.minPx ?? 0) },
    uGOn0: { value: OFF }, uGOn1: { value: OFF }, uGOn2: { value: OFF }, uGOn3: { value: OFF },
    uGOff0: { value: OFF }, uGOff1: { value: OFF }, uGOff2: { value: OFF }, uGOff3: { value: OFF },
  };
  const crowd = new Color(P.crowd), sel = new Color(P.sel);
  const ballR = Number(o.ball?.r ?? 2.2);
  const ballC = new Vector3(...(o.ball?.at ?? [to + ballR + 2, 0, 0]));
  const keptX = o.ball?.from != null ? Number(o.ball.from) : NG ? gates[NG - 1].x : from;

  // ---- the packets ----
  const n = packets * per;
  const ctr = new Float32Array(n * 3), jit = new Float32Array(n * 3), ball = new Float32Array(n * 3);
  const keepA = new Float32Array(n * 4), ph = new Float32Array(n), sd = new Float32Array(n), core = new Float32Array(n), empty = new Float32Array(n);
  for (let i = 0, m = 0; i < packets; i++) {
    // phases stratified (one packet a slot, jittered within it): the lane reads as a
    // steady stream of packets, not Poisson clumps; the gates' keeps stay random
    const r = lane * Math.sqrt(rnd()), a = rnd() * Math.PI * 2, cy = r * Math.cos(a), cz = r * Math.sin(a), phase = (i + 0.15 + 0.7 * rnd()) / packets;
    const isEmpty = rnd() < emptyShare ? 1 : 0;
    const keeps = [0, 0, 0, 0].map((_, k) => (k < NG && !isEmpty && rnd() < gates[k].keep ? 1 : 0));
    for (let j = 0; j < per; j++, m++) {
      ctr.set([0, cy, cz], m * 3);
      jit.set([gauss(rnd) * knot * 1.6, gauss(rnd) * knot, gauss(rnd) * knot], m * 3);
      // a point in the unit ball, for the collapse
      let bx, by, bz;
      do { bx = 2 * rnd() - 1; by = 2 * rnd() - 1; bz = 2 * rnd() - 1; } while (bx * bx + by * by + bz * bz > 1);
      ball.set([bx, by, bz], m * 3);
      keepA.set(keeps, m * 4); ph[m] = phase; sd[m] = rnd(); core[m] = j === 0 ? 1 : 0; empty[m] = isEmpty;
    }
  }
  const pmat = stage.grainMaterial(V.PACKET, {
    ...shared,
    uFrom: { value: from }, uTo: { value: to }, uSpeed: { value: speed }, uLt: { value: Lt }, uB0: { value: b0 }, uB1: { value: b1 },
    uHold: { value: hold }, uBufR: { value: B ? Number(B.r ?? 3.2) : lane }, uLane: { value: lane }, uBufSpin: { value: B ? Number(B.spin ?? 0.08) : 0 }, uBufOn: { value: 0 },
    uAlpha: { value: Number(o.alpha ?? 0.9) }, uSize: { value: Number(o.size ?? GRAIN) }, uNG: { value: NG }, uWave: { value: Number(o.wave ?? 30) },
    uBallR: { value: ballR }, uSpin: { value: Number(o.ball?.spin ?? 0.12) }, uKeptX: { value: keptX }, uEmptyA: { value: 0.4 }, uCedeT: { value: OFF },
    uGX: { value: Array.from({ length: MAXG }, (_, k) => (k < NG ? gates[k].x : 1e6)) },
    uGShrink: { value: Array.from({ length: MAXG }, (_, k) => (k < NG ? gates[k].shrink : 1)) },
    uBallC: { value: ballC }, uColor: { value: crowd },
  });
  const u = pmat.uniforms;
  const pgeo = stage.grainGeometry(n, { aCtr: [ctr, 3], aJit: [jit, 3], aBall: [ball, 3], aKeep: [keepA, 4], aPhase: [ph, 1], aSeed: [sd, 1], aCore: [core, 1], aEmpty: [empty, 1] });
  g.add(stage.grainPoints(pgeo, pmat));
  const link = (m) => { for (const k of Object.keys(shared)) m.uniforms[k] = u[k]; m.uniforms.uTime = u.uTime; return m; };
  const mats = [pmat], geos = [pgeo];

  // ---- the gates: a ring of grains round the lane at each ----
  if (ringN) {
    const pos = new Float32Array(ringN * 3), s = new Float32Array(ringN), gi = new Float32Array(ringN);
    let m = 0;
    gates.forEach((gt, k) => {
      for (let i = 0; i < gt.ring; i++, m++) {
        const a = rnd() * Math.PI * 2, r = lane * 1.7 + gauss(rnd) * 0.06;
        pos.set([gt.x + gauss(rnd) * 0.05, r * Math.cos(a), r * Math.sin(a)], m * 3); s[m] = rnd(); gi[m] = k;
      }
    });
    const rmat = link(stage.grainMaterial(V.RING, { ...shared, uSize: { value: 0.9 }, uColor: { value: crowd } }));
    const rgeo = stage.grainGeometry(ringN, { position: pos, aSeed: [s, 1], aGate: [gi, 1] });
    g.add(stage.grainPoints(rgeo, rmat)); mats.push(rmat); geos.push(rgeo);
  }

  // ---- the buffer: parked packets on a slowly turning shell round the lane ----
  let bmat = null;
  if (B) {
    const pos = new Float32Array(bufN * 3), s = new Float32Array(bufN), rr = new Float32Array(bufN), aa = new Float32Array(bufN), kn = new Float32Array(bufN), bb = new Float32Array(bufN * 3);
    const R = Number(B.r ?? 3.2), parked = Math.max(1, Math.floor(bufN / per));
    // the knots' centres: a Fibonacci sphere (even over the surface, no two knots on each
    // other) stretched to a prolate spheroid round the lane, `len` long and r wide, each
    // nudged a little in its cell; the lane enters and leaves at its tips
    const half = bLen / 2;
    for (let c = 0, i = 0; c < parked; c++) {
      const ux = Math.max(-0.985, Math.min(0.985, 1 - (2 * (c + 0.5)) / parked + gauss(rnd) * 0.004));
      const cx = Number(B.at) + half * ux;
      const ca = c * 2.39996323 + gauss(rnd) * 0.1, cr = R * Math.sqrt(1 - ux * ux) + (rnd() - 0.5) * 0.3;
      const m = c === parked - 1 ? bufN - i : per;
      for (let j = 0; j < m; j++, i++) {
        pos.set([cx + gauss(rnd) * knot * 1.6, 0, 0], i * 3);
        rr[i] = cr + gauss(rnd) * knot; aa[i] = ca + (gauss(rnd) * knot) / R; s[i] = rnd(); kn[i] = c;
        let bx, by, bz;
        do { bx = 2 * rnd() - 1; by = 2 * rnd() - 1; bz = 2 * rnd() - 1; } while (bx * bx + by * by + bz * bz > 1);
        bb.set([bx, by, bz], i * 3);
      }
    }
    bmat = link(stage.grainMaterial(V.BUF, {
      ...shared, uOn: { value: 0 }, uBufT: { value: OFF }, uLane: { value: lane }, uSize: { value: Number(o.size ?? GRAIN) }, uSpin: { value: Number(B.spin ?? 0.08) }, uAlpha: { value: Number(B.alpha ?? 0.7) }, uColor: { value: crowd },
      uBufFold: { value: o.ball?.buffer ? 1 : 0 }, uCedeT: u.uCedeT, uBallC: u.uBallC, uBallR: u.uBallR, uBallSpin: u.uSpin,
    }));
    const bgeo = stage.grainGeometry(bufN, { position: pos, aSeed: [s, 1], aR: [rr, 1], aA: [aa, 1], aKnot: [kn, 1], aBall: [bb, 3] });
    g.add(stage.grainPoints(bgeo, bmat)); mats.push(bmat); geos.push(bgeo);
  }

  // ---- ours: a white packet, its core our grain ----
  const om = link(stage.grainMaterial(V.OURSV, {
    ...shared, uSize: { value: GRAIN }, uBig: { value: OURS }, uShrink: { value: 1 }, uPack: { value: 1 }, uFold: { value: 0 }, uOursV: { value: o.ours === false ? 0 : 1 },
    uAt: { value: new Vector3() }, uColor: { value: sel },
  }));
  {
    // twice a packet's grains, so the one white packet holds its own beside the light-blue ones
    const no = 2 * per, pos = new Float32Array(no * 3), s = new Float32Array(no), c = new Float32Array(no);
    for (let i = 0; i < no; i++) { if (i) pos.set([gauss(rnd) * knot * 1.8, gauss(rnd) * knot * 1.3, gauss(rnd) * knot * 1.3], i * 3); s[i] = rnd(); c[i] = i === 0 ? 1 : 0; }
    const ogeo = stage.grainGeometry(no, { position: pos, aSeed: [s, 1], aCore: [c, 1] });
    g.add(stage.grainPoints(ogeo, om)); mats.push(om); geos.push(ogeo);
  }
  // ours per step: x, [x, y, z], { at, fold, glide, lag }, or false / null (hidden: it
  // fades where it stands, at the place of the nearest step before that has one).
  // `ours: false` on the object: no packet of ours at all (T4's gate)
  const oursList = o.ours === false ? [false] : Array.isArray(o.ours) ? o.ours : [from];
  const hiddenE = (e) => e === false || e === null;
  const oursAt = (k) => {
    const i = Math.max(0, Math.min(oursList.length - 1, k));
    let j = i;
    while (j > 0 && hiddenE(oursList[j])) j--;
    const e = hiddenE(oursList[j]) ? from : oursList[j];
    const obj = e && typeof e === 'object' && !Array.isArray(e);
    const at = obj ? e.at : e;
    const v = Array.isArray(at) ? new Vector3(at[0] || 0, at[1] || 0, at[2] || 0) : new Vector3(Number(at ?? from), 0, 0);
    const own = oursList[i], ob = own && typeof own === 'object' && !Array.isArray(own);
    return {
      v, hidden: hiddenE(own), fold: !!(obj && e.fold),
      glide: ob && own.glide != null ? Number(own.glide) : null, lag: ob ? Math.max(0, Number(own.lag ?? 0)) : 0,
    };
  };

  // ---- steps ----
  const lastGateStep = NG ? Math.max(...gates.map((gt) => gt.step)) : 1;
  const C = Math.round(Number(o.collapse ?? Math.max(lastGateStep, B && B.step != null ? Number(B.step) : 0, ...gates.flatMap((gt) => gt.off)) + 1));
  const latches = gates.map((gt, k) => stage.eventLatch(u, {
    start: `uGOn${k}`, hide: `uGOff${k}`,
    // until the last packet it burst has run off the lane
    fade: (Lt - sOf(gt.x)) / speed + 2,
  }));
  const gateWants = (gt, k) => k >= gt.step && !gt.off.includes(k);
  const st = stage.stepper(name);
  let now = 0, show = 0, wantShow = 0, bufOn = 0;
  let o0 = oursAt(0).v.clone(), o1 = o0.clone(), oT = -OFF, fold0 = 0, fold1 = 0;
  let ov0 = oursAt(0).hidden || o.ours === false ? 0 : 1, ov1 = ov0, ovT = -OFF;
  const OV = 0.8;   // seconds for ours to fade in or out
  let shrinkNow = 1, waveTill = -OFF, collTill = -OFF, unTill = -OFF;
  const glide0 = Number(o.glide ?? 3.5);
  let glide = glide0;
  const passed = gates.map(() => false);   // the shrinking gates ours has crossed while on
  const bufStep = B ? Number(B.step ?? 3) : OFF;
  let bufWas = 0;
  const oursNow = (t, out) => {
    const f = Math.min(1, Math.max(0, (t - oT) / glide)), e = f * f * (3 - 2 * f);
    return out.copy(o0).lerp(o1, e);
  };
  const foldNow = (t) => { const f = Math.min(1, Math.max(0, (t - oT) / glide)); return fold0 + (fold1 - fold0) * f * f * (3 - 2 * f); };
  const visNow = (t) => { const f = Math.min(1, Math.max(0, (t - ovT) / OV)); return ov0 + (ov1 - ov0) * f * f * (3 - 2 * f); };
  const tmp = new Vector3();
  const apply = () => {
    const k = Number(st.step) || 0, prev = Number.isFinite(st.prev) ? st.prev : 0;
    const running = prev >= 1;
    // a step forward from a running lane, a jump included, or an arrival on a lane that was not
    // running (step 0 or 1, a slide opened directly): the gate whose own step this is fires,
    // after the step's lag; any other gate that turns on is shown as long on
    const fwd = k > prev && k > 0;
    const arrive = !running && k >= 2;
    const back = k < prev && k > 0;
    const lag = fwd ? oursAt(Math.max(0, k)).lag : 0;
    wantShow = k > 0 ? 1 : 0;
    if (k <= 0) {
      for (const l of latches) l.stop(now);
      u.uCollT.value = OFF; u.uUnT.value = OFF; u.uCedeT.value = OFF;
    } else {
      gates.forEach((gt, i) => {
        const want = gateWants(gt, k);
        const l = latches[i];
        const fires = fwd && gt.step === k;
        if (want && !l.on) { l.start(now, fires ? now + lag : now - 100); if (fires) waveTill = Math.max(waveTill, now + lag + (to - gt.x) / u.uWave.value + 4.5); }
        else if (!want && l.on) l.stop(now);
      });
      if (k >= C) {
        // the collapse plays when it is reached from a running lane (a jump too: T4's close),
        // and stands at once on a slide opened directly
        if (u.uCollT.value > 1e8 || u.uUnT.value < 1e8) {
          const cold = !running && prev < C;
          u.uCollT.value = cold ? now - 100 : now; u.uUnT.value = OFF; u.uCedeT.value = OFF;
          collTill = cold ? now : now + 3.5;
        }
      } else if (u.uCollT.value < 1e8 && u.uUnT.value > 1e8) {
        // a step back from the collapse: the ball unfolds into the running lane
        u.uUnT.value = now; unTill = now + 2.4; collTill = -OFF; u.uCedeT.value = OFF;
      }
    }
    // the buffer fills from the lane whenever it turns on (a step forward to it, an arrival,
    // a step back out of the collapse)
    const bufWant = st.step >= bufStep && st.step < C ? 1 : 0;
    if (bmat) {
      if (bufWant && !bufWas) bmat.uniforms.uBufT.value = o.ball?.buffer && u.uUnT.value < 1e8 ? now - 100 : now;
      else if (!bufWant) bmat.uniforms.uBufT.value = OFF;
    }
    bufWas = bufWant;
    // ours: glide to this step's place (from where it stands on a step forward; from the step
    // before on an arrival); held where it stands on a step back, so it never runs upstream
    // through a gate. A hidden entry fades it where it stands
    const cur = oursNow(now, tmp).clone(), want = oursAt(Math.max(0, k)), vNow = visNow(now);
    const vWant = o.ours === false || want.hidden || k <= 0 ? 0 : 1;
    if (vWant !== ov1) { ov0 = vNow; ov1 = vWant; ovT = now + (vWant ? lag : 0); }
    if (back || want.hidden) {
      o0.copy(cur); o1.copy(cur); fold0 = fold1 = foldNow(now); oT = -OFF;
      return;
    }
    glide = want.glide ?? glide0;
    if (arrive) { const w0 = oursAt(k - 1); o0.copy(w0.v); fold0 = w0.fold ? 1 : 0; oT = now + lag; if (ov0 < 0.01) { ov0 = 0; ovT = now; } }
    else if (!fwd || vNow < 0.01) { o0.copy(want.v); fold0 = want.fold ? 1 : 0; oT = -OFF; }   // appearing: it stands at its place
    else { o0.copy(cur); fold0 = foldNow(now); oT = now + lag; }
    o1.copy(want.v); fold1 = want.fold ? 1 : 0;
  };
  // the bytes the active gates pass
  const value = () => gates.reduce((a, gt, i) => (latches[i].on && now >= u[`uGOn${i}`].value ? a * gt.keep * gt.shrink : a), 1);
  const packOf = (g) => { if (g >= 0.999) return 1; const c = Math.max(0, Math.min(1, (0.6 - g) / 0.525)); return Math.cbrt(Math.max(g, 1e-3)) * (1 - c) + 0.5 * c; };
  const wB = new Vector3();
  const api = {
    busy: () => Math.abs(show - wantShow) > 1e-3 || (now - oT < glide) || now - ovT < OV || (bmat && bmat.uniforms.uBufT.value < 1e8 && now - bmat.uniforms.uBufT.value < 3.2) || now < waveTill || now < collTill || now < unTill
      || (B ? Math.abs((st.step >= bufStep && st.step < C ? 1 : 0) - bufOn) > 0.01 : false),
    value,
    ready: () => true,
    // our packet's place now, in world coordinates (for a dk-spark to take over)
    ours(out = new Vector3()) { g.updateWorldMatrix(true, false); return oursNow(now, out).applyMatrix4(g.matrixWorld); },
    // the collapse's ball, for a dk-pipeline pile to take over: its centre (world), radius and
    // the world time it has formed; null while the lane is not collapsed
    ball() {
      if (u.uCollT.value > 1e8 || u.uUnT.value < 1e8) return null;
      g.updateWorldMatrix(true, false);
      return { at: wB.copy(ballC).applyMatrix4(g.matrixWorld).clone(), r: ballR, formedAt: u.uCollT.value + 2.8 };
    },
    // the pile has taken over: the ball fades from world time t (1.2 s); a step clears it
    cede(t = now) { if (u.uCollT.value < 1e8) { u.uCedeT.value = t; collTill = Math.max(collTill, t + 1.3); } },
  };
  kit.register(name, { type: TYPE, api });

  return {
    group: g, labels: [], frameScale, api,
    update(t) {
      const dt = Math.min(Math.max(t - now, 0), 0.1);
      now = t; u.uTime.value = t;
      if (st.fresh) { st.fresh = false; apply(); }
      for (const l of latches) l.tick(t);
      // the unfolding has ended: the collapse's times go back to OFF (events end)
      if (u.uUnT.value < 1e8 && t > unTill) { u.uCollT.value = OFF; u.uUnT.value = OFF; }
      show += Math.sign(wantShow - show) * Math.min(Math.abs(wantShow - show), dt / 1.2);
      u.uShow.value = show;
      const bufWant = st.step >= bufStep && st.step < C ? 1 : 0;
      bufOn += (bufWant - bufOn) * Math.min(1, dt * 1.5);
      if (bmat) bmat.uniforms.uOn.value = bufOn;
      u.uBufOn.value = bufOn;
      // ours: its place, its fold, and the bytes it keeps past the gates it has crossed
      const at = oursNow(t, om.uniforms.uAt.value);
      let want = 1;
      gates.forEach((gt, i) => {
        if (at.x <= gt.x) passed[i] = false;                     // upstream again (a jump back)
        else if (latches[i].on && now >= u[`uGOn${i}`].value) passed[i] = true;
        if (passed[i] && gt.shrink < 1) want *= gt.shrink;
      });
      shrinkNow += (want - shrinkNow) * Math.min(1, dt * 2.5);
      om.uniforms.uShrink.value = shrinkNow;
      om.uniforms.uPack.value = packOf(shrinkNow);
      om.uniforms.uFold.value = foldNow(t);
      om.uniforms.uOursV.value = visNow(t);
      g.visible = show > 0.001;
    },
    dispose() { st.off(); kit.unregister(name); for (const x of geos) x.dispose(); for (const m of mats) m.dispose(); },
  };
}
