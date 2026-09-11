/* ==========================================================================
   Hero — the live WebGL scene behind the title
   --------------------------------------------------------------------------
   The scene is the portfolio's first argument: a visitor should see real-time
   3D before reading a word about it. So it renders immediately, reacts to the
   cursor, and costs nothing when it is off screen.

   Decisions worth knowing:
   · The environment map is generated from a canvas gradient rather than loaded
     from an HDR file — it reflects convincingly on metal, weighs nothing and
     removes a network request from the critical path.
   · Rendering stops when the hero scrolls away or the tab is hidden. A idle
     WebGL loop is the easiest way to drain a laptop battery on a portfolio.
   · With reduced motion requested the scene still draws, but only once: the
     visitor gets the image without the movement.
   ========================================================================== */

import * as THREE from "./vendor/three/three.module.min.js";

const canvas = document.querySelector(".hero__canvas");
if (canvas) init(canvas);

function init(canvas) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    /* No WebGL: the hero keeps its flat background and every word still reads. */
    return;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.32;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0.3, 7.1);

  /* --- Environment ------------------------------------------------------
     A vertical gradient, mapped as an equirectangular sky. Cool at the top,
     near-black at the bottom — the same light a product photographer would
     put above a dark set. */
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromEquirectangular(gradientEnv()).texture;

  /* --- Subject ----------------------------------------------------------
     An obsidian sphere inside a chrome ring. The sphere reads as mass, the
     ring catches the rim lights and gives the eye an edge to track while it
     turns. */
  const subject = new THREE.Group();
  scene.add(subject);

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(1.3, 96, 96),
    new THREE.MeshPhysicalMaterial({
      /* Dark, but not black: the sphere has to catch enough of the gradient
         sky for its curvature to read. A true black reads as a hole. */
      color: 0x39435a,
      metalness: 1,
      roughness: 0.21,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      envMapIntensity: 2.2
    })
  );
  subject.add(core);

  /* A fresnel shell just outside the sphere. Point lights put a specular
     wherever they happen to fall; this puts light exactly on the silhouette,
     so the subject keeps a readable edge at every angle and never sinks into
     the near-black page. Drawn back-side and added, so it only ever brightens. */
  subject.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.34, 96, 96),
    new THREE.ShaderMaterial({
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: { uColor: { value: new THREE.Color(0x6d97ff) } },
      vertexShader: `
        varying vec3 vN;
        varying vec3 vView;
        void main() {
          vN = normalize(normalMatrix * normal);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vView = normalize(-mv.xyz);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying vec3 vN;
        varying vec3 vView;
        void main() {
          float f = 1.0 - abs(dot(normalize(vN), normalize(vView)));
          f = pow(clamp(f, 0.0, 1.0), 3.2);
          gl_FragColor = vec4(uColor * f * 1.35, f);
        }
      `
    })
  ));

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.95, 0.05, 36, 220),
    new THREE.MeshStandardMaterial({
      color: 0xeef3fa,
      metalness: 1,
      roughness: 0.06,
      envMapIntensity: 3.2
    })
  );
  ring.rotation.x = Math.PI * 0.46;
  subject.add(ring);

  /* A second, thinner ring on a different axis — one ring reads as a prop,
     two read as a system. */
  const ringB = new THREE.Mesh(
    new THREE.TorusGeometry(2.45, 0.014, 24, 200),
    new THREE.MeshStandardMaterial({
      color: 0x6d97ff,
      metalness: 1,
      roughness: 0.2,
      envMapIntensity: 1.6
    })
  );
  ringB.rotation.set(Math.PI * 0.62, 0, Math.PI * 0.18);
  subject.add(ringB);

  subject.add(dustField());

  /* --- Light ------------------------------------------------------------ */
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(4, 7, 5);
  scene.add(key);

  scene.add(new THREE.HemisphereLight(0x44556b, 0x08080a, 0.4));

  /* Two rims in front for shape, and one behind the subject to separate its
     silhouette from the near-black page. Without the back light the sphere
     reads as a hole punched in the layout rather than as an object. */
  scene.add(rim(0x4a7cff, 26, -5.2, 2.0, 3.2));
  /* Kept low and well away from the blue rim: two speculars of similar size
     sitting side by side on a sphere read as a face. */
  scene.add(rim(0xbfd0ff, 11, 5.6, -2.4, 1.6));
  scene.add(rim(0x8fb0ff, 34, -1.4, 1.2, -4.5));

  /* --- Layout -----------------------------------------------------------
     The subject sits right of the type on wide screens and drops to centre
     on narrow ones, where the copy needs the full width. */
  function layout() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;

    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    /* Place the subject against the visible frame rather than at a fixed
       world offset, so it sits in the same part of the composition on a
       laptop and on an ultrawide instead of drifting off the edge. */
    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfW = halfH * camera.aspect;

    const wide = w >= 900;
    subject.position.x = wide ? halfW * 0.70 : 0;
    subject.position.y = wide ? 0.05 : -1.05;
    subject.scale.setScalar(wide ? 0.88 : 0.66);
  }

  /* --- Pointer ----------------------------------------------------------
     Parallax is damped towards a target rather than applied directly, so a
     fast flick glides instead of snapping. */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

  if (!reduced) {
    window.addEventListener("pointermove", (e) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });
  }

  /* --- Loop -------------------------------------------------------------
     Two gates keep the loop honest: the hero must be on screen, and the tab
     must be visible. */
  let onScreen = true;
  let running = false;
  const clock = new THREE.Clock();

  new IntersectionObserver(([entry]) => {
    onScreen = entry.isIntersecting;
    onScreen ? start() : stop();
  }, { threshold: 0 }).observe(canvas);

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : (onScreen && start());
  });

  window.addEventListener("resize", () => {
    layout();
    if (!running) renderer.render(scene, camera);
  });

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);

    const t = clock.getElapsedTime();

    pointer.x += (pointer.tx - pointer.x) * 0.045;
    pointer.y += (pointer.ty - pointer.y) * 0.045;

    subject.rotation.y = t * 0.16 + pointer.x * 0.32;
    subject.rotation.x = Math.sin(t * 0.22) * 0.07 + pointer.y * 0.16;
    ringB.rotation.z = Math.PI * 0.18 + t * 0.09;

    renderer.render(scene, camera);
  }

  function start() {
    if (running || reduced) return;
    running = true;
    clock.getDelta();
    requestAnimationFrame(frame);
  }
  function stop() { running = false; }

  /* First paint, then reveal — the canvas fades in only once there is
     something on it, so the hero never flashes an empty black box. */
  layout();
  subject.rotation.set(0.3, 0.6, 0);
  renderer.render(scene, camera);
  requestAnimationFrame(() => canvas.classList.add("is-ready"));
  start();

  /* --- helpers --------------------------------------------------------- */

  function rim(color, intensity, x, y, z) {
    const l = new THREE.PointLight(color, intensity, 40);
    l.position.set(x, y, z);
    return l;
  }

  function gradientEnv() {
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 256;
    const g = c.getContext("2d");
    /* This gradient is the only thing the metal has to reflect, so it carries
       a genuine bright band near the top — a dim sky renders dark chrome as a
       black ball. Bright to near-black over a short distance also gives the
       surface a clean horizon line to catch. */
    const grad = g.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.00, "#ffffff");
    grad.addColorStop(0.18, "#cfe0ff");
    grad.addColorStop(0.38, "#5d76ad");
    grad.addColorStop(0.60, "#1a2030");
    grad.addColorStop(1.00, "#05060a");
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 256);

    const tex = new THREE.CanvasTexture(c);
    tex.mapping = THREE.EquirectangularReflectionMapping;
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  /* A thin shell of points. Gives the empty space around the subject some
     depth without reading as "particles". */
  function dustField() {
    const n = 320;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const r = 3.2 + Math.random() * 2.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.55;
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return new THREE.Points(geo, new THREE.PointsMaterial({
      color: 0x8fa5cc,
      size: 0.018,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    }));
  }
}
