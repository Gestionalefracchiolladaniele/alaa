/* Sequenze video legate allo scroll (01-architettura.md, "Pipeline delle sequenze").
   - createPlayer(): disegna i fotogrammi WebP su un <canvas>. Non sa nulla dello scroll:
     lo usa anche l'apertura a sipario (clip 3, guidata dal tempo).
   - init(): lega le sequenze della home allo scroll.
       copertina (clip 1)  scena fissata per ~70% di schermo, la clip avanza nella colonna destra;
       arco (clip 2)       scena fissata per ~2,5 schermi: la clip avanza, l'arco si allarga a tutto
                           schermo (FLIP, solo transform), il testo sfuma, un velo crema chiude sul crema
                           della copertina Interior;
       mobile              niente pin: la clip avanza mentre il riquadro attraversa lo schermo;
       riserva             (manifest assente) zoom lento dell'immagine con un piccolo spostamento;
       "riduci animazioni" niente di tutto questo: resta l'immagine ferma. */
import { motion, reduced, isMobile, EASE } from './core.js';

const BASE = (import.meta.env.BASE_URL ?? '/').replace(/\/?$/, '/');
const DPR_MAX = 1;
// Arco: false = porta a clic (scelta del 13 nov); true = vecchia versione legata allo scroll (da sistemare se si torna indietro)
const ARCH_SCROLL = true;   // arco legato allo scroll (scelta di Daniele, 13 nov); false = porta a clic
const BATCH = 6;          // richieste contemporanee: il PC di riferimento ha 2 core
const clamp01 = (v) => Math.min(1, Math.max(0, Number(v) || 0));

/**
 * Crea un lettore di fotogrammi dentro `host`.
 * @param {string} clip  nome della cartella in /sequences/ ("clip-1")
 * @param {HTMLElement} host  contenitore: il canvas ne prende la misura
 * @param {{ fit?: 'cover' | 'contain' }} [opts]
 * @returns {Promise<null | {
 *   count: number, canvas: HTMLCanvasElement, keyed: boolean, variant: string, width: number, height: number,
 *   first: Promise<boolean>, ready: Promise<boolean>,
 *   draw: (position?: number, force?: boolean) => void,
 *   preload: (o?: { from?: number }) => Promise<boolean>,
 *   resize: () => void, destroy: () => void }>}
 *   null se il manifest non si scarica: chi chiama resta sull'immagine di riserva.
 */
