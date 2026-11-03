import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface PageMetaProps {
  title: string;
  description?: string;
  /** Absolute or site-relative image for link previews. Defaults to the site-wide image. */
  image?: string;
}

const BRAND = 'John Buchan Homes';
const DEFAULT_IMAGE = '/assets/og-image.jpg';

function absolute(url: string): string {
  if (/^https?:\/\//i.test(url)) return url;
  if (typeof window === 'undefined') return url;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${window.location.origin}${url.startsWith(base) ? '' : base}${url}`;
}

export function PageMeta({ title, description, image }: PageMetaProps) {
  const { pathname } = useLocation();
  // CMS titles sometimes already end with the brand name; never repeat it.
  const fullTitle = title.includes(BRAND) ? title : `${title} | ${BRAND}`;
  const canonical = typeof window !== 'undefined' ? `${window.location.origin}${pathname}` : pathname;
  const ogImage = absolute(image || DEFAULT_IMAGE);

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
    </Helmet>
  );
}
