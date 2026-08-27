import { useEffect, useRef, useState } from 'react';
import type { HomePageContent } from '../../../types';
import { loadReviewWidgetScript, reviewWidgetContainerClass } from '../../../lib/reviewWidget';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './GoogleReviewsSection.module.css';

type GoogleReviewsSectionProps = {
  section: HomePageContent['google_reviews_section'];
  widgetId?: string;
};

const DEFAULT_MAPS_URL =
  'https://www.google.com/maps/search/?api=1&query=John+Buchan+Homes+Bellevue+WA';

export function GoogleReviewsSection({ section, widgetId }: GoogleReviewsSectionProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  const id = widgetId?.trim();
  const mapsUrl = section.fallback_maps_url?.trim() || DEFAULT_MAPS_URL;

  useEffect(() => {
    if (!id || !widgetRef.current) return;

    const target = widgetRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        loadReviewWidgetScript()
          .then(() => setScriptLoaded(true))
          .catch(() => setFailed(true));
      },
      { rootMargin: '200px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [id]);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <header className={styles.header}>
            <span className="eyebrowRule eyebrowRuleCenter">{section.eyebrow}</span>
            {section.title && <h2 className={styles.title}>{section.title}</h2>}
          </header>
        </RevealOnScroll>

        {id && !failed ? (
          <div ref={widgetRef} className={styles.widgetWrap}>
            <div className={reviewWidgetContainerClass(id)} data-elfsight-app-lazy />
            {!scriptLoaded && <p className={styles.loading}>Loading reviews…</p>}
          </div>
        ) : (
          <div className={styles.fallback}>
            <p className={styles.fallbackText}>
              {failed
                ? 'Reviews could not be loaded right now.'
                : 'Google reviews will appear here once the widget is configured.'}
            </p>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className={styles.fallbackLink}>
              Read our reviews on Google <span aria-hidden>→</span>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
