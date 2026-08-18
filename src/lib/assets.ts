const BASE = import.meta.env.BASE_URL;

/** Prefix public asset paths with Vite base (e.g. /buchanwebsite/ on GitHub Pages). */
export function assetUrl(path: string): string {
  if (!path) return path;
  if (/^(https?:|data:|blob:)/i.test(path)) return path;
  const normalized = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE}${normalized}`;
}

/** Set CSS custom properties that reference public assets (Vite does not rewrite url() in CSS). */
export function applyAssetCssVars(): void {
  const root = document.documentElement.style;
  const texture = assetUrl('/assets/logo-mark-square.svg');
  root.setProperty('--texture-mark-square', `url('${texture}')`);
  root.setProperty('--texture-mark', `url('${texture}')`);
  root.setProperty('--texture-mark-light', `url('${texture}')`);
}
