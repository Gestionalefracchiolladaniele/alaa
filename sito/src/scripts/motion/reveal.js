/* Testi e piccoli movimenti (06-tocco-unico.md, "Altri tocchi"). Una volta sola per elemento, sobrio.
     [data-reveal-lines]            il paragrafo compare riga per riga
     [data-counter]                 conta da 0 al valore
     [data-two-tone] [data-accent]  la parte bordeaux arriva dopo, come una pennellata
     [data-swoosh]                  il tratto bordeaux si disegna
     [data-cover-zoom]              zoom lento della copertina, legato allo scroll
     [data-handwrite]               il corsivo "si scrive da solo", parola per parola
   Con "riduci animazioni" non fa nulla: tutto resta visibile.
   Gli stati nascosti si applicano qui, nello stesso momento in cui si preparano le animazioni:
   se lo script non parte, il testo resta visibile. */
import { motion, reduced, EASE } from './core.js';
import { SplitText } from 'gsap/SplitText';

const START = 'top 85%';

export function init() {
  if (reduced) return;
  const { gsap, ScrollTrigger } = motion();
  gsap.registerPlugin(SplitText);
  const ctx = { gsap, ScrollTrigger };
  for (const fn of [revealLines, counters, twoTone, swoosh, coverZoom, handwrite]) {
    try { fn(ctx); } catch (e) { console.warn('[reveal]', e); }
  }
}

/* Nella copertina il testo e' sotto il sipario: parte quando l'apertura e' finita.
   L'apertura lo segnala con document.dispatchEvent(new Event('opening:done')),
   oppure nascondendo / togliendo [data-opening]. */
let opened = null;
function afterOpening(fn) {
  if (!opened) {
    opened = new Promise((resolve) => {
      const op = document.querySelector('[data-opening]');
      const closed = () => {
        if (!op || !op.isConnected || op.hidden) return true;
        const cs = getComputedStyle(op);
        return cs.display === 'none' || cs.visibility === 'hidden';
      };
      if (closed()) return resolve();
      document.addEventListener('opening:done', () => resolve(), { once: true });
      const mo = new MutationObserver(() => { if (closed()) { mo.disconnect(); resolve(); } });
      mo.observe(op, { attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
      if (op.parentNode) mo.observe(op.parentNode, { childList: true });
    });
  }
  opened.then(fn);
}

// esegue play una volta, quando el entra nello schermo
function onEnter({ ScrollTrigger }, el, play, start = START) {
  const go = () => ScrollTrigger.create({ trigger: el, start, once: true, onEnter: play });
  if (el.closest('#cover')) afterOpening(go); else go();
}

/* ---------- righe ---------- */
// Le righe restano testo vero dentro il paragrafo (aria: 'none'): lo screen reader lo legge intero.
// Non uso aria-label: su <p> molti lettori lo ignorano.
function revealLines({ gsap }) {
  document.querySelectorAll('[data-reveal-lines]').forEach((el) => {
    SplitText.create(el, {
      type: 'lines', mask: 'lines', linesClass: 'rl-line', aria: 'none', autoSplit: true,
      // l'animazione restituita viene riallineata da SplitText se il testo si ridivide (font, resize)
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 100, opacity: 0, duration: 0.9, stagger: 0.09, ease: EASE.soft,
        scrollTrigger: { trigger: el, start: START, once: true },
      }),
    });
  });
}

