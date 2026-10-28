/**
 * Apply chatbot migration (009) and verify tables when SUPABASE_DB_PASSWORD is set.
 * Run: npx tsx scripts/setup-chatbot.ts
 *
 * Optional in .env.local:
 *   SUPABASE_DB_PASSWORD — applies supabase/migrations/009_chatbot_knowledge.sql via pooler
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env.local');

function loadEnv() {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;
const dbPassword = process.env.SUPABASE_DB_PASSWORD;

function projectRef(supabaseUrl: string) {
  return supabaseUrl.replace('https://', '').split('.')[0];
}

async function applyMigration() {
  if (!dbPassword || !url || url.includes('your-project')) {
    console.log('Skip SQL apply: set real VITE_SUPABASE_URL and SUPABASE_DB_PASSWORD in .env.local');
    return false;
  }
  const ref = projectRef(url);
  const connectionString = `postgresql://postgres.${ref}:${encodeURIComponent(dbPassword)}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
  const sqlPath = path.join(root, 'supabase/migrations/009_chatbot_knowledge.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
  try {
    await client.connect();
    await client.query(sql);
    console.log('✓ Applied chatbot migration 009');
    return true;
  } catch (e) {
    console.error('✗ Migration failed:', e instanceof Error ? e.message : e);
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

async function verify() {
  if (!url || !key || url.includes('your-project')) {
    console.error('Missing real Supabase URL/anon key in .env.local');
    process.exit(1);
  }
  const tables = ['chatbot_settings', 'knowledge_sources', 'knowledge_chunks'];
  let ok = true;
  for (const table of tables) {
    const res = await fetch(`${url}/rest/v1/${table}?select=id&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const pass = res.ok;
    console.log(`${pass ? '✓' : '✗'} ${table}${!pass ? ` — ${(await res.text()).slice(0, 120)}` : ''}`);
    if (!pass) ok = false;
  }
  if (!ok) {
    console.log('\nIf tables are missing, run supabase/migrations/009_chatbot_knowledge.sql in Supabase → SQL Editor.');
    process.exit(1);
  }
  console.log(`
Database ready for chatbot. Next steps:
  1. Supabase → Edge Functions → Secrets: set OPENAI_API_KEY (billing/credits active)
  2. Deploy: supabase functions deploy chat index-knowledge-source
  3. Admin → Knowledge & Chatbot: enable widget, Sync CMS / Re-index
  4. Smoke test: npm run cms:smoke-chat
`);
}

async function main() {
  await applyMigration();
  await verify();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
