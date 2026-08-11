import { Link } from 'react-router-dom';
import { resolveImageUrl } from '../../../lib/placeholders';
import type { HomePageContent } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './WhatWeDo.module.css';

type WhatWeDoProps = {
  section: HomePageContent['what_we_do'];
};

export function WhatWeDo({ section }: WhatWeDoProps) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>{section.eyebrow}</span>
          <h2 className={styles.title}>
            {section.title}
            {section.title_emphasis && (
              <>
                <br /><em>{section.title_emphasis}</em>
              </>
            )}
          </h2>
        </RevealOnScroll>

        <div className={styles.primaryGrid}>
          {section.primary.map((item, i) => (
            <RevealOnScroll key={item.title} variant="left" index={i}>
              <Link to={item.link} className={`${styles.primaryCard} cardHover imageHover`}>
                <div className={styles.primaryImgWrap}>
                  <img src={resolveImageUrl(item.image_url, item.title)} alt="" />
                </div>
                <div className={styles.primaryCopy}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <span className={styles.linkHint}>Learn more →</span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <div className={styles.secondaryGrid}>
          {section.secondary.map((item) => (
            <RevealOnScroll key={item.title}>
              <Link to={item.link} className={`${styles.secondaryCard} cardHover`}>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <div className={styles.preconBand}>
          <div>
            <h3 className={styles.preconTitle}>{section.preconstruction.title}</h3>
            <p className={styles.preconBody}>{section.preconstruction.body}</p>
          </div>
          <Link to={section.preconstruction.cta_link} className={styles.preconCta}>{section.preconstruction.cta_label}</Link>
        </div>
      </div>
    </section>
  );
}
