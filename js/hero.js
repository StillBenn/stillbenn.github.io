/* ==========================================================================
   Hero — the live WebGL scene behind the title
   --------------------------------------------------------------------------
   A spiral galaxy turning inside a field of stars. The scene is the
   portfolio's first argument: a visitor should see real-time 3D before
   reading a word about it.

   Decisions worth knowing:
   · The galaxy is one BufferGeometry of ~18k points drawn in a single call.
     Building it as individual meshes would be thousands of draw calls for
     the same picture.
   · Both point clouds use a custom shader rather than PointsMaterial, so a
     particle can carry its own size, colour and twinkle phase, and can be
     drawn as a soft disc instead of a hard square.
   · Additive blending with depthWrite off: stars behind the core brighten it
     instead of z-fighting with it, which is how light actually accumulates.
   · Rendering stops when the hero scrolls away or the tab is hidden. An idle
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
  /* No tone mapping: ACES is built for HDR PBR and simply crushes the
     highlights of an additive point cloud, which is the whole picture here. */
  renderer.toneMapping = THREE.NoToneMapping;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200);
  camera.position.set(0, 2.9, 10.4);
  camera.lookAt(0, 0, 0);

  /* --- Subject ----------------------------------------------------------
     The galaxy sits in its own group so the whole system can be placed and
     tilted without touching the geometry. */
  const subject = new THREE.Group();
  subject.rotation.x = 0.42;          /* seen from slightly above */
  subject.rotation.z = -0.18;
  scene.add(subject);

  const galaxy = buildGalaxy();
  subject.add(galaxy.points);

  /* The arms alone leave the centre looking hollow. A soft additive disc
     standing in for the core's unresolved starlight fixes that far more
     cheaply than piling on more particles. */
  const core = new THREE.Mesh(
    new THREE.PlaneGeometry(4.2, 4.2),
    new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec2 vUv;
        void main() {
          float d = length(vUv - 0.5) * 2.0;
          float glow = pow(max(0.0, 1.0 - d), 3.4);
          float pulse = 0.92 + 0.08 * sin(uTime * 0.7);
          vec3 warm = mix(vec3(1.0, 0.86, 0.66), vec3(0.55, 0.62, 1.0), d);
          gl_FragColor = vec4(warm * 3.4, glow * 1.15 * pulse);
        }
      `
    })
  );
  core.rotation.x = -Math.PI / 2;   /* lies flat in the galactic plane */
  subject.add(core);

  const stars = buildStars();
  scene.add(stars.points);

  /* --- Layout -----------------------------------------------------------
     The galaxy sits right of the type on wide screens and drops to centre
     on narrow ones, where the copy needs the full width. Its offset is
     measured against the visible frame, so the composition holds on a
     laptop and on an ultrawide alike. */
  function layout() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;

    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
    const halfW = halfH * camera.aspect;

    const wide = w >= 900;
    subject.position.x = wide ? halfW * 0.52 : 0;
    subject.position.y = wide ? 0 : -1.4;
    subject.scale.setScalar(wide ? 0.78 : 0.56);
  }

  /* --- Pointer ----------------------------------------------------------
     Damped towards a target rather than applied directly, so a fast flick
     glides instead of snapping. */
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

  /* The canvas can change size without the window ever resizing — a
     stylesheet arriving late, a mobile URL bar sliding away, a container
     reflowing. Watching the element itself is the only reliable signal. */
  if ("ResizeObserver" in window) {
    new ResizeObserver(() => {
      layout();
      if (!running) renderer.render(scene, camera);
    }).observe(canvas);
  }

  function frame() {
    if (!running) return;
    requestAnimationFrame(frame);

    const t = clock.getElapsedTime();

    pointer.x += (pointer.tx - pointer.x) * 0.04;
    pointer.y += (pointer.ty - pointer.y) * 0.04;

    galaxy.uniforms.uTime.value = t;
    stars.uniforms.uTime.value = t;
    core.material.uniforms.uTime.value = t;

    /* The galaxy turns on its own axis; the pointer only nudges the whole
       system, so the spiral never looks like it is being dragged. */
    galaxy.points.rotation.y = t * 0.055;
    subject.rotation.y = pointer.x * 0.22;
    subject.rotation.x = 0.42 + pointer.y * 0.10;

    stars.points.rotation.y = t * 0.006;

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
  renderer.render(scene, camera);
  requestAnimationFrame(() => canvas.classList.add("is-ready"));
  start();

  /* --- Galaxy -----------------------------------------------------------
     Points are laid along a number of spiral branches. Three things stop it
     reading as a maths exercise:
       · radius^1.5 packs stars towards the core, as mass actually does;
       · the scatter is raised to a power so most stars hug the arm and only
         a few stray, which is what gives arms a soft edge;
       · colour is mixed by radius, so the core burns warm and the rim goes
         cold without any per-star bookkeeping. */
  function buildGalaxy() {
    const COUNT = 18000;
    const BRANCHES = 4;
    const RADIUS = 6.2;
    const SPIN = 1.05;

    const inner = new THREE.Color(0xfff0d6);   /* core: warm, almost white */
    const mid = new THREE.Color(0xbccaff);
    const outer = new THREE.Color(0x8f7ce8);   /* rim: cold violet */

    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const scale = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);

    const c = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;

      const r = Math.pow(Math.random(), 1.5) * RADIUS;
      const branch = ((i % BRANCHES) / BRANCHES) * Math.PI * 2;
      const spin = r * SPIN;

      /* Scatter shrinks near the core and widens outward, like a real arm. */
      const spread = 0.18 + r * 0.075;
      const sx = Math.pow(Math.random(), 2.6) * (Math.random() < 0.5 ? 1 : -1) * spread;
      const sy = Math.pow(Math.random(), 2.6) * (Math.random() < 0.5 ? 1 : -1) * spread * 0.42;
      const sz = Math.pow(Math.random(), 2.6) * (Math.random() < 0.5 ? 1 : -1) * spread;

      pos[i3] = Math.cos(branch + spin) * r + sx;
      pos[i3 + 1] = sy;
      pos[i3 + 2] = Math.sin(branch + spin) * r + sz;

      const k = r / RADIUS;
      if (k < 0.45) c.copy(inner).lerp(mid, k / 0.45);
      else c.copy(mid).lerp(outer, (k - 0.45) / 0.55);
      col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b;

      /* A few bright stars among many faint ones reads far better than a
         uniform dust of identical dots. */
      scale[i] = 0.35 + Math.pow(Math.random(), 3.2) * 2.6;
      seed[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: 38 * Math.min(window.devicePixelRatio, 2) }
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        attribute float aScale;
        attribute float aSeed;
        varying vec3 vColor;
        varying float vFade;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          /* Size falls off with distance so the cloud reads as depth. */
          gl_PointSize = uSize * aScale / -mv.z;
          vColor = color;
          vFade = 0.65 + 0.35 * sin(uTime * 0.9 + aSeed);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vFade;
        void main() {
          /* Soft disc: a hard square point is the giveaway of a naive
             particle system. */
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          a = pow(a, 1.7);
          /* Additive output is colour*alpha, and alpha is already small for
             a soft disc — without a gain the cloud renders almost black. */
          gl_FragColor = vec4(vColor * 2.7, a * vFade);
        }
      `
    });

    return { points: new THREE.Points(geo, mat), uniforms };
  }

  /* --- Starfield --------------------------------------------------------
     A shell of distant stars, well outside the galaxy, that twinkles slowly
     and drifts. It gives the empty half of the frame something to hold. */
  function buildStars() {
    const COUNT = 1400;
    const pos = new Float32Array(COUNT * 3);
    const scale = new Float32Array(COUNT);
    const seed = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      const r = 16 + Math.random() * 34;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.cos(phi) * 0.8;
      pos[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      scale[i] = 0.5 + Math.pow(Math.random(), 3.0) * 2.4;
      seed[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aScale", new THREE.BufferAttribute(scale, 1));
    geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

    const uniforms = {
      uTime: { value: 0 },
      uSize: { value: 60 * Math.min(window.devicePixelRatio, 2) }
    };

    const mat = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        uniform float uTime;
        uniform float uSize;
        attribute float aScale;
        attribute float aSeed;
        varying float vTwinkle;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * aScale / -mv.z;
          /* Two detuned sines: the pattern never visibly repeats. */
          vTwinkle = 0.45 + 0.55 * (0.5 + 0.5 * sin(uTime * 1.7 + aSeed))
                                 * (0.6 + 0.4 * sin(uTime * 0.41 + aSeed * 2.3));
        }
      `,
      fragmentShader: `
        varying float vTwinkle;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          a = pow(a, 2.6);
          gl_FragColor = vec4(vec3(0.82, 0.87, 1.0) * 1.8, a * vTwinkle * 0.9);
        }
      `
    });

    return { points: new THREE.Points(geo, mat), uniforms };
  }
}