export async function createPlayer(clip, host, { fit = 'cover' } = {}) {
  if (!host) return null;
  let manifest;
  try {
    const res = await fetch(`${BASE}sequences/${clip}/manifest.json`);
    if (!res.ok) return null;
    manifest = await res.json();
  } catch {
    return null;
  }
  let variant = isMobile() ? 'mobile' : 'desktop';
  if (!manifest?.[variant]?.frames) variant = variant === 'mobile' ? 'desktop' : 'mobile';
  const info = manifest?.[variant] ?? {};
  const count = Math.floor(Number(info.frames) || 0);
  if (count < 1) return null;

  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'display:block;width:100%;height:100%;max-width:none';
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  host.appendChild(canvas);

  const frameW = Number(info.width) || 1280;
  const frameH = Number(info.height) || 720;
  const url = (i) => `${BASE}sequences/${clip}/${variant}/${String(i + 1).padStart(4, '0')}.webp`;
  const imgs = new Array(count);
  const loaded = new Uint8Array(count);
  const pending = new Set();
  let shown = -1;          // fotogramma sul canvas
  let want = 0;            // ultima posizione chiesta (0..1)
  let active = false;      // draw() e' stato chiamato almeno una volta
  let destroyed = false;
  let started = null;
  let resolveFirst, resolveReady;
  const first = new Promise((r) => { resolveFirst = r; });
  const ready = new Promise((r) => { resolveReady = r; });

  // fotogramma caricato piu' vicino a i (-1 se nessuno)
  function nearest(i) {
    if (loaded[i]) return i;
    for (let d = 1; d < count; d++) {
      if (i - d >= 0 && loaded[i - d]) return i - d;
      if (i + d < count && loaded[i + d]) return i + d;
    }
    return -1;
  }

  /* Fotogrammi gia' decodificati intorno alla posizione corrente. Disegnare un <img> WebP obbliga il browser
     a decodificarlo in quel momento (scatto su PC lenti); createImageBitmap lo fa prima e fuori dal disegno.
     Se ne tengono pochi (ognuno occupa ~3,7 MB di memoria). */
  const bitmaps = new Map();
  const AHEAD = 10, KEEP = 28;
  let lastPainted = -1;
  function warm(i) {
    if (typeof createImageBitmap !== 'function') return;
    const dir = i >= lastPainted ? 1 : -1;
    lastPainted = i;
    for (let k = 0; k <= AHEAD; k++) {
      const j = i + dir * k;
      if (j < 0 || j >= count) break;
      if (!loaded[j] || bitmaps.has(j)) continue;
      bitmaps.set(j, null);
      createImageBitmap(imgs[j]).then((b) => {
        if (destroyed || !bitmaps.has(j)) b.close(); else bitmaps.set(j, b);
      }, () => bitmaps.delete(j));
    }
    if (bitmaps.size > KEEP) {
      for (const [j, b] of bitmaps) {
        if (Math.abs(j - i) > AHEAD + 2) { b?.close(); bitmaps.delete(j); }
        if (bitmaps.size <= KEEP) break;
      }
    }
  }

  function paint(i) {
    const cw = canvas.width, ch = canvas.height;
    const img = bitmaps.get(i) || imgs[i];
    if (!cw || !ch || !img) return;
    warm(i);
    const iw = img.naturalWidth || img.width || frameW, ih = img.naturalHeight || img.height || frameH;
    const s = fit === 'contain' ? Math.min(cw / iw, ch / ih) : Math.max(cw / iw, ch / ih);
    const w = iw * s, h = ih * s;
    ctx.clearRect(0, 0, cw, ch);   // serve alla trasparenza (clip 3)
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
    shown = i;
  }

  function draw(position = want, force = false) {
    if (destroyed) return;
    active = true;
    want = clamp01(position);
    const i = nearest(Math.round(want * (count - 1)));
    if (i < 0) return;
    if (i !== shown || force) paint(i);
  }

  function load(i) {
    return new Promise((resolve) => {
      if (destroyed) return resolve(false);
      if (loaded[i]) return resolve(true);
      const img = new Image();
      img.decoding = 'async';
      pending.add(img);
      const done = (ok) => {
        pending.delete(img);
        if (ok && !destroyed) {
          imgs[i] = img;
          loaded[i] = 1;
          if (active) draw(want);   // se e' piu' vicino alla posizione chiesta, lo mostra
        }
        resolve(ok && !destroyed);
      };
      img.src = url(i);
      if (typeof img.decode === 'function') {
        img.decode().then(() => done(true), () => done(img.complete && img.naturalWidth > 0));
      } else {
        img.onload = () => done(true);
        img.onerror = () => done(false);
      }
    });
  }

  // carica in parallelo, al massimo BATCH alla volta
  async function pool(list) {
    let k = 0;
    const worker = async () => { while (k < list.length && !destroyed) await load(list[k++]); };
    await Promise.all(Array.from({ length: Math.min(BATCH, list.length) }, worker));
  }

  function preload({ from = 0 } = {}) {
    if (started) return started;
    const s = Math.round(clamp01(from) * (count - 1));
    const order = [];
    for (let d = 1; d < count; d++) {
      if (s + d < count) order.push(s + d);
      if (s - d >= 0) order.push(s - d);
    }
    started = load(s)
      .then((ok) => { resolveFirst(ok); return pool(order); })
      .then(() => { resolveReady(!destroyed); return !destroyed; });
    return started;
  }

  function resize() {
    if (destroyed) return;
    const w = host.clientWidth, h = host.clientHeight;
    if (!w || !h) return;
    // oltre la risoluzione del fotogramma non si guadagna nulla: densita' tra 1 e 1,5
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_MAX, Math.max(1, frameW / w));
    const W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (W === canvas.width && H === canvas.height) return;
    canvas.width = W;
    canvas.height = H;
    shown = -1;
    if (active) draw(want, true);
  }
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  ro?.observe(host);
  resize();

  function destroy() {
    destroyed = true;
    ro?.disconnect();
    pending.forEach((img) => { img.src = ''; });
    pending.clear();
    imgs.fill(undefined);
    bitmaps.forEach((b) => b?.close());
    bitmaps.clear();
    canvas.remove();
    resolveFirst(false);
    resolveReady(false);
  }

  return {
    count, canvas, keyed: !!manifest.keyed, variant, width: frameW, height: frameH,
    first, ready, draw, preload, resize, destroy,
  };
}

