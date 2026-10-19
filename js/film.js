/* ==========================================================================
   Scroll-scrubbed film (the Larisel home page's copy of the studio's player)
   --------------------------------------------------------------------------
   Home-page additions: an AUTOPLAY opening (film.json "autoplay": the first
   N frames play on a clock once the loader lifts — the mark writes itself
   without waiting for a scroll — and the scroll timeline starts where it
   ends), the loader counting real frame downloads, and chapters that live in
   another project (a chapter "dir" may be an absolute path: the café chapter
   is played straight from /cafe-3d/, so the two sites can never drift apart).
   The page holds SEVERAL films (one per project, data-film="<id>"): only the
   first owns the loader and the autoplay; the others measure themselves at
   once (so the page never jumps) and wake their GPU and downloads only when
   the reader is within a screen and a half of them. The header's colour is
   decided by whichever film covers the middle of the screen.

   A rendered frame sequence drawn by WebGL. Scroll position picks a point on
   the film's timeline; the two frames either side of that point are blended
   by the fractional part, so a slow scroll glides instead of stepping from
   one still to the next.

   The film is a list of CHAPTERS, each encoded on its own (frames, atlas,
   manifest), so re-rendering one chapter never touches the others. To the
   playhead they are one continuous take: frame indices run straight through.

   Sharp, always. Two layers:
   · FULL frames — sharp, decoded on demand. What the screen shows is always
     one of these once the film has started: the pair under the playhead when
     it is decoded, else the nearest decoded frames either side of it (a few
     frames off, never soft). A fast scroll decodes along the way on a stride
     (every 2nd or 3rd frame) so the picture keeps moving at full resolution,
     and the playhead never runs past frames that have not arrived: on a first
     visit a flick that outruns the network is followed a moment behind,
     sharp. (The first version fell back to the atlas whenever decoding fell
     behind; on a phone a fast scroll showed its 144 x 256 cells blown up to
     the full screen — a mosaic, seen in a phone's screen recording.)
   · ATLAS — a whole chapter, small, on one sheet (~400 KB): only for a cut
     (an anchor, a reload mid-film) into frames that are not here yet, and
     filtered soft (a lens slightly out of focus, not a mosaic) until the
     sharp frames fade in.

   Memory is the real constraint. A decoded 1920x1080 frame is 8.3 MB and an
   uploaded atlas 20-35 MB, so full frames stay COMPRESSED (Blob) once
   downloaded, only a window around the playhead is decoded (ImageBitmap,
   LRU), and only the atlases of the chapter under the playhead and the one
   the reader is heading for live on the GPU.
   ========================================================================== */

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uA;
uniform sampler2D uB;
uniform sampler2D uAtlasA;   /* the two frames of a pair can sit in different chapters */
uniform sampler2D uAtlasB;
uniform float uMix;       /* between the two sharp frames */
uniform float uMixLo;     /* between the two atlas cells (not always the same pair) */
uniform float uHi;
uniform float uTime;
uniform float uGrain;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform vec4 uCellA;      /* col, row, 1/cols, 1/rows */
uniform vec4 uCellB;
uniform vec2 uInset;      /* half a texel of one cell, so cells never bleed */
uniform float uVig;       /* vignette; 0 on the last frames, which must equal the page */
uniform vec2 uTexel;      /* one texel of a full frame */
uniform float uSharp;     /* 0 at 1:1 or smaller, up to 0.6 when a frame is shown 2x */
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
vec3 frame(vec2 p) { return mix(texture2D(uA, p).rgb, texture2D(uB, p).rgb, uMix); }
vec2 cell(vec2 uv, vec4 c) {
  uv = clamp(uv, uInset, 1.0 - uInset);
  return vec2((c.x + uv.x) * c.z, (c.y + uv.y) * c.w);
}
/* an atlas cell is shown many times its size: a 3x3 binomial over one of its
   texels turns the bilinear mosaic into an even softness */
