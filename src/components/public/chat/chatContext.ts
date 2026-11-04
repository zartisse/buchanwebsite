/** Page-aware prompts for the chat widget: teaser line + starter questions. */
export type ChatPageContext = {
  key: string;
  teaser: string | null;
  starters: string[];
};

const DEFAULT_CONTEXT: ChatPageContext = {
  key: 'general',
  teaser: 'Planning a home or a renovation? Ask us anything.',
  starters: [
    "I'm thinking about building a custom home",
    "I'm planning a major renovation",
    'How does your process work?',
    'Which areas do you build in?',
  ],
};

const RULES: { test: (path: string) => boolean; ctx: ChatPageContext }[] = [
  {
    test: (p) => p.startsWith('/renovations') || p.includes('remodel'),
    ctx: {
      key: 'renovation',
      teaser: 'Planning a renovation? See what the first meeting covers.',
      starters: [
        'What happens at the first meeting?',
        'How do you approach renovation budgets?',
        'How long does a whole-home renovation take?',
        'Can we live in the house during the work?',
      ],
    },
  },
  {
    test: (p) => p.startsWith('/custom-homes') || p.startsWith('/preconstruction') || p.startsWith('/land'),
    ctx: {
      key: 'custom-home',
      teaser: 'Building on your lot? Ask how the process starts.',
      starters: [
        'I own a lot. Where do we start?',
        'How does preconstruction work?',
        'How are budgets set early on?',
        'Do you work with my architect?',
      ],
    },
  },
  {
    test: (p) => p.startsWith('/services/adus'),
    ctx: {
      key: 'adu',
      teaser: 'Thinking about an ADU or DADU? Ask what fits your lot.',
      starters: [
        'Can I build an ADU on my property?',
        'How long does an ADU take to build?',
        'What does the permit process look like?',
      ],
    },
  },
  {
    test: (p) => p.startsWith('/portfolio') || p.startsWith('/available-homes'),
    ctx: {
      key: 'portfolio',
      teaser: 'See a home you like? Ask us about it.',
      starters: [
        'Could you build something like this for me?',
        'Which homes are available now?',
        'How does the process start?',
      ],
    },
  },
  {
    test: (p) => p.startsWith('/contact'),
    ctx: { ...DEFAULT_CONTEXT, key: 'contact', teaser: null },
  },
];

export function chatContextForPath(pathname: string): ChatPageContext {
  const path = pathname.toLowerCase();
  return RULES.find((r) => r.test(path))?.ctx ?? DEFAULT_CONTEXT;
}

const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;

export function findEmail(text: string): string | null {
  return text.match(EMAIL_RE)?.[0] ?? null;
}

/** Build the HubSpot meetings URL for the embedded calendar, prefilled when we know who they are. */
export function meetingEmbedUrl(base: string, lead: { name?: string; email?: string }, embed = true): string {
  try {
    const url = new URL(base);
    if (embed) url.searchParams.set('embed', 'true');
    const [first, ...rest] = (lead.name ?? '').trim().split(/\s+/).filter(Boolean);
    if (first) url.searchParams.set('firstname', first);
    if (rest.length) url.searchParams.set('lastname', rest.join(' '));
    if (lead.email) url.searchParams.set('email', lead.email);
    return url.toString();
  } catch {
    return base;
  }
}

export const BOOK_TOKEN = /\[\[\s*BOOK\s*\]\]/gi;
