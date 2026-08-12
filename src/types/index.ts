export type PostCategory = 'Company Updates' | 'Industry News';
export type PostStatus = 'Draft' | 'Published';
export type PropertyStatus = 'Available' | 'Coming Soon' | 'Sold' | 'Draft';
export type SubmissionStatus = 'New' | 'Read' | 'Archived';

export type PortfolioType = 'custom-homes' | 'renovations' | 'interiors' | 'available-homes' | 'video-tours';

export interface Post {
  id: string;
  title: string;
  slug: string;
  category: PostCategory;
  status: PostStatus;
  date: string;
  excerpt: string;
  body: string;
  image_url: string;
  meta_title: string;
  meta_description: string;
  featured?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Property {
  id: string;
  name: string;
  slug: string;
  status: PropertyStatus;
  address: string;
  city: string;
  beds: string;
  baths: string;
  sqft: string;
  lot: string;
  year: string;
  description: string;
  image_url: string;
  gallery_urls: string[];
  meta_title: string;
  meta_description: string;
  featured?: boolean;
  featured_order?: number;
  portfolio_type?: PortfolioType;
  created_at?: string;
  updated_at?: string;
}

export type SitePageSlug =
  | 'home'
  | 'about'
  | 'services'
  | 'build'
  | 'design'
  | 'remodel'
  | 'process'
  | 'neighborhoods'
  | 'testimonials'
  | 'contact'
  | 'faq'
  | 'warranty'
  | 'awards'
  | 'available-homes';

export interface HeroSection {
  eyebrow: string;
  title: string;
  title_emphasis?: string;
}

export type ServiceIconName =
  | 'custom-home'
  | 'renovation'
  | 'adu'
  | 'fire-restoration'
  | 'real-estate'
  | 'maintenance'
  | 'building'
  | 'blueprint'
  | 'hammer'
  | 'water'
  | 'structure'
  | 'comfort'
  | 'craft';

export interface HomePageContent {
  hero: HeroSection & {
    subtitle: string;
    image_url: string;
    video_url?: string;
    marquee: string;
    cta_primary_url: string;
    cta_primary_label: string;
    cta_secondary_url?: string;
    cta_secondary_label?: string;
  };
  credibility_line: string;
  credibility_stats: { label: string }[];
  featured_work: {
    eyebrow: string;
    title: string;
    body?: string;
    cta_label?: string;
    cta_link?: string;
  };
  difference_section: {
    eyebrow: string;
    title: string;
    body: string;
    image_url: string;
    cta_label: string;
    cta_link: string;
  };
  what_we_do: {
    eyebrow: string;
    title: string;
    title_emphasis?: string;
    primary: { title: string; description: string; image_url?: string; link: string; icon?: ServiceIconName }[];
    secondary: { title: string; description: string; link: string; icon?: ServiceIconName }[];
    preconstruction: { title: string; body: string; cta_label: string; cta_link: string; image_url?: string };
  };
  client_concerns: {
    eyebrow: string;
    title: string;
    title_emphasis?: string;
    items: { title: string; body: string }[];
  };
  better_planned_path: {
    eyebrow: string;
    title: string;
    title_emphasis?: string;
    intro: string;
    team_heading: string;
    team_body: string;
    team_image_url: string;
    cta_label: string;
    cta_link: string;
  };
  process_stages: { n: string; title: string; body: string }[];
  quality_layers: {
    eyebrow: string;
    title: string;
    title_emphasis?: string;
    elevation_image_url: string;
    layers: { id: string; label: string; benefit: string; x: number; y: number; icon?: ServiceIconName }[];
  };
  testimonial_section: {
    eyebrow: string;
    title: string;
    quote: string;
    cite: string;
    cta_label: string;
    cta_link: string;
    left_image_url?: string;
    right_image_url?: string;
  };
  pick_your_path: {
    intro: string;
    title?: string;
    tiles: { title: string; link: string; external?: boolean; description?: string; icon?: ServiceIconName; cta_label?: string }[];
  };
  closing_cta: {
    title: string;
    subtitle?: string;
    primary_label: string;
    primary_url: string;
    phone: string;
    phone_href: string;
    background_image_url?: string;
  };
}

export interface AboutPageContent {
  hero: HeroSection;
  timeline: {
    eyebrow: string;
    title: string;
    items: { year: string; title: string; body: string }[];
  };
  mission: {
    eyebrow: string;
    title: string;
    title_emphasis?: string;
    body: string;
    image_url: string;
  };
  team: {
    eyebrow: string;
    title: string;
    title_emphasis?: string;
    members: { name: string; role: string; image_url: string }[];
  };
  giving_back: {
    eyebrow: string;
    title: string;
    title_emphasis?: string;
    image_url: string;
  };
  cta: {
    join_title: string;
    join_body: string;
    land_title: string;
    land_body: string;
  };
}

export interface ServicesPageContent {
  hero: HeroSection;
  items: { title: string; slug: string; description: string; image_url: string }[];
  cta_title: string;
  cta_background_image_url?: string;
}

export interface ServiceDetailPageContent {
  hero: HeroSection;
  image_url: string;
  steps: { n: string; title: string; body: string }[];
  cta_title: string;
  cta_background_image_url?: string;
}

export interface ProcessPageContent {
  hero: HeroSection;
  steps: { n: string; title: string; duration: string; body: string; tag: string }[];
  band_title?: string;
  band_body?: string;
  band_image_url?: string;
  cta_title: string;
  cta_background_image_url?: string;
}

export interface NeighborhoodsPageContent {
  hero: HeroSection;
  areas: { name: string; body: string; image_url: string }[];
  cta_title: string;
  cta_background_image_url?: string;
}

export interface TestimonialsPageContent {
  hero: HeroSection;
  featured: { quote: string; cite: string; image_url: string };
  quotes: { name: string; city: string; quote: string }[];
  cta_title: string;
  cta_background_image_url?: string;
}

export interface ContactPageContent {
  hero: HeroSection;
  inquiry_title: string;
  service_options: string[];
  visit_title: string;
  phone: string;
  phone_href: string;
  office: string;
  cta_title: string;
  cta_background_image_url?: string;
}

export interface FaqPageContent {
  hero: HeroSection;
  intro: string;
  categories: { title: string; items: { question: string; answer: string }[] }[];
  cta_title: string;
  cta_background_image_url?: string;
}

export interface WarrantyPageContent {
  hero: HeroSection;
  intro: string;
  sections: { title: string; body: string }[];
  coverage_items: { title: string; description: string }[];
  cta_title: string;
  cta_background_image_url?: string;
}

export interface AwardsPageContent {
  hero: HeroSection;
  intro: string;
  awards: { title: string; year: string; description: string }[];
  press: { title: string; source: string; date: string; excerpt: string; url?: string }[];
  credentials: { title: string; body: string }[];
  badges?: { image_url?: string; alt: string; href?: string }[];
  cta_title: string;
  cta_background_image_url?: string;
}

export interface AvailableHomesPageContent {
  hero: HeroSection & { intro: string };
  featured_eyebrow: string;
  sections: {
    for_sale_title: string;
    coming_soon_title: string;
    recently_completed_title: string;
    empty_for_sale: string;
    empty_coming_soon: string;
  };
  cta: {
    title: string;
    primary_label: string;
    primary_url: string;
    secondary_label: string;
    secondary_url: string;
    background_image_url?: string;
  };
}

export interface HubPageContent {
  hero: {
    eyebrow: string;
    title: string;
    titleEmphasis?: string;
    subtitle?: string;
    image_url?: string;
  };
  intro?: string;
  sections: { title: string; body: string; bullets?: string[]; image_url?: string }[];
  ctaTitle: string;
  ctaLink?: string;
  cta_background_image_url?: string;
  service_areas?: string[];
}

export interface HubPage {
  id: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  content: HubPageContent;
  updated_at?: string;
}

export const HUB_PAGE_SLUGS = [
  'custom-homes',
  'land-and-site',
  'renovations',
  'preconstruction',
  'why-choose-buchan',
  'areas-we-serve',
  'adus',
  'fire-restoration',
  'planning-budgeting',
  'real-estate',
  'find-your-lot',
  'sell-your-home',
  'sell-to-buchan',
  'home-care',
  'land-acquisition',
  'second-opinion',
  'property-feasibility',
] as const;

export type HubPageSlug = (typeof HUB_PAGE_SLUGS)[number];

export const HUB_PAGE_LABELS: Record<HubPageSlug, string> = {
  'custom-homes': 'Custom Homes',
  'land-and-site': 'Land & Site',
  renovations: 'Renovations',
  preconstruction: 'Preconstruction',
  'why-choose-buchan': 'Why Choose Buchan',
  'areas-we-serve': 'Areas We Serve',
  adus: 'ADUs & DADUs',
  'fire-restoration': 'Fire Restoration',
  'planning-budgeting': 'Planning & Budgeting',
  'real-estate': 'Real Estate Services',
  'find-your-lot': 'Find Your Lot',
  'sell-your-home': 'Sell Your Home',
  'sell-to-buchan': 'Sell to Buchan',
  'home-care': 'Buchan Home Care',
  'land-acquisition': 'Land Acquisition',
  'second-opinion': 'Second Opinion',
  'property-feasibility': 'Property Feasibility',
};

export type SitePageContentMap = {
  home: HomePageContent;
  about: AboutPageContent;
  services: ServicesPageContent;
  build: ServiceDetailPageContent;
  design: ServiceDetailPageContent;
  remodel: ServiceDetailPageContent;
  process: ProcessPageContent;
  neighborhoods: NeighborhoodsPageContent;
  testimonials: TestimonialsPageContent;
  contact: ContactPageContent;
  faq: FaqPageContent;
  warranty: WarrantyPageContent;
  awards: AwardsPageContent;
  'available-homes': AvailableHomesPageContent;
};

export interface SitePage<S extends SitePageSlug = SitePageSlug> {
  id: string;
  slug: S;
  meta_title: string;
  meta_description: string;
  content: SitePageContentMap[S];
  updated_at?: string;
}

export const SITE_PAGE_SLUGS: SitePageSlug[] = [
  'home',
  'about',
  'services',
  'process',
  'testimonials',
  'contact',
  'faq',
  'warranty',
  'awards',
  'available-homes',
];

export const SITE_PAGE_LABELS: Record<SitePageSlug, string> = {
  home: 'Home',
  about: 'About',
  services: 'Services',
  build: 'Build (legacy)',
  design: 'Design (legacy)',
  remodel: 'Remodel (legacy)',
  process: 'Process',
  neighborhoods: 'Neighborhoods (legacy)',
  testimonials: 'Testimonials',
  contact: 'Contact',
  faq: 'FAQ',
  warranty: 'Warranty & Aftercare',
  awards: 'Awards & Press',
  'available-homes': 'Available Homes',
};

export interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  status: SubmissionStatus;
  created_at: string;
}

export interface Profile {
  id: string;
  display_name: string;
  role: 'editor' | 'admin';
}
