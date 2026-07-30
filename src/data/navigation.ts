export interface NavLink {
  label: string;
  to: string;
}

export interface NavGroup {
  label: string;
  to: string;
  links: NavLink[];
}

export const PRIMARY_NAV: NavGroup[] = [
  { label: 'Custom Homes', to: '/custom-homes', links: [] },
  { label: 'Renovations', to: '/renovations', links: [] },
  { label: 'Preconstruction', to: '/preconstruction', links: [] },
  { label: 'Available Homes', to: '/available-homes', links: [] },
  {
    label: 'Services',
    to: '/services',
    links: [
      { label: 'ADUs & DADUs', to: '/services/adus' },
      { label: 'Fire Restoration', to: '/services/fire-restoration' },
      { label: 'Planning & Budgeting', to: '/services/planning-budgeting' },
      { label: 'Real Estate Services', to: '/services/real-estate' },
      { label: 'Buchan Home Care', to: '/services/home-care' },
      { label: 'Warranty & Client Care', to: '/warranty' },
      { label: 'View All Services', to: '/services' },
    ],
  },
  { label: 'Portfolio', to: '/portfolio', links: [] },
  {
    label: 'About',
    to: '/about',
    links: [
      { label: 'Why Choose Buchan', to: '/why-choose-buchan' },
      { label: 'Our Story', to: '/about' },
      { label: 'Our Team', to: '/about#team' },
      { label: 'Client Testimonials', to: '/testimonials' },
      { label: 'News & Recognition', to: '/awards' },
      { label: 'Areas We Serve', to: '/areas-we-serve' },
    ],
  },
];

export const FOOTER_COMPANY = [
  { label: 'About', to: '/about' },
  { label: 'Our Team', to: '/about#team' },
  { label: 'Our Story', to: '/about' },
  { label: 'Careers', to: '/about#join-our-team' },
  { label: 'News & Awards', to: '/awards' },
  { label: 'Landowners / Sell Your Land', to: '/land-acquisition' },
];

export const FOOTER_RESOURCES = [
  { label: 'Frequently Asked Questions', to: '/faq' },
  { label: 'Articles & Insights', to: '/blog' },
  { label: 'Planning Guides', to: '/faq' },
  { label: 'Video Tours', to: '/portfolio' },
  { label: 'Homeowner Resources', to: '/faq' },
];

export const FOOTER_CLIENT_SUPPORT = [
  { label: 'Warranty & Client Care', to: '/warranty' },
  { label: 'Request Service', to: '/contact?service=Request service / warranty#inquiry' },
  { label: 'Contact Us', to: '/contact' },
  { label: 'Client Testimonials', to: '/testimonials' },
];

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/john-buchan-homes' },
  { label: 'Facebook', href: 'https://www.facebook.com/johnbuchanhomes' },
  { label: 'Instagram', href: 'https://www.instagram.com/johnbuchanhomes' },
];

export const SERVICE_AREAS = [
  'Bellevue', 'Medina', 'Clyde Hill', 'Yarrow Point', 'Hunts Point',
  'Kirkland', 'Redmond', 'Newcastle', 'Mercer Island', 'Sammamish',
  'Issaquah', 'Woodinville', 'Bothell',
];

export const LEGACY_REDIRECTS: Record<string, string> = {
  '/build': '/custom-homes',
  '/remodel': '/renovations',
  '/design': '/services/planning-budgeting',
  '/neighborhoods': '/areas-we-serve',
};
