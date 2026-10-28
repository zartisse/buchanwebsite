/**
 * Check Supabase project wake status and GitHub Pages static assets (no secrets required).
 * Run: npx tsx scripts/verify-remote-health.ts
 */
const SUPABASE_PROJECT = process.env.SUPABASE_PROJECT_URL ?? 'https://itrdpbtbndabtrfyoidu.supabase.co';
const GH_BASE = process.env.GH_PAGES_BASE ?? 'https://zartisse.github.io/buchanwebsite';

async function status(url: string, init?: RequestInit): Promise<{ ok: boolean; code: number; snippet: string }> {
  try {
    const res = await fetch(url, { ...init, redirect: 'follow' });
    const text = await res.text();
    return { ok: res.ok, code: res.status, snippet: text.slice(0, 80).replace(/\s+/g, ' ') };
  } catch (e) {
    return { ok: false, code: 0, snippet: e instanceof Error ? e.message : String(e) };
  }
}

async function main() {
  console.log('\nRemote health check\n');

  const auth = await status(`${SUPABASE_PROJECT}/auth/v1/health`);
  console.log(
    `${auth.code === 401 || auth.code === 200 ? '✓' : '✗'} Supabase auth (${auth.code}) — project is reachable (401/200 expected when awake)`,
  );
  if (auth.code === 502 || auth.code === 503 || auth.code === 540) {
    console.log('  → Project may still be paused or waking up.');
  }

  const assets = ['assets/ph-arch-1.png', 'assets/ph-arch-1.webp', 'assets/logo.png'];
  for (const path of assets) {
    const r = await status(`${GH_BASE}/${path}`);
    console.log(`${r.ok ? '✓' : '✗'} ${path} (${r.code})`);
  }

  console.log('\nIf .webp is 404 but .png is 200, the site must not rewrite PNG paths to WebP on that host (or redeploy with webp in public/).');
  console.log(`Add VITE_SUPABASE_URL=${SUPABASE_PROJECT} and your anon key to .env.local, then run: npm run cms:verify\n`);
}

main();
