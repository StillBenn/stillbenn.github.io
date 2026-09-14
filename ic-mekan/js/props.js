/* ==========================================================================
   Furniture and styling
   --------------------------------------------------------------------------
   Two things separate an interior render from a 3D file on screen, and
   neither is resolution:

   1. EDGES. Nothing in a real room has a mathematically sharp corner. A 2 mm
      round on a cabinet front catches a thin line of light along its whole
      length, and that single highlight is most of what the eye reads as
      "solid object" rather than "flat polygon". Every panel here is built
      from a rounded profile, not a BoxGeometry.

   2. THINGS. An empty room reads as a model of a room. A bowl, a board, a
      plant and two stools give scale, occlusion and a reason for the light
      to do something interesting.
   ========================================================================== */

import * as THREE from "./vendor/three/three.module.min.js";

/* A rounded rectangle extruded with a bevel. `axis` says which way it is
   thick: "z" for a cabinet front, "y" for a worktop slab. */
export function panel(w, h, t, r, axis) {
  const rr = Math.min(r, w / 2 - 0.001, h / 2 - 0.001);
  const bev = Math.min(t * 0.34, 0.008);
  const sh = new THREE.Shape();
  const x0 = -w / 2, y0 = -h / 2;
  sh.moveTo(x0 + rr, y0);
  sh.lineTo(x0 + w - rr, y0);
  sh.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + rr);
  sh.lineTo(x0 + w, y0 + h - rr);
  sh.quadraticCurveTo(x0 + w, y0 + h, x0 + w - rr, y0 + h);
  sh.lineTo(x0 + rr, y0 + h);
  sh.quadraticCurveTo(x0, y0 + h, x0, y0 + h - rr);
  sh.lineTo(x0, y0 + rr);
  sh.quadraticCurveTo(x0, y0, x0 + rr, y0);

  const g = new THREE.ExtrudeGeometry(sh, {
    depth: Math.max(0.001, t - bev * 2),
    bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 2,
    curveSegments: 6
  });
  g.translate(0, 0, -(t - bev * 2) / 2);

  /* ExtrudeGeometry writes UVs in the shape's own coordinates, not 0..1 like
     a PlaneGeometry. Swapping BoxGeometry for this profile silently changed
     the texture scale and marble started tiling visibly across the worktop.
     UVs are rewritten in METRES, so a texture's `repeat` means "tiles per
     metre" on every panel regardless of its size, and the aspect ratio of
     the stone never stretches. */
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i), pos.getY(i));
  }
  uv.needsUpdate = true;

  if (axis === "y") g.rotateX(-Math.PI / 2);
  g.computeVertexNormals();
  return g;
}

/* --- Stool ----------------------------------------------------------------
   Counter height, so it also tells the viewer how tall the island is. */
export function stool(seatMat, legMat) {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.175, 0.045, 40), seatMat);
  seat.position.y = 0.66;
  seat.castShadow = seat.receiveShadow = true;
  g.add(seat);

  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.014, 0.68, 10), legMat);
    leg.position.set(Math.cos(a) * 0.125, 0.33, Math.sin(a) * 0.125);
    /* Splayed legs. Perfectly vertical legs look like a CAD primitive. */
    leg.rotation.z = -Math.cos(a) * 0.07;
    leg.rotation.x = Math.sin(a) * 0.07;
    leg.castShadow = true;
    g.add(leg);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.008, 8, 28), legMat);
  ring.position.y = 0.21;
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = true;
  g.add(ring);
  return g;
}

/* --- Bowl ----------------------------------------------------------------- */
export function bowl(mat) {
  const pts = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    pts.push(new THREE.Vector2(0.02 + Math.sin(t * Math.PI * 0.52) * 0.15, t * 0.075));
  }
  const m = new THREE.Mesh(new THREE.LatheGeometry(pts, 44), mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}

