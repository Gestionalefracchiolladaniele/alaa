/* Visualizzatori 3D delle pagine progetto (02-esperienza.md, "Prova 3D n. 1 e n. 2").
   Questo file e' leggero: three.js arriva con import() solo quando il riquadro si avvicina allo schermo.
     [data-model-viewer]   data-model-kind "configurator" (cucina Creo) | "exploded" (padiglione Kyrenia),
                           data-model-file (.glb in /models/)
       [data-model-stage]    riquadro del 3D;  [data-model-canvas] posto per il canvas
       [data-model-fallback] immagine: resta finche' il modello non e' pronto, poi sfuma
       [data-model-labels]   etichette degli strati (padiglione)
       [data-model-ui]       pannello del configuratore / cursore degli strati
   Senza WebGL, se il .glb non si carica o con "riduci animazioni": resta l'immagine (classe is-static). */
import { reduced, isMobile } from '../motion/core.js';


export function init() {
  document.querySelectorAll('[data-model-viewer]').forEach((el) => {
    try { setup(el); } catch (e) { console.warn('[3d]', e); el.classList.add('is-static'); }
  });
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

function whenNear(el, fn) {
  if (typeof IntersectionObserver !== 'function') return fn();
  const io = new IntersectionObserver((entries) => {
    if (entries.some((e) => e.isIntersecting)) { io.disconnect(); fn(); }
  }, { rootMargin: '50% 0px 50% 0px' });
  io.observe(el);
}

function setup(el) {
  const kind = el.dataset.modelKind;
  const file = el.dataset.modelFile;
  const stage = el.querySelector('[data-model-stage]') || el;
  const host = el.querySelector('[data-model-canvas]');
  const labels = el.querySelector('[data-model-labels]');
  const ui = el.querySelector('[data-model-ui]');
  const ok = kind === 'configurator' || kind === 'exploded';
  if (reduced || !host || !file || !ok || !hasWebGL()) { el.classList.add('is-static'); return; }

  el.classList.add('is-3d');
  let api = null;

  const fail = (e) => {
    if (e) console.warn('[3d]', e);
    try { api?.viewer?.dispose(); } catch { /* niente */ }
    host.textContent = '';
    if (labels) labels.textContent = '';
    if (ui) ui.textContent = '';
    el.classList.remove('is-3d', 'is-ready');
    el.classList.add('is-static');
  };

  // la composizione parte quando il riquadro e' davvero nello schermo
  const whenVisible = (fn) => {
    if (typeof IntersectionObserver !== 'function') return fn();
    const io = new IntersectionObserver((en) => { if (en.some((x) => x.isIntersecting)) { io.disconnect(); fn(); } }, { threshold: 0.35 });
    io.observe(stage);
  };

  const load = async () => {
    try {
      if (kind === 'configurator') {
        const { mountKitchen } = await import('./kitchen.js');
        api = await mountKitchen(host, file);
        kitchenUI(ui, api);
      } else {
        // Padiglione (scelta di Daniele, 13 nov): niente scroll fissato; una barra sotto apre gli strati
        // e il modello si gira trascinandolo, come la cucina.
        const { mountPavilion } = await import('./pavilion.js');
        api = await mountPavilion(host, labels || host, file);
        pavilionUI(ui, api);
      }
      host.setAttribute('role', 'img');
      host.setAttribute('aria-label', kind === 'configurator'
        ? '3D model of the CREO kitchen, Sharjah' : '3D model of the Kyrenia pavilion, exploded into its layers');
      el.classList.add('is-ready', 'is-building');
      whenVisible(() => api.build().then(() => el.classList.remove('is-building')));
    } catch (e) {
      fail(e);
    }
  };
  whenNear(el, load);
}

/* ---------- pulsanti per togliere e rimettere i pezzi (cucina e padiglione) ---------- */
function partsUI(panel, api, title) {
  const h = make('p', 'mv-h', title);
  h.id = 'mv-parts-' + Math.random().toString(36).slice(2, 7);
  const row = make('div', 'mv-row mv-parts');
  row.setAttribute('role', 'group');
  row.setAttribute('aria-labelledby', h.id);
  for (const pt of api.parts) {
    const b = make('button', 'mv-btn mv-part', pt.label);
    b.type = 'button';
    const sync = () => b.setAttribute('aria-pressed', String(!!api.shown[pt.key]));
    b.addEventListener('click', () => { api.toggle(pt.key); sync(); });
    sync();
    row.appendChild(b);
  }
  panel.append(h, row);
}

/* ---------- pannello della cucina: pulsanti veri, raggiungibili da tastiera ---------- */
function make(tag, cls, text) {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
}

function kitchenUI(ui, k) {
  if (!ui) return;
  ui.textContent = '';
  const panel = make('div', 'mv-panel');
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-label', 'Kitchen configurator');
  const refresh = [];
  const update = () => refresh.forEach((f) => f());

  Object.entries(k.options).forEach(([part, opt], n) => {
    const h = make('p', 'mv-h', opt.label);
    h.id = `mv-${part}-${n}`;
    const row = make('div', 'mv-swatches');
    row.setAttribute('role', 'group');
    row.setAttribute('aria-labelledby', h.id);
    const name = make('p', 'mv-name');
    name.setAttribute('aria-live', 'polite');
    for (const [id, c] of Object.entries(opt.choices)) {
      const original = id === opt.original;
      const b = make('button', 'mv-swatch');
      b.type = 'button';
      b.style.setProperty('--sw', c.swatch);
      b.title = c.name;
      b.setAttribute('aria-label', c.name + (original ? " (Alaa's design)" : ''));
      b.addEventListener('click', () => { k.set(part, id); update(); });
      refresh.push(() => {
        const on = k.state[part] === id;
        b.setAttribute('aria-pressed', String(on));
        if (on) name.textContent = c.name + (original ? " · Alaa's design" : '');
      });
      row.appendChild(b);
    }
    panel.append(h, row, name);
  });

  const tools = make('div', 'mv-row');
  const led = make('button', 'mv-btn', 'LED lighting');
  led.type = 'button';
  led.addEventListener('click', () => { k.setLed(!k.state.led); update(); });
  refresh.push(() => led.setAttribute('aria-pressed', String(!!k.state.led)));
  const zin = make('button', 'mv-btn mv-btn--icon', '+');
  zin.type = 'button';
  zin.setAttribute('aria-label', 'Zoom in');
  zin.addEventListener('click', () => k.viewer.zoom(1 / 1.15));
  const zout = make('button', 'mv-btn mv-btn--icon', '−');
  zout.type = 'button';
  zout.setAttribute('aria-label', 'Zoom out');
  zout.addEventListener('click', () => k.viewer.zoom(1.15));
  tools.append(led, zin, zout);

  const reset = make('button', 'btn mv-reset', "Alaa's design");
  reset.type = 'button';
  reset.addEventListener('click', () => { k.reset(); update(); });
  const tip = make('p', 'mv-hint', isMobile() ? 'Swipe sideways to rotate' : 'Drag to rotate · Ctrl + scroll to zoom');

  partsUI(panel, k, 'Show / hide parts');
  panel.append(tools, reset, tip);
  ui.appendChild(panel);
  update();
}

/* ---------- padiglione: barra degli strati + pezzi ---------- */
function pavilionUI(ui, pv) {
  if (!ui) return;
  ui.textContent = '';
  const panel = make('div', 'mv-panel');
  panel.setAttribute('role', 'group');
  panel.setAttribute('aria-label', 'Pavilion layers');
  const label = make('label', 'mv-slider');
  const input = document.createElement('input');
  input.type = 'range';
  input.min = '0';
  input.max = '1';
  input.step = '0.01';
  input.value = '0';
  input.addEventListener('input', () => pv.setProgress(Number(input.value)));
  label.append(make('span', 'visually-hidden', 'Open the pavilion layers'), make('span', 'mv-slider__end', 'Closed'), input, make('span', 'mv-slider__end', 'Layers'));
  panel.appendChild(label);
  partsUI(panel, pv, 'Show / hide layers');
  panel.appendChild(make('p', 'mv-hint', isMobile() ? 'Swipe sideways on the model to rotate' : 'Drag to rotate'));
  ui.appendChild(panel);
}
