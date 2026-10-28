export const HOUZZ_PROFILE_URL =
  'https://www.houzz.com/professionals/general-contractors/john-buchan-homes-pfvwus-pf~721476066';

export interface AwardBadge {
  image?: string;
  alt: string;
  href?: string;
}

export const FOOTER_AWARD_BADGES: AwardBadge[] = [
  {
    image: '/assets/awards/best-in-pnw-2026.jpg',
    alt: 'Best in the PNW 2026 Winner — The Seattle Times, The People’s Choice',
    href: '/awards',
  },
  { image: '/assets/awards/boh-2022-design.png', alt: '2022 Best of Houzz Design', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2021.png', alt: '2021 Best of Houzz Design', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2020.jpg', alt: '2020 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2017.jpg', alt: '2017 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2016.jpg', alt: '2016 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2014.jpg', alt: '2014 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/houzz-community.jpg', alt: 'Houzz Community Recommended', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/houzz-25k-saves.jpg', alt: '25K+ Houzz Saves', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/houzz-thumbs-up.jpg', alt: 'Houzz Thumbs Up', href: HOUZZ_PROFILE_URL },
  { alt: 'Best Custom Homebuilder', href: '/awards' },
  { alt: 'NAHB', href: 'https://www.nahb.org/' },
  { alt: 'Built Green', href: 'https://www.builtgreen.net/' },
  { alt: 'MBA-KS', href: '/awards' },
  { alt: 'Premier Builders Group', href: '/awards' },
];
