import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { chunkText, extractHtml } from '../_shared/chunk.ts';
import {
  ARTICLE_SITEMAP,
  bareHost,
  fetchWithTimeout,
  isCrawlable,
  isInPrefix,
  normalizeUrl,
  readRobots,
  readSitemaps,
  sectionPrefix,
  type CrawlRules,
  type CrawlScope,
} from '../_shared/crawl.ts';
import { embedTexts } from '../_shared/openai.ts';
import { createAdminClient } from '../_shared/supabaseAdmin.ts';

type Admin = ReturnType<typeof createAdminClient>;

type SourceRow = {
  id: string;
  type: string;
  title: string;
  source_url: string;
  storage_path: string;
  body_text: string;
  metadata: Record<string, unknown>;
  parent_id: string | null;
};

const MIN_PAGE_TEXT = 200;
const DEFAULT_MAX_PAGES = 200;
const MAX_PAGES_CAP = 500;
const STEP_BATCH = 3;
const STALE_INDEXING_MS = 3 * 60 * 1000;

async function extractPdfText(bytes: Uint8Array): Promise<string> {
  try {
    const { extractText, getDocumentProxy } = await import('npm:unpdf@0.12.1');
    const pdf = await getDocumentProxy(bytes);
    const { text } = await extractText(pdf, { mergePages: true });
    return (text ?? '').trim();
  } catch {
    return '';
  }
}

type FetchedPage = { url: string; title: string; text: string; links: string[] };

async function fetchPage(url: string): Promise<FetchedPage> {
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`Page returned HTTP ${res.status}`);
  const finalUrl = res.url || url;
  const contentType = res.headers.get('content-type') ?? '';

  if (contentType.includes('application/pdf') || /\.pdf$/i.test(new URL(finalUrl).pathname)) {
    const text = await extractPdfText(new Uint8Array(await res.arrayBuffer()));
    const name = decodeURIComponent(new URL(finalUrl).pathname.split('/').pop() ?? 'PDF');
    return { url: finalUrl, title: name, text, links: [] };
  }
  if (!contentType.includes('html') && contentType !== '') {
    throw new Error(`Not a web page (${contentType.split(';')[0]})`);
  }

  const page = extractHtml(await res.text(), finalUrl);
  const text = [page.description, page.text].filter(Boolean).join('\n\n');
  return { url: finalUrl, title: page.title || new URL(finalUrl).pathname, text, links: page.links };
}

function pageCorpus(page: FetchedPage): string {
  if (page.text.length < MIN_PAGE_TEXT) {
    throw new Error(
      'Almost no readable text on this page. It may need JavaScript to display; add its content as a Text source instead.',
    );
  }
  return page.text;
}

function flattenJson(value: unknown, lines: string[], prefix = ''): void {
  if (value === null || value === undefined) return;
  if (typeof value === 'string') {
    const t = value.trim();
    if (t && t.length < 8000) lines.push(prefix ? `${prefix}: ${t}` : t);
    return;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    lines.push(`${prefix}: ${String(value)}`);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => flattenJson(item, lines, `${prefix}[${i}]`));
    return;
  }
  if (typeof value === 'object') {
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      const next = prefix ? `${prefix}.${key}` : key;
      flattenJson(val, lines, next);
    }
  }
}

async function buildCmsCorpus(supabase: Admin): Promise<string> {
  const parts: string[] = [];

  const { data: pages } = await supabase.from('site_pages').select('slug, meta_title, meta_description, content');
  for (const page of pages ?? []) {
    const lines: string[] = [`Page: ${page.slug}`, page.meta_title, page.meta_description];
    flattenJson(page.content, lines);
    parts.push(lines.join('\n'));
  }

  const { data: properties } = await supabase
    .from('properties')
    .select('name, slug, status, city, description, beds, baths, sqft')
    .neq('status', 'Draft');
  for (const p of properties ?? []) {
    parts.push(
      [`Property: ${p.name}`, `Slug: ${p.slug}`, `City: ${p.city}`, `Status: ${p.status}`, p.description]
        .filter(Boolean)
        .join('\n'),
    );
  }

  const { data: posts } = await supabase
    .from('posts')
    .select('title, slug, excerpt, body, category')
    .eq('status', 'Published');
  for (const post of posts ?? []) {
    parts.push([`Blog: ${post.title}`, post.excerpt, post.body].filter(Boolean).join('\n'));
  }

  return parts.join('\n\n---\n\n');
}

