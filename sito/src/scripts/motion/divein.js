/* Le porte "entrare" (piano/06-tocco-unico.md), versione a clic (scelta di Daniele, 12 nov sera).

   Ogni copertina di sezione e' un cancello: quello che viene dopo NON esiste nella pagina finche' non si
   clicca la porta (lo schizzo, il quadro, la polaroid, il globo...) o la scritta "Enter ... ↓".
   Al clic: tutto si ingrandisce verso la porta finche' riempie lo schermo, un velo copre, e si arriva
   all'inizio del contenuto della sezione. Scorrere non basta per passare: la pagina finisce alla copertina.
   Una volta entrati, quella parte resta aperta (si puo' tornare su e giu' scorrendo).

   Nessun effetto legato allo scroll: e' la versione leggera.

   Agganci (messi da SectionCover.astro):
     [data-divein]          la copertina; data-divein-next = selettore del contenuto di arrivo
     [data-divein-stage]    il contenuto che si ingrandisce
     [data-divein-door]     la porta; se dentro c'e' .cover__door, il rettangolo di arrivo e' quello
   Le copertine con una sequenza video dentro (copertina, arco) non sono cancelli.

   Per cambiare il ritmo di TUTTE le porte: i numeri in RHYTHM e la curva "enter" in core.js. */
import { motion, reduced, isMobile, fullMotion } from './core.js';

const RHYTHM = {
  enter: 1.25,     // durata dell'ingresso (secondi)
  overshoot: 1.04, // la porta supera appena i bordi dello schermo
  maxScale: 14,
  veilAt: 0.55,    // quando comincia il velo (0–1 dell'ingresso)
  arrive: 0.7,     // durata della dissolvenza di arrivo (secondi)
  // usati solo dalla porta della copertina legata allo scroll (addCoverDoor)
  pin: 1.0, veilFrom: 0.58, veilTo: 0.97,
};

