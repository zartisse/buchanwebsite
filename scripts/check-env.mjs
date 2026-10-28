import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(scriptDir, '..');
const envPath = path.join(root, '.env.local');

function loadEnvFile() {
  const out = {};
  if (!fs.existsSync(envPath)) return out;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) out[match[1].trim()] = match[2].trim();
  }
  return out;
}

const pkgPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(pkgPath)) {
  console.error(`
npm must run from the project folder (where package.json lives).

  cd "/Users/Apple/Downloads/Buchan Homes Website/dynamic website"
  npm run dev

In Cursor: File → Open Folder → select "dynamic website".
`);
  process.exit(1);
}

const env = loadEnvFile();
const url = env.VITE_SUPABASE_URL ?? '';
const key = env.VITE_SUPABASE_ANON_KEY ?? '';
const placeholderKey =
  !key || key === 'your-anon-key' || key.startsWith('your-') || key.length < 20;

if (!url || url.includes('your-project')) {
  console.warn('\n⚠ VITE_SUPABASE_URL is missing or still a placeholder in .env.local');
  console.warn('  Site will use demo content only until Supabase is configured.\n');
} else if (placeholderKey) {
  console.warn('\n⚠ Supabase URL is set but VITE_SUPABASE_ANON_KEY is still a placeholder.');
  console.warn('  Supabase Dashboard → Project Settings → API Keys → anon public');
  console.warn('  Paste into .env.local as VITE_SUPABASE_ANON_KEY, then restart npm run dev.\n');
} else {
  console.log('✓ .env.local looks configured for Supabase.\n');
}