/* --- Plant ----------------------------------------------------------------
   Leaves are flat, double-sided and slightly bent. A round-leaved plant is
   the cheapest way to break up straight lines in a kitchen. */
export function plant(potMat, leafMat) {
  const g = new THREE.Group();
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.082, 0.155, 32), potMat);
  pot.position.y = 0.077;
  pot.castShadow = pot.receiveShadow = true;
  g.add(pot);

  const soil = new THREE.Mesh(new THREE.CylinderGeometry(0.098, 0.098, 0.01, 32),
    new THREE.MeshStandardMaterial({ color: 0x2a2118, roughness: 1 }));
  soil.position.y = 0.152;
  g.add(soil);

  for (let i = 0; i < 11; i++) {
    const sh = new THREE.Shape();
    sh.moveTo(0, 0);
    sh.quadraticCurveTo(0.055, 0.09, 0, 0.20);
    sh.quadraticCurveTo(-0.055, 0.09, 0, 0);
    const leaf = new THREE.Mesh(new THREE.ShapeGeometry(sh, 10), leafMat);
    leaf.material.side = THREE.DoubleSide;
    const a = (i / 11) * Math.PI * 2 + i * 0.7;
    const lean = 0.4 + (i % 3) * 0.22;
    leaf.position.set(0, 0.15 + (i % 4) * 0.035, 0);
    leaf.rotation.set(lean, a, 0);
    leaf.scale.setScalar(0.8 + (i % 3) * 0.25);
    leaf.castShadow = true;
    g.add(leaf);

    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.004, 0.005, 0.16, 6), leafMat);
    stem.position.set(Math.sin(a) * 0.03, 0.21 + (i % 4) * 0.02, Math.cos(a) * 0.03);
    stem.rotation.set(lean * 0.5, a, 0);
    g.add(stem);
  }
  return g;
}

/* --- Chopping board ------------------------------------------------------- */
export function board(mat) {
  const m = new THREE.Mesh(panel(0.42, 0.28, 0.022, 0.03, "y"), mat);
  m.castShadow = m.receiveShadow = true;
  return m;
}

/* --- Books ---------------------------------------------------------------- */
export function books(colours) {
  const g = new THREE.Group();
  let y = 0;
  colours.forEach((c, i) => {
    const t = 0.022 + (i % 3) * 0.008;
    const b = new THREE.Mesh(
      panel(0.19 - i * 0.008, 0.245 - i * 0.006, t, 0.004, "y"),
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.78 })
    );
    b.position.set((i % 2) * 0.008, y + t / 2, (i % 2) * 0.006);
    b.rotation.y = (i - 1) * 0.05;
    b.castShadow = b.receiveShadow = true;
    g.add(b);
    y += t;
  });
  return g;
}

/* --- Framed art -----------------------------------------------------------
   Deliberately abstract tonal blocks: a recognisable picture would date the
   demo and pull attention away from the materials, which are the product. */
export function art(w, h, tone) {
  const g = new THREE.Group();
  const frame = new THREE.Mesh(panel(w, h, 0.028, 0.004, "z"),
    new THREE.MeshStandardMaterial({ color: 0x1f2022, roughness: 0.42, metalness: 0.1 }));
  g.add(frame);

  const c = document.createElement("canvas");
  c.width = 256; c.height = Math.round(256 * h / w);
  const ctx = c.getContext("2d");
  const grd = ctx.createLinearGradient(0, 0, c.width, c.height);
  grd.addColorStop(0, tone[0]); grd.addColorStop(1, tone[1]);
  ctx.fillStyle = grd; ctx.fillRect(0, 0, c.width, c.height);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = tone[2];
  ctx.beginPath();
  ctx.ellipse(c.width * 0.58, c.height * 0.42, c.width * 0.3, c.height * 0.26, 0.6, 0, 7);
  ctx.fill();

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(w - 0.055, h - 0.055),
    new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })
  );
  face.position.z = 0.0155;
  g.add(face);
  return g;
}