vec3 soft(sampler2D s, vec2 uv, vec4 c) {
  vec2 t = uInset * 2.0;
  vec3 m = texture2D(s, cell(uv, c)).rgb * 4.0;
  m += (texture2D(s, cell(uv + vec2(t.x, 0.0), c)).rgb + texture2D(s, cell(uv - vec2(t.x, 0.0), c)).rgb
      + texture2D(s, cell(uv + vec2(0.0, t.y), c)).rgb + texture2D(s, cell(uv - vec2(0.0, t.y), c)).rgb) * 2.0;
  m += texture2D(s, cell(uv + t, c)).rgb + texture2D(s, cell(uv - t, c)).rgb
     + texture2D(s, cell(uv + vec2(t.x, -t.y), c)).rgb + texture2D(s, cell(uv + vec2(-t.x, t.y), c)).rgb;
  return m / 16.0;
}
void main() {
  vec2 uv = vUv * uScale + uOffset;
  uv.y = 1.0 - uv.y;                                   /* bitmaps are top-down */
  vec3 c = vec3(0.0);
  if (uHi < 1.0) c = mix(soft(uAtlasA, uv, uCellA), soft(uAtlasB, uv, uCellB), uMixLo);
  if (uHi > 0.0) {
    vec3 hi = frame(uv);
    if (uSharp > 0.0) {
      /* Contrast-adaptive sharpening (after AMD FidelityFX CAS). A 1080p frame
         on a 1440p/4K screen is stretched by bilinear filtering and goes soft;
         this gives back the crispness, strongest where local contrast is low
         and backing off at edges that are already hard, so no halos. */
      vec3 n = frame(uv - vec2(0.0, uTexel.y)), s = frame(uv + vec2(0.0, uTexel.y));
      vec3 w = frame(uv - vec2(uTexel.x, 0.0)), e = frame(uv + vec2(uTexel.x, 0.0));
      vec3 mn = min(min(min(n, s), min(w, e)), hi);
      vec3 mx = max(max(max(n, s), max(w, e)), hi);
      vec3 amp = sqrt(clamp(min(mn, 1.0 - mx) / max(mx, vec3(1e-4)), 0.0, 1.0));
      vec3 wgt = amp * (-1.0 / mix(8.0, 5.0, uSharp));
      hi = clamp((hi + wgt * (n + s + w + e)) / (1.0 + 4.0 * wgt), 0.0, 1.0);
    }
    c = mix(c, hi, uHi);
  }
  vec2 d = vUv - 0.5;
  c *= 1.0 - dot(d, d) * uVig;                         /* vignette */
  c += (hash(gl_FragCoord.xy + fract(uTime) * 91.0) - 0.5) * uGrain;
  gl_FragColor = vec4(c, 1.0);
}`;

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
const BITMAP = { premultiplyAlpha: "none", colorSpaceConversion: "none" };

/* -------------------------------------------------------------- frame store */
class FrameStore {
  constructor(count, urlOf, maxDecoded, packOf = null) {
    this.count = count;
    this.urlOf = urlOf;
    /* packOf(i): the pack holding frame i ({ url, first, sizes, type }) or
       null. Ten frames per request: on a link where every request waits
       ~0.34 s for its first byte, single frames arrived at ~15 a second and a
       reader in chapter 2 met mostly atlas (measured on the live site). */
    this.packOf = packOf;
    this.failed = new Set();           /* packs that did not arrive: their frames come one by one */
    this.blobs = new Array(count);
    this.gotAt = new Float64Array(count);   /* when each frame arrived: "late" means late after arriving */
    this.asked = new Uint8Array(count);
    this.bitmaps = new Map();          /* index -> ImageBitmap, insertion order = LRU */
    this.pending = new Map();          /* index -> Promise while decoding */
    this.maxDecoded = maxDecoded;
    this.maxPending = 3;               /* the pair under the playhead must never queue behind lookahead */
    this.loaded = 0;
    this.bytes = 0;
    this.decodeMs = [];
    this.focus = 0;                    /* playhead, set by the film every frame */
    this.dir = 1;
    this.far = -1;                     /* where the reader is when the playhead lags far behind: every other download goes there */
    this.flip = 0;
    this.rx = [];                      /* [when, bytes] of every arrival: the link's real speed (rate()) */
    this.limit = 6;                    /* downloads at once (workers past it wait): the film opens with 2 */
    /* A frame that failed is asked for again after a pause (twice more); one that
       still fails is DEAD: the playhead may pass it (reach() would otherwise stop
       the film at it for good) and it is retried once anything arrives again. */
    this.fails = new Uint8Array(count);
    this.dead = new Set();
    this.failT = 0;                    /* when a download last failed: the link is not judged across a drop */
    this.t0 = 0;
    this.onNear = null;                /* a frame near the playhead arrived: the film wakes to decode it */
    this.gen = 0;                      /* bumped by reset(): work started before it is thrown away */
    this.dgen = 0;                     /* bumped when decoded frames are released: only decodes are thrown away */
  }

  /* Another encoding of the same frames (the quality tier dropped): fetch the
     new one from the playhead. What is already here stays until its frame in
     the new encoding replaces it — the same pictures, only larger — so the
     switch never leaves the screen without a sharp frame (it used to drop
     everything, and the film fell to the atlas mid-scroll: measured). */
  reset() {
    this.gen++;
    this.rx = []; this.t0 = 0;
    this.asked = new Uint8Array(this.count);
    this.fails = new Uint8Array(this.count); this.dead.clear();
    this.failed.clear();
    this.pending.clear();             /* decodes in flight belong to the old generation: they close themselves */
    this.loaded = 0; this.bytes = 0; this.decodeMs = [];
    this.download();
  }

  /* Download outward from the reader, ahead of them first. The atlas already
     covers every frame, so what is worth bandwidth is sharpness where the
     reader is about to be, not a coarse pass over a film they may never reach. */
  next() {
    const from = this.far >= 0 && (this.flip++ & 1) ? this.far : this.focus;
    let best = -1, bestD = Infinity;
    for (let i = 0; i < this.count; i++) {
      if (this.asked[i]) continue;
      const ahead = (i - from) * this.dir;
      const d = ahead >= 0 ? ahead : -ahead * 2.5;
      if (d < bestD) { bestD = d; best = i; }
    }
    return best;
  }

  /* bytes a second over the last `win` ms of downloading (packs overlap: wall-clock) */
  rate(win = 4000) {
    const now = performance.now(), from = Math.max(this.t0, now - win);
    let b = 0;
    for (const [t, size] of this.rx) if (t >= from) b += size;
    return b / Math.max(0.5, (now - from) / 1000);
  }

  download() {
    const gen = this.gen;
    if (!this.t0) this.t0 = performance.now();
    const worker = async (w) => {
      for (;;) {
        /* six packs at once share the link six ways: on a slow one the opening's
           own frames then arrived last (measured). While the film opens, two. */
        while (w >= this.limit && gen === this.gen) await new Promise((r) => setTimeout(r, 120));
        const i = this.next();
        if (i < 0 || gen !== this.gen) return;
        const pk = this.packOf ? this.packOf(i) : null;
        if (pk && !this.failed.has(pk.url)) {
          pk.sizes.forEach((_, k) => { this.asked[pk.first + k] = 1; });
          try {
            const r = await fetch(pk.url);
            if (!r.ok) throw new Error(r.status);
            const buf = await r.arrayBuffer();
            if (gen !== this.gen) return;
            this.rx.push([performance.now(), buf.byteLength]);
            let off = 0;
            pk.sizes.forEach((size, k) => {
              this.got(pk.first + k, new Blob([new Uint8Array(buf, off, size)], { type: pk.type }));
              off += size;
            });
          } catch (e) {
            if (gen !== this.gen) return;
            /* the pack is lost, the frames are not: fetch them one by one */
            this.failed.add(pk.url);
            this.failT = performance.now();
            pk.sizes.forEach((_, k) => { if (!this.blobs[pk.first + k]) this.asked[pk.first + k] = 0; });
            await new Promise((r) => setTimeout(r, 400));     /* a dropped link must not burn through every pack in a moment */
          }
          continue;
        }
        this.asked[i] = 1;
        try {
          const r = await fetch(this.urlOf(i));
          if (!r.ok) throw new Error(r.status);
          const blob = await r.blob();
          if (gen !== this.gen) return;
          this.rx.push([performance.now(), blob.size]);
          this.got(i, blob);
        } catch (e) {
          if (gen !== this.gen) return;
          this.failT = performance.now();
          const f = ++this.fails[i];
          if (f < 3) setTimeout(() => { if (gen === this.gen && !this.blobs[i]) this.asked[i] = 0; }, 800 * f);
          else this.dead.add(i);
          await new Promise((r) => setTimeout(r, 400));
        }
      }
    };
    for (let k = 0; k < 6; k++) worker(k);
  }

  got(i, blob) {
    this.blobs[i] = blob;
    this.dead.delete(i);
    if (this.dead.size) {                /* the link is back: the frames given up on are asked for again */
      for (const d of this.dead) { this.asked[d] = 0; this.fails[d] = 0; }
      this.dead.clear();
    }
    this.gotAt[i] = performance.now();
    this.loaded++;
    this.bytes += blob.size;
    /* the film's loop sleeps when nothing moves; frames that arrive after it
       fell asleep would wait, undecoded, for the first scroll — which then
       showed the atlas (measured: the film's opening) */
    if (this.onNear && Math.abs(i - this.focus) <= 8) this.onNear();
  }

  get(i) {
    const b = this.bitmaps.get(i);
    if (b) { this.bitmaps.delete(i); this.bitmaps.set(i, b); }   /* touch */
    return b || null;
  }

  /* `urgent` decodes are the frames on screen: they may exceed the pending cap */
  decode(i, urgent) {
    if (i < 0 || i >= this.count || this.bitmaps.has(i) || this.pending.has(i) || !this.blobs[i]) return;
    if (!urgent && this.pending.size >= this.maxPending) return;
    const t = performance.now(), gen = this.gen, dg = this.dgen;
    const p = createImageBitmap(this.blobs[i], BITMAP)
      .then((bmp) => {
        if (gen !== this.gen || dg !== this.dgen) { bmp.close(); return; }
        this.pending.delete(i);
        this.decodeMs.push(performance.now() - t);
        if (this.decodeMs.length > 30) this.decodeMs.shift();
        this.bitmaps.set(i, bmp);
        while (this.bitmaps.size > this.maxDecoded) {
          const [old, ob] = this.bitmaps.entries().next().value;
          this.bitmaps.delete(old);
          ob.close();
        }
      })
      .catch(() => { if (gen === this.gen && dg === this.dgen) this.pending.delete(i); });
    this.pending.set(i, p);
  }
}

/* -------------------------------------------------------------- renderer */
class GLRenderer {
  constructor(canvas) {
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) throw new Error("no webgl");
    this.gl = gl;
    const sh = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);
    this.u = {};
    for (const n of ["uA", "uB", "uAtlasA", "uAtlasB", "uMix", "uMixLo", "uHi", "uTime", "uGrain", "uScale", "uOffset", "uCellA", "uCellB", "uInset", "uVig", "uTexel", "uSharp"]) {
      this.u[n] = gl.getUniformLocation(prog, n);
    }
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    this.tex = [this.makeTex(0), this.makeTex(1)];
    this.held = [-1, -1];             /* frame index currently in each full-frame texture */
    this.blank = this.makeTex(2);
    this.bound = [this.blank, null];  /* texture on atlas units 2 and 3 */
    this.bindAtlas(3, null);
    gl.uniform1i(this.u.uA, 0);
    gl.uniform1i(this.u.uB, 1);
    gl.uniform1i(this.u.uAtlasA, 2);
    gl.uniform1i(this.u.uAtlasB, 3);
    this.atlases = new Map();         /* chapter -> { tex, meta } */
    this.frameW = 16; this.frameH = 9;
  }

  makeTex(unit) {
    const gl = this.gl;
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    return t;
  }

  /* A 4096-wide atlas is 20-35 MB of texels. Uploaded in one call it blocked
     a 4x-throttled phone for ~60 ms, mid-scroll, at every chapter crossing
     (measured). So: decode once off-thread, allocate the texture empty, and
     fill it one 256-row strip per animation frame (~4 MB each). The atlas
     only becomes usable when complete. */
  async addAtlasStriped(k, blob, meta, stillWanted) {
    const gl = this.gl;
    const W = meta.cols * meta.cw, H = meta.rows * meta.ch;
    const full = await createImageBitmap(blob, BITMAP);
    const tex = this.makeTex(4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    try {
      for (let y = 0; y < H; y += 256) {
        const strip = await createImageBitmap(full, 0, y, W, Math.min(256, H - y), BITMAP);
        await new Promise((r) => requestAnimationFrame(r));
        if (!stillWanted()) { strip.close(); gl.deleteTexture(tex); return false; }
        gl.activeTexture(gl.TEXTURE4);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, y, gl.RGBA, gl.UNSIGNED_BYTE, strip);
        strip.close();
      }
    } finally { full.close(); }
    this.atlases.set(k, { tex, meta });
    gl.uniform2f(this.u.uInset, 0.5 / meta.cw, 0.5 / meta.ch);
    return true;
  }

  dropAtlas(k) {
    const at = this.atlases.get(k);
    if (!at) return;
    this.gl.deleteTexture(at.tex);    /* deleting also unbinds it from units 2/3 */
    this.atlases.delete(k);
    this.bound = this.bound.map((t) => (t === at.tex ? null : t));
  }

  bindAtlas(unit, at) {
    const tex = at ? at.tex : this.blank;
    if (this.bound[unit - 2] === tex) return;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    this.bound[unit - 2] = tex;
  }

  /* off screen: the two full frames (~8 MB each in HD) go back to 1x1. Safe —
     a slot is only sampled again after show() has uploaded into it. */
  shrinkFrames() {
    const gl = this.gl;
    for (let s = 0; s < 2; s++) {
      gl.activeTexture(gl.TEXTURE0 + s); gl.bindTexture(gl.TEXTURE_2D, this.tex[s]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    }
    this.held = [-1, -1];
  }

  upload(slot, index, bmp) {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D, this.tex[slot]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bmp);   /* RGBA: the bitmap's own layout, no CPU repack */
    this.held[slot] = index;
  }

  /* Put frame a in slot 0 and b in slot 1, re-using what is already on the
     GPU. Moving forward by one frame is a swap plus ONE upload, not two. */
  show(a, bmpA, b, bmpB) {
    if (b === a) {                    /* one frame on its own: slot 0, and the mix stays on it */
      if (this.held[0] === a) return;
      if (this.held[1] === a) { this.swap(); return; }
      this.upload(0, a, bmpA);
      return;
    }
    if (this.held[1] === a && this.held[0] !== a) this.swap();
    if (this.held[0] !== a) this.upload(0, a, bmpA);
    if (this.held[1] !== b) this.upload(1, b, bmpB);
  }

  swap() {
    this.tex.reverse(); this.held.reverse();
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.tex[0]);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, this.tex[1]);
  }

  cellOf(at, local) {
    if (!at) return [0, 0, 1, 1];
    const m = at.meta;
    return [local % m.cols, Math.floor(local / m.cols), 1 / m.cols, 1 / m.rows];
  }

  /* atA/atB: the atlas of each frame's chapter; la/lb: index inside it */
  draw(atA, la, atB, lb, mixLo, mix, hi, time, grain, cw, ch, vig = 0.55) {
    const gl = this.gl;
    gl.viewport(0, 0, cw, ch);
    /* object-fit: cover, done in the shader */
    const fa = this.frameW / this.frameH, ca = cw / ch;
    let sx = 1, sy = 1;
    if (ca > fa) sy = fa / ca; else sx = ca / fa;
    gl.uniform2f(this.u.uScale, sx, sy);
    gl.uniform2f(this.u.uOffset, (1 - sx) / 2, (1 - sy) / 2);
    /* how many screen pixels one frame pixel covers (cover-fit): sharpen only
       what is being enlarged, in proportion */
    const up = Math.max(cw / this.frameW, ch / this.frameH);
    gl.uniform1f(this.u.uSharp, Math.min(0.6, Math.max(0, (up - 1.05) * 0.63)));
    gl.uniform2f(this.u.uTexel, 1 / this.frameW, 1 / this.frameH);
    this.bindAtlas(2, atA);
    this.bindAtlas(3, atB);
    gl.uniform4fv(this.u.uCellA, this.cellOf(atA, la));
    gl.uniform4fv(this.u.uCellB, this.cellOf(atB, lb));
    gl.uniform1f(this.u.uMix, mix);
    gl.uniform1f(this.u.uMixLo, mixLo);
    gl.uniform1f(this.u.uHi, hi);
    gl.uniform1f(this.u.uTime, time);
    gl.uniform1f(this.u.uGrain, grain);
    gl.uniform1f(this.u.uVig, vig);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

/* -------------------------------------------------------------- film */
/* the header follows the film under the middle of the screen (several films set
   their own mode; the last writer must not win) */
const MODES = new Map();
function arbitrate() {
  const html = document.documentElement, mid = innerHeight / 2;
  let m = "";
  for (const [el, mode] of MODES) {
    const r = el.getBoundingClientRect();
    if (r.top <= mid && r.bottom >= mid) { m = mode; break; }
  }
  if (html.dataset.film !== m) html.dataset.film = m;
}
addEventListener("scroll", arbitrate, { passive: true });

/* One screen, in pixels, that a phone's sliding toolbars do not change. The
   film's length is written in vh (the large viewport); innerHeight grows and
   shrinks as the toolbar slides away, and every playhead sum made with it
   moved the film by the toolbar's share of the whole film, mid-scroll. */
let ruler = null;
const screenH = () => {
  if (!ruler) {
    ruler = document.createElement("div");
    ruler.setAttribute("aria-hidden", "true");
    ruler.style.cssText = "position:absolute;left:0;top:0;width:0;height:100vh;visibility:hidden;pointer-events:none";
    document.body.appendChild(ruler);
  }
  return ruler.offsetHeight || innerHeight;
};

/* resolves once el is within `screens` screens of the viewport */
const near = (el, screens = 1.5) => new Promise((done) => {
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); done(); } },
    { rootMargin: `${screens * 100}% 0px` });
  io.observe(el);
});

export async function mountFilm(root, primary = true) {
  const id = root.dataset.film || "main";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const params = new URLSearchParams(location.search);
  const filmUrl = new URL(root.dataset.manifest, location.href);
  const intro = (primary && (window.LRIntro || window.FilmIntro)) || { progress() {}, done() {} };   /* js/home.js: the loader (first film only) */
  const film = await (await fetch(filmUrl)).json();
  intro.progress(0.15);
  /* the chapter manifests carry film.json's version (?v=): a manifest cached
     from before a re-encode would slice the new frame packs with the old
     frame sizes and every frame would fail to decode */
  const mv = filmUrl.search;
  /* ?m=<file> loads an alternative manifest in every chapter folder — used to
     compare encodings (WebP vs AVIF decode time) on a real device. */
  const alt = params.get("m");
  const aspect = innerHeight > innerWidth ? "9x16" : "16x9";
  /* Two encodings of every chapter. HD (manifest-hd.json: the renders' own
     1920x1080 / 1080x1920) where the screen has more pixels than the light
     set (1600x900 / 720x1280) — a 1440p or 4K monitor, any modern phone — and
     the light set where it would only be shrunk again (shrinking a sharper
     frame makes fine grain shimmer) or where the reader asked to save data
     or is on a slow link. ?q=hd / ?q=lite force one. */
  const dprCap = Math.min(devicePixelRatio || 1, 2);
  const sw = innerWidth * dprCap, sh = innerHeight * dprCap;
  const need = aspect === "9x16" ? Math.max(sw, sh * 9 / 16) : Math.max(sw, sh * 16 / 9);
  const conn = navigator.connection || {};
  /* Only what the reader asked for (Save-Data) or a 2g link is decided here.
     Chrome's effectiveType turns "3g" on round-trip time alone (a 16 Mbit link
     behind a VPN read as 3g), and its downlink is ~1.5 Mbit before it has
     measured anything; the real test is the first atlas download below. */
  const slow = !!conn.saveData || /2g$/.test(conn.effectiveType || "");
  const forced = params.get("q");
  /* a phone that reports under 6 GB starts light (most budget Androids); the
     rest start HD and the quality guard below catches the slow ones */
  const weak = aspect === "9x16" && navigator.deviceMemory && navigator.deviceMemory < 6;
  const hd = forced === "hd" || (forced !== "lite" && !slow && !weak && need > (aspect === "9x16" ? 800 : 1700));
  const chName = alt && /^[\w.-]+\.json$/.test(alt) ? alt : hd ? "manifest-hd.json" : "manifest.json";
  const chapters = await Promise.all(film.chapters.map(async (c) => {
    const dir = new URL(c.dir, filmUrl);
    /* the ?m= comparison set may exist for one chapter only: fall back */
    let r = await fetch(new URL(chName + mv, dir));
    if (!r.ok && chName !== "manifest.json") r = await fetch(new URL("manifest.json" + mv, dir));
    const m = await r.json();
    return { dir, v: m.variants[aspect], count: m.frames, first: 0, q: m.rev ? `?r=${m.rev}` : "" };
  }));
  let n = 0;
  for (const c of chapters) { c.first = n; n += c.count; }
  const chOf = (i) => { let k = chapters.length - 1; while (k > 0 && i < chapters[k].first) k--; return k; };
  /* Scroll per frame can differ by chapter (film.json "vh"): a chapter that
     got more frames than its motion needs moves the picture less per frame,
     so it gets less scroll per frame and every chapter keeps the same pace
     under the wheel. vhAt / frameAt convert between frame and scroll (in vh). */
  film.chapters.forEach((src, k) => { chapters[k].vh = src.vh || film.vhPerFrame; });
  const stepsOf = (k) => chapters[k].count - (k === chapters.length - 1 ? 1 : 0);
  const vhAt = (f) => chapters.reduce((s, c, k) => s + c.vh * Math.min(Math.max(f - c.first, 0), stepsOf(k)), 0);
  const frameAt = (v) => {
    for (let k = 0; k < chapters.length; k++) {
      const c = chapters[k], len = c.vh * stepsOf(k);
      if (v <= len) return c.first + v / c.vh;
      v -= len;
    }
    return n - 1;
  };
  /* The autoplay opening is not on the scroll: the timeline starts at its
     last frame, so the first wheel notch continues the film from there. */
  const AUTO = Math.min(n - 1, film.autoplay || 0);
  const AUTO_MS = film.autoplayMs || 4200;
  /* film.json "start": the scroll timeline begins at that frame and the ones
     before it are never shown. The armchair's first 12 frames were bare cream
     and the next 30 swing down onto the chair and pull back out of a blurred
     close-up (11-16 % of the picture changing per frame, against 0.6 once it
     stands): after the café that read as an empty page, then a smeared chair
     arriving all at once. It opens where the chair stands sharp and still
     (44), rising out of the page like the other films' first frames. */
  const START = Math.min(n - 1, Math.max(AUTO, film.start || 0));
  const vh0 = vhAt(START);
  const totalVh = Math.max(1, vhAt(n - 1) - vh0);
  const handoff = !!film.handoff;
  const ENTER = !!film.enterFade;
  /* film.json "enterHold": a film whose first frame is the plate above it (the hospital, born out of the
     studio's last frame). Rising into view, the two would show one picture twice, a screen apart; so the
     stage stays clear while its top climbs — the plate (fixed, the same frame) is what shows — and takes
     over the moment it reaches the top, where its frame lies exactly on the plate. Its type shade comes up
     over the first half screen after (the stop's own shade left with the words). */
  const HOLD_IN = !!film.enterHold;
  /* film.json "enterFeather" (a share of the screen): a film rising out of a night section whose first
     frame is not the night's own black (Kıtlax's warm dark) — faded in, its top edge still read as a
     straight line, 3 to 9 levels within 8 px (measured). Its top is feathered into the night instead: a
     ramp that shrinks to nothing as the film reaches the top of the screen. */
  const FEATHER = ENTER ? +film.enterFeather || 0 : 0;
  /* the hold: the last frame stays while the film fades onto its plate (the
     same picture). 45vh of it was a wheel flick in which nothing on screen
     changed, and the stop's labels waited behind it (measured, deadzone.mjs). */
  const HOLD_VH = handoff ? film.holdVh || 12 : 0;
  /* a film shot in a bright studio is "light": dark type, no
     dark vignette on its edges, finer grain (film.json tone / vignette / grain) */
  const TONE = film.tone === "light" ? "light" : "dark";
  const VIG = typeof film.vignette === "number" ? film.vignette : 0.55;
  const GRAIN = typeof film.grain === "number" ? film.grain : 0.045;
  /* a film whose light changes part-way flips its type at film.json "toneAt" (a
     fraction of its frames) to "toneTo" (default dark): an opening in the dark
     that turns into bright worlds says toneTo "light"
     flips its type at film.json "toneAt" (a fraction of its frames); a film
     that ends on a night frame rather than on the cream page says "endTone" */
  const TONE_AT = typeof film.toneAt === "number" ? film.toneAt : null;
  const TONE_TO = film.toneTo === "light" ? "light" : "dark";
  let day = false;
  const END_TONE = film.endTone === "dark" ? "dark" : "light";
  let night = false;
  root.style.height = `${(totalVh + HOLD_VH + 100).toFixed(1)}vh`;
  let tier = hd && chName === "manifest-hd.json" ? "hd" : "lite";
  /* swap every chapter to the light set (same frames, same atlas) */
  async function toLite() {
    tier = "lite";
    const lites = await Promise.all(chapters.map((c) => fetch(new URL("manifest.json" + mv, c.dir)).then((r) => r.json())));
    chapters.forEach((c, k) => { c.v = lites[k].variants[aspect]; c.q = lites[k].rev ? `?r=${lites[k].rev}` : ""; });
    renderer.frameW = chapters[0].v.w; renderer.frameH = chapters[0].v.h;
    renderer.held = [-1, -1];
  }
  const pad = (i) => String(i + 1).padStart(4, "0");
  const urlOf = (i) => {
    const c = chapters[chOf(i)];
    return new URL(`${c.v.path}${pad(i - c.first)}.${c.v.ext}${c.q}`, c.dir).href;
  };

  const stage = root.querySelector(".film__stage");
  const canvas = root.querySelector(".film__canvas");
  /* data-in / data-out are fractions of the beat's own chapter (data-ch,
     1-based), so retiming one chapter never moves another chapter's words */
  const beats = [...root.querySelectorAll("[data-in]")].filter((el) => {
    /* a beat for a chapter the manifest does not list (yet) stays hidden */
    return (parseInt(el.dataset.ch, 10) || 1) <= chapters.length;
  }).map((el) => {
    const c = chapters[(parseInt(el.dataset.ch, 10) || 1) - 1];
    const g = (x) => (vhAt(c.first + parseFloat(x) * (c.count - 1)) - vh0) / totalVh;
    return {
      el,
      ch: (parseInt(el.dataset.ch, 10) || 1) - 1,
      a: g(el.dataset.in),
      b: g(el.dataset.out),
      lines: [...el.querySelectorAll(".film__line > span")],
      rest: [...el.querySelectorAll(".film__label, .film__lead")],
    };
  });
  /* where a chapter link lands: the moment the chapter's first headline is
     fully in — not its first frame: chapter 4 opens from black, and a jump that
     lands on a black screen reads as broken. Asked at the moment of the click
     (the opening's list names every film): a film far down has not measured
     itself yet, and the films above it may have changed height since. */
  const jumpAt = (k) => {
    const bt = beats.find((x) => x.ch === k);
    return bt && bt.a > 0 ? bt.a + (bt.b - bt.a) * 0.3 : Math.max(0, vhAt(chapters[k].first) - vh0) / totalVh;
  };
  (window.__filmJumps ||= {})[id] = (k) => root.getBoundingClientRect().top + scrollY + jumpAt(k) * (totalVh / 100) * screenH() + 2;
  const html = document.documentElement;
  const setMode = (m) => { if (MODES.get(root) !== m) { MODES.set(root, m); arbitrate(); } };
  const still = () => {
    intro.done();
    root.classList.add("is-still");
    root.style.height = "";
    beats.forEach((bt, k) => bt.el.classList.toggle("is-on", k === 0));
    /* a page film's poster is its LAST frame (end-*.webp), so its words take the
       end's tone — the model's dusk read as a washed cream veil otherwise; the
       opening's poster is its written mark, in the film's own tone */
    const stillTone = root.classList.contains("film--page") ? END_TONE : TONE;
    root.classList.toggle("is-night", stillTone === "dark" && TONE === "light");
    new IntersectionObserver(([e]) => setMode(e.isIntersecting ? stillTone : "")).observe(root);
    /* nothing will hand over: what waits behind the film shows as it is */
    if (primary) window.__filmStill = true;
    window.dispatchEvent(new CustomEvent("film:still", { detail: { id } }));
  };

  if (reduced) { still(); return; }

  const fine = matchMedia("(pointer: fine)").matches;
  const mem = navigator.deviceMemory || 4;
  const packOf = (i) => {
    const c = chapters[chOf(i)], pk = c.v.pack;
    if (!pk) return null;
    const k = Math.floor((i - c.first) / pk.n);
    return {
      url: new URL(`${c.v.path}p${String(k).padStart(3, "0")}.bin${c.q}`, c.dir).href,
      first: c.first + k * pk.n,
      sizes: pk.sizes.slice(k * pk.n, (k + 1) * pk.n),
      type: `image/${c.v.ext}`,
    };
  };
  const store = new FrameStore(n, urlOf, fine ? 32 : mem >= 6 ? 20 : 12, packOf);
  let renderer = null;
  if (!primary) {
    /* measured and laid out already; the GPU and the network wait for the reader */
    const d0 = { start: root.getBoundingClientRect().top + scrollY + (totalVh / 100) * screenH(), aspect, handoff, id };
    d0.end = d0.start + (HOLD_VH / 100) * screenH();
    window.dispatchEvent(new CustomEvent("film:layout", { detail: d0 }));
    await near(root);
  }
  try { renderer = new GLRenderer(canvas); } catch (e) { still(); return; }
  renderer.frameW = chapters[0].v.w; renderer.frameH = chapters[0].v.h;

  /* Atlas sheets are small compressed files: fetched once and kept, so a
     chapter's GPU copy can be dropped and re-made without the network. */
  const sheets = new Array(chapters.length);
  const sheet = (k) => (sheets[k] ||= fetch(new URL(chapters[k].v.atlas.file + chapters[k].q, chapters[k].dir).href).then((r) => {
    if (!r.ok) throw new Error(r.status);
    return r.blob();
  }));
  let wanted = new Set([0]);
  /* frames start arriving (and calling store.onNear) while this function is
     still awaiting the loader — before kick()'s variables exist below; a kick
     then threw inside the download worker and pack 0 was refetched frame by frame */
  let booted = false;
  const making = new Set();
  const ensureAtlas = (k) => {
    if (k < 0 || k >= chapters.length || renderer.atlases.has(k) || making.has(k)) return;
    making.add(k);
    sheet(k)
      .then((blob) => renderer.addAtlasStriped(k, blob, chapters[k].v.atlas, () => wanted.has(k)))
      .then(() => kick())
      .catch(() => {})
      .finally(() => making.delete(k));
  };

  /* The first atlas comes first: once it is on the GPU the opening chapter can
     be scrubbed, before a single full frame has arrived. */
  try {
    intro.progress(0.3);
    const t0 = performance.now();
    const first = await sheet(0);
    intro.progress(0.75);
    /* The atlas is the first real download and both tiers share it, so its
       speed decides whether the HD set (~40% more bytes) can arrive in time.
       Under 5 Mbit: the light set, before a single frame is fetched. */
    const mbit = (first.size * 8) / 1e6 / Math.max(0.05, (performance.now() - t0) / 1000);
    if (tier === "hd" && !forced && mbit < 5) await toLite().catch(() => {});
    await renderer.addAtlasStriped(0, first, chapters[0].v.atlas, () => true);
    store.onNear = () => { if (booted) kick(); };
    store.limit = 2;
    store.download();
    /* The opening plays on its own, so its sharp frames must be here before
       it starts: the loader counts them (up to 60 — the rest arrive while the
       first play), and gives up waiting after 3.5 s (the atlas covers). */
    if (AUTO) {
      /* the frames it plays, from its first (not any frames: on a slow link
         those were the wrong ones) */
      const want = Math.min(AUTO + 1, 60), t1 = performance.now();
      await new Promise((done) => {
        const tick = () => {
          let got = 0;
          for (let i = 0; i < want; i++) if (store.blobs[i]) got++;
          const k = got / want;
          intro.progress(0.75 + 0.25 * k);
          if (k >= 1 || performance.now() - t1 > 5000) done(); else setTimeout(tick, 50);
        };
        tick();
      });
    }
    store.limit = 6;
    store.t0 = performance.now();      /* the link is judged on all six at work (netT below) */
    intro.done();
  } catch (e) { still(); return; }
  setTimeout(() => chapters.forEach((_, k) => sheet(k).catch(() => {})), 2500);

  /* The film is as long as its frames' scroll distances add up to. It may be
     followed by a HOLD (film.json "handoff"): the last frame stays while the
     film fades out over what the page shows behind it in the same pose (the
     film:layout event says where that happens). */
  const last = chapters[chapters.length - 1];

  let cw = 0, ch = 0, top = 0, span = 1, holdPx = 0, finShown = -1, featherShown = -1;
  const measure = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cw = Math.round(stage.clientWidth * dpr);
    ch = Math.round(stage.clientHeight * dpr);
    /* only a real size change may clear the canvas: an off-screen film is not
       redrawn until it is back (and came back with a black edge) */
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    const r = root.getBoundingClientRect();
    top = r.top + scrollY;
    const vhPx = screenH();
    span = Math.max(1, (totalVh / 100) * vhPx);
    holdPx = (HOLD_VH / 100) * vhPx;
    const detail = { start: top + span, end: top + span + holdPx, aspect, handoff, id };
    if (id === "main") window.__filmLayout = detail;
    (window.__filmLayouts ||= {})[id] = detail;
    window.dispatchEvent(new CustomEvent("film:layout", { detail }));
  };
  measure();
  addEventListener("resize", measure);
  /* the stops and captions above a film change height with the language, and
     again when that language's web fonts land a moment later: its top moves,
     and with it the playhead, the hold and the plate's timing. The page's own
     height is the one signal that catches every such change (measured: a phone
     switched to RU moved the films ~50 px, the late Cyrillic fonts another ~25). */
  if ("ResizeObserver" in window) {
    new ResizeObserver(measure).observe(root);
    new ResizeObserver(() => requestAnimationFrame(measure)).observe(document.body);
  }

  /* Chapters: every stop of the page along the foot of the opening — its own
     two chapters, each with its own progress line, then the four sites below.
     A click is a CUT (playing the film at fast-forward to get there would be
     the worst way to see it) to the moment the chapter's first headline is in
     (jumpAt); a site further down is reached through the page's fade (scroll.js),
     at its own film's first headline. */
  const chNav = root.querySelector(".film__chapters");
  const chBtns = chNav ? [...chNav.querySelectorAll("[data-chapter]")].filter((b) => +b.dataset.chapter < chapters.length) : [];
  if (chNav) {
    chNav.hidden = false;
    chBtns.forEach((b) => b.addEventListener("click", () => {
      /* a cut through the film's own night (scroll.js), lifted once the new moment is sharp
         (window.__filmSharp): gliding there would play the film at fast-forward */
      const y = window.__filmJumps[id](+b.dataset.chapter);
      if (window.__fadeJump) window.__fadeJump(y); else window.scrollTo({ top: y, behavior: "instant" });
    }));
    chNav.querySelectorAll("[data-goto]").forEach((b) => b.addEventListener("click", () => {
      const to = b.dataset.goto, jump = window.__filmJumps && window.__filmJumps[to];
      /* a work with no film of its own (the hospital): its first section */
      const el = document.querySelector(`[data-film="${to}"]`) || document.querySelector(`section[data-work="${to}"]`);
      if (!el && !jump) return;
      const y = jump ? jump(0) : el.getBoundingClientRect().top + scrollY + 2;
      if (window.__fadeJump) window.__fadeJump(y); else window.scrollTo({ top: y, behavior: "instant" });
    }));
  }
  let chShown = -1;
  const chPaint = (pos) => {
    if (!chNav) return;
    chBtns.forEach((b, k) => {
      const c = chapters[k];
      const p = Math.min(1, Math.max(0, (pos - c.first) / Math.max(1, c.count - 1)));
      b.style.setProperty("--p", p.toFixed(3));
    });
    const k = chOf(Math.floor(pos));
    if (k !== chShown) {
      chShown = k;
      chBtns.forEach((b, i) => { if (i === k) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
    }
  };

  /* Only run while the film is on screen. */
  let visible = true, releaseT = 0;
  /* Five films on one page: one that has left the screen gives back its GPU
     atlas and its decoded frames after a moment (the compressed frames stay,
     so coming back needs no download, only a decode) */
  const release = () => {
    if (visible) return;
    wanted = new Set();                /* an atlas still striping in sees it is unwanted and stops */
    for (const k of [...renderer.atlases.keys()]) renderer.dropAtlas(k);
    store.dgen++;                      /* decodes still in flight close themselves; downloads go on */
    for (const b of store.bitmaps.values()) b.close();
    store.bitmaps.clear(); store.pending.clear();
    renderer.shrinkFrames();
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    clearTimeout(releaseT);
    if (visible) kick(); else { setMode(""); releaseT = setTimeout(release, 2500); }
  }).observe(root);

  const hud = params.has("debug") ? root.querySelector(".film__hud") : null;
  if (hud) hud.hidden = false;
  const forceLo = params.has("lo");     /* debug: atlas only, to see the fallback layer */
  /* ?probe: per-frame log for an automated smoothness test */
  const probe = params.has("probe") ? { log: [], edges: chapters.slice(1).map((c) => c.first), get tier() { return tier; } } : null;
  if (probe && primary) window.__film = probe;      /* the opening film is measured; the lazy ones must not overwrite it */
  /* ?probe also lists every film's memory, to test the release above */
  if (probe) (window.__films ||= {})[id] = { get atlases() { return renderer.atlases.size; }, get decoded() { return store.bitmaps.size; }, get loaded() { return store.loaded; } };

  /* Touch scrolling is native and inertial, wheel scrolling is already eased
     by scroll.js — the frame still gets its own light easing so a flick reads
     as a camera move rather than a jump cut. */
  const RATE = fine ? 18 : 11;
  /* How fast the playhead may travel (frames a second): what the device can
     decode on a stride and keep sharp. A flick faster than this is followed a
     moment behind, as a camera that keeps its focus. */
  const VMAX = fine ? 180 : 140;
  /* A target that moves this many frames between two screen frames, at a speed
     no finger or wheel reaches (JUMPV frames a second), was not a scroll but a
     jump (an anchor, the chapter rail, a reload mid-film, a scrollbar drag):
     the film CUTS there. (By distance alone a busy phone's 120 ms frame during
     a hard fling read as a jump: measured, flick.mjs.)
     A playhead left far behind by a flick on a first visit (the network is
     slower than the finger) plays the gap out sharp; past FAR frames of lag
     half the downloads go to where the reader is, and past LEAP, once the
     reader's own moment is here and decoded, the film cuts to it — sharp.
     (Cutting to it before it had arrived put a phone's first fast flick on
     the atlas three ticks in four: measured.) */
  const CUT = 24, JUMPV = 900, FAR = 60, LEAP = 90;
  /* how far from the playhead a sharp frame may stand in for the one under it */
  const NEAR = 6;
  /* (an autoplay opening starts the playhead at its first frame, so the first
     downloads are the frames it plays — starting it at START sent them ahead
     of the opening, and a slow link showed the opening from the atlas) */
  const P0 = AUTO ? 0 : START;
  let shown = P0, lastT = performance.now(), running = false, fpsT = lastT, fpsN = 0, fps = 0, stageO = 1, endShown = -1;
  let vel = 0, lastTarget = P0, lastShown = P0, hi = 0, hiFrames = 0, loFrames = 0, ahead = 3, stride = 1, behind = 0;
  let sharpOn = -1, missT = 0, drawn = false;     /* the sharp frame on screen (-1: none); since when none was */
  let restT = 0, lastRaw = -1;     /* when the scroll last moved the playhead (a reader at rest gets a whole frame) */
  let cuts = 0, settled = 0, wasAuto = false;   /* false until the opening has played a frame: a reload deep in the page is a jump */                      /* cuts so far (js/sound.js skips what a cut passes over); ticks the target has held still */
  /* the furthest point from `from` toward `to` that downloaded frames can show (never back) */
  const reach = (from, to) => {
    if (to > from) {
      for (let i = Math.floor(from) + 1, e = Math.min(n - 1, Math.ceil(to)); i <= e; i++) if (!store.blobs[i] && !store.dead.has(i)) return Math.max(from, Math.min(to, i - 1));
    } else {
      for (let i = Math.ceil(from) - 1, e = Math.max(0, Math.floor(to)); i >= e; i--) if (!store.blobs[i] && !store.dead.has(i)) return Math.min(from, Math.max(to, i + 1));
    }
    return to;
  };
  /* The opening beat (data-in="0") must not wait for a scroll: a visitor who
     has not scrolled yet is exactly who needs the headline. It enters on a
     clock once the first frame is up, and leaves by scroll like every other. */
  let introT0 = 0, introP = 0, autoP = AUTO ? 0 : 1;
  /* Quality guard. The HD set is chosen by screen size, but a device can have
     the pixels without the speed: measured on a phone at a quarter of this
     desktop's CPU, 720x1280 frames played 100% sharp, 900x1600 only 29% —
     every frame upload cost the main thread more than a frame. So while the
     reader scrolls, count frames that ran long and sharp pairs that were
     downloaded but not ready in time; if either piles up, drop to the light
     set, once, and stay there. Forced tiers (?q=) are left alone. */
  const guard = { n: 0, slow: 0, late: 0, jumpT: 0 };
  const downgrade = async () => {
    tier = "lite";
    try { await toLite(); } catch (e) { return; }
    store.reset();
    kick();
  };
  /* The link, measured on the frames themselves (the atlas test above sees
     only a gross case: one small file is mostly latency). From 3 s into the
     download, if the HD set arrives at under NET_FPS frames a second, the light
     set takes over, once: a fast scroll then stays sharp and on time instead of
     sharper and seconds behind (a real phone's link measured ~2 MB/s with
     0.34 s to first byte: ~22 HD phone frames a second). */
  const NET_FPS = 40;
  const avgBytes = () => {
    let b = 0, f = 0;
    for (const c of chapters) if (c.v.pack) { b += c.v.pack.sizes.reduce((x, y) => x + y, 0); f += c.count; }
    return f ? b / f : 0;
  };
  const netT = setInterval(() => {
    if (tier !== "hd" || forced || store.loaded >= n || !store.t0) { if (tier !== "hd" || forced || store.loaded >= n) clearInterval(netT); return; }
    const since = performance.now() - store.t0;
    /* judged once six packs have landed (bytes count on arrival: earlier, the
       packs still in flight read as a dead link), or at 8 s whatever came */
    if (since < 3000 || (since < 8000 && store.rx.filter((x) => x[0] >= store.t0).length < 6)) return;
    if (performance.now() - store.failT < 4500) return;          /* a dropped link is not a slow one */
    const fps = store.rate() / Math.max(1, avgBytes());
    if (fps < NET_FPS) {
      clearInterval(netT);
      if (probe) probe.why = { net: +fps.toFixed(1), at: Math.round(since) };
      downgrade();
    } else if (since > 25000) clearInterval(netT);
  }, 1000);
  const INTRO_MS = 1300;

  let curtain = primary && html.classList.contains("is-loading");
  addEventListener("intro:lift", () => { curtain = false; kick(); });
  addEventListener("intro:done", () => { curtain = false; kick(); });

  function frame(now) {
    /* never negative: kick() stamps lastT with performance.now(), and the rAF
       time of the next frame is that frame's START, often a little earlier.
       A negative dt pushed the playhead backwards for one frame (to -0.19),
       found no frame there, dropped the sharp layer and faded it back in —
       a soft blink at the start of every scroll (measured, perf.mjs). */
    const rawDt = Math.max(0.001, (now - lastT) / 1000);
    const dt = Math.min(0.05, Math.max(0, (now - lastT) / 1000)) || 0.016;
    lastT = now;
    const p = Math.min(1, Math.max(0, (scrollY - top) / span));
    const hold = handoff ? Math.min(1, Math.max(0, (scrollY - top - span) / Math.max(1, holdPx))) : 0;
    /* the opening on its clock until the reader scrolls (a scroll during it
       takes over: the playhead eases on from wherever the pen had got to) */
    autoP = AUTO ? (introT0 ? Math.min(1, (now - introT0) / AUTO_MS) : 0) : 1;
    let target = frameAt(p * totalVh + vh0);
    const onAuto = autoP < 1 && scrollY - top < 2;
    if (onAuto) target = autoP * AUTO;
    /* At rest, on a whole frame: a playhead standing between two frames shows both at once, and on fast
       footage (the snack turning in the oil, 2.6 vh a frame) that is a double image (19.10). Once the scroll has
       held still for a moment the playhead eases on to the nearest frame — half a frame at most. */
    const rawTarget = target;
    if (Math.abs(rawTarget - lastRaw) > 0.002) restT = now;
    lastRaw = rawTarget;
    if (!onAuto && now - restT > 140) target = Math.round(target);
    const leap = Math.abs(target - lastTarget);
    settled = leap < 1 ? settled + 1 : 0;
    /* a cut: a jump, or a playhead far behind once the reader's own moment is
       here (in the hold, the film's end: the frame the page behind it matches) */
    /* (the reader taking over from the autoplay mid-way is no jump: the playhead
       eases on from where it had got to, through frames the opening decoded —
       the gap is up to the whole autoplay: here's 112 frames long, a scroll in
       its first second cut to frame 112 before it was decoded: the atlas. Only
       a take-over landing near where the scroll begins: a chapter link pressed
       during the opening is still a jump) */
    if ((leap > CUT && leap / rawDt > JUMPV && !(wasAuto && target < START + 60)) || ((Math.abs(target - shown) > LEAP || (hold > 0 && Math.abs(target - shown) > 1)) && store.bitmaps.has(Math.floor(target)))) {
      shown = lastShown = target; vel = 0; sharpOn = -1; cuts++; guard.jumpT = now;
    }
    lastTarget = target; wasAuto = onAuto;
    /* From a sharp picture the film moves on only through frames that have
       arrived; a playhead already among frames that have not (just after a cut)
       goes where the reader is. */
    const goal = store.blobs[Math.floor(shown)] ? reach(shown, target) : target;
    let step = (goal - shown) * (1 - Math.exp(-RATE * dt));
    const cap = VMAX * dt;
    step = Math.max(-cap, Math.min(cap, step));
    shown += step;
    if (Math.abs(goal - shown) < 0.002) shown = goal;
    vel += ((shown - lastShown) / dt - vel) * 0.3;            /* the playhead's own speed, frames a second, smoothed */
    lastShown = shown;

    const a = Math.floor(shown), b = Math.min(n - 1, a + 1), t = shown - a;
    chPaint(shown);
    if (chNav) chNav.classList.toggle("is-gone", hold > 0.02 || endShown > 0.5);   /* gone (and untappable) as the film hands over */
    const dir = Math.abs(target - shown) > 0.5 ? Math.sign(target - shown) : vel >= 0 ? 1 : -1;
    store.focus = a; store.dir = dir;
    /* lagging far behind a flick: half the downloads go to where the reader is,
       so a catch-up cut (LAGCUT) lands on frames that are here */
    const tf = Math.floor(target), far = Math.abs(target - shown) > LEAP || (hold > 0 && Math.abs(target - shown) > 1);
    store.far = Math.abs(target - shown) > FAR || far ? tf : -1;
    /* (only once the reader has stopped: during a fling every tick started
       another full decode, and they pushed the playhead's own frames out) */
    if (far && settled >= 2 && store.blobs[tf]) store.decode(tf, true);

    /* GPU memory: keep the atlas under the playhead and the neighbour the
       reader is heading for — added past the chapter's middle, dropped only a
       quarter back, so hovering around the middle never thrashes uploads */
    const ka = chOf(a), kb = chOf(b);
    const c = chapters[ka];
    const local = (shown - c.first) / Math.max(1, c.count - 1);
    /* where the reader is, for anything that follows the film; lag: frames the picture is still behind the
       scroll (a jump makes it large — the sound skips the moments it is only passing through) */
    if (primary) { window.__filmPos = { ch: ka, local, lag: Math.abs(target - shown), cut: cuts }; window.__filmTick = now; }
    wanted = new Set([ka, kb]);
    if (local > 0.5 || (local > 0.25 && renderer.atlases.has(ka + 1))) wanted.add(ka + 1);
    if (local < 0.5 || (local < 0.75 && renderer.atlases.has(ka - 1))) wanted.add(ka - 1);
    for (const k of wanted) ensureAtlas(k);
    for (const k of [...renderer.atlases.keys()]) if (!wanted.has(k)) renderer.dropAtlas(k);
    const atA = renderer.atlases.get(ka) || null, atB = renderer.atlases.get(kb) || null;

    /* Decoding. Slow: every frame, the pair under the playhead first (urgent),
       then ahead. Fast: on a stride (every 2nd or 3rd frame), so the frames
       that are decoded keep up with the picture instead of all arriving late. */
    const spd = Math.abs(vel);
    stride = spd < 40 ? 1 : spd < 95 ? 2 : 3;
    const g0 = Math.floor(shown / stride) * stride, g1 = Math.min(n - 1, g0 + stride);
    store.decode(g0, true); store.decode(g1, true);
    /* standing still, get further ahead: the first wheel notch moves ~9
       frames, and a phone decodes one in ~35 ms (measured, perf.mjs) */
    ahead = Math.min(24, Math.max(spd < 2 ? 8 : 3, Math.ceil(spd * 0.22)));
    for (let k = 1; k * stride <= ahead; k++) store.decode(dir > 0 ? g1 + k * stride : g0 - k * stride, false);

    /* What is shown: the decoded frames nearest the playhead on either side
       (the pair itself when it is ready), blended by where the playhead falls
       between them. Never a frame from more than NEAR away. */
    let sA = -1, sB = -1, sT = 0;
    if (!forceLo) {
      for (let i = a; i >= Math.max(0, a - NEAR); i--) if (store.bitmaps.has(i)) { sA = i; break; }
      for (let i = t > 0.001 ? a + 1 : a, e = Math.min(n - 1, a + NEAR); i <= e; i++) if (store.bitmaps.has(i)) { sB = i; break; }
      if (sA < 0) sA = sB; else if (sB < 0) sB = sA;
      if (sA >= 0 && sB > sA) sT = (shown - sA) / (sB - sA);
    }
    let hiTarget = 0;
    if (sA >= 0) {
      renderer.show(sA, store.get(sA), sB, store.get(sB));
      hiTarget = 1; sharpOn = sA; missT = 0;
      behind = Math.abs(sA + sT * (sB - sA) - shown);
    } else if (sharpOn >= 0 && renderer.held[0] === sharpOn && Math.abs(shown - sharpOn) <= NEAR * 4) {
      /* nothing decoded close enough yet: the sharp frame already on screen
         stays, a few frames off, rather than the screen going soft */
      hiTarget = 1; sA = sB = sharpOn; sT = 0; behind = Math.abs(shown - sharpOn);
    } else {
      sharpOn = -1;
      if (!missT) missT = now;
    }
    /* Sharp frames ease in over the atlas (no pop). With no sharp frame near
       (only just after a cut) the frame being decoded is waited for a moment
       before the soft atlas is shown at all: the screen keeps its last picture,
       or the veil of a jump covers it. */
    const lo = atA && atB;
    const wait = !hiTarget && drawn && now - missT < (store.blobs[a] ? 450 : 240) && (store.pending.size > 0 || !lo);   /* (longer when the frame is here and only its decode is on the way) */
    hi = hiTarget ? (lo && hi < 1 ? hi + (1 - hi) * (1 - Math.exp(-dt / 0.09)) : 1) : 0;
    if (hiTarget && hi > 0.995) hi = 1;
    /* for the page's fade (scroll.js): is this film's picture sharp, and has it run since (per film: a page of several) */
    (window.__filmSharpOf ||= {})[id] = hiTarget === 1 && hi > 0.9 && behind < 3;
    (window.__filmTickOf ||= {})[id] = now;
    if (primary) window.__filmSharp = window.__filmSharpOf[id];
    if (hiTarget) hiFrames++; else loFrames++;
    /* judged over 40 moving frames (well under a second of scrolling), so a
       slow device is caught in the film's opening seconds, not mid-chapter.
       Only at a reading pace: a jump (an anchor, a reload restoring the
       scroll mid-film) leaves every device chasing undecoded frames for a
       moment, and an atlas being striped onto the GPU costs frames on
       purpose — counting either sent a 4K desktop to the light set. */
    const lag = Math.abs(target - shown);
    if (lag > 12) guard.jumpT = now;
    const reading = now - guard.jumpT > 1200;
    /* A phone is judged while it flicks too, on decoding alone: frames that
       arrived long ago and are still not decoded while the picture stands far
       from the playhead. (A 4x slower phone in HD ran 23 frames behind through
       a fast flick and fell to the atlas one tick in ten: measured, flick.mjs.
       Slow FRAMES are only judged at a reading pace: a flick's are expected.) */
    const flicking = !fine && !reading && behind > 8;
    if (tier === "hd" && !forced && introT0 && now - introT0 > 1500 && (reading || flicking) && !making.size && (lag > 0.3 || spd > 2)) {
      guard.n++;
      if (reading && dt > 0.024) guard.slow++;
      /* late = downloaded a while ago and still not decoded: the device, not
         the network (on the live site frames often land right under the
         playhead, and that is the link being slow, not the phone) */
      if ((!hiTarget || behind > 2.5) && store.blobs[a] && store.blobs[b] && now - Math.max(store.gotAt[a], store.gotAt[b]) > (flicking ? 500 : 250)) guard.late++;
      if (guard.n >= 40) {
        if (guard.slow > 10 || guard.late > 13) {
          if (probe) probe.why = { slow: guard.slow, late: guard.late, at: +shown.toFixed(1), t: Math.round(now - introT0), dt: +(dt * 1000).toFixed(1) };
          downgrade();
        }
        guard.n = guard.slow = guard.late = 0;
      }
    }

    /* The last frames ARE the page: vignette, grain and the type scrim fade
       out over the end of the last chapter, then the film itself fades over
       what the page shows behind it during the hold. */
    const endP = handoff && shown >= last.first ? smooth(0.7, 0.96, (shown - last.first) / Math.max(1, last.count - 1)) : 0;
    if ((lo || hiTarget) && !wait) {
      renderer.draw(atA, a - c.first, atB, b - chapters[kb].first, t, sA === sB ? 0 : sT, hi, now / 1000, GRAIN * (1 - endP), cw, ch, VIG * (1 - endP));
      drawn = true;
    }
    if (Math.abs(endP - endShown) > 0.002) { endShown = endP; root.style.setProperty("--film-end", endP.toFixed(3)); }
    /* film.json "enterFade": the studio comes up out of the page as the film
       rises into view (the stage is transparent over the page's cream), fully
       there once its top nears the top of the screen — no cut from a
       blank page to the picture */
    const enter = HOLD_IN ? (scrollY >= top - 1 ? 1 : 0) : ENTER ? smooth(0.12, 0.92, (scrollY + innerHeight - top) / innerHeight) : 1;
    if (HOLD_IN) { const fin = smooth(0, 0.5, (scrollY - top) / innerHeight); if (Math.abs(fin - finShown) > 0.002) { finShown = fin; root.style.setProperty("--film-in", fin.toFixed(3)); } }
    if (FEATHER) {
      /* it runs on a little past the moment the film reaches the top (to 1.35 screens): shrunk to nothing at
         that moment, the last of it was a hard edge again (5.7 levels at 94 px from the top, measured) */
      const fp = Math.max(0, (scrollY + innerHeight - top) / innerHeight);
      const fh = Math.round((1 - smooth(0, 1.35, fp)) * FEATHER * innerHeight);
      if (fh !== featherShown) {
        featherShown = fh;
        const m = fh > 1 ? `linear-gradient(180deg, transparent 0, rgba(0,0,0,0.35) ${Math.round(fh * 0.45)}px, #000 ${fh}px)` : "";
        stage.style.maskImage = m; stage.style.webkitMaskImage = m;
      }
    }
    const o = (handoff ? 1 - smooth(0.1, 0.9, hold) : 1) * enter;
    if (Math.abs(o - stageO) > 0.001) { stageO = o; stage.style.opacity = o.toFixed(3); root.classList.toggle("is-faded", o < 0.5); }
    /* the page's header and rail follow what is behind them: the night film,
       the cream end of it, or (once it has ended / mostly scrolled away) the page */
    const past = scrollY - top - span - holdPx;
    const tone = TONE_AT !== null && shown / Math.max(1, n - 1) >= TONE_AT ? TONE_TO : TONE;
    if ((tone === "dark" && TONE === "light") !== night) { night = !night; root.classList.toggle("is-night", night); }
    if ((tone === "light" && TONE === "dark") !== day) { day = !day; root.classList.toggle("is-day", day); }   /* dark type over the bright worlds */
    setMode(handoff ? (past >= 0 ? "" : endP < 0.5 ? tone : END_TONE) : past > innerHeight * 0.5 ? "" : tone);
    if (probe) probe.log.push([now, shown, hiTarget ? hi : 0, store.pending.size, +behind.toFixed(2), stride, +target.toFixed(2), store.blobs[a] ? 1 : 0, store.loaded]);
    /* the opening headline waits for the curtain (js/intro.js) */
    if (!introT0 && !curtain) { introT0 = now; root.classList.add("is-live"); }
    introP = introT0 ? Math.min(1, (now - introT0) / INTRO_MS) : 0;

    /* headlines: a strict sequence — a beat leaves completely before the next
       one starts, so two headlines never share the screen */
    for (const bt of beats) {
      /* the autoplay beat starts before the scroll does (a < 0): its windows
         are measured from the top of the page, or its exit began above it and
         the headline sat half-gone before anyone had scrolled */
      const len = bt.b - Math.max(0, bt.a);
      /* the opening headline waits for the pen: it rises as the mark is finished */
      const inP = bt.a <= 0 ? (AUTO ? smooth(0.66, 1.0, autoP) : introP) : smooth(bt.a, bt.a + len * 0.28, p);
      const outP = smooth(bt.b - len * 0.22, bt.b, p);
      const on = inP > 0 && outP < 1;
      bt.el.classList.toggle("is-on", on);
      if (!on) continue;
      bt.lines.forEach((ln, k) => {
        const li = easeOut(Math.min(1, Math.max(0, inP * 1.25 - k * 0.18)));
        const lo = easeOut(Math.min(1, Math.max(0, outP * 1.25 - k * 0.12)));
        ln.style.transform = `translate3d(0, ${(1 - li) * 105 - lo * 105}%, 0)`;
      });
      /* label and lead leave WITH the headline, not after it — a lead left on
         screen once its title has gone reads as an orphaned caption */
      const r = inP * (1 - smooth(0, 0.7, outP));
      bt.rest.forEach((el) => { el.style.opacity = r.toFixed(3); el.style.transform = `translate3d(0, ${(1 - r) * 12}px, 0)`; });
    }

    if (hud && (fpsN++, now - fpsT > 500)) {
      fps = Math.round((fpsN * 1000) / (now - fpsT)); fpsT = now; fpsN = 0;
      const avg = store.decodeMs.length ? store.decodeMs.reduce((s, v) => s + v, 0) / store.decodeMs.length : 0;
      const sharp = hiFrames + loFrames ? Math.round((hiFrames * 100) / (hiFrames + loFrames)) : 0;
      hud.textContent = `ch ${ka + 1}/${chapters.length}  frame ${shown.toFixed(1)}/${n - 1}  fps ${fps}  sharp ${sharp}%  v ${vel.toFixed(0)}f/s  stride ${stride}  behind ${behind.toFixed(1)}  ahead ${ahead}  loaded ${store.loaded}/${n} (${(store.bytes / 1048576).toFixed(1)} MB)  decoded ${store.bitmaps.size}  atlases ${[...renderer.atlases.keys()].map((k) => k + 1).join(",")}  decode ${avg.toFixed(1)} ms  ${chapters[0].v.w}x${chapters[0].v.h} ${chapters[0].v.ext} ${tier}`;
    }

    /* Keep running only while something is still changing on screen: the
       playhead easing, a decode in flight, the sharp layer fading in (which
       also covers "the pair has not downloaded yet"), the intro. */
    if (visible && (Math.abs(target - shown) > 0.001 || (!onAuto && now - restT < 240 && Math.abs(rawTarget - Math.round(rawTarget)) > 0.001) || store.pending.size || making.size || introP < 1 || autoP < 1 || (hiTarget && hi < 1) || wait || hud)) {
      requestAnimationFrame(frame);
    } else {
      running = false;
    }
  }

  function kick() {
    /* a film off screen stays asleep: every scroll on the page used to draw
       it once, reloading the memory release() had just given back */
    if (running || !visible) return;
    running = true;
    lastT = performance.now();
    requestAnimationFrame(frame);
  }
  addEventListener("scroll", kick, { passive: true });
  booted = true;
  kick();
}

/* a chapter still being rendered is marked data-pending: not mounted, not shown */
document.querySelectorAll("[data-film]:not([data-pending])").forEach((el, i) => mountFilm(el, i === 0));
