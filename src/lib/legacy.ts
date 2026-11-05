/**
 * URL continuity with the old WordPress site (buchan.com).
 * Old URLs keep working at exactly the same path, and are the canonical address
 * Google sees, so existing rankings carry over to the new site.
 */

/** New-site path -> original buchan.com path that should stay canonical. */
export const CANONICAL_ALIASES: Record<string, string> = {
  '/about': '/about-us/',
  '/contact': '/contact-us/',
  '/renovations': '/services/remodel/',
  '/custom-homes': '/services/build/',
  '/services/planning-budgeting': '/services/design/',
};

/** Old blog category slugs (URL prefix) and their names. */
export const POST_CATEGORY_PATHS: Record<string, string> = {
  'company-updates': 'Company Updates',
  'industry-news': 'Industry News',
  lifestyle: 'Lifestyle',
  'custom-homes': 'Custom Homes',
};

/** Always compare and emit paths with a trailing slash, like WordPress. */
export function withSlash(path: string): string {
  if (!path || path === '/') return '/';
  const clean = path.split(/[?#]/)[0];
  return clean.endsWith('/') ? clean : `${clean}/`;
}

export function canonicalPath(pathname: string): string {
  const bare = pathname.replace(/\/+$/, '') || '/';
  return CANONICAL_ALIASES[bare] ?? withSlash(pathname);
}

/** Link to a blog post: imported posts keep their original URL. */
export function postHref(post: { slug: string; path?: string | null }): string {
  return post.path || `/blog/${post.slug}/`;
}
