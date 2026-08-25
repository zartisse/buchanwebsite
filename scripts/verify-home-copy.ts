import { getDefaultHomeContent } from '../src/data/homeContentDefaults';

const content = getDefaultHomeContent();

const expectations: Array<[string, boolean]> = [
  ['hero title', content.hero.title === 'Build with certainty.'],
  ['hero emphasis', content.hero.title_emphasis === 'Live exceptionally.'],
  ['hero primary CTA', content.hero.cta_primary_label === 'Explore Our Work'],
  ['hero secondary hidden', !content.hero.cta_secondary_url && !content.hero.cta_secondary_label],
  ['featured body', content.featured_work.body?.startsWith('Each home we build') ?? false],
  ['difference paragraphs', content.difference_section.body.includes('\n\n')],
  ['ADU description', content.what_we_do.secondary[0].description.includes('Smart spaces')],
  ['custom homes CTA', content.what_we_do.primary[0].cta_label === 'Explore Custom Homes'],
  ['process CTA hidden', content.better_planned_path.cta_label === ''],
  ['testimonial cite', content.testimonial_section.cite.startsWith('— The Anderson Family')],
  ['testimonial CTA hidden', content.testimonial_section.cta_label === ''],
  ['path tile title', content.pick_your_path.tiles[0].title === 'I am considering building'],
  ['path tile CTA', !content.pick_your_path.tiles[0].cta_label?.includes('→')],
  ['content version', (content as { content_version?: number }).content_version === 2],
];

const failures = expectations.filter(([, ok]) => !ok).map(([label]) => label);

if (failures.length > 0) {
  console.error('Home copy verification failed:');
  failures.forEach((label) => console.error(`  - ${label}`));
  process.exit(1);
}

console.log('Home copy verification passed (' + expectations.length + ' checks).');
