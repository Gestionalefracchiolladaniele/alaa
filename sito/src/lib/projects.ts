import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/** "interior/creo-sharjah" -> "creo-sharjah" */
export const slugOf = (p: Project) => p.id.split('/').pop()!;
export const urlOf = (p: Project) => `/${p.data.kind}/${slugOf(p)}/`;

export async function getProjects(kind?: 'interior' | 'architecture'): Promise<Project[]> {
  const all = await getCollection('projects', (p) => !kind || p.data.kind === kind);
  return all.sort((a, b) => a.data.page - b.data.page);
}
