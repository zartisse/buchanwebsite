/**
 * Verify Supabase connectivity and required tables/columns.
 * Run: npx tsx scripts/verify-supabase.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env.local');
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key || url.includes('your-project')) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env.local');
  process.exit(1);
}

type Check = { name: string; ok: boolean; detail?: string };

async function restSelect(table: string, select: string): Promise<Check> {
  const endpoint = `${url}/rest/v1/${table}?select=${encodeURIComponent(select)}&limit=1`;
  const res = await fetch(endpoint, {
    headers: { apikey: key!, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) {
    const body = await res.text();
    return { name: `${table}.${select}`, ok: false, detail: body.slice(0, 200) };
  }
  return { name: `${table}.${select}`, ok: true };
}

async function main() {
  const checks: Check[] = [];
  checks.push(await restSelect('site_pages', 'slug'));
  checks.push(await restSelect('properties', 'featured'));
  checks.push(await restSelect('posts', 'slug'));
  checks.push(await restSelect('posts', 'featured'));
  checks.push(await restSelect('properties', 'portfolio_type'));

  const bucketRes = await fetch(`${url}/storage/v1/bucket/media`, {
    headers: { apikey: key!, Authorization: `Bearer ${key}` },
  });
  checks.push({
    name: 'storage.media bucket',
    ok: bucketRes.ok,
    detail: bucketRes.ok ? undefined : (await bucketRes.text()).slice(0, 200),
  });

  console.log('\nSupabase verification\n');
  for (const c of checks) {
    console.log(`${c.ok ? '✓' : '✗'} ${c.name}${c.detail ? ` — ${c.detail}` : ''}`);
  }

  const failed = checks.filter((c) => !c.ok);
  const required = failed.filter((c) => !c.name.includes('featured') && !c.name.includes('portfolio_type') && c.name !== 'storage.media bucket');
  if (required.length) {
    console.log('\nCritical checks failed. Hub pages use site_pages (no hub_pages table required).');
    console.log('Optional: run supabase/apply_cms_migrations.sql for featured posts, portfolio_type, media bucket.');
    process.exit(1);
  }
  if (failed.length) {
    console.log('\nOptional migrations not applied (CMS still works with fallbacks):');
    failed.forEach((c) => console.log(`  - ${c.name}`));
  }
  console.log('\nAll checks passed. Admin login: /admin/login');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
