/**
 * End-to-end CMS smoke test with debug logging.
 * Run: npx tsx scripts/smoke-test-cms.ts
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env.local');
const logEndpoint = 'http://127.0.0.1:7673/ingest/96b34018-b8d2-464d-a26d-868e5a862d9d';
const sessionId = '787a69';

function loadEnv() {
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/);
    if (m) process.env[m[1].trim()] = m[2].trim();
  }
}

function log(location: string, message: string, data: Record<string, unknown>, hypothesisId: string) {
  // #region agent log
  fetch(logEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': sessionId },
    body: JSON.stringify({ sessionId, location, message, data, hypothesisId, timestamp: Date.now(), runId: 'smoke' }),
  }).catch(() => {});
  // #endregion
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL!;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY!;
const email = process.env.SUPABASE_ADMIN_EMAIL ?? 'admin@buchan.com';
const password = process.env.SUPABASE_ADMIN_PASSWORD ?? 'BuchanAdmin2026!';

async function api(path: string, opts: RequestInit = {}, token?: string) {
  const res = await fetch(`${url}${path}`, {
    ...opts,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token ?? anonKey}`,
      ...(opts.headers ?? {}),
    },
  });
  const text = await res.text();
  let json: unknown = null;
  try { json = JSON.parse(text); } catch { /* */ }
  return { ok: res.ok, status: res.status, json, text: text.slice(0, 300) };
}

async function main() {
  console.log('CMS smoke test\n');

  // H5: Admin login
  const auth = await api('/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  log('smoke:auth', 'login', { ok: auth.ok, status: auth.status }, 'H5');
  console.log(`${auth.ok ? '✓' : '✗'} Admin login (${auth.status})`);
  if (!auth.ok) {
    console.log('  ', auth.text);
    process.exit(1);
  }
  const token = (auth.json as { access_token: string }).access_token;

  // H6: Hub pages list from site_pages
  const hubs = await api('/rest/v1/site_pages?select=slug&slug=in.(custom-homes,renovations,preconstruction)&order=slug', {}, token);
  const hubSlugs = Array.isArray(hubs.json) ? (hubs.json as { slug: string }[]).map((r) => r.slug) : [];
  log('smoke:hubs', 'list', { ok: hubs.ok, count: hubSlugs.length, slugs: hubSlugs }, 'H6');
  console.log(`${hubs.ok ? '✓' : '✗'} Hub pages in site_pages (${hubSlugs.length} sampled)`);

  // H7: Hub page save
  const getOne = await api('/rest/v1/site_pages?select=*&slug=eq.custom-homes', {}, token);
  const existing = Array.isArray(getOne.json) ? (getOne.json as Record<string, unknown>[])[0] : null;
  const marker = `smoke-${Date.now()}`;
  const savePayload = {
    slug: 'custom-homes',
    meta_title: existing?.meta_title ?? 'Custom Homes',
    meta_description: existing?.meta_description ?? '',
    content: { ...(existing?.content as object ?? {}), _smoke: marker },
  };
  const save = await api('/rest/v1/site_pages?on_conflict=slug', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(savePayload),
  }, token);
  log('smoke:hubSave', 'save', { ok: save.ok, status: save.status, err: save.text }, 'H7');
  console.log(`${save.ok ? '✓' : '✗'} Hub page save (${save.status})`);

  // H8: Property save with featured (no portfolio_type)
  const propSlug = `smoke-test-${Date.now()}`;
  const propSave = await api('/rest/v1/properties', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({
      name: 'Smoke Test Property',
      slug: propSlug,
      status: 'Draft',
      featured: false,
      featured_order: 0,
      image_url: '/assets/ph-arch-1.png',
    }),
  }, token);
  log('smoke:propSave', 'save', { ok: propSave.ok, status: propSave.status, err: propSave.text }, 'H8');
  console.log(`${propSave.ok ? '✓' : '✗'} Property create (${propSave.status})`);
  if (propSave.ok && Array.isArray(propSave.json)) {
    const id = (propSave.json as { id: string }[])[0]?.id;
    if (id) await api(`/rest/v1/properties?id=eq.${id}`, { method: 'DELETE' }, token);
  }

  // H9: Post save without featured column
  const postSlug = `smoke-post-${Date.now()}`;
  const postPayload = {
    title: 'Smoke Test Post',
    slug: postSlug,
    category: 'Company Updates',
    status: 'Draft',
    date: new Date().toISOString().slice(0, 10),
    excerpt: 'test',
    body: 'test',
    image_url: '/assets/ph-arch-1.png',
  };
  let postSave = await api('/rest/v1/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ ...postPayload, featured: false }),
  }, token);
  if (!postSave.ok && postSave.text.includes('featured')) {
    postSave = await api('/rest/v1/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(postPayload),
    }, token);
  }
  log('smoke:postSave', 'save', { ok: postSave.ok, status: postSave.status, err: postSave.text }, 'H9');
  console.log(`${postSave.ok ? '✓' : '✗'} Post create (${postSave.status})`);
  if (postSave.ok && Array.isArray(postSave.json)) {
    const id = (postSave.json as { id: string }[])[0]?.id;
    if (id) await api(`/rest/v1/posts?id=eq.${id}`, { method: 'DELETE' }, token);
  }

  // H10: Home page save
  const homeGet = await api('/rest/v1/site_pages?select=*&slug=eq.home', {}, token);
  const home = Array.isArray(homeGet.json) ? (homeGet.json as Record<string, unknown>[])[0] : null;
  const homeSave = await api('/rest/v1/site_pages?slug=eq.home', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Prefer: 'return=representation' },
    body: JSON.stringify({ content: { ...(home?.content as object ?? {}), _smoke: marker } }),
  }, token);
  log('smoke:homeSave', 'save', { ok: homeSave.ok, status: homeSave.status, err: homeSave.text }, 'H10');
  console.log(`${homeSave.ok ? '✓' : '✗'} Home page save (${homeSave.status})`);

  // H11: Storage upload (media bucket)
  const fakePng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');
  const uploadPath = `smoke/test-${Date.now()}.png`;
  const upload = await fetch(`${url}/storage/v1/object/media/${uploadPath}`, {
    method: 'POST',
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'image/png',
    },
    body: fakePng,
  });
  log('smoke:upload', 'storage', { ok: upload.ok, status: upload.status }, 'H11');
  console.log(`${upload.ok ? '✓' : '✗'} Media upload (${upload.status})`);

  const failed = [auth, hubs, save, propSave, postSave, homeSave].filter((r) => !r.ok);
  console.log(failed.length ? `\n${failed.length} critical test(s) failed` : '\nAll critical CMS operations passed');
  process.exit(failed.length ? 1 : 0);
}

main().catch((e) => {
  log('smoke:main', 'fatal', { error: String(e) }, 'H5');
  console.error(e);
  process.exit(1);
});
