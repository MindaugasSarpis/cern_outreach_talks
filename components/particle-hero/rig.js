import { Vector3 } from 'three';
import { CORE_CENTER } from './world.js';

// Time-driven orbital camera for the cover slide. The lessons landing drives
// this rig with scroll; a slide has no scroll, so the camera holds the
// landing's hero framing (p = 0: core right-of-center behind the left-aligned
// title) and drifts slowly around it — a gentle azimuth sway and a breathing
// radius — so the sphere reads as a 3D object without ever leaving the frame.
// No roll, ever. The first update snaps (no damping) so the frame is framed
// from the very first paint.

const D2R = Math.PI / 180;
const R0 = 10;              // hero radius (landing p = 0)
const AZI0 = -18 * D2R;
const EL0 = 2 * D2R;
const LOOK_ASIDE = 3.5;     // look this far left of the core → core sits right
const SWAY = 9 * D2R;       // ± azimuth drift
const SWAY_PERIOD = 46;     // s, full sway cycle
const BREATHE = 0.6;        // ± radius drift
const BREATHE_PERIOD = 31;  // s
const LIFT = 3 * D2R;       // ± elevation drift
const LIFT_PERIOD = 57;     // s

// Per-variant base elevation: the disc and the ring are tilted structures
// and read better from slightly above; the sphere keeps the landing's framing.
const EL_BY_VARIANT = { sphere: EL0, galaxy: 10 * D2R, ring: 8 * D2R };

export function createRig(camera, { variant = 'sphere' } = {}) {
  const pos = new Vector3(), look = new Vector3();
  const el0 = EL_BY_VARIANT[variant] ?? EL0;
  return {
    update(elapsed) {
      const azi = AZI0 + SWAY * Math.sin((elapsed / SWAY_PERIOD) * Math.PI * 2);
      const r = R0 + BREATHE * Math.sin((elapsed / BREATHE_PERIOD) * Math.PI * 2 + 1.1);
      const el = el0 + LIFT * Math.sin((elapsed / LIFT_PERIOD) * Math.PI * 2 + 2.3);
      pos.set(
        CORE_CENTER.x + r * Math.cos(el) * Math.sin(azi),
        CORE_CENTER.y + r * Math.sin(el),
        CORE_CENTER.z + r * Math.cos(el) * Math.cos(azi),
      );
      look.set(CORE_CENTER.x - LOOK_ASIDE, CORE_CENTER.y, CORE_CENTER.z);
      camera.position.copy(pos);
      camera.lookAt(look);
      camera.updateMatrixWorld();
    },
  };
}
