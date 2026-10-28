/**
 * Applies chatbot migrations and deploys the chatbot Edge Functions.
 *
 * Needs SUPABASE_ACCESS_TOKEN in .env.local (Supabase → Account → Access Tokens).
 * It has no VITE_ prefix, so it is never bundled into the website.
 *
 * Run: npm run chatbot:deploy            (migration 011 + both functions)
 *      npm run chatbot:deploy -- --functions-only
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const MIGRATIONS = ['011_knowledge_crawl.sql'];
const FUNCTIONS = ['index-knowledge-source', 'chat'];

function loadEnv() {
  const envPath = path.join(root, '.env.local');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) process.env[match[1].trim()] = match[2].trim();
  }
}

function projectRef() {
  const fromUrl = process.env.VITE_SUPABASE_URL?.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
  if (fromUrl) return fromUrl;
  const refFile = path.join(root, 'supabase/.temp/project-ref');
  return fs.existsSync(refFile) ? fs.readFileSync(refFile, 'utf8').trim() : '';
}

async function runSql(ref, token, file) {
  const query = fs.readFileSync(path.join(root, 'supabase/migrations', file), 'utf8');
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`${file} failed (HTTP ${res.status}): ${await res.text()}`);
  console.log(`✓ Applied ${file}`);
}

async function main() {
  loadEnv();
  const token = process.env.SUPABASE_ACCESS_TOKEN;
  const ref = projectRef();
  if (!token) {
    console.error('✗ Add SUPABASE_ACCESS_TOKEN=... to .env.local (Supabase → Account → Access Tokens).');
    process.exit(1);
  }
  if (!ref) {
    console.error('✗ Could not work out the Supabase project ref from VITE_SUPABASE_URL.');
    process.exit(1);
  }

  if (!process.argv.includes('--functions-only')) {
    for (const file of MIGRATIONS) await runSql(ref, token, file);
  }

  for (const fn of FUNCTIONS) {
    const result = spawnSync('npx', ['-y', 'supabase@latest', 'functions', 'deploy', fn, '--project-ref', ref], {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, SUPABASE_ACCESS_TOKEN: token },
    });
    if (result.status !== 0) {
      console.error(`✗ Deploy failed for ${fn}`);
      process.exit(result.status ?? 1);
    }
    console.log(`✓ Deployed ${fn}`);
  }
  console.log('\nDone. Open Admin → Knowledge & Chatbot and add a "Website or blog" source.');
}

main().catch((e) => {
  console.error(`✗ ${e instanceof Error ? e.message : e}`);
  process.exit(1);
});