/* ---------------------------------------------------------------- scroll */

export function init() {
  if (reduced) return;   // resta l'immagine ferma
  const els = document.querySelectorAll('[data-scroll-sequence]');
  if (!els.length) return;
  const { gsap, ScrollTrigger } = motion();
  els.forEach((el) => {
    try { setup(el, gsap, ScrollTrigger); } catch (e) { console.warn('[sequence]', e); }
  });
}

/* Lettore con un VERO file video (versione leggera, 13 nov): lo decodifica la scheda grafica.
   File in /video/<clip>.mp4 e /video/<clip>-mobile.mp4 (fatti con ffmpeg da da-fornire/clip; l'arco ha un
   fotogramma chiave ogni 4, cosi' si puo' "sfogliare" con lo scroll senza scatti).
   Stessa interfaccia di createPlayer: draw(posizione 0..1), first, preload, resize, destroy. */
export function createVideoPlayer(clip, host) {
  const v = document.createElement('video');
  v.muted = true; v.playsInline = true; v.preload = 'auto';
  v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
  v.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover;max-width:none';
  v.src = `${BASE}video/${clip}${isMobile() ? '-mobile' : ''}.mp4`;
  host.appendChild(v);
  let want = 0, seeking = false, destroyed = false;
  const first = new Promise((r) => {
    v.addEventListener('loadeddata', () => r(true), { once: true });
    v.addEventListener('error', () => r(false), { once: true });
  });
  const seek = () => {
    if (destroyed || !v.duration) return;
    const t = Math.min(v.duration - 0.05, Math.max(0, want * v.duration));
    if (Math.abs(v.currentTime - t) < 1 / 48) return;   // gia' su quel fotogramma
    seeking = true;
    v.currentTime = t;
  };
  v.addEventListener('seeked', () => { seeking = false; seek(); });   // si recupera l'ultima posizione chiesta
  return {
    video: v, first, ready: first,
    draw(position = want) { want = clamp01(position); if (!seeking) seek(); },
    preload() { return first; },
    resize() {},
    destroy() { destroyed = true; v.removeAttribute('src'); v.load(); v.remove(); },
  };
}

// esegue fn quando el si avvicina allo schermo (circa uno schermo prima)
function whenNear(el, fn) {
  if (typeof IntersectionObserver !== 'function') return fn();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: '100% 0px 100% 0px' });
  io.observe(el);
}

// riserva: zoom lento con piccolo spostamento, legato al passaggio del riquadro
function fallbackZoom(gsap, el, img) {
  if (!img) return;
  gsap.fromTo(img, { scale: 1, yPercent: 0 }, {
    scale: 1.12, yPercent: -3, ease: 'none',
    scrollTrigger: { trigger: el, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: true },
  });
}

