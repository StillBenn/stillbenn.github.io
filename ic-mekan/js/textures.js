/* ==========================================================================
   Procedural materials — every surface is generated in code
   --------------------------------------------------------------------------
   No texture downloads. An interior demo lives or dies on material quality,
   but shipping 20 MB of 4K photographs would make it useless on a phone —
   and this page exists to be opened on a phone by a client standing in a
   showroom.

   So oak, walnut, marble, granite and microcement are drawn onto canvases at
   load time. Each generator returns a colour map AND a roughness map: the
   reason a real marble slab reads as stone and a coloured plane does not is
   that light scatters differently along the veins. Colour alone is a sticker.
   ========================================================================== */

import * as THREE from "./vendor/three/three.module.min.js";

/* Deterministic value noise. Math.random() would make the same material look
   different on every reload, which is exactly the thing a client notices when
   they show the link to a colleague. */
function hash(x, y, seed) {
  let h = Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(seed | 0, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
const smooth = t => t * t * (3 - 2 * t);

function noise2(x, y, seed) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = smooth(xf), v = smooth(yf);
  const a = hash(xi, yi, seed),     b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
}

/* Layered noise — one octave looks like blur, four looks like a material. */
function fbm(x, y, seed, octaves) {
  let sum = 0, amp = 0.5, freq = 1;
  const n = octaves || 4;
  for (let i = 0; i < n; i++) {
    sum += noise2(x * freq, y * freq, seed + i * 17) * amp;
    amp *= 0.5; freq *= 2;
  }
  return sum;
}

function makeCanvas(size) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return { c: c, ctx: c.getContext("2d") };
}

function toTexture(canvas, repeat, srgb) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const mix = (a, b, t) => a + (b - a) * t;
const rgb = (r, g, b) => "rgb(" + (r | 0) + "," + (g | 0) + "," + (b | 0) + ")";
const rgba = (c, a) => "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")";

/* --- Wood -----------------------------------------------------------------
   Planks with their own tone, then grain drawn as long low-contrast arcs.
   End joints are staggered: a floor with aligned joints reads as a tiled
   image, which is the usual tell of a cheap render. */
function wood(base, dark, opts) {
  opts = opts || {};
  const S = 1024;
  const rows = opts.rows || 6;
  const board = makeCanvas(S);
  const rough = makeCanvas(S);
  const ctx = board.ctx;
  const rowH = S / rows;
  const perRow = 2;

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * 0.5 + (r % 3) * 0.17;
    for (let p = -1; p <= perRow; p++) {
      const w = S / perRow;
      const x0 = (p + offset) * w;
      const tone = 0.82 + hash(r, p, 7) * 0.36;
      ctx.fillStyle = rgb(base[0] * tone, base[1] * tone, base[2] * tone);
      ctx.fillRect(x0, r * rowH, w, rowH);

      for (let i = 0; i < 26; i++) {
        const y = r * rowH + (i / 26) * rowH + hash(i, p + r * 31, 3) * 3;
        ctx.strokeStyle = rgba(dark, (0.05 + hash(i, p, 11) * 0.12).toFixed(3));
        ctx.lineWidth = 0.6 + hash(i, p, 5) * 1.6;
        ctx.beginPath();
        ctx.moveTo(x0, y);
        const bend = (hash(i, p, 23) - 0.5) * rowH * 0.35;
        ctx.bezierCurveTo(x0 + w * 0.33, y + bend, x0 + w * 0.66, y - bend, x0 + w, y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(x0, r * rowH, 1.5, rowH);
      ctx.fillRect(x0, r * rowH, w, 1.5);
    }
  }

  /* Roughness follows the grain: darker grain sits slightly rougher. */
  const img = ctx.getImageData(0, 0, S, S);
  const out = rough.ctx.createImageData(S, S);
  const lo = opts.roughLo == null ? 118 : opts.roughLo;
  const hi = opts.roughHi == null ? 178 : opts.roughHi;
  for (let i = 0; i < img.data.length; i += 4) {
    const l = (img.data[i] + img.data[i + 1] + img.data[i + 2]) / 765;
    const v = mix(hi, lo, l);
    out.data[i] = out.data[i + 1] = out.data[i + 2] = v;
    out.data[i + 3] = 255;
  }
  rough.ctx.putImageData(out, 0, 0);
  return { color: board.c, rough: rough.c };
}

/* --- Marble / granite -----------------------------------------------------
   Veins are ridged noise: 1 - |2n-1|, then sharpened. Plain fbm gives clouds;
   the ridge is what makes a vein read as a fracture instead of a smudge. */
function stone(base, vein, opts) {
  opts = opts || {};
  const S = 1024;
  const col = makeCanvas(S);
  const rgh = makeCanvas(S);
  const img = col.ctx.createImageData(S, S);
  const out = rgh.ctx.createImageData(S, S);
  const scale = opts.scale || 3.2;
  const sharp = opts.sharp || 9;
  const grain = opts.grain || 0;
  const rBase = opts.roughBase == null ? 40 : opts.roughBase;
  const rVein = opts.roughVein == null ? 78 : opts.roughVein;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = (x / S) * scale, v = (y / S) * scale;
      /* Warp the field so veins run diagonally instead of on a grid. */
      const w = fbm(u * 0.7 + 4, v * 0.7, 91, 3);
      const n = fbm(u + w * 1.6, v * 2.4 + w * 2.2, 13, 5);
      let t = Math.pow(1 - Math.abs(n * 2 - 1), sharp);
      if (grain) t = Math.max(t, hash(x, y, 3) * grain);
      const i = (y * S + x) * 4;
      img.data[i]     = mix(base[0], vein[0], t);
      img.data[i + 1] = mix(base[1], vein[1], t);
      img.data[i + 2] = mix(base[2], vein[2], t);
      img.data[i + 3] = 255;
      const r = mix(rBase, rVein, t);
      out.data[i] = out.data[i + 1] = out.data[i + 2] = r;
      out.data[i + 3] = 255;
    }
  }
  col.ctx.putImageData(img, 0, 0);
  rgh.ctx.putImageData(out, 0, 0);
  return { color: col.c, rough: rgh.c };
}

