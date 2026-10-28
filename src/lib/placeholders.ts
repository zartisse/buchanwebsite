import { assetUrl } from './assets';

const ARCH_PLACEHOLDERS = [
  '/assets/ph-arch-1.webp',
  '/assets/ph-arch-2.webp',
  '/assets/ph-arch-3.webp',
  '/assets/ph-arch-4.webp',
] as const;

const LEGACY_PORTRAIT = '/assets/ph-portrait.svg';

const SRCSET_WIDTHS = [640, 1280, 1920] as const;

/** Map legacy large PNG/JPG defaults to compressed WebP variants. */
export function optimizeAssetPath(path: string): string {
  if (/^\/assets\/ph-arch-\d+\.png$/i.test(path)) {
    return path.replace(/\.png$/i, '.webp');
  }
  if (path === '/assets/quality-layers-house.jpg') {
    return '/assets/quality-layers-house.webp';
  }
  return path;
}

function hashSeed(seed: string | number): number {
  if (typeof seed === 'number') return Math.abs(seed);
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function placeholderImage(seed?: string | number): string {
  const index = hashSeed(seed ?? 0) % ARCH_PLACEHOLDERS.length;
  return ARCH_PLACEHOLDERS[index];
}

/** Prefer CMS value when non-empty; otherwise use site default (empty string must not win). */
export function coalesceImageUrl(value: string | undefined | null, fallback: string): string {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
}

export function coalesceImageList(value: string[] | undefined | null, fallback: string[]): string[] {
  const filtered = (value ?? []).map((entry) => entry?.trim()).filter((entry): entry is string => Boolean(entry));
  return filtered.length > 0 ? filtered : fallback;
}

export function resolveImageUrl(url: string | undefined | null, seed?: string | number): string {
  if (!url || url.trim() === '' || url === LEGACY_PORTRAIT) {
    return assetUrl(placeholderImage(seed));
  }
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  return assetUrl(optimizeAssetPath(url));
}

function transformsEnabled(): boolean {
  return import.meta.env.VITE_SUPABASE_IMAGE_TRANSFORM === 'true';
}

function isSupabaseObjectUrl(url: string): boolean {
  return /supabase\.co\/storage\/v1\/object\/public\//i.test(url)
    || /supabase\.co\/storage\/v1\/render\/image\/public\//i.test(url);
}

/**
 * Optionally rewrite Supabase public object URLs to the image transform renderer.
 * Off by default — this project’s storage plan does not serve /render/image/
 * reliably. Set VITE_SUPABASE_IMAGE_TRANSFORM=true once transforms are enabled.
 */
export function supabaseImageUrl(url: string, width?: number, quality = 75): string {
  if (!width || !transformsEnabled() || !url.includes('supabase.co/storage/')) return url;

  let next = url.replace(
    /\/storage\/v1\/object\/public\//i,
    '/storage/v1/render/image/public/',
  );

  try {
    const parsed = new URL(next);
    parsed.searchParams.set('width', String(Math.min(2500, Math.max(1, Math.round(width)))));
    parsed.searchParams.set('quality', String(quality));
    parsed.searchParams.set('resize', 'contain');
    return parsed.toString();
  } catch {
    const separator = next.includes('?') ? '&' : '?';
    return `${next}${separator}width=${width}&quality=${quality}&resize=contain`;
  }
}

export function supabaseSrcSet(url: string, quality = 75): string | undefined {
  if (!transformsEnabled() || !isSupabaseObjectUrl(url)) return undefined;
  return SRCSET_WIDTHS
    .map((w) => `${supabaseImageUrl(url, w, quality)} ${w}w`)
    .join(', ');
}
