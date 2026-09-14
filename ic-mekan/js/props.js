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

  /* An upholstered seat, not a disc. The profile is a soft cushion with a
     turned-under edge: the thin dark line where the fabric rolls under is
     what makes it read as padded instead of as a cylinder. */
  /* A domed cushion with a rolled edge. The earlier profile was flat on top
     and every segment met at radius zero, which left a pinch mark in the
     middle of the seat — the lathe's pole, not a design feature. */
  const pts = [
    [0.000, 0.074], [0.055, 0.073], [0.100, 0.070], [0.138, 0.064],
    [0.166, 0.054], [0.182, 0.040], [0.186, 0.026], [0.180, 0.010],
    [0.162, 0.001], [0.120, 0.000], [0.000, 0.000]
  ].map(p => new THREE.Vector2(p[0], p[1]));
  const seatGeo = new THREE.LatheGeometry(pts, 56);
  seatGeo.computeVertexNormals();
  const seat = new THREE.Mesh(seatGeo, seatMat);
  seat.position.y = 0.648;
  seat.castShadow = seat.receiveShadow = true;
  g.add(seat);

  /* Four tapered legs with a subtle splay. Perfectly vertical legs of even
     thickness look like a CAD primitive. */
  for (let i = 0; i < 4; i++) {
    const a = Math.PI / 4 + i * Math.PI / 2;
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.0115, 0.019, 0.665, 14), legMat);
    leg.position.set(Math.cos(a) * 0.128, 0.3325, Math.sin(a) * 0.128);
    leg.rotation.z = -Math.cos(a) * 0.085;
    leg.rotation.x = Math.sin(a) * 0.085;
    leg.castShadow = true;
    g.add(leg);
  }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.142, 0.0075, 10, 34), legMat);
  ring.position.y = 0.195;
  ring.rotation.x = Math.PI / 2;
  ring.castShadow = true;
  g.add(ring);
  return g;
}

/* --- Fluted panel ----------------------------------------------------------
   Vertical half-round reeding. It exists for one reason: a large flat slab
   is the surface where a render looks cheapest, because there is nothing for
   light to do on it. Reeding turns the same slab into forty highlights that
   shift as the camera moves. It is also exactly what a joinery firm sells as
   the upgrade over a plain panel. */
export function fluted(w, h, mat, ribR) {
  const g = new THREE.Group();
  const r = ribR || 0.021;
  const n = Math.max(4, Math.round(w / (r * 2)));
  const step = w / n;
  const back = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.012), mat);
  back.receiveShadow = true;
  g.add(back);
  for (let i = 0; i < n; i++) {
    /* Full cylinders half-buried in the backing board rather than half
       cylinders: a half cylinder has an open side, and getting its rotation
       wrong shows the hollow. Sinking a whole one costs nothing and cannot
       be oriented incorrectly. The axis stays vertical — reeding runs with
       the height of the panel, which is what a joiner actually makes. */
    const rib = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 16), mat);
    rib.position.set(-w / 2 + step / 2 + i * step, 0, 0.006);
    rib.castShadow = rib.receiveShadow = true;
    g.add(rib);
  }
  return g;
}

/* --- Bowl -----------------------------------------------------------------
   The first version was a shallow white dish on white marble: from a higher
   camera it vanished completely. Two fixes, both of them the same lesson —
   an object needs its own silhouette AND its own tone. It is deeper now, so
   it reads as a vessel from above, and it carries a rim so there is always a
   highlight separating it from whatever it stands on. */
