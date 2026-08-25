import { resolveImageUrl } from '../../lib/placeholders';
import { assetUrl } from '../../lib/assets';

type OptimizedImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'loading' | 'decoding' | 'fetchPriority'
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
  className,
  style,
  ...rest
}: OptimizedImageProps) {
  const imageSrc = resolved
    ? (src ?? '')
    : direct
      ? assetUrl(src ?? '')
      : resolveImageUrl(src, seed);

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      {...rest}
    />
  );
}
