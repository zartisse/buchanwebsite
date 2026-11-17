import { useState } from 'react';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { assetUrl } from '../../../lib/assets';
import { ArrowIcon, ArrowLink } from './ArrowLink';
import styles from './Landing.module.css';

type CraftSlide = {
  title: React.ReactNode;
  body: string[];
  image: string;
  alt: string;
  cta: string;
  to: string;
};

/** Copy for slides 1 and 2 is Heather's. Slide 3 is a draft in the brand voice for her review. */
const SLIDES: CraftSlide[] = [
  {
    title: <>What endures is what&rsquo;s <em>built with care.</em></>,
    body: [
      'A well-built home reflects more than beauty. It reflects discipline, experience, and a commitment to doing things the right way, whether or not they’re ever seen.',
      'That philosophy has guided our work for generations. It shapes every layer of the home and every relationship along the way, creating a building experience defined by confidence, clarity, and lasting quality.',
    ],
    image: '/assets/craft/staircase-light.webp',
    alt: 'Oak-paneled staircase with a carved newel post in warm afternoon light',
    cta: 'Our approach',
    to: '/why-choose-buchan',
  },
  {
    title: <>What&rsquo;s finished beautifully is <em>built methodically.</em></>,
    body: [
      'An exceptional home is more than what you see. It is careful framing, precise coordination, and durable assemblies working together beneath every surface.',
      'From structure and waterproofing to drywall, trim, and tile, each layer is considered, so performance, beauty, and longevity are never left to chance.',
    ],
    image: '/assets/craft/wall-cutaway.webp',
    alt: 'Cutaway of a shower wall showing framing, wiring, copper pipe, insulation, waterproof backer board and finished tile',
    cta: 'Our approach',
    to: '/why-choose-buchan',
  },
  {
    title: <>What lasts is <em>planned before it&rsquo;s built.</em></>,
    body: [
      'Quality is decided long before the first day on site. Scope, specifications, and investment are aligned early, so every layer that follows is built to a plan you have already seen.',
      'Preconstruction is where we do our most careful work, and where most surprises are prevented.',
    ],
    image: '/assets/photos/clyde-hill-47.webp',
    alt: 'Stone-clad entry with a pivot glass door and black steel details',
    cta: 'Explore preconstruction',
    to: '/preconstruction',
  },
];

export function Craftsmanship() {
  const [index, setIndex] = useState(0);
  const go = (next: number) => setIndex((next + SLIDES.length) % SLIDES.length);

  return (
    <section
      id="craftsmanship"
      className={`${styles.section} ${styles.craft}`}
      aria-roledescription="carousel"
      aria-label="Integrity in every layer"
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(index + 1);
        if (e.key === 'ArrowLeft') go(index - 1);
      }}
    >
      <div className={styles.inner}>
        <RevealOnScroll>
          <p className={styles.eyebrow}>Integrity in every layer</p>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className={styles.craftStage} aria-live="polite">
            {SLIDES.map((s, i) => (
              <div
                key={s.to + i}
                className={`${styles.craftSlide} ${i === index ? styles.craftSlideActive : ''}`}
                inert={i !== index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${SLIDES.length}`}
              >
                <div className={styles.craftText}>
                  <h2 className={styles.h2}>{s.title}</h2>
                  {s.body.map((para) => <p key={para.slice(0, 24)} className={styles.body}>{para}</p>)}
                  <ArrowLink to={s.to}>{s.cta}</ArrowLink>
                </div>
                <div className={styles.bezel}>
                  <img src={assetUrl(s.image)} alt={s.alt} width={788} height={733} loading="lazy" decoding="async" />
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <div className={styles.craftControls}>
          <button type="button" className={styles.ringBtn} onClick={() => go(index - 1)} aria-label="Previous slide">
            <span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}><ArrowIcon /></span>
          </button>
          <button type="button" className={styles.ringBtn} onClick={() => go(index + 1)} aria-label="Next slide">
            <ArrowIcon />
          </button>
          <span className={`${styles.counter} tabularNums`}><strong>{String(index + 1).padStart(2, '0')}</strong> / {String(SLIDES.length).padStart(2, '0')}</span>
          <div className={styles.dots}>
            {SLIDES.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
