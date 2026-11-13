// Configuratore della cucina CREO (Sharjah, p9).
// Le varianti vengono dai materiali delle altre due cucine del portfolio (p10, p11).
import { createViewer, grainTexture, veinTexture } from './viewer-core.js';

export const OPTIONS = {
  cabinet: {
    label: 'Cabinets',
    original: 'matt-grey',
    choices: {
      'matt-grey': { name: 'Matt Grey Lacquer', swatch: '#6f6a66', color: '#6f6a66', roughness: 0.55 },
      'soft-grey': { name: 'Soft Grey', swatch: '#a8a39b', color: '#a8a39b', roughness: 0.5 },
      ivory: { name: 'Ivory Lacquered', swatch: '#e7dcc6', color: '#e7dcc6', roughness: 0.45 },
    },
  },
  wood: {
    label: 'Drawer fronts',
    original: 'walnut',
    choices: {
      walnut: { name: 'Walnut Veneer', swatch: '#6b4226', grain: ['#6b4226', '#2f1a0d'], roughness: 0.45 },
      oak: { name: 'Natural Oak Veneer', swatch: '#c49a66', grain: ['#c49a66', '#8c6639'], roughness: 0.5 },
    },
  },
  worktop: {
    label: 'Worktop & splashback',
    original: 'dark-quartz',
    choices: {
      'dark-quartz': { name: 'Dark Quartz', swatch: '#2e2b29', vein: ['#2e2b29', '#9a8a74'], roughness: 0.3 },
      calacatta: { name: 'Calacatta Look Quartz', swatch: '#efe9df', vein: ['#efe9df', '#9c9287'], roughness: 0.25 },
      'black-granite': { name: 'Black Polished Granite', swatch: '#121110', color: '#121110', roughness: 0.12 },
    },
  },
};

export async function mountKitchen(container, url) {
  const v = createViewer(container, {
    background: '#b3a698',
    position: [2.3, 1.45, 6.8],
    target: [2.3, 1.2, 0],
    limits: {
      minAzimuthAngle: -0.62, maxAzimuthAngle: 0.62,
      minPolarAngle: 1.15, maxPolarAngle: 1.62,
      minDistance: 3.4, maxDistance: 7.6,
    },
  });
  const { THREE } = v;
  const gltf = await v.load(url);
  v.scene.add(gltf.scene);

  const mats = {};
  gltf.scene.traverse((o) => { if (o.isMesh) mats[o.material.name] = o.material; });
  if (mats.glass) Object.assign(mats.glass, { transparent: true, depthWrite: false });

  // luce calda vicino alle strisce LED: il materiale luminoso da solo non illumina
  const leds = new THREE.Group();
  const warm = (x, y, z, intensity) => {
    const l = new THREE.PointLight('#ffc477', intensity, 2.4, 2);
    l.position.set(x, y, z);
    leds.add(l);
  };
  warm(1.55, 2.2, 0.22, 1.1); warm(2.3, 2.2, 0.22, 1.1); warm(3.05, 2.2, 0.22, 1.1);   // nicchie alte
  warm(2.3, 1.42, 0.3, 1.6);                                                             // sotto i pensili
  warm(0.52, 1.9, 0.3, 0.9); warm(0.52, 0.9, 0.3, 0.9);                                  // vetrine
  v.scene.add(leds);
  const key = new THREE.DirectionalLight('#fff1dc', 1.1);
  key.position.set(3, 4, 6);
  v.scene.add(key);

  const cache = {};
  const state = {};
  function set(part, choice) {
    const opt = OPTIONS[part].choices[choice];
    const m = mats[part];
    if (!opt || !m) return;
    const id = part + ':' + choice;
    if (opt.grain) cache[id] ??= grainTexture(...opt.grain);
    if (opt.vein) cache[id] ??= veinTexture(...opt.vein);
    m.map = cache[id] ?? null;
    m.color.set(m.map ? '#ffffff' : opt.color);
    m.roughness = opt.roughness;
    m.needsUpdate = true;
    state[part] = choice;
    v.invalidate();
  }
  function setLed(on) {
    leds.visible = on;
    if (mats.led) mats.led.emissiveIntensity = on ? 6 : 0;
    state.led = on;
    v.invalidate();
  }
  function reset() {
    for (const part in OPTIONS) set(part, OPTIONS[part].original);
    setLed(true);
  }
  reset();
  return { set, setLed, reset, state, viewer: v };
}
