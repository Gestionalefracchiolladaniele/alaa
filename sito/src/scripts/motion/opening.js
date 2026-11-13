/* Apertura a sipario (piano/06-tocco-unico.md, "Il ciak iniziale").
   1. Sipario chiuso a tutto schermo, ciak davanti, "Click to begin".
   2. Al clic il ciak batte ed esce di scena.
   3. Le tende si aprono (clip 3 al contrario), poi il sipario viene incontro e supera i bordi dello schermo:
      e' l'effetto di entrare. Intanto la copertina dietro avanza da piu' piccola a grandezza piena.
   4. Chi torna nella stessa visita non la rivede (sessionStorage).

   Chi decide se mostrarla e' il piccolo script in linea accanto a [data-opening] in index.astro
   (cosi' non si vede la copertina per un attimo prima del sipario). Qui la si anima.
   Se i fotogrammi della clip 3 mancano o tardano, si aprono i due pannelli disegnati in CSS. */
import { motion, reduced, lockScroll, unlockScroll } from './core.js';
import * as seq from './sequence.js';

const KEY = 'aa-opened';
const USE_FILM = false; // scelta di Daniele: il sipario e' quello disegnato in codice, non il video (clip 3)
const T = {
  clap: 0.5,        // il ciak batte
  ciakOut: 0.5,     // il ciak esce
  open: 1.6,        // le tende si aprono
  pushAt: 0.8,      // quando il sipario comincia a venire incontro
  push: 1.3,        // durata dell'avanzata
  pushScale: 3.2,   // quanto si ingrandisce: le tende ai lati devono uscire dallo schermo
  coverFrom: 0.9,   // la copertina parte un po' piu' piccola
  cover: 2.2,
  waitFrames: 2500, // attesa massima dei fotogrammi dopo il clic (ms), poi si usa il CSS
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export function init() {
  const root = document.querySelector('[data-opening]');
  if (!root || root.hidden) return; // gia' vista in questa visita, oppure arrivo su un'ancora
  const { gsap, ScrollTrigger } = motion();
  root.onclick = null; // toglie l'uscita di emergenza messa dallo script in linea

  const stage = root.querySelector('[data-opening-stage]');
  const ciak = root.querySelector('[data-ciak]');
  const btn = root.querySelector('[data-opening-begin]');
  const left = root.querySelector('[data-curtain="left"]');
  const right = root.querySelector('[data-curtain="right"]');
  const behind = [document.querySelector('#main'), ...document.querySelectorAll('.booknav')].filter(Boolean);

  lockScroll();
  window.scrollTo(0, 0);
  behind.forEach((el) => { el.inert = true; });
  btn?.focus({ preventScroll: true });

  // Fotogrammi del sipario: si carica per primo l'ultimo (tende chiuse) e lo si disegna sopra i pannelli CSS.
  const playerReady = (async () => {
    try {
      if (!USE_FILM || reduced || !stage || typeof seq.createPlayer !== 'function') return null;
      const p = await seq.createPlayer('clip-3', stage, { fit: 'cover' });
      if (!p) return null;
      p.preload?.({ from: 1 });
      await p.first;
      p.draw(1);
      root.classList.add('opening--film');
      return p;
    } catch {
      return null;
    }
  })();

  let started = false;
  let player = null;

  function finish() {
    root.hidden = true;
    document.documentElement.classList.remove('opening-on');
    behind.forEach((el) => { el.inert = false; });
    unlockScroll();
    player?.destroy?.();
    ScrollTrigger.refresh();
    document.dispatchEvent(new Event('opening:done')); // reveal.js aspetta questo per le scritte della copertina
  }

  async function begin() {
    if (started) return;
    started = true;
    try { sessionStorage.setItem(KEY, '1'); } catch { /* navigazione privata: la rivedra' */ }

    if (reduced) { // solo una dissolvenza
      gsap.to(root, { autoAlpha: 0, duration: 0.4, onComplete: finish });
      return;
    }

    // 1. Il ciak batte ed esce (parte subito, cosi' il clic ha una risposta immediata)
    const clap = gsap.timeline();
    if (btn) clap.to(btn, { autoAlpha: 0, duration: 0.25 }, 0);
    if (ciak) {
      clap.to(ciak, { rotation: -7, duration: 0.18, ease: 'power2.out', transformOrigin: '10% 35%' }, 0)
        .to(ciak, { rotation: 0, duration: 0.09, ease: 'power4.in' }, 0.2)
        .to(ciak, { scale: 1.05, duration: 0.07, yoyo: true, repeat: 1, ease: 'power1.out' }, 0.29)
        .to(ciak, { y: '22vh', scale: 0.9, autoAlpha: 0, duration: T.ciakOut, ease: 'power2.in' }, T.clap);
    }

    // 2. Intanto si aspettano i fotogrammi (di norma sono gia' pronti)
    player = await Promise.race([
      playerReady.then(async (p) => { if (p) await Promise.race([p.ready, wait(T.waitFrames)]); return p; }),
      wait(T.waitFrames + 500).then(() => null),
    ]);
    await clap.then();

    // 3. La copertina dietro: ogni blocco cresce verso il centro dello schermo, come un'unica immagine
    const kids = [...document.querySelectorAll('#cover > *')];
    const cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    kids.forEach((k) => {
      const r = k.getBoundingClientRect();
      gsap.set(k, { transformOrigin: `${cx - r.left}px ${cy - r.top}px` });
    });

    root.classList.add('opening--open');
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(kids, { clearProps: 'transform,transformOrigin' });
        finish();
      },
    });
    tl.fromTo(kids, { scale: T.coverFrom }, { scale: 1, duration: T.cover, ease: 'power3.out' }, 0);

    if (player) {
      const o = { p: 1 };
      tl.to(o, { p: 0, duration: T.open, ease: 'power2.inOut', onUpdate: () => player.draw(o.p) }, 0)
        .to(stage, { scale: T.pushScale, duration: T.push, ease: 'power2.in', force3D: true }, T.pushAt)
        .to(stage, { autoAlpha: 0, duration: 0.25, ease: 'none' }, T.pushAt + T.push - 0.25);
    } else {
      // riserva: i due pannelli in CSS scorrono ai lati e si stringono come stoffa raccolta
      tl.to(left, { xPercent: -104, scaleX: 0.7, transformOrigin: '0 50%', duration: T.open + 0.4, ease: 'power2.inOut' }, 0)
        .to(right, { xPercent: 104, scaleX: 0.7, transformOrigin: '100% 50%', duration: T.open + 0.4, ease: 'power2.inOut' }, 0);
    }
  }

  root.addEventListener('click', begin);
  root.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); begin(); }
  });
}
