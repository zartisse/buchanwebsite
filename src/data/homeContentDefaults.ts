import type { HomePageContent } from '../types';
import { deepNormalizeCopy } from '../lib/normalizeCopy';
import {
  BETTER_PLANNED_PATH,
  CLIENT_CONCERNS,
  CREDIBILITY_ITEMS,
  CREDIBILITY_LINE,
  PICK_YOUR_PATH_INTRO,
  PICK_YOUR_PATH_TILES,
  PROCESS_STAGES,
  QUALITY_LAYERS,
  WHAT_WE_DO,
} from './iaContent';

/** Increment when default homepage copy changes so stale Supabase rows upgrade on read. */
export const HOME_CONTENT_VERSION = 4;

const LEGACY_CMS_KEYS = ['legacy', 'services', 'recent_work', 'concierge', 'quality_gallery', 'testimonials_strip', 'testimonial_section'] as const;

export function isStaleHomeCms(partial: Record<string, unknown>): boolean {
  if (LEGACY_CMS_KEYS.some((key) => key in partial)) return true;
  const version = partial.content_version;
  return typeof version !== 'number' || version < HOME_CONTENT_VERSION;
}

function preserveCmsMedia(defaults: HomePageContent, partial: Partial<HomePageContent>): HomePageContent {
  return {
    ...defaults,
    content_version: HOME_CONTENT_VERSION,
    hero: {
      ...defaults.hero,
      image_url: partial.hero?.image_url ?? defaults.hero.image_url,
      image_urls: partial.hero?.image_urls?.length
        ? partial.hero.image_urls
        : defaults.hero.image_urls,
    },
    difference_section: {
      ...defaults.difference_section,
      image_url: partial.difference_section?.image_url ?? defaults.difference_section.image_url,
    },
    what_we_do: {
      ...defaults.what_we_do,
      preconstruction: {
        ...defaults.what_we_do.preconstruction,
        image_url: partial.what_we_do?.preconstruction?.image_url ?? defaults.what_we_do.preconstruction.image_url,
      },
    },
    quality_layers: {
      ...defaults.quality_layers,
      elevation_image_url: partial.quality_layers?.elevation_image_url ?? defaults.quality_layers.elevation_image_url,
    },
    google_reviews_section: {
      ...defaults.google_reviews_section,
      fallback_maps_url:
        partial.google_reviews_section?.fallback_maps_url ?? defaults.google_reviews_section.fallback_maps_url,
    },
    closing_cta: {
      ...defaults.closing_cta,
      background_image_url: partial.closing_cta?.background_image_url ?? defaults.closing_cta.background_image_url,
    },
  };
}

