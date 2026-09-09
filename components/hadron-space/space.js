import {
  WebGLRenderer, Scene, PerspectiveCamera, OrthographicCamera, Mesh, Points, Group,
  PlaneGeometry, BufferGeometry, BufferAttribute, ShaderMaterial, DataTexture,
  WebGLRenderTarget, RGBAFormat, FloatType, HalfFloatType, NearestFilter,
  AdditiveBlending, LineSegments, LineBasicMaterial, Sprite, SpriteMaterial,
  CanvasTexture, LinearFilter, Vector3, Vector4,
} from 'three';
import { SIM_VERT, COPY_FRAG, VEL_FRAG, POS_FRAG, RENDER_VERT, RENDER_FRAG } from '../particle-hero/shaders/passes.glsl.js';

// The hadron space: every hadron discovered at the LHC (plus a few pre-LHC
// landmarks) as a glowing point in a 3D spectrum — discovery date along x,
// mass up y, quark family in depth z — inside the WoP landing's ambient
// particle field. One instance lives under the whole Startertalk deck
// (global-bottom.vue → HadronSpace.vue); slides move the camera with
// setPose() and light a state with setStop().
//
// Coordinates (spec §2.2): x(year) = (year−1964)·0.25 before 2011, then
// 11.75 + (year−2011); y = mass[GeV]·1.4; z = lane.

export const LANE_Z = {
  pentaquark: 0, 'hidden-heavy': -3.2, 'open-flavour': -6.4,
  'fully-heavy': -9.6, baryon: -12.8, meson: -16,
};
const LANE_COLOR = {
  pentaquark: [0.49, 0.83, 0.99], 'hidden-heavy': [0.42, 0.66, 0.85],
  'open-flavour': [0.36, 0.58, 0.77], 'fully-heavy': [0.50, 0.71, 0.84],
  baryon: [0.36, 0.50, 0.62], meson: [0.31, 0.44, 0.55],
};
export const xOfYear = (y) => (y < 2011 ? (y - 1964) * 0.25 : 11.75 + (y - 2011));
export const yOfMass = (mev) => (mev / 1000) * 1.4;

// Named poses (target, camera distance, yaw about y in degrees, pitch above
// the target in degrees). yaw 0 puts the camera on +z, in front of the
// pentaquark lane; negative yaw swings it toward the past (−x).
export const POSES = {
  wide:   { target: [21, 4.5, -7], dist: 31, yaw: -26, pitch: 15 },   // 1964 corner right of the cover text, LHC era centre-right
  origin: { target: [0.5, 2, -6], dist: 9, yaw: -60, pitch: 8 },
  future: { target: [30, 4, -4], dist: 10, yaw: -30, pitch: 6 },
};
const DEFAULT_POSE = { dist: 9, yaw: -20, pitch: 6 };

const FIELD_BOUNDS = new Vector3(30, 30, 30);   // ambient field wrap box (half extents; a cube so the camera never sits at a face)
const FOV = 50, MAX_DT = 1 / 30;
const D2R = Math.PI / 180;

function pickTexSize(coarse) {
  const cores = navigator.hardwareConcurrency || 4;
  const area = (screen.width || 1280) * (screen.height || 800);
  // sparser than the hero: this field fills a 60-unit box the camera flies through
  if (coarse || area < 1e6 || cores <= 4) return 144;
  return 224;
}

const HADRON_VERT = /* glsl */ `
attribute float aSize, aHollow, aBright, aHi, aSeed;
attribute vec3 aColor;
uniform float uTime, uPixelRatio;
varying vec3 vColor;
varying float vHollow, vAlpha, vHi;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float pulse = 1.0 + aHi * (1.6 + 0.3 * sin(uTime * 3.0));
  float depth = max(-mv.z, 0.1);
  gl_PointSize = uPixelRatio * aSize * pulse * max(4.2, 64.0 / depth);
  float tw = 0.85 + 0.15 * sin(uTime * (0.5 + aSeed * 1.3) + aSeed * 30.0);
  vAlpha = aBright * tw * (0.55 + 0.45 * exp(-depth / 60.0)) * (1.0 + aHi * 1.2);
  vColor = aColor; vHollow = aHollow; vHi = aHi;
}`;
const HADRON_FRAG = /* glsl */ `
varying vec3 vColor;
varying float vHollow, vAlpha, vHi;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float core = smoothstep(0.5, 0.06, d);
  float ring = smoothstep(0.5, 0.40, d) * smoothstep(0.26, 0.34, d);
  float a = mix(core, ring * 1.3 + core * 0.12, vHollow) * vAlpha;
  vec3 col = mix(vColor, vec3(1.0), smoothstep(0.25, 0.0, d) * (0.5 + 0.5 * vHi));
  gl_FragColor = vec4(col * a, a);
}`;

