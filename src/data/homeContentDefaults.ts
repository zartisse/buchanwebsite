import type { HomePageContent } from '../types';
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

export function getDefaultHomeContent(): HomePageContent {
  return {
    hero: {
      eyebrow: 'Building since 1961 · Seattle Eastside',
      title: 'Build with certainty.',
      title_emphasis: 'Live exceptionally.',
      subtitle: 'Thoughtful planning, experienced guidance, and exceptional construction for custom homes and major renovations across Bellevue and the Eastside.',
      image_url: '/assets/ph-arch-1.png',
      video_url: 'https://www.youtube.com/watch?v=PMeek4pvZOI',
      marquee: '',
      cta_primary_url: '/contact',
      cta_primary_label: 'Start a Conversation',
      cta_secondary_url: '#featured-work',
      cta_secondary_label: 'Explore Our Work',
    },
    credibility_line: CREDIBILITY_LINE,
    credibility_stats: CREDIBILITY_ITEMS.map((label) => ({ label })),
    featured_work: {
      eyebrow: 'Featured Work',
      title: 'Homes as unique as the people who live in them.',
      body: 'Every Buchan home reflects the people who live in it — thoughtfully planned, carefully built, and finished to a standard you can feel in every room.',
      cta_label: 'View Our Work',
      cta_link: '/portfolio',
    },
    difference_section: {
      eyebrow: 'The John Buchan Difference',
      title: "What you can't see makes all the difference.",
      body: 'For more than six decades, Buchan has built on the Eastside with a family-owned commitment to integrity, craftsmanship, and the details behind every wall. The quality you feel — and the confidence you carry — comes from decisions made long before move-in day.',
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
        body: 'Progressive estimates, feasibility, and design alignment — for custom homes and major renovations alike.',
        cta_label: 'Explore Preconstruction',
        cta_link: '/preconstruction',
        image_url: '/assets/ph-arch-2.png',
      },
    },
    client_concerns: {
      eyebrow: 'Questions Prospective Clients Are Asking',
      title: 'Confidence at',
      title_emphasis: 'every stage.',
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
      cta_label: 'Explore Our Process →',
      cta_link: '/process',
    },
    process_stages: PROCESS_STAGES.map((s) => ({
      n: s.n,
      title: s.title,
      body: s.description,
    })),
    quality_layers: {
      eyebrow: 'Quality in Every Layer',
      title: 'Built for how',
      title_emphasis: 'you live.',
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
    testimonial_section: {
      eyebrow: 'Client Testimonials',
      title: 'In their words.',
      quote: 'From the first conversation to move-in and beyond, Buchan made us feel like our home was the only project that mattered.',
      cite: 'The Anderson Family · Bellevue, Washington',
      cta_label: 'All client stories',
      cta_link: '/testimonials',
      left_image_url: '/assets/ph-arch-1.png',
      right_image_url: '/assets/ph-arch-4.png',
    },
    pick_your_path: {
      intro: PICK_YOUR_PATH_INTRO,
      title: 'Choose Your Starting Point',
      tiles: PICK_YOUR_PATH_TILES,
    },
    closing_cta: {
      title: 'The right home begins with the right conversation.',
      subtitle: 'Tell us about your project — we will guide you to the right next step.',
      primary_label: 'Start a Conversation',
      primary_url: '/contact',
      phone: '425.827.2266',
      phone_href: 'tel:4258272266',
      background_image_url: '/assets/ph-arch-1.png',
    },
  };
}

export function mergeHomeContent(partial: Partial<HomePageContent> | HomePageContent): HomePageContent {
  const defaults = getDefaultHomeContent();
  const credibilityStats = partial.credibility_stats?.length
    ? partial.credibility_stats
    : defaults.credibility_stats;

  return {
    ...defaults,
    ...partial,
    hero: { ...defaults.hero, ...partial.hero },
    credibility_stats: credibilityStats,
    featured_work: { ...defaults.featured_work, ...partial.featured_work },
    difference_section: { ...defaults.difference_section, ...partial.difference_section },
    what_we_do: {
      ...defaults.what_we_do,
      ...partial.what_we_do,
      primary: partial.what_we_do?.primary ?? defaults.what_we_do.primary,
      secondary: partial.what_we_do?.secondary ?? defaults.what_we_do.secondary,
      preconstruction: { ...defaults.what_we_do.preconstruction, ...partial.what_we_do?.preconstruction },
    },
    client_concerns: {
      ...defaults.client_concerns,
      ...partial.client_concerns,
      items: partial.client_concerns?.items ?? defaults.client_concerns.items,
    },
    better_planned_path: { ...defaults.better_planned_path, ...partial.better_planned_path },
    process_stages: partial.process_stages ?? defaults.process_stages,
    quality_layers: {
      ...defaults.quality_layers,
      ...partial.quality_layers,
      layers: partial.quality_layers?.layers ?? defaults.quality_layers.layers,
    },
    testimonial_section: { ...defaults.testimonial_section, ...partial.testimonial_section },
    pick_your_path: {
      ...defaults.pick_your_path,
      ...partial.pick_your_path,
      tiles: partial.pick_your_path?.tiles ?? defaults.pick_your_path.tiles,
    },
    closing_cta: { ...defaults.closing_cta, ...partial.closing_cta },
  };
}
