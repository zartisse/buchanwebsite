import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { HUB_PAGE_SLUGS } from '../src/types/index';
import { getDemoHubPage } from '../src/data/hubContentDefaults';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../supabase/seed_hub_pages.sql');

function sqlEscape(value: string): string {
  return value.replace(/'/g, "''");
}

const lines = [
  '-- Seed all hub pages from default IA content',
  '-- Run after 004_hub_pages.sql',
  '-- Regenerate: npx tsx scripts/generate-hub-seed.ts',
  '',
];

for (const slug of HUB_PAGE_SLUGS) {
  const page = getDemoHubPage(slug);
  const contentJson = sqlEscape(JSON.stringify(page.content));

  lines.push('INSERT INTO hub_pages (slug, meta_title, meta_description, content)');
  lines.push('VALUES (');
  lines.push(`  '${slug}',`);
  lines.push(`  '${sqlEscape(page.meta_title)}',`);
  lines.push(`  '${sqlEscape(page.meta_description)}',`);
  lines.push(`  '${contentJson}'::jsonb`);
  lines.push(')');
  lines.push('ON CONFLICT (slug) DO NOTHING;');
  lines.push('');
}

fs.writeFileSync(outPath, `${lines.join('\n')}\n`);
console.log(`Wrote ${HUB_PAGE_SLUGS.length} hub pages to ${outPath}`);
