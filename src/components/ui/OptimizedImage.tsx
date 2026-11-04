import { useState } from 'react';
import { resolveImageUrl, supabaseImageUrl, supabaseSrcSet } from '../../lib/placeholders';
import { assetUrl } from '../../lib/assets';

type OptimizedImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'loading' | 'decoding' | 'fetchPriority' | 'srcSet'
> & {
  /** Raw CMS/local path or full URL */
  src?: string | null;
  /** Seed for placeholder rotation when src is empty */
  seed?: string | number;
  /** LCP / above-the-fold: eager load + high fetch priority */
  priority?: boolean;
  /** Use src as-is (already resolved URL) */
  resolved?: boolean;
  /** Pass through assetUrl() without placeholder resolution */
  direct?: boolean;
  /**
   * Target display width used to request a resized Supabase image.
   * Falls back to the HTML width attribute when set.
   */
  displayWidth?: number;
};

export function OptimizedImage({
  src,
  seed,
  priority = false,
  direct = false,
  resolved = false,
  alt = '',
  width,
  height,
  displayWidth,
  sizes,
  className,
  style,
  onError,
  ...rest
}: OptimizedImageProps) {
  // If a resized CDN variant fails, fall back to the original file instead of a broken image.
  const [useOriginal, setUseOriginal] = useState(false);
  const resolvedSrc = resolved
    ? (src ?? '')
    : direct
      ? assetUrl(src ?? '')
      : resolveImageUrl(src, seed);

  const targetWidth =
    displayWidth
    ?? (typeof width === 'number' ? width : undefined)
    ?? (typeof width === 'string' && /^\d+$/.test(width) ? Number(width) : undefined);

  const imageSrc = !useOriginal && targetWidth
    ? supabaseImageUrl(resolvedSrc, targetWidth)
    : resolvedSrc;

  const srcSet = useOriginal ? undefined : supabaseSrcSet(resolvedSrc);
  const canFallBack = !useOriginal && (imageSrc !== resolvedSrc || Boolean(srcSet));

  return (
    <img
      src={imageSrc}
      srcSet={srcSet}
      sizes={srcSet ? (sizes ?? '100vw') : sizes}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={(e) => {
        if (canFallBack) setUseOriginal(true);
        onError?.(e);
      }}
      {...rest}
    />
  );
}
