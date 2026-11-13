// Padiglione di Kyrenia (p14): gli strati si separano in base a un valore 0..1 (lo scroll, o il cursore su mobile).
// Portato da tools/prototipi/3d/pavilion.js: forma, strati, colori e luci invariati.
import { createViewer } from './viewer-core.js';
import { assemble, setShown } from './assemble.js';

// nome nel file .glb -> di quanto sale lo strato e in quale tratto dell'avanzamento
const LAYERS = [
  { key: 'skin', objects: ['layer-skin'], lift: 9.5, from: 0.0, to: 0.55,
    title: 'Timber Slat Skin', note: 'weathered hardwood' },
  { key: 'membrane', objects: ['layer-membrane'], lift: 4.8, from: 0.2, to: 0.75,
    title: 'Waterproof Membrane', note: 'lightweight, UV resistant' },
  { key: 'ribs', objects: ['layer-ribs', 'layer-glazing', 'layer-glazing-frame'], lift: 0, from: 0, to: 1,
    title: 'Curved Ribs', note: 'laminated timber' },
  { key: 'base', objects: ['layer-base'], lift: -2.2, from: 0.5, to: 1.0,
    title: 'Base / Plinth', note: 'concrete with stone finish' },
];
const ease = (x) => { x = Math.min(1, Math.max(0, x)); return x * x * (3 - 2 * x); };

// etichetta HTML con linea di richiamo (la linea e il punto sono in CSS: .tag3d)
function tag(layer, title, note) {
  const el = document.createElement('div');
  el.className = 'tag3d';
  const b = document.createElement('b');
  b.textContent = title;
  const s = document.createElement('span');
  s.textContent = note;
  el.append(b, s);
  layer.appendChild(el);
  return el;
}

export async function mountPavilion(container, labelLayer, url) {
  const v = createViewer(container, {
    background: '#efe3cf',
    position: [19, 9, 36],
    target: [12, 3.2, 0],
    limits: { minPolarAngle: 0.5, maxPolarAngle: 1.5, minDistance: 22, maxDistance: 60 },
  });
  const { THREE } = v;
  let gltf;
  try { gltf = await v.load(url); } catch (e) { v.dispose(); throw e; }
  v.scene.add(gltf.scene);
  const sun = new THREE.DirectionalLight('#fff3df', 1.6);
  sun.position.set(-8, 20, 14);
  v.scene.add(sun);

  const byName = {};
  gltf.scene.traverse((o) => {
    if (o.isMesh) {
      byName[o.name] = o;
      o.material.side = THREE.DoubleSide;
      if (o.material.name === 'glass') Object.assign(o.material, { transparent: true, depthWrite: false });
    }
  });

  // etichette: un punto di aggancio per strato, sul lato destro del suo ingombro
  const labels = LAYERS.map((layer) => {
    const objs = layer.objects.map((n) => byName[n]).filter(Boolean);
    const box = new THREE.Box3();
    objs.forEach((o) => box.expandByObject(o));
    const anchor = box.isEmpty()
      ? new THREE.Vector3(12, 3, 0)
      : new THREE.Vector3(box.max.x - 2.5, box.max.y * (layer.key === 'base' ? 1 : 0.55), box.min.z + 2);
    const el = tag(labelLayer, layer.title, layer.note);
    return { layer, objs, anchor, el, dy: 0 };
  });
  // l'intercapedine non ha geometria: sta tra doghe e membrana
  const cavity = tag(labelLayer, 'Air Cavity', 'natural ventilation');

  let progress = 0;
  let built = false;
  const p = new THREE.Vector3();
  const place = (el, point) => {
    p.copy(point).project(v.camera);
    const w = container.clientWidth, h = container.clientHeight;
    el.style.transform = `translate(${((p.x + 1) / 2) * w}px, ${((1 - p.y) / 2) * h}px)`;
    el.style.opacity = built && p.z < 1 ? Math.min(1, progress * 4) : 0;
  };
  const pts = {};
  v.beforeRender.push(() => {
    for (const l of labels) {
      pts[l.layer.key] = l.anchor.clone().setY(l.anchor.y + l.dy);
      place(l.el, pts[l.layer.key]);
    }
    if (pts.skin && pts.membrane) place(cavity, pts.skin.clone().lerp(pts.membrane, 0.5));
  });

  function setProgress(value) {
    progress = Math.min(1, Math.max(0, value));
    for (const l of labels) {
      const { lift, from, to } = l.layer;
      l.dy = lift * ease((progress - from) / (to - from));
      if (built) l.objs.forEach((o) => { o.position.y = l.dy; });       // nel .glb l'asse verticale e' Y
    }
    v.invalidate();
  }

  // rotazione attorno al centro (azimut, in radianti) mantenendo distanza e altezza
  const sph = new THREE.Spherical();
  const off = new THREE.Vector3();
  const getTurn = () => { off.copy(v.camera.position).sub(v.controls.target); sph.setFromVector3(off); return sph.theta; };
  function setTurn(theta) {
    off.copy(v.camera.position).sub(v.controls.target);
    sph.setFromVector3(off);
    sph.theta = theta;
    off.setFromSpherical(sph);
    v.camera.position.copy(v.controls.target).add(off);
    v.controls.update();
    v.invalidate();
  }

  setProgress(0);
  // composizione: dalla base in su, ogni strato scende dall'alto
  const order = ['base', 'ribs', 'membrane', 'skin'].map((k) => labels.find((l) => l.layer.key === k)?.objs || []).filter((g) => g.length);
  order.flat().forEach((o) => { o.visible = false; });
  const shown = {};
  LAYERS.forEach((l) => { shown[l.key] = true; });
  function toggle(key) {
    const l = labels.find((x) => x.layer.key === key);
    if (!l) return;
    shown[key] = !shown[key];
    setShown(v, l.objs, shown[key]);
    l.el.hidden = !shown[key];
  }
  async function build() {
    await assemble(v, order, { lift: 12, stagger: 0.45, dur: 0.9, rest: () => 0 });
    built = true;
    setProgress(progress);
  }
  const parts = LAYERS.map((l) => ({ key: l.key, label: l.title }));
  return { setProgress, setTurn, getTurn, viewer: v, parts, shown, toggle, build };
}
