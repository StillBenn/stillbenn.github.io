/* ==========================================================================
   The room, rendered
   --------------------------------------------------------------------------
   Every view is a path-traced render (Blender, Cycles) of the home film's
   kitchen, not a live model: the parquet, the plaster and the city at dusk
   through the window are photographs, and the light is the light that
   photograph gives. The camera rests at 13 places along an arc round the
   island; a drag walks it along the arc through three more renders between
   each two (49 in all, light frames only): at 13 every step was a 3.3° jump
   the dissolve had to hide, and a slow drag read as a stutter.

   Each choice is its own layer, and the page stacks the ones chosen:
     the room with the chosen wall colour   (a whole render: the walls are most
                                             of what the light bounces off, so a
                                             colour changes the ceiling too)
     the floor, the fronts, the worktop     (each under its own mask, only when
                                             it is not the film's own, relit by
                                             the wall colour: the change of
                                             light it makes, as a multiplier)
   Day and evening are two sets of the same. Two sizes: light frames (800 px,
   one pack per layer) while the camera moves, the full 1600 px frame once it
   rests; frames are cropped to what they cover and decoded within a memory
   budget. The renders and the tooling: _film/kitchen (build, render, pack,
   check).

   The interface (ui.js) talks to this the way it talked to the live scene:
   createRoom(canvas) -> { setFloor, setCounter, setFront, setWall,
   setEvening, resetView }.
   ========================================================================== */

const RENDERS = "./renders/";
const GROUPS = ["floor", "front", "counter"];          // drawn in this order over the room
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const small = Math.min(screen.width, screen.height) < 700;
const saveData = !!(navigator.connection && navigator.connection.saveData);
/* bytes of decoded frames kept, per set: the light ones hold the whole fine
   arc of the chosen room on a computer (~94 MB for the room alone, more with
   options; a phone keeps the places nearest the camera), the sharp ones a few
   rests — in one pool a sharp frame (7.7 MB) pushed the warmed arc out */
const BUDGET = { lite: (small ? 72 : 200) * 1048576, hd: (small ? 24 : 48) * 1048576 };
const HOME = 6;                                       // the view the page opens on (0-based)
const CX = 0.56, CY = 0.5;                            // what a narrow stage keeps in frame

const smooth = (k, dt) => 1 - Math.exp(-k * dt);
const ease = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

