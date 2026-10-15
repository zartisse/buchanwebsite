import { assetUrl } from './assets';

const ARCH_PLACEHOLDERS = [
  '/assets/ph-arch-1.webp',
  '/assets/ph-arch-2.webp',
  '/assets/ph-arch-3.webp',
  '/assets/ph-arch-4.webp',
] as const;

const LEGACY_PORTRAIT = '/assets/ph-portrait.svg';

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

/** Append width param for Supabase storage URLs when transformations are available. */
export function supabaseImageUrl(url: string, width?: number): string {
  if (!width || !url.includes('supabase.co/storage/')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}width=${width}`;
}