// Text label as a sprite (canvas texture). worldH: sprite height in world units.
function makeLabel(text, { px = 44, color = '#8b97a6', weight = 600, worldH = 0.6, letterSpacing = 0.12 } = {}) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  const font = `${weight} ${px}px "Space Grotesk", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;
  ctx.font = font;
  const spaced = text.toUpperCase().split('').join(String.fromCharCode(8202)); // hair spaces ≈ tracking
  const w = Math.ceil(ctx.measureText(spaced).width * (1 + letterSpacing * 0.5)) + px;
  c.width = w; c.height = Math.ceil(px * 1.5);
  ctx.font = font; ctx.fillStyle = color; ctx.textBaseline = 'middle';
  ctx.fillText(spaced, px / 2, c.height / 2);
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter; tex.generateMipmaps = false;
  const mat = new SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, opacity: 0.9 });
  const s = new Sprite(mat);
  s.scale.set(worldH * (c.width / c.height), worldH, 1);
  return s;
}

export function createSpace(canvas, container, { data, onArrive }) {
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
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200);

  // --- states → world -------------------------------------------------------
  const states = data.states.map((s) => ({
    ...s,
    pos: new Vector3(xOfYear(s.year_frac), s.marker === 'star' ? 0.35 : yOfMass(s.mass), LANE_Z[s.lane] ?? 0),
  }));
  const byId = new Map(states.map((s) => [s.id, s]));

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

  // --- hadron points ----------------------------------------------------------
  const N = states.length;
  const hPos = new Float32Array(N * 3), hCol = new Float32Array(N * 3);
  const hSize = new Float32Array(N), hHollow = new Float32Array(N), hBright = new Float32Array(N), hHi = new Float32Array(N), hSeed = new Float32Array(N);
  states.forEach((s, i) => {
    s.pos.toArray(hPos, i * 3);
    const c = LANE_COLOR[s.lane] || LANE_COLOR.meson;
    hCol.set(s.marker === 'star' ? [0.95, 0.97, 1.0] : c, i * 3);
    const pre = s.origin === 'pre-lhc';
    hSize[i] = s.marker === 'star' ? 2.8 : s.lane === 'pentaquark' ? 1.7 : 1.25;
    hHollow[i] = s.status === 'observed' ? 0 : 1;
    hBright[i] = (pre ? 0.6 : 1.0) * (s.status === 'observed' ? 1.0 : 0.8);
    hSeed[i] = Math.random();
  });
  const hGeo = new BufferGeometry();
  hGeo.setAttribute('position', new BufferAttribute(hPos, 3));
  hGeo.setAttribute('aColor', new BufferAttribute(hCol, 3));
  hGeo.setAttribute('aSize', new BufferAttribute(hSize, 1));
  hGeo.setAttribute('aHollow', new BufferAttribute(hHollow, 1));
  hGeo.setAttribute('aBright', new BufferAttribute(hBright, 1));
  const hiAttr = new BufferAttribute(hHi, 1); hGeo.setAttribute('aHi', hiAttr);
  hGeo.setAttribute('aSeed', new BufferAttribute(hSeed, 1));
  const hMat = new ShaderMaterial({
    vertexShader: HADRON_VERT, fragmentShader: HADRON_FRAG,
    transparent: true, depthWrite: false, depthTest: false, blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: baseDpr } },
  });
  const hadrons = new Points(hGeo, hMat); hadrons.frustumCulled = false;
  scene.add(hadrons);

  // drop lines: state → floor
  const dl = new Float32Array(N * 6);
  states.forEach((s, i) => { dl.set([s.pos.x, s.pos.y, s.pos.z, s.pos.x, 0, s.pos.z], i * 6); });
  const dlGeo = new BufferGeometry(); dlGeo.setAttribute('position', new BufferAttribute(dl, 3));
  const drops = new LineSegments(dlGeo, new LineBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.10, blending: AdditiveBlending, depthWrite: false }));
  scene.add(drops);

  // --- floor grid, mass scale, labels --------------------------------------
  const zFront = 1.8, zBack = LANE_Z.meson - 1.8, xEnd = xOfYear(2033);
  const grid = [];
  for (let y = 1965; y <= 2033; y += 5) { const x = xOfYear(y); grid.push(x, 0, zFront, x, 0, zBack); }
  for (const z of Object.values(LANE_Z)) grid.push(0, 0, z, xEnd, 0, z);
  const gGeo = new BufferGeometry(); gGeo.setAttribute('position', new BufferAttribute(new Float32Array(grid), 3));
  scene.add(new LineSegments(gGeo, new LineBasicMaterial({ color: 0x8b97a6, transparent: true, opacity: 0.22, blending: AdditiveBlending, depthWrite: false })));
  const xAxis = 0;   // the mass scale stands at the 1964 corner, out of the LHC-era poses
  const ticks = [xAxis, 0, zFront, xAxis, yOfMass(11000), zFront];
  for (let g = 1; g <= 11; g++) ticks.push(xAxis - 0.25, yOfMass(g * 1000), zFront, xAxis + 0.25, yOfMass(g * 1000), zFront);
  const tGeo = new BufferGeometry(); tGeo.setAttribute('position', new BufferAttribute(new Float32Array(ticks), 3));
  scene.add(new LineSegments(tGeo, new LineBasicMaterial({ color: 0x8b97a6, transparent: true, opacity: 0.28, blending: AdditiveBlending, depthWrite: false })));

  const labels = new Group(); scene.add(labels);
  const buildLabels = () => {
    for (let y = 1965; y <= 2030; y += 5) { const l = makeLabel(String(y), { worldH: 0.42 }); l.position.set(xOfYear(y), -0.4, zFront + 0.5); labels.add(l); }
    for (let g = 2; g <= 10; g += 2) { const l = makeLabel(`${g} GeV`, { worldH: 0.42 }); l.position.set(xAxis - 1.3, yOfMass(g * 1000), zFront); labels.add(l); }
    // lane names sit at the 2011 end of each lane, left of the LHC era, so the
    // future pose looks down empty lanes and the wide pose reads them as a legend
    for (const lane of data.lanes) { const l = makeLabel(lane.label, { worldH: 0.4, color: '#a9b6c4' }); l.position.set(-0.6 - l.scale.x / 2, 0.3, lane.z); labels.add(l); }
    const o = makeLabel('1964 · Gell-Mann · Zweig', { worldH: 0.5, color: '#f2f5f9' }); o.position.set(1.4 + o.scale.x / 2, 1.0, zFront + 0.2); labels.add(o);
  };
  const fontReady = document.fonts?.load ? document.fonts.load('600 44px "Space Grotesk"').catch(() => {}) : Promise.resolve();
  fontReady.then(buildLabels);

  // --- camera spring ----------------------------------------------------------
  let pose = { ...POSES.wide };
  const goalPos = new Vector3(), goalLook = new Vector3();
  const curPos = new Vector3(), curLook = new Vector3();
  // flight: from the pose at departure to the (drifting) goal, eased with a
  // smootherstep in time — zero velocity and acceleration at both ends —
  // over a duration that grows with the distance (short hops ~1.4 s, the
  // long flights ~2.8 s). onArrive fires once per flight.
  const fromPos = new Vector3(), fromLook = new Vector3();
  let flightT0 = -1, flightDur = 1.6, arrived = true;
  const smoother = (u) => u * u * u * (u * (u * 6 - 15) + 10);
  let firstFrame = true, currentTarget = 'wide';
  const resolveTarget = (at) => {
    if (Array.isArray(at)) return new Vector3(...at);
    if (POSES[at]) return new Vector3(...POSES[at].target);
    const s = byId.get(at);
    return s ? s.pos.clone() : new Vector3(...POSES.wide.target);
  };
  const applyPose = (p, elapsed) => {
    const named = POSES[p.at] || {};
    const dist = (p.dist ?? named.dist ?? DEFAULT_POSE.dist) * (1 + 0.02 * Math.sin(elapsed / 31 * Math.PI * 2));
    const yaw = ((p.yaw ?? named.yaw ?? DEFAULT_POSE.yaw) + 2.5 * Math.sin(elapsed / 46 * Math.PI * 2)) * D2R;
    const pitch = ((p.pitch ?? named.pitch ?? DEFAULT_POSE.pitch) + 1.2 * Math.sin(elapsed / 57 * Math.PI * 2 + 2)) * D2R;
    const t = resolveTarget(p.at);
    if (byId.has(p.at)) t.add(new Vector3(1.5, -0.35, 0));   // state lands left of centre, above the HUD, clear of the figure
    goalLook.copy(t);
    goalPos.set(t.x + dist * Math.sin(yaw) * Math.cos(pitch), t.y + dist * Math.sin(pitch), t.z + dist * Math.cos(yaw) * Math.cos(pitch));
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

    // ambient field: tile the wrap box so dust surrounds the camera anywhere
    field.position.set(
      Math.round(curPos.x / period.x) * period.x,
      Math.round(curPos.y / period.y) * period.y,
      Math.round(curPos.z / period.z) * period.z,
    );
    velMat.uniforms.uDt.value = dt; velMat.uniforms.uTime.value = elapsed; posMat.uniforms.uDt.value = dt;
    velMat.uniforms.uPos.value = posA.texture; velMat.uniforms.uVel.value = velA.texture; pass(velMat, velB);
    posMat.uniforms.uPos.value = posA.texture; posMat.uniforms.uVel.value = velB.texture; pass(posMat, posB);
    [posA, posB] = [posB, posA]; [velA, velB] = [velB, velA];
    fieldMat.uniforms.uPos.value = posA.texture; fieldMat.uniforms.uVel.value = velA.texture;

    hMat.uniforms.uTime.value = elapsed;
    renderer.render(scene, camera);

    if (elapsed > 4 && guardStage < 2) {
      winFrames++; winTime += dt;
      if (winTime >= 2) {
        if (winFrames / winTime < 40) {
          const d = baseDpr * (guardStage === 0 ? 0.7 : 0.5);
          renderer.setPixelRatio(d); fieldMat.uniforms.uPixelRatio.value = d; hMat.uniforms.uPixelRatio.value = d;
          if (guardStage === 1) fieldGeo.setDrawRange(0, Math.floor(count / 2));
          guardStage++;
        }
        winFrames = 0; winTime = 0;
      }
    }
  }
  frame();

  let hiIndex = -1;
  return {
    get currentTarget() { return currentTarget; },
    get arrived() { return arrived; },
    state(id) { return byId.get(id) || null; },
    // pose: { at: id | 'wide' | 'origin' | 'future' | [x,y,z], dist?, yaw?, pitch? }
    setPose(p, { immediate = false } = {}) {
      pose = { at: 'wide', ...(p || {}) };
      currentTarget = Array.isArray(pose.at) ? pose.at.join(',') : String(pose.at);
      container.dataset.spaceAt = currentTarget;
      if (immediate || firstFrame) { firstFrame = true; flightT0 = -1; arrived = true; return; }
      fromPos.copy(curPos); fromLook.copy(curLook);
      applyPose(pose, elapsed);
      const d = fromPos.distanceTo(goalPos) + 0.5 * fromLook.distanceTo(goalLook);
      flightDur = Math.min(2.8, Math.max(1.4, 1.1 + d / 14));
      flightT0 = elapsed; arrived = false;
    },
    // How far the world steps back behind a slide's text (0..1). The DOM
    // scrim in HadronSpace.vue darkens the canvas; this fades what the scrim
    // cannot tame: the label sprites (drawn without depth, large at close
    // poses) and the drop lines, which otherwise burn through the copy.
    setDim(d) {
      const k = Math.min(1, Math.max(0, Number(d) || 0));
      labels.traverse((o) => { if (o.isSprite) o.material.opacity = 0.9 * Math.max(0, 1 - k / 0.85); });
      drops.material.opacity = 0.10 * (1 - 0.8 * k);
    },
    setStop(id) {
      if (hiIndex >= 0) hHi[hiIndex] = 0;
      hiIndex = id ? states.findIndex((s) => s.id === id) : -1;
      if (hiIndex >= 0) hHi[hiIndex] = 1;
      hiAttr.needsUpdate = true;
    },
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
      scene.traverse((o) => { o.geometry?.dispose?.(); o.material?.map?.dispose?.(); o.material?.dispose?.(); });
      quad.geometry.dispose();
      for (const m of [copyMat, velMat, posMat]) m.dispose();
      renderer.dispose(); renderer.forceContextLoss?.();
    },
  };
}
