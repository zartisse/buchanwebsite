export interface HubPageData {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  hero: { eyebrow: string; title: string; titleEmphasis?: string; subtitle?: string };
  intro?: string;
  sections: { title: string; body: string; bullets?: string[] }[];
  ctaTitle: string;
  ctaLink?: string;
}

export const IA_PAGES: Record<string, HubPageData> = {
  'custom-homes': {
    slug: 'custom-homes',
    metaTitle: 'Custom Homes',
    metaDescription: 'Ground-up custom homes on your lot across the Seattle Eastside.',
    hero: { eyebrow: 'Custom Homes', title: 'Built on your lot.', titleEmphasis: 'Designed for your life.' },
    intro: 'We specialize in ground-up custom homes — not spec inventory on our land. From feasibility through completion, one team carries your project forward.',
    sections: [
      { title: 'Our Process', body: 'Discovery through continuing care — seven stages designed to reduce uncertainty at every decision point.', bullets: ['Property & feasibility', 'Preconstruction agreement', 'Design alignment', 'Construction readiness'] },
      { title: 'Service Areas', body: 'Bellevue, Clyde Hill, Medina, Hunts Point, Kirkland, Redmond, and surrounding Eastside communities.' },
      { title: 'Cost & Planning', body: 'Transparent progressive estimates before construction begins. Use our cost tool or start a conversation with our team.' },
    ],
    ctaTitle: 'Ready to plan your custom home?',
    ctaLink: '/contact?service=I want to build a custom home#inquiry',
  },
  renovations: {
    slug: 'renovations',
    metaTitle: 'Renovations',
    metaDescription: 'Major home renovations on the Seattle Eastside with the same Buchan standard.',
    hero: { eyebrow: 'Renovations', title: 'Transform the home', titleEmphasis: 'you already love.' },
    intro: 'Whole-home and major renovation projects — kitchen and bath, structural additions, and full interior transformations. We use "renovations" in our navigation and incorporate remodel language throughout our content for search visibility.',
    sections: [
      { title: 'Major Remodels', body: 'Scope from cosmetic refreshes through whole-house renovations and structural additions.' },
      { title: 'Preconstruction First', body: 'Renovations benefit from the same progressive estimating and planning discipline as custom builds.' },
      { title: 'Renovation FAQ', body: 'Timeline, living-in-place, permits, and budget — answered in our FAQ section.' },
    ],
    ctaTitle: 'Discuss your renovation project',
    ctaLink: '/contact?service=I\'m planning a major renovation#inquiry',
  },
  preconstruction: {
    slug: 'preconstruction',
    metaTitle: 'Preconstruction',
    metaDescription: 'Feasibility, design coordination, progressive estimates, and construction readiness for custom homes and renovations.',
    hero: { eyebrow: 'Preconstruction', title: 'Know before', titleEmphasis: 'you build.' },
    intro: 'Our flagship planning phase feeds both custom homes and renovations — progressive estimates, constructability review, and design alignment before breaking ground.',
    sections: [
      { title: "What's Included", body: 'Site evaluation, scope definition, budget ranges, schedule framework, and selection planning.', bullets: ['Feasibility studies', 'Design coordination', 'Constructability review', 'Value engineering'] },
      { title: 'Why It Matters', body: 'Preconstruction reduces surprises during construction — the phase where most custom projects succeed or struggle.' },
      { title: 'Into Construction', body: 'A clear preconstruction agreement transitions your project into build with aligned expectations on cost, schedule, and quality.' },
    ],
    ctaTitle: 'Start with preconstruction',
    ctaLink: '/contact?service=Preconstruction / planning#inquiry',
  },
  'why-choose-buchan': {
    slug: 'why-choose-buchan',
    metaTitle: 'Why Choose Buchan',
    metaDescription: 'Family-owned since 1961. 65 years of custom home building on the Seattle Eastside.',
    hero: { eyebrow: 'Why Choose Buchan', title: 'Build with', titleEmphasis: 'certainty.' },
    intro: 'Three generations, one standard — yours. We combine Eastside expertise with white-glove client care from first conversation through long-term warranty support.',
    sections: [
      { title: 'Family-Owned Since 1961', body: '65 years on the Eastside. Decisions made by people who know your project, not a ticket queue.' },
      { title: 'Progressive Estimating', body: 'Transparent pricing developed through preconstruction — not a single guess before design is resolved.' },
      { title: 'Continuing Care', body: 'Warranty, homeowner education, and Buchan Home Care — support that outlasts the keys.' },
    ],
    ctaTitle: 'See our work',
    ctaLink: '/portfolio',
  },
  'areas-we-serve': {
    slug: 'areas-we-serve',
    metaTitle: 'Areas We Serve',
    metaDescription: 'Custom homes and renovations across the Seattle Eastside.',
    hero: { eyebrow: 'Local Expertise', title: 'Areas we', titleEmphasis: 'serve.' },
    intro: 'Deep knowledge of Eastside jurisdictions, setbacks, slopes, and neighborhood character — built over 65 years in these communities.',
    sections: [
      { title: 'Primary Markets', body: 'Bellevue, Medina, Clyde Hill, Yarrow Point, Hunts Point, Kirkland, Redmond, Newcastle, Mercer Island, Sammamish, Issaquah, Woodinville, and Bothell.' },
      { title: 'Jurisdiction Guides', body: 'City-specific planning guides will be added over time — linking from each service area below.' },
    ],
    ctaTitle: 'Evaluate your property',
    ctaLink: '/property-feasibility',
  },
  adus: {
    slug: 'adus',
    metaTitle: 'ADUs & DADUs',
    metaDescription: 'Accessory dwelling units for family housing and rental income on the Seattle Eastside.',
    hero: { eyebrow: 'ADUs & DADUs', title: 'More living.', titleEmphasis: 'Same lot.' },
    intro: 'Timely given Washington ADU legislation — detached and attached units for aging-parent housing, guest space, or rental income.',
    sections: [
      { title: 'Feasibility', body: 'We evaluate zoning, setbacks, utilities, and access before design begins.' },
      { title: 'Design & Build', body: 'Integrated with our custom home process — one team from concept through certificate of occupancy.' },
    ],
    ctaTitle: 'Explore an ADU on your property',
    ctaLink: '/contact?service=ADU / DADU#inquiry',
  },
  'fire-restoration': {
    slug: 'fire-restoration',
    metaTitle: 'Fire Restoration',
    metaDescription: 'Fire and smoke damage restoration for Eastside homeowners.',
    hero: { eyebrow: 'Fire Restoration', title: 'Restore with', titleEmphasis: 'care.' },
    intro: 'Emergency response coordination and rebuild services for fire-damaged homes. Available through Services and Contact — not featured on the homepage tile set.',
    sections: [
      { title: 'Immediate Response', body: 'Secure the site, assess structural integrity, and develop a recovery plan with your insurance partners.' },
      { title: 'Rebuild', body: 'Full restoration to Buchan quality standards — matching existing architecture where possible.' },
    ],
    ctaTitle: 'Contact us about fire restoration',
    ctaLink: '/contact?service=Fire restoration#inquiry',
  },
  'planning-budgeting': {
    slug: 'planning-budgeting',
    metaTitle: 'Planning & Budgeting',
    metaDescription: 'Feasibility, design coordination, constructability, estimates, and compliance.',
    hero: { eyebrow: 'Planning & Budgeting', title: 'Clarity before', titleEmphasis: 'commitment.' },
    intro: 'Feasibility studies, design coordination, constructability review, progressive estimates, value engineering, and code compliance — the planning layer behind every Buchan project.',
    sections: [
      { title: 'Progressive Estimates', body: 'Budget ranges refined as design resolves — tied to our Preconstruction flagship page.' },
      { title: 'Cost Tool', body: 'Get a preliminary range with our online estimator, then follow up for a project-specific conversation.' },
    ],
    ctaTitle: 'How much will my project cost?',
    ctaLink: '/cost-estimator',
  },
  'real-estate': {
    slug: 'real-estate',
    metaTitle: 'Real Estate Services',
    metaDescription: 'Find your lot, sell your current home, or explore selling directly to Buchan.',
    hero: { eyebrow: 'Real Estate Services', title: 'Three paths.', titleEmphasis: 'One team.' },
    intro: 'Three distinct relationships — not one blended service. Each path has its own process, timeline, and client relationship.',
    sections: [
      { title: 'Find Your Lot', body: 'Buy-side sourcing for clients ready to build custom who do not yet have land.' },
      { title: 'Sell Your Current Home', body: 'Traditional listing and brokerage support while you plan or build your next home.' },
      { title: 'Sell Directly to Buchan', body: 'JBH may purchase your property as a principal buyer — not as your listing agent. Written disclosures explain the difference before any agreement.' },
    ],
    ctaTitle: 'Talk to our real estate team',
    ctaLink: '/contact?service=Real estate services#inquiry',
  },
  'find-your-lot': {
    slug: 'find-your-lot',
    metaTitle: 'Find Your Lot',
    metaDescription: 'Buy-side lot sourcing for custom home clients on the Seattle Eastside.',
    hero: { eyebrow: 'Real Estate', title: 'Find your', titleEmphasis: 'lot.' },
    intro: 'For clients who know they want to build custom but have not yet secured land — we help evaluate and source buildable lots.',
    sections: [{ title: 'Lot Evaluation', body: 'Zoning, setbacks, slope, utilities, and access — understood before you commit.' }],
    ctaTitle: 'Start lot search',
    ctaLink: '/contact?service=Find your lot#inquiry',
  },
  'sell-your-home': {
    slug: 'sell-your-home',
    metaTitle: 'Sell Your Current Home',
    metaDescription: 'Listing support for homeowners building or renovating with Buchan.',
    hero: { eyebrow: 'Real Estate', title: 'Sell your', titleEmphasis: 'current home.' },
    intro: 'Traditional brokerage support coordinated with your custom build or renovation timeline.',
    sections: [{ title: 'Coordinated Timing', body: 'Align your sale with construction milestones so you are never between homes without a plan.' }],
    ctaTitle: 'Discuss selling your home',
    ctaLink: '/contact?service=Sell my current home#inquiry',
  },
  'sell-to-buchan': {
    slug: 'sell-to-buchan',
    metaTitle: 'Sell Directly to Buchan',
    metaDescription: 'Explore a direct purchase of your home by John Buchan Homes.',
    hero: { eyebrow: 'Real Estate', title: 'Sell directly', titleEmphasis: 'to Buchan.' },
    intro: 'In select situations, John Buchan Homes may purchase your property directly as a principal buyer — for our own development or inventory purposes. This is not listing or brokerage service on your behalf.',
    sections: [
      {
        title: 'How this differs from listing your home',
        body: 'When you list with a broker, you engage an agent to market your property to third-party buyers. When you sell directly to Buchan, we are the buyer. We do not represent you as a seller in a fiduciary brokerage relationship — we negotiate with you as a counterparty. You should consult your own legal and tax advisors before proceeding.',
      },
      {
        title: 'When a direct sale may make sense',
        body: 'Clients often explore this path when speed, certainty, or discretion matters more than maximizing every dollar through a public listing — for example, when coordinating a custom build timeline or avoiding showings while living in the home.',
      },
      {
        title: 'Compliance & licensing notice',
        body: 'John Buchan Homes holds Washington real estate and contractor licenses where required for its activities. Any direct purchase is documented with clear purchase-and-sale terms, earnest money handling consistent with state law, and written disclosure that JBH is acting as a principal buyer, not as your listing agent. Separate brokerage services — such as listing your home on the open market — are available through our real estate team and involve different representation.',
      },
      {
        title: 'Fair, discreet process',
        body: 'We evaluate each property individually — location, condition, zoning, and timing. Conversations are confidential. If a direct purchase is not the right fit, we will say so and outline alternatives, including traditional listing support.',
      },
    ],
    ctaTitle: 'Explore a direct sale',
    ctaLink: '/contact?service=Sell directly to Buchan#inquiry',
  },
  'home-care': {
    slug: 'home-care',
    metaTitle: 'Buchan Home Care',
    metaDescription: 'Maintenance and smaller projects for existing Buchan homeowners.',
    hero: { eyebrow: 'Buchan Home Care', title: 'Care after', titleEmphasis: 'the keys.' },
    intro: 'Maintenance, seasonal upkeep, and smaller projects for homeowners who want Buchan quality on an ongoing basis.',
    sections: [{ title: 'Ongoing Relationship', body: 'The same craftsmanship standards — scaled for maintenance and selective upgrades.' }],
    ctaTitle: 'Request Home Care',
    ctaLink: '/contact?service=Buchan Home Care#inquiry',
  },
  'land-acquisition': {
    slug: 'land-acquisition',
    metaTitle: 'Landowners — Sell Your Land',
    metaDescription: 'Property owners interested in selling land directly to John Buchan Homes.',
    hero: { eyebrow: 'Landowners', title: 'Sell your', titleEmphasis: 'land.' },
    intro: 'For property owners with no other relationship to JBH who may want to sell land directly — without listing it. A pipeline source for future spec and custom opportunities.',
    sections: [{ title: 'Direct Conversation', body: 'Tell us about your parcel — location, size, zoning, and timing. Our team will follow up personally.' }],
    ctaTitle: 'Submit your land',
    ctaLink: '/contact?service=I have land to sell#inquiry',
  },
  'second-opinion': {
    slug: 'second-opinion',
    metaTitle: 'Need a Second Opinion?',
    metaDescription: 'Outside review for a project already underway — builder transition or gut-check.',
    hero: { eyebrow: 'Second Opinion', title: 'Need another', titleEmphasis: 'perspective?' },
    intro: 'Whether you are considering a builder transition or simply want an outside gut-check on a project underway — reach a person, not a form funnel.',
    sections: [
      { title: 'Builder Transition', body: 'We have successfully taken over mid-construction projects — read our builder-transition case study for a real example.', },
      { title: 'Personal Contact', body: 'Call 425.827.2266 directly or submit a brief description through our contact form — routed to a senior team member for review.' },
    ],
    ctaTitle: 'Read the case study',
    ctaLink: '/case-studies/builder-transition',
  },
  'property-feasibility': {
    slug: 'property-feasibility',
    metaTitle: 'What Can I Build on My Property?',
    metaDescription: 'Evaluate build, ADU, renovation, or sell options for your Eastside property.',
    hero: { eyebrow: 'Property Evaluation', title: 'What can you', titleEmphasis: 'build here?' },
    intro: 'Branches into the path that fits — build here, ADU or DADU, renovate or rebuild, or talk to us about selling instead.',
    sections: [
      { title: 'Build Custom', body: 'Ground-up home on your lot.', bullets: ['→ Custom Homes'] },
      { title: 'ADU or DADU', body: 'Additional dwelling on existing lot.', bullets: ['→ ADUs & DADUs'] },
      { title: 'Renovate or Rebuild', body: 'Transform or replace existing structure.', bullets: ['→ Renovations'] },
      { title: 'Sell Instead', body: 'Explore selling your property or land.', bullets: ['→ Land Acquisition', '→ Sell to Buchan'] },
    ],
    ctaTitle: 'Start a conversation',
    ctaLink: '/contact',
  },
};

