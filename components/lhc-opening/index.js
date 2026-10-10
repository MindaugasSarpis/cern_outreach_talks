// The LHC opening, shared by the talks that start with it (OpenData, Užsikrauk
// karjerai): the real LHC tunnel footage, on into the beam pipe, a slow-motion
// collision of one real LHCb crossing in the black, then the deck's own clip.
//
// A talk installs it from setup/main.ts:
//
//   import { installOpening } from '../components/lhc-opening/index.js'
//   export default ({ app }) => { installOpening({ app, registerBuilder }); … }
//
// which registers the stage builder `lhc-collision` (collision.js), the slide
// component <LhcOpening name="opening" /> that starts it when its slide opens and
// lets it fade when the slide is left, and the sound (sound.js). The station that
// holds the collision goes in the talk's space.json, far from every other form:
//
//   { "id": "opening", "pos": [0, -600, 0], "objects": [
//       { "type": "lhc-collision", "name": "opening", "pos": [0, -600, 0] } ] }
//
// The event is event.json beside this file: one real crossing from LHCb's 2012
// open data (its provenance is in the file).
import { buildLhcCollision } from './collision.js';
import { openingSound } from './sound.js';
import LhcOpening from './LhcOpening.vue';
import EVENT from './event.json';
import { bus } from './bus.js';

export function installOpening({ app, registerBuilder, event = EVENT }) {
  registerBuilder('lhc-collision', (o, ctx) => {
    const built = buildLhcCollision({ event, ...o }, ctx, bus);
    if (o.sound !== false) openingSound(ctx, bus, o);
    return built;
  }, { fields: ['pos', 'name'], enterable: true });
  app?.component('LhcOpening', LhcOpening);
}

export { LhcOpening, EVENT, bus };
