/**
 * Applies the Nov 2026 fixes to Supabase in one go:
 *   012 admin-only access, 013 brand copy fixes, 014 remove sample leads,
 *   then deploys the notify-submission, chat and index-knowledge-source functions.
 *
 * Needs SUPABASE_ACCESS_TOKEN in .env.local (already there for chatbot:deploy).
 * Run: npm run deploy:fixes
 *      npm run deploy:fixes -- --sql-only
 *      npm run deploy:fixes -- --functions-only
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIGRATIONS = ['012_admin_only_access.sql', '013_brand_copy_fixes.sql', '014_remove_sample_leads.sql'];
const FUNCTIONS = ['notify-submission', 'chat', 'index-knowledge-source'];

function loadEnv() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) process.env[match[1].trim()] = match[2].trim();
  }
}

function projectRef() {
  return process.env.VITE_SUPABASE_URL?.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1] ?? '';
}

async function runSql(ref, token, file) {
  const query = fs.readFileSync(path.join(root, 'supabase/migrations', file), 'utf8');
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${file} failed (HTTP ${res.status}): ${text}`);
  console.log(`✓ Applied ${file}`);
  if (text && text !== '[]') console.log(`  result: ${text.slice(0, 1500)}`);
}

async function main() {
  loadEnv();
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = projectRef();
  if (!token || !ref) {
    console.error('✗ Need SUPABASE_ACCESS_TOKEN and VITE_SUPABASE_URL in .env.local');
    process.exit(1);
  }
  if (!process.argv.includes('--functions-only')) {
    for (const file of MIGRATIONS) await runSql(ref, token, file);
  }
  if (!process.argv.includes('--sql-only')) {
    for (const fn of FUNCTIONS) {
      const r = spawnSync('npx', ['-y', 'supabase@latest', 'functions', 'deploy', fn, '--project-ref', ref], {
        cwd: root,
        stdio: 'inherit',
        env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
      });
      if (r.status !== 0) {
        console.error(`✗ Deploy failed for ${fn}`);
        process.exit(r.status ?? 1);
      }
      console.log(`✓ Deployed ${fn}`);
    }
  }
  console.log('\nDone. Next: add RESEND_API_KEY in Supabase → Edge Functions → Secrets (see FIXES_NOV_2026.md).');
}

main().catch((e) => {
  console.error(`✗ ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