function setup(el, gsap) {
  const clip = el.dataset.scrollSequence;
  const host = el.querySelector('[data-sequence-canvas]');
  const fallback = el.querySelector('[data-sequence-fallback]');
  const img = fallback?.querySelector('img');
  if (!clip || !host || !el.hasAttribute('data-sequence-available')) return fallbackZoom(gsap, el, img);

  const scene = el.closest('[data-scene]');
  const kind = !scene ? 'cross' : scene.id === 'philosophy' ? 'arch' : isMobile() ? 'cross' : scene.id === 'cover' ? 'cover' : 'cross';
  const st = { player: null, p: 0 };

  // disegna la posizione corrente; senza fotogrammi (rete) zoom sull'immagine
  const render = () => {
    if (st.player) st.player.draw(st.p);
    else if (img && kind !== 'arch' && el.classList.contains('seq--fallback')) gsap.set(img, { scale: 1 + 0.12 * st.p, yPercent: -3 * st.p });
  };

  let onPlayer = () => {};
  const showVideo = () => { if (fallback) gsap.to(fallback, { opacity: 0, duration: 0.6, ease: 'none' }); };  // resta nel DOM
  const start = () => {
    const player = createVideoPlayer(clip, host);
    st.player = player;
    onPlayer(player);
    player.first.then((ok) => {
      if (!ok) { st.player = null; player.destroy(); el.classList.add('seq--fallback'); render(); return; }
      player.draw(st.p);
      showVideo();
    });
  };

  if (scene?.id === 'cover') {
    // Copertina (scelta di Daniele): il video gira da solo, in loop, senza scroll.
    // Parte quando e' nello schermo e si ferma quando esce, cosi' non consuma.
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover;max-width:none';
    v.src = `${BASE}video/${clip}${isMobile() ? '-mobile' : ''}.mp4`;
    host.appendChild(v);
    v.addEventListener('playing', showVideo, { once: true });
    v.addEventListener('error', () => v.remove(), { once: true });
    if (typeof IntersectionObserver === 'function') {
      new IntersectionObserver((en) => { en[0].isIntersecting ? v.play().catch(() => {}) : v.pause(); }).observe(el);
    }
    return;
  }

  if (scene?.id === 'philosophy' && !ARCH_SCROLL) {
    // Arco a clic (13 nov): video fermo sul primo fotogramma; al clic lo fa partire divein.js ("enterArch").
    const v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.style.cssText = 'display:block;width:100%;height:100%;object-fit:cover;max-width:none';
    v.src = `${BASE}video/${clip}${isMobile() ? '-mobile' : ''}.mp4`;
    v.dataset.archVideo = '';
    host.appendChild(v);
    v.addEventListener('loadeddata', showVideo, { once: true });
    v.addEventListener('error', () => v.remove(), { once: true });
    return;
  }

  if (kind === 'cross') {
    gsap.fromTo(st, { p: 0 }, {
      p: 1, ease: 'none', onUpdate: render,
      scrollTrigger: { trigger: el, start: 'clamp(top bottom)', end: 'clamp(bottom top)', scrub: true },
    });
    whenNear(el, start);
    return;
  }

  onPlayer = setupArch(el, scene, host, fallback, st, render, gsap);
  whenNear(el, start);
}

/* Arco (clip 2, desktop). Il riquadro .philo__seq si allarga dalla sua posizione a tutto schermo.
   FLIP: misuro il rettangolo di partenza e animo solo transform. Il canvas ha gia' la misura finale
   (16:9 in 'cover' sullo schermo) e riceve una scala inversa, cosi' resta nitido e non si deforma. */
