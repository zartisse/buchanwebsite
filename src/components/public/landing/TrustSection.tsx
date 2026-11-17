import { useMemo, useState } from 'react';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { useSitePage } from '../../../hooks/useSitePage';
import { getDemoPageContent } from '../../../data/sitePagesDemo';
import { ArrowLink } from './ArrowLink';
import styles from './Landing.module.css';

type Testimonial = { quote: string; name: string; place: string };

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=John+Buchan+Homes+Bellevue+WA';

export function TrustSection({ reviewsUrl }: { reviewsUrl?: string }) {
  const { page } = useSitePage('testimonials');
  const content = page?.content ?? getDemoPageContent('testimonials');
  const [index, setIndex] = useState(0);

  const items = useMemo<Testimonial[]>(() => {
    const [featName, featPlace = ''] = content.featured.cite.split('·').map((s) => s.trim());
    return [
      { quote: content.featured.quote, name: featName, place: featPlace },
      ...content.quotes.map((q) => ({ quote: q.quote, name: q.name, place: q.city })),
    ];
  }, [content]);

  return (
    <section id="client-trust" className={`${styles.section} ${styles.trust}`}>
      <div className={styles.inner}>
        <div className={styles.trustGrid}>
          <RevealOnScroll variant="left">
            <p className={styles.eyebrow}>Client trust</p>
            <h2 className={styles.h2}>In their <em>words.</em></h2>
            <div className={styles.names} role="tablist" aria-label="Client stories">
              {items.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  className={`${styles.nameBtn} ${i === index ? styles.nameBtnActive : ''}`}
                  onClick={() => setIndex(i)}
                >
                  <strong>{t.name}</strong>
                  <span>{t.place}</span>
                </button>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll variant="right">
            <div className={styles.quoteStage} aria-live="polite">
              {items.map((t, i) => (
                <figure key={t.name} className={`${styles.quote} ${i === index ? styles.quoteActive : ''}`} aria-hidden={i !== index}>
                  <span className={styles.quoteMark} aria-hidden>&ldquo;</span>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>{t.name}{t.place ? `, ${t.place}` : ''}</figcaption>
                </figure>
              ))}
            </div>
            <div className={styles.trustLinks}>
              <ArrowLink to="/testimonials">Client stories</ArrowLink>
              <a className={styles.plainLink} href={reviewsUrl || MAPS_URL} target="_blank" rel="noopener noreferrer">
                Read our Google reviews
              </a>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
