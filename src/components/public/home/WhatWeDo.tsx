import { Link } from 'react-router-dom';
import type { HomePageContent } from '../../../types';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './WhatWeDo.module.css';

type WhatWeDoProps = {
  section: HomePageContent['what_we_do'];
};

export function WhatWeDo({ section }: WhatWeDoProps) {
  const title = section.title_emphasis
    ? <>{section.title} <em>{section.title_emphasis}</em></>
    : section.title;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="down">
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </div>
        </RevealOnScroll>

        <div className={styles.primaryGrid}>
          {section.primary.map((item, i) => (
            <RevealOnScroll
              key={item.title}
              index={i}
              variant="scale"
              className={`${styles.gridCell} ${i === 0 ? styles.primaryLead : ''}`}
            >
              <Link to={item.link} className={`${styles.primaryCard} cardHover`}>
                <OptimizedImage
                  src={item.image_url}
                  seed={item.title}
                  alt=""
                  className={styles.cardBg}
                  displayWidth={i === 0 ? 1400 : 900}
                  sizes={i === 0 ? '(max-width: 640px) 100vw, 60vw' : '(max-width: 640px) 100vw, 40vw'}
                />
                <div className={styles.cardScrim} aria-hidden />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardDesc}>{item.description}</p>
                  <span className="linkAccent">{item.cta_label ?? `Explore ${item.title}`} <span>→</span></span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <div className={styles.secondaryGrid}>
          {section.secondary.map((item, i) => (
            <RevealOnScroll key={item.title} index={i + 2} variant={i % 2 === 0 ? 'left' : 'right'} className={styles.gridCell}>
              <Link to={item.link} className={`${styles.secondaryCard} cardHover`}>
                <OptimizedImage
                  src={item.image_url}
                  seed={item.title}
                  alt=""
                  className={styles.cardBg}
                  displayWidth={640}
                  sizes="(max-width: 960px) 50vw, 25vw"
                />
                <div className={styles.cardScrim} aria-hidden />
                <div className={styles.cardContent}>
                  <h4 className={styles.secondaryTitle}>{item.title}</h4>
                  <p className={styles.secondaryDesc}>{item.description}</p>
                  <span className={`linkAccent ${styles.secondaryLink}`}>See the service <span>→</span></span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
