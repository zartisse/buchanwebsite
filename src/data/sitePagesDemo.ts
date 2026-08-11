import { getDefaultHomeContent } from './homeContentDefaults';
import { FOOTER_AWARD_BADGES } from './awards';
import type {
  AboutPageContent,
  AwardsPageContent,
  ContactPageContent,
  FaqPageContent,
  NeighborhoodsPageContent,
  ProcessPageContent,
  ServiceDetailPageContent,
  ServicesPageContent,
  SitePage,
  SitePageContentMap,
  SitePageSlug,
  TestimonialsPageContent,
  WarrantyPageContent,
} from '../types';

export const DEMO_SITE_PAGES: Record<SitePageSlug, SitePage> = {
  home: {
    id: 'demo-home',
    slug: 'home',
    meta_title: 'Build with Certainty | John Buchan Homes',
    meta_description: 'On your lot. To your standard. Custom homes on the Seattle Eastside since 1961.',
    content: getDefaultHomeContent(),
  },
  about: {
    id: 'demo-about',
    slug: 'about',
    meta_title: 'About Us',
    meta_description: 'Three generations of Buchan craftsmen building on the Seattle Eastside since 1960.',
    content: {
      hero: { eyebrow: 'Our Story', title: 'Built on legacy.', title_emphasis: 'Defined by you.' },
      timeline: {
        eyebrow: 'Timeline',
        title: '65 years of craft.',
        items: [
          { year: '1960', title: 'Founded', body: 'John Buchan opens his first workshop in Bellevue.' },
          { year: '1985', title: 'Second Generation', body: 'David Buchan joins the family business.' },
          { year: '2014', title: 'Eastside Expansion', body: 'Deepened presence across Bellevue, Medina, Clyde Hill, and surrounding communities.' },
          { year: 'Today', title: '65 Years', body: 'Three generations, one standard — yours.' },
        ],
      },
      mission: {
        eyebrow: 'Our Mission',
        title: 'Your standard is',
        title_emphasis: 'our standard.',
        body: "We don't build to impress other builders. We build to the standard you set — in every joint, every finish, every quiet detail.",
        image_url: '/assets/ph-arch-2.png',
      },
      team: {
        eyebrow: 'The Team',
        title: 'People who care',
        title_emphasis: 'deeply.',
        members: [
          { name: 'Mischelle McCall', role: 'Client Concierge', image_url: '/assets/ph-arch-1.png' },
          { name: 'David Buchan', role: 'President', image_url: '/assets/ph-arch-2.png' },
          { name: 'Sarah Lindqvist', role: 'Design Director', image_url: '/assets/ph-arch-3.png' },
          { name: 'Marcus Reyes', role: 'Construction Manager', image_url: '/assets/ph-arch-4.png' },
        ],
      },
      giving_back: {
        eyebrow: 'Giving Back',
        title: 'Building community,',
        title_emphasis: 'not just homes.',
        image_url: '/assets/ph-arch-3.png',
      },
      cta: {
        join_title: 'Join our team.',
        join_body: "We're always looking for craftspeople who share our standard.",
        land_title: 'We buy land.',
        land_body: "Have a lot on the Eastside? We'd love to hear about it.",
      },
    } satisfies AboutPageContent,
  },
  services: {
    id: 'demo-services',
    slug: 'services',
    meta_title: 'Services',
    meta_description: 'Build, Design, and Remodel — three ways to create something lasting with John Buchan Homes.',
    content: {
      hero: { eyebrow: 'What We Do', title: 'Services that support', title_emphasis: 'every stage.' },
      items: [
        { title: 'Custom Homes', slug: 'custom-homes', description: 'Ground-up custom homes on your lot — from foundation to final walkthrough.', image_url: '/assets/ph-arch-2.png' },
        { title: 'Renovations', slug: 'renovations', description: 'Major whole-home and room-scale renovations with the Buchan standard.', image_url: '/assets/ph-arch-4.png' },
        { title: 'Preconstruction', slug: 'preconstruction', description: 'Feasibility, progressive estimates, and design alignment before breaking ground.', image_url: '/assets/ph-arch-3.png' },
        { title: 'ADUs & DADUs', slug: 'adus', description: 'Accessory dwellings for family housing or rental income.', image_url: '/assets/ph-arch-1.png' },
        { title: 'Real Estate Services', slug: 'real-estate', description: 'Find your lot, sell your home, or explore selling directly to Buchan.', image_url: '/assets/ph-arch-2.png' },
        { title: 'Buchan Home Care', slug: 'home-care', description: 'Maintenance and smaller projects for existing homeowners.', image_url: '/assets/ph-arch-3.png' },
      ],
      cta_title: 'Ready to begin?',
    } satisfies ServicesPageContent,
  },
  build: {
    id: 'demo-build',
    slug: 'build',
    meta_title: 'Custom Build',
    meta_description: 'Ground-up custom homes on your lot in Bellevue, Clyde Hill, Medina, and Redmond.',
    content: {
      hero: { eyebrow: 'Services', title: 'Custom', title_emphasis: 'Build' },
      image_url: '/assets/ph-arch-1.png',
      steps: [
        { n: '01', title: 'Lot & Vision', body: 'We evaluate your land and understand your goals.' },
        { n: '02', title: 'Design', body: 'Architecture and interiors developed together.' },
        { n: '03', title: 'Estimate', body: 'Transparent pricing before we break ground.' },
        { n: '04', title: 'Permitting', body: 'We navigate codes and approvals on your behalf.' },
        { n: '05', title: 'Build', body: 'Craftsmanship at every stage, on your lot.' },
      ],
      cta_title: "Let's talk about your project.",
    } satisfies ServiceDetailPageContent,
  },
  design: {
    id: 'demo-design',
    slug: 'design',
    meta_title: 'Design',
    meta_description: 'Architecture and interior design unified under one roof.',
    content: {
      hero: { eyebrow: 'Services', title: 'Design &', title_emphasis: 'Architecture' },
      image_url: '/assets/ph-arch-3.png',
      steps: [
        { n: '01', title: 'Discovery', body: 'How you live, how you want to feel at home.' },
        { n: '02', title: 'Concept', body: 'Initial plans and material palettes.' },
        { n: '03', title: 'Development', body: 'Detailed drawings and specifications.' },
        { n: '04', title: 'Build', body: 'Design intent carried through construction.' },
      ],
      cta_title: "Let's talk about your project.",
    } satisfies ServiceDetailPageContent,
  },
  remodel: {
    id: 'demo-remodel',
    slug: 'remodel',
    meta_title: 'Remodel',
    meta_description: 'Whole-home and room-scale renovations on the Seattle Eastside.',
    content: {
      hero: { eyebrow: 'Services', title: 'Thoughtful', title_emphasis: 'Remodel' },
      image_url: '/assets/ph-arch-4.png',
      steps: [
        { n: '01', title: 'Assessment', body: 'Understanding your existing home and goals.' },
        { n: '02', title: 'Design', body: "Plans that respect what works and improve what doesn't." },
        { n: '03', title: 'Phasing', body: 'Minimal disruption while you stay in your home.' },
        { n: '04', title: 'Finish', body: 'The same Buchan standard, in the home you already love.' },
      ],
      cta_title: "Let's talk about your project.",
    } satisfies ServiceDetailPageContent,
  },
  process: {
    id: 'demo-process',
    slug: 'process',
    meta_title: 'Our Process',
    meta_description: 'From first conversation to final walkthrough — how we build custom homes on the Eastside.',
    content: {
      hero: { eyebrow: 'Custom Home Process', title: 'The Buchan', title_emphasis: 'Process' },
      steps: [
        { n: '01', title: 'Discover & Evaluate', duration: 'Weeks 1–4', body: 'Your vision, site conditions, and investment goals — understood before design deepens.', tag: 'Discover' },
        { n: '02', title: 'Plan & Align', duration: 'Weeks 4–12', body: 'Progressive estimates, design coordination, and constructability review with your project team.', tag: 'Plan' },
        { n: '03', title: 'Build with Discipline', duration: 'Months 6–18', body: 'Craftsmanship on site with clear milestones, communication, and quality at every layer.', tag: 'Build' },
        { n: '04', title: 'Care Beyond Completion', duration: 'Ongoing', body: 'Walkthrough, warranty support, and continuing Home Care after move-in day.', tag: 'Care' },
      ],
      cta_title: 'Ready to begin?',
    } satisfies ProcessPageContent,
  },
  neighborhoods: {
    id: 'demo-neighborhoods',
    slug: 'neighborhoods',
    meta_title: 'Neighborhoods',
    meta_description: 'Custom homes in Bellevue, Clyde Hill, Medina, Redmond, and across the Seattle Eastside.',
    content: {
      hero: { eyebrow: 'Where We Build', title: 'Eastside', title_emphasis: 'Neighborhoods' },
      areas: [
        { name: 'Bellevue', body: 'From Bridle Trails to downtown, we know every neighborhood.', image_url: '/assets/ph-arch-1.png' },
        { name: 'Clyde Hill', body: "Estate-scale homes on some of the Eastside's most coveted lots.", image_url: '/assets/ph-arch-2.png' },
        { name: 'Medina', body: 'Lake Washington views and quiet streets — built to match.', image_url: '/assets/ph-arch-3.png' },
        { name: 'Redmond', body: "Growing families and established neighborhoods we've served for decades.", image_url: '/assets/ph-arch-4.png' },
      ],
      cta_title: 'Find your neighborhood.',
    } satisfies NeighborhoodsPageContent,
  },
  testimonials: {
    id: 'demo-testimonials',
    slug: 'testimonials',
    meta_title: 'Testimonials',
    meta_description: 'What our clients say about building with John Buchan Homes.',
    content: {
      hero: { eyebrow: 'Client Stories', title: 'In their', title_emphasis: 'words.' },
      featured: {
        quote: 'They stepped in when our project stalled — and finished it with a level of care we didn\'t think was still possible.',
        cite: 'The Harmon Family · Clyde Hill',
        image_url: '/assets/ph-arch-1.png',
      },
      quotes: [
        { name: 'The Castellanos Family', city: 'Clyde Hill', quote: 'They treated our home like it was their own — every detail considered, every question answered.' },
        { name: 'James & Elena Park', city: 'Medina', quote: 'The preconstruction phase saved us from at least three expensive surprises before we broke ground.' },
        { name: 'Robert Whitmore', city: 'Bellevue', quote: 'Three generations of builders who still show up on site. That matters when you are investing at this level.' },
        { name: 'Sarah Lindqvist', city: 'Hunts Point', quote: 'Our whole-home renovation felt as organized as a new build — clear milestones, clear communication.' },
        { name: 'David Okonkwo', city: 'Redmond', quote: 'Built on our lot, on our timeline, to our standard. Exactly as promised.' },
        { name: 'Priya Anand', city: 'Yarrow Point', quote: 'Mischelle made sure we never felt lost in the process. That concierge touch is real.' },
        { name: 'Michael & Laura Chen', city: 'Newcastle', quote: 'The progressive estimates meant we always knew where budget stood — no guessing, no anxiety.' },
        { name: 'Greg & Amanda Foster', city: 'Mercer Island', quote: 'We needed a second opinion on a project underway. Buchan gave us honesty, not a sales pitch.' },
      ],
      cta_title: 'Ready to write your story?',
    } satisfies TestimonialsPageContent,
  },
  contact: {
    id: 'demo-contact',
    slug: 'contact',
    meta_title: 'Contact',
    meta_description: 'Get in touch with John Buchan Homes — custom builder on the Seattle Eastside since 1960.',
    content: {
      hero: { eyebrow: 'Get in Touch', title: 'Start the', title_emphasis: 'conversation.' },
      inquiry_title: 'Send an inquiry',
      service_options: [
        'I want to build a custom home',
        "I'm planning a major renovation",
        'Preconstruction / planning',
        'I am looking for a move-in-ready home',
        'I have plans and need a builder',
        'I have land to sell',
        'Real estate services',
        'Sell directly to Buchan',
        'ADU / DADU',
        'Buchan Home Care',
        'Request service / warranty',
        'Need a second opinion on my project',
        'Not sure where to start',
        'General inquiry',
      ],
      visit_title: 'Visit us',
      phone: '425.827.2266',
      phone_href: 'tel:4258272266',
      office: 'Bellevue, Washington\nServing the Seattle Eastside',
      cta_title: 'Know your numbers?',
    } satisfies ContactPageContent,
  },
  faq: {
    id: 'demo-faq',
    slug: 'faq',
    meta_title: 'FAQ',
    meta_description: 'Answers to common questions about building a custom home with John Buchan Homes on the Seattle Eastside.',
    content: {
      hero: { eyebrow: 'Questions', title: 'What to', title_emphasis: 'expect.' },
      intro: 'Building a custom home is a significant investment of time and trust. Here are answers to the questions we hear most often from Eastside homeowners.',
      categories: [
        {
          title: 'Custom Home FAQ',
          items: [
            { question: 'Do you only build on my lot?', answer: 'Yes. We specialize in ground-up custom homes on the Seattle Eastside — Bellevue, Clyde Hill, Medina, Redmond, and surrounding communities.' },
            { question: 'How do I know if my lot is buildable?', answer: 'We evaluate your lot early — zoning, setbacks, slope, utilities, and access. Our preconstruction team helps you understand what is possible before design begins in earnest.' },
            { question: 'Can I bring my own architect?', answer: 'Absolutely. We collaborate with independent architects on every project. Clients may also bring interior designers and other trusted professionals. Buchan provides estimating, constructability review, schedule planning, coordination, and construction leadership from the early stages.' },
            { question: 'How is pricing structured?', answer: 'We provide transparent progressive estimates through preconstruction. You understand scope, allowances, and selections before breaking ground.' },
            { question: 'Do you offer a cost estimator?', answer: 'Yes. Use our Estimate My Project tool for a preliminary range, then contact us to refine numbers based on your lot and vision.' },
          ],
        },
        {
          title: 'Renovation FAQ',
          items: [
            { question: 'How long does a major renovation take?', answer: 'Timelines vary by scope — from several months for focused remodels to a year or more for whole-home transformations. We map phasing and permits before demolition begins.' },
            { question: 'Can we live in the home during construction?', answer: 'Often yes, with planned phasing, dust control, and weekly walkthroughs. We discuss livability constraints honestly during preconstruction.' },
            { question: 'Do renovations use the same process as custom builds?', answer: 'Yes. Renovations benefit from the same progressive estimating, design coordination, and quality standards as our custom home work.' },
          ],
        },
        {
          title: 'Process & Timeline',
          items: [
            { question: 'How long does a custom build take?', answer: 'Most custom homes on the Eastside take 12–18 months from breaking ground to final walkthrough, depending on size, complexity, and permitting. Design and permitting typically add several months before construction begins.' },
            { question: 'What happens during permitting?', answer: 'We navigate city and county codes, submit plans, and manage revisions on your behalf. Permitting timelines vary by jurisdiction — we keep you informed at every stage.' },
            { question: 'Will I have a single point of contact?', answer: 'Yes. A dedicated concierge stays with you from first conversation through aftercare — one person who knows your project inside and out.' },
          ],
        },
        {
          title: 'After Move-In',
          items: [
            { question: 'What warranty do you provide?', answer: 'We stand behind our work with a structured warranty and responsive aftercare. See our Warranty & Aftercare page for full details.' },
            { question: 'Who do I call after we move in?', answer: 'Your concierge remains your first call. We coordinate punch-list items, warranty questions, and any follow-up needs promptly.' },
          ],
        },
        {
          title: 'Privacy Policy',
          items: [
            { question: 'How do you use my contact information?', answer: 'We use your information only to respond to inquiries and provide project-related communication. We do not sell personal data to third parties.' },
          ],
        },
      ],
      cta_title: 'Still have questions?',
    } satisfies FaqPageContent,
  },
  warranty: {
    id: 'demo-warranty',
    slug: 'warranty',
    meta_title: 'Warranty & Aftercare',
    meta_description: 'John Buchan Homes warranty coverage and ongoing aftercare for custom homes on the Seattle Eastside.',
    content: {
      hero: { eyebrow: 'Peace of Mind', title: 'Warranty &', title_emphasis: 'Aftercare.' },
      intro: 'Our relationship does not end at the walkthrough. For generations, Buchan clients have counted on us long after the keys are handed over — because true craftsmanship deserves lasting support.',
      sections: [
        {
          title: 'Built to last — backed by us.',
          body: 'Every Buchan home is constructed to a standard we would build for our own families. That means rigorous quality checks during construction and a clear warranty process once you move in.',
        },
        {
          title: 'Your concierge, after move-in.',
          body: 'Mischelle McCall and our team remain your single point of contact. Whether it is a warranty question, a seasonal check-in, or guidance on caring for your home, you are never left searching for answers.',
        },
      ],
      coverage_items: [
        { title: 'Structural warranty', description: 'Coverage for major structural components per our written warranty agreement and applicable Washington State requirements.' },
        { title: 'Workmanship', description: 'We address defects in materials and workmanship reported during the warranty period promptly and professionally.' },
        { title: 'Systems & finishes', description: 'Mechanical, electrical, and installed systems are documented at handover. We help you understand care, maintenance, and warranty terms for each.' },
        { title: 'Punch list & close-out', description: 'Before you move in, we walk every room with you. Open items are tracked to completion — nothing is left unresolved.' },
        { title: 'Ongoing support', description: 'Questions after warranty? We are still here. Buchan clients are part of a community we have served for over 65 years.' },
      ],
      cta_title: 'Questions about coverage?',
    } satisfies WarrantyPageContent,
  },
  awards: {
    id: 'demo-awards',
    slug: 'awards',
    meta_title: 'Awards, Press & Credentials',
    meta_description: 'Recognition, press, and professional credentials for John Buchan Homes — Bellevue custom builder since 1960.',
    content: {
      hero: { eyebrow: 'Recognition', title: 'Awards &', title_emphasis: 'credentials.' },
      intro: 'For more than six decades, John Buchan Homes has been recognized by clients, industry peers, and the design community for craftsmanship, service, and integrity on the Seattle Eastside.',
      awards: [
        { title: 'Best of Houzz — Design', year: '2022', description: 'Recognized for excellence in residential design and client satisfaction.' },
        { title: 'Best of Houzz — Design', year: '2021', description: 'Honored for outstanding design work and portfolio quality.' },
        { title: 'Best of Houzz — Service', year: '2020', description: 'Awarded for exceptional client service throughout the building process.' },
        { title: 'Best of Houzz — Service', year: '2017', description: 'Consistent recognition for communication, reliability, and results.' },
        { title: 'Best of Houzz — Service', year: '2016', description: 'Client-reviewed excellence in custom home building.' },
        { title: 'Best of Houzz — Service', year: '2014', description: 'Among the first Eastside builders honored on Houzz for service.' },
        { title: 'Houzz Community Recommended', year: '—', description: 'Recommended by the Houzz community for quality and professionalism.' },
        { title: '25K+ Houzz Saves', year: '—', description: 'Our work has been saved and shared by thousands of homeowners and design professionals.' },
      ],
      press: [
        { title: 'Built for the rain', source: 'John Buchan Homes Blog', date: '2026', excerpt: 'What "built for the rain" really means in the Pacific Northwest — and why it matters for your home.', url: '/blog/built-for-the-rain' },
        { title: 'Clyde Hill estate, framing to finish', source: 'John Buchan Homes Blog', date: '2026', excerpt: 'A look at every stage of one of our most considered builds to date.', url: '/blog/clyde-hill-framing-to-finish' },
        { title: 'Six Best of Houzz awards', source: 'Company Updates', date: '2026', excerpt: 'Recognition is nice. The standard behind it is the point.', url: '/blog/best-of-houzz' },
      ],
      credentials: [
        { title: 'Licensed & insured', body: 'John Buchan Homes is a licensed general contractor serving Bellevue and the greater Seattle Eastside, fully insured for your protection.' },
        { title: '65 years in business', body: 'Three generations of Buchan craftsmen — building on the Eastside since 1960.' },
        { title: 'Collaborative project leadership', body: 'We align independent architects, interior designers, and specialty consultants around your vision — with Buchan leading construction from the early stages.' },
        { title: 'Client concierge', body: 'Dedicated single point of contact throughout your project and beyond.' },
      ],
      badges: FOOTER_AWARD_BADGES.map((b) => ({ image_url: b.image, alt: b.alt, href: b.href })),
      cta_title: 'Experience the Buchan standard.',
    } satisfies AwardsPageContent,
  },
};

export function getDemoSitePage<S extends SitePageSlug>(slug: S): SitePage<S> {
  return DEMO_SITE_PAGES[slug] as SitePage<S>;
}

export function getDemoPageContent<S extends SitePageSlug>(slug: S): SitePageContentMap[S] {
  return getDemoSitePage(slug).content;
}