/* --- Microcement / plaster ------------------------------------------------ */
function cement(base, opts) {
  opts = opts || {};
  const S = 512;
  const col = makeCanvas(S);
  const rgh = makeCanvas(S);
  const img = col.ctx.createImageData(S, S);
  const out = rgh.ctx.createImageData(S, S);
  const strength = opts.strength == null ? 26 : opts.strength;
  const baseRough = opts.rough == null ? 205 : opts.rough;

  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const n = fbm((x / S) * 7, (y / S) * 7, 57, 4) - 0.5;
      const fine = (hash(x, y, 9) - 0.5) * 0.35;
      const d = (n + fine) * strength;
      const i = (y * S + x) * 4;
      img.data[i]     = base[0] + d;
      img.data[i + 1] = base[1] + d;
      img.data[i + 2] = base[2] + d;
      img.data[i + 3] = 255;
      const r = baseRough + d * 0.7;
      out.data[i] = out.data[i + 1] = out.data[i + 2] = r;
      out.data[i + 3] = 255;
    }
  }
  col.ctx.putImageData(img, 0, 0);
  rgh.ctx.putImageData(out, 0, 0);
  return { color: col.c, rough: rgh.c };
}

/* --- Catalogue ------------------------------------------------------------
   Deliberately the vocabulary a Turkish kitchen or interior firm already uses
   with its own customers: lake, membran, akrilik, kompakt lamine. */
let cache = null;

export function materials() {
  if (cache) return cache;

  const oak     = wood([196, 158, 112], [104, 68, 36], { rows: 7 });
  const walnut  = wood([116, 76, 50], [48, 26, 14], { rows: 7, roughLo: 128, roughHi: 186 });
  const marble  = stone([238, 236, 232], [150, 152, 156], { scale: 2.4, sharp: 7, roughBase: 26, roughVein: 60 });
  const granite = stone([38, 38, 41], [128, 128, 134], { scale: 6.0, sharp: 3, grain: 0.22, roughBase: 34, roughVein: 66 });
  const micro   = cement([172, 168, 162], { strength: 20, rough: 208 });
  const plaster = cement([236, 232, 226], { strength: 10, rough: 224 });

  const T = (set, rep) => ({
    map: toTexture(set.color, rep, true),
    roughnessMap: toTexture(set.rough, rep, false)
  });

  cache = {
    floor: {
      oak:    Object.assign(T(oak,    [3.0, 3.0]), { metalness: 0.0, roughness: 0.62 }),
      walnut: Object.assign(T(walnut, [3.0, 3.0]), { metalness: 0.0, roughness: 0.66 }),
      marble: Object.assign(T(marble, [1.6, 1.6]), { metalness: 0.0, roughness: 0.16 }),
      micro:  Object.assign(T(micro,  [4.0, 4.0]), { metalness: 0.0, roughness: 0.78 })
    },
    counter: {
      marble:  Object.assign(T(marble,  [3.2, 1.1]), { metalness: 0.0,  roughness: 0.14 }),
      granite: Object.assign(T(granite, [3.2, 1.1]), { metalness: 0.05, roughness: 0.22 }),
      oak:     Object.assign(T(oak,     [2.6, 0.9]), { metalness: 0.0,  roughness: 0.52 }),
      compact: Object.assign(T(micro,   [3.0, 1.0]), { metalness: 0.0,  roughness: 0.46, color: 0x4a4a4e })
    },
    /* The splashback needs its OWN texture instances, not just its own
       material: a texture's repeat lives on the texture, so sharing the
       worktop's maps would stretch the same veins up the wall and the eye
       reads that immediately as wallpaper. */
    splash: {
      marble:  Object.assign(T(marble,  [3.2, 0.55]), { metalness: 0.0,  roughness: 0.16 }),
      granite: Object.assign(T(granite, [3.2, 0.55]), { metalness: 0.05, roughness: 0.24 }),
      oak:     Object.assign(T(oak,     [2.6, 0.45]), { metalness: 0.0,  roughness: 0.54 }),
      compact: Object.assign(T(micro,   [3.0, 0.5]),  { metalness: 0.0,  roughness: 0.48, color: 0x4a4a4e })
    },
    front: {
      lakeWhite:   { color: 0xf2f0ec, metalness: 0.02, roughness: 0.10, clearcoat: 1.00 },
      lakeAnthra:  { color: 0x34363a, metalness: 0.04, roughness: 0.12, clearcoat: 1.00 },
      membraneWal: Object.assign(T(walnut, [0.9, 0.9]), { metalness: 0.0, roughness: 0.58, clearcoat: 0.0 }),
      acrylicGrey: { color: 0x8d9096, metalness: 0.10, roughness: 0.18, clearcoat: 0.60 }
    },
    plaster: T(plaster, [2.0, 2.0])
  };
  return cache;
}
