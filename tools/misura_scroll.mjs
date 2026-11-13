// Misura la fluidita' dello scroll: tempo di ogni fotogramma mentre la pagina scorre da cima a fondo.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
const PORT = 9333, BASE = 'http://127.0.0.1:8124/';
const variants = process.argv.slice(2);
const edge = ['C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const prof = process.env.PROF_DIR;
const child = spawn(edge, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${prof}`, '--no-first-run', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function ver() { for (let i = 0; i < 40; i++) { try { return await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await sleep(500); } } throw new Error('edge non parte'); }
function cdp(url) {
  const ws = new WebSocket(url); let id = 0; const wait = new Map();
  ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.id && wait.has(m.id)) { wait.get(m.id)(m.result ?? m.error); wait.delete(m.id); } };
  const open = new Promise((r) => { ws.onopen = r; });
  return { open, send: (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); }), close: () => ws.close() };
}
const inject = `try{sessionStorage.setItem('aa-opened','1')}catch(e){}
window.__f=[];window.__rec=false;(function(){let l=performance.now();function r(t){if(window.__rec)window.__f.push([Math.round((t-l)*10)/10,Math.round(scrollY)]);l=t;requestAnimationFrame(r)}requestAnimationFrame(r)})();`;
const ev = async (c, expression) => (await c.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;
const metrics = async (c) => Object.fromEntries((await c.send('Performance.getMetrics')).metrics.map((m) => [m.name, m.value]));

await ver();
for (const v of variants) {
  const off = v === 'tutto' ? '' : v;
  const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const c = cdp(t.webSocketDebuggerUrl); await c.open;
  await c.send('Page.enable'); await c.send('Runtime.enable'); await c.send('Performance.enable');
  await c.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  await c.send('Page.addScriptToEvaluateOnNewDocument', { source: inject });
  await c.send('Page.navigate', { url: BASE + (off ? '?off=' + off : '') });
  await sleep(7000);
  const scenes = await ev(c, `JSON.stringify([...document.querySelectorAll('[data-scene]')].map(s=>[s.id,Math.round(s.getBoundingClientRect().top+scrollY)]))`);
  const height = await ev(c, 'document.documentElement.scrollHeight');
  const m0 = await metrics(c);
  await ev(c, 'window.__rec=true;0');
  const t0 = Date.now(); let last = -1, still = 0;
  while (Date.now() - t0 < 50000) {
    await c.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: 700, y: 450, deltaX: 0, deltaY: 120 });
    await sleep(50);
    if ((Date.now() - t0) % 1000 < 60) { const y = await ev(c, 'Math.round(scrollY)'); if (y === last) { if (++still > 2) break; } else still = 0; last = y; }
  }
  await sleep(800);
  const frames = JSON.parse(await ev(c, 'JSON.stringify(window.__f)'));
  const m1 = await metrics(c);
  const sc = JSON.parse(scenes);
  const stat = (a) => { if (!a.length) return null; const s = [...a].sort((x, y) => x - y); const tot = a.reduce((x, y) => x + y, 0);
    return { n: a.length, fps: Math.round(a.length / tot * 1000), p50: s[Math.floor(s.length * .5)], p95: s[Math.floor(s.length * .95)], max: s[s.length - 1], lenti: Math.round(a.filter((x) => x > 34).length / a.length * 100) }; };
  const all = stat(frames.map((f) => f[0]));
  const by = {};
  for (const [dt, y] of frames) { let id = sc[0]?.[0]; for (const [i, top] of sc) if (y >= top - 450) id = i; (by[id] ??= []).push(dt); }
  const d = (k) => Math.round((m1[k] - m0[k]) * 1000);
  console.log(`\n=== ${v} | altezza ${height}px, arrivato a ${last}px in ${Math.round((Date.now() - t0) / 1000)}s`);
  console.log(`  TOTALE fps ${all.fps}  mediana ${all.p50}ms  p95 ${all.p95}ms  max ${all.max}ms  fotogrammi lenti(>34ms) ${all.lenti}%`);
  console.log(`  lavoro (ms): script ${d('ScriptDuration')}  layout ${d('LayoutDuration')}  stile ${d('RecalcStyleDuration')}  totale ${d('TaskDuration')}  | layout n. ${m1.LayoutCount - m0.LayoutCount}, stile n. ${m1.RecalcStyleCount - m0.RecalcStyleCount}`);
  if (v === 'tutto' || process.env.DETAIL) for (const [id, a] of Object.entries(by)) { const s = stat(a); console.log(`    ${id.padEnd(14)} fps ${String(s.fps).padStart(3)}  p95 ${String(s.p95).padStart(6)}ms  lenti ${String(s.lenti).padStart(3)}%  (${s.n} fotogrammi)`); }
  await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`); c.close();
}
child.kill();
process.exit(0);
