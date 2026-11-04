import { useEffect, useState } from 'react';
import { OptimizedImage } from '../../ui/OptimizedImage';
import homeStyles from '../../../pages/public/Home.module.css';

type HeroCarouselProps = {
  slides: string[];
};

const INTERVAL_MS = 6500;

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const validSlides = slides.filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (validSlides.length <= 1 || reduceMotion) return;
    const timer = window.setTimeout(() => {
      setActiveIndex((i) => (i + 1) % validSlides.length);
    }, INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [validSlides.length, reduceMotion, activeIndex]);

  if (validSlides.length === 0) {
    return (
      <OptimizedImage
        src="/assets/ph-arch-1.webp"
        seed="home-hero"
        priority
        displayWidth={1920}
        sizes="(max-width: 900px) 100vw, 60vw"
      />
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <>
      {validSlides.map((src, i) => (
        <div
          key={`${src}-${i}`}
          className={`${homeStyles.heroSlide} ${i === activeIndex ? homeStyles.heroSlideActive : ''}`}
          aria-hidden={i !== activeIndex}
        >
          <OptimizedImage
            src={src}
            seed={`home-hero-${i}`}
            priority={i === 0}
            displayWidth={1920}
            sizes="(max-width: 900px) 100vw, 60vw"
          />
        </div>
      ))}
      {validSlides.length > 1 && (
        <div className={homeStyles.heroPager}>
          <span className={homeStyles.heroPagerCount}>
            {pad(activeIndex + 1)} <i>/</i> {pad(validSlides.length)}
          </span>
          <span className={homeStyles.heroPagerBars}>
            {validSlides.map((src, i) => (
              <button
                key={`bar-${src}-${i}`}
                type="button"
                className={`${homeStyles.heroPagerBar} ${i === activeIndex ? homeStyles.heroPagerBarActive : ''}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Show image ${i + 1} of ${validSlides.length}`}
                aria-current={i === activeIndex ? 'true' : undefined}
              >
                <span style={{ animationDuration: reduceMotion ? '0s' : `${INTERVAL_MS}ms` }} />
              </button>
            ))}
          </span>
        </div>
      )}
    </>
  );
}
