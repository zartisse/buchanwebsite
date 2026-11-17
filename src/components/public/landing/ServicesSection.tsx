import { Link } from 'react-router-dom';
import { OptimizedImage } from '../../ui/OptimizedImage';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import type { HomePageContent } from '../../../types';
import { ArrowIcon, ArrowLink } from './ArrowLink';
import styles from './Landing.module.css';

type ServicesSectionProps = {
  section: HomePageContent['what_we_do'];
};

export function ServicesSection({ section }: ServicesSectionProps) {
  const links = [
    ...section.secondary.map((s) => ({ title: s.title, to: s.link })),
    { title: 'Preconstruction', to: section.preconstruction.cta_link || '/preconstruction' },
  ];

  return (
    <section id="services" className={`${styles.section} ${styles.sectionTint}`}>
      <div className={styles.inner}>
        <div className={styles.servicesHead}>
          <RevealOnScroll>
            <p className={styles.eyebrow}>Services</p>
            <h2 className={styles.h2}>Build new. <em>Renovate well.</em></h2>
          </RevealOnScroll>
          <RevealOnScroll variant="right">
            <ArrowLink to="/services">All services</ArrowLink>
          </RevealOnScroll>
        </div>

        <div className={styles.servicesGrid}>
          {section.primary.slice(0, 2).map((card, i) => (
            <RevealOnScroll key={card.title} index={i} className={i === 0 ? styles.cardWrapA : styles.cardWrapB}>
              <Link to={card.link} className={styles.bigCard}>
                <OptimizedImage
                  src={card.image_url}
                  seed={`service-${i}`}
                  alt={`${card.title} by John Buchan Homes`}
                  displayWidth={1200}
                  sizes="(max-width: 960px) 100vw, 55vw"
                />
                <span className={styles.bigCardInfo}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                  <span className={`${styles.arrowLink} ${styles.arrowLinkLight}`}>
                    <span>{card.cta_label ?? 'Learn more'}</span>
                    <span className={styles.arrowRing}><ArrowIcon /></span>
                  </span>
                </span>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <nav className={styles.compact} aria-label="More services">
            {links.map((l) => (
              <Link key={l.title} to={l.to} className={styles.compactLink}>
                <span>{l.title}</span>
                <span className={styles.compactArrow}><ArrowIcon /></span>
              </Link>
            ))}
          </nav>
        </RevealOnScroll>
      </div>
    </section>
  );
}
