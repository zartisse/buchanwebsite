import { assetUrl } from './assets';

const ARCH_PLACEHOLDERS = [
  '/assets/ph-arch-1.png',
  '/assets/ph-arch-2.png',
  '/assets/ph-arch-3.png',
  '/assets/ph-arch-4.png',
] as const;

const LEGACY_PORTRAIT = '/assets/ph-portrait.svg';

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

export function resolveImageUrl(url: string | undefined | null, seed?: string | number): string {
  if (!url || url.trim() === '' || url === LEGACY_PORTRAIT) {
    return assetUrl(placeholderImage(seed));
  }
  return assetUrl(url);
}
