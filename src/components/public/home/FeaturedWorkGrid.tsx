import { Link } from 'react-router-dom';
import { useProperties } from '../../../hooks/useProperties';
import { resolveImageUrl } from '../../../lib/placeholders';
import type { HomePageContent, Property } from '../../../types';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './FeaturedWorkGrid.module.css';

function statusLabel(status: Property['status']): string | undefined {
  if (status === 'Available') return 'Available Now';
  if (status === 'Coming Soon') return 'Coming Soon';
  return undefined;
}

type FeaturedWorkGridProps = {
  labels: HomePageContent['featured_work'];
};

export function FeaturedWorkGrid({ labels }: FeaturedWorkGridProps) {
  const { properties, loading } = useProperties({ publicOnly: true });
  const featured = properties
    .filter((p) => p.featured)
    .sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0));

  if (loading) {
    return (
      <section id="featured-work" className={styles.section}>
        <div className={styles.inner}>
          <p>Loading featured work…</p>
        </div>
      </section>
    );
  }

  if (featured.length === 0) {
    return (
      <section id="featured-work" className={styles.section}>
        <div className={styles.inner}>
          <RevealOnScroll>
            <span className={styles.eyebrow}>{labels.eyebrow}</span>
            <h2 className={styles.title}>{labels.title}</h2>
          </RevealOnScroll>
          <p style={{ marginTop: 24, color: 'var(--color-text-muted-light)' }}>
            Mark properties as featured in the admin to display them here.
          </p>
          <Link to="/portfolio" className={styles.ctaLink}>
            Explore Our Portfolio <span>→</span>
          </Link>
        </div>
      </section>
    );
  }

  const hero = featured[0];
  const gridItems = featured.slice(1, 7);

  return (
    <section id="featured-work" className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>{labels.eyebrow}</span>
          <h2 className={styles.title}>{labels.title}</h2>
        </RevealOnScroll>
        <div className={styles.grid}>
          <RevealOnScroll>
            <Link to={`/portfolio/${hero.slug}`} className={`${styles.featuredCard} imageHover`}>
              <div className={styles.featuredImgWrap}>
                <img src={resolveImageUrl(hero.image_url, hero.slug)} alt={hero.name} />
                {statusLabel(hero.status) && <span className={styles.label}>{statusLabel(hero.status)}</span>}
              </div>
              <span className={styles.cardTitle}>{hero.name}</span>
            </Link>
          </RevealOnScroll>
          <div className={styles.smallGrid}>
            {gridItems.map((item, i) => (
              <RevealOnScroll key={item.id} variant="scale" index={i}>
                <Link to={`/portfolio/${item.slug}`} className={`${styles.smallCard} imageHover`}>
                  <div className={styles.smallImgWrap}>
                    <img src={resolveImageUrl(item.image_url, item.slug)} alt={item.name} />
                    {statusLabel(item.status) && <span className={styles.labelSmall}>{statusLabel(item.status)}</span>}
                  </div>
                  <span className={styles.smallTitle}>{item.name}</span>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>
        <Link to="/portfolio" className={styles.ctaLink}>
          Explore Our Portfolio <span>→</span>
        </Link>
      </div>
    </section>
  );
}
