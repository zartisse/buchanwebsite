import { SERVICE_AREAS } from './navigation';

export type ServiceArea = { name: string; slug: string };

export function areaSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export const AREA_PAGES: ServiceArea[] = SERVICE_AREAS.map((name) => ({ name, slug: areaSlug(name) }));

export function findArea(slug: string | undefined): ServiceArea | undefined {
  return AREA_PAGES.find((a) => a.slug === slug);
}