/* ---------- contatori ---------- */
function counters(ctx) {
  const { gsap } = ctx;
  document.querySelectorAll('[data-counter]').forEach((el) => {
    if (el.dataset.counterReady) return;
    const text = el.textContent.trim();
    const m = text.match(/\d[\d,]*(\.\d+)?/);
    if (!m) return;
    const raw = m[0];
    const value = parseFloat(raw.replace(/,/g, ''));
    if (!Number.isFinite(value) || value <= 0) return;
    if (/^(19|20)\d\d$/.test(raw)) return;   // un anno non si conta
    const dec = m[1] ? m[1].length - 1 : 0;
    const commas = raw.includes(',');
    const before = text.slice(0, m.index), after = text.slice(m.index + raw.length);
    const fmt = (v) => before + (commas
      ? v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec })
      : v.toFixed(dec)) + after;

    // numero animato nascosto allo screen reader, valore finale in testo nascosto alla vista
    const live = document.createElement('span');
    live.setAttribute('aria-hidden', 'true');
    live.className = 'counter__live';
    live.textContent = text;
    const sr = document.createElement('span');
    sr.className = 'visually-hidden';
    sr.textContent = text;
    el.textContent = '';
    el.append(live, sr);
    el.dataset.counterReady = '1';
    live.style.minWidth = Math.ceil(live.getBoundingClientRect().width) + 'px';   // niente salti di larghezza
    live.textContent = fmt(0);

    const o = { v: 0 };
    onEnter(ctx, el, () => gsap.to(o, {
      v: value, duration: 1.6, ease: 'power2.out',
      onUpdate: () => { live.textContent = fmt(dec ? o.v : Math.round(o.v)); },
      onComplete: () => { live.textContent = text; },
    }));
  });
}

/* ---------- titoli in due colori ---------- */
// Maschera a bordo morbido che scopre la parte bordeaux da sinistra a destra (variabile --wipe).
function twoTone(ctx) {
  const { gsap } = ctx;
  document.querySelectorAll('[data-two-tone] [data-accent]').forEach((el) => {
    el.classList.add('tt-wipe');
    gsap.set(el, { '--wipe': '0%' });
    onEnter(ctx, el.closest('[data-two-tone]') || el, () => gsap.to(el, {
      '--wipe': '140%', duration: 1.1, delay: 0.35, ease: 'power2.inOut',
      onComplete: () => el.classList.remove('tt-wipe'),
    }));
  });
}

/* ---------- tratto bordeaux ---------- */
function swoosh(ctx) {
  const { gsap } = ctx;
  document.querySelectorAll('[data-swoosh]').forEach((svg) => {
    const paths = [...svg.querySelectorAll('path')].filter((p) => typeof p.getTotalLength === 'function');
    if (!paths.length) return;
    paths.forEach((p) => {
      const len = Math.ceil(p.getTotalLength()) + 2;
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
    });
    onEnter(ctx, svg, () => gsap.to(paths, { strokeDashoffset: 0, duration: 1.4, delay: 0.5, ease: 'power2.inOut' }));
  });
}

/* ---------- zoom lento delle copertine ---------- */
// Uso la proprieta' CSS `scale` (via --cz), separata da `transform`: chi anima la porta puo'
// usare transform sullo stesso elemento senza conflitti.
function coverZoom({ gsap }) {
  document.querySelectorAll('[data-cover-zoom]').forEach((el) => {
    // versione leggera (13 nov): animazione CSS legata allo scroll, la gestisce il browser (motion.css, .cz-css).
    // Dove non e' supportata l'immagine resta ferma.
    el.classList.add('cz-css');
  });
}

/* ---------- corsivo che si scrive da solo ---------- */
// Divide in parole (elementi interni: il transform ruotato dell'elemento resta suo) e scopre ogni
// parola con una maschera morbida, una dopo l'altra, seguendo le righe. Durata 1,2–2,4 s.
function handwrite(ctx) {
  const { gsap } = ctx;
  document.querySelectorAll('[data-handwrite]').forEach((el) => {
    const split = SplitText.create(el, { type: 'words', wordsClass: 'hw-word', aria: 'none' });
    const words = split.words;
    if (!words.length) return;
    const len = words.map((w) => Math.max(1, w.textContent.length));
    const total = len.reduce((a, b) => a + b, 0);
    const dur = Math.min(2.4, Math.max(1.2, total * 0.055));
    gsap.set(words, { '--wipe': '0%' });
    el.classList.add('hw-ready');
    const tl = gsap.timeline({ paused: true, onComplete: () => el.classList.add('hw-done') });
    words.forEach((w, i) => tl.to(w, { '--wipe': '140%', duration: len[i] / total, ease: 'none' }));
    onEnter(ctx, el, () => gsap.to(tl, { progress: 1, duration: dur, delay: 0.2, ease: 'sine.inOut' }));
  });
}
