import { useCallback, useEffect, useState } from 'react';
import type { Property } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getSchemaCapabilities } from '../lib/schemaCapabilities';
import { DEMO_PROPERTIES } from '../data/demo';

const DOC_FEATURED = DEMO_PROPERTIES.filter((p) => p.featured).sort(
  (a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0),
);
const DOC_FEATURED_SLUGS = new Set(DOC_FEATURED.map((p) => p.slug));

function patchFeaturedDisplayLabels(properties: Property[]): Property[] {
  const featuredSorted = properties
    .filter((p) => p.featured)
    .sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0));
  const needsPatch = featuredSorted.some((p) => !DOC_FEATURED_SLUGS.has(p.slug));
  if (!needsPatch) return properties;

  const docBySlug = new Map(
    featuredSorted.map((p, index) => [p.slug, DOC_FEATURED[index]] as const),
  );

  const patched = properties.map((p) => {
    if (!p.featured) return p;
    const doc = docBySlug.get(p.slug);
    if (!doc) return p;
    return { ...p, name: doc.name, city: doc.city };
  });

  return patched;
}

export function useProperties(options?: { publicOnly?: boolean; admin?: boolean }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!isSupabaseConfigured) {
      let data = DEMO_PROPERTIES;
      if (options?.publicOnly) data = data.filter((p) => p.status !== 'Draft');
      setProperties(data);
      setLoading(false);
      return;
    }
    try {
      let query = supabase.from('properties').select('*').order('created_at', { ascending: false });
      if (options?.publicOnly && !options?.admin) {
        query = query.neq('status', 'Draft');
      }
      const { data, error: err } = await query;
      if (err) throw err;
      let list = (data as Property[]) ?? [];
      if (options?.publicOnly && !options?.admin) {
        list = patchFeaturedDisplayLabels(list);
      }
      setProperties(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load properties');
      if (options?.admin) {
        setProperties([]);
      } else {
        let data = DEMO_PROPERTIES;
        if (options?.publicOnly) data = data.filter((p) => p.status !== 'Draft');
        setProperties(data);
      }
    } finally {
      setLoading(false);
    }
  }, [options?.publicOnly, options?.admin]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const saveProperty = async (property: Partial<Property> & { name: string }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const caps = await getSchemaCapabilities();
    const payload: Record<string, unknown> = {
      name: property.name,
      slug: property.slug,
      status: property.status,
      address: property.address ?? '',
      city: property.city ?? '',
      beds: property.beds ?? '',
      baths: property.baths ?? '',
      sqft: property.sqft ?? '',
      lot: property.lot ?? '',
      year: property.year ?? '',
      description: property.description ?? '',
      image_url: property.image_url ?? '',
      gallery_urls: property.gallery_urls ?? [],
      meta_title: property.meta_title ?? '',
      meta_description: property.meta_description ?? '',
      featured: property.featured ?? false,
      featured_order: property.featured_order ?? 0,
    };
    if (caps.portfolioType) payload.portfolio_type = property.portfolio_type ?? 'custom-homes';

    const run = (data: Record<string, unknown>) =>
      property.id
        ? supabase.from('properties').update(data).eq('id', property.id)
        : supabase.from('properties').insert(data);

    let { error: err } = await run(payload);
    if (err?.message.includes('portfolio_type') && 'portfolio_type' in payload) {
      const { portfolio_type: _, ...rest } = payload;
      ({ error: err } = await run(rest));
    }
    if (err) throw err;
    await fetchProperties();
  };

  const deleteProperty = async (id: string) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const { error: err } = await supabase.from('properties').delete().eq('id', id);
    if (err) throw err;
    await fetchProperties();
  };

  return { properties, loading, error, refetch: fetchProperties, saveProperty, deleteProperty };
}

export function useProperty(slug: string) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      if (!isSupabaseConfigured) {
        setProperty(DEMO_PROPERTIES.find((p) => p.slug === slug && p.status !== 'Draft') ?? null);
        setLoading(false);
        return;
      }
      try {
        const { data, error: err } = await supabase
          .from('properties')
          .select('*')
          .eq('slug', slug)
          .neq('status', 'Draft')
          .single();
        if (err) throw err;
        setProperty(data as Property);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Property not found');
        setProperty(DEMO_PROPERTIES.find((p) => p.slug === slug && p.status !== 'Draft') ?? null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  return { property, loading, error };
}
