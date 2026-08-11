/**
 * Check local dev and GitHub Pages availability.
 * Run: npm run cms:check-live
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const logEndpoint = 'http://127.0.0.1:7673/ingest/96b34018-b8d2-464d-a26d-868e5a862d9d';
const sessionId = '787a69';

function log(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  // #region agent log
  fetch(logEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': sessionId },
    body: JSON.stringify({ sessionId, location, message, data, hypothesisId, timestamp: Date.now(), runId: 'check-live' }),
  }).catch(() => {});
  // #endregion
}

async function check(url: string) {
  try {
    const res = await fetch(url, { redirect: 'follow' });
    return { url, status: res.status, ok: res.ok };
  } catch (e) {
    return { url, status: 0, ok: false, error: String(e) };
  }
}

async function main() {
  const checks = await Promise.all([
    check('http://localhost:5173/admin/login'),
    check('http://localhost:5173/'),
    check('https://zartisse.github.io/buchanwebsite/admin/login'),
    check('https://zartisse.github.io/buchanwebsite/'),
  ]);

  console.log('\nLive site check\n');
  for (const c of checks) {
    console.log(`${c.ok ? '✓' : '✗'} ${c.status} ${c.url}`);
    log('check-live.ts', 'url check', c, 'H14');
  }

  const localOk = checks[0].ok && checks[1].ok;
  const ghOk = checks[2].ok || checks[3].ok;

  console.log('');
  if (localOk) console.log('Local CMS: ready at http://localhost:5173/admin/login');
  else console.log('Local CMS: start dev server with npm run dev');

  if (ghOk) console.log('GitHub Pages: deployed');
  else console.log('GitHub Pages: NOT deployed — follow DEPLOY.md (Settings → Pages → GitHub Actions + secrets)');

  process.exit(localOk ? 0 : 1);
}

main();
