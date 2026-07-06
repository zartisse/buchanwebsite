import { useCallback, useEffect, useState } from 'react';
import type { Property } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_PROPERTIES } from '../data/demo';

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
      setProperties((data as Property[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load properties');
      let data = DEMO_PROPERTIES;
      if (options?.publicOnly) data = data.filter((p) => p.status !== 'Draft');
      setProperties(data);
    } finally {
      setLoading(false);
    }
  }, [options?.publicOnly, options?.admin]);

  useEffect(() => { fetchProperties(); }, [fetchProperties]);

  const saveProperty = async (property: Partial<Property> & { name: string }) => {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');
    const payload = {
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
    if (property.id) {
      const { error: err } = await supabase.from('properties').update(payload).eq('id', property.id);
      if (err) throw err;
    } else {
      const { error: err } = await supabase.from('properties').insert(payload);
      if (err) throw err;
    }
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
