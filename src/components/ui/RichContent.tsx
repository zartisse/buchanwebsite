import { useMemo } from 'react';
import styles from './RichContent.module.css';

const ALLOWED = new Set([
  'P', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'A', 'STRONG', 'B', 'EM', 'I', 'BLOCKQUOTE',
  'FIGURE', 'FIGCAPTION', 'IMG', 'BR', 'HR', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'IFRAME', 'SPAN', 'DIV',
]);
const ATTRS: Record<string, string[]> = {
  A: ['href', 'title', 'target', 'rel'],
  IMG: ['src', 'alt', 'width', 'height', 'loading'],
  IFRAME: ['src', 'title', 'allow', 'allowfullscreen', 'width', 'height'],
  TD: ['colspan', 'rowspan'],
  TH: ['colspan', 'rowspan'],
};
const SAFE_IFRAME = /^https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i;

/** Very small allow-list sanitizer for HTML imported from the old site. */
export function sanitizeHtml(html: string): string {
  if (typeof window === 'undefined') return '';
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const walk = (node: Element) => {
    Array.from(node.children).forEach((el) => {
      if (!ALLOWED.has(el.tagName)) {
        if (['SCRIPT', 'STYLE', 'FORM', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA', 'NOSCRIPT', 'SVG'].includes(el.tagName)) {
          el.remove();
          return;
        }
        el.replaceWith(...Array.from(el.childNodes));
        return;
      }
      const keep = ATTRS[el.tagName] ?? [];
      Array.from(el.attributes).forEach((a) => {
        if (!keep.includes(a.name)) el.removeAttribute(a.name);
      });
      if (el.tagName === 'A') {
        const href = el.getAttribute('href') ?? '';
        if (/^\s*javascript:/i.test(href)) el.removeAttribute('href');
        if (/^https?:\/\//i.test(href) && !/^https?:\/\/(www\.)?buchan\.com/i.test(href)) {
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener noreferrer');
        }
      }
      if (el.tagName === 'IFRAME' && !SAFE_IFRAME.test(el.getAttribute('src') ?? '')) {
        el.remove();
        return;
      }
      if (el.tagName === 'IMG') el.setAttribute('loading', 'lazy');
      walk(el);
    });
  };
  walk(doc.body);
  // Drop empty paragraphs left over from the page builder
  doc.body.querySelectorAll('p').forEach((p) => {
    if (!p.textContent?.trim() && !p.querySelector('img,iframe')) p.remove();
  });
  return doc.body.innerHTML;
}

export function RichContent({ html, className = '' }: { html: string; className?: string }) {
  const safe = useMemo(() => sanitizeHtml(html), [html]);
  return <div className={`${styles.rich} ${className}`} dangerouslySetInnerHTML={{ __html: safe }} />;
}

export function looksLikeHtml(text: string | undefined | null): boolean {
  return Boolean(text && /<\/?(p|h[2-6]|ul|ol|figure|img|div)\b/i.test(text));
}
