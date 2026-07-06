export const HOUZZ_PROFILE_URL =
  'https://www.houzz.com/professionals/general-contractors/john-buchan-homes-pfvwus-pf~721476066';

export interface AwardBadge {
  image: string;
  alt: string;
  href?: string;
}

export const FOOTER_AWARD_BADGES: AwardBadge[] = [
  { image: '/assets/awards/boh-2022-design.png', alt: '2022 Best of Houzz Design', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2021.png', alt: '2021 Best of Houzz Design', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2020.jpg', alt: '2020 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2017.jpg', alt: '2017 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2016.jpg', alt: '2016 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/boh-2014.jpg', alt: '2014 Best of Houzz Service', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/houzz-thumbs-up.jpg', alt: 'Houzz Community Recommended', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/houzz-25k-saves.jpg', alt: 'Houzz 25K Saves', href: HOUZZ_PROFILE_URL },
  { image: '/assets/awards/houzz-community.jpg', alt: 'Houzz Community', href: HOUZZ_PROFILE_URL },
];
