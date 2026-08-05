import { Link } from 'react-router-dom';
import { WHAT_WE_DO } from '../../../data/iaContent';
import { resolveImageUrl } from '../../../lib/placeholders';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './WhatWeDo.module.css';

export function WhatWeDo() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>What We Do</span>
          <h2 className={styles.title}>Custom homes, renovations,<br /><em>and more.</em></h2>
        </RevealOnScroll>

        <div className={styles.primaryGrid}>
          {WHAT_WE_DO.primary.map((item, i) => (
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
          {WHAT_WE_DO.secondary.map((item) => (
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
            <h3 className={styles.preconTitle}>Plan Before You Build</h3>
            <p className={styles.preconBody}>Progressive estimates, feasibility, and design alignment — for custom homes and major renovations alike.</p>
          </div>
          <Link to="/preconstruction" className={styles.preconCta}>Explore Preconstruction →</Link>
        </div>
      </div>
    </section>
  );
}
