/* ==========================================================================
   The café stop — the film's last frame, alive
   --------------------------------------------------------------------------
   The home film's café chapter is cafe-3d's own chapter 4, and its last frame
   is that site's live cup in its opening pose. This scene is that cup, built
   by cafe-3d's own cup.js and lit, lensed and posed exactly as cafe-3d's
   scene.js does at its film handoff — so the film fades out over it without a
   seam, and the two projects can never drift apart (one cup.js, one set of
   frames, both served from /cafe-3d/).

   After the handoff the cup is the visitor's: a sideways drag turns it and a
   release lets it run on, the camera leans a little towards the cursor, and
   thin instrument labels are pinned to its parts — they follow the cup as it
   turns and fade when their part turns away.
   ========================================================================== */
import * as THREE from "/cafe-3d/js/vendor/three/three.module.min.js";
import {
  SIZES, CUP_COLOURS, SLEEVES, LIDS, FINISHES,
  paperRoughness, ribNormal, printMap, bodyProfile, sleeveProfile, lidProfile, buildSpout
} from "/cafe-3d/js/cup.js?v=19";

const canvas = document.querySelector(".cupstage");
const section = document.querySelector("[data-stop='cafe']");
if (canvas && section) boot();

function boot() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    return;                                    /* no WebGL: the film's last frame stays */
  }
  /* --- cafe-3d scene.js, as it stands at the handoff (keep in step) ------- */
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;

  const scene = new THREE.Scene();
  const BASE_FOV = 30, CAM_Z = 7.6;
  const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 60);

  const key = new THREE.DirectionalLight(0xfff3e2, 1.85);
  key.position.set(-3.4, 5.4, 4.2);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 1; key.shadow.camera.far = 20;
  key.shadow.camera.left = -4; key.shadow.camera.right = 4;
  key.shadow.camera.top = 4; key.shadow.camera.bottom = -4;
  key.shadow.bias = -0.0006; key.shadow.radius = 4;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xdae6ff, 0.5); fill.position.set(4.2, 1.8, 2.4); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.15); rim.position.set(1.2, 3.4, -4.6); scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xd6ccbc, 0.38));
  scene.environment = buildEnv();

  const SLEEVE_LIFT = 1.32, SHADOW = 0.135;   /* see matSleeve */
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(26, 26), new THREE.ShadowMaterial({ opacity: SHADOW }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  const PRINT_SCALE = Math.min(devicePixelRatio, 2) * innerWidth > 2400 ? 4 : 2;
  const print = printMap(PRINT_SCALE);
  print.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const roughTex = paperRoughness(), ribTex = ribNormal();
  const matBody = new THREE.MeshPhysicalMaterial({
    color: CUP_COLOURS.bone.hex, map: print, roughnessMap: roughTex,
    roughness: FINISHES.matte.rough, metalness: 0, clearcoat: FINISHES.matte.coat,
    clearcoatRoughness: FINISHES.matte.coatRough, envMapIntensity: 0.55, side: THREE.DoubleSide
  });
  /* the print is ink laid where the map is dark (scene.js), not a multiply */
  const logoInk = { value: new THREE.Color(0x241d18).lerp(new THREE.Color(CUP_COLOURS.bone.hex), 0.1) };
  matBody.onBeforeCompile = (sh) => {
    sh.uniforms.logoInk = logoInk;
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nuniform vec3 logoInk;")
      .replace("#include <map_fragment>",
        "{ float lm = clamp(1.0 - texture2D(map, vMapUv).g, 0.0, 1.0); diffuseColor.rgb = mix(diffuseColor.rgb, logoInk, lm); }");
  };
  /* Matched to the FILM's last frame, not to scene.js: measured side by side,
     the live kraft came out ~12% darker than Blender's (R 126 vs 143) and the
     floor shadow darker and harder. The film is what the eye has just seen. */
  const matSleeve = new THREE.MeshStandardMaterial({
    color: new THREE.Color(SLEEVES.kraft.hex).multiplyScalar(SLEEVE_LIFT), normalMap: ribTex, roughnessMap: roughTex, roughness: 0.95, metalness: 0, envMapIntensity: 0.35
  });
  matSleeve.normalScale.set(0.5, 0.5);
  const matLid = new THREE.MeshPhysicalMaterial({
    color: LIDS.bone.hex, roughness: 0.38, metalness: 0, clearcoat: 0.85, clearcoatRoughness: 0.22, envMapIntensity: 1.0
  });
  const matHole = new THREE.MeshBasicMaterial({ color: 0x120c08 });

  const S = SIZES.tall, H = S.h;
  const cup = new THREE.Group(); scene.add(cup);
  const part = (geo, mat) => { const m = new THREE.Mesh(geo, mat); m.castShadow = true; cup.add(m); return m; };
  part(new THREE.LatheGeometry(bodyProfile(H, S.rb, S.rt), 160), matBody);
  part(new THREE.LatheGeometry(sleeveProfile(H, S.rb, S.rt), 160), matSleeve);
  part(new THREE.LatheGeometry(lidProfile(H, S.rt), 160), matLid);
  cup.add(buildSpout(H, S.rt, matLid, matHole));

  /* the film's pose and eye (scene.js FILM_CUP / FILM_EYE) */
  const FILM_CUP = {
    x: 0.46 * Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2)) * CAM_Z * 16 / 9,
    y: -H / 2 - 0.12, s: 0.96, ry: -0.45, tilt: -0.05
  };
  const FILM_EYE = {
    "16x9": { cam: new THREE.Vector3(0, 0.62, CAM_Z), tgt: new THREE.Vector3(0, 0.02, 0), aspect: 16 / 9 },
    "9x16": { cam: new THREE.Vector3(FILM_CUP.x, FILM_CUP.y + 0.45 / 0.58, CAM_Z / 0.58),
              tgt: new THREE.Vector3(FILM_CUP.x, FILM_CUP.y - 0.15 / 0.58, 0), aspect: 9 / 16 }
  };
  cup.position.set(FILM_CUP.x, FILM_CUP.y, 0);
  cup.scale.setScalar(FILM_CUP.s);
  floor.position.y = FILM_CUP.y - 0.02;

  /* --- pinned labels ------------------------------------------------------
     Points on the cup (its own space: base at y 0, lathe u = 0 on +z) with the
     direction their surface faces, and where the label sits on screen
     relative to its point (in rem, per layout). */
  const rAt = (y) => S.rb + (S.rt - S.rb) * (y / H);
  const PINS = [
    { id: "lid",    p: [0, H + 0.03, rAt(H) * 0.92], n: [0, 0.5, 1], wide: [-15, -7.5], tall: null },
    /* on a phone the name's label cannot clear the cup (measured at 390 px): the list below says it */
    { id: "print",  p: [rAt(H * 0.8) + 0.01, H * 0.8, 0], n: [1, 0, 0], wide: [7.5, -5.5], tall: null },
    { id: "sleeve", p: [0, H * 0.46, rAt(H * 0.46) + 0.05], n: [0, 0, 1], wide: [-15, 1.5], tall: null },
    { id: "handoff", p: [0, 0.03, S.rb], n: [0, -0.2, 1], wide: [6.5, 5], tall: [1.5, 2.4] }
  ];
  const hud = document.querySelector(".pins");
  const svg = hud ? hud.querySelector("svg") : null;
  const pinEls = hud ? PINS.map((pin) => {
    const el = hud.querySelector(`[data-pin="${pin.id}"]`);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("r", "3");
    svg.append(line, dot);
    return { pin, el, line, dot, o: 0, w: 0, h: 0 };
  }) : [];
  const v3 = new THREE.Vector3(), n3 = new THREE.Vector3(), toCam = new THREE.Vector3();
  const nmat = new THREE.Matrix3();
  const remPx = () => parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  let rem = remPx();

  /* --- state ---------------------------------------------------------------- */
  let film = window.__filmLayout || null;
  let aspect = innerHeight > innerWidth ? "9x16" : "16x9";
  let hand = 1, asleep = true, idle = 0, exit = 1;
  let userSpin = 0, spinVel = 0, dragging = false, moved = false, lastX = 0, lastT = 0, downX = 0, downY = 0;
  const look = { x: 0, y: 0, tx: 0, ty: 0 };

  const hdrEl = document.querySelector(".hdr");
  const hdrH = () => (hdrEl ? hdrEl.offsetHeight : 0);
  /* label sizes change with the screen and the language */
  function measurePins() { for (const pe of pinEls) { pe.w = pe.el.offsetWidth; pe.h = pe.el.offsetHeight; } }
  if (window.LR) window.LR.on(() => { measurePins(); render(); });
  function layout() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    rem = remPx();
    if (svg) svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    measurePins();
  }
  function readScroll() {
    const y = scrollY, vh = innerHeight;
    const live = film && film.handoff;
    const k = still ? 1 : live ? Math.min(1, Math.max(0, (y - film.end) / (vh * 0.6))) : 0;   /* no film measured yet: still its pose */
    hand = 1 - k * k * (3 - 2 * k);
    const was = asleep;
    /* leave as the section ends, rising a little: gone BEFORE the next
       section's opaque top reaches the cup's base (~80% down) — fading while
       it climbed over the cup sliced the cup in half (measured, 1440x900) */
    const r = section.getBoundingClientRect();
    const e = Math.min(1, Math.max(0, (r.bottom - vh * 0.86) / (vh * 0.26)));
    exit = e * e * (3 - 2 * e);
    /* sleep until just before the film's hold: before that the film covers
       the screen and needs the GPU for its own frames — and again once the
       section has gone, where the next films need it. A still film (reduced
       motion, no WebGL) hands nothing over: the cup is simply there. */
    asleep = exit === 0 || (still ? false : !live || y < film.start - vh * 0.12);
    canvas.style.opacity = asleep ? "0" : exit.toFixed(3);
    /* asleep, nothing draws: the labels must be cleared here or they stay where
       the last frame left them (seen hanging over the next section) */
    if (asleep && hud) hud.style.opacity = "0";
    canvas.classList.toggle("is-interactive", !asleep && hand < 0.05 && exit > 0.5);
    if (was && !asleep) start();
    if (!running && !asleep) render();
  }
  let still = !!window.__filmStill;
  /* the café chapter is the end of the first film ("main"); the page has others */
  addEventListener("film:layout", (e) => { if ((e.detail.id || "main") !== "main") return; film = e.detail; aspect = film.aspect || aspect; readScroll(); start(); });
  addEventListener("film:still", (e) => { if (e.detail && e.detail.id && e.detail.id !== "main") return; still = true; readScroll(); render(); });
  addEventListener("scroll", readScroll, { passive: true });
  addEventListener("resize", () => { layout(); readScroll(); render(); });
  if ("ResizeObserver" in window) new ResizeObserver(() => { layout(); render(); }).observe(canvas);

  /* --- drag to turn (cafe-3d scene.js: a sideways move starts it, a release runs on) */
  canvas.addEventListener("pointerdown", (e) => {
    if (!canvas.classList.contains("is-interactive")) return;
    dragging = true; moved = false; spinVel = 0; lastX = downX = e.clientX; downY = e.clientY; lastT = e.timeStamp;
    canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    if (!moved) {
      const ax = Math.abs(e.clientX - downX), ay = Math.abs(e.clientY - downY);
      if (ax < 4 || ax < ay) return;
      moved = true; lastX = e.clientX; lastT = e.timeStamp;
      document.documentElement.classList.add("has-turned");
      return;
    }
    const d = (e.clientX - lastX) * 0.009, dt = Math.max(1, e.timeStamp - lastT) / 1000;
    userSpin += d;
    spinVel = spinVel * 0.6 + (d / dt) * 0.4;
    lastX = e.clientX; lastT = e.timeStamp;
    if (!running) render();
  });
  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    if (!moved || (e && e.type === "pointercancel") || (e && e.timeStamp - lastT > 90)) spinVel = 0;
    spinVel = Math.max(-9, Math.min(9, spinVel));
    start();
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);
  if (matchMedia("(pointer: fine)").matches) {
    addEventListener("pointermove", (e) => {
      look.tx = (e.clientX / innerWidth) * 2 - 1;
      look.ty = (e.clientY / innerHeight) * 2 - 1;
      start();
    }, { passive: true });
  }

  /* --- loop ------------------------------------------------------------------- */
  let running = false;
  const clock = new THREE.Clock();
  const eyeP = new THREE.Vector3(), eyeT = new THREE.Vector3();

  function pose(dt) {
    idle += dt * (1 - hand);
    if (!dragging && spinVel) {
      userSpin += spinVel * dt;
      spinVel *= Math.exp(-dt * 4.2);
      if (Math.abs(spinVel) < 0.02) spinVel = 0;
    }
    /* the film's pose, plus what the visitor and the idle sway add once it is theirs */
    const free = 1 - hand;
    cup.rotation.y = FILM_CUP.ry + (userSpin + idle * 0.1) * free;
    cup.rotation.z = FILM_CUP.tilt + Math.sin(idle * 0.65) * 0.012 * free;
    cup.rotation.x = Math.sin(idle * 0.47) * 0.008 * free;
    cup.position.y = FILM_CUP.y + Math.sin(idle * 0.8) * 0.03 * free + (1 - exit) * 0.55;

    const lk = Math.min(1, dt * 3.2);
    look.x += (look.tx - look.x) * lk; look.y += (look.ty - look.y) * lk;
    const E = FILM_EYE[aspect] || FILM_EYE["16x9"];
    const lx = look.x * free, ly = look.y * free;
    eyeP.copy(E.cam).add(v3.set(lx * 0.3, -ly * 0.2, 0));
    eyeT.copy(E.tgt).add(v3.set(lx * 0.1, -ly * 0.05, 0));
    /* the film's lens as object-fit: cover crops it on this screen */
    const a = camera.aspect;
    const fov = a > E.aspect
      ? THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(BASE_FOV / 2)) * E.aspect / a))
      : BASE_FOV;
    if (Math.abs(camera.fov - fov) > 1e-4) { camera.fov = fov; camera.updateProjectionMatrix(); }
    camera.position.copy(eyeP);
    camera.lookAt(eyeT);
  }

  function pins() {
    if (!pinEls.length) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const show = asleep ? 0 : (1 - Math.min(1, hand * 4)) * exit;
    hud.style.opacity = show.toFixed(3);
    if (show <= 0.001) return;
    cup.updateMatrixWorld();
    nmat.getNormalMatrix(cup.matrixWorld);
    for (const pe of pinEls) {
      const off = aspect === "9x16" ? pe.pin.tall : pe.pin.wide;
      if (!off) { pe.el.style.display = "none"; pe.line.style.display = pe.dot.style.display = "none"; continue; }
      pe.el.style.display = ""; pe.line.style.display = pe.dot.style.display = "";
      v3.fromArray(pe.pin.p).applyMatrix4(cup.matrixWorld);
      n3.fromArray(pe.pin.n).applyMatrix3(nmat).normalize();
      toCam.copy(camera.position).sub(v3).normalize();
      /* a part turning away takes its label with it */
      const facing = Math.min(1, Math.max(0, (n3.dot(toCam) - 0.08) / 0.3));
      pe.o += (facing - pe.o) * 0.25;
      v3.project(camera);
      const x = (v3.x * 0.5 + 0.5) * w, y = (-v3.y * 0.5 + 0.5) * h;
      /* kept on screen (a phone is narrower than the offsets): a left label's
         box ends at lx, a right one's starts there */
      const m = rem * 0.75, top = hdrH() + m, left = off[0] < 0;
      const lx = left ? Math.min(w - m, Math.max(m + pe.w, x + off[0] * rem)) : Math.max(m, Math.min(w - m - pe.w, x + off[0] * rem));
      const ly = Math.max(top, Math.min(h - m - pe.h, y + off[1] * rem));
      pe.el.style.transform = `translate3d(${lx.toFixed(1)}px, ${ly.toFixed(1)}px, 0)`;
      pe.el.classList.toggle("is-left", off[0] < 0);
      pe.el.style.opacity = pe.o.toFixed(3);
      pe.dot.setAttribute("cx", x.toFixed(1)); pe.dot.setAttribute("cy", y.toFixed(1));
      pe.line.setAttribute("x1", x.toFixed(1)); pe.line.setAttribute("y1", y.toFixed(1));
      pe.line.setAttribute("x2", lx.toFixed(1)); pe.line.setAttribute("y2", (ly).toFixed(1));
      pe.line.style.opacity = pe.dot.style.opacity = pe.o.toFixed(3);
    }
  }

  function render() {
    pose(0);
    renderer.render(scene, camera);
    pins();
  }

  function frame() {
    if (!running) return;
    if (asleep) { running = false; return; }
    const dt = Math.min(0.05, clock.getDelta());
    pose(dt);
    renderer.render(scene, camera);
    pins();
    /* keep going while there is life on screen: the idle sway once it is the
       visitor's, a spin running out, the camera still leaning */
    const busy = hand < 0.999 || spinVel || dragging || Math.abs(look.tx - look.x) > 0.001 || Math.abs(look.ty - look.y) > 0.001;
    if (busy && !reduced && exit > 0) requestAnimationFrame(frame); else running = false;
  }
  function start() {
    if (running || asleep || document.hidden) return;
    if (reduced) { render(); return; }
    running = true;
    clock.getDelta();
    requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });

  layout();
  readScroll();
  render();
  canvas.classList.add("is-ready");

  /* ?probe: tests read the pose */
  if (/[?&]probe/.test(location.search)) window.__cup = { get hand() { return hand; }, get spin() { return cup.rotation.y; }, get asleep() { return asleep; } };

  function buildEnv() {
    const c = document.createElement("canvas");
    c.width = 32; c.height = 256;
    const g = c.getContext("2d");
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.00, "#ffffff");
    grad.addColorStop(0.40, "#f0e9dd");
    grad.addColorStop(0.72, "#b5ada2");
    grad.addColorStop(1.00, "#6b635a");
    g.fillStyle = grad; g.fillRect(0, 0, 32, 256);
    const box = g.createLinearGradient(0, 34, 0, 108);
    box.addColorStop(0.00, "rgba(255,255,255,0)");
    box.addColorStop(0.35, "rgba(255,255,255,1)");
    box.addColorStop(0.65, "rgba(255,255,255,1)");
    box.addColorStop(1.00, "rgba(255,255,255,0)");
    g.fillStyle = box; g.fillRect(0, 34, 32, 74);
    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromEquirectangular(tex).texture;
    tex.dispose();
    return env;
  }
}
