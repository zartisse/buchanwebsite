import { useEffect, useState } from 'react';
import { OptimizedImage } from '../../ui/OptimizedImage';
import homeStyles from '../../../pages/public/Home.module.css';

type HeroCarouselProps = {
  slides: string[];
};

const INTERVAL_MS = 6000;

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
    const timer = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % validSlides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [validSlides.length, reduceMotion]);

  if (validSlides.length === 0) {
    return (
      <OptimizedImage
        src="/assets/ph-arch-1.webp"
        seed="home-hero"
        priority
      />
    );
  }

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
          />
        </div>
      ))}
    </>
  );
}
