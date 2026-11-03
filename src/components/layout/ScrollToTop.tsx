import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../../lib/analytics';

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  // Page view for GTM/GA4 on every route change. Wait a tick so the page's
  // <title> (set by react-helmet) is already updated.
  useEffect(() => {
    const t = window.setTimeout(() => trackPageView(pathname), 300);
    return () => window.clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ block: 'start' });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
