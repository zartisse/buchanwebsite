import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

const PLACEHOLDER_KEY =
  !supabaseAnonKey ||
  supabaseAnonKey === 'your-anon-key' ||
  supabaseAnonKey.startsWith('your-') ||
  supabaseAnonKey.length < 20;

export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project') && !PLACEHOLDER_KEY);

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
