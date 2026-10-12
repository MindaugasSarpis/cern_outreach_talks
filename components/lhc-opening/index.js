// The LHC opening, shared by the talks that start with it (OpenData, Užsikrauk
// karjerai): the real LHC tunnel footage, on into the beam pipe, a slow-motion
// collision of one real crossing in the black, then the deck's own clip.
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
// open data (its provenance is in the file). `"event": "cms"` on the object draws
// event-cms.json instead, a CMS crossing from 2012 that flies out to every side
// (collision-cms.js); that file is fetched as a chunk of its own, only by a talk
// that asks for it.
import { buildLhcCollision } from './collision.js';
import { buildCmsCollision } from './collision-cms.js';
import { openingSound } from './sound.js';
import LhcOpening from './LhcOpening.vue';
import EVENT from './event.json';
import { bus } from './bus.js';

const loadCms = () => import('./event-cms.json');

export function installOpening({ app, registerBuilder, event = EVENT }) {
  registerBuilder('lhc-collision', (o, ctx) => {
    const built = o.event === 'cms' ? buildCmsCollision(o, ctx, bus, loadCms) : buildLhcCollision({ ...o, event }, ctx, bus);
    if (o.sound !== false) openingSound(ctx, bus, o);
    return built;
  }, { fields: ['pos', 'name'], enterable: true });
  app?.component('LhcOpening', LhcOpening);
}

export { LhcOpening, EVENT, bus };
