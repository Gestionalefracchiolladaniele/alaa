/* Base del movimento. Tutto cio' che si muove nel sito passa da qui.
   - avvia Lenis (scroll morbido) e GSAP ScrollTrigger UNA volta per pagina;
   - espone i valori comuni (curve, durate) cosi' ogni effetto ha lo stesso ritmo;
   - rispetta "riduci animazioni": in quel caso niente Lenis, niente pin, solo dissolvenze.

   Uso:
     import { motion, reduced, isMobile, EASE, lockScroll, unlockScroll } from './core.js';
     const { gsap, ScrollTrigger, lenis } = motion();
*/
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/** L'utente ha chiesto meno animazioni: solo dissolvenze, nessuna sezione fissata. */
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Schermo stretto: le sezioni fissate diventano scorrimento normale. Stessa soglia del CSS (900px). */
export const isMobile = () => window.matchMedia('(max-width: 899px)').matches;

/** Effetti "pieni" (pin, sequenze, porte): solo desktop e senza "riduci animazioni". */
export const fullMotion = () => !reduced && !isMobile();

/** Curve comuni. "enter" e' la firma del sito: parte piano, accelera, atterra morbido. */
export const EASE = {
  enter: 'enter',        // registrata sotto (CustomEase non serve: e' una funzione)
  soft: 'power2.out',
  inOut: 'power3.inOut',
  curtain: 'power2.inOut',
};

/* Curva "entrare": lenta nel primo terzo (si guarda la porta), rapida al centro (la si attraversa),
   morbida in arrivo. E' una smootherstep leggermente spostata in avanti. */
gsap.registerEase('enter', (t) => {
  const u = Math.pow(t, 1.35);
  return u * u * u * (u * (u * 6 - 15) + 10);
});

/** Sensazione dello scroll: i due numeri da ritoccare. */
export const SCROLL = { inertia: 0.06, wheel: 1 };

/** Versione leggera (scelta di Daniele, 12 nov sera): le parti pesanti sono SPENTE.
    Si riaccendono per prova dall'indirizzo: /?on=lenis,reveal,sequence  (scroll morbido, testi animati, video). */
export const ON = new Set((new URLSearchParams(location.search).get('on') || '').split(',').filter(Boolean));

let state = null;

/** Avvia (una sola volta) e restituisce { gsap, ScrollTrigger, lenis }. lenis e' null con "riduci animazioni". */
export function motion() {
  if (state) return state;
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: EASE.soft, duration: 0.8 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  let lenis = null;
  if (!reduced && ON.has('lenis')) {
    // INERZIA dello scroll: dopo aver lasciato la rotella la pagina continua a scivolare e rallenta piano.
    // lerp piu' basso = scivola piu' a lungo (0.1 quasi niente, 0.06 leggero, 0.04 molto lungo).
    lenis = new Lenis({ lerp: SCROLL.inertia, wheelMultiplier: SCROLL.wheel, anchors: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  document.documentElement.classList.add(reduced ? 'motion-reduced' : 'motion-on');

  // Le immagini lazy cambiano le altezze: ricalcola i punti di scroll quando tutto e' caricato.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  state = { gsap, ScrollTrigger, lenis };
  return state;
}

/** Blocca / sblocca lo scroll della pagina (apertura a sipario, lightbox). */
export function lockScroll() {
  const { lenis } = motion();
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
}
export function unlockScroll() {
  const { lenis } = motion();
  document.documentElement.style.overflow = '';
  lenis?.start();
}
