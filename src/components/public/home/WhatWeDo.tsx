import { Link } from 'react-router-dom';
import type { HomePageContent, ServiceIconName } from '../../../types';
import { resolveImageUrl } from '../../../lib/placeholders';
import { ServiceIcon } from '../../ui/ServiceIcon';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './WhatWeDo.module.css';

type WhatWeDoProps = {
  section: HomePageContent['what_we_do'];
};

function iconFor(item: { icon?: ServiceIconName; title: string }): ServiceIconName {
  if (item.icon) return item.icon;
  const t = item.title.toLowerCase();
  if (t.includes('custom')) return 'custom-home';
  if (t.includes('renov')) return 'renovation';
  if (t.includes('adu')) return 'adu';
  if (t.includes('fire')) return 'fire-restoration';
  if (t.includes('real estate')) return 'real-estate';
  return 'maintenance';
}

export function WhatWeDo({ section }: WhatWeDoProps) {
  const title = section.title_emphasis
    ? <>{section.title} <em>{section.title_emphasis}</em></>
    : section.title;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll variant="down">
          <div className={styles.header}>
            <span className="eyebrowRule eyebrowRuleCenter">{section.eyebrow}</span>
            <h2 className={styles.title}>{title}</h2>
          </div>
        </RevealOnScroll>

        <div className={styles.primaryGrid}>
          {section.primary.map((item, i) => (
            <RevealOnScroll key={item.title} index={i} variant="scale">
              <Link to={item.link} className={`${styles.primaryCard} cardHover`}>
                <div
                  className={styles.cardBg}
                  style={{ backgroundImage: `url(${resolveImageUrl(item.image_url, item.title)})` }}
                  aria-hidden
                />
                <div className={styles.cardContent}>
                  <ServiceIcon name={iconFor(item)} className={styles.icon} size={36} />
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
            <RevealOnScroll key={item.title} index={i + 2} variant={i % 2 === 0 ? 'left' : 'right'}>
              <Link to={item.link} className={`${styles.secondaryCard} cardHover`}>
                <div
                  className={styles.cardBg}
                  style={{ backgroundImage: `url(${resolveImageUrl(item.image_url, item.title)})` }}
                  aria-hidden
                />
                <div className={styles.cardContent}>
                  <ServiceIcon name={iconFor(item)} className={styles.iconSm} size={28} />
                  <h4 className={styles.secondaryTitle}>{item.title}</h4>
                  <p className={styles.secondaryDesc}>{item.description}</p>
                  <span className="linkAccent" style={{ fontSize: '11px' }}>Learn More <span>→</span></span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
