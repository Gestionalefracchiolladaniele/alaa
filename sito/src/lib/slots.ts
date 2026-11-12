/* Accesso al manifesto degli slot (src/data/slots.json) e alle immagini generate
   da tools/build_slots.py in src/assets/slots/. Un id inesistente blocca la build. */
import type { ImageMetadata } from 'astro';
import manifest from '../data/slots.json';

export interface SlotEntry {
  id: string;
  page: number;
  crop: number[];
  alt: string;
  note: string;
}

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/slots/*.{jpg,jpeg,png,webp}', { eager: true });
const byId = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(files)) {
  const name = path.split('/').pop()!.replace(/\.[a-z]+$/, '');
  byId.set(name, mod.default);
}
const entries = new Map<string, SlotEntry>((manifest as SlotEntry[]).map((s) => [s.id, s]));

export function getSlot(id: string): SlotEntry & { image: ImageMetadata } {
  const entry = entries.get(id);
  if (!entry) throw new Error(`Slot "${id}" non esiste in src/data/slots.json`);
  const image = byId.get(id);
  if (!image) throw new Error(`Manca l'immagine dello slot "${id}": lancia tools/build_slots.py`);
  return { ...entry, image };
}

export function hasSlot(id: string): boolean {
  return entries.has(id) && byId.has(id);
}

/** Larghezze utili per srcset, mai oltre la larghezza del file. */
export function widthsFor(img: ImageMetadata, max = 1800): number[] {
  const top = Math.min(img.width, max);
  const ws = [360, 640, 960, 1280, 1600].filter((w) => w < top);
  return [...ws, top];
}