/* Posizione di un elemento dentro un antenato, ignorando le trasformazioni in corso. */
function boxIn(el, root) {
  let x = 0, y = 0, n = el;
  while (n && n !== root) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

/* Dove deve finire lo stage perche' la porta riempia lo schermo (origine in alto a sinistra). */
function target(stage, door) {
  const vw = window.innerWidth, vh = window.innerHeight;
  const d = boxIn(door, stage);
  if (!d.w || !d.h) return { scale: 1, x: 0, y: 0 };
  const s0 = stage.getBoundingClientRect(); // lo stage non e' trasformato in questo momento
  const scale = Math.min(RHYTHM.maxScale, Math.max(vw / d.w, vh / d.h) * RHYTHM.overshoot);
  return { scale, x: vw / 2 - s0.left - scale * (d.x + d.w / 2), y: vh / 2 - s0.top - scale * (d.y + d.h / 2) };
}

function nextColour(next) {
  let n = next;
  while (n && n !== document.body) {
    const c = getComputedStyle(n).backgroundColor;
    if (c && c !== 'transparent' && !/rgba\(.*,\s*0\)$/.test(c)) return c;
    n = n.parentElement;
  }
  return getComputedStyle(document.documentElement).getPropertyValue('--paper').trim() || '#f8edd9';
}

/* Tutto cio' che nella pagina viene DOPO una copertina: i suoi fratelli successivi e le scene successive. */
function after(cover) {
  const list = [];
  for (let n = cover.nextElementSibling; n; n = n.nextElementSibling) list.push(n);
  const scene = cover.closest('[data-scene]') || cover.parentElement;
  for (let n = scene?.nextElementSibling; n; n = n.nextElementSibling) list.push(n);
  return list;
}

export function init() {
  const { gsap } = motion();
  const gates = [...document.querySelectorAll('[data-divein]')]
    .filter((c) => (c.querySelector('[data-divein-stage]') && !c.querySelector('[data-scroll-sequence]')) || isArch(c));
  if (!gates.length) return;

  let open = 0;      // quanti cancelli sono gia' stati attraversati
  let busy = false;

  /* Mostra solo cio' che sta prima del primo cancello chiuso. */
  function apply() {
    document.querySelectorAll('[data-gate-hidden]').forEach((n) => { n.hidden = false; n.removeAttribute('data-gate-hidden'); });
    const gate = gates[open];
    gates.forEach((g, i) => g.classList.toggle('gate--closed', i >= open));
    if (!gate) return;
    after(gate).forEach((n) => { if (!n.hidden) { n.hidden = true; n.setAttribute('data-gate-hidden', ''); } });
  }

  const veil = document.createElement('div');
  veil.className = 'dive__veil dive__veil--screen';
  veil.setAttribute('aria-hidden', 'true');
  document.body.append(veil);

  function arrive(next) {
    apply();
    const y = next.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, y), behavior: 'instant' });
    if (!next.hasAttribute('tabindex')) next.setAttribute('tabindex', '-1');
    next.focus({ preventScroll: true });
  }

  function enter(i) {
    const cover = gates[i];
    const next = document.querySelector(cover.dataset.diveinNext || '');
    if (busy || !next) return;
    if (i < open) { next.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); return; } // gia' aperto
    open = i + 1;
    if (reduced) { arrive(next); return; }
    if (isArch(cover)) {
      busy = true;
      apply();
      veil.style.background = nextColour(next);
      enterArch(cover, veil, gsap).then(() => {
        arrive(next);
        gsap.to(veil, { autoAlpha: 0, duration: RHYTHM.arrive, ease: 'power1.out', onComplete: () => { busy = false; } });
      });
      return;
    }

    busy = true;
    const stage = cover.querySelector('[data-divein-stage]');
    const doorEl = cover.querySelector('[data-divein-door]');
    const rectEl = !doorEl ? null : doorEl.matches('.cover__door') ? doorEl : doorEl.querySelector('.cover__door') || doorEl;
    const zoom = rectEl && !isMobile();   // sul telefono solo la dissolvenza
    cover.classList.add('dive--active');
    veil.style.background = nextColour(next);
    const to = zoom ? target(stage, rectEl) : null;

    const tl = gsap.timeline({
      onComplete: () => {
        arrive(next);
        gsap.set(stage, { clearProps: 'transform' });
        cover.classList.remove('dive--active');
        gsap.to(veil, { autoAlpha: 0, duration: RHYTHM.arrive, ease: 'power1.out', onComplete: () => { busy = false; } });
      },
    });
    const D = zoom ? RHYTHM.enter : 0.45;
    if (zoom) tl.to(stage, { scale: to.scale, x: to.x, y: to.y, duration: D, ease: 'enter', force3D: true }, 0);
    tl.fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: D * (1 - RHYTHM.veilAt), ease: 'power1.in' }, D * RHYTHM.veilAt);
  }

  gates.forEach((cover, i) => {
    cover.classList.add('dive');
    if (isArch(cover)) {   // l'arco: si clicca il riquadro o il pulsante sotto
      const btn = document.createElement('a');
      btn.className = 'arch__next label';
      btn.href = cover.dataset.diveinNext || '#';
      btn.innerHTML = 'Through the arch <span aria-hidden="true">↓</span>';
      cover.after(btn);
      cover.addEventListener('click', () => enter(i));
      btn.addEventListener('click', (e) => { e.preventDefault(); enter(i); });
      return;
    }
    const doorEl = cover.querySelector('[data-divein-door]');
    const link = cover.querySelector('.cover__next');
    doorEl?.classList.add('dive__door');
    doorEl?.addEventListener('click', () => enter(i));
    link?.addEventListener('click', (e) => { e.preventDefault(); enter(i); });
  });

  /* Menu a libri e altri collegamenti interni: se la meta e' dietro un cancello chiuso, lo si apre senza animazione. */
  function reveal(el) {
    if (!el) return;
    let changed = false;
    gates.forEach((g, i) => {
      if (i >= open && (g.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING) && !g.contains(el)) { open = i + 1; changed = true; }
    });
    if (changed) apply();
  }
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || a.classList.contains('cover__next')) return;
    const id = decodeURIComponent(a.getAttribute('href').slice(1));
    const el = id && document.getElementById(id);
    if (!el) return;
    const before = open;
    reveal(el);
    if (open !== before) { e.preventDefault(); el.scrollIntoView(); history.replaceState(null, '', '#' + id); }
  }, true);

  apply();
  if (location.hash.length > 1) {
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    reveal(el);
    el?.scrollIntoView();
  }

  enterCursor(gates, gsap);
}

/* L'arco di Philosophy: il riquadro con il video (clip 2). */
const ARCH_CLICK = false;   // true = arco a clic (enterArch); false = arco legato allo scroll (sequence.js)
function isArch(c) { return ARCH_CLICK && !!c.closest('#philosophy') && !!c.querySelector('[data-scroll-sequence]'); }

/* Attraversare l'arco, in due tempi:
   1. un video identico a quello dell'arco gli si appoggia sopra (stessa posizione, stessa forma, fermo sul primo
      fotogramma) e si ALLARGA fino a tutto schermo: niente salti, l'inquadratura cambia piano piano;
   2. solo quando e' a tutto schermo il video PARTE e scorre fino al mare; negli ultimi istanti il velo crema
      chiude e si arriva a Interior. Il video lo decodifica la scheda grafica: leggero. */