export function getDefaultHomeContent(): HomePageContent {
  return {
    content_version: HOME_CONTENT_VERSION,
    hero: {
      eyebrow: 'Building since 1961 · Seattle Eastside',
      title: 'Build with certainty.',
      title_emphasis: 'Live exceptionally.',
      subtitle: 'Custom homes and major renovations, built on thoughtful planning, expert guidance, and uncompromising craftsmanship, proudly serving Bellevue and the Eastside.',
      image_url: '/assets/ph-arch-1.png',
      image_urls: ['/assets/ph-arch-1.png', '/assets/ph-arch-2.png', '/assets/ph-arch-3.png'],
      marquee: 'Celebrating 65 Years · John Buchan Homes',
      cta_primary_url: '#featured-work',
      cta_primary_label: 'Explore Our Work',
    },
    credibility_line: CREDIBILITY_LINE,
    credibility_stats: CREDIBILITY_ITEMS.map((label) => ({ label })),
    featured_work: {
      eyebrow: 'Featured Work',
      title: 'Homes as unique as the people who live in them.',
      body: "Each home we build is a reflection of our clients' vision and our commitment to timeless design, enduring quality, and meticulous attention to detail.",
      cta_label: 'View Our Work',
      cta_link: '/portfolio',
    },
    difference_section: {
      eyebrow: 'The John Buchan Difference',
      title: "What you can't see makes all the difference.",
      body: "For over six decades, we've built a legacy of trust by doing what's right, even when it costs more and no one sees it.\n\nFrom the framing to the finishing touches, our commitment to integrity and quality is behind every wall, so you can have complete confidence in the process and the relationship that builds your home.",
      image_url: '/assets/ph-arch-3.png',
      cta_label: 'Learn More',
      cta_link: '/why-choose-buchan',
    },
    what_we_do: {
      eyebrow: 'Our Services',
      title: 'A full-service experience.',
      title_emphasis: 'Thoughtfully delivered.',
      primary: WHAT_WE_DO.primary,
      secondary: WHAT_WE_DO.secondary,
      preconstruction: {
        title: 'Plan Before You Build',
        body: 'Preconstruction brings clarity, alignment, and confidence before a single day on site.',
        cta_label: 'Explore Preconstruction',
        cta_link: '/preconstruction',
        image_url: '/assets/ph-arch-2.png',
      },
    },
    client_concerns: {
      eyebrow: 'Questions Prospective Clients Are Asking',
      title: '',
      items: CLIENT_CONCERNS,
    },
    better_planned_path: {
      eyebrow: BETTER_PLANNED_PATH.eyebrow,
      title: BETTER_PLANNED_PATH.title,
      title_emphasis: BETTER_PLANNED_PATH.titleEmphasis,
      intro: BETTER_PLANNED_PATH.intro,
      team_heading: BETTER_PLANNED_PATH.teamHeading,
      team_body: BETTER_PLANNED_PATH.teamBody,
      team_image_url: BETTER_PLANNED_PATH.teamImage,
      cta_label: '',
      cta_link: '/process',
    },
    process_stages: PROCESS_STAGES.map((s) => ({
      n: s.n,
      title: s.title,
      body: s.description,
    })),
    quality_layers: {
      eyebrow: "What You Can't See",
      title: 'Quality in Every Layer',
      body: 'Great homes are built on systems, materials, and details that work together, quietly, every day.',
      elevation_image_url: '/assets/quality-layers-house.jpg',
      layers: QUALITY_LAYERS.map((l) => ({
        id: l.id,
        label: l.label,
        benefit: l.benefit,
        x: l.x,
        y: l.y,
        icon: l.icon,
      })),
    },
    google_reviews_section: {
      eyebrow: 'Client Testimonials',
      title: 'What our clients say on Google.',
      fallback_maps_url:
        'https://www.google.com/maps/search/?api=1&query=John+Buchan+Homes+Bellevue+WA',
    },
    pick_your_path: {
      intro: PICK_YOUR_PATH_INTRO,
      title: 'Choose Your Starting Point',
      tiles: PICK_YOUR_PATH_TILES,
    },
    closing_cta: {
      title: 'The right home begins\nwith the right conversation.',
      subtitle: "Let's talk about your vision, your property, and the experience you want to create.",
      primary_label: 'Start a Conversation',
      primary_url: '/contact',
      phone: '425.827.2266',
      phone_href: 'tel:4258272266',
      background_image_url: '/assets/ph-arch-1.png',
    },
  };
}

function backfillHero(hero: Partial<HomePageContent['hero']>, defaults: HomePageContent['hero']): HomePageContent['hero'] {
  const merged = { ...defaults, ...hero };
  const imageUrl = merged.image_url || defaults.image_url;
  const imageUrls = hero.image_urls?.length
    ? hero.image_urls
    : (merged.image_urls?.length ? merged.image_urls : [imageUrl]);
  const normalized = {
    ...merged,
    image_url: imageUrl,
    image_urls: imageUrls,
    marquee: merged.marquee || defaults.marquee,
  };
  const needsHeadlineUpdate =
    hero.title === 'Build with' ||
    (hero.subtitle != null &&
      hero.subtitle.includes('for custom homes and remodels.') &&
      !hero.subtitle.includes('Eastside'));

  if (needsHeadlineUpdate) {
    return {
      ...normalized,
      title: defaults.title,
      title_emphasis: defaults.title_emphasis,
      subtitle: defaults.subtitle,
      cta_secondary_url: undefined,
      cta_secondary_label: undefined,
    };
  }
  return {
    ...normalized,
    cta_secondary_url: undefined,
    cta_secondary_label: undefined,
  };
}

