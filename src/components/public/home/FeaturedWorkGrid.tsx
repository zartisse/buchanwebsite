import { Link } from 'react-router-dom';
import { useFeaturedProperties } from '../../../hooks/useProperties';
import { OptimizedImage } from '../../ui/OptimizedImage';
import type { HomePageContent, Property } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import { SectionIndex } from '../../ui/SectionIndex';
import styles from './FeaturedWorkGrid.module.css';

function locationLabel(property: Property): string {
  const city = property.city?.trim();
  return city ? `${city}, Washington` : 'Washington';
}

type FeaturedWorkGridProps = {
  labels: HomePageContent['featured_work'];
  index?: string;
};

function FeaturedCard({
  property,
  variant,
  order,
}: {
  property: Property;
  variant: 'lead' | 'side';
  order: number;
}) {
  return (
    <Link to={`/portfolio/${property.slug}`} className={`${styles.card} ${variant === 'lead' ? styles.cardLead : styles.cardSide} imageHover`}>
      <RevealOnScroll variant="mask" className={styles.frame}>
        <OptimizedImage
          src={property.image_url}
          seed={property.slug}
          alt={property.name}
          displayWidth={variant === 'lead' ? 1400 : 900}
          sizes={variant === 'lead' ? '(max-width: 900px) 100vw, 56vw' : '(max-width: 900px) 100vw, 36vw'}
        />
      </RevealOnScroll>
      <div className={styles.caption}>
        <span className={styles.captionNo}>{String(order).padStart(2, '0')}</span>
        <span className={styles.captionName}>{property.name}</span>
        <span className={styles.captionPlace}>{locationLabel(property)}</span>
      </div>
    </Link>
  );
}

export function FeaturedWorkGrid({ labels, index }: FeaturedWorkGridProps) {
  const { properties, loading } = useFeaturedProperties();
  const featured = properties;

  return (
    <section id="featured-work" className={styles.section}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <RevealOnScroll variant="up" className={styles.headerMain}>
            <SectionIndex index={index} label={labels.eyebrow ?? 'Featured work'} />
            <h2 className={styles.title}>{labels.title}</h2>
          </RevealOnScroll>
          <RevealOnScroll variant="up" index={1} className={styles.headerAside}>
            {labels.body && <p className={styles.body}>{labels.body}</p>}
            <Link to={labels.cta_link ?? '/portfolio'} className="linkAccent">
              {labels.cta_label ?? 'View Our Work'} <span>→</span>
            </Link>
          </RevealOnScroll>
        </header>

        {loading && (
          <div className={styles.grid} aria-hidden>
            <div className={`${styles.skeleton} ${styles.skeletonLead}`} />
            <div className={styles.sideStack}>
              <div className={styles.skeleton} />
              <div className={styles.skeleton} />
            </div>
          </div>
        )}
        {!loading && featured.length === 0 && (
          <p className={styles.empty}>Mark properties as featured in the admin to display them here.</p>
        )}
        {!loading && featured.length > 0 && (
          <div className={styles.grid}>
            <FeaturedCard property={featured[0]} variant="lead" order={1} />
            {featured.length > 1 && (
              <div className={styles.sideStack}>
                {featured.slice(1).map((item, i) => (
                  <FeaturedCard key={item.slug} property={item} variant="side" order={i + 2} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
