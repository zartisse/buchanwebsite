export const HOUZZ_PROFILE_URL =
  'https://www.houzz.com/professionals/general-contractors/john-buchan-homes-pfvwus-pf~721476066';

export interface AwardBadge {
  image?: string;
  alt: string;
  href?: string;
}

export const FOOTER_AWARD_BADGES: AwardBadge[] = [
  { image: '/assets/awards/boh-2022-design.png', alt: '2022 Best of Houzz Design', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2021.png', alt: '2021 Best of Houzz Design', href: HOUZZ_PROFILE_URL },
  { alt: 'Best Custom Homebuilder', href: '/awards' },
  { alt: 'NAHB', href: 'https://www.nahb.org/' },
  { alt: 'Built Green', href: 'https://www.builtgreen.net/' },
  { alt: 'MBA-KS', href: '/awards' },
  { alt: 'Premier Builders Group', href: '/awards' },
  { image: '/assets/awards/boh-2020.jpg', alt: '2020 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2017.jpg', alt: '2017 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
];
