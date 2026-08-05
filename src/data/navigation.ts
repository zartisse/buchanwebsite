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
  {
    label: 'Custom Homes',
    to: '/custom-homes',
    links: [
      { label: 'Custom Home Process', to: '/process' },
      { label: 'Land & Site Considerations', to: '/custom-homes/land-and-site' },
      { label: 'Preconstruction', to: '/preconstruction' },
      { label: 'Custom Home FAQ', to: '/faq#custom-homes' },
    ],
  },
  {
    label: 'Renovations',
    to: '/renovations',
    links: [
      { label: 'What We Renovate', to: '/renovations#what-we-renovate' },
      { label: 'Renovation Process', to: '/process#renovations' },
      { label: 'Preconstruction', to: '/preconstruction' },
      { label: 'Renovation FAQ', to: '/faq#renovations' },
    ],
  },
  {
    label: 'Services',
    to: '/services',
    links: [
      { label: 'ADUs & DADUs', to: '/services/adus' },
      { label: 'Real Estate Services', to: '/services/real-estate' },
      { label: 'Fire Restoration', to: '/services/fire-restoration' },
      { label: 'Maintenance & Service', to: '/services/home-care' },
      { label: 'View All Services', to: '/services' },
    ],
  },
  {
    label: 'Portfolio',
    to: '/portfolio',
    links: [
      { label: 'Custom Homes', to: '/portfolio?type=custom-homes' },
      { label: 'Renovations', to: '/portfolio?type=renovations' },
      { label: 'Interiors', to: '/portfolio?type=interiors' },
      { label: 'Video Tours', to: '/portfolio?type=video-tours' },
      { label: 'Available Homes', to: '/portfolio?type=available-homes' },
    ],
  },
  {
    label: 'About',
    to: '/about',
    links: [
      { label: 'Why Buchan', to: '/why-choose-buchan' },
      { label: 'Our Story', to: '/about' },
      { label: 'Our Team', to: '/about#team' },
      { label: 'Client Stories', to: '/testimonials' },
      { label: 'News & Recognition', to: '/awards' },
      { label: 'Areas We Serve', to: '/areas-we-serve' },
    ],
  },
];

export const FOOTER_COMPANY = [
  { label: 'About', to: '/about' },
  { label: 'Our Story', to: '/about' },
  { label: 'Our Team', to: '/about#team' },
  { label: 'Careers', to: '/about#join-our-team' },
  { label: 'News & Recognition', to: '/awards' },
  { label: 'Contact', to: '/contact' },
];

export const FOOTER_SERVICES = [
  { label: 'Custom Homes', to: '/custom-homes' },
  { label: 'Renovations', to: '/renovations' },
  { label: 'Preconstruction', to: '/preconstruction' },
  { label: 'ADUs & DADUs', to: '/services/adus' },
  { label: 'Real Estate Services', to: '/services/real-estate' },
  { label: 'Fire Restoration', to: '/services/fire-restoration' },
  { label: 'Maintenance & Service', to: '/services/home-care' },
];

export const FOOTER_RESOURCES = [
  { label: 'The Buchan Process', to: '/process' },
  { label: 'Planning Guides', to: '/faq' },
  { label: 'Client Stories', to: '/testimonials' },
  { label: 'Areas We Serve', to: '/areas-we-serve' },
  { label: 'FAQs', to: '/faq' },
];

export const FOOTER_UTILITY: { label: string; to: string; external?: boolean }[] = [
  { label: 'Homeowner Portal', to: 'https://portal.buchan.com', external: true },
  { label: 'Privacy Policy', to: '/faq#privacy' },
  { label: 'Contractor License', to: '/faq' },
];

/** @deprecated Use FOOTER_RESOURCES */
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
