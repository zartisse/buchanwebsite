import { decodeEntities } from './chunk.ts';

export const USER_AGENT = 'BuchanHomesKnowledgeBot/1.0';
export const FETCH_TIMEOUT_MS = 15_000;

const SKIP_EXTENSIONS =
  /\.(jpe?g|png|gif|webp|avif|svg|ico|bmp|tiff?|css|js|mjs|json|xml|rss|atom|txt|zip|gz|rar|7z|mp4|m4v|mov|webm|avi|mp3|wav|ogg|woff2?|ttf|otf|eot|docx?|xlsx?|pptx?|csv|dmg|exe)$/i;
const SKIP_PATHS = /\/(wp-admin|wp-json|wp-login\.php|xmlrpc\.php|feed|cart|checkout|my-account|login|logout|cdn-cgi)(\/|$)/i;
const TRACKING_PARAMS = /^(utm_[a-z]+|fbclid|gclid|msclkid|mc_cid|mc_eid|_hsenc|_hsmi|hsCtaTracking|ref|share|replytocom|amp)$/i;

export type CrawlScope = 'site' | 'section';

export type CrawlRules = {
  host: string;
  /** Path prefix for section crawls, e.g. "/blog". "/" means the whole site. */
  prefix: string;
  scope: CrawlScope;
  disallow: string[];
};

export function bareHost(host: string): string {
  return host.toLowerCase().replace(/^www\./, '');
}

/** Canonical form used for dedupe: no hash, no tracking params, no trailing slash (except root). */
export function normalizeUrl(raw: string, base?: string): string | null {
  let url: URL;
  try {
    url = new URL(raw, base);
  } catch {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  url.hash = '';
  url.hostname = url.hostname.toLowerCase();
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMS.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.replace(/\/+$/, '');
  }
  return url.href;
}

export function sectionPrefix(rootUrl: string): string {
  const path = new URL(rootUrl).pathname.replace(/\/+$/, '');
  return path || '/';
}

export function isCrawlable(url: string, rules: CrawlRules): boolean {
  const u = new URL(url);
  if (bareHost(u.hostname) !== rules.host) return false;
  if (SKIP_EXTENSIONS.test(u.pathname) || SKIP_PATHS.test(u.pathname)) return false;
  return !rules.disallow.some((rule) => u.pathname.startsWith(rule));
}

/** Whether links found on this page should be followed further. */
export function isInPrefix(url: string, rules: CrawlRules): boolean {
  if (rules.scope === 'site' || rules.prefix === '/') return true;
  const path = new URL(url).pathname;
  return path === rules.prefix || path.startsWith(`${rules.prefix}/`);
}

export async function fetchWithTimeout(url: string, accept = 'text/html,application/xhtml+xml,*/*;q=0.8') {
  return await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: accept },
    redirect: 'follow',
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
}

/** Disallow rules for `*` (or this bot) and any Sitemap: lines from robots.txt. */
export async function readRobots(origin: string): Promise<{ disallow: string[]; sitemaps: string[] }> {
  const disallow: string[] = [];
  const sitemaps: string[] = [];
  try {
    const res = await fetchWithTimeout(`${origin}/robots.txt`, 'text/plain');
    if (!res.ok) return { disallow, sitemaps };
    const text = await res.text();
    let applies = false;
    let lastWasAgent = false;
    for (const rawLine of text.split('\n')) {
      const line = rawLine.replace(/#.*/, '').trim();
      const sep = line.indexOf(':');
      if (sep < 0) continue;
      const key = line.slice(0, sep).trim().toLowerCase();
      const value = line.slice(sep + 1).trim();
      if (key === 'sitemap') {
        if (value) sitemaps.push(value);
        continue;
      }
      if (key === 'user-agent') {
        const agent = value.toLowerCase();
        const matches = agent === '*' || agent.includes('buchanhomesknowledgebot');
        applies = lastWasAgent ? applies || matches : matches;
        lastWasAgent = true;
        continue;
      }
      lastWasAgent = false;
      if (applies && key === 'disallow' && value) disallow.push(value.replace(/\*.*$/, ''));
    }
  } catch {
    /* no robots.txt: nothing disallowed */
  }
  return { disallow: disallow.filter(Boolean), sitemaps };
}

/** Sitemaps that list articles (WordPress post-sitemap.xml, blog/news sitemaps). */
export const ARTICLE_SITEMAP = /(post|blog|article|news)[^/]*\.xml/i;

export type SitemapEntry = { url: string; sitemap: string };

/** Page URLs from sitemap(s), following sitemap indexes up to a small fan-out. */
export async function readSitemaps(candidates: string[], limit: number): Promise<SitemapEntry[]> {
  const queue = [...new Set(candidates)];
  const seen = new Set<string>();
  const pages: SitemapEntry[] = [];
  let fetched = 0;
  while (queue.length && fetched < 12 && pages.length < limit) {
    const sitemapUrl = queue.shift()!;
    if (seen.has(sitemapUrl)) continue;
    seen.add(sitemapUrl);
    fetched++;
    try {
      const res = await fetchWithTimeout(sitemapUrl, 'application/xml,text/xml,*/*;q=0.5');
      if (!res.ok) continue;
      const xml = await res.text();
      const locs = [...xml.matchAll(/<loc>\s*(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?\s*<\/loc>/gi)].map((m) =>
        decodeEntities(m[1].trim()),
      );
      if (/<sitemapindex\b/i.test(xml)) queue.push(...locs);
      else pages.push(...locs.map((url) => ({ url, sitemap: sitemapUrl })));
    } catch {
      /* skip unreachable sitemap */
    }
  }
  return pages.slice(0, limit);
}
