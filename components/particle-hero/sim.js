import {
  WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera, Mesh, Points,
  PlaneGeometry, BufferGeometry, BufferAttribute, ShaderMaterial, DataTexture,
  WebGLRenderTarget, RGBAFormat, FloatType, HalfFloatType, NearestFilter,
  AdditiveBlending, Vector2, Vector3, Vector4,
} from 'three';
import { SIM_VERT, COPY_FRAG, VEL_FRAG, POS_FRAG, RENDER_VERT, RENDER_FRAG } from './shaders/passes.glsl.js';
import { addFibers } from './fiber.js';
import { addCore } from './core.js';
import { addCollisions } from './collisions.js';
import { createRig } from './rig.js';
import { CORE_CENTER, CORE_RADIUS, BOUNDS, FORM_END } from './world.js';
import { RING_RADIUS, RING_OMEGA, RING_IP_PHASE } from './core.js';

// Cover-slide port of the lessons landing particle scene
// (CERN_lessons_on_data_analysis/landing/src/sim.js). Differences:
//   - renders into a CONTAINER (the slide), not the window: the canvas is
//     sized from the container's on-screen rect every frame, so Slidev's
//     transform-scale to the venue resolution yields native-resolution pixels;
//   - no scroll rig — rig.js drifts the hero framing on a timer;
//   - the "proton being probed" twist: every few seconds a pulse is fired down
//     one of the beam fibers; when it arrives, the shell ripples white and a
//     collision spray erupts from INSIDE the sphere (collisions.js), kicking
//     the ambient field outward;
//   - dispose() tears everything down (slides mount/unmount);
//   - VARIANTS (opts.variant): 'sphere' (the probed proton, with fibers and
//     beam pulses), 'galaxy' (a spinning spiral disc, quiet), 'ring' (a
//     collider whose two bunches cross at the interaction points twice a
//     lap; an eruption fires at each crossing). collide() erupts on demand
//     in any variant; opts.onEvent(count, manual) reports every eruption so
//     the slide can count them and play a sound for the manual ones.
// Everything else — GPGPU curl field, core assembly intro, fibers, fps guard,
// pointer wake — is the landing's code.

const FOV = 55, MAX_DT = 1 / 30;
const FIRST_PULSE_AT = FORM_END + 1.2;   // first beam pulse once the core has settled
const PULSE_EVERY = [5.5, 8.5];          // s, random in range, between pulses
const BURST_KICK = 30;                   // field shove strength at an eruption

function pickTexSize(coarse) {
  const cores = navigator.hardwareConcurrency || 4;
  const area = (screen.width || 1280) * (screen.height || 800);
  if (coarse || area < 1e6 || cores <= 4) return 160; // ~25.6k particles
  if (cores <= 8) return 256;                         // ~65.5k
  return 448;                                         // ~200.7k
}

