import { Link } from 'react-router-dom';
import { useFeaturedProperties } from '../../../hooks/useProperties';
import { OptimizedImage } from '../../ui/OptimizedImage';
import type { HomePageContent, Property } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './FeaturedWorkGrid.module.css';

function locationLabel(property: Property): string {
  const city = property.city?.trim();
  if (city) return `${city.toUpperCase()}, WASHINGTON`;
  return 'WASHINGTON';
}

type FeaturedWorkGridProps = {
  labels: HomePageContent['featured_work'];
};

function FeaturedCard({
  property,
  variant,
}: {
  property: Property;
  variant: 'hero' | 'side';
}) {
  const cardClass = variant === 'hero' ? styles.heroCard : styles.sideCard;
  const wrapClass = variant === 'hero' ? styles.imgWrap : styles.sideImgWrap;

  return (
    <Link to={`/portfolio/${property.slug}`} className={`${cardClass} imageHover`}>
      <div className={wrapClass}>
        <OptimizedImage src={property.image_url} seed={property.slug} alt={property.name} />
        <div className={styles.hoverMeta}>
          <span className={styles.hoverName}>{property.name}</span>
          <span className={styles.hoverLocation}>{locationLabel(property)}</span>
        </div>
      </div>
    </Link>
  );
}

export function FeaturedWorkGrid({ labels }: FeaturedWorkGridProps) {
  const { properties, loading } = useFeaturedProperties();
  const featured = properties;

  return (
    <section id="featured-work" className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.layout}>
          <RevealOnScroll variant="left">
            <div className={styles.copy}>
              <span className="eyebrowRule">{labels.eyebrow}</span>
              <h2 className={styles.title}>{labels.title}</h2>
              {labels.body && <p className={styles.body}>{labels.body}</p>}
              <Link to={labels.cta_link ?? '/portfolio'} className="linkAccent">
                {labels.cta_label ?? 'View Our Work'} <span>→</span>
              </Link>
            </div>
          </RevealOnScroll>

          <div className={styles.grid}>
            {loading && <p className={styles.loading}>Loading featured work…</p>}
            {!loading && featured.length === 0 && (
              <p className={styles.empty}>Mark properties as featured in the admin to display them here.</p>
            )}
            {!loading && featured.length > 0 && (
              <>
                <RevealOnScroll className={styles.gridReveal}>
                  <FeaturedCard property={featured[0]} variant="hero" />
                </RevealOnScroll>
                <RevealOnScroll className={styles.gridReveal} variant="right" index={1}>
                  <div className={styles.sideStack}>
                    {featured.slice(1).map((item) => (
                      <FeaturedCard key={item.slug} property={item} variant="side" />
                    ))}
                  </div>
                </RevealOnScroll>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
