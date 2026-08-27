import { readFileSync, appendFileSync, mkdirSync } from 'fs';
import { mergeHomeContent, getDefaultHomeContent } from '../src/data/homeContentDefaults.ts';
import { DEMO_PROPERTIES } from '../src/data/demo.ts';

try {
  mkdirSync('.cursor', { recursive: true });
} catch {
  /* exists */
}

const log = (msg: string, data: object, hypothesisId: string) => {
  appendFileSync(
    '.cursor/debug-787a69.log',
    `${JSON.stringify({ sessionId: '787a69', location: 'verify-runtime-cms.mts', message: msg, data, timestamp: Date.now(), hypothesisId, runId: 'post-fix-verify' })}\n`,
  );
};

async function sbFetch(url: string, key: string, path: string) {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const env = readFileSync('.env.local', 'utf8');
  const url = env.match(/^VITE_SUPABASE_URL=(.+)$/m)?.[1]?.trim();
  const key = env.match(/^VITE_SUPABASE_ANON_KEY=(.+)$/m)?.[1]?.trim();
  if (!url || !key) {
    log('missing env', {}, 'E');
    return;
  }

  const pages = await sbFetch(url, key, 'site_pages?slug=eq.home&select=id,content');
  const row = pages[0];
  if (!row) {
    log('no home row', {}, 'E');
    process.exit(1);
  }

  const raw = row.content as Record<string, unknown>;
  const merged = mergeHomeContent(raw as Parameters<typeof mergeHomeContent>[0]);
  const defaults = getDefaultHomeContent();
  log('supabase home merge result', {
    pageId: row.id,
    legacyKeys: ['legacy', 'recent_work', 'services'].filter((k) => k in raw),
    cmsVersion: raw.content_version ?? null,
    mergedHero: merged.hero.title,
    mergedFeaturedStart: merged.featured_work.body?.slice(0, 35),
    matchesDefaultFeatured: merged.featured_work.body === defaults.featured_work.body,
    googleReviewsTitle: merged.google_reviews_section.title,
    processCta: merged.better_planned_path.cta_label,
    mergedVersion: merged.content_version,
  }, 'A');

  const props = await sbFetch(
    url,
    key,
    'properties?featured=eq.true&select=name,city,slug,featured,featured_order,status&order=featured_order.asc',
  );
  log('supabase featured raw', {
    featured: (props ?? []).map((p: { name: string; city: string; slug: string; featured_order?: number; status?: string }) => ({
      name: p.name,
      city: p.city,
      slug: p.slug,
      featured_order: p.featured_order ?? null,
      status: p.status ?? null,
    })),
  }, 'C');

  const docFeatured = DEMO_PROPERTIES.filter((p) => p.featured).sort(
    (a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0),
  );
  const docSlugs = new Set(docFeatured.map((p) => p.slug));
  const featuredSorted = (props ?? []).filter((p: { featured: boolean }) => p.featured)
    .sort((a: { featured_order?: number }, b: { featured_order?: number }) => (a.featured_order ?? 0) - (b.featured_order ?? 0));
  const needsPatch = featuredSorted.some((p: { slug: string }) => !docSlugs.has(p.slug));
  const docBySlug = new Map(
    featuredSorted.map((p: { slug: string }, index: number) => [p.slug, docFeatured[index]] as const),
  );
  const patched = (props ?? []).map(
    (p: { name: string; city: string; slug: string; featured: boolean; featured_order?: number }) => {
      if (!p.featured || !needsPatch) return p;
      const demo = docBySlug.get(p.slug);
      return demo ? { ...p, name: demo.name, city: demo.city } : p;
    },
  );
  log('featured patch gate', { needsPatch, docSlugs: [...docSlugs], featuredOrders: featuredSorted.map((p: { slug: string; featured_order?: number }) => ({ slug: p.slug, featured_order: p.featured_order ?? null })) }, 'F');
  log('featured after patch simulation', {
    featured: patched
      .filter((p: { featured: boolean }) => p.featured)
      .map((p: { name: string; city: string }) => ({ name: p.name, city: p.city })),
  }, 'C');
}

main();