export function createRoom(canvas) {
  const ctx = canvas.getContext("2d");
  const host = canvas.closest(".room") || document.body;

  /* --- what is loaded ---------------------------------------------------- */
  const manifests = {}, manifestSync = {};
  function manifestOf(light) {
    return manifests[light] || (manifests[light] = fetch(RENDERS + light + "/manifest.json?v=5")
      .then((r) => { if (!r.ok) throw new Error("manifest " + light); return r.json(); })
      .then((m) => (manifestSync[light] = m))
      .catch((e) => { delete manifests[light]; throw e; }));
  }

  /* decoded frames: the least recently used go first once over the budget */
  const cache = new Map();
  const cacheBytes = { lite: 0, hd: 0 };
  const tierOf = (key) => key.slice(0, key.indexOf("/"));
  function remember(key, bmp) {
    const bytes = bmp.width * bmp.height * 4, tier = tierOf(key);
    cache.set(key, { bmp, bytes }); cacheBytes[tier] += bytes;
    for (const [k, v] of cache) {
      if (cacheBytes[tier] <= BUDGET[tier]) break;
      if (k === key || tierOf(k) !== tier) continue;
      cache.delete(k); cacheBytes[tier] -= v.bytes;
      if (v.bmp.close) v.bmp.close();
    }
  }
  function recall(key) {
    const hit = cache.get(key);
    if (!hit) return null;
    cache.delete(key); cache.set(key, hit);
    return hit.bmp;
  }

  /* a layer's light frames come in one pack: one request, then sliced */
  const packs = new Map();
  function packOf(light, name) {
    const id = light + "/" + name;
    if (!packs.has(id)) {
      const p = manifestOf(light).then((m) => {
        const L = m.layers[name].lite;
        return fetch(RENDERS + light + "/" + L.pack + (m.rev ? "?r=" + m.rev : ""))
          .then((r) => { if (!r.ok) throw new Error(L.pack); return r.arrayBuffer(); })
          .then((buf) => {
            const out = []; let at = 0;
            for (const n of L.sizes) { out.push(new Blob([new Uint8Array(buf, at, n)], { type: "image/webp" })); at += n; }
            return out;
          });
      });
      p.catch(() => packs.delete(id));
      packs.set(id, p);
    }
    return packs.get(id);
  }

  const pending = new Map();
  function decode(tier, light, name, i) {
    const key = tier + "/" + light + "/" + name + "/" + i;
    const have = recall(key);
    if (have) return Promise.resolve(have);
    if (pending.has(key)) return pending.get(key);
    const blob = tier === "lite"
      ? packOf(light, name).then((blobs) => blobs[i])
      : manifestOf(light).then((m) => fetch(RENDERS + light + "/" + m.layers[name].hd.dir + String(i + 1).padStart(2, "0") + ".webp" + (m.rev ? "?r=" + m.rev : "")))
          .then((r) => { if (!r.ok) throw new Error(name + " " + i); return r.blob(); });
    const p = blob.then((b) => createImageBitmap(b)).then(
      (bmp) => { pending.delete(key); remember(key, bmp); return bmp; },
      (err) => { pending.delete(key); throw err; });
    pending.set(key, p);
    return p;
  }

  /* --- what a choice needs ------------------------------------------------ */
  const sel = { floor: "oak", counter: "marble", front: "lakeSage", wall: "lime", light: "day" };
  let defaults = { floor: "oak", counter: "marble", front: "lakeSage", wall: "lime" };
  const changedGroups = (s) => GROUPS.filter((g) => s[g] !== defaults[g]);
  function layersOf(s) {
    const names = ["base-" + s.wall];
    const groups = changedGroups(s);
    for (const g of groups) names.push(g + "-" + s[g]);
    if (groups.length && s.wall !== defaults.wall) names.push("rel-" + s.wall);
    return names;
  }
  const keyOf = (s) => [s.light, s.wall, s.floor, s.front, s.counter].join("|");
  const want = (tier, s, i) => manifestOf(s.light).then(() => Promise.all(layersOf(s).map((n) => decode(tier, s.light, n, i))));
  const canCompose = (tier, s, i) => !!manifestSync[s.light]
    && layersOf(s).every((n) => cache.has(tier + "/" + s.light + "/" + n + "/" + i));

  /* stack one view of a choice into a frame-sized canvas */
  const frameCv = { lite: mk(), hd: mk() };
  const tmp = mk();
  function mk() { return document.createElement("canvas"); }
  function compose(tier, s, i, into) {
    if (!canCompose(tier, s, i)) return null;
    const m = manifestSync[s.light];
    const [fw, fh] = m.tiers[tier];
    const c = into;
    if (c.width !== fw || c.height !== fh) { c.width = fw; c.height = fh; }
    const g = c.getContext("2d");
    const bmp = (n) => recall(tier + "/" + s.light + "/" + n + "/" + i);
    const box = (n) => m.layers[n][tier].boxes[i];
    g.globalCompositeOperation = "source-over"; g.globalAlpha = 1;
    g.drawImage(bmp("base-" + s.wall), 0, 0, fw, fh);
    const relight = s.wall !== defaults.wall ? "rel-" + s.wall : null;
    for (const grp of changedGroups(s)) {
      const n = grp + "-" + s[grp], k = box(n);
      if (!relight) { g.drawImage(bmp(n), k[0], k[1], k[2], k[3]); continue; }
      /* the option under the wall colour's light: multiplied by the ratio,
         then cut back to the option's own shape */
      if (tmp.width !== k[2] || tmp.height !== k[3]) { tmp.width = k[2]; tmp.height = k[3]; }
      const t = tmp.getContext("2d");
      t.globalCompositeOperation = "source-over"; t.clearRect(0, 0, k[2], k[3]);
      t.drawImage(bmp(n), 0, 0, k[2], k[3]);
      const r = box(relight);
      t.globalCompositeOperation = "multiply"; t.drawImage(bmp(relight), r[0] - k[0], r[1] - k[1], r[2], r[3]);
      t.globalCompositeOperation = "destination-in"; t.drawImage(bmp(n), 0, 0, k[2], k[3]);
      t.globalCompositeOperation = "source-over";
      g.drawImage(tmp, k[0], k[1]);
    }
    return c;
  }

  /* --- the camera on its arc --------------------------------------------- */
  /* view.at counts the 13 resting places; the light frames are FINE times as
     dense (the manifest's "fine"), and place i of the 13 is light frame i*FINE */
  let VIEWS = 13, FINE = 1;
  const LITE = () => (VIEWS - 1) * FINE + 1;
  const sharpAt = (fi) => (fi % FINE === 0 ? fi / FINE : -1);
  const view = { at: HOME, vel: 0, dragging: false, play: null, zoom: 1, zoomTo: 1, quietSince: 0 };
  const pxPerView = () => Math.max(22, canvas.clientWidth * 0.055);
  const clampAt = (v) => Math.min(VIEWS - 1, Math.max(0, v));

  let lastX = 0, lastT = 0;
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    canvas.setPointerCapture(e.pointerId);
    view.dragging = true; view.play = null; view.vel = 0;
    lastX = e.clientX; lastT = performance.now();
    canvas.classList.add("is-grabbing");
    host.classList.add("is-moved");
    wake();
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!view.dragging) return;
    const now = performance.now();
    /* the room follows the hand: dragging it left walks the camera right */
    const dv = -(e.clientX - lastX) / pxPerView();
    const next = view.at + dv;
    view.at = next < 0 || next > VIEWS - 1 ? view.at + dv * 0.25 : next;     // a soft end to the arc
    view.at = Math.min(VIEWS - 0.6, Math.max(-0.4, view.at));
    const dt = Math.max(0.008, (now - lastT) / 1000);
    view.vel = view.vel * 0.6 + (dv / dt) * 0.4;
    lastX = e.clientX; lastT = now;
    wake();
  });
  const release = () => {
    if (!view.dragging) return;
    view.dragging = false;
    canvas.classList.remove("is-grabbing");
    if (performance.now() - lastT > 90) view.vel = 0;
    wake();
  };
  canvas.addEventListener("pointerup", release);
  canvas.addEventListener("pointercancel", release);
  canvas.addEventListener("wheel", (e) => {
    if (e.ctrlKey) return;
    e.preventDefault();
    view.zoomTo = Math.min(1.7, Math.max(1, view.zoomTo * Math.exp(-e.deltaY * 0.0015)));
    wake();
  }, { passive: false });
  canvas.addEventListener("dblclick", () => { view.zoomTo = view.zoomTo > 1.2 ? 1 : 1.5; wake(); });
  /* keys: a focused stage walks with the arrows */
  canvas.tabIndex = 0;
  canvas.addEventListener("keydown", (e) => {
    const d = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (!d) return;
    e.preventDefault();
    const to = clampAt(Math.round(view.at) + d);
    view.play = { from: view.at, to, t0: performance.now(), dur: reducedMotion ? 1 : 520 };
    host.classList.add("is-moved");
    wake();
  });

  /* --- the stage ---------------------------------------------------------- */
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr)), h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; shown.key = ""; wake(); }
  }
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  addEventListener("resize", resize);

  function paint(frame, alpha) {
    const W = canvas.width, H = canvas.height, fw = frame.width, fh = frame.height;
    const s0 = Math.max(W / fw, H / fh), s = s0 * view.zoom;
    /* cover the stage, the focus as near its middle as the frame allows; a
       zoom closes in on wherever the focus then sits */
    const ox = Math.min(0, Math.max(W - fw * s0, W / 2 - CX * fw * s0));
    const oy = Math.min(0, Math.max(H - fh * s0, H / 2 - CY * fh * s0));
    const px = ox + CX * fw * s0, py = oy + CY * fh * s0;
    const dx = Math.min(0, Math.max(W - fw * s, px - CX * fw * s));
    const dy = Math.min(0, Math.max(H - fh * s, py - CY * fh * s));
    ctx.globalAlpha = alpha;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(frame, dx, dy, fw * s, fh * s);
    ctx.globalAlpha = 1;
  }

  /* what is on the screen, and a fade from what was there before */
  const shown = { key: "", sk: "", tier: "", i: -1 };
  const fadeCv = mk();
  let fade = null;
  /* lead: how far into the dissolve its first frame already is. A step's
     dissolve that began at 0 drew the old picture unchanged for one frame — a
     still frame at every step of a drag (measured: one in eight) */
  function startFade(dur, linear, lead) {
    if (reducedMotion || !shown.key || dur <= 0) return;
    if (fadeCv.width !== canvas.width || fadeCv.height !== canvas.height) { fadeCv.width = canvas.width; fadeCv.height = canvas.height; }
    const f = fadeCv.getContext("2d");
    f.clearRect(0, 0, fadeCv.width, fadeCv.height); f.drawImage(canvas, 0, 0);
    fade = { t0: performance.now() - Math.min(lead || 0, dur * 0.5), dur, linear: !!linear };
  }
  let nextFade = 380;

  let running = false, lastFrameT = 0, started = false;
  function wake() {
    if (running) return;
    running = true; lastFrameT = performance.now();
    requestAnimationFrame(tick);
  }

  function tick(now) {
    const dt = Math.min((now - lastFrameT) / 1000, 0.1);
    lastFrameT = now;
    let busy = false;

    if (view.play) {
      const p = Math.min(1, (now - view.play.t0) / view.play.dur);
      view.at = view.play.from + (view.play.to - view.play.from) * ease(p) + (view.play.amp || 0) * Math.sin(Math.PI * ease(p));
      if (p >= 1) { view.at = view.play.to; view.play = null; }
      busy = true;
    } else if (!view.dragging) {
      if (Math.abs(view.vel) > 0.4 && view.at > 0 && view.at < VIEWS - 1) {
        view.at += view.vel * dt;
        view.vel *= Math.exp(-4 * dt);
        busy = true;
      } else {
        view.vel = 0;
        const to = clampAt(Math.round(view.at));
        if (Math.abs(to - view.at) > 0.004) { view.at += (to - view.at) * smooth(9, dt); busy = true; }
        else view.at = to;
      }
    } else busy = true;
    const moving = busy;
    if (moving) view.quietSince = now;

    view.zoom += (view.zoomTo - view.zoom) * smooth(10, dt);
    if (Math.abs(view.zoomTo - view.zoom) > 0.0005) busy = true; else view.zoom = view.zoomTo;

    /* The camera shows the nearest of its places, and steps to the next
       through a dissolve as long as the step. Halfway blends of two places
       (tried first) doubled every edge near the camera — the stools, the
       window bars. Moving, the places are the fine arc's; at rest the camera
       has settled on one of the 13, which has its sharp frame. */
    const s = { ...sel }, sk = keyOf(s);
    const fi = Math.round(clampAt(view.at) * FINE);              // light frame
    const hi = sharpAt(fi);                                      // its sharp frame, at the 13
    const rest = !moving && now - view.quietSince > 120;
    if (!canCompose("lite", s, fi)) want("lite", s, fi).then(wake, () => {});
    if (rest && hi >= 0 && !canCompose("hd", s, hi)) want("hd", s, hi).then(wake, () => {});
    if (moving) {
      const dir = view.vel < 0 || (view.play && view.play.to < view.play.from) ? -1 : 1;
      for (let k = 1; k <= 3 * FINE; k++) {
        const j = fi + dir * k;   // ahead of the walk
        if (j >= 0 && j < LITE()) for (const n of layersOf(s)) decode("lite", s.light, n, j).catch(() => {});
      }
    }

    /* the frame: sharp once the camera has rested, light while it moves */
    let A = null, tier = null;
    if (rest && hi >= 0 && canCompose("hd", s, hi)) { tier = "hd"; A = compose("hd", s, hi, frameCv.hd); }
    else if (canCompose("lite", s, fi)) { tier = "lite"; A = compose("lite", s, fi, frameCv.lite); }
    else if (hi >= 0 && canCompose("hd", s, hi)) { tier = "hd"; A = compose("hd", s, hi, frameCv.hd); }

    if (A) {
      const key = sk + "#" + fi + "#" + tier + "#" + view.zoom.toFixed(4) + "#" + canvas.width + "x" + canvas.height;
      if (key !== shown.key || fade) {
        if (shown.sk && shown.sk !== sk) { startFade(nextFade); nextFade = 380; }
        else if (shown.sk === sk && shown.i !== fi) {
          /* a step along the arc dissolves for as long as the step took (a
             short fixed dissolve left the slow steps standing, which read as a
             stutter); at rest the picture is one place, sharp */
          startFade(reducedMotion ? 0 : Math.min(650, Math.max(120 / FINE, now - (shown.stepT || now))), true, dt * 1000);   // linear: an eased dissolve bunched each step's change in its middle and left the ends standing
        }
        else if (shown.sk === sk && shown.tier === "lite" && tier === "hd") startFade(220);         // sharpening, no pop
        ctx.globalCompositeOperation = "source-over";
        paint(A, 1);
        if (fade) {
          const p = Math.min(1, (now - fade.t0) / fade.dur);
          ctx.globalAlpha = 1 - (fade.linear ? p : ease(p)); ctx.drawImage(fadeCv, 0, 0); ctx.globalAlpha = 1;
          if (p >= 1) fade = null; else busy = true;
        }
        if (shown.i !== fi) shown.stepT = now;
        Object.assign(shown, { key, sk, tier, i: fi });
        if (!started) { started = true; host.classList.add("is-ready"); intro(); }
      }
    }
    if (busy || (!moving && !rest)) requestAnimationFrame(tick);
    else running = false;
  }

  /* Warm the arc: the light frames of the chosen room decoded ahead, nearest
     places first, three at a time, as many as the budget holds (the whole
     fine arc on a computer). A step decoded on demand waited for a full-frame
     decode or two — a hitch at the first drag. A new choice starts over from
     the place on screen (from: a light frame). */
  let warmGen = 0;
  function warm(s, from) {
    const gen = ++warmGen;
    return manifestOf(s.light).then((m) => {
      const names = layersOf(s), N = LITE();
      const perView = names.reduce((sum, n) => sum + m.layers[n].lite.boxes.reduce((a, b) => a + b[2] * b[3] * 4, 0) / N, 0);
      const fit = Math.max(1, Math.min(N, Math.floor(BUDGET.lite * 0.85 / perView)));
      const order = [];
      for (let d = 0; order.length < fit && d < N; d++) {
        if (from + d < N) order.push(from + d);
        if (d && from - d >= 0 && order.length < fit) order.push(from - d);
      }
      let k = 0;
      const next = () => {
        if (gen !== warmGen || k >= order.length) return null;
        const i = order[k++];
        return Promise.all(names.map((n) => decode("lite", s.light, n, i))).then(next, next);
      };
      return Promise.all([next(), next(), next()]);
    });
  }

  /* the opening: once the arc is decoded, the camera steps a little way along
     it and back — the room says it can be walked round */
  function intro() {
    const s = { ...sel };
    warm(s, HOME * FINE).then(() => {
      later(preload);
      if (reducedMotion || host.classList.contains("is-moved")) return;
      view.play = { from: HOME, to: HOME, amp: -1.8, t0: performance.now(), dur: 3200 };
      wake();
    }, () => {});
  }
  const later = (fn) => ("requestIdleCallback" in window ? requestIdleCallback(fn, { timeout: 2500 }) : setTimeout(fn, 1200));

  /* afterwards, quietly: the room in the other light (the likeliest next
     tap), then the other wall colours, so the first taps answer at once —
     not on a phone or a saver connection, where a choice loads when made */
  function preload() {
    if (small || saveData) return;
    const other = sel.light === "day" ? "evening" : "day";
    manifestOf(other).then(() => {
      const list = [[other, "base-" + sel.wall]];
      for (const n of Object.keys(manifestSync[sel.light].layers)) {
        if (n.startsWith("base-") && n !== "base-" + sel.wall) list.push([sel.light, n]);
      }
      let k = 0;
      const next = () => {
        if (k >= list.length) return;
        const [L, n] = list[k++];
        packOf(L, n).then(() => later(next), () => later(next));
      };
      next();
    }, () => {});
  }

  function set(group, value, fadeMs) {
    if (sel[group] === value) return;
    sel[group] = value;
    nextFade = reducedMotion ? 0 : fadeMs;
    if (started) warm({ ...sel }, Math.round(clampAt(view.at) * FINE));    // the new room, from the place on screen
    wake();
  }

  manifestOf("day").then((m) => {
    VIEWS = m.views; FINE = m.fine || 1; defaults = m.default;
    return want("hd", { ...sel }, HOME);
  }).then(wake, () => wake());
  resize();

  return {
    setFloor: (k) => set("floor", k, 380),
    setCounter: (k) => set("counter", k, 380),
    setFront: (k) => set("front", k, 380),
    setWall: (k) => set("wall", k, 420),
    setEvening: (on) => set("light", on ? "evening" : "day", 700),
    resetView() {
      view.vel = 0;
      view.play = { from: view.at, to: HOME, t0: performance.now(), dur: reducedMotion ? 1 : 900 };
      view.zoomTo = 1;
      wake();
    }
  };
}