export const HOME_STARTING_POINTS = {
  anchor: [
    { title: 'How much will my project cost?', description: 'Personalized range from our estimator tool.', link: '/cost-estimator' },
    { title: 'What can I build on my property?', description: 'Build, ADU, renovate, or sell — find your path.', link: '/property-feasibility' },
  ],
  core: [
    { title: 'I want to build a custom home', description: 'Ground-up on your lot.', link: '/custom-homes' },
    { title: "I'm considering a major renovation", description: 'Whole-home and major remodel scope.', link: '/renovations' },
    { title: 'I have plans and need a builder', description: 'Upload plans, city, budget, timing.', link: '/contact?service=I have plans and need a builder#inquiry' },
    { title: "I'm looking for a move-in-ready home", description: 'Available and coming-soon homes.', link: '/available-homes' },
  ],
  secondary: [
    { title: 'Not sure where to start?', description: 'Tell us about your situation — we will guide you.', link: '/contact?service=Not sure where to start#inquiry' },
    { title: 'I have land to sell', description: 'Direct land acquisition intake.', link: '/land-acquisition' },
    { title: 'Thinking about an ADU?', description: 'Family housing or rental income.', link: '/services/adus' },
    { title: 'Need a second opinion?', description: 'Project underway — we can help.', link: '/second-opinion' },
    { title: 'Maintenance or small project', description: 'Buchan Home Care.', link: '/services/home-care' },
    { title: 'Just browsing', description: 'Why Choose Buchan and Portfolio.', link: '/why-choose-buchan' },
  ],
};

export const PROCESS_STAGES = [
  { n: '01', title: 'Discovery' },
  { n: '02', title: 'Property & Feasibility' },
  { n: '03', title: 'Preconstruction Agreement' },
  { n: '04', title: 'Design Alignment' },
  { n: '05', title: 'Construction Readiness' },
  { n: '06', title: 'Construction' },
  { n: '07', title: 'Completion & Continuing Care' },
];

export const CREDIBILITY_ITEMS = [
  'Family-owned since 1961',
  '65 years on the Eastside',
  'Long-term care after completion',
  'Best Custom Homebuilder — Silver 2026',
];

export const WHY_CHOOSE_VALUES = [
  { title: 'Certainty', body: 'Progressive estimates and preconstruction discipline reduce surprises.' },
  { title: 'Craftsmanship', body: 'Three generations of hands-on building standards.' },
  { title: 'Local Expertise', body: 'Eastside jurisdictions, slopes, and neighborhoods — known deeply.' },
  { title: 'White-Glove Care', body: 'A person who knows your project, not a ticket queue.' },
  { title: 'Continuing Support', body: 'Warranty, education, and Home Care after the keys.' },
];