export function createField(canvas, container, opts = {}) {
  const variant = opts.variant || 'sphere';
  const onEvent = typeof opts.onEvent === 'function' ? opts.onEvent : null;
  const coarse = matchMedia('(pointer: coarse)').matches;
  let renderer;
  try {
    renderer = new WebGLRenderer({
      canvas, alpha: true, antialias: false, powerPreference: 'high-performance',
    });
  } catch { return null; }
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); return null; }
  const type = renderer.extensions.has('EXT_color_buffer_float') ? FloatType
    : renderer.extensions.has('EXT_color_buffer_half_float') ? HalfFloatType : null;
  if (!type) { renderer.dispose(); return null; }

  const baseDpr = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2);
  renderer.setPixelRatio(baseDpr);
  renderer.setClearColor(0x000000, 0); // the slide's gradient shows through

  const size = pickTexSize(coarse);
  const count = size * size;

  // --- camera ---
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 120);
  const rig = createRig(camera, { variant });

  // --- sim targets (ping-pong pos + vel) ---
  const rt = () => new WebGLRenderTarget(size, size, {
    type, format: RGBAFormat, minFilter: NearestFilter, magFilter: NearestFilter,
    depthBuffer: false, stencilBuffer: false,
  });
  let posA = rt(), posB = rt(), velA = rt(), velB = rt();

  // --- initial positions: uniform in the 3D wrap box, w = seed ---
  const init = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    init[i * 4 + 0] = (Math.random() * 2 - 1) * BOUNDS.x;
    init[i * 4 + 1] = (Math.random() * 2 - 1) * BOUNDS.y;
    init[i * 4 + 2] = (Math.random() * 2 - 1) * BOUNDS.z;
    init[i * 4 + 3] = Math.random();
  }
  const initTex = new DataTexture(init, size, size, RGBAFormat, FloatType);
  initTex.needsUpdate = true;

  // --- sim pipeline: fullscreen quad, material swapped per pass ---
  const simScene = new Scene();
  const simCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new Mesh(new PlaneGeometry(2, 2));
  simScene.add(quad);
  const copyMat = new ShaderMaterial({ vertexShader: SIM_VERT, fragmentShader: COPY_FRAG, uniforms: { uSrc: { value: initTex } } });
  const velMat = new ShaderMaterial({
    vertexShader: SIM_VERT, fragmentShader: VEL_FRAG,
    uniforms: {
      uPos: { value: null }, uVel: { value: null }, uDt: { value: 0 }, uTime: { value: 0 },
      uPointer: { value: new Vector3(999, 999, 999) }, uPointerVel: { value: new Vector3(0, 0, 0) },
      uImpulse: { value: new Vector4(999, 999, 999, 0) },
      uBurst: { value: new Vector4(999, 999, 999, 0) },
    },
  });
  const posMat = new ShaderMaterial({
    vertexShader: SIM_VERT, fragmentShader: POS_FRAG,
    uniforms: { uPos: { value: null }, uVel: { value: null }, uDt: { value: 0 }, uBounds: { value: BOUNDS } },
  });
  const pass = (mat, target) => {
    quad.material = mat;
    renderer.setRenderTarget(target);
    renderer.render(simScene, simCam);
    renderer.setRenderTarget(null);
  };

  // --- points: position.xy = ref UV into the sim textures ---
  const refs = new Float32Array(count * 3);
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) {
    const k = j * size + i;
    refs[k * 3 + 0] = (i + 0.5) / size;
    refs[k * 3 + 1] = (j + 0.5) / size;
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(refs, 3));
  const renderMat = new ShaderMaterial({
    vertexShader: RENDER_VERT, fragmentShader: RENDER_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uPos: { value: null }, uVel: { value: null }, uSize: { value: 2.4 }, uPixelRatio: { value: baseDpr } },
  });
  const points = new Points(geo, renderMat);
  points.frustumCulled = false;
  const scene = new Scene();
  scene.add(points);
  const fibers = variant === 'sphere' ? addFibers(scene) : null;
  const core = addCore(scene, { coarse, variant });
  core.setPixelRatio(baseDpr);
  const collisions = addCollisions(scene, { coarse });
  collisions.setPixelRatio(baseDpr);

  const anchorIdx = new Map(); // fiberIdx -> core node idx (resolved lazily)
  const getAnchor = (fiberIdx, anchorDir, out) => {
    if (!anchorIdx.has(fiberIdx)) anchorIdx.set(fiberIdx, core.anchorNode(anchorDir));
    core.nodeWorld(anchorIdx.get(fiberIdx), out);
  };
  const arrivals = []; // { at, node } — beam pulses in flight toward the core

  // --- pointer state ---
  // Container-local client coords map to world by intersecting the pointer
  // ray with the plane through CORE_CENTER perpendicular to the view direction.
  const ptrClient = new Vector2(-1e4, -1e4);
  const ptrWorld = new Vector3(999, 999, 999);
  const ptrPrev = new Vector3(999, 999, 999);
  const ptrVel = new Vector3(0, 0, 0);
  const ndc = new Vector3(), rayDir = new Vector3(), camFwd = new Vector3(), tmpV = new Vector3();
  let hasPointer = false, lastPointerAt = 0, ptrFresh = true;
  const impulse = velMat.uniforms.uImpulse.value;
  const burst = velMat.uniforms.uBurst.value;

  // On-screen size of the container (post Slidev transform). CSS keeps the
  // canvas at 100% of the slide; only the drawing buffer follows this.
  let viewW = 1, viewH = 1;
  const toWorld = (cx, cy, out) => {
    ndc.set((cx / viewW) * 2 - 1, -(cy / viewH) * 2 + 1, 0.5);
    rayDir.copy(ndc).unproject(camera).sub(camera.position).normalize();
    camera.getWorldDirection(camFwd);
    const t = tmpV.copy(CORE_CENTER).sub(camera.position).dot(camFwd)
      / Math.max(rayDir.dot(camFwd), 1e-4);
    return out.copy(camera.position).addScaledVector(rayDir, t);
  };

  function resize() {
    const rect = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width)), h = Math.max(1, Math.round(rect.height));
    if (w === viewW && h === viewH) return;
    viewW = w; viewH = h;
    renderer.setSize(w, h, false); // drawing buffer only; CSS size stays 100%
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  // seed sim state: positions from initTex, velocities cleared to zero
  pass(copyMat, posA);
  renderer.setRenderTarget(velA);
  renderer.clear(true, false, false);
  renderer.setRenderTarget(null);

  // --- loop (pause + fps guard) ---
  // (THREE.Clock is deprecated; a plain timestamp delta is all we need.)
  let lastT = performance.now();
  const getDelta = () => { const t = performance.now(); const d = (t - lastT) / 1000; lastT = t; return d; };
  let raf = 0, paused = false, elapsed = 0, disposed = false;
  let nextPulseAt = FIRST_PULSE_AT;
  // ring: bunches at ±ωt meet when ωt ≡ 0 (mod π) — alternate interaction
  // points at ring angle 0 and π. Crossings before FORM_END are skipped (the
  // ring is still assembling).
  let nextCrossing = Math.ceil(FORM_END * RING_OMEGA / Math.PI) * Math.PI / RING_OMEGA;
  let crossingIdx = Math.round(nextCrossing * RING_OMEGA / Math.PI);
  let eventCount = 0;
  // fps guard: after 4s warmup, avg over ~2s windows; degrade at <40fps, twice max
  let guardStage = 0, winFrames = 0, winTime = 0;
  const eruptAt = new Vector3();
  const localPt = new Vector3();

  // One eruption: flash the structure near `node`, spray from `at` (world),
  // kick the ambient field, report it.
  const erupt = (node, at, manual) => {
    core.flashAt(node);
    const ev = collisions.spawnAt(elapsed, at);
    burst.set(ev.x, ev.y, ev.z, BURST_KICK);
    eventCount++;
    onEvent?.(eventCount, !!manual);
  };
  // Where an on-demand collision happens, per variant.
  const collideNow = (manual) => {
    if (variant === 'ring') {
      localPt.set(Math.cos(RING_IP_PHASE) * RING_RADIUS, 0, Math.sin(RING_IP_PHASE) * RING_RADIUS);
    } else if (variant === 'galaxy') {
      localPt.set(0, 0, 0);
    } else {
      localPt.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
        .multiplyScalar(CORE_RADIUS * 0.25);
    }
    core.localToWorld(localPt, eruptAt);
    erupt(core.nearestNode(localPt), eruptAt, manual);
  };

  const firePulse = (manual = false) => {
    if (!fibers) { collideNow(manual); return; }
    const b = fibers.burst();
    arrivals.push({ at: elapsed + b.arriveIn, node: anchorIdx.get(b.fiberIdx) ?? core.anchorNode(b.anchorDir), manual });
  };

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(getDelta(), MAX_DT);
    elapsed += dt;

    resize();
    rig.update(elapsed);

    // No cursor for >2.5s (or a touch device): roam a lissajous attractor so
    // the field and the fibers stay alive without one.
    if (coarse || !hasPointer || elapsed - lastPointerAt > 2.5) {
      ptrClient.set(
        (0.5 + 0.38 * Math.sin(elapsed * 0.31)) * viewW,
        (0.5 + 0.34 * Math.cos(elapsed * 0.21)) * viewH,
      );
      hasPointer = true;
    }
    toWorld(ptrClient.x, ptrClient.y, ptrWorld);
    if (ptrFresh) { ptrPrev.copy(ptrWorld); ptrFresh = false; }
    if (dt > 0) {
      ptrVel.copy(ptrWorld).sub(ptrPrev).divideScalar(dt).clampLength(0, 30);
      velMat.uniforms.uPointerVel.value.lerp(ptrVel, 0.15);
    }
    ptrPrev.copy(ptrWorld);
    velMat.uniforms.uPointer.value.copy(ptrWorld);

    velMat.uniforms.uDt.value = dt;
    velMat.uniforms.uTime.value = elapsed;
    posMat.uniforms.uDt.value = dt;

    velMat.uniforms.uPos.value = posA.texture;
    velMat.uniforms.uVel.value = velA.texture;
    pass(velMat, velB);
    posMat.uniforms.uPos.value = posA.texture;
    posMat.uniforms.uVel.value = velB.texture;
    pass(posMat, posB);
    [posA, posB] = [posB, posA];
    [velA, velB] = [velB, velA];

    impulse.w *= 0.86; // hover impulse decay

    core.update(elapsed);
    fibers?.update(elapsed, velMat.uniforms.uPointer.value, getAnchor);
    collisions.update(elapsed);

    if (variant === 'sphere') {
      // beam pulse → arrival: shell ripple + eruption from inside the sphere
      if (elapsed >= nextPulseAt) {
        nextPulseAt = elapsed + PULSE_EVERY[0] + Math.random() * (PULSE_EVERY[1] - PULSE_EVERY[0]);
        firePulse();
      }
      for (let i = arrivals.length - 1; i >= 0; i--) {
        if (elapsed >= arrivals[i].at) {
          localPt.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
            .multiplyScalar(CORE_RADIUS * 0.25);
          erupt(arrivals[i].node, core.localToWorld(localPt, eruptAt), arrivals[i].manual);
          arrivals.splice(i, 1);
        }
      }
    } else if (variant === 'ring') {
      // bunch crossing → eruption at the interaction point the bunches meet at
      if (elapsed >= nextCrossing) {
        const angle = RING_IP_PHASE + (crossingIdx % 2 === 0 ? 0 : Math.PI);
        localPt.set(Math.cos(angle) * RING_RADIUS, 0, Math.sin(angle) * RING_RADIUS);
        erupt(core.nearestNode(localPt), core.localToWorld(localPt, eruptAt), false);
        crossingIdx++;
        nextCrossing = crossingIdx * Math.PI / RING_OMEGA;
      }
    }
    burst.w *= 0.9;

    renderMat.uniforms.uPos.value = posA.texture;
    renderMat.uniforms.uVel.value = velA.texture;
    renderer.render(scene, camera);

    if (elapsed > 4 && guardStage < 2) {
      winFrames++; winTime += dt;
      if (winTime >= 2) {
        if (winFrames / winTime < 40) {
          if (guardStage === 0) {
            renderMat.uniforms.uPixelRatio.value = baseDpr * 0.7;
            renderer.setPixelRatio(baseDpr * 0.7);
            core.setPixelRatio(baseDpr * 0.7);
            collisions.setPixelRatio(baseDpr * 0.7);
          } else geo.setDrawRange(0, Math.floor(count / 2));
          guardStage++;
        }
        winFrames = 0; winTime = 0;
      }
    }
  }
  frame();

  return {
    // container-local client coords
    onPointer(cx, cy) { ptrClient.set(cx, cy); hasPointer = true; lastPointerAt = elapsed; },
    // click/tap: shove the field at the point and send a pulse down a fiber
    onImpulse(cx, cy) {
      const w = toWorld(cx, cy, new Vector3());
      impulse.set(w.x, w.y, w.z, 26);
      firePulse(true);
    },
    // keyboard: erupt right now (sphere: inside the proton; ring: at the
    // interaction point; galaxy: at the centre)
    collide() { collideNow(true); },
    get events() { return eventCount; },
    setPaused(p) {
      if (disposed || p === paused) return;
      paused = p;
      if (p) cancelAnimationFrame(raf);
      else { getDelta(); frame(); }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      for (const t of [posA, posB, velA, velB]) t.dispose();
      initTex.dispose();
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.dispose?.(); });
      quad.geometry.dispose();
      for (const m of [copyMat, velMat, posMat]) m.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
    },
  };
}
