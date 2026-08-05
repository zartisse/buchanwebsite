import { Link } from 'react-router-dom';
import { FEATURED_WORK_ITEMS } from '../../../data/iaContent';
import { resolveImageUrl } from '../../../lib/placeholders';
import { RevealOnScroll } from '../../ui/RevealOnScroll';
import styles from './FeaturedWorkGrid.module.css';

export function FeaturedWorkGrid() {
  const featured = FEATURED_WORK_ITEMS.find((item) => item.featured) ?? FEATURED_WORK_ITEMS[0];
  const gridItems = FEATURED_WORK_ITEMS.filter((item) => item !== featured).slice(0, 6);

  return (
    <section id="featured-work" className={styles.section}>
      <div className={styles.inner}>
        <RevealOnScroll>
          <span className={styles.eyebrow}>Featured Work</span>
          <h2 className={styles.title}>Homes we&apos;re proud of.</h2>
        </RevealOnScroll>
        <div className={styles.grid}>
          <RevealOnScroll>
            <Link to={featured.link ?? '/portfolio'} className={`${styles.featuredCard} imageHover`}>
              <div className={styles.featuredImgWrap}>
                <img src={resolveImageUrl(featured.image_url, featured.title)} alt={featured.title} />
                {featured.label && <span className={styles.label}>{featured.label}</span>}
              </div>
              <span className={styles.cardTitle}>{featured.title}</span>
            </Link>
          </RevealOnScroll>
          <div className={styles.smallGrid}>
            {gridItems.map((item, i) => (
              <RevealOnScroll key={item.title + item.image_url} variant="scale" index={i}>
                <Link to={item.link ?? '/portfolio'} className={`${styles.smallCard} imageHover`}>
                  <div className={styles.smallImgWrap}>
                    <img src={resolveImageUrl(item.image_url, item.title)} alt={item.title} />
                    {item.label && <span className={styles.labelSmall}>{item.label}</span>}
                  </div>
                  <span className={styles.smallTitle}>{item.title}</span>
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
