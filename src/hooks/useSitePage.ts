import { useCallback, useEffect, useState } from 'react';
import type { SitePage, SitePageSlug } from '../types';
import { SITE_PAGE_SLUGS } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getDemoSitePage } from '../data/sitePagesDemo';

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
        .select('*')
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
      if (!isSupabaseConfigured) {
        setPage(demo);
        setLoading(false);
        return;
      }
      try {
        const { data, error: err } = await supabase
          .from('site_pages')
          .select('*')
          .eq('slug', slug)
          .single();
        if (err) throw err;
        setPage(data as SitePage<S>);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Page not found');
        setPage(demo);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return { page, loading, error };
}
