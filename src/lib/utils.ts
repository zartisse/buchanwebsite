export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function fmtDate(iso: string): string {
  try {
    return new Date(iso.includes('T') ? iso : `${iso}T00:00:00`).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function fmtDateTime(iso: string): string {
  try {
    const dt = new Date(iso);
    return `${dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } catch {
    return iso;
  }
}

export function initials(name: string): string {
  return (name || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

import { isSupabaseConfigured, supabase } from './supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export async function uploadMedia(
  file: File,
  folder: string,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const ext = file.name.split('.').pop() || 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  if (!isSupabaseConfigured) {
    throw new Error('Supabase not configured');
  }

  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? supabaseAnonKey;

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const uploadUrl = `${supabaseUrl}/storage/v1/object/media/${path}`;

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const { data } = supabase.storage.from('media').getPublicUrl(path);
        resolve(data.publicUrl);
        return;
      }
      reject(new Error(`Upload failed (${xhr.status})`));
    });

    xhr.addEventListener('error', () => reject(new Error('Upload failed')));
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')));

    xhr.open('POST', uploadUrl);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', supabaseAnonKey);
    xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
    xhr.setRequestHeader('x-upsert', 'false');
    xhr.send(file);
  });
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