export function bowl(mat) {
  const pts = [];
  const R = 0.165, Hh = 0.105;
  for (let i = 0; i <= 16; i++) {
    const t = i / 16;
    /* A curve that starts almost flat and turns up sharply: the profile of a
       thrown bowl, not a section of a sphere. */
    pts.push(new THREE.Vector2(0.035 + Math.pow(t, 0.62) * R, Math.pow(t, 1.5) * Hh));
  }
  pts.push(new THREE.Vector2(0.035 + R + 0.006, Hh + 0.004));   // rim
  pts.push(new THREE.Vector2(0.035 + R - 0.004, Hh + 0.002));   // inner wall
  for (let i = 16; i >= 0; i--) {
    const t = i / 16;
    pts.push(new THREE.Vector2(0.03 + Math.pow(t, 0.62) * (R - 0.012),
                               Math.pow(t, 1.5) * Hh + 0.009));
  }
  const g = new THREE.LatheGeometry(pts, 56);
  g.computeVertexNormals();
  const m = new THREE.Mesh(g, mat);
  m.material.side = THREE.DoubleSide;
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

/* --- Stone tray -----------------------------------------------------------
   Replaces the chopping board. A board is a working tool and it read as the
   cheapest thing in the room; a stone tray with a lipped edge is the object
   a showroom actually styles a worktop with. */
export function tray(stoneMat, metalMat) {
  const g = new THREE.Group();
  const slab = new THREE.Mesh(panel(0.46, 0.30, 0.016, 0.02, "y"), stoneMat);
  slab.castShadow = slab.receiveShadow = true;
  g.add(slab);
  /* A thin metal rail around the edge — the detail that makes it read as a
     designed object rather than an offcut. */
  [[0.23, 0], [-0.23, 0], [0, 0.15], [0, -0.15]].forEach(o => {
    const along = o[0] === 0;
    const bar = new THREE.Mesh(
      new THREE.BoxGeometry(along ? 0.46 : 0.008, 0.016, along ? 0.008 : 0.30),
      metalMat);
    bar.position.set(o[0], 0.012, o[1]);
    bar.castShadow = true;
    g.add(bar);
  });
  return g;
}

/* --- Ribbed ceramic vase ---------------------------------------------------
   Ribs exist for the light, not for the shape: a smooth vase under soft
   lighting is a flat silhouette, a ribbed one carries a run of highlights
   that tells you it is round. */
export function vase(bodyMat, stemMat) {
  const g = new THREE.Group();
  const pts = [];
  for (let i = 0; i <= 22; i++) {
    const t = i / 22;
    const r = 0.045 + Math.sin(t * Math.PI * 0.9) * 0.062 - t * 0.028;
    pts.push(new THREE.Vector2(Math.max(0.03, r), t * 0.30));
  }
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 26), bodyMat);
  body.castShadow = body.receiveShadow = true;
  g.add(body);

  /* Dried stems: three thin tapered lines with a few seed heads. */
  for (let i = 0; i < 5; i++) {
    const a = i * 1.31;
    const lean = 0.10 + (i % 3) * 0.07;
    const h = 0.30 + (i % 3) * 0.09;
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0032, h, 6), stemMat);
    stem.position.set(Math.sin(a) * 0.02, 0.30 + h / 2, Math.cos(a) * 0.02);
    stem.rotation.set(Math.sin(a) * lean, 0, Math.cos(a) * lean);
    g.add(stem);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), stemMat);
    head.scale.set(1, 2.4, 1);
    head.position.set(Math.sin(a) * (0.02 + Math.sin(lean) * h * 0.5), 0.30 + h,
                      Math.cos(a) * (0.02 + Math.cos(lean) * h * 0.08));
    g.add(head);
  }
  return g;
}

/* --- Glass carafe ---------------------------------------------------------
   Real refracting glass. It is here because it is the one object that proves
   the page is a renderer and not a picture: transmission, thickness and a
   rough rim behave differently as the camera moves, and no photograph of a
   room can do that on demand. */
export function carafe() {
  const g = new THREE.Group();
  /* `transparent: true` ALONGSIDE transmission is the trap: the mesh then
     goes through the ordinary alpha pass and comes out milky instead of
     refracting. Transmission needs the opaque pass and a thickness to bend
     light through. */
  const mat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, transmission: 1.0, thickness: 0.16, ior: 1.5,
    roughness: 0.05, metalness: 0, side: THREE.DoubleSide,
    /* Smoked, not water-clear. Clear glass standing on white marble in front
       of a white wall simply renders white — physically right, visually
       useless. A short attenuation distance gives the body a tint so the eye
       reads "glass" immediately. */
    attenuationColor: new THREE.Color(0x7f9aa0), attenuationDistance: 0.30,
    envMapIntensity: 1.9, clearcoat: 0.6, clearcoatRoughness: 0.03
  });
  const pts = [];
  for (let i = 0; i <= 20; i++) {
    const t = i / 20;
    let r;
    if (t < 0.72) r = 0.052 + Math.sin(t / 0.72 * Math.PI * 0.8) * 0.028;
    else r = 0.032 + (1 - (t - 0.72) / 0.28) * 0.018;
    pts.push(new THREE.Vector2(r, t * 0.24));
  }
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), mat);
  body.castShadow = false;
  g.add(body);
  return g;
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
