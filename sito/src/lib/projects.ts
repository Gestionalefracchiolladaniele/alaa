import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** "interior/creo-sharjah" -> "creo-sharjah" */
export const slugOf = (p: Project) => p.id.split('/').pop()!;
export const urlOf = (p: Project) => `/${p.data.kind}/${slugOf(p)}/`;

export async function getProjects(kind?: 'interior' | 'architecture'): Promise<Project[]> {
  const all = await getCollection('projects', (p) => !kind || p.data.kind === kind);
  // i progetti con il modello 3D vengono per primi (scelta di Daniele, 13 nov), poi l'ordine del PDF
  const has3d = (p: Project) => ((p.data as { model?: unknown }).model ? 0 : 1);
  return all.sort((a, b) => has3d(a) - has3d(b) || a.data.page - b.data.page);
}
