import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/* Id di slot: deve esistere in src/data/slots.json (controllato a build time da lib/slots.ts). */
const slot = z.string().regex(/^[a-z0-9-]+$/);

const twoTone = z.object({
  /** parte scura del titolo */
  text: z.string(),
  /** parte bordeaux (come PORT·FOLIO nel PDF) */
  accent: z.string().optional(),
  /** la parte bordeaux e' in corsivo (DESIGN, ESTATE, YOU …) */
  accentItalic: z.boolean().default(false),
  /** a capo tra le due parti */
  break: z.boolean().default(false),
});

const textBlock = z.object({
  heading: z.string(),
  body: z.union([z.string(), z.array(z.string())]).optional(),
  items: z.array(z.string()).optional(),
});

const item = z.object({
  name: z.string(),
  note: z.string().optional(),
  slot: slot.optional(),
  icon: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/projects' }),
  schema: z.object({
    kind: z.enum(['interior', 'architecture']),
    order: z.number().int(),
    /** pagina del PDF da cui viene la tavola */
    page: z.number().int().min(1).max(30),
    title: twoTone,
    /** titolo breve per la pellicola e i link precedente/successivo */
    shortTitle: z.string(),
    subtitle: z.string().optional(),
    script: z.string().optional(),
    location: z.string().optional(),
    brand: z.string().optional(),
    type: z.string().optional(),
    summary: z.string(),
    hero: slot,
    gallery: z.array(z.object({ slot, caption: z.string().optional() })).default([]),
    texts: z.array(textBlock).default([]),
    palette: z.array(z.object({ name: z.string(), hex: z.string().regex(/^#[0-9a-f]{6}$/i), note: z.string().optional() })).default([]),
    groups: z.array(z.object({ heading: z.string(), layout: z.enum(['cards', 'list', 'chips']).default('cards'), items: z.array(item) })).default([]),
    features: z.array(z.object({ title: z.string(), text: z.string().optional(), icon: z.string().optional() })).default([]),
    drawings: z.array(z.object({ slot, caption: z.string() })).default([]),
    legends: z.array(z.object({ heading: z.string(), items: z.array(z.object({ key: z.string().optional(), label: z.string() })) })).default([]),
    stats: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    hotspots: z.array(z.object({ x: z.number().min(0).max(100), y: z.number().min(0).max(100), label: z.string(), ref: z.string().optional() })).default([]),
    compare: z.object({ drawing: slot, photo: slot }).optional(),
    model: z.object({ file: z.string(), kind: z.enum(['configurator', 'exploded']) }).optional(),
    needsOriginals: z.boolean().default(false),
    /** testi o dati incerti: vedi piano/DA-CONFERMARE.md */
    toConfirm: z.boolean().default(false),
  }),
});

const sections = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/sections' }),
  schema: z.object({
    scene: z.number().int(),
    pages: z.array(z.number().int()),
    kicker: z.string().optional(),
    title: twoTone,
    tags: z.array(z.string()).default([]),
    script: z.string().optional(),
    paragraphs: z.array(z.string()).default([]),
    quote: z.string().optional(),
    cover: slot.optional(),
    /** la "porta" di 06-tocco-unico.md: slot e rettangolo di arrivo (in % sull'immagine di copertina) */
    door: z.object({ slot, rect: z.object({ x: z.number(), y: z.number(), w: z.number(), h: z.number() }), label: z.string() }).optional(),
    sketch: slot.optional(),
    blocks: z.array(z.object({
      id: z.string(),
      kicker: z.string().optional(),
      title: twoTone.optional(),
      tags: z.array(z.string()).default([]),
      script: z.string().optional(),
      paragraphs: z.array(z.string()).default([]),
      lists: z.array(z.object({ heading: z.string(), icon: z.string().optional(), items: z.array(z.string()).default([]), text: z.string().optional() })).default([]),
      works: z.array(z.object({ slot, caption: z.string().optional(), place: z.string().optional() })).default([]),
      swatches: z.array(z.object({ name: z.string(), hex: z.string(), note: z.string().optional(), slot: slot.optional() })).default([]),
    })).default([]),
    extra: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const collections = { projects, sections };
