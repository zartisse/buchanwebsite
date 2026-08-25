import { useCallback, useEffect, useState } from 'react';
import type { SitePage, SitePageSlug } from '../types';
import { SITE_PAGE_SLUGS } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getDemoSitePage } from '../data/sitePagesDemo';
import { getCached, setCached, invalidateCache } from '../lib/sitePageCache';
import { deepNormalizeCopy } from '../lib/normalizeCopy';

const SITE_PAGE_COLUMNS = 'id,slug,meta_title,meta_description,content,updated_at';

function normalizeSitePage<S extends SitePageSlug>(page: SitePage<S>): SitePage<S> {
  return deepNormalizeCopy(page);
}

export function useSitePages() {
  const [pages, setPages] = useState<SitePage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPages = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      setPages(Object.values(
        SITE_PAGE_SLUGS.reduce(
          (acc, slug) => ({ ...acc, [slug]: getDemoSitePage(slug) }),
          {} as Record<SitePageSlug, SitePage>,
        ),
      ));
      setLoading(false);
      return;
    }
    try {
      const { data, error: err } = await supabase
        .from('site_pages')
        .select(SITE_PAGE_COLUMNS)
        .order('slug');
      if (err) throw err;
      setPages((data as SitePage[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load pages');
      setPages(SITE_PAGE_SLUGS.map((slug) => getDemoSitePage(slug)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  const saveSitePage = async (page: Pick<SitePage, 'slug' | 'meta_title' | 'meta_description' | 'content'> & { id?: string }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const payload = {
      slug: page.slug,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      content: page.content,
    };
    if (page.id) {
      const { error: err } = await supabase.from('site_pages').update(payload).eq('id', page.id);
      if (err) throw err;
    } else {
      const { error: err } = await supabase.from('site_pages').upsert(payload, { onConflict: 'slug' });
      if (err) throw err;
    }
    invalidateCache(`site_page:${page.slug}`);
    await fetchPages();
  };

  return { pages, loading, error, refetch: fetchPages, saveSitePage };
}

export function useSitePage<S extends SitePageSlug>(slug: S) {
  const [page, setPage] = useState<SitePage<S> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const demo = getDemoSitePage(slug) as SitePage<S>;
      const cacheKey = `site_page:${slug}`;
      const cached = getCached<SitePage<S>>(cacheKey);
      if (cached) {
        setPage(normalizeSitePage(cached));
        setLoading(false);
        return;
      }
      if (!isSupabaseConfigured) {
        setPage(normalizeSitePage(demo));
        setLoading(false);
        return;
      }
      try {
        const { data, error: err } = await supabase
          .from('site_pages')
          .select(SITE_PAGE_COLUMNS)
          .eq('slug', slug)
          .single();
        if (err) throw err;
        const row = normalizeSitePage(data as SitePage<S>);
        setCached(cacheKey, row);
        setPage(row);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Page not found');
        setPage(normalizeSitePage(demo));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return { page, loading, error };
}
