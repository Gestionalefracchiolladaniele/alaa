// Controlla che ogni id di slot citato nei contenuti esista nel manifesto e abbia il file.
// Uso: node tools/check_slots.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'sito', 'src');
const manifest = JSON.parse(readFileSync(join(root, 'data', 'slots.json'), 'utf8'));
const ids = new Set(manifest.map((s) => s.id));
const files = new Set(readdirSync(join(root, 'assets', 'slots')).map((f) => f.replace(/\.[a-z]+$/, '')));
const used = new Set();
const bad = [];
const KEYS = new Set(['slot', 'hero', 'cover', 'sketch', 'drawing', 'photo']);

function walk(v, file) {
  if (Array.isArray(v)) v.forEach((x) => walk(x, file));
  else if (v && typeof v === 'object') {
    for (const [k, x] of Object.entries(v)) {
      if (KEYS.has(k) && typeof x === 'string') { used.add(x); if (!ids.has(x) || !files.has(x)) bad.push(`${file}: ${k} = ${x}`); }
      else if (k === 'moodboard' && Array.isArray(x)) x.forEach((id) => { used.add(id); if (!ids.has(id)) bad.push(`${file}: moodboard ${id}`); });
      else walk(x, file);
    }
  }
}
function scan(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) scan(p);
    else if (f.endsWith('.json')) walk(JSON.parse(readFileSync(p, 'utf8')), p.slice(root.length + 1));
  }
}
scan(join(root, 'content'));
const unused = [...ids].filter((id) => !used.has(id));
console.log(`${ids.size} slot nel manifesto, ${used.size} citati nei contenuti.`);
if (unused.length) console.log(`Non citati nei contenuti (usati direttamente nelle pagine o di riserva): ${unused.join(', ')}`);
if (bad.length) { console.error('ERRORI:\n' + bad.join('\n')); process.exit(1); }
console.log('OK');
