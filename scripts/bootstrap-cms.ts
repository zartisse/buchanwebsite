/**
 * Seed hub pages into site_pages and verify CMS readiness.
 * Run: npx tsx scripts/bootstrap-cms.ts
 *
 * Optional in .env.local:
 *   SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD — for seeding hub pages
 *   SUPABASE_DB_PASSWORD — for applying SQL migrations via direct connection
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';
import { HUB_PAGE_SLUGS } from '../src/types/index';
import { getDemoHubPage } from '../src/data/hubContentDefaults';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env.local');
const logEndpoint = 'http://127.0.0.1:7673/ingest/96b34018-b8d2-464d-a26d-868e5a862d9d';
const sessionId = '787a69';

function loadEnv() {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

function debugLog(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  // #region agent log
  fetch(logEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': sessionId },
    body: JSON.stringify({ sessionId, location, message, data, hypothesisId, timestamp: Date.now(), runId: 'bootstrap' }),
  }).catch(() => {});
  // #endregion
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL!;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const adminEmail = process.env.SUPABASE_ADMIN_EMAIL ?? 'admin@buchan.com';
const adminPassword = process.env.SUPABASE_ADMIN_PASSWORD ?? 'BuchanAdmin2026!';
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

function projectRef(supabaseUrl: string) {
  return supabaseUrl.replace('https://', '').split('.')[0];
}

async function applyMigrationsIfPossible() {
  if (!dbPassword || !url) {
    debugLog('bootstrap-cms.ts:applyMigrations', 'skipped — no SUPABASE_DB_PASSWORD', {}, 'H1');
    return false;
  }
  const ref = projectRef(url);
  const connectionString = `postgresql://postgres.${ref}:${encodeURIComponent(dbPassword)}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
  const sqlPath = path.join(root, 'supabase/apply_cms_migrations.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(sql);
    debugLog('bootstrap-cms.ts:applyMigrations', 'migrations applied', { ref }, 'H1');
    console.log('✓ Applied CMS migrations via database connection');
    return true;
  } catch (e) {
    debugLog('bootstrap-cms.ts:applyMigrations', 'migration failed', { error: String(e) }, 'H1');
    console.warn('⚠ Could not apply migrations:', e instanceof Error ? e.message : e);
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

async function ensureMediaBucket(token: string) {
  const check = await fetch(`${url}/storage/v1/bucket/media`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });
  if (check.ok) {
    debugLog('bootstrap-cms.ts:mediaBucket', 'exists', {}, 'H11');
    console.log('✓ Media storage bucket ready');
    return true;
  }
  const create = await fetch(`${url}/storage/v1/bucket`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: 'media', public: true }),
  });
  const ok = create.ok || create.status === 409;
  debugLog('bootstrap-cms.ts:mediaBucket', 'create', { ok, status: create.status }, 'H11');
  console.log(ok ? '✓ Media storage bucket ready' : `⚠ Could not create media bucket (${create.status})`);
  return ok;
}

async function signIn(): Promise<string | null> {
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { apikey: anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  const body = await res.json();
  debugLog('bootstrap-cms.ts:signIn', 'auth result', { ok: res.ok, status: res.status }, 'H2');
  if (!res.ok) {
    console.warn('⚠ Admin sign-in failed:', body.error_description ?? body.msg ?? res.status);
    return null;
  }
  return body.access_token as string;
}

async function seedHubPages(token: string) {
  let seeded = 0;
  for (const slug of HUB_PAGE_SLUGS) {
    const page = getDemoHubPage(slug);
    const res = await fetch(`${url}/rest/v1/site_pages?on_conflict=slug`, {
      method: 'POST',
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        slug: page.slug,
        meta_title: page.meta_title,
        meta_description: page.meta_description,
        content: page.content,
      }),
    });
    if (res.ok) seeded += 1;
    else {
      const err = await res.text();
      debugLog('bootstrap-cms.ts:seedHubPages', 'seed failed', { slug, err: err.slice(0, 200) }, 'H3');
    }
  }
  debugLog('bootstrap-cms.ts:seedHubPages', 'seed complete', { seeded, total: HUB_PAGE_SLUGS.length }, 'H3');
  console.log(`✓ Seeded ${seeded}/${HUB_PAGE_SLUGS.length} hub pages into site_pages`);
}

async function verify() {
  const checks = [
    ['site_pages', 'slug'],
    ['properties', 'featured'],
    ['posts', 'slug'],
  ] as const;
  const results: Record<string, boolean> = {};
  for (const [table, col] of checks) {
    const res = await fetch(`${url}/rest/v1/${table}?select=${col}&limit=1`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    });
    results[`${table}.${col}`] = res.ok;
  }
  const bucketRes = await fetch(`${url}/storage/v1/bucket/media`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  results['storage.media'] = bucketRes.ok;

  const hubRes = await fetch(`${url}/rest/v1/site_pages?select=slug&slug=in.(${HUB_PAGE_SLUGS.slice(0, 3).join(',')})`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });
  results['hub_pages_in_site_pages'] = hubRes.ok;

  debugLog('bootstrap-cms.ts:verify', 'verification', results, 'H4');
  console.log('\nVerification:');
  for (const [k, v] of Object.entries(results)) console.log(`${v ? '✓' : '✗'} ${k}`);
  return results;
}

async function main() {
  if (!url || !anonKey) {
    console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env.local');
    process.exit(1);
  }

  console.log('Bootstrapping Buchan CMS…\n');
  await applyMigrationsIfPossible();

  const token = await signIn();
  if (token) {
    await ensureMediaBucket(token);
    await seedHubPages(token);
  } else console.log('→ Skipping hub page seed (create admin via supabase/seed_admin.sql first)');

  await verify();
  console.log('\nDone. Sign in at /admin/login');
}

main().catch((err) => {
  debugLog('bootstrap-cms.ts:main', 'fatal', { error: String(err) }, 'H5');
  console.error(err);
  process.exit(1);
});
