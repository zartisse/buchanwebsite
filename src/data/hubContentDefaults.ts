import { IA_PAGES } from './iaContent';
import { SERVICE_AREAS } from './navigation';
import type { HubPage, HubPageContent, HubPageSlug } from '../types';
import { HUB_PAGE_SLUGS } from '../types';

export function iaPageToHubContent(slug: HubPageSlug): HubPageContent {
  const page = IA_PAGES[slug];
  return {
    hero: {
      eyebrow: page.hero.eyebrow,
      title: page.hero.title,
      titleEmphasis: page.hero.titleEmphasis,
      subtitle: page.hero.subtitle,
      image_url: page.hero.image_url,
    },
    intro: page.intro,
    sections: page.sections,
    ctaTitle: page.ctaTitle,
    ctaLink: page.ctaLink,
    service_areas: slug === 'areas-we-serve' ? [...SERVICE_AREAS] : undefined,
  };
}

export function getDemoHubPage(slug: HubPageSlug): HubPage {
  const data = IA_PAGES[slug];
  return {
    id: `demo-${slug}`,
    slug,
    meta_title: data.metaTitle,
    meta_description: data.metaDescription,
    content: iaPageToHubContent(slug),
  };
}

export const DEMO_HUB_PAGES: Record<HubPageSlug, HubPage> = HUB_PAGE_SLUGS.reduce(
  (acc, slug) => ({ ...acc, [slug]: getDemoHubPage(slug) }),
  {} as Record<HubPageSlug, HubPage>,
);

export function mergeHubContent(partial: Partial<HubPageContent>, slug: HubPageSlug): HubPageContent {
  const defaults = iaPageToHubContent(slug);
  return {
    ...defaults,
    ...partial,
    hero: { ...defaults.hero, ...partial.hero },
    sections: partial.sections ?? defaults.sections,
    service_areas: partial.service_areas ?? defaults.service_areas,
  };
}
