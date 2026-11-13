/* Finale: il sipario si richiude (piano/06-tocco-unico.md: "il film finisce come e' cominciato").
   Disegnato in codice, come l'apertura (scelta di Daniele: niente video delle tende).
   Quando Thank You entra nello schermo due pannelli di velluto si chiudono dai lati, UNA volta, DIETRO l'ovale
   con i contatti, che resta sempre leggibile. A tende chiuse la scena e' quella di p30: ovale crema su velluto.
   Animazione a tempo, non legata allo scroll: leggera. Con "riduci animazioni" resta il velluto fisso. */
import { motion, reduced } from './core.js';

export function init() {
  const scene = document.querySelector('[data-curtain-close]');
  if (!scene || typeof IntersectionObserver !== 'function') return;
  // nel finale il menu a libri sparisce (scelta di Daniele)
  new IntersectionObserver((en) => document.documentElement.classList.toggle('at-finale', en[0].isIntersecting), { threshold: 0.25 }).observe(scene);
  if (reduced) return;
  const { gsap } = motion();

  const stage = document.createElement('div');
  stage.className = 'thanks__stage';
  stage.setAttribute('aria-hidden', 'true');
  stage.innerHTML = '<span class="thanks__panel thanks__panel--left"></span><span class="thanks__panel thanks__panel--right"></span>';
  scene.prepend(stage);
  scene.classList.add('has-curtain');
  const [left, right] = stage.children;
  gsap.set(left, { xPercent: -100 });
  gsap.set(right, { xPercent: 100 });

  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    gsap.to([left, right], { xPercent: 0, duration: 2.2, ease: 'power2.inOut', delay: 0.15 });
  }, { threshold: 0.45 });
  io.observe(scene);
}
