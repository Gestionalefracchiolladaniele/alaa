// Padiglione di Kyrenia (p14): gli strati si separano in base a un valore 0..1.
// Nel sito quel valore sarà lo scroll; nella prova è un cursore.
import { createViewer } from './viewer-core.js';

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

export async function mountPavilion(container, labelLayer, url) {
  const v = createViewer(container, {
    background: '#efe3cf',
    position: [19, 9, 36],
    target: [12, 3.2, 0],
    limits: { minPolarAngle: 0.5, maxPolarAngle: 1.5, minDistance: 22, maxDistance: 60 },
  });
  const { THREE } = v;
  const gltf = await v.load(url);
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
    const anchor = new THREE.Vector3(box.max.x - 2.5, box.max.y * (layer.key === 'base' ? 1 : 0.55), box.min.z + 2);
    const el = document.createElement('div');
    el.className = 'tag3d';
    el.innerHTML = `<b>${layer.title}</b><span>${layer.note}</span>`;
    labelLayer.appendChild(el);
    return { layer, objs, anchor, el, dy: 0 };
  });
  const cavity = document.createElement('div');           // l'intercapedine non ha geometria: sta tra doghe e membrana
  cavity.className = 'tag3d';
  cavity.innerHTML = '<b>Air Cavity</b><span>natural ventilation</span>';
  labelLayer.appendChild(cavity);

  let progress = 0;
  const p = new THREE.Vector3();
  const place = (el, point) => {
    p.copy(point).project(v.camera);
    const w = container.clientWidth, h = container.clientHeight;
    el.style.transform = `translate(${((p.x + 1) / 2) * w}px, ${((1 - p.y) / 2) * h}px)`;
    el.style.opacity = p.z < 1 ? Math.min(1, progress * 4) : 0;
  };
  v.beforeRender.push(() => {
    const pts = {};
    for (const l of labels) {
      pts[l.layer.key] = l.anchor.clone().setY(l.anchor.y + l.dy);
      place(l.el, pts[l.layer.key]);
    }
    place(cavity, pts.skin.clone().lerp(pts.membrane, 0.5));
  });

  function setProgress(value) {
    progress = Math.min(1, Math.max(0, value));
    for (const l of labels) {
      const { lift, from, to } = l.layer;
      l.dy = lift * ease((progress - from) / (to - from));
      l.objs.forEach((o) => { o.position.y = l.dy; });       // nel .glb l'asse verticale è Y
    }
    v.invalidate();
  }
  setProgress(0);
  return { setProgress, viewer: v };
}