const ARCH = {
  grow: 1.3,     // secondi per allargarsi a tutto schermo
  pause: 0.15,   // attimo fermo prima che parta il video
  speed: 1,      // velocita' del video (1 = normale, circa 5 secondi; 1.2 = piu' veloce)
  veil: 0.9,     // secondi di dissolvenza nel crema, alla fine del video
};
function enterArch(cover, veil, gsap) {
  const seq = cover.querySelector('[data-scroll-sequence]') || cover;
  const src = cover.querySelector('video')?.currentSrc;
  if (!src) return gsap.fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }).then();
  const box = seq.getBoundingClientRect();
  const vw = window.innerWidth, vh = window.innerHeight;

  const layer = document.createElement('div');
  layer.className = 'arch__layer';
  layer.setAttribute('aria-hidden', 'true');
  const v = document.createElement('video');
  v.muted = true; v.playsInline = true; v.preload = 'auto'; v.src = src;
  v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
  layer.appendChild(v);
  const r0 = box.width / 2;   // l'arco: tondo in alto, quasi dritto in basso
  const g = { x: box.left, y: box.top, w: box.width, h: box.height, r: r0, rb: 6 };
  const place = () => {
    layer.style.left = g.x + 'px'; layer.style.top = g.y + 'px';
    layer.style.width = g.w + 'px'; layer.style.height = g.h + 'px';
    layer.style.borderRadius = `${g.r}px ${g.r}px ${g.rb}px ${g.rb}px`;
  };
  place();
  layer.style.visibility = 'hidden';
  document.body.appendChild(layer);

  return new Promise((resolve) => {
    let done = false;
    const end = () => { if (done) return; done = true; layer.remove(); resolve(); };
    const go = () => {
      layer.style.visibility = '';
      const tl = gsap.timeline();
      tl.to(g, { x: 0, y: 0, w: vw, h: vh, r: 0, rb: 0, duration: ARCH.grow, ease: 'power2.inOut', onUpdate: place })
        .add(() => {
          v.playbackRate = ARCH.speed;
          v.play().catch(() => {});
          const dur = (v.duration || 5) / ARCH.speed;
          gsap.fromTo(veil, { autoAlpha: 0 }, {
            autoAlpha: 1, duration: ARCH.veil, ease: 'power1.in', delay: Math.max(0, dur - ARCH.veil),
            onComplete: end,
          });
        }, '+=' + ARCH.pause);
    };
    // si parte solo quando il primo fotogramma e' pronto, cosi' la sovrapposizione e' identica all'arco
    const ready = () => { v.currentTime = 0; v.addEventListener('seeked', go, { once: true }); };
    if (v.readyState >= 2) ready(); else v.addEventListener('loadeddata', ready, { once: true });
    v.addEventListener('error', end, { once: true });
    setTimeout(() => { if (layer.style.visibility === 'hidden') end(); }, 4000);   // rete lenta: si salta l'effetto
  });
}

/* Anello dorato "Enter" che segue il mouse sopra una porta. */
function enterCursor(gates, gsap) {
  if (reduced || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const ring = document.createElement('div');
  ring.className = 'enter-cursor';
  ring.setAttribute('aria-hidden', 'true');
  ring.innerHTML = '<span>Enter</span>';
  document.body.append(ring);
  const xTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3.out' });
  const yTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3.out' });
  let placed = false;
  for (const cover of gates) {
    const doorEl = cover.querySelector('[data-divein-door]');
    if (!doorEl) continue;
    doorEl.addEventListener('pointerenter', (e) => {
      if (!placed) { gsap.set(ring, { x: e.clientX, y: e.clientY }); placed = true; }
      ring.classList.add('is-on');
    });
    doorEl.addEventListener('pointerleave', () => ring.classList.remove('is-on'));
    doorEl.addEventListener('pointermove', (e) => { xTo(e.clientX); yTo(e.clientY); });
    doorEl.addEventListener('click', () => ring.classList.remove('is-on'));
  }
}

/* Porta della copertina legata allo scroll: usata solo se i video sono accesi (/?on=sequence).
   Finita la clip della pellicola, si entra in un suo fotogramma e si arriva ad About. */
export function addCoverDoor(tl, scene, at, clipScreens) {
  const hero = scene.querySelector('.hero[data-divein]');
  const door = hero?.querySelector('[data-divein-door]');
  const next = document.querySelector(hero?.dataset.diveinNext || '');
  if (!hero || !door || !next || !fullMotion()) return 0;

  const veil = document.createElement('div');
  veil.className = 'dive__veil';
  veil.setAttribute('aria-hidden', 'true');
  veil.style.background = nextColour(next);
  scene.append(veil);
  scene.classList.add('dive');
  const others = [...scene.children].filter((c) => c !== hero && c !== veil && !c.matches('.scene-label'));

  const to = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const h = boxIn(hero, scene), d = boxIn(door, hero);
    if (!d.w || !d.h) return { scale: 1, x: 0, y: 0 };
    const scale = Math.min(RHYTHM.maxScale, Math.max(vw / d.w, vh / d.h) * RHYTHM.overshoot);
    return { scale, x: vw / 2 - h.x - scale * (d.x + d.w / 2), y: vh / 2 - h.y - scale * (d.y + d.h / 2) };
  };
  const D = RHYTHM.pin / clipScreens;
  tl.to(hero, { scale: () => to().scale, x: () => to().x, y: () => to().y, ease: 'enter', duration: D, force3D: true }, at)
    .to(others, { autoAlpha: 0, ease: 'none', duration: D * 0.3 }, at)
    .fromTo(veil, { autoAlpha: 0 }, { autoAlpha: 1, ease: 'power1.in', duration: D * (RHYTHM.veilTo - RHYTHM.veilFrom) }, at + D * RHYTHM.veilFrom)
    .to({}, { duration: D * (1 - RHYTHM.veilTo) }, at + D * RHYTHM.veilTo);
  return RHYTHM.pin;
}