function backfillQualityLayers(
  partial: Partial<HomePageContent['quality_layers']> | undefined,
  defaults: HomePageContent['quality_layers'],
): HomePageContent['quality_layers'] {
  const merged = { ...defaults, ...partial, layers: partial?.layers ?? defaults.layers };
  const isLegacyStructure =
    partial?.title === 'Built for how' ||
    partial?.eyebrow === 'Quality in Every Layer' ||
    (partial?.layers?.length ?? 0) > 4;

  if (isLegacyStructure) {
    return {
      ...defaults,
      elevation_image_url: partial?.elevation_image_url ?? defaults.elevation_image_url,
    };
  }
  return merged;
}

function backfillFeaturedWork(
  partial: Partial<HomePageContent['featured_work']> | undefined,
  defaults: HomePageContent['featured_work'],
): HomePageContent['featured_work'] {
  const merged = { ...defaults, ...partial };
  if (partial?.body?.includes('Every Buchan home reflects')) {
    return { ...merged, body: defaults.body };
  }
  return merged;
}

function backfillDifferenceSection(
  partial: Partial<HomePageContent['difference_section']> | undefined,
  defaults: HomePageContent['difference_section'],
): HomePageContent['difference_section'] {
  const merged = { ...defaults, ...partial };
  const body = partial?.body ?? '';
  if (
    body.includes('family-owned commitment') ||
    body.includes('more than six decades, Buchan') ||
    (body.includes('no one sees it.') && !body.includes('\n\n'))
  ) {
    return { ...merged, body: defaults.body };
  }
  return merged;
}

const LEGACY_SECONDARY_PHRASES = [
  'Additional dwelling units',
  'Rebuild and restore',
  'Lot finding, selling',
  'Ongoing care through Buchan',
];

function backfillWhatWeDoSecondary(
  partial: Partial<HomePageContent['what_we_do']> | undefined,
  defaults: HomePageContent['what_we_do'],
): HomePageContent['what_we_do']['secondary'] {
  const secondary = partial?.secondary ?? defaults.secondary;
  const hasLegacy = secondary.some((item) =>
    LEGACY_SECONDARY_PHRASES.some((phrase) => item.description.includes(phrase)),
  );
  const base = hasLegacy ? defaults.secondary : secondary;
  return base.map((item, i) => ({
    ...item,
    image_url: item.image_url ?? defaults.secondary[i]?.image_url,
  }));
}

function backfillWhatWeDoPrimary(
  partial: Partial<HomePageContent['what_we_do']> | undefined,
  defaults: HomePageContent['what_we_do'],
): HomePageContent['what_we_do']['primary'] {
  const primary = partial?.primary ?? defaults.primary;
  const needsUpdate =
    primary.some((p) => p.description.includes('Ground-up homes on your lot')) ||
    primary.some((p) => !p.cta_label && defaults.primary.some((d) => d.title === p.title && d.cta_label));
  if (needsUpdate) {
    return defaults.primary.map((item, i) => ({
      ...item, ...(primary[i]?.image_url ? { image_url: primary[i].image_url } : {}),
    }));
  }
  return primary.map((item, i) => ({
    ...item,
    cta_label: item.cta_label ?? defaults.primary[i]?.cta_label,
  }));
}

