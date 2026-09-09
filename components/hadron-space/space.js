import {
  WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera, Mesh, Points, Group,
  PlaneGeometry, SphereGeometry, BufferGeometry, BufferAttribute, ShaderMaterial, MeshBasicMaterial, DataTexture,
  WebGLRenderTarget, RGBAFormat, FloatType, HalfFloatType, NearestFilter,
  AdditiveBlending, Vector3, Vector4,
} from 'three';
import { SIM_VERT, COPY_FRAG, VEL_FRAG, POS_FRAG, RENDER_VERT, RENDER_FRAG } from '../particle-hero/shaders/passes.glsl.js';
import { buildStation } from './dioramas.js';

// The hadron space: a path of built scenes (stations) inside the WoP landing's
// ambient particle field, one instance under the whole Startertalk deck
// (global-bottom.vue → HadronSpace.vue). Stations come from
// public/data/space.json (spec 2026-09-09-startertalk-dioramas-design.md);
// state records from public/data/hadrons.json. Slides steer the camera with
// setPose({at: <station id | state id | [x,y,z]>, dist, yaw, pitch}) and light
// a state with setStop(id). The field is pulled gently toward the active
// station (uGather) so volume gathers around the scene in view.

const FIELD_BOUNDS = new Vector3(30, 30, 30);   // ambient field wrap box (half extents; a cube so the camera never sits at a face)
const FOV = 50, MAX_DT = 1 / 30;
const D2R = Math.PI / 180;
const DEFAULT_POSE = { dist: 9, yaw: -20, pitch: 6 };
// Named poses resolve to a station; `wide` looks at the paper station from far.
const NAMED = { wide: { station: 'paper', dist: 30, yaw: -20, pitch: 12 }, origin: { station: 'paper' }, future: { station: 'future' } };
const HUD_OFFSET = new Vector3(1.5, -0.35, 0);   // a lit state lands left of centre, above the HUD, clear of the figure

function pickTexSize(coarse) {
  const cores = navigator.hardwareConcurrency || 4;
  const area = (screen.width || 1280) * (screen.height || 800);
  // sparser than the hero: this field fills a 60-unit box the camera flies through
  if (coarse || area < 1e6 || cores <= 4) return 144;
  return 224;
}

