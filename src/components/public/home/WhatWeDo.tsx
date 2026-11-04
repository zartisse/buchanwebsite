import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionIndex } from '../../ui/SectionIndex';
import styles from './WhatWeDo.module.css';

type WhatWeDoProps = {
  section: HomePageContent['what_we_do'];
  index?: string;
};

export function WhatWeDo({ section, index }: WhatWeDoProps) {
  const title = section.title_emphasis
    ? <>{section.title} <em>{section.title_emphasis}</em></>
    : section.title;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="up">
          <header className={styles.header}>
            <SectionIndex index={index} label={section.eyebrow} />
            <h2 className={styles.title}>{title}</h2>
          </header>
        </RevealOnScroll>

        <div className={styles.primaryGrid}>
          {section.primary.map((item, i) => (
            <Link
              key={item.title}
              to={item.link}
              className={`${styles.primaryCard} ${i === 0 ? styles.primaryLead : styles.primaryOffset}`}
            >
              <RevealOnScroll variant="mask" className={styles.primaryFrame}>
                <OptimizedImage
                  src={item.image_url}
                  seed={item.title}
                  alt=""
                  displayWidth={i === 0 ? 1400 : 1000}
                  sizes={i === 0 ? '(max-width: 900px) 100vw, 56vw' : '(max-width: 900px) 100vw, 40vw'}
                />
              </RevealOnScroll>
              <RevealOnScroll variant="up" index={1} className={styles.primaryCaption}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDesc}>{item.description}</p>
                <span className="linkAccent">{item.cta_label ?? `Explore ${item.title}`} <span>→</span></span>
              </RevealOnScroll>
            </Link>
          ))}
        </div>

        <ul className={styles.serviceList}>
          {section.secondary.map((item, i) => (
            <li key={item.title}>
              <RevealOnScroll variant="up" index={i}>
                <Link to={item.link} className={styles.serviceRow}>
                  <span className={styles.serviceNo}>{String(i + 1 + section.primary.length).padStart(2, '0')}</span>
                  <span className={styles.serviceTitle}>{item.title}</span>
                  <span className={styles.serviceDesc}>{item.description}</span>
                  <span className={styles.serviceThumb} aria-hidden>
                    <OptimizedImage src={item.image_url} seed={item.title} alt="" displayWidth={320} sizes="160px" />
                  </span>
                  <span className={styles.serviceArrow} aria-hidden />
                </Link>
              </RevealOnScroll>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