export function mergeHomeContent(partial: Partial<HomePageContent> | HomePageContent): HomePageContent {
  const defaults = getDefaultHomeContent();
  const partialRecord = partial as Record<string, unknown>;

  if (isStaleHomeCms(partialRecord)) {
    return preserveCmsMedia(defaults, partial);
  }

  const credibilityStats = partial.credibility_stats?.length
    ? partial.credibility_stats
    : defaults.credibility_stats;

  const merged = {
    ...defaults, ...partial,
    hero: backfillHero(partial.hero ?? {}, defaults.hero),
    credibility_stats: credibilityStats,
    featured_work: backfillFeaturedWork(partial.featured_work, defaults.featured_work),
    difference_section: backfillDifferenceSection(partial.difference_section, defaults.difference_section),
    what_we_do: {
      ...defaults.what_we_do, ...partial.what_we_do,
      primary: backfillWhatWeDoPrimary(partial.what_we_do, defaults.what_we_do),
      secondary: backfillWhatWeDoSecondary(partial.what_we_do, defaults.what_we_do),
      preconstruction: (() => {
        const pre = { ...defaults.what_we_do.preconstruction, ...partial.what_we_do?.preconstruction };
        if (partial.what_we_do?.preconstruction?.body?.includes('Progressive estimates')) {
          return { ...pre, body: defaults.what_we_do.preconstruction.body };
        }
        return pre;
      })(),
    },
    client_concerns: (() => {
      const merged = {
        ...defaults.client_concerns, ...partial.client_concerns,
        items: partial.client_concerns?.items ?? defaults.client_concerns.items,
      };
      if ((partial.client_concerns?.items?.length ?? 0) > 3) {
        return { ...merged, items: defaults.client_concerns.items };
      }
      return merged;
    })(),
    better_planned_path: (() => {
      const merged = { ...defaults.better_planned_path, ...partial.better_planned_path };
      if (partial.better_planned_path?.intro?.includes('Preconstruction, collaboration')) {
        return { ...merged, intro: defaults.better_planned_path.intro };
      }
      if (partial.better_planned_path?.cta_label?.includes('Explore Our Process')) {
        return { ...merged, cta_label: defaults.better_planned_path.cta_label };
      }
      return merged;
    })(),
    process_stages:
      partial.process_stages?.some((s) => s.body.includes('Progressive estimates') || s.body.includes('Craftsmanship on site with clear milestones'))
        ? defaults.process_stages
        : (partial.process_stages ?? defaults.process_stages),
    quality_layers: backfillQualityLayers(partial.quality_layers, defaults.quality_layers),
    google_reviews_section: {
      ...defaults.google_reviews_section,
      ...partial.google_reviews_section,
    },
    pick_your_path: (() => {
      const merged = {
        ...defaults.pick_your_path, ...partial.pick_your_path,
        tiles: partial.pick_your_path?.tiles ?? defaults.pick_your_path.tiles,
      };
      const firstTitle = partial.pick_your_path?.tiles?.[0]?.title ?? '';
      const needsTileUpdate =
        firstTitle.endsWith('.') ||
        partial.pick_your_path?.tiles?.some((t) => t.cta_label?.includes('→'));
      if (needsTileUpdate) {
        return { ...merged, tiles: defaults.pick_your_path.tiles, intro: defaults.pick_your_path.intro, title: defaults.pick_your_path.title };
      }
      return {
        ...merged,
        tiles: merged.tiles.map((tile, i) => ({
          ...tile,
          image_url: tile.image_url ?? defaults.pick_your_path.tiles[i]?.image_url,
        })),
      };
    })(),
    closing_cta: (() => {
      const merged = { ...defaults.closing_cta, ...partial.closing_cta };
      if (partial.closing_cta?.subtitle?.includes('Tell us about your project')) {
        return { ...merged, subtitle: defaults.closing_cta.subtitle };
      }
      if (partial.closing_cta?.title === 'The right home begins with the right conversation.') {
        return { ...merged, title: defaults.closing_cta.title };
      }
      return merged;
    })(),
  };

  return deepNormalizeCopy({ ...merged, content_version: HOME_CONTENT_VERSION });
}
