import { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useProperties } from '../../../hooks/useProperties';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { ArrowIcon, ArrowLink } from './ArrowLink';
import type { Property } from '../../../types';
import styles from './Landing.module.css';

const MAX_SLIDES = 8;
const WORK_TYPES = new Set(['custom-homes', 'renovations', undefined]);

function place(p: Property): string {
  const city = p.city?.trim();
  return city ? `${city}, Washington` : 'Washington';
}

export function RecentWork() {
  const { properties, loading } = useProperties({ publicOnly: true });
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const slides = useMemo(() => {
    const usable = properties.filter((p) => p.image_url && WORK_TYPES.has(p.portfolio_type));
    const featured = usable.filter((p) => p.featured).sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0));
    const rest = usable.filter((p) => !p.featured);
    return [...featured, ...rest].slice(0, MAX_SLIDES);
  }, [properties]);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, slides.length]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector('a');
    const step = (card?.getBoundingClientRect().width ?? el.clientWidth * 0.5) + 24;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section id="recent-work" className={`${styles.section} ${styles.work}`} aria-label="Recent work">
      <div className={styles.workHead}>
        <RevealOnScroll>
          <p className={styles.eyebrow}>Recent work</p>
          <h2 className={styles.h2}>Let the homes <em>speak.</em></h2>
        </RevealOnScroll>
        <div className={styles.workControls}>
          <ArrowLink to="/portfolio">View all work</ArrowLink>
          <button type="button" className={styles.ringBtn} onClick={() => scrollByCard(-1)} disabled={atStart} aria-label="Previous project">
            <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}><ArrowIcon /></span>
          </button>
          <button type="button" className={styles.ringBtn} onClick={() => scrollByCard(1)} disabled={atEnd} aria-label="Next project">
            <ArrowIcon />
          </button>
        </div>
      </div>

      <div className={styles.track} ref={trackRef} onScroll={update} tabIndex={0} role="region" aria-label="Project photography, scroll horizontally">
        {loading && [0, 1, 2].map((i) => <div key={i} className={styles.slideSkeleton} aria-hidden />)}
        {!loading && slides.map((p) => (
          <Link key={p.slug} to={`/portfolio/${p.slug}/`} className={styles.slide}>
            <OptimizedImage
              src={p.image_url}
              seed={p.slug}
              alt={`${p.name}, ${place(p)}`}
              displayWidth={1400}
              sizes="(max-width: 720px) 82vw, 40vw"
            />
            <span className={styles.slideVeil}>
              <span className={styles.slideName}>{p.name}</span>
              <span className={styles.slidePlace}>{place(p)}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
