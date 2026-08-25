import { useCallback, useEffect, useState } from 'react';
import type { HubPage, HubPageSlug } from '../types';
import { HUB_PAGE_SLUGS } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getDemoHubPage } from '../data/hubContentDefaults';
import { deepNormalizeCopy } from '../lib/normalizeCopy';

/** Hub pages share the site_pages table (same schema; slugs do not overlap). */
const HUB_TABLE = 'site_pages';

function normalizeHubPage(page: HubPage): HubPage {
  return deepNormalizeCopy(page);
}

export function useHubPages() {
  const [pages, setPages] = useState<HubPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      setPages(HUB_PAGE_SLUGS.map((slug) => getDemoHubPage(slug)));
      setLoading(false);
      return;
    }
    try {
      const { data, error: err } = await supabase
        .from(HUB_TABLE)
        .select('*')
        .in('slug', [...HUB_PAGE_SLUGS])
        .order('slug');
      if (err) throw err;
      setPages((data as HubPage[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load hub pages');
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const saveHubPage = async (page: Pick<HubPage, 'slug' | 'meta_title' | 'meta_description' | 'content'> & { id?: string }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const payload = {
      slug: page.slug,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      content: page.content,
    };
    if (page.id) {
      const { error: err } = await supabase.from(HUB_TABLE).update(payload).eq('id', page.id);
      if (err) throw err;
    } else {
      const { error: err } = await supabase.from(HUB_TABLE).upsert(payload, { onConflict: 'slug' });
      if (err) throw err;
    }
    await fetchPages();
  };

  return { pages, loading, error, refetch: fetchPages, saveHubPage };
}

export function useHubPage(slug: HubPageSlug) {
  const [page, setPage] = useState<HubPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const demo = getDemoHubPage(slug);
      if (!isSupabaseConfigured) {
        setPage(normalizeHubPage(demo));
        setLoading(false);
        return;
      }
      try {
        const { data, error: err } = await supabase.from(HUB_TABLE).select('*').eq('slug', slug).single();
        if (err) throw err;
        setPage(normalizeHubPage(data as HubPage));
      } catch {
        setError('Page not found in CMS, showing default content');
        setPage(normalizeHubPage(demo));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return { page, loading, error };
}
