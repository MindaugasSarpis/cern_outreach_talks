// The opening's steps and events. Steps by name, as the talks' own forms take
// them (the last one is kept, so a collision built after its slide opened still
// starts); events between the collision and its sound.
const BUS = 'lhc-opening';
const state = new Map();
const handlers = new Map();
export const bus = {
  state,
  set(name, step) {
    state.set(name, step);
    window.dispatchEvent(new CustomEvent(BUS, { detail: { name, step } }));
  },
  listen(name, fn) {
    const h = (e) => { if (e.detail?.name === name) fn(e.detail.step); };
    window.addEventListener(BUS, h);
    return () => window.removeEventListener(BUS, h);
  },
  emit(type, detail) { for (const fn of handlers.get(type) || []) fn(detail); },
  on(type, fn) {
    if (!handlers.has(type)) handlers.set(type, new Set());
    handlers.get(type).add(fn);
    return () => handlers.get(type).delete(fn);
  },
};
