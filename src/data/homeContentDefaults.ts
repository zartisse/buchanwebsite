import type { HomePageContent } from '../types';
import {
  BETTER_PLANNED_PATH,
  CLIENT_CONCERNS,
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
      title: 'Build with',
      title_emphasis: 'Certainty.',
      subtitle: 'Thoughtful planning, experienced guidance, and exceptional construction for custom homes and remodels.',
      image_url: '/assets/ph-arch-1.png',
      video_url: 'https://www.youtube.com/watch?v=PMeek4pvZOI',
      marquee: '',
      cta_primary_url: '/contact',
      cta_primary_label: 'Start a Conversation',
      cta_secondary_url: '#featured-work',
      cta_secondary_label: 'Explore Our Work',
    },
    credibility_line: CREDIBILITY_LINE,
    featured_work: {
      eyebrow: 'Featured Work',
      title: "Homes we're proud of.",
    },
    what_we_do: {
      eyebrow: 'What We Do',
      title: 'Custom homes, renovations,',
      title_emphasis: 'and more.',
      primary: WHAT_WE_DO.primary,
      secondary: WHAT_WE_DO.secondary,
      preconstruction: {
        title: 'Plan Before You Build',
        body: 'Progressive estimates, feasibility, and design alignment — for custom homes and major renovations alike.',
        cta_label: 'Explore Preconstruction →',
        cta_link: '/preconstruction',
      },
    },
    client_concerns: {
      eyebrow: 'Your Concerns Shape How We Build',
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
      })),
    },
    testimonial_section: {
      eyebrow: 'Client Testimonials',
      title: 'In their words.',
      quote: 'They stepped in when our project stalled — and finished it with a level of care we didn\'t think was still possible.',
      cite: 'The Harmon Family · Clyde Hill',
      cta_label: 'All client stories',
      cta_link: '/testimonials',
    },
    pick_your_path: {
      intro: PICK_YOUR_PATH_INTRO,
      tiles: PICK_YOUR_PATH_TILES,
    },
    closing_cta: {
      title: 'Ready to Build with Certainty?',
      primary_label: 'Start a Conversation',
      primary_url: '/contact',
      phone: '425.827.2266',
      phone_href: 'tel:4258272266',
    },
  };
}

export function mergeHomeContent(partial: Partial<HomePageContent> | HomePageContent): HomePageContent {
  const defaults = getDefaultHomeContent();
  return {
    ...defaults,
    ...partial,
    hero: { ...defaults.hero, ...partial.hero },
    featured_work: { ...defaults.featured_work, ...partial.featured_work },
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