async function resolveSourceText(supabase: Admin, source: SourceRow): Promise<{ text: string; header?: string }> {
  switch (source.type) {
    case 'text':
      return { text: source.body_text.trim() };
    case 'url': {
      if (!source.source_url.trim()) return { text: source.body_text.trim() };
      const page = await fetchPage(source.source_url.trim());
      return { text: pageCorpus(page), header: `Source: ${page.title} (${page.url})` };
    }
    case 'image': {
      const desc = source.body_text.trim() || String(source.metadata?.description ?? '');
      const alt = String(source.metadata?.alt ?? '');
      const url = source.source_url.trim() || source.storage_path;
      return {
        text: [`Image: ${source.title}`, alt, desc, url ? `Reference: ${url}` : ''].filter(Boolean).join('\n'),
      };
    }
    case 'pdf': {
      let text = source.body_text.trim();
      if (source.storage_path) {
        const { data, error } = await supabase.storage.from('media').download(source.storage_path);
        if (error) throw error;
        const extracted = await extractPdfText(new Uint8Array(await data.arrayBuffer()));
        if (extracted) text = extracted;
      }
      if (!text) throw new Error('Could not extract text from PDF. Add notes in the text field or re-upload.');
      return { text };
    }
    case 'cms_sync':
      return { text: await buildCmsCorpus(supabase) };
    case 'crawl':
      throw new Error('Website crawls are run with Crawl / Re-crawl, not Re-index.');
    default:
      throw new Error(`Unknown source type: ${source.type}`);
  }
}

/** Replaces a source's chunks with freshly embedded ones. Every chunk carries the header, if any. */
async function storeChunks(supabase: Admin, sourceId: string, openaiKey: string, text: string, header?: string) {
  const chunks = chunkText(text).map((c) => (header ? `${header}\n${c}` : c));
  if (chunks.length === 0) throw new Error('No indexable text found');

  const embeddings = await embedTexts(openaiKey, chunks);
  await supabase.from('knowledge_chunks').delete().eq('source_id', sourceId);
  const { error } = await supabase.from('knowledge_chunks').insert(
    chunks.map((content, i) => ({
      source_id: sourceId,
      content,
      embedding: embeddings[i],
      token_count: Math.ceil(content.length / 4),
    })),
  );
  if (error) throw error;
  return chunks.length;
}

async function loadSource(supabase: Admin, sourceId: string): Promise<SourceRow> {
  const { data, error } = await supabase.from('knowledge_sources').select('*').eq('id', sourceId).single();
  if (error || !data) throw new Error('Source not found');
  return data as SourceRow;
}

async function indexSource(supabase: Admin, sourceId: string, openaiKey: string) {
  const source = await loadSource(supabase, sourceId);
  await supabase.from('knowledge_sources').update({ status: 'indexing', error_message: '' }).eq('id', sourceId);

  const { text, header } = await resolveSourceText(supabase, source);
  const chunkCount = await storeChunks(supabase, sourceId, openaiKey, text, header);

  await supabase.from('knowledge_sources').update({ status: 'indexed', error_message: '' }).eq('id', sourceId);
  return { chunkCount };
}

/* ---------------- Website crawl ---------------- */

function crawlRules(root: SourceRow): CrawlRules {
  const rootUrl = new URL(root.source_url);
  const scope: CrawlScope = root.metadata?.scope === 'site' ? 'site' : 'section';
  return {
    host: bareHost(rootUrl.hostname),
    prefix: scope === 'site' ? '/' : sectionPrefix(root.source_url),
    scope,
    disallow: Array.isArray(root.metadata?.disallow) ? (root.metadata.disallow as string[]) : [],
  };
}

function maxPages(root: SourceRow): number {
  const n = Number(root.metadata?.max_pages ?? DEFAULT_MAX_PAGES);
  return Math.min(Math.max(Number.isFinite(n) ? Math.round(n) : DEFAULT_MAX_PAGES, 1), MAX_PAGES_CAP);
}

async function loadCrawlRoot(supabase: Admin, sourceId: string): Promise<SourceRow> {
  const root = await loadSource(supabase, sourceId);
  if (root.type !== 'crawl') throw new Error('Not a website crawl source');
  if (!normalizeUrl(root.source_url)) throw new Error('Crawl needs a valid starting URL (https://...)');
  return root;
}

