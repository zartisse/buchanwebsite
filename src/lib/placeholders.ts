import { assetUrl } from './assets';

/**
 * Real Buchan project photos (Clyde Hill) used wherever a page has no photo of its own,
 * or still points at one of the old dark placeholders (/assets/ph-arch-N).
 */
const ARCH_PLACEHOLDERS = [
  '/assets/photos/clyde-hill-46.webp',
  '/assets/photos/clyde-hill-19.webp',
  '/assets/photos/clyde-hill-42.webp',
  '/assets/photos/clyde-hill-23.webp',
  '/assets/photos/clyde-hill-47.webp',
  '/assets/photos/clyde-hill-33.webp',
  '/assets/photos/clyde-hill-44.webp',
  '/assets/photos/clyde-hill-38.webp',
  '/assets/photos/clyde-hill-41.webp',
  '/assets/photos/clyde-hill-21.webp',
  '/assets/photos/clyde-hill-43.webp',
  '/assets/photos/clyde-hill-37.webp',
  '/assets/photos/clyde-hill-15.webp',
  '/assets/photos/clyde-hill-09.webp',
] as const;

const OLD_PLACEHOLDER = /\/assets\/ph-arch-\d+\.(?:png|webp|svg|jpe?g)$/i;

const LEGACY_PORTRAIT = '/assets/ph-portrait.svg';

const SRCSET_WIDTHS = [640, 1280, 1920] as const;
const CDN_SRCSET_WIDTHS = [480, 800, 1200, 1600, 2000] as const;

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
  if (OLD_PLACEHOLDER.test(url.split('?')[0])) {
    return assetUrl(placeholderImage(seed ?? url));
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

/** Netlify Image CDN: resizes + converts to AVIF/WebP at the edge (enabled for Netlify builds). */
function netlifyImagesEnabled(): boolean {
  return import.meta.env.VITE_NETLIFY_IMAGES === 'true';
}

function isLocalRasterAsset(url: string): boolean {
  const path = url.split('?')[0];
  return /^\/(?:[^?#]*\/)?assets\/[^?#]+\.(?:jpe?g|png|webp)$/i.test(path);
}

function netlifyEligible(url: string): boolean {
  return netlifyImagesEnabled() && (isSupabaseObjectUrl(url) || isLocalRasterAsset(url));
}

function netlifyImageUrl(url: string, width: number, quality = 72): string {
  const w = Math.min(2400, Math.max(1, Math.round(width)));
  return `/.netlify/images?url=${encodeURIComponent(url)}&w=${w}&q=${quality}`;
}

/**
 * Rewrite image URLs to a resized, compressed variant.
 * - Supabase render endpoint when VITE_SUPABASE_IMAGE_TRANSFORM=true (paid storage plan)
 * - otherwise the Netlify Image CDN on Netlify builds (see netlify.toml [images])
 * - otherwise the original URL
 */
/**
 * Photos imported from the old site have pre-made smaller copies next to the original
 * (name-800.webp, name-1600.webp). Serving those directly is faster than resizing on the fly.
 */
const LEGACY_IMAGE = /\/storage\/v1\/object\/public\/media\/legacy\/.+\.webp$/i;
const LEGACY_VARIANT = /-(800|1600)\.webp$/i;

export function isLegacyImage(url: string): boolean {
  const path = url.split('?')[0];
  return LEGACY_IMAGE.test(path) && !LEGACY_VARIANT.test(path);
}

export function legacyVariant(url: string, width: number): string {
  if (!isLegacyImage(url)) return url;
  if (width <= 800) return url.replace(/\.webp$/i, '-800.webp');
  if (width <= 1600) return url.replace(/\.webp$/i, '-1600.webp');
  return url;
}

/** Best size for the full-screen gallery view. */
export function lightboxImageUrl(url: string): string {
  if (isLegacyImage(url)) return legacyVariant(url, 1600);
  return supabaseImageUrl(url, 1600);
}

/** Small copy used as an instant placeholder while the large one loads. */
export function previewImageUrl(url: string): string {
  if (isLegacyImage(url)) return legacyVariant(url, 800);
  return supabaseImageUrl(url, 800);
}

export function supabaseImageUrl(url: string, width?: number, quality = 75): string {
  if (!width) return url;
  if (isLegacyImage(url)) return legacyVariant(url, width);
  if (!transformsEnabled() && netlifyEligible(url)) return netlifyImageUrl(url, width);
  if (!transformsEnabled() || !url.includes('supabase.co/storage/')) return url;

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
  if (isLegacyImage(url)) {
    return `${legacyVariant(url, 800)} 800w, ${legacyVariant(url, 1600)} 1600w, ${url} 2000w`;
  }
  if (!transformsEnabled() && netlifyEligible(url)) {
    return CDN_SRCSET_WIDTHS.map((w) => `${netlifyImageUrl(url, w)} ${w}w`).join(', ');
  }
  if (!transformsEnabled() || !isSupabaseObjectUrl(url)) return undefined;
  return SRCSET_WIDTHS
    .map((w) => `${supabaseImageUrl(url, w, quality)} ${w}w`)
    .join(', ');
}
