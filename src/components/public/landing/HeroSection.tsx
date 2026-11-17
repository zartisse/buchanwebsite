import { useEffect, useState } from 'react';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { ArrowLink } from './ArrowLink';
import styles from './Landing.module.css';

const INTERVAL_MS = 7000;

type HeroSectionProps = {
  slides: string[];
};

export function HeroSection({ slides }: HeroSectionProps) {
  const valid = slides.filter(Boolean);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (valid.length <= 1 || reduce) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % valid.length), INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [valid.length]);

  return (
    <section className={styles.hero} aria-label="Welcome">
      <div className={styles.heroMedia} aria-hidden>
        {(valid.length ? valid : ['/assets/ph-arch-1.webp']).map((src, i) => (
          <div key={`${src}-${i}`} className={`${styles.heroSlide} ${i === active ? styles.heroSlideActive : ''}`}>
            <OptimizedImage src={src} seed={`home-hero-${i}`} priority={i === 0} displayWidth={1920} sizes="100vw" />
          </div>
        ))}
      </div>
      <div className={styles.heroScrim} aria-hidden />

      <div className={styles.heroBody}>
        <RevealOnScroll variant="up">
          <h1 className={styles.heroTitle}>Build with <em>certainty.</em></h1>
        </RevealOnScroll>
        <RevealOnScroll variant="up" index={1}>
          <ArrowLink to="#recent-work" light>Explore our work</ArrowLink>
        </RevealOnScroll>
      </div>

      <p className={styles.heroHeritage}>
        <span>Family-owned since 1961</span>
        <span aria-hidden>·</span>
        <span>Serving Bellevue &amp; the Greater Eastside</span>
      </p>
    </section>
  );
}