function setupArch(el, scene, host, fallback, st, render, gsap) {
  const text = scene.querySelector('.philo__text');
  const veil = document.createElement('div');
  veil.className = 'seq__veil';
  veil.setAttribute('aria-hidden', 'true');
  el.appendChild(veil);
  el.classList.add('seq--flip');

  const g = { e: 0, ar: 16 / 9, left0: 0, top0: 0, w0: 1, h0: 1, vw: 1, vh: 1, cw: 1, ch: 1, r0: 0, rb: 0 };
  const px = (v) => parseFloat(v) || 0;

  function measure() {
    const media = el.offsetParent || el.parentElement;
    const sRect = scene.getBoundingClientRect();
    const pRect = media.getBoundingClientRect();
    g.w0 = el.offsetWidth || 1;
    g.h0 = el.offsetHeight || 1;
    g.left0 = pRect.left + el.offsetLeft;
    const rel = pRect.top - sRect.top + el.offsetTop;   // posizione dell'arco dentro la scena
    // spostamento del punto di fermo: 0 sul computer (la scena sta in uno schermo), sul telefono l'arco al centro
    g.shift = isMobile() ? Math.max(0, Math.round(rel + (el.offsetHeight || 0) / 2 - window.innerHeight / 2)) : 0;
    g.top0 = rel - g.shift;   // durante il pin la scena ha il bordo alto a -shift
    g.vw = document.documentElement.clientWidth || window.innerWidth;
    g.vh = window.innerHeight;
    g.cw = Math.ceil(Math.max(g.vw, g.vh * g.ar));
    g.ch = Math.ceil(g.cw / g.ar);
    host.style.width = g.cw + 'px';
    host.style.height = g.ch + 'px';
    // raggio visibile dell'arco, come lo riduce il browser (999px in alto, 6px in basso)
    const cs = getComputedStyle(el);
    el.style.borderRadius = '';
    const top = px(cs.borderTopLeftRadius), bottom = px(cs.borderBottomLeftRadius);
    const f = Math.min(1, g.w0 / Math.max(1, top * 2), g.h0 / Math.max(1, top + bottom));
    g.r0 = top * f;
    g.rb = bottom * f;
  }

  function apply(e) {
    const x = g.left0 * (1 - e), y = g.top0 * (1 - e);
    const w = g.w0 + (g.vw - g.w0) * e, h = g.h0 + (g.vh - g.h0) * e;
    const sx = w / g.w0, sy = h / g.h0;
    el.style.transform = e ? `translate(${x - g.left0}px, ${y - g.top0}px) scale(${sx}, ${sy})` : '';
    const r = g.r0 * (1 - e), rb = g.rb * (1 - e);
    el.style.borderRadius = e ? `${r}px ${r}px ${rb}px ${rb}px` : '';
    const k = Math.max(w / g.cw, h / g.ch);
    host.style.transform = `translate(-50%, -50%) scale(${k / sx}, ${k / sy})`;
    if (fallback) {
      const m = Math.max(sx, sy);
      fallback.style.transform = e ? `scale(${m / sx}, ${m / sy})` : '';
    }
  }

  measure();
  apply(0);

  const paper = getComputedStyle(veil).backgroundColor;
  const deep = getComputedStyle(scene).backgroundColor;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: scene, start: () => { measure(); return 'top+=' + g.shift + ' top'; }, end: () => '+=' + Math.round(window.innerHeight * (isMobile() ? 2 : 2.5)),
      pin: true, scrub: true, invalidateOnRefresh: true,
      onRefresh: () => { measure(); apply(g.e); },
    },
  });
  tl.fromTo(st, { p: 0 }, { p: 1, duration: 1, onUpdate: render }, 0);
  tl.fromTo(g, { e: 0 }, { e: 1, duration: 0.55, ease: EASE.inOut, onUpdate: () => apply(g.e) }, 0);
  if (text) tl.fromTo(text, { opacity: 1 }, { opacity: 0, duration: 0.3 }, 0);
  tl.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.8);
  tl.fromTo(scene, { backgroundColor: deep }, { backgroundColor: paper, duration: 0.2 }, 0.8);

  // quando arriva il lettore: rapporto vero dei fotogrammi
  return (player) => {
    if (player.width && player.height) g.ar = player.width / player.height;
    measure();
    apply(g.e);
  };
}
