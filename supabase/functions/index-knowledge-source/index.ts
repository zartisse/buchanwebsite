import { corsHeaders, jsonResponse } from '../_shared/cors.ts';
import { chunkText, stripHtml } from '../_shared/chunk.ts';
import { embedTexts } from '../_shared/openai.ts';
import { createAdminClient } from '../_shared/supabaseAdmin.ts';

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

async function fetchUrlText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'BuchanHomesKnowledgeBot/1.0' },
  });
  if (!res.ok) throw new Error(`URL fetch failed (${res.status})`);
  const html = await res.text();
  return stripHtml(html);
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

async function buildCmsCorpus(supabase: ReturnType<typeof createAdminClient>): Promise<string> {
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

async function resolveSourceText(
  supabase: ReturnType<typeof createAdminClient>,
  source: {
    type: string;
    title: string;
    source_url: string;
    storage_path: string;
    body_text: string;
    metadata: Record<string, unknown>;
  },
): Promise<string> {
  switch (source.type) {
    case 'text':
      return source.body_text.trim();
    case 'url':
      if (source.source_url.trim()) return await fetchUrlText(source.source_url.trim());
      return source.body_text.trim();
    case 'image': {
      const desc = source.body_text.trim() || String(source.metadata?.description ?? '');
      const alt = String(source.metadata?.alt ?? '');
      const url = source.source_url.trim() || source.storage_path;
      return [`Image: ${source.title}`, alt, desc, url ? `Reference: ${url}` : ''].filter(Boolean).join('\n');
    }
    case 'pdf': {
      let text = source.body_text.trim();
      if (source.storage_path) {
        const { data, error } = await supabase.storage.from('media').download(source.storage_path);
        if (error) throw error;
        const bytes = new Uint8Array(await data.arrayBuffer());
        const extracted = await extractPdfText(bytes);
        if (extracted) text = extracted;
      }
      if (!text) throw new Error('Could not extract text from PDF. Add notes in the text field or re-upload.');
      return text;
    }
    case 'cms_sync':
      return await buildCmsCorpus(supabase);
    default:
      throw new Error(`Unknown source type: ${source.type}`);
  }
}

async function indexSource(supabase: ReturnType<typeof createAdminClient>, sourceId: string, openaiKey: string) {
  const { data: source, error: fetchErr } = await supabase
    .from('knowledge_sources')
    .select('*')
    .eq('id', sourceId)
    .single();
  if (fetchErr || !source) throw new Error('Source not found');

  await supabase
    .from('knowledge_sources')
    .update({ status: 'indexing', error_message: '' })
    .eq('id', sourceId);

  await supabase.from('knowledge_chunks').delete().eq('source_id', sourceId);

  const text = await resolveSourceText(supabase, source as never);
  const chunks = chunkText(text);
  if (chunks.length === 0) throw new Error('No indexable text found');

  const embeddings = await embedTexts(openaiKey, chunks);
  const rows = chunks.map((content, i) => ({
    source_id: sourceId,
    content,
    embedding: embeddings[i],
    token_count: Math.ceil(content.length / 4),
  }));

  const { error: insertErr } = await supabase.from('knowledge_chunks').insert(rows);
  if (insertErr) throw insertErr;

  await supabase
    .from('knowledge_sources')
    .update({ status: 'indexed', error_message: '' })
    .eq('id', sourceId);

  return { chunkCount: chunks.length };
}

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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return jsonResponse({ error: 'Unauthorized' }, 401);

    const supabase = createAdminClient();
    const body = await req.json();
    const { sourceId, syncCms } = body as { sourceId?: string; syncCms?: boolean };
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
