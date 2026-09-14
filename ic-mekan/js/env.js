/* ==========================================================================
   Environment lighting — the single biggest reason a render reads as real
   --------------------------------------------------------------------------
   A physically based material needs something to reflect. With only lamps in
   the scene, every surface reflects black: marble goes flat, gloss lacquer
   goes plastic, metal goes grey. That is exactly what makes a WebGL room look
   cheap, and no amount of extra lights fixes it — lights add brightness, not
   reflection.

   So we build a tiny room out of emissive planes, pre-filter it with
   PMREMGenerator and hand it to the scene as `scene.environment`. Every
   material then has a world to reflect: a bright ceiling above, cooler light
   from the window side, a warm floor bounce below.

   Built in code rather than loaded as an HDR because an .hdr is 2–8 MB and
   this page has to open on a phone over mobile data.
   ========================================================================== */

import * as THREE from "./vendor/three/three.module.min.js";

function panel(scene, w, h, d, x, y, z, colour, intensity) {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshStandardMaterial({
      color: 0x000000,
      emissive: new THREE.Color(colour),
      emissiveIntensity: intensity,
      side: THREE.DoubleSide
    })
  );
  m.position.set(x, y, z);
  scene.add(m);
  return m;
}

export function buildEnvironment(renderer, opts) {
  opts = opts || {};
  const evening = opts.evening || 0;

  const env = new THREE.Scene();

  /* The box we are standing inside. Values are lighting, not decoration:
     the ceiling is the brightest surface in almost every real interior, and
     the floor bounce is warm because floors are usually wood or stone. */
  const sky   = new THREE.Color(0xbcd4f0).lerp(new THREE.Color(0x14203a), evening);
  const roof  = new THREE.Color(0xffffff).lerp(new THREE.Color(0xffd9a8), evening);
  const walls = new THREE.Color(0xe8e2d8).lerp(new THREE.Color(0x6a5540), evening);
  const floor = new THREE.Color(0xc9a97e).lerp(new THREE.Color(0x4a3626), evening);

  panel(env, 20, 0.1, 20, 0, 9, 0, roof, evening ? 0.45 : 1.15);    // ceiling
  panel(env, 20, 0.1, 20, 0, -9, 0, floor, evening ? 0.10 : 0.38);  // floor bounce
  panel(env, 0.1, 20, 20, -10, 0, 0, sky, evening ? 0.12 : 1.9);    // window side
  panel(env, 0.1, 20, 20, 10, 0, 0, walls, evening ? 0.10 : 0.45);
  panel(env, 20, 20, 0.1, 0, 0, -10, walls, evening ? 0.10 : 0.42);
  panel(env, 20, 20, 0.1, 0, 0, 10, walls, evening ? 0.10 : 0.50);

  /* One bright slab standing in for the window itself. A single strong
     source is what gives gloss fronts a readable highlight instead of an
     even sheen — without it the lacquer looks like matte paint. */
  panel(env, 0.1, 7, 9, -9.4, 1.5, 1.0, sky, evening ? 0.3 : 5.2);

  if (evening > 0.05) {
    /* Warm pools where the pendants are, so metal and gloss pick up the
       lamps rather than reflecting a uniform brown. */
    panel(env, 3.2, 0.1, 3.2, 0, 3.0, 1.5, new THREE.Color(0xffb774), 3.4 * evening);
  }

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();
  const rt = pmrem.fromScene(env, 0.035);
  pmrem.dispose();

  env.traverse(o => {
    if (o.geometry) o.geometry.dispose();
    if (o.material) o.material.dispose();
  });

  return rt.texture;
}
