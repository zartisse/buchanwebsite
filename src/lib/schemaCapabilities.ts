/**
 * Probes Supabase schema once and caches optional column support.
 */
import { isSupabaseConfigured } from './supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export type SchemaCapabilities = {
  postsFeatured: boolean;
  portfolioType: boolean;
  mediaBucket: boolean;
};

let cached: SchemaCapabilities | null = null;
let pending: Promise<SchemaCapabilities> | null = null;

async function restSelect(table: string, select: string): Promise<boolean> {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/${table}?select=${encodeURIComponent(select)}&limit=1`,
    { headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` } },
  );
  return res.ok;
}

async function mediaBucketExists(): Promise<boolean> {
  const res = await fetch(`${supabaseUrl}/storage/v1/bucket/media`, {
    headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}` },
  });
  return res.ok;
}

export async function getSchemaCapabilities(): Promise<SchemaCapabilities> {
  if (!isSupabaseConfigured) {
    return { postsFeatured: false, portfolioType: false, mediaBucket: false };
  }
  if (cached) return cached;
  if (pending) return pending;

  pending = (async () => {
    const [postsFeatured, portfolioType, mediaBucket] = await Promise.all([
      restSelect('posts', 'featured'),
      restSelect('properties', 'portfolio_type'),
      mediaBucketExists(),
    ]);
    cached = { postsFeatured, portfolioType, mediaBucket };
    pending = null;
    return cached;
  })();

  return pending;
}

export function resetSchemaCapabilitiesCache() {
  cached = null;
  pending = null;
}