async function enqueuePages(supabase: Admin, root: SourceRow, rules: CrawlRules, urls: string[], depth: number) {
  const { data: existing } = await supabase
    .from('knowledge_sources')
    .select('source_url')
    .eq('parent_id', root.id)
    .limit(MAX_PAGES_CAP + 50);
  const known = new Set((existing ?? []).map((r: { source_url: string }) => r.source_url));
  const room = maxPages(root) - known.size;
  if (room <= 0) return 0;

  const fresh = [...new Set(urls.map((u) => normalizeUrl(u)).filter((u): u is string => !!u))]
    .filter((u) => isCrawlable(u, rules));
  const rows = fresh
    .filter((u) => !known.has(u))
    .slice(0, room)
    .map((u) => ({
      type: 'url',
      parent_id: root.id,
      title: new URL(u).pathname,
      source_url: u,
      status: 'pending',
      metadata: { depth, follow: isInPrefix(u, rules) },
    }));
  if (rows.length === 0) return 0;

  const { error } = await supabase
    .from('knowledge_sources')
    .upsert(rows, { onConflict: 'parent_id,source_url', ignoreDuplicates: true });
  if (error) throw error;
  return rows.length;
}

async function crawlProgress(supabase: Admin, rootId: string) {
  const { data } = await supabase.from('knowledge_sources').select('status').eq('parent_id', rootId);
  const counts = { total: 0, pending: 0, indexing: 0, indexed: 0, error: 0 };
  for (const row of data ?? []) {
    counts.total++;
    const s = row.status as keyof typeof counts;
    if (s in counts) counts[s]++;
  }
  return counts;
}

async function finishCrawl(supabase: Admin, root: SourceRow, stopped: boolean) {
  const progress = await crawlProgress(supabase, root.id);
  const failed = progress.indexed === 0;
  await supabase
    .from('knowledge_sources')
    .update({
      status: failed ? 'error' : 'indexed',
      error_message: failed
        ? 'No pages could be read. Check the URL, or the site may need JavaScript to display content.'
        : progress.error > 0
          ? `${progress.error} page(s) could not be read`
          : '',
      metadata: { ...root.metadata, finished_at: new Date().toISOString(), stopped },
    })
    .eq('id', root.id);
  return progress;
}

async function crawlStart(supabase: Admin, sourceId: string) {
  const root = await loadCrawlRoot(supabase, sourceId);
  const startUrl = normalizeUrl(root.source_url)!;
  const origin = new URL(startUrl).origin;

  const robots = await readRobots(origin);
  const metadata = {
    ...root.metadata,
    disallow: robots.disallow,
    started_at: new Date().toISOString(),
    finished_at: null,
    stopped: false,
  };
  await supabase.from('knowledge_sources').delete().eq('parent_id', root.id);
  await supabase
    .from('knowledge_sources')
    .update({ status: 'indexing', error_message: '', metadata })
    .eq('id', root.id);

  const seeded = { ...root, metadata };
  const rules = crawlRules(seeded);
  await enqueuePages(supabase, seeded, rules, [startUrl], 0);

  const sitemapCandidates = robots.sitemaps.length
    ? robots.sitemaps
    : [`${origin}/sitemap.xml`, `${origin}/sitemap_index.xml`];
  const fromSitemap = (await readSitemaps(sitemapCandidates, maxPages(seeded) * 4))
    .filter(({ url, sitemap }) => {
      const n = normalizeUrl(url);
      return !!n && (isInPrefix(n, rules) || ARTICLE_SITEMAP.test(sitemap));
    })
    .map(({ url }) => url);
  await enqueuePages(supabase, seeded, rules, fromSitemap, 1);

  return await crawlProgress(supabase, root.id);
}

