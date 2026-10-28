const CHUNK_SIZE = 1800;
const CHUNK_OVERLAP = 200;

export function chunkText(text: string): string[] {
  const normalized = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  if (!normalized) return [];

  const chunks: string[] = [];
  let start = 0;
  while (start < normalized.length) {
    const end = Math.min(start + CHUNK_SIZE, normalized.length);
    let slice = normalized.slice(start, end);
    if (end < normalized.length) {
      const lastBreak = slice.lastIndexOf('\n');
      if (lastBreak > CHUNK_SIZE * 0.5) {
        slice = slice.slice(0, lastBreak);
      }
    }
    const trimmed = slice.trim();
    if (trimmed) chunks.push(trimmed);
    if (end >= normalized.length) break;
    start += Math.max(trimmed.length - CHUNK_OVERLAP, 1);
  }
  return chunks;
}

export function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—',
  hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', copy: '©', reg: '®', trade: '™',
};

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n > 0 && n < 0x110000 ? String.fromCodePoint(n) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

function attr(tag: string, name: string): string {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  return decodeEntities((m?.[2] ?? m?.[3] ?? m?.[4] ?? '').trim());
}

function metaContent(html: string, key: string): string {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    if (attr(tag, 'name').toLowerCase() === key || attr(tag, 'property').toLowerCase() === key) {
      return attr(tag, 'content');
    }
  }
  return '';
}

/** Outermost region between the first opening and last closing tag of `tag`. */
function region(html: string, tag: string): string | null {
  const open = html.search(new RegExp(`<${tag}\\b`, 'i'));
  if (open < 0) return null;
  const close = html.toLowerCase().lastIndexOf(`</${tag}>`);
  if (close <= open) return null;
  return html.slice(open, close + tag.length + 3);
}

export type ExtractedPage = {
  title: string;
  description: string;
  text: string;
  links: string[];
};

/** Readable main-content text plus every link href (resolved against the page URL). */
export function extractHtml(html: string, pageUrl: string): ExtractedPage {
  const baseHref = attr(html.match(/<base\b[^>]*>/i)?.[0] ?? '', 'href');
  let base: URL;
  try {
    base = new URL(baseHref || pageUrl, pageUrl);
  } catch {
    base = new URL(pageUrl);
  }

  const links: string[] = [];
  for (const tag of html.match(/<a\b[^>]*>/gi) ?? []) {
    const href = attr(tag, 'href');
    if (!href || /^(mailto:|tel:|javascript:|#)/i.test(href)) continue;
    try {
      links.push(new URL(href, base).href);
    } catch {
      /* ignore malformed hrefs */
    }
  }

  const title = decodeEntities(
    metaContent(html, 'og:title') || (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? ''),
  )
    .replace(/\s+/g, ' ')
    .trim();
  const description = metaContent(html, 'description') || metaContent(html, 'og:description');

  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|template|iframe|canvas)\b[\s\S]*?<\/\1>/gi, ' ');
  let body = region(cleaned, 'main') ?? region(cleaned, 'article') ?? region(cleaned, 'body') ?? cleaned;
  body = body.replace(/<(nav|header|footer|aside|form)\b[\s\S]*?<\/\1>/gi, ' ');

  const text = decodeEntities(
    body
      .replace(/<h[1-3]\b[^>]*>/gi, '\n\n## ')
      .replace(/<li\b[^>]*>/gi, '\n- ')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(p|div|section|article|h[1-6]|li|ul|ol|tr|table|blockquote|figure|figcaption)>/gi, '\n')
      .replace(/<[^>]+>/g, ' '),
  )
    .split('\n')
    .map((line) => line.replace(/[ \t\u00a0]+/g, ' ').trim())
    .filter((line, i, all) => line !== '' || (i > 0 && all[i - 1] !== ''))
    .filter((line) => line !== '-' && line !== '##')
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return { title, description, text, links };
}
