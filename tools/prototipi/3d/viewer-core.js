// Base comune dei visualizzatori 3D: disegna solo quando qualcosa cambia.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createViewer(container, { background = '#e9dcc6', fov = 32, position, target, limits = {} }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;

  const camera = new THREE.PerspectiveCamera(fov, 1, 0.1, 400);
  camera.position.set(...position);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(...target);
  Object.assign(controls, { enablePan: false, ...limits });
  controls.update();

  let queued = false;
  const beforeRender = [];
  const render = () => {
    queued = false;
    for (const fn of beforeRender) fn();
    renderer.render(scene, camera);
  };
  const invalidate = () => {
    if (!queued) { queued = true; requestAnimationFrame(render); }
  };
  controls.addEventListener('change', invalidate);

  new ResizeObserver(() => {
    const w = container.clientWidth, h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    invalidate();
  }).observe(container);

  const load = (url) => new GLTFLoader().loadAsync(url);
  return { THREE, renderer, scene, camera, controls, invalidate, beforeRender, load };
}

// Texture disegnate in un canvas: nessun file esterno da scaricare.
export function grainTexture(base, dark, { lines = 150, size = 512 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  g.strokeStyle = dark;
  for (let i = 0; i < lines; i++) {          // venatura orizzontale, leggermente ondulata
    const y = rnd() * size, amp = 1 + rnd() * 3, ph = rnd() * 6.28;
    g.globalAlpha = 0.08 + rnd() * 0.22;
    g.lineWidth = 0.5 + rnd() * 1.6;
    g.beginPath();
    for (let x = 0; x <= size; x += 16) g.lineTo(x, y + Math.sin(x / 60 + ph) * amp);
    g.stroke();
  }
  return finish(c, 1);
}

export function veinTexture(base, vein, { veins = 9, size = 512 } = {}) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);
  let seed = 11;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  g.strokeStyle = vein;
  for (let i = 0; i < veins; i++) {
    g.globalAlpha = 0.15 + rnd() * 0.35;
    g.lineWidth = 0.6 + rnd() * 1.4;
    let x = rnd() * size, y = 0;
    g.beginPath();
    g.moveTo(x, y);
    while (y < size) { x += (rnd() - 0.5) * 70; y += 20 + rnd() * 40; g.lineTo(x, y); }
    g.stroke();
  }
  return finish(c, 0.8);
}

function finish(canvas, repeat) {
  const t = new THREE.CanvasTexture(canvas);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