async function crawlStep(supabase: Admin, sourceId: string, openaiKey: string) {
  const root = await loadCrawlRoot(supabase, sourceId);
  const rules = crawlRules(root);

  await supabase
    .from('knowledge_sources')
    .update({ status: 'pending' })
    .eq('parent_id', root.id)
    .eq('status', 'indexing')
    .lt('updated_at', new Date(Date.now() - STALE_INDEXING_MS).toISOString());

  const { data: batch } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('parent_id', root.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
    .limit(STEP_BATCH);
  const pages = (batch ?? []) as SourceRow[];
  if (pages.length) {
    await supabase
      .from('knowledge_sources')
      .update({ status: 'indexing' })
      .in('id', pages.map((p) => p.id));
  }

  const results = await Promise.allSettled(
    pages.map(async (child) => {
      const page = await fetchPage(child.source_url);
      if (bareHost(new URL(page.url).hostname) !== rules.host) throw new Error('Redirected to another website');
      await storeChunks(supabase, child.id, openaiKey, pageCorpus(page), `Source: ${page.title} (${page.url})`);
      await supabase
        .from('knowledge_sources')
        .update({ status: 'indexed', error_message: '', title: page.title.slice(0, 300) })
        .eq('id', child.id);
      return { child, page };
    }),
  );

  for (const [i, result] of results.entries()) {
    const child = pages[i];
    if (result.status === 'rejected') {
      const message = result.reason instanceof Error ? result.reason.message : 'Could not read page';
      await supabase.from('knowledge_sources').update({ status: 'error', error_message: message }).eq('id', child.id);
      continue;
    }
    if (child.metadata?.follow !== false) {
      const depth = Number(child.metadata?.depth ?? 0) + 1;
      await enqueuePages(supabase, root, rules, result.value.page.links, depth);
    }
  }

  const progress = await crawlProgress(supabase, root.id);
  if (progress.pending === 0 && progress.indexing === 0) {
    return { ...(await finishCrawl(supabase, root, false)), done: true };
  }
  return { ...progress, done: false };
}

async function crawlStop(supabase: Admin, sourceId: string) {
  const root = await loadCrawlRoot(supabase, sourceId);
  await supabase.from('knowledge_sources').delete().eq('parent_id', root.id).eq('status', 'pending');
  return { ...(await finishCrawl(supabase, root, true)), done: true };
}

/* ---------------- Handler ---------------- */

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let failSourceId: string | undefined;
  try {
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiKey) return jsonResponse({ error: 'OPENAI_API_KEY not configured' }, 500);

    const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) return jsonResponse({ error: 'Unauthorized' }, 401);

    const supabase = createAdminClient();
    const { data: userData, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !userData?.user) return jsonResponse({ error: 'Sign in to the admin to manage knowledge' }, 401);

    const body = await req.json();
    const { sourceId, syncCms, crawlStart: startId, crawlStep: stepId, crawlStop: stopId } = body as {
      sourceId?: string;
      syncCms?: boolean;
      crawlStart?: string;
      crawlStep?: string;
      crawlStop?: string;
    };

    if (startId) {
      failSourceId = startId;
      return jsonResponse({ ok: true, ...(await crawlStart(supabase, startId)) });
    }
    if (stepId) {
      return jsonResponse({ ok: true, ...(await crawlStep(supabase, stepId, openaiKey)) });
    }
    if (stopId) {
      failSourceId = stopId;
      return jsonResponse({ ok: true, ...(await crawlStop(supabase, stopId)) });
    }

    failSourceId = sourceId;

    if (syncCms) {
      const { data: existing } = await supabase
        .from('knowledge_sources')
        .select('id')
        .eq('type', 'cms_sync')
        .limit(1)
        .maybeSingle();

      let cmsId = existing?.id;
      if (!cmsId) {
        const { data: created, error } = await supabase
          .from('knowledge_sources')
          .insert({
            type: 'cms_sync',
            title: 'Website content (auto-sync)',
            status: 'pending',
          })
          .select('id')
          .single();
        if (error) throw error;
        cmsId = created.id;
      } else {
        await supabase
          .from('knowledge_sources')
          .update({ title: 'Website content (auto-sync)', status: 'pending', error_message: '' })
          .eq('id', cmsId);
      }

      failSourceId = cmsId;
      const result = await indexSource(supabase, cmsId!, openaiKey);
      return jsonResponse({ ok: true, sourceId: cmsId, ...result });
    }

    if (!sourceId) return jsonResponse({ error: 'sourceId or syncCms required' }, 400);

    const result = await indexSource(supabase, sourceId, openaiKey);
    return jsonResponse({ ok: true, sourceId, ...result });
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Indexing failed';
    if (failSourceId) {
      try {
        const supabase = createAdminClient();
        await supabase
          .from('knowledge_sources')
          .update({ status: 'error', error_message: message })
          .eq('id', failSourceId);
      } catch {
        /* ignore secondary errors */
      }
    }
    return jsonResponse({ error: message }, 500);
  }
});
