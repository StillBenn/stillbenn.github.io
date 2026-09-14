/* ==========================================================================
   The room — a corner of an interior the client can change while standing in it
   --------------------------------------------------------------------------
   Decisions worth knowing:

   · It is a CORNER, not a closed box. Orbiting inside a sealed room means the
     camera is forever clipping through walls; a two-wall cutaway is how an
     architect draws it and it lets the camera sit outside looking in.

   · The window is a real opening with bright air behind it, not a picture of
     a window. Daylight enters through it, so changing the floor changes what
     bounces onto the ceiling. That relationship is the whole argument for
     doing this in 3D instead of sending renders.

   · Every surface the client can change is a named role (floor, counter,
     front, wall). Swapping a material never rebuilds geometry.

   · Rendering stops when the tab is hidden, and the loop renders on demand:
     a still frame costs nothing, so the phone stays cool while somebody
     reads the options.
   ========================================================================== */

import * as THREE from "./vendor/three/three.module.min.js";
import { materials } from "./textures.js";

const W = 6.0;        // room width  (x: -3 .. 3)
const D = 5.0;        // room depth  (z: -2.5 .. 2.5)
const H = 2.75;       // ceiling height

export function createRoom(canvas) {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas, antialias: true, powerPreference: "high-performance"
  });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
  const target = new THREE.Vector3(-0.15, 1.02, -1.10);

  const M = materials();
  const roles = { floor: null, counter: [], splash: [], front: [], wall: [], shade: [] };

  /* ---------------------------------------------------------------- shell */
  const floorMat = new THREE.MeshStandardMaterial();
  applyMaterial(floorMat, M.floor.oak);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set(0, 0, 0);
  floor.receiveShadow = true;
  scene.add(floor);
  roles.floor = floorMat;

  const wallMat = new THREE.MeshStandardMaterial({
    map: M.plaster.map, roughnessMap: M.plaster.roughnessMap,
    roughness: 0.94, metalness: 0.0, color: 0xefeae2
  });
  roles.wall.push(wallMat);

  const ceilMat = new THREE.MeshStandardMaterial({ color: 0xf6f4f0, roughness: 0.98 });

  /* Back wall — one plane, the kitchen sits against it. */
  const back = new THREE.Mesh(new THREE.PlaneGeometry(W, H), wallMat);
  back.position.set(0, H / 2, -D / 2);
  back.receiveShadow = true;
  scene.add(back);

  /* Left wall, built as four pieces around a window opening. Making the hole
     out of geometry rather than a texture is what lets light come through. */
  const winX = -D / 2 + 1.05, winW = 2.0, winY = 0.95, winH = 1.45;
  const leftGroup = new THREE.Group();
  const seg = (w, h, cz, cy) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat);
    m.position.set(0, cy, cz);
    m.rotation.y = Math.PI / 2;
    m.receiveShadow = true;
    return m;
  };
  const zA = -D / 2, zB = winX, zC = winX + winW, zD = D / 2;
  leftGroup.add(seg(zB - zA, H, (zA + zB) / 2, H / 2));                       // before
  leftGroup.add(seg(zD - zC, H, (zC + zD) / 2, H / 2));                       // after
  leftGroup.add(seg(winW, winY, (zB + zC) / 2, winY / 2));                    // under
  leftGroup.add(seg(winW, H - winY - winH, (zB + zC) / 2, winY + winH + (H - winY - winH) / 2)); // over
  leftGroup.position.x = -W / 2;
  scene.add(leftGroup);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = H;
  scene.add(ceiling);

  /* Window: reveal frame plus a bright plane standing in for the sky. The
     plane is unlit — it is light, not a surface. */
  const sky = new THREE.Mesh(
    new THREE.PlaneGeometry(winW, winH),
    new THREE.MeshBasicMaterial({ color: 0xdcebff, toneMapped: false })
  );
  sky.position.set(-W / 2 - 0.02, winY + winH / 2, (zB + zC) / 2);
  sky.rotation.y = Math.PI / 2;
  scene.add(sky);

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x2b2c2e, roughness: 0.45, metalness: 0.15 });
  const frame = new THREE.Group();
  const bar = (w, h, d, x, y, z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), frameMat);
    m.position.set(x, y, z); m.castShadow = true; return m;
  };
  const fx = -W / 2 + 0.05, cz = (zB + zC) / 2;
  frame.add(bar(0.09, 0.05, winW + 0.1, fx, winY - 0.02, cz));
  frame.add(bar(0.09, 0.05, winW + 0.1, fx, winY + winH + 0.02, cz));
  frame.add(bar(0.09, winH, 0.05, fx, winY + winH / 2, zB - 0.02));
  frame.add(bar(0.09, winH, 0.05, fx, winY + winH / 2, zC + 0.02));
  frame.add(bar(0.06, winH, 0.035, fx, winY + winH / 2, cz));   // mullion
  scene.add(frame);

  /* ------------------------------------------------------------- kitchen */
  const runW = 3.8, baseH = 0.86, baseD = 0.62, toe = 0.11;
  const runX = -0.25, runZ = -D / 2 + baseD / 2;

  const carcass = new THREE.MeshStandardMaterial({ color: 0x1c1d1f, roughness: 0.85 });
  const kickMesh = new THREE.Mesh(new THREE.BoxGeometry(runW - 0.08, toe, baseD - 0.08), carcass);
  kickMesh.position.set(runX, toe / 2, runZ);
  scene.add(kickMesh);

  const box = new THREE.Mesh(new THREE.BoxGeometry(runW, baseH - toe, baseD), carcass);
  box.position.set(runX, toe + (baseH - toe) / 2, runZ);
  box.castShadow = box.receiveShadow = true;
  scene.add(box);

  /* Fronts. A handleless run with a shadow gap reads as current work; a run
     of knobs dates the render instantly. */
  const frontMat = new THREE.MeshPhysicalMaterial();
  applyMaterial(frontMat, M.front.lakeWhite);
  roles.front.push(frontMat);

  const doors = 6, gap = 0.006;
  const doorW = (runW - gap * (doors + 1)) / doors;
  const doorH = baseH - toe - gap * 2;
  for (let i = 0; i < doors; i++) {
    const d = new THREE.Mesh(new THREE.BoxGeometry(doorW, doorH, 0.019), frontMat);
    d.position.set(
      runX - runW / 2 + gap + doorW / 2 + i * (doorW + gap),
      toe + gap + doorH / 2,
      runZ + baseD / 2 + 0.0105
    );
    d.castShadow = true;
    scene.add(d);
  }

  const counterMat = new THREE.MeshStandardMaterial();
  applyMaterial(counterMat, M.counter.marble);
  roles.counter.push(counterMat);

  const top = new THREE.Mesh(new THREE.BoxGeometry(runW + 0.06, 0.04, baseD + 0.04), counterMat);
  top.position.set(runX, baseH + 0.02, runZ + 0.02);
  top.castShadow = top.receiveShadow = true;
  scene.add(top);

  /* Splashback in the same stone — the upsell every kitchen firm sells.
     It gets its OWN material instance: sharing the worktop's would stretch the
     same veins up the wall and the eye reads that instantly as wallpaper. */
  const splashMat = new THREE.MeshStandardMaterial();
  applyMaterial(splashMat, M.splash.marble);
  roles.splash.push(splashMat);
  const splash = new THREE.Mesh(new THREE.BoxGeometry(runW + 0.06, 0.52, 0.02), splashMat);
  splash.position.set(runX, baseH + 0.04 + 0.26, -D / 2 + 0.012);
  splash.receiveShadow = true;
  scene.add(splash);

  /* Upper run, deliberately short so the window keeps the wall. */
  const upW = 2.0, upH = 0.72, upD = 0.34;
  const upBox = new THREE.Mesh(new THREE.BoxGeometry(upW, upH, upD), carcass);
  upBox.position.set(runX + 0.55, 1.72 + upH / 2, -D / 2 + upD / 2);
  upBox.castShadow = true;
  scene.add(upBox);
  for (let i = 0; i < 3; i++) {
    const w = (upW - gap * 4) / 3;
    const d = new THREE.Mesh(new THREE.BoxGeometry(w, upH - gap * 2, 0.019), frontMat);
    d.position.set(
      runX + 0.55 - upW / 2 + gap + w / 2 + i * (w + gap),
      1.72 + upH / 2, -D / 2 + upD + 0.0105
    );
    d.castShadow = true;
    scene.add(d);
  }

  /* Sink and tap — scale cues. Without something recognisably human-sized
     the run reads as furniture rather than as a kitchen. */
  const steel = new THREE.MeshStandardMaterial({ color: 0xb9bcc0, roughness: 0.24, metalness: 0.92 });
  const sink = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.03, 0.42), steel);
  sink.position.set(runX - 1.05, baseH + 0.035, runZ + 0.02);
  scene.add(sink);
  const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.022, 0.34, 18), steel);
  tap.position.set(runX - 1.05, baseH + 0.21, runZ - 0.2);
  tap.castShadow = true;
  scene.add(tap);
  const spout = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.017, 12, 24, Math.PI / 2), steel);
  spout.position.set(runX - 1.05, baseH + 0.38, runZ - 0.2);
  spout.rotation.set(Math.PI / 2, 0, 0);
  scene.add(spout);

  /* Two pendants. They are the evening light. */
  const shadeMat = new THREE.MeshStandardMaterial({
    color: 0x2f3033, roughness: 0.5, metalness: 0.3,
    emissive: 0xffc98a, emissiveIntensity: 0
  });
  roles.shade.push(shadeMat);
  const pendants = [];
  for (let i = 0; i < 2; i++) {
    const x = runX - 0.55 + i * 1.5;
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.004, 0.62, 6),
      new THREE.MeshStandardMaterial({ color: 0x1a1b1d, roughness: 0.9 })
    );
    cord.position.set(x, H - 0.31, runZ + 0.55);
    scene.add(cord);
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.135, 0.16, 28, 1, true), shadeMat);
    shade.material.side = THREE.DoubleSide;
    shade.position.set(x, H - 0.70, runZ + 0.55);
    shade.rotation.x = Math.PI;
    shade.castShadow = true;
    scene.add(shade);
    const bulb = new THREE.PointLight(0xffc07a, 0, 4.5, 2);
    bulb.position.set(x, H - 0.78, runZ + 0.55);
    scene.add(bulb);
    pendants.push(bulb);
  }

  /* ------------------------------------------------------------- lighting */
  const hemi = new THREE.HemisphereLight(0xdce8ff, 0x9c8f7e, 1.0);
  scene.add(hemi);

  /* The sun comes through the window, so it must sit outside it. */
  const sun = new THREE.DirectionalLight(0xfff2df, 2.6);
  sun.position.set(-7.5, 3.4, cz + 1.2);
  sun.target.position.set(1.0, 0.6, -1.2);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 22;
  sun.shadow.camera.left = -7; sun.shadow.camera.right = 7;
  sun.shadow.camera.top = 6;   sun.shadow.camera.bottom = -3;
  sun.shadow.bias = -0.0012;
  sun.shadow.normalBias = 0.02;
  scene.add(sun, sun.target);

  /* A soft fill from the open side so the fronts are not black slabs. */
  const fill = new THREE.DirectionalLight(0xffffff, 0.35);
  fill.position.set(3.5, 2.4, 4.5);
  scene.add(fill);

  /* ------------------------------------------------------------- controls */
  let dist = 4.2, azim = 0.74, polar = 1.43;
  const AZ_MIN = -0.25, AZ_MAX = 1.32;
  const PO_MIN = 1.06, PO_MAX = 1.62;
  let needs = true;

  /* The camera is kept INSIDE the room. Without this it drifts out past the
     walls at wide angles and the interior reads as a floating diorama — the
     single fastest way to make a space look like a 3D file instead of a room.
     Clamping the position (rather than only the orbit angles) is what makes
     it hold at every screen shape, which matters because half the visits are
     from a phone held in portrait. */
  const BOUND = {
    x: [-W / 2 + 0.35, W / 2 - 0.35],
    y: [0.95, 2.15],
    z: [-D / 2 + 0.55, D / 2 - 0.25]
  };
  function place() {
    const x = target.x + dist * Math.sin(polar) * Math.sin(azim);
    const y = target.y + dist * Math.cos(polar);
    const z = target.z + dist * Math.sin(polar) * Math.cos(azim);
    camera.position.set(
      Math.min(BOUND.x[1], Math.max(BOUND.x[0], x)),
      Math.min(BOUND.y[1], Math.max(BOUND.y[0], y)),
      Math.min(BOUND.z[1], Math.max(BOUND.z[0], z))
    );
    camera.lookAt(target);
  }

  let dragging = false, lastX = 0, lastY = 0, pinch = 0;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  canvas.addEventListener("pointerdown", e => {
    dragging = true; lastX = e.clientX; lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("is-grabbing");
  });
  canvas.addEventListener("pointermove", e => {
    if (!dragging) return;
    azim = clamp(azim - (e.clientX - lastX) * 0.005, AZ_MIN, AZ_MAX);
    polar = clamp(polar - (e.clientY - lastY) * 0.004, PO_MIN, PO_MAX);
    lastX = e.clientX; lastY = e.clientY;
    place(); needs = true;
  });
  const stop = () => { dragging = false; canvas.classList.remove("is-grabbing"); };
  canvas.addEventListener("pointerup", stop);
  canvas.addEventListener("pointercancel", stop);
  canvas.addEventListener("wheel", e => {
    e.preventDefault();
    dist = clamp(dist + e.deltaY * 0.0022, 2.8, 5.6);
    place(); needs = true;
  }, { passive: false });

  /* Two-finger pinch. Phones are the point of this page. */
  canvas.addEventListener("touchmove", e => {
    if (e.touches.length !== 2) return;
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const d = Math.hypot(dx, dy);
    if (pinch) { dist = clamp(dist - (d - pinch) * 0.011, 2.8, 5.6); place(); needs = true; }
    pinch = d;
  }, { passive: true });
  canvas.addEventListener("touchend", () => { pinch = 0; });

  /* ------------------------------------------------------------- api */
  const wallTarget = new THREE.Color(0xefeae2);

  function applyMaterial(mat, spec) {
    mat.map = spec.map || null;
    mat.roughnessMap = spec.roughnessMap || null;
    mat.roughness = spec.roughness != null ? spec.roughness : 0.5;
    mat.metalness = spec.metalness != null ? spec.metalness : 0.0;
    if (mat.clearcoat !== undefined) mat.clearcoat = spec.clearcoat || 0;
    mat.color.set(spec.color != null ? spec.color : 0xffffff);
    mat.needsUpdate = true;
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    /* A narrow viewport needs a wider lens or the room shows one cabinet. */
    camera.fov = r.width < 700 ? 58 : 46;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / Math.max(1, r.height);
    camera.updateProjectionMatrix();
    needs = true;
  }

  let evening = 0, eveningTarget = 0;
  const SKY_DAY = new THREE.Color(0xdcebff);
  const SKY_NIGHT = new THREE.Color(0x1d2740);
  function tick() {
    if (document.hidden) { requestAnimationFrame(tick); return; }

    /* Wall colour and the day→evening change are eased. A value that snaps
       makes a configurator feel like a form; a value that moves makes it
       feel like a light switch in a real room. */
    const wc = roles.wall[0].color;
    if (!reduced && wc.getHex() !== wallTarget.getHex()) { wc.lerp(wallTarget, 0.16); needs = true; }
    else if (reduced) wc.copy(wallTarget);

    if (Math.abs(evening - eveningTarget) > 0.002) {
      evening += (eveningTarget - evening) * (reduced ? 1 : 0.09);
      sun.intensity = 2.6 * (1 - evening) + 0.06;
      hemi.intensity = 1.0 * (1 - evening) + 0.10;
      fill.intensity = 0.35 * (1 - evening) + 0.04;
      hemi.color.setHex(evening > 0.5 ? 0x53504e : 0xdce8ff);
      sky.material.color.lerpColors(SKY_DAY, SKY_NIGHT, evening);
      pendants.forEach(p => { p.intensity = 6.8 * evening; });
      roles.shade[0].emissiveIntensity = 1.6 * evening;
      renderer.toneMappingExposure = 1.0 + evening * 0.10;
      needs = true;
    }

    if (needs) { renderer.render(scene, camera); needs = false; }
    requestAnimationFrame(tick);
  }

  place();
  resize();
  addEventListener("resize", resize);
  requestAnimationFrame(tick);

  return {
    setFloor(key)   { applyMaterial(roles.floor, M.floor[key]); needs = true; },
    setCounter(key) {
      roles.counter.forEach(m => applyMaterial(m, M.counter[key]));
      roles.splash.forEach(m => applyMaterial(m, M.splash[key]));
      needs = true;
    },
    setFront(key)   { roles.front.forEach(m => applyMaterial(m, M.front[key])); needs = true; },
    setWall(hex)    { wallTarget.set(hex); needs = true; },
    setEvening(on)  { eveningTarget = on ? 1 : 0; needs = true; },
    resetView()     { dist = 5.6; azim = 0.52; polar = 1.30; place(); needs = true; }
  };
}
