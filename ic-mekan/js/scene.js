/* ==========================================================================
   The room
   --------------------------------------------------------------------------
   Decisions worth knowing, each of them the answer to something that looked
   wrong on screen first:

   · LIGHT COMES FROM AN ENVIRONMENT, not from lamps. A PBR material needs
     something to reflect; with lamps alone every surface reflects black and
     marble goes flat, lacquer goes plastic, metal goes grey. `env.js` builds
     a small emissive room, pre-filters it and hands it over as
     `scene.environment`. Day and evening are two pre-built environments that
     get swapped — regenerating on every toggle stalls the frame.

   · NOTHING HAS A SHARP EDGE. Every panel comes from `props.panel()`, a
     rounded profile with a bevel. The thin line of light along a 2 mm round
     is most of what the eye reads as a solid object instead of a polygon.

   · THE CAMERA ORBITS, IT DOES NOT SLIDE. An earlier version clamped the
     camera POSITION inside the room; while dragging, the camera hit a wall
     and slid along it, so the view turned in a way that felt broken. Now the
     direction is always exactly what the drag asked for and only the RADIUS
     is shortened, by ray-casting the look direction against the room. Motion
     is damped too, so a flick eases out instead of stopping dead.

   · IT IS A CORNER, not a sealed box: orbiting inside a closed room means
     forever clipping through walls.
   ========================================================================== */

import * as THREE from "./vendor/three/three.module.min.js";
import { materials } from "./textures.js";
import { buildEnvironment } from "./env.js";
import * as P from "./props.js";

const W = 7.0;        // room width  (x: -3.5 .. 3.5)
const D = 5.6;        // room depth  (z: -2.8 .. 2.8)
const H = 2.85;       // ceiling height