export function createSpace(canvas, container, { data, space, onArrive }) {
  const coarse = matchMedia('(pointer: coarse)').matches;
  let renderer;
  try {
    renderer = new WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
  } catch { return null; }
  if (!renderer.capabilities.isWebGL2) { renderer.dispose(); return null; }
  const type = renderer.extensions.has('EXT_color_buffer_float') ? FloatType
    : renderer.extensions.has('EXT_color_buffer_half_float') ? HalfFloatType : null;
  if (!type) { renderer.dispose(); return null; }
  const baseDpr = Math.min(devicePixelRatio || 1, coarse ? 1.5 : 2);
  renderer.setPixelRatio(baseDpr);
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 400);

  // --- records and stations -------------------------------------------------
  const byId = new Map(data.states.map((s) => [s.id, { ...s }]));
  const stations = new Map();
  const anchors = new Map();
  for (const st of space.stations) {
    const built = buildStation(st, { states: byId });
    scene.add(built.group);
    stations.set(st.id, { def: st, pos: new Vector3(...st.pos), built });
    for (const [id, p] of built.anchors) anchors.set(id, p);
  }
  for (const [id, s] of byId) if (anchors.has(id)) s.pos = anchors.get(id).clone();
  const firstStation = space.stations[0]?.id || 'paper';

  // --- ambient field (GPGPU, from particle-hero) ----------------------------
  const size = pickTexSize(coarse), count = size * size;
  const rt = () => new WebGLRenderTarget(size, size, { type, format: RGBAFormat, minFilter: NearestFilter, magFilter: NearestFilter, depthBuffer: false, stencilBuffer: false });
  let posA = rt(), posB = rt(), velA = rt(), velB = rt();
  const init = new Float32Array(count * 4);
  for (let i = 0; i < count; i++) {
    init[i * 4] = (Math.random() * 2 - 1) * FIELD_BOUNDS.x;
    init[i * 4 + 1] = (Math.random() * 2 - 1) * FIELD_BOUNDS.y;
    init[i * 4 + 2] = (Math.random() * 2 - 1) * FIELD_BOUNDS.z;
    init[i * 4 + 3] = Math.random();
  }
  const initTex = new DataTexture(init, size, size, RGBAFormat, FloatType); initTex.needsUpdate = true;
  const simScene = new Scene(), simCam = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new Mesh(new PlaneGeometry(2, 2)); simScene.add(quad);
  const copyMat = new ShaderMaterial({ vertexShader: SIM_VERT, fragmentShader: COPY_FRAG, uniforms: { uSrc: { value: initTex } } });
  const far = new Vector3(999, 999, 999);
  const velMat = new ShaderMaterial({
    vertexShader: SIM_VERT, fragmentShader: VEL_FRAG,
    uniforms: {
      uPos: { value: null }, uVel: { value: null }, uDt: { value: 0 }, uTime: { value: 0 },
      uPointer: { value: far.clone() }, uPointerVel: { value: new Vector3() },
      uImpulse: { value: new Vector4(999, 999, 999, 0) }, uBurst: { value: new Vector4(999, 999, 999, 0) },
      uGather: { value: new Vector4(0, 0, 0, 0) },
    },
  });
  const posMat = new ShaderMaterial({
    vertexShader: SIM_VERT, fragmentShader: POS_FRAG,
    uniforms: { uPos: { value: null }, uVel: { value: null }, uDt: { value: 0 }, uBounds: { value: FIELD_BOUNDS } },
  });
  const pass = (mat, target) => { quad.material = mat; renderer.setRenderTarget(target); renderer.render(simScene, simCam); renderer.setRenderTarget(null); };
  const refs = new Float32Array(count * 3);
  for (let j = 0; j < size; j++) for (let i = 0; i < size; i++) { const k = j * size + i; refs[k * 3] = (i + 0.5) / size; refs[k * 3 + 1] = (j + 0.5) / size; }
  const fieldGeo = new BufferGeometry(); fieldGeo.setAttribute('position', new BufferAttribute(refs, 3));
  const fieldMat = new ShaderMaterial({
    vertexShader: RENDER_VERT, fragmentShader: RENDER_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uPos: { value: null }, uVel: { value: null }, uSize: { value: 1.7 }, uPixelRatio: { value: baseDpr } },
  });
  const field = new Points(fieldGeo, fieldMat); field.frustumCulled = false;
  scene.add(field);
  pass(copyMat, posA);
  renderer.setRenderTarget(velA); renderer.clear(true, false, false); renderer.setRenderTarget(null);

  // --- stop highlight: a pulsing shell around the lit state --------------------
  const hi = new Group(); scene.add(hi);
  let hiMesh = null;

  // --- camera spring ----------------------------------------------------------
  let pose = { at: 'wide' };
  const goalPos = new Vector3(), goalLook = new Vector3();
  const curPos = new Vector3(), curLook = new Vector3();
  // flight: from the pose at departure to the (drifting) goal, eased with a
  // smootherstep in time — zero velocity and acceleration at both ends —
  // over a duration that grows with the distance (short hops ~1.4 s, the
  // station-to-station flights up to 4.5 s). onArrive fires once per flight.
  const fromPos = new Vector3(), fromLook = new Vector3();
  let flightT0 = -1, flightDur = 1.6, arrived = true;
  const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10);
  let firstFrame = true, currentTarget = 'wide', activeStation = firstStation;

  const nearestStation = (t) => {
    let best = firstStation, bd = Infinity;
    for (const [id, s] of stations) { const d = t.distanceTo(s.pos); if (d < bd) { bd = d; best = id; } }
    return best;
  };
  // at → { target, dist, yaw, pitch, station }; `at` is [x,y,z], a station id, a state id or a named pose
  const resolve = (p) => {
    let at = p.at;
    const out = { target: new Vector3(), station: null, dist: p.dist, yaw: p.yaw, pitch: p.pitch };
    if (typeof at === 'string' && NAMED[at]) { const n = NAMED[at]; out.dist ??= n.dist; out.yaw ??= n.yaw; out.pitch ??= n.pitch; at = n.station; }
    if (Array.isArray(at)) { out.target.set(at[0], at[1], at[2]); out.station = nearestStation(out.target); }
    else if (stations.has(at)) {
      const { def, pos } = stations.get(at); const look = def.look || {};
      out.target.copy(pos); if (look.target) out.target.add(new Vector3(...look.target));
      out.dist ??= look.dist; out.yaw ??= look.yaw; out.pitch ??= look.pitch; out.station = at;
    } else if (byId.has(at) && byId.get(at).pos) {
      out.target.copy(byId.get(at).pos).add(HUD_OFFSET);
      out.station = nearestStation(out.target);
    } else {
      out.target.copy(stations.get(firstStation).pos); out.station = firstStation;
    }
    out.dist ??= DEFAULT_POSE.dist; out.yaw ??= DEFAULT_POSE.yaw; out.pitch ??= DEFAULT_POSE.pitch;
    return out;
  };
  const applyPose = (p, elapsed) => {
    const r = resolve(p);
    const dist = r.dist * (1 + 0.02 * Math.sin(elapsed / 31 * Math.PI * 2));
    const yaw = (r.yaw + 2.5 * Math.sin(elapsed / 46 * Math.PI * 2)) * D2R;
    const pitch = (r.pitch + 1.2 * Math.sin(elapsed / 57 * Math.PI * 2 + 2)) * D2R;
    goalLook.copy(r.target);
    goalPos.set(r.target.x + dist * Math.sin(yaw) * Math.cos(pitch), r.target.y + dist * Math.sin(pitch), r.target.z + dist * Math.cos(yaw) * Math.cos(pitch));
    activeStation = r.station;
  };

  let viewW = 1, viewH = 1;
  function resize() {
    const r = container.getBoundingClientRect();
    const w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    if (w === viewW && h === viewH) return;
    viewW = w; viewH = h;
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize();

  let lastT = performance.now(), raf = 0, paused = false, elapsed = 0, disposed = false;
  let guardStage = 0, winFrames = 0, winTime = 0;
  const getDelta = () => { const t = performance.now(); const d = (t - lastT) / 1000; lastT = t; return d; };
  const period = FIELD_BOUNDS.clone().multiplyScalar(2);
  const gather = new Vector3();

  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(getDelta(), MAX_DT);
    elapsed += dt;
    resize();

    applyPose(pose, elapsed);
    if (firstFrame) { curPos.copy(goalPos); curLook.copy(goalLook); firstFrame = false; }
    if (flightT0 >= 0) {
      const u = Math.min((elapsed - flightT0) / flightDur, 1);
      const e = smoother(u);
      curPos.lerpVectors(fromPos, goalPos, e); curLook.lerpVectors(fromLook, goalLook, e);
      if (u >= 1) { flightT0 = -1; arrived = true; onArrive?.(currentTarget); }
    } else {
      const k = 1 - Math.exp(-3.0 * dt);   // parked: follow the idle drift
      curPos.lerp(goalPos, k); curLook.lerp(goalLook, k);
    }
    camera.position.copy(curPos); camera.lookAt(curLook); camera.updateMatrixWorld();

    // ambient field: tile the wrap box so dust surrounds the camera anywhere,
    // and pull it gently toward the active station (in the field's own frame)
    field.position.set(
      Math.round(curPos.x / period.x) * period.x,
      Math.round(curPos.y / period.y) * period.y,
      Math.round(curPos.z / period.z) * period.z,
    );
    const st = stations.get(activeStation);
    if (st) { gather.copy(st.pos).sub(field.position); velMat.uniforms.uGather.value.set(gather.x, gather.y, gather.z, 0.9); }
    velMat.uniforms.uDt.value = dt; velMat.uniforms.uTime.value = elapsed; posMat.uniforms.uDt.value = dt;
    velMat.uniforms.uPos.value = posA.texture; velMat.uniforms.uVel.value = velA.texture; pass(velMat, velB);
    posMat.uniforms.uPos.value = posA.texture; posMat.uniforms.uVel.value = velB.texture; pass(posMat, posB);
    [posA, posB] = [posB, posA]; [velA, velB] = [velB, velA];
    fieldMat.uniforms.uPos.value = posA.texture; fieldMat.uniforms.uVel.value = velA.texture;

    for (const s of stations.values()) s.built.update(elapsed, curPos);
    if (hiMesh) { const k = 1 + 0.12 * Math.sin(elapsed * 3); hiMesh.scale.set(k, k, k); }
    renderer.render(scene, camera);

    // frame-rate guard: step the pixel ratio down, then halve the field, if slow
    if (elapsed > 4 && guardStage < 2) {
      winFrames++; winTime += dt;
      if (winTime >= 2) {
        if (winFrames / winTime < 40) {
          const d = baseDpr * (guardStage === 0 ? 0.7 : 0.5);
          renderer.setPixelRatio(d); fieldMat.uniforms.uPixelRatio.value = d;
          if (guardStage === 1) fieldGeo.setDrawRange(0, Math.floor(count / 2));
          guardStage++;
        }
        winFrames = 0; winTime = 0;
      }
    }
  }
  frame();

  return {
    get currentTarget() { return currentTarget; },
    get arrived() { return arrived; },
    state(id) { return byId.get(id) || null; },
    // pose: { at: <station id | state id | wide | origin | future | [x,y,z]>, dist?, yaw?, pitch? }
    setPose(p, { immediate = false } = {}) {
      pose = { at: 'wide', ...(p || {}) };
      currentTarget = Array.isArray(pose.at) ? pose.at.join(',') : String(pose.at);
      container.dataset.spaceAt = currentTarget;
      if (immediate || firstFrame) { firstFrame = true; flightT0 = -1; arrived = true; return; }
      fromPos.copy(curPos); fromLook.copy(curLook);
      applyPose(pose, elapsed);
      const d = fromPos.distanceTo(goalPos) + 0.5 * fromLook.distanceTo(goalLook);
      flightDur = Math.min(4.5, Math.max(1.4, 1.1 + d / 12));
      flightT0 = elapsed; arrived = false;
    },
    setStop(id) {
      if (hiMesh) { hi.remove(hiMesh); hiMesh.geometry.dispose(); hiMesh.material.dispose(); hiMesh = null; }
      const s = id ? byId.get(id) : null;
      if (s && s.pos) {
        hiMesh = new Mesh(new SphereGeometry(0.55, 24, 16), new MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.35, blending: AdditiveBlending, depthWrite: false }));
        hiMesh.position.copy(s.pos); hi.add(hiMesh);
      }
    },
    // How far the world steps back behind a slide's text (0..1): the DOM scrim
    // darkens the canvas; this fades the station labels with it.
    setDim(d) { const k = Math.min(1, Math.max(0, Number(d) || 0)); for (const s of stations.values()) s.built.setDim(k); },
    setPaused(p) {
      if (disposed || p === paused) return;
      paused = p;
      if (p) cancelAnimationFrame(raf); else { getDelta(); frame(); }
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(raf);
      for (const t of [posA, posB, velA, velB]) t.dispose();
      initTex.dispose();
      for (const s of stations.values()) s.built.dispose();
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); });
      quad.geometry.dispose();
      for (const m of [copyMat, velMat, posMat]) m.dispose();
      renderer.dispose(); renderer.forceContextLoss?.();
    },
  };
}
