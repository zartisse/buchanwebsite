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
                <RevealOnScroll>
                  <Link to={`/portfolio/${featured[0].slug}`} className={`${styles.heroCard} imageHover`}>
                    <div className={styles.imgWrap}>
                      <OptimizedImage src={featured[0].image_url} seed={featured[0].slug} alt={featured[0].name} />
                    </div>
                    <div className={styles.meta}>
                      <span className={styles.name}>{featured[0].name}</span>
                      <span className={styles.location}>{locationLabel(featured[0])}</span>
                    </div>
                  </Link>
                </RevealOnScroll>
                <div className={styles.sideStack}>
                  {featured.slice(1).map((item, i) => (
                    <RevealOnScroll key={item.slug} index={i + 1}>
                      <Link to={`/portfolio/${item.slug}`} className={`${styles.sideCard} imageHover`}>
                        <div className={styles.sideImgWrap}>
                          <OptimizedImage src={item.image_url} seed={item.slug} alt={item.name} />
                        </div>
                        <div className={styles.meta}>
                          <span className={styles.name}>{item.name}</span>
                          <span className={styles.location}>{locationLabel(item)}</span>
                        </div>
                      </Link>
                    </RevealOnScroll>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