export function createRoom(canvas) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas, antialias: true, powerPreference: "high-performance"
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, 1, 0.08, 80);
  const target = new THREE.Vector3(0.15, 1.02, -0.75);

  const M = materials();
  const roles = { floor: [], counter: [], splash: [], front: [], wall: [], shade: [] };

  function applyMaterial(mat, spec) {
    mat.map = spec.map || null;
    mat.roughnessMap = spec.roughnessMap || null;
    mat.normalMap = spec.normalMap || null;
    if (spec.normalMap && mat.normalScale) {
      const n = spec.normalScale || 0.6;
      mat.normalScale.set(n, n);
    }
    mat.roughness = spec.roughness != null ? spec.roughness : 0.5;
    mat.metalness = spec.metalness != null ? spec.metalness : 0.0;
    if (mat.clearcoat !== undefined) {
      mat.clearcoat = spec.clearcoat || 0;
      mat.clearcoatRoughness = 0.06;
    }
    mat.envMapIntensity = spec.envMapIntensity != null ? spec.envMapIntensity : 1.0;
    mat.color.set(spec.color != null ? spec.color : 0xffffff);
    mat.needsUpdate = true;
  }

  /* ------------------------------------------------------------ environment */
  const envDay = buildEnvironment(renderer, { evening: 0 });
  const envNight = buildEnvironment(renderer, { evening: 1 });
  scene.environment = envDay;

  /* ----------------------------------------------------------------- shell */
  const floorMat = new THREE.MeshStandardMaterial();
  applyMaterial(floorMat, M.floor.oak);
  roles.floor.push(floorMat);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  const wallMat = new THREE.MeshStandardMaterial({
    map: M.plaster.map, roughnessMap: M.plaster.roughnessMap,
    normalMap: M.plaster.normalMap, roughness: 0.95, metalness: 0,
    color: 0xefeae2, envMapIntensity: 0.9
  });
  if (wallMat.normalScale) wallMat.normalScale.set(0.35, 0.35);
  roles.wall.push(wallMat);

  const ceilMat = new THREE.MeshStandardMaterial({
    color: 0xf7f5f1, roughness: 0.97, envMapIntensity: 0.7
  });

  const back = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wallMat);
  back.position.set(0, H / 2, -D / 2);
  back.receiveShadow = true;
  scene.add(back);

  /* Left wall around a large window opening, built as four pieces so that
     light actually passes through the hole. */
  const winZ0 = -D / 2 + 0.95, winW = 2.9, winY = 0.42, winH = 1.95;
  const winZ1 = winZ0 + winW, zEnd = D / 2;
  const seg = (w, h, cz, cy) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.max(w, 0.001), Math.max(h, 0.001)), wallMat);
    m.position.set(-W / 2, cy, cz);
    m.rotation.y = Math.PI / 2;
    m.receiveShadow = true;
    scene.add(m);
  };
  seg(winZ0 - (-D / 2), H, (-D / 2 + winZ0) / 2, H / 2);
  seg(zEnd - winZ1, H, (winZ1 + zEnd) / 2, H / 2);
  seg(winW, winY, (winZ0 + winZ1) / 2, winY / 2);
  seg(winW, H - winY - winH, (winZ0 + winZ1) / 2, winY + winH + (H - winY - winH) / 2);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  scene.add(ceiling);

  /* Daylight slab behind the opening. Unlit: it is light, not a surface. */
  const skyMat = new THREE.MeshBasicMaterial({ color: 0xdfeeff, toneMapped: false });
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(winW + 0.3, winH + 0.3), skyMat);
  sky.position.set(-W / 2 - 0.06, winY + winH / 2, (winZ0 + winZ1) / 2);
  sky.rotation.y = Math.PI / 2;
  scene.add(sky);

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x26272a, roughness: 0.38, metalness: 0.25, envMapIntensity: 1.2
  });
  const cz = (winZ0 + winZ1) / 2;
  const bar = (w, h, dd, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, dd), frameMat);
    m.position.set(x, y, z);
    m.castShadow = true;
    scene.add(m);
  };
  const fx = -W / 2 + 0.055;
  bar(0.1, 0.055, winW + 0.11, fx, winY - 0.025, cz);
  bar(0.1, 0.055, winW + 0.11, fx, winY + winH + 0.025, cz);
  bar(0.1, winH, 0.055, fx, winY + winH / 2, winZ0 - 0.025);
  bar(0.1, winH, 0.055, fx, winY + winH / 2, winZ1 + 0.025);
  bar(0.07, winH, 0.038, fx, winY + winH / 2, cz);

  /* Skirting. A wall that meets the floor with no shadow line reads as two
     planes rather than a built room. */
  const skirtMat = new THREE.MeshStandardMaterial({ color: 0xf2efe9, roughness: 0.7 });
  const sk1 = new THREE.Mesh(new THREE.BoxGeometry(W, 0.085, 0.018), skirtMat);
  sk1.position.set(0, 0.0425, -D / 2 + 0.009);
  scene.add(sk1);
  const sk2 = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.085, D), skirtMat);
  sk2.position.set(-W / 2 + 0.009, 0.0425, 0);
  scene.add(sk2);

  /* ---------------------------------------------------------------- kitchen */
  const carcass = new THREE.MeshStandardMaterial({ color: 0x17181a, roughness: 0.86 });
  const frontMat = new THREE.MeshPhysicalMaterial();
  applyMaterial(frontMat, M.front.lakeWhite);
  roles.front.push(frontMat);

  const counterMat = new THREE.MeshStandardMaterial();
  applyMaterial(counterMat, M.counter.marble);
  roles.counter.push(counterMat);

  const splashMat = new THREE.MeshStandardMaterial();
  applyMaterial(splashMat, M.splash.marble);
  roles.splash.push(splashMat);

  const runW = 4.0, baseH = 0.88, baseD = 0.64, toe = 0.12;
  const runX = -0.55, runZ = -D / 2 + baseD / 2;
  const gap = 0.007;

  const kick = new THREE.Mesh(new THREE.BoxGeometry(runW - 0.1, toe, baseD - 0.1), carcass);
  kick.position.set(runX, toe / 2, runZ);
  scene.add(kick);

  const box = new THREE.Mesh(new THREE.BoxGeometry(runW, baseH - toe, baseD), carcass);
  box.position.set(runX, toe + (baseH - toe) / 2, runZ);
  box.castShadow = box.receiveShadow = true;
  scene.add(box);

  /* Handleless fronts with a shadow gap. Knobs date a render instantly. */
  const doors = 6;
  const dW = (runW - gap * (doors + 1)) / doors;
  const dH = baseH - toe - gap * 2;
  for (let i = 0; i < doors; i++) {
    const dd = new THREE.Mesh(P.panel(dW, dH, 0.020, 0.004, "z"), frontMat);
    dd.position.set(runX - runW / 2 + gap + dW / 2 + i * (dW + gap),
                    toe + gap + dH / 2, runZ + baseD / 2 + 0.011);
    dd.castShadow = dd.receiveShadow = true;
    scene.add(dd);
  }

  const top = new THREE.Mesh(P.panel(runW + 0.07, baseD + 0.05, 0.042, 0.006, "y"), counterMat);
  top.position.set(runX, baseH + 0.021, runZ + 0.025);
  top.castShadow = top.receiveShadow = true;
  scene.add(top);

  const splash = new THREE.Mesh(P.panel(runW + 0.07, 0.56, 0.022, 0.004, "z"), splashMat);
  splash.position.set(runX, baseH + 0.042 + 0.28, -D / 2 + 0.012);
  splash.receiveShadow = true;
  scene.add(splash);

  /* Wall units, deliberately short so the window keeps its wall. */
  const upW = 2.35, upH = 0.74, upD = 0.35, upY = 1.76;
  const upBox = new THREE.Mesh(new THREE.BoxGeometry(upW, upH, upD), carcass);
  upBox.position.set(runX + 0.5, upY + upH / 2, -D / 2 + upD / 2);
  upBox.castShadow = true;
  scene.add(upBox);
  for (let i = 0; i < 3; i++) {
    const w = (upW - gap * 4) / 3;
    const dd = new THREE.Mesh(P.panel(w, upH - gap * 2, 0.020, 0.004, "z"), frontMat);
    dd.position.set(runX + 0.5 - upW / 2 + gap + w / 2 + i * (w + gap),
                    upY + upH / 2, -D / 2 + upD + 0.011);
    dd.castShadow = dd.receiveShadow = true;
    scene.add(dd);
  }

  /* Tall unit closing the run — a kitchen that stops in mid-air looks unbuilt. */
  const tallW = 0.95, tallH = 2.32, tallD = 0.64;
  const tallX = runX + runW / 2 + tallW / 2 + 0.02;
  const tallBox = new THREE.Mesh(new THREE.BoxGeometry(tallW, tallH, tallD), carcass);
  tallBox.position.set(tallX, tallH / 2, -D / 2 + tallD / 2);
  tallBox.castShadow = tallBox.receiveShadow = true;
  scene.add(tallBox);
  [[0.78, toe + 0.39], [1.5, toe + 0.39 + 0.39 + 0.76]].forEach(pair => {
    const dd = new THREE.Mesh(P.panel(tallW - gap * 2, pair[0], 0.020, 0.004, "z"), frontMat);
    dd.position.set(tallX, pair[1], -D / 2 + tallD + 0.011);
    dd.castShadow = dd.receiveShadow = true;
    scene.add(dd);
  });

  /* --- Sink and tap ------------------------------------------------------- */
  const steel = new THREE.MeshStandardMaterial({
    color: 0xc3c6ca, roughness: 0.18, metalness: 0.95, envMapIntensity: 1.5
  });
  const sinkX = runX - 1.2;
  const sinkWell = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.16, 0.4),
    new THREE.MeshStandardMaterial({ color: 0x9a9da1, roughness: 0.3, metalness: 0.9 }));
  sinkWell.position.set(sinkX, baseH - 0.06, runZ + 0.02);
  scene.add(sinkWell);
  const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.021, 0.30, 20), steel);
  tap.position.set(sinkX, baseH + 0.19, runZ - 0.22);
  tap.castShadow = true;
  scene.add(tap);
  const spout = new THREE.Mesh(new THREE.TorusGeometry(0.105, 0.016, 14, 26, Math.PI / 2), steel);
  spout.position.set(sinkX, baseH + 0.34, runZ - 0.22);
  spout.rotation.set(Math.PI / 2, 0, 0);
  spout.castShadow = true;
  scene.add(spout);

  /* ----------------------------------------------------------------- island */
  const isW = 2.5, isD = 0.98, isH = 0.9;
  const isX = 0.25, isZ = 0.15;

  const isKick = new THREE.Mesh(new THREE.BoxGeometry(isW - 0.12, toe, isD - 0.12), carcass);
  isKick.position.set(isX, toe / 2, isZ);
  scene.add(isKick);

  const isBox = new THREE.Mesh(new THREE.BoxGeometry(isW, isH - toe, isD), carcass);
  isBox.position.set(isX, toe + (isH - toe) / 2, isZ);
  isBox.castShadow = isBox.receiveShadow = true;
  scene.add(isBox);

  for (let i = 0; i < 3; i++) {
    const w = (isW - gap * 4) / 3;
    const dd = new THREE.Mesh(P.panel(w, isH - toe - gap * 2, 0.020, 0.004, "z"), frontMat);
    dd.position.set(isX - isW / 2 + gap + w / 2 + i * (w + gap),
                    toe + gap + (isH - toe - gap * 2) / 2, isZ - isD / 2 - 0.011);
    dd.rotation.y = Math.PI;
    dd.castShadow = dd.receiveShadow = true;
    scene.add(dd);
  }

  /* The worktop overhangs on the stool side — that overhang is the whole
     reason an island reads as somewhere you sit rather than a block. */
  const isTop = new THREE.Mesh(P.panel(isW + 0.1, isD + 0.42, 0.045, 0.007, "y"), counterMat);
  isTop.position.set(isX, isH + 0.0225, isZ + 0.16);
  isTop.castShadow = isTop.receiveShadow = true;
  scene.add(isTop);

  /* --------------------------------------------------------------- styling */
  const oakMat = new THREE.MeshStandardMaterial();
  applyMaterial(oakMat, M.counter.oak);

  const seatMat = new THREE.MeshStandardMaterial({
    color: 0x2c2e31, roughness: 0.55, envMapIntensity: 1.1
  });
  const legMat = new THREE.MeshStandardMaterial({
    color: 0x9a9ea3, roughness: 0.28, metalness: 0.9, envMapIntensity: 1.4
  });
  [-0.45, 0.62].forEach(dx => {
    const s = P.stool(seatMat, legMat);
    s.position.set(isX + dx, 0, isZ + 0.78);
    s.rotation.y = dx < 0 ? 0.12 : -0.1;
    scene.add(s);
  });

  const bowlMesh = P.bowl(new THREE.MeshStandardMaterial({
    color: 0xe8e3d9, roughness: 0.33, envMapIntensity: 1.2
  }));
  bowlMesh.position.set(isX - 0.55, isH + 0.045, isZ + 0.1);
  scene.add(bowlMesh);

  const boardMesh = P.board(oakMat);
  boardMesh.position.set(isX + 0.55, isH + 0.056, isZ + 0.06);
  boardMesh.rotation.y = -0.22;
  scene.add(boardMesh);

  const plantMesh = P.plant(
    new THREE.MeshStandardMaterial({ color: 0xb9b1a4, roughness: 0.82 }),
    new THREE.MeshStandardMaterial({ color: 0x3f5c3a, roughness: 0.66 })
  );
  plantMesh.position.set(tallX - 0.05, 0, D / 2 - 1.5);
  plantMesh.scale.setScalar(1.55);
  scene.add(plantMesh);

  const bookStack = P.books([0x8a4b34, 0x2e3540, 0xcfc6b6]);
  bookStack.position.set(runX + 1.5, baseH + 0.045, runZ + 0.06);
  scene.add(bookStack);

  const artB = P.art(0.7, 0.92, ["#b9c2bd", "#7d8a84", "#4f5b55"]);
  artB.position.set(-W / 2 + 0.03, 1.5, D / 2 - 1.15);
  artB.rotation.y = Math.PI / 2;
  scene.add(artB);

  /* ---------------------------------------------------------------- lamps */
  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0x2b2d30, roughness: 0.42, metalness: 0.35,
    emissive: 0xffc487, emissiveIntensity: 0, envMapIntensity: 1.2,
    side: THREE.DoubleSide
  });
  roles.shade.push(shadeMat);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xffd9a6, toneMapped: false });
  const pendants = [];
  [-0.62, 0.62].forEach(dx => {
    const x = isX + dx;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.78, 6),
      new THREE.MeshStandardMaterial({ color: 0x1a1b1d, roughness: 0.9 }));
    cord.position.set(x, H - 0.39, isZ + 0.16);
    scene.add(cord);

    const shade = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.17, 0.19, 40, 1, true), shadeMat);
    shade.position.set(x, H - 0.87, isZ + 0.16);
    shade.castShadow = true;
    scene.add(shade);

    const glow = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), glowMat);
    glow.position.set(x, H - 0.965, isZ + 0.16);
    glow.rotation.x = -Math.PI / 2;
    glow.visible = false;
    scene.add(glow);

    const bulb = new THREE.PointLight(0xffb877, 0, 5.5, 2);
    bulb.position.set(x, H - 1.0, isZ + 0.16);
    scene.add(bulb);
    pendants.push({ bulb: bulb, glow: glow });
  });

  /* --------------------------------------------------------------- daylight */
  const sun = new THREE.DirectionalLight(0xfff4e2, 2.1);
  sun.position.set(-9, 4.2, cz + 2.2);
  sun.target.position.set(1.2, 0.5, -1.0);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 26;
  sun.shadow.camera.left = -8; sun.shadow.camera.right = 8;
  sun.shadow.camera.top = 7; sun.shadow.camera.bottom = -3;
  sun.shadow.bias = -0.0011;
  sun.shadow.normalBias = 0.022;
  scene.add(sun, sun.target);

  const bounce = new THREE.DirectionalLight(0xffffff, 0.22);
  bounce.position.set(4, 2.2, 5);
  scene.add(bounce);

  /* ---------------------------------------------------------------- orbit */
  const AZ = [-0.10, 1.45], PO = [1.06, 1.52], DIST = [2.6, 6.4];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  let azT = 0.72, poT = 1.33, dT = 5.0;
  let az = azT, po = poT, dist = dT;
  let needs = true;

  /* How far the camera may travel along `dir` before it leaves the room.
     Shortening the radius keeps the direction exactly as dragged; clamping
     the position instead makes the camera slide along walls, which is what
     made the earlier version feel broken. */
  const INNER = {
    min: new THREE.Vector3(-W / 2 + 0.4, 0.75, -D / 2 + 0.5),
    max: new THREE.Vector3(W / 2 - 0.4, H - 0.35, D / 2 - 0.3)
  };
  function maxRadius(dir) {
    let t = Infinity;
    ["x", "y", "z"].forEach(ax => {
      const o = target[ax], v = dir[ax];
      if (Math.abs(v) < 1e-6) return;
      const hit = v > 0 ? (INNER.max[ax] - o) / v : (INNER.min[ax] - o) / v;
      if (hit > 0) t = Math.min(t, hit);
    });
    return t === Infinity ? DIST[1] : t;
  }

  const dir = new THREE.Vector3();
  function place() {
    dir.set(Math.sin(po) * Math.sin(az), Math.cos(po), Math.sin(po) * Math.cos(az));
    camera.position.copy(target).addScaledVector(dir, Math.min(dist, maxRadius(dir)));
    camera.lookAt(target);
  }

  let dragging = false, lx = 0, ly = 0, pinch = 0;
  canvas.addEventListener("pointerdown", e => {
    dragging = true; lx = e.clientX; ly = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("is-grabbing");
  });
  canvas.addEventListener("pointermove", e => {
    if (!dragging) return;
    azT = clamp(azT - (e.clientX - lx) * 0.0042, AZ[0], AZ[1]);
    poT = clamp(poT - (e.clientY - ly) * 0.0032, PO[0], PO[1]);
    lx = e.clientX; ly = e.clientY;
    needs = true;
  });
  const stop = () => { dragging = false; canvas.classList.remove("is-grabbing"); };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    dT = clamp(dT + e.deltaY * 0.0022, DIST[0], DIST[1]);
    needs = true;
  }, { passive: false });
  canvas.addEventListener("touchmove", e => {
    if (e.touches.length !== 2) return;
    const p = Math.hypot(e.touches[0].clientX - e.touches[1].clientX,
                         e.touches[0].clientY - e.touches[1].clientY);
    if (pinch) { dT = clamp(dT - (p - pinch) * 0.011, DIST[0], DIST[1]); needs = true; }
    pinch = p;
  }, { passive: true });
  canvas.addEventListener("touchend", () => { pinch = 0; });

  /* ------------------------------------------------------------------ loop */
  function resize() {
    const r = canvas.getBoundingClientRect();
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    renderer.setSize(r.width, r.height, false);
    camera.fov = r.width < 700 ? 56 : 44;
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
    needs = true;
  }

  const wallTarget = new THREE.Color(0xefeae2);
  const SKY_DAY = new THREE.Color(0xdfeeff), SKY_NIGHT = new THREE.Color(0x141d33);
  let evening = 0, eveningT = 0, envIsNight = false;

  function tick() {
    if (document.hidden) { requestAnimationFrame(tick); return; }

    /* Damped orbit: a flick eases out instead of stopping dead. */
    const k = reduced ? 1 : 0.15;
    if (Math.abs(az - azT) > 1e-4 || Math.abs(po - poT) > 1e-4 || Math.abs(dist - dT) > 1e-4) {
      az += (azT - az) * k; po += (poT - po) * k; dist += (dT - dist) * k;
      needs = true;
    }
    place();

    const wc = roles.wall[0].color;
    if (!reduced && wc.getHex() !== wallTarget.getHex()) { wc.lerp(wallTarget, 0.16); needs = true; }
    else if (reduced) wc.copy(wallTarget);

    if (Math.abs(evening - eveningT) > 0.002) {
      evening += (eveningT - evening) * (reduced ? 1 : 0.075);
      sun.intensity = 2.1 * (1 - evening) + 0.03;
      bounce.intensity = 0.22 * (1 - evening) + 0.02;
      skyMat.color.lerpColors(SKY_DAY, SKY_NIGHT, evening);
      pendants.forEach(p => {
        p.bulb.intensity = 5.2 * evening;
        p.glow.visible = evening > 0.15;
      });
      roles.shade[0].emissiveIntensity = 1.3 * evening;
      renderer.toneMappingExposure = 1.05 + evening * 0.06;
      const wantNight = evening > 0.5;
      if (wantNight !== envIsNight) {
        envIsNight = wantNight;
        scene.environment = wantNight ? envNight : envDay;
      }
      needs = true;
    }

    if (needs) { renderer.render(scene, camera); needs = false; }
    requestAnimationFrame(tick);
  }

  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(tick);

  return {
    setFloor(key) { roles.floor.forEach(m => applyMaterial(m, M.floor[key])); needs = true; },
    setCounter(key) {
      roles.counter.forEach(m => applyMaterial(m, M.counter[key]));
      roles.splash.forEach(m => applyMaterial(m, M.splash[key]));
      needs = true;
    },
    setFront(key) { roles.front.forEach(m => applyMaterial(m, M.front[key])); needs = true; },
    setWall(hex) { wallTarget.set(hex); needs = true; },
    setEvening(on) { eveningT = on ? 1 : 0; needs = true; },
    resetView() { azT = 0.72; poT = 1.33; dT = 5.0; needs = true; }
  };
}
