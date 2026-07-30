export type PostCategory = 'Company Updates' | 'Industry News';
export type PostStatus = 'Draft' | 'Published';
export type PropertyStatus = 'Available' | 'Coming Soon' | 'Sold' | 'Draft';
export type SubmissionStatus = 'New' | 'Read' | 'Archived';

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
  | 'awards';

export interface HeroSection {
  eyebrow: string;
  title: string;
  title_emphasis?: string;
}

export interface HomePageContent {
  hero: HeroSection & {
    subtitle: string;
    image_url: string;
    video_url?: string;
    marquee: string;
    cta_primary_url: string;
    cta_primary_label: string;
  };
  legacy: {
    title: string;
    title_line2?: string;
    title_emphasis?: string;
    eyebrow: string;
    paragraphs: string[];
  };
  services: {
    eyebrow: string;
    title: string;
    title_emphasis?: string;
    items: { title: string; description: string; image_url: string; link: string }[];
  };
  recent_work: {
    eyebrow: string;
    title: string;
  };
  concierge: {
    eyebrow: string;
    quote: string;
    cite: string;
    image_url: string;
  };
  quality_gallery?: { image_url: string; caption?: string }[];
  testimonials_strip?: { quote: string; cite: string }[];
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
}

export interface ServiceDetailPageContent {
  hero: HeroSection;
  image_url: string;
  steps: { n: string; title: string; body: string }[];
  cta_title: string;
}

export interface ProcessPageContent {
  hero: HeroSection;
  steps: { n: string; title: string; duration: string; body: string; tag: string }[];
  cta_title: string;
}

export interface NeighborhoodsPageContent {
  hero: HeroSection;
  areas: { name: string; body: string; image_url: string }[];
  cta_title: string;
}

export interface TestimonialsPageContent {
  hero: HeroSection;
  featured: { quote: string; cite: string; image_url: string };
  quotes: { name: string; city: string; quote: string }[];
  cta_title: string;
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
}

export interface FaqPageContent {
  hero: HeroSection;
  intro: string;
  categories: { title: string; items: { question: string; answer: string }[] }[];
  cta_title: string;
}

export interface WarrantyPageContent {
  hero: HeroSection;
  intro: string;
  sections: { title: string; body: string }[];
  coverage_items: { title: string; description: string }[];
  cta_title: string;
}

export interface AwardsPageContent {
  hero: HeroSection;
  intro: string;
  awards: { title: string; year: string; description: string }[];
  press: { title: string; source: string; date: string; excerpt: string; url?: string }[];
  credentials: { title: string; body: string }[];
  cta_title: string;
}

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
  'build',
  'design',
  'remodel',
  'process',
  'neighborhoods',
  'testimonials',
  'contact',
  'faq',
  'warranty',
  'awards',
];

export const SITE_PAGE_LABELS: Record<SitePageSlug, string> = {
  home: 'Home',
  about: 'About',
  services: 'Services',
  build: 'Build',
  design: 'Design',
  remodel: 'Remodel',
  process: 'Process',
  neighborhoods: 'Neighborhoods',
  testimonials: 'Testimonials',
  contact: 'Contact',
  faq: 'FAQ',
  warranty: 'Warranty & Aftercare',
  awards: 'Awards & Press',
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
